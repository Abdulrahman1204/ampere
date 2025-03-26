import { request } from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface EditProfitsParams {
  profits?: number;
}

// Fetch Profits
export const fetchProfits = createAsyncThunk(
  "profits/fetehProfits",
  async () => {
    try {
      const response = await request.get("/profits");
      return response.data;
    } catch (err) {
      console.error("Error fetching profits:", err);
      throw new Error("Internal server error");
    }
  }
);

// Edit Profits
export const editProfits = createAsyncThunk(
  "profits/editProfits",
  async ({ ...formData }: EditProfitsParams, { rejectWithValue }) => {
    try {
      const response = await request.put("/profits", formData);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to edit customer"
      );
    }
  }
);
