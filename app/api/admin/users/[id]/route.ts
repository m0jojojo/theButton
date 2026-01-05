import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/jwt';
import { requireAdmin } from '@/lib/admin';
import { getUserById, updateUser, getUserPublic } from '@/lib/users';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const user = await getUserById(params.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: getUserPublic(user),
    });
  } catch (error: any) {
    console.error('[Admin User GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: error.message?.includes('Forbidden') ? 403 : 401 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const body = await request.json();
    const { name, email, phone, role, password } = body;

    // Build update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (role !== undefined) updateData.role = role;
    if (password && password.trim()) {
      updateData.password = password; // Will be hashed in updateUserInDB
    }

    const updatedUser = await updateUser(params.id, updateData);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: getUserPublic(updatedUser),
      message: 'User updated successfully',
    });
  } catch (error: any) {
    console.error('[Admin User PATCH] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: error.message?.includes('already exists') ? 400 : 500 }
    );
  }
}

