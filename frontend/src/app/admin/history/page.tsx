"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  
    fetchActivities();
  }, []);

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6 text-blue-500">Activity History</h1>
      {loading ? (
        <div className="p-4 border rounded-lg shadow bg-gray-100">
          <p className="font-semibold text-gray-600">Loading...</p>
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
                <p className="font-semibold">{activity.user.fullName} performed the activity: <span className="font-medium text-blue-500">{activity.activity}</span> on <span className="font-medium text-blue-500">{new Date(activity.date).toLocaleString()}</span>.</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
