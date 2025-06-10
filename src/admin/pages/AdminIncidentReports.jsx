import React, { useState, useEffect } from "react";
import { FaFileAlt, FaEye, FaTrash, FaCheckCircle } from "react-icons/fa";
import { IncidentReportsData } from "../../client/data/incidentReports";

const AdminIncidentReports = () => {
  // Use real data from the data file
  const [reports, setReports] = useState([]);

  // Load data from the imported data source
  useEffect(() => {
    setReports(IncidentReportsData);
  }, []);

  const [filter, setFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowDetails(true);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setReports(
      reports.map((report) =>
        report.id === id ? { ...report, status: newStatus } : report
      )
    );
    setShowDetails(false);
  };

  const handleDeleteReport = (id) => {
    setReports(reports.filter((report) => report.id !== id));
    if (selectedReport && selectedReport.id === id) {
      setShowDetails(false);
    }
  };

  const filteredReports =
    filter === "All"
      ? reports
      : reports.filter((report) => report.status === filter);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "In Progress":
        return "bg-blue-500";
      case "Resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-karla font-bold text-white">
          Incident Reports
        </h2>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => setFilter("All")}
            className={`px-3 py-1.5 rounded-lg text-white text-sm ${
              filter === "All" ? "bg-blue-500" : "bg-white/10"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("Pending")}
            className={`px-3 py-1.5 rounded-lg text-white text-sm ${
              filter === "Pending" ? "bg-yellow-500" : "bg-white/10"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("In Progress")}
            className={`px-3 py-1.5 rounded-lg text-white text-sm ${
              filter === "In Progress" ? "bg-blue-500" : "bg-white/10"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("Resolved")}
            className={`px-3 py-1.5 rounded-lg text-white text-sm ${
              filter === "Resolved" ? "bg-green-500" : "bg-white/10"
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {showDetails && selectedReport && (
        <div className="mb-6 backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-karla font-bold text-white mb-4">
              Incident Report Details
            </h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-white hover:bg-white/10 p-1 rounded-full"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-300 text-sm">Location:</p>
              <p className="text-white">{selectedReport.location}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Date & Time:</p>
              <p className="text-white">
                {formatDateTime(selectedReport.dateTime)}
              </p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Affected Individual:</p>
              <p className="text-white">{selectedReport.affectedName}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Contact Number:</p>
              <p className="text-white">{selectedReport.phoneNumber}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Incident Types:</p>
              <p className="text-white">{selectedReport.types.join(", ")}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Current Status:</p>
              <p
                className={`inline-block px-2 py-0.5 rounded text-white text-sm ${getStatusColor(
                  selectedReport.status
                )}`}
              >
                {selectedReport.status}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-300 text-sm">Description:</p>
              <p className="text-white">{selectedReport.description}</p>
            </div>
          </div>

          <div className="border-t border-white/20 pt-4 mt-4">
            <p className="text-gray-300 text-sm mb-2">Update Status:</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, "Pending")}
                className="px-3 py-1.5 bg-yellow-500 rounded-lg text-white text-sm"
              >
                Pending
              </button>
              <button
                onClick={() =>
                  handleUpdateStatus(selectedReport.id, "In Progress")
                }
                className="px-3 py-1.5 bg-blue-500 rounded-lg text-white text-sm"
              >
                In Progress
              </button>
              <button
                onClick={() =>
                  handleUpdateStatus(selectedReport.id, "Resolved")
                }
                className="px-3 py-1.5 bg-green-500 rounded-lg text-white text-sm"
              >
                Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <p className="text-white text-center py-4">
            No incident reports found.
          </p>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="backdrop-blur-md bg-white/5 rounded-lg border border-white/20 shadow-lg p-4"
            >
              <div className="flex justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <FaFileAlt className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {report.location}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-sm text-gray-300">
                        {formatDateTime(report.dateTime)}
                      </span>
                      <span className="text-sm text-gray-300">•</span>
                      <span className="text-sm text-gray-300">
                        {report.affectedName}
                      </span>
                      <span className="text-sm text-gray-300">•</span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-white text-xs ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="text-white/80 mt-2 line-clamp-2">
                      {report.description}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(report)}
                    className="p-2 text-white hover:bg-white/10 rounded-full"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="p-2 text-red-400 hover:bg-white/10 rounded-full"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminIncidentReports;
