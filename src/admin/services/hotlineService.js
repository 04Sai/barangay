const API_BASE_URL = 'http://localhost:1337/api';

class HotlineService {
    async getAllHotlines(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== '') {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `${API_BASE_URL}/hotlines?${queryParams.toString()}`;
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
            console.error('Error fetching hotlines:', error);
            throw error;
        }
    }

    async getEmergencyHotlines() {
        try {
            const response = await fetch(`${API_BASE_URL}/hotlines/emergency`, {
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
            console.error('Error fetching emergency hotlines:', error);
            throw error;
        }
    }

    async getHotlineById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/hotlines/${id}`, {
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
            console.error('Error fetching hotline:', error);
            throw error;
        }
    }

    async createHotline(hotlineData) {
        try {
            const response = await fetch(`${API_BASE_URL}/hotlines`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(hotlineData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating hotline:', error);
            throw error;
        }
    }

    async updateHotline(id, hotlineData) {
        try {
            const response = await fetch(`${API_BASE_URL}/hotlines/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(hotlineData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating hotline:', error);
            throw error;
        }
    }

    async deleteHotline(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/hotlines/${id}`, {
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
            console.error('Error deleting hotline:', error);
            throw error;
        }
    }

    async bulkUpdateVerification(hotlineIds, isVerified) {
        try {
            const response = await fetch(`${API_BASE_URL}/hotlines/verify/bulk`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hotlineIds, isVerified }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error bulk updating verification:', error);
            throw error;
        }
    }

    async getStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}/hotlines/stats/overview`, {
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
            console.error('Error fetching hotline statistics:', error);
            throw error;
        }
    }
}

export default new HotlineService();
