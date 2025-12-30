import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { getOrdersByUserId, getOrdersByUserEmail, getOrderPublic } from '@/lib/orders';

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

    // Get user's orders by email (stable across server restarts)
    // Normalize email to lowercase for consistent matching
    let userOrders = await getOrdersByUserEmail(payload.email.toLowerCase());
    
    // If no orders found by email, try by userId (for backward compatibility)
    if (userOrders.length === 0) {
      userOrders = await getOrdersByUserId(payload.userId);
    }
    
    console.log(`Fetching orders for user: ${payload.email} (ID: ${payload.userId}), found ${userOrders.length} orders`);

    // Return orders
    return NextResponse.json({
      orders: userOrders.map(getOrderPublic),
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to get orders' },
      { status: 500 }
    );
  }
}

