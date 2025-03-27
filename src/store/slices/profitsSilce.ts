import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { editProfits, fetchProfits } from "../apiCalls/ProfitsApiCall";

interface IUpdate {
  _id: string;
  amount: number;
  date: string | Date; // Dates come as strings from API
}

interface IProfits {
  _id: string;
  profits: number;
  updates: IUpdate[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
interface ProfitsState {
  profits: IProfits | null;  // Changed from separate profits/updates to single data object
  loading: boolean;
  error: string | null;
}

const initialState: ProfitsState = {
  profits: null,  // Now stores the complete profits object
  loading: false,
  error: null,
};

const profitsSlice = createSlice({
  name: "profits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Profits
      .addCase(fetchProfits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfits.fulfilled, (state, action: PayloadAction<IProfits>) => {
        state.loading = false;
        state.profits = action.payload; // Store complete response
      })
      .addCase(fetchProfits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Edit Profits
      .addCase(editProfits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProfits.fulfilled, (state, action: PayloadAction<IProfits>) => {
        state.loading = false;
        state.profits = action.payload; // Store complete updated response
      })
      .addCase(editProfits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profitsSlice.reducer;