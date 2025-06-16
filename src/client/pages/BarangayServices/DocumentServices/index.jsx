import React, { useState, useEffect, Suspense } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaClipboardCheck,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DocSerImage from "../../../../assets/services/DocSer.svg";
import Button, { BackButton } from "../../../buttons";
import documentRequestService from "../../../services/documentRequestService";
import { API_ENDPOINTS } from "../../../../config/api";
import useDocumentForm from "./hooks/useDocumentForm";
import ProgressIndicator from "./ProgressIndicator";

// Lazy load components for better performance
const DocumentRequestForm = React.lazy(() => import("./DocumentRequestForm"));
const ReviewSummary = React.lazy(() => import("./ReviewSummary"));

const INITIAL_FORM_DATA = {
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
};

const DocumentServices = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const {
    formData,
    handleDocumentTypeChange,
    handleInputChange,
    getSelectedDocuments,
    isFormValid,
    updateFormData,
  } = useDocumentForm(INITIAL_FORM_DATA);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
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
          updateFormData({
            name: `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim(),
            address: data.user.address || "",
            contactNumber: data.user.contactNumber || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [updateFormData]);

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
        <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
          <div className="space-y-2 mb-6 relative">
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

          <ProgressIndicator currentStep={step} />

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

          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8">
                <FaSpinner className="animate-spin text-white text-xl mr-2" />
                <span className="text-white">Loading form...</span>
              </div>
            }
          >
            {step === 1 ? (
              <DocumentRequestForm
                formData={formData}
                handleDocumentTypeChange={handleDocumentTypeChange}
                handleInputChange={handleInputChange}
              />
            ) : (
              <ReviewSummary
                formData={formData}
                getSelectedDocuments={getSelectedDocuments}
              />
            )}
          </Suspense>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <BackButton onClick={handleBack} icon={<FaArrowLeft />} />

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
