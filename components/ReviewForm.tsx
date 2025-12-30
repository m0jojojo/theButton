'use client';

import { useState } from 'react';
import StarRating from './StarRating';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewFormProps {
  productId: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel?: () => void;
}

export default function ReviewForm({ productId, onSubmit, onCancel }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-4">Please log in to write a review</p>
        <a
          href="/login"
          className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Log In
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Comment must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      // Reset form on success
      setRating(0);
      setComment('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating *
        </label>
        <StarRating
          rating={rating}
          interactive={true}
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
          minLength={10}
          placeholder="Share your experience with this product..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
        />
        <p className="mt-1 text-sm text-gray-500">
          {comment.length}/10 minimum characters
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
          className={`px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors ${
            isSubmitting || rating === 0 || comment.trim().length < 10
              ? 'opacity-60 cursor-not-allowed'
              : ''
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

