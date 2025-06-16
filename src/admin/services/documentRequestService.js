const API_BASE_URL = 'http://localhost:1337/api';

class DocumentRequestService {
    async getAllDocumentRequests(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== '' && params[key] !== 'All') {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `${API_BASE_URL}/document-requests?${queryParams.toString()}`;
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
            console.error('Error fetching document requests:', error);
            throw error;
        }
    }

    async getDocumentRequestById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/document-requests/${id}`, {
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
            console.error('Error fetching document request:', error);
            throw error;
        }
    }

    async updateDocumentRequest(id, updateData) {
        try {
            const response = await fetch(`${API_BASE_URL}/document-requests/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating document request:', error);
            throw error;
        }
    }

    async deleteDocumentRequest(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/document-requests/${id}`, {
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
            console.error('Error deleting document request:', error);
            throw error;
        }
    }
}

export default new DocumentRequestService();
