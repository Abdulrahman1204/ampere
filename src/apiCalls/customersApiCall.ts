import { IUser } from "@/models/Users/dto";
import { request } from "@/utils/constants";

export async function getCustomers(
  userName?: string,
  phoneNumber?: string
): Promise<IUser[]> {
  try {
    const response = await request.get(
      "/users/customers",
      {
        params: {
          userName,
          phoneNumber,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch customers");
    }
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Internal server error");
  }
}

export async function addCustomer(customerData: {
  userName: string;
  phoneNumber: string;
  numberOfAmpere: number;
  numberOfPlate: number;
  paid: boolean;
  note: string;
}): Promise<IUser> {
  try {
    const response = await request.post(
      "/users/customers",
      customerData
    );

      return response.data;

  } catch (error) {
    console.error("Error adding customer:", error);
    throw new Error("Internal server error");
  }
}