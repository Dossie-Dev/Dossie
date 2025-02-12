"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { HomeIcon, UsersIcon, BriefcaseIcon, DocumentIcon, LogoutIcon, UserIcon } from '@heroicons/react/outline';
const Sidebar = () => {
  const pathname = usePathname(); // Hook to get the current path
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Make API call to logout endpoint
      await axios.get("/api/users/logout", { withCredentials: true });
      localStorage.setItem("isLoggedIn", "false");
      toast.success("You have signed out successfully.");
      router.push("/login");
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
          className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
            isActive ? "text-blue-500 font-bold bg-blue-100" : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
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
          <NavItem href="/admin/" icon={<HomeIcon className="h-5 w-5" />}>
            Dashboard
          </NavItem>
          <NavItem href="/admin/companies" icon={<BriefcaseIcon className="h-5 w-5" />}> 
            Companies
          </NavItem>
          <NavItem href="/admin/employees" icon={<UsersIcon className="h-5 w-5" />}> 
            Employees
          </NavItem>
          <NavItem href="/admin/users" icon={<UsersIcon className="h-5 w-5" />}> 
            Users
          </NavItem>
          <NavItem href="/admin/history" icon={<DocumentIcon className="h-5 w-5" />}> 
            Activity log
          </NavItem>

          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                <span className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Account</span>
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
                <NavItem href="/admin/profile" icon={<UsersIcon className="h-5 w-5" />}>Details</NavItem>
                <li>
                  <button
                    onClick={handleSignOut}
                    type="button"
                    className="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100 transition-colors"
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
