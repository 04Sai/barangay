import React, { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaEye,
  FaTrash,
  FaEdit,
  FaPlus,
  FaExclamationTriangle,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSort,
  FaDownload,
} from "react-icons/fa";
import incidentReportService from "../services/incidentReportService";

const AdminIncidentReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({});

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    severity: "All",
    priority: "All",
    incidentTypes: "All",
    assignedDepartment: "All",
    isEmergency: undefined,
    dateFrom: "",
    dateTo: "",
  });

  // Selection for bulk operations
  const [selectedItems, setSelectedItems] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    incidentTypes: [],
    location: {
      address: "",
      coordinates: { latitude: "", longitude: "" },
      landmark: "",
    },
    dateTime: {
      occurred: new Date().toISOString().slice(0, 16),
    },
    reporter: {
      name: "",
      contactNumber: "",
      email: "",
      address: "",
      relationship: "Concerned Citizen",
    },
    affectedPersons: [],
    severity: "Medium",
    priority: "Normal",
    assignedTo: {
      department: "",
      officer: "",
      contactInfo: "",
    },
    isEmergency: false,
    tags: [],
  });

  const incidentTypes = [
    "Accident",
    "Crime",
    "Fire",
    "Medical Emergency",
    "Natural Disaster",
    "Public Disturbance",
    "Infrastructure Issue",
    "Environmental Hazard",
    "Traffic Incident",
    "Domestic Violence",
    "Theft/Robbery",
    "Vandalism",
    "Noise Complaint",
    "Animal Related",
    "Drug Related",
    "Other",
  ];

  const statuses = [
    "Pending",
    "Under Investigation",
    "In Progress",
    "Resolved",
    "Closed",
    "Rejected",
  ];
  const severities = ["Low", "Medium", "High", "Critical"];
  const priorities = ["Low", "Normal", "High", "Urgent"];
  const departments = [
    "Barangay Security",
    "Police",
    "Fire Department",
    "Medical Services",
    "Public Works",
    "Environmental Office",
    "Social Services",
    "Traffic Management",
    "Other",
  ];
  const relationships = [
    "Victim",
    "Witness",
    "Concerned Citizen",
    "Official",
    "Anonymous",
  ];

  // Load reports from database
  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await incidentReportService.getAllIncidentReports(filters);

      if (response.success) {
        setReports(response.data);
      } else {
        throw new Error(response.message || "Failed to load incident reports");
      }
    } catch (error) {
      console.error("Error loading reports:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await incidentReportService.getStatistics({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      });
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  useEffect(() => {
    loadReports();
    loadStats();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadReports();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else if (type === "checkbox") {
      if (name === "incidentTypes") {
        setFormData((prev) => ({
          ...prev,
          incidentTypes: checked
            ? [...prev.incidentTypes, value]
            : prev.incidentTypes.filter((type) => type !== value),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      incidentTypes: [],
      location: {
        address: "",
        coordinates: { latitude: "", longitude: "" },
        landmark: "",
      },
      dateTime: {
        occurred: new Date().toISOString().slice(0, 16),
      },
      reporter: {
        name: "",
        contactNumber: "",
        email: "",
        address: "",
        relationship: "Concerned Citizen",
      },
      affectedPersons: [],
      severity: "Medium",
      priority: "Normal",
      assignedTo: {
        department: "",
        officer: "",
        contactInfo: "",
      },
      isEmergency: false,
      tags: [],
    });
    setShowForm(true);
  };

  const handleEdit = (report) => {
    setEditingId(report._id);
    setFormData({
      title: report.title || "",
      description: report.description || "",
      incidentTypes: report.incidentTypes || [],
      location: {
        address: report.location?.address || "",
        coordinates: {
          latitude: report.location?.coordinates?.latitude || "",
          longitude: report.location?.coordinates?.longitude || "",
        },
        landmark: report.location?.landmark || "",
      },
      dateTime: {
        occurred:
          report.dateTime?.occurred &&
          new Date(report.dateTime.occurred).toISOString().slice(0, 16),
      },
      reporter: {
        name: report.reporter?.name || "",
        contactNumber: report.reporter?.contactNumber || "",
        email: report.reporter?.email || "",
        address: report.reporter?.address || "",
        relationship: report.reporter?.relationship || "Concerned Citizen",
      },
      affectedPersons: report.affectedPersons || [],
      severity: report.severity || "Medium",
      priority: report.priority || "Normal",
      assignedTo: {
        department: report.assignedTo?.department || "",
        officer: report.assignedTo?.officer || "",
        contactInfo: report.assignedTo?.contactInfo || "",
      },
      isEmergency: report.isEmergency || false,
      tags: report.tags || [],
    });
    setShowForm(true);
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowDetails(true);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await incidentReportService.updateIncidentReport(id, {
        status: newStatus,
      });
      if (response.success) {
        setReports(
          reports.map((report) =>
            report._id === id ? { ...report, status: newStatus } : report
          )
        );
        if (selectedReport && selectedReport._id === id) {
          setSelectedReport({ ...selectedReport, status: newStatus });
        }
        loadStats();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      if (editingId) {
        const response = await incidentReportService.updateIncidentReport(
          editingId,
          formData
        );
        if (response.success) {
          setReports(
            reports.map((item) => (item._id === editingId ? response.data : item))
          );
        } else {
          throw new Error(response.message || "Failed to update incident report");
        }
      } else {
        const response = await incidentReportService.createIncidentReport(formData);
        if (response.success) {
          setReports([response.data, ...reports]);
        } else {
          throw new Error(response.message || "Failed to create incident report");
        }
      }

      setShowForm(false);
      setEditingId(null);
      loadStats();
    } catch (error) {
      console.error("Error submitting report:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this incident report?")) {
      return;
    }

    try {
      setError(null);
      const response = await incidentReportService.deleteIncidentReport(id);
      if (response.success) {
        setReports(reports.filter((item) => item._id !== id));
        loadStats();
      } else {
        throw new Error(response.message || "Failed to delete incident report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      setError(error.message);
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      const response = await incidentReportService.bulkUpdateStatus(selectedItems, status);
      if (response.success) {
        loadReports();
        setSelectedItems([]);
        loadStats();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === reports.length
        ? []
        : reports.map((item) => item._id)
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Under Investigation":
        return "bg-blue-500";
      case "In Progress":
        return "bg-purple-500";
      case "Resolved":
        return "bg-green-500";
      case "Closed":
        return "bg-gray-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Low":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "High":
        return "bg-orange-500";
      case "Critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
  };

  if (loading) {
    return (
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-white text-2xl mr-3" />
          <span className="text-white text-lg">Loading incident reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats.overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Reports</p>
                <p className="text-2xl font-bold text-white">
                  {stats.overview.total}
                </p>
              </div>
              <FaFileAlt className="text-blue-400 text-2xl" />
            </div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.overview.pending}
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
                  {stats.overview.resolved}
                </p>
              </div>
              <FaCheckCircle className="text-green-400 text-2xl" />
            </div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Emergency</p>
                <p className="text-2xl font-bold text-red-400">
                  {stats.overview.emergency}
                </p>
              </div>
              <FaExclamationTriangle className="text-red-400 text-2xl" />
            </div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Critical</p>
                <p className="text-2xl font-bold text-orange-400">
                  {stats.overview.critical}
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
                  {stats.overview.resolutionRate}%
                </p>
              </div>
              <FaCheckCircle className="text-blue-400 text-2xl" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h2 className="text-2xl font-karla font-bold text-white">
            Incident Reports Management
          </h2>
          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate("Under Investigation")}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  <FaEye className="mr-1" /> Investigate
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate("Resolved")}
                  className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  <FaCheckCircle className="mr-1" /> Resolve
                </button>
              </div>
            )}
            <button
              onClick={handleAddNew}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus className="mr-2" />
              New Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
          <div className="relative xl:col-span-2">
            <input
              type="text"
              placeholder="Search reports..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 pl-10 text-white"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          >
            <option value="All">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            name="severity"
            value={filters.severity}
            onChange={handleFilterChange}
            className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          >
            <option value="All">All Severity</option>
            {severities.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          >
            <option value="All">All Priority</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>

          <select
            name="incidentTypes"
            value={filters.incidentTypes}
            onChange={handleFilterChange}
            className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          >
            <option value="All">All Types</option>
            {incidentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            placeholder="From Date"
            className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          />

          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            placeholder="To Date"
            className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Reports Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="bg-white/10 border-b border-white/20">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === reports.length &&
                      reports.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">Incident</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Reporter</th>
                <th className="px-4 py-3 text-left">Date/Time</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report._id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(report._id)}
                      onChange={() => handleSelectItem(report._id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {report.isEmergency ? (
                          <FaExclamationTriangle className="text-red-400" />
                        ) : (
                          <FaFileAlt className="text-blue-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{report.title}</div>
                        <div className="text-sm text-gray-300">
                          {report.incidentTypes?.join(", ")}
                        </div>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs text-white mt-1 ${getSeverityColor(
                            report.severity
                          )}`}
                        >
                          {report.severity}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <FaMapMarkerAlt className="inline mr-1 text-gray-400" />
                      {report.location?.address}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="flex items-center">
                        <FaUser className="mr-1 text-gray-400" />
                        {report.reporter?.name}
                      </div>
                      <div className="flex items-center mt-1">
                        <FaPhone className="mr-1 text-gray-400" />
                        {report.reporter?.contactNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {formatDateTime(report.dateTime?.occurred)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs text-white ${
                        report.priority === "Urgent"
                          ? "bg-red-500"
                          : report.priority === "High"
                          ? "bg-orange-500"
                          : report.priority === "Normal"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {report.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusUpdate(report._id, e.target.value)}
                      className={`text-xs rounded-full px-2 py-1 text-white border-0 ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(report)}
                        className="p-1.5 text-white hover:bg-white/10 rounded"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(report)}
                        className="p-1.5 text-white hover:bg-white/10 rounded"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(report._id)}
                        className="p-1.5 text-red-400 hover:bg-white/10 rounded"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <FaFileAlt className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-white text-lg">No incident reports found.</p>
            <p className="text-gray-300 mt-2">
              Click "New Report" to create your first incident report.
            </p>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 overflow-y-auto">
            <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 max-w-4xl w-full my-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-karla font-bold text-white">
                  {editingId ? "Edit Incident Report" : "New Incident Report"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-white hover:bg-white/10 p-2 rounded-full"
                >
                  <FaTimesCircle />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4 max-h-96 overflow-y-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">
                      Incident Date/Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="dateTime.occurred"
                      value={formData.dateTime.occurred}
                      onChange={handleInputChange}
                      required
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    disabled={submitting}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-1">
                      Location Address *
                    </label>
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleInputChange}
                      required
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Landmark</label>
                    <input
                      type="text"
                      name="location.landmark"
                      value={formData.location.landmark}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white mb-1">Severity</label>
                    <select
                      name="severity"
                      value={formData.severity}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    >
                      {severities.map((severity) => (
                        <option key={severity} value={severity}>
                          {severity}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white mb-1">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center text-white">
                      <input
                        type="checkbox"
                        name="isEmergency"
                        checked={formData.isEmergency}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="mr-2"
                      />
                      Emergency
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-1">Incident Types</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {incidentTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center text-white text-sm"
                      >
                        <input
                          type="checkbox"
                          name="incidentTypes"
                          value={type}
                          checked={formData.incidentTypes.includes(type)}
                          onChange={handleInputChange}
                          disabled={submitting}
                          className="mr-2"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <h4 className="text-white font-medium mb-3">
                    Reporter Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-1">
                        Reporter Name *
                      </label>
                      <input
                        type="text"
                        name="reporter.name"
                        value={formData.reporter.name}
                        onChange={handleInputChange}
                        required
                        disabled={submitting}
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-1">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        name="reporter.contactNumber"
                        value={formData.reporter.contactNumber}
                        onChange={handleInputChange}
                        required
                        disabled={submitting}
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-1">Email</label>
                      <input
                        type="email"
                        name="reporter.email"
                        value={formData.reporter.email}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-1">Relationship</label>
                      <select
                        name="reporter.relationship"
                        value={formData.reporter.relationship}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                      >
                        {relationships.map((rel) => (
                          <option key={rel} value={rel}>
                            {rel}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    disabled={submitting}
                    className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 flex items-center"
                  >
                    {submitting && <FaSpinner className="animate-spin mr-2" />}
                    {editingId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetails && selectedReport && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 max-w-4xl w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-karla font-bold text-white">
                  Incident Report Details
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-white hover:bg-white/10 p-2 rounded-full"
                >
                  <FaTimesCircle />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm">Title</p>
                    <p className="text-white font-medium">{selectedReport.title}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm">Status</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getStatusColor(
                        selectedReport.status
                      )}`}
                    >
                      {selectedReport.status}
                    </span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm">Severity</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getSeverityColor(
                        selectedReport.severity
                      )}`}
                    >
                      {selectedReport.severity}
                    </span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm">Priority</p>
                    <p className="text-white">{selectedReport.priority}</p>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <p className="text-gray-300 text-sm mb-1">Description</p>
                  <p className="text-white">{selectedReport.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm">Location</p>
                    <p className="text-white">{selectedReport.location?.address}</p>
                    {selectedReport.location?.landmark && (
                      <p className="text-gray-300 text-sm mt-1">
                        Near: {selectedReport.location.landmark}
                      </p>
                    )}
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm">Incident Types</p>
                    <p className="text-white">
                      {selectedReport.incidentTypes?.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <p className="text-gray-300 text-sm mb-2">Reporter Information</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-300 text-xs">Name</p>
                      <p className="text-white">{selectedReport.reporter?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-xs">Contact</p>
                      <p className="text-white">
                        {selectedReport.reporter?.contactNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-xs">Relationship</p>
                      <p className="text-white">
                        {selectedReport.reporter?.relationship}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm">Occurred Date/Time</p>
                    <p className="text-white">
                      {formatDateTime(selectedReport.dateTime?.occurred)}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm">Reported Date/Time</p>
                    <p className="text-white">
                      {formatDateTime(selectedReport.dateTime?.reported)}
                    </p>
                  </div>
                </div>

                {selectedReport.assignedTo?.department && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm mb-2">Assigned To</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-300 text-xs">Department</p>
                        <p className="text-white">
                          {selectedReport.assignedTo.department}
                        </p>
                      </div>
                      {selectedReport.assignedTo.officer && (
                        <div>
                          <p className="text-gray-300 text-xs">Officer</p>
                          <p className="text-white">
                            {selectedReport.assignedTo.officer}
                          </p>
                        </div>
                      )}
                      {selectedReport.assignedTo.contactInfo && (
                        <div>
                          <p className="text-gray-300 text-xs">Contact</p>
                          <p className="text-white">
                            {selectedReport.assignedTo.contactInfo}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedReport.updates && selectedReport.updates.length > 0 && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm mb-2">Recent Updates</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedReport.updates.slice(-5).map((update, index) => (
                        <div key={index} className="border-l-2 border-blue-500 pl-3">
                          <p className="text-white text-sm">{update.message}</p>
                          <p className="text-gray-300 text-xs">
                            {formatDateTime(update.updateDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleEdit(selectedReport)}
                    className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10"
                  >
                    Edit Report
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminIncidentReports;
