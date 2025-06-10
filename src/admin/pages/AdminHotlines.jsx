import React, { useState, useEffect } from "react";
import { FaPhone, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import {
  BarangayServices,
  DepartmentUnitHeads,
  NearbyPoliceStationsData,
  NearbyFireStationsData,
  PeaceAndOrderData,
} from "../../client/data/index";

const AdminHotlines = () => {
  // Use real data from the data files
  const [hotlines, setHotlines] = useState([]);

  // Load data from the imported data sources
  useEffect(() => {
    // Combine all hotline data from different sources
    const combinedHotlines = [
      ...BarangayServices.map((item) => ({
        id: `barangay-${item.id}`,
        name: item.name,
        type: "Emergency Service",
        contact: item.phoneNumber,
        address: "Barangay Center",
        source: "Barangay Services",
      })),
      ...DepartmentUnitHeads.map((item) => ({
        id: `dept-${item.id}`,
        name: item.name,
        type: "Department",
        contact: item.contact,
        address: "City Hall",
        source: "Department Units",
      })),
      ...NearbyPoliceStationsData.map((item) => ({
        id: `police-${item.id}`,
        name: item.name,
        type: "Police",
        contact: item.contact,
        address: item.address,
        source: "Police Stations",
      })),
      ...NearbyFireStationsData.map((item) => ({
        id: `fire-${item.id}`,
        name: item.name,
        type: "Fire",
        contact: item.contact,
        address: item.address,
        source: "Fire Stations",
      })),
      ...PeaceAndOrderData.slice(0, 3).map((item) => ({
        id: `peace-${item.id}`,
        name: item.name,
        type: item.type,
        contact: item.contact,
        address: item.address,
        source: "Peace and Order",
      })),
    ];

    setHotlines(combinedHotlines);
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    contact: "",
    address: "",
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
      name: "",
      type: "",
      contact: "",
      address: "",
    });
    setShowForm(true);
  };

  const handleEdit = (hotline) => {
    setEditingId(hotline.id);
    setFormData({
      name: hotline.name,
      type: hotline.type,
      contact: hotline.contact,
      address: hotline.address,
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing hotline
      setHotlines(
        hotlines.map((item) =>
          item.id === editingId ? { ...item, ...formData } : item
        )
      );
    } else {
      // Add new hotline
      setHotlines([
        ...hotlines,
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
    setHotlines(hotlines.filter((item) => item.id !== id));
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-karla font-bold text-white">Hotlines</h2>
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
            {editingId ? "Edit Hotline" : "Add New Hotline"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Type</label>{" "}
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="Emergency Service">Emergency Service</option>
                  <option value="Department">Department</option>
                  <option value="Police">Police</option>
                  <option value="Fire">Fire</option>
                  <option value="Health">Health</option>
                  <option value="Barangay Security">Barangay Security</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Quick Response">Quick Response</option>
                  <option value="Emergency Management">
                    Emergency Management
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-1">Contact Number</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white shadow-inner
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotlines.map((hotline) => (
          <div
            key={hotline.id}
            className="backdrop-blur-md bg-white/5 rounded-lg border border-white/20 shadow-lg p-4 relative"
          >
            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                onClick={() => handleEdit(hotline)}
                className="p-1.5 text-white hover:bg-white/10 rounded-full text-sm"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(hotline.id)}
                className="p-1.5 text-red-400 hover:bg-white/10 rounded-full text-sm"
              >
                <FaTrash />
              </button>
            </div>
            <h3 className="text-lg font-medium text-white mt-2">
              {hotline.name}
            </h3>{" "}
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="text-gray-300">Type: </span>
                <span className="text-white">{hotline.type}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-300">Contact: </span>
                <span className="text-white">{hotline.contact}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-300">Address: </span>
                <span className="text-white">{hotline.address}</span>
              </p>
              {hotline.source && (
                <p className="text-sm mt-2">
                  <span className="text-blue-300 text-xs">
                    {hotline.source}
                  </span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHotlines;
