"use client";

import { AppDispatch } from "@/store";
import { addAdmins, fetchAdmins } from "@/store/apiCalls/AdminApiCall";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const AddAdmin = () => {
  const dispatch: AppDispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    phoneNumber: "",
    password: "",
    role: "admin"
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

  const handleAddCustomer = async () => {
    try {

      console.log(formData)
      await dispatch(addAdmins(formData)).unwrap();

      setFormData({
        userName: "",
        phoneNumber: "",
        password: "",
        role: "admin"
      });

      dispatch(fetchAdmins({}));
      setIsOpen(false);
      toast.success("Add Admin Successfully");
    } catch (error) {
      toast.error("Failed to add customer");
      console.error("Error adding customer:", error);
    }

    console.log(formData);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-sm hover:bg-blue-600 transition duration-200 shadow-md">
        إضافة مسؤول
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-lg mx-auto overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
            إضافة مسؤول جديد
            </h2>
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCustomer();
              }}>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمة السر
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
      )}
    </>
  );
};

export default AddAdmin;
