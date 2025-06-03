import React from "react";
import { FaUsers } from "react-icons/fa";

const AdminResidents = () => {
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-karla font-bold text-white">
          Residents Information
        </h2>
        <div className="flex items-center text-white">
          <FaUsers className="mr-2" />
          <span>User Database</span>
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-white text-lg">
          Residents management interface coming soon.
        </p>
        <p className="text-gray-300 mt-2">
          This section will display resident information and allow
          administrators to manage user accounts.
        </p>
      </div>
    </div>
  );
};

export default AdminResidents;
