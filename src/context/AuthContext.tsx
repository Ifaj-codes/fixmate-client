'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'technician' | 'admin';
  phone?: string;
  area?: string;
  bio?: string;
  image?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData: User, redirectPath?: string) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load auth state from localStorage on initial render
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('fixmate_token');
      const storedUser = localStorage.getItem('fixmate_user');

      if (storedToken && storedUser) {
        let parsed = JSON.parse(storedUser);
        if (parsed?.name && parsed.name.toLowerCase().includes('sakib')) {
          parsed.name = 'Nesar Uddin Ifaj (Customer)';
          localStorage.setItem('fixmate_user', JSON.stringify(parsed));
        }
        setToken(storedToken);
        setUser(parsed);
        document.cookie = `fixmate_token=${storedToken}; path=/; max-age=604800; SameSite=Lax`;
      }
    } catch (e) {
      console.error('Failed to load stored auth session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (jwtToken: string, userData: User, redirectPath?: string) => {
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('fixmate_token', jwtToken);
    localStorage.setItem('fixmate_user', JSON.stringify(userData));
    document.cookie = `fixmate_token=${jwtToken}; path=/; max-age=604800; SameSite=Lax`;

    if (redirectPath) {
      router.push(redirectPath);
    } else {
      // Redirect to role-specific dashboard
      if (userData.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (userData.role === 'technician') {
        router.push('/dashboard/technician');
      } else {
        router.push('/dashboard/customer');
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fixmate_token');
    localStorage.removeItem('fixmate_user');
    document.cookie = 'fixmate_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/sign-in');
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('fixmate_user', JSON.stringify(updated));
  };

  const refreshUser = async () => {
    const res = await apiRequest<{ user: User }>('/auth/me');
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      localStorage.setItem('fixmate_user', JSON.stringify(res.data.user));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
