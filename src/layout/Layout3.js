import React from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { Nav_user } from "../component/Nav_user";
export const Layout3 = () => {
  return (
    <div>
      <Nav_user />
      <div>
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};
