/**
 * Get Product Collections API
 * 
 * GET /api/products/collections
 * 
 * Returns unique collection names from database
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const collections = await prisma.product.findMany({
      select: {
        collection: true,
      },
      distinct: ['collection'],
      orderBy: {
        collection: 'asc',
      },
    });

    return NextResponse.json({
      collections: collections.map((c) => c.collection),
    });
  } catch (error: any) {
    console.error('[API /products/collections] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

