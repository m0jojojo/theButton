// Initialize default admin user on server start
// This runs automatically when the module is imported

import { getAllUsers, createUser } from './users';

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@thebutton.com';
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

let adminInitialized = false;

export async function initializeDefaultAdmin() {
  // Only run once
  if (adminInitialized) {
    return;
  }

  try {
    // Check if any admin users exist
    const allUsers = getAllUsers();
    const hasAdmin = allUsers.some((user) => user.role === 'admin');

    if (hasAdmin) {
      console.log('[init-admin] Admin user already exists');
      adminInitialized = true;
      return;
    }

    // Create default admin user
    const adminUser = await createUser({
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      name: 'Admin User',
      role: 'admin',
    });

    console.log('[init-admin] Default admin user created successfully');
    console.log(`[init-admin] Email: ${DEFAULT_ADMIN_EMAIL}`);
    console.log(`[init-admin] Password: ${DEFAULT_ADMIN_PASSWORD}`);
    console.log('[init-admin] ⚠️  WARNING: Please change the default password after first login!');
    adminInitialized = true;
  } catch (error: any) {
    if (error.message === 'User with this email already exists') {
      console.log('[init-admin] Admin user already exists');
      adminInitialized = true;
      return;
    }
    console.error('[init-admin] Failed to initialize admin user:', error);
  }
}

// Auto-initialize on module load (only in development or if explicitly enabled)
if (process.env.NODE_ENV === 'development' || process.env.INIT_ADMIN === 'true') {
  // Run asynchronously to not block server startup
  initializeDefaultAdmin().catch(console.error);
}

