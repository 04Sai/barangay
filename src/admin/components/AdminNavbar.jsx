import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import BSERSLogo from "../../assets/BSERS-logo.svg";
import { getAdminProfile } from "../services/adminApi";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [adminRole, setAdminRole] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await getAdminProfile();
      if (response.success && response.admin) {
        setAdminName(`${response.admin.firstName} ${response.admin.lastName}`);
        setAdminRole(response.admin.role.replace("_", " "));
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    }
  };

  const handleLogout = () => {
    // Clear token and any admin-related data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    // Navigate to login page
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-900/40 backdrop-blur-lg border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/admin/dashboard"
              className="flex-shrink-0 flex items-center"
            >
              <img className="h-10 w-auto" src={BSERSLogo} alt="BSERS Logo" />
              <span className="ml-2 text-white font-karla font-bold text-xl">
                BSERS Admin
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {adminName && (
              <div className="bg-white/10 px-4 py-2 rounded-md">
                <span className="text-white font-medium">{adminName}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 backdrop-blur-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
