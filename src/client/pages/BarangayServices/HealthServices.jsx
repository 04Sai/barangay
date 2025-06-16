import React, { useState, useEffect } from "react";
import { FaPhone, FaMapMarkerAlt, FaArrowLeft, FaClock, FaCalendarAlt } from "react-icons/fa";
import { HealthCenterScheduleData, HealthServicesAnnouncementsData } from "../../data";
import HealthServicesImage from "../../../assets/services/HealthService.svg";
import { useNavigate } from "react-router-dom";
import Button, { BackButton, CallButton } from "../../buttons";
import { API_ENDPOINTS } from "../../../config/api";
import hotlineService from "../../services/hotlineService";
import announcementService from "../../services/announcementService";

const HealthServices = () => {
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [healthServices, setHealthServices] = useState([]);
  const [healthAnnouncements, setHealthAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState('monday');
  const navigate = useNavigate();

  // Fetch user profile data and health services on component mount
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

        // Fetch health services from backend
        try {
          const servicesResponse = await hotlineService.getHotlinesByCategory('Health Services');
          if (servicesResponse && servicesResponse.success) {
            setHealthServices(servicesResponse.data);
          } else {
            // Fallback to default health center data
            setHealthServices([
              {
                id: 1,
                name: "Barangay Health Center",
                address: "Barangay Hall Complex, Main Street",
                contact: "(046) 123-4567",
                distance: "0.5 km"
              }
            ]);
          }
        } catch (serviceError) {
          console.error("Error fetching health services:", serviceError);
          setHealthServices([
            {
              id: 1,
              name: "Barangay Health Center",
              address: "Barangay Hall Complex, Main Street", 
              contact: "(046) 123-4567",
              distance: "0.5 km"
            }
          ]);
        }

        // Fetch health-related announcements from backend
        try {
          const announcementsResponse = await announcementService.getAllAnnouncements({
            category: 'Health Service',
            isActive: true,
            limit: 5
          });

          if (announcementsResponse && announcementsResponse.success) {
            setHealthAnnouncements(announcementsResponse.data || []);
          } else {
            // Fallback to static data
            setHealthAnnouncements(HealthServicesAnnouncementsData || [
              {
                id: 1,
                title: "Regular Health Services Available",
                date: new Date().toISOString().split('T')[0],
                content: "Basic health services are available at the Barangay Health Center from Monday to Friday, 8:00 AM to 5:00 PM.",
                category: "Health Service",
                priority: "medium"
              }
            ]);
          }
        } catch (announcementError) {
          console.error("Error fetching health announcements:", announcementError);
          setHealthAnnouncements(HealthServicesAnnouncementsData || [
            {
              id: 1,
              title: "Regular Health Services Available",
              date: new Date().toISOString().split('T')[0],
              content: "Basic health services are available at the Barangay Health Center from Monday to Friday, 8:00 AM to 5:00 PM.",
              category: "Health Service",
              priority: "medium"
            }
          ]);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setHealthServices([]);
        setHealthAnnouncements([
          {
            id: 1,
            title: "Loading announcements...",
            date: new Date().toISOString().split('T')[0],
            content: "Please wait while we load the latest health service announcements from the server.",
            category: "Health Service",
            priority: "medium"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDaySchedule = (day) => {
    return HealthCenterScheduleData[day] || [];
  };

  const formatAnnouncementDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
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
                src={HealthServicesImage}
                alt="Health Services"
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            </div>

            <h2 className="text-3xl font-karla font-bold text-white text-shadow-lg">
              Health Services
            </h2>
            <p className="text-white font-inter">
              Access barangay health services and information
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

          {/* Health Centers */}
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 mb-6">
            <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
              Health Centers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthServices.map((service) => (
                <div
                  key={service._id || service.id}
                  className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-4 flex flex-col"
                >
                  <h4 className="text-lg font-bold text-white mb-2 text-shadow">
                    {service.name}
                  </h4>

                  <div className="flex items-start space-x-2 mb-1 text-white">
                    <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                    <span>{service.address || service.location?.address}</span>
                  </div>

                  <div className="flex items-center space-x-2 mb-1 text-white">
                    <FaPhone className="flex-shrink-0" />
                    <span>{service.contact || service.contactNumbers?.[0] || service.phoneNumber || "Contact for details"}</span>
                  </div>

                  <div className="text-white mb-4">
                    <span className="font-medium">Distance:</span>{" "}
                    {service.distance || "Contact for details"}
                  </div>

                  <CallButton
                    phoneNumber={service.contact || service.contactNumbers?.[0] || service.phoneNumber}
                    className="mt-auto"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Health Center Schedule */}
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 mb-6">
            <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
              <FaCalendarAlt className="inline mr-2" />
              Health Center Schedule
            </h3>

            {/* Day selector */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(HealthCenterScheduleData).map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1 rounded text-sm capitalize transition-colors ${
                    selectedDay === day
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Schedule for selected day */}
            <div className="space-y-2">
              {getDaySchedule(selectedDay).map((schedule, index) => (
                <div key={index} className="flex justify-between items-center bg-white/5 rounded p-3">
                  <div className="flex items-center text-white">
                    <FaClock className="mr-2" />
                    <span className="font-medium">{schedule.time}</span>
                  </div>
                  <span className="text-gray-300">{schedule.service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Health Announcements */}
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
              Health Service Announcements
            </h3>

            {healthAnnouncements.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-300">No health announcements available at the moment.</p>
                <p className="text-gray-400 text-sm mt-1">Check back later for updates.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {healthAnnouncements.map((announcement) => (
                  <div key={announcement._id || announcement.id} className="bg-white/5 rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">{announcement.title}</h4>
                      <span className="text-xs text-gray-300">
                        {formatAnnouncementDate(announcement.date || announcement.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{announcement.content}</p>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      announcement.priority === 'high' ? 'bg-red-500/20 text-red-200' :
                      announcement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-200' :
                      'bg-green-500/20 text-green-200'
                    }`}>
                      {announcement.category || 'Health Service'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add back button at the bottom right */}
          <div className="flex justify-start mt-6">
            <BackButton onClick={() => navigate(-1)} icon={<FaArrowLeft />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthServices;