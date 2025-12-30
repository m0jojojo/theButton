// Mock order store - Replace with database in production
// This is a temporary solution for MVP

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  size: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderId: string; // Display order ID (e.g., ORD-1234567890-ABC)
  userId: string; // Keep for backward compatibility
  userEmail: string; // Use email for matching (stable across server restarts)
  status: OrderStatus;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// In-memory order store (replace with database)
const orders: Map<string, Order> = new Map();
const ordersByUserId: Map<string, Order[]> = new Map();
const ordersByUserEmail: Map<string, Order[]> = new Map(); // Use email for matching

export async function createOrder(data: {
  orderId: string;
  userId: string;
  userEmail: string; // Add email to order data
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: Order['shippingAddress'];
}): Promise<Order> {
  const order: Order = {
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    orderId: data.orderId,
    userId: data.userId,
    userEmail: data.userEmail.toLowerCase(), // Store email in lowercase
    status: data.paymentMethod === 'cod' ? 'pending' : 'confirmed',
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus,
    items: data.items,
    subtotal: data.subtotal,
    shipping: data.shipping,
    total: data.total,
    shippingAddress: data.shippingAddress,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Store order
  orders.set(order.id, order);

  // Store by user ID (for backward compatibility)
  const userOrdersById = ordersByUserId.get(data.userId) || [];
  userOrdersById.push(order);
  ordersByUserId.set(data.userId, userOrdersById);

  // Store by user email (primary method - stable across server restarts)
  const userOrdersByEmail = ordersByUserEmail.get(order.userEmail) || [];
  userOrdersByEmail.push(order);
  ordersByUserEmail.set(order.userEmail, userOrdersByEmail);

  console.log(`Order stored: ${order.orderId}, User ID: ${data.userId}, User Email: ${order.userEmail}, Total orders: ${userOrdersByEmail.length}`);

  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  return orders.get(id) || null;
}

export async function getOrderByOrderId(orderId: string): Promise<Order | null> {
  for (const order of orders.values()) {
    if (order.orderId === orderId) {
      return order;
    }
  }
  return null;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const userOrders = ordersByUserId.get(userId) || [];
  console.log(`Getting orders for user ID ${userId}: found ${userOrders.length} orders`);
  console.log(`Total orders in store: ${orders.size}, Total users with orders: ${ordersByUserId.size}`);
  // Sort by date (newest first)
  return userOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getOrdersByUserEmail(userEmail: string): Promise<Order[]> {
  const normalizedEmail = userEmail.toLowerCase();
  const userOrders = ordersByUserEmail.get(normalizedEmail) || [];
  console.log(`Getting orders for user email ${normalizedEmail}: found ${userOrders.length} orders`);
  console.log(`Total orders in store: ${orders.size}, Total users with orders (by email): ${ordersByUserEmail.size}`);
  console.log(`Available email keys in ordersByUserEmail:`, Array.from(ordersByUserEmail.keys()));
  // Sort by date (newest first)
  return userOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  const order = orders.get(id);
  if (!order) {
    return null;
  }

  const updated: Order = {
    ...order,
    status,
    updatedAt: new Date(),
  };

  orders.set(id, updated);

  // Update in user's orders list
  const userOrders = ordersByUserId.get(order.userId) || [];
  const index = userOrders.findIndex((o) => o.id === id);
  if (index !== -1) {
    userOrders[index] = updated;
    ordersByUserId.set(order.userId, userOrders);
  }

  return updated;
}

export async function updateOrderPaymentStatus(
  id: string,
  paymentStatus: 'pending' | 'paid' | 'failed'
): Promise<Order | null> {
  const order = orders.get(id);
  if (!order) {
    return null;
  }

  const updated: Order = {
    ...order,
    paymentStatus,
    status: paymentStatus === 'paid' ? 'confirmed' : order.status,
    updatedAt: new Date(),
  };

  orders.set(id, updated);

  // Update in user's orders list
  const userOrders = ordersByUserId.get(order.userId) || [];
  const index = userOrders.findIndex((o) => o.id === id);
  if (index !== -1) {
    userOrders[index] = updated;
    ordersByUserId.set(order.userId, userOrders);
  }

  return updated;
}

// Helper to get order without sensitive data
export function getOrderPublic(order: Order) {
  return {
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

