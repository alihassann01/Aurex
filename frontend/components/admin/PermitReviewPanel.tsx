'use client';

import React, { useState } from 'react';
import { CheckCircle2, ClipboardCheck, Search, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn, formatDate } from '@/lib/utils';
import { PERMIT_STATUS_COLORS } from '@/lib/constants';
import type { Permit, PermitStatus } from '@/types';

const reviewPermits: Permit[] = [
  {
    id: 'permit-review-1',
    permitNumber: 'PRM-12345',
    type: 'construction',
    status: 'Approved',
    applicantName: 'John Resident',
    address: '123 Main Street',
    description: 'Residential renovation and facade improvements',
    documents: [],
    fee: 1500,
    expiryDate: '2027-06-01',
    createdAt: '2026-05-01T10:00:00.000Z',
    updatedAt: '2026-05-10T10:00:00.000Z',
  },
  {
    id: 'permit-review-2',
    permitNumber: 'PRM-12346',
    type: 'event',
    status: 'Field Inspection',
    applicantName: 'Nadia Patel',
    address: 'Civic Center Park',
    description: 'Community cultural fair with temporary food vendors',
    documents: [],
    fee: 500,
    createdAt: '2026-05-03T10:00:00.000Z',
    updatedAt: '2026-05-12T10:00:00.000Z',
  },
  {
    id: 'permit-review-3',
    permitNumber: 'PRM-12347',
    type: 'business',
    status: 'Document Verification',
    applicantName: 'Omar Malik',
    businessName: 'Elm Street Kitchen',
    address: '789 Elm Street',
    description: 'New small restaurant license',
    documents: [],
    fee: 2000,
    createdAt: '2026-05-05T10:00:00.000Z',
    updatedAt: '2026-05-11T10:00:00.000Z',
  },
];

const statusOptions: PermitStatus[] = [
  'Submitted',
  'Document Verification',
  'Field Inspection',
  'Approved',
  'Rejected',
];

export function PermitReviewPanel() {
  const [permits, setPermits] = useState(reviewPermits);
  const [query, setQuery] = useState('');

  const filteredPermits = permits.filter((permit) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [permit.permitNumber, permit.type, permit.applicantName, permit.address, permit.description]
      .some((value) => value.toLowerCase().includes(needle));
  });

  const setStatus = (id: string, status: PermitStatus) => {
    setPermits((current) =>
      current.map((permit) =>
        permit.id === id
          ? {
              ...permit,
              status,
              rejectionReason:
                status === 'Rejected' ? 'Please attach corrected zoning and insurance documents.' : undefined,
              updatedAt: new Date().toISOString(),
            }
          : permit
      )
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Permits Office</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Permit Review Queue</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Verify documents, advance inspections, and approve or reject permit applications.
          </p>
        </div>
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search permits"
            className="pl-10"
            aria-label="Search permits"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'In Review', value: permits.filter((item) => !['Approved', 'Rejected'].includes(item.status)).length, icon: ClipboardCheck },
          { label: 'Approved', value: permits.filter((item) => item.status === 'Approved').length, icon: CheckCircle2 },
          { label: 'Rejected', value: permits.filter((item) => item.status === 'Rejected').length, icon: XCircle },
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Applications</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {filteredPermits.map((permit) => (
            <div key={permit.id} className="rounded-lg border bg-card p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{permit.permitNumber}</span>
                    <span className={cn('h-2 w-2 rounded-full', PERMIT_STATUS_COLORS[permit.status])} />
                    <Badge variant="outline" className="capitalize">
                      {permit.type}
                    </Badge>
                  </div>
                  <h3 className="font-semibold">{permit.applicantName}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{permit.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {permit.address} / Updated {formatDate(permit.updatedAt)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                  <select
                    value={permit.status}
                    onChange={(event) => setStatus(permit.id, event.target.value as PermitStatus)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    aria-label={`Update status for ${permit.permitNumber}`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <span className="text-right text-sm font-semibold text-primary">${permit.fee.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
