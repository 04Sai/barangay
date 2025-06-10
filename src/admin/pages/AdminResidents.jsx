import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { ResidentsData } from "../../client/data/residents";

const AdminResidents = () => {
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sortField, setSortField] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("asc");

  // Load data from the imported data source
  useEffect(() => {
    setResidents(ResidentsData);
  }, []);

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

  const handleViewDetails = (resident) => {
    setSelectedResident(resident);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
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
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Filter residents based on search term
  const filteredResidents = residents.filter(
    (resident) =>
      resident.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort residents based on sort field and direction
  const sortedResidents = [...filteredResidents].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];

    // Handle sorting for date fields
    if (sortField === "birthdate" || sortField === "registeredDate") {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
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
        <button className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors mt-4 md:mt-0">
          <FaUserPlus className="mr-2" />
          Add New Resident
        </button>
      </div>

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
            {sortedResidents.map((resident) => (
              <tr
                key={resident.id}
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
                      onClick={() => handleViewDetails(resident)}
                      className="p-1.5 text-white hover:bg-white/10 rounded"
                    >
                      <FaEye />
                    </button>
                    <button className="p-1.5 text-white hover:bg-white/10 rounded">
                      <FaEdit />
                    </button>
                    <button className="p-1.5 text-red-400 hover:bg-white/10 rounded">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resident Details Modal */}
      {showDetails && selectedResident && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-karla font-bold text-white">
                Resident Details
              </h3>
              <button
                onClick={handleCloseDetails}
                className="text-white hover:bg-white/10 p-1.5 rounded-full"
              >
                <FaTrash />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                <p className="text-gray-300 text-sm">Full Name</p>
                <p className="text-white">
                  {selectedResident.firstName} {selectedResident.lastName}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                <p className="text-gray-300 text-sm">Email</p>
                <p className="text-white">{selectedResident.email}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                <p className="text-gray-300 text-sm">Phone Number</p>
                <p className="text-white">{selectedResident.phoneNumber}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                <p className="text-gray-300 text-sm">Address</p>
                <p className="text-white">{selectedResident.address}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                <p className="text-gray-300 text-sm">Gender</p>
                <p className="text-white">{selectedResident.gender}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                <p className="text-gray-300 text-sm">Birthdate</p>
                <p className="text-white">
                  {selectedResident.birthdate} (
                  {calculateAge(selectedResident.birthdate)} years old)
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                <p className="text-gray-300 text-sm">Civil Status</p>
                <p className="text-white">{selectedResident.civilStatus}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                <p className="text-gray-300 text-sm">Occupation</p>
                <p className="text-white">{selectedResident.occupation}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/20 md:col-span-2">
                <p className="text-gray-300 text-sm">Registered Date</p>
                <p className="text-white">{selectedResident.registeredDate}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10">
                Edit Details
              </button>
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResidents;
