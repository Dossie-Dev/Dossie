"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Adjusted import for Next.js App Router
import { toast } from "react-toastify";
import axios from "axios"; // Import axios

export default function New() {

  const router = useRouter(); // Initialize router for navigation

  return (
    <div className="p-3 py-8 w-96 mx-auto ">
      <h1 className="text-center font-semibold my-7 mb-8">
        <span className="text-2xl font-bold text-primary opacity-75">
          Add New User
        </span>
      </h1>
      <form className="flex flex-col gap-4" 
      // onSubmit={handleLogin}
      >
         <input
  type="text"
  placeholder="First Name"
  className="border p-3 rounded-lg"
  // onChange={handleChange}
/>
<input
  type="text"
  placeholder="Last Name"
  className="border p-3 rounded-lg"
  // onChange={handleChange}
/>
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          // value={email}
          // onChange={(e) => setEmail(e.target.value)} // Update email state
        />
       



       
        <button
          type="submit"
          className="bg-primary opacity-75 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
          Add
        </button>
      </form>
     
    </div>
  );
}
