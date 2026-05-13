'use client';

import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from '@/components/shared/NotificationDropdown';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { getInitials } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-accent transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden lg:block" />

        <div className="flex items-center gap-3">
          <NotificationDropdown />

          {user && (
            <div className="flex items-center gap-3">
              <RoleBadge role={user.role} />
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                {getInitials(user.name)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                aria-label="Sign out"
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
