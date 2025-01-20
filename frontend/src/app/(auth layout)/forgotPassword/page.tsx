"use client";

import { useState } from "react";
import axios from "axios"; // Importing axios
import { toast } from "react-toastify"; // Optional: For user feedback
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState(""); // State to store the email input
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner

  const handleSendEmail = async () => {
    if (!email) {
      toast.error("Please enter a valid email.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "api/users/forgotpassword",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error(
        error.response?.data?.message || "Failed to send password reset email."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-screen place-content-center bg-white px-4 -mt-16">
      <div className="text-center flex flex-col justify-center items-center gap-8">
        <div>
          <p className="text-2xl font-bold tracking-tight text-primary">
            Forgot Password
          </p>
          <p className="mt-4 text-gray-500">
            Please enter the email you signed up with
          </p>
        </div>

        <label className="input input-bordered flex items-center gap-2 w-96">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="email"
            className="grow"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <button
          onClick={handleSendEmail}
          className="px-16 py-3 text-sm font-medium rounded-xl text-white bg-primary opacity-75 hover:opacity-100"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
