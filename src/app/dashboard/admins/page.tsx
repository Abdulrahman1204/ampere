import AddAdmin from "@/components/admins/AddAdmin";
import TableAdmins from "@/components/admins/TableAdmins";
import React from "react";

const AdminPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
        جدول المسؤولين
      </h1>

      {/* Filters and Add Customer Button */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <AddAdmin />
      </div>

      {/* Table for larger screens */}
      <TableAdmins />
    </div>
  );
};

export default AdminPage;
