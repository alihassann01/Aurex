'use client';

import React, { useState } from 'react';
import { FileText, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TicketCard } from '@/components/crms/TicketCard';
import { TicketDetailModal } from '@/components/crms/TicketDetailModal';
import { RequestSubmissionForm } from '@/components/crms/RequestSubmissionForm';
import { EmptyState } from '@/components/shared/SharedComponents';
import type { CivicRequest } from '@/types';

const mockRequests: CivicRequest[] = [
  {
    id: '1', ticketId: 'CR-1024', title: 'Pothole on Main Street', description: 'Large pothole near intersection of Main St and 5th Ave causing traffic hazards.',
    category: 'Infrastructure', priority: 'High', status: 'In Progress', location: '123 Main Street',
    attachments: [], sla: { deadline: '2024-02-01', daysLeft: 3, status: 'amber', breached: false },
    comments: [{ id: 'c1', content: 'Repair crew dispatched.', author: { id: '2', name: 'Jane Staff', email: '', role: 'staff' }, isInternal: false, createdAt: '2024-01-25T10:00:00Z' }],
    createdBy: { id: '1', name: 'John Resident', email: '', role: 'resident' },
    createdAt: '2024-01-20T08:00:00Z', updatedAt: '2024-01-25T10:00:00Z',
  },
  {
    id: '2', ticketId: 'CR-1025', title: 'Streetlight outage on Oak Avenue', description: 'Three consecutive streetlights not working.',
    category: 'Safety', priority: 'Medium', status: 'Under Review', location: '456 Oak Avenue',
    attachments: [], sla: { deadline: '2024-02-05', daysLeft: 7, status: 'green', breached: false },
    comments: [],
    createdBy: { id: '1', name: 'John Resident', email: '', role: 'resident' },
    createdAt: '2024-01-22T14:00:00Z', updatedAt: '2024-01-22T14:00:00Z',
  },
  {
    id: '3', ticketId: 'CR-1026', title: 'Building permit inquiry', description: 'Need information about obtaining a construction permit.',
    category: 'Permits', priority: 'Low', status: 'Resolved', location: '789 Elm Street',
    attachments: [], sla: { deadline: '2024-01-30', daysLeft: 0, status: 'green', breached: false },
    comments: [],
    createdBy: { id: '1', name: 'John Resident', email: '', role: 'resident' },
    createdAt: '2024-01-15T09:00:00Z', updatedAt: '2024-01-28T16:00:00Z',
  },
];

export default function RequestsPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<CivicRequest | null>(null);

  const filtered = requests.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSearch = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleRequestCreated = (request: CivicRequest) => {
    setRequests((current) => [request, ...current]);
    setShowSubmitForm(false);
  };

  const handleRequestChanged = (request: CivicRequest) => {
    setRequests((current) => current.map((item) => (item.id === request.id ? request : item)));
    setSelectedTicket(request);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Requests</h1>
        <Button onClick={() => setShowSubmitForm(true)} className="gap-2">
          <Plus className="h-5 w-5" /> New Request
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" aria-label="Search requests" />
        </div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Submitted">Submitted</TabsTrigger>
            <TabsTrigger value="In Progress">Active</TabsTrigger>
            <TabsTrigger value="Resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} message="No requests found" cta="Submit New Request" onCtaClick={() => setShowSubmitForm(true)} />
      ) : (
        <div className="grid gap-4">
          {filtered.map((req) => (
            <TicketCard key={req.id} request={req} onClick={() => setSelectedTicket(req)} />
          ))}
        </div>
      )}

      <Dialog open={showSubmitForm} onOpenChange={setShowSubmitForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Submit New Civic Request</DialogTitle></DialogHeader>
          <RequestSubmissionForm onSuccess={handleRequestCreated} />
        </DialogContent>
      </Dialog>

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
