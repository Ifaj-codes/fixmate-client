'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  ClipboardList,
  Check,
  X,
  Play,
  CheckCircle2,
  AlertCircle,
  Filter,
  DollarSign,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Mark Completed Modal State (sets finalAmount)
  const [completingBooking, setCompletingBooking] = useState<any | null>(null);
  const [finalAmount, setFinalAmount] = useState('');
  const [completing, setCompleting] = useState(false);

  // Reject Confirmation State
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);

  const fetchRequests = async () => {
    try {
      const url = statusFilter === 'All' ? '/bookings/technician' : `/bookings/technician?status=${statusFilter}`;
      const res = await apiRequest<{ bookings: any[] }>(url);
      if (res.success && res.data) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  // Handle Accept or Start Work status transition
  const handleStatusTransition = async (bookingId: string, nextStatus: string) => {
    try {
      const res = await apiRequest(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ nextStatus }),
      });

      if (res.success) {
        toast.success(`Job status changed to '${nextStatus}'`);
        fetchRequests();
      } else {
        toast.error(res.message || 'Status update failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Status transition error');
    }
  };

  // Confirm Reject
  const confirmReject = async () => {
    if (!rejectingBookingId) return;
    setRejecting(true);
    try {
      const res = await apiRequest(`/bookings/${rejectingBookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ nextStatus: 'rejected' }),
      });
      if (res.success) {
        toast.success('Booking request rejected');
        setRejectingBookingId(null);
        fetchRequests();
      } else {
        toast.error(res.message || 'Failed to reject request');
      }
    } catch (err: any) {
      toast.error(err.message || 'Rejection error');
    } finally {
      setRejecting(false);
    }
  };

  // Open Complete Modal
  const openCompleteModal = (booking: any) => {
    setCompletingBooking(booking);
    setFinalAmount(String(booking.finalAmount || booking.basePrice));
  };

  // Submit Completion with Final Amount
  const submitCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingBooking) return;

    const amountNum = Number(finalAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Final amount must be a positive number greater than 0');
      return;
    }

    setCompleting(true);
    try {
      const res = await apiRequest(`/bookings/${completingBooking._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          nextStatus: 'completed',
          finalAmount: amountNum,
        }),
      });

      if (res.success) {
        toast.success('Job marked as completed! Customer can now pay via Stripe.');
        setCompletingBooking(null);
        fetchRequests();
      } else {
        toast.error(res.message || 'Completion failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Completion error');
    } finally {
      setCompleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200';
      case 'accepted':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <DashboardLayout allowedRoles={['technician']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Manage Repair Requests & Job Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Advance customer repair jobs through strict status checkpoints: Requested → Accepted → In Progress → Completed.
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 text-xs dark:border-slate-800 dark:bg-slate-900">
            {['All', 'requested', 'accepted', 'in-progress', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`rounded-lg px-3 py-1.5 font-semibold capitalize transition-colors ${
                  statusFilter === tab
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        ) : bookings.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold dark:border-slate-800 dark:bg-slate-800/40">
                  <tr>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Issue Description</th>
                    <th className="py-3.5 px-4">Date & Address</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-4 text-right">Pipeline Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900 dark:text-white">{b.customerName}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" />
                          {b.customerPhone}
                        </p>
                      </td>

                      {/* Service Info */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{b.serviceTitle}</p>
                        <span className="text-[11px] text-slate-500">Base: ${b.basePrice}</span>
                      </td>

                      {/* Problem Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2" title={b.problemDescription}>
                          {b.problemDescription}
                        </p>
                      </td>

                      {/* Date & Address */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(b.preferredDate).toLocaleDateString()}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-[140px] mt-0.5">
                          {b.address}
                        </p>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadge(b.status)}`}>
                          {b.status}
                        </span>
                        {b.status === 'completed' && (
                          <div className="mt-1">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              Final: ${b.finalAmount}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Valid Action Buttons (Strict Pipeline Rules) */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 1. requested -> Accept / Reject */}
                          {b.status === 'requested' && (
                            <>
                              <button
                                onClick={() => handleStatusTransition(b._id, 'accepted')}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                              >
                                <Check className="h-3 w-3" />
                                Accept
                              </button>
                              <button
                                onClick={() => setRejectingBookingId(b._id)}
                                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                              >
                                <X className="h-3 w-3" />
                                Reject
                              </button>
                            </>
                          )}

                          {/* 2. accepted -> Start Work (in-progress) */}
                          {b.status === 'accepted' && (
                            <button
                              onClick={() => handleStatusTransition(b._id, 'in-progress')}
                              className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700"
                            >
                              <Play className="h-3 w-3" />
                              Start Work
                            </button>
                          )}

                          {/* 3. in-progress -> Mark Completed (modal for finalAmount) */}
                          {b.status === 'in-progress' && (
                            <button
                              onClick={() => openCompleteModal(b)}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Mark Completed
                            </button>
                          )}

                          {/* Completed / Cancelled / Rejected -> show state indicator */}
                          {b.status === 'completed' && (
                            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                              {b.paymentStatus === 'paid' ? 'Paid by Customer' : 'Awaiting Payment'}
                            </span>
                          )}

                          {['rejected', 'cancelled'].includes(b.status) && (
                            <span className="text-xs text-slate-400 capitalize">
                              {b.status} (Closed)
                            </span>
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
            <ClipboardList className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No Requests Found</h3>
            <p className="mt-1 text-xs text-slate-500">There are no customer bookings under this filter.</p>
          </div>
        )}
      </div>

      {/* Mark Completed Modal (Sets finalAmount) */}
      {completingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Complete Repair Job</h3>
            <p className="text-xs text-slate-500 mt-1">{completingBooking.serviceTitle}</p>

            <form onSubmit={submitCompletion} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Final Verified Amount ($ USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={finalAmount}
                    onChange={(e) => setFinalAmount(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white font-bold"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Base estimate was ${completingBooking.basePrice}. Set actual final bill for spare parts & labor.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompletingBooking(null)}
                  className="rounded-xl border border-slate-300 px-4 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={completing}
                  className="rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {completing ? 'Completing...' : 'Confirm & Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-center animate-in fade-in zoom-in-95">
            <X className="mx-auto h-10 w-10 text-rose-500" />
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">Reject Repair Request?</h3>
            <p className="mt-1 text-xs text-slate-500">
              The customer will be notified that this request cannot be accepted. This is a final state.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setRejectingBookingId(null)}
                className="rounded-xl border border-slate-300 px-4 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={rejecting}
                className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {rejecting ? 'Rejecting...' : 'Yes, Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
