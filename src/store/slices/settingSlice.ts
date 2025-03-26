import { createSlice } from "@reduxjs/toolkit";
import { fetchSettings, editSetting } from "../apiCalls/SettingApiCall";

interface ISetting {
  _id: string;
  priceOfAmpere: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface SettingState {
  settings: ISetting | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingState = {
  settings: null, 
  loading: false,
  error: null,
};

const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Settings
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Edit Setting
    builder.addCase(editSetting.fulfilled, (state, action) => {
      state.settings = action.payload;
    });
  },
});

export default settingSlice.reducer;
