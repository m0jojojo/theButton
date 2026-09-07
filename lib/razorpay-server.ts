/**
 * Server-side Razorpay client and signature helpers.
 *
 * The key secret must never reach the browser, so everything in this module
 * is server-only. `NEXT_PUBLIC_RAZORPAY_KEY_ID` is the public half and is safe
 * to ship to the client.
 */

import crypto from 'crypto';
import Razorpay from 'razorpay';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export function isRazorpayConfigured(): boolean {
  return Boolean(keyId && keySecret);
}

export function getRazorpay(): Razorpay {
  if (!keyId || !keySecret) {
    throw new Error(
      'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
    );
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

/**
 * Confirms the checkout callback really came from Razorpay.
 *
 * Razorpay signs `<order_id>|<payment_id>` with the key secret; anyone can POST
 * a payment id, so an order is only marked paid once this matches.
 */
export function isValidPaymentSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
}): boolean {
  if (!keySecret) return false;

  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest('hex');

  const received = Buffer.from(params.signature, 'utf8');
  const computed = Buffer.from(expected, 'utf8');

  // Constant-time compare, so a wrong signature cannot be found by timing.
  return (
    received.length === computed.length && crypto.timingSafeEqual(received, computed)
  );
}

/** Verifies a webhook body against the webhook secret. */
export function isValidWebhookSignature(rawBody: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !signature) return false;

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  const received = Buffer.from(signature, 'utf8');
  const computed = Buffer.from(expected, 'utf8');

  return (
    received.length === computed.length && crypto.timingSafeEqual(received, computed)
  );
}
