import { createSlice } from "@reduxjs/toolkit";
import { IAdmin } from "@/models/Users/dto";
import { addAdmins, deleteAdmin, editAdmin, fetchAdmins } from "../apiCalls/AdminApiCall";

interface AdminState {
  admins: IAdmin[];
  totalAdmins: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  admins: [],
  totalAdmins: 0,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Admins
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload.admins;
        state.totalAdmins = action.payload.totalAdmins;
        console.log(action.payload);
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add Admin
    builder.addCase(addAdmins.fulfilled, (state, action) => {
      state.admins.push(action.payload); // Add the new customer to the list
      state.totalAdmins += 1; // Increment the total user count
    });

    // Delete Admin
    builder.addCase(deleteAdmin.fulfilled, (state, action) => {
      state.admins = state.admins.filter(
        (admin) => admin._id !== action.payload
      ); // Remove the deleted customer
      state.totalAdmins -= 1;
    });

    // Edit Customer
    builder.addCase(editAdmin.fulfilled, (state, action) => {
      const updatedCustomer = action.payload;
      state.admins = state.admins.map((admin) =>
        admin._id === updatedCustomer._id ? updatedCustomer : admin
      );
    });
  },
});

export default adminSlice.reducer;
