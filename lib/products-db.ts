/**
 * Database Product Functions
 * 
 * This module provides database-backed product functions.
 * Replaces in-memory product store with PostgreSQL queries.
 * 
 * Phase 4: Read Integration (Safe)
 */

import { prisma } from '@/lib/prisma';
import { Product } from '@/lib/products';

/**
 * Convert Prisma Product to Product interface
 */
function prismaToProduct(prismaProduct: any): Product {
  return {
    id: prismaProduct.id,
    name: prismaProduct.name,
    price: Number(prismaProduct.price),
    compareAtPrice: prismaProduct.compareAtPrice ? Number(prismaProduct.compareAtPrice) : undefined,
    description: prismaProduct.description,
    images: prismaProduct.images as string[],
    sizes: prismaProduct.sizes as Array<{ value: string; available: boolean; stock: number }>,
    inStock: prismaProduct.inStock,
    sku: prismaProduct.sku,
    collection: prismaProduct.collection,
    searchKeywords: prismaProduct.searchKeywords as string[] | undefined,
  };
}

/**
 * Get all products from database
 */
export async function getAllProductsFromDB(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products.map(prismaToProduct);
  } catch (error) {
    console.error('[products-db.ts] Error fetching all products:', error);
    // Fallback to empty array on error
    return [];
  }
}

/**
 * Get product by ID from database
 */
export async function getProductByIdFromDB(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return null;
    }

    return prismaToProduct(product);
  } catch (error) {
    console.error(`[products-db.ts] Error fetching product ${id}:`, error);
    return null;
  }
}

/**
 * Get products by collection from database
 */
export async function getProductsByCollectionFromDB(collection: string): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        collection: collection,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products.map(prismaToProduct);
  } catch (error) {
    console.error(`[products-db.ts] Error fetching products for collection ${collection}:`, error);
    return [];
  }
}

/**
 * Search products in database
 */
export async function searchProductsFromDB(query: string): Promise<Product[]> {
  try {
    const searchTerm = query.toLowerCase().trim();
    
    // Get all products and filter in memory for now
    // (PostgreSQL JSONB array search is complex, this is simpler for MVP)
    const allProducts = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filter products
    const filtered = allProducts.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      const descMatch = product.description.toLowerCase().includes(searchTerm);
      const skuMatch = product.sku.toLowerCase().includes(searchTerm);
      
      // Check searchKeywords (JSONB array)
      const keywords = product.searchKeywords as string[] | null;
      const keywordMatch = keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm)
      ) || false;

      return nameMatch || descMatch || skuMatch || keywordMatch;
    });

    return filtered.map(prismaToProduct);
  } catch (error) {
    console.error(`[products-db.ts] Error searching products with query "${query}":`, error);
    return [];
  }
}

/**
 * Get all product IDs (for static generation)
 */
export async function getAllProductIdsFromDB(): Promise<string[]> {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
      },
    });

    return products.map((p) => p.id);
  } catch (error) {
    console.error('[products-db.ts] Error fetching product IDs:', error);
    return [];
  }
}

