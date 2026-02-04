import React, { useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * ProtectedRoute wraps protected pages. Put it in your routes as a parent.
 * It reads trofi_user from localStorage / sessionStorage.
 */

export default function ProtectedRoute() {
  const location = useLocation();

  const token =
    localStorage.getItem("laundary-token") ||
    sessionStorage.getItem("laundary-token");

  if (!token) {
    toast.error("Please login first");
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

