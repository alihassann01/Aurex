'use client';

import React, { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle2, Users, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TicketCard } from '@/components/crms/TicketCard';
import { TicketDetailModal } from '@/components/crms/TicketDetailModal';
import { cn } from '@/lib/utils';
import type { CivicRequest } from '@/types';

const mockStaffRequests: CivicRequest[] = [
  {
    id: '1', ticketId: 'CR-1024', title: 'Pothole on Main Street', description: 'Large pothole near intersection.',
    category: 'Infrastructure', priority: 'High', status: 'In Progress', location: '123 Main Street',
    attachments: [], sla: { deadline: '2024-02-01', daysLeft: 1, status: 'red', breached: false },
    comments: [], createdBy: { id: '1', name: 'John Resident', email: '', role: 'resident' },
    createdAt: '2024-01-20T08:00:00Z', updatedAt: '2024-01-25T10:00:00Z',
  },
  {
    id: '2', ticketId: 'CR-1025', title: 'Streetlight outage on Oak Ave', description: 'Three lights not working.',
    category: 'Safety', priority: 'Emergency', status: 'Submitted', location: '456 Oak Avenue',
    attachments: [], sla: { deadline: '2024-01-26', daysLeft: 0, status: 'red', breached: true },
    comments: [], createdBy: { id: '2', name: 'Jane Smith', email: '', role: 'resident' },
    createdAt: '2024-01-22T14:00:00Z', updatedAt: '2024-01-22T14:00:00Z',
  },
  {
    id: '3', ticketId: 'CR-1026', title: 'Sidewalk repair needed', description: 'Cracked sidewalk creating tripping hazard.',
    category: 'Infrastructure', priority: 'Medium', status: 'Assigned', location: '789 Elm Street',
    attachments: [], sla: { deadline: '2024-02-10', daysLeft: 12, status: 'green', breached: false },
    comments: [], createdBy: { id: '3', name: 'Mike Johnson', email: '', role: 'resident' },
    createdAt: '2024-01-18T09:00:00Z', updatedAt: '2024-01-20T16:00:00Z',
  },
];

export default function StaffDashboard() {
  const [requests, setRequests] = useState(mockStaffRequests);
  const [selectedTicket, setSelectedTicket] = useState<CivicRequest | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'sla'>('sla');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const sortedRequests = [...requests].sort((a, b) => {
    if (sortBy === 'sla') return a.sla.daysLeft - b.sla.daysLeft;
    const priorityOrder = { Emergency: 0, High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const stats = [
    { label: 'Assigned', value: requests.length, icon: Users, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'In Progress', value: requests.filter((r) => r.status === 'In Progress').length, icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Resolved Today', value: requests.filter((r) => r.status === 'Resolved').length, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'SLA At Risk', value: requests.filter((r) => r.sla.status === 'red').length, icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
  ];

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkUpdate = () => {
    setRequests((current) =>
      current.map((request) =>
        selectedIds.includes(request.id)
          ? { ...request, status: 'In Progress', updatedAt: new Date().toISOString() }
          : request
      )
    );
    setSelectedIds([]);
  };

  const handleRequestChanged = (request: CivicRequest) => {
    setRequests((current) => current.map((item) => (item.id === request.id ? request : item)));
    setSelectedTicket(request);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Staff Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage assigned tickets and track your queue</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={cn('h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center', stat.color)}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'sla' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('sla')}
            className="gap-1"
          >
            <ArrowUpDown className="h-3.5 w-3.5" /> SLA Urgency
          </Button>
          <Button
            variant={sortBy === 'priority' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('priority')}
            className="gap-1"
          >
            <ArrowUpDown className="h-3.5 w-3.5" /> Priority
          </Button>
        </div>
        {selectedIds.length > 0 && (
          <Button size="sm" variant="secondary" onClick={handleBulkUpdate}>
            Bulk Update ({selectedIds.length})
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {sortedRequests.map((request) => (
          <div key={request.id} className="flex gap-3 items-start">
            <input
              type="checkbox"
              checked={selectedIds.includes(request.id)}
              onChange={() => toggleSelect(request.id)}
              className="mt-5 h-4 w-4 rounded border-input"
              aria-label={`Select ticket ${request.ticketId}`}
            />
            <div className="flex-1">
              <TicketCard request={request} onClick={() => setSelectedTicket(request)} />
            </div>
          </div>
        ))}
      </div>

      {selectedTicket && (
        <TicketDetailModal
          request={selectedTicket}
          open={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onRequestChange={handleRequestChanged}
        />
      )}
    </div>
  );
}
