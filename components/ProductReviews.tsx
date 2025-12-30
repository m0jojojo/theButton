'use client';

import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useAuth } from '@/contexts/AuthContext';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string | Date;
  userEmail?: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [rating: number]: number };
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'helpful'>('newest');
  const [userVotes, setUserVotes] = useState<Record<string, { helpful: boolean }>>({});

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/reviews?productId=${productId}&includeStats=true&sortBy=${sortBy}`
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setStats(data.stats || null);

        // Fetch user votes if logged in
        if (user) {
          // Note: In a real app, you'd fetch all user votes at once
          // For now, we'll fetch them individually when needed
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    const token = localStorage.getItem('theButton_token');
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        rating,
        comment,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to submit review');
    }

    const data = await response.json();
    // Refresh reviews
    await fetchReviews();
    setShowForm(false);
  };

  const handleVote = async (reviewId: string, helpful: boolean) => {
    if (!user) return;

    const token = localStorage.getItem('theButton_token');
    const response = await fetch(`/api/reviews/${reviewId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ helpful }),
    });

    if (response.ok) {
      const data = await response.json();
      // Update local state
      setUserVotes((prev) => ({ ...prev, [reviewId]: { helpful } }));
      // Refresh reviews to get updated helpful count
      await fetchReviews();
    }
  };

  const getRatingPercentage = (rating: number) => {
    if (!stats || stats.totalReviews === 0) return 0;
    const count = stats.ratingDistribution[rating] || 0;
    return (count / stats.totalReviews) * 100;
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
          {stats && stats.totalReviews > 0 ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <StarRating rating={stats.averageRating} size="lg" showValue={true} />
                <span className="text-sm text-gray-600">
                  ({stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet. Be the first to review!</p>
          )}
        </div>
        {!showForm && user && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-8">
          <ReviewForm
            productId={productId}
            onSubmit={handleSubmitReview}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Rating Distribution */}
      {stats && stats.totalReviews > 0 && (
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentage = getRatingPercentage(rating);
              const count = stats.ratingDistribution[rating] || 0;
              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-20">
                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sort Options */}
      {reviews.length > 0 && (
        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No reviews yet.</p>
          {!user && (
            <p className="text-sm text-gray-500">
              <a href="/login" className="text-gray-900 hover:underline">
                Log in
              </a>{' '}
              to be the first to review this product!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-0">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onVote={user ? handleVote : undefined}
              userVote={userVotes[review.id] || null}
            />
          ))}
        </div>
      )}
    </div>
  );
}

