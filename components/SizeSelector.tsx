'use client';

interface SizeSelectorProps {
  sizes: Array<{ value: string; available: boolean; stock: number }>;
  selectedSize: string | null;
  onSizeSelect: (size: string) => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSizeSelect,
}: SizeSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2 md:gap-3">
      {sizes.map((size) => (
        <button
          key={size.value}
          onClick={() => size.available && onSizeSelect(size.value)}
          disabled={!size.available}
          className={`
            relative py-3 px-2 md:px-4 rounded-lg border-2 font-semibold text-sm md:text-base
            transition-all
            ${
              !size.available
                ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed line-through'
                : selectedSize === size.value
                ? 'border-gray-900 bg-gray-900 text-white scale-105'
                : 'border-gray-300 text-gray-700 bg-white hover:border-gray-600 hover:scale-105'
            }
          `}
          aria-label={`Size ${size.value}${!size.available ? ' - Out of stock' : ''}`}
        >
          {size.value}
          {size.available && size.stock <= 3 && size.stock > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}

