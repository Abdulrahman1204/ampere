import { NextResponse, NextRequest } from "next/server";
import { User, validateUpdateUser } from "@/models/Users/User";
import connectDB from "@/libs/mongodb";
import { verifyToken } from "@/utils/verifyToken";
import { Settings } from "@/models/Settings/Settings";
import { IUser } from "@/models/Users/dto";
import { Bill } from "@/models/Bills/Bills";
import { Profits } from "@/models/Profits/Profits";

/**
 * @method DELETE
 * @route ~/api/users/customers/:id
 * @desc Delete User
 * @access only admin and superAdmin
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const userToken = verifyToken(request);

    if (!userToken) {
      return NextResponse.json(
        { message: "only superAdmin, access denied" },
        { status: 403 }
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error); // Use console.error for better debugging visibility
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route ~/api/users/customers/:id
 * @desc Update User
 * @access only admin and superAdmin
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const userToken = verifyToken(request);

    if (!userToken) {
      return NextResponse.json(
        { message: "only superAdmin, access denied" },
        { status: 403 }
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = (await request.json()) as IUser;

    const { error } = validateUpdateUser(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    let totalPriceOfAmpere;
    if (body.numberOfAmpere) {
      const settings = await Settings.findOne({});
      const priceOfAmpere = settings?.priceOfAmpere || 10;

      totalPriceOfAmpere = priceOfAmpere * body.numberOfAmpere;
    }

    await User.findByIdAndUpdate(id, {
      $set: {
        userName: body.userName,
        phoneNumber: body.phoneNumber,
        numberOfAmpere: body.numberOfAmpere,
        numberOfPlate: body.numberOfPlate,
        available: body.available,
        note: body.note,
        totalPrice: totalPriceOfAmpere || body.totalPrice,
      },
    });

    return NextResponse.json(
      { message: "Updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method POST
 * @route ~/api/users/customers/:id
 * @desc For User`s Paid
 * @access only admin and superAdmin
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const userToken = verifyToken(request);

    if (userToken === null) {
      return NextResponse.json(
        { message: "only superAdmin, access denied" },
        { status: 403 }
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // تحديث حالة الأسبوع
    const weeks = user.weeks;
    const firstUnpaidWeekIndex = weeks.findIndex((week) => !week); // البحث عن أول أسبوع غير مدفوع

    if (firstUnpaidWeekIndex !== -1) {
      weeks[firstUnpaidWeekIndex] = true; // تحويل الأسبوع إلى مدفوع

      // إذا كانت جميع الأسابيع مدفوعة (true)، نقوم بتحويلها جميعًا إلى false وتحديث startDate إلى الشهر الجديد
      if (weeks.every((week) => week)) {
        weeks.fill(false); // إعادة تعيين جميع الأسابيع إلى false

        // تحديث startDate إلى أول سبت من الشهر الجديد
        const newStartDate = new Date(user.startDate || new Date()); // إذا لم يكن هناك startDate، نستخدم التاريخ الحالي
        newStartDate.setMonth(newStartDate.getMonth() + 1); // الانتقال إلى الشهر الجديد
        newStartDate.setDate(newStartDate.getDate() + (6 - newStartDate.getDay())); // الانتقال إلى أول سبت من الشهر الجديد

        await User.findByIdAndUpdate(id, { weeks, startDate: newStartDate });
      } else {
        await User.findByIdAndUpdate(id, { weeks });
      }
    }

    // إنشاء فاتورة
    await Bill.create({
      category: "مقبوضات",
      price: user.totalPrice,
      userName: user.userName,
      phoneNumber: user.phoneNumber,
    });

    // تحديث الأرباح
    const profitsData = await Profits.findOne({});
    const newProfits = (profitsData?.profits || 0) + user.totalPrice;
    await Profits.findOneAndUpdate(
      {},
      { profits: newProfits },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { message: "Paid successfully, payment time extended by 1 minute" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error); // يجب طباعة الخطأ قبل الـ return
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}