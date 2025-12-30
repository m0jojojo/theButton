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
    const normalizedEmail = payload.email.toLowerCase();
    console.log(`[GET /api/orders] Fetching orders for email: ${normalizedEmail} (original: ${payload.email}), userId: ${payload.userId}`);
    
    let userOrders = await getOrdersByUserEmail(normalizedEmail);
    
    // If no orders found by email, try by userId (for backward compatibility)
    if (userOrders.length === 0) {
      console.log(`[GET /api/orders] No orders found by email, trying userId: ${payload.userId}`);
      userOrders = await getOrdersByUserId(payload.userId);
    }
    
    console.log(`[GET /api/orders] Found ${userOrders.length} orders for user: ${normalizedEmail} (ID: ${payload.userId})`);

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

