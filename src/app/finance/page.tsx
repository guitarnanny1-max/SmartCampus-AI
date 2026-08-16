'use client';

import React, { useState } from 'react';
import { Sparkles, DollarSign, CreditCard, ArrowLeft, CheckCircle2, Download, FileText, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function FinanceModule() {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePayment = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus OS</h1>
            <span className="text-[10px] text-slate-400">Fee Management & Financial Gateway</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Institutional Finance & Fee Operations</h2>
            <p className="text-xs text-slate-400 mt-1">Automated fee collection, real-time reconciliation, and secure gateway integrations.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full w-fit">
            <Shield className="w-3.5 h-3.5" /> PCI-DSS Compliant Gateway
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Total Collected (Q2)</div>
            <div className="text-3xl font-extrabold mt-2 text-white">₹1.84 Cr</div>
            <div className="text-[10px] text-cyan-400 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12.4% vs last quarter
            </div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Pending Dues</div>
            <div className="text-3xl font-extrabold mt-2 text-amber-400">₹14.2 Lakhs</div>
            <div className="text-[10px] text-slate-400 mt-1">42 Defaulter accounts</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Collection Rate</div>
            <div className="text-3xl font-extrabold mt-2 text-white">92.8%</div>
            <div className="text-[10px] text-cyan-400 mt-1">Automated reminders active</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs text-slate-400">Online UPI / Cards</div>
            <div className="text-3xl font-extrabold mt-2 text-white">84.5%</div>
            <div className="text-[10px] text-cyan-400 mt-1">Preferred parent payment mode</div>
          </div>
        </div>

        {/* Invoice & Payment Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Invoice Breakdown */}
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Active Student Invoice #INV-2026-884</span>
              </h3>
              <span className="text-xs text-slate-400">Student: Aarav Sharma (Grade 10)</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-slate-800 text-slate-300">
                  <span>Tuition Fee (Q2 - 2026)</span>
                  <span className="font-semibold text-white">₹18,500</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800 text-slate-300">
                  <span>Laboratory & Tech Fee</span>
                  <span className="font-semibold text-white">₹3,500</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800 text-slate-300">
                  <span>Transport & GPS Telemetry Svc</span>
                  <span className="font-semibold text-white">₹2,500</span>
                </div>
                <div className="flex justify-between py-3 text-sm font-extrabold text-white">
                  <span>Total Payable Amount</span>
                  <span className="text-cyan-400">₹24,500</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3 text-slate-400">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Due Date: August 31, 2026. Late fee of ₹500 applicable post deadline.</span>
              </div>
            </div>
          </div>

          {/* Secure Payment Gateway Simulation */}
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>Instant Payment Gateway</span>
              </h3>

              {paid ? (
                <div className="p-8 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Payment Successful!</h4>
                  <p className="text-xs text-slate-300">Transaction ID: TXN_9948210384. Receipt automatically sent to parent WhatsApp & Email.</p>
                  <button
                    onClick={() => alert('Official Tax Invoice PDF downloaded successfully!')}
                    className="mt-3 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 mx-auto"
                  >
                    <Download className="w-4 h-4" /> Download Official Receipt
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="font-bold text-white">Select Payment Method</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-cyan-950/40 border border-cyan-500/50 rounded-xl text-white font-semibold text-center cursor-pointer">
                        UPI / QR Code
                      </div>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-center cursor-pointer hover:border-slate-700">
                        Credit / Debit Card
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={paying}
                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-cyan-950 text-xs flex items-center justify-center gap-2 cursor-pointer mt-6"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{paying ? 'Processing Secure Payment...' : 'Pay ₹24,500 Securely Now'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-2">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Secured with 256-bit SSL Encryption & Razorpay Enterprise Infrastructure</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
