import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/jwt';
import { requireAdmin } from '@/lib/admin';
import { getAllProducts, getProductById, Product } from '@/lib/products';

// Import products from lib/products which uses global store
import { products as productsStore } from '@/lib/products';

// Get reference to the global store
declare global {
  var __products_store: Record<string, Product> | undefined;
}

// Use the global store directly
const products = global.__products_store || productsStore;

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const allProducts = getAllProducts();
    return NextResponse.json({ products: allProducts });
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: error.message?.includes('Forbidden') ? 403 : 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const body = await request.json();
    const { name, price, compareAtPrice, description, images, sizes, sku, collection, searchKeywords } = body;

    // Validation
    if (!name || !price || !description || !sku || !collection) {
      return NextResponse.json(
        { error: 'Name, price, description, SKU, and collection are required' },
        { status: 400 }
      );
    }

    // Generate ID
    const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create product
    const product: Product = {
      id,
      name,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      description,
      images: images || [],
      sizes: sizes || [],
      inStock: sizes?.some((s: any) => s.available) || false,
      sku,
      collection,
      searchKeywords: searchKeywords || [],
    };

    // Store product in global store
    if (!global.__products_store) {
      global.__products_store = products;
    }
    global.__products_store[id] = product;
    products[id] = product;

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: error.message?.includes('Forbidden') ? 403 : 401 }
    );
  }
}

