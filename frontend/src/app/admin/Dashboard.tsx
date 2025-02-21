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

  const name = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get("/api/stats/");
        const chartResponse = await axios.get("/api/stats/chart");
        const barChartResponse = await axios.get("/api/stats/login");

        setStats(statsResponse.data.data);

        // Transform chart data
        const chartData = chartResponse.data.data; // This is now an array of objects
        const labels = chartData.map(item => item.month); // Extracting months
        const values = chartData.map(item => item.value); // Extracting values
        setLineChartData({
          labels,
          datasets: [{
            label: "Documents Extracted",
            data: values,
            fill: false,
            borderColor: "#3B82F6",
            tension: 0.1,
          }],
        });

        // Transform bar chart data
        const barChartData = barChartResponse.data.data;
        const barLabels = Object.keys(barChartData);
        const barValues = Object.values(barChartData);
        setBarChartData({
          labels: barLabels,
          datasets: [{
            label: "Active Monthly Users",
            data: barValues,
            backgroundColor: "#3B82F6",
          }],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <h1 className="text-xl  mb-4 text-gray-500">Wellcome, <span className="text-blue-500 font-bold"> {name}!</span> </h1>
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
              <h2 className="text-lg font-semibold text-blue-500">Documents Extracted</h2>
              <Line data={lineChartData} options={options} />
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