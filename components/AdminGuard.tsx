'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    const checkAdmin = async () => {
      if (!token || !user) {
        router.push('/admin/login');
        return;
      }

      // Check if user is admin
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }

      // Verify admin access with server
      try {
        const response = await fetch('/api/admin/auth', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          router.push('/admin/login');
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Admin check error:', error);
        router.push('/admin/login');
      }
    };

    checkAdmin();
  }, [user, token, isLoading, router]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}

