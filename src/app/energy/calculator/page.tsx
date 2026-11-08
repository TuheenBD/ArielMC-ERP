'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sun, Zap, ShieldCheck, FileSpreadsheet, Building2, Sparkles, Landmark, Calculator } from 'lucide-react';
import SolarEngineeringCalculator from '@/components/SolarEngineeringCalculator';
import CustomerLoanServiceGrant from '@/components/CustomerLoanServiceGrant';

export default function ErpEnergyCalculatorPage() {
  const [activeModule, setActiveModule] = useState<'CALCULATOR' | 'LOAN_GRANT'>('CALCULATOR');

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#071322]/95 backdrop-blur-md border-b border-emerald-900/50 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>Back to ERP Core</span>
          </Link>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-amber-400">
              <Sun className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white font-heading">
                  Ariel Renewable Energy Limited
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 font-bold">
                  ERP EPC &amp; FINANCING ENGINE
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Official 5-Pillar Solar Engineering BoQ &amp; 4.5% Bank Loan Facilitation Desk
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Module Switcher Buttons */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-700 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveModule('CALCULATOR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeModule === 'CALCULATOR'
                  ? 'bg-[#C8A96A] text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Engineering BoQ &amp; Quotation</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModule('LOAN_GRANT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeModule === 'LOAN_GRANT'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-amber-300" />
              <span>Customer Loan Service &amp; Grant Desk</span>
            </button>
          </div>

          <Link
            href="/energy/crm"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white bg-slate-900 border border-amber-500/40 px-3 py-1.5 rounded-lg transition hover:border-amber-400"
            title="Open Full AREL-CRM Enterprise Operating Hub"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Open AREL-CRM</span>
          </Link>

          <a
            href="https://energy.arielmc.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 border border-emerald-700/50 px-3 py-1.5 rounded-lg transition ml-2"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Launch Public SaaS</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeModule === 'CALCULATOR' && (
          <>
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/30 border border-emerald-800/40 shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C8A96A]" />
                  Solar Engineering &amp; Turnkey 25% Commercial Margin Model
                </h1>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Strictly synchronized with ArielMC ERP Sourcing Vault, SRO 159 Customs Exemptions, SREDA Net-Metering Guidelines, and 4.5% Bangladesh Bank Green Transformation Funding.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Mandatory Margin Rule</div>
                  <div className="text-sm font-bold text-[#C8A96A] font-mono">Exactly 25.0% Gross Margin</div>
                </div>
              </div>
            </div>

            {/* Embedded Calculator */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl p-2 sm:p-4">
              <SolarEngineeringCalculator isErpEmbedded={true} />
            </div>
          </>
        )}

        {activeModule === 'LOAN_GRANT' && (
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl p-4 sm:p-6">
            <CustomerLoanServiceGrant isErpEmbedded={true} />
          </div>
        )}
      </main>
    </div>
  );
}
