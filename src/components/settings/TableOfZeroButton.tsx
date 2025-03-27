"use client";

import { AppDispatch, RootState } from '@/store';
import { fetchProfits } from '@/store/apiCalls/ProfitsApiCall';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

const TableOfZeroButton = () => {
    const dispatch: AppDispatch = useDispatch();
    const { profits } = useSelector((state: RootState) => state.profits);

      useEffect(() => {
        dispatch(fetchProfits());
      }, [dispatch]);
    

    // Get last 3 updates sorted by date (newest first)
    const lastThreeUpdates = profits?.updates
        ? [...profits.updates]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
        : [];

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('ar-EG');
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('ar-EG') + ' ل.س';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-full">
            <h3 className="text-lg font-semibold mb-3 text-right">آخر 3 تحديثات</h3>
            {lastThreeUpdates.length > 0 ? (
                <table className="w-full text-right">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="py-2 px-4">المبلغ</th>
                            <th className="py-2 px-4">التاريخ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lastThreeUpdates.map((update) => (
                            <tr key={update._id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-2 px-4">{formatCurrency(update.amount)}</td>
                                <td className="py-2 px-4">{formatDate(update.date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-right text-gray-500">لا توجد تحديثات متاحة</p>
            )}
        </div>
    );
};

export default TableOfZeroButton;