"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function New() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "employee",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/admin/employee", formData, {
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Employee added successfully!");
        router.push("/admin/employees");
      } else {
        toast.error("Failed to add employee. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add employee";
      toast.error(errorMessage);
      console.error("Error adding employee:", error.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary">
          Add New Employee
        </h1>
        <p className="text-gray-600 mt-2">
          Fill in the details to add a new employee
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter first name"
            className="input input-bordered w-full"
            value={formData.firstName}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter last name"
            className="input input-bordered w-full"
            value={formData.lastName}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Email Address</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-4 mt-6">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Adding Employee...
              </>
            ) : (
              'Add Employee'
            )}
          </button>

          <Link
            href="/admin/employees"
            className="btn btn-outline w-full"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
