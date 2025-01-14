"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.setItem("isLoggedIn", "false");
    setCurrentUser(null);
    toast.success("You have signed out successfully.");
    router.push("/sign-in");
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
          <Link href="/folders" passHref>
            <span
              className={`text-gray-800 hover:text-primary opacity-75 ${
                pathname === "/folders" ? "text-primary opacity-75" : ""
              }`}
            >
              Folders
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
        </nav>

        <div className="items-center hidden gap-4 lg:flex rounded-full">
  <Link href="/login" passHref>
    <button className="px-16 py-3 text-sm font-medium rounded-xl text-white bg-primary opacity-75 hover:opacity-100">
      Login
    </button>
  </Link>
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
          <Link href="/login" passHref>
  <span className="px-10 py-3 text-sm font-medium rounded-full text-white bg-primary opacity-75 hover:opacity-100">
    Login
  </span>
</Link>

        </nav>
      </div>
    </header>
  );
}
