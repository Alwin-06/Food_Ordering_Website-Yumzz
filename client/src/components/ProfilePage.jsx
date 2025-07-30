import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, UtensilsCrossed, Gift, User, ShoppingCart, Edit3, Save, X, MapPin, Phone, Mail, UserCircle, LogOut, Settings, Plus, Trash2 } from 'lucide-react';

// Import API functions
import { getUserProfile, updateUserProfile, addAddressToProfile, deleteAddress, setDefaultAddress } from '../api/userApi';
import { getUserData } from '../api/authApi'; // To get user data for header display (though user prop is primary)

function ProfilePage({ onBack, onHome, onRestaurants, onCart, onRewards, user, onLogout }) { // Added user and onLogout props
  const [activeNav, setActiveNav] = useState('profile');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Profile data states
  const [userProfile, setUserProfile] = useState(null); // Will be fetched from backend
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  // Addresses data states
  const [addresses, setAddresses] = useState([]); // Will be fetched from backend
  const [loadingAddresses, setLoadingAddresses] = useState(true); // Can be combined with loadingProfile if fetched together
  const [errorAddresses, setErrorAddresses] = useState(null);

  // Editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfileData, setEditedProfileData] = useState({}); // For profile form inputs

  // Add new address states
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddressFormData, setNewAddressFormData] = useState({
    fullAddress: '',
    landmark: '',
    pincode: '',
    contactNumber: '', // Added contact number to new address form
    type: 'Home',
    isDefault: false
  });
  const [addingAddress, setAddingAddress] = useState(false);
  const [addAddressError, setAddAddressError] = useState(null);
  const [addAddressSuccess, setAddAddressSuccess] = useState(null);

  // Edit existing address states (optional, but good for completeness)
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressData, setEditingAddressData] = useState(null); // The address object being edited
  const [editAddressError, setEditAddressError] = useState(null);
  const [editAddressSuccess, setEditAddressSuccess] = useState(null);


  // --- Fetch User Profile and Addresses on Component Mount ---
  useEffect(() => {
    const fetchUserProfileAndAddresses = async () => {
      try {
        setLoadingProfile(true);
        setErrorProfile(null);
        const profile = await getUserProfile();
        setUserProfile(profile);
        setEditedProfileData({ // Initialize edited data with fetched profile
            fullName: profile.fullName || '',
            email: profile.email || '',
            phone: profile.phone || ''
        });
        setAddresses(profile.addresses || []); // Set addresses from profile
      } catch (err) {
        setErrorProfile(err.message || 'Failed to load user profile.');
        console.error("Error fetching user profile:", err);
      } finally {
        setLoadingProfile(false);
        setLoadingAddresses(false); // Addresses loaded with profile
      }
    };

    fetchUserProfileAndAddresses();
  }, []); // Empty dependency array means this runs once on mount

  // --- Profile Editing Handlers ---
  const handleEditProfile = () => {
    setIsEditingProfile(true);
    // Ensure editedProfileData is in sync with current userProfile
    setEditedProfileData({
        fullName: userProfile.fullName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || ''
    });
  };

  const handleSaveProfile = async () => {
    setLoadingProfile(true); // Show loading during save
    setErrorProfile(null);
    try {
      const updatedProfile = await updateUserProfile(editedProfileData);
      setUserProfile(updatedProfile); // Update main profile state
      setIsEditingProfile(false);
      // Optionally show a success message
    } catch (err) {
      setErrorProfile(err.message || 'Failed to save profile.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
    // Revert editedProfileData to current userProfile values
    setEditedProfileData({
        fullName: userProfile.fullName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || ''
    });
  };

  const handleProfileInputChange = (e) => {
    setEditedProfileData({
      ...editedProfileData,
      [e.target.name]: e.target.value
    });
  };

  // --- Add New Address Handlers ---
  const handleNewAddressInputChange = (e) => {
    setNewAddressFormData({
      ...newAddressFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    setAddingAddress(true);
    setAddAddressError(null);
    setAddAddressSuccess(null);

    // Basic validation
    if (!newAddressFormData.fullAddress || !newAddressFormData.pincode || !newAddressFormData.contactNumber || !newAddressFormData.type) {
      setAddAddressError('All required fields must be filled.');
      setAddingAddress(false);
      return;
    }

    try {
      const updatedProfile = await addAddressToProfile(newAddressFormData);
      setAddresses(updatedProfile.addresses); // Update local addresses state
      setAddAddressSuccess('Address added successfully!');
      setNewAddressFormData({ // Reset form
        fullAddress: '',
        landmark: '',
        pincode: '',
        contactNumber: '',
        type: 'Home',
        isDefault: false
      });
      setShowAddAddressForm(false); // Hide form
    } catch (err) {
      setAddAddressError(err.message || 'Failed to add address.');
    } finally {
      setAddingAddress(false);
    }
  };

  // --- Delete Address Handler ---
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) { // Using window.confirm for simplicity, replace with custom modal
      setLoadingAddresses(true); // Show loading
      setErrorAddresses(null);
      try {
        const updatedProfile = await deleteAddress(addressId);
        setAddresses(updatedProfile.addresses); // Update local addresses state
        // Optionally show success message
      } catch (err) {
        setErrorAddresses(err.message || 'Failed to delete address.');
      } finally {
        setLoadingAddresses(false);
      }
    }
  };

  // --- Set Default Address Handler ---
  const handleSetDefaultAddress = async (addressId) => {
    setLoadingAddresses(true); // Show loading
    setErrorAddresses(null);
    try {
      const updatedProfile = await setDefaultAddress(addressId);
      setAddresses(updatedProfile.addresses); // Update local addresses state
      // Optionally show success message
    } catch (err) {
      setErrorAddresses(err.message || 'Failed to set default address.');
    } finally {
      setLoadingAddresses(false);
    }
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', onClick: onHome },
    { id: 'restaurants', icon: UtensilsCrossed, label: 'Restaurants', onClick: onRestaurants },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', onClick: onCart },
    { id: 'rewards', icon: Gift, label: 'Rewards', onClick: onRewards },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="text-center text-gray-600 text-lg">Loading profile...</div>
      </div>
    );
  }

  if (errorProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="text-center text-red-600 text-lg">Error: {errorProfile}</div>
      </div>
    );
  }

  // Ensure userProfile is not null before accessing its properties
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="text-center text-gray-600 text-lg">User profile not found.</div>
      </div>
    );
  }

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
          Back to Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">MY PROFILE</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - Profile Picture and Quick Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Picture Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UserCircle className="w-20 h-20 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{userProfile.fullName}</h2>
                <p className="text-gray-600 mb-2">{userProfile.role || 'User'}</p>
                <p className="text-sm text-gray-500">Member since {new Date(userProfile.joinDate).toLocaleDateString()}</p>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-bold text-orange-600">{userProfile.totalOrders || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Saved Addresses</span>
                    <span className="font-bold text-orange-600">{addresses.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Profile Details and Addresses */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                  {!isEditingProfile ? (
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
                        disabled={loadingProfile}
                      >
                        {loadingProfile ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save</>}
                      </button>
                      <button
                        onClick={handleCancelEditProfile}
                        className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors"
                        disabled={loadingProfile}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                {errorProfile && isEditingProfile && ( // Show error if editing and there's an error
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
                        <span className="block sm:inline">{errorProfile}</span>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        name="fullName"
                        value={editedProfileData.fullName}
                        onChange={handleProfileInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={loadingProfile}
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <UserCircle className="w-5 h-5 text-orange-500 mr-3" />
                        <span className="text-gray-900">{userProfile.fullName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    {isEditingProfile ? (
                      <input
                        type="email"
                        name="email"
                        value={editedProfileData.email}
                        onChange={handleProfileInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={loadingProfile}
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <Mail className="w-5 h-5 text-orange-500 mr-3" />
                        <span className="text-gray-900">{userProfile.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    {isEditingProfile ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editedProfileData.phone}
                        onChange={handleProfileInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={loadingProfile}
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <Phone className="w-5 h-5 text-orange-500 mr-3" />
                        <span className="text-gray-900">{userProfile.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-orange-500 mr-3" />
                      <span className="text-gray-900">{userProfile.role || 'User'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Saved Addresses */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Saved Addresses</h3>
                  <button
                    onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                    className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </button>
                </div>

                {/* Add New Address Form */}
                {showAddAddressForm && (
                  <div className="mb-6 p-4 border-2 border-orange-200 rounded-xl bg-orange-50">
                    <h4 className="font-semibold text-gray-900 mb-4">Add New Address</h4>
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
                            <label htmlFor="newAddressFullAddress" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <textarea
                                id="newAddressFullAddress"
                                name="fullAddress"
                                value={newAddressFormData.fullAddress}
                                onChange={handleNewAddressInputChange}
                                rows="3"
                                placeholder="Enter complete address"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                required
                                disabled={addingAddress}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="newAddressLandmark" className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                                <input
                                    type="text"
                                    id="newAddressLandmark"
                                    name="landmark"
                                    value={newAddressFormData.landmark}
                                    onChange={handleNewAddressInputChange}
                                    placeholder="Nearby landmark"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    disabled={addingAddress}
                                />
                            </div>
                            <div>
                                <label htmlFor="newAddressPincode" className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                                <input
                                    type="text"
                                    id="newAddressPincode"
                                    name="pincode"
                                    value={newAddressFormData.pincode}
                                    onChange={handleNewAddressInputChange}
                                    placeholder="Pincode"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                    disabled={addingAddress}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="newAddressContactNumber" className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                                <input
                                    type="tel"
                                    id="newAddressContactNumber"
                                    name="contactNumber"
                                    value={newAddressFormData.contactNumber}
                                    onChange={handleNewAddressInputChange}
                                    placeholder="Contact Number"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                    disabled={addingAddress}
                                />
                            </div>
                            <div>
                                <label htmlFor="newAddressType" className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                                <select
                                    id="newAddressType"
                                    name="type"
                                    value={newAddressFormData.type}
                                    onChange={handleNewAddressInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                    disabled={addingAddress}
                                >
                                    <option value="Home">Home</option>
                                    <option value="Office">Office</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="newAddressIsDefault"
                                name="isDefault"
                                checked={newAddressFormData.isDefault}
                                onChange={(e) => setNewAddressFormData({...newAddressFormData, isDefault: e.target.checked})}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                disabled={addingAddress}
                            />
                            <label htmlFor="newAddressIsDefault" className="ml-2 block text-sm text-gray-900">Set as default address</label>
                        </div>
                        <div className="flex space-x-3 mt-4">
                            <button
                                type="submit"
                                className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors"
                                disabled={addingAddress}
                            >
                                {addingAddress ? 'Saving...' : 'Save Address'}
                            </button>
                            <button
                                type="button" // Important: type="button" to prevent form submission
                                onClick={() => setShowAddAddressForm(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors"
                                disabled={addingAddress}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                  </div>
                )}

                {/* Address List */}
                {loadingAddresses ? (
                    <div className="text-center py-8 text-gray-600">Loading addresses...</div>
                ) : errorAddresses ? (
                    <div className="text-center py-8 text-red-600">Error: {errorAddresses}</div>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">No saved addresses found.</div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <div key={address._id} className="p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium mr-2 ${
                                                address.type === 'Home' ? 'bg-green-100 text-green-800' :
                                                address.type === 'Office' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {address.type}
                                            </span>
                                            {address.isDefault && (
                                                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-start mb-2">
                                            <MapPin className="w-4 h-4 text-orange-500 mr-2 mt-1" />
                                            <p className="text-gray-700 text-sm leading-relaxed">{address.fullAddress}</p>
                                        </div>
                                        {address.landmark && (
                                            <p className="text-gray-500 text-sm ml-6">Landmark: {address.landmark}</p>
                                        )}
                                        {address.pincode && (
                                            <p className="text-gray-500 text-sm ml-6">Pincode: {address.pincode}</p>
                                        )}
                                        {address.contactNumber && (
                                            <p className="text-gray-500 text-sm ml-6">Contact: {address.contactNumber}</p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        {!address.isDefault && (
                                            <button
                                                onClick={() => handleSetDefaultAddress(address._id)}
                                                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                                disabled={loadingAddresses}
                                            >
                                                Set Default
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteAddress(address._id)}
                                            className="text-red-600 hover:text-red-700 p-1"
                                            disabled={loadingAddresses}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
