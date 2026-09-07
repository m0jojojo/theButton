import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidPaymentSignature } from '@/lib/razorpay-server';

/**
 * Confirms a checkout callback and marks the order paid.
 *
 * Nothing is trusted from the browser except the three Razorpay fields, and
 * those are only accepted once the signature verifies.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: signature,
      orderId,
    } = body as Record<string, string | undefined>;

    if (!razorpayOrderId || !razorpayPaymentId || !signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    const valid = isValidPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      signature,
    });

    if (!valid) {
      console.warn('[razorpay/verify] Rejected an invalid signature', {
        razorpayOrderId,
      });
      return NextResponse.json(
        { error: 'Payment could not be verified' },
        { status: 400 }
      );
    }

    // Prefer matching on the Razorpay order id recorded at create time; fall
    // back to our own order id for rows created after the payment started.
    const where = orderId ? { orderId } : { razorpayOrderId };

    const updated = await prisma.order
      .update({
        where,
        data: {
          paymentStatus: 'paid',
          status: 'confirmed',
          razorpayOrderId,
          razorpayPaymentId,
        },
      })
      .catch(() => null);

    return NextResponse.json({
      verified: true,
      orderUpdated: Boolean(updated),
      orderId: updated?.orderId ?? orderId ?? null,
    });
  } catch (error: any) {
    console.error('[razorpay/verify] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
