const API_BASE_URL = 'http://139.59.250.140/api';

class IncidentReportService {
    async createIncidentReport(reportData) {
        try {
            const token = localStorage.getItem('token');
            
            console.log('Sending report data to API:', reportData); // Debug log
            
            const response = await fetch(`${API_BASE_URL}/incident-reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(reportData),
            });

            console.log('API response status:', response.status); // Debug log

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API error response:', errorData); // Debug log
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API success response:', data); // Debug log
            return data;
        } catch (error) {
            console.error('Error creating incident report:', error);
            throw error;
        }
    }

    async getIncidentReports(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== '') {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `${API_BASE_URL}/incident-reports?${queryParams.toString()}`;
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
}

export default new IncidentReportService();
