import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Premium Menswear
              <span className="block text-2xl md:text-3xl lg:text-4xl font-normal mt-2 text-gray-300">
                From The Button, Rewari
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover quality fashion that defines your style. Curated collections for the modern man.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/collections/new-arrivals"
                className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Shop New Arrivals
              </Link>
              <Link
                href="/collections/shirts"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Shirts', href: '/collections/shirts', image: '/placeholder-shirt.jpg' },
              { name: 'T-Shirts', href: '/collections/t-shirts', image: '/placeholder-tshirt.jpg' },
              { name: 'Pants', href: '/collections/pants', image: '/placeholder-pants.jpg' },
              { name: 'Accessories', href: '/collections/accessories', image: '/placeholder-accessories.jpg' },
            ].map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-60 group-hover:opacity-70 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl md:text-2xl font-bold text-white z-10">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
            Why Choose The Button?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: 'Premium Quality',
                description: 'Carefully curated fabrics and craftsmanship that lasts.',
                icon: '✨',
              },
              {
                title: 'Fast Delivery',
                description: 'Quick shipping across India with easy returns.',
                icon: '🚚',
              },
              {
                title: 'WhatsApp Support',
                description: 'Chat with us anytime for style advice and support.',
                icon: '💬',
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our latest collection and find your perfect fit.
          </p>
          <Link
            href="/collections/new-arrivals"
            className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </>
  );
}
