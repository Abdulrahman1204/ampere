import { NextResponse, NextRequest } from "next/server";
import { User, validateUpdateUser } from "@/models/Users/User";
import connectDB from "@/libs/mongodb";
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

    const shouldUpdateStartDate =
      user.available === false && body.available === true;

    const profitsData = await Profits.findOne({});
    let newProfits;
    if (body.totalPrice) {
      let newPriceProfite;
      if (user.totalPrice > body.totalPrice) {
        newPriceProfite = user.totalPrice - body.totalPrice;
        newProfits = (profitsData?.profits || 0) - newPriceProfite;
      } else {
        newPriceProfite = body.totalPrice - user.totalPrice;
        newProfits = (profitsData?.profits || 0) + newPriceProfite;
      }

      await Profits.findOneAndUpdate(
        {},
        { profits: newProfits },
        { upsert: true, new: true }
      );
    }
    const updateData: Partial<IUser> = {
      userName: body.userName,
      phoneNumber: body.phoneNumber,
      numberOfAmpere: body.numberOfAmpere,
      numberOfPlate: body.numberOfPlate,
      available: body.available,
      note: body.note,
      totalPrice: totalPriceOfAmpere || body.totalPrice,
    };

    // Update startDate only when changing from false to true
    if (shouldUpdateStartDate) {
      updateData.startDate = new Date();
    }

    await User.findByIdAndUpdate(id, {
      $set: updateData,
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


    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const weeks = user.weeks;
    const firstUnpaidWeekIndex = weeks.findIndex((week) => !week); // البحث عن أول أسبوع غير مدفوع

    if (firstUnpaidWeekIndex !== -1) {
      weeks[firstUnpaidWeekIndex] = true;
    
      if (weeks.every((week) => week)) {
        weeks.fill(false);
        
        // احصل على آخر تاريخ من weeksDate أو استخدم التاريخ الحالي إذا لم يكن موجوداً
        const lastWeekDate = user.weeksDate?.length > 0 
          ? new Date(user.weeksDate[user.weeksDate.length - 1])
          : new Date(user.startDate || new Date());
        
        // أضف أسبوعاً واحداً
        lastWeekDate.setDate(lastWeekDate.getDate() + 7);
        
        // حدّث startDate
        user.startDate = lastWeekDate;
        
        // سيتم تحديث weeksDate تلقائياً عبر الـ middleware عند حفظ user
        await user.save();
      } else {
        user.weeks = weeks;
        await user.save();
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

/**
 * @method GET
 * @route ~/api/users/customers/:id
 * @desc For Back User`s Paid
 * @access only admin and superAdmin
 */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;


    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // العثور على آخر فاتورة مدفوعة لهذا المستخدم
    const lastBill = await Bill.findOne({
      userName: user.userName,
      phoneNumber: user.phoneNumber,
      price: user.totalPrice,
      available: true,
    }).sort({ createdAt: -1 });

    if (!lastBill) {
      return NextResponse.json(
        { message: "No recent payment found to undo" },
        { status: 404 }
      );
    }

    // تحديث حالة الفاتورة إلى غير مدفوعة
    await Bill.findByIdAndUpdate(lastBill._id, { available: false });

    // خصم المبلغ من الأرباح
    const profitsData = await Profits.findOne({});
    const newProfits = (profitsData?.profits || 0) - user.totalPrice;
    await Profits.findOneAndUpdate(
      {},
      { profits: newProfits },
      { upsert: true, new: true }
    );

    // تحديث أسابيع المستخدم
    const weeks = user.weeks;
    const lastPaidWeekIndex = weeks.findLastIndex((week) => week); // البحث عن آخر أسبوع مدفوع

    if (lastPaidWeekIndex !== -1) {
      weeks[lastPaidWeekIndex] = false;
      await User.findByIdAndUpdate(id, { weeks });
    }

    return NextResponse.json(
      { message: "Payment successfully undone" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
