'use client';

import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { week: 'Week 1', breachRate: 5.2 },
  { week: 'Week 2', breachRate: 4.8 },
  { week: 'Week 3', breachRate: 6.1 },
  { week: 'Week 4', breachRate: 3.9 },
  { week: 'Week 5', breachRate: 4.5 },
  { week: 'Week 6', breachRate: 3.2 },
  { week: 'Week 7', breachRate: 4.1 },
  { week: 'Week 8', breachRate: 2.8 },
  { week: 'Week 9', breachRate: 3.5 },
  { week: 'Week 10', breachRate: 4.2 },
  { week: 'Week 11', breachRate: 3.1 },
  { week: 'Week 12', breachRate: 2.5 },
];

export function SLABreachRateChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">SLA Breach Rate Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="breachGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
              label={{ value: 'Breach %', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value}%`, 'Breach Rate']}
            />
            <Area
              type="monotone"
              dataKey="breachRate"
              stroke="#ef4444"
              strokeWidth={2.5}
              fill="url(#breachGradient)"
              dot={{ fill: '#ef4444', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
