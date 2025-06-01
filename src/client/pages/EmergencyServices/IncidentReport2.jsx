import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IncidentReportImage from "../../../assets/services/IncidentReport.svg";
import { BackButton, NextButton } from "../../buttons";

const IncidentReport2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [additionalData, setAdditionalData] = useState({
    affectedName: "",
    phoneNumber: "",
    photos: [],
  });

  useEffect(() => {
    // Retrieve saved data from first step
    const savedData = localStorage.getItem("incidentReportData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    } else {
      // If no data, go back to first step
      navigate("/account/incident-report");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdditionalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    // Handle file uploads
    if (e.target.files) {
      setAdditionalData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...Array.from(e.target.files)],
      }));
    }
  };

  const handleBack = () => {
    navigate("/account/incident-report");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save combined data to localStorage for the preview
    const completeData = {
      ...formData,
      ...additionalData,
    };

    localStorage.setItem("completeIncidentData", JSON.stringify(completeData));

    // Navigate to preview page
    navigate("/account/incident-report/preview");
  };

  if (!formData)
    return <div className="pt-28 text-white text-center">Loading...</div>;

  return (
    <div className="pt-28 pb-10 px-4 sm:px-6">
      <div className="screen-max-width mx-auto">
        {/* Glassmorphism container */}
        <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h2 className="text-3xl font-karla font-bold text-white text-shadow-lg">
                BSERS | Incident Report: Step 2
              </h2>
              <p className="text-white font-inter">
                Affected Individual Information
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
              <div className="w-1/3 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
              <div className="w-1/3 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white/10"></div>
            </div>
            <div className="flex justify-between text-xs text-white">
              <span>Incident Info</span>
              <span>Affected Individual</span>
              <span>Review & Submit</span>
            </div>
          </div>

          {/* Incident Report Form - Step 2 */}
          <div className="mt-8 backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
            <form onSubmit={handleSubmit} className="incident-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* First Column - Name and Phone Number */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="affectedName">
                      Name of Affected Individual
                    </label>
                    <input
                      id="affectedName"
                      name="affectedName"
                      type="text"
                      value={additionalData.affectedName}
                      onChange={handleChange}
                      required
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={additionalData.phoneNumber}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 09123456789"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Second Column - Image Upload */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label>Upload Images (optional)</label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="photos"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/30 rounded-lg cursor-pointer bg-white/10 hover:bg-white/15"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-white">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-white/70">
                            PNG, JPG or JPEG (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          id="photos"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {additionalData.photos.length > 0 && (
                      <div className="mt-2 text-white">
                        {additionalData.photos.length} photo(s) selected
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Array.from(additionalData.photos).map(
                            (photo, index) => (
                              <div
                                key={index}
                                className="relative w-16 h-16 rounded overflow-hidden"
                              >
                                <img
                                  src={URL.createObjectURL(photo)}
                                  alt={`Preview ${index}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="incident-notice mt-8">
                <p>
                  Please provide accurate contact information to help us follow
                  up on this incident report.
                </p>
              </div>

              <div className="flex space-x-4 mt-6">
                <BackButton
                  onClick={handleBack}
                  label="Back"
                  className="w-1/3"
                />
                <NextButton
                  type="submit"
                  label="Continue to Preview"
                  className="w-2/3"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReport2;
