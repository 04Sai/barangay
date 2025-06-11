import React, { useState, useEffect } from "react";
import { FaPhone, FaMapMarkerAlt, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { PeaceAndOrderData } from "../../data";
import PeaceAndOrderImage from "../../../assets/services/PO.svg";
import { useNavigate } from "react-router-dom";
import Button, { BackButton, CallButton } from "../../buttons";
import { API_ENDPOINTS } from "../../../config/api";
import hotlineService from "../../services/hotlineService";

const PeaceAndOrder = () => {
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [peaceOrderServices, setPeaceOrderServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user profile data and peace & order services on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to access this service");
          setLoading(false);
          return;
        }

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

        // Fetch peace & order services from backend
        try {
          const servicesResponse = await hotlineService.getHotlinesByCategory('Peace & Order');
          if (servicesResponse && servicesResponse.success) {
            setPeaceOrderServices(servicesResponse.data);
          } else {
            setPeaceOrderServices(PeaceAndOrderData);
          }
        } catch (serviceError) {
          console.error("Error fetching peace & order services:", serviceError);
          setPeaceOrderServices(PeaceAndOrderData);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setPeaceOrderServices(PeaceAndOrderData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCall = (contact) => {
    window.location.href = `tel:${contact.replace(/[^0-9]/g, "")}`;
  };

  const getServiceTypeIcon = (type) => {
    switch (type) {
      case 'Barangay Security':
        return <FaShieldAlt className="text-blue-400" />;
      case 'Police Outpost':
        return <FaShieldAlt className="text-red-400" />;
      case 'Quick Response':
        return <FaShieldAlt className="text-orange-400" />;
      default:
        return <FaShieldAlt className="text-gray-400" />;
    }
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
                src={PeaceAndOrderImage}
                alt="Peace and Order"
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            </div>

            <h2 className="text-3xl font-karla font-bold text-white text-shadow-lg">
              Peace and Order
            </h2>
            <p className="text-white font-inter">
              Contact barangay security and peace & order services
            </p>
          </div>

          {/* User Information Form */}
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

          {/* Peace & Order Services */}
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
              Peace & Order Services
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {peaceOrderServices.map((service) => (
                <div
                  key={service._id || service.id}
                  className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-4 flex flex-col"
                >
                  <div className="flex items-center mb-2">
                    {getServiceTypeIcon(service.type)}
                    <h4 className="text-lg font-bold text-white ml-2 text-shadow">
                      {service.name}
                    </h4>
                  </div>

                  <div className="flex items-start space-x-2 mb-1 text-white">
                    <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                    <span>{service.address || service.location?.address}</span>
                  </div>

                  <div className="flex items-center space-x-2 mb-2 text-white">
                    <FaPhone className="flex-shrink-0" />
                    <span>{service.contact || service.contactNumbers?.[0]}</span>
                  </div>

                  <div className="text-white mb-4">
                    <span className="font-medium">Type:</span>{" "}
                    <span className="text-sm bg-white/10 px-2 py-1 rounded">
                      {service.type || 'Security Service'}
                    </span>
                  </div>

                  <CallButton
                    onClick={() => handleCall(service.contact || service.contactNumbers?.[0])}
                    label="Call Now"
                    icon={<FaPhone />}
                    className="mt-auto"
                    type="primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Notice */}
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <h4 className="text-red-200 font-bold mb-2">Emergency Notice</h4>
            <p className="text-red-100 text-sm">
              For immediate emergency assistance, call 911 or contact your nearest police station directly. 
              The services listed above are for non-emergency peace and order concerns within the barangay.
            </p>
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

export default PeaceAndOrder;
