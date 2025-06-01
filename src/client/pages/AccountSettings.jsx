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
} from "react-icons/fa";

const AccountSettings = () => {
  const [userData, setUserData] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }

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

            {/* Profile image feature reserved for future implementation */}
            <div className="mt-4 bg-blue-900/30 border border-blue-300/30 rounded-md p-3 flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/40 rounded-full flex items-center justify-center">
                <FaUser className="text-blue-300" />
              </div>
              <p className="text-blue-300 text-sm">Profile photo somewhere</p>
            </div>
          </div>

          {/* Account information content */}
          <div className="mt-8 backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
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
                    value={userData?.firstName || ""}
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
                    value={userData?.middleName || ""}
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
                    value={userData?.lastName || ""}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white shadow-inner
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      hover:bg-white/15 transition-all duration-300"
                    placeholder="First Name"
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
                      value={userData?.contactNumber || ""}
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      className="w-full bg-white/10 border border-white/30 rounded-lg pl-10 pr-4 py-3 text-white shadow-inner
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        hover:bg-white/15 transition-all duration-300"
                    />
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
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-lg 
                shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 
                font-medium flex items-center space-x-2"
              >
                <FaCheck />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
