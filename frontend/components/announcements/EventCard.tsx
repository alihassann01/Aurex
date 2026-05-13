'use client';

import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { CityEvent } from '@/types';

interface EventCardProps {
  event: CityEvent;
}

export function EventCard({ event }: EventCardProps) {
  const isFull = event.registered >= event.capacity;
  const capacityPercent = (event.registered / event.capacity) * 100;

  const handleRegister = () => {
    toast.success(`Registered for ${event.title}!`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-end p-4">
          <h3 className="text-lg font-semibold">{event.title}</h3>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(event.date)}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
          </div>

          {/* Capacity bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> {event.registered}/{event.capacity}</span>
              <span className={cn('font-medium', isFull ? 'text-destructive' : 'text-emerald-600')}>{isFull ? 'Full' : `${Math.round(capacityPercent)}%`}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', isFull ? 'bg-destructive' : capacityPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500')}
                style={{ width: `${Math.min(capacityPercent, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {event.isRegistered ? (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">✓ Registered</Badge>
            ) : (
              <Button size="sm" onClick={handleRegister} disabled={isFull} aria-label={`Register for ${event.title}`}>
                {isFull ? 'Event Full' : 'Register'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
