import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../buttons";
import {
  FaArrowLeft,
  FaUser,
  FaQuestionCircle,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";

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
  });
  const [birthday, setBirthday] = useState({
    month: "",
    day: "",
    year: "",
  });
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // API Base URL
  const API_BASE = "http://localhost:1337/api";

  // Get token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        setError("No authentication token found. Please login again.");
        navigate("/login");
        return;
      }

      console.log("Fetching profile with token:", token.substring(0, 20) + "...");

      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Profile fetch response status:", response.status);
      console.log("Profile fetch response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Profile fetch error response:", errorText);
        
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        throw new Error(`Failed to fetch profile data: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("Profile data received:", data);
      
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
      });

      setBirthday({
        month: user.birthday?.month || "",
        day: user.birthday?.day || "",
        year: user.birthday?.year || "",
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(err.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

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

      console.log("Sending update request with data:", updateData);
      console.log("Using token:", token.substring(0, 20) + "...");

      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      console.log("Update response status:", response.status);
      console.log("Update response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update error response:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Failed to update profile");
        } catch (parseError) {
          throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
        }
      }

      const data = await response.json();
      console.log("Update successful, received data:", data);
      
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile();
  };

  // Function to check if a year is a leap year
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  // Function to get number of days in a month
  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31; // Default to 31 if month or year not selected

    const daysInMonth = {
      "01": 31, // January
      "02": isLeapYear(parseInt(year)) ? 29 : 28, // February
      "03": 31, // March
      "04": 30, // April
      "05": 31, // May
      "06": 30, // June
      "07": 31, // July
      "08": 31, // August
      "09": 30, // September
      "10": 31, // October
      "11": 30, // November
      "12": 31, // December
    };

    return daysInMonth[month] || 31;
  };

  // Generate arrays for select options
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Dynamic days array based on selected month and year
  const maxDays = getDaysInMonth(birthday.month, birthday.year);
  const days = Array.from({ length: maxDays }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: String(i + 1),
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  const handleBirthdayChange = (field, value) => {
    setBirthday((prev) => {
      const newBirthday = {
        ...prev,
        [field]: value,
      };

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
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(now.toLocaleDateString("en-US", options));
  }, []);

  if (loading) {
    return (
      <div className="pt-28 pb-10 px-4 sm:px-6">
        <div className="screen-max-width mx-auto">
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-center py-20">
              <FaSpinner className="animate-spin text-4xl text-blue-300 mr-3" />
              <span className="text-white text-xl">Loading profile...</span>
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
        <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-karla font-bold text-white text-shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent pb-1">
              Account Settings
            </h2>
            <p className="text-white font-inter">{currentDate}</p>

            {/* Error and Success Messages */}
            {error && (
              <div className="mt-4 bg-red-900/30 border border-red-300/30 rounded-md p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-4 bg-green-900/30 border border-green-300/30 rounded-md p-3">
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            )}

            {/* Profile image feature reserved for future implementation */}
            <div className="mt-4 bg-blue-900/30 border border-blue-300/30 rounded-md p-3 flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/40 rounded-full flex items-center justify-center">
                <FaUser className="text-blue-300" />
              </div>
              <p className="text-blue-300 text-sm">Profile photo somewhere</p>
            </div>
          </div>

          {/* Account information content */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6"
          >
            {/* Personal information - First row */}
            <div className="mb-8">
              <h3 className="text-xl font-karla font-bold text-white mb-6 text-shadow flex items-center space-x-2 border-b border-white/20 pb-2">
                <FaUser className="text-blue-300" />
                <span>Personal Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 group">
                  <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-200">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white shadow-inner
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      hover:bg-white/15 transition-all duration-300"
                    placeholder="First Name"
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-200">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) =>
                      handleInputChange("middleName", e.target.value)
                    }
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white shadow-inner
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      hover:bg-white/15 transition-all duration-300"
                    placeholder="Middle Name"
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-200">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white shadow-inner
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      hover:bg-white/15 transition-all duration-300"
                    placeholder="Last Name"
                  />
                </div>
              </div>
            </div>

            {/* Second row - Phone, Status, Religion */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 group">
                  <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-200">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        handleInputChange("contactNumber", e.target.value)
                      }
                      className="w-full bg-white/10 border border-white/30 rounded-lg pl-10 pr-4 py-3 text-white shadow-inner
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        hover:bg-white/15 transition-all duration-300"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-200">
                    Civil Status
                  </label>
                  <select
                    value={formData.civilStatus}
                    onChange={(e) =>
                      handleInputChange("civilStatus", e.target.value)
                    }
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white shadow-inner
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none
                      hover:bg-white/15 transition-all duration-300"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: `right 0.5rem center`,
                      backgroundRepeat: `no-repeat`,
                      backgroundSize: `1.5em 1.5em`,
                    }}
                  >
                    <option value="" className="bg-gray-800 text-white">
                      Select Status
                    </option>
                    <option value="single" className="bg-gray-800 text-white">
                      Single
                    </option>
                    <option value="married" className="bg-gray-800 text-white">
                      Married
                    </option>
                    <option value="divorced" className="bg-gray-800 text-white">
                      Divorced
                    </option>
                    <option value="widowed" className="bg-gray-800 text-white">
                      Widowed
                    </option>
                  </select>
                </div>

                <div className="space-y-2 group">
                  <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-200">
                    Religion
                  </label>
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) =>
                      handleInputChange("religion", e.target.value)
                    }
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white shadow-inner
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      hover:bg-white/15 transition-all duration-300"
                    placeholder="Religion"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-10 border-t border-white/30 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full p-2">
                <FaQuestionCircle className="text-white" />
              </div>
            </div>

            {/* Third row - Email, Address, Gender, Birthday */}
            <div>
              <h3 className="text-xl font-karla font-bold text-white mb-6 text-shadow flex items-center space-x-2 border-b border-white/20 pb-2">
                <FaStar className="text-blue-300" />
                <span>Additional Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2 group">
                  <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-200">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={userData?.email || ""}
                      className="w-full bg-white/10 border border-white/30 rounded-lg pl-10 pr-4 py-3 text-white shadow-inner
                        border-opacity-50 cursor-not-allowed opacity-80"
                      placeholder="Email Address"
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-blue-300 italic pl-2">
                    Email address cannot be changed
                  </p>
                </div>

                <div className="space-y-2 group">
                  <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-200">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white shadow-inner
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none
                      hover:bg-white/15 transition-all duration-300"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: `right 0.5rem center`,
                      backgroundRepeat: `no-repeat`,
                      backgroundSize: `1.5em 1.5em`,
                    }}
                  >
                    <option value="" className="bg-gray-800 text-white">
                      Select Gender
                    </option>
                    <option value="male" className="bg-gray-800 text-white">
                      Male
                    </option>
                    <option value="female" className="bg-gray-800 text-white">
                      Female
                    </option>
                    <option value="other" className="bg-gray-800 text-white">
                      Other
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-200">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3">
                      <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="w-full bg-white/10 border border-white/30 rounded-lg pl-10 pr-4 py-3 text-white shadow-inner
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        hover:bg-white/15 transition-all duration-300"
                      rows="3"
                      placeholder="Full Address"
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-200">
                    Birthday
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Month Select */}
                      <select
                        value={birthday.month}
                        onChange={(e) =>
                          handleBirthdayChange("month", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/30 rounded-lg pl-8 pr-4 py-3 text-white shadow-inner
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none
                          hover:bg-white/15 transition-all duration-300"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: `right 0.5rem center`,
                          backgroundRepeat: `no-repeat`,
                          backgroundSize: `1.5em 1.5em`,
                        }}
                      >
                        <option value="" className="bg-gray-800 text-white">
                          Month
                        </option>
                        {months.map((month) => (
                          <option
                            key={month.value}
                            value={month.value}
                            className="bg-gray-800 text-white"
                          >
                            {month.label}
                          </option>
                        ))}
                      </select>

                      {/* Day Select */}
                      <select
                        value={birthday.day}
                        onChange={(e) =>
                          handleBirthdayChange("day", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white shadow-inner
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none
                          hover:bg-white/15 transition-all duration-300"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: `right 0.5rem center`,
                          backgroundRepeat: `no-repeat`,
                          backgroundSize: `1.5em 1.5em`,
                        }}
                      >
                        <option value="" className="bg-gray-800 text-white">
                          Day
                        </option>
                        {days.map((day) => (
                          <option
                            key={day.value}
                            value={day.value}
                            className="bg-gray-800 text-white"
                          >
                            {day.label}
                          </option>
                        ))}
                      </select>

                      {/* Year Select */}
                      <select
                        value={birthday.year}
                        onChange={(e) =>
                          handleBirthdayChange("year", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white shadow-inner
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none
                          hover:bg-white/15 transition-all duration-300"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: `right 0.5rem center`,
                          backgroundRepeat: `no-repeat`,
                          backgroundSize: `1.5em 1.5em`,
                        }}
                      >
                        <option value="" className="bg-gray-800 text-white">
                          Year
                        </option>
                        {years.map((year) => (
                          <option
                            key={year.value}
                            value={year.value}
                            className="bg-gray-800 text-white"
                          >
                            {year.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save button */}
            <div className="mt-10 flex justify-between">
              <BackButton
                onClick={() => navigate(-1)}
                icon={<FaArrowLeft />}
                label="Go Back"
              />

              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-lg 
                shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 
                font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaCheck />}
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
