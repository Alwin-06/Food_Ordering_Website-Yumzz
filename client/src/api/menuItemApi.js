import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

export const getMenuItemsByRestaurantId = async (restaurantId) => {
    try {
        const response = await axios.get(`${API_URL}/menuitems/restaurant/${restaurantId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(`Error fetching menu items for restaurant ${restaurantId}:`, error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch menu items.');
    }
};

export const getRestaurantById = async (restaurantId) => {
    try {
        const response = await axios.get(`${API_URL}/restaurants/${restaurantId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(`Error fetching restaurant ${restaurantId}:`, error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch restaurant details.');
    }
};


export const getMenuItemById = async (itemId) => {
    try {
        const response = await axios.get(`${API_URL}/menuitems/${itemId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(`Error fetching menu item ${itemId}:`, error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch menu item details.');
    }
};


























// // client/src/api/menuItemApi.js
// import axios from 'axios';
// import { getUserToken } from './authApi'; // Re-use the token getter

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// /**
//  * Helper to get authorization headers.
//  */
// const getAuthConfig = () => {
//     const token = getUserToken();
//     if (!token) {
//         // In a real app, you might redirect to login or throw an error
//         return {};
//     }
//     return {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
// };

// /**
//  * Fetches menu items for a specific restaurant from the backend.
//  * Assumes backend endpoint: GET /api/menuitems?restaurantId=<id>
//  * Or if your endpoint is /api/restaurants/:restaurantId/menuitems, adjust accordingly.
//  * @param {string} restaurantId - The ID of the restaurant.
//  * @returns {Array} List of menu item objects.
//  * @throws {Error} If the API call fails.
//  */
// export const getMenuItemsByRestaurantId = async (restaurantId) => {
//     try {
//         // Adjust this URL if your backend route is different (e.g., /restaurants/${restaurantId}/menuitems)
//         const response = await axios.get(`${API_URL}/menuitems?restaurantId=${restaurantId}`, getAuthConfig());
//         return response.data;
//     } catch (error) {
//         console.error(`Error fetching menu items for restaurant ${restaurantId}:`, error.response ? error.response.data : error.message);
//         throw new Error(error.response?.data?.message || 'Failed to fetch menu items.');
//     }
// };

// /**
//  * Fetches a single restaurant's details by ID.
//  * This is useful for displaying the restaurant name at the top of the menu page.
//  * @param {string} restaurantId - The ID of the restaurant.
//  * @returns {object} Restaurant object.
//  * @throws {Error} If the API call fails.
//  */
// export const getRestaurantById = async (restaurantId) => {
//     try {
//         const response = await axios.get(`${API_URL}/restaurants/${restaurantId}`, getAuthConfig());
//         return response.data;
//     } catch (error) {
//         console.error(`Error fetching restaurant ${restaurantId}:`, error.response ? error.response.data : error.message);
//         throw new Error(error.response?.data?.message || 'Failed to fetch restaurant details.');
//     }
// };

// // You might add other menu item-related API calls here later (e.g., getMenuItemById)