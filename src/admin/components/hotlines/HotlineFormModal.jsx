import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import FormModal from "../common/FormModal";
import { dropdownStyles } from "../../utils/formStyles";

const HotlineFormModal = ({
  hotline,
  isOpen,
  onClose,
  onSubmit,
  categories,
  availabilities,
  responseTimes,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phoneNumber: "",
    alternateNumber: "",
    email: "",
    category: "",
    availability: "24/7",
    customHours: "",
    address: "",
    website: "",
    coordinates: { latitude: "", longitude: "" },
    responseTime: "Variable",
    specialInstructions: "",
    tags: [],
    socialMedia: { facebook: "", twitter: "", instagram: "" },
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hotline) {
      setFormData({
        name: hotline.name || "",
        description: hotline.description || "",
        phoneNumber: hotline.phoneNumber || "",
        alternateNumber: hotline.alternateNumber || "",
        email: hotline.email || "",
        category: hotline.category || "",
        availability: hotline.availability || "24/7",
        customHours: hotline.customHours || "",
        address: hotline.address || "",
        website: hotline.website || "",
        coordinates: {
          latitude: hotline.coordinates?.latitude || "",
          longitude: hotline.coordinates?.longitude || "",
        },
        responseTime: hotline.responseTime || "Variable",
        specialInstructions: hotline.specialInstructions || "",
        tags: hotline.tags || [],
        socialMedia: {
          facebook: hotline.socialMedia?.facebook || "",
          twitter: hotline.socialMedia?.twitter || "",
          instagram: hotline.socialMedia?.instagram || "",
        },
      });
    }
  }, [hotline]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else if (type === "checkbox") {
      if (name === "languages") {
        setFormData((prev) => ({
          ...prev,
          languages: checked
            ? [...prev.languages, value]
            : prev.languages.filter((lang) => lang !== value),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      // Clean up form data
      const submitData = {
        ...formData,
        tags:
          typeof formData.tags === "string"
            ? formData.tags.split(",").map((tag) => tag.trim())
            : formData.tags,
        coordinates: {
          latitude: formData.coordinates.latitude
            ? parseFloat(formData.coordinates.latitude)
            : undefined,
          longitude: formData.coordinates.longitude
            ? parseFloat(formData.coordinates.longitude)
            : undefined,
        },
      };

      await onSubmit(submitData, hotline?._id);
      onClose();
    } catch (error) {
      console.error("Error submitting hotline:", error);
      setError(error.message || "Failed to save hotline");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={hotline ? "Edit Hotline" : "Add New Hotline"}
      onSubmit={handleFormSubmit}
      submitText={hotline ? "Update" : "Create"}
      submitting={submitting}
      error={error}
      size="large"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={submitting}
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
            disabled={submitting}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            disabled={submitting}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            <option value="" style={dropdownStyles.option}>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat} style={dropdownStyles.option}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white mb-1">Alternate Number</label>
          <input
            type="tel"
            name="alternateNumber"
            value={formData.alternateNumber}
            onChange={handleInputChange}
            disabled={submitting}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-white mb-1">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows="3"
          disabled={submitting}
          className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-1">Availability</label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            disabled={submitting}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            {availabilities.map((avail) => (
              <option key={avail} value={avail} style={dropdownStyles.option}>
                {avail}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white mb-1">Response Time</label>
          <select
            name="responseTime"
            value={formData.responseTime}
            onChange={handleInputChange}
            disabled={submitting}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            {responseTimes.map((time) => (
              <option key={time} value={time} style={dropdownStyles.option}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-white mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          disabled={submitting}
          className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
        />
      </div>
    </FormModal>
  );
};

export default HotlineFormModal;
