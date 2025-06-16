import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { formatDateTime } from "../../utils/dateUtils";
import Modal from "../common/Modal";

const AppointmentDetailsModal = ({
  appointment,
  isOpen,
  onClose,
  onEdit,
  onUpdateStatus,
}) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      setError(null);
      await onUpdateStatus(appointment._id || appointment.id, newStatus);
    } catch (error) {
      setError("Failed to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
      size="medium"
    >
      {/* Only render error message if it exists */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Title</p>
            <p className="text-white font-medium">{appointment.title}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Type</p>
            <p className="text-white">{appointment.type}</p>
          </div>
        </div>

        {appointment.isDocumentRequest && (
          <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
            <p className="text-blue-300 text-sm font-medium mb-2">Document Request Details</p>
            <div className="space-y-2">
              <p className="text-white">
                <span className="text-gray-300">Request ID:</span> {appointment.documentRequestData?.requestId}
              </p>
              <p className="text-white">
                <span className="text-gray-300">Documents:</span> {appointment.documentRequestData?.documentTypes?.map(dt => dt.type).join(', ')}
              </p>
              <p className="text-white">
                <span className="text-gray-300">Total Fee:</span> ₱{appointment.documentRequestData?.documentTypes?.reduce((sum, dt) => sum + (dt.fee || 0), 0)}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Date & Time</p>
            <p className="text-white">
              {formatDateTime(
                appointment.dateTime?.scheduled || appointment.date
              )}
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Location</p>
            <p className="text-white">
              {appointment.location?.venue || appointment.location}
            </p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
          <p className="text-gray-300 text-sm">Status</p>
          {updating ? (
            <div className="flex items-center mt-1">
              <FaSpinner className="animate-spin mr-2 text-white" />
              <span className="text-white">Updating status...</span>
            </div>
          ) : (
            <div className="flex space-x-2 mt-1">
              {appointment.isDocumentRequest ? (
                // Document request specific status buttons
                <>
                  <button
                    onClick={() => handleStatusChange("Confirmed")}
                    className={`px-3 py-1 rounded text-sm ${
                      appointment.status === "Confirmed"
                        ? "bg-green-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange("Pending")}
                    className={`px-3 py-1 rounded text-sm ${
                      appointment.status === "Pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Under Review
                  </button>
                  <button
                    onClick={() => handleStatusChange("Cancelled")}
                    className={`px-3 py-1 rounded text-sm ${
                      appointment.status === "Cancelled"
                        ? "bg-red-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusChange("Completed")}
                    className={`px-3 py-1 rounded text-sm ${
                      appointment.status === "Completed"
                        ? "bg-blue-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Complete
                  </button>
                </>
              ) : (
                // Regular appointment status buttons
                <>
                  <button
                    onClick={() => handleStatusChange("Confirmed")}
                    className={`px-3 py-1 rounded text-sm ${
                      appointment.status === "Confirmed"
                        ? "bg-green-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange("Pending")}
                    className={`px-3 py-1 rounded text-sm ${
                      appointment.status === "Pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange("Cancelled")}
                    className={`px-3 py-1 rounded text-sm ${
                      appointment.status === "Cancelled"
                        ? "bg-red-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStatusChange("Completed")}
                    className={`px-3 py-1 rounded text-sm ${
                      appointment.status === "Completed"
                        ? "bg-blue-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Complete
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {appointment.description && (
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Description</p>
            <p className="text-white">{appointment.description}</p>
          </div>
        )}

        {appointment.contactInfo && (
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Contact Information</p>
            <p className="text-white">{appointment.contactInfo}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {!appointment.isDocumentRequest && (
            <button
              onClick={onEdit}
              className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10"
            >
              Edit Appointment
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentDetailsModal;
