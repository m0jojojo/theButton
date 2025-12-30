'use client';

import { useState, useEffect } from 'react';
import AdminGuard from '@/components/AdminGuard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { getAllProducts, Product } from '@/lib/products';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const allProducts = getAllProducts();
      setProducts(allProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  View Website
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('theButton_token');
                    localStorage.removeItem('theButton_user');
                    window.location.href = '/admin/login';
                  }}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex space-x-6">
              <Link
                href="/admin/dashboard"
                className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="py-4 px-2 border-b-2 border-gray-900 text-gray-900 font-medium"
              >
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/admin/users"
                className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
              >
                Users
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              Add Product
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Collection
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => {
                        const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
                        return (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.sku}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{product.price.toLocaleString()}
                              {product.compareAtPrice && (
                                <span className="ml-2 text-gray-500 line-through">
                                  ₹{product.compareAtPrice.toLocaleString()}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  totalStock > 0
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {totalStock} units
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.collection}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link
                                href={`/products/${product.id}`}
                                className="text-gray-900 hover:text-gray-600 transition-colors mr-4"
                              >
                                View
                              </Link>
                              <button className="text-gray-900 hover:text-gray-600 transition-colors">
                                Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}

