import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/jwt';
import { requireAdmin } from '@/lib/admin';
import { getAllUsers, getUserPublic } from '@/lib/users';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const allUsers = getAllUsers();

    return NextResponse.json({
      users: allUsers.map(getUserPublic),
    });
  } catch (error: any) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: error.message?.includes('Forbidden') ? 403 : 401 }
    );
  }
}

