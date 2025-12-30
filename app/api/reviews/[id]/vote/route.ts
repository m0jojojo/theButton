import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { voteOnReview } from '@/lib/reviews';

// POST /api/reviews/[id]/vote
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { helpful } = body;

    if (typeof helpful !== 'boolean') {
      return NextResponse.json(
        { error: 'Helpful must be a boolean' },
        { status: 400 }
      );
    }

    const result = voteOnReview(
      params.id,
      payload.userId,
      payload.email,
      helpful
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Vote on review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to vote on review' },
      { status: 500 }
    );
  }
}

