import React, { useState, useEffect } from "react";
import {
  FaPhone,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaGlobe,
  FaClock,
  FaShieldAlt,
  FaSort,
  FaDownload,
} from "react-icons/fa";
import hotlineService from "../services/hotlineService";

const AdminHotlines = () => {
  const [hotlines, setHotlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedHotline, setSelectedHotline] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({});

  // Filters and search
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    priority: "All",
    availability: "All",
    isActive: "true",
    isVerified: "All",
  });

  // Selection for bulk operations
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phoneNumber: "",
    alternateNumber: "",
    email: "",
    category: "",
    priority: "Medium",
    availability: "24/7",
    customHours: "",
    address: "",
    website: "",
    coordinates: { latitude: "", longitude: "" },
    responseTime: "Variable",
    languages: [],
    specialInstructions: "",
    tags: [],
    socialMedia: { facebook: "", twitter: "", instagram: "" },
  });

  const categories = [
    "Emergency",
    "Health Services",
    "Police & Security",
    "Fire Department",
    "Medical Emergency",
    "Public Utilities",
    "Government Services",
    "Community Services",
    "Transportation",
    "Mental Health",
    "Senior Citizens",
    "Youth Services",
    "Animal Control",
    "Environmental",
    "Disaster Response",
  ];

  const priorities = ["Critical", "High", "Medium", "Low"];
  const availabilities = [
    "24/7",
    "Business Hours",
    "Weekdays Only",
    "Weekends Only",
    "Custom",
  ];
  const responseTimes = [
    "Immediate",
    "Within 5 minutes",
    "Within 15 minutes",
    "Within 30 minutes",
    "Within 1 hour",
    "Variable",
  ];
  const languages = [
    "English",
    "Filipino",
    "Tagalog",
    "Cebuano",
    "Ilocano",
    "Hiligaynon",
    "Waray",
    "Kapampangan",
    "Bikol",
  ];

  // Load hotlines from database
  const loadHotlines = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await hotlineService.getAllHotlines(filters);

      if (response.success) {
        setHotlines(response.data);
      } else {
        throw new Error(response.message || "Failed to load hotlines");
      }
    } catch (error) {
      console.error("Error loading hotlines:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await hotlineService.getStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  useEffect(() => {
    loadHotlines();
    loadStats();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadHotlines();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters]);

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      phoneNumber: "",
      alternateNumber: "",
      email: "",
      category: "",
      priority: "Medium",
      availability: "24/7",
      customHours: "",
      address: "",
      website: "",
      coordinates: { latitude: "", longitude: "" },
      responseTime: "Variable",
      languages: [],
      specialInstructions: "",
      tags: [],
      socialMedia: { facebook: "", twitter: "", instagram: "" },
    });
    setShowForm(true);
  };

  const handleEdit = (hotline) => {
    setEditingId(hotline._id);
    setFormData({
      name: hotline.name || "",
      description: hotline.description || "",
      phoneNumber: hotline.phoneNumber || "",
      alternateNumber: hotline.alternateNumber || "",
      email: hotline.email || "",
      category: hotline.category || "",
      priority: hotline.priority || "Medium",
      availability: hotline.availability || "24/7",
      customHours: hotline.customHours || "",
      address: hotline.address || "",
      website: hotline.website || "",
      coordinates: {
        latitude: hotline.coordinates?.latitude || "",
        longitude: hotline.coordinates?.longitude || "",
      },
      responseTime: hotline.responseTime || "Variable",
      languages: hotline.languages || [],
      specialInstructions: hotline.specialInstructions || "",
      tags: hotline.tags || [],
      socialMedia: {
        facebook: hotline.socialMedia?.facebook || "",
        twitter: hotline.socialMedia?.twitter || "",
        instagram: hotline.socialMedia?.instagram || "",
      },
    });
    setShowForm(true);
  };

  const handleViewDetails = (hotline) => {
    setSelectedHotline(hotline);
    setShowDetails(true);
  };

  const handleSubmit = async (e) => {
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

      if (editingId) {
        const response = await hotlineService.updateHotline(editingId, submitData);
        if (response.success) {
          setHotlines(
            hotlines.map((item) => (item._id === editingId ? response.data : item))
          );
        } else {
          throw new Error(response.message || "Failed to update hotline");
        }
      } else {
        const response = await hotlineService.createHotline(submitData);
        if (response.success) {
          setHotlines([response.data, ...hotlines]);
        } else {
          throw new Error(response.message || "Failed to create hotline");
        }
      }

      setShowForm(false);
      setEditingId(null);
      loadStats(); // Refresh stats
    } catch (error) {
      console.error("Error submitting hotline:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotline?")) {
      return;
    }

    try {
      setError(null);
      const response = await hotlineService.deleteHotline(id);
      if (response.success) {
        setHotlines(hotlines.filter((item) => item._id !== id));
        loadStats(); // Refresh stats
      } else {
        throw new Error(response.message || "Failed to delete hotline");
      }
    } catch (error) {
      console.error("Error deleting hotline:", error);
      setError(error.message);
    }
  };

  const handleBulkVerify = async (isVerified) => {
    try {
      const response = await hotlineService.bulkUpdateVerification(
        selectedItems,
        isVerified
      );
      if (response.success) {
        loadHotlines();
        setSelectedItems([]);
        setShowBulkActions(false);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === hotlines.length
        ? []
        : hotlines.map((item) => item._id)
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Emergency":
        return <FaExclamationTriangle className="text-red-400" />;
      case "Health Services":
        return <FaShieldAlt className="text-green-400" />;
      case "Police & Security":
        return <FaShieldAlt className="text-blue-400" />;
      default:
        return <FaPhone className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-white text-2xl mr-3" />
          <span className="text-white text-lg">Loading hotlines...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats.overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Hotlines</p>
                <p className="text-2xl font-bold text-white">
                  {stats.overview.total}
                </p>
              </div>
              <FaPhone className="text-blue-400 text-2xl" />
            </div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Active</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.overview.active}
                </p>
              </div>
              <FaCheck className="text-green-400 text-2xl" />
            </div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Verified</p>
                <p className="text-2xl font-bold text-blue-400">
                  {stats.overview.verified}
                </p>
              </div>
              <FaShieldAlt className="text-blue-400 text-2xl" />
            </div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Critical</p>
                <p className="text-2xl font-bold text-red-400">
                  {stats.overview.critical}
                </p>
              </div>
              <FaExclamationTriangle className="text-red-400 text-2xl" />
            </div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Emergency</p>
                <p className="text-2xl font-bold text-orange-400">
                  {stats.overview.emergency}
                </p>
              </div>
              <FaExclamationTriangle className="text-orange-400 text-2xl" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h2 className="text-2xl font-karla font-bold text-white">
            Emergency Hotlines Management
          </h2>
          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkVerify(true)}
                  className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  <FaCheck className="mr-1" /> Verify Selected
                </button>
                <button
                  onClick={() => handleBulkVerify(false)}
                  className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  <FaTimes className="mr-1" /> Unverify Selected
                </button>
              </div>
            )}
            <button
              onClick={handleAddNew}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus className="mr-2" />
              Add Hotline
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search hotlines..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 pl-10 text-white shadow-inner
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          >
            <option value="All">All Priorities</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>

          <select
            name="availability"
            value={filters.availability}
            onChange={handleFilterChange}
            className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          >
            <option value="All">All Availability</option>
            {availabilities.map((avail) => (
              <option key={avail} value={avail}>
                {avail}
              </option>
            ))}
          </select>

          <select
            name="isActive"
            value={filters.isActive}
            onChange={handleFilterChange}
            className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          >
            <option value="">All Status</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>

          <select
            name="isVerified"
            value={filters.isVerified}
            onChange={handleFilterChange}
            className="bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
          >
            <option value="All">All Verification</option>
            <option value="true">Verified Only</option>
            <option value="false">Unverified Only</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 overflow-y-auto">
            <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 max-w-4xl w-full my-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-karla font-bold text-white">
                  {editingId ? "Edit Hotline" : "Add New Hotline"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-white hover:bg-white/10 p-2 rounded-full"
                >
                  <FaTimes />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4 max-h-96 overflow-y-auto"
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
                    <label className="block text-white mb-1">
                      Phone Number *
                    </label>
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
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
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
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white mb-1">
                      Alternate Number
                    </label>
                    <input
                      type="tel"
                      name="alternateNumber"
                      value={formData.alternateNumber}
                      onChange={handleInputChange}
                      disabled={submitting}
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
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    >
                      {availabilities.map((avail) => (
                        <option key={avail} value={avail}>
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
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
                    >
                      {responseTimes.map((time) => (
                        <option key={time} value={time}>
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

        {/* Hotlines Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="bg-white/10 border-b border-white/20">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === hotlines.length &&
                      hotlines.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotlines.map((hotline) => (
                <tr
                  key={hotline._id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(hotline._id)}
                      onChange={() => handleSelectItem(hotline._id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {getCategoryIcon(hotline.category)}
                      <div className="ml-3">
                        <div className="font-medium">{hotline.name}</div>
                        <div className="text-sm text-gray-300 truncate max-w-xs">
                          {hotline.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm">{hotline.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{hotline.phoneNumber}</div>
                      {hotline.alternateNumber && (
                        <div className="text-sm text-gray-300">
                          {hotline.alternateNumber}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getPriorityColor(
                        hotline.priority
                      )}`}
                    >
                      {hotline.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          hotline.isActive
                            ? "bg-green-500/30 text-green-300"
                            : "bg-red-500/30 text-red-300"
                        }`}
                      >
                        {hotline.isActive ? "Active" : "Inactive"}
                      </span>
                      {hotline.isVerified && (
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-500/30 text-blue-300">
                          Verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(hotline)}
                        className="p-1.5 text-white hover:bg-white/10 rounded"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(hotline)}
                        className="p-1.5 text-white hover:bg-white/10 rounded"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(hotline._id)}
                        className="p-1.5 text-red-400 hover:bg-white/10 rounded"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hotlines.length === 0 && (
          <div className="text-center py-12">
            <FaPhone className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-white text-lg">No hotlines found.</p>
            <p className="text-gray-300 mt-2">
              Click "Add Hotline" to create your first emergency hotline.
            </p>
          </div>
        )}

        {/* Details Modal */}
        {showDetails && selectedHotline && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-karla font-bold text-white">
                  Hotline Details
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
                    <p className="text-gray-300 text-sm">Name</p>
                    <p className="text-white font-medium">
                      {selectedHotline.name}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm">Category</p>
                    <p className="text-white">{selectedHotline.category}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm">Phone Number</p>
                    <p className="text-white font-mono">
                      {selectedHotline.phoneNumber}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm">Priority</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getPriorityColor(
                        selectedHotline.priority
                      )}`}
                    >
                      {selectedHotline.priority}
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <p className="text-gray-300 text-sm mb-1">Description</p>
                  <p className="text-white">{selectedHotline.description}</p>
                </div>

                {selectedHotline.address && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm mb-1">Address</p>
                    <p className="text-white">{selectedHotline.address}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm">Availability</p>
                    <p className="text-white">{selectedHotline.availability}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-gray-300 text-sm">Response Time</p>
                    <p className="text-white">{selectedHotline.responseTime}</p>
                  </div>
                </div>

                <div className="flex justify-end">
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
    </div>
  );
};

export default AdminHotlines;
