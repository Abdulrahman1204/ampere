"use client";

import React from "react";

interface FilterBillsProps {
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  fromDateFilter: string;
  setFromDateFilter: (value: string) => void;
  toDateFilter: string;
  setToDateFilter: (value: string) => void;
  setCurrentPage: (page: number) => void;
}

const FilterBills: React.FC<FilterBillsProps> = ({
  categoryFilter,
  setCategoryFilter,
  fromDateFilter,
  setFromDateFilter,
  toDateFilter,
  setToDateFilter,
  setCurrentPage,
}) => {
  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isFromDate: boolean
  ) => {
    const value = e.target.value;

    if (!value) {
      if (isFromDate) {
        setFromDateFilter("");
      } else {
        setToDateFilter("");
      }
    } else {
      if (isFromDate) {
        setFromDateFilter(value);
      } else {
        setToDateFilter(value);
      }
    }

    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Mobile: Stack all inputs vertically */}
      <div className="md:hidden flex flex-col gap-4">
        <div className="w-full">
          <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
            الفئة
          </label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">الكل</option>
            <option value="مقبوضات">مقبوضات</option>
            <option value="مازوت">مازوت</option>
            <option value="تصليح">تصليح</option>
            <option value="مصاريف">مصاريف</option>
          </select>
        </div>

        <div className="w-full">
          <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
            من تاريخ
          </label>
          <input
            id="fromDate"
            type="date"
            value={fromDateFilter}
            onChange={(e) => handleDateChange(e, true)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="w-full">
          <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
            إلى تاريخ
          </label>
          <input
            id="toDate"
            type="date"
            value={toDateFilter}
            onChange={(e) => handleDateChange(e, false)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden md:flex md:flex-row gap-4 items-end w-full">
        <div className="flex-1 min-w-[180px]">
          <label htmlFor="categoryFilter-desktop" className="block text-sm font-medium text-gray-700 mb-1">
            الفئة
          </label>
          <select
            id="categoryFilter-desktop"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">الكل</option>
            <option value="مقبوضات">مقبوضات</option>
            <option value="مازوت">مازوت</option>
            <option value="تصليح">تصليح</option>
            <option value="مصاريف">مصاريف</option>
          </select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label htmlFor="fromDate-desktop" className="block text-sm font-medium text-gray-700 mb-1">
            من تاريخ
          </label>
          <input
            id="fromDate-desktop"
            type="date"
            value={fromDateFilter}
            onChange={(e) => handleDateChange(e, true)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex-1 min-w-[180px]">
          <label htmlFor="toDate-desktop" className="block text-sm font-medium text-gray-700 mb-1">
            إلى تاريخ
          </label>
          <input
            id="toDate-desktop"
            type="date"
            value={toDateFilter}
            onChange={(e) => handleDateChange(e, false)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBills;