import { AppDispatch } from "@/store";
import {
  deleteCustomer,
  fetchCustomers,
} from "@/store/apiCalls/CustomerApiCall";
import React from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const DeleteCustomer = ({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) => {
  const dispatch: AppDispatch = useDispatch();

  const handleDeleteUser = (userId: string) => {
    Swal.fire({
      title: "هل أنت متاكد؟",
      text: "!لن تتمكن من التراجع عن هذا",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "!نعم, احذف",
      cancelButtonText: "تراجع",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCustomer({ id: userId })).then(() => {
          dispatch(fetchCustomers({}));

          // Show success message
          Swal.fire("Deleted!", "The user has been deleted.", "success");
        });
      }
    });
  };

  return (
    <button
      onClick={() => handleDeleteUser(id)} 
      disabled={disabled}
      className={`bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-lg transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}>
      حذف
    </button>
  );
};

export default DeleteCustomer;
