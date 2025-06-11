import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import FormModal from "../common/FormModal";
import { dropdownStyles } from "../../utils/formStyles";

const IncidentReportFormModal = ({
  report,
  isOpen,
  onClose,
  onSubmit,
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [affectedPerson, setAffectedPerson] = useState({
    name: "",
    contactNumber: "",
    address: "",
  });

  useEffect(() => {
    if (report) {
      // Format the date for datetime-local input
      const formattedReport = {
        ...report,
        dateTime: {
          ...report.dateTime,
          occurred: report.dateTime?.occurred
            ? new Date(report.dateTime.occurred).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
        },
      };
      setFormData(formattedReport);
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
          [child]: value,
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

  const handleAffectedPersonChange = (e) => {
    const { name, value } = e.target;
    setAffectedPerson((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAffectedPerson = () => {
    if (affectedPerson.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        affectedPersons: [...prev.affectedPersons, { ...affectedPerson }],
      }));
      setAffectedPerson({ name: "", contactNumber: "", address: "" });
    }
  };

  const handleRemoveAffectedPerson = (index) => {
    setFormData((prev) => ({
      ...prev,
      affectedPersons: prev.affectedPersons.filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);
      const success = await onSubmit(formData);
      if (success) {
        onClose();
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      setError(err.message || "Failed to save report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        report?._id ? "Edit Incident Report" : "Create New Incident Report"
      }
      onSubmit={handleFormSubmit}
      submitText={report?._id ? "Update Report" : "Submit Report"}
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
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
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
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          ></textarea>
        </div>

        <div>
          <label className="block text-white mb-1">Incident Types *</label>
          <select
            name="incidentTypes"
            value={formData.incidentTypes}
            onChange={handleInputChange}
            multiple
            required
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white h-32"
          >
            {incidentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-300 mt-1">
            Hold Ctrl/Cmd to select multiple types
          </p>
        </div>

        <div>
          <label className="block text-white mb-1">Location *</label>
          <input
            type="text"
            name="location.address"
            value={formData.location.address}
            onChange={handleInputChange}
            required
            placeholder="Full address"
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white mb-2"
          />
          <input
            type="text"
            name="location.landmark"
            value={formData.location.landmark}
            onChange={handleInputChange}
            placeholder="Nearby landmark (optional)"
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-white mb-1">
            Date & Time of Incident *
          </label>
          <input
            type="datetime-local"
            name="dateTime.occurred"
            value={formData.dateTime.occurred}
            onChange={handleInputChange}
            required
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-grow">
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
          </div>

          <div className="flex-grow">
            <label className="block text-white mb-1">Priority *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              disabled={submitting}
              className={dropdownStyles.select}
              style={{ backgroundColor: "#1e3a8a" }}
            >
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
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              name="isEmergency"
              checked={formData.isEmergency}
              onChange={handleInputChange}
              id="isEmergency"
              className="rounded mr-2"
            />
            <label htmlFor="isEmergency" className="text-white">
              Mark as Emergency
            </label>
          </div>
        </div>

        <fieldset className="border border-white/20 rounded-lg p-4 md:col-span-2">
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
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
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
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-white mb-1">
                Relationship to Incident *
              </label>
              <select
                name="reporter.relationship"
                value={formData.reporter.relationship}
                onChange={handleInputChange}
                disabled={submitting}
                className={dropdownStyles.select}
                style={{ backgroundColor: "#1e3a8a" }}
              >
                {relationships.map((rel) => (
                  <option key={rel} value={rel} style={dropdownStyles.option}>
                    {rel}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-white mb-1">Address</label>
              <input
                type="text"
                name="reporter.address"
                value={formData.reporter.address}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-white/20 rounded-lg p-4 md:col-span-2">
          <legend className="text-white px-2">
            Affected Persons (Optional)
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-white mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={affectedPerson.name}
                onChange={handleAffectedPersonChange}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Contact</label>
              <input
                type="tel"
                name="contactNumber"
                value={affectedPerson.contactNumber}
                onChange={handleAffectedPersonChange}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddAffectedPerson}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center"
              >
                <FaPlus className="mr-2" /> Add Person
              </button>
            </div>
          </div>

          {formData.affectedPersons.length > 0 && (
            <div className="bg-white/5 p-3 rounded-lg border border-white/20 mt-2">
              <h4 className="text-white mb-2">Added Persons:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {formData.affectedPersons.map((person, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white/10 p-2 rounded"
                  >
                    <div className="text-white">
                      <div>{person.name}</div>
                      {person.contactNumber && (
                        <div className="text-xs text-gray-300">
                          {person.contactNumber}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAffectedPerson(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </fieldset>
      </div>
    </FormModal>
  );
};

export default IncidentReportFormModal;
