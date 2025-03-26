import { NextResponse, NextRequest } from "next/server";
import { Admin, validateUpdateAdmin } from "@/models/Users/Admin";
import connectDB from "@/libs/mongodb";
import { verifyToken } from "@/utils/verifyToken";
import { CreateAdminInput } from "@/models/Users/dto";

/**
 * @method DELETE
 * @route ~/api/users/create/:id
 * @desc Delete Admin
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

    if (!userToken || userToken.role !== "superAdmin") {
      return NextResponse.json(
        { message: "only superAdmin, access denied" },
        { status: 403 }
      );
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    await Admin.findByIdAndDelete(id);

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
 * @route ~/api/users/create/:id
 * @desc Update Admin
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

    if (!userToken || userToken.role !== "superAdmin") {
      return NextResponse.json(
        { message: "only superAdmin, access denied" },
        { status: 403 }
      );
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    const body = (await request.json()) as CreateAdminInput;

    const { error } = validateUpdateAdmin(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    await Admin.findByIdAndUpdate(id, {
      $set: {
        userName: body.userName,
        phoneNumber: body.phoneNumber,
      },
    });

    return NextResponse.json(
      { message: "Updated successfully" },
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
