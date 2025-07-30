import React, { useState } from 'react';
import { Users, Store, ShoppingBag, TrendingUp, Eye, Edit, Trash2, Plus, Search, Filter, BarChart3, PieChart, Calendar, Bell, Settings, LogOut, Home } from 'lucide-react';

function AdminDashboard({ onLogout, onUsers, onRestaurants, onOrders, onAnalytics, onSettings }) {
  const [activeSection, setActiveSection] = useState('overview');

  // Sample data for dashboard
  const stats = {
    totalUsers: 1247,
    totalRestaurants: 89,
    totalOrders: 3456,
    totalRevenue: 125000,
    todayOrders: 156,
    activeUsers: 892
  };

  const recentOrders = [
    { id: 'ORD001', customer: 'John Doe', restaurant: 'Spice Garden', amount: 450, status: 'Delivered', time: '2 mins ago' },
    { id: 'ORD002', customer: 'Jane Smith', restaurant: 'Tandoor House', amount: 320, status: 'Preparing', time: '5 mins ago' },
    { id: 'ORD003', customer: 'Mike Johnson', restaurant: 'Curry Palace', amount: 280, status: 'On the way', time: '8 mins ago' },
    { id: 'ORD004', customer: 'Sarah Wilson', restaurant: 'Biryani Express', amount: 380, status: 'Delivered', time: '12 mins ago' },
    { id: 'ORD005', customer: 'David Brown', restaurant: 'Masala Magic', amount: 220, status: 'Confirmed', time: '15 mins ago' }
  ];

  const topRestaurants = [
    { name: 'Spice Garden', orders: 234, revenue: 45600, rating: 4.8 },
    { name: 'Tandoor House', orders: 198, revenue: 38900, rating: 4.6 },
    { name: 'Curry Palace', orders: 176, revenue: 34200, rating: 4.7 },
    { name: 'Biryani Express', orders: 145, revenue: 28700, rating: 4.4 },
    { name: 'Masala Magic', orders: 132, revenue: 26800, rating: 4.9 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800';
      case 'On the way': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold tracking-wide">Yummz Admin</h1>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={onSettings}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'users', label: 'Users', icon: Users, onClick: onUsers },
              { id: 'restaurants', label: 'Restaurants', icon: Store, onClick: onRestaurants },
              { id: 'orders', label: 'Orders', icon: ShoppingBag, onClick: onOrders },
              { id: 'analytics', label: 'Analytics', icon: BarChart3, onClick: onAnalytics }
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      setActiveSection(item.id);
                    }
                  }}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeSection === item.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-orange-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Restaurants</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRestaurants}</p>
                <p className="text-sm text-green-600 mt-1">+5% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Store className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+18% from last month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ShoppingBag className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+25% from last month</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
              <button 
                onClick={onOrders}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{order.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer} • {order.restaurant}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-orange-600">₹{order.amount}</span>
                      <span className="text-xs text-gray-500">{order.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Restaurants */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Top Restaurants</h2>
              <button 
                onClick={onRestaurants}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {topRestaurants.map((restaurant, index) => (
                <div key={restaurant.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600">{restaurant.orders} orders • ⭐ {restaurant.rating}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">₹{restaurant.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={onUsers}
              className="flex flex-col items-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <span className="font-medium text-gray-900">Manage Users</span>
            </button>
            <button 
              onClick={onRestaurants}
              className="flex flex-col items-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
            >
              <Store className="w-8 h-8 text-green-600 mb-2" />
              <span className="font-medium text-gray-900">Add Restaurant</span>
            </button>
            <button 
              onClick={onOrders}
              className="flex flex-col items-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
            >
              <ShoppingBag className="w-8 h-8 text-purple-600 mb-2" />
              <span className="font-medium text-gray-900">View Orders</span>
            </button>
            <button 
              onClick={onAnalytics}
              className="flex flex-col items-center p-6 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
            >
              <BarChart3 className="w-8 h-8 text-orange-600 mb-2" />
              <span className="font-medium text-gray-900">Analytics</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;































// import React, { useState, useEffect } from 'react';
// import { Users, Store, ShoppingBag, TrendingUp, Eye, Edit, Trash2, Plus, Search, Filter, BarChart3, PieChart, Calendar, Bell, Settings, LogOut, Home } from 'lucide-react';
// //import { getAllUsers, getAllRestaurants, getAllOrders } from '../api/adminApi'; // Import new API functions

// function AdminDashboard({ onLogout, onUsers, onRestaurants, onOrders, onAnalytics, onSettings }) {
//   const [activeSection, setActiveSection] = useState('overview');

//   // States for dynamic data
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalRestaurants: 0,
//     totalOrders: 0,
//     totalRevenue: 0,
//     todayOrders: 0,
//     activeUsers: 0 // This might require a more advanced backend stat
//   });
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [topRestaurants, setTopRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch all data concurrently
//         const [usersData, restaurantsData, ordersData] = await Promise.all([
//           getAllUsers(),       // Fetches all users (requires backend /api/users/all)
//           getAllRestaurants(), // Fetches all restaurants
//           getAllOrders()       // Fetches all orders
//         ]);

//         // --- Process User Data ---
//         const totalUsers = usersData.length;
//         // For active users, you'd need more sophisticated logic (e.g., last login timestamp)
//         // For now, let's keep it as a placeholder or remove if not easily available.
//         const activeUsers = 0; // Placeholder, as backend currently doesn't provide this directly

//         // --- Process Restaurant Data ---
//         const totalRestaurants = restaurantsData.length;

//         // --- Process Order Data & Calculate Revenue ---
//         const totalOrders = ordersData.length;
//         let totalRevenue = 0;
//         const restaurantRevenueMap = new Map(); // To track revenue per restaurant
//         const restaurantOrderCountMap = new Map(); // To track order count per restaurant

//         const now = new Date();
//         const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//         let todayOrders = 0;

//         ordersData.forEach(order => {
//           totalRevenue += order.finalAmount || 0; // Sum finalAmount for total revenue

//           // Calculate today's orders
//           const orderDate = new Date(order.createdAt);
//           if (orderDate >= startOfDay && orderDate <= now) {
//             todayOrders++;
//           }

//           // Aggregate revenue and order count per restaurant
//           if (order.restaurant && order.restaurant.name) {
//             const restaurantName = order.restaurant.name;
//             restaurantRevenueMap.set(restaurantName, (restaurantRevenueMap.get(restaurantName) || 0) + (order.finalAmount || 0));
//             restaurantOrderCountMap.set(restaurantName, (restaurantOrderCountMap.get(restaurantName) || 0) + 1);
//           }
//         });

//         // Get recent orders (e.g., last 5, sorted by latest createdAt)
//         const sortedRecentOrders = [...ordersData]
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//           .slice(0, 5); // Take top 5 recent orders

//         // --- Determine Top Restaurants ---
//         const topRestaurantsCalculated = restaurantsData.map(restaurant => {
//           const name = restaurant.name;
//           return {
//             name: name,
//             orders: restaurantOrderCountMap.get(name) || 0,
//             revenue: restaurantRevenueMap.get(name) || 0,
//             rating: restaurant.rating || 0 // Assuming restaurant data might have a rating field
//           };
//         }).sort((a, b) => b.revenue - a.revenue) // Sort by revenue descending
//           .slice(0, 5); // Take top 5

//         setStats({
//           totalUsers,
//           totalRestaurants,
//           totalOrders,
//           totalRevenue,
//           todayOrders,
//           activeUsers // Current placeholder
//         });
//         setRecentOrders(sortedRecentOrders);
//         setTopRestaurants(topRestaurantsCalculated);

//       } catch (err) {
//         setError(err.message || 'Failed to fetch dashboard data.');
//         console.error("Dashboard data fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []); // Empty dependency array means this runs once on mount


//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'delivered': return 'bg-green-100 text-green-800'; // Ensure lower case to match backend
//       case 'preparing': return 'bg-yellow-100 text-yellow-800';
//       case 'out for delivery': return 'bg-blue-100 text-blue-800';
//       case 'confirmed': return 'bg-purple-100 text-purple-800';
//       case 'pending': return 'bg-gray-100 text-gray-800'; // Added pending
//       case 'pending_payment': return 'bg-red-100 text-red-800'; // Added pending_payment
//       case 'cancelled': return 'bg-red-100 text-red-800'; // Added cancelled
//       case 'refunded': return 'bg-indigo-100 text-indigo-800'; // Added refunded
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50">
//         <div className="text-lg font-medium text-gray-700">Loading dashboard data...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50">
//         <div className="text-lg font-medium text-red-700">Error: {error}</div>
//       </div>
//     );
//   }


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 shadow-lg">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <h1 className="text-3xl font-bold tracking-wide">Yummz</h1>
//             <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Dashboard</span>
//           </div>

//           <div className="flex items-center space-x-4">
//             <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
//               <Bell className="w-5 h-5" />
//             </button>
//             <button
//               onClick={onSettings}
//               className="p-2 hover:bg-white/10 rounded-full transition-colors"
//             >
//               <Settings className="w-5 h-5" />
//             </button>
//             <button
//               onClick={onLogout}
//               className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
//             >
//               <LogOut className="w-4 h-4" />
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Navigation */}
//       <nav className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex space-x-8">
//             {[
//               { id: 'overview', label: 'Overview', icon: Home },
//               { id: 'users', label: 'Users', icon: Users, onClick: onUsers },
//               { id: 'restaurants', label: 'Restaurants', icon: Store, onClick: onRestaurants },
//               { id: 'orders', label: 'Orders', icon: ShoppingBag, onClick: onOrders },
//               { id: 'analytics', label: 'Analytics', icon: BarChart3, onClick: onAnalytics }
//             ].map((item) => {
//               const IconComponent = item.icon;
//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => {
//                     if (item.onClick) {
//                       item.onClick();
//                     } else {
//                       setActiveSection(item.id);
//                     }
//                   }}
//                   className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
//                     activeSection === item.id
//                       ? 'border-orange-500 text-orange-600'
//                       : 'border-transparent text-gray-600 hover:text-orange-600'
//                   }`}
//                 >
//                   <IconComponent className="w-5 h-5" />
//                   <span className="font-medium">{item.label}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto p-6">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Users</p>
//                 <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
//                 <p className="text-sm text-green-600 mt-1">Dynamic Data</p> {/* Updated for dynamic */}
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <Users className="w-8 h-8 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Restaurants</p>
//                 <p className="text-3xl font-bold text-gray-900">{stats.totalRestaurants}</p>
//                 <p className="text-sm text-green-600 mt-1">Dynamic Data</p> {/* Updated for dynamic */}
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <Store className="w-8 h-8 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-purple-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                 <p className="text-3xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
//                 <p className="text-sm text-green-600 mt-1">Dynamic Data</p> {/* Updated for dynamic */}
//               </div>
//               <div className="p-3 bg-purple-100 rounded-full">
//                 <ShoppingBag className="w-8 h-8 text-purple-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Revenue</p>
//                 <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
//                 <p className="text-sm text-green-600 mt-1">Dynamic Data</p> {/* Updated for dynamic */}
//               </div>
//               <div className="p-3 bg-orange-100 rounded-full">
//                 <TrendingUp className="w-8 h-8 text-orange-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Recent Orders */}
//           <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
//               <button
//                 onClick={onOrders}
//                 className="text-orange-600 hover:text-orange-700 font-medium"
//               >
//                 View All
//               </button>
//             </div>

//             <div className="space-y-4">
//               {recentOrders.length === 0 ? (
//                 <div className="text-center text-gray-500 py-4">No recent orders.</div>
//               ) : (
//                 recentOrders.map((order) => (
//                   <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="font-semibold text-gray-900">{order.orderId}</span> {/* Use actual orderId */}
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
//                           {order.orderStatus}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600">
//                         {order.user?.name || 'N/A'} • {order.restaurant?.name || 'N/A'}
//                       </p>
//                       <div className="flex items-center justify-between mt-2">
//                         <span className="font-bold text-orange-600">₹{(order.finalAmount || 0).toFixed(2)}</span>
//                         <span className="text-xs text-gray-500">
//                           {new Date(order.createdAt).toLocaleDateString()} {/* Display formatted date */}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Top Restaurants */}
//           <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">Top Restaurants</h2>
//               <button
//                 onClick={onRestaurants}
//                 className="text-orange-600 hover:text-orange-700 font-medium"
//               >
//                 View All
//               </button>
//             </div>

//             <div className="space-y-4">
//               {topRestaurants.length === 0 ? (
//                 <div className="text-center text-gray-500 py-4">No restaurants found or no revenue data.</div>
//               ) : (
//                 topRestaurants.map((restaurant, index) => (
//                   <div key={restaurant.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//                     <div className="flex items-center space-x-4">
//                       <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
//                         <p className="text-sm text-gray-600">{restaurant.orders} orders • ⭐ {restaurant.rating.toFixed(1)}</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold text-orange-600">₹{(restaurant.revenue || 0).toLocaleString()}</p>
//                       <p className="text-xs text-gray-500">Revenue</p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <button
//               onClick={onUsers}
//               className="flex flex-col items-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
//             >
//               <Users className="w-8 h-8 text-blue-600 mb-2" />
//               <span className="font-medium text-gray-900">Manage Users</span>
//             </button>
//             <button
//               onClick={onRestaurants}
//               className="flex flex-col items-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
//             >
//               <Store className="w-8 h-8 text-green-600 mb-2" />
//               <span className="font-medium text-gray-900">Add Restaurant</span>
//             </button>
//             <button
//               onClick={onOrders}
//               className="flex flex-col items-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
//             >
//               <ShoppingBag className="w-8 h-8 text-purple-600 mb-2" />
//               <span className="font-medium text-gray-900">View Orders</span>
//             </button>
//             <button
//               onClick={onAnalytics}
//               className="flex flex-col items-center p-6 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
//             >
//               <BarChart3 className="w-8 h-8 text-orange-600 mb-2" />
//               <span className="font-medium text-gray-900">Analytics</span>
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default AdminDashboard;