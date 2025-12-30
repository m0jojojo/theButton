import { notFound } from 'next/navigation';
import ImageGallery from '@/components/ImageGallery';
import ProductInfo from '@/components/ProductInfo';
import StickyAddToCart from '@/components/StickyAddToCart';
import StickyWhatsApp from '@/components/StickyWhatsApp';
import ProductViewTracker from '@/components/ProductViewTracker';
import { products, getProductById } from '@/lib/products';

export async function generateStaticParams() {
  return Object.keys(products).map((id) => ({
    id,
  }));
}

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductViewTracker product={product} />
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="sticky top-20 self-start">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div>
            <ProductInfo product={product} />
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart (Mobile & Desktop) */}
      <StickyAddToCart product={product} />

      {/* Sticky WhatsApp Button */}
      <StickyWhatsApp product={product} />
    </>
  );
}

