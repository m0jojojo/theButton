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
  userId: string;
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

export async function createOrder(data: {
  orderId: string;
  userId: string;
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

  // Store by user ID
  const userOrders = ordersByUserId.get(data.userId) || [];
  userOrders.push(order);
  ordersByUserId.set(data.userId, userOrders);

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

