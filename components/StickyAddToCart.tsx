'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

interface StickyAddToCartProps {
  product: {
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    sizes: Array<{ value: string; available: boolean; stock: number }>;
    inStock: boolean;
    images?: string[];
  };
}

export default function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showAdded, setShowAdded] = useState(false);
  const pathname = usePathname();
  const { addItem } = useCart();

  useEffect(() => {
    // Show sticky bar after scrolling past initial viewport
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(scrollY > windowHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      // Scroll to size selector in main product info
      const sizeSelector = document.querySelector('[data-size-selector]');
      if (sizeSelector) {
        sizeSelector.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the size selector briefly
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
    
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  // Only show on product pages
  if (!pathname?.startsWith('/products/')) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg md:hidden"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 truncate">{product.name}</p>
              </div>

              {/* Size Selector (Compact) */}
              {!selectedSize && (
                <select
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900"
                  defaultValue=""
                >
                  <option value="" disabled>Size</option>
                  {product.sizes
                    .filter((size) => size.available)
                    .map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.value}
                      </option>
                    ))}
                </select>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.inStock === false}
                className={`
                  px-6 py-3 rounded-lg font-semibold text-sm whitespace-nowrap transition-all
                  ${
                    !product.inStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : showAdded
                      ? 'bg-green-600 text-white'
                      : !selectedSize
                      ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
                      : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
                  }
                `}
              >
                {!selectedSize
                  ? 'Select Size'
                  : !product.inStock
                  ? 'Out of Stock'
                  : showAdded
                  ? '✓ Added!'
                  : 'Add to Cart'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

