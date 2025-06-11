const API_BASE_URL = 'http://localhost:1337/api';

class HotlineService {
    async getHotlinesByCategory(category) {
        try {
            const response = await fetch(`${API_BASE_URL}/hotlines?category=${encodeURIComponent(category)}&isActive=true`, {
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
            console.error('Error fetching hotlines by category:', error);
            throw error;
        }
    }

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
}

export default new HotlineService();
