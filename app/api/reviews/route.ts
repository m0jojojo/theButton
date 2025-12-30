import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import {
  createReview,
  getReviewsByProductId,
  getReviewStats,
} from '@/lib/reviews';

// GET /api/reviews?productId=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const sortBy = searchParams.get('sortBy') as 'newest' | 'oldest' | 'rating' | 'helpful' | null;
    const includeStats = searchParams.get('includeStats') === 'true';

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get reviews (only approved for public)
    const reviews = getReviewsByProductId(productId, {
      status: 'approved',
      sortBy: sortBy || 'newest',
    });

    const response: any = { reviews };

    // Include stats if requested
    if (includeStats) {
      const stats = getReviewStats(productId);
      response.stats = stats;
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    const payload = verifyToken(token);

    if (!payload || !payload.userId || !payload.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, rating, comment } = body;

    // Validation
    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Product ID, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Get user name from token or use email
    const userName = payload.name || payload.email.split('@')[0];

    // Create review
    const review = await createReview({
      productId,
      userId: payload.userId,
      userEmail: payload.email,
      userName,
      rating: Number(rating),
      comment: comment.trim(),
    });

    // Get updated stats
    const stats = getReviewStats(productId);

    return NextResponse.json(
      { review, stats },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create review' },
      { status: error.message?.includes('already reviewed') ? 409 : 500 }
    );
  }
}

