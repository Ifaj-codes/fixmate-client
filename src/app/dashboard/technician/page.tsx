'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import { Wrench, ShieldCheck, ClipboardList, PlusCircle, ArrowRight, FolderKanban } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';

export default function TechnicianOverviewPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, requestsRes] = await Promise.all([
          apiRequest<{ services: any[] }>('/services/technician/my'),
          apiRequest<{ bookings: any[] }>('/bookings/technician'),
        ]);

        if (servicesRes.success && servicesRes.data) {
          setServices(servicesRes.data.services || []);
        }
        if (requestsRes.success && requestsRes.data) {
          setRequests(requestsRes.data.bookings || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalServices = services.length;
  const approvedServices = services.filter((s) => s.approvalStatus === 'approved').length;
  const pendingRequests = requests.filter((r) => r.status === 'requested').length;

  return (
    <DashboardLayout allowedRoles={['technician']}>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Technician Workspace: {user?.name} 🛠️
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Manage your hardware repair services, respond to customer requests, and mark milestones.
            </p>
          </div>
          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            Add New Service
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatsCard
            title="Total Services"
            value={totalServices}
            icon={FolderKanban}
            description="Created repair offerings"
            color="brand"
          />
          <StatsCard
            title="Approved Services"
            value={approvedServices}
            icon={ShieldCheck}
            description="Active on public catalog"
            color="emerald"
          />
          <StatsCard
            title="Pending Requests"
            value={pendingRequests}
            icon={ClipboardList}
            description="Awaiting your acceptance"
            color="amber"
          />
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/technician/requests"
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-brand-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Customer Repair Requests</h3>
              <p className="mt-1 text-xs text-slate-500">
                You have {pendingRequests} incoming request(s) waiting for response.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-brand-600" />
          </Link>

          <Link
            href="/dashboard/technician/my-services"
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-brand-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Service Catalog Management</h3>
              <p className="mt-1 text-xs text-slate-500">
                Update descriptions, pricing, toggle availability, and check admin reviews.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-brand-600" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
