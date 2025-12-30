import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/jwt';
import { requireAdmin } from '@/lib/admin';
import { getAllProducts } from '@/lib/products';
import { getAllOrders } from '@/lib/orders';
import { getAllUsers } from '@/lib/users';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    // Get all products
    const products = getAllProducts();
    const totalProducts = products.length;

    // Get all orders
    const allOrders = getAllOrders();
    
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = allOrders.filter((order) => order.status === 'pending').length;

    // Get all users
    const allUsers = getAllUsers();
    const totalUsers = allUsers.length;

    // Get recent orders (last 10)
    const recentOrders = allOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((order) => ({
        id: order.id,
        orderId: order.orderId,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      }));

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      totalUsers,
      totalProducts,
      pendingOrders,
      recentOrders,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: error.message?.includes('Forbidden') ? 403 : 401 }
    );
  }
}

