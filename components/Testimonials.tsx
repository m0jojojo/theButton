'use client';

import { useCallback, useEffect, useState } from 'react';

interface Testimonial {
  quote: string;
  name: string;
  city: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'The craftsmanship is authentic and speaks volumes about our heritage. Their hand block print collection makes me feel connected to my roots. Highly recommended!',
    name: 'Anjali K.',
    city: 'Jaipur',
    rating: 5,
  },
  {
    quote:
      'Ordered a Chanderi silk saree for my sister’s wedding and it was even lovelier in person. The fall of the fabric is beautiful and the colours are exactly as shown.',
    name: 'Meera S.',
    city: 'Delhi',
    rating: 5,
  },
  {
    quote:
      'I have bought three cotton suit sets now. Comfortable enough for the office and elegant enough for a family function. The dupattas are the real highlight.',
    name: 'Priya R.',
    city: 'Rewari',
    rating: 5,
  },
  {
    quote:
      'What won me over was the packaging and the little handwritten note. It felt like a gift even though I bought it for myself.',
    name: 'Sneha T.',
    city: 'Nagpur',
    rating: 5,
  },
  {
    quote:
      'Delivery reached me in four days and the quality is far better than what I expected at this price. The mulmul is wonderfully soft.',
    name: 'Kavya M.',
    city: 'Kolkata',
    rating: 5,
  },
  {
    quote:
      'I had a question about sizing and they replied on WhatsApp within minutes. Genuinely helpful, not scripted. That kind of service is rare now.',
    name: 'Ritu B.',
    city: 'Lucknow',
    rating: 5,
  },
  {
    quote:
      'The natural dyes have held up beautifully through many washes. Nothing has faded, which says a lot about how these are made.',
    name: 'Divya N.',
    city: 'Pune',
    rating: 4,
  },
  {
    quote:
      'Bought a lehenga for Diwali and received compliments all evening. Will be returning for the festive collection next year.',
    name: 'Ishita P.',
    city: 'Ahmedabad',
    rating: 5,
  },
];

const AUTO_ADVANCE_MS = 6000;

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((delta: number) => {
    setCurrent((prev) => (prev + delta + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => go(1), AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [current, paused, go]);

  const active = testimonials[current];

  return (
    <section
      className="bg-[#f8f9fc] py-10 md:py-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="container mx-auto px-4">
        {/* Diamond rule */}
        <div className="mb-6 flex items-center justify-center gap-4" aria-hidden="true">
          <span className="h-px w-16 bg-[#c8a97e]/60 md:w-24" />
          <span className="text-lg text-[#b8925a]">&#9671;</span>
          <span className="h-px w-16 bg-[#c8a97e]/60 md:w-24" />
        </div>

        <h2 className="text-center text-3xl font-bold text-[#1e3a5f] md:text-4xl">
          Voices of Royalty
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-[#5b7291]">
          Hear from our cherished patrons about their experience with Rangrez.
        </p>

        <div className="relative mx-auto mt-8 max-w-2xl">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="absolute -left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-white hover:text-gray-700 hover:shadow md:-left-12"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="absolute -right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-white hover:text-gray-700 hover:shadow md:-right-12"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <figure className="relative overflow-hidden rounded-xl bg-white px-8 py-10 shadow-sm md:px-14">
            {/* Decorative quote marks */}
            <span
              className="pointer-events-none absolute left-4 top-4 select-none text-6xl leading-none text-[#e8dcc8]"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <span
              className="pointer-events-none absolute bottom-2 right-4 select-none text-6xl leading-none text-[#e8dcc8]"
              aria-hidden="true"
            >
              &rdquo;
            </span>

            <div
              className="flex justify-center gap-1"
              role="img"
              aria-label={`Rated ${active.rating} out of 5`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < active.rating ? 'text-[#c9a227]' : 'text-gray-200'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.35 4.16a1 1 0 00.95.69h4.37c.97 0 1.37 1.24.59 1.81l-3.54 2.57a1 1 0 00-.36 1.12l1.36 4.16c.3.92-.76 1.69-1.54 1.12l-3.54-2.57a1 1 0 00-1.18 0l-3.54 2.57c-.78.57-1.84-.2-1.54-1.12l1.36-4.16a1 1 0 00-.36-1.12L1.79 9.59c-.78-.57-.38-1.81.59-1.81h4.37a1 1 0 00.95-.69z" />
                </svg>
              ))}
            </div>

            <blockquote className="relative mt-6 text-center text-lg italic leading-relaxed text-[#1e3a5f]">
              &ldquo;{active.quote}&rdquo;
            </blockquote>

            <figcaption className="mt-8 text-center">
              <div className="font-medium text-[#7b1f2b]">{active.name}</div>
              <div className="mt-1 text-sm text-[#5b7291]">{active.city}</div>
            </figcaption>
          </figure>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Show testimonial ${index + 1}`}
                aria-current={index === current}
                className={`h-2 rounded-full transition-all ${
                  index === current ? 'w-8 bg-[#b8925a]' : 'w-2 bg-[#d9d9e3] hover:bg-[#c8a97e]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
