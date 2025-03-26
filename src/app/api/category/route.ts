import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/libs/mongodb";
import { verifyToken } from "@/utils/verifyToken";
import { Category, validateCreateCategory } from "@/models/Categores/Category";
import { ICategory } from "@/models/Categores/dto";
import { ARTICLE_PER_PAGE } from "@/utils/constants";

/**
 * @method POST
 * @route ~/api/category
 * @desc Create New Category
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

    const body = (await request.json()) as ICategory;
    const { title } = body;

    const { error } = validateCreateCategory(body);
    if (error) {
      return NextResponse.json({ message: error.details[0].message });
    }

    const category = await Category.findOne({ title: title });
    if (category) {
      return NextResponse.json(
        { message: "Category Already Exists" },
        { status: 400 }
      );
    }

    await Category.create({
      title: title,
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
 * @route ~/api/category
 * @desc Get AllCategory
 * @access from superAdmin just
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userToken = verifyToken(request);

    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";

    if (userToken === null || userToken.role !== "superAdmin") {
      return NextResponse.json(
        { message: "only superAdmin, access denied" },
        { status: 403 }
      );
    }

    const categores = await Category.find()
      .skip(ARTICLE_PER_PAGE * (parseInt(pageNumber) - 1))
      .limit(ARTICLE_PER_PAGE)
      .sort({ createdAt: -1 });

    return NextResponse.json(categores, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );

    console.log(error);
  }
}
