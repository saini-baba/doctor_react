import React from "react";
import { Outlet } from "react-router-dom";
import { Nav } from "../component/Nav";
import { Toaster } from "react-hot-toast";
export const Layout2 = () => {
  return (
    <div>
      <Nav />
      <div>
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};
