import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/libs/mongodb";
import { verifyToken } from "@/utils/verifyToken";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { Bill, validateCreateBill } from "@/models/Bills/Bills";
import { IBill, BillFilter, ProductsFilter } from "@/models/Bills/dto";
import { Profits } from "@/models/Profits/Profits";

/**
 * @method POST
 * @route ~/api/bills
 * @desc Create New Bill
 * @access from superAdmin and admin
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

    const body = (await request.json()) as IBill;

    const { error } = validateCreateBill(body);
    if (error) {
      return NextResponse.json({ message: error.details[0].message });
    }

    const profitsData = await Profits.findOne({});

    const newProfits = (profitsData?.profits || 0) - body.price;

    await Profits.findOneAndUpdate(
      {},
      { profits: newProfits },
      { upsert: true, new: true }
    );

    await Bill.create({
      category: body.category,
      userName: body.userName,
      phoneNumber: body.phoneNumber,
      price: body.price,
      note: body.note,
    });

    return NextResponse.json(
      { message: "Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @route ~/api/bills
 * @desc Get All Bill
 * @access from superAdmin
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userToken = verifyToken(request);

    if (userToken === null || userToken.role !== "superAdmin") {
      return NextResponse.json(
        { message: "Only superAdmin can access this route" },
        { status: 403 }
      );
    }

    const category = request.nextUrl.searchParams.get("category");
    const fromDate = request.nextUrl.searchParams.get("from");
    const toDate = request.nextUrl.searchParams.get("to");
    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";

    const filter: BillFilter = {  };
    const dieselFilter: ProductsFilter = {
      category: "مازوت",
      available: true,
    };
    const repairFilter: ProductsFilter = {
      category: "تصليح",
      available: true,
    };
    const expensesFilter: ProductsFilter = {
      category: "مصاريف",
      available: true,
    };

    if (category) {
      filter.category = { $regex: new RegExp(String(category), "i") };
    }

    if (fromDate && toDate) {
      filter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
      dieselFilter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
      repairFilter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
      expensesFilter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    const totalBills = await Bill.countDocuments(filter);

    // Get only available bills for each category
    const diesel = await Bill.find(dieselFilter);
    const repair = await Bill.find(repairFilter);
    const expenses = await Bill.find(expensesFilter);

    // Calculate totals
    const totalDiesel = diesel.reduce((sum, item) => sum + item.price, 0);
    const totalRepair = repair.reduce((sum, item) => sum + item.price, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.price, 0);

    const bills = await Bill.find(filter)
      .skip(ARTICLE_PER_PAGE * (parseInt(pageNumber) - 1))
      .limit(ARTICLE_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate("category", "title -_id");

    return NextResponse.json(
      { bills, totalBills, totalDiesel, totalRepair, totalExpenses },
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
