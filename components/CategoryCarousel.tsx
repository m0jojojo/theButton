'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ShopCategory } from '@/lib/categories';

interface CategoryCarouselProps {
  categories: ShopCategory[];
  images: Record<string, string | undefined>;
}

export default function CategoryCarousel({ categories, images }: CategoryCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Width of one card plus its gap, read off the DOM so the step always
  // matches whatever the responsive layout is currently rendering.
  const getStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const first = track.firstElementChild as HTMLElement | null;
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    return first.offsetWidth + gap;
  }, []);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft >= maxScroll - 1);
  }, []);

  const scrollByCards = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      track.scrollBy({ left: direction * getStep(), behavior: 'smooth' });
    },
    [getStep]
  );

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [updateArrows]);

  if (categories.length === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByCards(-1)}
        aria-label="Previous categories"
        className={`absolute left-0 top-[38%] md:top-[42%] z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-gray-600 shadow-md ring-1 ring-black/5 backdrop-blur-sm transition hover:bg-white ${
          atStart ? 'opacity-40' : ''
        }`}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => scrollByCards(1)}
        aria-label="Next categories"
        className={`absolute right-0 top-[38%] md:top-[42%] z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-gray-600 shadow-md ring-1 ring-black/5 backdrop-blur-sm transition hover:bg-white ${
          atEnd ? 'opacity-40' : ''
        }`}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth md:gap-8"
      >
        {categories.map((category) => {
          const image = images[category.slug];
          return (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className="group w-[28%] flex-shrink-0 snap-start text-center md:w-[calc((100%-4rem)/3)]"
            >
              <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200 transition group-hover:ring-gray-400">
                {image ? (
                  // Images are base64 data URLs or remote URLs, so a plain img
                  // keeps both working without next/image host config.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={category.name}
                    width={300}
                    height={300}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 px-3 text-center text-xs font-medium text-gray-500">
                    {category.name}
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-xs uppercase leading-tight tracking-wide text-[#7b1f2b] sm:text-sm">
                {category.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
