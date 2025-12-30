import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { getOrderByOrderId, getOrderPublic } from '@/lib/orders';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get order by orderId (display ID)
    const order = await getOrderByOrderId(params.id);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify order belongs to user
    if (order.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Return order
    return NextResponse.json({
      order: getOrderPublic(order),
    });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Failed to get order' },
      { status: 500 }
    );
  }
}

