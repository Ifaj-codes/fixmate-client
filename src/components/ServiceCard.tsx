import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, ArrowRight } from 'lucide-react';

export default function ServiceCard({ service }: { service: any }) {
  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div>
        {/* Service Image Banner with Badge */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={service.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-md dark:bg-slate-900/90 dark:text-slate-200">
              {service.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="rounded-full bg-brand-600/90 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
              {service.serviceMode}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <h3 className="line-clamp-2 text-base font-bold text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400 transition-colors">
            {service.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {service.description}
          </p>

          {/* Details strip */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {service.estimatedDuration}
            </span>
            {service.serviceArea && (
              <span className="flex items-center gap-1 truncate max-w-[150px]">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {service.serviceArea}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Starting Price & View Details */}
      <div className="border-t border-slate-100 p-5 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Starting from</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              ${service.basePrice}
            </span>
          </div>
          <Link
            href={`/services/${service._id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-brand-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-brand-600 dark:hover:text-white transition-all"
          >
            View Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="mt-2 text-[11px] text-slate-400 truncate">
          Technician: <span className="font-medium text-slate-700 dark:text-slate-300">{service.technicianName}</span>
        </p>
      </div>
    </div>
  );
}
