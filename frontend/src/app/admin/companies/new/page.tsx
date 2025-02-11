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
  const [errors, setErrors] = useState({
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
      setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      setLoading(false);
      return;
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setErrors(prev => ({ ...prev, phoneNumber: "Please enter a valid phone number (at least 10 digits)" }));
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
        setErrors({
          name: "",
          email: "",
          phoneNumber: "", 
          address: "",
          city: "",
          state: "", 
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
    <div className="max-w-2xl mx-auto  p-4 sm:px-6 lg:px-8">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li><Link href="/admin/dashboard">Dashboard</Link></li>
          <li><Link href="/admin/companies">Companies</Link></li>
          <li className="font-semibold">Add New Company</li>
        </ul>
      </div>
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="px-8 py-6 bg-blue-500 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Add New Company</h1>
            <Link
              href="/admin/companies"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              Back to Companies
            </Link>
          </div>
        </div>
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter company name"
                className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="company@example.com"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter phone number"
                className={`input input-bordered w-full ${errors.phoneNumber ? 'input-error' : ''}`}
                value={formData.phoneNumber}
                onChange={handleChange}
                pattern="[0-9]*"
                inputMode="numeric"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Numbers only, no spaces or special characters</p>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-error">{errors.phoneNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter street address"
                className={`input input-bordered w-full ${errors.address ? 'input-error' : ''}`}
                value={formData.address}
                onChange={handleChange}
                required
              />
              {errors.address && (
                <p className="mt-1 text-sm text-error">{errors.address}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  className={`input input-bordered w-full ${errors.city ? 'input-error' : ''}`}
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-error">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  className={`input input-bordered w-full ${errors.state ? 'input-error' : ''}`}
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-error">{errors.state}</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-4 pt-4">
              <Link
                href="/admin/companies"
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-500/90 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Add Company</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
