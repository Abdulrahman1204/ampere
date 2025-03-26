"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBills } from "@/store/apiCalls/BillApiCall";
import { AppDispatch, RootState } from "@/store";
import Pagination from "../Pagination";
import FilterBills from "./FilterBills";
import { fetchProfits } from "@/store/apiCalls/ProfitsApiCall";

const ARTICLE_PER_PAGE = 6;

const TableBills = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    bills,
    totalBills,
    totalDiesel,
    totalRepair,
    totalExpenses,
    loading,
  } = useSelector((state: RootState) => state.bills);

  const { profits } = useSelector((state: RootState) => state.profits);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [fromDateFilter, setFromDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchBills({
        category: categoryFilter,
        from: fromDateFilter,
        to: toDateFilter,
        pageNumber: String(currentPage),
      })
    );

    dispatch(fetchProfits());
  }, [dispatch, currentPage, categoryFilter, fromDateFilter, toDateFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div
      className="space-y-6 p-4 bg-gray-50 rounded-lg shadow-sm"
      style={{ direction: "rtl" }}>
      <FilterBills
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        fromDateFilter={fromDateFilter}
        setFromDateFilter={setFromDateFilter}
        toDateFilter={toDateFilter}
        setToDateFilter={setToDateFilter}
        setCurrentPage={setCurrentPage}
      />

      {/* عرض صافي الأرباح بتصميم جميل */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">صافي الأرباح</p>
            <p className="text-sm opacity-80">إجمالي الأرباح بعد الخصومات</p>
          </div>
          <div className="text-3xl font-bold">
            {profits?.profits} ل.س {/* تنسيق الرقم بفواصل */}
          </div>
        </div>
      </div>

      {/* عرض إجمالي المازوت والإصلاحات والمصروفات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* بطاقة إجمالي المازوت */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">إجمالي المازوت</p>
              <p className="text-sm opacity-80">تكلفة المازوت المستخدم</p>
            </div>
            <div className="text-3xl font-bold">{totalDiesel} ل.س</div>
          </div>
        </div>

        {/* بطاقة إجمالي الإصلاحات */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">إجمالي الإصلاحات</p>
              <p className="text-sm opacity-80">تكلفة الإصلاحات</p>
            </div>
            <div className="text-3xl font-bold">{totalRepair} ل.س</div>
          </div>
        </div>

        {/* بطاقة إجمالي المصروفات */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">إجمالي المصروفات</p>
              <p className="text-sm opacity-80">تكلفة المصروفات الأخرى</p>
            </div>
            <div className="text-3xl font-bold">{totalExpenses} ل.س</div>
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
                المبلغ
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                التاريخ
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                الملاحظة
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                الفئة
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="h-64">
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : (
              bills?.map((bill, index) => (
                <tr
                  key={index}
                  className={`
            transition duration-150 ease-in-out
            ${
              bill.available
                ? "bg-green-50 hover:bg-green-100"
                : "bg-red-50 hover:bg-red-100"
            }

          `}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {bill.userName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {bill.phoneNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {bill.price} ل.س
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {bill?.createdAt
                      ? new Date(bill.createdAt).toISOString().split("T")[0]
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {bill.note}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {bill.category}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex space-x-2"></div>
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
          bills.map((bill, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200  ${
                bill.available
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}>
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">الاسم:</span> {bill.userName}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">الرقم:</span> ل.س
                  {bill.phoneNumber}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">التاريخ:</span>{" "}
                  {new Date(bill.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">الملاحظة:</span> {bill.note}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">الفئة:</span> {bill.category}
                </p>
                <div className="flex space-x-2"></div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalUsers={totalBills}
          usersPerPage={ARTICLE_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TableBills;
