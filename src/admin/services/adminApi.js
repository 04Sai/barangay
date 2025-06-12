import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

// Get the auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Create axios instance with authorization header
const createAuthorizedRequest = () => {
    const token = getToken();
    return axios.create({
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Admin profile functions
export const getAdminProfile = async () => {
    try {
        const request = createAuthorizedRequest();
        const response = await request.get(API_ENDPOINTS.ADMIN.PROFILE);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch admin profile' };
    }
};

export const updateAdminProfile = async (profileData) => {
    try {
        const request = createAuthorizedRequest();
        const response = await request.put(API_ENDPOINTS.ADMIN.UPDATE_PROFILE, profileData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update admin profile' };
    }
};

export const changeAdminPassword = async (passwordData) => {
    try {
        const request = createAuthorizedRequest();
        const response = await request.put(API_ENDPOINTS.ADMIN.CHANGE_PASSWORD, passwordData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to change password' };
    }
};

// Admin users management functions
export const getAdmins = async () => {
    try {
        const request = createAuthorizedRequest();
        const response = await request.get(API_ENDPOINTS.ADMIN.ADMINS);
        return response.data.admins || [];
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch admins' };
    }
};

export const createAdmin = async (adminData) => {
    try {
        const request = createAuthorizedRequest();
        const response = await request.post(API_ENDPOINTS.ADMIN.CREATE_ADMIN, adminData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create admin' };
    }
};
