"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import temp from "../../../assets/sec.png"; // Ensure this path is correct
import { toast } from "react-toastify";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({});
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

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(formData));
    console.log("User signed up:", formData);
    setLoading(false);

    toast.success("Registration successful! Please sign in.");

    router.push("/sign-in");
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
            id="firstName"
            onChange={handleChange}
          />
           <input
            type="text"
            placeholder="Last Name"
            className="border p-3 rounded-lg"
            id="lasttName"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            className="border p-3 rounded-lg"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            className="border p-3 rounded-lg"
            id="password"
            onChange={handleChange}
          />
           <input
            type="password"
            placeholder="confirm password"
            className="border p-3 rounded-lg"
            id="confirmPassword"
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
          <Link href="/login">
            <span className="text-primary">Login</span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
  );
}
