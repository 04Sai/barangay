import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

const AdminAppointments = () => {
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-karla font-bold text-white">
          Appointments
        </h2>
        <div className="flex items-center text-white">
          <FaCalendarAlt className="mr-2" />
          <span>Calendar</span>
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-white text-lg">
          Appointment management interface coming soon.
        </p>
        <p className="text-gray-300 mt-2">
          This section will allow administrators to manage and track all
          barangay appointments.
        </p>
      </div>
    </div>
  );
};

export default AdminAppointments;
