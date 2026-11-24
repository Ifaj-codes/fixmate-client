'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Wrench, Mail, Lock, ArrowRight, ShieldCheck, User, Wrench as TechIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { user, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (redirect) {
        router.push(redirect);
      } else if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user.role === 'technician') {
        router.push('/dashboard/technician');
      } else {
        router.push('/dashboard/customer');
      }
    }
  }, [user, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiRequest<{ token: string; user: any }>('/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!res.success) {
        toast.error(res.message || 'Invalid email or password');
        return;
      }

      toast.success(`Welcome back, ${res.data!.user.name}!`);
      login(res.data!.token, res.data!.user, redirect || undefined);
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Demo account quick filler for testing convenience
  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.info(`Filled credentials for ${demoEmail}`);
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
            <Wrench className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Sign in to FixMate
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Enter your credentials to access your dashboard
          </p>
        </div>

        {/* Demo Accounts Quick-Login Strip for Assignment Evaluation */}
        <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-800 dark:text-brand-300 mb-2">
            ⚡ Quick Test Accounts (Click to Fill)
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillCredentials('admin@fixmate.com', 'Admin123#')}
              className="flex flex-col items-center justify-center rounded-lg border border-rose-200 bg-white p-2 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-400 font-medium"
            >
              <ShieldCheck className="h-3.5 w-3.5 mb-1" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('rahim.tech@fixmate.com', 'Tech123#')}
              className="flex flex-col items-center justify-center rounded-lg border border-amber-200 bg-white p-2 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:bg-slate-900 dark:text-amber-400 font-medium"
            >
              <TechIcon className="h-3.5 w-3.5 mb-1" />
              <span>Technician</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('customer@fixmate.com', 'User123#')}
              className="flex flex-col items-center justify-center rounded-lg border border-blue-200 bg-white p-2 text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:bg-slate-900 dark:text-blue-400 font-medium"
            >
              <User className="h-3.5 w-3.5 mb-1" />
              <span>Customer</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link href="/sign-up" className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
