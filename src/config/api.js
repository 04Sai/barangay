// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
    VERIFY_EMAIL: `${API_BASE_URL}/api/auth/verify-email`,
    RESEND_VERIFICATION: `${API_BASE_URL}/api/auth/resend-verification`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    RESET_PASSWORD_VERIFY: (token) => `${API_BASE_URL}/api/auth/reset-password/${token}`,
  },
  ADMIN: {
    LOGIN: `${API_BASE_URL}/api/admin/login`,
    PROFILE: `${API_BASE_URL}/api/admin/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/admin/change-password`,
    LOGOUT: `${API_BASE_URL}/api/admin/logout`,
    SETUP_SUPER_ADMIN: `${API_BASE_URL}/api/admin/setup-super-admin`,
    CREATE_ADMIN: `${API_BASE_URL}/api/admin/create-admin`,
    ADMINS: `${API_BASE_URL}/api/admin/admins`,
  },
  ANNOUNCEMENTS: `${API_BASE_URL}/api/announcements`,
  HOTLINES: `${API_BASE_URL}/api/hotlines`,
  INCIDENT_REPORTS: `${API_BASE_URL}/api/incident-reports`,
  APPOINTMENTS: `${API_BASE_URL}/api/appointments`,
  RESIDENTS: `${API_BASE_URL}/api/residents`,
};

export default API_BASE_URL;
