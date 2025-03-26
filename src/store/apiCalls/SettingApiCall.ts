import { request } from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface EditSettingsParams {
  priceOfAmpere?: number;
}

// Fetch Settings
export const fetchSettings = createAsyncThunk(
  "settings/fetehSettings",
  async () => {
    try {
      const response = await request.get("/settings");
      return response.data;
    } catch (err) {
      console.error("Error fetching settings:", err);
      throw new Error("Internal server error");
    }
  }
);

// Edit Setting
export const editSetting = createAsyncThunk(
  "settings/editSettings",
  async ({ ...formData }: EditSettingsParams, { rejectWithValue }) => {
    try {
      const response = await request.put(`/settings`, formData);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to edit customer"
      );
    }
  }
);
