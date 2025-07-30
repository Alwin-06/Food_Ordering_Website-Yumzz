import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, ChevronLeft, ChevronRight, Home, UtensilsCrossed, Gift, User, ShoppingCart, Facebook, Twitter, Instagram, Mail, Phone, UserCircle, LogOut, Settings } from 'lucide-react';

// Import API functions
import { getRestaurants } from '../api/restaurantApi';
import { submitInquiry } from '../api/inquiryApi';

function UserDashboard({ onBack, onRestaurants, onViewMenu, onCart, onRewards, onProfile, user, onLogout }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeNav, setActiveNav] = useState('home');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // State for fetched restaurants
  const [fetchedRestaurants, setFetchedRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [errorRestaurants, setErrorRestaurants] = useState(null);

  // State for Contact Us form
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loadingContact, setLoadingContact] = useState(false);
  const [errorContact, setErrorContact] = useState(null);
  const [successContact, setSuccessContact] = useState(null);


  // --- Fetch Restaurants on Component Mount ---
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoadingRestaurants(true);
        setErrorRestaurants(null);
        const data = await getRestaurants();
        setFetchedRestaurants(data);
      } catch (err) {
        setErrorRestaurants(err.message);
        console.error("Failed to fetch restaurants:", err);
      } finally {
        setLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, []); // Empty dependency array means this runs once on mount


  // Hardcoded data (keep for other sections as per request)
  const featuredDishes = [
    {
      id: 1,
      name: "Chicken Biryani",
      image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Aromatic basmati rice with tender chicken pieces"
    },
    {
      id: 2,
      name: "Butter Chicken",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Creamy tomato-based curry with tender chicken"
    },
    {
      id: 3,
      name: "Paneer Tikka",
      image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Grilled cottage cheese with aromatic spices"
    }
  ];

  const dishes = [ // Assuming these are categories or popular dishes, not tied to specific restaurants
    {
      id: 1,
      name: "NORTH INDIAN",
      image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 2,
      name: "CHINESE",
      image: "https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 3,
      name: "SOUTH INDIAN",
      image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 4,
      name: "STARTERS",
      image: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 5,
      name: "SANDWICH",
      image: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 6,
      name: "SOUP",
      image: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredDishes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredDishes.length) % featuredDishes.length);
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: () => setActiveNav('home') },
    { id: 'restaurants', icon: UtensilsCrossed, label: 'Restaurants', onClick: onRestaurants },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', onClick: onCart },
    { id: 'rewards', icon: Gift, label: 'Rewards', onClick: onRewards },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  // --- Contact Form Handlers ---
  const handleContactInputChange = (e) => {
    setContactFormData({
      ...contactFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoadingContact(true);
    setErrorContact(null);
    setSuccessContact(null);

    // Basic client-side validation
    if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
      setErrorContact('All fields are required for the inquiry.');
      setLoadingContact(false);
      return;
    }

    try {
      const response = await submitInquiry(contactFormData);
      setSuccessContact(response.message || 'Your message has been sent successfully!');
      setContactFormData({ name: '', email: '', message: '' }); // Clear form
    } catch (err) {
      setErrorContact(err.message);
    } finally {
      setLoadingContact(false);
    }
  };


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
            {/* Display user's name if available */}
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
                    } else if (item.id === 'home') {
                      setActiveNav('home');
                      setShowProfileDropdown(false);
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
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-[60]">
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

      {/* Enhanced Hero Slider (No changes) */}
      <div className="px-6 pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative h-80 overflow-hidden shadow-lg rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredDishes.map((dish, index) => (
                <div key={dish.id} className="w-full flex-shrink-0 relative">
                  <img 
                    src={dish.image} 
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
                    <h2 className="text-3xl font-bold mb-3">{dish.name}</h2>
                    <p className="text-lg opacity-90 max-w-md">{dish.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enhanced Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-300 group"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-orange-200" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-300 group"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:text-orange-200" />
            </button>

            {/* Enhanced Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {featuredDishes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Bar (No changes) */}
      <div className="p-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for restaurants, cuisines, dishes..."
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow"
          />
        </div>
      </div>

      {/* Enhanced Restaurants Section - NOW FETCHING FROM BACKEND */}
      <div className="px-6 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-orange-600">RESTAURANTS</h2>
            <button 
              onClick={onRestaurants}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              View All
            </button>
          </div>
          {loadingRestaurants ? (
            <div className="text-center text-gray-600">Loading restaurants...</div>
          ) : errorRestaurants ? (
            <div className="text-center text-red-600">Error: {errorRestaurants}</div>
          ) : fetchedRestaurants.length === 0 ? (
            <div className="text-center text-gray-600">No restaurants found.</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {fetchedRestaurants.map((restaurant) => ( // Use fetchedRestaurants
                <div key={restaurant._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className="h-28 overflow-hidden relative">
                    <img 
                      src={restaurant.image || `https://placehold.co/400x280/FF7F50/FFFFFF?text=${restaurant.name.substring(0,1)}`} // Use restaurant.image from backend, fallback to placeholder
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{restaurant.cuisine || 'Mixed Cuisine'}</p> {/* Use cuisine from backend */}
                    <button 
                      onClick={() => onViewMenu(restaurant._id)} // Pass backend _id
                      className="w-full mb-3 bg-orange-500 text-white py-2 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm"
                    >
                      View Menu
                    </button>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium text-gray-700">{restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">{restaurant.deliveryTime || '30-45 min'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Dishes Section (No changes) */}
      <div className="px-6 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-orange-600">DISHES</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {dishes.map((dish) => (
              <div key={dish.id} className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={dish.image} 
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
                  <h3 className="text-white font-bold text-sm text-center px-2 group-hover:text-orange-200 transition-colors">{dish.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Contact Us Section - NOW WITH BACKEND INTEGRATION */}
      <div className="px-6 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-orange-600">CONTACT US</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl mx-auto">
            <form onSubmit={handleContactSubmit} className="space-y-5">
              {/* Error/Success Messages for Contact Form */}
              {errorContact && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
                  <span className="block sm:inline">{errorContact}</span>
                </div>
              )}
              {successContact && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative" role="alert">
                  <span className="block sm:inline">{successContact}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  name="name"
                  value={contactFormData.name}
                  onChange={handleContactInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all hover:border-orange-300"
                  required
                  disabled={loadingContact}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  name="email"
                  value={contactFormData.email}
                  onChange={handleContactInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all hover:border-orange-300"
                  required
                  disabled={loadingContact}
                />
              </div>
              <textarea
                placeholder="Your Message"
                rows="4"
                name="message"
                value={contactFormData.message}
                onChange={handleContactInputChange}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all hover:border-orange-300"
                required
                disabled={loadingContact}
              ></textarea>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                disabled={loadingContact}
              >
                {loadingContact ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer (No changes) */}
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

export default UserDashboard;
