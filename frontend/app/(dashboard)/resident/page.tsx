'use client';

import React, { useState } from 'react';
import { Plus, Search, Clock, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/shared/SharedComponents';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TicketCard } from '@/components/crms/TicketCard';
import { TicketDetailModal } from '@/components/crms/TicketDetailModal';
import { RequestSubmissionForm } from '@/components/crms/RequestSubmissionForm';
import type { CivicRequest } from '@/types';

// Mock data
const mockRequests: CivicRequest[] = [
  {
    id: '1', ticketId: 'CR-1024', title: 'Pothole on Main Street', description: 'Large pothole near intersection of Main St and 5th Ave causing traffic hazards. Multiple vehicles have been damaged.',
    category: 'Infrastructure', priority: 'High', status: 'In Progress', location: '123 Main Street',
    attachments: [], sla: { deadline: '2024-02-01', daysLeft: 3, status: 'amber', breached: false },
    comments: [
      { id: 'c1', content: 'We have dispatched a repair crew to assess the damage.', author: { id: '2', name: 'Jane Staff', email: 'staff@civic.com', role: 'staff' }, isInternal: false, createdAt: '2024-01-25T10:00:00Z' },
    ],
    createdBy: { id: '1', name: 'John Resident', email: 'resident@civic.com', role: 'resident' },
    createdAt: '2024-01-20T08:00:00Z', updatedAt: '2024-01-25T10:00:00Z',
  },
  {
    id: '2', ticketId: 'CR-1025', title: 'Streetlight outage on Oak Avenue', description: 'Three consecutive streetlights are not working, creating a safety hazard for pedestrians at night.',
    category: 'Safety', priority: 'Medium', status: 'Under Review', location: '456 Oak Avenue',
    attachments: [], sla: { deadline: '2024-02-05', daysLeft: 7, status: 'green', breached: false },
    comments: [],
    createdBy: { id: '1', name: 'John Resident', email: 'resident@civic.com', role: 'resident' },
    createdAt: '2024-01-22T14:00:00Z', updatedAt: '2024-01-22T14:00:00Z',
  },
  {
    id: '3', ticketId: 'CR-1026', title: 'Building permit inquiry', description: 'Need information about obtaining a construction permit for residential renovation.',
    category: 'Permits', priority: 'Low', status: 'Resolved', location: '789 Elm Street',
    attachments: [], sla: { deadline: '2024-01-30', daysLeft: 0, status: 'green', breached: false },
    comments: [],
    createdBy: { id: '1', name: 'John Resident', email: 'resident@civic.com', role: 'resident' },
    createdAt: '2024-01-15T09:00:00Z', updatedAt: '2024-01-28T16:00:00Z',
  },
  {
    id: '4', ticketId: 'CR-1027', title: 'Water main break emergency', description: 'Major water main break flooding residential area. Immediate attention required.',
    category: 'Infrastructure', priority: 'Emergency', status: 'Submitted', location: '321 Pine Road',
    attachments: [], sla: { deadline: '2024-01-26', daysLeft: 1, status: 'red', breached: false },
    comments: [],
    createdBy: { id: '1', name: 'John Resident', email: 'resident@civic.com', role: 'resident' },
    createdAt: '2024-01-25T06:00:00Z', updatedAt: '2024-01-25T06:00:00Z',
  },
];

export default function ResidentDashboard() {
  const user = useAuthStore((s) => s.user);
  const [requests, setRequests] = useState(mockRequests);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<CivicRequest | null>(null);

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = [
    { label: 'Total Requests', value: requests.length, icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'In Progress', value: requests.filter((r) => r.status === 'In Progress').length, icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Resolved', value: requests.filter((r) => r.status === 'Resolved').length, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Urgent', value: requests.filter((r) => r.sla.status === 'red').length, icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
  ];

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {user?.name?.split(' ')[0] || 'Resident'}
          </h1>
          <p className="text-muted-foreground mt-1">Here&apos;s an overview of your civic requests</p>
        </div>
        <Button onClick={() => setShowSubmitForm(true)} className="gap-2 h-11" id="new-request-btn">
          <Plus className="h-5 w-5" /> New Request
        </Button>
      </div>

      {/* KPI Cards */}
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or ticket ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search requests"
          />
        </div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Submitted">Submitted</TabsTrigger>
            <TabsTrigger value="In Progress">Active</TabsTrigger>
            <TabsTrigger value="Resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Request List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={FileText}
          message="No requests found"
          description="Try adjusting your search or filter, or submit a new request."
          cta="Submit New Request"
          onCtaClick={() => setShowSubmitForm(true)}
        />
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <TicketCard
              key={request.id}
              request={request}
              onClick={() => setSelectedTicket(request)}
            />
          ))}
        </div>
      )}

      {/* Submit Request Dialog */}
      <Dialog open={showSubmitForm} onOpenChange={setShowSubmitForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit New Civic Request</DialogTitle>
          </DialogHeader>
          <RequestSubmissionForm onSuccess={handleRequestCreated} />
        </DialogContent>
      </Dialog>

      {/* Ticket Detail Modal */}
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
