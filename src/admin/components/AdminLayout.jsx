import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";
import adminBg from "../assets/adminbg.png";

const AdminLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  // Get the current page title based on the path
  const getPageTitle = () => {
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("announcements")) return "Announcements";
    if (path.includes("hotlines")) return "Emergency Hotlines";
    if (path.includes("incident-reports")) return "Incident Reports";
    if (path.includes("appointments")) return "Appointments";
    if (path.includes("residents")) return "Residents Information";
    if (path.includes("settings")) return "Settings";
    return "Dashboard";
  };
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(30, 64, 175, 0.9), rgba(0, 0, 0, 0.8)), url(${adminBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <AdminNavbar />{" "}
      <div className="pt-20 px-4 sm:px-6 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[calc(100vh-100px)]">
            {/* Sidebar Column - Fixed width */}
            <div className="md:col-span-3">
              <div className="sticky top-20 h-full">
                <Sidebar />
              </div>
            </div>
            {/* Main Content Column - Fixed width */}
            <div className="md:col-span-9">
              <div className="backdrop-blur-sm bg-white/5 rounded-lg border border-white/20 shadow-xl p-6 min-h-[calc(100vh-230px)]">
                <h1 className="text-2xl my-2 font-karla font-bold text-white">
                  {getPageTitle()}
                </h1>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
