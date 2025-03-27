"use client";

import { logOut } from "@/apiCalls/Logout";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import SidebarContent from "./SidebarContent";

const AdminSidebar = ({role}: {role: string}) => {
  const pathName = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const userRole = role;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-lg xl:hidden focus:outline-none">
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } xl:translate-x-0 transition-transform duration-200 ease-in-out z-40`}>
        <div className="p-6 flex flex-col h-full">
          <h2 className="text-xl font-bold mb-6 text-center">لوحة التحكم</h2>

          <SidebarContent pathName={pathName} role={userRole} />

          {/* Log Out Button */}
          <div className="mt-auto">
            <button
              onClick={handleLogOut}
              className="w-full flex items-center p-3 bg-red-400 cursor-pointer hover:bg-gray-700 rounded-lg transition duration-200">
              <FaSignOutAlt className="mr-3" size={18} />
              <span>تسجيل خروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-slate-300 transition-colors bg-opacity-50 lg:hidden z-30"></div>
      )}
    </>
  );
};

export default AdminSidebar;
