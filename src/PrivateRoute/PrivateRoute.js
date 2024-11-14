import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const PrivateRoute = ({ children }) => {
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
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  return children;
};
