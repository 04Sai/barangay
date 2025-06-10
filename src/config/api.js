// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://139.59.250.140:1337';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`
  }
};

export default API_BASE_URL;
