'use client';

interface QuantityControlsProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

export default function QuantityControls({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 10,
}: QuantityControlsProps) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg">
      <button
        onClick={onDecrement}
        disabled={quantity <= min}
        className={`
          px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors
          ${quantity <= min ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label="Decrease quantity"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <span className="px-4 py-2 font-semibold min-w-[3rem] text-center text-gray-900">
        {quantity}
      </span>

      <button
        onClick={onIncrement}
        disabled={quantity >= max}
        className={`
          px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors
          ${quantity >= max ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label="Increase quantity"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

