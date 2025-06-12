import React from "react";
import { useIncidentReport } from "./IncidentReportContext";

const IncidentInformationForm = () => {
  const { formData, handleInputChange, handleIncidentTypeChange } =
    useIncidentReport();

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
    "Other",
  ];

  const severityOptions = ["Low", "Medium", "High", "Critical"];
  const priorityOptions = ["Low", "Normal", "High", "Urgent"];

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
        Incident Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-white mb-2">Incident Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
            placeholder="Brief description of the incident"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-white mb-2">
            Detailed Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
            placeholder="Provide detailed information about the incident"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-2">Severity</label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleInputChange}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          >
            {severityOptions.map((option) => (
              <option key={option} value={option} className="bg-gray-800">
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white mb-2">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          >
            {priorityOptions.map((option) => (
              <option key={option} value={option} className="bg-gray-800">
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-white mb-2">Incident Types *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {incidentTypeOptions.map((type) => (
              <label
                key={type}
                className={`flex items-center rounded-lg px-3 py-2 cursor-pointer transition-all duration-200 ${
                  formData.incidentTypes.includes(type)
                    ? "bg-blue-500/50 border border-blue-400"
                    : "bg-white/10 border border-white/30 hover:bg-white/20"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.incidentTypes.includes(type)}
                  onChange={() => handleIncidentTypeChange(type)}
                  className="sr-only" // Hide the actual checkbox
                />
                <div
                  className={`w-5 h-5 mr-2 flex-shrink-0 rounded border ${
                    formData.incidentTypes.includes(type)
                      ? "bg-blue-500 border-blue-400 flex items-center justify-center"
                      : "bg-white/10 border-white/30"
                  }`}
                >
                  {formData.incidentTypes.includes(type) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className={"text-sm text-white"}>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 mt-2">
          <label
            className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              formData.isEmergency
                ? "bg-red-600/70 border-2 border-red-400 shadow-lg shadow-red-500/30"
                : "bg-white/10 border border-white/30 hover:bg-white/20"
            }`}
          >
            <input
              type="checkbox"
              name="isEmergency"
              checked={formData.isEmergency}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 mr-3 flex-shrink-0 rounded border ${
                formData.isEmergency
                  ? "bg-red-500 border-red-400 flex items-center justify-center"
                  : "bg-white/10 border-white/30"
              }`}
            >
              {formData.isEmergency && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="font-medium text-white">
              This is an emergency situation
            </span>
          </label>
          {formData.isEmergency && (
            <p className="mt-2 text-orange-400 text-md font-bold text-center">
              Emergency reports are prioritized and will be responded to
              immediately.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentInformationForm;
