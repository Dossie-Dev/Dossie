"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios"; // Import axios
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

export default function New() {
  const router = useRouter(); // Initialize router for navigation
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "employee", // Default role
  });
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);

    try {
      const response = await axios.post("/api/admin/employee", formData, {
        withCredentials: true, // Include credentials if needed
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Employee added successfully!");
        setFormData({ firstName: "", lastName: "", email: "", role: "employee" }); // Reset form
        router.push("/admin/employees"); // Navigate to employee list or another relevant page
      } else {
        toast.error("Failed to add employee. Please try again.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("An error occurred while adding the employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 py-8 w-96 mx-auto ">
      <h1 className="text-center font-semibold my-7 mb-8">
        <span className="text-2xl font-bold text-primary opacity-75">
          Add New Employee
        </span>
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="border p-3 rounded-lg"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="border p-3 rounded-lg"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className={`bg-primary text-white p-3 rounded-lg uppercase hover:opacity-95 ${
            loading ? "opacity-50 cursor-not-allowed" : "opacity-75"
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
}
