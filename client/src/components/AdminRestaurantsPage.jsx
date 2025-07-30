import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Plus, Edit, Trash2, Eye, Store, Star, Clock, MapPin, Phone, Mail, TrendingUp } from 'lucide-react';

function AdminRestaurantsPage({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample restaurants data
  const restaurants = [
    {
      id: 1,
      name: 'Spice Garden',
      owner: 'Rajesh Kumar',
      email: 'rajesh@spicegarden.com',
      phone: '+91 9876543210',
      cuisine: 'Indian Cuisine',
      address: '123 Food Street, Thiruvalla, Kerala',
      rating: 4.8,
      totalOrders: 1245,
      revenue: 125000,
      status: 'Active',
      joinDate: '2023-08-15',
      deliveryTime: '25-30 min',
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Tandoor House',
      owner: 'Priya Sharma',
      email: 'priya@tandoorhouse.com',
      phone: '+91 9876543211',
      cuisine: 'North Indian',
      address: '456 Spice Lane, Kottayam, Kerala',
      rating: 4.6,
      totalOrders: 987,
      revenue: 98000,
      status: 'Active',
      joinDate: '2023-09-20',
      deliveryTime: '30-35 min',
      image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Curry Palace',
      owner: 'Suresh Nair',
      email: 'suresh@currypalace.com',
      phone: '+91 9876543212',
      cuisine: 'South Indian',
      address: '789 Curry Road, Pathanamthitta, Kerala',
      rating: 4.7,
      totalOrders: 1156,
      revenue: 110000,
      status: 'Active',
      joinDate: '2023-07-10',
      deliveryTime: '20-25 min',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      name: 'Royal Feast',
      owner: 'Amit Patel',
      email: 'amit@royalfeast.com',
      phone: '+91 9876543213',
      cuisine: 'Multi Cuisine',
      address: '321 Royal Street, Alappuzha, Kerala',
      rating: 4.5,
      totalOrders: 756,
      revenue: 75000,
      status: 'Inactive',
      joinDate: '2023-10-05',
      deliveryTime: '35-40 min',
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 5,
      name: 'Biryani Express',
      owner: 'Mohammed Ali',
      email: 'ali@biryaniexpress.com',
      phone: '+91 9876543214',
      cuisine: 'Biryani Specialist',
      address: '654 Biryani Boulevard, Kollam, Kerala',
      rating: 4.4,
      totalOrders: 892,
      revenue: 89000,
      status: 'Active',
      joinDate: '2023-11-12',
      deliveryTime: '25-30 min',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  // Filter restaurants based on search and status
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || restaurant.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold tracking-wide">Restaurant Management</h1>
          </div>
          
          <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Restaurant</span>
          </button>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search restaurants by name, owner, or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Restaurant Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{restaurants.length}</div>
              <div className="text-gray-600">Total Restaurants</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {restaurants.filter(r => r.status === 'Active').length}
              </div>
              <div className="text-gray-600">Active Restaurants</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-purple-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {restaurants.reduce((sum, r) => sum + r.totalOrders, 0)}
              </div>
              <div className="text-gray-600">Total Orders</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                ₹{restaurants.reduce((sum, r) => sum + r.revenue, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-gray-200 hover:shadow-xl transition-all duration-300">
              {/* Restaurant Image */}
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(restaurant.status)}`}>
                    {restaurant.status}
                  </span>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Store className="w-4 h-4 mr-2" />
                    <span>Owner: {restaurant.owner}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{restaurant.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{restaurant.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">{restaurant.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{restaurant.totalOrders}</div>
                    <div className="text-xs text-gray-600">Orders</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">₹{restaurant.revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Revenue</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Joined: {new Date(restaurant.joinDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminRestaurantsPage;