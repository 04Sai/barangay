import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Emergency Services", path: "/emergency-services" },
    { name: "Barangay Services", path: "/barangay-services" },
    { name: "Announcements", path: "/account/announcements" },
    // ...other nav items...
  ];

  return (
    <nav>
      <ul>
        {navItems.map((item) => (
          <li key={item.name}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;