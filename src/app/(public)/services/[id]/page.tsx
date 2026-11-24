'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Wrench,
  Clock,
  MapPin,
  ShieldCheck,
  CreditCard,
  User,
  Calendar,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Repair Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.area || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await apiRequest<{ service: any }>(`/services/${id}`);
        if (res.success && res.data?.service) {
          setService(res.data.service);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchService();
  }, [id]);

  useEffect(() => {
    if (user?.name) {
      const cleanName = user.name.toLowerCase().includes('sakib')
        ? 'Nesar Uddin Ifaj (Customer)'
        : user.name;
      setCustomerName(cleanName);
    }
    if (user?.email) setCustomerEmail(user.email);
    if (user?.phone) setCustomerPhone(user.phone);
    if (user?.area) setAddress(user.area);
  }, [user]);

  // Today's date string in YYYY-MM-DD for date picker min attribute
  const todayString = new Date().toISOString().split('T')[0];

  const handleRequestClick = () => {
    if (!user) {
      router.push(`/sign-in?redirect=${encodeURIComponent(`/services/${id}`)}`);
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerPhone.trim() || !address.trim() || !preferredDate || !problemDescription.trim()) {
      toast.error('Please fill in all booking request fields');
      return;
    }

    if (problemDescription.trim().length < 20) {
      toast.error('Problem description must be at least 20 characters long');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: service._id,
          customerName: customerName.trim() || user?.name || 'Nesar Uddin Ifaj (Customer)',
          customerEmail: customerEmail.trim() || user?.email || 'customer@fixmate.com',
          customerPhone: customerPhone.trim(),
          address: address.trim(),
          preferredDate,
          problemDescription: problemDescription.trim(),
        }),
      });

      if (!res.success) {
        toast.error(res.message || 'Failed to submit booking request');
        return;
      }

      toast.success('Repair request submitted successfully!');
      setRequestSuccess(true);
    } catch (err: any) {
      toast.error(err.message || 'Error submitting booking request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Service Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          This repair service is either unapproved, deactivated by the technician, or does not exist.
        </p>
        <Link
          href="/services"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-700"
        >
          Browse All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-slate-900 dark:hover:text-white">Services</Link>
        <span>/</span>
        <span className="truncate max-w-[200px] text-slate-800 dark:text-slate-200 font-medium">{service.title}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Main Service Details Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Large Image Banner */}
          <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-md dark:border-slate-800 dark:bg-slate-800">
            <img
              src={service.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'}
              alt={service.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="rounded-full bg-white/95 px-3.5 py-1 text-xs font-bold text-slate-800 shadow-md backdrop-blur-md dark:bg-slate-900/90 dark:text-slate-200">
                {service.category}
              </span>
              <span className="rounded-full bg-brand-600 px-3.5 py-1 text-xs font-bold text-white shadow-md">
                {service.serviceMode}
              </span>
            </div>
          </div>

          {/* Title & Info Strip */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {service.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                <Clock className="h-4 w-4 text-brand-600" />
                Duration: <strong className="text-slate-800 dark:text-slate-200">{service.estimatedDuration}</strong>
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                <MapPin className="h-4 w-4 text-brand-600" />
                Service Area: <strong className="text-slate-800 dark:text-slate-200">{service.serviceArea}</strong>
              </span>
            </div>
          </div>

          {/* Service Description */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Service Overview & Scope</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
              {service.description}
            </p>
          </div>

          {/* FixMate Trust & Guarantees */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-950 dark:bg-emerald-950/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              FixMate Customer Protection Guarantee
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-emerald-700 dark:text-emerald-300">
              <li>• Pay-After-Service: Online payment via Stripe unlocks only after technician marks the job completed.</li>
              <li>• Upfront Pricing: Base price displayed; no unexpected hidden checkout markups.</li>
              <li>• Verified Professional: Background-checked technician with certified repair tools.</li>
            </ul>
          </div>
        </div>

        {/* Sidebar: Booking Action Box & Technician Profile */}
        <div className="lg:col-span-4 space-y-6">
          {/* Booking Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs text-slate-400">Starting Price</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                ${service.basePrice}
              </span>
              <span className="text-xs text-slate-500 font-medium">USD base estimate</span>
            </div>

            {/* Role-Restricted Action Button */}
            <div className="mt-6">
              {user && user.role !== 'customer' ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-center dark:border-amber-900/60 dark:bg-amber-950/30">
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                    Notice: Logged in as <strong className="capitalize">{user.role}</strong>. Only customer accounts can submit repair requests.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleRequestClick}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-700 transition-all"
                >
                  <Wrench className="h-4 w-4" />
                  <span>Request Repair Now</span>
                </button>
              )}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800 space-y-2 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <span>Payment Mode</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Post-Completion (Stripe)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Free Cancellation</span>
                <span className="font-semibold text-emerald-600">While in 'Requested' status</span>
              </div>
            </div>
          </div>

          {/* Technician Profile Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Service Technician
            </h3>
            <div className="flex items-center gap-3.5">
              <img
                src={service.technician?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                alt={service.technicianName}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-brand-500/20"
              />
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {service.technicianName}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {service.technician?.area || service.serviceArea}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 border-t border-slate-100 pt-3 dark:border-slate-800">
              {service.technician?.bio || 'Certified specialist with extensive repair experience.'}
            </p>
          </div>
        </div>
      </div>

      {/* Repair Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Send Repair Request</h3>
                  <p className="text-xs text-slate-500">{service.title}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setRequestSuccess(false);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {requestSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Request Sent Successfully!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Technician <strong>{service.technicianName}</strong> has been notified and will review your request.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setRequestSuccess(false);
                    }}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    Close
                  </button>
                  <Link
                    href="/dashboard/customer/bookings"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
                  >
                    <span>Go to My Bookings</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest} className="mt-5 space-y-4">
                {/* Customer Name & Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Customer Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Phone & Address */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+8801..."
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Service Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House, Road, Area"
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Preferred Date (today or future only) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Service Date (Today or Future) *
                  </label>
                  <input
                    type="date"
                    required
                    min={todayString}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Problem Description (min 20 characters) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Problem Description (Min 20 characters) *
                    </label>
                    <span className={`text-[10px] font-medium ${problemDescription.trim().length >= 20 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {problemDescription.trim().length} / 20 chars
                    </span>
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Describe symptoms, model number, how the issue occurred (min 20 characters)..."
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  {problemDescription.trim().length < 20 && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                      ⚠️ Please enter at least {20 - problemDescription.trim().length} more character{20 - problemDescription.trim().length > 1 ? 's' : ''} to describe the issue.
                    </p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Submitting...' : 'Confirm Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
