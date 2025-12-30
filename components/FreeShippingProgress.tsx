'use client';

interface FreeShippingProgressProps {
  currentTotal: number;
}

const FREE_SHIPPING_THRESHOLD = 2000;

export default function FreeShippingProgress({ currentTotal }: FreeShippingProgressProps) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - currentTotal);
  const progress = Math.min(100, (currentTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const isFreeShipping = currentTotal >= FREE_SHIPPING_THRESHOLD;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isFreeShipping) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">You qualify for free shipping!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-orange-900">
          Add {formatPrice(remaining)} more for free shipping!
        </span>
        <span className="text-xs text-orange-700">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full bg-orange-200 rounded-full h-2">
        <div
          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

