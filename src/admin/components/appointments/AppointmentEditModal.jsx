import React, { useState, useEffect } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import FormModal from "../common/FormModal";
import { dropdownStyles } from "../../utils/formStyles";

const AppointmentEditModal = ({
  appointment,
  isEditing,
  onSave,
  onClose,
  isOpen,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    dateTime: {
      scheduled: "",
    },
    location: {
      venue: "",
    },
    description: "",
    contactInfo: "",
    status: "Pending",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (appointment) {
      setFormData({
        title: appointment.title || "",
        type: appointment.type || "",
        dateTime: {
          scheduled:
            appointment.dateTime?.scheduled &&
            new Date(appointment.dateTime.scheduled).toISOString().slice(0, 16),
        },
        location: {
          venue: appointment.location?.venue || appointment.location || "",
        },
        description: appointment.description || "",
        contactInfo: appointment.contactInfo || "",
        status: appointment.status || "Pending",
      });
    }
  }, [appointment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const success = await onSave(formData);
      if (success) {
        onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to save appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const appointmentTypes = [
    "Consultation",
    "Medical Checkup",
    "Certificate",
    "Document Processing",
    "Document Request",
    "Counseling",
    "Community Service",
    "Business Permit",
    "Other",
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Appointment" : "Add New Appointment"}
      onSubmit={handleSubmit}
      submitText={isEditing ? "Update" : "Save"}
      submitting={submitting}
      error={error}
      size="medium"
    >
      {appointment?.isDocumentRequest && (
        <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm font-medium">
            Note: This is a document request appointment. Some fields may not be editable.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            disabled={submitting}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-white mb-1">Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            disabled={submitting}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            <option value="" style={dropdownStyles.option}>
              Select Type
            </option>
            {appointmentTypes.map((type) => (
              <option key={type} value={type} style={dropdownStyles.option}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-1">Date & Time *</label>
          <input
            type="datetime-local"
            name="dateTime.scheduled"
            value={formData.dateTime.scheduled}
            onChange={handleInputChange}
            required
            disabled={submitting}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-white mb-1">Location *</label>
          <input
            type="text"
            name="location.venue"
            value={formData.location.venue}
            onChange={handleInputChange}
            required
            disabled={submitting}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-white mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="3"
          disabled={submitting}
          className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        ></textarea>
      </div>

      <div>
        <label className="block text-white mb-1">Contact Information</label>
        <input
          type="text"
          name="contactInfo"
          value={formData.contactInfo}
          onChange={handleInputChange}
          disabled={submitting}
          className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
      </div>

      {isEditing && (
        <div>
          <label className="block text-white mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            disabled={submitting}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            {appointment?.isDocumentRequest ? (
              <>
                <option value="Pending" style={dropdownStyles.option}>
                  Under Review
                </option>
                <option value="Confirmed" style={dropdownStyles.option}>
                  Approved
                </option>
                <option value="Cancelled" style={dropdownStyles.option}>
                  Rejected
                </option>
                <option value="Completed" style={dropdownStyles.option}>
                  Completed
                </option>
              </>
            ) : (
              <>
                <option value="Pending" style={dropdownStyles.option}>
                  Pending
                </option>
                <option value="Confirmed" style={dropdownStyles.option}>
                  Confirmed
                </option>
                <option value="Cancelled" style={dropdownStyles.option}>
                  Cancelled
                </option>
                <option value="Completed" style={dropdownStyles.option}>
                  Completed
                </option>
              </>
            )}
          </select>
        </div>
      )}
    </FormModal>
  );
};

export default AppointmentEditModal;
