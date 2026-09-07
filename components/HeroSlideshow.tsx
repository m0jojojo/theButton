'use client';

import { useEffect, useState } from 'react';

interface HeroSlideshowProps {
  slides: string[];
}

const SLIDE_DURATION = 3000;

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);

  // Auto-advance every 3 seconds. The timer is keyed on `current`, so a manual
  // jump via the dots restarts the countdown from that slide.
  useEffect(() => {
    if (slides.length < 2) return;

    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearTimeout(timer);
  }, [current, slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative w-full aspect-square bg-gradient-to-br from-gray-900 to-gray-800" />
    );
  }

  return (
    <section
      className="relative w-full aspect-square overflow-hidden bg-gray-900"
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {/* All slides stay mounted and stacked; only the current one is opaque. */}
      {slides.map((slide, index) => (
        <div
          key={index}
          aria-hidden={index !== current}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Slides are base64 data URLs or remote URLs, so a plain img keeps
              both cases working without next/image remote-host config. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide}
            alt={`Slide ${index + 1} of ${slides.length}`}
            width={1200}
            height={1200}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === current}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? 'w-6 bg-white'
                  : 'w-2 bg-white/60 hover:bg-white/90'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
