"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { HomeIcon, UsersIcon, BriefcaseIcon, DocumentIcon, LogoutIcon, UserIcon } from '@heroicons/react/outline';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Hook to get the current path

  const handleSignOut = async () => {
    try {
      // Make API call to logout endpoint
      await axios.get("/api/users/logout", { withCredentials: true });
      localStorage.setItem("isLoggedIn", "false");
      localStorage.setItem("userRole", "none");

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
          <NavItem href="/emp/new" icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M7.007 12a.75.75 0 0 1 .75-.75h3.493V7.757a.75.75 0 0 1 1.5 0v3.493h3.493a.75.75 0 1 1 0 1.5H12.75v3.493a.75.75 0 0 1-1.5 0V12.75H7.757a.75.75 0 0 1-.75-.75"></path><path fill="currentColor" fillRule="evenodd" d="M7.317 3.769a42.5 42.5 0 0 1 9.366 0c1.827.204 3.302 1.643 3.516 3.48c.37 3.157.37 6.346 0 9.503c-.215 1.837-1.69 3.275-3.516 3.48a42.5 42.5 0 0 1-9.366 0c-1.827-.205-3.302-1.643-3.516-3.48a41 41 0 0 1 0-9.503c.214-1.837 1.69-3.276 3.516-3.48m9.2 1.49a41 41 0 0 0-9.034 0A2.486 2.486 0 0 0 5.29 7.424a39.4 39.4 0 0 0 0 9.154a2.486 2.486 0 0 0 2.193 2.164c2.977.332 6.057.332 9.034 0a2.486 2.486 0 0 0 2.192-2.164a39.4 39.4 0 0 0 0-9.154a2.486 2.486 0 0 0-2.192-2.163" clipRule="evenodd"></path></svg>}>
            Add New
          </NavItem>
          <NavItem href="/emp/documents" icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g className="document-outline"><g fill="currentColor" fillRule="evenodd" className="Vector" clipRule="evenodd"><path d="M15.143 22H8.286A4.286 4.286 0 0 1 4 17.714V6.286A4.286 4.286 0 0 1 8.286 2h4.008a3.5 3.5 0 0 1 2.304.866l3.635 3.18a3.5 3.5 0 0 1 1.196 2.635v9.033A4.286 4.286 0 0 1 15.143 22m0-2H8.286A2.286 2.286 0 0 1 6 17.714V6.286A2.286 2.286 0 0 1 8.286 4h4.008a1.5 1.5 0 0 1 .987.371l3.635 3.18a1.5 1.5 0 0 1 .513 1.13v9.033A2.286 2.286 0 0 1 15.143 20"></path><path d="M13 3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h2.5a1 1 0 1 1 0 2H15a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1"></path></g></g></svg>}>
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