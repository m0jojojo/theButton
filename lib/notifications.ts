/**
 * Order notifications.
 *
 * One entry point, called from the two places an order becomes real: COD
 * checkout, and online payment once the signature verifies. Keeping it in one
 * function means adding a channel later - WhatsApp, SMS - touches this file
 * only.
 */

import { prisma } from '@/lib/prisma';
import { sendOrderEmails, type OrderEmailData } from '@/lib/email';

/**
 * Notifies the customer and the shop about an order, once.
 *
 * `notifiedAt` guards against duplicates: the checkout callback and the
 * Razorpay webhook can both settle the same order, and a customer should not
 * receive two confirmations.
 */
export async function notifyOrderPlaced(orderRowId: string): Promise<void> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderRowId },
      include: { items: true },
    });

    if (!order) {
      console.warn('[notify] Order not found:', orderRowId);
      return;
    }
    if (order.notifiedAt) {
      return;
    }

    const data: OrderEmailData = {
      orderId: order.orderId,
      items: order.items.map((item) => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: Number(item.price),
      })),
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      total: Number(order.total),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      shippingAddress: (order.shippingAddress ?? {}) as OrderEmailData['shippingAddress'],
    };

    const sent = await sendOrderEmails(data);

    // Only mark it done if something actually went out, so a transient outage
    // does not permanently suppress the confirmation.
    if (sent) {
      await prisma.order.update({
        where: { id: order.id },
        data: { notifiedAt: new Date() },
      });
    }
  } catch (error) {
    // Never let a notification failure break an order.
    console.error('[notify] Failed to notify for order', orderRowId, error);
  }
}
