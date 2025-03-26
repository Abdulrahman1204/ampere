"use client";

import EditSettingsPrice from "@/components/settings/EditSettingsPrice";
import { AppDispatch, RootState } from "@/store";
import { fetchSettings } from "@/store/apiCalls/SettingApiCall";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SettingPrice = () => {
  const dispatch: AppDispatch = useDispatch();
  const { settings, loading } = useSelector(
    (state: RootState) => state.settings
  );
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

  // Fetch settings on component mount
  useEffect(() => {
    dispatch(fetchSettings())
      .unwrap()
      .catch((err) => {
        console.error("Failed to fetch settings:", err);
      });
  }, [dispatch]);

  // Display loading state
  if (loading) {
    return (
      <div className="w-full h-full min-h-[200px] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-right">سعر الامبير</h2>

      {isEditing ? (
        <EditSettingsPrice
          initialPrice={settings?.priceOfAmpere || 0} // Pass the current price
          onCancel={() => setIsEditing(false)} // Handle cancel action
        />
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-lg text-right">السعر الحالي: {settings?.priceOfAmpere}</p>
          <button
            onClick={() => setIsEditing(true)} // Enable edit mode
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors w-full md:w-auto">
            تعديل
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingPrice;