'use client';

import React, { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatDate } from '@/lib/utils';
import { ANNOUNCEMENT_PRIORITY_COLORS } from '@/lib/constants';
import type { Announcement, AnnouncementCategory } from '@/types';

const mockAnnouncements: Announcement[] = [
  { id: '1', title: 'Emergency: Water Main Break on Central Ave', content: 'Residents in the Central Avenue area are advised to boil water before drinking. Repair crews are on-site and expected to restore service within 24 hours.', priority: 'Emergency', category: 'Emergency', author: { id: '1', name: 'City Manager', email: '', role: 'super_admin' }, isRead: false, createdAt: '2024-01-25T06:00:00Z' },
  { id: '2', title: 'Free Health Screening at Community Center', content: 'The Department of Health is offering free health screenings this Saturday from 9 AM to 3 PM. Walk-ins welcome.', priority: 'Normal', category: 'Health', author: { id: '2', name: 'Health Dept', email: '', role: 'department_admin' }, isRead: false, createdAt: '2024-01-24T14:00:00Z' },
  { id: '3', title: 'Road Resurfacing Project Phase 2', content: 'Phase 2 of the road resurfacing project will begin next Monday. Expect detours on Oak Street and Maple Avenue for approximately 2 weeks.', priority: 'High', category: 'Infrastructure', author: { id: '3', name: 'Public Works', email: '', role: 'department_admin' }, isRead: true, createdAt: '2024-01-23T10:00:00Z' },
  { id: '4', title: 'Annual City Cultural Festival Announced', content: 'Mark your calendars for the annual Cultural Festival on February 15-17 at Civic Center Park. Live music, food trucks, and family activities.', priority: 'Low', category: 'Culture', author: { id: '4', name: 'Cultural Affairs', email: '', role: 'department_admin' }, isRead: true, createdAt: '2024-01-22T09:00:00Z' },
  { id: '5', title: 'Updated Recycling Guidelines', content: 'New recycling guidelines are now in effect. Please check the updated list of accepted materials on our website.', priority: 'Normal', category: 'General', author: { id: '5', name: 'Waste Mgmt', email: '', role: 'department_admin' }, isRead: false, createdAt: '2024-01-21T11:00:00Z' },
];

const categories: (AnnouncementCategory | 'All')[] = ['All', 'Health', 'Infrastructure', 'Culture', 'Emergency'];

export function AnnouncementFeed() {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [announcements, setAnnouncements] = useState(mockAnnouncements);

  const filtered = announcements.filter((a) => {
    const matchesCat = filter === 'All' || a.category === filter;
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const markAsRead = (id: string) => {
    setAnnouncements((prev) => prev.map((a) => a.id === id ? { ...a, isRead: true } : a));
  };

  return (
    <div className="space-y-4">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search announcements..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" aria-label="Search announcements" />
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs sm:text-sm">{cat}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Announcement List */}
      <div className="space-y-3">
        {filtered.map((announcement) => (
          <button
            key={announcement.id}
            onClick={() => markAsRead(announcement.id)}
            className={cn(
              'w-full text-left p-4 rounded-xl border transition-all hover:shadow-md',
              !announcement.isRead ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
            )}
            aria-label={`${announcement.isRead ? '' : 'Unread: '}${announcement.title}`}
          >
            <div className="flex items-start gap-3">
              {!announcement.isRead && (
                <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 animate-pulse-dot" />
              )}
              <div className={cn('flex-1 min-w-0', announcement.isRead && 'ml-5')}>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold', ANNOUNCEMENT_PRIORITY_COLORS[announcement.priority])}>
                    {announcement.priority === 'Emergency' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {announcement.priority}
                  </span>
                  <span className="text-xs text-muted-foreground">{announcement.category}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{formatDate(announcement.createdAt)}</span>
                </div>
                <h3 className={cn('text-sm sm:text-base', !announcement.isRead ? 'font-bold' : 'font-medium')}>
                  {announcement.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{announcement.content}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
