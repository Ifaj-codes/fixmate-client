import React from 'react';
import Link from 'next/link';
import { Wrench, ShieldCheck, Clock, CreditCard, Award, CheckCircle2, Users, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 py-12">
      {/* Hero Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
          About FixMate Platform
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          On-Demand Device & Appliance Repairs in Bangladesh
        </h1>
        <p className="max-w-3xl mx-auto text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
          In Bangladesh and worldwide, finding a trustworthy technician has always been challenging. Consumers endure uncertainty over device handling, lack of status updates, and advance payment risks. FixMate solves this through full transparency, verified technicians, and a strict pay-after-completion guarantee.
        </p>
      </section>

      {/* 3 Pillars of FixMate */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verified Specialists</h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Every technician is vetted with verified credentials, identity checks, and equipment inspections before services are approved by platform administrators.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step-by-Step Job Tracking</h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              From Requested to Accepted, In Progress, and Completed — customers always know what stage their device repair is in with zero guesswork.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pay-After-Service Guarantee</h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Customers never pay in advance. The Pay Now button unlocks only when the technician marks the job completed and sets the final verified price.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Quality Protocol */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200 dark:bg-slate-900/40 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Quality Assurance
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                Rigorous Standards for Every Repair
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Whether it is an iPhone micro-soldering job, an Inverter AC nitrogen pressure test, or front-load washing machine drum bearing replacement, our service partners follow standardized technical checklists.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong>OEM & Certified Parts:</strong> Technicians use genuine replacement displays, compressors, and original thermal pastes.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong>Direct In-App Communication:</strong> Verified phone and direct contact details exchanged upon job acceptance.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong>Stripe Safe Processing:</strong> Card details are tokenized securely with Stripe in test/live mode.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
                alt="Technician team at work"
                className="h-80 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl border border-brand-200 bg-gradient-to-r from-brand-600 to-brand-800 p-8 sm:p-12 text-white shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold">Ready to experience hassle-free repairs?</h2>
          <p className="mt-3 text-xs sm:text-sm text-brand-100 max-w-xl mx-auto">
            Book certified repair experts or sign up as a technician to start accepting customer requests today.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-brand-700 hover:bg-brand-50 shadow-sm"
            >
              <span>Explore Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/20"
            >
              Join as Technician
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
