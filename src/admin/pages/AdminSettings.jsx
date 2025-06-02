import React from "react";
import { FaCog } from "react-icons/fa";

const AdminSettings = () => {
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-karla font-bold text-white">Settings</h2>
        <div className="flex items-center text-white">
          <FaCog className="mr-2" />
          <span>System Configuration</span>
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-white text-lg">
          Admin settings interface coming soon.
        </p>
        <p className="text-gray-300 mt-2">
          This section will allow administrators to configure system settings
          and preferences.
        </p>
      </div>
    </div>
  );
};

export default AdminSettings;
