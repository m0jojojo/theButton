import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/jwt';
import { requireAdmin } from '@/lib/admin';
import { getAllOrders, getOrderPublic } from '@/lib/orders';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const allOrders = getAllOrders();

    return NextResponse.json({
      orders: allOrders.map(getOrderPublic),
    });
  } catch (error: any) {
    console.error('Admin orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: error.message?.includes('Forbidden') ? 403 : 401 }
    );
  }
}

