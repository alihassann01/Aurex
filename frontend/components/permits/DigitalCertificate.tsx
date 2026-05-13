'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Award, Calendar, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface DigitalCertificateProps {
  permitNumber: string;
  permitType: string;
  applicantName: string;
  approvalDate: string;
  expiryDate: string;
}

export function DigitalCertificate({ permitNumber, permitType, applicantName, approvalDate, expiryDate }: DigitalCertificateProps) {
  const handleDownloadPDF = () => {
    toast.success('PDF download started');
  };

  return (
    <Card className="border-2 border-emerald-200 dark:border-emerald-800/30 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-card">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2">
          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Award className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
        <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">Permit Approved</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <QRCodeSVG value={`https://civic.gov/verify/${permitNumber}`} size={120} level="M" />
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Permit No:</span>
            <span className="font-mono font-semibold">{permitNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium capitalize">{permitType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Approved:</span>
            <span className="font-medium">{formatDate(approvalDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Expires:</span>
            <span className="font-medium">{formatDate(expiryDate)}</span>
          </div>
        </div>

        <Button onClick={handleDownloadPDF} variant="outline" className="w-full gap-1" aria-label="Download permit PDF">
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </CardContent>
    </Card>
  );
}
