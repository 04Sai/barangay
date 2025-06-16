const API_BASE_URL = 'http://localhost:1337/api';

class AnnouncementService {
    async getAllAnnouncements(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.category && params.category !== 'All') {
                queryParams.append('category', params.category);
            }
            if (params.isActive !== undefined) {
                queryParams.append('isActive', params.isActive);
            }
            if (params.limit) {
                queryParams.append('limit', params.limit);
            }
            if (params.page) {
                queryParams.append('page', params.page);
            }
            if (params.sortBy) {
                queryParams.append('sortBy', params.sortBy);
            }
            if (params.sortOrder) {
                queryParams.append('sortOrder', params.sortOrder);
            }

            const url = `${API_BASE_URL}/announcements?${queryParams.toString()}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data || data,
                pagination: data.pagination,
                filters: data.filters
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    async getAnnouncementById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async createAnnouncement(announcementData) {
        try {
            const response = await fetch(`${API_BASE_URL}/announcements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(announcementData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async updateAnnouncement(id, announcementData) {
        try {
            const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(announcementData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async deleteAnnouncement(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
}

export default new AnnouncementService();
