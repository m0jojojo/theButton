import { NextRequest, NextResponse } from 'next/server';
import { getAllProductsFromDB } from '@/lib/products-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeIds = searchParams.get('exclude')?.split(',') || [];
    const limit = parseInt(searchParams.get('limit') || '4', 10);

    // Get all products from database
    const allProducts = await getAllProductsFromDB();

    // Filter out excluded products (e.g., items already in cart)
    const availableProducts = allProducts.filter(
      (product) => !excludeIds.includes(product.id) && product.inStock
    );

    // Shuffle and get random products
    const shuffled = [...availableProducts].sort(() => Math.random() - 0.5);
    const randomProducts = shuffled.slice(0, Math.min(limit, shuffled.length));

    // Return only necessary fields for upsell display
    const products = randomProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.images && product.images.length > 0 ? product.images[0] : null,
    }));

    return NextResponse.json({ products });
  } catch (error) {
    console.error('[Random Products API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random products', products: [] },
      { status: 500 }
    );
  }
}

