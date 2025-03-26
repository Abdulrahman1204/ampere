import { request } from "@/utils/constants";
import { IBill } from "@/models/Bills/dto";

export async function addBill(billData: {
  category: string;
  userName: string;
  phoneNumber: string;
  price: number;
  note: string;
}): Promise<IBill> {
  try {
    const response = await request.post("/bills", billData);

    return response.data;
  } catch (error) {
    console.error("Error adding customer:", error);
    throw new Error("Internal server error");
  }
}
