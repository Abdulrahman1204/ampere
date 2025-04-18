import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/libs/mongodb";
import { IProfits } from "@/models/Profits/dto";
import {
  Profits,
  validateCreateProfits,
  validateUpdateProfits,
} from "@/models/Profits/Profits";
import { Bill } from "@/models/Bills/Bills";

/**
 * @method POST
 * @route ~/api/profits
 * @desc Create New profit
 * @access from superAdmin just
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = (await request.json()) as IProfits;
    const { profits } = body;

    const { error } = validateCreateProfits(body);
    if (error) {
      return NextResponse.json({ message: error.details[0].message });
    }

    let profitsModel = await Profits.findOne({});

    if (!profitsModel) {
      profitsModel = await Profits.create({ profits });

      return NextResponse.json(
        { message: "Created Successfully" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "profits already added" },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );

    console.log(error);
  }
}

/**
 * @method GET
 * @route ~/api/profits
 * @desc Get profit
 * @access from superAdmin just
 */
export async function GET() {
  try {
    await connectDB();

    const profitsModel = await Profits.findOne({}).sort({ createdAt: -1 });
    if (!profitsModel) {
      return NextResponse.json(
        { message: "Profits not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profitsModel, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );

    console.log(error);
  }
}

/**
 * @method PUT
 * @route ~/api/profits
 * @desc Update profit
 * @access from superAdmin just
 */
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // تحقق من صحة البيانات المرسلة
    const body = (await request.json()) as IProfits;
    const { error } = validateUpdateProfits(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    // حساب الأرباح الحقيقية من الفواتير المتاحة
    const [diesel, repair, expenses, receipts] = await Promise.all([
      Bill.find({ category: "مازوت", available: true }),
      Bill.find({ category: "تصليح", available: true }),
      Bill.find({ category: "مصاريف", available: true }),
      Bill.find({ category: "مقبوضات", available: true }),
    ]);

    const totals = {
      diesel: diesel.reduce((sum, item) => sum + item.price, 0),
      repair: repair.reduce((sum, item) => sum + item.price, 0),
      expenses: expenses.reduce((sum, item) => sum + item.price, 0),
      receipts: receipts.reduce((sum, item) => sum + item.price, 0),
    };

    const actualProfit =
      totals.receipts - (totals.expenses + totals.diesel + totals.repair);

    // تحديث أو إنشاء سجل الأرباح
    const updatedProfits = await Profits.findOneAndUpdate(
      {},
      {
        profits: body.profits,
        $push: {
          updates: {
            amount: actualProfit,
            date: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );
    
    // حذف جميع بيانات الفواتير
    await Bill.deleteMany({});

    return NextResponse.json(
      {
        message: "Profits updated successfully",
        updatedProfits
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );

    console.log(error);
  }
}
