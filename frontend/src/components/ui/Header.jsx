"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../../assets/logo.png";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [navigationLink, setNavigationLink] = useState("/home");
  const router = useRouter();
  const pathname = usePathname();

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsScrolled(scrollTop > 0);
  };

  useEffect(() => {
    if (currentUser) {
      switch (currentUser.role) {
        case "user":
          setNavigationLink("/folders");
          break;
        case "employee":
          setNavigationLink("/emp");
          break;
        case "admin":
          setNavigationLink("/admin");
          break;
        default:
          setNavigationLink("/home");
          break;
      }
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/users/me", {
        withCredentials: true,
      });
      setCurrentUser(response.data.data.data[0]);
    } catch (error) {
      // console.error("Failed to fetch user data:", error);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    fetchUserData();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await axios.get("/api/users/logout", { withCredentials: true });
      localStorage.setItem("isLoggedIn", "false");
      setCurrentUser(null);
      toast.success("You have signed out successfully.");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  // Match active route for highlighting
  const isActiveRoute = (route) => pathname.startsWith(route);

  return (
    <header
      aria-label="Site Header"
      className={`bg-[#FAFCFF] sticky top-0 z-50 backdrop-blur-lg shadow-sm ${
        isScrolled ? "bg-opacity-70 backdrop-filter backdrop-blur-lg" : ""
      }`}
    >
      <div className="flex items-center justify-between h-20 max-w-screen-xl mx-16">
        <div className="flex items-center gap-8">
          <Link href="/home">
            <Image src={logo} alt="Logo" className="w-48" priority />
          </Link>
        </div>

        <nav
          aria-label="Site Nav"
          className="items-center justify-center hidden gap-8 text-md font-medium lg:flex lg:w-0 lg:flex-1"
        >
          <Link href="/faq">
            <span
              className={`text-gray-800 hover:text-primary opacity-75 ${
                isActiveRoute("/faq") ? "text-primary" : ""
              }`}
            >
              FAQ
            </span>
          </Link>
          <Link href="/about">
            <span
              className={`text-gray-800 hover:text-primary opacity-75 ${
                isActiveRoute("/about") ? "text-primary" : ""
              }`}
            >
              About
            </span>
          </Link>
          <Link href="/contact">
            <span
              className={`text-gray-800 hover:text-primary opacity-75 ${
                isActiveRoute("/contact") ? "text-primary" : ""
              }`}
            >
              Contact
            </span>
          </Link>
        </nav>

        <div className="items-center hidden gap-4 lg:flex">
          {currentUser ? (
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn px-8 text-primary">
                {currentUser.fullName}
              </div>
              <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-36 p-2 shadow mt-2">
                <li>
                  <Link href={navigationLink || "/home"}>Workspace</Link>
                </li>
                <li>
                  <button className="text-red-700" onClick={handleSignOut}>
                    Logout
                  </button>
                </li>
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
    </header>
  );
}
