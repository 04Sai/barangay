/**
 * Format a date string into a readable format
 * @param {string} dateTimeString - The date string to format
 * @returns {string} - Formatted date string
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format a date string (date only)
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format a date string (time only)
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted time string
 */
export const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (error) {
    return 'Invalid Time';
  }
};

/**
 * Get relative time from now
 * @param {string} dateString - The date string to compare with current time
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  } catch (error) {
    return 'Unknown';
  }
};

/**
 * Get a date string in ISO format for input[type="date"]
 * @param {Date|string} date - The date to format
 * @returns {string} - Date in YYYY-MM-DD format
 */
export const getISODateString = (date) => {
    if (!date) return '';

    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toISOString().split('T')[0];
    } catch (error) {
        console.error("Error formatting ISO date:", error);
        return '';
    }
};
