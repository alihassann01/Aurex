'use client';

import React from 'react';
import { MapPin, Calendar, MessageSquare, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SLABadge } from '@/components/shared/SLABadge';
import { PRIORITY_COLORS, STATUS_COLORS } from '@/lib/constants';
import { cn, formatDate, truncate } from '@/lib/utils';
import type { CivicRequest } from '@/types';

interface TicketCardProps {
  request: CivicRequest;
  onClick: () => void;
}

export function TicketCard({ request, onClick }: TicketCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View ticket ${request.ticketId}: ${request.title}`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground">{request.ticketId}</span>
              <span className={cn('inline-block w-2 h-2 rounded-full', STATUS_COLORS[request.status])} />
              <span className="text-xs text-muted-foreground">{request.status}</span>
            </div>

            <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
              {request.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {truncate(request.description, 100)}
            </p>

            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', PRIORITY_COLORS[request.priority])}>
                {request.priority}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {truncate(request.location, 30)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" /> {formatDate(request.createdAt)}
              </span>
              {request.comments.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3" /> {request.comments.length}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <SLABadge status={request.sla.status} daysLeft={request.sla.daysLeft} />
            <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
