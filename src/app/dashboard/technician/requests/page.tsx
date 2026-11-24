'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
  Calendar,
  Layers,
  Wrench
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

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

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'requested' | 'accepted' | 'in-progress' | 'completed'>('All');
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
      const res = await apiRequest<{ bookings: any[] }>('/bookings/technician');
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
  }, []);

  // Handle Accept or Start Work status transition
  const handleStatusTransition = async (bookingId: string, nextStatus: string) => {
    try {
      const res = await apiRequest(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ nextStatus }),
      });

      if (res.success) {
        if (nextStatus === 'accepted') {
          toast.success('Job accepted.');
        } else if (nextStatus === 'in-progress') {
          toast.success('Job started. Now in progress.');
        } else {
          toast.success(`Job status changed to '${nextStatus}'`);
        }
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

  // Calculate dynamic tab counts
  const counts = useMemo(() => {
    const all = bookings.length;
    const requested = bookings.filter((b) => b.status === 'requested').length;
    const accepted = bookings.filter((b) => b.status === 'accepted').length;
    const inProgress = bookings.filter((b) => b.status === 'in-progress').length;
    const completed = bookings.filter((b) => b.status === 'completed').length;
    return { all, requested, accepted, inProgress, completed };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (activeTab === 'All') return bookings;
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  return (
    <DashboardLayout allowedRoles={['technician']}>
      <div className="space-y-6">
        {/* Header & Filter Tabs matching Image 5 & 6 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Manage requests
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Move each job forward one step at a time.
            </p>
          </div>

          {/* Filter Pills matching Image 5 & 6 */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'All'
                  ? 'bg-[#0f4a42] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              All {counts.all}
            </button>
            <button
              onClick={() => setActiveTab('requested')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'requested'
                  ? 'bg-[#0f4a42] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Requested {counts.requested}
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'accepted'
                  ? 'bg-[#0f4a42] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Accepted {counts.accepted}
            </button>
            <button
              onClick={() => setActiveTab('in-progress')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'in-progress'
                  ? 'bg-[#0f4a42] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              In progress {counts.inProgress}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'completed'
                  ? 'bg-[#0f4a42] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Completed {counts.completed}
            </button>
          </div>
        </div>

        {/* Requests List Cards */}
        {loading ? (
          <div className="space-y-4">
            <div className="h-44 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-44 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const ticketNumber = b.ticketNo || ('FM-' + (b._id?.slice(-4) || '1051'));

              return (
                <div
                  key={b._id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Left: Service & Customer Details */}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {b.serviceTitle}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Requested {formatDate(b.createdAt)}, preferred {formatDate(b.preferredDate)}
                      </p>

                      <div className="pt-1 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                          <p>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">Customer:</span>{' '}
                            {b.customerName}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">Phone:</span>{' '}
                            {b.customerPhone}
                          </p>
                        </div>
                        <p>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">Address:</span>{' '}
                          {b.address}
                        </p>
                      </div>

                      {/* Problem Description Box */}
                      {b.problemDescription && (
                        <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                          {b.problemDescription}
                        </div>
                      )}
                    </div>

                    {/* Right: Ticket, Badges, Price, Pipeline Buttons */}
                    <div className="flex flex-col items-start md:items-end justify-between md:min-w-[200px] shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 space-y-3">
                      <div className="w-full md:text-right space-y-1.5">
                        <div className="text-xs font-mono font-medium text-slate-400">
                          Ticket #{ticketNumber}
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center md:justify-end">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                              b.status === 'requested'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                                : b.status === 'accepted'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                                : b.status === 'in-progress'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                                : b.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {b.status === 'in-progress' ? 'In progress' : b.status}
                          </span>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="w-full md:text-right">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          ${b.finalAmount || b.basePrice}
                        </span>
                      </div>

                      {/* Pipeline Action Buttons */}
                      <div className="w-full">
                        {/* Status: Requested -> Accept / Reject buttons */}
                        {b.status === 'requested' && (
                          <div className="flex items-center gap-2 w-full">
                            <button
                              onClick={() => handleStatusTransition(b._id, 'accepted')}
                              className="flex-1 rounded-xl bg-[#044E45] hover:bg-[#033b34] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors text-center"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => setRejectingBookingId(b._id)}
                              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {/* Status: Accepted -> Start work button */}
                        {b.status === 'accepted' && (
                          <button
                            onClick={() => handleStatusTransition(b._id, 'in-progress')}
                            className="w-full rounded-xl bg-[#044E45] hover:bg-[#033b34] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors text-center"
                          >
                            Start work
                          </button>
                        )}

                        {/* Status: In Progress -> Mark completed button */}
                        {b.status === 'in-progress' && (
                          <button
                            onClick={() => openCompleteModal(b)}
                            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors text-center"
                          >
                            Mark completed
                          </button>
                        )}

                        {/* Status: Completed -> Shows receipt / payment status */}
                        {b.status === 'completed' && (
                          <div className="text-right">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-semibold ${
                                b.paymentStatus === 'paid'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {b.paymentStatus === 'paid' ? 'Paid ✓' : 'Awaiting Payment'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <ClipboardList className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
              No requests in '{activeTab.replace('-', ' ')}'
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              New customer requests will show up here as soon as they book.
            </p>
          </div>
        )}

        {/* Mark Completed Modal with Final Amount input */}
        {completingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Finalize Repair & Set Bill
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Service: <span className="font-semibold">{completingBooking.serviceTitle}</span>
                <br />
                Base estimate: ${completingBooking.basePrice}
              </p>

              <form onSubmit={submitCompletion} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Final Bill Amount ($ USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={finalAmount}
                      onChange={(e) => setFinalAmount(e.target.value)}
                      placeholder="e.g. 55"
                      className="w-full rounded-xl border border-slate-200 py-2 pl-7 pr-3 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Include spare parts, labor and diagnostics.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCompletingBooking(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={completing}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {completing ? 'Completing...' : 'Confirm Completed'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reject Confirmation Modal */}
        {rejectingBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Decline Repair Request?
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you sure you want to decline this job request? The customer will be informed.
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectingBookingId(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmReject}
                  disabled={rejecting}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  {rejecting ? 'Rejecting...' : 'Yes, Decline'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
