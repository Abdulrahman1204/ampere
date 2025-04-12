import { NextResponse, NextRequest } from "next/server";
import { User, validateCreateUser } from "@/models/Users/User";
import connectDB from "@/libs/mongodb";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { verifyToken } from "@/utils/verifyToken";
import { Settings } from "@/models/Settings/Settings";
import { IUser, UserFilter } from "@/models/Users/dto";

/**
 * @method POST
 * @route ~/api/users/customers
 * @desc Create New User
 * @access only admin and superAdmin
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userToken = verifyToken(request);

    if (userToken === null) {
      return NextResponse.json(
        { message: "only superAdmin, access denied" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as IUser;

    const { error } = validateCreateUser(body);
    if (error) {
      return NextResponse.json({ message: error.details[0].message });
    }

    const user = await User.findOne({ userName: body.userName });
    if (user) {
      return NextResponse.json(
        { message: "الاسم موجود بالفعل" },
        { status: 400 }
      );
    }

    const settings = await Settings.findOne({});
    const priceOfAmpere = settings?.priceOfAmpere || 10;

    const totalPrice = priceOfAmpere * body.numberOfAmpere;

    // تحديد تاريخ البدء (startDate) كتاريخ اليوم
    const startDate = new Date();

    await User.create({
      userName: body.userName,
      phoneNumber: body.phoneNumber,
      numberOfAmpere: body.numberOfAmpere,
      numberOfPlate: body.numberOfPlate,
      totalPrice: totalPrice,
      note: body.note,
      startDate: startDate, // إضافة startDate
    });

    return NextResponse.json(
      { message: "Created Successfully" },
      { status: 201 }
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
 * @route ~/api/users/customers
 * @desc Get All Users
 * @access only admin and superAdmin
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userToken = verifyToken(request);

    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";
    const numberOfPlate = request.nextUrl.searchParams.get("numberOfPlate");
    const userName = request.nextUrl.searchParams.get("userName");

    if (userToken === null) {
      return NextResponse.json(
        { message: "only superAdmin, access denied" },
        { status: 403 }
      );
    }

    const filter: UserFilter = {};

    if (userName) {
      filter.userName = { $regex: new RegExp(String(userName), "i") }; // Case-insensitive regex
    }

    if (numberOfPlate) {
      filter.numberOfPlate = Number(numberOfPlate);
    }

    const totalUsers = await User.countDocuments(filter);

    const totalAmperesResult = await User.aggregate([
      { $match: filter },
      { $group: { _id: null, totalAmperes: { $sum: "$numberOfAmpere" } } }
    ]);
    
    const totalAmperes = totalAmperesResult[0]?.totalAmperes || 0;
    const users = await User.find(filter)
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { users, totalUsers, totalAmperes },
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
