"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { editAdmin, fetchAdmins } from "@/store/apiCalls/AdminApiCall";

interface EditAdminProps {
  admin: {
    _id: string;
    userName: string;
    phoneNumber: string;
  };
  onClose: () => void;
}

const EditAdmin: React.FC<EditAdminProps> = ({ admin, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState({
    userName: admin.userName,
    phoneNumber: admin.phoneNumber,
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
        editAdmin({
          id: admin._id,
          ...formData,
        })
      ).unwrap();

      dispatch(fetchAdmins({}));
      toast.success("Admin updated successfully!");
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
          تعديل تفاصيل العميل
        </h2>
        <form className="space-y-6" onSubmit={handleEditCustomer}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الرقم
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
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

export default EditAdmin;
