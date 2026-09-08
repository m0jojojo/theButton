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
    // Wrapping rather than a fixed five-column grid: a product with one size
    // ("Free Size") used to get a fifth of the row, leaving a target too small
    // to tap comfortably. Buttons now size to their label with a minimum width.
    <div className="flex flex-wrap gap-2 md:gap-3">
      {sizes.map((size) => {
        const isSelected = selectedSize === size.value;

        return (
          <button
            key={size.value}
            type="button"
            onClick={() => size.available && onSizeSelect(size.value)}
            disabled={!size.available}
            aria-pressed={isSelected}
            className={`
              relative min-w-[4.5rem] flex-none whitespace-nowrap rounded-lg border-2
              px-4 py-3 text-sm font-semibold transition-all md:text-base
              ${
                !size.available
                  ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 line-through'
                  : isSelected
                  ? 'border-gray-900 bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-2'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-600'
              }
            `}
            aria-label={`Size ${size.value}${!size.available ? ' - Out of stock' : ''}`}
          >
            {size.value}
            {size.available && size.stock <= 3 && size.stock > 0 && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-orange-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
