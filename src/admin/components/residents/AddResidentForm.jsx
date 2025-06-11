import React, { useState, useEffect } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import residentService from "../../services/residentService";

const AddResidentForm = ({ resident, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    birthdate: "",
    civilStatus: "",
    occupation: "",
    email: "",
    phoneNumber: "",
    address: "",
    voterStatus: false,
    householdRole: "Member",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const isEditing = !!resident;

  useEffect(() => {
    if (resident) {
      setFormData({
        firstName: resident.firstName || "",
        lastName: resident.lastName || "",
        middleName: resident.middleName || "",
        gender: resident.gender || "",
        birthdate: resident.birthdate
          ? resident.birthdate.substring(0, 10)
          : "",
        civilStatus: resident.civilStatus || "",
        occupation: resident.occupation || "",
        email: resident.email || "",
        phoneNumber: resident.phoneNumber || "",
        address: resident.address || "",
        voterStatus: resident.voterStatus || false,
        householdRole: resident.householdRole || "Member",
      });
    }
  }, [resident]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
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
      let response;

      if (isEditing) {
        // Update existing resident
        response = await residentService.updateResident(
          resident._id || resident.id,
          formData
        );
      } else {
        // Create new resident
        response = await residentService.createResident(formData);
      }

      if (response && response.success) {
        onSave(response.data);
      } else {
        throw new Error(response?.message || "Failed to save resident");
      }
    } catch (err) {
      console.error("Error saving resident:", err);
      setError(err.message || "Failed to save resident");
    } finally {
      setSubmitting(false);
    }
  };

  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
  const civilStatusOptions = [
    "Single",
    "Married",
    "Widowed",
    "Divorced",
    "Separated",
  ];
  const householdRoleOptions = [
    "Head",
    "Spouse",
    "Child",
    "Parent",
    "Other Relative",
    "Non-Relative",
    "Member",
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 max-w-3xl w-full my-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-karla font-bold text-white">
            {isEditing ? "Edit Resident" : "Add New Resident"}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white mb-1">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                disabled={submitting}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white mb-1">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white mb-1">Birthdate *</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Civil Status</label>
              <select
                name="civilStatus"
                value={formData.civilStatus}
                onChange={handleInputChange}
                disabled={submitting}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Status</option>
                {civilStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={submitting}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-1">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              disabled={submitting}
              rows="2"
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-1">Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                disabled={submitting}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Household Role</label>
              <select
                name="householdRole"
                value={formData.householdRole}
                onChange={handleInputChange}
                disabled={submitting}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {householdRoleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                name="voterStatus"
                checked={formData.voterStatus}
                onChange={handleInputChange}
                disabled={submitting}
                className="mr-2 rounded"
              />
              Registered Voter
            </label>
          </div>

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

export default AddResidentForm;
