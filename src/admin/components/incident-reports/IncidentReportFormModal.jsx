import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import FormModal from "../common/FormModal";
import { dropdownStyles } from "../../utils/formStyles";
import incidentReportService from "../../services/incidentReportService";

const IncidentReportFormModal = ({ report, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    incidentTypes: [],
    location: {
      address: "",
      latitude: "",
      longitude: "",
    },
    dateTime: {
      occurred: new Date().toISOString().slice(0, 16),
    },
    reporter: {
      name: "",
      contactNumber: "",
      email: "",
    },
    severity: "Medium",
    priority: "Normal",
    isEmergency: false,
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const isEditing = !!report?._id;

  const incidentTypeOptions = [
    "Medical Emergency",
    "Fire",
    "Crime", 
    "Traffic Accident",
    "Natural Disaster",
    "Utility Problem",
    "Public Safety",
    "Environmental Issue",
    "Infrastructure Problem",
    "Other"
  ];

  const severityOptions = ["Low", "Medium", "High", "Critical"];
  const priorityOptions = ["Low", "Normal", "High", "Urgent"];

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title || "",
        description: report.description || "",
        incidentTypes: report.incidentTypes || [],
        location: {
          address: report.location?.address || "",
          latitude: report.location?.latitude || "",
          longitude: report.location?.longitude || "",
        },
        dateTime: {
          occurred: report.dateTime?.occurred
            ? new Date(report.dateTime.occurred).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
        },
        reporter: {
          name: report.reporter?.name || "",
          contactNumber: report.reporter?.contactNumber || "",
          email: report.reporter?.email || "",
        },
        severity: report.severity || "Medium",
        priority: report.priority || "Normal",
        isEmergency: report.isEmergency || false,
      });
    }
  }, [report]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "incidentTypes") {
      // Handle multi-select
      const selected = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({
        ...prev,
        [name]: selected,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      if (isEditing) {
        const response = await incidentReportService.updateIncidentReport(
          report._id || report.id,
          formData
        );

        if (!response || !response.success) {
          throw new Error(response?.message || "Failed to update incident report");
        }
      } else {
        const response = await incidentReportService.createIncidentReport(formData);

        if (!response || !response.success) {
          throw new Error(response?.message || "Failed to create incident report");
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving incident report:", err);
      setError(err.message || "Failed to save incident report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Incident Report" : "Create New Incident Report"}
      onSubmit={handleSubmit}
      submitText={isEditing ? "Update" : "Create"}
      submitting={submitting}
      error={error}
      size="large"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-white mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            disabled={submitting}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-white mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="3"
            disabled={submitting}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-white mb-1">Incident Types *</label>
          <select
            name="incidentTypes"
            value={formData.incidentTypes}
            onChange={handleInputChange}
            multiple
            required
            disabled={submitting}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white h-32 shadow-inner
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            {incidentTypeOptions.map((type) => (
              <option key={type} value={type} className="bg-gray-800">
                {type}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-300 mt-1">
            Hold Ctrl/Cmd to select multiple types
          </p>
        </div>

        <div>
          <label className="block text-white mb-1">Date & Time of Incident *</label>
          <input
            type="datetime-local"
            name="dateTime.occurred"
            value={formData.dateTime.occurred}
            onChange={handleInputChange}
            required
            disabled={submitting}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-white mb-1">Severity *</label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleInputChange}
            required
            disabled={submitting}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            {severityOptions.map((severity) => (
              <option
                key={severity}
                value={severity}
                style={dropdownStyles.option}
              >
                {severity}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white mb-1">Priority *</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            disabled={submitting}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            {priorityOptions.map((priority) => (
              <option
                key={priority}
                value={priority}
                style={dropdownStyles.option}
              >
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-white mb-1">Location Address *</label>
          <input
            type="text"
            name="location.address"
            value={formData.location.address}
            onChange={handleInputChange}
            required
            disabled={submitting}
            placeholder="Full address of the incident"
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-white mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            name="location.latitude"
            value={formData.location.latitude}
            onChange={handleInputChange}
            disabled={submitting}
            placeholder="e.g., 14.5995"
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-white mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            name="location.longitude"
            value={formData.location.longitude}
            onChange={handleInputChange}
            disabled={submitting}
            placeholder="e.g., 120.9842"
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>
      </div>

      <fieldset className="border border-white/20 rounded-lg p-4">
        <legend className="text-white px-2">Reporter Information</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-1">Name *</label>
            <input
              type="text"
              name="reporter.name"
              value={formData.reporter.name}
              onChange={handleInputChange}
              required
              disabled={submitting}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-white mb-1">Contact Number *</label>
            <input
              type="tel"
              name="reporter.contactNumber"
              value={formData.reporter.contactNumber}
              onChange={handleInputChange}
              required
              disabled={submitting}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-white mb-1">Email</label>
            <input
              type="email"
              name="reporter.email"
              value={formData.reporter.email}
              onChange={handleInputChange}
              disabled={submitting}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isEmergency"
          checked={formData.isEmergency}
          onChange={handleInputChange}
          id="isEmergency"
          disabled={submitting}
          className="rounded mr-2"
        />
        <label htmlFor="isEmergency" className="text-white">
          Mark as Emergency
        </label>
      </div>
    </FormModal>
  );
};

export default IncidentReportFormModal;
