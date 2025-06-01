import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/BSERS-logo.svg";

const AccountNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === "/account" + path;
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Navigate to the home page instead of login page
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <header className="w-full fixed top-0 z-50 bg-black/40 backdrop-blur-md shadow-md">
      <nav className="flex items-center justify-between w-full px-5 sm:px-10 py-2">
        {/* Non-clickable logo */}
        <div>
          <img src={logo} alt="BSERS Logo" width={100} height={100} />
        </div>
        <h3 className="font-karla font-bold text-white text-xl">
          Barangay Dulong Bayan
        </h3>
        <div className="flex items-center space-x-6">
          <Link
            to="/account"
            className={`text-white py-1 px-3 rounded-full transition-all duration-200 
              ${
                isActive("")
                  ? "bg-white/50 text-blue-300"
                  : "hover:text-blue-300 hover:bg-white/50"
              }`}
          >
            Dashboard
          </Link>
          <Link
            to="/account/profile"
            className={`text-white py-1 px-3 rounded-full transition-all duration-200 
              ${
                isActive("/profile")
                  ? "bg-white/50 text-blue-300"
                  : "hover:text-blue-300 hover:bg-white/50"
              }`}
          >
            Account
          </Link>
          <button
            onClick={handleLogoutClick}
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-full text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 pt-[10vh] bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-white text-xl font-bold mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleLogoutCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AccountNav;
