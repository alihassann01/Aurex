'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  LayoutDashboard,
  Bell,
  BarChart3,
  Users,
  X,
  Shield,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { useRBAC } from '@/hooks/useRBAC';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '', icon: LayoutDashboard },
  { label: 'Requests', href: '/requests', icon: Shield },
  { label: 'Permits', href: '/permits', icon: Briefcase },
  { label: 'Announcements', href: '/announcements', icon: Bell },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, permission: 'view:analytics' },
  { label: 'Staff Management', href: '/staff-mgmt', icon: Users, permission: 'manage:staff' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { can } = useRBAC();

  const basePath = `/${pathname.split('/')[1]}`;

  const filteredItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return can(item.permission as Parameters<typeof can>[0]);
  });

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full border-r border-border bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ease-in-out',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20',
          'lg:relative'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link href={basePath} className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-9 w-9 min-w-[36px] rounded-lg bg-sidebar-accent flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className={cn(
              'font-bold text-lg whitespace-nowrap transition-opacity duration-200',
              sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'
            )}>
              CivicConnect
            </span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {filteredItems.map((item) => {
            const href = `${basePath}${item.href}`;
            const isActive = pathname === href || (item.href && pathname.startsWith(href));
            return (
              <Link
                key={item.label}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-white shadow-sm'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-secondary'
                )}
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5 min-w-[20px]" />
                <span className={cn(
                  'whitespace-nowrap transition-opacity duration-200',
                  sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span className={cn(sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden')}>Light civic OS</span>
        </div>
      </aside>
    </>
  );
}
