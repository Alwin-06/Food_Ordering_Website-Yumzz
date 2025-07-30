import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Plus, Edit, Trash2, Eye, UserCircle, Mail, Phone, MapPin, Calendar, MoreVertical } from 'lucide-react';

function AdminUsersPage({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);

  // Sample users data
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      role: 'User',
      status: 'Active',
      joinDate: '2024-01-15',
      totalOrders: 25,
      totalSpent: 4500,
      lastOrder: '2024-03-10',
      address: '123 Main Street, Thiruvalla, Kerala'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 234-5678',
      role: 'User',
      status: 'Active',
      joinDate: '2024-02-20',
      totalOrders: 18,
      totalSpent: 3200,
      lastOrder: '2024-03-12',
      address: '456 Business Park, Kottayam, Kerala'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 (555) 345-6789',
      role: 'Restaurant Owner',
      status: 'Active',
      joinDate: '2024-01-08',
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: 'N/A',
      address: '789 Restaurant Row, Pathanamthitta, Kerala'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1 (555) 456-7890',
      role: 'User',
      status: 'Inactive',
      joinDate: '2024-03-01',
      totalOrders: 5,
      totalSpent: 850,
      lastOrder: '2024-03-05',
      address: '321 Food Street, Alappuzha, Kerala'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
      phone: '+1 (555) 567-8901',
      role: 'User',
      status: 'Active',
      joinDate: '2024-02-14',
      totalOrders: 32,
      totalSpent: 5600,
      lastOrder: '2024-03-11',
      address: '654 Spice Lane, Kollam, Kerala'
    }
  ];

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || user.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleColor = (role) => {
    return role === 'Restaurant Owner' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
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
            <h1 className="text-3xl font-bold tracking-wide">User Management</h1>
          </div>
          
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
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
                placeholder="Search users by name, email, or phone..."
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

        {/* Users Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{users.length}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {users.filter(u => u.status === 'Active').length}
              </div>
              <div className="text-gray-600">Active Users</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-purple-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {users.filter(u => u.role === 'Restaurant Owner').length}
              </div>
              <div className="text-gray-600">Restaurant Owners</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {users.reduce((sum, u) => sum + u.totalOrders, 0)}
              </div>
              <div className="text-gray-600">Total Orders</div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Users ({filteredUsers.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Role & Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Orders & Spent</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <br />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{user.totalOrders} orders</div>
                        <div className="text-orange-600">₹{user.totalSpent.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Last: {user.lastOrder}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;