import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { createOrder, getOrderPublic } from '@/lib/orders';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      orderId,
      paymentMethod,
      paymentStatus,
      items,
      subtotal,
      shipping,
      total,
      shippingAddress,
    } = body;

    // Validation
    if (!orderId || !paymentMethod || !items || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order
    const order = await createOrder({
      orderId,
      userId: payload.userId,
      userEmail: payload.email, // Include email for stable matching
      paymentMethod,
      paymentStatus: paymentStatus || (paymentMethod === 'cod' ? 'pending' : 'paid'),
      items,
      subtotal,
      shipping,
      total,
      shippingAddress,
    });

    console.log(`Order created: ${order.orderId} for user: ${payload.email} (ID: ${payload.userId})`);

    // Return order
    return NextResponse.json(
      {
        order: getOrderPublic(order),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

