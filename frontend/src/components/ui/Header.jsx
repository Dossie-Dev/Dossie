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
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = currentDate.toLocaleDateString(undefined, options);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsScrolled(scrollTop > 0);
  };

  useEffect(() => {
    if (currentUser) {
      switch (currentUser.role) {
        case "user":
          setNavigationLink("/documents");
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
      setIsLoading(true);
      const response = await axios.get("/api/users/me", {
        withCredentials: true,
      });
      setCurrentUser(response.data.data.data[0]);
      localStorage.setItem("username", response.data.data.data[0].firstName);
    } catch (error) {
      setCurrentUser(null);
      router.push("/login");

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await axios.get("/api/users/logout", { withCredentials: true });
      localStorage.setItem("isLoggedIn", "false");
      localStorage.setItem("userRole", "none");
      setCurrentUser(null);
      toast.success("You have signed out successfully.");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const isActiveRoute = (route) => pathname.startsWith(route);

  const navLinks = [
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      aria-label="Site Header"
      className={`bg-[#FAFCFF] sticky top-0 z-50 transition-all duration-200 ${
        isScrolled ? "bg-opacity-70 backdrop-blur-lg shadow-sm" : ""
      }`}
    >
      <div className="flex items-center justify-between h-20 px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <Link href="https://dossiescholar.org/" className="transition-opacity hover:opacity-80">
            <Image src={logo} alt="Logo" className="w-32 sm:w-48" priority />
          </Link>
        </div>

        <div className="hidden lg:flex text-blue-500 font-semibold mx-auto px-4 w-72 py-2 rounded rounded-2xl bg-blue-100/40 items-center justify-center">
          <h2>{dateString}</h2>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="btn btn-ghost btn-sm loading">Loading...</div>
          ) : currentUser ? (
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-primary btn-outline gap-2 px-6 group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center group-hover:bg-blue-500/70 justify-center text-primary group-hover:text-white font-medium">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="group-hover:text-white">{currentUser.fullName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-56 p-2 shadow-lg mt-2">
                <li>
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link 
                    href={navigationLink || "/home"} 
                    className="flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    Workspace
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button 
                    className="text-error hover:text-error flex items-center gap-2" 
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    {isSigningOut ? "Signing out..." : "Sign out"}
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link href="/login">
              <button className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#FAFCFF] shadow-lg">
          <div className="px-4 py-2">
            <div className="text-blue-500 font-semibold px-4 py-2 rounded rounded-2xl bg-blue-100/40 flex items-center justify-center">
              <h2>{dateString}</h2>
            </div>
          </div>
          
        </div>
      )}
    </header>
  );
}