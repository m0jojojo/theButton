// User store - Uses database when DATABASE_URL is set, otherwise uses in-memory store
// This provides backward compatibility while migrating to database

import bcrypt from 'bcryptjs';

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Check if database is available
const USE_DATABASE = !!process.env.DATABASE_URL;

// In-memory user store (replace with database)
// Use global to persist across hot reloads
declare global {
  var __users_store: Map<string, User> | undefined;
  var __users_by_email: Map<string, User> | undefined;
}

// Initialize or reuse existing stores (persists across hot reloads)
const users: Map<string, User> = global.__users_store || new Map();
const usersByEmail: Map<string, User> = global.__users_by_email || new Map();

// Store references globally to persist across hot reloads
if (!global.__users_store) {
  global.__users_store = users;
  global.__users_by_email = usersByEmail;
  console.log('[users.ts] Initialized new user stores');
} else {
  console.log(`[users.ts] Reusing existing stores - Total users: ${users.size}`);
}

// Export function to get all users (for admin)
export async function getAllUsers(): Promise<User[]> {
  if (USE_DATABASE) {
    const { getAllUsersFromDB } = await import('./users-db');
    return getAllUsersFromDB();
  }
  return Array.from(users.values());
}

export async function createUser(data: {
  email: string;
  phone?: string;
  name: string;
  password: string;
  role?: UserRole;
}): Promise<User> {
  if (USE_DATABASE) {
    const { createUserInDB } = await import('./users-db');
    return createUserInDB(data);
  }

  // In-memory store (fallback)
  // Check if user already exists
  if (usersByEmail.has(data.email.toLowerCase())) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, 10);

  // Create user
  const user: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: data.email.toLowerCase(),
    phone: data.phone,
    name: data.name,
    passwordHash,
    role: data.role || 'customer',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Store user
  users.set(user.id, user);
  usersByEmail.set(user.email, user);

  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  if (USE_DATABASE) {
    const { getUserByEmailFromDB } = await import('./users-db');
    return getUserByEmailFromDB(email);
  }
  return usersByEmail.get(email.toLowerCase()) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  if (USE_DATABASE) {
    const { getUserByIdFromDB } = await import('./users-db');
    return getUserByIdFromDB(id);
  }
  return users.get(id) || null;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  // Password verification is the same regardless of storage
  return bcrypt.compare(password, user.passwordHash);
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id' | 'passwordHash' | 'createdAt'>>): Promise<User | null> {
  if (USE_DATABASE) {
    const { updateUserInDB } = await import('./users-db');
    return updateUserInDB(id, data);
  }

  // In-memory store (fallback)
  const user = users.get(id);
  if (!user) {
    return null;
  }

  const updated: User = {
    ...user,
    ...data,
    updatedAt: new Date(),
  };

  users.set(id, updated);
  if (data.email && data.email !== user.email) {
    usersByEmail.delete(user.email);
    usersByEmail.set(data.email.toLowerCase(), updated);
  }

  return updated;
}

// Helper to get user without password hash
export function getUserPublic(user: User) {
  const { passwordHash, ...publicUser } = user;
  return {
    ...publicUser,
    createdAt: publicUser.createdAt.toISOString(),
    updatedAt: publicUser.updatedAt.toISOString(),
  };
}

