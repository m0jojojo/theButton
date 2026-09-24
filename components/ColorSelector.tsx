'use client';

interface ColorSelectorProps {
  colors: Array<{ value: string; available: boolean; stock: number }>;
  selectedColor: string | null;
  onColorSelect: (color: string) => void;
}

export default function ColorSelector({
  colors,
  selectedColor,
  onColorSelect,
}: ColorSelectorProps) {
  return (
    // Wrapping rather than a fixed five-column grid: a product with one color
    // could get a fifth of the row, leaving a target too small to tap
    // comfortably. Buttons now size to their label with a minimum width.
    <div className="flex flex-wrap gap-2 md:gap-3">
      {colors.map((color) => {
        const isSelected = selectedColor === color.value;

        return (
          <button
            key={color.value}
            type="button"
            onClick={() => color.available && onColorSelect(color.value)}
            disabled={!color.available}
            aria-pressed={isSelected}
            className={`
              relative min-w-[4.5rem] flex-none whitespace-nowrap rounded-lg border-2
              px-4 py-3 text-sm font-semibold transition-all md:text-base
              ${
                !color.available
                  ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 line-through'
                  : isSelected
                  ? 'border-gray-900 bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-2'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-600'
              }
            `}
            aria-label={`Color ${color.value}${!color.available ? ' - Out of stock' : ''}`}
          >
            {color.value}
            {color.available && color.stock <= 3 && color.stock > 0 && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-orange-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
