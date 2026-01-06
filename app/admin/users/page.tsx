'use client';

import { useState, useEffect, Fragment } from 'react';
import AdminGuard from '@/components/AdminGuard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

interface Order {
  id: string;
  orderId: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [userOrders, setUserOrders] = useState<Record<string, Order[]>>({});
  const [loadingOrders, setLoadingOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('theButton_token');
        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserOrders = async (userId: string) => {
    // If already fetched, just toggle expansion
    if (userOrders[userId] !== undefined) {
      toggleUserExpansion(userId);
      return;
    }

    // Otherwise, fetch orders
    setLoadingOrders((prev) => new Set(prev).add(userId));
    try {
      const token = localStorage.getItem('theButton_token');
      const response = await fetch(`/api/admin/users/${userId}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setUserOrders((prev) => ({
        ...prev,
        [userId]: data.orders || [],
      }));
      // Auto-expand after fetching
      setExpandedUsers((prev) => new Set(prev).add(userId));
    } catch (err) {
      console.error('Error fetching user orders:', err);
      // Set empty array on error so we can still toggle
      setUserOrders((prev) => ({
        ...prev,
        [userId]: [],
      }));
    } finally {
      setLoadingOrders((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const toggleUserExpansion = (userId: string) => {
    setExpandedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  View Website
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('theButton_token');
                    localStorage.removeItem('theButton_user');
                    window.location.href = '/admin/login';
                  }}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex space-x-6">
              <Link
                href="/admin/dashboard"
                className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/admin/users"
                className="py-4 px-2 border-b-2 border-gray-900 text-gray-900 font-medium"
              >
                Users
              </Link>
              <Link
                href="/admin/reviews"
                className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
              >
                Reviews
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">All Users</h2>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => {
                        const orders = userOrders[user.id] || [];
                        const isExpanded = expandedUsers.has(user.id);
                        const isLoadingOrders = loadingOrders.has(user.id);
                        
                        return (
                          <Fragment key={user.id}>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {user.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.phone || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.role === 'admin'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => fetchUserOrders(user.id)}
                                  disabled={isLoadingOrders}
                                  className="text-gray-900 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                  {isLoadingOrders ? (
                                    <>
                                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                      </svg>
                                      Loading...
                                    </>
                                  ) : (
                                    <>
                                      {userOrders[user.id] !== undefined
                                        ? `${orders.length} order${orders.length !== 1 ? 's' : ''}`
                                        : 'View orders'}
                                      {isExpanded ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                      ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      )}
                                    </>
                                  )}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link
                                  href={`/admin/users/${user.id}/edit`}
                                  className="text-gray-900 hover:text-gray-600 transition-colors"
                                >
                                  Edit
                                </Link>
                              </td>
                            </tr>
                            {isExpanded && orders.length > 0 && (
                              <tr key={`${user.id}-orders`}>
                                <td colSpan={7} className="px-6 py-4 bg-gray-50">
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900 mb-2">Orders ({orders.length})</h4>
                                    <div className="space-y-2">
                                      {orders.map((order) => (
                                        <div
                                          key={order.id}
                                          className="bg-white border border-gray-200 rounded-lg p-4"
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <div>
                                              <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="text-gray-900 font-medium hover:text-gray-600"
                                              >
                                                {order.orderId}
                                              </Link>
                                              <span
                                                className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${
                                                  order.status === 'delivered'
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                              >
                                                {order.status}
                                              </span>
                                            </div>
                                            <div className="text-right">
                                              <div className="text-sm font-semibold text-gray-900">
                                                ₹{order.total.toLocaleString()}
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}:{' '}
                                            {order.items.map((item) => `${item.name} (${item.quantity}x)`).join(', ')}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                            {isExpanded && orders.length === 0 && !isLoadingOrders && (
                              <tr key={`${user.id}-no-orders`}>
                                <td colSpan={7} className="px-6 py-4 bg-gray-50">
                                  <div className="text-sm text-gray-500">No orders found for this user.</div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}

