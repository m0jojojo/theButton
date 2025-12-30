// Mock user store - Replace with database in production
// This is a temporary solution for MVP

import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory user store (replace with database)
const users: Map<string, User> = new Map();
const usersByEmail: Map<string, User> = new Map();

export async function createUser(data: {
  email: string;
  phone?: string;
  name: string;
  password: string;
}): Promise<User> {
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Store user
  users.set(user.id, user);
  usersByEmail.set(user.email, user);

  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return usersByEmail.get(email.toLowerCase()) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  return users.get(id) || null;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id' | 'passwordHash' | 'createdAt'>>): Promise<User | null> {
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

