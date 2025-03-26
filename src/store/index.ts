import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./slices/customerSlice";
import billReducer from "./slices/billSlice";
import AdminReducer from "./slices/adminSlice";
import SettingReducer from "./slices/settingSlice";
import ProfitsReducer from "./slices/profitsSilce";

export const store = configureStore({
  reducer: {
    customers: customerReducer,
    bills: billReducer,
    admins: AdminReducer,
    settings: SettingReducer,
    profits: ProfitsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
