const API_BASE_URL = 'http://localhost:1337/api';

class IncidentReportService {
    async getAllIncidentReports(params = {}) {
        try {
            console.log('Fetching incident reports with params:', params);
            
            const queryParams = new URLSearchParams();
            
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== '' && params[key] !== 'All') {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `${API_BASE_URL}/incident-reports?${queryParams.toString()}`;
            console.log('Request URL:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API error response:', errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API success response:', data);
            return data;
        } catch (error) {
            console.error('Error fetching incident reports:', error);
            throw error;
        }
    }

    async getEmergencyReports() {
        try {
            const response = await fetch(`${API_BASE_URL}/incident-reports/emergency`, {
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
            console.error('Error fetching emergency reports:', error);
            throw error;
        }
    }

    async getIncidentReportById(id) {
        try {
            console.log('Fetching incident report by ID:', id);
            
            const response = await fetch(`${API_BASE_URL}/incident-reports/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API error response:', errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API success response:', data);
            return data;
        } catch (error) {
            console.error('Error fetching incident report:', error);
            throw error;
        }
    }

    async createIncidentReport(reportData) {
        try {
            const response = await fetch(`${API_BASE_URL}/incident-reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating incident report:', error);
            throw error;
        }
    }

    async updateIncidentReport(id, updateData) {
        try {
            console.log('Updating incident report:', id, updateData);
            
            const response = await fetch(`${API_BASE_URL}/incident-reports/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating incident report:', error);
            throw error;
        }
    }

    async deleteIncidentReport(id) {
        try {
            console.log('Deleting incident report:', id);
            
            const response = await fetch(`${API_BASE_URL}/incident-reports/${id}`, {
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
            console.error('Error deleting incident report:', error);
            throw error;
        }
    }

    async bulkUpdateStatus(reportIds, status, assignedTo = null) {
        try {
            const requestBody = { reportIds, status };
            if (assignedTo) {
                requestBody.assignedTo = assignedTo;
            }

            const response = await fetch(`${API_BASE_URL}/incident-reports/status/bulk`, {
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

            const url = `${API_BASE_URL}/incident-reports/stats/overview?${queryParams.toString()}`;
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
            console.error('Error fetching incident statistics:', error);
            throw error;
        }
    }
}

export default new IncidentReportService();
