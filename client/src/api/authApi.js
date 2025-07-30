import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials, {withCredentials: true,});

        axios.defaults.withCredentials = true;

        const { message, ...userData } = response.data;

        // Check if there's actual user data before storing
        if (userData && userData._id) { // Check for an essential user property like _id
            localStorage.setItem('user', JSON.stringify(userData));
            console.log("Successfully stored user data in localStorage:", userData); // For debugging
        } else {
            console.warn("Login response did not contain expected user data, only message:", message); // For debugging
        }

        return response.data; // Return user data and token
    } catch (error) {
        // Handle API errors
        console.error('Login API error:', error.response ? error.response.data : error.message);
        const errorMessage = error.response && error.response.data && error.response.data.message
                             ? error.response.data.message
                             : 'Login failed. Please check your credentials.';
        throw new Error(errorMessage);
    }
};

export const register = async (userData) => {
    try {
        // Map frontend 'fullName' to backend 'name'
        const dataToSend = {
            name: userData.fullName,
            email: userData.email,
            password: userData.password,
            role: userData.role === 'Restaurant Owner' ? 'restaurant' : 'user'
        };
        const response = await axios.post(`${API_URL}/auth/register`, dataToSend); // Corrected endpoint to /auth/register
        return response.data; // Backend returns a message like { message: 'User registered successfully.' }
    } catch (error) {
        console.error('Registration API error:', error.response ? error.response.data : error.message);
        const errorMessage = error.response && error.response.data && error.response.data.message
                             ? error.response.data.message
                             : 'Registration failed. Please try again.';
        throw new Error(errorMessage);
    }
};


export const logout = async () => { // Make it async
    try {
        await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true }); // Call backend to clear cookie
        localStorage.removeItem('user'); // Clear local user data
        // Optionally clear other local storage items if any
    } catch (error) {
        console.error('Logout API error:', error.response ? error.response.data : error.message);
        // Even if backend logout fails, clear local storage for a clean state
        localStorage.removeItem('user');
    }
};

export const getUserData = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
};