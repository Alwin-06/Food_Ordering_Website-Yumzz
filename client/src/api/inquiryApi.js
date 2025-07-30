import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

export const submitInquiry = async (inquiryData) => {
    try {
        // Assuming this endpoint exists on your backend and is public or protected as needed
        const response = await axios.post(`${API_URL}/inquiries`, inquiryData);
        return response.data;
    } catch (error) {
        console.error('Error submitting inquiry:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to send message. Please try again.');
    }
};