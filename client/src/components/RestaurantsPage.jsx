import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, ArrowLeft, Home, UtensilsCrossed, Gift, User, ShoppingCart, Facebook, Twitter, Instagram, Mail, Phone, UserCircle, LogOut, Settings } from 'lucide-react';

// Import API functions
import { getRestaurants } from '../api/restaurantApi'; // Assuming this file exists and has getRestaurants
import { getUserData } from '../api/authApi'; // To get user data for header display

function RestaurantsPage({ onBack, onHome, onViewMenu, onCart, onRewards, onProfile, user, onLogout }) { // Added user and onLogout props
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('restaurants'); // Keep active nav for styling
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // New states for fetching restaurants from backend
  const [allRestaurants, setAllRestaurants] = useState([]); // Will store all fetched restaurants
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch restaurants from the backend on component mount
  useEffect(() => {
    const fetchAllRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRestaurants(); // Call your API function
        setAllRestaurants(data); // Store the fetched data
      } catch (err) {
        setError(err.message || 'Failed to load restaurants.');
        console.error("Error fetching restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRestaurants();
  }, []); // Empty dependency array means this runs once on mount

  // Filter restaurants based on search query (now filtering `allRestaurants` from backend)
  const filteredRestaurants = allRestaurants.filter(restaurant => {
    const query = searchQuery.toLowerCase();
    return (
      restaurant.name.toLowerCase().includes(query) ||
      (restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(query)) || // Check if cuisine exists
      (restaurant.location && restaurant.location.toLowerCase().includes(query)) // Check if location exists
    );
  });

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: onHome },
    { id: 'restaurants', icon: UtensilsCrossed, label: 'Restaurants', onClick: () => setActiveNav('restaurants') }, // Keep active nav for styling
    { id: 'cart', icon: ShoppingCart, label: 'Cart', onClick: onCart },
    { id: 'rewards', icon: Gift, label: 'Rewards', onClick: onRewards },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 relative shadow-lg">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <h1 className="text-2xl font-bold tracking-wide">Yummz</h1>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mt-1">
            <MapPin className="w-4 h-4 mr-1 text-orange-200" />
            {/* Display user's name from props */}
            <span className="text-sm text-orange-100">Delivering to {user?.name || 'Home'}</span>
          </div>
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
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onProfile();
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center text-gray-700"
                    >
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

      {/* Search Bar */}
      <div className="p-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for restaurants, cuisines, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow"
          />
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="px-6 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-red-600">RESTAURANTS</h2>
            <p className="text-gray-600 mt-2">
              {loading ? 'Loading...' : `${filteredRestaurants.length} restaurants found`}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading restaurants...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">Error: {error}</div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <UtensilsCrossed className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No restaurants found</h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <div key={restaurant._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border-2 border-orange-200 hover:border-orange-400">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={restaurant.image || `https://placehold.co/400x280/FF7F50/FFFFFF?text=${restaurant.name.substring(0,1)}`} // Use backend image, fallback if missing
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors text-lg">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine || 'Multi Cuisine'}</p> {/* Use backend cuisine */}
                    <p className="text-xs text-gray-500 mb-4 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {restaurant.location || 'N/A'} {/* Use backend location */}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium text-gray-700">{restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}</span> {/* Use backend rating */}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">{restaurant.deliveryTime || '30-45 min'}</span> {/* Use backend deliveryTime */}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onViewMenu(restaurant._id)} // Pass backend _id
                      className="w-full mt-4 bg-orange-500 text-white py-2 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              ))}
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
                  <MapPin className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-gray-400 text-sm">123 Food Street, Taste City, TC 12345</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-gray-400 text-sm">info@yummz.com</span>
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

export default RestaurantsPage;
