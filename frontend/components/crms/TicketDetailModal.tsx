'use client';

import React, { useState } from 'react';
import { MapPin, Calendar, User, Send, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SLABadge } from '@/components/shared/SLABadge';
import { RequestStatusPipeline } from '@/components/shared/RequestStatusPipeline';
import { PRIORITY_COLORS } from '@/lib/constants';
import { cn, formatDateTime, getInitials } from '@/lib/utils';
import { useRBAC } from '@/hooks/useRBAC';
import { toast } from 'sonner';
import type { CivicRequest } from '@/types';

interface TicketDetailModalProps {
  request: CivicRequest;
  open: boolean;
  onClose: () => void;
}

export function TicketDetailModal({ request, open, onClose }: TicketDetailModalProps) {
  const [comment, setComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const { can, hasRole } = useRBAC();
  const isStaff = hasRole('staff', 'department_admin', 'super_admin');

  const handleAddComment = () => {
    if (!comment.trim()) return;
    toast.success('Comment added successfully');
    setComment('');
  };

  const handleStatusUpdate = (newStatus: string) => {
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleEscalate = () => {
    toast.success('Ticket escalated to department admin');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {request.ticketId}
            </span>
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', PRIORITY_COLORS[request.priority])}>
              {request.priority}
            </span>
            <SLABadge status={request.sla.status} daysLeft={request.sla.daysLeft} />
          </div>
          <DialogTitle className="text-xl mt-2">{request.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Pipeline */}
          <div className="py-4">
            <RequestStatusPipeline currentStatus={request.status} />
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{request.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Submitted:</span>
              <span className="font-medium">{formatDateTime(request.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{request.category}</span>
            </div>
            {request.assignedTo && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Assigned to:</span>
                <span className="font-medium">{request.assignedTo.name}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{request.description}</p>
          </div>

          {/* Staff Actions */}
          {isStaff && (
            <div className="flex flex-wrap gap-2 p-4 rounded-lg border border-dashed border-border bg-muted/20">
              <span className="text-xs font-medium text-muted-foreground w-full mb-1">Staff Actions:</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                onChange={(e) => handleStatusUpdate(e.target.value)}
                defaultValue=""
                aria-label="Update ticket status"
              >
                <option value="" disabled>Update Status...</option>
                <option value="Under Review">Under Review</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              <Button variant="outline" size="sm" onClick={handleEscalate}>
                Escalate
              </Button>
            </div>
          )}

          {/* Comments Thread */}
          <div>
            <h4 className="text-sm font-semibold mb-3">
              Comments ({request.comments.length})
            </h4>
            <div className="space-y-3">
              {request.comments.map((c) => (
                <div
                  key={c.id}
                  className={cn(
                    'p-3 rounded-lg border',
                    c.isInternal
                      ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/30'
                      : 'bg-card border-border'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-semibold">
                      {getInitials(c.author.name)}
                    </div>
                    <span className="text-sm font-medium">{c.author.name}</span>
                    {c.isInternal && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400">
                        <Lock className="h-2.5 w-2.5" /> Internal
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">{formatDateTime(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">{c.content}</p>
                </div>
              ))}

              {request.comments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
              )}
            </div>
          </div>

          {/* Add Comment */}
          <div className="flex gap-2">
            <Input
              placeholder={isInternal ? 'Add internal note...' : 'Add a comment...'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              className="flex-1"
              aria-label="Add comment"
            />
            {isStaff && (
              <Button
                variant={isInternal ? 'secondary' : 'outline'}
                size="icon"
                onClick={() => setIsInternal(!isInternal)}
                aria-label={isInternal ? 'Switch to public comment' : 'Switch to internal note'}
              >
                <Lock className={cn('h-4 w-4', isInternal && 'text-amber-600')} />
              </Button>
            )}
            <Button onClick={handleAddComment} size="icon" disabled={!comment.trim()} aria-label="Send comment">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
