import { NextResponse } from 'next/server';
import { getUserByEmail, getAllUsers } from '@/lib/users';

export async function GET() {
  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@thebutton.com';
    
    // Check if admin user exists
    const adminUser = await getUserByEmail(adminEmail);
    const allUsers = getAllUsers();
    
    return NextResponse.json({
      adminEmail,
      exists: !!adminUser,
      adminUser: adminUser ? {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      } : null,
      totalUsers: allUsers.length,
      allUsers: allUsers.map(u => ({
        id: u.id,
        email: u.email,
        role: u.role,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

