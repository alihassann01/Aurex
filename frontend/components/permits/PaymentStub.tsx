'use client';

import React from 'react';
import { Receipt, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PaymentStubProps {
  fee: number;
  permitType: string;
}

export function PaymentStub({ fee, permitType }: PaymentStubProps) {
  const processingFee = Math.round(fee * 0.05);
  const tax = Math.round(fee * 0.08);
  const total = fee + processingFee + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Receipt className="h-5 w-5" /> Fee Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <table className="w-full text-sm" aria-label="Fee breakdown">
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-2 text-muted-foreground">{permitType} Permit Fee</td>
              <td className="py-2 text-right font-medium">${fee.toLocaleString()}</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 text-muted-foreground">Processing Fee (5%)</td>
              <td className="py-2 text-right font-medium">${processingFee.toLocaleString()}</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 text-muted-foreground">Tax (8%)</td>
              <td className="py-2 text-right font-medium">${tax.toLocaleString()}</td>
            </tr>
            <tr className="font-semibold">
              <td className="py-2">Total</td>
              <td className="py-2 text-right text-primary">${total.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full gap-1" aria-label="Generate receipt">
              <Printer className="h-4 w-4" /> Generate Receipt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Receipt</DialogTitle>
            </DialogHeader>
            <div className="p-6 border border-dashed border-border rounded-lg space-y-4" id="printable-receipt">
              <div className="text-center">
                <h3 className="font-bold text-lg">CivicConnect</h3>
                <p className="text-sm text-muted-foreground">Smart City Services</p>
              </div>
              <hr />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Permit Type:</span><span className="font-medium capitalize">{permitType}</span></div>
                <div className="flex justify-between"><span>Base Fee:</span><span>${fee.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Processing:</span><span>${processingFee.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Tax:</span><span>${tax.toLocaleString()}</span></div>
                <hr />
                <div className="flex justify-between font-bold"><span>Total:</span><span>${total.toLocaleString()}</span></div>
              </div>
              <div className="text-center text-xs text-muted-foreground">
                <p>Receipt #{Math.floor(100000 + Math.random() * 900000)}</p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <Button onClick={() => window.print()} className="w-full gap-1">
              <Printer className="h-4 w-4" /> Print Receipt
            </Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
