"use client"; // Ensure this is a Client Component

import Link from "next/link";
import React from "react";
import { FaFileInvoice, FaUsers } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";

const SidebarContent = ({
  pathName,
  role,
}: {
  pathName: string;
  role: string;
}) => {
  return (
    <ul className="flex-1">
      {/* Show "العملاء" for both admin and superAdmin */}
      <li className="mb-3">
        <Link
          href="/dashboard"
          className={`flex items-center p-3 hover:bg-gray-700 rounded-lg transition duration-200 ${
            pathName === "/dashboard" ? "bg-gray-700" : ""
          }`}>
          <FaUsers className="mr-3" size={18} />
          <span>العملاء</span>
        </Link>
      </li>

      {/* Show "الفواتير" only for superAdmin */}
      {role === "superAdmin" && (
        <>
          <li className="mb-3">
            <Link
              href="/dashboard/bills"
              className={`flex items-center p-3 hover:bg-gray-700 rounded-lg transition duration-200 ${
                pathName === "/dashboard/bills" ? "bg-gray-700" : ""
              }`}>
              <FaFileInvoice className="mr-3" size={18} />
              <span>الفواتير</span>
            </Link>
          </li>
          <li className="mb-3">
            <Link
              href="/dashboard/admins"
              className={`flex items-center p-3 hover:bg-gray-700 rounded-lg transition duration-200 ${
                pathName === "/dashboard/admins" ? "bg-gray-700" : ""
              }`}>
              <FaUsersGear className="mr-3" size={18} />
              <span>المسؤولين</span>
            </Link>
          </li>
          <li className="mb-3">
            <Link
              href="/dashboard/settings"
              className={`flex items-center p-3 hover:bg-gray-700 rounded-lg transition duration-200 ${
                pathName === "/dashboard/settings" ? "bg-gray-700" : ""
              }`}>
              <IoSettingsSharp className="mr-3" size={18} />
              <span>الاعدادات</span>
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default SidebarContent;
