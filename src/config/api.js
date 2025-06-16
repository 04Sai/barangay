const API_BASE_URL = 'http://localhost:1337/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    RESEND_VERIFICATION: `${API_BASE_URL}/auth/resend-verification`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },

  ADMIN: {
    LOGIN: `${API_BASE_URL}/admin/login`,
    CREATE_ADMIN: `${API_BASE_URL}/admin/create-admin`,
    ADMINS: `${API_BASE_URL}/admin/admins`,
    PROFILE: `${API_BASE_URL}/admin/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/admin/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/admin/change-password`,
  },

  RESIDENTS: {
    BASE: `${API_BASE_URL}/residents`,
    STATS: `${API_BASE_URL}/residents/stats/overview`,
  },

  ANNOUNCEMENTS: {
    BASE: `${API_BASE_URL}/announcements`,
  },

  HOTLINES: {
    BASE: `${API_BASE_URL}/hotlines`,
  },

  INCIDENT_REPORTS: {
    BASE: `${API_BASE_URL}/incident-reports`,
    EMERGENCY: `${API_BASE_URL}/incident-reports/emergency`,
    STATS: `${API_BASE_URL}/incident-reports/stats/overview`,
  },

  APPOINTMENTS: {
    BASE: `${API_BASE_URL}/appointments`,
    UPCOMING: `${API_BASE_URL}/appointments/upcoming`,
    STATS: `${API_BASE_URL}/appointments/stats/overview`,
    BULK_STATUS: `${API_BASE_URL}/appointments/status/bulk`,
  },
};
