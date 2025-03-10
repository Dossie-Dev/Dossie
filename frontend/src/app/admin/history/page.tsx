"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function History() {
  const [state, setState] = useState({
    activities: [],
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("/api/activity");

        if (response.data.status === "succcess" && Array.isArray(response.data.data.data)) {
          setState((prev) => ({ ...prev, activities: response.data.data.data }));
        } else {
          throw new Error("Unexpected response format from the server.");
        }
      } catch (error) {
        setState((prev) => ({ ...prev, error: error.message }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    const userRole = localStorage.getItem("userRole");

    if (userRole !== "admin") {
      router.push("/login");
    } else {
      fetchActivities();
    }
  }, [router]);

  const getActivityMessage = (activity) => {
    const user = activity.user || { fullName: "An unknown user" };
    const actions = {
      "Scanned Document Saved": `${user.fullName} has successfully saved a scanned document.`,
      "Register User Account": `${user.fullName} registered a new user account.`,
      "Register Employee": `${user.fullName} registered a new employee.`,
      "Deactivate Account": `${user.fullName} has deactivated an account.`,
      "Activate Account": `${user.fullName} has activated an account.`,
      "Login": `${user.fullName} logged in.`,
    };

    return actions[activity.activity] || `${user.fullName} performed an action: ${activity.activity}.`;
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-4 w-full">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center p-4 border rounded-lg shadow bg-gray-100 animate-pulse">
          <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderError = () => (
    <div className="p-4 border rounded-lg shadow bg-red-100">
      <p className="font-semibold text-red-600">{state.error}</p>
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-2 w-full">
      {state.activities.map((activity) => (
        <div key={activity._id} className="flex items-center p-4 border rounded-2xl hover:shadow-md transition-shadow">
          <img
            src={`https://ui-avatars.com/api/?name=${activity.user ? activity.user.fullName : "Unknown"}`}
            alt={activity.user ? activity.user.fullName : "Unknown"}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div className="flex-1">
            <p className="font-semibold">
              {getActivityMessage(activity)} on{" "}
              <span className="font-medium text-blue-500">
                {new Date(activity.date).toLocaleString()}
              </span>
              .
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 w-full">
      <nav className="mb-4">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button onClick={() => router.push("/admin")} className="text-gray-500 hover:underline">
              Dashboard
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-500 font-semibold">Activity History</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold mb-6 text-blue-500">Activity History</h1>
      {state.loading ? renderLoadingSkeleton() : state.error ? renderError() : renderActivities()}
    </div>
  );
}