const API_BASE_URL = 'http://139.59.250.140/api';

class ResidentService {
    async getAllResidents(params = {}) {
        try {
            const queryParams = new URLSearchParams();

            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== '' && params[key] !== 'All') {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `${API_BASE_URL}/residents?${queryParams.toString()}`;
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
            return data;
        } catch (error) {
            console.error('Error fetching residents:', error);
            throw error;
        }
    }

    async getResidentById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/residents/${id}`, {
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
            console.error('Error fetching resident:', error);
            throw error;
        }
    }

    async createResident(residentData) {
        try {
            const response = await fetch(`${API_BASE_URL}/residents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(residentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating resident:', error);
            throw error;
        }
    }

    async updateResident(id, residentData) {
        try {
            const response = await fetch(`${API_BASE_URL}/residents/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(residentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating resident:', error);
            throw error;
        }
    }

    async deleteResident(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/residents/${id}`, {
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
            console.error('Error deleting resident:', error);
            throw error;
        }
    }

    async getStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}/residents/stats/overview`, {
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
            console.error('Error fetching resident statistics:', error);
            throw error;
        }
    }
}

export default new ResidentService();
