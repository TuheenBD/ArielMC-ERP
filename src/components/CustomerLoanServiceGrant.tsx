'use client';

import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  FileText,
  BadgePercent,
  CheckCircle2,
  Download,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Calculator,
  Zap,
  PhoneCall,
  CheckSquare,
  Sparkles,
  Award,
  Clock,
  Coins,
  Compass,
} from 'lucide-react';

interface CustomerLoanServiceGrantProps {
  isErpEmbedded?: boolean;
}

export default function CustomerLoanServiceGrant({
  isErpEmbedded = false,
}: CustomerLoanServiceGrantProps) {
  const [activeGuideTab, setActiveGuideTab] = useState<'MINISTRY' | 'BANGLADESH_BANK' | 'CHECKLIST'>('MINISTRY');
  const [prequalCapacity, setPrequalCapacity] = useState<number>(500);

  // Dynamic calculations based on capacity
  const turnkeyRatePerWp = 51.60;
  const projectCapexLakh = (prequalCapacity * 1000 * turnkeyRatePerWp) / 100000;
  const debt80Lakh = projectCapexLakh * 0.8;
  const equity20Lakh = projectCapexLakh * 0.2;
  const monthlySavingsLakh = (prequalCapacity * 1425 * 14.25) / (12 * 100000); // 1,425 kWh/kWp/yr @ Tk 14.25
  const interestOnlyGraceMonthlyLakh = (debt80Lakh * 0.045) / 12; // Month 1-12
  const r = 0.045 / 12;
  const n = 84;
  const monthlyEmiLakh = (debt80Lakh * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const netSurplusGraceLakh = monthlySavingsLakh - interestOnlyGraceMonthlyLakh;
  const netSurplusAmortizationLakh = monthlySavingsLakh - monthlyEmiLakh;
  const dscr = monthlySavingsLakh / monthlyEmiLakh;

  const services = [
    {
      id: 'step-1',
      stepNum: '01',
      title: 'Pre-Qualification & 3D LiDAR Drone Roof Audit',
      timeline: '48 Hours',
      badge: 'Step 1 • Technical Pre-Audit',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40',
      description:
        'Verification of client past 12-month utility bills ensuring proposed AC capacity strictly adheres to the 70% sanctioned load cap (SREDA mandatory rule). Includes 3-hour on-site 3D LiDAR drone survey mapping roof azimuth, tilt, parapet shadow obstructions, and purlin structural stress.',
      deliverables: [
        'Sanctioned load vs. AC capacity validation',
        '3D LiDAR drone shadow & irradiance map',
        'Preliminary roof layout & stringing concept',
      ],
      icon: Compass,
    },
    {
      id: 'step-2',
      stepNum: '02',
      title: 'Bankable Feasibility Study Dossier (AREL-BNK-2026-FEAS-V1)',
      timeline: '5 Business Days',
      badge: 'Step 2 • Bankable Feasibility',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-600/40',
      description:
        'Ariel prepares the comprehensive technical and actuarial package required by bank credit committees: PVsyst/HelioScope 25-year energy simulation (80.4% PR), 25-year financial cashflow waterfall showing DSCR > 1.50x, SREDA component test sheets, and IEB structural integrity certificate with certified SLD.',
      deliverables: [
        'PVsyst Meteonorm 8.1 25-year yield simulation',
        '25-Year cashflow waterfall with DSCR & IRR',
        'SREDA BDS IEC hardware compliance sheets',
        'IEB structural load seal & single line diagram (SLD)',
      ],
      icon: FileCheck,
    },
    {
      id: 'step-3',
      stepNum: '03',
      title: 'Ministry & SREDA Regulatory Approvals Facilitation',
      timeline: '7–10 Days',
      badge: 'Regulatory & SRO Protocol',
      badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-600/40',
      description:
        'Complete facilitation of SREDA technical NOC clearance, utility distribution net-metering interconnection approval (BREB/DPDC/DESCO/WZPDCL/NESCO), and NBR Customs SRO 159/338 Box 44 documentation for 1.0% total import tax clearance.',
      deliverables: [
        'SREDA official NOC approval in Box 44',
        'Utility distribution net-metering application',
        'ASYCUDA World 1.0% duty exemption documentation',
      ],
      icon: Award,
    },
    {
      id: 'step-4',
      stepNum: '04',
      title: 'Bank Sustainable Finance Desk (SFD) & IDCOL Defense',
      timeline: '10–14 Days',
      badge: 'Step 3 • Credit Underwriting',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-600/40',
      description:
        'Formal submission of the Bankable Feasibility Study directly through corporate relationship managers (RM) to the Sustainable Finance Department (SFD) of BRAC Bank, City Bank, EBL, Prime Bank, Bank Asia, or IDCOL. Ariel’s energy finance team defends the engineering BoQ and DSCR directly before credit analysts.',
      deliverables: [
        'Dedicated presentation to Bank SFD Credit Committee',
        'Lender’s Engineer technical liaison & compliance defense',
        'Term sheet negotiation & 4.5% green rate lock',
      ],
      icon: Landmark,
    },
    {
      id: 'step-5',
      stepNum: '05',
      title: 'Loan Sanction, ERQ LC & Milestone Disbursement Management',
      timeline: '21–30 Days to COD',
      badge: 'Step 4 • Execution & COD',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40',
      description:
        'Upon 80% loan sanction, the factory opens the Tier-1 hardware import LC via their Export Retention Quota (ERQ) account, saving 2%–3% in forex spreads. The bank disburses loan tranches in structured milestones tied to equipment port arrival, mechanical mounting, and SREDA grid synchronization.',
      deliverables: [
        'ERQ USD LC facilitation with 2%–3% forex savings',
        'Milestone-based fund drawdown administration',
        'Final SREDA net-metering commissioning & COD',
      ],
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-10 text-slate-100">
      
      {/* Section Header */}
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-600/60 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3 shadow-md">
          <Landmark className="w-4 h-4 text-amber-400" />
          <span>Customer Loan Service &amp; Green Finance Grant Desk</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
          Turnkey <span className="text-[#C8A96A]">4.5% Green Loan</span> &amp; Bankable Feasibility Mandate
        </h2>
        <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
          The primary customer conversion engine for Ariel Energy: We package, defend, and sanction 
          <strong className="text-white"> 80% concessional debt with a 1-year principal grace period</strong> under Bangladesh Bank Green Refinance and IDCOL. 
          <span className="text-emerald-400 font-semibold"> Zero working capital drain • 100% self-liquidating debt paid from power bill savings.</span>
        </p>
      </div>

      {/* Master PDF Download Callout Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/80 text-white border border-emerald-600/50 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C8A96A]/20 border border-[#C8A96A]/50 text-[#FCD34D] text-[11px] font-bold uppercase tracking-wider font-mono">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Document Reference: AREL-BNK-2026-FEAS-V1</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Official Bankable Feasibility Study &amp; Project Proposal Dossier (10-Page Master PDF)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete 10-page statutory bank submission package: PVsyst Meteonorm 8.1 irradiance simulation (80.4% PR), 25-year financial waterfall table, DSCR amortization schedule, SREDA BDS IEC hardware compliance matrix, BNBC 2020 210 km/h wind load report, and certified Single Line Diagram (SLD).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href="/documents/AREL_BNK_2026_FEAS_V1_Bankable_Feasibility_Study_Dossier.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all border border-emerald-400/40"
            >
              <Download className="w-4 h-4 text-emerald-200" />
              <span>Download Master Dossier (PDF)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 5 Core Turnkey Loan Services Grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-white">
            5 Turnkey Services Provided by Ariel Energy Loan Desk
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end statutory representation removing 100% of administrative and credit friction for factories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((srv, idx) => {
            const IconComp = srv.icon;
            return (
              <div
                key={srv.id}
                className={`bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg hover:border-emerald-500/50 transition-all flex flex-col justify-between ${
                  idx === 1 ? 'ring-1 ring-emerald-500/50 bg-slate-900/95' : ''
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-amber-400">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${srv.badgeColor}`}>
                      {srv.timeline}
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      SERVICE {srv.stepNum}
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">
                      {srv.title}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {srv.description}
                  </p>

                  <div className="pt-3 border-t border-slate-800 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Key Deliverables:
                    </div>
                    {srv.deliverables.map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800">
                  <div className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C8A96A]" />
                    <span>Included in Turnkey EPC Mandate</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Interactive Quick Estimator Card */}
          <div className="bg-gradient-to-br from-[#064E3B] to-[#043327] rounded-2xl p-5 text-white shadow-xl flex flex-col justify-between border border-emerald-600/50">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-amber-300">
                  <Calculator className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-500/40">
                  REAL-TIME UNDERWRITING
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">
                  Instant 4.5% Loan Pre-Qualifier
                </h4>
                <p className="text-xs text-emerald-100/80 mt-0.5">
                  Select proposed capacity to calculate self-liquidating debt metrics:
                </p>
              </div>

              {/* Capacity Selector */}
              <div>
                <div className="flex justify-between text-xs font-mono font-bold text-amber-300 mb-1">
                  <span>CAPACITY:</span>
                  <span>{prequalCapacity} kWp</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={prequalCapacity}
                  onChange={(e) => setPrequalCapacity(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-emerald-300/70 font-mono mt-0.5">
                  <span>100 kWp</span>
                  <span>1,000 kWp</span>
                  <span>2,000 kWp</span>
                </div>
              </div>

              {/* Metrics Breakdown */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-emerald-700/40 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>80% Loan Debt:</span>
                  <span className="font-bold text-white">Tk {debt80Lakh.toFixed(2)} Lakh</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>20% Equity:</span>
                  <span className="font-bold text-white">Tk {equity20Lakh.toFixed(2)} Lakh</span>
                </div>
                <div className="flex justify-between text-emerald-300 pt-1 border-t border-emerald-800/60">
                  <span>Month 1-12 Cash Surplus:</span>
                  <span className="font-bold text-emerald-300">+{netSurplusGraceLakh.toFixed(2)} Lakh/mo</span>
                </div>
                <div className="flex justify-between text-amber-300">
                  <span>Month 13-84 Cash Surplus:</span>
                  <span className="font-bold text-amber-300">+{netSurplusAmortizationLakh.toFixed(2)} Lakh/mo</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Average DSCR:</span>
                  <span className="font-bold text-white">{dscr.toFixed(2)}x (Min: 1.20x)</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <a
                href="/documents/AREL_BNK_2026_FEAS_V1_Bankable_Feasibility_Study_Dossier.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier for This Scale</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Statutory Guidelines: Ministry vs. Bangladesh Bank vs. Checklist */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#C8A96A] uppercase tracking-wider block">
              STATUTORY REGULATORY UNDERWRITING REPOSITORY
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Official Ministry &amp; Bangladesh Bank Directives
            </h3>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveGuideTab('MINISTRY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGuideTab === 'MINISTRY'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ministry &amp; SREDA
            </button>
            <button
              type="button"
              onClick={() => setActiveGuideTab('BANGLADESH_BANK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGuideTab === 'BANGLADESH_BANK'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bangladesh Bank SFD
            </button>
            <button
              type="button"
              onClick={() => setActiveGuideTab('CHECKLIST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGuideTab === 'CHECKLIST'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bank Document Checklist
            </button>
          </div>
        </div>

        {/* Tab 1: Ministry of Power & SREDA Guidelines */}
        {activeGuideTab === 'MINISTRY' && (
          <div className="py-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckSquare className="w-4 h-4" />
                  <span>The 70% Sanctioned Load Limitation Rule</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Under Section 4.2 of the SREDA Net-Metering Policy 2026, the aggregate AC inverter capacity installed on a commercial facility cannot exceed <strong>70% of the sanctioned electrical load</strong> allocated by the distribution utility (BREB, DESCO, DPDC, PDB, WZPDCL, NESCO).
                </p>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                  Max AC Capacity (kW) = Sanctioned Load (kVA) × Power Factor (0.9) × 0.70
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Coins className="w-4 h-4" />
                  <span>Tk 10.50/kWh Surplus Cash Buyback (Power Division Directive)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Surplus electricity generated on weekends, weekly factory shutdowns, and national holidays exported to the grid is settled in <strong>cash at a guaranteed statutory buyback tariff of Tk 10.50/kWh</strong>, paid quarterly until February 28, 2030.
                </p>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                  Yield on 500 kWp: ~Tk 12.70 Lakh / Year on 65 non-working days
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Layers className="w-4 h-4" />
                  <span>SREDA Testing &amp; Component Certification Standards</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All imported panels must carry <strong>BDS IEC 61215:2016</strong> and <strong>BDS IEC 61730:2016</strong> test reports. Inverters must certify <strong>BDS IEC 62109</strong> and <strong>IEEE 1547 / IEC 62116</strong> anti-islanding disconnection (&lt;20 ms). SREDA issues the mandatory NOC required for customs clearance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>NBR Customs SRO 159 &amp; 338 1% Total Import Tax</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Customs Duty (CD), Regulatory Duty (RD), and Supplementary Duty (SD) are 100% exempt (0%). Total statutory import tax is restricted to just <strong>1.0% Advance Income Tax (AIT)</strong> when backed by SREDA NOC in ASYCUDA World Box 44.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bangladesh Bank Sustainable Finance Policy */}
        {activeGuideTab === 'BANGLADESH_BANK' && (
          <div className="py-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <BadgePercent className="w-4 h-4" />
                  <span>4.5% Fixed Concessional Interest</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Under Bangladesh Bank SFD Master Circular No. 02/2020, scheduled commercial banks receive 100% refinancing at 1.0%–2.0% and lend to factory borrowers at a <strong>fixed interest rate of 4.0% to 5.0% per annum</strong> (benchmarked at 4.5%).
                </p>
                <div className="text-[11px] font-mono font-bold text-emerald-400">
                  Saves ~8% to 10% vs commercial bank rates (13%–15%)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>1-Year Principal Grace Period</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Repayment tenure is structured for <strong>5 to 7 years (up to 84 months)</strong> with an initial <strong>12-month principal moratorium</strong>. Factory owners pay zero principal in Year 1, converting 100% of daytime bill savings into instant operating cash surplus.
                </p>
                <div className="text-[11px] font-mono font-bold text-emerald-400">
                  Year 1 Net Surplus on 500 kWp: +Tk 89.71 Lakh
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>DSCR &amp; Leverage Criteria</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Participating financial institutions mandate a minimum <strong>Debt Service Coverage Ratio (DSCR) of 1.20x</strong>. Ariel’s high-efficiency TOPCon designs generate <strong>1.52x to 1.85x DSCR</strong>, providing bank risk officers with complete safety buffer.
                </p>
                <div className="text-[11px] font-mono font-bold text-emerald-400">
                  80% Debt : 20% Equity Leverage Ratio
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Bank & IDCOL Document Checklist */}
        {activeGuideTab === 'CHECKLIST' && (
          <div className="py-5 space-y-3">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                Statutory Documentation Package for 14-Day Bank Credit Sanction:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-start gap-2 p-2 bg-slate-900 rounded border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>1. Bankable Feasibility Study Dossier:</strong> 100% prepared &amp; sealed by Ariel Renewable Energy Limited.</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-slate-900 rounded border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>2. PVsyst Simulation Report:</strong> Meteonorm 8.1 irradiance simulation with 80.4% Performance Ratio.</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-slate-900 rounded border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>3. SREDA Component Compliance Sheets:</strong> BDS IEC 61215/61730 &amp; BDS IEC 62109 OEM test certificates.</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-slate-900 rounded border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>4. IEB Structural Seal &amp; Certified SLD:</strong> BNBC 2020 210 km/h wind integrity validation.</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-slate-900 rounded border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>5. Past 12 Months' Electricity Bills:</strong> Copies of paid bills proving sanctioned load &amp; consumption.</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-slate-900 rounded border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>6. 3 Years' Audited Financial Statements:</strong> Certified Balance Sheet &amp; P&amp;L by Chartered Accountant.</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-slate-900 rounded border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>7. Corporate Statutory Documents:</strong> Valid Trade License, Incorporation Certificate, TIN, BIN, MoA.</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-slate-900 rounded border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>8. Regulatory Clearances:</strong> Clean CIB report of directors, DoE clearance &amp; Fire License.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
