import { request } from "@/utils/constants";

export async function logOut() {
  try {
    await request.get("/users/logout");
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Internal server error");
  }
}
