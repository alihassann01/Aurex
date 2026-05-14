'use client';

import React from 'react';
import { Radio, CalendarDays, Megaphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AnnouncementComposer } from '@/components/announcements/AnnouncementComposer';
import { AnnouncementFeed } from '@/components/announcements/AnnouncementFeed';
import { EventCard } from '@/components/announcements/EventCard';
import type { CityEvent } from '@/types';

const adminEvents: CityEvent[] = [
  {
    id: 'event-admin-1',
    title: 'Budget Review Session',
    description: 'A public budget review with department leads and resident questions.',
    date: '2026-05-28',
    location: 'City Hall Auditorium',
    capacity: 220,
    registered: 174,
    isRegistered: false,
  },
  {
    id: 'event-admin-2',
    title: 'Infrastructure Walkthrough',
    description: 'Review planned sidewalk, signal, and drainage improvements with public works.',
    date: '2026-06-03',
    location: 'Main Street Corridor',
    capacity: 80,
    registered: 51,
    isRegistered: false,
  },
];

export function AnnouncementManagementPanel() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Communications</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Announcements & Events</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Publish city updates, confirm emergency broadcasts, and monitor community event capacity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Active Alerts', value: '3', icon: Radio },
          { label: 'Events Scheduled', value: '5', icon: CalendarDays },
          { label: 'Broadcast Reach', value: '48K', icon: Megaphone },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-3xl font-bold">{item.value}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <AnnouncementComposer />
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Upcoming Events</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {adminEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold">Published Feed</h2>
            <AnnouncementFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
