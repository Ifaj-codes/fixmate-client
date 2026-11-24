'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import { Users, Wrench, ShieldAlert, DollarSign, ArrowRight, ClipboardList, Receipt } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalTechnicians: 0,
    pendingServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiRequest<{ stats: any }>('/admin/overview');
        if (res.success && res.data?.stats) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System Administration Portal 🛡️
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            FixMate platform master overview, user roles management, service moderation, and revenue tracking.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            description="Registered on platform"
            color="brand"
          />
          <StatsCard
            title="Total Technicians"
            value={stats.totalTechnicians}
            icon={Wrench}
            description="Hardware specialists"
            color="indigo"
          />
          <StatsCard
            title="Pending Services"
            value={stats.pendingServices}
            icon={ShieldAlert}
            description="Waiting for approval"
            color="amber"
          />
          <StatsCard
            title="Total Revenue"
            value={`$${stats.totalRevenue}`}
            icon={DollarSign}
            description="Processed through Stripe"
            color="emerald"
          />
        </div>

        {/* Quick Management Links */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/admin/services"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-brand-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all flex flex-col justify-between"
          >
            <div>
              <ShieldAlert className="h-6 w-6 text-amber-500 mb-2" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Service Approval</h3>
              <p className="mt-1 text-xs text-slate-500">
                Review technician service listings before they go live on public search.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-600">
              <span>Moderate Services</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            href="/dashboard/admin/users"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-brand-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all flex flex-col justify-between"
          >
            <div>
              <Users className="h-6 w-6 text-blue-500 mb-2" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">User Management</h3>
              <p className="mt-1 text-xs text-slate-500">
                Inspect accounts and safely assign customer, technician, or admin roles.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-600">
              <span>Manage Users</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            href="/dashboard/admin/bookings"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-brand-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all flex flex-col justify-between"
          >
            <div>
              <ClipboardList className="h-6 w-6 text-indigo-500 mb-2" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">All Bookings</h3>
              <p className="mt-1 text-xs text-slate-500">
                Monitor all platform repair jobs, status progressions, and technician assignments.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-600">
              <span>Inspect Bookings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            href="/dashboard/admin/transactions"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-brand-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all flex flex-col justify-between"
          >
            <div>
              <Receipt className="h-6 w-6 text-emerald-500 mb-2" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Transactions</h3>
              <p className="mt-1 text-xs text-slate-500">
                Audit Stripe session IDs, payouts, and cumulative platform gross revenue.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-600">
              <span>View Transactions</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
