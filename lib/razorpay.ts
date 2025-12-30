// Razorpay integration utilities
// This will be fully implemented when Razorpay keys are provided

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (
  amount: number,
  orderData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }
): Promise<string> => {
  // This would typically call your backend API to create an order
  // For now, returning a mock order ID
  // In production, this should be: POST /api/razorpay/create-order
  return Promise.resolve(`order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
};

export const initiateRazorpayPayment = async (
  options: RazorpayOptions
): Promise<void> => {
  await loadRazorpayScript();

  if (!window.Razorpay) {
    throw new Error('Razorpay SDK not loaded');
  }

  const razorpay = new window.Razorpay(options);

  razorpay.on('payment.failed', (response: any) => {
    console.error('Payment failed:', response);
    throw new Error('Payment failed');
  });

  razorpay.open();
};

