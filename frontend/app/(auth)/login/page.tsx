'use client';

import React, { useState } from 'react';
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

export default function LoginPage() {
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
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CivicConnect</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Your city,
            <br />
            <span className="text-blue-200">at your fingertips.</span>
          </h1>
          <p className="text-blue-100/80 text-lg max-w-md leading-relaxed">
            Submit civic requests, track permits, stay informed with announcements, and
            help build a smarter city — all from one unified portal.
          </p>

          <div className="mt-12 flex gap-8">
            {[
              { label: 'Requests Resolved', value: '12.4K+' },
              { label: 'Active Citizens', value: '8.2K+' },
              { label: 'Avg Resolution', value: '2.4 days' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-blue-200/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile branding */}
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
                      placeholder="••••••••"
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
