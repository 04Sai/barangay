import React, { useState } from "react";
import { FaPhone, FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";
import { NearbyFireStationsData } from "../constant";
import FireStationImage from "../../assets/services/FireStation.svg";
import { useNavigate } from "react-router-dom";

const FireStation = () => {
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const navigate = useNavigate();

  const handleCall = (contact) => {
    window.location.href = `tel:${contact.replace(/[^0-9]/g, "")}`;
  };

  return (
    <div className="pt-28 pb-10 px-4 sm:px-6">
      <div className="screen-max-width mx-auto">
        {/* Glassmorphism container */}
        <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
          <div className="space-y-2 mb-6 relative">
            {/* Image positioned on top right */}
            <div className="absolute right-0 top-0">
              <img
                src={FireStationImage}
                alt="Fire Station"
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            </div>

            <h2 className="text-3xl font-karla font-bold text-white text-shadow-lg">
              Fire Station
            </h2>
            <p className="text-white font-inter">
              Please provide your information to get fire emergency assistance
            </p>
          </div>

          {/* First Row - User Information Form */}
          <div className="incident-form mb-8 mt-12 backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
              Your Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="address">Your Address</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your complete address"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="contactNumber">Your Contact Number</label>
                <input
                  type="text"
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter your contact number"
                />
              </div>
            </div>
          </div>

          {/* Second Row - Nearby Fire Stations */}
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
              Nearby Fire Stations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {NearbyFireStationsData.map((station) => (
                <div
                  key={station.id}
                  className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-4 flex flex-col"
                >
                  <h4 className="text-lg font-bold text-white mb-2 text-shadow">
                    {station.name}
                  </h4>

                  <div className="flex items-start space-x-2 mb-1 text-white">
                    <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                    <span>{station.address}</span>
                  </div>

                  <div className="flex items-center space-x-2 mb-1 text-white">
                    <FaPhone className="flex-shrink-0" />
                    <span>{station.contact}</span>
                  </div>

                  <div className="text-white mb-4">
                    <span className="font-medium">Distance:</span>{" "}
                    {station.distance}
                  </div>

                  <button
                    onClick={() => handleCall(station.contact)}
                    className="mt-auto bg-red-600 text-white py-2 px-4 rounded-md 
                      shadow-lg hover:bg-red-700 transition-all duration-300 
                      font-medium flex items-center justify-center space-x-2"
                  >
                    <FaPhone />
                    <span>Call Now</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add back button at the bottom right */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white py-2 px-4 rounded-md 
                shadow-lg hover:bg-gray-700 transition-all duration-300 
                font-medium flex items-center justify-center space-x-2"
            >
              <FaArrowLeft />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FireStation;
