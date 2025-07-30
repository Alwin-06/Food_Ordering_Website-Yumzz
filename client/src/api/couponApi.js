import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

export const applyCoupon = async (couponCode) => {
    //const config = getAuthConfig();
    try {
        // Assuming your backend expects { couponCode } and returns { discountAmount, message }
        const response = await axios.post(`${API_URL}/coupons/apply`, { couponCode }, {withCredentials: true,});
        return response.data; // e.g., { discount: 50, message: "Coupon applied successfully!" }
    } catch (error) {
        console.error('Error applying coupon:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to apply coupon.');
    }
};

export const getCoupons = async () => {
    try {
        const response = await axios.get(`${API_URL}/coupons`, {withCredentials: true,});
        return response.data; // Should return an array of coupon objects
    } catch (error) {
        console.error('Error fetching coupons:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch coupons.');
    }
};