'use client';

import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types';

type Permission =
  | 'view:dashboard'
  | 'submit:request'
  | 'manage:requests'
  | 'manage:staff'
  | 'manage:permits'
  | 'manage:announcements'
  | 'view:analytics'
  | 'manage:users'
  | 'manage:departments'
  | 'bulk:update'
  | 'escalate:ticket'
  | 'add:internal-note'
  | 'broadcast:emergency';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  resident: [
    'view:dashboard',
    'submit:request',
  ],
  staff: [
    'view:dashboard',
    'submit:request',
    'manage:requests',
    'bulk:update',
    'escalate:ticket',
    'add:internal-note',
  ],
  department_admin: [
    'view:dashboard',
    'submit:request',
    'manage:requests',
    'manage:staff',
    'manage:permits',
    'manage:announcements',
    'view:analytics',
    'bulk:update',
    'escalate:ticket',
    'add:internal-note',
  ],
  super_admin: [
    'view:dashboard',
    'submit:request',
    'manage:requests',
    'manage:staff',
    'manage:permits',
    'manage:announcements',
    'view:analytics',
    'manage:users',
    'manage:departments',
    'bulk:update',
    'escalate:ticket',
    'add:internal-note',
    'broadcast:emergency',
  ],
};

export function useRBAC() {
  const user = useAuthStore((state) => state.user);

  const can = (permission: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return { can, hasRole, role: user?.role ?? null };
}
