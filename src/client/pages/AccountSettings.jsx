import React, { useState, useEffect } from "react";

const AccountSettings = () => {
  const [userData, setUserData] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-blue-300 text-sm">Profile photo somewhere</p>
            </div>
          </div>

          {/* Account information content */}
          <div className="mt-8 backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
            {/* Personal information - First row */}
            <div className="mb-8">
              <h3 className="text-xl font-karla font-bold text-white mb-6 text-shadow flex items-center space-x-2 border-b border-white/20 pb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Third row - Email, Address, Gender, Birthday */}
            <div>
              <h3 className="text-xl font-karla font-bold text-white mb-6 text-shadow flex items-center space-x-2 border-b border-white/20 pb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Additional Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2 group">
                  <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-300 transition-colors duration-200">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
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
            <div className="mt-10 flex justify-end">
              <button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-lg 
                shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 
                font-medium flex items-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
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
