import { NextResponse, NextRequest } from "next/server";
import {
  Settings,
  validateCreateSettings,
  validateUpdateSettings,
} from "@/models/Settings/Settings";
import connectDB from "@/libs/mongodb";
import { ISetting } from "@/models/Settings/dto";
import { User } from "@/models/Users/User";

/**
 * @method POST
 * @route ~/api/settings
 * @desc Create New Setting
 * @access from superAdmin just
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = (await request.json()) as ISetting;
    const { priceOfAmpere } = body;

    const { error } = validateCreateSettings(body);
    if (error) {
      return NextResponse.json({ message: error.details[0].message });
    }

    let settings = await Settings.findOne({});

    if (!settings) {
      settings = await Settings.create({ priceOfAmpere });

      return NextResponse.json(
        { message: "Created Successfully" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Price of ampere already added" },
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
 * @route ~/api/settings
 * @desc Get Settings
 * @access from superAdmin just
 */
export async function GET() {
  try {
    await connectDB();

    const settings = await Settings.findOne();

    if (!settings) {
      return NextResponse.json(
        { message: "Settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(settings, { status: 200 });
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
 * @route ~/api/settings
 * @desc Update Setting
 * @access from superAdmin just
 */
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = (await request.json()) as ISetting;
    const { priceOfAmpere } = body;

    const { error } = validateUpdateSettings(body);
    if (error) {
      return NextResponse.json({ message: error.details[0].message });
    }

    await Settings.findOneAndUpdate(
      {},
      { priceOfAmpere },
      { upsert: true, new: true }
    );

    const users = await User.find({});
    for (const user of users) {
      const totalPriceBeforeDiscount = priceOfAmpere * user.numberOfAmpere;

      await User.findByIdAndUpdate(user._id, {
        totalPrice: totalPriceBeforeDiscount,
      });
    }

    return NextResponse.json(
      { message: "Price updated and user totals recalculated successfully" },
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
