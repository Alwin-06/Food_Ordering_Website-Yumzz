import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Home, UtensilsCrossed, Gift, User, ShoppingCart, Facebook, Twitter, Instagram, Mail, Phone, UserCircle, LogOut, Settings } from 'lucide-react';

// Import API functions
import { getMenuItemsByRestaurantId, getRestaurantById } from '../api/menuItemApi'; // Import new API functions
import { getUserData } from '../api/authApi'; // To get user data for header display

function MenuItemsPage({ onBack, onHome, restaurantId, onViewItemDetail, onCart, onRewards, user, onLogout }) { // Added user and onLogout props
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('restaurants'); // Keep active nav for styling
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // New states for fetched menu items and restaurant details
  const [restaurantName, setRestaurantName] = useState('Loading Restaurant...');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Menu Items and Restaurant Name on Component Mount/restaurantId change ---
  useEffect(() => {
    const fetchMenuAndRestaurant = async () => {
      if (!restaurantId) {
        setError('No restaurant ID provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch restaurant details for the name
        const restaurantData = await getRestaurantById(restaurantId);
        setRestaurantName(restaurantData.name || 'Unknown Restaurant');

        // Fetch menu items for the restaurant
        const itemsData = await getMenuItemsByRestaurantId(restaurantId);
        setMenuItems(itemsData);

      } catch (err) {
        setError(err.message || 'Failed to load menu items or restaurant details.');
        console.error("Error fetching menu items/restaurant:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuAndRestaurant();
  }, [restaurantId]); // Re-run effect if restaurantId changes

  // Filter menu items based on search query (now filtering `menuItems` from backend)
  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: onHome },
    { id: 'restaurants', icon: UtensilsCrossed, label: 'Restaurants', onClick: onBack }, // onBack here goes to RestaurantsPage
    { id: 'cart', icon: ShoppingCart, label: 'Cart', onClick: onCart },
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
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[60]">
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
          Back to Restaurants
        </button>
      </div>

      {/* Restaurant Name and Search */}
      <div className="px-6 pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            {/* Restaurant Name */}
            <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-wide">
              {restaurantName} {/* Display fetched restaurant name */}
            </h1>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="SEARCH"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 border-2 border-orange-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm hover:shadow-md transition-all uppercase tracking-wide font-medium text-center"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 mb-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading menu items...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">Error: {error}</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <UtensilsCrossed className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No menu items found</h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  {/* Food Image */}
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={item.image || `https://placehold.co/400x400/FF7F50/FFFFFF?text=${item.name.substring(0,1)}`} // Use backend image, fallback
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 bg-gray-100">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{item.description || 'No description available.'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">₹{item.price ? item.price.toFixed(2) : 'N/A'}</span> {/* Use backend price */}
                    </div>
                    <button 
                      onClick={() => onViewItemDetail(restaurantId, item._id)} // Pass backend _id for menu item
                      className="w-full mt-4 bg-orange-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-orange-600 transition-colors uppercase tracking-wide"
                    >
                      BUY NOW
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compact Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold text-orange-500 mb-3">Yummz</h3>
              <p className="text-gray-400 text-sm">
                Experience the ultimate culinary journey with authentic flavors.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-md font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-1">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Restaurants</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Menu</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="text-md font-semibold mb-3">Connect</h4>
              <div className="flex space-x-3 mb-3">
                <button className="bg-orange-500 hover:bg-orange-600 p-2 rounded-full transition-colors">
                  <Facebook className="w-3 h-3" />
                </button>
                <button className="bg-orange-500 hover:bg-orange-600 p-2 rounded-full transition-colors">
                  <Twitter className="w-3 h-3" />
                </button>
                <button className="bg-orange-500 hover:bg-orange-600 p-2 rounded-full transition-colors">
                  <Instagram className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Phone className="w-3 h-3 mr-2 text-orange-500" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-4 pt-4 text-center">
            <p className="text-gray-400 text-xs">&copy; 2024 Yummz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MenuItemsPage;
