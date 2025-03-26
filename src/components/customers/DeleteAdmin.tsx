import { AppDispatch } from "@/store";
import { deleteAdmin, fetchAdmins } from "@/store/apiCalls/AdminApiCall";

import React from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const DeleteAdmin = ({ id }: { id: string }) => {
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
        dispatch(deleteAdmin({ id: userId })).then(() => {
          dispatch(fetchAdmins({}));

          // Show success message
          Swal.fire("Deleted!", "The user has been deleted.", "success");
        });
      }
    });
  };

  return (
    <button
      onClick={() => handleDeleteUser(id)}
      className={`bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-lg transition-colors`}>
      حذف
    </button>
  );
};

export default DeleteAdmin;
