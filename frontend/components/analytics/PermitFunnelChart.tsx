'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { stage: 'Submitted', count: 245, color: '#64748b' },
  { stage: 'Doc Verification', count: 198, color: '#3b82f6' },
  { stage: 'Field Inspection', count: 142, color: '#f59e0b' },
  { stage: 'Approved', count: 118, color: '#10b981' },
  { stage: 'Rejected', count: 24, color: '#ef4444' },
];

export function PermitFunnelChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Permit Application Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="stage"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={28}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
