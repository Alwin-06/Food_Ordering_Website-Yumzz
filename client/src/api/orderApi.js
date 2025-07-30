import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

export const placeOrder = async (orderDetails) => {
    try {
        const response = await axios.post(`${API_URL}/orders`, orderDetails, { withCredentials: true });
        return response.data; // Should return the newly created order object
    } catch (error) {
        console.error('Error placing order:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to place order.');
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/orders/${orderId}`,{ withCredentials: true });
        return response.data; // Should return the order object
    } catch (error) {
        console.error(`Error fetching order ${orderId}:`, error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch order details.');
    }
};