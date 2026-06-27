'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Building2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { loginUser } from '@/lib/auth';
import type { UserRole } from '@/types';
import axios from 'axios';

// Zod schema — backend has no password rules enforced server-side,
// but we enforce minimum for UX
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case 'resident':
      return '/resident';
    case 'staff':
      return '/staff';
    case 'department_admin':
      return '/dept-admin';
    case 'super_admin':
      return '/super-admin';
    default:
      return '/resident';
  }
}

function LoginPageContent() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => loginUser({ email: data.email, password: data.password }),
    onSuccess: (data) => {
      // Store in Zustand
      login(data.user, data.token);

      // Set cookies for Next.js middleware (7d to match JWT expiry)
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `civic-token=${data.token}; path=/; max-age=${maxAge}`;
      document.cookie = `civic-role=${data.user.role}; path=/; max-age=${maxAge}`;

      toast.success(`Welcome back, ${data.user.name}!`);

      // Redirect to original destination or role-based dashboard
      const redirect = searchParams.get('redirect');
      router.push(redirect || getDashboardRoute(data.user.role));
    },
    onError: (error: unknown) => {
      // Show exact backend error message
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Login failed. Please try again.';
        toast.error(message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 border-r border-border bg-card">
        <div className="flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">CivicConnect</span>
          </div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Secure access</p>
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Return to your civic workspace.
          </h1>
          <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
            Submit civic requests, track permits, stay informed with announcements, and
            help build a smarter city from one unified portal.
          </p>

          <div
            role="img"
            aria-label="Modern residential street"
            className="mt-10 h-56 rounded-lg border border-border bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80')",
            }}
          />

          <div className="mt-12 flex gap-8">
            {[
              { label: 'Requests Resolved', value: '12.4K+' },
              { label: 'Active Citizens', value: '8.2K+' },
              { label: 'Avg Resolution', value: '2.4 days' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CivicConnect</span>
          </div>

          <Card className="border-0 shadow-none lg:border lg:shadow-sm">
            <CardHeader className="space-y-1 px-0 lg:px-6">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Sign in to access your civic services dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 lg:px-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email')}
                    aria-label="Email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="********"
                      autoComplete="current-password"
                      error={errors.password?.message}
                      {...register('password')}
                      aria-label="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-input h-4 w-4 text-primary focus:ring-primary"
                      {...register('rememberMe')}
                      aria-label="Remember me"
                    />
                    <span className="text-sm text-muted-foreground">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base"
                  isLoading={mutation.isPending}
                  id="login-submit-btn"
                >
                  {!mutation.isPending && (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                  {mutation.isPending && 'Signing in...'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Create account
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginPageContent />
    </Suspense>
  );
}
