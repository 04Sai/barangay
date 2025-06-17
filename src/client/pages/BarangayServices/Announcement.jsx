import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaArrowLeft,
  FaBullhorn,
  FaTag,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
} from "react-icons/fa";
import AnnouncementImage from "../../../assets/services/Announcements.svg";
import { useNavigate } from "react-router-dom";
import Button, { BackButton } from "../../buttons";
import announcementService from "../../services/announcementService";

const Announcement = () => {
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const announcementsPerPage = 3;
  const navigate = useNavigate();

  const categories = [
    "All",
    "Community Event",
    "Utility Advisory",
    "Health Service",
    "Health Advisory",
    "Sports Event",
    "Emergency",
    "General",
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          isActive: true,
          limit: 50,
          sortBy: "createdAt",
          sortOrder: "desc",
        };

        if (filterCategory !== "All") {
          params.category = filterCategory;
        }

        const response = await announcementService.getAllAnnouncements(params);

        if (response.success) {
          setAnnouncements(response.data || []);
          setTotalPages(
            Math.ceil((response.data || []).length / announcementsPerPage)
          );
        } else {
          throw new Error(response.error || "Failed to fetch announcements");
        }
      } catch (err) {
        setError("Failed to load announcements from server");
        setAnnouncements([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [filterCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory]);

  const getPaginatedAnnouncements = () => {
    const startIndex = (currentPage - 1) * announcementsPerPage;
    const endIndex = startIndex + announcementsPerPage;
    return announcements.slice(startIndex, endIndex);
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch (error) {
      return "Date not available";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-600";
      case "medium":
        return "bg-yellow-600";
      case "low":
        return "bg-green-600";
      default:
        return "bg-blue-600";
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-6 px-4 sm:px-6 h-screen flex flex-col">
        <div className="screen-max-width mx-auto flex-grow flex flex-col max-h-full">
          <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-5 flex flex-col h-full">
            <div className="flex justify-center items-center flex-grow">
              <FaSpinner className="animate-spin text-white text-2xl mr-3" />
              <span className="text-white text-lg">
                Loading announcements...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-6 px-4 sm:px-6 h-screen flex flex-col">
      <div className="screen-max-width mx-auto flex-grow flex flex-col max-h-full">
        <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-2xl font-karla font-bold text-white text-shadow-lg">
                Barangay Announcements
              </h2>
              <p className="text-white font-inter text-sm">
                Stay updated with the latest information from your barangay
              </p>
            </div>
            <img
              src={AnnouncementImage}
              alt="Announcements"
              className="w-14 h-14 object-contain"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white font-medium mr-2 text-sm">
                Filter:
              </span>
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  label={category}
                  type={filterCategory === category ? "primary" : "outline"}
                  className={`px-2 py-1 rounded-full text-xs ${
                    filterCategory === category
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-transparent border-white/50 text-white hover:bg-black/20 hover:border-white"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex-grow overflow-auto mb-3 pr-1">
            {announcements.length === 0 ? (
              <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-4 text-center text-white">
                <FaBullhorn className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-lg">No announcements found</p>
                <p className="text-sm text-gray-300 mt-1">
                  {filterCategory === "All"
                    ? "There are currently no active announcements."
                    : `No announcements found in the "${filterCategory}" category.`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {getPaginatedAnnouncements().map((announcement) => (
                  <div
                    key={announcement._id || announcement.id}
                    className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <h3 className="text-lg font-karla font-bold text-white text-shadow">
                        {announcement.title}
                      </h3>
                      {announcement.priority && (
                        <div
                          className={`${getPriorityBadgeClass(
                            announcement.priority
                          )} px-2 py-0.5 rounded-full text-xs font-bold text-white`}
                        >
                          {announcement.priority.toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center text-white text-sm mb-1">
                      <FaCalendarAlt className="mr-2 text-xs" />
                      <span>
                        {formatDate(
                          announcement.date || announcement.createdAt
                        )}
                      </span>
                    </div>

                    <div className="flex items-center text-white text-sm mb-2">
                      <FaTag className="mr-2 text-xs" />
                      <span>{announcement.category}</span>
                    </div>

                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-white text-sm">
                      <p>{announcement.content}</p>
                    </div>

                    {announcement.source && (
                      <div className="text-right mt-2">
                        <span className="text-xs text-gray-400">
                          — {announcement.source}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-auto pt-2 border-t border-white/20">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  onClick={() => navigate(-1)}
                  label="Back"
                  type="danger"
                  icon={<FaArrowLeft />}
                  className="ml-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
