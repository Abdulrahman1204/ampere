import { request } from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface FetchBillsParams {
  category?: string;
  from?: string;
  to?: string;
  available?: boolean;
  pageNumber?: string;
}

interface AddBillsParams {
  category: string;
  userName: string;
  phoneNumber: string;
  price: number;
  note: string;
}

// Fetch Bills
export const fetchBills = createAsyncThunk(
  "bills/fetchBills",
  async (
    { category, to, from, pageNumber }: FetchBillsParams,
    { rejectWithValue }
  ) => {
    try {
      const response = await request.get("/bills", {
        params: { category, to, from, pageNumber },
      });

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to edit customer"
      );
    }
  }
);

// Fetch Bills
export const addBills = createAsyncThunk(
  "bills/addBills",
  async (formData: AddBillsParams, { rejectWithValue }) => {
    try {
      const response = await request.post("/bills", formData);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to add bill"
      );
    }
  }
);
