'use client';

import React, { useState } from 'react';
import type { UserRole } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Building2, ArrowRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { registerUser } from '@/lib/auth';
import axios from 'axios';

// Role options for the selector
const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  { value: 'resident', label: 'Resident', description: 'Submit requests & track permits' },
  { value: 'staff', label: 'Staff', description: 'Handle assigned civic tickets' },
  { value: 'department_admin', label: 'Department Admin', description: 'Manage department operations' },
  { value: 'super_admin', label: 'Super Admin', description: 'Full system administration' },
];

function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case 'resident': return '/resident';
    case 'staff': return '/staff';
    case 'department_admin': return '/dept-admin';
    case 'super_admin': return '/super-admin';
    default: return '/resident';
  }
}

// Zod schema matching backend User model fields
// Backend: { name: required, email: required+unique, password: required, role: optional(defaults to 'resident') }
const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').trim(),
    email: z.string().email('Please enter a valid email address').trim(),
    role: z.enum(['resident', 'staff', 'department_admin', 'super_admin'], {
      required_error: 'Please select a role',
    }),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'resident' },
  });

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }),
    onSuccess: (data) => {
      // Backend returns token + user on register, so auto-login
      loginStore(data.user, data.token);

      // Set cookies for middleware
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `civic-token=${data.token}; path=/; max-age=${maxAge}`;
      document.cookie = `civic-role=${data.user.role}; path=/; max-age=${maxAge}`;

      toast.success('Account created successfully! Welcome to CivicConnect.');
      router.push(getDashboardRoute(data.user.role));
    },
    onError: (error: unknown) => {
      // Show exact backend error message (e.g. "Email already in use")
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Registration failed. Please try again.';
        toast.error(message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-16 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CivicConnect</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Join your
            <br />
            <span className="text-emerald-200">community today.</span>
          </h1>
          <p className="text-emerald-100/80 text-lg max-w-md leading-relaxed">
            Create your free account and become an active participant in making your city smarter and more responsive.
          </p>

          <div className="mt-12 space-y-4">
            {[
              '🏗️ Submit and track civic requests',
              '📋 Apply for permits digitally',
              '📢 Stay informed with city announcements',
              '📊 Access real-time city analytics',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-emerald-100">
                <span className="text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CivicConnect</span>
          </div>

          <Card className="border-0 shadow-none lg:border lg:shadow-sm">
            <CardHeader className="space-y-1 px-0 lg:px-6">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 lg:px-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    error={errors.name?.message}
                    {...register('name')}
                    aria-label="Full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="relative">
                    <select
                      id="role"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer pr-10"
                      {...register('role')}
                      aria-label="Select your role"
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} — {opt.description}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                    aria-label="Email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
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

                <div className="space-y-2">
                  <Label htmlFor="reg-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="reg-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      error={errors.confirmPassword?.message}
                      {...register('confirmPassword')}
                      aria-label="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base"
                  isLoading={mutation.isPending}
                  id="register-submit-btn"
                >
                  {!mutation.isPending && (
                    <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                  {mutation.isPending && 'Creating account...'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
