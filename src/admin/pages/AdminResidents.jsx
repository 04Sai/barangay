import React, { useState, useEffect, useCallback } from "react";
import {
  FaUserPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import residentService from "../services/residentService";
import ResidentDetailsModal from "../components/residents/ResidentDetailsModal";
import ResidentFormModal from "../components/residents/ResidentFormModal";

const AdminResidents = () => {
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sortField, setSortField] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ search: "", page: 1, limit: 10 });
  const [pagination, setPagination] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch residents data from API
  const loadResidents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Update filter with current search term
      const currentFilter = { ...filter, search: searchTerm };

      const response = await residentService.getAllResidents(currentFilter);

      if (response && response.success) {
        setResidents(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        throw new Error(response.message || "Invalid response format");
      }
    } catch (err) {
      console.error("Error loading residents:", err);
      setError(err.message || "Failed to load residents");

      // Fallback to static data if API fails
      import("../../client/data/residents").then((data) => {
        setResidents(data.ResidentsData || []);
        console.log("Using fallback static data");
      });
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm]);

  useEffect(() => {
    loadResidents();
  }, [loadResidents]);

  // Debounce search input to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter.search !== searchTerm) {
        setFilter({ ...filter, search: searchTerm, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewDetails = async (resident) => {
    try {
      setLoading(true);
      // If we already have the resident data, use it directly
      if (typeof resident === "object" && resident !== null) {
        setSelectedResident(resident);
        setShowDetails(true);
      } else {
        // Otherwise fetch it by ID
        const response = await residentService.getResidentById(resident);
        if (response && response.success) {
          setSelectedResident(response.data);
          setShowDetails(true);
        } else {
          throw new Error(
            response.message || "Failed to fetch resident details"
          );
        }
      }
    } catch (err) {
      console.error("Error fetching resident details:", err);
      setError(err.message || "Failed to fetch resident details");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedResident(null);
  };

  const handleAddResident = () => {
    setSelectedResident(null); // Reset any selected resident
    setShowAddForm(true);
  };

  // Use this function in the AddResidentForm component
  const handleFormClose = () => {
    setShowAddForm(false);
    loadResidents(); // Reload the residents list
  };

  const handleEdit = async (residentId) => {
    try {
      setLoading(true);
      const response = await residentService.getResidentById(residentId);
      if (response && response.success) {
        setSelectedResident(response.data);
        setShowAddForm(true);
      } else {
        throw new Error(
          response.message || "Failed to fetch resident for editing"
        );
      }
    } catch (err) {
      console.error("Error fetching resident for editing:", err);
      setError(err.message || "Failed to load resident data for editing");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (residentId) => {
    if (!window.confirm("Are you sure you want to delete this resident?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await residentService.deleteResident(residentId);

      if (response && response.success) {
        loadResidents(); // Reload the list after deletion

        // Close details modal if open
        if (
          showDetails &&
          selectedResident &&
          (selectedResident._id === residentId ||
            selectedResident.id === residentId)
        ) {
          setShowDetails(false);
        }
      } else {
        throw new Error(response.message || "Failed to delete resident");
      }
    } catch (err) {
      console.error("Error deleting resident:", err);
      setError(err.message || "Failed to delete resident");
    } finally {
      setLoading(false);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-gray-400 ml-1" />;
    return sortDirection === "asc" ? (
      <FaSortUp className="text-white ml-1" />
    ) : (
      <FaSortDown className="text-white ml-1" />
    );
  };

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return "N/A";

    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Filter residents based on search term if not already handled by API
  const filteredResidents =
    searchTerm && !filter.search
      ? residents.filter(
          (resident) =>
            resident.firstName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            resident.lastName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            resident.address
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            resident.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : residents;

  // Sort residents based on sort field and direction
  const sortedResidents = [...filteredResidents].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];

    // Handle sorting for date fields
    if (sortField === "birthdate" || sortField === "registeredDate") {
      valueA = new Date(valueA || 0);
      valueB = new Date(valueB || 0);
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-karla font-bold text-white">
          Residents Information
        </h2>
        <button
          onClick={handleAddResident}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors mt-4 md:mt-0"
        >
          <FaUserPlus className="mr-2" />
          Insert New Resident Data
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search residents..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 pl-10 text-white shadow-inner
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {loading && (
        <div className="flex justify-center items-center my-4">
          <FaSpinner className="animate-spin text-white mr-2" />
          <span className="text-white">Loading residents...</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="bg-white/10 border-b border-white/20">
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("lastName")}
              >
                <div className="flex items-center">
                  Name
                  {getSortIcon("lastName")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("gender")}
              >
                <div className="flex items-center">
                  Gender
                  {getSortIcon("gender")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("birthdate")}
              >
                <div className="flex items-center">
                  Age
                  {getSortIcon("birthdate")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("address")}
              >
                <div className="flex items-center">
                  Address
                  {getSortIcon("address")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort("phoneNumber")}
              >
                <div className="flex items-center">
                  Contact
                  {getSortIcon("phoneNumber")}
                </div>
              </th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedResidents.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-300">
                  {loading
                    ? "Loading residents..."
                    : "No residents found. Add a new resident to get started."}
                </td>
              </tr>
            ) : (
              sortedResidents.map((resident) => (
                <tr
                  key={resident._id || resident.id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    {resident.lastName}, {resident.firstName}
                  </td>
                  <td className="px-4 py-3">{resident.gender}</td>
                  <td className="px-4 py-3">
                    {calculateAge(resident.birthdate)}
                  </td>
                  <td className="px-4 py-3">{resident.address}</td>
                  <td className="px-4 py-3">{resident.phoneNumber}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() =>
                          handleViewDetails(resident._id || resident.id)
                        }
                        className="p-1.5 text-white hover:bg-white/10 rounded"
                        title="View details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(resident._id || resident.id)}
                        className="p-1.5 text-white hover:bg-white/10 rounded"
                        title="Edit resident"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(resident._id || resident.id)
                        }
                        className="p-1.5 text-red-400 hover:bg-white/10 rounded"
                        title="Delete resident"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.total > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
              disabled={filter.page === 1}
              className="px-3 py-1 rounded-md bg-white/10 text-white disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: pagination.total }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setFilter({ ...filter, page: page })}
                  className={`px-3 py-1 rounded-md ${
                    filter.page === page
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
              disabled={filter.page === pagination.total}
              className="px-3 py-1 rounded-md bg-white/10 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Resident Details Modal */}
      <ResidentDetailsModal
        resident={selectedResident}
        isOpen={showDetails}
        onClose={handleCloseDetails}
        onEdit={() => {
          handleEdit(selectedResident._id || selectedResident.id);
          handleCloseDetails();
        }}
        calculateAge={calculateAge}
      />

      {/* Add/Edit Resident Form Modal */}
      <ResidentFormModal
        resident={selectedResident}
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={handleFormClose}
      />
    </div>
  );
};

export default AdminResidents;
