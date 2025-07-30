// // client/src/api/adminApi.js
// import axios from 'axios';
// import { getUserData } from './authApi'; // Import getUserData if needed for roles

// const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

// const adminAxios = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// export const getAllUsers = async () => {
//   try {
//     // Assuming /api/users/all exists and is protected by 'admin' role
//     const response = await adminAxios.get('/users/all');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching all users:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to fetch all users.');
//   }
// };

// export const getAllRestaurants = async () => {
//   try {
//     const response = await adminAxios.get('/restaurants'); // Public route, but using adminAxios for consistency
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching all restaurants:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to fetch all restaurants.');
//   }
// };

// export const getAllOrders = async () => {
//   try {
//     const response = await adminAxios.get('/orders'); // Protected by 'admin' role
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching all orders:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to fetch all orders.');
//   }
// };