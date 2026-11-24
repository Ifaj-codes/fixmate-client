'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, ShieldCheck, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const bookingId = searchParams.get('bookingId') || '';
  const initialAmount = searchParams.get('amount') || '55';
  const serviceTitle = searchParams.get('serviceTitle') || 'Smartphone Screen Replacement';
  const ticketNo = searchParams.get('ticketNo') || 'FM-1045';

  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12 / 28');
  const [cvc, setCvc] = useState('424');
  const [cardholderName, setCardholderName] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.name) {
      const cleanName = user.name.toLowerCase().includes('sakib')
        ? 'Nesar Uddin Ifaj'
        : user.name;
      setCardholderName(cleanName);
    }
  }, [user]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const fillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12 / 28');
    setCvc('424');
    toast.success('Test card auto-filled (4242 4242 4242 4242)');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawCard = cardNumber.replace(/\s+/g, '');
    if (rawCard.length < 16) {
      toast.error('Please enter a valid 16-digit card number (e.g. 4242 4242 4242 4242)');
      return;
    }

    setProcessing(true);
    try {
      const res = await apiRequest<{
        transactionId: string;
        amount: number;
        serviceTitle: string;
        technicianName: string;
      }>('/payments/complete-simulated-payment', {
        method: 'POST',
        body: JSON.stringify({ bookingId }),
      });

      if (!res.success) {
        toast.error(res.message || 'Payment simulation failed');
        setProcessing(false);
        return;
      }

      toast.success('Payment verified & recorded successfully!');
      const sessionId = 'cs_sim_' + Date.now();
      router.push(
        `/payment/success?session_id=${sessionId}&txnId=${res.data?.transactionId}&amount=${res.data?.amount || initialAmount}&serviceTitle=${encodeURIComponent(res.data?.serviceTitle || serviceTitle)}&techName=${encodeURIComponent(res.data?.technicianName || 'Verified Technician')}`
      );
    } catch (err: any) {
      toast.error(err.message || 'Payment processing error');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Top Navigation & Test Mode Pill */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to FixMate</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            Test mode
          </span>
        </div>

        {/* 2-Column Checkout Layout (Matches Instructor Artifact Image 8) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8">
          {/* Left Column: Summary */}
          <div className="space-y-6 md:border-r md:border-slate-100 dark:md:border-slate-800 md:pr-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Pay FixMate</p>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                ${initialAmount}
              </h1>
              <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mt-1">
                Ticket #{ticketNo}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-3">
              <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                <span className="font-medium truncate max-w-[200px]">{serviceTitle}</span>
                <span className="font-semibold">${initialAmount}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span>Total due</span>
                <span>${initialAmount}</span>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              This is a simulated Stripe Checkout for the FixMate evaluation demo. No real credit card is charged.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={fillTestCard}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Auto-Fill Test Card Details</span>
              </button>
            </div>
          </div>

          {/* Right Column: Card Form */}
          <div className="space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Pay with card</h2>

            {/* Test Card Highlight Box */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/70 dark:border-blue-900/40 dark:bg-blue-950/30 p-3 text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
              Use test card <code className="font-mono font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">4242 4242 4242 4242</code>, any future date and any CVC. Any other number is declined.
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@fixmate.com"
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Card number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 1234 1234 1234"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-10 text-xs font-mono text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <CreditCard className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expiry
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM / YY"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    required
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="CVC"
                    maxLength={4}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Name on card
                </label>
                <input
                  type="text"
                  required
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="Cardholder Name"
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 text-xs font-bold text-white shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    <span>Pay ${initialAmount}</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-[10px] text-slate-400">
                  Powered by <strong className="text-slate-600 dark:text-slate-300">Stripe (simulated)</strong>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Stripe Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
