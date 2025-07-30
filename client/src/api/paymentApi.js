import axios from 'axios';

export const initiatePayment = async (orderId, paymentId) => {
    try {
        const { data } = await axios.post('/api/payments/initiate', { orderId, paymentId });
        return data;
    } catch (error) {
        console.error("Error initiating payment:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Failed to initiate payment.');
    }
};