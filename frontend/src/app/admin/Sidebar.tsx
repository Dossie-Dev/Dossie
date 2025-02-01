"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

const Sidebar = () => {
  const pathname = usePathname(); // Hook to get the current path

  const handleSignOut = async () => {
    try {
      // Make API call to logout endpoint
      await axios.get(
        "api/users/logout",
        {
          withCredentials: true, // Ensures cookies are sent if required
        }
      );
      // Clear local data and redirect
      localStorage.setItem("isLoggedIn", "false");
      toast.success("You have signed out successfully.");
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const NavItem = ({ href, children }) => {
    const isActive = pathname === href;
    return (
      <li>
        <Link
          href={href}
          className={`block rounded-lg px-4 py-2 text-sm font-medium ${
            isActive
              ? " text-blue-500 font-bold"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
          }`}
          aria-current={isActive ? "page" : undefined}
        >
          {children}
        </Link>
      </li>
    );
  };

  return (
    <div className="flex w-64 h-screen flex-col justify-between border-e bg-white">
      <div className="px-4">
        <ul className="mt-6 space-y-1">
          <NavItem href="/admin/">Dashboard</NavItem>
          <NavItem href="/admin/companies">Companies</NavItem>
          <NavItem href="/admin/employees">Employees</NavItem>
          <NavItem href="/admin/users">Users</NavItem>
          <NavItem href="/admin/history">Activity log</NavItem>

          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <span className="text-sm font-medium">Account</span>
                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>
              <ul className="mt-2 space-y-1 px-4">
                <NavItem href="/admin/profile">Details</NavItem>
                <li>
                  <button
                    onClick={handleSignOut}
                    type="submit"
                    className="block rounded-lg px-4 py-2 text-sm font-medium 
                            text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
