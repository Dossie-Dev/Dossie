"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import logo from "../../assets/logo.png";

// Role-based navigation mapping
const ROLE_NAVIGATION = {
  user: "/documents",
  employee: "/emp",
  admin: "/admin",
  default: "/home",
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [navigationLink, setNavigationLink] = useState(ROLE_NAVIGATION.default);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null); // Ref to track the dropdown element
  const router = useRouter();
  const pathname = usePathname();

  // Format current date
  const dateString = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Handle scroll effect
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/users/me", { withCredentials: true });
      const user = response.data.data.data[0];
      setCurrentUser(user);
      localStorage.setItem("username", user.firstName);
      setNavigationLink(ROLE_NAVIGATION[user.role] || ROLE_NAVIGATION.default);
    } catch (error) {
      const excludedRoutes = ["/activate", "/forgotPassword", "/login", "/reset-password"];
      if (!excludedRoutes.includes(pathname)) {
        setCurrentUser(null);
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await axios.get("/api/users/logout", { withCredentials: true });
      localStorage.setItem("isLoggedIn", "false");
      localStorage.setItem("userRole", "none");
      setCurrentUser(null);
      toast.success("Signed out successfully.");
      router.push("/login");
    } catch (error) {
      console.error("Sign-out failed:", error);
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  }, []);

  // Scroll, user data, and click outside effects
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    fetchUserData();
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchUserData, handleScroll, handleClickOutside]);

  return (
    <header
      aria-label="Site Header"
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? "shadow-md bg-opacity-95 backdrop-blur-md" : "shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo and Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle Menu"
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <Link href="https://dossiescholar.org/" className="flex items-center">
            <Image
              src={logo}
              alt="Dossie Scholar Logo"
              width={120}
              height={40}
              priority
              className="transition-opacity hover:opacity-90"
            />
          </Link>
        </div>

        {/* Desktop Date Display */}
        <div className="hidden lg:flex text-sm text-gray-500 font-medium bg-gray-100 py-2 px-4 rounded-full">
          {dateString}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-full" />
          ) : currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                aria-label={`User menu for ${currentUser.fullName}`}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-all"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{currentUser.fullName}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {isDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={navigationLink}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                      </svg>
                      Workspace
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                      </svg>
                      {isSigningOut ? "Signing out..." : "Sign out"}
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg py-4 px-6">
          <div className="text-sm text-gray-500 font-medium bg-gray-100 py-2 px-4 rounded-full text-center">
            {dateString}
          </div>
        </div>
      )}
    </header>
  );
}