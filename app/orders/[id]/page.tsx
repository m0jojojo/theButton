'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import Image from 'next/image';
import PlaceholderImage from '@/components/PlaceholderImage';
import { useCart } from '@/contexts/CartContext';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  size: string;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  orderId: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
}

function OrderDetailsContent({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { token } = useAuth();
  const { addItem } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
        } else if (response.status === 404) {
          setError('Order not found');
        } else {
          setError('Failed to load order');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [token, orderId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReorder = () => {
    if (!order) return;

    order.items.forEach((item) => {
      addItem({
        productId: item.productId,
        name: item.name,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        size: item.size,
        image: item.image,
      });
    });

    router.push('/cart');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
          <Link
            href="/orders"
            className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/orders"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4 inline-block"
          >
            ← Back to Orders
          </Link>
          <div className="flex items-start justify-between mt-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Order {order.orderId}
              </h1>
              <p className="text-sm text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.status as any} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <Link
                      href={`/products/${item.productId}`}
                      className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      {item.image ? (
                        item.image.startsWith('data:') ? (
                          // Base64 data URL - use regular img tag
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : item.image.startsWith('http') ? (
                          // HTTP/HTTPS URL - use Next.js Image
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                            quality={75}
                          />
                        ) : (
                          // Invalid image - use placeholder
                          <PlaceholderImage alt={item.name} />
                        )
                      ) : (
                        <PlaceholderImage alt={item.name} />
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productId}`}
                        className="block font-semibold text-base md:text-lg mb-1 text-gray-900 hover:text-gray-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-600 mb-2">
                        Size: <span className="font-medium text-gray-900">{item.size}</span>
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-gray-900">
                            {formatPrice(item.price)}
                          </span>
                          {item.compareAtPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.compareAtPrice)}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </span>
                      </div>
                      <div className="mt-2 text-sm font-medium text-gray-900">
                        Item Total: {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-gray-700">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                </p>
                <p className="mt-2">
                  <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {order.shippingAddress.email}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">
                    {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-gray-900">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="ml-2 font-medium text-gray-900 capitalize">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`ml-2 font-medium capitalize ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 
                    order.paymentStatus === 'failed' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <button
                onClick={handleReorder}
                className="w-full mt-6 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Reorder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </div>
      }>
        <OrderDetailsContent orderId={params.id} />
      </Suspense>
    </AuthGuard>
  );
}

