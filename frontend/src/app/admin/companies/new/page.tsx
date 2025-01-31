"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios"; 
import "react-toastify/dist/ReactToastify.css"; 

export default function New() {
  const router = useRouter(); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "", 
    address: "",
    city: "",
    state: "", 
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      const sanitizedValue = value.replace(/[^\d]/g, '');
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);

    if (!formData.name || !formData.email || !formData.phoneNumber) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        phoneNumber: Number(formData.phoneNumber)
      };

      const response = await axios.post("/api/company/", dataToSend, {
        withCredentials: true, 
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Company added successfully!");
        setFormData({ 
          name: "", 
          email: "", 
          phoneNumber: "", 
          address: "", 
          city: "", 
          state: "" 
        });
        router.push("/admin/companies"); 
      } else {
        toast.error("Failed to add the company. Please try again.");
      }
    } catch (error) {
      console.error("Error adding company:", error);
      const errorMessage = error.response?.data?.message || "An error occurred while adding the company. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 py-8 w-96 mx-auto ">
      <h1 className="text-center font-semibold my-7 mb-8">
        <span className="text-2xl font-bold text-primary opacity-75">
          Add New Company
        </span>
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Company Name"
          className="border p-3 rounded-lg"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Company Email"
          className="border p-3 rounded-lg"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number (numbers only)"
          className="border p-3 rounded-lg"
          value={formData.phoneNumber}
          onChange={handleChange}
          pattern="[0-9]*"
          inputMode="numeric"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Company Address"
          className="border p-3 rounded-lg"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          className="border p-3 rounded-lg"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          className="border p-3 rounded-lg"
          value={formData.state}
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
          {loading ? "Adding..." : "Add Company"}
        </button>
      </form>
    </div>
  );
}
