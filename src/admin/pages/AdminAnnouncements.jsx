import React, { useState } from "react";
import { FaBullhorn, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const AdminAnnouncements = () => {
  // Mock data for demonstration - replace with actual API calls
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Community Clean-up Drive",
      category: "Community Event",
      date: "2025-06-15",
      content:
        "Join us for a community clean-up event to beautify our barangay.",
    },
    {
      id: 2,
      title: "Free Health Screening",
      category: "Health",
      date: "2025-06-10",
      content:
        "Free health screenings available at the barangay health center.",
    },
    {
      id: 3,
      title: "Road Closure Notice",
      category: "Advisory",
      date: "2025-06-05",
      content: "Main street will be closed for repairs from 8AM to 5PM.",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    content: "",
  });

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
      date: "",
      content: "",
    });
    setShowForm(true);
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      category: announcement.category,
      date: announcement.date,
      content: announcement.content,
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing announcement
      setAnnouncements(
        announcements.map((item) =>
          item.id === editingId ? { ...item, ...formData } : item
        )
      );
    } else {
      // Add new announcement
      setAnnouncements([
        ...announcements,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setAnnouncements(announcements.filter((item) => item.id !== id));
  };

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

      {showForm && (
        <div className="mb-6 backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-4">
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
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="Health">Health</option>
                  <option value="Community Event">Community Event</option>
                  <option value="Advisory">Advisory</option>
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
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
              >
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
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
                  onClick={() => handleDelete(announcement.id)}
                  className="p-2 text-red-400 hover:bg-white/10 rounded-full"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
