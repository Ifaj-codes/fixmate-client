'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import { CalendarCheck, Clock, CheckCircle2, ArrowRight, Search, Wrench } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';

export default function CustomerOverviewPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomerData() {
      try {
        const res = await apiRequest<{ bookings: any[] }>('/bookings/my');
        if (res.success && res.data) {
          setBookings(res.data.bookings || []);
        }
      } catch (err) {
        console.error('Error fetching bookings', err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomerData();
  }, []);

  const totalRequests = bookings.length;
  const activeJobs = bookings.filter((b) => ['requested', 'accepted', 'in-progress'].includes(b.status)).length;
  const completedJobs = bookings.filter((b) => b.status === 'completed').length;

  return (
    <DashboardLayout allowedRoles={['customer']}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Manage your device repairs, track job milestones, and complete payments securely.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors shrink-0"
          >
            <Search className="h-4 w-4" />
            Book New Repair
          </Link>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatsCard
            title="Total Requests"
            value={totalRequests}
            icon={CalendarCheck}
            description="Lifetime booked repairs"
            color="brand"
          />
          <StatsCard
            title="Active Jobs"
            value={activeJobs}
            icon={Clock}
            description="In progress or awaiting work"
            color="amber"
          />
          <StatsCard
            title="Completed Jobs"
            value={completedJobs}
            icon={CheckCircle2}
            description="Finished by technician"
            color="emerald"
          />
        </div>

        {/* Recent Bookings Preview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Repair Bookings</h2>
            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : bookings.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {bookings.slice(0, 4).map((b) => (
                <div key={b._id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={b.serviceImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=150&q=80'}
                      alt={b.serviceTitle}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {b.serviceTitle}
                      </p>
                      <p className="text-xs text-slate-500">
                        Technician: {b.technicianName} • ${b.finalAmount || b.basePrice}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No active bookings found. Explore our services to book your first device fix!
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
