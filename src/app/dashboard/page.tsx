import AddCustomerModal from "@/components/customers/AddCustomerModal ";
import TableCustomers from "@/components/customers/TableCustomers";
import React from "react";

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
        جدول العملاء
      </h1>

      {/* Filters and Add Customer Button */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        <AddCustomerModal />
      </div>

      {/* Table for larger screens */}
      <TableCustomers />
    </div>
  );
};

export default Dashboard;
