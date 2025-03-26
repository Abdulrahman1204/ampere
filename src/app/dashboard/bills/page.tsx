import AddBillModal from '@/components/bills/AddBill'
import TableBills from '@/components/bills/TableBills'
import React from 'react'

const BillsPage = () => {
  return (
    <div className="p-4">
    <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
      جدول الفواتير
    </h1>

    {/* Filters and Add Customer Button */}
    <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
      <AddBillModal />
    </div>

    {/* Table for larger screens */}
    <TableBills />
  </div>
  )
}

export default BillsPage
