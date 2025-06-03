import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaFileAlt,
  FaCalendarAlt,
  FaBullhorn,
  FaChartLine,
  FaChartPie,
} from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    incidents: 0,
    appointments: 0,
    announcements: 0,
  });

  // Age distribution data for pie chart
  const ageDistributionData = {
    labels: ["0-18", "19-30", "31-45", "46-60", "61+"],
    datasets: [
      {
        label: "Age Distribution",
        data: [45, 76, 68, 42, 14],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(255, 99, 132, 0.8)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "white",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value * 100) / total) + "%";
            return `${label}: ${value} (${percentage})`;
          },
        },
      },
    },
  };

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setStats({
        users: 245,
        incidents: 18,
        appointments: 32,
        announcements: 12,
      });
    }, 1000);
  }, []);
  const StatCard = ({ icon, title, value, color }) => (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-5 transition-all duration-300 hover:bg-white/15 hover:shadow-xl h-full flex">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div
            className={`p-3 rounded-full ${color} text-white shadow-lg flex items-center justify-center h-12 w-12`}
          >
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-white text-base font-medium">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 auto-rows-fr">
        <StatCard
          icon={<FaUsers size={20} />}
          title="Total Residents"
          value={stats.users}
          color="bg-blue-500"
        />
        <StatCard
          icon={<FaFileAlt size={20} />}
          title="Incident Reports"
          value={stats.incidents}
          color="bg-red-500"
        />
        <StatCard
          icon={<FaCalendarAlt size={20} />}
          title="Appointments"
          value={stats.appointments}
          color="bg-green-500"
        />
        <StatCard
          icon={<FaBullhorn size={20} />}
          title="Announcements"
          value={stats.announcements}
          color="bg-yellow-500"
        />
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-4 col-span-1">
          <h3 className="text-xl font-karla font-bold text-white mb-4">
            Age Distribution
          </h3>
          <div className="p-2 h-64 flex items-center justify-center">
            <Pie data={ageDistributionData} options={pieChartOptions} />
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-4 col-span-1 lg:col-span-2">
          <h3 className="text-xl font-karla font-bold text-white mb-4">
            Demographics Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-white/20 rounded-lg bg-white/5">
              <h4 className="text-white font-medium mb-2">
                Gender Distribution
              </h4>
              <div className="flex justify-between">
                <p className="text-gray-300">Males</p>
                <p className="text-white font-medium">128 (52.2%)</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-300">Females</p>
                <p className="text-white font-medium">117 (47.8%)</p>
              </div>
            </div>
            <div className="p-4 border border-white/20 rounded-lg bg-white/5">
              <h4 className="text-white font-medium mb-2">Household Stats</h4>
              <div className="flex justify-between">
                <p className="text-gray-300">Total Households</p>
                <p className="text-white font-medium">87</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-300">Avg. Household Size</p>
                <p className="text-white font-medium">2.8</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-4">
          <h3 className="text-xl font-karla font-bold text-white mb-4">
            Recent Incident Reports
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-3 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <h4 className="text-white font-medium">Incident #{item}</h4>
                <p className="text-gray-300 text-sm">
                  Reported on {new Date().toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-300 hover:text-blue-100 text-sm font-medium">
            View All Reports
          </button>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-4">
          <h3 className="text-xl font-karla font-bold text-white mb-4">
            Upcoming Appointments
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-3 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <h4 className="text-white font-medium">Appointment #{item}</h4>
                <p className="text-gray-300 text-sm">
                  Scheduled for {new Date().toLocaleDateString()} at{" "}
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-300 hover:text-blue-100 text-sm font-medium">
            View All Appointments
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
