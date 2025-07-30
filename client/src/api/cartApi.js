import axios from 'axios';
//import { getUserToken } from './authApi'; // Re-use the token getter

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';


export const addItemToCart = async (itemData) => {
    try {
        const response = await axios.post(`${API_URL}/cart/add`, itemData, {withCredentials: true});
        return response.data;
    } catch (error) {
        console.error('Error adding item to cart:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to add item to cart.');
    }
};

export const getCart = async () => {
    try {
        const response = await axios.get(`${API_URL}/cart`, {withCredentials: true});
        return response.data; // Should return the cart object, e.g., { _id, userId, restaurantId, items: [] }
    } catch (error) {
        console.error('Error fetching cart:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch cart.');
    }
};

export const updateCartItemQuantity = async (menuItemId, quantity) => {
    try {
        const response = await axios.put(`${API_URL}/cart/update-item`, { menuItemId, quantity }, {withCredentials: true});
        return response.data; // Should return the updated cart object
    } catch (error) {
        console.error('Error updating cart item quantity:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to update item quantity.');
    }
};

export const removeCartItem = async (menuItemId) => {
    try {
        const response = await axios.delete(`${API_URL}/cart/remove-item/${menuItemId}`, {withCredentials: true});
        return response.data; // Should return the updated cart object
    } catch (error) {
        console.error('Error removing cart item:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to remove item from cart.');
    }
};