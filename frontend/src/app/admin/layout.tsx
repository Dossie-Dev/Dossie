import React from "react";
import Sidebar from "./Sidebar";

export default function SidebarLayout({ children }) {
  return (
    <div className="flex w-full">
      <Sidebar />
      {children}
    </div>
  );
}
