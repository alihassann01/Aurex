'use client';

import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PermitWizard } from '@/components/permits/PermitWizard';
import { PermitStatusTracker } from '@/components/permits/PermitStatusTracker';
import { DigitalCertificate } from '@/components/permits/DigitalCertificate';
import { PaymentStub } from '@/components/permits/PaymentStub';
import { cn, formatDate } from '@/lib/utils';
import { PERMIT_STATUS_COLORS } from '@/lib/constants';
import type { Permit } from '@/types';

const mockPermits: Permit[] = [
  { id: '1', permitNumber: 'PRM-12345', type: 'construction', status: 'Approved', applicantName: 'John Resident', address: '123 Main St', description: 'Residential renovation', documents: [], fee: 1500, expiryDate: '2025-06-01', createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-20T10:00:00Z' },
  { id: '2', permitNumber: 'PRM-12346', type: 'event', status: 'Field Inspection', applicantName: 'John Resident', address: '456 Oak Ave', description: 'Community fair', documents: [], fee: 500, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-22T10:00:00Z' },
  { id: '3', permitNumber: 'PRM-12347', type: 'business', status: 'Rejected', applicantName: 'John Resident', address: '789 Elm St', description: 'New restaurant', documents: [], fee: 2000, rejectionReason: 'Incomplete zoning documentation. Please submit updated zone clearance.', createdAt: '2024-01-05T10:00:00Z', updatedAt: '2024-01-18T10:00:00Z' },
];

export default function PermitsPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Permits & Applications</h1>
          <p className="text-muted-foreground mt-1">Apply for and track your permits</p>
        </div>
        <Button onClick={() => setShowWizard(true)} className="gap-2" id="new-permit-btn">
          <Plus className="h-5 w-5" /> New Application
        </Button>
      </div>

      {/* Permit List */}
      <div className="grid gap-4">
        {mockPermits.map((permit) => (
          <Card key={permit.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedPermit(permit)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{permit.permitNumber}</span>
                    <span className={cn('w-2 h-2 rounded-full', PERMIT_STATUS_COLORS[permit.status])} />
                    <span className="text-xs text-muted-foreground">{permit.status}</span>
                  </div>
                  <h3 className="font-semibold capitalize">{permit.type} Permit</h3>
                  <p className="text-sm text-muted-foreground mt-1">{permit.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{permit.address} • {formatDate(permit.createdAt)}</p>
                </div>
                <span className="text-sm font-semibold text-primary">${permit.fee.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Permit Wizard Dialog */}
      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Permit Application</DialogTitle>
          </DialogHeader>
          <PermitWizard onSuccess={() => setShowWizard(false)} />
        </DialogContent>
      </Dialog>

      {/* Permit Detail Dialog */}
      {selectedPermit && (
        <Dialog open={!!selectedPermit} onOpenChange={() => setSelectedPermit(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="capitalize">{selectedPermit.type} Permit — {selectedPermit.permitNumber}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <PermitStatusTracker status={selectedPermit.status} rejectionReason={selectedPermit.rejectionReason} onResubmit={() => { setSelectedPermit(null); setShowWizard(true); }} />
              <PaymentStub fee={selectedPermit.fee} permitType={selectedPermit.type} />
              {selectedPermit.status === 'Approved' && (
                <DigitalCertificate
                  permitNumber={selectedPermit.permitNumber}
                  permitType={selectedPermit.type}
                  applicantName={selectedPermit.applicantName}
                  approvalDate={selectedPermit.updatedAt}
                  expiryDate={selectedPermit.expiryDate || '2025-12-31'}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
