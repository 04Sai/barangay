import React, { useState, useEffect } from "react";
import {
  FaCog,
  FaUser,
  FaLock,
  FaServer,
  FaSave,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} from "../services/adminApi";
import { containerStyles } from "../utils/formStyles";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    contactNumber: "",
    role: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [systemData, setSystemData] = useState({
    theme: "default",
    dataRetentionPeriod: "1 year",
    backupFrequency: "daily",
  });

  // Fetch admin profile on component mount
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminProfile();
      if (response.success && response.admin) {
        setProfileData({
          firstName: response.admin.firstName || "",
          lastName: response.admin.lastName || "",
          email: response.admin.email || "",
          username: response.admin.username || "",
          contactNumber: response.admin.contactNumber || "",
          role: response.admin.role || "staff",
        });
      }
    } catch (err) {
      setError(err.message || "Failed to fetch admin profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemData({
      ...systemData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateAdminProfile(profileData);
      if (response.success) {
        setSuccess("Profile updated successfully");
        // Refresh profile data
        fetchAdminProfile();
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await changeAdminPassword(passwordData);
      if (response.success) {
        setSuccess("Password changed successfully");
        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSubmit = (e) => {
    e.preventDefault();
    // Currently system settings are not connected to backend
    setSuccess("System settings saved (frontend only)");
  };

  // Displays message (error or success)
  const MessageDisplay = ({ message, type }) => {
    if (!message) return null;

    const bgColor =
      type === "error"
        ? "bg-red-900/50 border-red-500 text-red-300"
        : "bg-green-900/50 border-green-500 text-green-300";
    const Icon = type === "error" ? FaExclamationTriangle : FaCheck;

    return (
      <div
        className={`${bgColor} border px-4 py-3 rounded mb-4 flex items-center`}
      >
        <Icon className="mr-2" />
        {message}
      </div>
    );
  };

  return (
    <div className={containerStyles.mainContainer}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-karla font-bold text-white">Settings</h2>
      </div>

      {loading && (
        <div className="backdrop-blur-md bg-white/5 rounded-lg border border-white/20 p-4 mb-6">
          <p className="text-white">Loading...</p>
        </div>
      )}

      <MessageDisplay message={error} type="error" />
      <MessageDisplay message={success} type="success" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="backdrop-blur-md bg-white/5 rounded-lg border border-white/20 shadow-lg overflow-hidden min-h-[300px]">
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
          <div
            className={`backdrop-blur-md bg-white/5 rounded-lg border border-white/20 shadow-lg p-6 min-h-[500px]`}
          >
            {activeTab === "account" && (
              <form onSubmit={handleProfileSubmit}>
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
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleProfileChange}
                        disabled={true}
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner opacity-70
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <small className="text-gray-400">
                        Username cannot be changed
                      </small>
                    </div>
                    <div>
                      <label className="block text-white mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-1">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contactNumber"
                        value={profileData.contactNumber}
                        onChange={handleProfileChange}
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-1">Role</label>
                      <input
                        type="text"
                        value={profileData.role.replace("_", " ").toUpperCase()}
                        disabled
                        className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner opacity-70
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <FaSave className="mr-2" /> Save Changes
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handlePasswordSubmit}>
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
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
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
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
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
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <FaSave className="mr-2" /> Update Password
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
                      <span className="text-white">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Database Status</span>
                      <span className="text-green-400">Connected</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Server Status</span>
                      <span className="text-green-400">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Current User</span>
                      <span className="text-white">
                        {profileData.firstName} {profileData.lastName} (
                        {profileData.role})
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg mt-4">
                    <p className="text-blue-200 text-sm">
                      This section displays read-only system information.
                      Contact the system administrator for any issues.
                    </p>
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
