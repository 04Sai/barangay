import React, { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaCamera,
  FaUpload,
  FaSpinner,
  FaTimes,
  FaImage,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../buttons";
import { API_ENDPOINTS } from "../../../config/api";
import incidentReportService from "../../services/incidentReportService";
import IncidentReportImage from "../../../assets/services/IncidentReport.svg";

const IncidentReport = () => {
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
  const navigate = useNavigate();

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
              name: `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim(),
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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    try {
      setLoading(true);
      const base64 = await convertToBase64(file);

      const attachment = {
        filename: `incident_${Date.now()}_${file.name}`,
        originalName: file.name,
        data: base64,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
      };

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, attachment],
      }));

      setImagePreview(base64);
      setError("");
    } catch (err) {
      console.error("Error converting image:", err);
      setError("Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
    if (index === 0) setImagePreview(null);
  };

  // Remove Google Maps API integration, use simple geolocation
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: { latitude: lat, longitude: lng }
            }
          }));
          
          // Try to get address using browser's reverse geocoding (if available)
          // Or user can manually enter address
          setError("");
          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = "Failed to get current location.";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location permissions and try again.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred while retrieving location.";
              break;
          }
          
          setError(errorMessage);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  // Create Google Maps direction link
  const getDirectionsLink = () => {
    if (formData.location.coordinates.latitude && formData.location.coordinates.longitude) {
      const { latitude, longitude } = formData.location.coordinates;
      return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }
    return null;
  };

  // Create Google Maps view link
  const getMapViewLink = () => {
    if (formData.location.coordinates.latitude && formData.location.coordinates.longitude) {
      const { latitude, longitude } = formData.location.coordinates;
      return `https://www.google.com/maps?q=${latitude},${longitude}&z=17`;
    }
    return null;
  };

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

      const response = await incidentReportService.createIncidentReport(reportData);

      if (response && response.success) {
        setSuccess("Incident report submitted successfully!");
        setTimeout(() => {
          navigate("/account"); // Fixed: Redirect to /account instead of /emergency-services
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to submit incident report");
      }
    } catch (err) {
      console.error("Error submitting incident report:", err);
      setError(err.message || "Failed to submit incident report. Please try again.");
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
            {/* Basic Information */}
            <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
              <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
                Incident Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-white mb-2">
                    Incident Title *
                  </label>
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
                  <label className="block text-white mb-2">
                    Incident Types *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {incidentTypeOptions.map((type) => (
                      <label
                        key={type}
                        className="flex items-center text-white cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.incidentTypes.includes(type)}
                          onChange={() => handleIncidentTypeChange(type)}
                          className="mr-2"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* <div className="md:col-span-2">
                  <label className="flex items-center text-white cursor-pointer">
                    <input
                      type="checkbox"
                      name="isEmergency"
                      checked={formData.isEmergency}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>This is an emergency situation</span>
                  </label>
                </div> */}
              </div>
            </div>

            {/* Location Information */}
            <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
              <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
                Location Information
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-white mb-2">Address/Description</label>
                  <input
                    type="text"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-gray-300"
                    placeholder="Enter the incident location (e.g., Near City Hall, Barangay ABC)"
                  />
                  <p className="text-gray-300 text-sm mt-1">
                    Provide a description of the location or use the button below to capture your current coordinates
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={loading}
                    className="flex items-center justify-center bg-blue-500/30 hover:bg-blue-500/50 text-white px-4 py-2 rounded-lg border border-blue-500/50 transition-colors disabled:opacity-50"
                  >
                    {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaMapMarkerAlt className="mr-2" />}
                    Capture Current Location
                  </button>
                  
                  {formData.location.coordinates.latitude && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href={getMapViewLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-green-500/30 hover:bg-green-500/50 text-white px-4 py-2 rounded-lg border border-green-500/50 transition-colors"
                      >
                        <FaMapMarkerAlt className="mr-2" />
                        View on Map
                      </a>
                      <a
                        href={getDirectionsLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-orange-500/30 hover:bg-orange-500/50 text-white px-4 py-2 rounded-lg border border-orange-500/50 transition-colors"
                      >
                        <FaMapMarkerAlt className="mr-2" />
                        Get Directions
                      </a>
                    </div>
                  )}
                </div>

                {formData.location.coordinates.latitude && (
                  <div className="text-white text-sm p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaMapMarkerAlt className="mr-2 text-green-400" />
                      <span className="font-medium">Location Captured Successfully!</span>
                    </div>
                    <p><strong>Coordinates:</strong> {formData.location.coordinates.latitude.toFixed(6)}, {formData.location.coordinates.longitude.toFixed(6)}</p>
                    <p className="text-xs mt-1 text-green-200">
                      Emergency responders can use these coordinates to locate the incident precisely.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reporter Information */}
            <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
              <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
                Your Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">Full Name</label>
                  <input
                    type="text"
                    name="reporter.name"
                    value={formData.reporter.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Contact Number</label>
                  <input
                    type="tel"
                    name="reporter.contactNumber"
                    value={formData.reporter.contactNumber}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    placeholder="Your contact number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white mb-2">Email Address</label>
                  <input
                    type="email"
                    name="reporter.email"
                    value={formData.reporter.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    placeholder="Your email address"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
              <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
                Attach Evidence (Optional)
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/30 border-dashed rounded-lg cursor-pointer bg-white/10 hover:bg-white/20 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaUpload className="w-8 h-8 mb-4 text-gray-300" />
                      <p className="mb-2 text-sm text-gray-300">
                        <span className="font-semibold">Click to upload</span> an
                        image
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Attached Images:</h4>
                    {formData.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white/10 rounded-lg p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <FaImage className="text-blue-400" />
                          <div>
                            <p className="text-white text-sm">
                              {attachment.originalName}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {(attachment.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {imagePreview && (
                  <div className="mt-4">
                    <h4 className="text-white font-medium mb-2">Image Preview:</h4>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-48 object-contain rounded-lg border border-white/30"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center">
              <BackButton onClick={() => navigate(-1)} icon={<FaArrowLeft />} />

              <button
                type="submit"
                disabled={submitLoading}
                className="flex items-center bg-green-500 hover:bg-green-900 text-white px-6 py-3 rounded-lg border border-green-500/50 transition-colors disabled:opacity-50"
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

export default IncidentReport;
