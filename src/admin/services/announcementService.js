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

            const url = `${API_BASE_URL}/announcements?${queryParams.toString()}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching announcements:', error);
            throw error;
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching announcement:', error);
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
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating announcement:', error);
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
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating announcement:', error);
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
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting announcement:', error);
            throw error;
        }
    }
}

export default new AnnouncementService();
