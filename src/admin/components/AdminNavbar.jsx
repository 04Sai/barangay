import React from "react";
import { Link, useNavigate } from "react-router-dom";
import BSERSLogo from "../../assets/BSERS-logo.svg";

const AdminNavbar = () => {
  const navigate = useNavigate();
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
            {" "}

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
