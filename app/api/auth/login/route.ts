import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword, getUserPublic } from '@/lib/users';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log(`[Login API] Attempting login for: ${email}`);

    // Get user
    const user = await getUserByEmail(email);
    if (!user) {
      console.log(`[Login API] User not found: ${email}`);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log(`[Login API] User found: ${user.email}, role: ${user.role}`);

    // Verify password
    const isValid = await verifyPassword(user, password);
    if (!isValid) {
      console.log(`[Login API] Password verification failed for: ${email}`);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log(`[Login API] Login successful for: ${email}, role: ${user.role}`);

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user and token
    return NextResponse.json({
      user: getUserPublic(user),
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

