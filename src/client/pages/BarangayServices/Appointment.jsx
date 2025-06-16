import React, { useState, useEffect } from "react";
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
  FaSpinner,
} from "react-icons/fa";
import ApptImage from "../../../assets/services/Appt.svg";
import { useNavigate } from "react-router-dom";
import Button, { BackButton } from "../../buttons";
import appointmentService from "../../services/appointmentService";

const Appointment = () => {
  const [filterType, setFilterType] = useState("All");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();

  // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await appointmentService.getAllAppointments({
          sortBy: "dateTime.scheduled",
          sortOrder: "asc",
          limit: 50,
        });

        if (response && response.success) {
          setAppointments(response.data || []);
        } else {
          throw new Error(response.message || "Failed to fetch appointments");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments from server");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments based on selected type
  const filteredAppointments =
    filterType === "All"
      ? appointments
      : appointments.filter((appt) => appt.type === filterType);

  // Get all unique types from appointments
  const appointmentTypes = [
    "All",
    ...new Set(appointments.map((appt) => appt.type)),
  ];

  // Function to format date
  const formatDate = (dateString) => {
    try {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch (error) {
      return "Date not available";
    }
  };

  // Function to format time
  const formatTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Time not available";
    }
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
      case "Completed":
        return "bg-blue-600";
      case "In Progress":
        return "bg-purple-600";
      case "No Show":
        return "bg-gray-600";
      case "Rescheduled":
        return "bg-orange-600";
      default:
        return "bg-blue-600";
    }
  };

  // Handle status update
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to ${newStatus.toLowerCase()} this appointment?`
      )
    ) {
      return;
    }

    try {
      setUpdating(appointmentId);
      const response = await appointmentService.updateAppointmentStatus(
        appointmentId,
        newStatus
      );

      if (response && response.success) {
        // Update local state
        setAppointments(
          appointments.map((apt) =>
            apt._id === appointmentId || apt.id === appointmentId
              ? { ...apt, status: newStatus }
              : apt
          )
        );
      } else {
        throw new Error(response.message || "Failed to update appointment");
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Failed to update appointment. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 pb-10 px-4 sm:px-6">
        <div className="screen-max-width mx-auto">
          <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-white mr-2 text-2xl" />
              <span className="text-white text-lg">
                Loading your appointments...
              </span>
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

          {/* Error display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}

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
              Your Appointments ({filteredAppointments.length})
            </h3>

            {filteredAppointments.length === 0 ? (
              <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 text-center text-white">
                {filterType === "All"
                  ? "No appointments found. Schedule a new appointment through our services."
                  : `No ${filterType} appointments found.`}
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment._id || appointment.id}
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
                      <span>
                        {formatDate(
                          appointment.dateTime?.scheduled || appointment.date
                        )}
                      </span>
                    </div>

                    <div className="flex items-center text-white mb-2">
                      <FaClock className="mr-2 text-blue-400" />
                      <span>
                        {appointment.dateTime?.scheduled
                          ? formatTime(appointment.dateTime.scheduled)
                          : appointment.time}
                      </span>
                    </div>

                    <div className="flex items-center text-white mb-2">
                      <FaFileAlt className="mr-2 text-blue-400" />
                      <span>Type: {appointment.type}</span>
                    </div>

                    <div className="flex items-center text-white mb-2">
                      <FaMapMarkerAlt className="mr-2 text-blue-400" />
                      <span>
                        {appointment.location?.venue || appointment.location}
                      </span>
                    </div>

                    {appointment.appointee?.name && (
                      <div className="flex items-center text-white mb-2">
                        <FaUser className="mr-2 text-blue-400" />
                        <span>Appointee: {appointment.appointee.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-white">
                    <div className="flex items-start">
                      <FaInfoCircle className="mr-2 mt-1 text-blue-400 flex-shrink-0" />
                      <p>
                        {appointment.description ||
                          appointment.notes ||
                          "No additional notes"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 space-x-2">
                    {appointment.status !== "Cancelled" &&
                      appointment.status !== "Completed" && (
                        <Button
                          label={
                            updating === (appointment._id || appointment.id)
                              ? "Cancelling..."
                              : "Cancel"
                          }
                          type="danger"
                          icon={
                            updating === (appointment._id || appointment.id) ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaBan />
                            )
                          }
                          onClick={() =>
                            handleStatusUpdate(
                              appointment._id || appointment.id,
                              "Cancelled"
                            )
                          }
                          disabled={
                            updating === (appointment._id || appointment.id)
                          }
                          className="px-4 py-2"
                        />
                      )}
                    {appointment.status === "Pending" && (
                      <Button
                        label={
                          updating === (appointment._id || appointment.id)
                            ? "Updating..."
                            : "Reschedule"
                        }
                        type="primary"
                        icon={
                          updating === (appointment._id || appointment.id) ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaExchangeAlt />
                          )
                        }
                        onClick={() =>
                          handleStatusUpdate(
                            appointment._id || appointment.id,
                            "Rescheduled"
                          )
                        }
                        disabled={
                          updating === (appointment._id || appointment.id)
                        }
                        className="px-4 py-2"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add back button at the bottom right */}
          <div className="flex justify-start mt-6">
            <BackButton onClick={() => navigate(-1)} icon={<FaArrowLeft />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
