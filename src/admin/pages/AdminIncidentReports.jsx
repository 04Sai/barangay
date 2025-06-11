import React, { useState, useEffect, useCallback } from "react";
import {
  FaFileAlt,
  FaPlus,
  FaSpinner,
  FaSearch,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";
import incidentReportService from "../services/incidentReportService";
import IncidentReportStatsCards from "../components/incidentReports/IncidentReportStatsCards";
import IncidentReportTable from "../components/incidentReports/IncidentReportTable";
import IncidentReportDetailsModal from "../components/incidentReports/IncidentReportDetailsModal";
import IncidentReportFormModal from "../components/incidentReports/IncidentReportFormModal";
import {
  incidentTypes,
  statuses,
  severities,
  priorities,
  departments,
  relationships,
} from "../utils/incidentReportConstants";
import { dropdownStyles, containerStyles } from "../utils/formStyles";

const AdminIncidentReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
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

  // Form data initial state
  const initialFormData = {
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
  };

  // Load reports from database
  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await incidentReportService.getAllIncidentReports(
        filters
      );

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
  }, [filters]);

  // Load statistics
  const loadStats = useCallback(async () => {
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
  }, [filters.dateFrom, filters.dateTo]);

  useEffect(() => {
    loadReports();
    loadStats();
  }, [loadReports, loadStats]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Use initialFormData when creating a new report
  const handleAddNew = () => {
    setEditingId(null);
    setSelectedReport({ ...initialFormData }); // Use initialFormData
    setShowForm(true);
  };

  const handleEdit = (report) => {
    setEditingId(report._id);
    setSelectedReport(report);
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

  const handleSubmit = async (formData) => {
    try {
      setError(null);

      if (editingId) {
        const response = await incidentReportService.updateIncidentReport(
          editingId,
          formData
        );
        if (response.success) {
          setReports(
            reports.map((item) =>
              item._id === editingId ? response.data : item
            )
          );
        } else {
          throw new Error(
            response.message || "Failed to update incident report"
          );
        }
      } else {
        const response = await incidentReportService.createIncidentReport(
          formData
        );
        if (response.success) {
          setReports([response.data, ...reports]);
        } else {
          throw new Error(
            response.message || "Failed to create incident report"
          );
        }
      }

      setShowForm(false);
      setEditingId(null);
      loadStats();
      return true;
    } catch (error) {
      console.error("Error submitting report:", error);
      setError(error.message);
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this incident report?")
    ) {
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
      const response = await incidentReportService.bulkUpdateStatus(
        selectedItems,
        status
      );
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

  // Export handleAssignDepartment for use in child components
  const handleAssignDepartment = (id, deptName) => {
    if (!departments.includes(deptName)) {
      console.warn(`Department "${deptName}" is not in the approved list`);
      return;
    }

    // Update the incident report with the new department
    incidentReportService
      .updateIncidentReport(id, {
        status: "Under Investigation",
        "assignedTo.department": deptName,
      })
      .then((response) => {
        if (response.success) {
          loadReports(); // Reload reports after update

          // Update the selected report if it's the one being viewed
          if (selectedReport && selectedReport._id === id) {
            setSelectedReport({
              ...selectedReport,
              status: "Under Investigation",
              assignedTo: {
                ...selectedReport.assignedTo,
                department: deptName,
              },
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error assigning department:", error);
        setError("Failed to assign department: " + error.message);
      });
  };

  if (loading && reports.length === 0) {
    return (
      <div className={containerStyles.mainContainer}>
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-white text-2xl mr-3" />
          <span className="text-white text-lg">
            Loading incident reports...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats.overview && <IncidentReportStatsCards stats={stats.overview} />}

      {/* Main Content */}
      <div className={containerStyles.mainContainer}>
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
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            <option value="All" style={dropdownStyles.option}>
              All Status
            </option>
            {statuses.map((status) => (
              <option key={status} value={status} style={dropdownStyles.option}>
                {status}
              </option>
            ))}
          </select>

          <select
            name="severity"
            value={filters.severity}
            onChange={handleFilterChange}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            <option value="All" style={dropdownStyles.option}>
              All Severity
            </option>
            {severities.map((severity) => (
              <option
                key={severity}
                value={severity}
                style={dropdownStyles.option}
              >
                {severity}
              </option>
            ))}
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            <option value="All" style={dropdownStyles.option}>
              All Priority
            </option>
            {priorities.map((priority) => (
              <option
                key={priority}
                value={priority}
                style={dropdownStyles.option}
              >
                {priority}
              </option>
            ))}
          </select>

          <select
            name="incidentTypes"
            value={filters.incidentTypes}
            onChange={handleFilterChange}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            <option value="All" style={dropdownStyles.option}>
              All Types
            </option>
            {incidentTypes.map((type) => (
              <option key={type} value={type} style={dropdownStyles.option}>
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
        <div className={containerStyles.contentContainer}>
          <IncidentReportTable
            reports={reports}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusUpdate={handleStatusUpdate}
            onAssignDepartment={handleAssignDepartment}
            statuses={statuses}
            loading={loading}
          />
        </div>

        {/* Form Modal */}
        {showForm && (
          <IncidentReportFormModal
            report={selectedReport}
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            onSubmit={handleSubmit}
            incidentTypes={incidentTypes}
            severities={severities}
            priorities={priorities}
            relationships={relationships}
          />
        )}

        {/* Details Modal */}
        {showDetails && selectedReport && (
          <IncidentReportDetailsModal
            report={selectedReport}
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            onEdit={() => {
              handleEdit(selectedReport);
              setShowDetails(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminIncidentReports;
