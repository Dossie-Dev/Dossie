"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import debounce from 'lodash/debounce';

interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

type SortField = "name" | "email" | "role" | "date";
type SortOrder = "asc" | "desc";

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setIsSearching(false);
    }, 300),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    debouncedSearch(e.target.value);
  };

  const toggleAccountStatus = async (employeeId: string, currentStatus: boolean) => {
    try {
      setIsUpdating(employeeId);
      const action = currentStatus ? "deactivate" : "activate";
      const url = `/api/admin/${action}account/${employeeId}`;
      const response = await axios.post(url, {}, { withCredentials: true });

      if (response.status === 200) {
        toast.success(`Employee ${action}d successfully!`);
        setEmployees((prevEmployees) =>
          prevEmployees.map((employee) =>
            employee.id === employeeId
              ? { ...employee, active: !currentStatus }
              : employee
          )
        );
      } else {
        toast.error("Failed to update employee status. Please try again.");
      }
    } catch (err) {
      console.error("Error toggling account status:", err);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsUpdating(null);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/users/?role=employee", { withCredentials: true });
        const fetchedEmployees = response.data?.data?.data || [];
        setEmployees(fetchedEmployees);
        setError(null);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to fetch employees. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const sortEmployees = (a: Employee, b: Employee) => {
    if (sortField === "name") {
      return sortOrder === "asc" 
        ? a.fullName.localeCompare(b.fullName)
        : b.fullName.localeCompare(a.fullName);
    } else if (sortField === "email") {
      return sortOrder === "asc"
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    } else if (sortField === "role") {
      return sortOrder === "asc"
        ? a.role.localeCompare(b.role)
        : b.role.localeCompare(a.role);
    } else {
      return sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredEmployees = employees
    .filter((employee) => {
      const searchValue = searchTerm.toLowerCase();
      return (
        employee.fullName?.toLowerCase().includes(searchValue) ||
        employee.email?.toLowerCase().includes(searchValue) ||
        employee.role?.toLowerCase().includes(searchValue)
      );
    })
    .sort(sortEmployees);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by adding a new employee.</p>
      <div className="mt-6">
        <Link
          href="/admin/employees/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-500-focus"
        >
          Add Employee
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2 w-full m-4">
      <div className="breadcrumbs text-sm px-4 -mb-4">
        <ul>
          <li><Link href="/admin">Dashboard</Link></li>
          <li className="font-semibold">Employees</li>
        </ul>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
        <div className="w-full md:flex-1">
          <div className="join w-full">
            <div className="w-full">
              <div className="join-item input input-bordered flex items-center gap-2 w-full">
                <input
                  type="text"
                  className="grow"
                  placeholder="Search by name, email, or role..."
                  onChange={handleSearch}
                />
                {isSearching ? (
                  <div className="loading loading-spinner loading-sm"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="tooltip tooltip-bottom">
              <div className="join-item badge badge-neutral">{filteredEmployees.length}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-outline btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
              </svg>
              Sort
              {sortField !== 'none' && (
                <div className="badge badge-sm badge-primary ml-2">
                  {sortField} {sortOrder === "asc" ? "↑" : "↓"}
                </div>
              )}
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-56 p-2 shadow-lg">
              <li><a className={sortField === "name" ? "active" : ""} onClick={() => handleSort("name")}>Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}</a></li>
              <li><a className={sortField === "email" ? "active" : ""} onClick={() => handleSort("email")}>Email {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}</a></li>
              <li><a className={sortField === "role" ? "active" : ""} onClick={() => handleSort("role")}>Role {sortField === "role" && (sortOrder === "asc" ? "↑" : "↓")}</a></li>
              <li><a className={sortField === "date" ? "active" : ""} onClick={() => handleSort("date")}>Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}</a></li>
            </ul>
          </div>

          <div className="tooltip tooltip-bottom" data-tip="Add new employee">
            <Link
              href="/admin/employees/new"
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Employee
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button onClick={() => window.location.reload()} className="btn btn-sm">Retry</button>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-base-200">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                <th>#</th>

                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee, index) => (
                  <tr key={employee.id} className="hover">
                                        <th>{index + 1}</th>

                    <td className="font-medium">{employee.fullName}</td>
                    <td>{employee.email}</td>
                   
                    <td>
                      <span className={`badge ${employee.active ? 'bg-green-500 text-white px-4 py-[0.8rem]' : 'text-white bg-red-500 p-4'} gap-2`}>
                        {employee.active ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        {employee.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="tooltip" data-tip={new Date(employee.createdAt).toLocaleString()}>
                        {new Date(employee.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <div className="tooltip" data-tip={`${employee.active ? 'Deactivate' : 'Activate'} employee`}>
                          <button
                            className={`btn btn-sm ${
                              employee.active ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
                            } ${isUpdating === employee.id ? "loading" : ""}`}
                            onClick={() => toggleAccountStatus(employee.id, employee.active)}
                            disabled={isUpdating === employee.id}
                          >
                            {!isUpdating && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {employee.active ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                )}
                              </svg>
                            )}
                            {isUpdating === employee.id ? 
                              "Updating..." : 
                              employee.active ? "Deactivate" : "Activate"
                            }
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
