import React, { useState, useEffect } from "react";
import { FaBullhorn, FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import announcementService from "../services/announcementService";

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    content: "",
  });

  // Load announcements from database
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await announcementService.getAllAnnouncements({
        isActive: true,
        limit: 100,
      });

      if (response.success) {
        setAnnouncements(response.data);
      } else {
        throw new Error(response.message || "Failed to load announcements");
      }
    } catch (error) {
      console.error("Error loading announcements:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      title: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      content: "",
    });
    setShowForm(true);
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setFormData({
      title: announcement.title,
      category: announcement.category,
      date: new Date(announcement.date).toISOString().split("T")[0],
      content: announcement.content,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      if (editingId) {
        // Update existing announcement
        const response = await announcementService.updateAnnouncement(
          editingId,
          formData
        );
        if (response.success) {
          setAnnouncements(
            announcements.map((item) =>
              item._id === editingId ? response.data : item
            )
          );
        } else {
          throw new Error(response.message || "Failed to update announcement");
        }
      } else {
        // Create new announcement
        const response = await announcementService.createAnnouncement(formData);
        if (response.success) {
          setAnnouncements([response.data, ...announcements]);
        } else {
          throw new Error(response.message || "Failed to create announcement");
        }
      }

      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error submitting announcement:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      setError(null);
      const response = await announcementService.deleteAnnouncement(id);
      if (response.success) {
        setAnnouncements(announcements.filter((item) => item._id !== id));
      } else {
        throw new Error(response.message || "Failed to delete announcement");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-white text-2xl mr-3" />
          <span className="text-white text-lg">Loading announcements...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-karla font-bold text-white">
          Announcements
        </h2>
        <button
          onClick={handleAddNew}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FaPlus className="mr-2" />
          Add New
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-karla font-bold text-white mb-4">
              {editingId ? "Edit Announcement" : "Create New Announcement"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-1">Title</label>
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
                  <label className="block text-white mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="">Select Category</option>
                    <option value="Health Service">Health Service</option>
                    <option value="Health Advisory">Health Advisory</option>
                    <option value="Community Event">Community Event</option>
                    <option value="Utility Advisory">Utility Advisory</option>
                    <option value="Sports Event">Sports Event</option>
                    <option value="Service Advisory">Service Advisory</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white mb-1">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  disabled={submitting}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                  className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 disabled:opacity-50 flex items-center"
                >
                  {submitting && <FaSpinner className="animate-spin mr-2" />}
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white text-lg">No announcements found.</p>
            <p className="text-gray-300 mt-2">
              Click "Add New" to create your first announcement.
            </p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="backdrop-blur-md bg-white/5 rounded-lg border border-white/20 shadow-lg p-4"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-medium text-white">
                    {announcement.title}
                  </h3>
                  <div className="flex space-x-4 mt-1 mb-2">
                    <span className="text-sm text-blue-300">
                      {announcement.category}
                    </span>
                    <span className="text-sm text-gray-300">
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                    {announcement.source && (
                      <span className="text-sm text-green-300">
                        {announcement.source}
                      </span>
                    )}
                  </div>
                  <p className="text-white/80">{announcement.content}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="p-2 text-white hover:bg-white/10 rounded-full"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="p-2 text-red-400 hover:bg-white/10 rounded-full"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
