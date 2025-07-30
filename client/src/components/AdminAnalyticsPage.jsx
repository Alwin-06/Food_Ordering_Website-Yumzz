import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Users, Store, ShoppingBag, DollarSign, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';

function AdminAnalyticsPage({ onBack }) {
  const [timeRange, setTimeRange] = useState('week');

  // Sample analytics data
  const analytics = {
    overview: {
      totalRevenue: 125000,
      revenueGrowth: 25.4,
      totalOrders: 3456,
      ordersGrowth: 18.2,
      totalUsers: 1247,
      usersGrowth: 12.8,
      avgOrderValue: 362,
      avgOrderGrowth: 8.5
    },
    revenueData: [
      { month: 'Jan', revenue: 85000, orders: 2100 },
      { month: 'Feb', revenue: 92000, orders: 2300 },
      { month: 'Mar', revenue: 125000, orders: 3456 }
    ],
    topRestaurants: [
      { name: 'Spice Garden', revenue: 45600, orders: 234, growth: 15.2 },
      { name: 'Tandoor House', revenue: 38900, orders: 198, growth: 12.8 },
      { name: 'Curry Palace', revenue: 34200, orders: 176, growth: 18.5 },
      { name: 'Biryani Express', revenue: 28700, orders: 145, growth: -2.3 },
      { name: 'Masala Magic', revenue: 26800, orders: 132, growth: 22.1 }
    ],
    ordersByStatus: [
      { status: 'Delivered', count: 2890, percentage: 83.6 },
      { status: 'Cancelled', count: 312, percentage: 9.0 },
      { status: 'Preparing', count: 156, percentage: 4.5 },
      { status: 'On the way', count: 98, percentage: 2.9 }
    ],
    paymentMethods: [
      { method: 'Card', count: 1456, percentage: 42.1 },
      { method: 'UPI', count: 1234, percentage: 35.7 },
      { method: 'COD', count: 766, percentage: 22.2 }
    ],
    hourlyOrders: [
      { hour: '9 AM', orders: 45 },
      { hour: '12 PM', orders: 156 },
      { hour: '1 PM', orders: 234 },
      { hour: '7 PM', orders: 298 },
      { hour: '8 PM', orders: 345 },
      { hour: '9 PM', orders: 267 }
    ]
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
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
            <h1 className="text-3xl font-bold tracking-wide">Analytics Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/20 border border-white/30 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="week" className="text-gray-900">This Week</option>
              <option value="month" className="text-gray-900">This Month</option>
              <option value="quarter" className="text-gray-900">This Quarter</option>
              <option value="year" className="text-gray-900">This Year</option>
            </select>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{analytics.overview.totalRevenue.toLocaleString()}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(analytics.overview.revenueGrowth)}`}>
                  {getGrowthIcon(analytics.overview.revenueGrowth)}
                  <span className="ml-1 text-sm font-medium">
                    {Math.abs(analytics.overview.revenueGrowth)}% from last period
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalOrders.toLocaleString()}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(analytics.overview.ordersGrowth)}`}>
                  {getGrowthIcon(analytics.overview.ordersGrowth)}
                  <span className="ml-1 text-sm font-medium">
                    {Math.abs(analytics.overview.ordersGrowth)}% from last period
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalUsers.toLocaleString()}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(analytics.overview.usersGrowth)}`}>
                  {getGrowthIcon(analytics.overview.usersGrowth)}
                  <span className="ml-1 text-sm font-medium">
                    {Math.abs(analytics.overview.usersGrowth)}% from last period
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold text-gray-900">₹{analytics.overview.avgOrderValue}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(analytics.overview.avgOrderGrowth)}`}>
                  {getGrowthIcon(analytics.overview.avgOrderGrowth)}
                  <span className="ml-1 text-sm font-medium">
                    {Math.abs(analytics.overview.avgOrderGrowth)}% from last period
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Revenue Trend</h2>
              <BarChart3 className="w-6 h-6 text-orange-500" />
            </div>
            <div className="space-y-4">
              {analytics.revenueData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-orange-600">{data.month}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">₹{data.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{data.orders} orders</div>
                    </div>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(data.revenue / 125000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Restaurants */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Top Restaurants</h2>
              <Store className="w-6 h-6 text-orange-500" />
            </div>
            <div className="space-y-4">
              {analytics.topRestaurants.map((restaurant, index) => (
                <div key={restaurant.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{restaurant.name}</div>
                      <div className="text-sm text-gray-500">{restaurant.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">₹{restaurant.revenue.toLocaleString()}</div>
                    <div className={`text-sm flex items-center ${getGrowthColor(restaurant.growth)}`}>
                      {getGrowthIcon(restaurant.growth)}
                      <span className="ml-1">{Math.abs(restaurant.growth)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Status Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Order Status</h2>
              <PieChart className="w-6 h-6 text-orange-500" />
            </div>
            <div className="space-y-3">
              {analytics.ordersByStatus.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status.status === 'Delivered' ? 'bg-green-500' :
                      status.status === 'Cancelled' ? 'bg-red-500' :
                      status.status === 'Preparing' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <span className="text-sm text-gray-700">{status.status}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{status.count}</div>
                    <div className="text-xs text-gray-500">{status.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
              <DollarSign className="w-6 h-6 text-orange-500" />
            </div>
            <div className="space-y-3">
              {analytics.paymentMethods.map((method) => (
                <div key={method.method} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      method.method === 'Card' ? 'bg-blue-500' :
                      method.method === 'UPI' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`}></div>
                    <span className="text-sm text-gray-700">{method.method}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{method.count}</div>
                    <div className="text-xs text-gray-500">{method.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Peak Hours</h2>
              <Activity className="w-6 h-6 text-orange-500" />
            </div>
            <div className="space-y-3">
              {analytics.hourlyOrders.map((hour) => (
                <div key={hour.hour} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{hour.hour}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${(hour.orders / 345) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{hour.orders}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalyticsPage;