const API_BASE_URL = 'http://localhost:1337/api';

class DocumentRequestService {
    async createDocumentRequest(requestData) {
        try {
            console.log('Sending document request:', requestData);
            
            const response = await fetch(`${API_BASE_URL}/document-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Document request error response:', errorData);
                
                // Handle validation errors specifically
                if (errorData.errors && Array.isArray(errorData.errors)) {
                    throw new Error(`Validation failed: ${errorData.errors.join(', ')}`);
                }
                
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating document request:', error);
            throw error;
        }
    }

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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating document request:', error);
            throw error;
        }
    }
}

export default new DocumentRequestService();
