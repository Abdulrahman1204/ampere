'use client';

import { AppDispatch } from "@/store";
import { editSetting, fetchSettings } from "@/store/apiCalls/SettingApiCall";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

interface EditSettingsPriceProps {
  initialPrice: number;
  onCancel: () => void;
}

const EditSettingsPrice: React.FC<EditSettingsPriceProps> = ({
  initialPrice,
  onCancel,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [priceOfAmpere, setPriceOfAmpere] = useState(initialPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = { priceOfAmpere };
    dispatch(editSetting(updatedData))
      .unwrap()
      .then(() => {
        dispatch(fetchSettings()); // Refetch settings after updating
        onCancel(); // Close the edit form
      })
      .catch((err) => {
        console.error("Failed to update settings:", err);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="priceOfAmpere" className="block font-medium text-right">
        تعديل سعر الامبير
      </label>
      <input
        type="number"
        id="priceOfAmpere"
        value={priceOfAmpere}
        onChange={(e) => setPriceOfAmpere(Number(e.target.value))}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
      />
      <div className="flex flex-col md:flex-row gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
          حفظ
        </button>
        <button
          type="button"
          onClick={onCancel} // Handle cancel action
          className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors">
          تراجع
        </button>
      </div>
    </form>
  );
};

export default EditSettingsPrice;