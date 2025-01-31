"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Companies() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleAccountStatus = async (userId, currentStatus) => {
    try {
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
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const response = await axios.get("/api/company", { withCredentials: true });

        console.log("Response received:", response);
        const fetchedUsers = response.data?.data?.data || [];
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="pt-8 w-full mx-16 flex justify-center items-center gap-2">
        <label
          className="input input-bordered flex items-center gap-2"
          style={{ width: "700px" }}
        >
          <input
            type="text"
            className="grow"
            placeholder="Search"
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
        </label>

        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn px-8 text-primary">
            Sort
          </div>
          <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-56 p-2 shadow mt-2">
            <li>
              <a className="text-primary">Alphabet (A-Z)</a>
            </li>
            <li>
              <a className="text-primary">Alphabet (Z-A)</a>
            </li>
            <li>
              <a className="text-primary">Date (first - last)</a>
            </li>
            <li>
              <a className="text-primary">Date (last - first)</a>
            </li>
          </ul>
        </div>

        <Link
          href="/admin/companies/new"
          className="px-8 py-3 text-sm font-medium rounded-xl text-white bg-primary opacity-75 hover:opacity-100"
        >
          Add new Company
        </Link>
      </div>

      <div className="overflow-x-auto w-full mx-16 mt-4">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="hover cursor-pointer">
                  <th>{index + 1}</th>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>

                  <td>{user.role}</td>
                  <td>{user.active ? "Active" : "Inactive"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="px-8 py-2 rounded-xl hover:opacity-75 bg-blue-500 text-white">
                        Edit
                      </button>
                      <button
                        className={`px-8 py-2 rounded-xl hover:opacity-75 text-white ${
                          user.active ? "bg-red-500" : "bg-green-500"
                        }`}
                        onClick={() => toggleAccountStatus(user.id, user.active)}
                      >
                        {user.active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
