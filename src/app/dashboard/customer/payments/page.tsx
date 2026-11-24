'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { CreditCard, Download, Receipt, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import jsPDF from 'jspdf';

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await apiRequest<{ payments: any[] }>('/payments/my');
        if (res.success && res.data) {
          setPayments(res.data.payments || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  const downloadReceipt = (p: any) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(12, 140, 233);
    doc.text('FixMate Payment Receipt', 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Receipt Date: ${new Date(p.paidAt || p.createdAt).toLocaleDateString()}`, 20, 33);
    doc.text(`Transaction ID: ${p.transactionId}`, 20, 39);

    doc.setDrawColor(200);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(11);
    doc.setTextColor(20);
    doc.text(`Service: ${p.serviceTitle}`, 20, 55);
    doc.text(`Technician: ${p.technicianName}`, 20, 63);
    doc.text(`Customer: ${p.customerName}`, 20, 71);
    doc.text(`Payment Gateway: Stripe Checkout (USD)`, 20, 79);

    doc.setFillColor(245, 247, 250);
    doc.rect(20, 90, 170, 20, 'F');
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text(`Total Amount Paid: $${p.amount} USD`, 25, 103);

    doc.save(`FixMate_Receipt_${p.transactionId}.pdf`);
  };

  return (
    <DashboardLayout allowedRoles={['customer']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Payment History & Receipts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            View all completed Stripe transactions and download official PDF repair invoices.
          </p>
        </div>

        {loading ? (
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        ) : payments.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold dark:border-slate-800 dark:bg-slate-800/40">
                  <tr>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Technician</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {p.serviceTitle}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {p.technicianName}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        ${p.amount} USD
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500 truncate max-w-[140px]">
                        {p.transactionId}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(p.paidAt || p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => downloadReceipt(p)}
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
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No Transactions Yet</h3>
            <p className="mt-1 text-xs text-slate-500">Payments will appear here once you complete a repair checkout.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
