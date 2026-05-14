'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const data = [
  { rank: 1, category: 'Pothole Repair', location: 'Downtown District', count: 87 },
  { rank: 2, category: 'Streetlight Outage', location: 'North Side', count: 64 },
  { rank: 3, category: 'Water Leak', location: 'West End', count: 52 },
  { rank: 4, category: 'Noise Complaint', location: 'Entertainment District', count: 41 },
  { rank: 5, category: 'Sidewalk Damage', location: 'University Area', count: 38 },
];

export function TopIssuesTable() {
  const handleExportCSV = () => {
    const csv = [
      'Rank,Category,Location,Count',
      ...data.map((d) => `${d.rank},${d.category},${d.location},${d.count}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'top-issues.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Top Issues</CardTitle>
        <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1" aria-label="Export CSV">
          <Download className="h-3.5 w-3.5" /> CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Top issues table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 px-2 text-muted-foreground font-medium">#</th>
                <th className="text-left py-2.5 px-2 text-muted-foreground font-medium">Category</th>
                <th className="text-left py-2.5 px-2 text-muted-foreground font-medium">Location</th>
                <th className="text-right py-2.5 px-2 text-muted-foreground font-medium">Count</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.rank} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 px-2 font-semibold text-primary">{row.rank}</td>
                  <td className="py-2.5 px-2 font-medium">{row.category}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{row.location}</td>
                  <td className="py-2.5 px-2 text-right">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {row.count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
