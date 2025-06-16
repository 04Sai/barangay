import React, { useState, useEffect } from "react";
import FormModal from "../common/FormModal";
import { dropdownStyles } from "../../utils/formStyles";

const AnnouncementFormModal = ({ announcement, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || "",
        category: announcement.category || "",
        date: new Date(announcement.date).toISOString().split("T")[0],
        content: announcement.content || "",
      });
    } else {
      // Reset form when adding new
      setFormData({
        title: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        content: "",
      });
    }
  }, [announcement, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit(formData, announcement?._id);
      onClose();
    } catch (error) {
      console.error("Error submitting announcement:", error);
      setError(error.message || "Failed to save announcement");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    "Health Service",
    "Health Advisory",
    "Community Event",
    "Utility Advisory",
    "Sports Event",
    "Service Advisory",
    "Emergency",
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={announcement ? "Edit Announcement" : "Create New Announcement"}
      onSubmit={handleFormSubmit}
      submitText={announcement ? "Update" : "Create"}
      submitting={submitting}
      error={error}
    >
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
            {categories.map((category) => (
              <option key={category} value={category} style={dropdownStyles.option}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            disabled={submitting}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-white mb-1">Content *</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          rows="6"
          disabled={submitting}
          className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
        ></textarea>
      </div>
    </FormModal>
  );
};

export default AnnouncementFormModal;
