'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import ProductReviewStars from './ProductReviewStars';

interface UpsellProduct {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string | null;
}

export default function CartUpsells() {
  const { items } = useCart();
  const [products, setProducts] = useState<UpsellProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        // Get product IDs already in cart to exclude them
        const excludeIds = items.map((item) => item.productId).join(',');
        
        const response = await fetch(
          `/api/products/random?limit=4${excludeIds ? `&exclude=${excludeIds}` : ''}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching random products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomProducts();
  }, [items]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Complete Your Look</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
              <div className="h-3 bg-gray-200 rounded mb-1" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">Complete Your Look</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((product) => {
          const productImage = product.image;
          const hasValidImage = productImage && (
            productImage.startsWith('data:') || 
            productImage.startsWith('http://') || 
            productImage.startsWith('https://')
          );

          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-2 group-hover:shadow-md transition-shadow">
                {hasValidImage ? (
                  productImage.startsWith('data:') ? (
                    // Base64 data URL - use regular img tag
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    // HTTP/HTTPS URL - use Next.js Image
                    <Image
                      src={productImage}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      quality={80}
                    />
                  )
                ) : (
                  // Placeholder
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:from-gray-300 group-hover:to-gray-400 transition-colors flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Product Image</span>
                  </div>
                )}
              </div>
              <h4 className="font-medium text-xs mb-1 text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                {product.name}
              </h4>
              <div className="mb-1">
                <ProductReviewStars productId={product.id} size="sm" noLink={true} />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-xs font-bold text-gray-900">{formatPrice(product.price)}</p>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <p className="text-xs text-gray-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

