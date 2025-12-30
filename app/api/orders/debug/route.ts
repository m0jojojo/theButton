import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { getOrderStoreStats, getOrdersByUserEmail } from '@/lib/orders';

// Debug endpoint to check order store state
// Remove this in production
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const stats = getOrderStoreStats();
    const userOrders = await getOrdersByUserEmail(payload.email.toLowerCase());

    return NextResponse.json({
      userEmail: payload.email,
      normalizedEmail: payload.email.toLowerCase(),
      userId: payload.userId,
      storeStats: stats,
      userOrdersCount: userOrders.length,
      userOrders: userOrders.map(o => ({
        orderId: o.orderId,
        userEmail: o.userEmail,
        userId: o.userId,
        total: o.total,
        createdAt: o.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

