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
      <div className="p-6 rounded-2xl bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] shadow-sm text-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A] text-[#1F3A2E] font-mono text-xs font-bold">
                PHASE 8: LIVE
              </span>
              <span className="text-xs text-emerald-100 font-mono font-medium">
                From Craft to Cash Flow: A Year 1 Market Launch Blueprint
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 font-['Montserrat']">
              <Landmark className="w-6 h-6 text-[#C8A96A]" />
              <span>Global Multi-Station Finance & Dual-Track Economics</span>
            </h1>
            <p className="text-xs text-white/80 max-w-3xl font-['Open_Sans']">
              Unified financial engine governing ArielMC's 10,000-unit launch (6,000 B2C + 4,000 B2B). Synchronizes Day-0 equity runways, Postponed VAT Accounting (PVA), and the self-funding B2B cash flywheel across London, New York, and Dhaka.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Export P&L</span>
            </button>
            <button
              onClick={() => {
                setB2cVolumeMultiplier(1.0);
                setB2bVolumeMultiplier(1.0);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b59556] text-[#1F3A2E] text-xs font-bold font-['Montserrat'] transition-all shadow"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Baseline</span>
            </button>
          </div>
        </div>

        {/* Master Executive KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase block font-semibold">Annual Volume</span>
            <div className="text-xl font-bold font-mono text-[#1F3A2E]">
              {(10000 * ((b2cVolumeMultiplier * 0.6) + (b2bVolumeMultiplier * 0.4))).toLocaleString()} pcs
            </div>
            <span className="text-[10px] text-emerald-700 font-mono font-medium block">
              6k B2C + 4k B2B Target
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase block font-semibold">Net Revenue</span>
            <div className="text-xl font-bold font-mono text-[#8A6D3B]">
              ${totalCombinedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-gray-600 font-mono block">
              Combined Commercial Sales
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase block font-semibold">Operating EBITDA</span>
            <div className="text-xl font-bold font-mono text-[#1F3A2E]">
              ${(basePnl.ebitdaUsd * ((b2cVolumeMultiplier + b2bVolumeMultiplier) / 2)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-blue-700 font-mono font-medium block">
              33.7% EBITDA Margin
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#BBE3C7] shadow-sm space-y-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase block font-semibold">Retained Net Profit</span>
            <div className="text-xl font-bold font-mono text-emerald-700">
              ${estimatedRetainedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-emerald-800 font-mono font-medium block">
              {blendedMarginPct.toFixed(1)}% Blended Margin
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#D6C7EC] shadow-sm space-y-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase block font-semibold">Day-0 Equity Runway</span>
            <div className="text-xl font-bold font-mono text-[#4A2E7A]">$14,500</div>
            <span className="text-[10px] text-[#4A2E7A] font-mono font-medium block">
              ~£11,300 Initial Seed
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#DDE3DD] text-xs font-semibold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'OVERVIEW'
              ? 'bg-[#1F3A2E] text-white shadow-sm border border-[#1F3A2E]'
              : 'text-gray-600 hover:text-[#1F3A2E] hover:bg-[#E8EFE8] border border-transparent'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Growth Flywheel</span>
        </button>

        <button
          onClick={() => setActiveTab('B2C_PNL')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'B2C_PNL'
              ? 'bg-[#1F3A2E] text-white shadow-sm border border-[#1F3A2E]'
              : 'text-gray-600 hover:text-[#1F3A2E] hover:bg-[#E8EFE8] border border-transparent'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>B2C Retail P&L (6,000 Units)</span>
        </button>

        <button
          onClick={() => setActiveTab('B2B_PNL')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'B2B_PNL'
              ? 'bg-[#1F3A2E] text-white shadow-sm border border-[#1F3A2E]'
              : 'text-gray-600 hover:text-[#1F3A2E] hover:bg-[#E8EFE8] border border-transparent'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>B2B Wholesale P&L (4,000 Units)</span>
        </button>

        <button
          onClick={() => setActiveTab('UNIT_ECONOMICS')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'UNIT_ECONOMICS'
              ? 'bg-[#1F3A2E] text-white shadow-sm border border-[#1F3A2E]'
              : 'text-gray-600 hover:text-[#1F3A2E] hover:bg-[#E8EFE8] border border-transparent'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Per-Bag Unit Economics</span>
        </button>

        <button
          onClick={() => setActiveTab('CASH_FLOW_PVA')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'CASH_FLOW_PVA'
              ? 'bg-[#1F3A2E] text-white shadow-sm border border-[#1F3A2E]'
              : 'text-gray-600 hover:text-[#1F3A2E] hover:bg-[#E8EFE8] border border-transparent'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Working Capital & PVA Tax Shield</span>
        </button>

        <button
          onClick={() => setActiveTab('SHIPPING_CADENCE')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'SHIPPING_CADENCE'
              ? 'bg-[#1F3A2E] text-white shadow-sm border border-[#1F3A2E]'
              : 'text-gray-600 hover:text-[#1F3A2E] hover:bg-[#E8EFE8] border border-transparent'
          }`}
        >
          <Ship className="w-3.5 h-3.5" />
          <span>Quarterly Shipping Cadence</span>
        </button>

        <button
          onClick={() => setActiveTab('SPECIMEN_ROI')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'SPECIMEN_ROI'
              ? 'bg-[#1F3A2E] text-white shadow-sm border border-[#1F3A2E]'
              : 'text-gray-600 hover:text-[#1F3A2E] hover:bg-[#E8EFE8] border border-transparent'
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
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                <span>The B2C-B2B Symbiotic Flywheel</span>
              </h2>
              <p className="text-xs text-gray-600 font-['Open_Sans']">
                Running high-margin B2C retail in tandem with high-volume B2B wholesale transforms ArielMC's supply chain from a capital-draining bottleneck into a self-reinforcing flywheel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#E8F0FA] border border-[#C5D7ED] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#17456F] font-bold">1. Consumer Front</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/80 text-[#17456F] font-bold border border-[#C5D7ED]">6,000 units</span>
                </div>
                <h3 className="text-sm font-bold text-[#17456F] font-['Montserrat']">B2C Retail Engine</h3>
                <p className="text-xs text-gray-700 font-['Open_Sans']">
                  Amazon US/UK & Shopify (arielmc.shop) build organic social proof, customer reviews, and street credibility in London & New York, proving real consumer demand.
                </p>
                <div className="pt-2 text-[11px] text-[#17456F] font-mono border-t border-[#C5D7ED] font-semibold">
                  Target: $155,850 Net Turnover • $36,118 Retained Profit
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#EDE7F6] border border-[#D6C7EC] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#4A2E7A] font-bold">2. Corporate Fuel</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/80 text-[#4A2E7A] font-bold border border-[#D6C7EC]">4,000 units</span>
                </div>
                <h3 className="text-sm font-bold text-[#4A2E7A] font-['Montserrat']">B2B Wholesale & Swag</h3>
                <p className="text-xs text-gray-700 font-['Open_Sans']">
                  Corporate contracts (London tech & US fintech) yield zero ad CAC and provide 50% upfront deposits upon PO signing, directly funding raw materials.
                </p>
                <div className="pt-2 text-[11px] text-[#4A2E7A] font-mono border-t border-[#D6C7EC] font-semibold">
                  Target: $60,600 Wholesale Rev • $22,933 Retained Profit
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#E4F3E9] border border-[#BBE3C7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#14512C] font-bold">3. Scale Advantage</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/80 text-[#14512C] font-bold border border-[#BBE3C7]">10,000+ units</span>
                </div>
                <h3 className="text-sm font-bold text-[#14512C] font-['Montserrat']">Dhaka Sourcing Power</h3>
                <p className="text-xs text-gray-700 font-['Open_Sans']">
                  10,000+ units pushes procurement across Narayanganj textile mills and Savar tanneries into tier-1 wholesale pricing: -15% FOB savings across all SKUs.
                </p>
                <div className="pt-2 text-[11px] text-[#14512C] font-mono border-t border-[#BBE3C7] font-semibold">
                  Priority factory slots • Zero-risk client-funded R&D
                </div>
              </div>
            </div>

            {/* Interactive Scenario Multiplier Sliders */}
            <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD] space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#8A6D3B]" />
                  <span>Simulate Year 1 Execution Scale</span>
                </div>
                <span className="text-[11px] font-mono text-gray-600 font-semibold">
                  B2C: {(b2cVolumeMultiplier * 100).toFixed(0)}% | B2B: {(b2bVolumeMultiplier * 100).toFixed(0)}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between text-gray-600 font-medium mb-1">
                    <span>B2C Sales Velocity (6,000 Units Baseline)</span>
                    <strong className="text-blue-700 font-mono">
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
                    className="w-full accent-[#1F3A2E] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-gray-600 font-medium mb-1">
                    <span>B2B Contract Acquisition (4,000 Units Baseline)</span>
                    <strong className="text-purple-700 font-mono">
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
                    className="w-full accent-[#1F3A2E] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Master Comparison Matrix: B2C vs B2B */}
          <div className="overflow-x-auto rounded-2xl border border-[#DDE3DD] bg-white shadow-sm">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead className="bg-[#1F3A2E] text-white uppercase text-[10px] font-semibold border-b border-[#1F3A2E]">
                <tr>
                  <th className="py-3.5 px-4 font-['Montserrat']">Financial Pillar</th>
                  <th className="py-3.5 px-4 text-emerald-100 font-['Montserrat']">B2C Retail Engine (6,000 pcs)</th>
                  <th className="py-3.5 px-4 text-emerald-100 font-['Montserrat']">B2B Wholesale Program (4,000 pcs)</th>
                  <th className="py-3.5 px-4 text-[#C8A96A] font-['Montserrat'] font-bold">Combined Master Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EFE8]">
                <tr className="hover:bg-[#F4F6F4] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#1F3A2E]">Gross Revenue</td>
                  <td className="py-3 px-4 font-mono text-gray-800">
                    ${(173350 * b2cVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-800">
                    ${(60600 * b2bVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#1F3A2E]">
                    ${((173350 * b2cVolumeMultiplier) + (60600 * b2bVolumeMultiplier)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
                <tr className="hover:bg-[#F4F6F4] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#1F3A2E]">Net Commercial Turnover</td>
                  <td className="py-3 px-4 font-mono text-blue-700 font-bold">
                    ${(155850 * b2cVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 font-mono text-purple-700 font-bold">
                    ${(60600 * b2bVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#8A6D3B]">
                    ${totalCombinedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
                <tr className="hover:bg-[#F4F6F4] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#1F3A2E]">Dhaka Factory COGS (Sea)</td>
                  <td className="py-3 px-4 font-mono text-rose-700 font-medium">
                    -${(33230 * b2cVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })} (-21.3%)
                  </td>
                  <td className="py-3 px-4 font-mono text-rose-700 font-medium">
                    -${(14840 * b2bVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })} (-24.5%)
                  </td>
                  <td className="py-3 px-4 font-mono text-rose-700 font-bold">
                    -${((33230 * b2cVolumeMultiplier) + (14840 * b2bVolumeMultiplier)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
                <tr className="hover:bg-[#F4F6F4] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#1F3A2E]">Operating EBITDA</td>
                  <td className="py-3 px-4 font-mono text-[#1F3A2E] font-semibold">
                    ${(44590 * b2cVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })} (28.6%)
                  </td>
                  <td className="py-3 px-4 font-mono text-[#1F3A2E] font-semibold">
                    ${(28312 * b2bVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })} (46.7%)
                  </td>
                  <td className="py-3 px-4 font-mono text-[#1F3A2E] font-bold">
                    ${((44590 * b2cVolumeMultiplier) + (28312 * b2bVolumeMultiplier)).toLocaleString(undefined, { maximumFractionDigits: 0 })} (33.7%)
                  </td>
                </tr>
                <tr className="hover:bg-[#F4F6F4] bg-[#E4F3E9]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#14512C]">Net Retained Profit</td>
                  <td className="py-3.5 px-4 font-mono text-[#14512C] font-bold">
                    ${(36118 * b2cVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })} (23.2%)
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#14512C] font-bold">
                    ${(22933 * b2bVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })} (37.8%)
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#14512C] font-extrabold text-sm">
                    ${estimatedRetainedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({blendedMarginPct.toFixed(1)}%)
                  </td>
                </tr>
                <tr className="hover:bg-[#F4F6F4] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#1F3A2E]">Working Capital Mechanics</td>
                  <td className="py-3 px-4 text-[11px] text-gray-700">
                    Locks capital in ocean transit; rolling 14-day Amazon disbursements & 48h Stripe payouts
                  </td>
                  <td className="py-3 px-4 text-[11px] text-gray-700">
                    50% upfront client deposit upon PO; 50% settled against Bill of Lading (BL) copy
                  </td>
                  <td className="py-3 px-4 text-[11px] text-[#14512C] font-bold">
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
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
            <h2 className="text-base font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#1F3A2E]" />
              <span>Full-Year B2C Profit & Loss Statement (6,000 Units Target)</span>
            </h2>
            <p className="text-xs text-gray-600 font-['Open_Sans']">
              Volume split: New York 60% (3,600 pcs) / London 40% (2,400 pcs). Provides critical mass to win the Amazon Prime Buy Box while maximizing DTC margin on Shopify.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead className="bg-[#1F3A2E] text-white uppercase text-[10px] font-semibold border-b border-[#1F3A2E]">
                <tr>
                  <th className="py-3 px-4 font-['Montserrat']">Financial Line Item</th>
                  <th className="py-3 px-4 font-['Montserrat']">Total Amount (USD)</th>
                  <th className="py-3 px-4 font-['Montserrat']">% of Net Turnover</th>
                  <th className="py-3 px-4 font-['Montserrat']">% of Gross Sales</th>
                  <th className="py-3 px-4 font-['Montserrat']">Operational Basis & Allocation Logic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EFE8]">
                {basePnl.b2cLines.map((line, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-[#F4F6F4] transition-colors ${
                      line.isSubtotal ? 'bg-[#F4F6F4] font-semibold' : ''
                    }`}
                  >
                    <td className={`py-3 px-4 ${line.isSubtotal ? 'text-[#1F3A2E] font-bold' : 'text-gray-800'}`}>
                      {line.name}
                    </td>
                    <td
                      className={`py-3 px-4 font-mono font-bold ${
                        line.isNegative
                          ? 'text-rose-700'
                          : line.isSubtotal
                          ? 'text-emerald-700'
                          : 'text-[#1A1A1A]'
                      }`}
                    >
                      {line.amountUsd < 0 ? `-$${Math.abs(line.amountUsd).toLocaleString()}` : `$${line.amountUsd.toLocaleString()}`}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-700">
                      {line.pctNetTurnover !== undefined ? `${line.pctNetTurnover.toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-500">
                      {line.pctGrossSales !== undefined ? `${line.pctGrossSales.toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-[11px]">
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
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
            <h2 className="text-base font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#8A6D3B]" />
              <span>Standalone Year 1 B2B Wholesale Profit & Loss Statement (4,000 Units Target)</span>
            </h2>
            <p className="text-xs text-gray-600 font-['Open_Sans']">
              Targeted across 12 to 14 corporate accounts (~300 units per order) in London City and Silicon Alley New York. Operates with near-zero ad CAC and 50% upfront working capital deposits.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead className="bg-[#1F3A2E] text-white uppercase text-[10px] font-semibold border-b border-[#1F3A2E]">
                <tr>
                  <th className="py-3 px-4 font-['Montserrat']">Financial Line Item</th>
                  <th className="py-3 px-4 font-['Montserrat']">Total Amount (USD)</th>
                  <th className="py-3 px-4 font-['Montserrat']">% of Gross Revenue</th>
                  <th className="py-3 px-4 font-['Montserrat']">Strategic Basis & Operating Logic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EFE8]">
                {basePnl.b2bLines.map((line, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-[#F4F6F4] transition-colors ${
                      line.isSubtotal ? 'bg-[#F4F6F4] font-semibold' : ''
                    }`}
                  >
                    <td className={`py-3 px-4 ${line.isSubtotal ? 'text-[#1F3A2E] font-bold' : 'text-gray-800'}`}>
                      {line.name}
                    </td>
                    <td
                      className={`py-3 px-4 font-mono font-bold ${
                        line.isNegative
                          ? 'text-rose-700'
                          : line.isSubtotal
                          ? 'text-[#8A6D3B]'
                          : 'text-[#1A1A1A]'
                      }`}
                    >
                      {line.amountUsd < 0 ? `-$${Math.abs(line.amountUsd).toLocaleString()}` : `$${line.amountUsd.toLocaleString()}`}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-700">
                      {line.pctNetTurnover !== undefined ? `${line.pctNetTurnover.toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-[11px]">
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
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
            <h2 className="text-base font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
              <Percent className="w-5 h-5 text-[#1F3A2E]" />
              <span>Unit Costing & Contribution Economics (Per-Bag Breakdown)</span>
            </h2>
            <p className="text-xs text-gray-600 font-['Open_Sans']">
              Granular breakdown of realize RRP, Dhaka FOB, ocean shipping share, pick/pack fees, and paid CAC targets across all 4 production tiers.
            </p>
          </div>

          {/* B2C Unit Economics Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider font-['Montserrat'] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#17456F]" />
              <span>B2C Retail Unit Contribution Economics</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
              <table className="w-full text-left text-xs text-[#1A1A1A]">
                <thead className="bg-[#1F3A2E] text-white uppercase text-[10px] font-semibold border-b border-[#1F3A2E]">
                  <tr>
                    <th className="py-3 px-4 font-['Montserrat']">SKU Tier</th>
                    <th className="py-3 px-4 font-['Montserrat']">Blended RRP</th>
                    <th className="py-3 px-4 font-['Montserrat']">Factory FOB</th>
                    <th className="py-3 px-4 font-['Montserrat']">Landed CIF</th>
                    <th className="py-3 px-4 font-['Montserrat']">Platform / Pick</th>
                    <th className="py-3 px-4 font-['Montserrat']">Paid Ad CAC</th>
                    <th className="py-3 px-4 font-['Montserrat'] text-emerald-200">Net Contribution</th>
                    <th className="py-3 px-4 font-['Montserrat'] text-emerald-200">Margin (%)</th>
                    <th className="py-3 px-4 font-['Montserrat']">Channel Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EFE8]">
                  {B2C_UNIT_ECONOMICS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F4F6F4] transition-colors">
                      <td className="py-3 px-4">
                        <strong className="text-[#1F3A2E] block">{item.skuTier}</strong>
                        <span className="text-[10px] text-gray-500 block max-w-xs">{item.optimizationNote}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#1A1A1A]">
                        ${item.blendedRrpUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-700">
                        ${item.factoryFobDhakaUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-700">
                        ${item.landedSeaCostCifUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-700">
                        ${item.pickPackPlatformFeeUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#8A6D3B] font-semibold">
                        ${item.paidAdCacTargetUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#14512C]">
                        ${item.netUnitContributionUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#14512C]">
                        {item.contributionMarginPct.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-[11px] text-gray-600">
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
            <h3 className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider font-['Montserrat'] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4A2E7A]" />
              <span>B2B Wholesale Unit Economics by Category</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
              <table className="w-full text-left text-xs text-[#1A1A1A]">
                <thead className="bg-[#1F3A2E] text-white uppercase text-[10px] font-semibold border-b border-[#1F3A2E]">
                  <tr>
                    <th className="py-3 px-4 font-['Montserrat']">Category</th>
                    <th className="py-3 px-4 font-['Montserrat']">Wholesale Price (FOB Dest.)</th>
                    <th className="py-3 px-4 font-['Montserrat']">BD Production COGS</th>
                    <th className="py-3 px-4 font-['Montserrat']">Ocean Freight</th>
                    <th className="py-3 px-4 font-['Montserrat']">Branding & Screen</th>
                    <th className="py-3 px-4 font-['Montserrat'] text-emerald-200">Gross Unit Profit</th>
                    <th className="py-3 px-4 font-['Montserrat'] text-emerald-200">Gross Margin (%)</th>
                    <th className="py-3 px-4 font-['Montserrat']">Target Client Segment & MOQ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EFE8]">
                  {B2B_UNIT_ECONOMICS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F4F6F4] transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#1F3A2E]">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#1A1A1A]">
                        ${item.wholesalePriceUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-700">
                        ${item.bangladeshProductionCogsUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-700">
                        ${item.oceanFreightDrayageUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-700">
                        ${item.brandingScreenPrintUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#14512C]">
                        ${item.grossUnitProfitUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#14512C]">
                        {item.grossMarginPct.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-[11px] text-gray-600">
                        <strong className="text-gray-800 block">{item.targetClientSegment}</strong>
                        <span>{item.buyerPersona} • MOQ {item.moqUnits}</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[#F4F6F4] font-semibold border-t-2 border-[#1F3A2E]">
                    <td className="py-3 px-4 text-[#1F3A2E] font-bold">Blended B2B Total (4,000 pcs)</td>
                    <td className="py-3 px-4 font-mono text-[#8A6D3B] font-bold">$15.15 avg</td>
                    <td className="py-3 px-4 font-mono text-gray-700">$3.71 avg</td>
                    <td className="py-3 px-4 font-mono text-gray-700">$0.82 avg</td>
                    <td className="py-3 px-4 font-mono text-gray-700">$0.73 avg</td>
                    <td className="py-3 px-4 font-mono text-[#14512C] font-bold">$9.89 avg</td>
                    <td className="py-3 px-4 font-mono text-[#14512C] font-extrabold">65.3% avg</td>
                    <td className="py-3 px-4 text-[11px] text-[#14512C] font-bold">Total B2B Gross Profit: $38,360</td>
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
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
            <h2 className="text-base font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1F3A2E]" />
              <span>Working Capital & Postponed VAT Accounting (PVA) Architecture</span>
            </h2>
            <p className="text-xs text-gray-600 font-['Open_Sans']">
              Adopting 100% ocean freight, Net-60 intercompany credit terms, and UK Postponed VAT Accounting frees upfront liquidity and eliminates ~$7,000 in blocked customs cash.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Day-0 Equity Allocation Breakdown */}
            <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat']">
                  Day-0 Equity Runway Allocation ($14,500 Total)
                </h3>
                <span className="font-mono text-xs text-[#4A2E7A] bg-[#EDE7F6] px-2.5 py-0.5 rounded border border-[#D6C7EC] font-semibold">
                  ~£11,300 GBP
                </span>
              </div>

              <div className="space-y-2.5">
                {WORKING_CAPITAL_RUNWAY.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD] text-xs flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-[#1F3A2E]">{item.category}</div>
                      <div className="text-[11px] text-gray-600">{item.purpose}</div>
                      <span className="text-[10px] text-[#8A6D3B] font-mono font-semibold">{item.timing}</span>
                    </div>
                    <div className="text-right font-mono shrink-0 pl-3">
                      <div className="font-bold text-[#1A1A1A]">${item.amountUsd.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-500">£{item.amountGbp.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PVA & Intercompany Credit Mechanisms */}
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white border border-[#C5D7ED] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#17456F]" />
                  <h3 className="text-sm font-bold text-[#17456F] font-['Montserrat']">
                    UK Postponed VAT Accounting (PVA) Shield
                  </h3>
                </div>
                <p className="text-xs text-gray-600 font-['Open_Sans']">
                  By declaring ArielMC UK Ltd’s GB VAT and EORI number on UK customs entries, the 20% import VAT is deferred to quarterly VAT returns instead of being paid in cash at the port.
                </p>
                <div className="p-3.5 rounded-xl bg-[#E8F0FA] border border-[#C5D7ED] text-xs space-y-1.5 font-mono text-[#17456F]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Import Duty Rate (DCTS):</span>
                    <strong className="text-emerald-800">0% Preferential Duty</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Standard Import VAT Without PVA:</span>
                    <strong className="text-rose-700">~$7,000 Upfront Cash Blockage</strong>
                  </div>
                  <div className="flex justify-between border-t border-[#C5D7ED] pt-1">
                    <span className="text-[#17456F] font-semibold">Net Cash Preserved via PVA:</span>
                    <strong className="text-[#17456F] font-bold">$7,000 Liquid Working Capital</strong>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#FBE3B0] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-[#8A6D3B]" />
                  <h3 className="text-sm font-bold text-[#7A5508] font-['Montserrat']">
                    Net-60 Intercompany Credit & Rolling Cash Flow Loop
                  </h3>
                </div>
                <p className="text-xs text-gray-600 font-['Open_Sans']">
                  ArielMC BD issues Batch 2 and 3 production orders under Net-60 intercompany credit terms. Ocean freight is paid upfront, but factory balances are settled directly from rolling 14-day Amazon disbursements and 48-hour Shopify Stripe payouts.
                </p>
                <div className="p-3.5 rounded-xl bg-[#FEF6E4] border border-[#FBE3B0] text-xs text-[#7A5508] font-mono space-y-1 font-medium">
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
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
            <h2 className="text-base font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
              <Ship className="w-5 h-5 text-[#1F3A2E]" />
              <span>Quarterly Staged Ocean Shipping Cadence (55–65 Days End-to-End)</span>
            </h2>
            <p className="text-xs text-gray-600 font-['Open_Sans']">
              Transit takes 25–35 days to London Gateway and 30–38 days to the Port of New York/New Jersey. Total lead time requires reorders to trigger strictly at Day 35 of each operational cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUARTERLY_BATCH_PLANS.map((batch) => (
              <div
                key={batch.batchNumber}
                className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF2F6] text-[#475569] border border-[#D5DEE7] font-semibold">
                      {batch.months}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                        batch.status === 'COMPLETED'
                          ? 'bg-[#E4F3E9] text-[#14512C] border-[#BBE3C7]'
                          : batch.status === 'IN_PRODUCTION'
                          ? 'bg-[#FEF6E4] text-[#7A5508] border-[#FBE3B0]'
                          : 'bg-[#EEF2F6] text-[#475569] border-[#D5DEE7]'
                      }`}
                    >
                      {batch.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat']">
                    {batch.name}
                  </h3>
                  <div className="text-2xl font-bold font-mono text-[#8A6D3B]">
                    {batch.totalUnits.toLocaleString()} units
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD] text-[11px] space-y-1 font-mono text-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bloom Satchel:</span>
                      <strong className="text-gray-900">{batch.bloomUnits} pcs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mid-Level EDC:</span>
                      <strong className="text-gray-900">{batch.midLevelUnits} pcs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Commuter Shopper:</span>
                      <strong className="text-gray-900">{batch.commuterUnits} pcs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Economy Canvas:</span>
                      <strong className="text-gray-900">{batch.economyUnits} pcs</strong>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1 pt-1 font-['Open_Sans']">
                    <p><strong className="text-[#1F3A2E]">Funding:</strong> {batch.fundingMechanism}</p>
                    <p><strong className="text-[#1F3A2E]">Logistics:</strong> {batch.logisticsAllocation}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FEF6E4] border border-[#FBE3B0] text-[11px] font-mono text-[#7A5508] flex items-center justify-between font-bold">
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
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
            <h2 className="text-base font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#1F3A2E]" />
              <span>B2B Specimen Kit "Trojan Horse" Outbound Campaign Engine</span>
            </h2>
            <p className="text-xs text-gray-600 font-['Open_Sans']">
              Targeted Account-Based Marketing (ABM) for London and New York tech/fintech procurement leads. Eliminates cold pitch friction by delivering high-finish physical specimen presentation boxes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ROI Metrics & Funnel */}
            <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat']">
                Quarterly Specimen Outbound Economics
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD]">
                  <span className="text-gray-500 text-[10px] block uppercase font-semibold">Quarterly Boxes</span>
                  <span className="text-xl font-bold text-[#1F3A2E] mt-1 block">40 Boxes</span>
                  <span className="text-[10px] text-gray-600">160 Boxes / Year</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD]">
                  <span className="text-gray-500 text-[10px] block uppercase font-semibold">Cost to Dispatch</span>
                  <span className="text-xl font-bold text-[#8A6D3B] mt-1 block">$35 – $45</span>
                  <span className="text-[10px] text-gray-600">via DHL Express</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD]">
                  <span className="text-gray-500 text-[10px] block uppercase font-semibold">Conversion Rate</span>
                  <span className="text-xl font-bold text-[#14512C] mt-1 block">15%</span>
                  <span className="text-[10px] text-gray-600">Vetted Leads</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD]">
                  <span className="text-gray-500 text-[10px] block uppercase font-semibold">Quarterly Contracts</span>
                  <span className="text-xl font-bold text-[#4A2E7A] mt-1 block">6 Clients</span>
                  <span className="text-[10px] text-gray-600">~$15,150 Rev / Qtr</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD] text-xs space-y-2">
                <div className="font-bold text-[#1F3A2E] font-['Montserrat']">Specimen Presentation Box Contents:</div>
                <div className="space-y-1 text-gray-700 pl-2">
                  <div>• 1x Custom Debossed Jute-Cotton Commuter Bag (TP-AMC-JCT-1612)</div>
                  <div>• 1x Vegetable-Tanned Leather Accessory Swatch (Savar LWG Chromium-VI free)</div>
                  <div>• 1x Printed ESG Factsheet detailing ArielMC’s REACH-compliant Bangladesh supply chain</div>
                </div>
              </div>
            </div>

            {/* Cold Outreach Script Generator */}
            <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#DDE3DD]">
                  <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat']">
                    Validated Cold Outreach Script (London & NY)
                  </h3>
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-semibold transition-all shadow"
                  >
                    {copiedScript ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Template'}</span>
                  </button>
                </div>

                <pre className="mt-3 p-4 rounded-xl bg-[#F8F9FA] border border-[#DDE3DD] text-[#1A1A1A] font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {coldOutreachScript}
                </pre>
              </div>

              <div className="p-3 rounded-lg bg-[#FEF6E4] border border-[#FBE3B0] text-[10px] text-[#7A5508] font-medium">
                Tip: Target mid-market companies (100–1,000 employees) in Shoreditch/Old Street and Flatiron/Midtown that recently announced Series A/B funding or office expansions.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
