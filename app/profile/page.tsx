'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';

function ProfileContent() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');

    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                />
              ) : (
                <p className="px-4 py-2 text-gray-900">{user.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              {isEditing ? (
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                  placeholder="9876543210"
                  maxLength={10}
                />
              ) : (
                <p className="px-4 py-2 text-gray-900">{user.phone || 'Not provided'}</p>
              )}
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Since
              </label>
              <p className="px-4 py-2 text-gray-600">
                {new Date(user.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name,
                        phone: user.phone || '',
                      });
                      setError('');
                    }}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/orders"
                    className="flex-1 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-center"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-6 py-3 border-2 border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}

