'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import OrderCard from '@/components/OrderCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

interface Order {
  id: string;
  orderId: string;
  status: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    image: string;
  }>;
  createdAt: string;
}

function OrdersContent() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        // Decode token to see email (for debugging)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('Fetching orders for email:', payload.email, 'userId:', payload.userId);
        } catch (e) {
          console.log('Could not decode token for debugging');
        }

        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Orders fetched:', data.orders);
          console.log('Number of orders:', data.orders?.length || 0);
          setOrders(data.orders || []);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Failed to load orders:', response.status, errorData);
          setError(errorData.error || 'Failed to load orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here
            </p>
            <Link
              href="/collections/new-arrivals"
              className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </div>
      }>
        <OrdersContent />
      </Suspense>
    </AuthGuard>
  );
}

