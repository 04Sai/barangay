import React, { useState, useEffect, useCallback } from "react";
import {
  FaPhone,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaShieldAlt,
} from "react-icons/fa";
import hotlineService from "../services/hotlineService";
import HotlineFormModal from "../components/hotlines/HotlineFormModal";
import { dropdownStyles, containerStyles } from "../utils/formStyles";

const AdminHotlines = () => {
  const [hotlines, setHotlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [stats, setStats] = useState({
    overview: {
      total: 0,
      active: 0,
      verified: 0,
      critical: 0,
      emergency: 0,
    },
  });

  // Filters and search
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    availability: "",
    isActive: "",
    isVerified: "",
  });

  const categories = [
    "Emergency",
    "Health Services",
    "Police & Security",
    "Fire Department",
    "Medical Emergency",
    "Animal Bite Center",
    "Peace and Order",
    "Towing Services and Assistance"
  ];

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

  // Define supported languages for the form
  const supportedLanguages = [
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
  const loadHotlines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading hotlines with filters:', filters); // Debug log

      // Clean filters - remove empty and 'All' values
      const cleanFilters = {};
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value && value !== 'All' && value !== '') {
          cleanFilters[key] = value;
        }
      });

      console.log('Clean filters:', cleanFilters); // Debug log

      const response = await hotlineService.getAllHotlines(cleanFilters);
      console.log('Hotlines service response:', response); // Debug log

      if (response.success) {
        setHotlines(response.data || []);
        console.log('Set hotlines:', response.data); // Debug log
      } else {
        throw new Error(response.message || "Failed to load hotlines");
      }
    } catch (error) {
      console.error("Error loading hotlines:", error);
      setError(error.message);
      setHotlines([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [filters]); // Added filters as dependency

  // Load statistics
  const loadStats = useCallback(async () => {
    try {
      const response = await hotlineService.getStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }, []); // Empty dependency array as this doesn't depend on any state

  useEffect(() => {
    loadHotlines();
    loadStats();
  }, [loadHotlines, loadStats]); // Added dependencies

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNew = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (hotline) => {
    setEditingId(hotline._id);
    setShowForm(true);
  };

  const handleViewDetails = (hotline) => {
    // Implement hotline details view or remove if not needed
    console.log("Viewing details for:", hotline.name);
    // If you want to implement details view later:
    // setSelectedHotline(hotline);
    // setShowDetails(true);
  };

  const handleSubmitHotline = async (submitData, editingId) => {
    try {
      setError(null);

      if (editingId) {
        const response = await hotlineService.updateHotline(
          editingId,
          submitData
        );
        if (response.success) {
          setHotlines(
            hotlines.map((item) =>
              item._id === editingId ? response.data : item
            )
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
      return true;
    } catch (error) {
      console.error("Error submitting hotline:", error);
      throw error;
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
        // No need for showBulkActions if not using it
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
      <div className={containerStyles.mainContainer}>
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
          <div className={containerStyles.statCard}>
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
          <div className={containerStyles.statCard}>
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
          <div className={containerStyles.statCard}>
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
          <div className={containerStyles.statCard}>
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
          <div className={containerStyles.statCard}>
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
      <div className={containerStyles.mainContainer}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            <option value="" style={dropdownStyles.option}>
              All Categories
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat} style={dropdownStyles.option}>
                {cat}
              </option>
            ))}
          </select>

          <select
            name="availability"
            value={filters.availability}
            onChange={handleFilterChange}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            <option value="" style={dropdownStyles.option}>
              All Availability
            </option>
            {availabilities.map((avail) => (
              <option key={avail} value={avail} style={dropdownStyles.option}>
                {avail}
              </option>
            ))}
          </select>

          <select
            name="isActive"
            value={filters.isActive}
            onChange={handleFilterChange}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            <option value="" style={dropdownStyles.option}>
              All Status
            </option>
            <option value="true" style={dropdownStyles.option}>
              Active Only
            </option>
            <option value="false" style={dropdownStyles.option}>
              Inactive Only
            </option>
          </select>

          <select
            name="isVerified"
            value={filters.isVerified}
            onChange={handleFilterChange}
            className={dropdownStyles.select}
            style={{ backgroundColor: "#1e3a8a" }}
          >
            <option value="" style={dropdownStyles.option}>
              All Verification
            </option>
            <option value="true" style={dropdownStyles.option}>
              Verified Only
            </option>
            <option value="false" style={dropdownStyles.option}>
              Unverified Only
            </option>
          </select>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Form Modal */}
        <HotlineFormModal
          hotline={editingId ? hotlines.find((h) => h._id === editingId) : null}
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmitHotline}
          categories={categories}
          availabilities={availabilities}
          responseTimes={responseTimes}
        />

        {/* Hotlines Table */}
        <div className={`overflow-x-auto ${containerStyles.contentContainer}`}>
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
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${hotline.isActive
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
      </div>
    </div>
  );
};

export default AdminHotlines;
