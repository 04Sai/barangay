import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaArrowLeft,
  FaTag,
  FaChevronLeft,
  FaChevronRight,
  FaBullhorn,
  FaClock,
} from "react-icons/fa";
import {
  HealthCenterScheduleData,
  HealthServicesAnnouncementsData,
} from "../../constant";
import HealthServicesImage from "../../../assets/services/HealthService.svg";
import { useNavigate } from "react-router-dom";
import Button, { BackButton } from "../../buttons";

const HealthServices = () => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedAnnouncements, setPaginatedAnnouncements] = useState([]);
  const announcementsPerPage = 2;
  const navigate = useNavigate();

  // For announcements section
  const categories = [
    "All",
    ...new Set(HealthServicesAnnouncementsData.map((item) => item.category)),
  ];

  const filteredAnnouncements =
    filterCategory === "All"
      ? HealthServicesAnnouncementsData
      : HealthServicesAnnouncementsData.filter(
          (ann) => ann.category === filterCategory
        );

  // Calculate total pages
  const totalPages = Math.ceil(
    filteredAnnouncements.length / announcementsPerPage
  );

  // Update paginated announcements when filter or page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * announcementsPerPage;
    const endIndex = startIndex + announcementsPerPage;
    setPaginatedAnnouncements(
      filteredAnnouncements.slice(startIndex, endIndex)
    );

    // Reset to page 1 when filter changes
    if (
      currentPage >
      Math.ceil(filteredAnnouncements.length / announcementsPerPage)
    ) {
      setCurrentPage(1);
    }
  }, [filterCategory, currentPage, filteredAnnouncements]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Function to get priority badge class
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

  // Functions for pagination
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
              Barangay Health Services
            </h2>
            <p className="text-white font-inter">
              Health center services schedule and announcements
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6 mt-12">
            <Button
              onClick={() => setActiveTab("schedule")}
              label="Schedule"
              type={activeTab === "schedule" ? "primary" : "outline"}
              icon={<FaCalendarAlt />}
              className={
                activeTab !== "schedule" ? "text-white border-white/30" : ""
              }
            />
            <Button
              onClick={() => setActiveTab("announcements")}
              label="Announcements"
              type={activeTab === "announcements" ? "primary" : "outline"}
              icon={<FaBullhorn />}
              className={
                activeTab !== "announcements"
                  ? "text-white border-white/30"
                  : ""
              }
            />
          </div>

          {/* Schedule Tab Content */}
          {activeTab === "schedule" && (
            <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
              <h3 className="text-xl font-karla font-bold text-white mb-6 text-shadow">
                Health Center Weekly Schedule
              </h3>

              {/* Horizontal Display for Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(HealthCenterScheduleData).map(
                  ([day, schedules]) => (
                    <div
                      key={day}
                      className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-4 flex flex-col h-full"
                    >
                      <h4 className="text-lg font-karla font-bold text-white mb-3 capitalize text-shadow text-center bg-blue-600/30 py-2 rounded-lg">
                        {day}
                      </h4>
                      <div className="space-y-3 flex-grow">
                        {schedules.map((schedule, index) => (
                          <div
                            key={index}
                            className="py-2 border-b border-white/10 last:border-b-0"
                          >
                            <div className="flex items-center mb-2">
                              <FaClock className="text-blue-400 mr-2 flex-shrink-0" />
                              <span className="text-white font-medium text-sm">
                                {schedule.time}
                              </span>
                            </div>
                            <span className="text-white block ml-6 text-sm">
                              {schedule.service}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Announcements Tab Content */}
          {activeTab === "announcements" && (
            <>
              {/* Category Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white font-medium mr-2">
                    Filter by:
                  </span>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => setFilterCategory(category)}
                      label={category}
                      type={filterCategory === category ? "primary" : "outline"}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filterCategory !== category
                          ? "text-white border-white/30"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Announcements List */}
              <div className="space-y-4">
                {filteredAnnouncements.length === 0 ? (
                  <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 text-center text-white">
                    No announcements found for this category.
                  </div>
                ) : (
                  <>
                    {paginatedAnnouncements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6"
                      >
                        <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                          <h3 className="text-xl font-karla font-bold text-white text-shadow">
                            {announcement.title}
                          </h3>
                          <div
                            className={`${getPriorityBadgeClass(
                              announcement.priority
                            )} px-3 py-1 rounded-full text-xs font-bold text-white`}
                          >
                            {announcement.priority.toUpperCase()}
                          </div>
                        </div>

                        <div className="flex items-center text-white mb-2">
                          <FaCalendarAlt className="mr-2" />
                          <span>{formatDate(announcement.date)}</span>
                        </div>

                        <div className="flex items-center text-white mb-4">
                          <FaTag className="mr-2" />
                          <span>{announcement.category}</span>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-white mb-4">
                          <p>{announcement.content}</p>
                        </div>
                      </div>
                    ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-8">
                        {/* Pagination Dots - Bottom Left */}
                        <div className="flex space-x-2">
                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index}
                              onClick={() => handlePageChange(index + 1)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                currentPage === index + 1
                                  ? "bg-blue-600 transform scale-125"
                                  : "bg-white/30 hover:bg-white/50"
                              }`}
                              aria-label={`Page ${index + 1}`}
                            />
                          ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            label="Previous"
                            type="primary"
                            className={`${
                              currentPage === 1 ? "opacity-50" : ""
                            }`}
                            icon={<FaChevronLeft />}
                          />
                          <Button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            label="Next"
                            type="primary"
                            className={`${
                              currentPage === totalPages ? "opacity-50" : ""
                            }`}
                            icon={<FaChevronRight />}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* Add back button at the bottom right */}
          <div className="flex justify-end mt-6">
            <BackButton onClick={() => navigate(-1)} icon={<FaArrowLeft />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthServices;
