'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ShieldCheck, Check, X, Filter, FolderKanban, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminServicesApprovalPage() {
  const [services, setServices] = useState<any[]>([]);
  const [approvalFilter, setApprovalFilter] = useState('pending'); // Pending by default as requested in PDF!
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const url = approvalFilter === 'All' ? '/admin/services' : `/admin/services?approvalStatus=${approvalFilter}`;
      const res = await apiRequest<{ services: any[] }>(url);
      if (res.success && res.data) {
        setServices(res.data.services || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [approvalFilter]);

  const handleApproval = async (serviceId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await apiRequest(`/admin/services/${serviceId}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ approvalStatus: status }),
      });

      if (res.success) {
        toast.success(`Service marked as ${status}`);
        fetchServices();
      } else {
        toast.error(res.message || 'Approval action failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Approval error');
    }
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200';
    }
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Service Quality Moderation & Approvals
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Review technician offerings before they are published to public search. Pending services are filtered by default.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 text-xs dark:border-slate-800 dark:bg-slate-900">
            {['pending', 'approved', 'rejected', 'All'].map((status) => (
              <button
                key={status}
                onClick={() => setApprovalFilter(status)}
                className={`rounded-lg px-3 py-1.5 font-semibold capitalize transition-colors ${
                  approvalFilter === status
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        ) : services.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold dark:border-slate-800 dark:bg-slate-800/40">
                  <tr>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Technician</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {services.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=150&q=80'}
                            alt={s.title}
                            className="h-10 w-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="max-w-[220px] sm:max-w-xs">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">{s.title}</p>
                            <span className="text-[11px] text-slate-500">{s.serviceMode} • {s.serviceArea}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{s.technicianName}</p>
                        <p className="text-[11px] text-slate-500">{s.technicianEmail}</p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {s.category}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        ${s.basePrice}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize ${getApprovalBadge(s.approvalStatus)}`}>
                          {s.approvalStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {s.approvalStatus !== 'approved' && (
                            <button
                              onClick={() => handleApproval(s._id, 'approved')}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Approve
                            </button>
                          )}
                          {s.approvalStatus !== 'rejected' && (
                            <button
                              onClick={() => handleApproval(s._id, 'rejected')}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                            >
                              <X className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <ShieldCheck className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No Services Found</h3>
            <p className="mt-1 text-xs text-slate-500">No services match the current moderation filter ({approvalFilter}).</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
