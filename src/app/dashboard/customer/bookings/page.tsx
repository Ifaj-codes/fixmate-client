'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  FileCheck,
  Smartphone,
  Laptop,
  Tv,
  Wind,
  Zap,
  Disc,
  Wrench,
  Package,
  MapPin,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

// Helper to pick category icon and colors matching instructor demo
function getServiceCategoryVisual(serviceTitle: string = '') {
  const t = serviceTitle.toLowerCase();
  if (t.includes('phone') || t.includes('smartphone') || t.includes('screen') || t.includes('battery')) {
    return {
      icon: Smartphone,
      bg: 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400',
    };
  }
  if (t.includes('laptop') || t.includes('pc') || t.includes('macbook') || t.includes('computer')) {
    return {
      icon: Laptop,
      bg: 'bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-950/40 dark:border-purple-900 dark:text-purple-400',
    };
  }
  if (t.includes('refrigerator') || t.includes('fridge') || t.includes('freezer')) {
    return {
      icon: Package,
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400',
    };
  }
  if (t.includes('ac') || t.includes('air') || t.includes('cooling')) {
    return {
      icon: Wind,
      bg: 'bg-teal-50 border-teal-200 text-teal-600 dark:bg-teal-950/40 dark:border-teal-900 dark:text-teal-400',
    };
  }
  if (t.includes('tv') || t.includes('television') || t.includes('backlight') || t.includes('led')) {
    return {
      icon: Tv,
      bg: 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400',
    };
  }
  if (t.includes('washing') || t.includes('machine') || t.includes('pump')) {
    return {
      icon: Disc,
      bg: 'bg-sky-50 border-sky-200 text-sky-600 dark:bg-sky-950/40 dark:border-sky-900 dark:text-sky-400',
    };
  }
  if (t.includes('wiring') || t.includes('electrical') || t.includes('switch') || t.includes('fan')) {
    return {
      icon: Zap,
      bg: 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-950/40 dark:border-yellow-900 dark:text-yellow-400',
    };
  }
  return {
    icon: Wrench,
    bg: 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
  };
}

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

export default function CustomerBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'topay' | 'paid' | 'closed'>('all');

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

  // Pay Now Action -> Opens simulated Stripe Checkout page
  const handlePayNow = (bookingId: string) => {
    router.push(`/payment/checkout?bookingId=${bookingId}`);
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

  // Filter calculations matching instructor artifact:
  // All, Active (requested, accepted, in-progress), To pay (completed && unpaid), Paid (paid), Closed (rejected, cancelled)
  const counts = useMemo(() => {
    const all = bookings.length;
    const active = bookings.filter((b) => ['requested', 'accepted', 'in-progress'].includes(b.status)).length;
    const toPay = bookings.filter((b) => b.status === 'completed' && b.paymentStatus !== 'paid').length;
    const paid = bookings.filter((b) => b.paymentStatus === 'paid').length;
    const closed = bookings.filter((b) => ['rejected', 'cancelled', 'completed'].includes(b.status)).length;
    return { all, active, toPay, paid, closed };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return bookings.filter((b) => ['requested', 'accepted', 'in-progress'].includes(b.status));
      case 'topay':
        return bookings.filter((b) => b.status === 'completed' && b.paymentStatus !== 'paid');
      case 'paid':
        return bookings.filter((b) => b.paymentStatus === 'paid');
      case 'closed':
        return bookings.filter((b) => ['rejected', 'cancelled'].includes(b.status) || (b.status === 'completed' && b.paymentStatus === 'paid'));
      case 'all':
      default:
        return bookings;
    }
  }, [bookings, activeTab]);

  return (
    <DashboardLayout allowedRoles={['customer']}>
      <div className="space-y-6">
        {/* Top Header & Filter Pills (matching Claude artifact screenshot) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              My bookings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track each repair from request to payment.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#0f4a42] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              All {counts.all}
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'active'
                  ? 'bg-[#0f4a42] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Active {counts.active}
            </button>
            <button
              onClick={() => setActiveTab('topay')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'topay'
                  ? 'bg-[#0f4a42] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              To pay {counts.toPay}
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'paid'
                  ? 'bg-[#0f4a42] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Paid {counts.paid}
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'closed'
                  ? 'bg-[#0f4a42] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Closed {counts.closed}
            </button>
          </div>
        </div>

        {/* Bookings List Cards */}
        {loading ? (
          <div className="space-y-4">
            <div className="h-44 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-44 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const visual = getServiceCategoryVisual(b.serviceTitle);
              const IconComp = visual.icon;
              const isUnpaid = b.paymentStatus !== 'paid';
              const isCompleted = b.status === 'completed';
              const isRequested = b.status === 'requested';

              // Ticket display
              const ticketNumber = b.ticketNo || ('FM-' + (b._id?.slice(-4) || '1045'));

              return (
                <div
                  key={b._id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Left Side: Icon & Details */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Category Tinted Square Icon Box */}
                      <div
                        className={`flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl border ${visual.bg}`}
                      >
                        <IconComp className="h-8 w-8 sm:h-10 sm:w-10" />
                      </div>

                      {/* Main Service Info */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          {b.serviceTitle}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                          {b.technicianName || 'Certified Technician'},{' '}
                          <span className="text-slate-400">{b.technicianEmail}</span>
                        </p>
                        <p className="text-xs text-slate-400">
                          Requested {formatDate(b.createdAt)} &bull; Preferred {formatDate(b.preferredDate)}
                        </p>

                        {/* Customer Address */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 font-medium flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{b.address || 'Address provided during booking'}</span>
                        </p>

                        {/* Customer Problem Description */}
                        {b.problemDescription && (
                          <div className="mt-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                            {b.problemDescription}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side: Ticket, Badges, Price, Actions */}
                    <div className="flex flex-col items-start md:items-end justify-between md:min-w-[220px] shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 space-y-3">
                      {/* Ticket # and Badges */}
                      <div className="w-full md:text-right space-y-1.5">
                        <div className="text-xs font-mono font-medium text-slate-400">
                          Ticket #{ticketNumber}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 md:justify-end">
                          {/* Status Badge */}
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
                                : b.status === 'rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                                : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {b.status === 'in-progress' ? 'In progress' : b.status}
                          </span>

                          {/* Payment Badge */}
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              b.paymentStatus === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {b.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="w-full md:text-right">
                        <span className="text-[11px] text-slate-400 block">
                          {isCompleted ? 'Final amount' : 'Starting price'}
                        </span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          ${b.finalAmount || b.basePrice}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="w-full flex flex-col gap-2">
                        {/* Cancel Button (only for requested status) */}
                        {isRequested && (
                          <button
                            onClick={() => setCancellingBookingId(b._id)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors text-center"
                          >
                            Cancel request
                          </button>
                        )}

                        {/* Pay Now Button (Warm Orange #f97316 matching Image 2) */}
                        {isCompleted && isUnpaid && (
                          <button
                            onClick={() => handlePayNow(b._id)}
                            className="w-full rounded-xl bg-[#f97316] hover:bg-[#ea580c] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all flex items-center justify-center gap-2"
                          >
                            <CreditCard className="h-4 w-4" />
                            Pay now
                          </button>
                        )}

                        {/* Rate & Review Button (if paid) */}
                        {b.paymentStatus === 'paid' && !b.reviewed && (
                          <button
                            onClick={() => setReviewBooking(b)}
                            className="w-full rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            Rate & Review
                          </button>
                        )}

                        {/* Bonus 3: Timeline Tracker Modal Trigger */}
                        <button
                          onClick={() => setSelectedTimelineBooking(b)}
                          className="w-full text-center text-xs text-brand-600 dark:text-brand-400 hover:underline pt-1 flex items-center justify-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          View Timeline Tracker
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <Layers className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
              No bookings found in this category
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Browse our services catalog to schedule a device repair.
            </p>
            <Link
              href="/services"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0f4a42] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0c3c35]"
            >
              Explore Services Catalog
            </Link>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {cancellingBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Cancel Repair Request?
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCancellingBookingId(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={confirmCancel}
                  disabled={cancelling}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bonus 2: Rating & Review Modal */}
        {reviewBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  Rate & Review Service
                </h3>
                <button
                  onClick={() => setReviewBooking(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Service: <span className="font-bold">{reviewBooking.serviceTitle}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Technician: {reviewBooking.technicianName}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">
                      {rating} / 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Review Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe your repair experience, technician punctuality and device performance..."
                    required
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewBooking(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="rounded-xl bg-[#0f4a42] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0c3c35] disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bonus 3: Timeline Tracker Modal */}
        {selectedTimelineBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-brand-600" />
                    Repair Pipeline Tracker
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ticket #{selectedTimelineBooking.ticketNo || ('FM-' + selectedTimelineBooking._id?.slice(-4))} &bull; {selectedTimelineBooking.serviceTitle}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTimelineBooking(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 5-Step Visual Stepper */}
              <div className="mt-6 space-y-6">
                {[
                  {
                    step: 1,
                    key: 'requested',
                    title: '1. Request Submitted',
                    desc: 'Your booking has been received and logged in the technician dispatch queue.',
                    time: formatDate(selectedTimelineBooking.createdAt),
                  },
                  {
                    step: 2,
                    key: 'accepted',
                    title: '2. Technician Assigned & Accepted',
                    desc: `${selectedTimelineBooking.technicianName || 'Technician'} confirmed the schedule for ${formatDate(selectedTimelineBooking.preferredDate)}.`,
                    time: selectedTimelineBooking.status !== 'requested' ? 'Confirmed' : 'Pending',
                  },
                  {
                    step: 3,
                    key: 'in-progress',
                    title: '3. Repair in Progress',
                    desc: 'Technician is actively diagnosing hardware faults and executing the repair.',
                    time: ['in-progress', 'completed'].includes(selectedTimelineBooking.status) ? 'Underway' : 'Upcoming',
                  },
                  {
                    step: 4,
                    key: 'completed',
                    title: '4. Repair Completed',
                    desc: `Hardware tested & confirmed functional. Final bill: $${selectedTimelineBooking.finalAmount || selectedTimelineBooking.basePrice}.`,
                    time: selectedTimelineBooking.status === 'completed' ? 'Done' : 'Upcoming',
                  },
                  {
                    step: 5,
                    key: 'paid',
                    title: '5. Paid & Verified',
                    desc: selectedTimelineBooking.paymentStatus === 'paid' ? 'Payment processed via Stripe. Official invoice generated.' : 'Awaiting payment confirmation.',
                    time: selectedTimelineBooking.paymentStatus === 'paid' ? 'Paid' : 'Unpaid',
                  },
                ].map((s, idx) => {
                  const isDone =
                    (s.key === 'requested' && ['requested', 'accepted', 'in-progress', 'completed'].includes(selectedTimelineBooking.status)) ||
                    (s.key === 'accepted' && ['accepted', 'in-progress', 'completed'].includes(selectedTimelineBooking.status)) ||
                    (s.key === 'in-progress' && ['in-progress', 'completed'].includes(selectedTimelineBooking.status)) ||
                    (s.key === 'completed' && selectedTimelineBooking.status === 'completed') ||
                    (s.key === 'paid' && selectedTimelineBooking.paymentStatus === 'paid');

                  const isCurrent =
                    (s.key === 'requested' && selectedTimelineBooking.status === 'requested') ||
                    (s.key === 'accepted' && selectedTimelineBooking.status === 'accepted') ||
                    (s.key === 'in-progress' && selectedTimelineBooking.status === 'in-progress') ||
                    (s.key === 'completed' && selectedTimelineBooking.status === 'completed' && selectedTimelineBooking.paymentStatus !== 'paid') ||
                    (s.key === 'paid' && selectedTimelineBooking.paymentStatus === 'paid');

                  return (
                    <div key={s.step} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : isCurrent
                              ? 'bg-amber-500 text-white animate-pulse'
                              : 'bg-slate-200 text-slate-500 dark:bg-slate-800'
                          }`}
                        >
                          {isDone ? '✓' : s.step}
                        </div>
                        {idx < 4 && (
                          <div
                            className={`w-0.5 h-10 mt-1 ${
                              isDone ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-xs sm:text-sm font-bold ${
                              isDone
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-400 dark:text-slate-600'
                            }`}
                          >
                            {s.title}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-400">{s.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedTimelineBooking(null)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                >
                  Close Tracker
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
