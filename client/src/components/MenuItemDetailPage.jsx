import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, UtensilsCrossed, Gift, User, ShoppingCart, Minus, Plus, UserCircle, LogOut, Settings } from 'lucide-react';

// Import API functions
import { getMenuItemById } from '../api/menuItemApi'; // To fetch single menu item details
import { addItemToCart } from '../api/cartApi';       // To add item to cart
import { getUserData } from '../api/authApi';         // To get user data for header display

function MenuItemDetailPage({ onBack, onHome, restaurantId, itemId, onCart, onRewards, user, onLogout }) { // Added user and onLogout props
  const [quantity, setQuantity] = useState(1);
  const [activeNav, setActiveNav] = useState('restaurants'); // Keep active nav for styling
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // States for fetched menu item details
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for Add to Cart operation
  const [addingToCart, setAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState(null);
  const [addToCartSuccess, setAddToCartSuccess] = useState(null);

  // --- Fetch Menu Item Details on Component Mount/itemId change ---
  useEffect(() => {
    const fetchMenuItemDetails = async () => {
      if (!itemId) {
        setError('No menu item ID provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getMenuItemById(itemId);
        setMenuItem(data);
      } catch (err) {
        setError(err.message || 'Failed to load menu item details.');
        console.error("Error fetching menu item details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItemDetails();
  }, [itemId]); // Re-run effect if itemId changes

  // Default/fallback item if data is still loading or an error occurred
  // This helps prevent errors if `menuItem` is null initially
  const currentItem = menuItem || {
    name: "Loading Item...",
    price: 0,
    image: "https://placehold.co/600x400/CCCCCC/333333?text=Loading",
    description: "Loading description...",
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setAddToCartError(null);
    setAddToCartSuccess(null);

    // Ensure we have the necessary data before adding to cart
    if (!menuItem || !restaurantId || !itemId || quantity < 1) {
      setAddToCartError('Missing item details or invalid quantity.');
      setAddingToCart(false);
      return;
    }

    try {
      // Call the addItemToCart API function
      const cartData = {
        menuItemId: itemId,      // Use the actual backend item ID
        quantity: quantity,
        restaurantId: menuItem.restaurant?._id || menuItem.restaurant // Use the actual backend restaurant ID
      };
      const response = await addItemToCart(cartData);
      console.log('Item added to cart:', response);
      setAddToCartSuccess('Item added to cart successfully!');
      // Optionally, navigate to cart page after successful addition
      // onCart();

    } catch (err) {
      console.error('Failed to add to cart:', err);
      setAddToCartError(err.message || 'Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: onHome },
    { id: 'restaurants', icon: UtensilsCrossed, label: 'Restaurants', onClick: onBack }, // onBack here goes to MenuItemsPage
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
          Back to Menu
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading item details...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">Error: {error}</div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left side - Food Image */}
              <div className="relative">
                <div className="w-full h-96 rounded-2xl overflow-hidden shadow-xl border-4 border-orange-200">
                  <img 
                    src={currentItem.image || `https://placehold.co/600x400/FF7F50/FFFFFF?text=${currentItem.name.substring(0,1)}`} // Use backend image, fallback
                    alt={currentItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right side - Item Details */}
              <div className="space-y-8">
                {/* Item Name */}
                <h1 className="text-4xl font-bold text-gray-900">
                  {currentItem.name}
                </h1>

                {/* Price Section */}
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    Price :- ₹{currentItem.price ? currentItem.price.toFixed(2) : 'N/A'} {/* Use backend price */}
                  </div>
                  <p className="text-gray-500 text-sm">
                    Earn rewards while shopping
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <p className="text-gray-700 leading-relaxed">
                    {currentItem.description || 'No description available.'} {/* Use backend description */}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center border-2 border-orange-300 rounded-full overflow-hidden">
                      <button
                        onClick={decreaseQuantity}
                        className="p-3 hover:bg-orange-50 transition-colors"
                        disabled={addingToCart} // Disable during add to cart
                      >
                        <Minus className="w-4 h-4 text-orange-600" />
                      </button>
                      <span className="px-6 py-3 text-lg font-semibold text-gray-900 min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={increaseQuantity}
                        className="p-3 hover:bg-orange-50 transition-colors"
                        disabled={addingToCart} // Disable during add to cart
                      >
                        <Plus className="w-4 h-4 text-orange-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="pt-4">
                  {addToCartError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
                      <span className="block sm:inline">{addToCartError}</span>
                    </div>
                  )}
                  {addToCartSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
                      <span className="block sm:inline">{addToCartSuccess}</span>
                    </div>
                  )}
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    disabled={loading || addingToCart || !menuItem} // Disable if loading item or adding to cart, or item not loaded
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{addingToCart ? 'Adding...' : 'ADD TO CART'}</span>
                  </button>
                </div>

                {/* Total Price Display */}
                <div className="bg-gray-100 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Total:</span>
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{menuItem ? (menuItem.price * quantity).toFixed(2) : 'N/A'} {/* Calculate total based on fetched price */}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gray Bottom Section */}
      <div className="bg-gray-400 h-32"></div>
    </div>
  );
}

export default MenuItemDetailPage;
