import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/jwt';
import { requireAdmin } from '@/lib/admin';
import { getProductById, Product } from '@/lib/products';

// In-memory product store (for admin operations)
declare global {
  var __products_store: Record<string, Product> | undefined;
}

let products: Record<string, Product>;

// Initialize products store
if (typeof global.__products_store !== 'undefined') {
  products = global.__products_store;
} else {
  const productsModule = require('@/lib/products');
  products = productsModule.products;
  global.__products_store = products;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const product = getProductById(params.id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get product' },
      { status: error.message?.includes('Forbidden') ? 403 : 401 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const body = await request.json();
    const product = getProductById(params.id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product
    const updatedProduct: Product = {
      ...product,
      ...body,
      id: params.id, // Ensure ID doesn't change
      price: body.price !== undefined ? Number(body.price) : product.price,
      compareAtPrice: body.compareAtPrice !== undefined ? Number(body.compareAtPrice) : product.compareAtPrice,
      inStock: body.sizes?.some((s: any) => s.available) ?? product.inStock,
    };

    products[params.id] = updatedProduct;
    global.__products_store = products;

    return NextResponse.json({ product: updatedProduct });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: error.message?.includes('Forbidden') ? 403 : 401 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const product = getProductById(params.id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    delete products[params.id];
    global.__products_store = products;

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: error.message?.includes('Forbidden') ? 403 : 401 }
    );
  }
}

