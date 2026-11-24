import React from 'react';
import { Wrench } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600 dark:border-slate-800 dark:border-t-brand-400"></div>
        <div className="absolute">
          <Wrench className="h-6 w-6 text-brand-600 dark:text-brand-400 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">
        Fetching repair listings & platform data...
      </p>
    </div>
  );
}
