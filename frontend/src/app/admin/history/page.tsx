"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function History() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();





  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/activity");
        
        if (response.data.status === "succcess" && Array.isArray(response.data.data.data)) {
          setActivities(response.data.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setActivities([]);
        }
      } catch (error) {
        setError("Error fetching activities: " + error.message);
      } finally {
        setLoading(false);
      }
    };
  


    const userRole = localStorage.getItem("userRole");
    
    if (userRole !== "admin") {
      router.push("/login");
    }


    fetchActivities();
  }, []);

  // Mapping activity types to custom notification messages
  const getActivityMessage = (activity) => {
    switch (activity.activity) {
      case "Scanned Document Saved":
        return `${activity.user.fullName} has successfully saved a scanned document.`;
      case "Register User Account":
        return `${activity.user.fullName} registered a new user account.`;
      case "Register Employee":
        return `${activity.user.fullName} registered a new employee.`;
      case "Deactivate Account":
        return `${activity.user.fullName} has deactivated an account.`;
      case "Activate Account":
        return `${activity.user.fullName} has activated an account.`;
      case "Login":
        return `${activity.user.fullName} logged in.`;
      default:
        return `${activity.user.fullName} performed an action: ${activity.activity}.`;
    }
  };

  return (
    <div className="p-6 w-full">
      {/* Breadcrumb Navigation */}
      <nav className="mb-4">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button onClick={() => router.push('/admin')} className="text-gray-500 hover:underline">Dashboard</button>
          </li>
          <li>/</li>
          <li className="text-gray-500 font-semibold">Activity History</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold mb-6 text-blue-500">Activity History</h1>
      {loading ? (
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
      ) : error ? (
        <div className="p-4 border rounded-lg shadow bg-red-100">
          <p className="font-semibold text-red-600">{error}</p>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {activities.map((activity) => (
            <div key={activity._id} className="flex items-center p-4 border rounded-lg shadow hover:shadow-lg transition-shadow">
              <img src={`https://ui-avatars.com/api/?name=${activity.user.fullName}`} alt={activity.user.fullName} className="w-12 h-12 rounded-full mr-4" />
              <div className="flex-1">
                <p className="font-semibold">{getActivityMessage(activity)} on <span className="font-medium text-blue-500">{new Date(activity.date).toLocaleString()}</span>.</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
