import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../buttons";
import {
  FaUser,
  FaQuestionCircle,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheck,
  FaSpinner,
  FaCamera,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import "../../AccountSettings.css";
import {
  genderOptions,
  civilStatusOptions,
  months,
  getDaysInMonth,
  generateYears,
  generateDays,
} from "../data/inputfieldsdata.js";
import { API_ENDPOINTS } from "../../config/api";

const AccountSettings = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    contactNumber: "",
    civilStatus: "",
    religion: "",
    gender: "",
    address: "",
    profilePicture: null,
  });
  const [birthday, setBirthday] = useState({ month: "", day: "", year: "" });
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  // Get token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle profile picture upload
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
      setUploadingImage(true);
      setError("");

      const base64 = await convertToBase64(file);

      const profilePicture = {
        filename: `profile_${Date.now()}_${file.name}`,
        originalName: file.name,
        data: base64,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
      };

      setFormData((prev) => ({
        ...prev,
        profilePicture: profilePicture,
      }));

      setImagePreview(base64);
      setSuccess("Profile picture uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error converting image:", err);
      setError("Failed to process image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove profile picture
  const removeProfilePicture = () => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: null,
    }));
    setImagePreview(null);
    setSuccess("Profile picture removed. Don't forget to save changes.");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Fetch user profile from backend
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        // If no token, try to get user data from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUserData(userData);
          setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            middleName: userData.middleName || "",
            contactNumber: userData.contactNumber || "",
            civilStatus: userData.civilStatus || "",
            religion: userData.religion || "",
            gender: userData.gender || "",
            address: userData.address || "",
            profilePicture: userData.profilePicture || null,
          });
          setBirthday({
            month: userData.birthday?.month || "",
            day: userData.birthday?.day || "",
            year: userData.birthday?.year || "",
          });
          if (userData.profilePicture?.data) {
            setImagePreview(userData.profilePicture.data);
          }
        } else {
          setError("No authentication token found. Please login again.");
          navigate("/login");
        }
        return;
      }

      try {
        const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // If backend is offline, try to use localStorage data
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUserData(userData);
            setFormData({
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              middleName: userData.middleName || "",
              contactNumber: userData.contactNumber || "",
              civilStatus: userData.civilStatus || "",
              religion: userData.religion || "",
              gender: userData.gender || "",
              address: userData.address || "",
              profilePicture: userData.profilePicture || null,
            });
            setBirthday({
              month: userData.birthday?.month || "",
              day: userData.birthday?.day || "",
              year: userData.birthday?.year || "",
            });
            if (userData.profilePicture?.data) {
              setImagePreview(userData.profilePicture.data);
            }
            return;
          }

          const errorText = await response.text();
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }
          throw new Error(
            `Failed to fetch profile data: ${response.status} ${errorText}`
          );
        }

        const data = await response.json();
        const user = data.user;

        setUserData(user);
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          middleName: user.middleName || "",
          contactNumber: user.contactNumber || "",
          civilStatus: user.civilStatus || "",
          religion: user.religion || "",
          gender: user.gender || "",
          address: user.address || "",
          profilePicture: user.profilePicture || null,
        });

        setBirthday({
          month: user.birthday?.month || "",
          day: user.birthday?.day || "",
          year: user.birthday?.year || "",
        });

        // Set image preview if profile picture exists
        if (user.profilePicture?.data) {
          setImagePreview(user.profilePicture.data);
        }
      } catch (fetchError) {
        console.error("Backend offline, using localStorage data:", fetchError);
        // Try to use localStorage data as fallback
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUserData(userData);
          setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            middleName: userData.middleName || "",
            contactNumber: userData.contactNumber || "",
            civilStatus: userData.civilStatus || "",
            religion: userData.religion || "",
            gender: userData.gender || "",
            address: userData.address || "",
            profilePicture: userData.profilePicture || null,
          });
          setBirthday({
            month: userData.birthday?.month || "",
            day: userData.birthday?.day || "",
            year: userData.birthday?.year || "",
          });
          if (userData.profilePicture?.data) {
            setImagePreview(userData.profilePicture.data);
          }
        } else {
          throw fetchError;
        }
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to load profile data. Working in offline mode.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Update user profile
  const updateProfile = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const updateData = {
        ...formData,
        birthday: birthday,
      };

      const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Failed to update profile");
        } catch {
          throw new Error(
            `Failed to update profile: ${response.status} ${errorText}`
          );
        }
      }

      const data = await response.json();
      setUserData(data.user);
      setSuccess("Profile updated successfully!");

      // Update localStorage user data
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...storedUser, ...data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile();
  };

  // Get years and days arrays for birthday dropdown
  const years = generateYears();
  const days = generateDays(birthday.month, birthday.year);

  const handleBirthdayChange = (field, value) => {
    setBirthday((prev) => {
      const newBirthday = { ...prev, [field]: value };
      // If changing month or year, validate the current day
      if (field === "month" || field === "year") {
        const maxDaysInNewMonth = getDaysInMonth(
          field === "month" ? value : prev.month,
          field === "year" ? value : prev.year
        );
        // If current day is greater than max days in new month, reset day
        if (prev.day && parseInt(prev.day) > maxDaysInNewMonth) {
          newBirthday.day = "";
        }
      }
      return newBirthday;
    });
  };

  useEffect(() => {
    fetchUserProfile();
    // Set current date
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, [fetchUserProfile]);

  if (loading) {
    return (
      <div className="account-settings-container">
        <div className="account-settings-inner">
          <div className="glassmorphism">
            <div className="flex-center py-20">
              <FaSpinner className="animate-spin text-4xl text-blue-300 mr-3" />
              <span className="text-white text-xl">Loading profile...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-settings-container">
      <div className="account-settings-inner">
        <div className="glassmorphism">
          <div className="space-y-2">
            <h2 className="page-title">Account Settings</h2>
            <p className="date-display">{currentDate}</p>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="success-message">
                <p>{success}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="form-container">
            {/* Personal Information Section */}
            <div className="mb-8">
              <h3 className="section-title">
                <FaUser />
                <span>Personal Information</span>
              </h3>

              <div className="profile-layout">
                {/* Name fields (left side) */}
                <div className="form-grid form-grid-3">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="form-input"
                      placeholder="First Name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Middle Name</label>
                    <input
                      type="text"
                      value={formData.middleName}
                      onChange={(e) =>
                        handleInputChange("middleName", e.target.value)
                      }
                      className="form-input"
                      placeholder="Middle Name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="form-input"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                {/* Profile picture (right side) */}
                <div className="profile-upload">
                  <label className="profile-image-container cursor-pointer group">
                    <div className="profile-image">
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={imagePreview}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeProfilePicture();
                            }}
                            className="absolute"
                            title="Remove picture"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-blue-300 group-hover:text-blue-200 transition-all duration-300">
                          <FaUser className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-105" />
                          <FaCamera className="text-xl transition-transform duration-300 group-hover:-translate-y-1" />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>

                  <div className="upload-text-container">
                    {uploadingImage ? (
                      <div className="flex items-center justify-center text-blue-400">
                        <FaSpinner className="animate-spin mr-2 text-lg" />
                        <span className="font-medium">Uploading...</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="font-medium cursor-pointer transition-colors duration-200">
                          {imagePreview
                            ? "Click to change picture"
                            : "Click to upload picture"}
                        </div>
                        <div className="text-xs mt-1">
                          Max 5MB • JPG, PNG, GIF
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional personal info fields */}
              <div className="form-grid form-grid-3 mt-6">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="input-icon">
                    <FaPhone />
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        handleInputChange("contactNumber", e.target.value)
                      }
                      className="form-input"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>{" "}
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="form-select"
                  >
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Religion</label>
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) =>
                      handleInputChange("religion", e.target.value)
                    }
                    className="form-input"
                    placeholder="Religion (e.g. Catholic)"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="divider">
              <div className="divider-icon">
                <FaQuestionCircle />
              </div>
            </div>

            {/* Additional Information Section */}
            <div>
              <h3 className="section-title">
                <FaStar />
                <span>Additional Information</span>
              </h3>

              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="input-icon">
                    <FaEnvelope />
                    <input
                      type="email"
                      value={userData?.email || ""}
                      className="form-input opacity-80 cursor-not-allowed"
                      placeholder="Email Address"
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-blue-300 italic pl-2">
                    Email address cannot be changed
                  </p>
                </div>{" "}
                <div className="form-group">
                  <label className="form-label">Civil Status</label>
                  <select
                    value={formData.civilStatus}
                    onChange={(e) =>
                      handleInputChange("civilStatus", e.target.value)
                    }
                    className="form-select"
                  >
                    {civilStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <div className="input-icon">
                    <FaMapMarkerAlt />
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="form-input"
                      rows="3"
                      placeholder="Full Address"
                    ></textarea>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Birthday</label>
                  <div className="birthday-grid">
                    <select
                      value={birthday.month}
                      onChange={(e) =>
                        handleBirthdayChange("month", e.target.value)
                      }
                      className="form-select"
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={birthday.day}
                      onChange={(e) =>
                        handleBirthdayChange("day", e.target.value)
                      }
                      className="form-select"
                    >
                      <option value="">Day</option>
                      {days.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={birthday.year}
                      onChange={(e) =>
                        handleBirthdayChange("year", e.target.value)
                      }
                      className="form-select"
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Button container */}
            <div className="button-container">
              <BackButton onClick={() => navigate(-1)} />

              <button type="submit" disabled={saving} className="save-button">
                {saving ? <FaSpinner className="spin" /> : <FaCheck />}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
