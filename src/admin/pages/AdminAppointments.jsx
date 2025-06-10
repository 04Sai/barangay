import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaClock,
  FaPlus,
  FaSpinner,
  FaSearch,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa";
import { AppointmentsData } from "../../client/data/index";
import appointmentService from "../services/appointmentService";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    dateTime: {
      scheduled: "",
      end: ""
    },
    duration: 60,
    priority: "Normal",
    appointee: {
      name: "",
      contactNumber: "",
      email: "",
      age: "",
      gender: "",
      address: ""
    },
    location: {
      venue: "",
      room: ""
    },
    assignedTo: {
      department: "",
      official: ""
    },
    notes: {
      public: "",
      private: ""
    },
    isUrgent: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name.startsWith("appointee.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        appointee: { ...formData.appointee, [field]: value }
      });
    } else if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [field]: value }
      });
    } else if (name.startsWith("assignedTo.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        assignedTo: { ...formData.assignedTo, [field]: value }
      });
    } else if (name.startsWith("notes.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        notes: { ...formData.notes, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        // Update existing appointment
        await appointmentService.updateAppointment(editingId, formData);
        setAppointments(
          appointments.map((appointment) =>
            appointment._id === editingId ? { ...formData, _id: editingId } : appointment
          )
        );
      } else {
        // Create new appointment
        const newAppointment = await appointmentService.createAppointment(formData);
        setAppointments([...appointments, newAppointment]);
      }
      setShowForm(false);
      setFormData({
        title: "",
        type: "",
        description: "",
        dateTime: {
          scheduled: "",
          end: ""
        },
        duration: 60,
        priority: "Normal",
        appointee: {
          name: "",
          contactNumber: "",
          email: "",
          age: "",
          gender: "",
          address: ""
        },
        location: {
          venue: "",
          room: ""
        },
        assignedTo: {
          department: "",
          official: ""
        },
        notes: {
          public: "",
          private: ""
        },
        isUrgent: false
      });
    } catch (error) {
      console.error("Error saving appointment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setEditingId(appointment._id);
    setFormData({
      title: appointment.title,
      type: appointment.type,
      description: appointment.description,
      dateTime: {
        scheduled: appointment.dateTime?.scheduled.split(".")[0],
        end: appointment.dateTime?.end.split(".")[0]
      },
      duration: appointment.duration,
      priority: appointment.priority,
      appointee: {
        name: appointment.appointee?.name,
        contactNumber: appointment.appointee?.contactNumber,
        email: appointment.appointee?.email,
        age: appointment.appointee?.age,
        gender: appointment.appointee?.gender,
        address: appointment.appointee?.address
      },
      location: {
        venue: appointment.location?.venue,
        room: appointment.location?.room
      },
      assignedTo: {
        department: appointment.assignedTo?.department,
        official: appointment.assignedTo?.official
      },
      notes: {
        public: appointment.notes?.public,
        private: appointment.notes?.private
      },
      isUrgent: appointment.isUrgent
    });
    setShowForm(true);
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

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    };
    return new Date(dateTimeString).toLocaleString("en-US", options);
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-karla font-bold text-white">
          Appointments
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center text-white bg-blue-500/30 px-3 py-1.5 rounded-lg border border-blue-500/50"
        >
          <FaPlus className="mr-2" />
          <span>Add Appointment</span>
        </button>
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
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="p-1.5 text-white hover:bg-white/10 rounded"
                    >
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

      {/* Appointment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-karla font-bold text-white">
                {editingId ? "Edit Appointment" : "New Appointment"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-white hover:bg-white/10 p-1.5 rounded-full"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
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
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">Select Type</option>
                  {appointmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  disabled={submitting}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white mb-1">Scheduled Date/Time *</label>
                  <input
                    type="datetime-local"
                    name="dateTime.scheduled"
                    value={formData.dateTime.scheduled}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="15"
                    max="480"
                    disabled={submitting}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4">
                <h4 className="text-white font-medium mb-3">Appointee Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="appointee.name"
                      value={formData.appointee.name}
                      onChange={handleInputChange}
                      required
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Contact Number *</label>
                    <input
                      type="tel"
                      name="appointee.contactNumber"
                      value={formData.appointee.contactNumber}
                      onChange={handleInputChange}
                      required
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Email</label>
                    <input
                      type="email"
                      name="appointee.email"
                      value={formData.appointee.email}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Age</label>
                    <input
                      type="number"
                      name="appointee.age"
                      value={formData.appointee.age}
                      onChange={handleInputChange}
                      min="1"
                      max="150"
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Gender</label>
                    <select
                      name="appointee.gender"
                      value={formData.appointee.gender}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="">Select Gender</option>
                      {genders.map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white mb-1">Address</label>
                    <input
                      type="text"
                      name="appointee.address"
                      value={formData.appointee.address}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4">
                <h4 className="text-white font-medium mb-3">Location & Assignment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-1">Venue *</label>
                    <input
                      type="text"
                      name="location.venue"
                      value={formData.location.venue}
                      onChange={handleInputChange}
                      required
                      disabled={submitting}
                      placeholder="e.g., Barangay Hall"
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Room/Office</label>
                    <input
                      type="text"
                      name="location.room"
                      value={formData.location.room}
                      onChange={handleInputChange}
                      disabled={submitting}
                      placeholder="e.g., Room 101"
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-1">Assigned Department</label>
                    <select
                      name="assignedTo.department"
                      value={formData.assignedTo.department}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white mb-1">Assigned Official</label>
                    <input
                      type="text"
                      name="assignedTo.official"
                      value={formData.assignedTo.official}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4">
                <h4 className="text-white font-medium mb-3">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-1">Public Notes</label>
                    <textarea
                      name="notes.public"
                      value={formData.notes.public}
                      onChange={handleInputChange}
                      rows="2"
                      disabled={submitting}
                      placeholder="Notes visible to appointee"
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-white mb-1">Private Notes</label>
                    <textarea
                      name="notes.private"
                      value={formData.notes.private}
                      onChange={handleInputChange}
                      rows="2"
                      disabled={submitting}
                      placeholder="Internal notes only"
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      name="isUrgent"
                      checked={formData.isUrgent}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="mr-2"
                    />
                    Mark as Urgent
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedAppointment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-karla font-bold text-white">
                Appointment Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-white hover:bg-white/10 p-2 rounded-full"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <p className="text-gray-300 text-sm">Title</p>
                  <p className="text-white font-medium">{selectedAppointment.title}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <p className="text-gray-300 text-sm">Type</p>
                  <p className="text-white">{selectedAppointment.type}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <p className="text-gray-300 text-sm">Status</p>
                  <div className="flex space-x-2 mt-1">
                    <button
                      onClick={() => handleStatusChange(selectedAppointment._id, 'Confirmed')}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedAppointment.status === 'Confirmed'
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedAppointment._id, 'Pending')}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedAppointment.status === 'Pending'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedAppointment._id, 'Cancelled')}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedAppointment.status === 'Cancelled'
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedAppointment._id, 'Completed')}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedAppointment.status === 'Completed'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Complete
                    </button>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <p className="text-gray-300 text-sm">Priority</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${
                    selectedAppointment.priority === 'Urgent' ? 'bg-red-500' :
                    selectedAppointment.priority === 'High' ? 'bg-orange-500' :
                    selectedAppointment.priority === 'Normal' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {selectedAppointment.priority}
                  </span>
                </div>
              </div>

              {selectedAppointment.description && (
                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <p className="text-gray-300 text-sm mb-1">Description</p>
                  <p className="text-white">{selectedAppointment.description}</p>
                </div>
              )}

              <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                <p className="text-gray-300 text-sm mb-2">Appointee Information</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-300 text-xs">Name</p>
                    <p className="text-white">{selectedAppointment.appointee?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs">Contact</p>
                    <p className="text-white">{selectedAppointment.appointee?.contactNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs">Email</p>
                    <p className="text-white">{selectedAppointment.appointee?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <p className="text-gray-300 text-sm">Scheduled Date/Time</p>
                  <p className="text-white">{formatDateTime(selectedAppointment.dateTime?.scheduled)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <p className="text-gray-300 text-sm">Duration</p>
                  <p className="text-white">{selectedAppointment.duration} minutes</p>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                <p className="text-gray-300 text-sm mb-2">Location</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-300 text-xs">Venue</p>
                    <p className="text-white">{selectedAppointment.location?.venue}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs">Room</p>
                    <p className="text-white">{selectedAppointment.location?.room || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedAppointment.assignedTo?.department && (
                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <p className="text-gray-300 text-sm mb-2">Assignment</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-300 text-xs">Department</p>
                      <p className="text-white">{selectedAppointment.assignedTo.department}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-xs">Official</p>
                      <p className="text-white">{selectedAppointment.assignedTo.official || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {(selectedAppointment.notes?.public || selectedAppointment.notes?.private) && (
                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <p className="text-gray-300 text-sm mb-2">Notes</p>
                  {selectedAppointment.notes?.public && (
                    <div className="mb-2">
                      <p className="text-gray-300 text-xs">Public</p>
                      <p className="text-white text-sm">{selectedAppointment.notes.public}</p>
                    </div>
                  )}
                  {selectedAppointment.notes?.private && (
                    <div>
                      <p className="text-gray-300 text-xs">Private</p>
                      <p className="text-white text-sm">{selectedAppointment.notes.private}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleEdit(selectedAppointment)}
                  className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10"
                >
                  Edit Appointment
                </button>
                <button
                  onClick={() => setShowDetails(false)}
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
