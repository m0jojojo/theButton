/**
 * Database Review Functions
 * 
 * This module provides database-backed review functions.
 * Replaces in-memory review store with PostgreSQL queries.
 */

import { prisma } from '@/lib/prisma';
import { Review, ReviewStatus } from '@/lib/reviews';

/**
 * Convert Prisma Review to Review interface
 */
function prismaToReview(prismaReview: any): Review {
  return {
    id: prismaReview.id,
    productId: prismaReview.productId,
    userId: prismaReview.userId,
    userEmail: prismaReview.userEmail,
    userName: prismaReview.userName,
    rating: prismaReview.rating,
    comment: prismaReview.comment,
    verifiedPurchase: prismaReview.verifiedPurchase,
    helpfulCount: prismaReview.helpfulCount,
    status: prismaReview.status as ReviewStatus,
    createdAt: prismaReview.createdAt,
    updatedAt: prismaReview.updatedAt,
  };
}

/**
 * Get all reviews from database (for admin)
 */
export async function getAllReviewsFromDB(): Promise<Review[]> {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews.map(prismaToReview);
  } catch (error) {
    console.error('[reviews-db.ts] Error fetching all reviews:', error);
    return [];
  }
}

/**
 * Get reviews by product ID from database
 */
export async function getReviewsByProductIdFromDB(
  productId: string,
  options?: {
    status?: 'approved' | 'pending' | 'rejected' | 'all';
    sortBy?: 'newest' | 'oldest' | 'rating' | 'helpful';
  }
): Promise<Review[]> {
  try {
    const where: any = { productId };
    
    if (options?.status && options.status !== 'all') {
      // Prisma enum values are lowercase
      where.status = options.status;
    }

    const orderBy: any = {};
    switch (options?.sortBy) {
      case 'oldest':
        orderBy.createdAt = 'asc';
        break;
      case 'rating':
        orderBy.rating = 'desc';
        break;
      case 'helpful':
        orderBy.helpfulCount = 'desc';
        break;
      case 'newest':
      default:
        orderBy.createdAt = 'desc';
        break;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy,
    });

    return reviews.map(prismaToReview);
  } catch (error) {
    console.error(`[reviews-db.ts] Error fetching reviews for product ${productId}:`, error);
    return [];
  }
}

/**
 * Update review status in database
 */
export async function updateReviewStatusInDB(
  reviewId: string,
  status: 'approved' | 'pending' | 'rejected'
): Promise<Review | null> {
  try {
    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { status: status as any },
    });

    return prismaToReview(updated);
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record not found
      return null;
    }
    console.error(`[reviews-db.ts] Error updating review status for ${reviewId}:`, error);
    throw error;
  }
}

/**
 * Create review in database
 */
export async function createReviewInDB(data: {
  productId: string;
  userId: string;
  userEmail: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  status?: 'approved' | 'pending' | 'rejected';
}): Promise<Review> {
  try {
    // Check if user already reviewed this product
    const existing = await prisma.review.findUnique({
      where: {
        productId_userEmail: {
          productId: data.productId,
          userEmail: data.userEmail,
        },
      },
    });

    if (existing) {
      throw new Error('You have already reviewed this product');
    }

    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        rating: data.rating,
        comment: data.comment,
        verifiedPurchase: data.verifiedPurchase,
        status: (data.status || 'approved') as any,
        helpfulCount: 0,
      },
    });

    return prismaToReview(review);
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw new Error('You have already reviewed this product');
    }
    console.error('[reviews-db.ts] Error creating review:', error);
    throw error;
  }
}

/**
 * Delete review from database
 */
export async function deleteReviewFromDB(reviewId: string): Promise<boolean> {
  try {
    await prisma.review.delete({
      where: { id: reviewId },
    });
    return true;
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record not found
      return false;
    }
    console.error(`[reviews-db.ts] Error deleting review ${reviewId}:`, error);
    throw error;
  }
}

