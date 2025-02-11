"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { HomeIcon, UsersIcon, BriefcaseIcon, DocumentIcon, LogoutIcon, UserIcon } from '@heroicons/react/outline';

const Sidebar = () => {
  const pathname = usePathname(); // Hook to get the current path

  const handleSignOut = async () => {
    try {
      // Make API call to logout endpoint
      await axios.get("api/users/logout", {
        withCredentials: true, // Ensures cookies are sent if required
      });
      // Clear local data and redirect
      localStorage.setItem("isLoggedIn", "false");
      toast.success("You have signed out successfully.");
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const NavItem = ({ href, children, icon }) => {
    const isActive = pathname === href;
    return (
      <li>
        <Link
          href={href}
          className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            isActive
              ? "text-blue-500 bg-blue-50 border-l-4 border-blue-500"
              : "text-gray-600 hover:bg-blue-50 hover:text-blue-500"
          }`}
          aria-current={isActive ? "page" : undefined}
        >
          <span className="mr-2">{icon}</span>
          {children}
        </Link>
      </li>
    );
  };

  return (
    <div className="flex w-64 h-screen flex-col justify-between border-e bg-white">
      <div className="p-4">
        <ul className="mt-6 space-y-1">
          <NavItem href="/emp/new" icon={<HomeIcon className="h-5 w-5" />}>
            Add New
          </NavItem>
          <NavItem href="/emp/documents" icon={<BriefcaseIcon className="h-5 w-5" />}>
            Documents
          </NavItem>
         

          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary
                className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  pathname.startsWith("/emp/profile")
                    ? "text-blue-500 bg-blue-50 border-l-4 border-blue-500"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-500"
                }`}
              >
                <span className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  <span>Account</span>
                </span>
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
                <NavItem href="/emp/profile" icon={<UsersIcon className="h-5 w-5" />}>
                  Details
                </NavItem>
                <li>
                  <button
                    onClick={handleSignOut}
                    type="button"
                    className="flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogoutIcon className="h-5 w-5 mr-2" />
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