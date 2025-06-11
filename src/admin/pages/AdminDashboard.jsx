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
import {
  AppointmentsData,
  PeaceAndOrderData,
  NearbyHospitalsData,
  NearbyPoliceStationsData,
  NearbyFireStationsData,
  AnimalBiteCentersData,
  TowingServicesData,
} from "../../client/data/index";
import { ResidentsData } from "../../client/data/residents";
import { IncidentReportsData } from "../../client/data/incidentReports";
import announcementService from "../services/announcementService";
import incidentReportService from "../services/incidentReportService";
import appointmentService from "../services/appointmentService";
import residentService from "../services/residentService";
import { containerStyles } from "../utils/formStyles";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    incidents: 0,
    appointments: 0,
    announcements: 0,
  });

  const [ageDistribution, setAgeDistribution] = useState({
    labels: ["0-18", "19-30", "31-45", "46-60", "61+"],
    data: [0, 0, 0, 0, 0],
  });

  const [genderDistribution, setGenderDistribution] = useState({
    male: 0,
    female: 0,
  });

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Age distribution data for pie chart
  const ageDistributionData = {
    labels: ageDistribution.labels,
    datasets: [
      {
        label: "Age Distribution",
        data: ageDistribution.data,
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

  // Fetch data from APIs and static data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let totalResidents = 0;
        let totalAnnouncements = 0;
        let totalIncidents = 0;
        let totalAppointments = 0;

        // Fetch residents data from API
        try {
          const residentsResponse = await residentService.getAllResidents({
            limit: 1000,
          });
          totalResidents = residentsResponse.success
            ? residentsResponse.pagination?.totalItems ||
              residentsResponse.data.length
            : ResidentsData.length;
        } catch (error) {
          console.error("Error fetching residents for dashboard:", error);
          totalResidents = ResidentsData.length;
        }

        // Fetch announcements from API
        try {
          const announcementsResponse = await announcementService.getAllAnnouncements(
            {
              isActive: true,
              limit: 1000,
            }
          );
          totalAnnouncements = announcementsResponse.success
            ? announcementsResponse.pagination?.totalItems ||
              announcementsResponse.data.length
            : 0; // Don't use fallback static data
        } catch (error) {
          console.error("Error fetching announcements for dashboard:", error);
          totalAnnouncements = 0; // Set to 0 instead of using static data
        }

        // Fetch incidents from API
        try {
          const incidentsResponse = await incidentReportService.getAllIncidentReports(
            {
              limit: 1000,
            }
          );
          totalIncidents = incidentsResponse.success
            ? incidentsResponse.pagination?.totalItems ||
              incidentsResponse.data.length
            : IncidentReportsData.length;
        } catch (error) {
          console.error("Error fetching incidents for dashboard:", error);
          totalIncidents = IncidentReportsData.length;
        }

        // Fetch appointments from API
        try {
          const appointmentsResponse = await appointmentService.getAllAppointments(
            {
              limit: 1000,
            }
          );
          totalAppointments = appointmentsResponse.success
            ? appointmentsResponse.pagination?.totalItems ||
              appointmentsResponse.data.length
            : AppointmentsData.length;
        } catch (error) {
          console.error("Error fetching appointments for dashboard:", error);
          totalAppointments = AppointmentsData.length;
        }

        setStats({
          users: totalResidents,
          incidents: totalIncidents,
          appointments: totalAppointments,
          announcements: totalAnnouncements,
        });

        // Calculate age distribution (use static data for now, can be enhanced to use API data)
        const ageGroups = [0, 0, 0, 0, 0]; // [0-18, 19-30, 31-45, 46-60, 61+]
        let maleCount = 0;
        let femaleCount = 0;

        ResidentsData.forEach((resident) => {
          const age = calculateAge(resident.birthdate);

          // Count by gender
          if (resident.gender === "Male") maleCount++;
          else if (resident.gender === "Female") femaleCount++;

          // Count by age group
          if (age <= 18) ageGroups[0]++;
          else if (age <= 30) ageGroups[1]++;
          else if (age <= 45) ageGroups[2]++;
          else if (age <= 60) ageGroups[3]++;
          else ageGroups[4]++;
        });

        setAgeDistribution({
          labels: ["0-18", "19-30", "31-45", "46-60", "61+"],
          data: ageGroups,
        });

        setGenderDistribution({
          male: maleCount,
          female: femaleCount,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);
  const StatCard = ({ icon, title, value, color }) => (
    <div
      className={`${containerStyles.statCard} transition-all duration-300 hover:bg-white/15 hover:shadow-xl flex`}
    >
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
        <div className={`${containerStyles.cardContainer} col-span-1`}>
          <h3 className="text-xl font-karla font-bold text-white mb-4">
            Age Distribution
          </h3>
          <div className="p-2 h-64 flex items-center justify-center">
            <Pie data={ageDistributionData} options={pieChartOptions} />
          </div>
        </div>

        <div
          className={`${containerStyles.cardContainer} col-span-1 lg:col-span-2`}
        >
          <h3 className="text-xl font-karla font-bold text-white mb-4">
            Demographics Overview
          </h3>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-white/20 rounded-lg bg-white/5">
              <h4 className="text-white font-medium mb-2">
                Gender Distribution
              </h4>
              <div className="flex justify-between">
                <p className="text-gray-300">Males</p>
                <p className="text-white font-medium">
                  {genderDistribution.male} (
                  {Math.round(
                    (genderDistribution.male * 100) /
                      (genderDistribution.male + genderDistribution.female)
                  )}
                  %)
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-300">Females</p>
                <p className="text-white font-medium">
                  {genderDistribution.female} (
                  {Math.round(
                    (genderDistribution.female * 100) /
                      (genderDistribution.male + genderDistribution.female)
                  )}
                  %)
                </p>
              </div>
            </div>
            <div className="p-4 border border-white/20 rounded-lg bg-white/5">
              <h4 className="text-white font-medium mb-2">Household Stats</h4>
              <div className="flex justify-between">
                <p className="text-gray-300">Total Households</p>
                <p className="text-white font-medium">
                  {Math.round(ResidentsData.length / 2.8)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-300">Avg. Household Size</p>
                <p className="text-white font-medium">2.8</p>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={containerStyles.cardContainer}>
          <h3 className="text-xl font-karla font-bold text-white mb-4">
            Recent Incident Reports
          </h3>
          <div className="space-y-3 min-h-[200px]">
            {/* Updated to show message about real-time data */}
            <div className="p-3 border border-white/20 rounded-lg bg-white/5">
              <p className="text-white text-sm">Loading recent incidents...</p>
              <p className="text-gray-300 text-xs">
                Real-time data from database
              </p>
            </div>
          </div>
          <button className="mt-4 text-blue-300 hover:text-blue-100 text-sm font-medium">
            View All Reports
          </button>
        </div>

        <div className={containerStyles.cardContainer}>
          <h3 className="text-xl font-karla font-bold text-white mb-4">
            Upcoming Appointments
          </h3>
          <div className="space-y-3 min-h-[200px]">
            <div className="p-3 border border-white/20 rounded-lg bg-white/5">
              <p className="text-white text-sm">
                Loading upcoming appointments...
              </p>
              <p className="text-gray-300 text-xs">
                Real-time data from database
              </p>
            </div>
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
