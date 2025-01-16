"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import temp from "../../../assets/sec.png"; // Ensure this path is correct
import { toast } from "react-toastify";
import Link from "next/link";
import axios from "axios"; // Import axios

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "user", // Default role
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form data
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.passwordConfirm
    ) {
      setError("All fields are required.");
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Prepare data for API
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      email: formData.email,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
    };

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed.");
        toast.error(errorData.message || "Registration failed.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("User signed up:", data);
      toast.success("we have sent you an activation code to your email.");
    } catch (error) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
      console.error("Error during registration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 justify-center items-center mx-auto lg:grid-cols-2 lg:grid gap-2 lg:px-64 px-16">
      <div className="w-3/4 md:6/12 lg:w-3/4">
        <Image src={temp} alt="image" loading="lazy" width={500} height={300} />
      </div>

      <div>
        <h1 className="text-center font-semibold my-7 mb-8">
          <span className="text-md">ሰላም 👋 , Welcome to Dossie!</span> <br />
          <span className="text-4xl font-bold text-primary opacity-75">
            አካውንት ይክፈቱ
          </span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
  type="text"
  placeholder="First Name"
  className="border p-3 rounded-lg"
  id="firstName" // Matches formData.firstName
  onChange={handleChange}
/>
<input
  type="text"
  placeholder="Last Name"
  className="border p-3 rounded-lg"
  id="lastName" // Corrected to match formData.lastName
  onChange={handleChange}
/>
<input
  type="email"
  placeholder="Email"
  className="border p-3 rounded-lg"
  id="email" // Matches formData.email
  onChange={handleChange}
/>
<input
  type="password"
  placeholder="Password"
  className="border p-3 rounded-lg"
  id="password" // Matches formData.password
  onChange={handleChange}
/>
<input
  type="password"
  placeholder="Confirm Password"
  className="border p-3 rounded-lg"
  id="passwordConfirm" // Corrected to match formData.passwordConfirm
  onChange={handleChange}
/>


          <button
            disabled={loading}
            className="bg-primary opacity-75 text-white p-3 rounded-lg uppercase hover:opacity-100 disabled:opacity-55"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
        <div className="flex gap-2 mt-5">
          <p>Have an account?</p>
          <Link href="/sign-in">
            <span className="text-primary">Sign in</span>
          </Link>
        </div>
        {/* {error && <p className="text-red-500 mt-5">{error}</p>} */}
      </div>
    </div>
  );
}