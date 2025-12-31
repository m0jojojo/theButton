import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/jwt';
import { requireAdmin } from '@/lib/admin';
import { getOrderById, updateOrderStatus, getOrderPublic } from '@/lib/orders';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const order = await getOrderById(params.id);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: getOrderPublic(order),
    });
  } catch (error: any) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get order' },
      { status: error.message?.includes('Forbidden') ? 403 : 401 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const order = await getOrderById(params.id);
    if (!order) {
      console.error(`[PATCH /api/admin/orders/[id]] Order not found: ${params.id}`);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log(`[PATCH /api/admin/orders/[id]] Updating order ${params.id} to status: ${status}`);
    const updatedOrder = await updateOrderStatus(params.id, status as any);
    if (!updatedOrder) {
      console.error(`[PATCH /api/admin/orders/[id]] Failed to update order ${params.id} to status ${status}`);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    console.log(`[PATCH /api/admin/orders/[id]] Successfully updated order ${params.id} to status: ${updatedOrder.status}`);
    return NextResponse.json({
      order: getOrderPublic(updatedOrder),
    });
  } catch (error: any) {
    console.error('[PATCH /api/admin/orders/[id]] Update order error:', error);
    console.error('[PATCH /api/admin/orders/[id]] Error details:', {
      message: error.message,
      stack: error.stack,
      orderId: params.id,
    });
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: error.message?.includes('Forbidden') ? 403 : 500 }
    );
  }
}

