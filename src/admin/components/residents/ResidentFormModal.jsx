import React, { useState, useEffect } from "react";
import FormModal from "../common/FormModal";
import residentService from "../../services/residentService";
import { dropdownStyles } from "../../utils/formStyles";

const ResidentFormModal = ({ resident, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "Male",
    birthdate: "",
    civilStatus: "Single",
    occupation: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const isEditing = !!resident?._id;

  useEffect(() => {
    if (resident) {
      setFormData({
        firstName: resident.firstName || "",
        lastName: resident.lastName || "",
        email: resident.email || "",
        phoneNumber: resident.phoneNumber || "",
        address: resident.address || "",
        gender: resident.gender || "Male",
        birthdate: resident.birthdate
          ? new Date(resident.birthdate).toISOString().split("T")[0]
          : "",
        civilStatus: resident.civilStatus || "Single",
        occupation: resident.occupation || "",
      });
    }
  }, [resident]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      if (isEditing) {
        const response = await residentService.updateResident(
          resident._id || resident.id,
          formData
        );

        if (!response || !response.success) {
          throw new Error(response?.message || "Failed to update resident");
        }
      } else {
        const response = await residentService.createResident(formData);

        if (!response || !response.success) {
          throw new Error(response?.message || "Failed to create resident");
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving resident:", err);
      setError(err.message || "Failed to save resident");
    } finally {
      setSubmitting(false);
    }
  };

  const genderOptions = ["Male", "Female", "Other"];
  const civilStatusOptions = [
    "Single",
    "Married",
    "Divorced",
    "Widowed",
    "Separated",
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Resident" : "Add New Resident"}
      onSubmit={handleSubmit}
      submitText={isEditing ? "Update" : "Save"}
      submitting={submitting}
      error={error}
      size="large"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-1">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
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
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-white mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
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
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-white mb-1">Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-white mb-1">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
            disabled={submitting}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            <option value="">Select Gender</option>
            {genderOptions.map((option) => (
              <option key={option} value={option} style={dropdownStyles.option}>
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
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-white mb-1">Civil Status</label>
          <select
            name="civilStatus"
            value={formData.civilStatus}
            onChange={handleInputChange}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            <option value="">Select Status</option>
            {civilStatusOptions.map((option) => (
              <option key={option} value={option} style={dropdownStyles.option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white mb-1">Occupation</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>
    </FormModal>
  );
};

export default ResidentFormModal;
