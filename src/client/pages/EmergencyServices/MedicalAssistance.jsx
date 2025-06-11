import React, { useState, useEffect } from "react";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaUserInjured,
  FaAmbulance,
} from "react-icons/fa";
import { NearbyHospitalsData } from "../../data";
import MedicalAssistanceImage from "../../../assets/services/MedicalAssistance.svg";
import { useNavigate } from "react-router-dom";
import Button, { BackButton, CallButton } from "../../buttons";
import { API_ENDPOINTS } from "../../../config/api";
import hotlineService from "../../services/hotlineService";
import LocationDisplay from "../../components/LocationDisplay";

const MedicalAssistance = () => {
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user profile data and hospitals on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // If no token, skip profile fetch but still show the page
        if (token) {
          try {
            // Fetch user profile
            const profileResponse = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              setAddress(profileData.user.address || "");
              setContactNumber(profileData.user.contactNumber || "");
            }
          } catch (profileError) {
            console.error("Error fetching profile (backend offline):", profileError);
            // Don't set error for profile fetch failure, just continue
          }
        }

        // Fetch hospitals from backend with fallback
        try {
          const hospitalsResponse = await hotlineService.getHotlinesByCategory(
            "Medical Emergency"
          );
          if (hospitalsResponse && hospitalsResponse.success) {
            setHospitals(hospitalsResponse.data);
          } else {
            throw new Error("Backend response not successful");
          }
        } catch (hospitalError) {
          console.error("Error fetching hospitals (using static data):", hospitalError);
          // Fallback to static data when backend is unavailable
          setHospitals(NearbyHospitalsData);
        }
      } catch (err) {
        console.error("General error in fetchData:", err);
        // Use static data as final fallback
        setHospitals(NearbyHospitalsData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCall = (contact) => {
    window.location.href = `tel:${contact.replace(/[^0-9]/g, "")}`;
  };

  if (loading) {
    return (
      <div className="pt-28 pb-10 px-4 sm:px-6">
        <div className="screen-max-width mx-auto">
          <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
            <div className="text-center text-white">
              <p>Loading your information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-10 px-4 sm:px-6">
      <div className="screen-max-width mx-auto">
        {/* Glassmorphism container */}
        <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
          <div className="space-y-2 mb-6 relative">
            {/* Image positioned on top right */}
            <div className="absolute right-0 top-0">
              <img
                src={MedicalAssistanceImage}
                alt="Medical Assistance"
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            </div>

            <h2 className="text-3xl font-karla font-bold text-white text-shadow-lg">
              Medical Assistance
            </h2>
            <p className="text-white font-inter">
              Please provide your information to get medical assistance
            </p>
          </div>

          {/* First Row - User Information Form */}
          <div className="incident-form mb-8 mt-12 backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
              Your Information
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-white">
                {error}
              </div>
            )}

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

          {/* Second Row - Nearby Hospitals */}
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
              Nearby Hospitals
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hospitals.map((hospital) => (
                <div
                  key={hospital._id || hospital.id}
                  className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-4 flex flex-col"
                >
                  <h4 className="text-lg font-bold text-white mb-2 text-shadow">
                    {hospital.name}
                  </h4>

                  <div className="flex items-start space-x-2 mb-1 text-white">
                    <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                    <span>{hospital.address || hospital.location?.address}</span>
                  </div>

                  <div className="flex items-center space-x-2 mb-1 text-white">
                    <FaPhone className="flex-shrink-0" />
                    <span>{hospital.contact || hospital.contactNumbers?.[0]}</span>
                  </div>

                  <div className="text-white mb-4">
                    <span className="font-medium">Distance:</span>{" "}
                    {hospital.distance || "Contact for details"}
                  </div>

                  {/* Add location display with Google Maps links */}
                  {hospital.coordinates && (
                    <LocationDisplay
                      location={{
                        coordinates: hospital.coordinates,
                        address: hospital.address,
                      }}
                      showAddress={false}
                      showCoordinates={false}
                      className="mb-4"
                    />
                  )}

                  <CallButton
                    onClick={() =>
                      handleCall(hospital.contact || hospital.contactNumbers?.[0])
                    }
                    label="Call Now"
                    icon={<FaPhone />}
                    className="mt-auto"
                    type="danger"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Add back button at the bottom right */}
          <div className="flex justify-end mt-6">
            <BackButton onClick={() => navigate(-1)} icon={<FaArrowLeft />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalAssistance;
