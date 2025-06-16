const API_BASE_URL = 'http://localhost:1337/api';

class AppointmentService {
    async getAllAppointments(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== '' && params[key] !== 'All') {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `${API_BASE_URL}/appointments?${queryParams.toString()}`;
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
            console.error('Error fetching appointments:', error);
            throw error;
        }
    }

    async getAppointmentById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
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
            console.error('Error fetching appointment:', error);
            throw error;
        }
    }

    async updateAppointmentStatus(id, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating appointment status:', error);
            throw error;
        }
    }
}

export default new AppointmentService();
