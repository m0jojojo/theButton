'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import ImageCropper from '@/components/ImageCropper';

interface HomepageSettings {
  id: string;
  heroBannerImage: string | null;
  collectionImages: {
    shirts?: string;
    tShirts?: string;
    pants?: string;
    jackets?: string;
  };
}

export default function HomepageSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    heroBannerImage: '',
    shirts: '',
    tShirts: '',
    pants: '',
    jackets: '',
  });

  const [imageToCrop, setImageToCrop] = useState<{ type: string; data: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('theButton_token');
        const response = await fetch('/api/admin/homepage-settings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch homepage settings');
        }

        const data = await response.json();
        setSettings(data.settings);
        setFormData({
          heroBannerImage: data.settings.heroBannerImage || '',
          shirts: data.settings.collectionImages?.shirts || '',
          tShirts: data.settings.collectionImages?.tShirts || '',
          pants: data.settings.collectionImages?.pants || '',
          jackets: data.settings.collectionImages?.jackets || '',
        });
      } catch (err) {
        console.error('Error fetching homepage settings:', err);
        setError('Failed to load homepage settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const processFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > 10 * 1024 * 1024) {
        reject(new Error(`File "${file.name}" is too large. Maximum size is 10MB.`));
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        reject(new Error(`File "${file.name}" is not a recognized image file.`));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error(`Failed to read file "${file.name}"`));
        }
      };
      reader.onerror = () => reject(new Error(`Error reading file "${file.name}"`));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (type: string, file: File | null) => {
    if (!file) return;

    try {
      const imageData = await processFile(file);
      setImageToCrop({ type, data: imageData });
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
    }
  };

  const handleCropComplete = (croppedImage: string, type: string) => {
    setFormData((prev) => ({
      ...prev,
      [type]: croppedImage,
    }));
    setImageToCrop(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('theButton_token');
      
      // Build collection images object, only including non-empty values
      const collectionImages: Record<string, string> = {};
      if (formData.shirts) collectionImages.shirts = formData.shirts;
      if (formData.tShirts) collectionImages.tShirts = formData.tShirts;
      if (formData.pants) collectionImages.pants = formData.pants;
      if (formData.jackets) collectionImages.jackets = formData.jackets;

      const updateData = {
        heroBannerImage: formData.heroBannerImage || null,
        collectionImages: Object.keys(collectionImages).length > 0 ? collectionImages : {},
      };

      console.log('[Homepage Settings] Updating with data:', {
        hasHeroBanner: !!updateData.heroBannerImage,
        collectionImagesCount: Object.keys(updateData.collectionImages).length,
      });

      const response = await fetch('/api/admin/homepage-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || `Failed to update homepage settings (${response.status})`);
      }

      setSuccess('Homepage settings updated successfully!');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      console.error('Error updating homepage settings:', err);
      setError(err.message || 'Failed to update homepage settings');
    } finally {
      setIsSaving(false);
    }
  };

  const renderImagePreview = (image: string, type: string) => {
    if (!image) {
      return (
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
          No image uploaded
        </div>
      );
    }

    if (image.startsWith('data:')) {
      return (
        <img
          src={image}
          alt={`${type} preview`}
          className="w-full h-48 object-cover rounded-lg"
        />
      );
    }

    return (
      <img
        src={image}
        alt={`${type} preview`}
        className="w-full h-48 object-cover rounded-lg"
      />
    );
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Homepage Settings</h1>
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
                className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
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
              <Link
                href="/admin/homepage-settings"
                className="py-4 px-2 border-b-2 border-gray-900 text-gray-900 font-medium"
              >
                Homepage
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Manage Homepage Images
                </h2>

                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Hero Banner Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Banner Image
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      This is the background image for the hero section on the homepage.
                    </p>
                    {renderImagePreview(formData.heroBannerImage, 'Hero Banner')}
                    <div className="mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload('heroBannerImage', file);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                      />
                    </div>
                  </div>

                  {/* Collection Thumbnails */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Collection Thumbnails
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Upload images for each collection category displayed on the homepage.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: 'shirts', label: 'Shirts' },
                        { key: 'tShirts', label: 'T-Shirts' },
                        { key: 'pants', label: 'Pants' },
                        { key: 'jackets', label: 'Jackets' },
                      ].map((category) => (
                        <div key={category.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {category.label}
                          </label>
                          {renderImagePreview(formData[category.key as keyof typeof formData], category.label)}
                          <div className="mt-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(category.key, file);
                              }}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                    <Link
                      href="/admin/dashboard"
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Image Cropper Modal */}
      {imageToCrop && (
        <ImageCropper
          image={imageToCrop.data}
          onCropComplete={(croppedImage) => {
            handleCropComplete(croppedImage, imageToCrop.type);
          }}
          onCancel={() => setImageToCrop(null)}
          aspect={imageToCrop.type === 'heroBannerImage' ? 16 / 9 : 1}
          maxSize={2000}
        />
      )}
    </AdminGuard>
  );
}

