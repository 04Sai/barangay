import React, { useState, useEffect, useCallback } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSpinner } from "react-icons/fa";
import appointmentService from "../services/appointmentService";
import { formatDateTime } from "../utils/dateUtils";
import AppointmentStatusBadge from "../components/appointments/AppointmentStatusBadge";
import AppointmentDetailsModal from "../components/appointments/AppointmentDetailsModal";
import AppointmentEditModal from "../components/appointments/AppointmentEditModal";
import { containerStyles } from "../utils/formStyles";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch appointments data
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentService.getAllAppointments();

      if (response && response.success) {
        setAppointments(response.data || []);
      } else {
        throw new Error(response.message || "Failed to fetch appointments");
      }
    } catch (err) {
      console.error("Error loading appointments:", err);
      setError(err.message || "Failed to load appointments");
      
      // Fallback to static data if API fails
      const { AppointmentsData } = await import("../../client/data/index");
      setAppointments(AppointmentsData || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Handle view details
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  // Handle close details
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedAppointment(null);
  };

  // Handle edit appointment
  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setEditingId(appointment._id || appointment.id);
    setShowEditForm(true);
  };

  // Handle status change
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentService.updateAppointment(id, {
        status: newStatus,
      });

      if (response && response.success) {
        // Update local state
        setAppointments(
          appointments.map((appointment) =>
            appointment._id === id || appointment.id === id
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );

        // Update selected appointment if it's being viewed
        if (
          selectedAppointment &&
          (selectedAppointment._id === id || selectedAppointment.id === id)
        ) {
          setSelectedAppointment({ ...selectedAppointment, status: newStatus });
        }
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.message || "Failed to update appointment status");
    } finally {
      setLoading(false);
    }
  };

  // Handle save appointment (create/edit)
  const handleSaveAppointment = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      if (editingId) {
        // Update existing appointment
        const response = await appointmentService.updateAppointment(
          editingId,
          formData
        );

        if (response && response.success) {
          setAppointments(
            appointments.map((appointment) =>
              appointment._id === editingId || appointment.id === editingId
                ? { ...response.data }
                : appointment
            )
          );
        } else {
          throw new Error(response.message || "Failed to update appointment");
        }
      } else {
        // Create new appointment
        const response = await appointmentService.createAppointment(formData);

        if (response && response.success) {
          setAppointments([response.data, ...appointments]);
        } else {
          throw new Error(response.message || "Failed to create appointment");
        }
      }

      setShowEditForm(false);
      setEditingId(null);
      setSelectedAppointment(null);
      return true;
    } catch (err) {
      console.error("Error saving appointment:", err);
      setError(err.message || "Failed to save appointment");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle delete appointment
  const handleDeleteAppointment = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        setLoading(true);
        setError(null);
        const response = await appointmentService.deleteAppointment(id);

        if (response && response.success) {
          // Update local state
          setAppointments(
            appointments.filter(
              (appointment) => appointment._id !== id && appointment.id !== id
            )
          );

          // Close modal if the deleted appointment was being viewed
          if (
            selectedAppointment &&
            (selectedAppointment._id === id || selectedAppointment.id === id)
          ) {
            setShowDetails(false);
            setShowEditForm(false);
          }
        } else {
          throw new Error(response.message || "Failed to delete appointment");
        }
      } catch (err) {
        console.error("Error deleting appointment:", err);
        setError(err.message || "Failed to delete appointment");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={containerStyles.mainContainer}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-karla font-bold text-white">
          Appointments
        </h2>
        <button
          onClick={() => {
            setEditingId(null);
            setSelectedAppointment(null);
            setShowEditForm(true);
          }}
          className="flex items-center text-white bg-blue-500/30 px-3 py-1.5 rounded-lg border border-blue-500/50"
        >
          <FaPlus className="mr-2" />
          <span>Add Appointment</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center my-4">
          <FaSpinner className="animate-spin text-white mr-2" />
          <span className="text-white">Loading appointments...</span>
        </div>
      )}

      <div className={`overflow-x-auto ${containerStyles.contentContainer}`}>
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
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-300">
                  No appointments found. Add a new appointment to get started.
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr
                  key={appointment._id || appointment.id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3">{appointment.title}</td>
                  <td className="px-4 py-3">{appointment.type}</td>
                  <td className="px-4 py-3">
                    {formatDateTime(
                      appointment.dateTime?.scheduled || appointment.date
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {appointment.location?.venue || appointment.location}
                  </td>
                  <td className="px-4 py-3">
                    <AppointmentStatusBadge status={appointment.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        className="p-1.5 text-white hover:bg-white/10 rounded"
                        title="View details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEditAppointment(appointment)}
                        className="p-1.5 text-white hover:bg-white/10 rounded"
                        title="Edit appointment"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteAppointment(
                            appointment._id || appointment.id
                          )
                        }
                        className="p-1.5 text-red-400 hover:bg-white/10 rounded"
                        title="Delete appointment"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showDetails && selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          isOpen={showDetails}
          onClose={handleCloseDetails}
          onEdit={function () {
            handleEditAppointment(selectedAppointment);
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Edit Modal */}
      {showEditForm && (
        <AppointmentEditModal
          appointment={selectedAppointment}
          isEditing={!!editingId}
          isOpen={showEditForm}
          onSave={handleSaveAppointment}
          onClose={() => {
            setShowEditForm(false);
            setEditingId(null);
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminAppointments;
