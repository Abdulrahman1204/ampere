import { createSlice } from "@reduxjs/toolkit";
import { addBills, fetchBills } from "../apiCalls/BillApiCall";
import { IBill } from "@/models/Bills/dto";

interface CustomerState {
  bills: IBill[];
  totalBills: number;
  totalDiesel: number;
  totalRepair: number;
  totalExpenses: number;
  loading: boolean;
  netProfit: number;
  error: string | null;
}

const initialState: CustomerState = {
  bills: [],
  totalBills: 0,
  totalDiesel: 0,
  totalRepair: 0,
  totalExpenses: 0,
  netProfit:0,
  loading: false,
  error: null,
};

const billSlice = createSlice({
  name: "bills",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Bills
    builder
      .addCase(fetchBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload.bills;
        state.totalBills = action.payload.totalBills;
        state.totalDiesel = action.payload.totalDiesel;
        state.totalRepair = action.payload.totalRepair;
        state.totalExpenses = action.payload.totalExpenses;
        state.netProfit = action.payload.netProfit;

        console.log(action.payload);
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

     // Add Bill
     builder
     .addCase(addBills.pending, (state) => {
       state.loading = true;
       state.error = null;
     })
     .addCase(addBills.fulfilled, (state, action) => {
       state.loading = false;
       state.bills.push(action.payload); // Add the new bill to the list
       state.totalBills += 1; // Increment the total count
     })
     .addCase(addBills.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload as string;
     });
  },
});

export default billSlice.reducer;
