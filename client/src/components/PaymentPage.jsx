import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, UtensilsCrossed, Gift, User, ShoppingCart, CreditCard, Smartphone, Banknote, UserCircle, LogOut, Settings, CheckCircle } from 'lucide-react';

// Import API functions
import { getCart } from '../api/cartApi'; // To fetch the latest cart summary
import { placeOrder } from '../api/orderApi'; // To place the order
import { getUserData } from '../api/authApi'; // To get user data for header display
import { initiatePayment } from '../api/paymentApi'; 

function PaymentPage({ onBack, onHome, onCart, onRewards, onPaymentComplete, user, onLogout, deliveryAddress }) { // Added user, onLogout, and deliveryAddress props
  const [activeNav, setActiveNav] = useState('cart');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [upiId, setUpiId] = useState('');
  
  // States for order processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // States for fetching order summary (cart data)
  const [orderSummary, setOrderSummary] = useState(null); // Will store fetched cart data
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState(null);

  // --- Fetch Order Summary (Cart Data) on Component Mount ---
  useEffect(() => {
    const fetchOrderSummary = async () => {
      try {
        setLoadingSummary(true);
        setErrorSummary(null);
        // Fetch the latest cart to get the order summary
        const cart = await getCart();
        setOrderSummary(cart); // Assuming cart object contains all summary details
      } catch (err) {
        setErrorSummary(err.message || 'Failed to load order summary.');
        console.error("Error fetching order summary:", err);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchOrderSummary();
  }, []); // Run once on mount to get the latest cart data

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Banknote className="w-6 h-6" />,
      description: 'Pay when your order arrives'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pay using UPI ID or QR code'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Pay using your card'
    }
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
    setPaymentError(null); // Clear previous errors
    setPaymentSuccess(null); // Clear previous success messages
  };

  const handleCardInputChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleUpiInputChange = (e) => {
    setUpiId(e.target.value);
  };

  const handlePayment = async () => {
    setPaymentError(null);
    setPaymentSuccess(null);

    // --- All your initial client-side validation remains the same ---
    if (!selectedPaymentMethod) {
        setPaymentError('Please select a payment method.');
        return;
    }
    if (selectedPaymentMethod === 'card' && (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName)) {
        setPaymentError('Please fill all card details.');
        return;
    }
    if (selectedPaymentMethod === 'upi' && !upiId) {
        setPaymentError('Please enter UPI ID.');
        return;
    }
    if (!deliveryAddress?._id || !orderSummary?.restaurantId) {
        setPaymentError('Delivery address or order summary is missing.');
        return;
    }

    setIsProcessing(true);

    try {
        // --- STEP 1: Create the order by calling your backend ---
        // This payload matches what your orderController expects.
        const orderDetailsToSend = {
            clientOrderItems: orderSummary.items.map(item => ({
                menuItem: item.menuItem._id,
                qty: item.quantity,
            })),
            deliveryAddress: { // Assuming deliveryAddress prop is the full object
                address: deliveryAddress.address,
                city: deliveryAddress.city,
                postalCode: deliveryAddress.postalCode,
                country: deliveryAddress.country,
                phoneNo: deliveryAddress.phoneNo
            },
            restaurantId: orderSummary.restaurantId,
            paymentMethod: selectedPaymentMethod.toUpperCase(),
            // couponCode can be added here if you have a coupon input field
        };

        // This first call creates the order and payment records in a 'pending' state
        const initialResponse = await placeOrder(orderDetailsToSend);
        
        // --- STEP 2: Conditionally process the payment ---
        if (selectedPaymentMethod === 'upi' || selectedPaymentMethod === 'card') {
            // Now, use the IDs from the first response to initiate the payment
            const paymentResult = await initiatePayment(initialResponse.orderId, initialResponse.paymentId);
            
            setPaymentSuccess(paymentResult.message);
            onPaymentComplete(initialResponse.orderId, selectedPaymentMethod);
        } else {
            // For COD, the backend has already confirmed the order
            setPaymentSuccess(initialResponse.message);
            onPaymentComplete(initialResponse.order._id, selectedPaymentMethod);
        }

    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred.';
        setPaymentError(errorMessage);
        console.error("Payment processing error:", err);
    } finally {
        setIsProcessing(false);
    }
};

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: onHome },
    { id: 'restaurants', icon: UtensilsCrossed, label: 'Restaurants' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', onClick: onCart },
    { id: 'rewards', icon: Gift, label: 'Rewards', onClick: onRewards },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  // Default order summary structure for initial render/loading
  const currentOrderSummary = orderSummary || {
    items: [],
    itemsTotal: 0,
    deliveryCharges: 0,
    taxCharges: 0,
    discount: 0,
    finalAmount: 0  
  };

  // In PaymentPage.jsx, before the return(...) line
  console.log("Pay Button Status:", {
      paymentMethodSelected: !!selectedPaymentMethod,
      deliveryAddressAvailable: !!deliveryAddress,
      isNotProcessing: !isProcessing,
      summaryIsNotLoading: !loadingSummary,
      noSummaryError: !errorSummary,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 relative shadow-lg">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <h1 className="text-2xl font-bold tracking-wide">Yummz</h1>
        </div>

        {/* Navigation Icons */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => {
                    if (item.id === 'profile') {
                      setShowProfileDropdown(!showProfileDropdown);
                    } else if (item.onClick) {
                      item.onClick();
                    } else {
                      setActiveNav(item.id);
                      setShowProfileDropdown(false);
                    }
                  }}
                  className={`p-2 rounded-full transition-all duration-300 group relative ${
                    activeNav === item.id 
                      ? 'bg-white/20 text-white' 
                      : 'text-orange-200 hover:bg-white/10 hover:text-white'
                  }`}
                  title={item.label}
                >
                  <IconComponent className="w-5 h-5" />
                  {activeNav === item.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </button>
                
                {/* Profile Dropdown */}
                {item.id === 'profile' && showProfileDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[70]">
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center text-gray-700">
                      <UserCircle className="w-4 h-4 mr-3 text-orange-500" />
                      View Profile
                    </button>
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center text-gray-700">
                      <Settings className="w-4 h-4 mr-3 text-orange-500" />
                      Settings
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onLogout(); // Call the logout handler from App.jsx
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </header>

      {/* Back Button */}
      <div className="p-6 pb-0">
        <button
          onClick={onBack}
          className="flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Location
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">PAYMENT</h1>
            <p className="text-gray-600">Choose your preferred payment method</p>
          </div>

          {loadingSummary ? (
            <div className="text-center py-12 text-gray-600">Loading order summary...</div>
          ) : errorSummary ? (
            <div className="text-center py-12 text-red-600">Error: {errorSummary}</div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Side - Payment Methods */}
              <div className="lg:col-span-2 space-y-6">
                {/* Payment Methods */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
                  
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedPaymentMethod === method.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                        }`}
                        onClick={() => handlePaymentMethodSelect(method.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-full ${
                              selectedPaymentMethod === method.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {method.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{method.name}</h3>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            selectedPaymentMethod === method.id
                              ? 'border-orange-500 bg-orange-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedPaymentMethod === method.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Details Form */}
                {selectedPaymentMethod === 'card' && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Card Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardDetails.cardNumber}
                          onChange={handleCardInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          disabled={isProcessing}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={cardDetails.cardholderName}
                          onChange={handleCardInputChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          disabled={isProcessing}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleCardInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          disabled={isProcessing}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardInputChange}
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'upi' && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">UPI Details</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={handleUpiInputChange}
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200 sticky top-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                  
                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {currentOrderSummary.items.map((item, index) => (
                      <div key={item.menuItem._id || index} className="flex justify-between text-sm"> {/* Use menuItem._id */}
                        <span>{item.menuItem.name} x{item.quantity}</span>
                        <span>₹{(item.menuItem.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <hr className="my-4" />

                  {/* Bill Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Items Total</span>
                      {/*<span>₹{currentOrderSummary.totalItemsPrice.toFixed(2)}</span> */}
                      <span>₹{currentOrderSummary?.totalItemsPrice?.toFixed(2) ?? '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charges</span>
                      <span>₹{currentOrderSummary?.deliveryCharge?.toFixed(2) ?? '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>₹{currentOrderSummary?.taxAmount?.toFixed(2) ?? '0.00'}</span>
                    </div>
                    {currentOrderSummary.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{currentOrderSummary?.discountAmount?.toFixed(2) ?? '0.00'}</span>
                      </div>
                    )}
                  </div>

                  <hr className="my-4" />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span>₹{currentOrderSummary?.finalAmount?.toFixed(2) ?? '0.00'}</span>
                  </div>

                  {/* Payment Feedback */}
                  {paymentError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mt-4" role="alert">
                      <span className="block sm:inline">{paymentError}</span>
                    </div>
                  )}
                  {paymentSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mt-4" role="alert">
                      <span className="block sm:inline">{paymentSuccess}</span>
                    </div>
                  )}

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={!selectedPaymentMethod || isProcessing || loadingSummary || errorSummary || !deliveryAddress}
                    className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                      (selectedPaymentMethod && !isProcessing && !loadingSummary && !errorSummary && deliveryAddress)
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${currentOrderSummary?.finalAmount?.toFixed(2) ?? '0.00'}`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
