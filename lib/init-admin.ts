// Initialize default admin and customer users on server start
// This runs automatically when the module is imported

import { getAllUsers, createUser } from './users';

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@thebutton.com';
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

const DEFAULT_CUSTOMER_EMAIL = process.env.DEFAULT_CUSTOMER_EMAIL || 'customer@example.com';
const DEFAULT_CUSTOMER_PASSWORD = process.env.DEFAULT_CUSTOMER_PASSWORD || 'password123';

let adminInitialized = false;
let customerInitialized = false;

export async function initializeDefaultAdmin() {
  // Only run once
  if (adminInitialized) {
    console.log('[init-admin] Already initialized, skipping...');
    return;
  }

  try {
    // Check if admin user with this email exists
    const { getUserByEmail } = await import('./users');
    const existingAdmin = await getUserByEmail(DEFAULT_ADMIN_EMAIL);
    
    if (existingAdmin) {
      console.log(`[init-admin] Admin user already exists: ${DEFAULT_ADMIN_EMAIL}`);
      adminInitialized = true;
      return;
    }

    // Check if any admin users exist
    const allUsers = await getAllUsers();
    const hasAdmin = allUsers.some((user) => user.role === 'admin');

    if (hasAdmin) {
      console.log('[init-admin] Admin user already exists (different email)');
      adminInitialized = true;
      return;
    }

    console.log(`[init-admin] Creating default admin user: ${DEFAULT_ADMIN_EMAIL}`);

    // Create default admin user
    const adminUser = await createUser({
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      name: 'Admin User',
      role: 'admin',
    });

    console.log('[init-admin] ✅ Default admin user created successfully');
    console.log(`[init-admin] Email: ${DEFAULT_ADMIN_EMAIL}`);
    console.log(`[init-admin] Password: ${DEFAULT_ADMIN_PASSWORD}`);
    console.log(`[init-admin] User ID: ${adminUser.id}`);
    console.log('[init-admin] ⚠️  WARNING: Please change the default password after first login!');
    adminInitialized = true;
  } catch (error: any) {
    if (error.message === 'User with this email already exists') {
      console.log(`[init-admin] Admin user already exists: ${DEFAULT_ADMIN_EMAIL}`);
      adminInitialized = true;
      return;
    }
    console.error('[init-admin] ❌ Failed to initialize admin user:', error);
    console.error('[init-admin] Error details:', error.message, error.stack);
  }
}

export async function initializeDefaultCustomer() {
  // Only run once
  if (customerInitialized) {
    console.log('[init-customer] Already initialized, skipping...');
    return;
  }

  try {
    // Check if customer user with this email exists
    const { getUserByEmail } = await import('./users');
    const existingCustomer = await getUserByEmail(DEFAULT_CUSTOMER_EMAIL);
    
    if (existingCustomer) {
      console.log(`[init-customer] Customer user already exists: ${DEFAULT_CUSTOMER_EMAIL}`);
      customerInitialized = true;
      return;
    }

    console.log(`[init-customer] Creating default customer user: ${DEFAULT_CUSTOMER_EMAIL}`);

    // Create default customer user
    const customerUser = await createUser({
      email: DEFAULT_CUSTOMER_EMAIL,
      password: DEFAULT_CUSTOMER_PASSWORD,
      name: 'Test Customer',
      role: 'customer',
    });

    console.log('[init-customer] ✅ Default customer user created successfully');
    console.log(`[init-customer] Email: ${DEFAULT_CUSTOMER_EMAIL}`);
    console.log(`[init-customer] Password: ${DEFAULT_CUSTOMER_PASSWORD}`);
    console.log(`[init-customer] User ID: ${customerUser.id}`);
    customerInitialized = true;
  } catch (error: any) {
    if (error.message === 'User with this email already exists') {
      console.log(`[init-customer] Customer user already exists: ${DEFAULT_CUSTOMER_EMAIL}`);
      customerInitialized = true;
      return;
    }
    console.error('[init-customer] ❌ Failed to initialize customer user:', error);
    console.error('[init-customer] Error details:', error.message, error.stack);
  }
}

// Auto-initialize on module load (only in development or if explicitly enabled)
if (process.env.NODE_ENV === 'development' || process.env.INIT_ADMIN === 'true') {
  // Run asynchronously to not block server startup
  initializeDefaultAdmin().catch(console.error);
  initializeDefaultCustomer().catch(console.error);
}

