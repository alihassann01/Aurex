'use client';

import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, TrendingDown, AlertTriangle, Clock, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { TicketsByStatusChart } from '@/components/analytics/TicketsByStatusChart';
import { ResolutionTimeChart } from '@/components/analytics/ResolutionTimeChart';
import { SLABreachRateChart } from '@/components/analytics/SLABreachRateChart';
import { PermitFunnelChart } from '@/components/analytics/PermitFunnelChart';
import { TopIssuesTable } from '@/components/analytics/TopIssuesTable';
import { toast } from 'sonner';

const kpiCards = [
  { label: 'Total Requests', value: '1,247', change: '+12.5%', trend: 'up', icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
  { label: 'Open Tickets', value: '342', change: '-8.2%', trend: 'down', icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
  { label: 'SLA Breach Rate', value: '4.2%', change: '-1.5%', trend: 'down', icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
  { label: 'Avg Resolution', value: '2.4 days', change: '-0.3', trend: 'down', icon: BarChart3, color: 'text-emerald-500 bg-emerald-500/10' },
];

export default function AnalyticsDashboard() {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-01-31');

  const handleExportPDF = async () => {
    toast.success('Dashboard PDF exported successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in" id="analytics-dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">City performance metrics and insights</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-36 h-9" aria-label="Start date" />
            <span className="text-muted-foreground">to</span>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-36 h-9" aria-label="End date" />
          </div>
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-1">
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">{kpi.value}</p>
                  <div className={cn('flex items-center gap-1 mt-1 text-xs font-medium', kpi.trend === 'up' && kpi.label !== 'SLA Breach Rate' ? 'text-emerald-600' : kpi.trend === 'down' ? 'text-emerald-600' : 'text-red-500')}>
                    {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {kpi.change}
                  </div>
                </div>
                <div className={cn('h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center', kpi.color)}>
                  <kpi.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 2: Tickets by Status + Resolution Time */}
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <TicketsByStatusChart />
        </div>
        <div className="lg:col-span-3">
          <ResolutionTimeChart />
        </div>
      </div>

      {/* Row 3: SLA Breach Rate */}
      <SLABreachRateChart />

      {/* Row 4: Permit Funnel + Top Issues */}
      <div className="grid lg:grid-cols-2 gap-4">
        <PermitFunnelChart />
        <TopIssuesTable />
      </div>

      {/* Row 5: Heatmap placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Complaint Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">Leaflet heatmap will render here with complaint density data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
