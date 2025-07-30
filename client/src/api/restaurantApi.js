import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

export const getRestaurants = async () => {
    try {
        const response = await axios.get(`${API_URL}/restaurants`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching restaurants:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch restaurants.');
    }
};