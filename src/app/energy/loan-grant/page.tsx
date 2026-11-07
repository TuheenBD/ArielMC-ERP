'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sun, Zap, Landmark } from 'lucide-react';
import CustomerLoanServiceGrant from '@/components/CustomerLoanServiceGrant';

export default function ErpEnergyLoanGrantPage() {
  return (
    <div className="min-h-screen bg-[#0A1A2F] text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#071322]/95 backdrop-blur-md border-b border-emerald-900/50 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/energy/calculator"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>To Energy Engineering Calculator</span>
          </Link>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-amber-400">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white font-heading">
                  Customer Loan Service &amp; Green Grant Desk
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 font-bold">
                  4.5% GREEN REFINANCE
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Ariel Renewable Energy Limited &bull; SREDA Accreditation C-194820
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://energy.arielmc.com/loan-grant"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 border border-emerald-700/50 px-3 py-1.5 rounded-lg transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Launch Public SaaS Loan Desk</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl p-4 sm:p-6">
          <CustomerLoanServiceGrant isErpEmbedded={true} />
        </div>
      </main>
    </div>
  );
}
