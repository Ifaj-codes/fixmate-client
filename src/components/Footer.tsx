import React from 'react';
import Link from 'next/link';
import { Wrench, Mail, Phone, MapPin, Github, Linkedin, Facebook } from 'lucide-react';

// Custom modern X (formerly Twitter) logo icon
function XLogo({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Fix<span className="text-brand-600 dark:text-brand-400">Mate</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Bangladesh’s verified device & home appliance repair booking network. Transparent pricing, step-by-step job tracking, and pay-after-service guarantee.
            </p>
            {/* Social Links with New X Logo */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:hover:text-white transition-colors"
                aria-label="Follow us on X"
              >
                <XLogo className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://github.com/Ifaj-codes"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:hover:text-white transition-colors"
                aria-label="GitHub profile"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/in/nesar-uddin-ifaj"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:hover:text-white transition-colors"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:hover:text-white transition-colors"
                aria-label="Facebook page"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Quick Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  How It Works & About
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Join as Technician
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Popular Services
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/services?category=Smartphone" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Smartphone Screen & Battery
                </Link>
              </li>
              <li>
                <Link href="/services?category=Laptop+%26+PC" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Laptop Thermal & Motherboard
                </Link>
              </li>
              <li>
                <Link href="/services?category=AC" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Inverter AC Master Jet Wash
                </Link>
              </li>
              <li>
                <Link href="/services?category=Refrigerator" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Refrigerator Cooling Diagnostics
                </Link>
              </li>
              <li>
                <Link href="/services?category=Washing+Machine" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Washing Machine Motor & Drum
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Contact & Support
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand-600 dark:text-brand-400 mt-0.5 shrink-0" />
                <span>Cumilla Cantonment, Cumilla & Dhanmondi, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span>+880 1615-869724</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span>support@fixmate.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
          <p>© {new Date().getFullYear()} FixMate Platform. All rights reserved. Crafted with Next.js, Express & MongoDB.</p>
        </div>
      </div>
    </footer>
  );
}
