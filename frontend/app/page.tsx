'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  FileText,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const featureRows = [
  {
    icon: Shield,
    title: 'Requests',
    description: 'Resident reports, staff queues, status pipelines, SLA markers, and public comments.',
  },
  {
    icon: FileText,
    title: 'Permits',
    description: 'Guided applications, document upload, fee receipts, review stages, and certificates.',
  },
  {
    icon: Bell,
    title: 'Announcements',
    description: 'City alerts, events, emergency broadcasts, category filters, and registration counts.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Operational KPIs, resolution trends, permit funnels, issue rankings, and heatmap data.',
  },
];

const stats = [
  { value: '50K+', label: 'service records' },
  { value: '99.2%', label: 'SLA compliance' },
  { value: '24/7', label: 'resident access' },
  { value: '4 roles', label: 'resident to admin' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/20 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">CivicConnect</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gap-1">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section
        className="relative flex min-h-[86vh] items-end overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(7, 12, 24, 0.76), rgba(7, 12, 24, 0.22)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85')",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pb-20 pt-28 text-white sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.26em] text-white/75">
              Smart civic services
            </p>
            <h1 className="text-5xl font-extrabold leading-[0.95] sm:text-6xl lg:text-7xl">
              CivicConnect
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
              A single light, fast portal for residents, staff, department admins, and city leadership
              to move requests, permits, announcements, and analytics through one operating system.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="h-12 w-full gap-2 bg-white text-foreground hover:bg-white/90 sm:w-auto">
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full border-white/50 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                >
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden self-end border-l border-white/30 pl-6 text-sm text-white/82 lg:block">
            <p className="font-semibold uppercase tracking-[0.22em] text-white">Live modules</p>
            <div className="mt-5 space-y-4">
              {featureRows.map((feature) => (
                <div key={feature.title} className="flex gap-3">
                  <feature.icon className="mt-0.5 h-5 w-5 text-white" />
                  <div>
                    <p className="font-semibold text-white">{feature.title}</p>
                    <p className="mt-1 leading-6">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="border-l border-border px-5 first:border-l-0">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">Platform map</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            Built for every civic user, from first report to final review.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featureRows.map((feature) => (
            <div key={feature.title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="rounded-lg border border-border bg-background p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {['Resident', 'Staff', 'Dept Admin'].map((role, index) => (
                <div key={role} className="border-l-4 border-primary bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    0{index + 1}
                  </p>
                  <p className="mt-4 text-lg font-bold">{role}</p>
                  <CheckCircle2 className="mt-8 h-5 w-5 text-primary" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">Ready now</p>
            <h2 className="mt-4 text-3xl font-bold">Routes and workflows for every account type.</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Sign in as a resident, staff user, department administrator, or super admin to land on the
              correct workspace with role-aware navigation and protected access.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Building2 className="h-5 w-5 text-primary" />
            CivicConnect
          </div>
          <p>(c) 2026 CivicConnect. Smart city services portal.</p>
        </div>
      </footer>
    </div>
  );
}
