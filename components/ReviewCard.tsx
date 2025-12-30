'use client';

import { useState } from 'react';
import StarRating from './StarRating';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewCardProps {
  review: {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    verifiedPurchase: boolean;
    helpfulCount: number;
    createdAt: string | Date;
    userEmail?: string;
  };
  onVote?: (reviewId: string, helpful: boolean) => void;
  userVote?: { helpful: boolean } | null;
}

export default function ReviewCard({ review, onVote, userVote }: ReviewCardProps) {
  const { user } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [localHelpfulCount, setLocalHelpfulCount] = useState(review.helpfulCount);
  const [hasVoted, setHasVoted] = useState(!!userVote);

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleVote = async (helpful: boolean) => {
    if (!user || !onVote || isVoting) return;

    setIsVoting(true);
    try {
      const response = await fetch(`/api/reviews/${review.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('theButton_token')}`,
        },
        body: JSON.stringify({ helpful }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocalHelpfulCount(data.newHelpfulCount);
        setHasVoted(true);
      }
    } catch (error) {
      console.error('Error voting on review:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="border-b border-gray-200 py-6 last:border-b-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-gray-900">{review.userName}</h4>
            {review.verifiedPurchase && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Purchase
              </span>
            )}
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
        <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
      </div>

      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{review.comment}</p>

      {user && onVote && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Helpful? ({localHelpfulCount})
          </span>
          <button
            onClick={() => handleVote(true)}
            disabled={isVoting || hasVoted}
            className={`text-sm ${
              hasVoted && userVote?.helpful
                ? 'text-green-600 font-medium'
                : 'text-gray-600 hover:text-green-600'
            } transition-colors disabled:opacity-50`}
          >
            Yes
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={isVoting || hasVoted}
            className={`text-sm ${
              hasVoted && !userVote?.helpful
                ? 'text-red-600 font-medium'
                : 'text-gray-600 hover:text-red-600'
            } transition-colors disabled:opacity-50`}
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}

