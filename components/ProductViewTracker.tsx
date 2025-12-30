'use client';

import { useEffect } from 'react';
import { trackProductView } from '@/lib/analytics';

interface ProductViewTrackerProps {
  product: {
    id: string;
    name: string;
    price: number;
    collection?: string;
    sku?: string;
  };
}

export default function ProductViewTracker({ product }: ProductViewTrackerProps) {
  useEffect(() => {
    trackProductView({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.collection,
      sku: product.sku,
    });
  }, [product]);

  return null;
}

