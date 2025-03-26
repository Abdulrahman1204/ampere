"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { editCustomer, fetchCustomers } from "@/store/apiCalls/CustomerApiCall";
import { AppDispatch } from "@/store";

interface EditPriceCustomerProps {
  customer: {
    _id: string;
    totalPrice: number;
  };
  onClose: () => void;
}

const EditPriceCustomer: React.FC<EditPriceCustomerProps> = ({
  customer,
  onClose,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState({
    totalPrice: customer.totalPrice,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(
        editCustomer({
          id: customer._id,
          ...formData,
        })
      ).unwrap();

      dispatch(fetchCustomers({}));
      toast.success("Customer updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update customer");
      console.error("Error updating customer:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-lg mx-auto overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
          تعديل السعر
        </h2>
        <form className="space-y-6" onSubmit={handleEditCustomer}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              السعر الاجمالي
            </label>
            <input
              type="number"
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-5 py-2.5 rounded-lg hover:bg-gray-600 transition duration-200 shadow-md">
              تراجع
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 transition duration-200 shadow-md">
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPriceCustomer;
