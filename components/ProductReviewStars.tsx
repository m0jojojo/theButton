'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StarRating from './StarRating';

interface ProductReviewStarsProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export default function ProductReviewStars({
  productId,
  size = 'sm',
  showCount = true,
  className = '',
}: ProductReviewStarsProps) {
  const [reviewStats, setReviewStats] = useState<{
    averageRating: number;
    totalReviews: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}&includeStats=true`);
        if (response.ok) {
          const data = await response.json();
          if (data.stats) {
            setReviewStats({
              averageRating: data.stats.averageRating || 0,
              totalReviews: data.stats.totalReviews || 0,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching review stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewStats();
  }, [productId]);

  if (isLoading) {
    return null; // Don't show anything while loading
  }

  if (!reviewStats || reviewStats.totalReviews === 0) {
    return null; // Don't show if no reviews
  }

  return (
    <Link
      href={`/products/${productId}#product-reviews`}
      className={`flex items-center gap-1.5 group hover:opacity-80 transition-opacity ${className}`}
      onClick={(e) => {
        // If already on product page, scroll to reviews instead of navigating
        if (window.location.pathname === `/products/${productId}`) {
          e.preventDefault();
          const reviewsSection = document.getElementById('product-reviews');
          if (reviewsSection) {
            reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }}
      aria-label={`${reviewStats.averageRating.toFixed(1)} out of 5 stars, ${reviewStats.totalReviews} reviews. Click to view reviews.`}
    >
      <StarRating
        rating={reviewStats.averageRating}
        size={size}
        showValue={false}
      />
      {showCount && (
        <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
          ({reviewStats.totalReviews})
        </span>
      )}
    </Link>
  );
}

