'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Wrench,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  PlusCircle,
  FolderKanban,
  ClipboardList,
  Users,
  ShieldCheck,
  Receipt,
  UserCheck,
  LogOut,
  Home,
  Menu,
  X as CloseIcon,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'technician' | 'admin')[];
}

export default function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Route protection and role authorization check
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their respective dashboard if unauthorized
        if (user.role === 'admin') router.push('/dashboard/admin');
        else if (user.role === 'technician') router.push('/dashboard/technician');
        else router.push('/dashboard/customer');
      }
    }
  }, [user, loading, allowedRoles, pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your FixMate workspace...</p>
        </div>
      </div>
    );
  }

  // Dynamic menu items based on user role
  const getMenuItems = () => {
    if (user.role === 'admin') {
      return [
        { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
        { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
        { label: 'Service Approval', href: '/dashboard/admin/services', icon: ShieldCheck },
        { label: 'All Bookings', href: '/dashboard/admin/bookings', icon: ClipboardList },
        { label: 'Transactions', href: '/dashboard/admin/transactions', icon: Receipt },
      ];
    }
    if (user.role === 'technician') {
      return [
        { label: 'Overview', href: '/dashboard/technician', icon: LayoutDashboard },
        { label: 'Add Service', href: '/dashboard/technician/add-service', icon: PlusCircle },
        { label: 'My Services', href: '/dashboard/technician/my-services', icon: FolderKanban },
        { label: 'Manage Requests', href: '/dashboard/technician/requests', icon: ClipboardList },
      ];
    }
    // Customer
    return [
      { label: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
      { label: 'My Bookings', href: '/dashboard/customer/bookings', icon: CalendarCheck },
      { label: 'Payment History', href: '/dashboard/customer/payments', icon: CreditCard },
    ];
  };

  const menuItems = getMenuItems();

  const getRoleBadge = () => {
    if (user.role === 'admin') {
      return <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">Admin</span>;
    }
    if (user.role === 'technician') {
      return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">Technician</span>;
    }
    return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">Customer</span>;
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-900 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Fix<span className="text-brand-600 dark:text-brand-400">Mate</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Role Tag */}
        <div className="border-b border-slate-100 px-5 py-3 dark:border-slate-800/80">
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Current Workspace</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
              {user.role} Portal
            </span>
            {getRoleBadge()}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/dashboard/profile"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                pathname === '/dashboard/profile'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <UserCheck className="h-4 w-4 shrink-0" />
              <span>Update Profile</span>
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer with Home & Logout */}
        <div className="border-t border-slate-200 p-3 dark:border-slate-800 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Home className="h-4 w-4 text-slate-500" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 capitalize">
              {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
              </button>
            )}

            {/* User Profile Pill in Topbar */}
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50/50 p-1 pr-3 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={user.name}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-600"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[120px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Dashboard Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
