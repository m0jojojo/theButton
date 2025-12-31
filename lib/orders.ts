// Order store - Uses database when DATABASE_URL is set, otherwise uses in-memory store
// This provides backward compatibility while migrating to database

// Check if database is available
const USE_DATABASE = !!process.env.DATABASE_URL;

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
// Use global to persist across hot reloads in Next.js
declare global {
  var __orders_store: Map<string, Order> | undefined;
  var __orders_by_user_id: Map<string, Order[]> | undefined;
  var __orders_by_user_email: Map<string, Order[]> | undefined;
}

// Initialize or reuse existing stores (persists across hot reloads)
const orders: Map<string, Order> = global.__orders_store || new Map();
const ordersByUserId: Map<string, Order[]> = global.__orders_by_user_id || new Map();
const ordersByUserEmail: Map<string, Order[]> = global.__orders_by_user_email || new Map();

// Store references globally to persist across hot reloads
if (!global.__orders_store) {
  global.__orders_store = orders;
  global.__orders_by_user_id = ordersByUserId;
  global.__orders_by_user_email = ordersByUserEmail;
  console.log('[orders.ts] Initialized new order stores');
} else {
  console.log(`[orders.ts] Reusing existing stores - Total orders: ${orders.size}, Total emails: ${ordersByUserEmail.size}`);
}

// Export function to get all orders (for admin)
export async function getAllOrders(): Promise<Order[]> {
  if (USE_DATABASE) {
    const { getAllOrdersFromDB } = await import('./orders-db');
    return getAllOrdersFromDB();
  }
  return Array.from(orders.values());
}

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

  console.log(`[createOrder] Order stored: ${order.orderId}`);
  console.log(`[createOrder] User ID: ${data.userId}, User Email: ${order.userEmail}`);
  console.log(`[createOrder] Total orders for this email: ${userOrdersByEmail.length}`);
  console.log(`[createOrder] Total orders in store: ${orders.size}`);
  console.log(`[createOrder] Total unique emails with orders: ${ordersByUserEmail.size}`);
  console.log(`[createOrder] All email keys:`, Array.from(ordersByUserEmail.keys()));

  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (USE_DATABASE) {
    const { getOrderByIdFromDB } = await import('./orders-db');
    return getOrderByIdFromDB(id);
  }
  return orders.get(id) || null;
}

export async function getOrderByOrderId(orderId: string): Promise<Order | null> {
  if (USE_DATABASE) {
    const { getOrderByOrderIdFromDB } = await import('./orders-db');
    return getOrderByOrderIdFromDB(orderId);
  }
  for (const order of orders.values()) {
    if (order.orderId === orderId) {
      return order;
    }
  }
  return null;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  if (USE_DATABASE) {
    const { getOrdersByUserIdFromDB } = await import('./orders-db');
    return getOrdersByUserIdFromDB(userId);
  }
  const userOrders = ordersByUserId.get(userId) || [];
  console.log(`Getting orders for user ID ${userId}: found ${userOrders.length} orders`);
  console.log(`Total orders in store: ${orders.size}, Total users with orders: ${ordersByUserId.size}`);
  // Sort by date (newest first)
  return userOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getOrdersByUserEmail(userEmail: string): Promise<Order[]> {
  if (USE_DATABASE) {
    const { getOrdersByUserEmailFromDB } = await import('./orders-db');
    return getOrdersByUserEmailFromDB(userEmail);
  }
  const normalizedEmail = userEmail.toLowerCase();
  console.log(`[getOrdersByUserEmail] Looking up orders for email: ${normalizedEmail}`);
  console.log(`[getOrdersByUserEmail] Total orders in store: ${orders.size}`);
  console.log(`[getOrdersByUserEmail] Total unique emails with orders: ${ordersByUserEmail.size}`);
  console.log(`[getOrdersByUserEmail] Available email keys:`, Array.from(ordersByUserEmail.keys()));
  const userOrders = ordersByUserEmail.get(normalizedEmail) || [];
  console.log(`[getOrdersByUserEmail] Found ${userOrders.length} orders for email: ${normalizedEmail}`);
  // Sort by date (newest first)
  return userOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  if (USE_DATABASE) {
    const { updateOrderStatusInDB } = await import('./orders-db');
    return updateOrderStatusInDB(id, status);
  }

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

