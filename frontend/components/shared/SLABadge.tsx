import React from 'react';
import { cn } from '@/lib/utils';
import { SLA_COLORS } from '@/lib/constants';
import { Clock, AlertTriangle } from 'lucide-react';

interface SLABadgeProps {
  status: 'green' | 'amber' | 'red';
  daysLeft: number;
  className?: string;
}

export function SLABadge({ status, daysLeft, className }: SLABadgeProps) {
  const Icon = status === 'red' ? AlertTriangle : Clock;
  const text =
    daysLeft <= 0
      ? 'SLA Breached'
      : daysLeft === 1
        ? '1 day left'
        : `${daysLeft} days left`;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
        SLA_COLORS[status],
        className
      )}
      aria-label={`SLA status: ${text}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {text}
    </span>
  );
}
