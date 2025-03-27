import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/libs/mongodb";
import { verifyToken } from "@/utils/verifyToken";
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

    const userToken = verifyToken(request);

    if (userToken === null || userToken.role !== "superAdmin") {
      return NextResponse.json(
        { message: "only superAdmin, access denied" },
        { status: 403 }
      );
    }

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
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userToken = verifyToken(request);

    if (userToken === null || userToken.role !== "superAdmin") {
      return NextResponse.json(
        { message: "only superAdmin, access denied" },
        { status: 403 }
      );
    }

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

    const userToken = verifyToken(request);

    if (userToken === null || userToken.role !== "superAdmin") {
      return NextResponse.json(
        { message: "only superAdmin, access denied" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as IProfits;
    const { profits } = body;

    const { error } = validateUpdateProfits(body);
    if (error) {
      return NextResponse.json({ message: error.details[0].message });
    }

    const oldProfits = await Profits.findOne();
    const previousProfitAmount = oldProfits?.profits || 0;
    await Profits.findOneAndUpdate(
      {},
      {
        profits,
        $push: { updates: { amount: previousProfitAmount } }, // إضافة التحديث الجديد للمصفوفة
      },
      { upsert: true, new: true }
    );

    await Bill.updateMany({ available: true }, { $set: { available: false } });

    return NextResponse.json(
      { message: "Profits updated successfully" },
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
