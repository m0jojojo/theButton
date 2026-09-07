/**
 * Order pricing, computed on the server.
 *
 * Prices must never be taken from the browser: a tampered request could
 * otherwise pay a rupee for a saree. Everything here re-reads the product
 * price from the database and applies the same shipping rule the cart shows.
 */

import { prisma } from '@/lib/prisma';

export const FREE_SHIPPING_THRESHOLD = 2000;
export const SHIPPING_FEE = 99;

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface PricedOrder {
  subtotal: number;
  shipping: number;
  total: number;
  /** Total in paise, the unit Razorpay works in. */
  amountInPaise: number;
}

export async function priceCart(lines: CartLine[]): Promise<PricedOrder> {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new Error('Cart is empty');
  }

  const products = await prisma.product.findMany({
    where: { id: { in: lines.map((line) => line.productId) } },
    select: { id: true, price: true },
  });

  const priceById = new Map(products.map((p) => [p.id, Number(p.price)]));

  let subtotal = 0;
  for (const line of lines) {
    const price = priceById.get(line.productId);
    if (price === undefined) {
      throw new Error(`Unknown product: ${line.productId}`);
    }
    const quantity = Math.floor(Number(line.quantity));
    if (!Number.isFinite(quantity) || quantity < 1) {
      throw new Error(`Invalid quantity for product ${line.productId}`);
    }
    subtotal += price * quantity;
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return {
    subtotal,
    shipping,
    total,
    amountInPaise: Math.round(total * 100),
  };
}
