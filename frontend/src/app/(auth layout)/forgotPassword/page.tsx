"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import temp from "../../../assets/sec.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail));
  };

  const handleSendEmail = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      toast.error(error);
      return;
    }

    setIsLoading(true);
    setEmailError("");

    try {
      const response = await axios.post(
        "/api/users/forgotpassword",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error(
        error.response?.data?.message || "Failed to send password reset email."
      );
      setEmailError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 -mt-16">
          {/* Image Section */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <Image
                src={temp}
                alt="Reset Password"
                width={500} // Add width
                height={500} // Add height
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            {!isEmailSent ? (
              <div className="space-y-6" aria-live="polite">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-blue-500 mb-4">
                    Forgot Password?
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    No worries! Enter your email and we'll send you reset instructions.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EmailIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`input input-bordered w-full pl-10 ${
                          emailError ? "input-error" : ""
                        }`}
                        placeholder="you@example.com"
                      />
                    </div>
                    {emailError && (
                      <p className="mt-1 text-sm text-error">{emailError}</p>
                    )}
                  </div>

                  <button
  onClick={handleSendEmail}
  disabled={isLoading || !!emailError}
  className={`btn btn-primary w-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-xl ${
    isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
  }`}
>
  {isLoading ? (
    <div className="flex items-center justify-center">
      <Spinner className="h-5 w-5 mr-2 animate-spin" />
      <span className="text-md">Please wait...</span>
    </div>
  ) : (
    <div className="flex items-center">
      <EmailIcon className="w-5 h-5 mr-2" />
      <span className="text-md">Send Reset Link</span>
    </div>
  )}
</button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4" aria-live="polite">
                <div className="flex justify-center">
                  <EmailIcon className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Check your email</h3>
                <p className="text-gray-500">
                  We've sent a password reset link to <br />
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setIsEmailSent(false)}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="text-sm font-medium text-primary hover:text-primary/80 flex items-center justify-center gap-2"
              >
                <BackIcon className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Icons
const EmailIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

const BackIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
    />
  </svg>
);

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
    />
  </svg>
);