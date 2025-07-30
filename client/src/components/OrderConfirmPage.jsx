import React, { useState, useEffect } from 'react'; // Import useEffect
import { CheckCircle, Home, X } from 'lucide-react';

// Import API functions
import { getOrderById } from '../api/orderApi';

function OrderConfirmPage({ orderId, paymentMethod, onBackToDashboard, onClose }) {
  // State for fetched order details
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [errorOrder, setErrorOrder] = useState(null);

  // --- Fetch Order Details on Component Mount ---
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setErrorOrder('No order ID provided for confirmation.');
        setLoadingOrder(false);
        return;
      }

      try {
        setLoadingOrder(true);
        setErrorOrder(null);
        const data = await getOrderById(orderId);
        setOrderDetails(data);
      } catch (err) {
        setErrorOrder(err.message || 'Failed to load order details.');
        console.error("Error fetching order details:", err);
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]); // Re-run effect if orderId changes

  // Helper to format payment method display
  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'cod': return 'Cash on Delivery';
      case 'upi': return 'UPI Payment';
      case 'card': return 'Card Payment';
      default: return method;
    }
  };

  // Helper to calculate estimated delivery time (can be dynamic based on restaurant/distance)
  const getEstimatedDelivery = () => {
    // For now, a static value. In a real app, this might come from backend or be calculated.
    return "25-30 minutes";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40"></div>
      
      {/* Modal */}
      <div className="relative z-50 bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-orange-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {loadingOrder ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <Home className="w-12 h-12 text-blue-500" /> {/* Using Home icon as a placeholder for loading */}
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Loading Order Details...</h1>
            <p className="text-gray-600">Please wait</p>
          </div>
        ) : errorOrder ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <X className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Error Loading Order</h1>
            <p className="text-red-600">{errorOrder}</p>
            <p className="text-gray-600 mt-2">Please try again or contact support.</p>
          </div>
        ) : !orderDetails ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600">The order details could not be retrieved.</p>
          </div>
        ) : (
          <>
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600">Your order has been successfully placed</p>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-bold text-gray-900">{orderDetails._id}</span> {/* Use fetched order ID */}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {formatPaymentMethod(orderDetails.paymentMethod)} {/* Use fetched payment method */}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-gray-900">₹{orderDetails.finalAmount.toFixed(2)}</span> {/* Display final amount */}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">{orderDetails.status || 'Confirmed'}</span> {/* Use fetched status */}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium text-gray-900">{getEstimatedDelivery()}</span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-6">
              <p className="text-gray-700 leading-relaxed">
                Thank you for your order! We'll start preparing your delicious meal right away. 
                You'll receive updates about your order status.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onBackToDashboard}
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              
              <button
                onClick={onClose}
                className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Need help? Contact us at{' '}
                <a href="tel:+15551234567" className="text-orange-600 hover:text-orange-700">
                  +1 (555) 123-4567
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderConfirmPage;
