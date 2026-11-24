'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Smartphone,
  Laptop,
  Wind,
  Tv,
  Zap,
  Sparkles,
  Star,
  Layers,
  Clock,
  CreditCard
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await apiRequest<{ services: any[] }>('/services?featured=true');
        if (res.success && res.data?.services) {
          setFeaturedServices(res.data.services);
        }
      } catch (e) {
        console.error('Failed to load featured services', e);
      } finally {
        setLoadingServices(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/services');
    }
  };

  const categories = [
    { name: 'Smartphone', icon: Smartphone, count: 'Screen, Battery & IC' },
    { name: 'Laptop & PC', icon: Laptop, count: 'Thermal, Board & OS' },
    { name: 'AC', icon: Wind, count: 'Jet Wash & Gas Refill' },
    { name: 'Refrigerator', icon: Layers, count: 'Cooling & Compressor' },
    { name: 'TV', icon: Tv, count: 'Backlight & Motherboard' },
    { name: 'Washing Machine', icon: Sparkles, count: 'Drum & Water Pump' },
    { name: 'Electrical', icon: Zap, count: 'Circuit Breaker & Wiring' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero / Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/50 to-white dark:from-slate-900 dark:to-slate-950 pt-12 pb-20 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700 dark:border-brand-900/50 dark:bg-brand-950/50 dark:text-brand-300">
                <ShieldCheck className="h-4 w-4 text-brand-600" />
                <span>Verified Technicians • 100% Pay-After-Service</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.15]">
                Broken Device? <br />
                <span className="text-brand-600 dark:text-brand-400">Get It Fixed</span> by Verified Technicians
              </h1>

              <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg max-w-2xl leading-relaxed">
                FixMate connects you with verified repair experts for smartphones, laptops, ACs, refrigerators, TVs, and home appliances. Track your job in real-time and pay online only after the service is complete.
              </p>

              {/* Hero Search Box & CTA */}
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto lg:mx-0">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by device (e.g. iPhone, Inverter AC, Laptop)..."
                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand-500/25 hover:bg-brand-700 transition-all shrink-0"
                >
                  <span>Find Service</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Trust Indicators */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> Transparent Pricing
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> Home Visit & Drop-off
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> Safe Stripe Checkout
                </span>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                  alt="Technician repairing electronic hardware"
                  className="h-80 w-full rounded-2xl object-cover"
                />
                <div className="mt-3 p-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Expert Diagnostics & Repairs</p>
                    <p className="text-[11px] text-slate-500">Over 1,200+ satisfied customers</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    <span>4.9 / 5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dynamic Featured Services Section (Latest 6 approved & available) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              <Sparkles className="h-4 w-4" />
              <span>Top Rated Listings</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Featured Repair Services
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Explore the latest certified technician repair services ready for immediate booking.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors"
          >
            <span>View All Services</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingServices ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : featuredServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
            <p className="text-sm text-slate-500">No approved services available at the moment.</p>
          </div>
        )}
      </section>

      {/* 3. Extra Section 1: How FixMate Works (4-Step Visual Flow) */}
      <section className="bg-slate-100/70 dark:bg-slate-900/50 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Simple & Reliable Process
            </span>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              How FixMate Works
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              A transparent, 4-step workflow designed to protect your device and your money.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow-sm">
                1
              </span>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Find a Service</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Browse approved repair services by device category, location, and upfront starting rates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow-sm">
                2
              </span>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Send a Request</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Submit device issues, preferred date, and location. Your assigned technician reviews and accepts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow-sm">
                3
              </span>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Technician Fixes It</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Track status from Accepted to In Progress. Technician sets verified final amount only upon completion.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow-sm">
                4
              </span>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Pay After Completion</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Inspect your working device and pay safely online with Stripe. Zero advance payment pressure!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Extra Section 2: Popular Categories & Platform Trust Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Specialized Categories
          </span>
          <h2 className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Popular Repair Categories
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Click on any category to explore all available verified technician services.
          </p>
        </div>

        {/* Clickable Category Cards leading to /services?category=... */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center hover:border-brand-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 transition-all"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white dark:bg-slate-800 dark:text-brand-400 dark:group-hover:bg-brand-600 transition-all">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                  {cat.name}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{cat.count}</p>
              </Link>
            );
          })}
        </div>

        {/* Why Choose FixMate Platform Stats */}
        <div className="mt-16 rounded-3xl border border-brand-200 bg-gradient-to-r from-brand-600 to-brand-800 p-8 text-white shadow-xl dark:border-slate-800 sm:p-12">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <p className="text-3xl font-extrabold sm:text-4xl">100%</p>
              <p className="mt-1 text-xs sm:text-sm text-brand-100 font-medium">Verified Technicians</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold sm:text-4xl">1,500+</p>
              <p className="mt-1 text-xs sm:text-sm text-brand-100 font-medium">Jobs Completed</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold sm:text-4xl">4.9 / 5</p>
              <p className="mt-1 text-xs sm:text-sm text-brand-100 font-medium">Customer Rating</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold sm:text-4xl">$0</p>
              <p className="mt-1 text-xs sm:text-sm text-brand-100 font-medium">Advance Payment</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
