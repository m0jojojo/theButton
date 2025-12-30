import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { getOrdersByUserId, getOrderPublic } from '@/lib/orders';

export async function GET(request: NextRequest) {
  try {
    // Get token from request
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user's orders
    const orders = await getOrdersByUserId(payload.userId);

    // Return orders
    return NextResponse.json({
      orders: orders.map(getOrderPublic),
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to get orders' },
      { status: 500 }
    );
  }
}

