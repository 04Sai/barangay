import React, { useState, useEffect } from "react";
import { FaBullhorn, FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import announcementService from "../services/announcementService";
import AnnouncementFormModal from "../components/announcements/AnnouncementFormModal";
import { containerStyles } from "../utils/formStyles";

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    content: "",
  });

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await announcementService.getAllAnnouncements({
        limit: 100,
      });

      if (response.success) {
        setAnnouncements(response.data);
      } else {
        throw new Error(response.message || "Failed to load announcements");
      }
    } catch (error) {
      setError(`Failed to load announcements: ${error.message}. Please check if the backend server is running.`);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

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

  const handleSubmitAnnouncement = async (data, id) => {
    let success = false;

    try {
      setError(null);

      if (id) {
        const response = await announcementService.updateAnnouncement(id, data);
        if (response.success) {
          setAnnouncements(
            announcements.map((item) =>
              item._id === id ? response.data : item
            )
          );
          success = true;
        } else {
          throw new Error(response.message || "Failed to update announcement");
        }
      } else {
        const response = await announcementService.createAnnouncement(data);
        if (response.success) {
          setAnnouncements([response.data, ...announcements]);
          success = true;
        } else {
          throw new Error(response.message || "Failed to create announcement");
        }
      }

      if (success) {
        setShowForm(false);
        setEditingId(null);
      }

      return success;
    } catch (error) {
      setError(error.message || "Failed to save announcement");
      return false;
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
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className={containerStyles.mainContainer}>
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-white text-2xl mr-3" />
          <span className="text-white text-lg">Loading announcements...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerStyles.mainContainer}>
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
          <button
            onClick={() => {
              setError(null);
              loadAnnouncements();
            }}
            className="mt-3 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 text-white rounded border border-red-500/50 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <AnnouncementFormModal
        announcement={
          editingId ? announcements.find((a) => a._id === editingId) : null
        }
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitAnnouncement}
      />

      <div className={`space-y-4 ${containerStyles.contentContainer}`}>
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white text-lg">
              {error ? "Unable to load announcements from database." : "No announcements found."}
            </p>
            <p className="text-gray-300 mt-2">
              {error 
                ? "Please check if the backend server is running." 
                : "Click \"Add New\" to create your first announcement."
              }
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
