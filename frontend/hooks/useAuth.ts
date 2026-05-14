'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { loginUser, logoutUser } from '@/lib/auth';
import { toast } from 'sonner';
import type { UserRole } from '@/types';
import axios from 'axios';

function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case 'resident':
      return '/resident';
    case 'staff':
      return '/staff';
    case 'department_admin':
      return '/dept-admin';
    case 'super_admin':
      return '/super-admin';
    default:
      return '/resident';
  }
}

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, login: storeLogin, logout: storeLogout } = useAuthStore();
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await loginUser({ email, password });

      // Store in Zustand
      storeLogin(data.user, data.token);

      // Set cookies for Next.js middleware (7-day expiry to match JWT)
      document.cookie = `civic-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `civic-role=${data.user.role}; path=/; max-age=${60 * 60 * 24 * 7}`;

      toast.success(`Welcome back, ${data.user.name}!`);

      const dashboardRoute = getDashboardRoute(data.user.role);
      router.push(dashboardRoute);

      return data;
    },
    [storeLogin, router]
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser(); // Blacklists token on server
    } catch (error) {
      // Even if server call fails, still clear local state
      if (axios.isAxiosError(error)) {
        console.error('Logout API error:', error.response?.data?.message);
      }
    } finally {
      storeLogout();
      // Clear cookies
      document.cookie = 'civic-token=; path=/; max-age=0';
      document.cookie = 'civic-role=; path=/; max-age=0';
      router.push('/login');
    }
  }, [storeLogout, router]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    role: user?.role ?? null,
    login,
    logout,
  };
}
