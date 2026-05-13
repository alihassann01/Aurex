'use client';

import React from 'react';
import { Bell, Check } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { cn, formatDateTime } from '@/lib/utils';

export function NotificationDropdown() {
  const [open, setOpen] = React.useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useUIStore();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add some mock notifications for demo
  React.useEffect(() => {
    if (notifications.length === 0) {
      useUIStore.getState().setNotifications([
        { id: '1', title: 'Request Updated', message: 'Your request #CR-1024 status changed to In Progress', type: 'info', read: false, createdAt: new Date().toISOString() },
        { id: '2', title: 'Permit Approved', message: 'Your construction permit has been approved', type: 'success', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', title: 'New Announcement', message: 'Road maintenance scheduled for Main Street', type: 'warning', read: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
      ]);
    }
  }, [notifications.length]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-accent transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-dot">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-xl animate-fade-in z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline flex items-center gap-1"
                aria-label="Mark all as read"
              >
                <Check className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { markAsRead(n.id); }}
                  className={cn(
                    'w-full text-left px-4 py-3 border-b border-border/50 hover:bg-accent/50 transition-colors',
                    !n.read && 'bg-primary/5'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {!n.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    <div className={cn(!n.read ? '' : 'ml-5')}>
                      <p className={cn('text-sm', !n.read && 'font-semibold')}>{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{formatDateTime(n.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
