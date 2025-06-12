import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/BSERS-logo.svg";
import { LoginButton } from "./buttons";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const adminData = localStorage.getItem("admin");

    // Reset state first
    setIsLoggedIn(false);
    setUser(null);
    setAdmin(null);
    setIsAdmin(false);

    if (token) {
      // Check if this is an admin session
      if (adminData) {
        try {
          const parsedAdmin = JSON.parse(adminData);
          if (parsedAdmin.role && parsedAdmin.username) {
            setIsLoggedIn(true);
            setAdmin(parsedAdmin);
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Invalid admin data:', error);
          // Clear invalid admin data
          localStorage.removeItem("admin");
        }
      }
      // Check if this is a client session
      else if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.firstName && parsedUser.email) {
            setIsLoggedIn(true);
            setUser(parsedUser);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Invalid user data:', error);
          // Clear invalid user data
          localStorage.removeItem("user");
        }
      }
    }
  }, [location]); // Re-run when location changes

  const handleLogout = () => {
    // Clear all session data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    localStorage.removeItem("isAdmin");

    setIsLoggedIn(false);
    setUser(null);
    setAdmin(null);
    setIsAdmin(false);
    navigate("/");
  };

  // Don't render navbar on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="w-full fixed top-0 z-50 bg-black/40 backdrop-blur-md shadow-md">
      <nav className="flex items-center justify-between w-full px-5 sm:px-10">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="BSERS Logo" width={100} height={100} />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {/* Only show client session info, never admin */}
          {isLoggedIn && !isAdmin ? (
            <>
              <Link
                to="/account/dashboard"
                className="text-white hover:text-blue-300"
              >
                Dashboard
              </Link>
              <span className="text-white">Welcome, {user?.firstName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <LoginButton onClick={() => navigate("/login")} />
              <Link
                to="/register"
                className="text-white hover:text-blue-400 ml-4"
              >
                Register
              </Link>
              <Link
                to="/admin/login"
                className="text-yellow-400 hover:text-yellow-300 ml-4"
              >
                Admin
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
