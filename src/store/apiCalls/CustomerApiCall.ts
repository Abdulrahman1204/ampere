import { request } from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface FetchCustomersParams {
  pageNumber?: string;
  userName?: string;
  numberOfPlate?: string;
}

interface AddCustomerParams {
  userName: string;
  phoneNumber: string;
  numberOfAmpere: number;
  numberOfPlate: number;
  note: string;
}

interface EditCustomerParams {
  id: string;
  userName?: string;
  phoneNumber?: string;
  numberOfAmpere?: number;
  numberOfPlate?: number;
  totalPrice?: number;
  available?: boolean;
  note?: string;
}

interface DeleteCustomerParams {
  id: string;
}

// Fetch Customers
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async ({ pageNumber, numberOfPlate, userName }: FetchCustomersParams, { rejectWithValue }) => {
    try {
      const response = await request.get("/users/customers", {
        params: { pageNumber, numberOfPlate, userName },
      });

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch admins");
    }
  }
);

// Add Customer
export const addCustomer = createAsyncThunk(
  "customer/addCustomers",
  async (formData: AddCustomerParams, { rejectWithValue }) => {
    try {
      const response = await request.post("/users/customers", formData);

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const serverMessage = axiosError.response?.data?.message;
      
      // إرجاع رسالة الخطأ كما هي (ستتم ترجمتها في الواجهة)
      return rejectWithValue(serverMessage || "فشل في إضافة الزبون");
    }
  }
);

// Delete Customer
export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomers",
  async ({ id }: DeleteCustomerParams, { rejectWithValue }) => {
    try {
      await request.delete(`/users/customers/${id}`);
      return id;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to fetch admins"
      );
    }
  }
);

// Edit Customer
export const editCustomer = createAsyncThunk(
  "customer/editCustomer",
  async ({ id, ...formData }: EditCustomerParams, { rejectWithValue }) => {
    try {
      const response = await request.put(`/users/customers/${id}`, formData);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to edit customer"
      );
    }
  }
);

// Customer`s paid
export const paidCustomer = createAsyncThunk(
  "customer/paidCustomer",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await request.post(`/users/customers/${id}`);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to edit customer"
      );
    }
  }
);


