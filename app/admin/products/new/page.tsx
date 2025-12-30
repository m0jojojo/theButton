'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    compareAtPrice: '',
    description: '',
    sku: '',
    collection: '',
    images: '',
    sizes: '',
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setUploadedImages((prev) => [...prev, base64String]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveImage = (index: number, isUploaded: boolean) => {
    if (isUploaded) {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleAddImageUrl = () => {
    const url = formData.images.trim();
    if (url && (url.startsWith('http://') || url.startsWith('https://')) && !imageUrls.includes(url) && !uploadedImages.includes(url)) {
      setImageUrls((prev) => [...prev, url]);
      setFormData({ ...formData, images: '' });
    } else if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      setError('Please enter a valid image URL (must start with http:// or https://)');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      // Parse sizes JSON
      let parsedSizes;
      try {
        parsedSizes = JSON.parse(formData.sizes);
      } catch (err) {
        throw new Error('Invalid sizes JSON format');
      }

      // Combine uploaded images (base64) and URL images
      const allImages = [...uploadedImages, ...imageUrls];

      if (allImages.length === 0) {
        throw new Error('At least one image is required');
      }

      const token = localStorage.getItem('theButton_token');
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
          description: formData.description,
          sku: formData.sku,
          collection: formData.collection,
          images: allImages,
          sizes: parsedSizes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      const result = await response.json();
      // Redirect to products page
      router.push('/admin/products');
    } catch (err: any) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product');
      setIsSaving(false);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
              <div className="flex items-center gap-4">
                <Link
                  href="/admin/products"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Back to Products
                </Link>
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
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    id="sku"
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Compare At Price (₹)
                  </label>
                  <input
                    id="compareAtPrice"
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="collection" className="block text-sm font-medium text-gray-700 mb-2">
                    Collection *
                  </label>
                  <select
                    id="collection"
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  >
                    <option value="">Select Collection</option>
                    <option value="New Arrivals">New Arrivals</option>
                    <option value="Shirts">Shirts</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Pants">Pants</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images *
                  </label>
                  
                  {/* Image Upload */}
                  <div className="mb-4">
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Upload Images from Desktop
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Select one or more images from your computer
                    </p>
                  </div>

                  {/* Add Image URL */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.images}
                        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                        placeholder="Or enter image URL (http:// or https://)"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddImageUrl();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {(uploadedImages.length > 0 || imageUrls.length > 0) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {/* Uploaded Images */}
                      {uploadedImages.map((image, index) => (
                        <div key={`uploaded-${index}`} className="relative group">
                          <img
                            src={image}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index, true)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      
                      {/* URL Images */}
                      {imageUrls.map((image, index) => (
                        <div key={`url-${index}`} className="relative group">
                          <img
                            src={image}
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12"%3EFailed to load%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index, false)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {uploadedImages.length === 0 && imageUrls.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      No images added. Upload images or add URLs above.
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="sizes" className="block text-sm font-medium text-gray-700 mb-2">
                    Sizes (JSON format) *
                  </label>
                  <textarea
                    id="sizes"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    required
                    rows={6}
                    placeholder='[{"value": "S", "available": true, "stock": 10}, {"value": "M", "available": true, "stock": 15}]'
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 font-mono text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Format: Array of objects with value, available (boolean), and stock (number)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <Link
                  href="/admin/products"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors ${
                    isSaving ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

