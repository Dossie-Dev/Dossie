"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

interface Company {
  _id: string;
  name: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
}

export default function New() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "user"
  });

  const [selectedCompanyName, setSelectedCompanyName] = useState("Select Company");

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/company?active=true");
        const companiesData = response.data?.data?.data || [];
        if (Array.isArray(companiesData)) {
          setCompanies(companiesData);
        } else {
          console.error("Companies data is not an array:", companiesData);
          toast.error("Error loading companies data");
          setCompanies([]);
        }
      } catch (error) {
        toast.error("Failed to fetch companies");
        console.error("Error fetching companies:", error);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanySelect = (company: Company) => {
    if (!company._id) {
      toast.error("Invalid company selection");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      company: company._id
    }));
    setSelectedCompanyName(company.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.company) {
      toast.error("Please select a company");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post("/api/admin/useraccount", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company,
        role: "user"
      });
      
      toast.success("User added successfully!");
      router.push("/admin/users");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to add user";
      toast.error(errorMessage);
      console.error("Error adding user:", error.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3 py-8 w-96 mx-auto">
      <h1 className="text-center font-semibold my-7 mb-8">
        <span className="text-2xl font-bold text-primary opacity-75">
          Add New User
        </span>
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="form-control w-full">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="input input-bordered w-full"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-control w-full">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="input input-bordered w-full"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-control w-full">
          <div className="dropdown w-full">
            <div 
              tabIndex={0} 
              role="button" 
              className={`input input-bordered w-full flex items-center justify-between ${
                formData.company ? 'text-base-content' : 'text-gray-400'
              }`}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                selectedCompanyName
              )}
              <svg 
                className="h-4 w-4 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow mt-2 max-h-60 overflow-auto">
              {isLoading ? (
                <li className="text-center py-2">
                  <span className="loading loading-spinner loading-sm"></span>
                </li>
              ) : companies.length > 0 ? (
                companies.map((company) => (
                  <li key={company._id}>
                    <button 
                      type="button"
                      className="text-primary hover:bg-blue-500 hover:text-white"
                      onClick={() => handleCompanySelect(company)}
                    >
                      {company.name}
                    </button>
                  </li>
                ))
              ) : (
                <li><span className="text-gray-400 p-2">No companies available</span></li>
              )}
            </ul>
          </div>
        </div>

        <div className="form-control w-full">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-control w-full mt-2">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting || !formData.company}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Adding...
              </>
            ) : (
              'Add User'
            )}
          </button>
        </div>

        <Link
          href="/admin/users"
          className="btn btn-outline w-full"
        >
          Cancel
        </Link>
      </form>
    </div>
  );
}
