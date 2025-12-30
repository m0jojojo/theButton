import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/jwt';
import { requireAdmin } from '@/lib/admin';
import { getProductById, saveProduct, deleteProduct, Product } from '@/lib/products';

// Get reference to the global store
declare global {
  var __products_store: Record<string, Product> | undefined;
}

// Use the global store directly
const products = global.__products_store || productsStore;

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

    // Clean up images - filter out placeholder paths
    const cleanImages = (images: string[]): string[] => {
      return images.filter((img: string) => 
        img && (
          img.startsWith('data:') || 
          img.startsWith('http://') || 
          img.startsWith('https://')
        ) && !img.includes('placeholder-product.jpg')
      );
    };

    // Update product - ensure images are preserved and cleaned
    const bodyImages = body.images && Array.isArray(body.images) && body.images.length > 0 
      ? cleanImages(body.images)
      : cleanImages(product.images || []);
    
    const updatedProduct: Product = {
      ...product,
      ...body,
      id: params.id, // Ensure ID doesn't change
      price: body.price !== undefined ? Number(body.price) : product.price,
      compareAtPrice: body.compareAtPrice !== undefined ? Number(body.compareAtPrice) : product.compareAtPrice,
      inStock: body.sizes?.some((s: any) => s.available && s.stock > 0) ?? product.inStock,
      // Ensure images array is cleaned of placeholder paths
      images: bodyImages.length > 0 ? bodyImages : product.images || [],
    };

    // Use saveProduct to ensure proper storage
    saveProduct(updatedProduct);

    // Debug log
    console.log('[PATCH /api/admin/products/[id]] Updated product:', {
      id: updatedProduct.id,
      name: updatedProduct.name,
      imageCount: updatedProduct.images?.length || 0,
      firstImagePreview: updatedProduct.images?.[0]?.substring(0, 50) || 'none',
    });

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

    // Delete from both the global store and local reference
    if (global.__products_store) {
      delete global.__products_store[params.id];
    }
    delete products[params.id];

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: error.message?.includes('Forbidden') ? 403 : 401 }
    );
  }
}

