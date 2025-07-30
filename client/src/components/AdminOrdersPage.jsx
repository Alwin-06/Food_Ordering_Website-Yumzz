import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Eye, Edit, Package, Clock, CheckCircle, XCircle, Truck, Calendar, User, Store, MapPin } from 'lucide-react';

function AdminOrdersPage({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  // Sample orders data
  const orders = [
    {
      id: 'ORD001',
      customer: 'John Doe',
      customerEmail: 'john.doe@example.com',
      restaurant: 'Spice Garden',
      items: ['Chicken Biryani x2', 'Paneer Butter Masala x1'],
      amount: 750,
      status: 'Delivered',
      paymentMethod: 'Card',
      orderDate: '2024-03-12T14:30:00',
      deliveryTime: '25 mins',
      address: '123 Main Street, Thiruvalla, Kerala',
      phone: '+91 9876543210'
    },
    {
      id: 'ORD002',
      customer: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      restaurant: 'Tandoor House',
      items: ['Tandoori Chicken x1', 'Naan Bread x2'],
      amount: 420,
      status: 'Preparing',
      paymentMethod: 'UPI',
      orderDate: '2024-03-12T15:45:00',
      deliveryTime: '30 mins',
      address: '456 Business Park, Kottayam, Kerala',
      phone: '+91 9876543211'
    },
    {
      id: 'ORD003',
      customer: 'Mike Johnson',
      customerEmail: 'mike.johnson@example.com',
      restaurant: 'Curry Palace',
      items: ['Fish Curry x1', 'Rice x2', 'Papadam x3'],
      amount: 380,
      status: 'On the way',
      paymentMethod: 'COD',
      orderDate: '2024-03-12T16:20:00',
      deliveryTime: '20 mins',
      address: '789 Restaurant Row, Pathanamthitta, Kerala',
      phone: '+91 9876543212'
    },
    {
      id: 'ORD004',
      customer: 'Sarah Wilson',
      customerEmail: 'sarah.wilson@example.com',
      restaurant: 'Royal Feast',
      items: ['Mutton Curry x1', 'Chapati x4'],
      amount: 520,
      status: 'Confirmed',
      paymentMethod: 'Card',
      orderDate: '2024-03-12T17:10:00',
      deliveryTime: '35 mins',
      address: '321 Food Street, Alappuzha, Kerala',
      phone: '+91 9876543213'
    },
    {
      id: 'ORD005',
      customer: 'David Brown',
      customerEmail: 'david.brown@example.com',
      restaurant: 'Biryani Express',
      items: ['Mutton Biryani x1', 'Raita x1'],
      amount: 450,
      status: 'Cancelled',
      paymentMethod: 'UPI',
      orderDate: '2024-03-12T18:00:00',
      deliveryTime: 'N/A',
      address: '654 Spice Lane, Kollam, Kerala',
      phone: '+91 9876543214'
    }
  ];

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const orderDate = new Date(order.orderDate);
      const today = new Date();
      if (filterDate === 'today') {
        matchesDate = orderDate.toDateString() === today.toDateString();
      } else if (filterDate === 'week') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = orderDate >= weekAgo;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800';
      case 'On the way': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-purple-100 text-purple-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
      case 'Preparing': return <Package className="w-4 h-4" />;
      case 'On the way': return <Truck className="w-4 h-4" />;
      case 'Confirmed': return <Clock className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'Card': return 'bg-blue-100 text-blue-800';
      case 'UPI': return 'bg-purple-100 text-purple-800';
      case 'COD': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
            <h1 className="text-3xl font-bold tracking-wide">Order Management</h1>
          </div>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by ID, customer, or restaurant..."
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
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="on the way">On the way</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{orders.length}</div>
              <div className="text-gray-600">Total Orders</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {orders.filter(o => o.status === 'Delivered').length}
              </div>
              <div className="text-gray-600">Delivered</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-yellow-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {orders.filter(o => o.status === 'Preparing').length}
              </div>
              <div className="text-gray-600">Preparing</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-purple-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {orders.filter(o => o.status === 'Confirmed').length}
              </div>
              <div className="text-gray-600">Confirmed</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                ₹{orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Orders ({filteredOrders.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span>{order.status}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(order.paymentMethod)}`}>
                          {order.paymentMethod}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">₹{order.amount}</div>
                        <div className="text-sm text-gray-500">{order.deliveryTime}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Customer Info */}
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <User className="w-4 h-4 mr-2" />
                          <span className="font-medium">{order.customer}</span>
                        </div>
                        <div className="text-sm text-gray-500 ml-6">{order.customerEmail}</div>
                        <div className="text-sm text-gray-500 ml-6">{order.phone}</div>
                      </div>

                      {/* Restaurant Info */}
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Store className="w-4 h-4 mr-2" />
                          <span className="font-medium">{order.restaurant}</span>
                        </div>
                        <div className="text-sm text-gray-500 ml-6">
                          {order.items.join(', ')}
                        </div>
                      </div>

                      {/* Address & Time */}
                      <div>
                        <div className="flex items-start text-sm text-gray-600 mb-1">
                          <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                          <span className="font-medium">{order.address}</span>
                        </div>
                        <div className="text-sm text-gray-500 ml-6">
                          {new Date(order.orderDate).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="View Details">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors" title="Update Status">
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrdersPage;