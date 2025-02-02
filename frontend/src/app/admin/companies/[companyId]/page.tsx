"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios"; 
import "react-toastify/dist/ReactToastify.css"; 

export default function EditCompany() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "", 
    address: "",
    city: "",
    state: "", 
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`/api/company/${params.companyId}`, {
          withCredentials: true
        });

        if (response.status === 200 && response.data?.data) {
          const company = response.data?.data?.data;
          setFormData({
            name: company.name || "",
            email: company.email || "",
            phoneNumber: company.phoneNumber?.toString() || "",
            address: company.address || "",
            city: company.city || "",
            state: company.state || ""
          });
        } else {
          toast.error("Failed to fetch company data");
          router.push("/admin/companies");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        const errorMessage = error.response?.data?.message || "Failed to fetch company data";
        toast.error(errorMessage);
        router.push("/admin/companies");
      } finally {
        setFetchLoading(false);
      }
    };

    if (params.companyId) {
      fetchCompanyData();
    }
  }, [params.companyId, router]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: ''
    };
    let isValid = true;

    // Name validation
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Company name must be at least 2 characters';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number (at least 10 digits)';
      isValid = false;
    }

    // Address validation
    if (formData.address.trim().length < 5) {
      newErrors.address = 'Please enter a valid address';
      isValid = false;
    }

    // City validation
    if (formData.city.trim().length < 2) {
      newErrors.city = 'Please enter a valid city';
      isValid = false;
    }

    // State validation
    if (formData.state.trim().length < 2) {
      newErrors.state = 'Please enter a valid state';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      const sanitizedValue = value.replace(/[^\d]/g, '');
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        phoneNumber: Number(formData.phoneNumber)
      };

      const response = await axios.patch(
        `/api/company/${params.companyId}`,
        dataToSend,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        toast.success("Company updated successfully!");
        router.push("/admin/companies");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      const errorMessage = error.response?.data?.message || "An error occurred while updating the company";

      // Handle validation errors from the server
      if (error.response?.data?.errors) {
        setErrors(prev => ({ ...prev, ...error.response.data.errors }));
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading company data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-primary text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Edit Company</h1>
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

        {/* Form Content */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter company name"
                className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                defaultValue={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="company@example.com"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                defaultValue={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter phone number"
                className={`input input-bordered w-full ${errors.phoneNumber ? 'input-error' : ''}`}
                defaultValue={formData.phoneNumber}
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

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter street address"
                className={`input input-bordered w-full ${errors.address ? 'input-error' : ''}`}
                defaultValue={formData.address}
                onChange={handleChange}
                required
              />
              {errors.address && (
                <p className="mt-1 text-sm text-error">{errors.address}</p>
              )}
            </div>

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  className={`input input-bordered w-full ${errors.city ? 'input-error' : ''}`}
                  defaultValue={formData.city}
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
                  defaultValue={formData.state}
                  onChange={handleChange}
                  required
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-error">{errors.state}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
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
                className={`flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Save Changes</span>
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
