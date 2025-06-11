import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaArrowLeft,
  FaBullhorn,
  FaTag,
  FaExclamationCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import AnnouncementImage from "../../../assets/services/Announcements.svg";
import { useNavigate } from "react-router-dom";
import Button, { BackButton } from "../../buttons";

const Announcement = () => {
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedAnnouncements, setPaginatedAnnouncements] = useState([]);
  const announcementsPerPage = 3;
  const navigate = useNavigate();

  // Minimal fallback data for this component
  const fallbackAnnouncementsData = [];

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

  const filteredAnnouncements =
    filterCategory === "All"
      ? fallbackAnnouncementsData
      : fallbackAnnouncementsData.filter(
          (ann) => ann.category === filterCategory
        );

  const totalPages = Math.ceil(
    filteredAnnouncements.length / announcementsPerPage
  );

  useEffect(() => {
    const startIndex = (currentPage - 1) * announcementsPerPage;
    const endIndex = startIndex + announcementsPerPage;
    setPaginatedAnnouncements(
      filteredAnnouncements.slice(startIndex, endIndex)
    );

    if (
      currentPage >
      Math.ceil(filteredAnnouncements.length / announcementsPerPage)
    ) {
      setCurrentPage(1);
    }
  }, [filterCategory, currentPage, filteredAnnouncements]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
                    filterCategory !== category
                      ? "text-white border-white/30"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex-grow overflow-auto mb-3 pr-1">
            {filteredAnnouncements.length === 0 ? (
              <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-4 text-center text-white">
                No announcements found for this category.
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <h3 className="text-lg font-karla font-bold text-white text-shadow">
                        {announcement.title}
                      </h3>
                      <div
                        className={`${getPriorityBadgeClass(
                          announcement.priority
                        )} px-2 py-0.5 rounded-full text-xs font-bold text-white`}
                      >
                        {announcement.priority.toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center text-white text-sm mb-1">
                      <FaCalendarAlt className="mr-2 text-xs" />
                      <span>{formatDate(announcement.date)}</span>
                    </div>

                    <div className="flex items-center text-white text-sm mb-2">
                      <FaTag className="mr-2 text-xs" />
                      <span>{announcement.category}</span>
                    </div>

                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-white text-sm">
                      <p>{announcement.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-auto pt-2 border-t border-white/20">
            <div className="flex justify-between items-center">
              {totalPages > 1 && (
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentPage === index + 1
                          ? "bg-blue-600 transform scale-125"
                          : "bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Page ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              <div className="flex space-x-2">
                {totalPages > 1 && (
                  <>
                    <Button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      label=""
                      type="primary"
                      className={`p-2 ${currentPage === 1 ? "opacity-50" : ""}`}
                      icon={<FaChevronLeft />}
                    />
                    <Button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      label=""
                      type="primary"
                      className={`p-2 ${
                        currentPage === totalPages ? "opacity-50" : ""
                      }`}
                      icon={<FaChevronRight />}
                    />
                  </>
                )}
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
