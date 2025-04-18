import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/libs/mongodb";
import { Bill, validateUpdateBill } from "@/models/Bills/Bills";
import { IBill } from "@/models/Bills/dto";

/**
 * @method DELETE
 * @route ~/api/bills/:id
 * @desc Delete Bill
 * @access from superAdmin just
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const bill = await Bill.findById(id);
    if (!bill) {
      return NextResponse.json({ message: "Bill not found" }, { status: 404 });
    }

    await Bill.findByIdAndDelete(id);

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
 * @route ~/api/bills/:id
 * @desc Update Bill
 * @access from superAdmin just
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const bill = await Bill.findById(id);
    if (!bill) {
      return NextResponse.json({ message: "Bill not found" }, { status: 404 });
    }

    const body = (await request.json()) as IBill;

    const { error } = validateUpdateBill(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    await Bill.findByIdAndUpdate(id, {
      $set: {
        category: body.category,
        price: body.price,
        note: body.note,
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
