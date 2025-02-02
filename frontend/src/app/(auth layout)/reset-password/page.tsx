"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token"); // Extract token from URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // POST request to reset password with the token in the URL
      const response = await axios.post(
        `api/users/resetpassword/${token}`, // Include token in the endpoint
        { password, confirmPassword }, // Payload
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login"); // Redirect to login page
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(
        error.response?.data?.message || "Failed to reset password. Please try again."
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
            Reset Password
          </p>
          <p className="mt-4 text-gray-500">
            Please enter your new password below.
          </p>
        </div>

        <input
          type="password"
          className="input input-bordered w-96"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="input input-bordered w-96"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handlePasswordReset}
          className="px-16 py-3 text-sm font-medium rounded-xl text-white bg-primary opacity-75 hover:opacity-100"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
