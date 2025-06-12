import React from "react";
import { FaFileAlt, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../buttons";
import incidentReportService from "../../services/incidentReportService";
import IncidentReportImage from "../../../assets/services/IncidentReport.svg";
import {
  IncidentReportProvider,
  useIncidentReport,
} from "./incidentReport/IncidentReportContext";
import IncidentInformationForm from "./incidentReport/IncidentInformationForm";
import LocationInformationForm from "./incidentReport/LocationInformationForm";
import ReporterInformationForm from "./incidentReport/ReporterInformationForm";
import AttachmentUploadForm from "./incidentReport/AttachmentUploadForm";

const IncidentReportForm = () => {
  const navigate = useNavigate();
  const {
    formData,
    loading,
    submitLoading,
    setSubmitLoading,
    error,
    setError,
    success,
    setSuccess,
  } = useIncidentReport();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      setError("Please provide a title for the incident");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please provide a description of the incident");
      return;
    }

    if (formData.incidentTypes.length === 0) {
      setError("Please select at least one incident type");
      return;
    }

    try {
      setSubmitLoading(true);
      setError("");

      const reportData = {
        ...formData,
        dateTime: {
          occurred: new Date().toISOString(),
          reported: new Date().toISOString(),
        },
        status: "Pending",
      };

      console.log("Submitting report data:", reportData); // Debug log

      const response = await incidentReportService.createIncidentReport(
        reportData
      );

      if (response && response.success) {
        setSuccess("Incident report submitted successfully!");
        setTimeout(() => {
          navigate("/account");
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to submit incident report");
      }
    } catch (err) {
      console.error("Error submitting incident report:", err);
      setError(
        err.message || "Failed to submit incident report. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading && !formData.reporter.name) {
    return (
      <div className="pt-28 pb-10 px-4 sm:px-6">
        <div className="screen-max-width mx-auto">
          <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
            <div className="text-center text-white">
              <FaSpinner className="animate-spin text-white mx-auto mb-2" />
              <p>Loading your information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-10 px-4 sm:px-6">
      <div className="screen-max-width mx-auto">
        <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
          <div className="space-y-2 mb-6 relative">
            <div className="absolute right-0 top-0">
              <img
                src={IncidentReportImage}
                alt="Incident Report"
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            </div>

            <h2 className="text-3xl font-karla font-bold text-white text-shadow-lg">
              Submit Incident Report
            </h2>
            <p className="text-white font-inter">
              Report incidents to help keep our community safe
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-200">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mt-12">
            {/* Incident Information */}
            <IncidentInformationForm />

            {/* Location Information */}
            <LocationInformationForm />

            {/* Reporter Information */}
            <ReporterInformationForm />

            {/* Image Upload */}
            <AttachmentUploadForm />

            {/* Submit Button */}
            <div className="flex justify-between items-center">
              <BackButton onClick={() => navigate(-1)} icon={<FaArrowLeft />} />

              <button
                type="submit"
                disabled={submitLoading}
                className="flex items-center bg-green-500 hover:bg-green-800 text-gray-700 hover:text-gray-100 px-6 py-3 rounded-full transition-colors disabled:opacity-50"
              >
                {submitLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaFileAlt className="mr-2" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const IncidentReport = () => {
  return (
    <IncidentReportProvider>
      <IncidentReportForm />
    </IncidentReportProvider>
  );
};

export default IncidentReport;
