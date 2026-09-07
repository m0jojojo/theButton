import Link from 'next/link';
import Image from 'next/image';
import { getHomepageSettingsFromDB } from '@/lib/homepage-settings-db';
import HeroSlideshow from '@/components/HeroSlideshow';
import CategoryCarousel from '@/components/CategoryCarousel';
import { shopCategories } from '@/lib/categories';
import ProductCarousel from '@/components/ProductCarousel';
import { getAllProductsFromDB } from '@/lib/products-db';

export default async function Home() {
  const settings = await getHomepageSettingsFromDB();
  const allProducts = await getAllProductsFromDB();

  // Every saree category, so the block fills from any of them. Falls back to
  // the newest products while the catalogue is still being set up.
  const sareeProducts = allProducts.filter((product) =>
    product.collection?.toLowerCase().includes('saree')
  );
  const featuredSarees = (sareeProducts.length > 0 ? sareeProducts : allProducts).slice(0, 12);
  
  // Fall back to the legacy single banner so an existing upload still shows.
  const heroSlides =
    settings?.heroSlides && settings.heroSlides.length > 0
      ? settings.heroSlides
      : settings?.heroBannerImage
      ? [settings.heroBannerImage]
      : [];
  const collectionImages = settings?.collectionImages || {};

  return (
    <>
      {/* Hero Slideshow */}
      <HeroSlideshow slides={heroSlides} />

      {/* Featured Collections */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-black mb-8 md:mb-12">
            Shop by Category
          </h2>
          <CategoryCarousel categories={shopCategories} images={collectionImages} />
        </div>
      </section>

      {/* Saree Collection */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-black mb-8 md:mb-12">
            Saree Collection
          </h2>
          <ProductCarousel products={featuredSarees} viewAllHref="/search?q=saree" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-black mb-8 md:mb-12">
            Why Choose Rangrez?
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
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
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
