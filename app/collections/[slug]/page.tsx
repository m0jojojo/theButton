import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock data - will be replaced with Shopify API in Phase 3+
const collections: Record<string, { name: string; description: string; products: any[] }> = {
  'new-arrivals': {
    name: 'New Arrivals',
    description: 'Latest additions to our collection',
    products: [
      { id: '1', name: 'Classic White Shirt', price: 1999, image: '/placeholder-product.jpg' },
      { id: '2', name: 'Navy Blue T-Shirt', price: 899, image: '/placeholder-product.jpg' },
      { id: '3', name: 'Slim Fit Chinos', price: 2499, image: '/placeholder-product.jpg' },
      { id: '4', name: 'Denim Jacket', price: 3499, image: '/placeholder-product.jpg' },
      { id: '5', name: 'Cotton Polo', price: 1299, image: '/placeholder-product.jpg' },
      { id: '6', name: 'Cargo Pants', price: 2199, image: '/placeholder-product.jpg' },
    ],
  },
  'shirts': {
    name: 'Shirts',
    description: 'Premium quality shirts for every occasion',
    products: [
      { id: '7', name: 'Formal White Shirt', price: 1999, image: '/placeholder-product.jpg' },
      { id: '8', name: 'Casual Check Shirt', price: 1799, image: '/placeholder-product.jpg' },
      { id: '9', name: 'Linen Shirt', price: 2299, image: '/placeholder-product.jpg' },
      { id: '10', name: 'Oxford Shirt', price: 1899, image: '/placeholder-product.jpg' },
    ],
  },
  't-shirts': {
    name: 'T-Shirts',
    description: 'Comfortable and stylish t-shirts',
    products: [
      { id: '11', name: 'Basic White T-Shirt', price: 599, image: '/placeholder-product.jpg' },
      { id: '12', name: 'Graphic Print T-Shirt', price: 899, image: '/placeholder-product.jpg' },
      { id: '13', name: 'V-Neck T-Shirt', price: 699, image: '/placeholder-product.jpg' },
      { id: '14', name: 'Polo T-Shirt', price: 1299, image: '/placeholder-product.jpg' },
    ],
  },
  'pants': {
    name: 'Pants',
    description: 'Perfect fit pants for all occasions',
    products: [
      { id: '15', name: 'Slim Fit Chinos', price: 2499, image: '/placeholder-product.jpg' },
      { id: '16', name: 'Cargo Pants', price: 2199, image: '/placeholder-product.jpg' },
      { id: '17', name: 'Formal Trousers', price: 2799, image: '/placeholder-product.jpg' },
      { id: '18', name: 'Joggers', price: 1899, image: '/placeholder-product.jpg' },
    ],
  },
  'accessories': {
    name: 'Accessories',
    description: 'Complete your look with our accessories',
    products: [
      { id: '19', name: 'Leather Belt', price: 1299, image: '/placeholder-product.jpg' },
      { id: '20', name: 'Wallet', price: 999, image: '/placeholder-product.jpg' },
      { id: '21', name: 'Sunglasses', price: 1999, image: '/placeholder-product.jpg' },
      { id: '22', name: 'Watch', price: 4999, image: '/placeholder-product.jpg' },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(collections).map((slug) => ({
    slug,
  }));
}

export default function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const collection = collections[params.slug];

  if (!collection) {
    notFound();
  }

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
          {collection.name}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          {collection.description}
        </p>
      </div>

      {/* Products Grid */}
      {collection.products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {collection.products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:from-gray-300 group-hover:to-gray-400 transition-colors" />
                {/* Placeholder for product image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Product Image</span>
                </div>
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2 group-hover:text-gray-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-base md:text-lg font-bold">
                {formatPrice(product.price)}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found in this collection.</p>
        </div>
      )}
    </div>
  );
}

