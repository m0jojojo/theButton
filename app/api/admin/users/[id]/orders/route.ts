import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/jwt';
import { requireAdmin } from '@/lib/admin';
import { getUserById } from '@/lib/users';
import { getOrdersByUserId, getOrdersByUserEmail, getOrderPublic } from '@/lib/orders';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    // Get user to find their email
    const user = await getUserById(params.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get orders by both user ID and email (to catch all orders)
    const ordersByUserId = await getOrdersByUserId(params.id);
    const ordersByEmail = await getOrdersByUserEmail(user.email);

    // Combine and deduplicate orders
    const allOrdersMap = new Map();
    [...ordersByUserId, ...ordersByEmail].forEach((order) => {
      allOrdersMap.set(order.id, order);
    });

    const orders = Array.from(allOrdersMap.values());

    return NextResponse.json({
      orders: orders.map(getOrderPublic),
    });
  } catch (error: any) {
    console.error('[Admin User Orders GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user orders' },
      { status: error.message?.includes('Forbidden') ? 403 : 500 }
    );
  }
}

