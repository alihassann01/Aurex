'use client';

import React from 'react';
import { AnnouncementFeed } from '@/components/announcements/AnnouncementFeed';
import { EventCard } from '@/components/announcements/EventCard';
import type { CityEvent } from '@/types';

const mockEvents: CityEvent[] = [
  { id: '1', title: 'Annual City Cultural Festival', description: 'Join us for 3 days of live music, food trucks, art exhibitions, and family activities at Civic Center Park.', date: '2024-02-15', location: 'Civic Center Park', capacity: 500, registered: 387, isRegistered: false },
  { id: '2', title: 'Town Hall Meeting', description: 'Discuss the new city budget and infrastructure plans with city officials. All residents welcome.', date: '2024-02-01', location: 'City Hall Auditorium', capacity: 200, registered: 200, isRegistered: true },
  { id: '3', title: 'Community Clean-up Day', description: 'Volunteer to help clean up our parks and waterways. Equipment and refreshments provided.', date: '2024-02-10', location: 'Riverside Park', capacity: 150, registered: 92, isRegistered: false },
];

export default function AnnouncementsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Announcements & Events</h1>
        <p className="text-muted-foreground mt-1">Stay informed with city updates and community events</p>
      </div>

      {/* Events Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Announcements Feed */}
      <div>
        <h2 className="text-lg font-semibold mb-4">City Announcements</h2>
        <AnnouncementFeed />
      </div>
    </div>
  );
}
