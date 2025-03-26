import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { Admin, validateLoginAdmin } from "@/models/Users/Admin";
import { LoginAdminInput } from "@/models/Users/dto";
import { setCookie } from "@/utils/generateToken";
import connectDB from "@/libs/mongodb";

/**
 * @method POST
 * @route ~/api/users/login
 * @desc Login User
 * @access public
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = (await request.json()) as LoginAdminInput;

    const { error } = validateLoginAdmin(body);
    if (error) {
      return NextResponse.json({ message: error.details[0].message });
    }

    const user = await Admin.findOne({ phoneNumber: body.phoneNumber });
    if (!user) {
      return NextResponse.json(
        { message: "invalid email or password" },
        { status: 400 }
      );
    }

    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "invalid email or password" },
        { status: 400 }
      );
    }

    const cookie = setCookie({
      id: user.id,
      role: user.role,
      userName: user.userName,
    });

    return NextResponse.json(
      { message: "Authenticated" },
      {
        status: 200,
        headers: { "Set-Cookie": cookie },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );

    console.log(error);
  }
}
