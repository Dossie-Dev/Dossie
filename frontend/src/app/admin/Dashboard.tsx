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

import Users from './Users'

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
    totalUsers: 0,
    activeCompanies: 0,
    pendingRequests: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get("/api/dashboard/stats");
        const usersResponse = await axios.get("/api/users");

        setStats(statsResponse.data);
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
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Example data for the bar chart
  const barChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Revenue",
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
           {/* Stats Cards */}
           <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow w-full flex items-center">
             
             <div>
               <h2 className="text-md font-semibold">Total Users</h2>
               <p className="text-4xl text-blue-500 font-bold">{stats.totalUsers}</p>
             </div>
           </div>
           
           <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow w-full flex items-center">
             
             <div>
               <h2 className="text-md font-semibold">Active Companies</h2>
               <p className="text-4xl text-blue-500 font-bold">{stats.activeCompanies}</p>
             </div>
           </div>
           
           <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow w-full flex items-center">
             
             <div>
               <h2 className="text-md font-semibold">Pending Requests</h2>
               <p className="text-4xl text-blue-500 font-bold">{stats.pendingRequests}</p>
             </div>
           </div>
           
           <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow w-full flex items-center">
            
             <div>
               <h2 className="text-md font-semibold">Total Revenue</h2>
               <p className="text-4xl text-blue-500 font-bold">${stats.totalRevenue}</p>
             </div>
           </div>
         </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Graphs */}
            <div className="bg-white p-4 rounded-lg shadow w-full">
              <h2 className="text-lg font-semibold">User Growth</h2>
              <Line data={lineChartData} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow w-full">
              <h2 className="text-lg font-semibold">Revenue Trends</h2>
              <Bar data={barChartData} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow w-full">
            <h2 className="text-lg font-semibold">User List</h2>
            <Users />
          </div>
        </>
      )}
    </div>
  );
}