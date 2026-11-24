'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw, CalendarCheck } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <XCircle className="h-10 w-10" />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Payment Cancelled
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          You cancelled the checkout process. Your booking remains in <strong>Completed</strong> status and you can attempt payment whenever you are ready.
        </p>

        <div className="mt-8 flex flex-col gap-2.5">
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-xs font-semibold text-white shadow-md hover:bg-brand-700 transition-colors"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Return to My Bookings</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
