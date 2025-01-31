import React from "react";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex w-full">
      <Sidebar />
      {children}
    </div>
  );
}
