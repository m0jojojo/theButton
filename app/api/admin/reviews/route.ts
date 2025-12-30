import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/jwt';
import { requireAdmin } from '@/lib/admin';
import { getAllReviews, updateReviewStatus, deleteReview } from '@/lib/reviews';

// GET /api/admin/reviews - Get all reviews
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const reviews = getAllReviews();
    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: error.message?.includes('Forbidden') ? 403 : 401 }
    );
  }
}

// PATCH /api/admin/reviews - Update review status
export async function PATCH(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const body = await request.json();
    const { reviewId, status } = body;

    if (!reviewId || !status) {
      return NextResponse.json(
        { error: 'Review ID and status are required' },
        { status: 400 }
      );
    }

    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be approved, pending, or rejected' },
        { status: 400 }
      );
    }

    const review = updateReviewStatus(reviewId, status);
    return NextResponse.json({ review });
  } catch (error: any) {
    console.error('Update review status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update review status' },
      { status: error.message?.includes('not found') ? 404 : 500 }
    );
  }
}

// DELETE /api/admin/reviews - Delete a review
export async function DELETE(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const searchParams = request.nextUrl.searchParams;
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    deleteReview(reviewId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete review' },
      { status: error.message?.includes('not found') ? 404 : 500 }
    );
  }
}

