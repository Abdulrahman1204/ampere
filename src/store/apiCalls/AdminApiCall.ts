import { request } from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface FetchAdminsParams {
  pageNumber?: string;
  userName?: string;
  phoneNumber?: string;
}

interface AddAdminParams {
  userName: string;
  phoneNumber: string;
  password: string;
  role: string;
}

interface EditAdminParams {
  id: string;
  userName?: string;
  phoneNumber?: string;
}

interface DeleteAdminParams {
  id: string;
}

// Fetch Admins
export const fetchAdmins = createAsyncThunk(
  "admins/fetchAdmins",
  async (
    { pageNumber, phoneNumber, userName }: FetchAdminsParams,
    { rejectWithValue }
  ) => {
    try {
      const response = await request.get("/users/create", {
        params: { pageNumber, phoneNumber, userName },
      });

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to fetch admins"
      );
    }
  }
);

// Add Admin
export const addAdmins = createAsyncThunk(
  "admins/addAdmins",
  async (formData: AddAdminParams, { rejectWithValue }) => {
    try {
      const response = await request.post("/users/create", formData);

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to add admin"
      );
    }
  }
);

// Delete Admin
export const deleteAdmin = createAsyncThunk(
  "admins/deleteAdmin",
  async ({ id }: DeleteAdminParams, { rejectWithValue }) => {
    try {
      await request.delete(`/users/create/${id}`);
      return id;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to delete admin"
      );
    }
  }
);

// Edit Admin
export const editAdmin= createAsyncThunk(
  "admins/editAdmin",
  async ({ id, ...formData }: EditAdminParams, { rejectWithValue }) => {
    try {
      const response = await request.put(`/users/create/${id}`, formData);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to edit customer"
      );
    }
  }
);
