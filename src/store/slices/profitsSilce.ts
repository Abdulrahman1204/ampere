import { createSlice } from "@reduxjs/toolkit";
import { editProfits, fetchProfits } from "../apiCalls/ProfitsApiCall";

interface IProfits {
  _id: string;
  profits: number;
}

interface ProfitsState {
  profits: IProfits | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfitsState = {
    profits: null,
  loading: false,
  error: null,
};

const profitsSlice = createSlice({
  name: "profits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Settings
    builder
      .addCase(fetchProfits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfits.fulfilled, (state, action) => {
        state.loading = false;
        state.profits = action.payload;
      })
      .addCase(fetchProfits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Edit Setting
    builder.addCase(editProfits.fulfilled, (state, action) => {
      state.profits = action.payload;
    });
  },
});

export default profitsSlice.reducer;
