import React from 'react';
import Link from 'next/link';
import { Wrench, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 text-center">
      {/* Repair themed illustration */}
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-brand-400 shadow-xl border border-brand-100 dark:border-slate-700">
          <Wrench className="h-12 w-12 transform -rotate-45" />
        </div>
        <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow-md">
          404
        </span>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        Page Under Repair or Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        We looked everywhere in our toolkit, but the page or repair service you are searching for does not exist or has been removed.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Search className="h-4 w-4" />
          Browse Services
        </Link>
      </div>
    </div>
  );
}
