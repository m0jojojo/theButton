'use client';

import Link from 'next/link';
import { OrderStatus, Order } from '@/lib/orders';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderCardProps {
  order: {
    id: string;
    orderId: string;
    status: OrderStatus;
    total: number;
    items: Array<{
      name: string;
      quantity: number;
      image: string;
    }>;
    createdAt: string;
  };
}

export default function OrderCard({ order }: OrderCardProps) {
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
      month: 'short',
      day: 'numeric',
    });
  };

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href={`/orders/${order.orderId}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left side - Order info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Order {order.orderId}
              </h3>
              <p className="text-sm text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            <span className="font-semibold text-gray-900">
              {formatPrice(order.total)}
            </span>
          </div>

          {/* Preview of items */}
          <div className="flex gap-2 mt-3">
            {order.items.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500"
              >
                {item.quantity}x
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                +{order.items.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* Right side - View details */}
        <div className="md:text-right">
          <span className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

