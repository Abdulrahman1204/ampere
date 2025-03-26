"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Pagination from "../Pagination";
import { fetchAdmins } from "@/store/apiCalls/AdminApiCall";
import FilterAdmins from "./FilterAdmin";
import DeleteAdmin from "../customers/DeleteAdmin";
import EditAdmin from "./EditAdmin";

const ARTICLE_PER_PAGE = 6;

const TableAdmins = () => {
  const dispatch: AppDispatch = useDispatch();
  const { admins, totalAdmins, loading } = useSelector(
    (state: RootState) => state.admins
  );

  const [userNameFilter, setUserNameFilter] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingAdmin, setEditingAdmin] = useState<{
    _id: string;
    userName: string;
    phoneNumber: string;
    password: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    dispatch(
      fetchAdmins({
        pageNumber: String(currentPage),
        userName: userNameFilter,
        phoneNumber: phoneNumber,
      })
    );
  }, [userNameFilter, phoneNumber, currentPage, dispatch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearFilter = () => {
    setPhoneNumber("");
    setUserNameFilter("");
  };

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg shadow-sm" style={{ direction: 'rtl' }}>
      <div className="flex justify-between items-center">
        <FilterAdmins
          userNameFilter={userNameFilter}
          setUserNameFilter={setUserNameFilter}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          setCurrentPage={setCurrentPage}
        />

        <button
          onClick={() => handleClearFilter()}
          className="bg-gray-400 hover:bg-gray-500 cursor-pointer text-white px-3 py-1 rounded-lg transition-colors">
          الكل
        </button>
      </div>
      {/* Table for larger screens */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r text-center from-blue-500 to-blue-600">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                الاسم
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                الرقم
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={9} className="h-64">
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : (
              admins?.map((admin, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {admin.userName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {admin.phoneNumber}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex space-x-2">
                      {/* Delete Button */}
                      <DeleteAdmin id={admin._id} />

                      {/* Edit Details Button */}
                      <button
                        onClick={() => setEditingAdmin(admin)} // Set the customer to edit
                        className={`bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg transition-colors`}>
                        تعديل التفاصيل
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for smaller screens */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          admins.map((admin, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
              <div className="space-y-3 flex flex-col items-end">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">الاسم: </span>{" "}
                  {admin.userName}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">الرقم:</span>{" "}
                  {admin.phoneNumber}
                </p>
                <div className="flex space-x-2">
                  <DeleteAdmin id={admin._id} />

                  <button
                    onClick={() => setEditingAdmin(admin)} // Set the customer to edit
                    className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg transition-colors">
                    تعديل التفاصيل
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalUsers={totalAdmins} // Pass totalUsers from the backend
          usersPerPage={ARTICLE_PER_PAGE} // Use the constant
          onPageChange={handlePageChange}
        />
      </div>

      {/* Edit Customer Modal */}
      {editingAdmin && (
        <EditAdmin
          admin={editingAdmin}
          onClose={() => setEditingAdmin(null)} // Close the modal
        />
      )}
    </div>
  );
};

export default TableAdmins;
