import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Ensure this is correctly imported

export const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000;

    if (Date.now() > expirationTime) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }

    if (requiredRole === "admin" && decodedToken.role === "admin") {
      return children;
    }

    if (requiredRole === "doctor" && decodedToken.role === "doctor") {
      if (!decodedToken.data) {
        return <Navigate to={`/user/data/${decodedToken.role}`} replace />;
      }

      if (
        decodedToken.verification === "under process" ||
        decodedToken.verification === "rejected"
      ) {
        return (
          <Navigate
            to={`/doctor/verification/${decodedToken.verification}`}
            replace
          />
        );
      }
    }

    if (decodedToken.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  return children;
};
