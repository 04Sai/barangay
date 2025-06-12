// API Base URL - this can be updated based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://139.59.250.140/api';

// Define all API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    PROFILE: `${API_BASE_URL}/auth/profile`,  // Updated proper profile endpoint
    UPDATE_PROFILE: `${API_BASE_URL}/auth/profile`,  // Endpoint for updating profile
  },

  // Admin endpoints
  ADMIN: {
    LOGIN: `${API_BASE_URL}/admin/login`,
    CREATE_ADMIN: `${API_BASE_URL}/admin/create-admin`,
    ADMINS: `${API_BASE_URL}/admin/admins`,
    PROFILE: `${API_BASE_URL}/admin/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/admin/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/admin/change-password`,
  },

  // Residents endpoints
  RESIDENTS: {
    BASE: `${API_BASE_URL}/residents`,
    STATS: `${API_BASE_URL}/residents/stats/overview`,
  },

  // Announcements endpoints
  ANNOUNCEMENTS: {
    BASE: `${API_BASE_URL}/announcements`,
  },

  // Hotlines endpoints
  HOTLINES: {
    BASE: `${API_BASE_URL}/hotlines`,
  },

  // Incident Reports endpoints
  INCIDENT_REPORTS: {
    BASE: `${API_BASE_URL}/incident-reports`,
    EMERGENCY: `${API_BASE_URL}/incident-reports/emergency`,
    STATS: `${API_BASE_URL}/incident-reports/stats/overview`,
  },

  // Appointments endpoints
  APPOINTMENTS: {
    BASE: `${API_BASE_URL}/appointments`,
    UPCOMING: `${API_BASE_URL}/appointments/upcoming`,
    STATS: `${API_BASE_URL}/appointments/stats/overview`,
    BULK_STATUS: `${API_BASE_URL}/appointments/status/bulk`,
  },
};
