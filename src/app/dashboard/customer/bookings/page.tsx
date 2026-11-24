'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import {
  CreditCard,
  XCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Layers,
  Calendar,
  X,
  FileCheck
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  // Bonus 3: Timeline Tracker Modal State
  const [selectedTimelineBooking, setSelectedTimelineBooking] = useState<any | null>(null);

  // Bonus 2: Rating & Review Modal State
  const [reviewBooking, setReviewBooking] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await apiRequest<{ bookings: any[] }>('/bookings/my');
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
    fetchBookings();
  }, []);

  // Cancel Booking Action (Only allowed for 'requested' status)
  const confirmCancel = async () => {
    if (!cancellingBookingId) return;
    setCancelling(true);
    try {
      const res = await apiRequest(`/bookings/${cancellingBookingId}/cancel`, {
        method: 'PATCH',
      });
      if (res.success) {
        toast.success('Booking cancelled successfully');
        setCancellingBookingId(null);
        fetchBookings();
      } else {
        toast.error(res.message || 'Failed to cancel booking');
      }
    } catch (err: any) {
      toast.error(err.message || 'Cancellation error');
    } finally {
      setCancelling(false);
    }
  };

  // Pay Now Action (Stripe Checkout initialization)
  const handlePayNow = async (bookingId: string) => {
    setPayingBookingId(bookingId);
    try {
      const res = await apiRequest<{ url: string; sessionId: string }>('/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ bookingId }),
      });

      if (res.success && res.data?.url) {
        toast.info('Redirecting to Stripe secure checkout...');
        window.location.href = res.data.url;
      } else {
        toast.error(res.message || 'Failed to create checkout session');
        setPayingBookingId(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation error');
      setPayingBookingId(null);
    }
  };

  // Submit Rating & Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;
    setSubmittingReview(true);
    try {
      const res = await apiRequest(`/bookings/${reviewBooking._id}/review`, {
        method: 'POST',
        body: JSON.stringify({ rating, review: reviewText }),
      });
      if (res.success) {
        toast.success('Thank you! Your review has been saved.');
        setReviewBooking(null);
        setReviewText('');
        fetchBookings();
      } else {
        toast.error(res.message || 'Failed to submit review');
      }
    } catch (err: any) {
      toast.error(err.message || 'Review submission error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'accepted':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'rejected':
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <DashboardLayout allowedRoles={['customer']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Repair Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor real-time progress of all requested repairs and manage payments.
          </p>
        </div>

        {loading ? (
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        ) : bookings.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold dark:border-slate-800 dark:bg-slate-800/40">
                  <tr>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Technician</th>
                    <th className="py-3.5 px-4">Preferred Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Job Status</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      {/* Service Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.serviceImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=150&q=80'}
                            alt={b.serviceTitle}
                            className="h-10 w-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="max-w-[180px] sm:max-w-xs">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">{b.serviceTitle}</p>
                            <span className="text-[11px] text-slate-500">{b.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Technician */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {b.technicianName}
                      </td>

                      {/* Preferred Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(b.preferredDate).toLocaleDateString()}
                      </td>

                      {/* Amount: basePrice or finalAmount */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        ${b.finalAmount || b.basePrice}
                        {b.finalAmount !== b.basePrice && (
                          <span className="block text-[10px] text-slate-400 font-normal">Base: ${b.basePrice}</span>
                        )}
                      </td>

                      {/* Job Status Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadge(b.status)}`}>
                          {b.status}
                        </span>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-3.5 px-4">
                        {b.paymentStatus === 'paid' ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Unpaid
                          </span>
                        )}
                      </td>

                      {/* Actions: Cancel, Pay Now, Timeline, Review */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Timeline Tracker Button */}
                          <button
                            onClick={() => setSelectedTimelineBooking(b)}
                            title="View Job Timeline"
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                          >
                            <Clock className="h-4 w-4" />
                          </button>

                          {/* Cancel Button (ONLY when status === 'requested') */}
                          {b.status === 'requested' && (
                            <button
                              onClick={() => setCancellingBookingId(b._id)}
                              className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                            >
                              Cancel
                            </button>
                          )}

                          {/* Pay Now Button (ONLY when status === 'completed' and paymentStatus === 'unpaid') */}
                          {b.status === 'completed' && b.paymentStatus === 'unpaid' && (
                            <button
                              onClick={() => handlePayNow(b._id)}
                              disabled={payingBookingId === b._id}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <CreditCard className="h-3.5 w-3.5" />
                              {payingBookingId === b._id ? 'Starting...' : 'Pay Now'}
                            </button>
                          )}

                          {/* Review Button for Paid Jobs */}
                          {b.paymentStatus === 'paid' && !b.rating && (
                            <button
                              onClick={() => setReviewBooking(b)}
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                            >
                              <Star className="h-3 w-3 fill-amber-500" />
                              Review
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
            <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No Bookings Yet</h3>
            <p className="mt-1 text-xs text-slate-500">You haven't requested any device repairs yet.</p>
            <Link
              href="/services"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Browse Services
            </Link>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Cancellation */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-center animate-in fade-in zoom-in-95">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <XCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Cancel Repair Request?</h3>
            <p className="mt-2 text-xs text-slate-500">
              Are you sure you want to cancel this booking? This action is permanent and cannot be undone.
            </p>
            <div className="mt-6 flex justify-center gap-2.5">
              <button
                onClick={() => setCancellingBookingId(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelling}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bonus 3: Visual Job Timeline Tracker Modal */}
      {selectedTimelineBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Job Progress Tracker
              </h3>
              <button
                onClick={() => setSelectedTimelineBooking(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4">
              <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">{selectedTimelineBooking.serviceTitle}</p>
              <p className="text-[11px] text-slate-400">Technician: {selectedTimelineBooking.technicianName}</p>

              {/* Step Flow List */}
              <div className="mt-6 space-y-6 relative border-l-2 border-brand-200 ml-4 dark:border-slate-700">
                {['requested', 'accepted', 'in-progress', 'completed', 'paid'].map((stage, idx) => {
                  const isCurrent = selectedTimelineBooking.status === stage;
                  const isPassed = ['completed', 'paid'].includes(selectedTimelineBooking.status) || idx <= ['requested', 'accepted', 'in-progress', 'completed'].indexOf(selectedTimelineBooking.status);

                  return (
                    <div key={stage} className="relative pl-6">
                      <div
                        className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 ${
                          isPassed
                            ? 'bg-brand-600 border-white dark:border-slate-900'
                            : 'bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-600'
                        }`}
                      />
                      <p className="text-xs font-bold capitalize text-slate-800 dark:text-slate-200">
                        {stage.replace('-', ' ')}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {stage === 'requested' && 'Request submitted by customer'}
                        {stage === 'accepted' && 'Technician scheduled repair slot'}
                        {stage === 'in-progress' && 'Hardware diagnostics and part replacement in progress'}
                        {stage === 'completed' && 'Device fixed and tested. Ready for customer checkout'}
                        {stage === 'paid' && 'Payment settled via Stripe'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 text-right dark:border-slate-800">
              <button
                onClick={() => setSelectedTimelineBooking(null)}
                className="rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white dark:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bonus 2: Rating & Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rate & Review Service</h3>
            <p className="text-xs text-slate-500 mt-1">{reviewBooking.serviceTitle}</p>

            <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
              {/* Star selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Review Comment (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="How was the technician's professionalism and repair quality?"
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewBooking(null)}
                  className="rounded-xl border border-slate-300 px-4 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="rounded-xl bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
