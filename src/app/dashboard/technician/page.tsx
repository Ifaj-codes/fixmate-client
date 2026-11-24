'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Wrench,
  ShieldCheck,
  ClipboardList,
  PlusCircle,
  ArrowRight,
  FolderKanban,
  DollarSign,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

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

  // Compute metrics matching Image 3
  const totalServices = services.length;
  const approvedServices = services.filter((s) => s.approvalStatus === 'approved').length;
  const pendingReviewServices = services.filter((s) => s.approvalStatus === 'pending').length;
  const pendingRequests = requests.filter((r) => r.status === 'requested').length;

  // Paid earnings calculation
  const paidBookings = requests.filter((r) => r.paymentStatus === 'paid');
  const totalEarnings = paidBookings.reduce((sum, r) => sum + (Number(r.finalAmount) || Number(r.basePrice) || 0), 0);

  // New requests (e.g. requested or accepted)
  const newRequestsList = requests.filter((r) => ['requested', 'accepted'].includes(r.status));

  return (
    <DashboardLayout allowedRoles={['technician']}>
      <div className="space-y-8">
        {/* Page Title & Subtitle matching Image 3 */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your services, jobs and earnings.
          </p>
        </div>

        {/* 4 Stat Cards matching Image 3 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total services */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total services
            </span>
            <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              {totalServices}
            </div>
          </div>

          {/* Card 2: Approved services */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Approved services
            </span>
            <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              {approvedServices}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {pendingReviewServices} waiting for review
            </p>
          </div>

          {/* Card 3: Pending requests */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pending requests
            </span>
            <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              {pendingRequests}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Waiting for you to accept or decline
            </p>
          </div>

          {/* Card 4: Total earnings (Dark Teal Background #044E45) */}
          <div className="rounded-2xl bg-[#044E45] p-5 shadow-xs text-white">
            <span className="text-xs font-semibold text-teal-100">
              Total earnings
            </span>
            <div className="mt-3 text-3xl font-bold text-white">
              ${totalEarnings}
            </div>
          </div>
        </div>

        {/* 2-Column Section matching Image 3: New requests & Recent earnings */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column: New requests */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                New requests
              </h2>
              <Link
                href="/dashboard/technician/requests"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline"
              >
                Manage requests
              </Link>
            </div>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {newRequestsList.length > 0 ? (
                newRequestsList.map((req) => {
                  const ticketNumber = req.ticketNo || ('FM-' + (req._id?.slice(-4) || '1051'));
                  return (
                    <div key={req._id} className="py-3 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {req.serviceTitle}
                        </p>
                        <p className="text-xs text-slate-400">
                          {req.customerName}, preferred {formatDate(req.preferredDate)}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-medium text-slate-400 shrink-0">
                        #{ticketNumber}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="py-6 text-center text-xs text-slate-400">
                  No pending requests right now.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Recent earnings */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent earnings
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Jobs customers have paid for
              </p>
            </div>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {paidBookings.length > 0 ? (
                paidBookings.map((p) => (
                  <div key={p._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {p.serviceTitle}
                      </p>
                      <p className="text-xs text-slate-400">
                        {p.customerName}, {formatDate(p.updatedAt || p.createdAt)}
                      </p>
                    </div>
                    <span className="text-base font-bold text-slate-900 dark:text-white shrink-0">
                      ${p.finalAmount || p.basePrice}
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-xs text-slate-400">
                  No completed paid jobs yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
