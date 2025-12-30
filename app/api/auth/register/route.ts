import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserPublic } from '@/lib/users';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, name, password } = body;

    // Validation
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password validation (min 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Phone validation (if provided)
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Phone must be 10 digits' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser({
      email,
      phone,
      name,
      password,
    });

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    // Return user and token
    return NextResponse.json(
      {
        user: getUserPublic(user),
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'User with this email already exists') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

