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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    }

    async getUpcomingAppointments() {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/upcoming`, {
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
            console.error('Error fetching upcoming appointments:', error);
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching appointment:', error);
            throw error;
        }
    }

    async createAppointment(appointmentData) {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    }

    async updateAppointment(id, appointmentData) {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating appointment:', error);
            throw error;
        }
    }

    async deleteAppointment(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
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
            console.error('Error deleting appointment:', error);
            throw error;
        }
    }

    async bulkUpdateStatus(appointmentIds, status, assignedTo = null) {
        try {
            const requestBody = { appointmentIds, status };
            if (assignedTo) {
                requestBody.assignedTo = assignedTo;
            }

            const response = await fetch(`${API_BASE_URL}/appointments/status/bulk`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error bulk updating status:', error);
            throw error;
        }
    }

    async getStatistics(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== '') {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `${API_BASE_URL}/appointments/stats/overview?${queryParams.toString()}`;
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
            console.error('Error fetching appointment statistics:', error);
            throw error;
        }
    }
}

export default new AppointmentService();
