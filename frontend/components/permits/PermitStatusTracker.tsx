'use client';

import React from 'react';
import { Check, X, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PermitStatus } from '@/types';

const STAGES: PermitStatus[] = ['Submitted', 'Document Verification', 'Field Inspection', 'Approved'];

interface PermitStatusTrackerProps {
  status: PermitStatus;
  rejectionReason?: string;
  onResubmit?: () => void;
}

export function PermitStatusTracker({ status, rejectionReason, onResubmit }: PermitStatusTrackerProps) {
  const isRejected = status === 'Rejected';
  const currentIndex = isRejected ? -1 : STAGES.indexOf(status);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Application Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between relative mb-6">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
          {isRejected ? null : (
            <div
              className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500"
              style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
            />
          )}
          {STAGES.map((stage, i) => {
            const completed = !isRejected && i < currentIndex;
            const current = !isRejected && i === currentIndex;
            return (
              <div key={stage} className="relative flex flex-col items-center z-10">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                  completed ? 'bg-primary border-primary text-primary-foreground' :
                  current ? 'bg-background border-primary text-primary ring-4 ring-primary/20' :
                  'bg-background border-border text-muted-foreground'
                )}>
                  {completed ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn('mt-2 text-xs font-medium text-center max-w-[80px]', current ? 'text-primary' : 'text-muted-foreground')}>
                  {stage}
                </span>
              </div>
            );
          })}
        </div>

        {isRejected && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 mb-2">
              <X className="h-5 w-5 text-destructive" />
              <span className="font-semibold text-destructive">Application Rejected</span>
            </div>
            {rejectionReason && (
              <p className="text-sm text-muted-foreground mb-3">{rejectionReason}</p>
            )}
            <Button onClick={onResubmit} variant="outline" size="sm" className="gap-1">
              <RotateCcw className="h-4 w-4" /> Re-submit with Corrections
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
