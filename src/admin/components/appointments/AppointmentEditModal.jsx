import React, { useState, useEffect } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";

const AppointmentEditModal = ({ appointment, isEditing, onSave, onClose }) => {
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
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
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
    "Counseling",
    "Community Service",
    "Business Permit",
    "Other",
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-karla font-bold text-white">
            {isEditing ? "Edit Appointment" : "Add New Appointment"}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-1.5 rounded-full"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
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
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 flex items-center"
            >
              {submitting && <FaSpinner className="animate-spin mr-2" />}
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentEditModal;
