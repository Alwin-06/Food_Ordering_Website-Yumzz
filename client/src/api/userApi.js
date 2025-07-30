import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

export const getUserProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/profile`, { withCredentials: true });
        return response.data; // Should return user object including addresses array
    } catch (error) {
        console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch user profile.');
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const response = await axios.put(`${API_URL}/users/profile`, profileData, { withCredentials: true });
        return response.data; // Should return the updated user object
    } catch (error) {
        console.error('Error updating user profile:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to update profile.');
    }
};

export const addAddressToProfile = async (addressData) => {
    try {
        // Assuming your backend endpoint for adding addresses is /api/users/profile/address
        const response = await axios.post(`${API_URL}/users/profile/address`, addressData, { withCredentials: true });
        return response.data; // Should return the updated user object with new address
    } catch (error) {
        console.error('Error adding address to profile:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to add address.');
    }
};

export const deleteAddress = async (addressId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/profile/address/${addressId}`, { withCredentials: true });
        return response.data; // Should return the updated user object
    } catch (error) {
        console.error(`Error deleting address ${addressId}:`, error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete address.');
    }
};

export const setDefaultAddress = async (addressId) => {
    try {
        const response = await axios.put(`${API_URL}/users/profile/default-address`, { addressId }, { withCredentials: true });
        return response.data; // Should return the updated user object
    } catch (error) {
        console.error(`Error setting default address ${addressId}:`, error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to set default address.');
    }
};