import React, { useState, useEffect } from "react";
import { 
  FaBullhorn, 
  FaCalendarAlt, 
  FaArrowLeft, 
  FaSpinner,
  FaExclamationCircle,
  FaInfoCircle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../buttons";
import AnnouncementImage from "../../../assets/services/Announcement.svg";
import announcementService from "../../services/announcementService";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const categories = [
    "All",
    "Community Event",
    "Utility Advisory", 
    "Health Service",
    "Health Advisory",
    "Sports Event",
    "Emergency",
    "General"
  ];

  const priorityColors = {
    high: "bg-red-500/20 border-red-500/30 text-red-200",
    medium: "bg-yellow-500/20 border-yellow-500/30 text-yellow-200", 
    low: "bg-green-500/20 border-green-500/30 text-green-200"
  };

  const categoryIcons = {
    "Community Event": <FaBullhorn className="text-blue-400" />,
    "Health Service": <FaInfoCircle className="text-green-400" />,
    "Health Advisory": <FaExclamationCircle className="text-yellow-400" />,
    "Emergency": <FaExclamationCircle className="text-red-400" />,
    "Default": <FaBullhorn className="text-blue-400" />
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          isActive: true,
          limit: 50
        };

        if (selectedCategory !== "All") {
          params.category = selectedCategory;
        }

        const response = await announcementService.getAllAnnouncements(params);
        
        if (response && response.success) {
          setAnnouncements(response.data || []);
        } else {
          throw new Error(response?.message || "Failed to fetch announcements");
        }
      } catch (err) {
        setError(`Failed to load announcements: ${err.message}`);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [selectedCategory]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long", 
        day: "numeric"
      });
    } catch (error) {
      return "Date not available";
    }
  };

  const getPriorityClass = (priority) => {
    return priorityColors[priority?.toLowerCase()] || priorityColors.low;
  };

  const getCategoryIcon = (category) => {
    return categoryIcons[category] || categoryIcons.Default;
  };

  if (loading) {
    return (
      <div className="pt-28 pb-10 px-4 sm:px-6">
        <div className="screen-max-width mx-auto">
          <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
            <div className="flex justify-center items-center my-8">
              <FaSpinner className="animate-spin text-white mr-2" />
              <span className="text-white">Loading announcements...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-10 px-4 sm:px-6">
      <div className="screen-max-width mx-auto">
        <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
          <div className="space-y-2 mb-6 relative">
            <div className="absolute right-0 top-0">
              <img
                src={AnnouncementImage}
                alt="Barangay Announcements"
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            </div>

            <h2 className="text-3xl font-karla font-bold text-white text-shadow-lg">
              Barangay Announcements
            </h2>
            <p className="text-white font-inter">
              Stay updated with the latest announcements from our barangay
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200">{error}</p>
              <p className="text-red-300 text-sm mt-1">
                Showing cached announcements instead.
              </p>
            </div>
          )}

          <div className="mb-8 mt-12">
            <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-500/30 border-blue-500/50 text-white"
                      : "bg-white/10 border-white/30 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
            <h3 className="text-xl font-karla font-bold text-white mb-6 text-shadow">
              {selectedCategory === "All" ? "All Announcements" : `${selectedCategory} Announcements`}
              <span className="ml-2 text-sm font-normal text-gray-300">
                ({announcements.length} {announcements.length === 1 ? 'announcement' : 'announcements'})
              </span>
            </h3>

            {announcements.length === 0 ? (
              <div className="text-center py-8">
                <FaBullhorn className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-300 text-lg">No announcements found</p>
                <p className="text-gray-400 text-sm">
                  {selectedCategory === "All" 
                    ? "There are currently no active announcements."
                    : `No announcements found in the "${selectedCategory}" category.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement._id || announcement.id}
                    className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6 hover:bg-white/25 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(announcement.category)}
                        <div>
                          <h4 className="text-xl font-bold text-white text-shadow">
                            {announcement.title}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-300 flex items-center">
                              <FaCalendarAlt className="mr-1" />
                              {formatDate(announcement.date || announcement.createdAt)}
                            </span>
                            <span className="text-sm px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30 text-blue-200">
                              {announcement.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {announcement.priority && (
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityClass(announcement.priority)}`}>
                          {announcement.priority.toUpperCase()} PRIORITY
                        </div>
                      )}
                    </div>

                    <div className="text-white leading-relaxed mb-4">
                      {announcement.content}
                    </div>

                    {announcement.source && (
                      <div className="text-right">
                        <span className="text-sm text-gray-400">
                          — {announcement.source}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <BackButton onClick={() => navigate(-1)} icon={<FaArrowLeft />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
