import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, UtensilsCrossed, Gift, User, ShoppingCart, Facebook, Twitter, Instagram, Mail, Phone, UserCircle, LogOut, Settings, Copy, Calendar, Tag } from 'lucide-react';

// Import API functions
import { getCoupons } from '../api/couponApi';
import { getUserData } from '../api/authApi'; // To get user data for header display

function RewardsPage({ onBack, onHome, onRestaurants, onCart, user, onLogout }) { // Added user and onLogout props
  const [activeNav, setActiveNav] = useState('rewards');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // States for fetched rewards data
  const [rewards, setRewards] = useState([]); // Will store fetched rewards
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [errorRewards, setErrorRewards] = useState(null);

  // --- Fetch Rewards Data on Component Mount ---
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoadingRewards(true);
        setErrorRewards(null);
        const data = await getCoupons();
        setRewards(data); // Set the fetched rewards
      } catch (err) {
        setErrorRewards(err.message || 'Failed to load rewards.');
        console.error("Error fetching rewards:", err);
      } finally {
        setLoadingRewards(false);
      }
    };

    fetchRewards();
    // const handleUseCoupon = async (code) => {
    //   try {
    //     await useCoupon(code); // Call backend endpoint
    //     fetchRewards(); // Refresh list
    //   } catch (err) {
    //     console.error("Failed to use coupon", err);
    //   }
    // };

  }, []); // Empty dependency array means this runs once on mount

  const copyToClipboard = (code) => {
    // Using document.execCommand('copy') for broader compatibility in some iframe environments
    // navigator.clipboard.writeText is preferred but might have limitations
    const el = document.createElement('textarea');
    el.value = code;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isExpired = (dateString) => {
    if (!dateString) return true; // Treat as expired if no date
    const expiry = new Date(dateString);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare just dates, ignore time for expiry
    expiry.setHours(23, 59, 59, 999); // Consider valid until end of expiry day
    return expiry < now;
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: onHome },
    { id: 'restaurants', icon: UtensilsCrossed, label: 'Restaurants', onClick: onRestaurants },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', onClick: onCart },
    { id: 'rewards', icon: Gift, label: 'Rewards' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  // Calculate total savings (example, assuming backend provides 'used' coupons or a 'total_saved' field)
  // For now, let's just sum up discounts from active coupons for display if no backend field exists
  // Or, if backend provides `totalSavings` in user profile, use that.
  const totalSavings = rewards.reduce((sum, reward) => {
    // Assuming 'discount' is like "20% OFF" or "₹50 OFF"
    if (reward.status === 'active' && reward.discount && reward.discount.startsWith('₹')) {
      return sum + parseFloat(reward.discount.replace('₹', ''));
    }
    return sum;
  }, 0);


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
          Back to Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">MY REWARDS</h1>
            <p className="text-gray-600">Your available coupons and rewards</p>
          </div>

          {/* Rewards Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {rewards.filter(r => r.status === 'active' && !isExpired(r.expiryDate)).length}
                </div>
                <div className="text-gray-600">Active Coupons</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">₹{totalSavings.toFixed(2) || '0.00'}</div>
                <div className="text-gray-600">Potential Savings</div> {/* Changed to Potential Savings */}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {rewards.filter(r => r.status === 'used' || isExpired(r.expiryDate)).length}
                </div>
                <div className="text-gray-600">Used/Expired</div>
              </div>
            </div>
          </div>

          {/* Rewards Grid */}
          {loadingRewards ? (
            <div className="text-center py-12 text-gray-600">Loading rewards...</div>
          ) : errorRewards ? (
            <div className="text-center py-12 text-red-600">Error: {errorRewards}</div>
          ) : rewards.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Gift className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No rewards found</h3>
              <p className="text-gray-500">Check back later for exciting offers!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const expired = isExpired(reward.expiryDate);
                const statusText = expired ? 'EXPIRED' : (reward.status === 'used' ? 'USED' : 'ACTIVE');
                const cardBorderClass = expired ? 'border-gray-300 opacity-60' : 'border-orange-200 hover:border-orange-400';
                const headerBgClass = expired ? 'bg-gray-100' : 'bg-gradient-to-r from-orange-400 to-red-400';
                const statusBgClass = expired ? 'bg-gray-500' : 'bg-white/20';
                const buttonClass = expired || reward.status === 'used'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600';

                return (
                  <div
                    key={reward._id} // Use backend _id for key
                    className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${cardBorderClass}`}
                  >
                    {/* Coupon Header */}
                    <div className={`p-4 ${headerBgClass} text-white relative`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{reward.title}</h3>
                          <div className="text-2xl font-bold">{reward.discount}</div>
                        </div>
                        <div className="text-right">
                          <Gift className="w-8 h-8 mb-2" />
                          <div className={`text-xs px-2 py-1 rounded-full ${statusBgClass}`}>
                            {statusText}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coupon Body */}
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">{reward.description}</p>
                      
                      {/* Coupon Code */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 text-orange-500 mr-2" />
                            <span className="font-mono font-bold text-gray-900">{reward.code}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(reward.code)}
                            disabled={expired || reward.status === 'used'}
                            className={`p-2 rounded-lg transition-colors ${
                              expired || reward.status === 'used'
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-orange-600 hover:bg-orange-100'
                            }`}
                            title="Copy code"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        {copiedCode === reward.code && (
                          <div className="text-green-600 text-sm mt-1">Code copied!</div>
                        )}
                      </div>

                      {/* Expiry Date */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Expires: {formatDate(reward.expiryDate)}</span>
                        </div>
                        <div className={`font-medium ${
                          expired ? 'text-red-500' : 'text-green-600'
                        }`}>
                          {expired ? 'Expired' : 'Valid'}
                        </div>
                      </div>

                      {/* Minimum Order */}
                      <div className="text-sm text-gray-600 mb-4">
                        Min. order: <span className="font-semibold">₹{typeof reward.minOrder === 'number' ? reward.minOrder.toFixed(2) : '0.00'}</span> {/* Ensure minOrder is a number */}
                      </div>

                      {/* Use Button */}
                      <button
                        disabled={expired || reward.status === 'used'}
                        className={`w-full py-2 rounded-xl font-semibold transition-colors ${buttonClass}`}
                      >
                        {statusText === 'EXPIRED' ? 'Expired' : (statusText === 'USED' ? 'Used' : 'Use Coupon')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-orange-500 mb-4">Yummz</h3>
              <p className="text-gray-400 mb-4">
                Experience the ultimate culinary journey with our authentic flavors and premium ingredients.
              </p>
              <div className="flex space-x-3">
                <button className="bg-orange-500 hover:bg-orange-600 p-2 rounded-full transition-colors">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="bg-orange-500 hover:bg-orange-600 p-2 rounded-full transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="bg-orange-500 hover:bg-orange-600 p-2 rounded-full transition-colors">
                  <Instagram className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Restaurants</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Rewards</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Profile</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-gray-400 text-sm">info@yummz.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-400">&copy; 2024 Yummz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default RewardsPage;
