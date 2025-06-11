import React from "react";
import {
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const IncidentReportStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm">Total Reports</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <FaFileAlt className="text-blue-400 text-2xl" />
        </div>
      </div>
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">
              {stats.pending}
            </p>
          </div>
          <FaClock className="text-yellow-400 text-2xl" />
        </div>
      </div>
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm">Resolved</p>
            <p className="text-2xl font-bold text-green-400">
              {stats.resolved}
            </p>
          </div>
          <FaCheckCircle className="text-green-400 text-2xl" />
        </div>
      </div>
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm">Emergency</p>
            <p className="text-2xl font-bold text-red-400">{stats.emergency}</p>
          </div>
          <FaExclamationTriangle className="text-red-400 text-2xl" />
        </div>
      </div>
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm">Critical</p>
            <p className="text-2xl font-bold text-orange-400">
              {stats.critical}
            </p>
          </div>
          <FaExclamationTriangle className="text-orange-400 text-2xl" />
        </div>
      </div>
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm">Resolution Rate</p>
            <p className="text-2xl font-bold text-blue-400">
              {stats.resolutionRate}%
            </p>
          </div>
          <FaCheckCircle className="text-blue-400 text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default IncidentReportStatsCards;
