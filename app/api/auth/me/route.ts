import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { getUserById, getUserByEmail, getUserPublic } from '@/lib/users';

export async function GET(request: NextRequest) {
  try {
    // Get token from request
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user by email first (stable across server restarts), then by ID
    let user = await getUserByEmail(payload.email);
    if (!user) {
      // Fallback to userId lookup (for backward compatibility)
      user = await getUserById(payload.userId);
    }
    
    if (!user) {
      // User doesn't exist (server restarted), but token is valid
      // Return a minimal user object based on token payload
      return NextResponse.json({
        user: {
          id: payload.userId,
          email: payload.email,
          name: payload.email.split('@')[0], // Use email prefix as name
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    // Return user
    return NextResponse.json({
      user: getUserPublic(user),
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}

