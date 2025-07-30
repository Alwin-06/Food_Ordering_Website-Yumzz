import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import UserDashboard from './components/UserDashboard';
import RestaurantsPage from './components/RestaurantsPage';
import MenuItemsPage from './components/MenuItemsPage';
import MenuItemDetailPage from './components/MenuItemDetailPage';
import CartPage from './components/CartPage';
import RewardsPage from './components/RewardsPage';
import LocationPage from './components/LocationPage';
import PaymentPage from './components/PaymentPage';
import OrderConfirmPage from './components/OrderConfirmPage';
import ProfilePage from './components/ProfilePage';

import AdminDashboard from './components/AdminDashboard';
import AdminUsersPage from './components/AdminUsersPage';
import AdminRestaurantsPage from './components/AdminRestaurantsPage';
import AdminOrdersPage from './components/AdminOrdersPage';
import AdminAnalyticsPage from './components/AdminAnalyticsPage';

// Import auth utility functions for managing user session
import { getUserData, logout } from './api/authApi'; // Assuming authApi.js is in client/src/api/

// Placeholder components for other dashboards (you'll replace these with your actual components)
// You should create these files if they don't exist:
// import RestaurantDashboard from './components/RestaurantDashboard';
// import AdminDashboard from './components/AdminDashboard';
const RestaurantDashboard = ({ user, onLogout }) => (
  <div className="p-8 text-center">
    <h2 className="text-3xl font-bold text-gray-900 mb-4">Restaurant Dashboard</h2>
    <p className="text-gray-700 mb-6">Welcome, {user?.name} (Restaurant Owner)!</p>
    <button
      onClick={onLogout}
      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
    >
      Logout
    </button>
  </div>
);

// const AdminDashboard = ({ user, onLogout }) => (
//   <div className="p-8 text-center">
//     <h2 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
//     <p className="text-gray-700 mb-6">Welcome, {user?.name} (Administrator)!</p>
//     <button
//       onClick={onLogout}
//       className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
//     >
//       Logout
//     </button>
//   </div>
// );


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [user, setUser] = useState(null); // New state to store logged-in user data
  const [deliveryAddress, setDeliveryAddress] = useState(null);

  // Effect to check for stored user data on initial load
  // This ensures the user stays logged in across page refreshes
  useEffect(() => {
    const storedUser = getUserData(); // Get user data from localStorage
    if (storedUser) {
      setUser(storedUser); // Set the user state
      handleLoginSuccess(storedUser); // Navigate to the correct dashboard based on stored role
    }
  }, []); // Empty dependency array means this runs once on mount

  // Navigation functions
  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const navigateToSignup = () => {
    setCurrentPage('signup');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setUser(null); // Clear user state when navigating to public home
    logout(); // Also clear token from localStorage
  };

  /**
   * Handles successful login, sets user state, and navigates to appropriate dashboard.
   * This function is passed as `onLogin` prop to LoginPage.
   * @param {object} userData - The user object received from the backend after successful login.
   */
  const handleLoginSuccess = (userData) => {
    setUser(userData); // Set the user state
    // Determine which dashboard to show based on the user's role
    switch (userData.role) {
      case 'user':
        setCurrentPage('userDashboard');
        break;
      case 'restaurant':
        setCurrentPage('restaurantDashboard'); // Navigate to restaurant owner's dashboard
        break;
      case 'admin':
        setCurrentPage('adminDashboard'); // Navigate to admin's dashboard
        break;
      default:
        setCurrentPage('home'); // Fallback for unknown roles
        console.warn('Unknown user role, redirecting to home.');
    }
  };


  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentPage('login');
  };

  const navigateToRestaurants = () => {
    setCurrentPage('restaurants');
  };

  const navigateToMenu = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
    setCurrentPage('menu');
  };

  const navigateToItemDetail = (restaurantId, itemId) => {
    setSelectedRestaurantId(restaurantId);
    setSelectedItemId(itemId);
    setCurrentPage('itemDetail');
  };

  const navigateToCart = () => {
    setCurrentPage('cart');
  };

  const navigateToRewards = () => {
    setCurrentPage('rewards');
  };

  const navigateToLocation = () => {
    setCurrentPage('location');
  };

  const handleLocationNext = (selectedAddressObject) => {
    setDeliveryAddress(selectedAddressObject); // Save the address
    setCurrentPage('payment');                 // Navigate to the next page
  };

  const navigateToPayment = () => {
    setCurrentPage('payment');
  };

  const handlePaymentComplete = (orderId, paymentMethod) => {
    setOrderDetails({ orderId, paymentMethod });
    setCurrentPage('orderConfirm');
  };

  const navigateToOrderConfirm = () => {
    setCurrentPage('orderConfirm');
  };

  const navigateToProfile = () => {
    setCurrentPage('profile');
  };

  const closeOrderConfirm = () => {
    setOrderDetails(null);
    // After confirming order, go back to the user's specific dashboard
    // Re-evaluate dashboard based on current user's role to ensure correct redirection
    if (user) {
        handleLoginSuccess(user);
    } else {
        // Fallback if user somehow lost from state (shouldn't happen if localStorage is used)
        setCurrentPage('home');
    }
  };

  // Conditional rendering logic based on currentPage and user's authentication status/role
  const renderPage = () => {
    if (currentPage === 'home') {
      return <HomePage onOrderNow={navigateToLogin} />;
    } else if (currentPage === 'login') {
      // Pass handleLoginSuccess to LoginPage so it can update App's state
      return <LoginPage onBack={navigateToHome} onSignup={navigateToSignup} onLogin={handleLoginSuccess} />;
    } else if (currentPage === 'signup') {
      return <SignupPage onBack={navigateToLogin} onLogin={navigateToLogin} />;
    }
    // Protected Routes: Check if user is logged in before rendering dashboards/protected pages
    else if (user) {
      if (currentPage === 'userDashboard' && user.role === 'user') {
        // Pass user object and logout handler to UserDashboard
        return <UserDashboard onBack={navigateToHome} onRestaurants={navigateToRestaurants} onViewMenu={navigateToMenu} onCart={navigateToCart} onRewards={navigateToRewards} onProfile={navigateToProfile} onLogout={handleLogout} user={user} />;
      } else if (currentPage === 'restaurantDashboard' && user.role === 'restaurant') {
        // Pass user object and logout handler to RestaurantDashboard
        return <RestaurantDashboard user={user} onLogout={handleLogout} />;
      } 
      // else if (currentPage === 'adminDashboard' && user.role === 'admin') {
      //   // Pass user object and logout handler to AdminDashboard
      //   return <AdminDashboard user={user} onLogout={handleLogout} />;
      // }
      else if (currentPage === 'adminDashboard' && user.role === 'admin') {
        return (
          <AdminDashboard
            user={user}
            onLogout={handleLogout}
            onUsers={() => setCurrentPage('adminUsers')}
            onOrders={() => setCurrentPage('adminOrders')}
            onRestaurants={() => setCurrentPage('adminRestaurants')}
            onAnalytics={() => setCurrentPage('adminAnalytics')}
          />
        );
      } else if (currentPage === 'adminUsers' && user.role === 'admin') {
        return <AdminUsersPage onBack={() => setCurrentPage('adminDashboard')} />;
      } else if (currentPage === 'adminOrders' && user.role === 'admin') {
        return <AdminOrdersPage onBack={() => setCurrentPage('adminDashboard')} />;
      } else if (currentPage === 'adminRestaurants' && user.role === 'admin') {
        return <AdminRestaurantsPage onBack={() => setCurrentPage('adminDashboard')} />;
      } else if (currentPage === 'adminAnalytics' && user.role === 'admin') {
        return <AdminAnalyticsPage onBack={() => setCurrentPage('adminDashboard')} />;
      }

       else if (currentPage === 'restaurants') {
        // Ensure back/home navigation respects user's dashboard
        return <RestaurantsPage onBack={user ? () => handleLoginSuccess(user) : navigateToHome} onHome={user ? () => handleLoginSuccess(user) : navigateToHome} onViewMenu={navigateToMenu} onCart={navigateToCart} onRewards={navigateToRewards} onProfile={navigateToProfile} />;
      } else if (currentPage === 'menu') {
        return <MenuItemsPage onBack={() => setCurrentPage('restaurants')} onHome={user ? () => handleLoginSuccess(user) : navigateToHome} restaurantId={selectedRestaurantId} onViewItemDetail={navigateToItemDetail} onCart={navigateToCart} onRewards={navigateToRewards} />;
      } else if (currentPage === 'itemDetail') {
        return <MenuItemDetailPage onBack={() => setCurrentPage('menu')} onHome={user ? () => handleLoginSuccess(user) : navigateToHome} restaurantId={selectedRestaurantId} itemId={selectedItemId} onCart={navigateToCart} onRewards={navigateToRewards} />;
      } else if (currentPage === 'cart') {
        return <CartPage onBack={user ? () => handleLoginSuccess(user) : navigateToHome} onHome={user ? () => handleLoginSuccess(user) : navigateToHome} onRestaurants={navigateToRestaurants} onRewards={navigateToRewards} onNext={navigateToLocation} />;
      } else if (currentPage === 'rewards') {
        return <RewardsPage onBack={user ? () => handleLoginSuccess(user) : navigateToHome} onHome={user ? () => handleLoginSuccess(user) : navigateToHome} onRestaurants={navigateToRestaurants} onCart={navigateToCart} />;
      } else if (currentPage === 'location') {
        return <LocationPage onBack={() => setCurrentPage('cart')} onHome={user ? () => handleLoginSuccess(user) : navigateToHome} onNext={handleLocationNext} onCart={navigateToCart} onRewards={navigateToRewards} />;
      } else if (currentPage === 'payment') {
        return <PaymentPage onBack={() => setCurrentPage('location')} onHome={user ? () => handleLoginSuccess(user) : navigateToHome} onCart={navigateToCart} onRewards={navigateToRewards} onPaymentComplete={handlePaymentComplete} deliveryAddress={deliveryAddress} />;
      } else if (currentPage === 'orderConfirm' && orderDetails) {
        return <OrderConfirmPage orderId={orderDetails.orderId} paymentMethod={orderDetails.paymentMethod} onBackToDashboard={user ? () => handleLoginSuccess(user) : navigateToHome} onClose={closeOrderConfirm} />;
      } else if (currentPage === 'profile') {
        return <ProfilePage onBack={user ? () => handleLoginSuccess(user) : navigateToHome} onHome={user ? () => handleLoginSuccess(user) : navigateToHome} onRestaurants={navigateToRestaurants} onCart={navigateToCart} onRewards={navigateToRewards} />;
      }
      return <HomePage onOrderNow={navigateToLogin} />;
    }
    return <HomePage onOrderNow={navigateToLogin} />;
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
}

export default App;
