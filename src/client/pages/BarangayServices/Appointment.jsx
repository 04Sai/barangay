import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaArrowLeft,
  FaInfoCircle,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaFileAlt,
  FaExchangeAlt,
  FaBan,
} from "react-icons/fa";
import { AppointmentsData } from "../../constant";
import ApptImage from "../../../assets/services/Appt.svg";
import { useNavigate } from "react-router-dom";
import Button, { BackButton } from "../../buttons";

const Appointment = () => {
  const [filterType, setFilterType] = useState("All");
  const navigate = useNavigate();

  // Filter appointments based on selected type
  const filteredAppointments =
    filterType === "All"
      ? AppointmentsData
      : AppointmentsData.filter((appt) => appt.type === filterType);

  // Get all unique types from appointments
  const appointmentTypes = [
    "All",
    ...new Set(AppointmentsData.map((appt) => appt.type)),
  ];

  // Function to format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-600";
      case "Pending":
        return "bg-yellow-600";
      case "Cancelled":
        return "bg-red-600";
      default:
        return "bg-blue-600";
    }
  };

  return (
    <div className="pt-28 pb-10 px-4 sm:px-6">
      <div className="screen-max-width mx-auto">
        {/* Glassmorphism container */}
        <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
          <div className="space-y-2 mb-6 relative">
            {/* Image positioned on top right */}
            <div className="absolute right-0 top-0">
              <img
                src={ApptImage}
                alt="Appointments"
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            </div>

            <h2 className="text-3xl font-karla font-bold text-white text-shadow-lg">
              Your Appointments
            </h2>
            <p className="text-white font-inter">
              View and manage your upcoming appointments
            </p>
          </div>

          {/* Filter by type */}
          <div className="mb-8 mt-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white font-medium mr-2">Filter by:</span>
              {appointmentTypes.map((type) => (
                <Button
                  key={type}
                  onClick={() => setFilterType(type)}
                  label={type}
                  type={filterType === type ? "primary" : "outline"}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterType !== type ? "text-white border-white/30" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="space-y-4">
            <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
              Upcoming Appointments
            </h3>

            {filteredAppointments.length === 0 ? (
              <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 text-center text-white">
                No appointments found. Schedule a new appointment through our
                services.
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                    <h4 className="text-xl font-karla font-bold text-white text-shadow">
                      {appointment.title}
                    </h4>
                    <div
                      className={`${getStatusColor(
                        appointment.status
                      )} px-3 py-1 rounded-full text-xs font-bold text-white`}
                    >
                      {appointment.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-white mb-2">
                      <FaCalendarAlt className="mr-2 text-blue-400" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>

                    <div className="flex items-center text-white mb-2">
                      <FaClock className="mr-2 text-blue-400" />
                      <span>{appointment.time}</span>
                    </div>

                    <div className="flex items-center text-white mb-2">
                      <FaFileAlt className="mr-2 text-blue-400" />
                      <span>Type: {appointment.type}</span>
                    </div>

                    <div className="flex items-center text-white mb-2">
                      <FaMapMarkerAlt className="mr-2 text-blue-400" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-white">
                    <div className="flex items-start">
                      <FaInfoCircle className="mr-2 mt-1 text-blue-400 flex-shrink-0" />
                      <p>{appointment.notes}</p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 space-x-2">
                    {appointment.status !== "Cancelled" && (
                      <Button
                        label="Cancel"
                        type="danger"
                        icon={<FaBan />}
                        onClick={() => {}} // This would be connected to your backend
                        className="px-4 py-2"
                      />
                    )}
                    <Button
                      label="Reschedule"
                      type="primary"
                      icon={<FaExchangeAlt />}
                      onClick={() => {}} // This would be connected to your backend
                      className="px-4 py-2"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add back button at the bottom right */}
          <div className="flex justify-end mt-6">
            <BackButton onClick={() => navigate(-1)} icon={<FaArrowLeft />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
