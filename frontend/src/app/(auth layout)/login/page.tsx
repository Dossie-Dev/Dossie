"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Adjusted import for Next.js App Router
import { toast } from "react-toastify";
import axios from "axios"; // Import axios

export default function Login() {
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const router = useRouter(); // Initialize router for navigation

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const { data } = await axios.post("api/users/login", {
        email,
        password, // Send email and password
      });

      // Login successful
      toast.success("Login successful!");
      router.push("/folders"); // Redirect to folders page
    } catch (error) {
      console.error("Error during login:", error);
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again later.";
      toast.error("Incorrect email or password, Please try again"); // Show error message
    }
  };

  return (
    <div className="p-3 py-24 max-w-lg mx-auto">
      <h1 className="text-center font-semibold my-7 mb-8">
        <span className="text-md">ሰላም 👋 , Welcome Back!</span> <br />
        <span className="text-4xl font-bold text-primary opacity-75">
          Login to Dossie
        </span>
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
        />
        <button
          type="submit"
          className="bg-primary opacity-75 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
          Login
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link href="/register">
          <span className="text-blue-700 cursor-pointer">Register</span>
        </Link>
      </div>

      <div className="flex gap-2 mt-5">
        <Link href="/forgotPassword">
          <span className="text-blue-700 cursor-pointer">Forgot Password</span>
        </Link>
      </div>
    </div>
  );
}
