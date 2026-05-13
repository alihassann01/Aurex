import React from 'react';
import { cn } from '@/lib/utils';
import { ROLE_COLORS, ROLE_LABELS } from '@/lib/constants';
import type { UserRole } from '@/types';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', ROLE_COLORS[role], className)}>
      {ROLE_LABELS[role]}
    </span>
  );
}
