'use client';

import { CartItem } from '@/contexts/CartContext';
import Link from 'next/link';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export default function OrderSummary({ items, subtotal, shipping, total }: OrderSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

      {/* Order Items */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 text-sm">
            <div className="relative w-12 h-12 flex-shrink-0 rounded bg-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Img</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-gray-600 text-xs">
                Size: {item.size} × {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-gray-700">
          <span className="font-medium">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span className="font-medium">Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600 font-semibold">Free</span>
            ) : (
              <span className="font-medium">{formatPrice(shipping)}</span>
            )}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Easy returns</span>
        </div>
      </div>

      {/* Back to Cart */}
      <Link
        href="/cart"
        className="block mt-4 text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        ← Back to Cart
      </Link>
    </div>
  );
}

