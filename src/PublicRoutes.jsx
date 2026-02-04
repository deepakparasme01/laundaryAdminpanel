import { Outlet, Navigate } from "react-router-dom";

export default function PublicRoute() {
  const token =
    localStorage.getItem("laundary-token") ||
    sessionStorage.getItem("laundary-token");

  // If user IS logged in → redirect to Dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // If NOT logged in → allow access to Login/Register
  return <Outlet />;
}
