import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaUserAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaClipboardCheck,
  FaFileAlt,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DocSerImage from "../../../assets/services/DocSer.svg";
import Button, { BackButton, NextButton } from "../../buttons";
import documentRequestService from "../../services/documentRequestService";
import { API_ENDPOINTS } from "../../../config/api";

const DocumentServices = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    documentType: {
      barangayClearance: false,
      barangayCertificate: false,
      certificateOfIndigency: false,
      other: false,
      otherText: "",
    },
    name: "",
    address: "",
    contactNumber: "",
    appointmentDate: "",
    appointmentTime: "",
  });
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          // Don't require login, just continue with empty form
          setLoading(false);
          return;
        }

        const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData((prev) => ({
            ...prev,
            name: `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim(),
            address: data.user.address || "",
            contactNumber: data.user.contactNumber || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        // Continue without profile data
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleDocumentTypeChange = (type) => {
    setFormData({
      ...formData,
      documentType: {
        ...formData.documentType,
        [type]: !formData.documentType[type],
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "otherText") {
      setFormData({
        ...formData,
        documentType: {
          ...formData.documentType,
          otherText: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const getSelectedDocuments = () => {
    const selected = [];
    if (formData.documentType.barangayClearance)
      selected.push("Barangay Clearance");
    if (formData.documentType.barangayCertificate)
      selected.push("Barangay Certificate");
    if (formData.documentType.certificateOfIndigency)
      selected.push("Certificate of Indigency");
    if (formData.documentType.other && formData.documentType.otherText) {
      selected.push(`Other: ${formData.documentType.otherText}`);
    }
    return selected.join(", ");
  };

  const isFormValid = () => {
    // Check if at least one document type is selected
    const hasDocumentType =
      formData.documentType.barangayClearance ||
      formData.documentType.barangayCertificate ||
      formData.documentType.certificateOfIndigency ||
      (formData.documentType.other && formData.documentType.otherText !== "");

    // Check other required fields
    return (
      hasDocumentType &&
      formData.name.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.contactNumber.trim() !== "" &&
      formData.appointmentDate !== "" &&
      formData.appointmentTime !== ""
    );
  };

  const handleNext = () => {
    if (isFormValid()) {
      setStep(2);
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
    } else {
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      setError("");
      setSuccess("");

      // Transform form data to match API structure
      const documentTypes = [];
      
      if (formData.documentType.barangayClearance) {
        documentTypes.push({ type: 'Barangay Clearance', fee: 50 });
      }
      if (formData.documentType.barangayCertificate) {
        documentTypes.push({ type: 'Barangay Certificate', fee: 30 });
      }
      if (formData.documentType.certificateOfIndigency) {
        documentTypes.push({ type: 'Certificate of Indigency', fee: 25 });
      }
      if (formData.documentType.other && formData.documentType.otherText) {
        documentTypes.push({ 
          type: 'Other', 
          otherDescription: formData.documentType.otherText,
          fee: 50 
        });
      }

      const requestData = {
        documentTypes,
        requestor: {
          name: formData.name,
          address: formData.address,
          contactNumber: formData.contactNumber,
        },
        appointment: {
          preferredDate: formData.appointmentDate,
          preferredTime: formData.appointmentTime,
        },
        priority: 'Normal',
        status: 'Pending Review'
      };

      const response = await documentRequestService.createDocumentRequest(requestData);

      if (response.success) {
        setSuccess(`Document request submitted successfully! Request ID: ${response.data.requestId}`);
        
        // Reset form after successful submission
        setTimeout(() => {
          navigate("/account");
        }, 3000);
      } else {
        throw new Error(response.message || "Failed to submit document request");
      }
    } catch (err) {
      console.error("Error submitting document request:", err);
      setError(err.message || "Failed to submit document request. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 pb-10 px-4 sm:px-6">
        <div className="screen-max-width mx-auto">
          <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-white text-2xl mr-3" />
              <span className="text-white text-lg">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-10 px-4 sm:px-6">
      <div className="screen-max-width mx-auto">
        {/* Glassmorphism container */}
        <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
          <div className="space-y-2 mb-6 relative">
            {/* Image positioned on top right */}
            <div className="absolute right-0 top-0">
              <img
                src={DocSerImage}
                alt="Document Services"
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            </div>

            <h2 className="text-3xl font-karla font-bold text-white text-shadow-lg">
              Document Services
            </h2>
            <p className="text-white font-inter">
              Request barangay documents and schedule your appointment
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mb-8 mt-12">
            <div className="flex items-center w-full max-w-md">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 1 ? "bg-blue-600" : "bg-gray-400"
                } text-white font-bold`}
              >
                1
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-300">
                <div
                  className={`h-full ${
                    step === 2 ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  style={{ width: step === 1 ? "0%" : "100%" }}
                ></div>
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 2 ? "bg-blue-600" : "bg-gray-400"
                } text-white font-bold`}
              >
                2
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-200">{success}</p>
            </div>
          )}

          {step === 1 ? (
            /* Step 1: Document Request Form */
            <div className="incident-form backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
              <h3 className="text-xl font-karla font-bold text-white mb-6 text-shadow">
                Document Request Form
              </h3>

              {/* Document Type Selection */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-white text-shadow mb-3">
                  Requesting For:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="barangayClearance"
                      checked={formData.documentType.barangayClearance}
                      onChange={() =>
                        handleDocumentTypeChange("barangayClearance")
                      }
                      className="h-5 w-5 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="barangayClearance"
                      className="ml-3 text-white"
                    >
                      Barangay Clearance
                    </label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="barangayCertificate"
                      checked={formData.documentType.barangayCertificate}
                      onChange={() =>
                        handleDocumentTypeChange("barangayCertificate")
                      }
                      className="h-5 w-5 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="barangayCertificate"
                      className="ml-3 text-white"
                    >
                      Barangay Certificate
                    </label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="certificateOfIndigency"
                      checked={formData.documentType.certificateOfIndigency}
                      onChange={() =>
                        handleDocumentTypeChange("certificateOfIndigency")
                      }
                      className="h-5 w-5 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="certificateOfIndigency"
                      className="ml-3 text-white"
                    >
                      Certificate of Indigency
                    </label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="other"
                      checked={formData.documentType.other}
                      onChange={() => handleDocumentTypeChange("other")}
                      className="h-5 w-5 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="other" className="ml-3 text-white">
                      Other
                    </label>
                  </div>
                </div>

                {formData.documentType.other && (
                  <div className="mt-3">
                    <input
                      type="text"
                      name="otherText"
                      value={formData.documentType.otherText}
                      onChange={handleInputChange}
                      placeholder="Please specify other document"
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="address">Complete Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="contactNumber">Contact Number</label>
                  <input
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your contact number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label htmlFor="appointmentDate">Preferred Date</label>
                    <input
                      type="date"
                      id="appointmentDate"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white"
                    />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="appointmentTime">Preferred Time</label>
                    <input
                      type="time"
                      id="appointmentTime"
                      name="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Review and Submit */
            <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
              <h3 className="text-xl font-karla font-bold text-white mb-6 text-shadow">
                Review Your Document Request
              </h3>

              <div className="space-y-4 mb-6">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                    <FaClipboardCheck className="mr-2 text-blue-400" />{" "}
                    Documents Requested
                  </h4>
                  <p className="text-white">{getSelectedDocuments()}</p>
                </div>

                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                    <FaUserAlt className="mr-2 text-blue-400" /> Personal
                    Information
                  </h4>
                  <p className="text-white">Name: {formData.name}</p>
                  <p className="text-white flex items-start mt-1">
                    <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                    Address: {formData.address}
                  </p>
                  <p className="text-white flex items-center mt-1">
                    <FaPhone className="mr-2" />
                    Contact: {formData.contactNumber}
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-400" /> Appointment
                    Details
                  </h4>
                  <p className="text-white flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    Date:{" "}
                    {new Date(formData.appointmentDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <p className="text-white flex items-center mt-1">
                    <FaClock className="mr-2" />
                    Time: {formData.appointmentTime}
                  </p>
                </div>
              </div>

              <div className="bg-blue-600/20 border border-blue-300/30 rounded-md p-4 mb-6">
                <p className="text-white">
                  Please bring valid ID and any supporting documents on the day
                  of your appointment.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
          <div className="flex justify-end mt-6">
            <BackButton onClick={() => navigate(-1)} icon={<FaArrowLeft />} />
          </div>

            {step === 1 ? (
              <Button
                onClick={handleNext}
                label="Next"
                type="primary"
                icon={<FaArrowRight />}
                disabled={!isFormValid() || submitLoading}
              />
            ) : (
              <Button
                onClick={handleSubmit}
                label={submitLoading ? "Submitting..." : "Submit Request"}
                type="success"
                icon={submitLoading ? <FaSpinner className="animate-spin" /> : <FaClipboardCheck />}
                disabled={submitLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentServices;
