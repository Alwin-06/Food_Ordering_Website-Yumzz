import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, UtensilsCrossed, Gift, User, ShoppingCart, Minus, Plus, ChevronDown, ChevronUp, UserCircle, LogOut, Settings } from 'lucide-react';
//import { getUserToken } from '../api/authApi';

// Import API functions
import { getCart, updateCartItemQuantity, removeCartItem } from '../api/cartApi';
import { applyCoupon } from '../api/couponApi';
import { getUserData } from '../api/authApi'; // To get user data for header display

function CartPage({ onBack, onHome, onRewards, onNext, onRestaurants, user, onLogout }) { // Added user and onLogout props
  const [activeNav, setActiveNav] = useState('cart');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  // States for fetched cart data
  const [cartData, setCartData] = useState(null); // Stores the entire cart object from backend
  const [loadingCart, setLoadingCart] = useState(true);
  const [errorCart, setErrorCart] = useState(null);

  // States for coupon application
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [couponSuccess, setCouponSuccess] = useState(null);

  // --- Fetch Cart Data on Component Mount ---
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoadingCart(true);
        setErrorCart(null);
        const data = await getCart();
        setCartData(data); // Set the entire cart object
      } catch (err) {
        setErrorCart(err.message || 'Failed to load cart.');
        console.error("Error fetching cart:", err);
      } finally {
        setLoadingCart(false);
      }
    };

    if (getUserData()) {
      fetchCart();
    } else {
        // Handle case where user is not logged in (e.g., show empty cart message)
        setLoadingCart(false);
        setErrorCart('Please log in to view your cart.');
        setCartData(null); // Clear any old cart data if user logs out or session expires
    }
  }, []); // Empty dependency array means this runs once on mount

  // Use cartData.items for rendering, default to empty array if cartData is null
  const cartItems = cartData?.items || [];

  // --- Cart Item Quantity Update ---
  const updateQuantity = async (menuItemId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1

    // Optimistic update: Update UI immediately
    setCartData(prevCart => {
      if (!prevCart) return prevCart;
      const updatedItems = prevCart.items.map(item =>
        item.menuItem._id === menuItemId ? { ...item, quantity: newQuantity } : item
      );
      return { ...prevCart, items: updatedItems };
    });

    try {
      // Call backend to update quantity
      const updatedCart = await updateCartItemQuantity(menuItemId, newQuantity);
      setCartData(updatedCart); // Update with actual data from backend
      // Clear any previous coupon application messages as cart total might change
      setCouponError(null);
      setCouponSuccess(null);
    } catch (err) {
      setErrorCart(err.message || 'Failed to update item quantity.');
      console.error("Error updating cart item quantity:", err);
      // Revert optimistic update if API fails (optional, but good for robustness)
      setCartData(prevCart => {
        if (!prevCart) return prevCart;
        // Find original quantity if available, or just refetch
        return { ...prevCart, items: prevCart.items.map(item =>
            item.menuItem._id === menuItemId ? { ...item, quantity: item.quantity } : item // Revert to previous quantity
        )};
      });
    }
  };

  // --- Remove Item from Cart ---
  const removeItem = async (menuItemId) => {
    // Optimistic update: Remove from UI immediately
    setCartData(prevCart => {
      if (!prevCart) return prevCart;
      const updatedItems = prevCart.items.filter(item => item.menuItem._id !== menuItemId);
      return { ...prevCart, items: updatedItems };
    });

    try {
      // Call backend to remove item
      const updatedCart = await removeCartItem(menuItemId);
      setCartData(updatedCart); // Update with actual data from backend
      // Clear any previous coupon application messages
      setCouponError(null);
      setCouponSuccess(null);
    } catch (err) {
      setErrorCart(err.message || 'Failed to remove item from cart.');
      console.error("Error removing cart item:", err);
      // Revert optimistic update if API fails (optional)
      // You might refetch the entire cart here: fetchCart();
    }
  };

  // --- Apply Coupon ---
  const applyCouponHandler = async () => {
    setApplyingCoupon(true);
    setCouponError(null);
    setCouponSuccess(null);

    if (!couponCode) {
      setCouponError('Please enter a coupon code.');
      setApplyingCoupon(false);
      return;
    }

    try {
      const response = await applyCoupon(couponCode);
      setCouponSuccess(response.message || 'Coupon applied successfully!');
      // Assuming backend returns the updated cart or just the discount amount
      // If backend returns updated cart, update setCartData(response.cart)
      // If it only returns discount, you need to calculate totals based on it
      // For now, let's assume the backend updates the cart and getCart will reflect it.
      // Re-fetch cart to get updated totals and discount
      const updatedCart = await getCart();
      setCartData(updatedCart);
      setCouponCode(''); // Clear coupon input
    } catch (err) {
      setCouponError(err.message || 'Failed to apply coupon.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  // Calculate totals based on fetched cartData
  const itemsTotal = cartData?.totalItemsPrice || 0; // Assuming backend provides this
  const deliveryCharges = cartData?.deliveryCharge || 30; // Use backend value or default
  const taxCharges = cartData?.taxAmount || 0; // Assuming backend calculates and provides tax
  const appliedDiscount = cartData?.discountAmount || 0; // Assuming backend applies and provides discount

  const finalAmount = itemsTotal + deliveryCharges + taxCharges - appliedDiscount;

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: onHome },
    { id: 'restaurants', icon: UtensilsCrossed, label: 'Restaurants', onClick: onRestaurants },
    { id: 'cart', icon: ShoppingCart, label: 'Cart' },
    { id: 'rewards', icon: Gift, label: 'Rewards', onClick: onRewards },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-7 relative shadow-lg">
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
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Cart Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">CART</h1>
          </div>

          {loadingCart ? (
            <div className="text-center py-12 text-gray-600">Loading cart...</div>
          ) : errorCart ? (
            <div className="text-center py-12 text-red-600">Error: {errorCart}</div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingCart className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500">Add some delicious items to get started!</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Side - Products */}
              <div className="lg:col-span-2">
                {/* Products Header */}
                <div className="grid grid-cols-4 gap-4 mb-6 font-bold text-lg text-gray-900">
                  <div>Products</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-center">Total</div>
                  <div></div>
                </div>

                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.menuItem._id} className="grid grid-cols-4 gap-4 items-center bg-white p-4 rounded-xl shadow-sm">
                      {/* Product Info */}
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.menuItem.image || `https://placehold.co/64x64/FF7F50/FFFFFF?text=${item.menuItem.name.substring(0,1)}`} // Use backend image, fallback
                          alt={item.menuItem.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{item.menuItem.name}</h3>
                          <p className="text-sm text-gray-600">₹{item.menuItem.price.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border-2 border-gray-300 rounded-full overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="px-4 py-2 text-lg font-semibold text-gray-900 min-w-[50px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="text-center">
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <div className="text-center">
                        <button
                          onClick={() => removeItem(item.menuItem._id)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Confirm Order Button */}
                {cartItems.length > 0 && (
                  <div className="mt-8 text-right"> {/* Aligned to right */}
                    <button 
                      onClick={onNext}
                      className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors"
                    >
                      Confirm Order
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side - Bill */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-300">
                  {/* Coupon Code Section */}
                  <div className="mb-6">
                    <button
                      onClick={() => setShowCouponInput(!showCouponInput)}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-orange-600 transition-colors"
                      disabled={applyingCoupon}
                    >
                      <span>Coupon Code</span>
                      {showCouponInput ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    
                    {showCouponInput && (
                      <div className="mt-3 space-y-3">
                        <input
                          type="text"
                          placeholder="Coupon Code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          disabled={applyingCoupon}
                        />
                        <button
                          onClick={applyCouponHandler}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                          disabled={applyingCoupon}
                        >
                          {applyingCoupon ? 'Applying...' : 'Apply'}
                        </button>
                        {couponError && (
                          <div className="text-red-500 text-sm mt-2">{couponError}</div>
                        )}
                        {couponSuccess && (
                          <div className="text-green-500 text-sm mt-2">{couponSuccess}</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bill Section */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">BILL</h3>
                    
                    <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Items Total</span>
                        <span className="font-semibold">₹{itemsTotal.toFixed(2)}</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-gray-700 mb-1">
                          <span>Extra</span>
                          <span></span>
                        </div>
                        <div className="text-sm text-gray-600 ml-4 space-y-1">
                          <div className="flex justify-between">
                            <span>Delivery Charges</span>
                            <span>₹{deliveryCharges.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <span>₹{taxCharges.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-₹{appliedDiscount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                      <span>To Pay</span>
                      <span>₹{finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
