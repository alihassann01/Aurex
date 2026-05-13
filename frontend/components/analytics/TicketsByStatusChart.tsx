'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Submitted', value: 120, color: '#64748b' },
  { name: 'Under Review', value: 85, color: '#3b82f6' },
  { name: 'Assigned', value: 65, color: '#6366f1' },
  { name: 'In Progress', value: 180, color: '#f59e0b' },
  { name: 'Resolved', value: 520, color: '#10b981' },
  { name: 'Closed', value: 277, color: '#9ca3af' },
];

export function TicketsByStatusChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Tickets by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
