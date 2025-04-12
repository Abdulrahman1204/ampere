"use client";

import React, { useEffect, useState } from "react";
import FilterCustomers from "./FilterCustomers";
import { useDispatch, useSelector } from "react-redux";
import {
  editCustomer,
  fetchCustomers,
  paidCustomer,
} from "@/store/apiCalls/CustomerApiCall";
import { AppDispatch, RootState } from "@/store";
import Pagination from "../Pagination";
import DeleteCustomer from "./DeleteCustomer";
import EditCustomer from "./EditCustomer";
import EditPriceCustomer from "./EditPriceCustomer";
import Swal from "sweetalert2";

const ARTICLE_PER_PAGE = 30;

const TableCustomers = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, totalUsers, loading, totalAmperes } = useSelector(
    (state: RootState) => state.customers
  );

  const [userNameFilter, setUserNameFilter] = useState("");
  const [plateFilter, setPlateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingCustomer, setEditingCustomer] = useState<{
    _id: string;
    userName: string;
    phoneNumber: string;
    numberOfAmpere: number;
    numberOfPlate: number;
    totalPrice: number;
    note: string;
  } | null>(null);

  const [editingPrice, setEditingPrice] = useState<{
    _id: string;
    totalPrice: number;
  } | null>(null);



  useEffect(() => {
    dispatch(
      fetchCustomers({
        pageNumber: String(currentPage),
        userName: userNameFilter,
        numberOfPlate: plateFilter,
      })
    );
  }, [userNameFilter, plateFilter, currentPage, dispatch]);

  // دالة لحساب تواريخ الأسابيع بناءً على startDate
  const getWeekDates = (startDate: Date): Date[] => {
    const weekDates = [];
    for (let i = 0; i < 4; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i * 7);
      weekDates.push(date);
    }
    return weekDates;
  };

  const handleWeekClick = async (index: number, id: string) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، قم بالدفع",
      cancelButtonText: "تراجع",
    });

    if (result.isConfirmed) {
      dispatch(paidCustomer({ id })).then(() => {
        dispatch(fetchCustomers({}));
        Swal.fire("تم الدفع!", "بنجاح");
      });
    }
  };

  const handleToggleAvailable = async (
    id: string,
    currentAvailable: boolean
  ) => {
    try {
      await dispatch(
        editCustomer({ id, available: !currentAvailable })
      ).unwrap();
      const updatedUsers = users.map((user) =>
        user._id === id ? { ...user, available: !currentAvailable } : user
      );

      dispatch({ type: "UPDATE_CUSTOMER", payload: updatedUsers });
      dispatch(fetchCustomers({}));
    } catch (error) {
      console.error("Error updating available status:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearFilter = () => {
    setPlateFilter("");
    setUserNameFilter("");
  };

  return (
    <div
      className="space-y-6 p-4 bg-gray-50 rounded-lg shadow-sm"
      style={{ direction: "rtl" }}>
      <div className=" max-xl:space-y-4 xl:flex space-x-2 justify-between items-center">
        <FilterCustomers
          userNameFilter={userNameFilter}
          setUserNameFilter={setUserNameFilter}
          plateFilter={plateFilter}
          setPlateFilter={setPlateFilter}
          setCurrentPage={setCurrentPage}
        />

        <button
          onClick={() => handleClearFilter()}
          className="bg-gray-400 hover:bg-gray-500 cursor-pointer text-white px-3 py-1 rounded-lg transition-colors">
          الكل
        </button>

        <div className="flex justify-center items-center">
          مجموع الامبيرات الكلي{" "}
          <div className="mr-3 bg-slate-300 p-1 rounded-2xl">
            {totalAmperes}
          </div>
        </div>
      </div>

      {/* Table for larger screens */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                الاسم
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                الرقم
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                الامبيرات
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                اللوحة
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                السعر الاجمالي
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                ملاحظة
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                متاح
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                الأسابيع
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
              users?.map((customer, index) => {
                const weekDates = customer.startDate
                  ? getWeekDates(customer.startDate)
                  : [];

                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {customer.userName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {customer.phoneNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {customer.numberOfAmpere}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {customer.numberOfPlate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {customer.totalPrice} ل.س
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {customer.note}
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-sm text-gray-700 ${
                        customer.available ? "bg-green-600" : "bg-red-600"
                      } cursor-pointer`}
                      onClick={() =>
                        handleToggleAvailable(customer._id, customer.available)
                      }></td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex space-x-2">
                        {customer.weeks?.map((week, weekIndex) => {
                          const weekDate = weekDates[weekIndex];
                          return (
                            <div
                              key={weekIndex}
                              className="flex flex-col items-center">
                              <span className="text-xs mb-1">
                                {weekDate
                                  ? weekDate.toISOString().split("T")[0]
                                  : "N/A"}
                              </span>
                              <button
                                className={`w-8 h-8 rounded ${
                                  week ? "bg-green-500" : "bg-red-500"
                                } cursor-pointer`}
                                onClick={() =>
                                  handleWeekClick(weekIndex, customer._id)
                                }></button>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex flex-col space-y-2">
                        <DeleteCustomer
                          id={customer._id}
                          disabled={!customer.available}
                        />
                        <button
                          onClick={() => setEditingCustomer(customer)}
                          disabled={!customer.available}
                          className={`bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg transition-colors ${
                            !customer.available
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}>
                          تعديل التفاصيل
                        </button>
                        <button
                          onClick={() => setEditingPrice(customer)}
                          disabled={!customer.available}
                          className={`bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-lg transition-colors ${
                            !customer.available
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}>
                          تعديل السعر
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
          users.map((customer, index) => {
            const weekDates = customer.startDate
              ? getWeekDates(customer.startDate)
              : [];

            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                <div className="space-y-3 flex flex-col items-end">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">الاسم: </span>{" "}
                    {customer.userName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">الرقم:</span>{" "}
                    {customer.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">عدد الامبيرات:</span>{" "}
                    {customer.numberOfAmpere}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">اللوحة:</span>{" "}
                    {customer.numberOfPlate}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">السعر الاجمالي:</span> $
                    {customer.totalPrice} ل.س
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">ملاحظة:</span>{" "}
                    {customer.note}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">متاح:</span>{" "}
                    <span
                      className={`font-semibold ${
                        customer.available ? "text-green-600" : "text-red-600"
                      }`}>
                      {customer.available ? "نعم" : "لا"}
                    </span>
                  </p>
                  <div className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex space-x-2">
                      {customer.weeks?.map((week, weekIndex) => {
                        const weekDate = weekDates[weekIndex];
                        return (
                          <div
                            key={weekIndex}
                            className="flex flex-col items-center">
                            <span className="text-xs mb-1">
                              {weekDate
                                ? weekDate.toISOString().split("T")[0]
                                : "N/A"}
                            </span>
                            <button
                              className={`w-8 h-8 rounded ${
                                week ? "bg-green-500" : "bg-red-500"
                              } cursor-pointer`}
                              onClick={() =>
                                handleWeekClick(weekIndex, customer._id)
                              }></button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <DeleteCustomer
                      disabled={!customer.available}
                      id={customer._id}
                    />

                    <button
                      onClick={() => setEditingCustomer(customer)}
                      className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg transition-colors">
                      تعديل التفاصيل
                    </button>
                    <button
                      onClick={() => setEditingPrice(customer)}
                      disabled={!customer.available}
                      className={`bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-lg transition-colors ${
                        !customer.available
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}>
                      تعديل السعر
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalUsers={totalUsers}
          usersPerPage={ARTICLE_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <EditCustomer
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
        />
      )}

      {/* Edit Price Modal */}
      {editingPrice && (
        <EditPriceCustomer
          customer={editingPrice}
          onClose={() => setEditingPrice(null)}
        />
      )}
    </div>
  );
};

export default TableCustomers;
