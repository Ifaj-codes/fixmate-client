'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Receipt, DollarSign, Download, ArrowUpRight } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import jsPDF from 'jspdf';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await apiRequest<{ transactions: any[]; totalRevenue: number }>('/admin/transactions');
        if (res.success && res.data) {
          setTransactions(res.data.transactions || []);
          setTotalRevenue(res.data.totalRevenue || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const downloadReceipt = (p: any) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(12, 140, 233);
    doc.text('FixMate Admin Transaction Audit', 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Settlement Date: ${new Date(p.paidAt || p.createdAt).toLocaleDateString()}`, 20, 33);
    doc.text(`Stripe Session ID: ${p.stripeSessionId}`, 20, 39);

    doc.setDrawColor(200);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(11);
    doc.setTextColor(20);
    doc.text(`Service: ${p.serviceTitle}`, 20, 55);
    doc.text(`Technician: ${p.technicianName} (${p.technicianEmail})`, 20, 63);
    doc.text(`Customer: ${p.customerName} (${p.customerEmail})`, 20, 71);
    doc.text(`Transaction Intent: ${p.transactionId}`, 20, 79);

    doc.setFillColor(245, 247, 250);
    doc.rect(20, 90, 170, 20, 'F');
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text(`Platform Gross Settle Amount: $${p.amount} USD`, 25, 103);

    doc.save(`FixMate_Audit_${p.transactionId}.pdf`);
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Platform Transactions & Revenue Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time audit of all completed Stripe customer checkouts and technician payouts.
          </p>
        </div>

        {/* Total Revenue Highlight Banner (Required above table) */}
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50/50 p-6 shadow-xs dark:border-emerald-950 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Total Platform Revenue
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700 dark:text-emerald-400">
                ${totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">USD Gross</span>
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-600/10 p-3 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-xs font-semibold">
            <DollarSign className="h-5 w-5" />
            <span>{transactions.length} Successful Payments</span>
          </div>
        </div>

        {loading ? (
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        ) : transactions.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold dark:border-slate-800 dark:bg-slate-800/40">
                  <tr>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Technician</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {t.serviceTitle}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{t.customerName}</p>
                        <p className="text-[11px] text-slate-500">{t.customerEmail}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{t.technicianName}</p>
                        <p className="text-[11px] text-slate-500">{t.technicianEmail}</p>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        ${t.amount} USD
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500 truncate max-w-[150px]">
                        {t.transactionId}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(t.paidAt || t.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => downloadReceipt(t)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <Download className="h-3 w-3" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <Receipt className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No Transactions Recorded</h3>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
