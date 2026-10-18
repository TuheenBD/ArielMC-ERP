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
  BarChart3,
  Globe2,
  Plane,
  Store,
  Compass,
  ShoppingBag,
  Boxes,
  Share2,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { ExecutiveReportsSuite } from '@/components/ExecutiveReportsSuite';
import { DailyExpensesEntrySection } from '@/components/DailyExpensesEntrySection';
import { B2BOrderWisePnlSection } from '@/components/B2BOrderWisePnlSection';
import { B2CLotShipmentWisePnlSection } from '@/components/B2CLotShipmentWisePnlSection';
import { ReportGenerationModal } from '@/components/ReportGenerationModal';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { OfficialDocument } from '@/types/documentPortal';
import {
  INITIAL_DUAL_TRACK_PNL,
  B2C_UNIT_ECONOMICS,
  B2B_UNIT_ECONOMICS,
  WORKING_CAPITAL_RUNWAY,
  QUARTERLY_BATCH_PLANS,
} from '@/data/initialFinanceData';

type FinanceTab =
  | 'OVERVIEW'
  | 'DAILY_EXPENSES_AUDIT'
  | 'REPORTS_SUITE'
  | 'LONDON_HYBRID_LAUNCH'
  | 'B2B_EXPANSION_PLAN'
  | 'RAW_MATERIALS_STRATEGY'
  | 'B2C_PNL'
  | 'B2B_PNL'
  | 'UNIT_ECONOMICS'
  | 'CASH_FLOW_PVA'
  | 'SHIPPING_CADENCE'
  | 'SPECIMEN_ROI';

export const FinanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('OVERVIEW');
  const [copiedScript, setCopiedScript] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportGenModalOpen, setIsReportGenModalOpen] = useState(false);
  const [reportGenInitialView, setReportGenInitialView] = useState<'BUILDER' | 'PREVIEW'>('BUILDER');

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

  // Master Commercial Pricing & Profit Margin Policy Engine
  // Policy Rule 1: Profit Margin: minimum 25%-30%
  // Policy Rule 2: B2B Price based on 40%-50% less than B2C/D2C Price
  const [calcD2cPrice, setCalcD2cPrice] = useState<number>(65);
  const [calcB2bDiscountPct, setCalcB2bDiscountPct] = useState<number>(45); // 40%-50% off D2C
  const [calcProfitMarginPct, setCalcProfitMarginPct] = useState<number>(30); // min 25%-30%
  const simB2bPrice = Number((calcD2cPrice * (1 - calcB2bDiscountPct / 100)).toFixed(2));
  const simMaxTargetBuy = Number((simB2bPrice * (1 - calcProfitMarginPct / 100)).toFixed(2));
  const simMaxTargetBuyBdt = Math.round(simMaxTargetBuy * 121.5);
  const simUnitProfit = Number((simB2bPrice - simMaxTargetBuy).toFixed(2));

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

  const financePnlDoc: OfficialDocument = {
    id: 'DOC-FIN-PNL-2026',
    docCode: 'AMC-FIN-2026-PL01',
    documentNumber: 'AMC-FIN-2026-PL01',
    title: 'ArielMC Global Multi-Station P&L Statement & Economic Audit',
    category: 'FINANCIAL_AUDIT',
    section: 'STATION_STATUTORY',
    issuingAuthority: 'ArielMC Finance & Treasury Board (Dhaka / London / New York)',
    station: 'ARIEL_BD',
    countryCode: 'GLOBAL',
    entityCode: 'AMC_HQ',
    issueDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: 'ACTIVE',
    verificationUrl: 'https://erp.arielmc.com/verify-doc?code=AMC-FIN-2026-PL01&ack=true',
    qrCodeData: 'AMC-FIN-2026-PL01|ARIELMC_FINANCIAL_PNL_STATEMENT',
    fileUrl: '/docs/ArielMC_Financial_Pnl_Statement.pdf',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    version: '2026.1',
    tags: ['Finance', 'P&L', 'Unit Economics', 'PVA Tax Shield', 'Audited'],
    notes: 'Audited dual-track economics (6,000 B2C + 4,000 B2B target) with Postponed VAT Accounting compliance.',
    isStatutoryRequirement: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
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

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setReportGenInitialView('BUILDER');
                setIsReportGenModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer border border-emerald-400/40 font-['Montserrat']"
              title="Generate comprehensive financial statements and reports"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#C8A96A]" />
              <span>+ Generate Statement</span>
            </button>
            <button
              onClick={() => {
                setReportGenInitialView('PREVIEW');
                setIsReportGenModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium transition-all cursor-pointer"
              title="Open Official Consolidated P&L Statement Preview Screen"
            >
              <Printer className="w-4 h-4 text-[#C8A96A]" />
              <span>Export P&L</span>
            </button>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer border border-emerald-400/30"
              title="Share Financial Statement & P&L for Verified / Acknowledgement"
            >
              <Share2 className="w-4 h-4" />
              <span>Share (Verify / Ack)</span>
            </button>
            <button
              onClick={() => {
                setB2cVolumeMultiplier(1.0);
                setB2bVolumeMultiplier(1.0);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b59556] text-[#1F3A2E] text-xs font-bold font-['Montserrat'] transition-all shadow cursor-pointer"
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
            <span className="text-[10px] text-emerald-700 font-mono font-medium block">
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
          id="btn-finance-reports-suite"
          onClick={() => setActiveTab('REPORTS_SUITE')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'REPORTS_SUITE'
              ? 'bg-[#1F3A2E] text-white shadow-sm border border-[#1F3A2E]'
              : 'text-[#1E6B3A] bg-emerald-50/60 hover:text-[#1F3A2E] hover:bg-emerald-100/60 border border-emerald-200 font-bold'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#C8A96A]" />
          <span>Reports &amp; Accounts Payable</span>
        </button>

        <button
          id="btn-finance-daily-expenses"
          onClick={() => setActiveTab('DAILY_EXPENSES_AUDIT')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] cursor-pointer ${
            activeTab === 'DAILY_EXPENSES_AUDIT'
              ? 'bg-[#1F3A2E] text-white shadow-sm border border-[#1F3A2E]'
              : 'text-[#1E6B3A] bg-emerald-50/80 hover:text-[#1F3A2E] hover:bg-emerald-100/80 border border-emerald-300 font-bold'
          }`}
        >
          <Receipt className="w-3.5 h-3.5 text-[#C8A96A]" />
          <span>Voucher Center (Purchase &amp; Receive)</span>
          <span className="px-1.5 py-0.2 rounded bg-[#C8A96A] text-[#12231B] font-mono text-[9px] font-bold">
            4 Heads &amp; Memos
          </span>
        </button>

        <button
          id="btn-finance-london-hybrid"
          onClick={() => setActiveTab('LONDON_HYBRID_LAUNCH')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] ${
            activeTab === 'LONDON_HYBRID_LAUNCH'
              ? 'bg-[#1F3A2E] text-white shadow-sm border border-[#1F3A2E]'
              : 'text-[#17456F] bg-blue-50/70 hover:text-[#1F3A2E] hover:bg-blue-100/70 border border-blue-200 font-bold'
          }`}
        >
          <Plane className="w-3.5 h-3.5 text-[#17456F]" />
          <span>London Hybrid Launch (£113k)</span>
        </button>

        <button
          id="btn-finance-b2b-expansion"
          onClick={() => setActiveTab('B2B_EXPANSION_PLAN')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] cursor-pointer ${
            activeTab === 'B2B_EXPANSION_PLAN'
              ? 'bg-[#1F3A2E] text-white shadow-sm border border-[#1F3A2E]'
              : 'text-[#7A5508] bg-amber-50/70 hover:text-[#1F3A2E] hover:bg-amber-100/70 border border-amber-200 font-bold'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5 text-[#C8A96A]" />
          <span>Global B2B Expansion (24-Mo)</span>
        </button>

        <button
          id="btn-finance-raw-materials-strategy"
          onClick={() => setActiveTab('RAW_MATERIALS_STRATEGY')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap font-['Montserrat'] cursor-pointer ${
            activeTab === 'RAW_MATERIALS_STRATEGY'
              ? 'bg-[#1F3A2E] text-white shadow-sm border border-[#1F3A2E]'
              : 'text-[#1F3A2E] bg-emerald-50/80 hover:text-[#1F3A2E] hover:bg-emerald-100/80 border border-emerald-300 font-bold'
          }`}
        >
          <Boxes className="w-3.5 h-3.5 text-[#1F3A2E]" />
          <span>Raw Materials to Global (2026–2030)</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 font-mono text-[9px] font-bold">
            95% Retained
          </span>
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
          <span>B2C Retail P&amp;L (Lot / Shipment Wise)</span>
          <span className="px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 font-mono text-[9px] font-bold">
            Consignment Lots
          </span>
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
          <span>B2B Wholesale P&amp;L (Order Wise)</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-bold">
            Sales Orders
          </span>
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

      {/* TAB: DAILY EXPENSES ENTRY UNDER ACCOUNT HEADS */}
      {activeTab === 'DAILY_EXPENSES_AUDIT' && (
        <DailyExpensesEntrySection />
      )}

      {/* TAB: EXECUTIVE REPORTS & ACCOUNTS PAYABLE SUITE */}
      {activeTab === 'REPORTS_SUITE' && (
        <ExecutiveReportsSuite
          activeEntity={{
            id: 'comp_bd_01',
            code: 'ARIEL_BD',
            legalName: 'Ariel Marketing & Communications Limited',
            country: 'Bangladesh',
            countryCode: 'BD',
            flag: '🇧🇩',
            city: 'Dhaka',
            address: 'House - 30 (1st Floor), Road - 07, Block - C, Niketon, Gulshan, Dhaka-1212',
            baseCurrency: 'BDT',
            taxIdentifier: { type: 'BIN / TIN', number: 'BIN-003892714-0102' },
            legalStatus: 'Private Limited Company',
            role: 'Global Holding, Product Sourcing & R&D Headquarters',
            domains: ['www.arielmc.com'],
            activeFacilities: ['Dhaka Central Merchandising Hub', 'Savar LWG QC Lab'],
            bankAccounts: []
          }}
          activeCurrency={{ code: 'USD', name: 'US Dollar', symbol: '$', rateToUsd: 1.0, symbolPosition: 'before' }}
        />
      )}

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
                    <strong className="text-emerald-700 font-mono">
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
                    <strong className="text-[#8A6D3B] font-mono">
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

          {/* Master Commercial Pricing & Profit Margin Policy Governance Card */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#DDE3DD]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1F3A2E] text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                    Executive Directives
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] font-mono text-[10px] font-bold">
                    Minimum Margin: 25% – 30%
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F0FA] text-[#17456F] border border-[#C5D7ED] font-mono text-[10px] font-bold">
                    B2B Wholesale: 40% – 50% Less Than D2C
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#8A6D3B]" />
                  <span>Master Commercial Pricing & Profit Margin Policy Engine</span>
                </h2>
                <p className="text-xs text-gray-600 font-['Open_Sans'] max-w-3xl">
                  Enforces ArielMC's sovereign commercial model across all 74 catalogue SKUs: every B2B wholesale quotation must be structured <strong>40% to 50% below</strong> the verified consumer D2C retail price, while guaranteeing a <strong>minimum 25% to 30% retained gross margin</strong> above Dhaka factory buy costs.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border ${
                  calcProfitMarginPct >= 25 && calcB2bDiscountPct >= 40 && calcB2bDiscountPct <= 50
                    ? 'bg-[#E4F3E9] text-[#14512C] border-[#BBE3C7]'
                    : 'bg-[#FEF3D6] text-amber-800 border-amber-300'
                }`}>
                  {calcProfitMarginPct >= 25 && calcB2bDiscountPct >= 40 && calcB2bDiscountPct <= 50 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#14512C]" />
                      <span>Policy Compliant</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      <span>Adjust to Policy</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Policy Simulation Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
              {/* Control 1: D2C Retail MSRP */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-1">
                    <span>1. Consumer D2C Price (MSRP)</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-[#1F3A2E] bg-white px-2 py-0.5 rounded border border-[#DDE3DD]">
                    ${calcD2cPrice.toFixed(2)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-mono font-bold">$</span>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    step={1}
                    value={calcD2cPrice}
                    onChange={(e) => setCalcD2cPrice(Math.max(5, Number(e.target.value) || 0))}
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-[#DDE3DD] bg-white text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1F3A2E]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 font-semibold block">Quick Catalog Benchmarks:</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { label: '$28 Jute', val: 28 },
                      { label: '$48 Ceramic', val: 48 },
                      { label: '$65 Folio', val: 65 },
                      { label: '$120 Leather', val: 120 },
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        type="button"
                        onClick={() => setCalcD2cPrice(btn.val)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all border ${
                          calcD2cPrice === btn.val
                            ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] font-bold'
                            : 'bg-white text-gray-700 border-[#DDE3DD] hover:bg-gray-100'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Control 2: B2B Wholesale Discount (40% - 50% off) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-1">
                    <span>2. B2B Wholesale Discount</span>
                  </label>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    calcB2bDiscountPct >= 40 && calcB2bDiscountPct <= 50
                      ? 'bg-[#E8F0FA] text-[#17456F] border-[#C5D7ED]'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {calcB2bDiscountPct}% Less
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="60"
                  step="1"
                  value={calcB2bDiscountPct}
                  onChange={(e) => setCalcB2bDiscountPct(Number(e.target.value))}
                  className="w-full accent-[#17456F] cursor-pointer"
                />
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 font-semibold block">Policy Discount Presets:</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { label: '40% Off (Min)', val: 40 },
                      { label: '45% Off (Standard)', val: 45 },
                      { label: '50% Off (Max)', val: 50 },
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        type="button"
                        onClick={() => setCalcB2bDiscountPct(btn.val)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all border ${
                          calcB2bDiscountPct === btn.val
                            ? 'bg-[#17456F] text-white border-[#17456F] font-bold'
                            : 'bg-white text-gray-700 border-[#DDE3DD] hover:bg-gray-100'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 font-mono block">
                  Mandate: B2B must be 40%–50% less than D2C ($calcD2cPrice → ${simB2bPrice})
                </span>
              </div>

              {/* Control 3: Profit Margin (min 25% - 30%) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-1">
                    <span>3. Retained Profit Margin</span>
                  </label>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    calcProfitMarginPct >= 25
                      ? 'bg-[#E4F3E9] text-[#14512C] border-[#BBE3C7]'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {calcProfitMarginPct}% Margin
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="45"
                  step="1"
                  value={calcProfitMarginPct}
                  onChange={(e) => setCalcProfitMarginPct(Number(e.target.value))}
                  className="w-full accent-[#14512C] cursor-pointer"
                />
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 font-semibold block">Mandatory Margin Targets:</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { label: '25% Min Required', val: 25 },
                      { label: '28% Standard', val: 28 },
                      { label: '30% Target Policy', val: 30 },
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        type="button"
                        onClick={() => setCalcProfitMarginPct(btn.val)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all border ${
                          calcProfitMarginPct === btn.val
                            ? 'bg-[#14512C] text-white border-[#14512C] font-bold'
                            : 'bg-white text-gray-700 border-[#DDE3DD] hover:bg-gray-100'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 font-mono block">
                  Mandate: Minimum 25%–30% sourcing margin on B2B FOB Sell
                </span>
              </div>
            </div>

            {/* Live Economic Metrics Dashboard (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: B2B FOB Wholesale Sell */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">B2B FOB Wholesale Sell</span>
                  <span className="text-[10px] font-mono font-bold text-[#17456F] bg-[#E8F0FA] px-1.5 py-0.5 rounded">
                    -{calcB2bDiscountPct}% vs D2C
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#17456F]">
                  ${simB2bPrice.toFixed(2)}
                </div>
                <p className="text-[11px] text-gray-600 font-['Open_Sans']">
                  D2C MSRP (${calcD2cPrice.toFixed(2)}) is <strong className="text-gray-900 font-mono">{(calcD2cPrice / (simB2bPrice || 1)).toFixed(2)}x</strong> this wholesale price.
                </p>
              </div>

              {/* Metric 2: Max Factory Buy Cost (Cap) */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">Max Target Factory Buy</span>
                  <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    Ceiling Cap
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-rose-700">
                  ${simMaxTargetBuy.toFixed(2)}
                </div>
                <div className="text-xs font-mono font-bold text-gray-700">
                  ৳{simMaxTargetBuyBdt.toLocaleString()} BDT <span className="text-[10px] font-normal text-gray-500">(@ 121.5)</span>
                </div>
                <p className="text-[10px] text-gray-500 font-['Open_Sans']">
                  Purchasing ceiling: FOB ${simB2bPrice.toFixed(2)} × {(1 - calcProfitMarginPct / 100).toFixed(2)}.
                </p>
              </div>

              {/* Metric 3: Retained Gross Profit */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">Retained Gross Profit</span>
                  <span className="text-[10px] font-mono font-bold text-[#14512C] bg-[#E4F3E9] px-1.5 py-0.5 rounded">
                    {calcProfitMarginPct}% Margin
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#14512C]">
                  +${simUnitProfit.toFixed(2)}
                  <span className="text-xs font-normal text-gray-500 font-sans"> / pc</span>
                </div>
                <div className="text-[11px] text-gray-700 font-mono font-medium">
                  500 pcs: <strong className="text-[#14512C]">+${(simUnitProfit * 500).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                </div>
                <div className="text-[11px] text-gray-700 font-mono font-medium">
                  2,000 pcs: <strong className="text-[#14512C]">+${(simUnitProfit * 2000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                </div>
              </div>

              {/* Metric 4: Policy Audit Status */}
              <div className={`p-4 rounded-xl border shadow-xs space-y-1 flex flex-col justify-between ${
                calcProfitMarginPct >= 25 && calcB2bDiscountPct >= 40 && calcB2bDiscountPct <= 50
                  ? 'bg-[#E4F3E9] border-[#BBE3C7]'
                  : 'bg-[#FEF3D6] border-amber-300'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-gray-700">Governance Audit</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      calcProfitMarginPct >= 25 && calcB2bDiscountPct >= 40 && calcB2bDiscountPct <= 50
                        ? 'bg-[#14512C] text-white'
                        : 'bg-amber-800 text-white'
                    }`}>
                      {calcProfitMarginPct >= 25 && calcB2bDiscountPct >= 40 && calcB2bDiscountPct <= 50 ? 'PASSED' : 'CHECK'}
                    </span>
                  </div>
                  <div className="text-sm font-bold font-['Montserrat'] mt-1 text-[#1F3A2E]">
                    {calcProfitMarginPct >= 25 && calcB2bDiscountPct >= 40 && calcB2bDiscountPct <= 50
                      ? 'Compliant with Policy'
                      : 'Adjustment Needed'}
                  </div>
                </div>

                <div className="space-y-0.5 text-[10px] font-mono">
                  <div className={calcProfitMarginPct >= 25 ? 'text-[#14512C] font-semibold' : 'text-amber-800 font-bold'}>
                    • Margin: {calcProfitMarginPct}% {calcProfitMarginPct >= 25 ? '(≥ 25% min ✓)' : '(< 25% min ✗)'}
                  </div>
                  <div className={calcB2bDiscountPct >= 40 && calcB2bDiscountPct <= 50 ? 'text-[#14512C] font-semibold' : 'text-amber-800 font-bold'}>
                    • Discount: {calcB2bDiscountPct}% {calcB2bDiscountPct >= 40 && calcB2bDiscountPct <= 50 ? '(in 40%–50% band ✓)' : '(outside 40%–50% ✗)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Reference Table Across All 5 Industrial Sectors */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider font-['Montserrat'] flex items-center gap-2">
                  <span>Standard 5-Sector Commercial Benchmark Matrix (45% Discount / 30% Margin Policy)</span>
                </h3>
                <span className="text-[10px] font-mono text-gray-500">
                  Dhaka Sourcing Baseline @ ৳121.5 / USD
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white">
                <table className="w-full text-left text-xs text-[#1A1A1A]">
                  <thead className="bg-[#1F3A2E] text-white uppercase text-[10px] font-semibold border-b border-[#1F3A2E]">
                    <tr>
                      <th className="py-2.5 px-3 font-['Montserrat']">Industrial Sector</th>
                      <th className="py-2.5 px-3 font-['Montserrat']">Archetype SKU</th>
                      <th className="py-2.5 px-3 font-['Montserrat'] text-right">D2C Retail MSRP</th>
                      <th className="py-2.5 px-3 font-['Montserrat'] text-right text-emerald-200">B2B FOB (-45%)</th>
                      <th className="py-2.5 px-3 font-['Montserrat'] text-right text-rose-200">Max Factory Buy (30% Margin)</th>
                      <th className="py-2.5 px-3 font-['Montserrat'] text-right text-emerald-200">Retained Profit</th>
                      <th className="py-2.5 px-3 font-['Montserrat'] text-center">Policy Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EFE8] text-[11px]">
                    {[
                      { sector: '💼 Leather', sku: 'LD-SCB-6 Full-Grain Executive Briefcase', d2c: 140, b2b: 77.0, buyUsd: 53.90, buyBdt: 6549, profit: 23.10 },
                      { sector: '🛍️ Jute', sku: 'JD-CRF-18 Laminated Heritage Shopper', d2c: 24, b2b: 13.20, buyUsd: 9.24, buyBdt: 1123, profit: 3.96 },
                      { sector: '🧵 Textile', sku: 'TD-BAG-36 Recycled Canvas Commuter Duffle', d2c: 64, b2b: 35.20, buyUsd: 24.64, buyBdt: 2994, profit: 10.56 },
                      { sector: '🍽️ Ceramics', sku: 'CD-DIN-52 Stoneware 4-Piece Dining Set', d2c: 52, b2b: 28.60, buyUsd: 20.02, buyBdt: 2432, profit: 8.58 },
                      { sector: '🏺 Pottery', sku: 'PT-ARC-74 Hand-Thrown Terracotta Planter', d2c: 36, b2b: 19.80, buyUsd: 13.86, buyBdt: 1684, profit: 5.94 },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#F4F6F4] transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[#1F3A2E]">{row.sector}</td>
                        <td className="py-2.5 px-3 text-gray-800">{row.sku}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#1A1A1A]">${row.d2c.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#17456F]">${row.b2b.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-rose-700 font-semibold">
                          ${row.buyUsd.toFixed(2)} <span className="text-[10px] text-gray-500 font-normal block">(৳{row.buyBdt.toLocaleString()})</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#14512C]">+${row.profit.toFixed(2)} (30%)</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-[#E4F3E9] text-[#14512C] text-[10px] font-mono font-bold border border-[#BBE3C7]">
                            ✓ Compliant
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  <td className="py-3 px-4 font-mono text-emerald-700 font-bold">
                    ${(155850 * b2cVolumeMultiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#1E6B3A] font-bold">
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

      {/* TAB: LONDON HYBRID E-COMMERCE LAUNCH (UK 3PL / INVESTOR BRIEF) */}
      {activeTab === 'LONDON_HYBRID_LAUNCH' && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#17456F] to-[#0D2B47] border-b-[3px] border-[#C8A96A] text-white space-y-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A] text-[#1F3A2E] font-mono text-[10px] font-bold uppercase tracking-wider">
                    Investor Brief • August 2026
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] font-bold">
                    Dhaka HQ ⇄ London 3PL Hub
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 font-mono text-[10px] font-bold">
                    Payback: Month 12
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold font-['Montserrat'] tracking-tight flex items-center gap-2.5 text-white">
                  <Plane className="w-6 h-6 text-[#C8A96A]" />
                  <span>London Hybrid E-Commerce Launch &amp; UK 3PL Model</span>
                </h2>
                <p className="text-xs text-white/80 max-w-3xl font-['Open_Sans']">
                  Dhaka-operated, UK-fulfilled lifestyle and commuter-accessory launch. Combines premium Bangladesh leather accessories with Shenzhen demonstrative tech, fulfilled via automated virtual kitting at a London Heathrow 3PL (Huboo / ShipBob / Zendbox) and Royal Mail 24/48 delivery.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-right">
                  <span className="text-[10px] text-white/70 block uppercase font-mono">Seed Ask</span>
                  <span className="text-lg font-bold font-mono text-[#C8A96A]">£10,185</span>
                  <span className="text-[10px] text-emerald-300 block">+£1.8k contingency</span>
                </div>
              </div>
            </div>

            {/* Base-Case Investment KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-[10px] text-white/70 font-mono uppercase block">Opening Capital</span>
                <div className="text-xl font-bold font-mono text-white">£10.2k</div>
                <span className="text-[10px] text-white/60 font-mono block">£10,185 opening funding</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-[10px] text-white/70 font-mono uppercase block">Year-1 Net Rev</span>
                <div className="text-xl font-bold font-mono text-[#C8A96A]">£113.4k</div>
                <span className="text-[10px] text-emerald-300 font-mono block">£136.0k gross receipts</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-[10px] text-white/70 font-mono uppercase block">Year-1 Op Profit</span>
                <div className="text-xl font-bold font-mono text-emerald-300">£9.5k</div>
                <span className="text-[10px] text-white/60 font-mono block">8.4% Operating Margin</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-[10px] text-white/70 font-mono uppercase block">Orders / Year</span>
                <div className="text-xl font-bold font-mono text-white">2,980</div>
                <span className="text-[10px] text-white/60 font-mono block">~248 orders / month</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-[10px] text-white/70 font-mono uppercase block">Monthly Breakeven</span>
                <div className="text-xl font-bold font-mono text-white">Month 5</div>
                <span className="text-[10px] text-emerald-300 font-mono block">91 orders / month</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-[10px] text-white/70 font-mono uppercase block">Unit Contribution</span>
                <div className="text-xl font-bold font-mono text-[#C8A96A]">£7.76</div>
                <span className="text-[10px] text-white/60 font-mono block">20.4% net margin</span>
              </div>
            </div>
          </div>

          {/* Use of Funds & Capital Deployment */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <span>Use of Funds &amp; Working Capital Deployment (£10,185 Seed Allocation)</span>
                </h3>
                <p className="text-xs text-gray-600 font-['Open_Sans'] mt-0.5">
                  Controlled 50-unit-per-SKU pilot launch to test unit economics with zero speculative inventory risk.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#17456F] bg-[#E8F0FA] px-2.5 py-1 rounded border border-[#C5D7ED]">
                Total: £10,185
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {[
                { title: 'Compliance & Legal', gbp: 2900, pct: '28.5%', desc: 'UK Ltd, EORI, VAT registration, GPSR responsible person & CE/UKCA files' },
                { title: 'Initial Inventory', gbp: 1503, pct: '14.8%', desc: 'Batch 1 production: 50 units/SKU across 4 launch SKUs' },
                { title: 'Content & Systems', gbp: 1580, pct: '15.5%', desc: 'Shopify OS 2.0, 3-5 UK UGC creator video ads, 400 GSM warranty inserts' },
                { title: '3PL Setup & Inbound', gbp: 350, pct: '3.4%', desc: 'Huboo / ShipBob onboarding, barcode scanning & virtual kitting rule config' },
                { title: 'Protected Reserve', gbp: 2500, pct: '24.5%', desc: 'Untouchable cash reserve protecting at least 21 selling days stock cover' },
                { title: 'Launch-Loss Cover', gbp: 1702, pct: '16.7%', desc: 'Deliberate funding for Month 1–4 marketing burn until Month 5 cash break-even' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">{item.pct}</span>
                      <span className="text-xs font-mono font-bold text-[#17456F]">£{item.gbp.toLocaleString()}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#1F3A2E] font-['Montserrat'] mt-1">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-gray-600 font-['Open_Sans'] leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Launch Products & The London Commuter Bundle */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 4 Product Cards */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#8A6D3B]" />
                    <span>Launch Portfolio: 4 Demonstrative Commuter SKUs</span>
                  </h3>
                  <p className="text-xs text-gray-600 font-['Open_Sans']">
                    Lightweight products engineered for air-freight agility, high perceived value, and paid-social video hooks.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-gray-500 font-semibold">50 Units / SKU Test Batch</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    num: '1',
                    name: 'Leather MagSafe Wallet',
                    retail: '£44.00',
                    role: 'Hero accessory / bundle anchor',
                    origin: 'Dhaka, Bangladesh (LWG Leather)',
                    fob: '£5.50 (~$7.00)',
                    hook: 'Tactile snap on iPhone + RFID commuter shield on London Underground',
                  },
                  {
                    num: '2',
                    name: '3-in-1 Foldable Travel Charger',
                    retail: '£49.00',
                    role: 'High-value demonstrable tech',
                    origin: 'Shenzhen, China (Air DDP Line)',
                    fob: '£8.20 (~$10.50)',
                    hook: 'Folds flat into pocket; charges iPhone, Apple Watch & AirPods at hot desks',
                  },
                  {
                    num: '3',
                    name: 'Heavyweight Boxy T-shirt',
                    retail: '£35.00',
                    role: 'Volume and repeat purchase',
                    origin: 'Narayanganj, BD (280 GSM Cotton)',
                    fob: '£4.20 (~$5.40)',
                    hook: 'Thick, structural collar and heavyweight drape resisting washer distortion',
                  },
                  {
                    num: '4',
                    name: 'Fabric & Knitwear Shaver',
                    retail: '£31.00',
                    role: 'Seasonal problem-solver',
                    origin: 'Shenzhen, China (USB-C Rechargeable)',
                    fob: '£4.80 (~$6.10)',
                    hook: 'Instant before/after de-pilling on cashmere jumpers and commuter wool coats',
                  },
                ].map((prod) => (
                  <div key={prod.num} className="p-4 rounded-xl border border-[#DDE3DD] bg-[#FAFCFA] space-y-2 hover:border-[#17456F] transition-all">
                    <div className="flex items-center justify-between">
                      <span className="w-5 h-5 rounded-full bg-[#17456F] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                        {prod.num}
                      </span>
                      <span className="text-base font-bold font-mono text-[#1F3A2E]">{prod.retail}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1F3A2E] font-['Montserrat']">{prod.name}</h4>
                      <span className="text-[10px] text-[#8A6D3B] font-semibold block">{prod.role}</span>
                    </div>
                    <div className="text-[11px] text-gray-600 space-y-0.5 border-t border-[#DDE3DD] pt-1.5 font-['Open_Sans']">
                      <div><strong className="text-gray-800">Source:</strong> {prod.origin}</div>
                      <div><strong className="text-gray-800">Target FOB:</strong> {prod.fob}</div>
                      <div className="text-[10px] text-gray-500 italic pt-0.5">"{prod.hook}"</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Virtual Kitting Box: The London Commuter Bundle */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12231B] to-[#1F3A2E] text-white shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E] font-mono text-[10px] font-bold uppercase tracking-wider">
                    Virtual Kitting Engine
                  </span>
                  <span className="text-xs font-mono text-[#C8A96A] font-bold">Shopify UK Core Offer</span>
                </div>

                <div>
                  <h3 className="text-base font-bold font-['Montserrat'] text-white">
                    "The London Commuter Bundle"
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold font-mono text-[#C8A96A]">£69.99</span>
                    <span className="text-xs line-through text-white/50 font-mono">£96.99 value stack</span>
                  </div>
                </div>

                <p className="text-xs text-white/80 font-['Open_Sans'] leading-relaxed">
                  Sold as 1 SKU on Shopify UK, but assembled on-demand inside the UK 3PL warehouse when an order is placed:
                </p>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between items-center text-emerald-200">
                    <span>• 1x BD-WL-01 Leather MagSafe Wallet</span>
                    <span className="text-[10px] text-white/60">£38 value</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-200">
                    <span>• 1x CN-CH-01 3-in-1 Foldable Charger</span>
                    <span className="text-[10px] text-white/60">£42 value</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-200">
                    <span>• 1x Braided USB-C to USB-C Cable</span>
                    <span className="text-[10px] text-white/60">£12 value</span>
                  </div>
                  <div className="flex justify-between items-center text-white/70 border-t border-white/15 pt-1">
                    <span>• Custom Matte Black Box + 400 GSM Card</span>
                    <span className="text-[10px] text-emerald-300">Included</span>
                  </div>
                  <div className="flex justify-between items-center text-[#C8A96A] font-bold">
                    <span>• Royal Mail Tracked 48 Delivery</span>
                    <span>Free</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-xs font-mono space-y-1 text-white/90">
                <div className="flex justify-between font-bold">
                  <span>Gross Profit per Bundle:</span>
                  <span className="text-emerald-300">+£38.40</span>
                </div>
                <div className="flex justify-between text-[11px] text-white/70">
                  <span>Gross Margin:</span>
                  <span>54.8% on £69.99 sale</span>
                </div>
              </div>
            </div>
          </div>

          {/* Landed Logistics Cost & Operational Matrix */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#17456F]" />
                  <span>Dual-Origin Logistics Pipeline &amp; Landed Handling Breakdown (£8.75 / Bundle)</span>
                </h3>
                <p className="text-xs text-gray-600 font-['Open_Sans']">
                  How Dhaka leather and Shenzhen tech meet at London Heathrow (LHR) and reach customer doorsteps within 24–48 hours.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#14512C] bg-[#E4F3E9] px-2.5 py-1 rounded border border-[#BBE3C7]">
                Total Landed Logistics: £8.75
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#DDE3DD]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1F3A2E] text-white uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-3 px-4 font-['Montserrat']">Handling Component</th>
                    <th className="py-3 px-4 font-['Montserrat']">Provider / Carrier</th>
                    <th className="py-3 px-4 font-['Montserrat'] text-right">Cost / Bundle</th>
                    <th className="py-3 px-4 font-['Montserrat']">Operational SLA &amp; Mechanics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EFE8] text-[11px]">
                  <tr className="hover:bg-[#F4F6F4]">
                    <td className="py-2.5 px-4 font-semibold text-[#1F3A2E]">Origin 1: BD Air Freight</td>
                    <td className="py-2.5 px-4 font-mono text-gray-800">DHL / Aramex (DAC → LHR)</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-[#1A1A1A]">£1.40</td>
                    <td className="py-2.5 px-4 text-gray-600">4–6 Business Days. 50 units packed in double-walled export carton under 10 kg</td>
                  </tr>
                  <tr className="hover:bg-[#F4F6F4]">
                    <td className="py-2.5 px-4 font-semibold text-[#1F3A2E]">Origin 2: China Air Freight</td>
                    <td className="py-2.5 px-4 font-mono text-gray-800">Dedicated Air DDP Line (SZX → LHR)</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-[#1A1A1A]">£1.40</td>
                    <td className="py-2.5 px-4 text-gray-600">5–8 Business Days. Includes UN38.3 battery test report &amp; MSDS customs clearance</td>
                  </tr>
                  <tr className="hover:bg-[#F4F6F4]">
                    <td className="py-2.5 px-4 font-semibold text-[#1F3A2E]">UK Customs &amp; Port Clearance</td>
                    <td className="py-2.5 px-4 font-mono text-gray-800">PVA / DCTS 0% Duty Scheme</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-[#1A1A1A]">£0.35</td>
                    <td className="py-2.5 px-4 text-gray-600">Cleared in &lt;12 Hours. 20% import VAT deferred via Postponed VAT Accounting</td>
                  </tr>
                  <tr className="hover:bg-[#F4F6F4]">
                    <td className="py-2.5 px-4 font-semibold text-[#1F3A2E]">3PL Inbound Receiving</td>
                    <td className="py-2.5 px-4 font-mono text-gray-800">UK 3PL Warehouse (Huboo/ShipBob)</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-[#1A1A1A]">£0.40</td>
                    <td className="py-2.5 px-4 text-gray-600">Stocked into bin locations within 24 hours of arrival at dock</td>
                  </tr>
                  <tr className="hover:bg-[#F4F6F4]">
                    <td className="py-2.5 px-4 font-semibold text-[#1F3A2E]">3PL Pick, Pack &amp; Kitting</td>
                    <td className="py-2.5 px-4 font-mono text-gray-800">UK 3PL Assembly Line</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-[#1A1A1A]">£1.80</td>
                    <td className="py-2.5 px-4 text-gray-600">Picks 1x BD + 1x CN; boxes in matte black mailer with logo sticker &amp; 400 GSM card</td>
                  </tr>
                  <tr className="hover:bg-[#F4F6F4]">
                    <td className="py-2.5 px-4 font-semibold text-[#1F3A2E]">Last-Mile London Delivery</td>
                    <td className="py-2.5 px-4 font-mono text-gray-800">Royal Mail Tracked 48</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-[#1A1A1A]">£3.40</td>
                    <td className="py-2.5 px-4 text-gray-600">Delivered in 24–48 hours across London Zones 1–6. 2:00 PM GMT daily dispatch cutoff</td>
                  </tr>
                  <tr className="bg-[#E4F3E9]/60 font-bold border-t-2 border-[#1F3A2E]">
                    <td className="py-3 px-4 text-[#14512C]">Total Landed Logistics Cost</td>
                    <td className="py-3 px-4 font-mono text-[#14512C]">All Freight + Storage + Kitting + Delivery</td>
                    <td className="py-3 px-4 text-right font-mono text-sm text-[#14512C]">£8.75</td>
                    <td className="py-3 px-4 text-[#14512C]">Door-to-Door Synced from Dhaka/Shenzhen to London Consumer Doorstep</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Unit Economics Waterfall & 3PL Warehouse Evaluation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unit Economics Waterfall */}
            <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <Percent className="w-4 h-4 text-[#1F3A2E]" />
                  <span>Base-Case Unit Economics per Fulfilled Order</span>
                </h3>
                <p className="text-xs text-gray-600 font-['Open_Sans']">
                  VAT-aware contribution economics across 2,980 Year-1 blended orders.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { label: 'Customer Receipt (VAT-Inclusive)', amount: '£45.65', pct: '100.0%', isBold: true, isGreen: false, isRed: false },
                  { label: 'Less: UK VAT (20% standard rate)', amount: '-£7.61', pct: '-16.7%', isBold: false, isGreen: false, isRed: true },
                  { label: 'Net Commercial Revenue', amount: '£38.04', pct: '83.3%', isBold: true, isGreen: false, isRed: false },
                  { label: 'Product Landed Sourcing COGS', amount: '-£7.51', pct: '-19.7%', isBold: false, isGreen: false, isRed: true },
                  { label: '3PL Pick, Pack, Assembly & Delivery', amount: '-£5.20', pct: '-13.7%', isBold: false, isGreen: false, isRed: true },
                  { label: 'Payment Processing Fee & Returns (2%)', amount: '-£2.57', pct: '-6.8%', isBold: false, isGreen: false, isRed: true },
                  { label: 'Steady-State Customer Acquisition (CAC Target)', amount: '-£15.00', pct: '-39.4%', isBold: false, isGreen: false, isRed: true },
                  { label: 'Net Unit Contribution Before Overhead', amount: '+£7.76', pct: '20.4%', isBold: true, isGreen: true, isRed: false },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded-lg ${
                      row.isBold && row.isGreen
                        ? 'bg-[#E4F3E9] text-[#14512C] font-bold border border-[#BBE3C7]'
                        : row.isBold
                        ? 'bg-[#F4F6F4] text-[#1F3A2E] font-bold'
                        : 'text-gray-700 hover:bg-[#F8FAF8]'
                    }`}
                  >
                    <span>{row.label}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className={row.isRed ? 'text-rose-700' : row.isGreen ? 'text-[#14512C]' : 'text-gray-900'}>
                        {row.amount}
                      </span>
                      <span className="text-[10px] text-gray-500 w-12 text-right">{row.pct}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-[11px] text-gray-600 font-['Open_Sans'] space-y-1">
                <div>• Annual Net Contribution: <strong className="font-mono text-[#14512C]">£23,125</strong> (2,980 orders × £7.76)</div>
                <div>• Less Fixed OPEX (UK Ltd, Shopify, tools): <strong className="font-mono text-rose-700">-£8,400</strong></div>
                <div>• Net Operating Profit: <strong className="font-mono text-[#14512C] font-bold">£9,515</strong> (8.4% Operating Margin)</div>
              </div>
            </div>

            {/* Top 3 UK 3PL Comparison Matrix */}
            <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#17456F]" />
                  <span>Top 3 UK 3PL Fulfillment Warehouses Evaluated</span>
                </h3>
                <p className="text-xs text-gray-600 font-['Open_Sans']">
                  Selecting the optimal logistics partner near London M25 / Heathrow (LHR) corridor.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: '1. Huboo Fulfilment (Recommended for Launch)',
                    badge: 'Phase 1 Launch Pick (50–100 units)',
                    badgeColor: 'bg-emerald-100 text-[#14512C] border-emerald-300',
                    location: 'South West UK / Bristol (Direct M4/M25 links to LHR)',
                    advantage: 'Micro-Hub model with dedicated warehouse team; zero high monthly minimums; perfect for 50-unit test runs.',
                    cutoff: '2:00 PM GMT',
                    virtualKitting: 'Supported (assigned hub manager handles bespoke tissue wrap & 400 GSM card)',
                  },
                  {
                    name: '2. ShipBob UK',
                    badge: 'Phase 2 Scale (200–500+ units)',
                    badgeColor: 'bg-blue-100 text-[#17456F] border-blue-300',
                    location: 'Swindon, Birmingham & London Outer Ring (<45m from LHR)',
                    advantage: 'Deep tech automation, native TikTok Shop UK & Shopify Plus integration, automated backorder splits.',
                    cutoff: '2:00 PM GMT',
                    virtualKitting: 'Automated software rules engine with pick-ticket bundling',
                  },
                  {
                    name: '3. Zendbox',
                    badge: 'Premium / Luxury Unboxing',
                    badgeColor: 'bg-purple-100 text-[#4A2E7A] border-purple-300',
                    location: 'Kent / Greater London East (M25 Corridor)',
                    advantage: 'Industry-leading 9:00 PM order cut-off captures evening London impulse shoppers; high-touch unboxing specialists.',
                    cutoff: '9:00 PM GMT (Late Cut-off)',
                    virtualKitting: 'Bespoke hand-assembly & fragile electronics check on inbound',
                  },
                ].map((wh, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-[#DDE3DD] bg-[#FAFCFA] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <h4 className="font-bold text-[#1F3A2E] font-['Montserrat']">{wh.name}</h4>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${wh.badgeColor}`}>
                        {wh.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-700 leading-snug">{wh.advantage}</p>
                    <div className="text-[10px] text-gray-500 font-mono flex items-center justify-between pt-1 border-t border-[#E8EFE8]">
                      <span>Location: {wh.location}</span>
                      <span className="font-bold text-[#1F3A2E]">Cutoff: {wh.cutoff}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Investment Guardrails & Stop-Loss Policy */}
          <div className="p-5 rounded-2xl bg-[#FEF6E4] border border-[#FBE3B0] space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#7A5508]" />
              <h3 className="text-sm font-bold text-[#7A5508] font-['Montserrat']">
                Mandatory Launch Guardrails &amp; Capital Protection Rules
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-[#7A5508] font-['Open_Sans']">
              <div className="p-3 rounded-xl bg-white/80 border border-[#FBE3B0] space-y-1">
                <strong className="block font-['Montserrat'] text-gray-900">1. Electrical SKU Hold</strong>
                <p className="text-[11px] text-gray-700">Never sell electrical SKUs until safety, UKCA/CE, UN38.3 &amp; MSDS battery tests are 100% verified.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/80 border border-[#FBE3B0] space-y-1">
                <strong className="block font-['Montserrat'] text-gray-900">2. Protected Cash Floor</strong>
                <p className="text-[11px] text-gray-700">Maintain strictly £2,500 protected reorder cash and at least 21 selling days of stock cover at all times.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/80 border border-[#FBE3B0] space-y-1">
                <strong className="block font-['Montserrat'] text-gray-900">3. Ad Spend Stop-Loss</strong>
                <p className="text-[11px] text-gray-700">Scale advertising only when CAC is at or below £18 (target £15 by M7). Disable any ad spending £36 without a sale.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/80 border border-[#FBE3B0] space-y-1">
                <strong className="block font-['Montserrat'] text-gray-900">4. Month 4 Decision Gate</strong>
                <p className="text-[11px] text-gray-700">If Month 4 orders are below 150 or CAC exceeds £20, pause expansion and concentrate purely on Wallet and T-shirt.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ArielMC GLOBAL B2B EXPANSION PLAN (24-MONTH ROADMAP) */}
      {activeTab === 'B2B_EXPANSION_PLAN' && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1F3A2E] to-[#12231B] border-b-[3px] border-[#C8A96A] text-white space-y-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A] text-[#1F3A2E] font-mono text-[10px] font-bold uppercase tracking-wider">
                    Executive Strategy • September 2026
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] font-bold">
                    Plan Owner: Syed Akramul Hassan
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 font-mono text-[10px] font-bold">
                    24-Month Horizon (Phases 0 → 6)
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold font-['Montserrat'] tracking-tight flex items-center gap-2.5 text-white">
                  <Globe2 className="w-6 h-6 text-[#C8A96A]" />
                  <span>ArielMC Global B2B Expansion Project Plan (2026–2028)</span>
                </h2>
                <p className="text-xs text-white/80 max-w-3xl font-['Open_Sans']">
                  Positioning ArielMC not as a commodity exporter, but as a premier <strong>multi-category curation and consolidation partner</strong> across UK, EU, US, and Australia. Converts the 74-line product roadmap into a 3-wave commercial portfolio governed by 3 parallel revenue engines and post-LDC graduation tariff realities.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-right">
                  <span className="text-[10px] text-white/70 block uppercase font-mono">B2B Lead Target</span>
                  <span className="text-lg font-bold font-mono text-[#C8A96A]">100 Leads / Mo</span>
                  <span className="text-[10px] text-emerald-300 block">12–20 Accounts by M24</span>
                </div>
              </div>
            </div>

            {/* Expansion Pillars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-[10px] text-white/70 font-mono uppercase block">Sourcing Base</span>
                <div className="text-lg font-bold font-mono text-white">74 SKU Lines</div>
                <span className="text-[10px] text-white/60 font-mono block">5 Industrial Divisions</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-[10px] text-white/70 font-mono uppercase block">Target Geographies</span>
                <div className="text-lg font-bold font-mono text-[#C8A96A]">UK · EU · US · AU</div>
                <span className="text-[10px] text-emerald-300 font-mono block">UK Beachhead + Faire/NY NOW</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-[10px] text-white/70 font-mono uppercase block">Standard Budget</span>
                <div className="text-lg font-bold font-mono text-white">$100k–$150k</div>
                <span className="text-[10px] text-white/60 font-mono block">2–3 FTE core + trade shows</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-[10px] text-white/70 font-mono uppercase block">Post-LDC Strategy</span>
                <div className="text-lg font-bold font-mono text-emerald-300">Nov 2026 Ready</div>
                <span className="text-[10px] text-white/60 font-mono block">UK 92% DCTS / US 19% Flat</span>
              </div>
            </div>
          </div>

          {/* 3 Revenue Engines Run in Parallel */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                <span>The 3 Parallel Revenue Engines</span>
              </h3>
              <p className="text-xs text-gray-600 font-['Open_Sans']">
                Wave 1 monetises Direct Wholesale to generate cash flow; Private Label &amp; OEM is the strategic prize from Month 9+; Sourcing Agency is opportunistic with zero incremental capital.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#E8F0FA] border border-[#C5D7ED] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#17456F] font-bold">Engine A</span>
                  <span className="text-xs font-mono font-bold text-[#17456F] bg-white px-2 py-0.5 rounded border border-[#C5D7ED]">
                    15%–30% Gross Margin
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#17456F] font-['Montserrat']">Direct Wholesale / Trade</h4>
                <p className="text-xs text-gray-700 font-['Open_Sans']">
                  <strong>Who Buys:</strong> Retailers, department stores, lifestyle boutiques, gift shops, garden centres in UK/EU/AU.<br/>
                  <strong>What ArielMC Sells:</strong> Finished goods from our 74-SKU catalog, delivered DDP or EXW/FOB.
                </p>
                <div className="pt-2 text-[11px] text-[#17456F] font-mono border-t border-[#C5D7ED] font-semibold">
                  Generates early baseline cash flow from Month 1
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#EDE7F6] border border-[#D6C7EC] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#4A2E7A] font-bold">Engine B</span>
                  <span className="text-xs font-mono font-bold text-[#4A2E7A] bg-white px-2 py-0.5 rounded border border-[#D6C7EC]">
                    20%–40% Gross Margin
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#4A2E7A] font-['Montserrat']">Private Label &amp; OEM</h4>
                <p className="text-xs text-gray-700 font-['Open_Sans']">
                  <strong>Who Buys:</strong> Brands, department store private labels, corporate-gifting agencies wanting bespoke branding.<br/>
                  <strong>What ArielMC Sells:</strong> Complete product development + sourcing + QA + compliance + door-to-door delivery.
                </p>
                <div className="pt-2 text-[11px] text-[#4A2E7A] font-mono border-t border-[#D6C7EC] font-semibold">
                  The strategic high-margin prize (Month 9+)
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#E4F3E9] border border-[#BBE3C7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#14512C] font-bold">Engine C</span>
                  <span className="text-xs font-mono font-bold text-[#14512C] bg-white px-2 py-0.5 rounded border border-[#BBE3C7]">
                    5%–10% Commission
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#14512C] font-['Montserrat']">Export Sourcing Agency</h4>
                <p className="text-xs text-gray-700 font-['Open_Sans']">
                  <strong>Who Buys:</strong> Overseas importers wanting multi-category Bangladesh sourcing without in-country staff.<br/>
                  <strong>What ArielMC Sells:</strong> Factory vetting, price negotiation, sampling, in-line AQL inspection, logistics.
                </p>
                <div className="pt-2 text-[11px] text-[#14512C] font-mono border-t border-[#BBE3C7] font-semibold">
                  Pure fee-based income with near-zero working capital risk
                </div>
              </div>
            </div>
          </div>

          {/* 3-Wave Product Roadmap & Post-LDC Tariff Realities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3-Wave Strategy */}
            <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#8A6D3B]" />
                  <span>3-Wave Portfolio Staging (Converting 74 SKUs)</span>
                </h3>
                <p className="text-xs text-gray-600 font-['Open_Sans']">
                  Avoids sampling and cash-flow dilution by gating categories by margin and compliance maturity.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-[#BBE3C7] bg-[#E4F3E9]/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#14512C] font-['Montserrat']">Wave 1 — "Prove It" (M0–M9)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#14512C] text-white font-bold">Active Now</span>
                  </div>
                  <p className="text-gray-700 leading-snug">
                    <strong>Focus:</strong> Jute &amp; Natural Fiber (17 SKUs) + Leather SLGs (subset of 15 SKUs).<br/>
                    <strong>Rationale:</strong> Jute is Bangladesh's unique global asset with fast sampling and low compliance risk; Leather SLGs yield high gross margin with corporate gifting demand.<br/>
                    <strong>Hero SKUs:</strong> Laminated market totes, wine carriers, swag bags, RFID wallets, passport covers, cardholders, belts.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#C5D7ED] bg-[#E8F0FA]/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#17456F] font-['Montserrat']">Wave 2 — "Diversify" (M9–M18)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#17456F] text-white font-bold">Scale Stage</span>
                  </div>
                  <p className="text-gray-700 leading-snug">
                    <strong>Focus:</strong> Apparel &amp; Home Textiles (subset of 16 SKUs) + Pottery/Terracotta Planters (subset of 13 SKUs).<br/>
                    <strong>Rationale:</strong> Plays to RMG national scale via private label; terracotta capitalizes on garden/outdoor living trends in AU/UK/US.<br/>
                    <strong>Hero SKUs:</strong> Organic cotton tees/polos, towel sets, percale sheets, cylinder planters, lanterns, wine coolers.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#D6C7EC] bg-[#EDE7F6]/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#4A2E7A] font-['Montserrat']">Wave 3 — "Premiumise" (M18–M24+)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4A2E7A] text-white font-bold">High Value</span>
                  </div>
                  <p className="text-gray-700 leading-snug">
                    <strong>Focus:</strong> Ceramics &amp; Tableware (13 SKUs) + Full Leather Range + Architectural Terracotta.<br/>
                    <strong>Rationale:</strong> Highest ticket value; requires food-contact test readiness (lead/cadmium) and mature QC infrastructure built in Waves 1–2.<br/>
                    <strong>Hero SKUs:</strong> Dinnerware suites, barista mugs, bakeware, relief wall tiles, lattice screens.
                  </p>
                </div>
              </div>
            </div>

            {/* Post-LDC Tariff Realities (Nov 2026 Snapshot) */}
            <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1F3A2E]" />
                  <span>Trade &amp; Tariff Framework (Post-Nov 2026 LDC Graduation)</span>
                </h3>
                <p className="text-xs text-gray-600 font-['Open_Sans']">
                  Every price quote and landed-cost model must be built on the post-graduation tariff regime.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-[#DDE3DD] bg-[#FAFCFA] space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#1F3A2E] flex items-center gap-1.5 font-['Montserrat']">
                      <span>🇬🇧 United Kingdom</span>
                    </strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-[#14512C] font-bold border border-emerald-300">
                      Lowest Tariff Risk
                    </span>
                  </div>
                  <p className="text-gray-700 text-[11px] leading-relaxed">
                    Under DCTS Standard Preferences, ~92% of products remain zero-tariff with a confirmed 3-year transition access runway. UK GPSR compliance applies.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#DDE3DD] bg-[#FAFCFA] space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#1F3A2E] flex items-center gap-1.5 font-['Montserrat']">
                      <span>🇺🇸 United States</span>
                    </strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-[#17456F] font-bold border border-blue-300">
                      19% Flat Reciprocal Rate
                    </span>
                  </div>
                  <p className="text-gray-700 text-[11px] leading-relaxed">
                    Flat 19% rate under Feb-2026 bilateral framework (down from 37% proposed). Section 321 enables direct parcel imports under $800 tax-free.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#DDE3DD] bg-[#FAFCFA] space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#1F3A2E] flex items-center gap-1.5 font-['Montserrat']">
                      <span>🇪🇺 European Union (27 Nations)</span>
                    </strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                      ~12.5% MFN (Monitor FTA)
                    </span>
                  </div>
                  <p className="text-gray-700 text-[11px] leading-relaxed">
                    EBA duty-free access ends at graduation. Bangladesh negotiating an FTA. Mitigation: shift EU mix to value-added private label absorbing duty.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#DDE3DD] bg-[#FAFCFA] space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#1F3A2E] flex items-center gap-1.5 font-['Montserrat']">
                      <span>🇦🇺 Australia</span>
                    </strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-[#14512C] font-bold border border-emerald-300">
                      DFQF Access (0–5%)
                    </span>
                  </div>
                  <p className="text-gray-700 text-[11px] leading-relaxed">
                    Duty-Free Quota-Free market access. Counter-cyclical season provides steady factory line utilization during Northern Hemisphere winter dips.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Gen Stack & 24-Month Phase Budget */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Gen Channel Stack */}
            <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#8A6D3B]" />
                  <span>Lead Generation Engine &amp; Channel Architecture</span>
                </h3>
                <p className="text-xs text-gray-600 font-['Open_Sans']">
                  Target: 30+ qualified B2B leads/mo by M12; 100 leads/mo by M24.
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { channel: 'Alibaba.com Store', status: 'Active (bd102525264)', desc: 'Optimise store, RFQ response < 1h, digital showroom per category; lowest-cost global demand source.' },
                  { channel: 'Wholesale Marketplaces', status: 'Faire UK/US & Creoate', desc: 'Faire covers all 4 target markets; ideal for jute/lifestyle gifts and low-friction reorders.' },
                  { channel: 'Targeted Trade Shows', status: 'Spring Fair & NY NOW', desc: 'Pick 2 shows in M9–M18; Spring Fair Birmingham (UK), Ambiente Frankfurt, NY NOW, Reed Gift Sydney.' },
                  { channel: 'Direct B2B Outbound', status: 'LinkedIn + WhatsApp', desc: '50 targeted buyer contacts/month with customized line sheets and specimen kit sampling.' },
                  { channel: 'Commissioned Agents', status: '5%–10% Commission', desc: 'UK-based agent first (existing operations); shorten retail sales cycles by 2–3x.' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-[#DDE3DD] bg-[#FAFCFA] space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-[#1F3A2E] font-['Montserrat']">{item.channel}</strong>
                      <span className="text-[10px] font-mono font-bold text-[#17456F] bg-[#E8F0FA] px-2 py-0.5 rounded border border-[#C5D7ED]">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug font-['Open_Sans']">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase-by-Phase Budget ($100–150K Standard Scenario) */}
            <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#14512C]" />
                  <span>24-Month Phased Budget (Standard Scenario: $100k–$150k)</span>
                </h3>
                <p className="text-xs text-gray-600 font-['Open_Sans']">
                  Every PO &gt; $5k is covered $\ge 40\%$ by buyer advance or LC before production.
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { phase: 'P0: Setup & Validation', time: 'M0–M1', budget: '$6k–$10k', uses: 'Legal/entity review, bank/LC rails, EPB licences, compliance advisor, CRM' },
                  { phase: 'P1: Foundations & Supply Build', time: 'M1–M4', budget: '$20k–$35k', uses: 'Website + SEO, digital line sheets, 10–15 sample sets (3–5 factories/cat), cert tests' },
                  { phase: 'P2: UK & EU Pilot', time: 'M4–M9', budget: '$25k–$40k', uses: 'UK agent retainer/commission, Faire marketplace ads, first PO working capital via buyer deposits' },
                  { phase: 'P3: Scale to AU & US', time: 'M9–M15', budget: '$30k–$50k', uses: 'Reed Gift Fairs / NY NOW booth, US private-label trips, second category sampling' },
                  { phase: 'P4: Diversify & Premiumise', time: 'M15–M24', budget: '$30k–$60k', uses: 'Hospitality vertical BD, ceramics food-contact certs, UK hub stock holding' },
                ].map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-[#DDE3DD] bg-[#FAFCFA] space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-[#1F3A2E] font-['Montserrat']">{p.phase}</strong>
                        <span className="text-[10px] font-mono text-gray-500">({p.time})</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#14512C]">{p.budget}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug font-['Open_Sans']">{p.uses}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly KPI Dashboard & Operating Benchmarks */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#8A6D3B]" />
                <span>Executive Operating Dashboard &amp; Monthly Review Targets</span>
              </h3>
              <span className="text-[10px] font-mono text-gray-500 font-semibold">Tracked Monthly at Dhaka HQ</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#DDE3DD]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1F3A2E] text-white uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-2.5 px-4 font-['Montserrat']">Operational Area</th>
                    <th className="py-2.5 px-4 font-['Montserrat']">Key Performance Metric</th>
                    <th className="py-2.5 px-4 font-['Montserrat'] text-right">Month 6 Target</th>
                    <th className="py-2.5 px-4 font-['Montserrat'] text-right text-emerald-200">Month 12 Target</th>
                    <th className="py-2.5 px-4 font-['Montserrat'] text-right text-[#C8A96A]">Month 24 Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EFE8] text-[11px]">
                  {[
                    { area: 'Sales Pipeline', metric: 'Qualified B2B Leads / Month', m6: '20 leads', m12: '100 leads', m24: '200 leads' },
                    { area: 'Lead Conversion', metric: 'Lead → Sample Request Rate', m6: '25%', m12: '30%', m24: '30%' },
                    { area: 'Sample Conversion', metric: 'Sample Request → First PO Rate', m6: '15%', m12: '20%', m24: '22%' },
                    { area: 'Commercial Revenue', metric: 'Active Wholesale Accounts', m6: '3–4 accounts', m12: '4–6 accounts', m24: '12–20 accounts' },
                    { area: 'Commercial Revenue', metric: 'Client Repeat-Order Rate', m6: '—', m12: '40%', m24: '60%' },
                    { area: 'Quality & Delivery', metric: 'On-Time Export Delivery (OTIF)', m6: '90%', m12: '95%', m24: '97%' },
                    { area: 'Quality & Delivery', metric: 'Pre-Shipment AQL 1.5 Pass Rate', m6: '95%', m12: '97%', m24: '98%' },
                    { area: 'Financial Margin', metric: 'Blended Sourcing Gross Margin', m6: '20%', m12: '25%', m24: '28%–32%' },
                    { area: 'Capital Control', metric: 'Open (Unsold) Inventory / Revenue', m6: '—', m12: '< 25%', m24: '< 20%' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F4F6F4]">
                      <td className="py-2.5 px-4 font-bold text-[#1F3A2E]">{row.area}</td>
                      <td className="py-2.5 px-4 text-gray-800">{row.metric}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-gray-700">{row.m6}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-[#14512C]">{row.m12}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-[#8A6D3B]">{row.m24}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: FROM RAW MATERIALS TO GLOBAL MARKETS (2026–2030 STRATEGY)             */}
      {/* ========================================================================= */}
      {activeTab === 'RAW_MATERIALS_STRATEGY' && (
        <div className="space-y-6 text-xs animate-in fade-in duration-200">
          {/* Top Banner Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#172D24] via-[#1F3A2E] to-[#12231B] text-white border-b-[3px] border-[#C8A96A] shadow-md space-y-3 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-[#C8A96A]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/40 font-mono text-[10px] font-bold uppercase tracking-wider">
                    Sovereign Value Retention Blueprint
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                    80%–95% Local Value Addition
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                    100% Domestic Raw Materials
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold font-['Montserrat'] tracking-tight text-white">
                  From Raw Materials to Global Markets: Jute &amp; Leather Export Strategy (2026–2030)
                </h2>
                <p className="text-xs text-[#CFE0D5] max-w-3xl leading-relaxed font-['Open_Sans']">
                  National export diversification engine moving beyond ready-made garments (RMG). Pivots away from raw commodity fiber and semi-processed wet-blue hides to finished, high-turnover retail carriers (laminated jute) and small leather goods (SLGs) with audited Savar CETP environmental traceability.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 shrink-0 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#C8A96A] block font-mono">Strategic Thesis</span>
                <span className="text-xs font-bold text-white block">Finished &gt; Commodity</span>
                <span className="text-[10px] text-gray-300 block">
                  Captures 30%–40% wholesale margin vs 5% raw trading.
                </span>
              </div>
            </div>

            {/* 4 Macro Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-white/10 relative z-10">
              <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-gray-300 block">Local Value Retention</span>
                <span className="text-xl font-bold font-mono text-emerald-400 block">80% – 95%</span>
                <span className="text-[10px] text-gray-300">vs 35%–45% in RMG (imported yarn)</span>
              </div>

              <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-gray-300 block">Jute Sector Momentum</span>
                <span className="text-xl font-bold font-mono text-[#C8A96A] block">+43% MoM</span>
                <span className="text-[10px] text-gray-300">April 2026 surge (~$80M)</span>
              </div>

              <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-gray-300 block">Leather Sector Base</span>
                <span className="text-xl font-bold font-mono text-white block">$1.03B – $1.15B</span>
                <span className="text-[10px] text-gray-300">Targeting $5B by 2030 roadmap</span>
              </div>

              <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-gray-300 block">Post-LDC Tariff Runway</span>
                <span className="text-xl font-bold font-mono text-emerald-400 block">92% Duty-Free</span>
                <span className="text-[10px] text-gray-300">UK DCTS 3-Year Transition Access</span>
              </div>
            </div>
          </div>

          {/* Macro Export Performance: Jute Rebound vs. Leather Stagnation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Jute Card */}
            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌿</span>
                  <div>
                    <h3 className="font-bold text-[#1F3A2E] text-sm font-['Montserrat']">
                      Jute &amp; Diversified Goods: Structural Rebound
                    </h3>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Export Earnings: $701.7M (July–April FY26) &bull; FY25: $820.16M
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono text-[10px]">
                  +2.52% YoY &bull; Sharp Recovery
                </span>
              </div>

              <p className="text-[11px] text-slate-700 leading-relaxed font-['Open_Sans']">
                Global anti-plastic packaging directives (UK Plastic Packaging Tax, EU ESPR) are driving strong resurgence for biodegradable jute. Key private mills (Janata, Akij, Imperial) are capturing high-margin international accounts, supported by the government's April 2026 initiative reopening 6 state mills under private management.
              </p>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5 text-emerald-950">
                <span className="font-bold text-xs text-emerald-900 block">ArielMC Commercial Implication:</span>
                <p className="text-[11px] leading-relaxed">
                  Focus portfolio on <strong>laminated high-capacity market totes (JD-16)</strong> and <strong>dual wine bottle carriers (JD-29)</strong>. Water-resistant 0.02mm LDPE/PP linings, azo-free silkscreen branding, and padded cotton webbing handles elevate an agricultural commodity into a branded promotional asset with 30% wholesale margins and continuous reorders.
                </p>
              </div>
            </div>

            {/* Leather Card */}
            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💼</span>
                  <div>
                    <h3 className="font-bold text-[#1F3A2E] text-sm font-['Montserrat']">
                      Leather Goods: Stagnation &amp; The Savar Bottleneck
                    </h3>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Export Receipts: $1.03B – $1.15B &bull; 180M Sq. Ft. Annual Hide Base
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold font-mono text-[10px]">
                  Bottlenecked Potential
                </span>
              </div>

              <p className="text-[11px] text-slate-700 leading-relaxed font-['Open_Sans']">
                Leather remains Bangladesh's #2 manufacturing export, but over 60% of revenues remain locked in low-margin wet-blue hides. The Central Effluent Treatment Plant (CETP) at Savar operates below international discharge standards, preventing tanneries from securing Leather Working Group (LWG) certification and imposing a <strong>30%–40% export price discount</strong>.
              </p>

              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1 text-rose-950">
                <span className="font-bold text-xs text-rose-900 block">ArielMC De-Risking Strategy:</span>
                <p className="text-[11px] leading-relaxed">
                  Bypass luggage and heavy leather bags. Source strictly from Tier-1 Gold LWG tanneries (ABC Leather, Pioneer Simona) or verified Savar CETP tanneries with intact VAT-6.3 paper trails. Focus on <strong>compact Small Leather Goods (SLGs: LD-1 Bifold, LD-2 Cardholder)</strong> to eliminate weight freight penalties and capture 40% wholesale margins.
                </p>
              </div>
            </div>
          </div>

          {/* Regional Product Demand Map Table */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-[#1F3A2E]" />
                <h3 className="font-bold text-sm text-[#1F3A2E] font-['Montserrat']">
                  Regional Product Demand Map &amp; Commercial Targeting
                </h3>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">Cross-Market Segmentation</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#DDE3DD]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5EC] text-[#1F3A2E] font-bold">
                  <tr>
                    <th className="p-3 font-['Montserrat']">Target Region</th>
                    <th className="p-3 font-['Montserrat']">Primary Product Demand</th>
                    <th className="p-3 font-['Montserrat']">Commercial Implication for ArielMC</th>
                    <th className="p-3 text-right font-['Montserrat']">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD] text-slate-800">
                  <tr className="bg-emerald-50/30">
                    <td className="p-3 font-bold text-[#1F3A2E] flex items-center gap-1.5">
                      <span>🇬🇧 🇪🇺 🇦🇺</span>
                      <span>UK, EU &amp; Australia</span>
                    </td>
                    <td className="p-3 font-medium">
                      Laminated retail totes, wine carriers, and EDC small leather goods
                    </td>
                    <td className="p-3 text-gray-700">
                      High-perceived value, zero single-use plastic, retail &amp; corporate gifting, UK DCTS duty-free access
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-800">CORE FOCUS (Wave 1)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>🇺🇸</span>
                      <span>North America (USA)</span>
                    </td>
                    <td className="p-3">
                      Corporate gifting SLGs, promotional conference totes, garden terracotta
                    </td>
                    <td className="p-3 text-gray-700">
                      Private-label/OEM focus absorbing 19% flat reciprocal tariff; Section 321 &lt;$800 parcel tax-free
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-blue-800">GROWTH (Wave 2)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>🌍</span>
                      <span>African Continent</span>
                    </td>
                    <td className="p-3">
                      Heavy-duty agricultural sacks &amp; grain packaging
                    </td>
                    <td className="p-3 text-gray-700">
                      Durability, load performance, moisture control, high-volume container supply (institutional B2B)
                    </td>
                    <td className="p-3 text-right font-mono text-gray-500">OPPORTUNISTIC</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>🌏</span>
                      <span>Asian Intra-Trade</span>
                    </td>
                    <td className="p-3">
                      Industrial yarn and intermediate jute inputs
                    </td>
                    <td className="p-3 text-gray-700">
                      Compete on specification consistency, production scale, and repeat industrial supply contracts
                    </td>
                    <td className="p-3 text-right font-mono text-gray-500">RAW COMMODITY</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Hero Unit Economics Waterfall: Leather SLG vs. Jute Carrier */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#C8A96A]" />
                <span>Hero Unit Economics &amp; Margin Waterfall (Export Model)</span>
              </h3>
              <span className="text-[10px] text-gray-500 font-mono">
                Realized Pricing Architecture per Intelligence Report
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Leather Bifold Wallet Card */}
              <div className="p-5 rounded-2xl bg-white border-2 border-[#DDE3DD] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#8A6D3B] font-bold uppercase block">
                      Leather Hero SKU &bull; LD-1 (LTH-WAL-014)
                    </span>
                    <h4 className="font-bold text-sm text-[#1F3A2E] font-['Montserrat']">
                      Men's Slim RFID Bifold Wallet (Bovine Full-Grain)
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold font-mono text-xs">
                    40.0% Gross Margin
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[9px] uppercase font-bold text-gray-500 block">FOB Dhaka</span>
                    <span className="text-sm font-bold font-mono text-slate-900 block mt-0.5">$9.20 USD</span>
                    <span className="text-[9px] text-gray-500">৳1,104 BDT</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[9px] uppercase font-bold text-gray-500 block">UK Landed</span>
                    <span className="text-sm font-bold font-mono text-slate-900 block mt-0.5">£16.71</span>
                    <span className="text-[9px] text-gray-500">incl. 17% tariff</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300">
                    <span className="text-[9px] uppercase font-bold text-emerald-800 block">Wholesale</span>
                    <span className="text-sm font-bold font-mono text-emerald-950 block mt-0.5">£27.85</span>
                    <span className="text-[9px] text-emerald-700 font-bold">40% Margin</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]">
                    <span className="text-[9px] uppercase font-bold text-[#8A6D3B] block">Retail MSRP</span>
                    <span className="text-sm font-bold font-mono text-[#8A6D3B] block mt-0.5">£66.85</span>
                    <span className="text-[9px] text-gray-600">58% Off B2B</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-[11px] text-slate-700 space-y-1">
                  <div className="flex justify-between items-center">
                    <span>European Union (EU) Scenario:</span>
                    <span className="font-mono font-bold text-[#1F3A2E]">Wholesale: &euro;20.70 &ndash; &euro;23.08 | Retail: &euro;49.69</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 text-[10px]">
                    <span>Minimal shipping volume (120 pcs/carton):</span>
                    <span>Bypasses apparel sizing returns &bull; 0% UK DCTS base tariff</span>
                  </div>
                </div>
              </div>

              {/* Jute Laminated Market Tote Card */}
              <div className="p-5 rounded-2xl bg-white border-2 border-[#DDE3DD] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase block">
                      Jute Hero SKU &bull; JD-16 (JUT-TOT-084)
                    </span>
                    <h4 className="font-bold text-sm text-[#1F3A2E] font-['Montserrat']">
                      Laminated High-Capacity Market Tote (Golden Fiber)
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold font-mono text-xs">
                    30.0% Gross Margin
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[9px] uppercase font-bold text-gray-500 block">FOB Dhaka</span>
                    <span className="text-sm font-bold font-mono text-slate-900 block mt-0.5">$2.20 USD</span>
                    <span className="text-[9px] text-gray-500">৳264 BDT</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[9px] uppercase font-bold text-gray-500 block">UK Landed</span>
                    <span className="text-sm font-bold font-mono text-slate-900 block mt-0.5">£3.62</span>
                    <span className="text-[9px] text-gray-500">Freight ~$0.25</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300">
                    <span className="text-[9px] uppercase font-bold text-emerald-800 block">Wholesale</span>
                    <span className="text-sm font-bold font-mono text-emerald-950 block mt-0.5">£5.17</span>
                    <span className="text-[9px] text-emerald-700 font-bold">30% Margin</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]">
                    <span className="text-[9px] uppercase font-bold text-[#8A6D3B] block">Retail MSRP</span>
                    <span className="text-sm font-bold font-mono text-[#8A6D3B] block mt-0.5">£12.40</span>
                    <span className="text-[9px] text-gray-600">58% Off B2B</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-[11px] text-slate-700 space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Dual Wine Bottle Carrier (JD-29):</span>
                    <span className="font-mono font-bold text-[#1F3A2E]">FOB: $2.60 | Wholesale: £6.12 (&euro;5.39) | Retail: £14.68</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 text-[10px]">
                    <span>High-volume reorder cycles (2,000–5,000 pcs MOQs):</span>
                    <span>Zero Plastic Packaging Tax &bull; Fast capital turnover</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Portfolio Strategic Scorecard */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#1F3A2E] font-['Montserrat']">
              Product Portfolio Strategic Scorecard: Small Leather Goods vs. Laminated Jute Carriers
            </h3>
            <div className="overflow-x-auto rounded-xl border border-[#DDE3DD]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5EC] text-[#1F3A2E] font-bold">
                  <tr>
                    <th className="p-3 font-['Montserrat']">Evaluation Dimension</th>
                    <th className="p-3 text-center font-['Montserrat']">Small Leather Goods (SLGs)</th>
                    <th className="p-3 text-center font-['Montserrat']">Laminated Jute Carriers</th>
                    <th className="p-3 font-['Montserrat']">Strategic Interpretation &amp; Operating Synergy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD] text-slate-800">
                  <tr>
                    <td className="p-3 font-bold text-[#1F3A2E]">Demand Scale</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-800">● ● ● ● ○ (4/5)</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-800">● ● ● ● ○ (4/5)</td>
                    <td className="p-3 text-gray-700">Both address broad international demand across gifting, retail, and sustainability procurement.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#1F3A2E]">Sales Velocity</td>
                    <td className="p-3 text-center font-mono text-gray-700">● ● ● ● ○ (4/5)</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-800">● ● ● ● ● (5/5)</td>
                    <td className="p-3 text-gray-700">Jute benefits from high-volume recurring packaging programs; leather supports continuous year-round orders.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#1F3A2E]">Freight Efficiency</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-800">● ● ● ● ● (5/5)</td>
                    <td className="p-3 text-center font-mono text-gray-700">● ● ● ● ○ (4/5)</td>
                    <td className="p-3 text-gray-700">Compact leather SLGs provide superior value-to-volume ratio; jute totes remain highly cost-efficient at container scale.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#1F3A2E]">Reorder Potential</td>
                    <td className="p-3 text-center font-mono text-gray-700">● ● ● ● ○ (4/5)</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-800">● ● ● ● ● (5/5)</td>
                    <td className="p-3 text-gray-700">Jute packaging and corporate event programs support large recurring volume; leather excels in private-label gifts.</td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="p-3 font-bold text-emerald-950">Wholesale Gross Margin</td>
                    <td className="p-3 text-center font-mono font-black text-emerald-900">● ● ● ● ● (5/5) &bull; 40.0%</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-800">● ● ● ● ○ (4/5) &bull; 30.0%</td>
                    <td className="p-3 text-emerald-950 font-medium">Both categories clear the mandatory &ge;25%–30% gross sourcing margin policy with ease.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#1F3A2E]">Compliance Simplicity</td>
                    <td className="p-3 text-center font-mono text-amber-700">● ● ○ ○ ○ (2/5)</td>
                    <td className="p-3 text-center font-mono text-amber-700">● ● ● ○ ○ (3/5)</td>
                    <td className="p-3 text-gray-700">Leather carries chemical REACH &amp; Savar ETP requirements; jute faces biosecurity &amp; fumigation checks for Australia.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#1F3A2E]">Capital Turnover</td>
                    <td className="p-3 text-center font-mono text-gray-700">● ● ● ● ○ (4/5)</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-800">● ● ● ● ● (5/5)</td>
                    <td className="p-3 text-gray-700">Jute's lower unit cost supports faster capital turnover; leather provides higher absolute cash margin per unit.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4-Phase Implementation Roadmap to 2030 */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#1F3A2E] font-['Montserrat']">
              ArielMC Sourcing &amp; Commercial Implementation Roadmap to 2030
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#F8FAF8] border-t-4 border-[#1F3A2E] space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 font-mono block">Phase 1 &bull; M0–M4</span>
                <h4 className="font-bold text-[#1F3A2E] text-xs">Validate Demand</h4>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Validate target-buyer demand for shortlisted hero SKUs (LD-1, LD-2, JD-16, JD-29). Confirm wholesale buyer price points.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF8] border-t-4 border-[#C8A96A] space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 font-mono block">Phase 2 &bull; M4–M9</span>
                <h4 className="font-bold text-[#1F3A2E] text-xs">Verify Readiness</h4>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Audit Savar tanneries for CETP compliance. Secure REACH lab tests from Intertek Tejgaon. Finalize Sourcing Deeds of Agreement.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF8] border-t-4 border-emerald-600 space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 font-mono block">Phase 3 &bull; M9–M18</span>
                <h4 className="font-bold text-[#1F3A2E] text-xs">Launch Pilots</h4>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Run controlled pilot orders of 500 units per hero SKU. Document real landed-cost and claim 10% export cash incentive via BRAC Bank.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAF8] border-t-4 border-[#4A2E7A] space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 font-mono block">Phase 4 &bull; M18–2030</span>
                <h4 className="font-bold text-[#1F3A2E] text-xs">Scale Proven Lines</h4>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Institutionalize multi-container repeat orders, expand into luxury hospitality ceramics and home textiles, and achieve $5M run-rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: B2C RETAIL P&L (LOT / SHIPMENT-WISE) */}
      {activeTab === 'B2C_PNL' && <B2CLotShipmentWisePnlSection />}

      {/* TAB 3: B2B WHOLESALE P&L (ORDER-WISE) */}
      {activeTab === 'B2B_PNL' && <B2BOrderWisePnlSection />}


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

      {/* Share P&L and Financial Audit Modal */}
      <ShareDocumentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        document={financePnlDoc}
      />

      {/* Universal Report Generation Modal */}
      <ReportGenerationModal
        isOpen={isReportGenModalOpen}
        onClose={() => setIsReportGenModalOpen(false)}
        initialReportType="ANNUAL_FINANCIAL_MATRIX"
        initialViewMode={reportGenInitialView}
      />
    </div>
  );
};
