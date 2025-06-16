import React, { memo } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUserAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaClipboardCheck,
} from "react-icons/fa";

const ReviewSummary = memo(({ formData, getSelectedDocuments }) => {
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <h3 className="text-xl font-karla font-bold text-white mb-6 text-shadow">
        Review Your Document Request
      </h3>

      <div className="space-y-4 mb-6">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h4 className="text-lg font-medium text-white mb-2 flex items-center">
            <FaClipboardCheck className="mr-2 text-blue-400" />
            Documents Requested
          </h4>
          <p className="text-white">{getSelectedDocuments()}</p>
        </div>

        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h4 className="text-lg font-medium text-white mb-2 flex items-center">
            <FaUserAlt className="mr-2 text-blue-400" />
            Personal Information
          </h4>
          <p className="text-white">Name: {formData.name}</p>
          <p className="text-white flex items-start mt-1">
            <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
            Address: {formData.address}
          </p>
          <p className="text-white flex items-center mt-1">
            <FaPhone className="mr-2" />
            Contact: {formData.contactNumber}
          </p>
        </div>

        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h4 className="text-lg font-medium text-white mb-2 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-400" />
            Appointment Details
          </h4>
          <p className="text-white flex items-center">
            <FaCalendarAlt className="mr-2" />
            Date:{" "}
            {new Date(formData.appointmentDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-white flex items-center mt-1">
            <FaClock className="mr-2" />
            Time: {formData.appointmentTime}
          </p>
        </div>
      </div>

      <div className="bg-blue-600/20 border border-blue-300/30 rounded-md p-4 mb-6">
        <p className="text-white">
          Please bring valid ID and any supporting documents on the day of your
          appointment.
        </p>
      </div>
    </div>
  );
});

ReviewSummary.displayName = 'ReviewSummary';

export default ReviewSummary;
