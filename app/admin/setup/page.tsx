'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminSetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);

  const handleInitialize = async () => {
    setIsLoading(true);
    setMessage(null);
    setCredentials(null);

    try {
      const response = await fetch('/api/admin/create-admin');
      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to initialize admin' });
        setIsLoading(false);
        return;
      }

      if (data.hasAdmin) {
        setMessage({ type: 'success', text: 'Admin user already exists. You can login or create a new admin.' });
        setIsLoading(false);
        return;
      }

      setMessage({ type: 'success', text: 'Default admin user created successfully!' });
      setCredentials({
        email: data.credentials.email,
        password: data.credentials.password,
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Setup error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  const handleCreateCustom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setCredentials(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      const response = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to create admin' });
        setIsLoading(false);
        return;
      }

      setMessage({ type: 'success', text: 'Admin user created successfully!' });
      setCredentials({ email: data.user.email, password: password });
      setIsLoading(false);
    } catch (error) {
      console.error('Create admin error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Setup</h1>
          <p className="text-gray-600">Create your first admin user to access the admin dashboard</p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        {credentials && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">Admin Credentials</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-yellow-900">Email:</span>{' '}
                <span className="text-yellow-700 font-mono">{credentials.email}</span>
              </div>
              <div>
                <span className="font-medium text-yellow-900">Password:</span>{' '}
                <span className="text-yellow-700 font-mono">{credentials.password}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 rounded text-yellow-800 text-sm">
              ⚠️ <strong>Important:</strong> Please save these credentials and change the password after first login!
            </div>
            <div className="mt-4">
              <Link
                href="/admin/login"
                className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Go to Admin Login
              </Link>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Quick Setup */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Setup</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Create a default admin user with predefined credentials (admin@thebutton.com / admin123)
            </p>
            <button
              onClick={handleInitialize}
              disabled={isLoading}
              className={`px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg transition-colors ${
                isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
            >
              {isLoading ? 'Creating...' : 'Create Default Admin'}
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Custom Admin</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Create an admin user with your own credentials
            </p>
            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  placeholder="Admin Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  placeholder="Minimum 6 characters"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg transition-colors ${
                  isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-800'
                }`}
              >
                {isLoading ? 'Creating...' : 'Create Admin User'}
              </button>
            </form>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

