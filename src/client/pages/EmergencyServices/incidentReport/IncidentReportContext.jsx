import React, { createContext, useState, useContext, useEffect } from "react";
import { API_ENDPOINTS } from "../../../../config/api";

const IncidentReportContext = createContext();

export const useIncidentReport = () => useContext(IncidentReportContext);

export const IncidentReportProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    incidentTypes: [],
    severity: "Medium",
    priority: "Normal",
    location: {
      address: "",
      coordinates: {
        latitude: null,
        longitude: null,
      },
    },
    reporter: {
      name: "",
      contactNumber: "",
      email: "",
    },
    isEmergency: false,
    attachments: [],
  });

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to submit an incident report");
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
            reporter: {
              name: `${data.user.firstName || ""} ${
                data.user.lastName || ""
              }`.trim(),
              contactNumber: data.user.contactNumber || "",
              email: data.user.email || "",
            },
            location: {
              ...prev.location,
              address: data.user.address || "",
            },
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

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
    } else if (name.includes("reporter.")) {
      const field = name.replace("reporter.", "");
      setFormData((prev) => ({
        ...prev,
        reporter: {
          ...prev.reporter,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleIncidentTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      incidentTypes: prev.incidentTypes.includes(type)
        ? prev.incidentTypes.filter((t) => t !== type)
        : [...prev.incidentTypes, type],
    }));
  };

  const value = {
    formData,
    setFormData,
    loading,
    setLoading,
    submitLoading,
    setSubmitLoading,
    error,
    setError,
    success,
    setSuccess,
    imagePreview,
    setImagePreview,
    handleInputChange,
    handleIncidentTypeChange,
  };

  return (
    <IncidentReportContext.Provider value={value}>
      {children}
    </IncidentReportContext.Provider>
  );
};
