import React, { useState } from "react";
import {
  FaCog,
  FaUser,
  FaLock,
  FaDatabase,
  FaServer,
  FaSave,
} from "react-icons/fa";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    theme: "default",
    dataRetentionPeriod: "1 year",
    backupFrequency: "daily",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulating form submission success
    alert("Settings saved successfully!");
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-karla font-bold text-white">Settings</h2>
        <div className="flex items-center text-white bg-blue-500/30 px-3 py-1.5 rounded-lg border border-blue-500/50">
          <FaCog className="mr-2" />
          <span>System Configuration</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="backdrop-blur-md bg-white/5 rounded-lg border border-white/20 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-medium text-white">Settings Menu</h3>
            </div>
            <div className="p-2">
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full text-left px-4 py-2 rounded-lg mb-1 flex items-center ${
                  activeTab === "account"
                    ? "bg-blue-500/30 text-white"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <FaUser className="mr-2" /> Account
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full text-left px-4 py-2 rounded-lg mb-1 flex items-center ${
                  activeTab === "security"
                    ? "bg-blue-500/30 text-white"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <FaLock className="mr-2" /> Security
              </button>
              <button
                onClick={() => setActiveTab("data")}
                className={`w-full text-left px-4 py-2 rounded-lg mb-1 flex items-center ${
                  activeTab === "data"
                    ? "bg-blue-500/30 text-white"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <FaDatabase className="mr-2" /> Data Management
              </button>
              <button
                onClick={() => setActiveTab("system")}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                  activeTab === "system"
                    ? "bg-blue-500/30 text-white"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <FaServer className="mr-2" /> System
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="backdrop-blur-md bg-white/5 rounded-lg border border-white/20 shadow-lg p-6">
            {activeTab === "account" && (
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-karla font-bold text-white mb-4">
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FaSave className="mr-2" /> Save Changes
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-karla font-bold text-white mb-4">
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FaSave className="mr-2" /> Update Password
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === "data" && (
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-karla font-bold text-white mb-4">
                  Data Management Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-1">
                      Data Retention Period
                    </label>
                    <select
                      name="dataRetentionPeriod"
                      value={formData.dataRetentionPeriod}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1 month">1 Month</option>
                      <option value="3 months">3 Months</option>
                      <option value="6 months">6 Months</option>
                      <option value="1 year">1 Year</option>
                      <option value="forever">Forever</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white mb-1">
                      Backup Frequency
                    </label>
                    <select
                      name="backupFrequency"
                      value={formData.backupFrequency}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-200 text-sm">
                      Caution: Changes to data retention policies might affect
                      historical data availability.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FaSave className="mr-2" /> Save Changes
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === "system" && (
              <div>
                <h3 className="text-xl font-karla font-bold text-white mb-4">
                  System Information
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/20">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">System Version</span>
                      <span className="text-white">1.0.0</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Last Updated</span>
                      <span className="text-white">June 10, 2025</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Database Size</span>
                      <span className="text-white">24.5 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Server Status</span>
                      <span className="text-green-400">Online</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
