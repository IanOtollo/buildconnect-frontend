import { api } from './api';

export const serviceRequestsAPI = {
    async fetchData(endpoint) {
        try {
            const response = await api.get(endpoint);
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw new Error('Failed to fetch data from service request API.');
        }
    },
    async postData(endpoint, data) {
        try {
            const response = await api.post(endpoint, data);
            return response.data;
        } catch (error) {
            console.error('Error posting data:', error);
            throw new Error('Failed to post data to service request API.');
        }
    }
};