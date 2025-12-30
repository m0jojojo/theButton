'use client';

import Link from 'next/link';

// Mock upsell products
const upsellProducts = [
  {
    id: '19',
    name: 'Leather Belt',
    price: 1299,
    image: '/placeholder-product.jpg',
  },
  {
    id: '20',
    name: 'Wallet',
    price: 999,
    image: '/placeholder-product.jpg',
  },
];

export default function CartUpsells() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Complete Your Look</h3>
      <div className="grid grid-cols-2 gap-4">
        {upsellProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-2">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:from-gray-300 group-hover:to-gray-400 transition-colors">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Image</span>
                </div>
              </div>
            </div>
            <h4 className="font-medium text-sm mb-1 text-gray-900 group-hover:text-gray-600 transition-colors">
              {product.name}
            </h4>
            <p className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

