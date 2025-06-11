import React from "react";
import { FaCheck, FaClock, FaTimes, FaCheckCircle } from "react-icons/fa";

const AppointmentStatusBadge = ({ status }) => {
  switch (status) {
    case "Confirmed":
      return (
        <span className="flex items-center px-2 py-1 text-xs rounded-full bg-green-500/30 text-green-300 border border-green-500/50">
          <FaCheck className="mr-1" /> Confirmed
        </span>
      );
    case "Pending":
      return (
        <span className="flex items-center px-2 py-1 text-xs rounded-full bg-yellow-500/30 text-yellow-300 border border-yellow-500/50">
          <FaClock className="mr-1" /> Pending
        </span>
      );
    case "Cancelled":
      return (
        <span className="flex items-center px-2 py-1 text-xs rounded-full bg-red-500/30 text-red-300 border border-red-500/50">
          <FaTimes className="mr-1" /> Cancelled
        </span>
      );
    case "Completed":
      return (
        <span className="flex items-center px-2 py-1 text-xs rounded-full bg-blue-500/30 text-blue-300 border border-blue-500/50">
          <FaCheckCircle className="mr-1" /> Completed
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-500/30 text-gray-300 border border-gray-500/50">
          {status}
        </span>
      );
  }
};

export default AppointmentStatusBadge;
