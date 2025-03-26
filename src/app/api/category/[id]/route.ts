import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/libs/mongodb";
import { verifyToken } from "@/utils/verifyToken";
import { Category, validateUpdateCategory } from "@/models/Categores/Category";
import { ICategory } from "@/models/Categores/dto";

/**
 * @method DELETE
 * @route ~/api/category/:id
 * @desc Delete Category
 * @access from superAdmin just
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

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    await Category.findByIdAndDelete(id);

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
 * @route ~/api/category/:id
 * @desc Update Category
 * @access from superAdmin just
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

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as ICategory;

    const { error } = validateUpdateCategory(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    await Category.findByIdAndUpdate(id, {
      $set: {
        title: body.title,
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
