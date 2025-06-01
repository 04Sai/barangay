import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EmgergencyServicesData, BarangayServicesData } from "../constant";

// Import images directly to ensure they're available
import IncidentReport from "../../assets/services/IncidentReport.svg";
import MedicalAssistance from "../../assets/services/MedicalAssistance.svg";
import PoliceStation from "../../assets/services/PoliceStation.svg";
import FireStation from "../../assets/services/FireStation.svg";
import AnimalBite from "../../assets/services/AnimalBite.svg";
import Towing from "../../assets/services/Towing.svg";
import Announcement from "../../assets/services/Announcements.svg";
import HealthServices from "../../assets/services/HealthService.svg";
import PO from "../../assets/services/PO.svg";
import DocSer from "../../assets/services/DocSer.svg";
import Appt from "../../assets/services/Appt.svg";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  // Image mapping objects for both service types
  const emergencyImages = {
    "IncidentReport.svg": IncidentReport,
    "MedicalAssistance.svg": MedicalAssistance,
    "PoliceStation.svg": PoliceStation,
    "FireeStation.svg": FireStation,
    "AnimalBite.svg": AnimalBite,
    "Towing.svg": Towing,
  };

  const barangayImages = {
    "Announcement.svg": Announcement,
    "HealthServices.svg": HealthServices,
    "PO.svg": PO,
    "DocSer.svg": DocSer,
    "Appt.svg": Appt,
  };

  // Helper function to get the correct image path
  const getImagePath = (imgPath, isEmergency = true) => {
    if (!imgPath) return null;

    // Extract the filename from the path
    const filename = imgPath.split("/").pop();

    // Return the appropriate image based on the service type
    return isEmergency ? emergencyImages[filename] : barangayImages[filename];
  };

  // Helper function to create a link or display the service based on the service name
  const renderServiceItem = (service, isEmergency = true) => {
    // Create links for specific services
    if (service.name === "Incident Report") {
      return (
        <Link
          key={service.id}
          to="/account/incident-report"
          className="flex flex-col items-center justify-between h-44 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-28 mb-2">
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src={getImagePath(service.img, isEmergency)}
                alt={service.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/services/placeholder.svg";
                }}
              />
            </div>
          </div>
          <div className="h-14 flex items-center">
            <span className="text-center font-inter text-white text-lg mt-2 line-clamp-2 text-shadow">
              {service.name}
            </span>
          </div>
        </Link>
      );
    } else if (service.name === "Medical Assistance") {
      return (
        <Link
          key={service.id}
          to="/account/medical-assistance"
          className="flex flex-col items-center justify-between h-44 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-28 mb-2">
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src={getImagePath(service.img, isEmergency)}
                alt={service.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/services/placeholder.svg";
                }}
              />
            </div>
          </div>
          <div className="h-14 flex items-center">
            <span className="text-center font-inter text-white text-lg mt-2 line-clamp-2 text-shadow">
              {service.name}
            </span>
          </div>
        </Link>
      );
    } else if (service.name === "Police Station") {
      return (
        <Link
          key={service.id}
          to="/account/police-station"
          className="flex flex-col items-center justify-between h-44 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-28 mb-2">
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src={getImagePath(service.img, isEmergency)}
                alt={service.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/services/placeholder.svg";
                }}
              />
            </div>
          </div>
          <div className="h-14 flex items-center">
            <span className="text-center font-inter text-white text-lg mt-2 line-clamp-2 text-shadow">
              {service.name}
            </span>
          </div>
        </Link>
      );
    } else if (service.name === "Fire Station") {
      return (
        <Link
          key={service.id}
          to="/account/fire-station"
          className="flex flex-col items-center justify-between h-44 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-28 mb-2">
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src={getImagePath(service.img, isEmergency)}
                alt={service.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/services/placeholder.svg";
                }}
              />
            </div>
          </div>
          <div className="h-14 flex items-center">
            <span className="text-center font-inter text-white text-lg mt-2 line-clamp-2 text-shadow">
              {service.name}
            </span>
          </div>
        </Link>
      );
    } else if (service.name === "Animal Bite Center") {
      return (
        <Link
          key={service.id}
          to="/account/animal-bite-center"
          className="flex flex-col items-center justify-between h-44 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-28 mb-2">
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src={getImagePath(service.img, isEmergency)}
                alt={service.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/services/placeholder.svg";
                }}
              />
            </div>
          </div>
          <div className="h-14 flex items-center">
            <span className="text-center font-inter text-white text-lg mt-2 line-clamp-2 text-shadow">
              {service.name}
            </span>
          </div>
        </Link>
      );
    } else if (service.name === "Towing Services and Assistance") {
      return (
        <Link
          key={service.id}
          to="/account/towing-assistance"
          className="flex flex-col items-center justify-between h-44 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-28 mb-2">
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src={getImagePath(service.img, isEmergency)}
                alt={service.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/services/placeholder.svg";
                }}
              />
            </div>
          </div>
          <div className="h-14 flex items-center">
            <span className="text-center font-inter text-white text-lg mt-2 line-clamp-2 text-shadow">
              {service.name}
            </span>
          </div>
        </Link>
      );
    } else if (service.name === "Peace and Order") {
      return (
        <Link
          key={service.id}
          to="/account/peace-and-order"
          className="flex flex-col items-center justify-between h-44 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-28 mb-2">
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src={getImagePath(service.img, isEmergency)}
                alt={service.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/services/placeholder.svg";
                }}
              />
            </div>
          </div>
          <div className="h-14 flex items-center">
            <span className="text-center font-inter text-white text-lg mt-2 line-clamp-2 text-shadow">
              {service.name}
            </span>
          </div>
        </Link>
      );
    } else if (service.name === "Document Services") {
      return (
        <Link
          key={service.id}
          to="/account/document-services"
          className="flex flex-col items-center justify-between h-44 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-28 mb-2">
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src={getImagePath(service.img, isEmergency)}
                alt={service.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/services/placeholder.svg";
                }}
              />
            </div>
          </div>
          <div className="h-14 flex items-center">
            <span className="text-center font-inter text-white text-lg mt-2 line-clamp-2 text-shadow">
              {service.name}
            </span>
          </div>
        </Link>
      );
    } else if (service.name === "Barangay Announcements") {
      return (
        <Link
          key={service.id}
          to="/account/announcements"
          className="flex flex-col items-center justify-between h-44 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-28 mb-2">
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src={getImagePath(service.img, isEmergency)}
                alt={service.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/services/placeholder.svg";
                }}
              />
            </div>
          </div>
          <div className="h-14 flex items-center">
            <span className="text-center font-inter text-white text-lg mt-2 line-clamp-2 text-shadow">
              {service.name}
            </span>
          </div>
        </Link>
      );
    } else if (service.name === "Health Services") {
      return (
        <Link
          key={service.id}
          to="/account/health-services"
          className="flex flex-col items-center justify-between h-44 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-28 mb-2">
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src={getImagePath(service.img, isEmergency)}
                alt={service.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/services/placeholder.svg";
                }}
              />
            </div>
          </div>
          <div className="h-14 flex items-center">
            <span className="text-center font-inter text-white text-lg mt-2 line-clamp-2 text-shadow">
              {service.name}
            </span>
          </div>
        </Link>
      );
    } else if (service.name === "View Appointments") {
      return (
        <Link
          key={service.id}
          to="/account/appointments"
          className="flex flex-col items-center justify-between h-44 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-28 mb-2">
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src={getImagePath(service.img, isEmergency)}
                alt={service.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/services/placeholder.svg";
                }}
              />
            </div>
          </div>
          <div className="h-14 flex items-center">
            <span className="text-center font-inter text-white text-lg mt-2 line-clamp-2 text-shadow">
              {service.name}
            </span>
          </div>
        </Link>
      );
    }
  };

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }

    // Set current date
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(now.toLocaleDateString("en-US", options));
  }, []);

  return (
    <div className="pt-28 pb-10 px-4 sm:px-6">
      <div className="screen-max-width mx-auto">
        {/* Glassmorphism container */}
        <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-karla font-bold text-white">
              Welcome, {userData?.firstName || "User"}
            </h2>
            <p className="text-white font-inter">{currentDate}</p>
          </div>

          {/* Dashboard content can be added here */}
          <div className="mt-8 backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
            {/* Emergency Services Section */}
            <div>
              <h3 className="text-xl font-karla font-bold text-white mb-4">
                Emergency Services
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {EmgergencyServicesData.map((service) =>
                  renderServiceItem(service, true)
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 border-t border-white/30"></div>

            {/* Barangay Services Section */}
            <div>
              <h3 className="text-xl font-karla font-bold text-white mb-4">
                Barangay Services
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {BarangayServicesData.map((service) =>
                  renderServiceItem(service, false)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
