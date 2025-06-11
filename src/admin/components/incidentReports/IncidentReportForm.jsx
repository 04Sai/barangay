import React, { useState, useEffect } from "react";
import { FaTimesCircle, FaSpinner } from "react-icons/fa";

const IncidentReportForm = ({
  report,
  isEditing,
  onSubmit,
  onCancel,
  submitting,
  incidentTypes,
  severities,
  priorities,
  relationships,
}) => {
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

  useEffect(() => {
    if (report) {
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
    }
  }, [report]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 max-w-4xl w-full my-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-karla font-bold text-white">
            {isEditing ? "Edit Incident Report" : "New Incident Report"}
          </h3>
          <button
            onClick={onCancel}
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
                <label className="block text-white mb-1">Reporter Name *</label>
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
              onClick={onCancel}
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
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentReportForm;
