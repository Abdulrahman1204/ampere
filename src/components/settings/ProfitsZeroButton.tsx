'use client'

import React from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { editProfits, fetchProfits } from "@/store/apiCalls/ProfitsApiCall";
import { AppDispatch } from "@/store";

const ProfitsZeroButton = () => {
  const dispatch: AppDispatch = useDispatch();

  const handleResetProfits = async () => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم إعادة الأرباح إلى الصفر!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، إعادة إلى الصفر",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      await dispatch(editProfits({ profits: 0 })).unwrap();
      dispatch(fetchProfits());

      Swal.fire("تم!", "تم إعادة الأرباح إلى الصفر بنجاح.", "success");
    }
  };

  return (
    <button
      onClick={handleResetProfits}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out transform hover:scale-105">
      إعادة الأرباح إلى الصفر
    </button>
  );
};

export default ProfitsZeroButton;
