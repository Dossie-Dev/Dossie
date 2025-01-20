"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../../assets/logo.png"; // Ensure this path is correct
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsScrolled(scrollTop > 0);
  };





  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get("api/users/me", {
        withCredentials: true, // Ensures cookies are sent if required
      });
      setCurrentUser(response.data.data.data[0]);
    } catch (error) {
      // console.error("Failed to fetch user data:", error);
      // toast.error("Failed to fetch user data. Please log in.");
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Fetch user data on initial load
    fetchUserData();

    // Cleanup event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Re-fetch user data on pathname change
    fetchUserData();
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      // Make API call to logout endpoint
      await axios.get("api/users/logout", {}, {
        withCredentials: true, // Ensures cookies are sent if required
      });
      // Clear local data and redirect
      localStorage.setItem("isLoggedIn", "false");
      setCurrentUser(null);
      toast.success("You have signed out successfully.");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };
  
  return (
    <header
      aria-label="Site Header"
      className={`bg-[#FAFCFF] sticky top-0 z-50 backdrop-blur-lg shadow-sm ${
        isScrolled
          ? "bg-opacity-70 backdrop-filter backdrop-blur-lg shadow-sm"
          : ""
      }`}
    >
      <div className="flex items-center justify-between h-20 max-w-screen-xl mx-16">
        <div className="flex items-center gap-8">
          <Link href="/home">
            <Image
              src={logo}
              alt="Logo"
              className="w-48"
              priority
            />
          </Link>
        </div>

        <nav
          aria-label="Site Nav"
          className="items-center justify-center hidden gap-8 text-md font-medium lg:flex lg:w-0 lg:flex-1"
        >
          
          <Link href="/faq" passHref>
            <span
              className={`text-gray-800 hover:text-primary opacity-75 ${
                pathname === "/faq" ? "text-primary opacity-75" : ""
              }`}
            >
              FAQ
            </span>
          </Link>
          <Link href="/about" passHref>
            <span
              className={`text-gray-800 hover:text-primary opacity-75 ${
                pathname === "/about" ? "text-primary opacity-75" : ""
              }`}
            >
              About
            </span>
          </Link>


          <Link href="/contact">
            <span
              className={`text-gray-800 hover:text-primary opacity-75 ${
                pathname === "/about" ? "text-primary opacity-75" : ""
              }`}
            >
              Contact 
            </span>
          </Link>
        </nav>

        <div className="items-center hidden gap-4 lg:flex rounded-full">
          {currentUser ? (


<div className="dropdown">
            <div tabIndex={0} role="button" className="btn px-8 text-primary">
            {currentUser.fullName}
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-36 p-2 shadow mt-2">
              <li>
                <Link
                  href="/folders">
                  Workspace
                </Link>
              </li>
              <li>
                <button
                  className="text-red-700"
                  onClick={handleSignOut}
                >
                  Logout
                </button>
              </li>
              {/* Additional sorting options */}
            </ul>
          </div>




          ) : (
            <Link href="/login" passHref>
              <button className="px-16 py-3 text-sm font-medium rounded-xl text-white bg-primary opacity-75 hover:opacity-100">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 lg:hidden">
        <nav className="flex items-center justify-center p-4 overflow-x-auto text-sm font-medium gap-8">
          <Link href="/documents" passHref>
            <span
              className={`text-gray-800 hover:text-primary opacity-75 ${
                pathname === "/documents" ? "text-primary opacity-75" : ""
              }`}
            >
              Documents
            </span>
          </Link>
          <Link href="/faq" passHref>
            <span
              className={`text-gray-800 hover:text-primary opacity-75 ${
                pathname === "/faq" ? "text-primary opacity-75" : ""
              }`}
            >
              FAQ
            </span>
          </Link>
          <Link href="/about" passHref>
            <span
              className={`text-gray-800 hover:text-primary opacity-75 ${
                pathname === "/about" ? "text-primary opacity-75" : ""
              }`}
            >
              About
            </span>
          </Link>


          <Link href="/contact">
            <span
              className={`text-gray-800 hover:text-primary opacity-75 ${
                pathname === "/about" ? "text-primary opacity-75" : ""
              }`}
            >
              Contact 
            </span>
          </Link>
          {currentUser ? (
           

<div className="dropdown">
            <div tabIndex={0} role="button" className="btn px-8 text-primary">
            {currentUser.fullName}
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-36 p-2 shadow mt-2">
              <li>
                <Link
                  href="/folders">
                  Workspace
                </Link>
              </li>
              <li>
                <button
                  className="text-red-700"
                  onClick={handleSignOut}
                >
                  Logout
                </button>
              </li>
              {/* Additional sorting options */}
            </ul>
          </div>


          ) : (
            <Link href="/login" passHref>
              <span className="px-10 py-3 text-sm font-medium rounded-full text-white bg-primary opacity-75 hover:opacity-100">
                Login
              </span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
