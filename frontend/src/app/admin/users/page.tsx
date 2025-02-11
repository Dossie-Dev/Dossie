"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  company: string; 
  active: boolean;
  createdAt: string;
}

interface Company {
  _id: string;
  name: string;
  phoneNumber: number;
  email: string;
  address: string;
  city: string;
  state: string;
  createdAt: string;
  active: boolean;
}

type SortField = "name" | "email" | "date";
type SortOrder = "asc" | "desc";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [companyNames, setCompanyNames] = useState<{ [key: string]: string }>({});

  const fetchCompanyName = async (companyId: string) => {
    try {
      const response = await axios.get(`/api/company/${companyId}`);
      console.log("response",response);
      const company = response.data.data.data[0].name;
      console.log("company",company);
      return company;
    } catch (err) {
      console.error("Error fetching company name:", err);
    }
    return "Unknown Company"; 
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/users/?role=user", { withCredentials: true });
        const fetchedUsers = response.data?.data?.data || [];
        setUsers(fetchedUsers);

        const companyNameMap: { [key: string]: string } = {};
        for (const user of fetchedUsers) {
          const companyName = await fetchCompanyName(user.company);
          console.log("companyName",companyName);
          companyNameMap[user.company] = companyName;
        }
        setCompanyNames(companyNameMap);

        console.log("companyNames",companyNames);

        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const sortUsers = (a: User, b: User) => {
    if (sortField === "name") {
      return sortOrder === "asc" 
        ? a.fullName.localeCompare(b.fullName)
        : b.fullName.localeCompare(a.fullName);
    } else if (sortField === "email") {
      return sortOrder === "asc"
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
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

  const filteredUsers = users
    .filter((user) => {
      const searchValue = searchTerm.toLowerCase();
      return (
        user.fullName?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue) ||
        user.role?.toLowerCase().includes(searchValue)
      );
    })
    .sort(sortUsers);

  const toggleAccountStatus = async (userId: string, currentStatus: boolean) => {
    try {
      setIsUpdating(userId);
      const action = currentStatus ? "deactivate" : "activate";
      const url = `/api/admin/${action}account/${userId}`;
      const response = await axios.post(url, {}, { withCredentials: true });

      if (response.status === 200) {
        toast.success(`User ${action}d successfully!`);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, active: !currentStatus }
              : user
          )
        );
      } else {
        toast.error("Failed to update user status. Please try again.");
      }
    } catch (err) {
      console.error("Error toggling account status:", err);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsUpdating(null);
    }
  };

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

  return (
    <div className="container mx-auto px-4 md:px-8 py-4">
      <div className="breadcrumbs text-sm mb-4">
        <ul>
          <li><Link href="/admin/dashboard">Dashboard</Link></li>
          <li className="font-semibold">Users</li>
        </ul>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="w-full md:flex-1">
          <div className="join w-full">
            <div className="w-full">
              <div className="join-item input input-bordered flex items-center gap-2 w-full">
                <input
                  type="text"
                  className="grow"
                  placeholder="Search by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
              </div>
            </div>
            <div className="tooltip tooltip-bottom" data-tip={`Total users: ${filteredUsers.length}`}>
              <div className="join-item badge badge-neutral">{filteredUsers.length}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-outline btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
              </svg>
              Sort
              {sortField !== 'none' && (
                <div className="badge badge-sm badge-primary ml-2">
                  {sortField} {sortOrder === "asc" ? "↑" : "↓"}
                </div>
              )}
            </div>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-56 p-2 shadow-lg">
              <li>
                <button 
                  className={sortField === "name" ? "active" : ""}
                  onClick={() => handleSort("name")}
                >
                  Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </li>
              <li>
                <button 
                  className={sortField === "email" ? "active" : ""}
                  onClick={() => handleSort("email")}
                >
                  Email {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </li>
              <li>
                <button 
                  className={sortField === "date" ? "active" : ""}
                  onClick={() => handleSort("date")}
                >
                  Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </li>
            </ul>
          </div>

          <div className="tooltip tooltip-bottom" data-tip="Add new user">
            <Link
              href="/admin/users/new"
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add User
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-base-100 rounded-xl shadow-sm">
        {loading ? (
          <div className="p-8">
            <LoadingSkeleton />
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button onClick={() => window.location.reload()} className="btn btn-sm">Retry</button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="text-lg font-medium mb-2">
              {searchTerm ? "No users found matching your search" : "No users available"}
            </p>
            <p className="text-sm opacity-70">
              {searchTerm ? "Try adjusting your search terms" : "Add your first user to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover">
                    <th>{index + 1}</th>
                    <td className="font-medium">{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{companyNames[user.company] || "Loading..."}</td>
                    <td>
                      <span className={`badge ${user.active ? 'bg-green-500 text-white px-4 py-[0.8rem]' : 'text-white bg-red-500 p-4'} gap-2`}>
                        {user.active ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        )}
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="tooltip" data-tip={`${user.active ? 'Deactivate' : 'Activate'} user`}> 
                        <button
                          className={`btn btn-sm ${
                            user.active ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
                          } ${isUpdating === user.id ? "loading" : ""}`}
                          onClick={() => toggleAccountStatus(user.id, user.active)}
                          disabled={isUpdating === user.id}
                        >
                          {isUpdating === user.id ? "Updating..." : user.active ? "Deactivate" : "Activate"}
                        </button>
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