// Mock review store - Replace with database in production
// This is a temporary solution for MVP

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userEmail: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  verifiedPurchase: boolean; // Whether user purchased this product
  helpfulCount: number; // Number of helpful votes
  createdAt: Date;
  updatedAt: Date;
  status: 'approved' | 'pending' | 'rejected'; // For moderation
}

export interface ReviewVote {
  reviewId: string;
  userId: string;
  userEmail: string;
  helpful: boolean; // true for helpful, false for not helpful
  createdAt: Date;
}

// In-memory review store (replace with database)
// Use global to persist across hot reloads in Next.js
declare global {
  var __reviews_store: Map<string, Review> | undefined;
  var __reviews_by_product: Map<string, Review[]> | undefined;
  var __reviews_by_user: Map<string, Review[]> | undefined;
  var __review_votes_store: Map<string, ReviewVote> | undefined;
}

// Initialize or reuse existing stores (persists across hot reloads)
const reviews: Map<string, Review> = global.__reviews_store || new Map();
const reviewsByProduct: Map<string, Review[]> = global.__reviews_by_product || new Map();
const reviewsByUser: Map<string, Review[]> = global.__reviews_by_user || new Map();
const reviewVotes: Map<string, ReviewVote> = global.__review_votes_store || new Map();

// Store references globally to persist across hot reloads
if (!global.__reviews_store) {
  global.__reviews_store = reviews;
  global.__reviews_by_product = reviewsByProduct;
  global.__reviews_by_user = reviewsByUser;
  global.__review_votes_store = reviewVotes;
  console.log('[reviews.ts] Initialized new review stores');
} else {
  console.log(`[reviews.ts] Reusing existing stores - Total reviews: ${reviews.size}, Total products: ${reviewsByProduct.size}`);
}

// Helper to check if user purchased a product
import { getOrdersByUserEmail } from './orders';

export async function hasUserPurchasedProduct(userEmail: string, productId: string): Promise<boolean> {
  try {
    const orders = getOrdersByUserEmail(userEmail);
    return orders.some((order) =>
      order.items.some((item) => item.productId === productId)
    );
  } catch (error) {
    console.error('[reviews.ts] Error checking purchase:', error);
    return false;
  }
}

// Create a new review
export async function createReview(data: {
  productId: string;
  userId: string;
  userEmail: string;
  userName: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  // Validate rating
  if (data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Check if user already reviewed this product
  const existingReviews = reviewsByProduct.get(data.productId) || [];
  const existingReview = existingReviews.find(
    (r) => r.userEmail === data.userEmail || r.userId === data.userId
  );

  if (existingReview) {
    throw new Error('You have already reviewed this product');
  }

  // Check if user purchased the product
  const verifiedPurchase = await hasUserPurchasedProduct(data.userEmail, data.productId);

  const review: Review = {
    id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    productId: data.productId,
    userId: data.userId,
    userEmail: data.userEmail,
    userName: data.userName,
    rating: data.rating,
    comment: data.comment.trim(),
    verifiedPurchase,
    helpfulCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'approved', // Auto-approve for MVP, can be changed to 'pending' for moderation
  };

  // Store review
  reviews.set(review.id, review);

  // Update product index
  const productReviews = reviewsByProduct.get(data.productId) || [];
  productReviews.push(review);
  reviewsByProduct.set(data.productId, productReviews);

  // Update user index
  const userReviews = reviewsByUser.get(data.userEmail) || [];
  userReviews.push(review);
  reviewsByUser.set(data.userEmail, userReviews);

  console.log(`[reviews.ts] Created review: ${review.id} for product ${data.productId} by ${data.userEmail}`);

  return review;
}

// Get reviews for a product
export function getReviewsByProductId(productId: string, options?: {
  status?: 'approved' | 'pending' | 'rejected' | 'all';
  sortBy?: 'newest' | 'oldest' | 'rating' | 'helpful';
}): Review[] {
  const productReviews = reviewsByProduct.get(productId) || [];
  
  // Filter by status
  let filtered = productReviews;
  if (options?.status && options.status !== 'all') {
    filtered = productReviews.filter((r) => r.status === options.status);
  }

  // Sort
  if (options?.sortBy) {
    switch (options.sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
    }
  } else {
    // Default: newest first
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  return filtered;
}

// Get review statistics for a product
export function getReviewStats(productId: string): {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [rating: number]: number };
} {
  const productReviews = getReviewsByProductId(productId, { status: 'approved' });
  
  if (productReviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / productReviews.length;

  const ratingDistribution: { [rating: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  productReviews.forEach((review) => {
    ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
  });

  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: productReviews.length,
    ratingDistribution,
  };
}

// Vote on a review (helpful/not helpful)
export function voteOnReview(
  reviewId: string,
  userId: string,
  userEmail: string,
  helpful: boolean
): { success: boolean; newHelpfulCount: number } {
  const review = reviews.get(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  // Check if user already voted
  const voteKey = `${reviewId}_${userEmail}`;
  const existingVote = reviewVotes.get(voteKey);

  if (existingVote) {
    // User already voted, update the vote
    if (existingVote.helpful === helpful) {
      // Same vote, remove it
      reviewVotes.delete(voteKey);
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      // Different vote, update
      if (helpful) {
        review.helpfulCount += 2; // Was not helpful, now helpful (+2)
      } else {
        review.helpfulCount = Math.max(0, review.helpfulCount - 2); // Was helpful, now not helpful (-2)
      }
      existingVote.helpful = helpful;
      existingVote.createdAt = new Date();
    }
  } else {
    // New vote
    const vote: ReviewVote = {
      reviewId,
      userId,
      userEmail,
      helpful,
      createdAt: new Date(),
    };
    reviewVotes.set(voteKey, vote);
    if (helpful) {
      review.helpfulCount += 1;
    } else {
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    }
  }

  // Update review
  review.updatedAt = new Date();
  reviews.set(reviewId, review);

  // Update product index
  const productReviews = reviewsByProduct.get(review.productId) || [];
  const index = productReviews.findIndex((r) => r.id === reviewId);
  if (index !== -1) {
    productReviews[index] = review;
    reviewsByProduct.set(review.productId, productReviews);
  }

  return {
    success: true,
    newHelpfulCount: review.helpfulCount,
  };
}

// Get user's vote on a review
export function getUserVoteOnReview(reviewId: string, userEmail: string): ReviewVote | null {
  const voteKey = `${reviewId}_${userEmail}`;
  return reviewVotes.get(voteKey) || null;
}

// Get all reviews (for admin)
export function getAllReviews(): Review[] {
  return Array.from(reviews.values());
}

// Update review status (for moderation)
export function updateReviewStatus(reviewId: string, status: 'approved' | 'pending' | 'rejected'): Review {
  const review = reviews.get(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  review.status = status;
  review.updatedAt = new Date();
  reviews.set(reviewId, review);

  // Update product index
  const productReviews = reviewsByProduct.get(review.productId) || [];
  const index = productReviews.findIndex((r) => r.id === reviewId);
  if (index !== -1) {
    productReviews[index] = review;
    reviewsByProduct.set(review.productId, productReviews);
  }

  return review;
}

// Delete a review
export function deleteReview(reviewId: string): void {
  const review = reviews.get(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  // Remove from main store
  reviews.delete(reviewId);

  // Remove from product index
  const productReviews = reviewsByProduct.get(review.productId) || [];
  const filtered = productReviews.filter((r) => r.id !== reviewId);
  reviewsByProduct.set(review.productId, filtered);

  // Remove from user index
  const userReviews = reviewsByUser.get(review.userEmail) || [];
  const filteredUser = userReviews.filter((r) => r.id !== reviewId);
  reviewsByUser.set(review.userEmail, filteredUser);

  // Remove votes
  for (const [key, vote] of reviewVotes.entries()) {
    if (vote.reviewId === reviewId) {
      reviewVotes.delete(key);
    }
  }
}

