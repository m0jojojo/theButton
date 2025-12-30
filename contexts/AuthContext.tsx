'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('theButton_token');
      const savedUser = localStorage.getItem('theButton_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify token is still valid
        verifyToken(savedToken);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(tokenToVerify);
        if (typeof window !== 'undefined') {
          localStorage.setItem('theButton_token', tokenToVerify);
          localStorage.setItem('theButton_user', JSON.stringify(data.user));
        }
      } else {
        // Token invalid, clear auth
        logout();
      }
    } catch (error) {
      console.error('Token verification error:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Convert date strings to Date objects for consistency
    const userData = {
      ...data.user,
      createdAt: data.user.createdAt,
      updatedAt: data.user.updatedAt,
    };

    setUser(userData);
    setToken(data.token);

    if (typeof window !== 'undefined') {
      localStorage.setItem('theButton_token', data.token);
      localStorage.setItem('theButton_user', JSON.stringify(userData));
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, phone }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // Convert date strings to Date objects for consistency
    const userData = {
      ...data.user,
      createdAt: data.user.createdAt,
      updatedAt: data.user.updatedAt,
    };

    setUser(userData);
    setToken(data.token);

    if (typeof window !== 'undefined') {
      localStorage.setItem('theButton_token', data.token);
      localStorage.setItem('theButton_user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('theButton_token');
      localStorage.removeItem('theButton_user');
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    // This would call an API endpoint to update user
    // For now, just update local state
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('theButton_user', JSON.stringify(updated));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

