// Admin utilities and helpers

import { verifyToken, JWTPayload } from '@/lib/jwt';

export function isAdmin(token: string | null): boolean {
  if (!token) return false;
  
  const payload = verifyToken(token);
  return payload?.role === 'admin';
}

export function requireAdmin(token: string | null): JWTPayload & { role: string } {
  if (!token) {
    throw new Error('Unauthorized');
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }

  return payload as JWTPayload & { role: string };
}

