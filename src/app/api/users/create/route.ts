import { NextResponse, NextRequest } from "next/server";
import { Admin, validateCreateAdmin } from "@/models/Users/Admin";
import { CreateAdminInput, UserFilter } from "@/models/Users/dto";
import connectDB from "@/libs/mongodb";
import { ARTICLE_PER_PAGE } from "@/utils/constants";

/**
 * @method POST
 * @route ~/api/users/create
 * @desc Create New Admin
 * @access from superAdmin just
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = (await request.json()) as CreateAdminInput;
    const { error } = validateCreateAdmin(body);
    if (error) {
      return NextResponse.json({ message: error.details[0].message });
    }

    const user = await Admin.findOne({ phoneNumber: body.phoneNumber });
    if (user) {
      return NextResponse.json(
        { message: "Phone Number Already Exists" },
        { status: 400 }
      );
    }

    await Admin.create({
      userName: body.userName,
      phoneNumber: body.phoneNumber,
      password: body.password,
      role: body.role,
    });

    return NextResponse.json(
      { message: "Created Successfully" },
      { status: 201 }
    );
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
 * @route ~/api/users/create
 * @desc Get All Admins
 * @access from superAdmin just
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";
    const phoneNumber = request.nextUrl.searchParams.get("phoneNumber");
    const userName = request.nextUrl.searchParams.get("userName");

    const filter: UserFilter = {role: "admin"};

    if (userName) {
      filter.userName = { $regex: new RegExp(String(userName), "i") }; // Case-insensitive regex
    }

    if (phoneNumber) {
      filter.phoneNumber = phoneNumber;
    }

    const totalAdmins = await Admin.countDocuments(filter);

    const admins = await Admin.find(filter)
      .skip(ARTICLE_PER_PAGE * (parseInt(pageNumber) - 1))
      .limit(ARTICLE_PER_PAGE)
      .sort({ createdAt: -1 });

    return NextResponse.json({admins, totalAdmins}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );

    console.log(error);
  }
}
