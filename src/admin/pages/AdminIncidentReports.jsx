import React, { useState, useEffect, useCallback } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSpinner, FaFilter } from "react-icons/fa";
import incidentReportService from "../services/incidentReportService";
import { formatDateTime } from "../utils/dateUtils";
import IncidentReportStatusBadge from "../components/incident-reports/IncidentReportStatusBadge";
import IncidentReportDetailsModal from "../components/incident-reports/IncidentReportDetailsModal";
import { containerStyles } from "../utils/formStyles";

const AdminIncidentReports = () => {
  const [incidentReports, setIncidentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: 'All',
    severity: 'All',
    priority: 'All',
    isEmergency: 'All'
  });

  // Fetch incident reports data
  const loadIncidentReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading incident reports with filters:', filters);
      
      const params = {};
      if (filters.status !== 'All') params.status = filters.status;
      if (filters.severity !== 'All') params.severity = filters.severity;
      if (filters.priority !== 'All') params.priority = filters.priority;
      if (filters.isEmergency !== 'All') params.isEmergency = filters.isEmergency === 'true';

      const response = await incidentReportService.getAllIncidentReports(params);

      if (response && response.success) {
        setIncidentReports(response.data || []);
        console.log('Successfully loaded incident reports:', response.data?.length || 0);
      } else {
        throw new Error(response?.message || "Failed to fetch incident reports");
      }
    } catch (err) {
      console.error("Error loading incident reports:", err);
      setError(`Failed to load incident reports: ${err.message}`);
      setIncidentReports([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadIncidentReports();
  }, [loadIncidentReports]);

  // Handle view details
  const handleViewDetails = async (reportId) => {
    try {
      setError(null);
      
      // First try to find the report in the current list
      const reportInList = incidentReports.find(report => 
        (report._id === reportId) || (report.id === reportId)
      );
      
      if (reportInList) {
        // Use the report from the list if available
        setSelectedReport(reportInList);
        setShowDetails(true);
        return;
      }
      
      // If not in list, try to fetch from API
      const response = await incidentReportService.getIncidentReportById(reportId);
      if (response && response.success) {
        setSelectedReport(response.data);
        setShowDetails(true);
      } else {
        throw new Error(response?.message || "Failed to fetch report details");
      }
    } catch (err) {
      console.error("Error fetching report details:", err);
      
      // Try to find the report in the current list as fallback
      const reportInList = incidentReports.find(report => 
        (report._id === reportId) || (report.id === reportId)
      );
      
      if (reportInList) {
        setSelectedReport(reportInList);
        setShowDetails(true);
      } else {
        setError(`Failed to fetch report details: ${err.message}`);
      }
    }
  };

  // Handle status update
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      const response = await incidentReportService.updateIncidentReport(id, {
        status: newStatus,
      });

      if (response && response.success) {
        setIncidentReports(
          incidentReports.map((report) =>
            report._id === id || report.id === id
              ? { ...report, status: newStatus }
              : report
          )
        );

        if (selectedReport && (selectedReport._id === id || selectedReport.id === id)) {
          setSelectedReport({ ...selectedReport, status: newStatus });
        }
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.message || "Failed to update report status");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this incident report?")) {
      try {
        setLoading(true);
        const response = await incidentReportService.deleteIncidentReport(id);

        if (response && response.success) {
          setIncidentReports(
            incidentReports.filter(
              (report) => report._id !== id && report.id !== id
            )
          );

          if (selectedReport && (selectedReport._id === id || selectedReport.id === id)) {
            setShowDetails(false);
          }
        } else {
          throw new Error(response.message || "Failed to delete report");
        }
      } catch (err) {
        console.error("Error deleting report:", err);
        setError(err.message || "Failed to delete incident report");
      } finally {
        setLoading(false);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'normal': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={containerStyles.mainContainer}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-karla font-bold text-white">
          Incident Reports
        </h2>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 backdrop-blur-md bg-white/10 rounded-lg border border-white/30">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <FaFilter className="mr-2" />
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-white text-sm mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white"
            >
              <option value="All" className="bg-gray-800">All</option>
              <option value="Pending" className="bg-gray-800">Pending</option>
              <option value="Investigating" className="bg-gray-800">Investigating</option>
              <option value="In Progress" className="bg-gray-800">In Progress</option>
              <option value="Resolved" className="bg-gray-800">Resolved</option>
              <option value="Closed" className="bg-gray-800">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-white text-sm mb-1">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({...filters, severity: e.target.value})}
              className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white"
            >
              <option value="All" className="bg-gray-800">All</option>
              <option value="Low" className="bg-gray-800">Low</option>
              <option value="Medium" className="bg-gray-800">Medium</option>
              <option value="High" className="bg-gray-800">High</option>
              <option value="Critical" className="bg-gray-800">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-white text-sm mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white"
            >
              <option value="All" className="bg-gray-800">All</option>
              <option value="Low" className="bg-gray-800">Low</option>
              <option value="Normal" className="bg-gray-800">Normal</option>
              <option value="High" className="bg-gray-800">High</option>
              <option value="Urgent" className="bg-gray-800">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-white text-sm mb-1">Emergency</label>
            <select
              value={filters.isEmergency}
              onChange={(e) => setFilters({...filters, isEmergency: e.target.value})}
              className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white"
            >
              <option value="All" className="bg-gray-800">All</option>
              <option value="true" className="bg-gray-800">Emergency</option>
              <option value="false" className="bg-gray-800">Regular</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-200 font-medium">Error loading incident reports:</p>
          <p className="text-red-300 text-sm mt-1">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadIncidentReports();
            }}
            className="mt-3 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 text-white rounded border border-red-500/50 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center my-8">
          <FaSpinner className="animate-spin text-white mr-2" />
          <span className="text-white">Loading incident reports...</span>
        </div>
      )}

      <div className={`overflow-x-auto ${containerStyles.contentContainer}`}>
        <table className="w-full text-white">
          <thead>
            <tr className="bg-white/10 border-b border-white/20">
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Reporter</th>
              <th className="px-4 py-3 text-left">Date Reported</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Severity</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Emergency</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidentReports.length === 0 && !loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-gray-300">
                  No incident reports found.
                </td>
              </tr>
            ) : (
              incidentReports.map((report) => (
                <tr
                  key={report._id || report.id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  {/* Title and Incident Types */}
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <p className="text-sm text-gray-400">
                        {report.incidentTypes?.join(", ")}
                      </p>
                    </div>
                  </td>
                  {/* Reporter */}
                  <td className="px-4 py-3">
                    {report.reporter?.name || "Anonymous"}
                  </td>
                  {/* Date Reported */}
                  <td className="px-4 py-3">
                    {formatDateTime(report.createdAt)}
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <IncidentReportStatusBadge status={report.status} />
                  </td>
                  {/* Severity */}
                  <td className="px-4 py-3">
                    <span className={getSeverityColor(report.severity)}>
                      {report.severity}
                    </span>
                  </td>
                  {/* Priority */}
                  <td className="px-4 py-3">
                    <span className={getPriorityColor(report.priority)}>
                      {report.priority}
                    </span>
                  </td>
                  {/* Emergency */}
                  <td className="px-4 py-3">
                    {report.isEmergency ? (
                      <span className="text-red-400 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(report._id || report.id)}
                        className="p-1.5 text-white hover:bg-white/10 rounded"
                        title="View details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(report._id || report.id)}
                        className="p-1.5 text-red-400 hover:bg-white/10 rounded"
                        title="Delete report"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div> {/* Closes the overflow-x-auto container div */}

      {/* Details Modal */}
      {showDetails && selectedReport && (
        <IncidentReportDetailsModal
          incident={selectedReport}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div> // Closes containerStyles.mainContainer div
  );
};

export default AdminIncidentReports;
