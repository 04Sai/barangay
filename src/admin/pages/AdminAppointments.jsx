import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import { AppointmentsData } from "../../client/data/index";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Load appointment data from the data file
    setAppointments(AppointmentsData);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );

    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment({ ...selectedAppointment, status: newStatus });
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="flex items-center px-2 py-1 text-xs rounded-full bg-green-500/30 text-green-300 border border-green-500/50">
            <FaCheck className="mr-1" /> Confirmed
          </span>
        );
      case "Pending":
        return (
          <span className="flex items-center px-2 py-1 text-xs rounded-full bg-yellow-500/30 text-yellow-300 border border-yellow-500/50">
            <FaClock className="mr-1" /> Pending
          </span>
        );
      case "Cancelled":
        return (
          <span className="flex items-center px-2 py-1 text-xs rounded-full bg-red-500/30 text-red-300 border border-red-500/50">
            <FaTimes className="mr-1" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-500/30 text-gray-300 border border-gray-500/50">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-karla font-bold text-white">
          Appointments
        </h2>
        <div className="flex items-center text-white bg-blue-500/30 px-3 py-1.5 rounded-lg border border-blue-500/50">
          <FaCalendarAlt className="mr-2" />
          <span>Calendar View</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="bg-white/10 border-b border-white/20">
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Date & Time</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="border-b border-white/10 hover:bg-white/5"
              >
                <td className="px-4 py-3">{appointment.title}</td>
                <td className="px-4 py-3">{appointment.type}</td>
                <td className="px-4 py-3">
                  {appointment.date} <span className="text-gray-400">at</span>{" "}
                  {appointment.time}
                </td>
                <td className="px-4 py-3">{appointment.location}</td>
                <td className="px-4 py-3">
                  {getStatusBadge(appointment.status)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleViewDetails(appointment)}
                      className="p-1.5 text-white hover:bg-white/10 rounded"
                    >
                      <FaEye />
                    </button>
                    <button className="p-1.5 text-white hover:bg-white/10 rounded">
                      <FaEdit />
                    </button>
                    <button className="p-1.5 text-red-400 hover:bg-white/10 rounded">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appointment Details Modal */}
      {showDetails && selectedAppointment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-karla font-bold text-white">
                Appointment Details
              </h3>
              <button
                onClick={handleCloseDetails}
                className="text-white hover:bg-white/10 p-1.5 rounded-full"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleStatusChange(selectedAppointment.id, "Confirmed")
                    }
                    className={`px-3 py-1 rounded text-sm ${
                      selectedAppointment.status === "Confirmed"
                        ? "bg-green-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedAppointment.id, "Pending")
                    }
                    className={`px-3 py-1 rounded text-sm ${
                      selectedAppointment.status === "Pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedAppointment.id, "Cancelled")
                    }
                    className={`px-3 py-1 rounded text-sm ${
                      selectedAppointment.status === "Cancelled"
                        ? "bg-red-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg border border-white/20">
                <div>
                  <p className="text-gray-300 text-sm">Title</p>
                  <p className="text-white">{selectedAppointment.title}</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Type</p>
                  <p className="text-white">{selectedAppointment.type}</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Date</p>
                  <p className="text-white">{selectedAppointment.date}</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Time</p>
                  <p className="text-white">{selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Location</p>
                  <p className="text-white">{selectedAppointment.location}</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Status</p>
                  <p className="text-white">{selectedAppointment.status}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-300 text-sm mb-1">Notes</p>
                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <p className="text-white">{selectedAppointment.notes}</p>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCloseDetails}
                  className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
