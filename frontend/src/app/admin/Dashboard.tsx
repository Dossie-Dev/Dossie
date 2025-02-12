"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    no_of_users: 0,
    no_of_companies: 0,
    no_of_researchPapers: 0,
    no_of_employees: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get("/api/stats/");
        const usersResponse = await axios.get("/api/users");

        setStats(statsResponse.data.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Example data for the line chart
  const lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "User Growth",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "#3B82F6",
        tension: 0.1,
      },
    ],
  };

  // Example data for the bar chart
  const barChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Active Monthly Users",
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
        backgroundColor: "#3B82F6",
      },
    ],
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4 text-blue-500">Dashboard</h1>
      {loading ? (
        <div className="space-y-6">
          {/* Skeleton Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((card) => (
              <div key={card} className="bg-white p-4 rounded-lg shadow animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>

          {/* Skeleton Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[1, 2].map((chart) => (
              <div key={chart} className="bg-white p-4 rounded-lg shadow animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Stats Cards */}
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow w-full flex items-center">
              <div>
              <p className="text-4xl text-blue-500 font-bold">{stats.no_of_users}</p>
                <h2 className="text-md font-semibold mt-2">Total Users</h2>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow w-full flex items-center">
              <div>
              <p className="text-4xl text-blue-500 font-bold">{stats.no_of_employees}</p>
                <h2 className="text-md font-semibold mt-2">Total Employee</h2>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow w-full flex items-center">
              <div>
              <p className="text-4xl text-blue-500 font-bold">{stats.no_of_companies}</p>
                <h2 className="text-md font-semibold mt-2">Total Companies</h2>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow w-full flex items-center">
              <div>
              <p className="text-4xl text-blue-500 font-bold">{stats.no_of_researchPapers}</p>
                <h2 className="text-md font-semibold mt-2">Total Research Papers</h2>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Graphs */}
            <div className="bg-white p-4 rounded-lg shadow w-full">
              <h2 className="text-lg font-semibold text-blue-500">User Growth</h2>
              <Line data={lineChartData} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow w-full">
              <h2 className="text-lg font-semibold text-blue-500">Active Monthly Users</h2>
              <Bar data={barChartData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}