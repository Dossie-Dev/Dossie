"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
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
import Link from "next/link";

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

// Icons for stats cards and quick actions
const ICONS = {
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7M6.5 7.5a5.5 5.5 0 1 1 11 0a5.5 5.5 0 0 1-11 0M3 19a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v3H3zm5-3a3 3 0 0 0-3 3v1h14v-1a3 3 0 0 0-3-3z" />
    </svg>
  ),
  employees: (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 9c0 5.33-8 5.33-8 0h2c0 2.67 4 2.67 4 0m6 9v3H4v-3c0-2.67 5.33-4 8-4s8 1.33 8 4m-1.9 0c0-.64-3.13-2.1-6.1-2.1S5.9 17.36 5.9 18v1.1h12.2M12.5 2c.28 0 .5.22.5.5v3h1V3a3.89 3.89 0 0 1 2.25 3.75s.7.14.75 1.25H7c0-1.11.75-1.25.75-1.25A3.89 3.89 0 0 1 10 3v2.5h1v-3c0-.28.22-.5.5-.5" />
    </svg>
  ),
  companies: (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 15h-2v2h2m0-6h-2v2h2m2 6h-8v-2h2v-2h-2v-2h2v-2h-2V9h8M10 7H8V5h2m0 6H8V9h2m0 6H8v-2h2m0 6H8v-2h2m6-10V3H2v18h20V7z" />
    </svg>
  ),
  researchPapers: (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.143 22H8.286A4.286 4.286 0 0 1 4 17.714V6.286A4.286 4.286 0 0 1 8.286 2h4.008a3.5 3.5 0 0 1 2.304.866l3.635 3.18a3.5 3.5 0 0 1 1.196 2.635v9.033A4.286 4.286 0 0 1 15.143 22m0-2H8.286A2.286 2.286 0 0 1 6 17.714V6.286A2.286 2.286 0 0 1 8.286 4h4.008a1.5 1.5 0 0 1 .987.371l3.635 3.18a1.5 1.5 0 0 1 .513 1.13v9.033A2.286 2.286 0 0 1 15.143 20" />
      <path d="M13 3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h2.5a1 1 0 1 1 0 2H15a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1" />
    </svg>
  ),
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    no_of_users: 0,
    no_of_companies: 0,
    no_of_researchPapers: 0,
    no_of_employees: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Documents Extracted",
        data: [],
        fill: false,
        borderColor: "#3B82F6",
        tension: 0.1,
      },
    ],
  });
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Active Monthly Users",
        data: [],
        backgroundColor: "#3B82F6",
      },
    ],
  });
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get("/api/stats/");
        const chartResponse = await axios.get("/api/stats/chart");
        const barChartResponse = await axios.get("/api/stats/login");

        setStats(statsResponse.data.data);

        const chartData = chartResponse.data.data;
        const labels = chartData.map((item) => item.month);
        const values = chartData.map((item) => item.value);
        setLineChartData({
          labels,
          datasets: [
            {
              label: "Documents Extracted",
              data: values,
              fill: false,
              borderColor: "#3B82F6",
              tension: 0.1,
            },
          ],
        });

        const barChartData = barChartResponse.data.data;
        const barLabels = Object.keys(barChartData);
        const barValues = Object.values(barChartData);
        setBarChartData({
          labels: barLabels,
          datasets: [
            {
              label: "Active Monthly Users",
              data: barValues,
              backgroundColor: "#3B82F6",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const username = localStorage.getItem("username");
    setName(username);
  }, []);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => value.toString(),
        },
      },
    },
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-xl mb-4 text-gray-500">
        Welcome, <span className="text-blue-500 font-bold"> {name}</span>
      </h1>
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

          {/* Skeleton Quick Actions */}
          <div className="bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((action) => (
                <div key={action} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Improved Stats Cards */}
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-4 border-l-4 border-blue-500">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">{ICONS.users}</div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.no_of_users}</p>
                <h2 className="text-sm font-medium text-gray-600 mt-1">Total Users</h2>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-4 border-l-4 border-green-500">
              <div className="p-2 rounded-full bg-green-100 text-green-600">{ICONS.employees}</div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.no_of_employees}</p>
                <h2 className="text-sm font-medium text-gray-600 mt-1">Total Employees</h2>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-4 border-l-4 border-purple-500">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">{ICONS.companies}</div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.no_of_companies}</p>
                <h2 className="text-sm font-medium text-gray-600 mt-1">Total Companies</h2>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-4 border-l-4 border-orange-500">
              <div className="p-2 rounded-full bg-orange-100 text-orange-600">{ICONS.researchPapers}</div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.no_of_researchPapers}</p>
                <h2 className="text-sm font-medium text-gray-600 mt-1">Total Research Papers</h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Graphs */}
            <div className="bg-white p-4 rounded-lg shadow w-full">
              <h2 className="text-lg font-semibold text-blue-500">Documents Extracted</h2>
              <Line data={lineChartData} options={options} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow w-full">
              <h2 className="text-lg font-semibold text-blue-500">Active Monthly Users</h2>
              <Bar data={barChartData} />
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-blue-500 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/new"
                className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                {ICONS.researchPapers}
                <span>Add New Document</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
              >
                {ICONS.users}
                <span>Manage Users</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}