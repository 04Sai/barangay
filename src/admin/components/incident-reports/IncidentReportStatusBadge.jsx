import React from "react";
import { FaClock, FaSearch, FaTools, FaCheck, FaTimes, FaBan } from "react-icons/fa";

const IncidentReportStatusBadge = ({ status, showIcon = false }) => {
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30';
      case 'investigating':
        return 'bg-blue-500/20 text-blue-200 border-blue-500/30';
      case 'in progress':
        return 'bg-orange-500/20 text-orange-200 border-orange-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-200 border-green-500/30';
      case 'closed':
        return 'bg-gray-500/20 text-gray-200 border-gray-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-200 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-200 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FaClock size={10} />;
      case 'investigating':
        return <FaSearch size={10} />;
      case 'in progress':
        return <FaTools size={10} />;
      case 'resolved':
        return <FaCheck size={10} />;
      case 'closed':
        return <FaTimes size={10} />;
      case 'cancelled':
        return <FaBan size={10} />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle(status)}`}>
      {showIcon && getStatusIcon(status) && (
        <span className="mr-1">
          {getStatusIcon(status)}
        </span>
      )}
      {status || 'Unknown'}
    </span>
  );
};

export default IncidentReportStatusBadge;
