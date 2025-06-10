import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/BSERS-logo.svg";
import { LoginButton } from "./buttons";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const adminStatus = localStorage.getItem("isAdmin") === "true";

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
      setIsAdmin(adminStatus);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
    navigate("/login");
  };
  return (
    <header className="w-full fixed top-0 z-50 bg-black/40 backdrop-blur-md shadow-md">
      <nav className="flex items-center justify-between w-full px-5 sm:px-10">
        <div className="flex items-center">
          {isLoggedIn ? (
            <Link to={isAdmin ? "/admin/dashboard" : "/account/dashboard"}>
              <img src={logo} alt="BSERS Logo" width={100} height={100} />
            </Link>
          ) : (
            <Link to="/">
              <img src={logo} alt="BSERS Logo" width={100} height={100} />
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  className="text-white hover:text-blue-300"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/account/dashboard"
                  className="text-white hover:text-blue-300"
                >
                  Dashboard
                </Link>
              )}
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
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
