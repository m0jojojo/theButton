'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SizeSelector from './SizeSelector';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    description: string;
    sizes: Array<{ value: string; available: boolean; stock: number }>;
    inStock: boolean;
    sku: string;
    collection: string;
    images?: string[];
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      // Scroll to size selector
      const sizeSelector = document.querySelector('[data-size-selector]');
      if (sizeSelector) {
        sizeSelector.scrollIntoView({ behavior: 'smooth', block: 'center' });
        sizeSelector.classList.add('ring-2', 'ring-gray-900', 'ring-offset-2');
        setTimeout(() => {
          sizeSelector.classList.remove('ring-2', 'ring-gray-900', 'ring-offset-2');
        }, 2000);
      }
      return;
    }
    
    // Add to cart
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      size: selectedSize,
      image: product.images?.[0] || '/placeholder-product.jpg',
    });
    
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };

  const lowStockSizes = product.sizes.filter((size) => size.available && size.stock <= 3 && size.stock > 0);
  const hasLowStock = lowStockSizes.length > 0;

  return (
    <div className="space-y-6">
      {/* Collection Badge */}
      <div className="text-sm text-gray-600 uppercase tracking-wide">
        {product.collection}
      </div>

      {/* Product Title */}
      <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

      {/* Price & Discount */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl md:text-4xl font-bold">{formatPrice(product.price)}</span>
        {product.compareAtPrice && (
          <>
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* Scarcity Text */}
      {hasLowStock && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-orange-600 text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Only {lowStockSizes.map(s => `${s.stock} left in ${s.value}`).join(', ')}</span>
        </motion.div>
      )}

      {/* Description */}
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {/* Size Selector */}
      <div data-size-selector>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold">Size</label>
          <a href="#size-guide" className="text-sm text-gray-600 hover:text-gray-900 underline">
            Size Guide
          </a>
        </div>
        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSizeSelect={setSelectedSize}
        />
      </div>

      {/* Add to Cart Button */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize || !product.inStock}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
            !selectedSize || !product.inStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
          }`}
        >
          {!selectedSize
            ? 'Select a Size'
            : !product.inStock
            ? 'Out of Stock'
            : showAddedToCart
            ? '✓ Added to Cart!'
            : 'Add to Cart'}
        </button>

        {/* Risk Reversal */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Easy Returns</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>7-Day Exchange</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="border-t border-gray-200 pt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">SKU:</span>
          <span className="font-medium">{product.sku}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Availability:</span>
          <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
}

