import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, UtensilsCrossed, Gift, User, ShoppingCart, MapPin, UserCircle, LogOut, Settings, ArrowRight } from 'lucide-react';

// Import API functions
import { getUserProfile, addAddressToProfile } from '../api/userApi';
import { getUserData } from '../api/authApi'; // To get user data for header display

function LocationPage({ onBack, onHome, onNext, onCart, onRewards, user, onLogout }) { // Added user and onLogout props
  const [activeNav, setActiveNav] = useState('cart');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // States for address selection
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedAddressFullObject, setSelectedAddressFullObject] = useState(null); // To store the full address object
  const [addressType, setAddressType] = useState('custom'); // 'custom' or 'saved'

  // States for fetching saved addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [errorAddresses, setErrorAddresses] = useState(null);

  // States for "Add New Address" form
  const [newAddressFormData, setNewAddressFormData] = useState({
    fullAddress: '', // This will be the main address string
    landmark: '',
    pincode: '',
    contactNumber: '',
    type: '', // 'Home', 'Office', 'Other'
    isDefault: false // Optional, can be set by user
  });
  const [addingAddress, setAddingAddress] = useState(false);
  const [addAddressError, setAddAddressError] = useState(null);
  const [addAddressSuccess, setAddAddressSuccess] = useState(null);


  // --- Fetch Saved Addresses on Component Mount ---
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        setErrorAddresses(null);
        const profile = await getUserProfile();
        
        if (profile) {
          // THIS IS THE FIX: If profile.addresses is missing, use an empty array [] as a fallback.
          setSavedAddresses(profile.addresses || []);
          const defaultAddress = (profile.addresses || []).find(addr => addr.isDefault);  
          if (defaultAddress) {
              setSelectedAddress(defaultAddress.fullAddress);
              setSelectedAddressFullObject(defaultAddress);
              setAddressType('saved');
            }
          }
      } catch (err) {
        setErrorAddresses(err.message || 'Failed to load saved addresses.');
        console.error("Error fetching addresses:", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []); // Run once on mount

  // --- Handlers for Address Selection ---
  const handleAddressSelection = (addressObject) => {
    setSelectedAddress(addressObject.fullAddress);
    setSelectedAddressFullObject(addressObject);
    setAddressType('saved');
    setCustomAddress(''); // Clear custom address when a saved one is selected
  };

  const handleCustomAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddressFormData(prev => ({ ...prev, [name]: value }));
    // If user is typing in custom address, make it the selected one
    if (name === 'fullAddress') {
      setSelectedAddress(value);
      setSelectedAddressFullObject(null); // Clear full object for custom address
      setAddressType('custom');
    }
  };

  // --- Handle Adding New Address ---
  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    setAddingAddress(true);
    setAddAddressError(null);
    setAddAddressSuccess(null);

    // Basic validation for new address form
    if (!newAddressFormData.fullAddress || !newAddressFormData.pincode || !newAddressFormData.contactNumber || !newAddressFormData.type) {
      setAddAddressError('Please fill all required fields for the new address.');
      setAddingAddress(false);
      return;
    }

    try {
      // Call API to add new address
      const updatedAddressesArray = await addAddressToProfile(newAddressFormData);
      setSavedAddresses(updatedAddressesArray || []); // Update saved addresses list
      setAddAddressSuccess('New address added successfully!');
      // Optionally select the newly added address
      setSelectedAddress(newAddressFormData.fullAddress);
      setSelectedAddressFullObject(newAddressFormData); // Store the new address locally
      setAddressType('custom'); // Mark as custom until it's re-fetched as saved
      setNewAddressFormData({ // Clear the form
        fullAddress: '',
        landmark: '',
        pincode: '',
        contactNumber: '',
        type: '',
        isDefault: false
      });
      // Re-fetch addresses to get the actual _id and other backend-generated fields
      // This is important for consistency if you later want to update/delete saved addresses
      setTimeout(async () => {
        const profile = await getUserProfile();
        if (profile && profile.addresses) {
            setSavedAddresses(profile.addresses);
            // Find the newly added address by its content if possible, or re-select based on default
            const newlyAdded = profile.addresses.find(addr => addr.fullAddress === selectedAddress);
            if(newlyAdded) {
                setSelectedAddressFullObject(newlyAdded);
                setAddressType('saved'); // Now it's a saved address
            }
        }
      }, 1000); // Small delay to allow backend to process and for user to see success message

    } catch (err) {
      setAddAddressError(err.message || 'Failed to add new address.');
    } finally {
      setAddingAddress(false);
    }
  };

  const handleNext = () => {
    // Pass the selected full address object to the next page
    if (selectedAddressFullObject) {
      onNext(selectedAddressFullObject); // Pass the entire object
    } else if (selectedAddress.trim() && addressType === 'custom') {
      // For custom address, create a temporary object to pass
      onNext({ fullAddress: selectedAddress, type: 'Custom', isDefault: false });
    } else {
      // Use a custom modal or toast for alerts, not native alert()
      // For now, keeping alert() as per previous components but recommend replacing
      alert('Please select or enter a delivery address');
    }
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: onHome },
    { id: 'restaurants', icon: UtensilsCrossed, label: 'Restaurants' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', onClick: onCart },
    { id: 'rewards', icon: Gift, label: 'Rewards', onClick: onRewards },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

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
          Back to Cart
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">DELIVERY LOCATION</h1>
            <p className="text-gray-600">Choose or add your delivery address</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - Add New Address */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-orange-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Add New Address</h2>
              </div>
              
              {/* Add Address Form */}
              <form onSubmit={handleAddNewAddress} className="space-y-4">
                {addAddressError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
                    <span className="block sm:inline">{addAddressError}</span>
                  </div>
                )}
                {addAddressSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative" role="alert">
                    <span className="block sm:inline">{addAddressSuccess}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    id="fullAddress"
                    name="fullAddress"
                    rows="4"
                    value={newAddressFormData.fullAddress}
                    onChange={handleCustomAddressChange}
                    placeholder="Enter your complete delivery address including house number, street, area, city, and pincode..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all hover:border-orange-300"
                    required
                    disabled={addingAddress}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Landmark (Optional)"
                    name="landmark"
                    value={newAddressFormData.landmark}
                    onChange={handleCustomAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all hover:border-orange-300"
                    disabled={addingAddress}
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    name="pincode"
                    value={newAddressFormData.pincode}
                    onChange={handleCustomAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all hover:border-orange-300"
                    required
                    disabled={addingAddress}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Contact Number"
                    name="contactNumber"
                    value={newAddressFormData.contactNumber}
                    onChange={handleCustomAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all hover:border-orange-300"
                    required
                    disabled={addingAddress}
                  />
                  <select
                    name="type"
                    value={newAddressFormData.type}
                    onChange={handleCustomAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all hover:border-orange-300"
                    required
                    disabled={addingAddress}
                  >
                    <option value="">Address Type</option>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={newAddressFormData.isDefault}
                        onChange={(e) => setNewAddressFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        disabled={addingAddress}
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                        Set as Default Address
                    </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  disabled={addingAddress}
                >
                  {addingAddress ? 'Adding Address...' : 'Save New Address'}
                </button>
              </form>
            </div>

            {/* Right Side - Saved Addresses */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Addresses</h2>
              
              {loadingAddresses ? (
                <div className="text-center py-8 text-gray-600">Loading saved addresses...</div>
              ) : errorAddresses ? (
                <div className="text-center py-8 text-red-600">Error: {errorAddresses}</div>
              ) : savedAddresses.length === 0 ? (
                <div className="text-center py-8 text-gray-600">No saved addresses found.</div>
              ) : (
                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address._id} // Use backend _id for key
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedAddressFullObject?._id === address._id && addressType === 'saved'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                      }`}
                      onClick={() => handleAddressSelection(address)} // Pass the full address object
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              address.type === 'Home' ? 'bg-green-100 text-green-800' :
                              address.type === 'Office' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {address.type}
                            </span>
                            {address.isDefault && (
                              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{address.fullAddress}</p>
                          {address.landmark && <p className="text-gray-600 text-xs">Landmark: {address.landmark}</p>}
                          {address.pincode && <p className="text-gray-600 text-xs">Pincode: {address.pincode}</p>}
                          {address.contactNumber && <p className="text-gray-600 text-xs">Contact: {address.contactNumber}</p>}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ml-3 mt-1 ${
                          selectedAddressFullObject?._id === address._id && addressType === 'saved'
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAddressFullObject?._id === address._id && addressType === 'saved' && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Address Display */}
          {selectedAddress && (
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Selected Delivery Address:</h3>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-green-500 mr-3 mt-1" />
                <p className="text-gray-700 leading-relaxed">{selectedAddress}</p>
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleNext}
              disabled={!selectedAddress.trim() || addingAddress} // Disable if no address selected or adding new
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center mx-auto ${
                selectedAddress.trim() && !addingAddress
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationPage;
