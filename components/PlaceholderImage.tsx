'use client';

import Image from 'next/image';

interface PlaceholderImageProps {
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

// SVG placeholder as data URL
const placeholderSvg = `data:image/svg+xml;base64,${Buffer.from(
  '<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="800" fill="#f3f4f6"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="#9ca3af" text-anchor="middle" dy=".3em">Product Image</text></svg>'
).toString('base64')}`;

export default function PlaceholderImage({
  alt,
  className = '',
  fill = false,
  width,
  height,
  sizes,
  priority = false,
}: PlaceholderImageProps) {
  if (fill) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Product Image</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <span className="text-gray-500 text-sm">Product Image</span>
    </div>
  );
}

