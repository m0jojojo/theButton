'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import ProgressBar from '@/components/ProgressBar';
import CheckoutForm from '@/components/CheckoutForm';
import OrderSummary from '@/components/OrderSummary';
import { trackInitiateCheckout } from '@/lib/analytics';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const subtotal = getTotal();
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  useEffect(() => {
    setMounted(true);
    // Don't redirect if we're completing an order
    if (items.length === 0 && !isOrderComplete && mounted) {
      router.push('/cart');
    }
  }, [items.length, router, isOrderComplete, mounted]);

  // Track Initiate Checkout when page loads
  useEffect(() => {
    if (mounted && items.length > 0) {
      trackInitiateCheckout({
        value: total,
        currency: 'INR',
        num_items: items.reduce((sum, item) => sum + item.quantity, 0),
        items: items.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.name.split(' ')[0],
        })),
      });
    }
  }, [mounted, items, total]);

  if (!mounted || (items.length === 0 && !isOrderComplete)) {
    return null;
  }

  const handleOrderSuccess = (orderId: string, phone: string) => {
    setIsOrderComplete(true);
    // Redirect to OTP verification page
    router.replace(`/verify-otp?orderId=${orderId}&phone=${phone}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <ProgressBar currentStep="address" />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm
              total={total}
              onOrderSuccess={handleOrderSuccess}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

