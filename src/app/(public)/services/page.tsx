'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, ArrowUpDown, RotateCcw, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';

const CATEGORIES = [
  'All',
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

const SERVICE_MODES = ['All', 'Home Visit', 'Shop Drop-off'];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial query params from URL
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialMode = searchParams.get('serviceMode') || 'All';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [serviceMode, setServiceMode] = useState(initialMode);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  const [services, setServices] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params if user navigates back/forward
  useEffect(() => {
    setCategory(searchParams.get('category') || 'All');
    setSearchTerm(searchParams.get('search') || '');
    setServiceMode(searchParams.get('serviceMode') || 'All');
    setSort(searchParams.get('sort') || 'newest');
    setPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  // Fetch data from server whenever query parameters change (Challenge 1: Server-side search, filter, sort)
  useEffect(() => {
    async function fetchFilteredServices() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm.trim()) queryParams.set('search', searchTerm.trim());
        if (category && category !== 'All') queryParams.set('category', category);
        if (serviceMode && serviceMode !== 'All') queryParams.set('serviceMode', serviceMode);
        if (sort) queryParams.set('sort', sort);
        queryParams.set('page', String(page));
        queryParams.set('limit', '9');

        // Update browser URL query string without page refresh so filters persist on reload
        const newUrl = `/services?${queryParams.toString()}`;
        router.replace(newUrl, { scroll: false });

        const res = await apiRequest<{
          services: any[];
          total: number;
          totalPages: number;
          currentPage: number;
        }>(`/services?${queryParams.toString()}`);

        if (res.success && res.data) {
          setServices(res.data.services || []);
          setTotalCount(res.data.total || 0);
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (err) {
        console.error('Failed to fetch filtered services:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredServices();
  }, [category, searchTerm, serviceMode, sort, page, router]);

  const handleResetFilters = () => {
    setCategory('All');
    setSearchTerm('');
    setServiceMode('All');
    setSort('newest');
    setPage(1);
    router.push('/services');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Browse Verified Repair Services
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Showing {totalCount} certified repair offerings. Filter by device category, service delivery mode, and pricing.
        </p>
      </div>

      {/* Filter and Search Bar Controls (Challenge 1) */}
      <div className="mb-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, device or symptom..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm text-slate-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Service Mode Dropdown */}
          <div className="md:col-span-2">
            <select
              value={serviceMode}
              onChange={(e) => {
                setServiceMode(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm text-slate-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {SERVICE_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  Mode: {mode}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-2">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm text-slate-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Tags & Reset */}
        {(category !== 'All' || serviceMode !== 'All' || searchTerm.trim() || sort !== 'newest') && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-500">Active Filters:</span>
            {category !== 'All' && (
              <span className="rounded-md bg-brand-50 px-2.5 py-1 font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                Category: {category}
              </span>
            )}
            {serviceMode !== 'All' && (
              <span className="rounded-md bg-brand-50 px-2.5 py-1 font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                Mode: {serviceMode}
              </span>
            )}
            {searchTerm.trim() && (
              <span className="rounded-md bg-brand-50 px-2.5 py-1 font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                "{searchTerm}"
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Services Grid (3-4 on desktop, 2 on tablet, 1 on mobile) */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No repair services matched</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, choosing another category, or clearing active filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All Filters
          </button>
        </div>
      )}

      {/* Server-Side Pagination (Bonus 4) */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                page === pageNum
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
