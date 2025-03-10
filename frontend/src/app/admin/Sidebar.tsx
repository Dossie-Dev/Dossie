"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { LogoutIcon, UsersIcon } from "@heroicons/react/outline";

const Sidebar = () => {
  const pathname = usePathname(); // Hook to get the current path
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure this code runs only on the client
  }, []);

  const handleSignOut = async () => {
    try {
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
          className={`flex items-center gap-4 justify-start rounded-lg px-4 py-2 text-sm font-medium ${
            isActive ? "text-blue-500 font-bold" : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
          }`}
          aria-current={isActive ? "page" : undefined}
        >
          <span>{icon}</span>
          {children}
        </Link>
      </li>
    );
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div className="flex w-16 md:w-64 h-screen flex-col justify-between border-e bg-white">
      <div className="p-2 md:p-4">
        <ul className="mt-6 space-y-1">
          <NavItem href="/admin/" icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6zm2-10h4V5H5zm10 8h4v-6h-4zm0-12h4V5h-4zM5 19h4v-2H5zm4-2"></path></svg>}>
            <span className="hidden md:block">Dashboard</span>
          </NavItem>
          <NavItem href="/admin/documents" 
icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g className="document-outline"><g fill="currentColor" fillRule="evenodd" className="Vector" clipRule="evenodd"><path d="M15.143 22H8.286A4.286 4.286 0 0 1 4 17.714V6.286A4.286 4.286 0 0 1 8.286 2h4.008a3.5 3.5 0 0 1 2.304.866l3.635 3.18a3.5 3.5 0 0 1 1.196 2.635v9.033A4.286 4.286 0 0 1 15.143 22m0-2H8.286A2.286 2.286 0 0 1 6 17.714V6.286A2.286 2.286 0 0 1 8.286 4h4.008a1.5 1.5 0 0 1 .987.371l3.635 3.18a1.5 1.5 0 0 1 .513 1.13v9.033A2.286 2.286 0 0 1 15.143 20"></path><path d="M13 3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h2.5a1 1 0 1 1 0 2H15a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1"></path></g></g></svg>}          >
            <span className="hidden md:block">Documents</span>
          </NavItem>
      
          <NavItem href="/admin/companies" icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M18 15h-2v2h2m0-6h-2v2h2m2 6h-8v-2h2v-2h-2v-2h2v-2h-2V9h8M10 7H8V5h2m0 6H8V9h2m0 6H8v-2h2m0 6H8v-2h2m6-10V3H2v18h20V7z"></path></svg>}>
            <span className="hidden md:block">Companies</span>
          </NavItem>
          <NavItem href="/admin/employees" icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M16 9c0 5.33-8 5.33-8 0h2c0 2.67 4 2.67 4 0m6 9v3H4v-3c0-2.67 5.33-4 8-4s8 1.33 8 4m-1.9 0c0-.64-3.13-2.1-6.1-2.1S5.9 17.36 5.9 18v1.1h12.2M12.5 2c.28 0 .5.22.5.5v3h1V3a3.89 3.89 0 0 1 2.25 3.75s.7.14.75 1.25H7c0-1.11.75-1.25.75-1.25A3.89 3.89 0 0 1 10 3v2.5h1v-3c0-.28.22-.5.5-.5"></path></svg>}>
            <span className="hidden md:block">Employees</span>
          </NavItem>
          <NavItem href="/admin/users" icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M12 4a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7M6.5 7.5a5.5 5.5 0 1 1 11 0a5.5 5.5 0 0 1-11 0M3 19a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v3H3zm5-3a3 3 0 0 0-3 3v1h14v-1a3 3 0 0 0-3-3z"></path></svg>}>
            <span className="hidden md:block">Users</span>
          </NavItem>
          <NavItem href="/admin/history" icon={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7z"></path></svg>}>
            <span className="hidden md:block">Activity log</span>
          </NavItem>

          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden mt-4 border rounded-xl">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-blue-500 hover:bg-blue-50 transition-colors">
                <span className="flex items-center justify-start gap-4">
                  <span className="hidden md:block font-medium">Account</span>
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
              <ul className="mt-2 space-y-1 md:px-4">
                <NavItem href="/admin/profile" icon={<UsersIcon className="h-5 w-5" />}>
                  <span className="hidden md:block -ml-2">Details</span>
                </NavItem>
                <li>
                  <button
                    onClick={handleSignOut}
                    type="button"
                    className="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <LogoutIcon className="h-5 w-5 mr-2" />
                    <span className="hidden md:block">Logout</span>
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