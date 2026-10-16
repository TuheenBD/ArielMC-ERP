'use client';

import React, { useState } from 'react';
import {
  Landmark,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Package,
  Ship,
  Truck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Sparkles,
  RefreshCw,
  Building2,
  Mail,
  Copy,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  INITIAL_DUAL_TRACK_PNL,
  B2C_UNIT_ECONOMICS,
  B2B_UNIT_ECONOMICS,
  WORKING_CAPITAL_RUNWAY,
  QUARTERLY_BATCH_PLANS,
} from '@/data/initialFinanceData';

type FinanceTab =
  | 'OVERVIEW'
  | 'B2C_PNL'
  | 'B2B_PNL'
  | 'UNIT_ECONOMICS'
  | 'CASH_FLOW_PVA'
  | 'SHIPPING_CADENCE'
  | 'SPECIMEN_ROI';

export const FinanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('OVERVIEW');
  const [copiedScript, setCopiedScript] = useState(false);

  // Dynamic simulation state
  const [b2cVolumeMultiplier, setB2cVolumeMultiplier] = useState(1.0);
  const [b2bVolumeMultiplier, setB2bVolumeMultiplier] = useState(1.0);

  const basePnl = INITIAL_DUAL_TRACK_PNL;
  const currentB2cRevenue = basePnl.b2cLines[2].amountUsd * b2cVolumeMultiplier;
  const currentB2bRevenue = basePnl.b2bLines[0].amountUsd * b2bVolumeMultiplier;
  const totalCombinedRevenue = currentB2cRevenue + currentB2bRevenue;
  const estimatedRetainedProfit =
    basePnl.b2cLines[10].amountUsd * b2cVolumeMultiplier +
    basePnl.b2bLines[12].amountUsd * b2bVolumeMultiplier;
  const blendedMarginPct = totalCombinedRevenue > 0
    ? ((estimatedRetainedProfit / totalCombinedRevenue) * 100)
    : 27.3;

  const coldOutreachScript = `Subject: Sustainable welcome carry for [Company Name] team / ArielMC

Hi [First Name],

Most tech onboarding swag ends up discarded within a quarter because synthetic polyester bags don't reflect premium employer branding.

We design sustainable carry for daily commuters between London and New York—manufactured in our ethical Bangladesh partner mills using 100% natural unbleached jute-cotton and LWG leather trims. We currently retail across the UK and US, but we custom-build bespoke, co-branded batches for selective teams.

We've produced sample specimen boxes for workplace teams this season. Can I courier a complimentary specimen box to your desk at [Office Address] to inspect our materials firsthand?

Best regards,
ArielMC Trade Operations & Private Label Development
arielmc.com | arielmc.co.uk`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(coldOutreachScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0A1A2F] via-slate-900 to-[#0A1A2F] border border-[#C9A86A]/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C9A86A]/20 text-[#C9A86A] font-mono text-xs font-bold border border-[#C9A86A]/40">
                PHASE 8: LIVE
              </span>
              <span className="text-xs text-slate-300 font-mono">
                From Craft to Cash Flow: A Year 1 Market Launch Blueprint
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 font-['Montserrat']">
              <Landmark className="w-6 h-6 text-[#C9A86A]" />
              <span>Global Multi-Station Finance & Dual-Track Economics</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl font-['Open_Sans']">
              Unified financial engine governing ArielMC's 10,000-unit launch (6,000 B2C + 4,000 B2B). Synchronizes Day-0 equity runways, Postponed VAT Accounting (PVA), and the self-funding B2B cash flywheel across London, New York, and Dhaka.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Export P&L</span>
            </button>
            <button
              onClick={() => {
                setB2cVolumeMultiplier(1.0);
                setB2bVolumeMultiplier(1.0);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C9A86A]/20 hover:bg-[#C9A86A]/30 text-[#C9A86A] border border-[#C9A86A]/40 text-xs font-bold font-['Montserrat'] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Baseline</span>
            </button>
          </div>
        </div>

        {/* Master Executive KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Annual Volume</span>
            <div className="text-xl font-bold font-mono text-white">
              {(10000 * ((b2cVolumeMultiplier * 0.6) + (b2bVolumeMultiplier * 0.4))).toLocaleString()} pcs
            </div>
            <span className="text-[10px] text-emerald-400 font-mono block">
              6k B2C + 4k B2B Target
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Net Revenue</span>
            <div className="text-xl font-bold font-mono text-[#C9A86A]">
              ${totalCombinedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-slate-300 font-mono block">
              Combined Commercial Sales
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Operating EBITDA</span>
            <div className="text-xl font-bold font-mono text-cyan-400">
              ${(basePnl.ebitdaUsd * ((b2cVolumeMultiplier + b2bVolumeMultiplier) / 2)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-cyan-300 font-mono block">
              33.7% EBITDA Margin
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/40 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Retained Net Profit</span>
            <div className="text-xl font-bold font-mono text-emerald-400">
              ${estimatedRetainedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-emerald-300 font-mono block">
              {blendedMarginPct.toFixed(1)}% Blended Margin
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/40 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Day-0 Equity Runway</span>
            <div className="text-xl font-bold font-mono text-purple-400">$14,500</div>
            <span className="text-[10px] text-purple-300 font-mono block">
              ~£11,300 Initial Seed
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'OVERVIEW'
              ? 'bg-[#C9A86A] text-[#0A1A2F] shadow-lg shadow-[#C9A86A]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Growth Flywheel</span>
        </button>

        <button
          onClick={() => setActiveTab('B2C_PNL')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'B2C_PNL'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>B2C Retail P&L (6,000 Units)</span>
        </button>

        <button
          onClick={() => setActiveTab('B2B_PNL')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'B2B_PNL'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>B2B Wholesale P&L (4,000 Units)</span>
        </button>

        <button
          onClick={() => setActiveTab('UNIT_ECONOMICS')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'UNIT_ECONOMICS'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Per-Bag Unit Economics</span>
        </button>

        <button
          onClick={() => setActiveTab('CASH_FLOW_PVA')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'CASH_FLOW_PVA'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Working Capital & PVA Tax Shield</span>
        </button>

        <button
          onClick={() => setActiveTab('SHIPPING_CADENCE')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'SHIPPING_CADENCE'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Ship className="w-3.5 h-3.5" />
          <span>Quarterly Shipping Cadence</span>
        </button>

        <button
          onClick={() => setActiveTab('SPECIMEN_ROI')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'SPECIMEN_ROI'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Specimen Kit Outbound</span>
        </button>
      </div>

      {/* TAB 1: THE GROWTH FLYWHEEL & MASTER SUMMARY */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Flywheel Architecture Diagram */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white font-['Montserrat'] flex items-center gap-2">
                <span>The B2C-B2B Symbiotic Flywheel</span>
              </h2>
              <p className="text-xs text-slate-300 font-['Open_Sans']">
                Running high-margin B2C retail in tandem with high-volume B2B wholesale transforms ArielMC's supply chain from a capital-draining bottleneck into a self-reinforcing flywheel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">1. Consumer Front</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">6,000 units</span>
                </div>
                <h3 className="text-sm font-bold text-white font-['Montserrat']">B2C Retail Engine</h3>
                <p className="text-xs text-slate-300">
                  Amazon US/UK & Shopify (arielmc.shop) build organic social proof, customer reviews, and street credibility in London & New York, proving real consumer demand.
                </p>
                <div className="pt-2 text-[11px] text-blue-300 font-mono border-t border-slate-800">
                  Target: $155,850 Net Turnover • $36,118 Retained Profit
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">2. Corporate Fuel</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">4,000 units</span>
                </div>
                <h3 className="text-sm font-bold text-white font-['Montserrat']">B2B Wholesale & Swag</h3>
                <p className="text-xs text-slate-300">
                  Corporate contracts (London tech & US fintech) yield zero ad CAC and provide 50% upfront deposits upon PO signing, directly funding raw materials.
                </p>
                <div className="pt-2 text-[11px] text-purple-300 font-mono border-t border-slate-800">
                  Target: $60,600 Wholesale Rev • $22,933 Retained Profit
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0A1A2F] via-slate-900 to-slate-950 border border-[#C9A86A]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#C9A86A] font-bold">3. Scale Advantage</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#C9A86A]/20 text-[#C9A86A]">10,000+ units</span>
                </div>
                <h3 className="text-sm font-bold text-white font-['Montserrat']">Dhaka Sourcing Power</h3>
                <p className="text-xs text-slate-300">
                  10,000+ units pushes procurement across Narayanganj textile mills and Savar tanneries into tier-1 wholesale pricing: -15% FOB savings across all SKUs.
                </p>
                <div className="pt-2 text-[11px] text-[#C9A86A] font-mono border-t border-slate-800">
                  Priority factory slots • Zero-risk client-funded R&D
                </div>
              </div>
            </div>

            {/* Interactive Scenario Multiplier Sliders */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white font-['Montserrat'] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#C9A86A]" />
                  <span>Simulate Year 1 Execution Scale</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  B2C: {(b2cVolumeMultiplier * 100).toFixed(0)}% | B2B: {(b2bVolumeMultiplier * 100).toFixed(0)}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>B2C Sales Velocity (6,000 Units Baseline)</span>
                    <strong className="text-blue-400 font-mono">
                      {(6000 * b2cVolumeMultiplier).toLocaleString()} pcs
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={b2cVolumeMultiplier}
                    onChange={(e) => setB2cVolumeMultiplier(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>B2B Contract Acquisition (4,000 Units Baseline)</span>
                    <strong className="text-purple-400 font-mono">
                      {(4000 * b2bVolumeMultiplier).toLocaleString()} pcs
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={b2bVolumeMultiplier}
                    onChange={(e) => setB2bVolumeMultiplier(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Master Comparison Matrix: B2C vs B2B */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Financial Pillar</th>
                  <th className="py-3 px-4 text-blue-300">B2C Retail Engine (6,000 pcs)</th>
                  <th className="py-3 px-4 text-purple-300">B2B Wholesale Program (4,000 pcs)</th>
                  <th className="py-3 px-4 text-[#C9A86A]">Combined Master Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-white">Gross Revenue</td>
                  <td className="py-3 px-4 font-mono text-slate-200">
                    ${(173350 * b2cVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200">
                    ${(60600 * b2bVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    ${((173350 * b2cVolumeMultiplier) + (60600 * b2bVolumeMultiplier)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-white">Net Commercial Turnover</td>
                  <td className="py-3 px-4 font-mono text-blue-300 font-bold">
                    ${(155850 * b2cVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 font-mono text-purple-300 font-bold">
                    ${(60600 * b2bVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#C9A86A]">
                    ${totalCombinedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-white">Dhaka Factory COGS (Sea)</td>
                  <td className="py-3 px-4 font-mono text-rose-400">
                    -${(33230 * b2cVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })} (-21.3%)
                  </td>
                  <td className="py-3 px-4 font-mono text-rose-400">
                    -${(14840 * b2bVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })} (-24.5%)
                  </td>
                  <td className="py-3 px-4 font-mono text-rose-400 font-bold">
                    -${((33230 * b2cVolumeMultiplier) + (14840 * b2bVolumeMultiplier)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-white">Operating EBITDA</td>
                  <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">
                    ${(44590 * b2cVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })} (28.6%)
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">
                    ${(28312 * b2bVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })} (46.7%)
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-300 font-bold">
                    ${((44590 * b2cVolumeMultiplier) + (28312 * b2bVolumeMultiplier)).toLocaleString(undefined, { maximumFractionDigits: 0 })} (33.7%)
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40 bg-emerald-950/20">
                  <td className="py-3 px-4 font-semibold text-white">Net Retained Profit</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                    ${(36118 * b2cVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })} (23.2%)
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                    ${(22933 * b2bVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })} (37.8%)
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-extrabold text-sm">
                    ${estimatedRetainedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({blendedMarginPct.toFixed(1)}%)
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-white">Working Capital Mechanics</td>
                  <td className="py-3 px-4 text-[11px] text-slate-300">
                    Locks capital in ocean transit; rolling 14-day Amazon disbursements & 48h Stripe payouts
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-300">
                    50% upfront client deposit upon PO; 50% settled against Bill of Lading (BL) copy
                  </td>
                  <td className="py-3 px-4 text-[11px] text-emerald-300 font-semibold">
                    100% Self-funding cycle requiring zero secondary outside capital
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FULL-YEAR B2C RETAIL P&L */}
      {activeTab === 'B2C_PNL' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 space-y-2">
            <h2 className="text-base font-bold text-white font-['Montserrat'] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <span>Full-Year B2C Profit & Loss Statement (6,000 Units Target)</span>
            </h2>
            <p className="text-xs text-slate-300 font-['Open_Sans']">
              Volume split: New York 60% (3,600 pcs) / London 40% (2,400 pcs). Provides critical mass to win the Amazon Prime Buy Box while maximizing DTC margin on Shopify.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Financial Line Item</th>
                  <th className="py-3 px-4">Total Amount (USD)</th>
                  <th className="py-3 px-4">% of Net Turnover</th>
                  <th className="py-3 px-4">% of Gross Sales</th>
                  <th className="py-3 px-4">Operational Basis & Allocation Logic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {basePnl.b2cLines.map((line, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      line.isSubtotal ? 'bg-slate-950/60 font-semibold' : ''
                    }`}
                  >
                    <td className={`py-3 px-4 ${line.isSubtotal ? 'text-white font-bold' : 'text-slate-300'}`}>
                      {line.name}
                    </td>
                    <td
                      className={`py-3 px-4 font-mono font-bold ${
                        line.isNegative
                          ? 'text-rose-400'
                          : line.isSubtotal
                          ? 'text-emerald-400'
                          : 'text-white'
                      }`}
                    >
                      {line.amountUsd < 0 ? `-$${Math.abs(line.amountUsd).toLocaleString()}` : `$${line.amountUsd.toLocaleString()}`}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {line.pctNetTurnover !== undefined ? `${line.pctNetTurnover.toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {line.pctGrossSales !== undefined ? `${line.pctGrossSales.toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {line.operationalLogic}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STANDALONE B2B WHOLESALE P&L */}
      {activeTab === 'B2B_PNL' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 space-y-2">
            <h2 className="text-base font-bold text-white font-['Montserrat'] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              <span>Standalone Year 1 B2B Wholesale Profit & Loss Statement (4,000 Units Target)</span>
            </h2>
            <p className="text-xs text-slate-300 font-['Open_Sans']">
              Targeted across 12 to 14 corporate accounts (~300 units per order) in London City and Silicon Alley New York. Operates with near-zero ad CAC and 50% upfront working capital deposits.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Financial Line Item</th>
                  <th className="py-3 px-4">Total Amount (USD)</th>
                  <th className="py-3 px-4">% of Gross Revenue</th>
                  <th className="py-3 px-4">Strategic Basis & Operating Logic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {basePnl.b2bLines.map((line, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      line.isSubtotal ? 'bg-slate-950/60 font-semibold' : ''
                    }`}
                  >
                    <td className={`py-3 px-4 ${line.isSubtotal ? 'text-white font-bold' : 'text-slate-300'}`}>
                      {line.name}
                    </td>
                    <td
                      className={`py-3 px-4 font-mono font-bold ${
                        line.isNegative
                          ? 'text-rose-400'
                          : line.isSubtotal
                          ? 'text-purple-300'
                          : 'text-white'
                      }`}
                    >
                      {line.amountUsd < 0 ? `-$${Math.abs(line.amountUsd).toLocaleString()}` : `$${line.amountUsd.toLocaleString()}`}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {line.pctNetTurnover !== undefined ? `${line.pctNetTurnover.toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {line.operationalLogic}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PER-BAG UNIT ECONOMICS & CONTRIBUTION MARGINS */}
      {activeTab === 'UNIT_ECONOMICS' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-2">
            <h2 className="text-base font-bold text-white font-['Montserrat'] flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-400" />
              <span>Unit Costing & Contribution Economics (Per-Bag Breakdown)</span>
            </h2>
            <p className="text-xs text-slate-300 font-['Open_Sans']">
              Granular breakdown of realize RRP, Dhaka FOB, ocean shipping share, pick/pack fees, and paid CAC targets across all 4 production tiers.
            </p>
          </div>

          {/* B2C Unit Economics Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-['Montserrat'] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>B2C Retail Unit Contribution Economics</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">SKU Tier</th>
                    <th className="py-3 px-4">Blended RRP</th>
                    <th className="py-3 px-4">Factory FOB</th>
                    <th className="py-3 px-4">Landed CIF</th>
                    <th className="py-3 px-4">Platform / Pick</th>
                    <th className="py-3 px-4">Paid Ad CAC</th>
                    <th className="py-3 px-4 text-emerald-400">Net Contribution</th>
                    <th className="py-3 px-4 text-emerald-400">Margin (%)</th>
                    <th className="py-3 px-4">Channel Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {B2C_UNIT_ECONOMICS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <strong className="text-white block">{item.skuTier}</strong>
                        <span className="text-[10px] text-slate-400 block max-w-xs">{item.optimizationNote}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ${item.blendedRrpUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        ${item.factoryFobDhakaUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        ${item.landedSeaCostCifUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        ${item.pickPackPlatformFeeUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-400">
                        ${item.paidAdCacTargetUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        ${item.netUnitContributionUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {item.contributionMarginPct.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-400">
                        {item.channels}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* B2B Unit Economics Table */}
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-['Montserrat'] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>B2B Wholesale Unit Economics by Category</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Wholesale Price (FOB Dest.)</th>
                    <th className="py-3 px-4">BD Production COGS</th>
                    <th className="py-3 px-4">Ocean Freight</th>
                    <th className="py-3 px-4">Branding & Screen</th>
                    <th className="py-3 px-4 text-purple-300">Gross Unit Profit</th>
                    <th className="py-3 px-4 text-purple-300">Gross Margin (%)</th>
                    <th className="py-3 px-4">Target Client Segment & MOQ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {B2B_UNIT_ECONOMICS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ${item.wholesalePriceUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        ${item.bangladeshProductionCogsUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        ${item.oceanFreightDrayageUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        ${item.brandingScreenPrintUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-purple-300">
                        ${item.grossUnitProfitUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-purple-300">
                        {item.grossMarginPct.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-400">
                        <strong className="text-slate-300 block">{item.targetClientSegment}</strong>
                        <span>{item.buyerPersona} • MOQ {item.moqUnits}</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-950 font-semibold border-t-2 border-slate-700">
                    <td className="py-3 px-4 text-white">Blended B2B Total (4,000 pcs)</td>
                    <td className="py-3 px-4 font-mono text-[#C9A86A] font-bold">$15.15 avg</td>
                    <td className="py-3 px-4 font-mono text-slate-300">$3.71 avg</td>
                    <td className="py-3 px-4 font-mono text-slate-300">$0.82 avg</td>
                    <td className="py-3 px-4 font-mono text-slate-300">$0.73 avg</td>
                    <td className="py-3 px-4 font-mono text-purple-300 font-bold">$9.89 avg</td>
                    <td className="py-3 px-4 font-mono text-purple-300 font-extrabold">65.3% avg</td>
                    <td className="py-3 px-4 text-[11px] text-emerald-400">Total B2B Gross Profit: $38,360</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WORKING CAPITAL & PVA TAX SHIELD */}
      {activeTab === 'CASH_FLOW_PVA' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-2">
            <h2 className="text-base font-bold text-white font-['Montserrat'] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Working Capital & Postponed VAT Accounting (PVA) Architecture</span>
            </h2>
            <p className="text-xs text-slate-300 font-['Open_Sans']">
              Adopting 100% ocean freight, Net-60 intercompany credit terms, and UK Postponed VAT Accounting frees upfront liquidity and eliminates ~$7,000 in blocked customs cash.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Day-0 Equity Allocation Breakdown */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-['Montserrat']">
                  Day-0 Equity Runway Allocation ($14,500 Total)
                </h3>
                <span className="font-mono text-xs text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">
                  ~£11,300 GBP
                </span>
              </div>

              <div className="space-y-2.5">
                {WORKING_CAPITAL_RUNWAY.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-white">{item.category}</div>
                      <div className="text-[11px] text-slate-400">{item.purpose}</div>
                      <span className="text-[10px] text-[#C9A86A] font-mono">{item.timing}</span>
                    </div>
                    <div className="text-right font-mono shrink-0 pl-3">
                      <div className="font-bold text-white">${item.amountUsd.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">£{item.amountGbp.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PVA & Intercompany Credit Mechanisms */}
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/40 shadow-xl space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white font-['Montserrat']">
                    UK Postponed VAT Accounting (PVA) Shield
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  By declaring Ariel UK Ltd’s GB VAT and EORI number on UK customs entries, the 20% import VAT is deferred to quarterly VAT returns instead of being paid in cash at the port.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual Import Duty Rate (DCTS):</span>
                    <strong className="text-emerald-400">0% Preferential Duty</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Standard Import VAT Without PVA:</span>
                    <strong className="text-rose-400">~$7,000 Upfront Cash Blockage</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1">
                    <span className="text-cyan-300">Net Cash Preserved via PVA:</span>
                    <strong className="text-cyan-300 font-bold">$7,000 Liquid Working Capital</strong>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-[#C9A86A]/40 shadow-xl space-y-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-[#C9A86A]" />
                  <h3 className="text-sm font-bold text-white font-['Montserrat']">
                    Net-60 Intercompany Credit & Rolling Cash Flow Loop
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  Ariel BD issues Batch 2 and 3 production orders under Net-60 intercompany credit terms. Ocean freight is paid upfront, but factory balances are settled directly from rolling 14-day Amazon disbursements and 48-hour Shopify Stripe payouts.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono space-y-1">
                  <div>✓ Batch 1: Equity Funded ($4,900 FOB + $1,200 Freight)</div>
                  <div>✓ Batch 2: Day-35 Reorder Trigger (Funded via Month 1–2 Sales Receipts)</div>
                  <div>✓ Batches 3 & 4: 100% Self-Funding Loop (Zero Outside Capital Needed)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: QUARTERLY SHIPPING CADENCE & DAY-35 REORDER TRIGGER */}
      {activeTab === 'SHIPPING_CADENCE' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 space-y-2">
            <h2 className="text-base font-bold text-white font-['Montserrat'] flex items-center gap-2">
              <Ship className="w-5 h-5 text-amber-400" />
              <span>Quarterly Staged Ocean Shipping Cadence (55–65 Days End-to-End)</span>
            </h2>
            <p className="text-xs text-slate-300 font-['Open_Sans']">
              Transit takes 25–35 days to London Gateway and 30–38 days to the Port of New York/New Jersey. Total lead time requires reorders to trigger strictly at Day 35 of each operational cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUARTERLY_BATCH_PLANS.map((batch) => (
              <div
                key={batch.batchNumber}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {batch.months}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        batch.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : batch.status === 'IN_PRODUCTION'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {batch.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-['Montserrat']">
                    {batch.name}
                  </h3>
                  <div className="text-2xl font-bold font-mono text-[#C9A86A]">
                    {batch.totalUnits.toLocaleString()} units
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1 font-mono text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bloom Satchel:</span>
                      <strong>{batch.bloomUnits} pcs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mid-Level EDC:</span>
                      <strong>{batch.midLevelUnits} pcs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Commuter Shopper:</span>
                      <strong>{batch.commuterUnits} pcs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Economy Canvas:</span>
                      <strong>{batch.economyUnits} pcs</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 pt-1">
                    <p><strong>Funding:</strong> {batch.fundingMechanism}</p>
                    <p><strong>Logistics:</strong> {batch.logisticsAllocation}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center justify-between">
                  <span>Reorder Gate:</span>
                  <strong>Day {batch.reorderTriggerDay} Trigger</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: B2B SPECIMEN KIT OUTBOUND CAMPAIGN & ROI */}
      {activeTab === 'SPECIMEN_ROI' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-2">
            <h2 className="text-base font-bold text-white font-['Montserrat'] flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-400" />
              <span>B2B Specimen Kit "Trojan Horse" Outbound Campaign Engine</span>
            </h2>
            <p className="text-xs text-slate-300 font-['Open_Sans']">
              Targeted Account-Based Marketing (ABM) for London and New York tech/fintech procurement leads. Eliminates cold pitch friction by delivering high-finish physical specimen presentation boxes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ROI Metrics & Funnel */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white font-['Montserrat']">
                Quarterly Specimen Outbound Economics
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Quarterly Boxes</span>
                  <span className="text-xl font-bold text-white mt-1 block">40 Boxes</span>
                  <span className="text-[10px] text-slate-400">160 Boxes / Year</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Cost to Dispatch</span>
                  <span className="text-xl font-bold text-amber-400 mt-1 block">$35 – $45</span>
                  <span className="text-[10px] text-slate-400">via DHL Express</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Conversion Rate</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">15%</span>
                  <span className="text-[10px] text-slate-400">Vetted Leads</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Quarterly Contracts</span>
                  <span className="text-xl font-bold text-purple-400 mt-1 block">6 Clients</span>
                  <span className="text-[10px] text-slate-400">~$15,150 Rev / Qtr</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="font-semibold text-white">Specimen Presentation Box Contents:</div>
                <div className="space-y-1 text-slate-300 pl-2">
                  <div>• 1x Custom Debossed Jute-Cotton Commuter Bag (TP-AMC-JCT-1612)</div>
                  <div>• 1x Vegetable-Tanned Leather Accessory Swatch (Savar LWG Chromium-VI free)</div>
                  <div>• 1x Printed ESG Factsheet detailing ArielMC’s REACH-compliant Bangladesh supply chain</div>
                </div>
              </div>
            </div>

            {/* Cold Outreach Script Generator */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white font-['Montserrat']">
                    Validated Cold Outreach Script (London & NY)
                  </h3>
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow"
                  >
                    {copiedScript ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Template'}</span>
                  </button>
                </div>

                <pre className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {coldOutreachScript}
                </pre>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
                Tip: Target mid-market companies (100–1,000 employees) in Shoreditch/Old Street and Flatiron/Midtown that recently announced Series A/B funding or office expansions.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
