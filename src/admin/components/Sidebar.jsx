import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBullhorn,
  FaChartBar,
  FaPhone,
  FaFileAlt,
  FaCalendarAlt,
  FaUsers,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaChartBar />,
      path: "/admin/dashboard",
    },
    {
      name: "Announcements",
      icon: <FaBullhorn />,
      path: "/admin/announcements",
    },
    {
      name: "Hotlines",
      icon: <FaPhone />,
      path: "/admin/hotlines",
    },
    {
      name: "Incident Reports",
      icon: <FaFileAlt />,
      path: "/admin/incident-reports",
    },
    {
      name: "Appointments",
      icon: <FaCalendarAlt />,
      path: "/admin/appointments",
    },
    {
      name: "Residents Info",
      icon: <FaUsers />,
      path: "/admin/residents",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/admin/settings",
    },
  ];
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-4 transition-all duration-300 hover:bg-white/15 h-full min-h-[calc(100vh-120px)]">
      <h2 className="text-xl font-karla font-bold text-white mb-6 border-b border-white/20 pb-2">
        Admin Panel
      </h2>
      <ul className="space-y-2 overflow-y-auto h-[calc(100%-4rem)]">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                path === item.path
                  ? "bg-blue-500 text-white"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
