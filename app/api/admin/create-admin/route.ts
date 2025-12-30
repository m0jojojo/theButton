import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, getAllUsers } from '@/lib/users';
import { signToken } from '@/lib/jwt';

// Default admin credentials (change in production!)
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@thebutton.com';
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if admin user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create admin user
    const adminUser = await createUser({
      email,
      password,
      name,
      role: 'admin',
    });

    // Generate token
    const token = signToken({
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    });

    return NextResponse.json(
      {
        message: 'Admin user created successfully',
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

// GET endpoint to initialize default admin (if no admin exists)
export async function GET(request: NextRequest) {
  try {
    // Check if any admin users exist
    const allUsers = getAllUsers();
    const hasAdmin = allUsers.some((user) => user.role === 'admin');

    if (hasAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists', hasAdmin: true },
        { status: 200 }
      );
    }

    // Create default admin user
    try {
      const adminUser = await createUser({
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD,
        name: 'Admin User',
        role: 'admin',
      });

      return NextResponse.json(
        {
          message: 'Default admin user created successfully',
          credentials: {
            email: DEFAULT_ADMIN_EMAIL,
            password: DEFAULT_ADMIN_PASSWORD,
            warning: 'Please change the default password after first login!',
          },
          user: {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role,
          },
        },
        { status: 201 }
      );
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        return NextResponse.json(
          { message: 'Admin user already exists', hasAdmin: true },
          { status: 200 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Initialize admin error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize admin user' },
      { status: 500 }
    );
  }
}

