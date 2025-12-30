'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import QuantityControls from './QuantityControls';
import Image from 'next/image';

interface CartItemProps {
  item: {
    id: string;
    productId: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    size: string;
    quantity: number;
    image: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="p-4 md:p-6">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link
          href={`/products/${item.productId}`}
          className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden hover:opacity-80 transition-opacity"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Image</span>
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Link
                href={`/products/${item.productId}`}
                className="block font-semibold text-base md:text-lg mb-1 text-gray-900 hover:text-gray-600 transition-colors"
              >
                {item.name}
              </Link>
              <p className="text-sm text-gray-600 mb-2">
                Size: <span className="font-medium text-gray-900">{item.size}</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-gray-900">{formatPrice(item.price)}</span>
                {item.compareAtPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(item.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
              aria-label="Remove item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Quantity Controls & Total */}
          <div className="flex items-center justify-between mt-4">
            <QuantityControls
              quantity={item.quantity}
              onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
              onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
            />
            <div className="text-right">
              <div className="text-sm text-gray-700 font-medium">Item Total</div>
              <div className="font-bold text-lg text-gray-900">{formatPrice(itemTotal)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

