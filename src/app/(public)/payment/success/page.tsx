'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Download, CalendarCheck, ShieldCheck, FileText } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import jsPDF from 'jspdf';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function verifyStripePayment() {
      if (!sessionId) {
        setErrorMsg('No payment session ID provided');
        setLoading(false);
        return;
      }

      try {
        const res = await apiRequest<{ payment: any; booking: any }>(`/payments/verify?session_id=${sessionId}`);
        if (res.success && res.data) {
          setPaymentData(res.data.payment);
        } else {
          setErrorMsg(res.message || 'Payment verification could not be completed');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Payment verification error');
      } finally {
        setLoading(false);
      }
    }

    verifyStripePayment();
  }, [sessionId]);

  // Bonus 5: Client-side PDF Invoice Generator
  const downloadInvoicePDF = () => {
    if (!paymentData) return;
    const doc = new jsPDF();

    // Invoice Header
    doc.setFontSize(22);
    doc.setTextColor(12, 140, 233);
    doc.text('FixMate Repair Invoice', 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('FixMate Smart Repair Platform | www.fixmate.com', 20, 32);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 20, 37);

    doc.setDrawColor(200);
    doc.line(20, 42, 190, 42);

    // Bill To & Service Details
    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.text('Transaction Summary', 20, 52);

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Customer Name: ${paymentData.customerName || 'Valued Customer'}`, 20, 62);
    doc.text(`Customer Email: ${paymentData.customerEmail || ''}`, 20, 68);
    doc.text(`Assigned Technician: ${paymentData.technicianName || 'Verified Technician'}`, 20, 74);
    doc.text(`Repair Service: ${paymentData.serviceTitle || 'Hardware Repair'}`, 20, 80);
    doc.text(`Transaction ID: ${paymentData.transactionId || 'pi_verified'}`, 20, 86);
    doc.text(`Stripe Session ID: ${paymentData.stripeSessionId || ''}`, 20, 92);

    // Amount Table Box
    doc.setFillColor(245, 247, 250);
    doc.rect(20, 102, 170, 25, 'F');

    doc.setFontSize(11);
    doc.setTextColor(20);
    doc.text('Total Paid Amount (USD):', 25, 117);
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129);
    doc.text(`$${paymentData.amount} USD`, 140, 117);

    // Footer Note
    doc.setFontSize(9);
    doc.setTextColor(140);
    doc.text('Thank you for choosing FixMate. All completed repairs carry guaranteed quality.', 20, 145);

    doc.save(`FixMate_Invoice_${paymentData.transactionId || 'receipt'}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"></div>
        <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">
          Verifying payment with Stripe security gateway...
        </p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-rose-600">Payment Verification Failed</h2>
        <p className="mt-2 text-xs text-slate-500">{errorMsg}</p>
        <Link
          href="/dashboard/customer/bookings"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white"
        >
          Return to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl text-center dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Payment Successful!
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your payment has been securely verified and your booking status is now marked as <strong>Paid</strong>.
        </p>

        {/* Transaction Summary Card */}
        {paymentData && (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 text-left dark:border-slate-800 dark:bg-slate-800/40 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{paymentData.serviceTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Technician:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{paymentData.technicianName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Paid:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">${paymentData.amount} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                {paymentData.transactionId}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={downloadInvoicePDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download PDF Invoice
          </button>
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-brand-700 transition-colors"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Go to My Bookings</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading payment verification...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
