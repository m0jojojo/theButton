/**
 * Homepage trust band: four reassurance points above the footer.
 *
 * Icons are inline line-art SVGs so they stay crisp, theme with the palette
 * and cost no extra requests. To use artwork files instead, drop them in
 * `public/trust/` and give the matching item an `image` path below.
 */

interface Highlight {
  title: string;
  caption: string;
  image?: string;
  icon: JSX.Element;
}

const highlights: Highlight[] = [
  {
    title: 'Free Shipping*',
    caption: 'On All Orders',
    icon: (
      <>
        <path d="M3 7.5h9.5v8H3z" />
        <path d="M12.5 10.5H16l3 3v2h-6.5z" />
        <circle cx="7" cy="17" r="1.6" />
        <circle cx="16" cy="17" r="1.6" />
        <path d="M3 15.5h1.4M8.6 15.5h5.8" />
      </>
    ),
  },
  {
    title: 'Secured Payments',
    caption: '100% Secure Checkout',
    icon: (
      <>
        <path d="M12 3.5l6.5 2.5v5c0 4-2.8 7.3-6.5 8.5-3.7-1.2-6.5-4.5-6.5-8.5V6z" />
        <path d="M9.2 11.8l2 2 3.6-3.8" />
      </>
    ),
  },
  {
    title: 'Cash on Delivery*',
    caption: 'Available Across India',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.5 8h5M9.5 10.5h5M13.2 8c1.4 0 2 1 2 2s-.6 2-2 2H9.5l4 4" />
      </>
    ),
  },
  {
    title: 'Easy Customer Support',
    caption: 'Call or WhatsApp Us',
    icon: (
      <>
        <path d="M5 13v-1a7 7 0 0114 0v1" />
        <path d="M5 13h1.8a1 1 0 011 1v2.6a1 1 0 01-1 1H6a1 1 0 01-1-1z" />
        <path d="M19 13h-1.8a1 1 0 00-1 1v2.6a1 1 0 001 1H18a1 1 0 001-1z" />
        <path d="M17.5 17.6v.6a2 2 0 01-2 2h-2" />
      </>
    ),
  },
];

export default function TrustHighlights() {
  return (
    <section className="bg-[#fdfaef] py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {highlights.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#c8a97e]">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  <svg
                    className="h-9 w-9 text-[#b8925a]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </svg>
                )}
              </div>
              <h3 className="mt-5 text-base font-medium text-[#1e3a5f] md:text-lg">
                {item.title}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-wide text-[#5b7291]">
                {item.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
