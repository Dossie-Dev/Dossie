"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react"; // Added useState

export default function Activate() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const [isActivated, setIsActivated] = useState(false); // Added state for activation status


  useEffect(() => {
    // Check if the params exist

    const token = searchParams.get("token");

    const email = searchParams.get("email");


    if (token && email) {

      // Perform your activation logic here
      console.log("Token:", token);
      console.log("Email:", email);

      // Send the token and email to the specified URL
      fetch("http://localhost:8080/api/users/verify-email", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",
        },

        body: JSON.stringify({ token, email }), // Sending token and email

      })

      .then(response => response.json())
      .then(data => {

        if (data.success) {
          // Account activated, proceed to login

          console.log(data.message);

          setIsActivated(true); // Set activation status to true

        } else {

          console.error("Activation failed:", data.message);

        }

      })
      .catch(error => {

        console.error("Error during activation:", error);

      });
    } else {

      // Handle the case where token or email is missing

      console.error("Missing token or email");

    }

  }, [searchParams, router]); // Added router to dependencies


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
