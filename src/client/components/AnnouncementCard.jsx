import React from "react";
import { 
  FaBullhorn, 
  FaCalendarAlt,
  FaExclamationCircle,
  FaInfoCircle
} from "react-icons/fa";

const AnnouncementCard = ({ announcement, showCategory = true, className = "", onClick }) => {
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

  return (
    <div 
      className={`backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-4 hover:bg-white/25 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getCategoryIcon(announcement.category)}
          <div>
            <h4 className="text-lg font-bold text-white text-shadow">
              {announcement.title}
            </h4>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-sm text-gray-300 flex items-center">
                <FaCalendarAlt className="mr-1" />
                {formatDate(announcement.date || announcement.createdAt)}
              </span>
              {showCategory && (
                <span className="text-xs px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30 text-blue-200">
                  {announcement.category}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {announcement.priority && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(announcement.priority)}`}>
            {announcement.priority.toUpperCase()}
          </div>
        )}
      </div>

      <div className="text-white text-sm leading-relaxed mb-3">
        {announcement.content}
      </div>

      {announcement.source && (
        <div className="text-right">
          <span className="text-xs text-gray-400">
            — {announcement.source}
          </span>
        </div>
      )}
    </div>
  );
};

export default AnnouncementCard;
