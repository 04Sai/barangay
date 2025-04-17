import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/BSERS-logo.svg";

const AccountNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === "/account" + path;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="w-full fixed top-0 z-50 bg-black/40 backdrop-blur-md shadow-md">
      <nav className="flex items-center justify-between w-full px-5 sm:px-10 py-2">
        <Link to="/">
          <img src={logo} alt="BSERS Logo" width={100} height={100} />
        </Link>
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
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-full text-sm"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default AccountNav;
