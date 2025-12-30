import { Product, searchProducts } from './products';

export interface SearchFilters {
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface SearchResult {
  products: Product[];
  total: number;
  query: string;
  filters?: SearchFilters;
}

export function performSearch(query: string, filters?: SearchFilters): SearchResult {
  const products = searchProducts(query, filters);
  
  return {
    products,
    total: products.length,
    query,
    filters,
  };
}

// Sort products
export type SortOption = 'relevance' | 'price-low' | 'price-high' | 'name';

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'relevance':
    default:
      // For now, relevance is just the original order
      // In future, can implement scoring based on match quality
      return sorted;
  }
}

