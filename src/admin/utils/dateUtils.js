/**
 * Format a date string into a readable format
 * @param {string} dateTimeString - The date string to format
 * @returns {string} - Formatted date string
 */
export const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Not scheduled";

    try {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateTimeString).toLocaleString("en-US", options);
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateTimeString;
    }
};

/**
 * Format a date string (date only)
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
    if (!dateString) return "Not specified";

    try {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
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
