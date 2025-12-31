import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductsByCollectionFromDB } from '@/lib/products-db';

const collectionInfo: Record<string, { name: string; description: string }> = {
  'new-arrivals': {
    name: 'New Arrivals',
    description: 'Latest additions to our collection',
  },
  'shirts': {
    name: 'Shirts',
    description: 'Premium quality shirts for every occasion',
  },
  't-shirts': {
    name: 'T-Shirts',
    description: 'Comfortable and stylish t-shirts',
  },
  'pants': {
    name: 'Pants',
    description: 'Perfect fit pants for all occasions',
  },
  'accessories': {
    name: 'Accessories',
    description: 'Complete your look with our accessories',
  },
};

export async function generateStaticParams() {
  return Object.keys(collectionInfo).map((slug) => ({
    slug,
  }));
}

export default async function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const collectionData = collectionInfo[params.slug];

  if (!collectionData) {
    notFound();
  }

  // Phase 4: Get products from database by collection
  const products = await getProductsByCollectionFromDB(collectionData.name);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Collection Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {collectionData.name}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          {collectionData.description}
        </p>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            // Get first image from product.images array
            const productImage = product.images && product.images.length > 0 ? product.images[0] : null;
            
            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
                aria-label={`View ${product.name} - ${formatPrice(product.price)}`}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3">
                  {productImage ? (
                    productImage.startsWith('data:') ? (
                      // Base64 data URL - use regular img tag
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : productImage.startsWith('http') ? (
                      // HTTP/HTTPS URL - use Next.js Image
                      <Image
                        src={productImage}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        quality={80}
                      />
                    ) : (
                      // Placeholder for invalid images
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:from-gray-300 group-hover:to-gray-400 transition-colors flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Product Image</span>
                      </div>
                    )
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:from-gray-300 group-hover:to-gray-400 transition-colors flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Product Image</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2 group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-base md:text-lg font-bold">
                  {formatPrice(product.price)}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found in this collection.</p>
        </div>
      )}
    </div>
  );
}

