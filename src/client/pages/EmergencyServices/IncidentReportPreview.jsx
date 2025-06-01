import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaArrowLeft,
  FaPaperPlane,
} from "react-icons/fa";
import { BackButton, SaveButton } from "../../buttons";
import IncidentReportImage from "../../../assets/services/IncidentReport.svg";

const IncidentReportPreview = () => {
  const navigate = useNavigate();
  const [completeData, setCompleteData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Retrieve complete data
    const savedData = localStorage.getItem("completeIncidentData");
    if (savedData) {
      setCompleteData(JSON.parse(savedData));
    } else {
      // If no data, go back to first step
      navigate("/account/incident-report");
    }
  }, [navigate]);

  const handleBack = () => {
    navigate("/account/incident-report/step2");
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Here you would submit the data to your backend
    setTimeout(() => {
      // Clear stored data after successful submission
      localStorage.removeItem("incidentReportData");
      localStorage.removeItem("completeIncidentData");

      alert("Incident report submitted successfully!");
      navigate("/account");
    }, 1000);
  };

  if (!completeData)
    return <div className="pt-28 text-white text-center">Loading...</div>;

  // Format date and time for display
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  // Get array of selected incident types
  const getIncidentTypes = () => {
    const types = [];
    for (const [key, value] of Object.entries(completeData.incidentType)) {
      if (value) {
        // Convert camelCase to Title Case (e.g. firstAid -> First Aid)
        if (key === "other") {
          types.push(completeData.otherIncidentType || "Other");
        } else {
          const formatted = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
          types.push(formatted);
        }
      }
    }
    return types;
  };

  return (
    <div className="pt-28 pb-10 px-4 sm:px-6">
      <div className="screen-max-width mx-auto">
        {/* Glassmorphism container */}
        <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h2 className="text-3xl font-karla font-bold text-white text-shadow-lg">
                BSERS | Incident Report Preview
              </h2>
              <p className="text-white font-inter">
                Review your incident report before submission
              </p>
            </div>
            <img
              src={IncidentReportImage}
              alt="Incident Report"
              className="w-16 h-16 md:w-24 md:h-24 object-contain"
            />
          </div>

          {/* Step indicator */}
          <div className="mt-4 relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/10">
              <div className="w-1/3 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              <div className="w-1/3 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              <div className="w-1/3 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
            </div>
            <div className="flex justify-between text-xs text-white">
              <span>Incident Info</span>
              <span>Affected Individual</span>
              <span>Review & Submit</span>
            </div>
          </div>

          {/* Preview Content */}
          <div className="mt-8 backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
            <div className="space-y-6">
              {/* Incident Information Section */}
              <div>
                <h3 className="text-xl font-karla font-bold text-white text-shadow border-b border-white/30 pb-2">
                  Incident Information
                </h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-300 text-sm">
                      <FaMapMarkerAlt className="inline-block mr-2" />
                      Site/Location:
                    </p>
                    <p className="text-white font-medium">
                      {completeData.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      <FaCalendarAlt className="inline-block mr-2" />
                      Date & Time:
                    </p>
                    <p className="text-white font-medium">
                      {formatDateTime(completeData.dateTime)}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-300 text-sm">Incident Types:</p>
                    <p className="text-white font-medium">
                      {getIncidentTypes().join(", ")}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-300 text-sm">Description:</p>
                    <p className="text-white font-medium whitespace-pre-line">
                      {completeData.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Affected Individual Section */}
              <div>
                <h3 className="text-xl font-karla font-bold text-white text-shadow border-b border-white/30 pb-2">
                  Affected Individual Information
                </h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-300 text-sm">
                      <FaUser className="inline-block mr-2" />
                      Name:
                    </p>
                    <p className="text-white font-medium">
                      {completeData.affectedName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      <FaPhone className="inline-block mr-2" />
                      Contact Number:
                    </p>
                    <p className="text-white font-medium">
                      {completeData.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Photos Section */}
              {completeData.photos && completeData.photos.length > 0 && (
                <div>
                  <h3 className="text-xl font-karla font-bold text-white text-shadow border-b border-white/30 pb-2">
                    Attached Photos
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {/* Note: In an actual implementation, you'd need to handle the File objects differently
                        since they can't be serialized to localStorage. This is a simplified version. */}
                    <p className="text-white">
                      {completeData.photos.length} photo(s) attached
                    </p>
                  </div>
                </div>
              )}

              <div className="incident-notice">
                <p>
                  Please review all information for accuracy. Once submitted,
                  you cannot edit this report.
                </p>
              </div>

              <div className="flex space-x-4">
                <BackButton
                  onClick={handleBack}
                  label="Back"
                  className="w-1/3"
                  icon={<FaArrowLeft />}
                />
                <SaveButton
                  onClick={handleSubmit}
                  label={isSubmitting ? "Submitting..." : "Submit Report"}
                  className="w-2/3"
                  disabled={isSubmitting}
                  icon={<FaPaperPlane />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReportPreview;
