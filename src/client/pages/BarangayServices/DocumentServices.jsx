import React, { useState } from "react";
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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DocSerImage from "../../../assets/services/DocSer.svg";
import Button, { BackButton, NextButton } from "../../buttons";

const DocumentServices = () => {
  const [step, setStep] = useState(1);
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

  const handleSubmit = () => {
    // Here you would typically submit the data to your backend
    alert("Your document request has been scheduled!");
    // For now, just go back to the dashboard
    navigate("/account");
  };

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
            <BackButton onClick={() => navigate(-1)} icon={<FaArrowLeft />} />

            {step === 1 ? (
              <Button
                onClick={handleNext}
                label="Next"
                type="primary"
                icon={<FaArrowRight />}
                disabled={!isFormValid()}
              />
            ) : (
              <Button
                onClick={handleSubmit}
                label="Submit Request"
                type="success"
                icon={<FaClipboardCheck />}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentServices;
