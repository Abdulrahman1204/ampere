import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCustomers,
  addCustomer,
  deleteCustomer,
  editCustomer,
} from "../apiCalls/CustomerApiCall";
import { IUser } from "@/models/Users/dto";

interface CustomerState {
  users: IUser[];
  totalUsers: number;
  totalAmperes: number;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  users: [],
  totalUsers: 0,
  totalAmperes: 0,
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Customers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.totalAmperes = action.payload.totalAmperes;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add Customer
    builder.addCase(addCustomer.fulfilled, (state, action) => {
      state.users.push(action.payload); // Add the new customer to the list
      state.totalUsers += 1; // Increment the total user count
    });

    // Delete Customer
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload); // Remove the deleted customer
      state.totalUsers -= 1;
    });

    // Edit Customer
    builder.addCase(editCustomer.fulfilled, (state, action) => {
      const updatedCustomer = action.payload;
      state.users = state.users.map((user) =>
        user._id === updatedCustomer._id ? updatedCustomer : user
      );
    });
  },
});

export default customerSlice.reducer;
