"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios"; // Importing axios
import Link from "next/link";

export default function Activate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isActivated, setIsActivated] = useState(false); // State for activation status

  useEffect(() => {
    // Get token and email from query parameters
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (token && email) {
      // Activation logic with axios
      axios
        .post("http://localhost:8080/api/users/verify-email", { token, email })
        .then((response) => {
          if (response.data.success) {
            // Account activated
            setIsActivated(true);
          } else {
            console.error("Activation failed:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error during activation:", error.response?.data || error.message);
        });
    } else {
      // Handle missing token or email
      console.error("Missing token or email");
    }
  }, [searchParams, router]); // Added dependencies

  return (
    <div className="grid h-screen place-content-center bg-white px-4 -mt-16">
      <div className="text-center">
        {isActivated ? ( // Conditional rendering based on activation status
          <>
            <p className="text-2xl font-bold tracking-tight text-primary sm:text-4xl">
              Account Activated Successfully!
            </p>
            <p className="mt-4 text-gray-500">Please login and continue your account.</p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold tracking-tight text-red-600 sm:text-4xl">
              Your Account is not Activated!
            </p>
            <p className="mt-4 text-gray-500">Please register your account.</p>
          </>
        )}
        <Link href={isActivated ? "/login" : "/register"}>
          <button className="btn btn-primary opacity-75 px-24 text-white mr-4 mt-8">
            {isActivated ? "Login" : "Register"}
          </button>
        </Link>
      </div>
    </div>
  );
}
