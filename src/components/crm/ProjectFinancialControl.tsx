'use client';

import React, { useState } from 'react';
import { ProjectFinancialAccount, MilestoneBillingItem, ProjectCostItem } from '@/types/arelCrm';
import PostJournalVoucherModal, { JournalVoucherPayload } from './PostJournalVoucherModal';
import {
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Sparkles,
  PieChart,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Scale,
  Receipt,
  Download,
  LayoutGrid,
  Table as TableIcon,
  Search,
  Filter,
  Plus,
} from 'lucide-react';

interface ProjectFinancialControlProps {
  accounts: ProjectFinancialAccount[];
  onPostVoucher?: (payload: JournalVoucherPayload) => void;
  theme?: string;
}

type FinancialTab = 'pnl' | 'ledger' | 'balance_sheet' | 'milestones';
type ViewMode = 'STATEMENT' | 'PORTFOLIO_TABLE';

export default function ProjectFinancialControl({
  accounts,
  onPostVoucher,
  theme = 'crm-green',
}: ProjectFinancialControlProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(accounts[0]?.projectId || '');
  const [activeTab, setActiveTab] = useState<FinancialTab>('pnl');
  const [viewMode, setViewMode] = useState<ViewMode>('STATEMENT');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [customLedgerEntries, setCustomLedgerEntries] = useState<Record<string, any[]>>({});

  const handlePostVoucherSubmitted = (payload: JournalVoucherPayload) => {
    const newEntry = {
      date: payload.postingDate,
      ref: payload.voucherRef,
      accountCode: `${payload.debitAccountCode} / ${payload.creditAccountCode}`,
      accountTitle: `${payload.debitAccountTitle} / ${payload.creditAccountTitle}`,
      debit: payload.amountBdt,
      credit: payload.amountBdt,
      desc: `${payload.voucherType}: ${payload.description}`,
    };

    setCustomLedgerEntries((prev) => ({
      ...prev,
      [payload.projectId]: [...(prev[payload.projectId] || []), newEntry],
    }));

    if (onPostVoucher) {
      onPostVoucher(payload);
    }
  };

  const activeAccount = accounts.find((a) => a.projectId === selectedProjectId) || accounts[0];

  const totalContractPipelineBdt = accounts.reduce((acc, a) => acc + a.turnkeyContractPriceBdt, 0);
  const totalCollectedBdt = accounts.reduce((acc, a) => acc + a.totalCollectedBdt, 0);
  const totalOutstandingBdt = accounts.reduce((acc, a) => acc + a.totalOutstandingBdt, 0);
  const totalGrossProfitBdt = accounts.reduce((acc, a) => acc + a.grossProfitBdt, 0);
  const totalDlpRetentionBdt = accounts.reduce((acc, a) => acc + a.retention5PercentBdt, 0);

  // Filtered accounts for portfolio table
  const filteredAccounts = accounts.filter(
    (a) =>
      a.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.projectId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate dynamic double-entry general ledger for the selected project
  const generateLedgerEntries = (acc: ProjectFinancialAccount) => {
    return [
      {
        date: '2026-09-15',
        ref: `JV-${acc.id}-001`,
        accountCode: '1010-CASH-BANK',
        accountTitle: 'Cash at Bank (PFI Green Debt Escrow)',
        debit: Math.round(acc.turnkeyContractPriceBdt * 0.2),
        credit: 0,
        desc: 'Milestone 1: 20% Contract Advance Inflow',
      },
      {
        date: '2026-09-15',
        ref: `JV-${acc.id}-001`,
        accountCode: '4010-EPC-REV',
        accountTitle: 'Turnkey Contract Unearned Revenue',
        debit: 0,
        credit: Math.round(acc.turnkeyContractPriceBdt * 0.2),
        desc: 'Customer Advance Billing Recognition',
      },
      {
        date: '2026-09-22',
        ref: `JV-${acc.id}-002`,
        accountCode: '5010-COGS-MOD',
        accountTitle: 'Cost of Goods Sold: Tier-1 PV Modules',
        debit: Math.round(acc.actualTotalCostBdt * 0.52),
        credit: 0,
        desc: 'LC Opened at Sight for Bifacial TOPCon Modules',
      },
      {
        date: '2026-09-22',
        ref: `JV-${acc.id}-002`,
        accountCode: '2010-AP-OEM',
        accountTitle: 'Accounts Payable: OEM Module Supplier (Client ERQ USD LC)',
        debit: 0,
        credit: Math.round(acc.actualTotalCostBdt * 0.52),
        desc: 'Hardware Import Liability Recognized',
      },
      {
        date: '2026-10-18',
        ref: `JV-${acc.id}-003`,
        accountCode: '5050-COGS-DUTY',
        accountTitle: 'Customs 1.0% Statutory AIT & Port Yard CFS',
        debit: Math.round(acc.actualTotalCostBdt * 0.02),
        credit: 0,
        desc: 'ASYCUDA World Box 44 SREDA Statutory Duty Clearing',
      },
      {
        date: '2026-10-18',
        ref: `JV-${acc.id}-003`,
        accountCode: '1010-CASH-BANK',
        accountTitle: 'Cash at Bank (Customs Duty Payment)',
        debit: 0,
        credit: Math.round(acc.actualTotalCostBdt * 0.02),
        desc: 'Port CFS Demurrage & 1.0% AIT SRO 159/338 Disbursed',
      },
      {
        date: '2026-10-25',
        ref: `JV-${acc.id}-004`,
        accountCode: '1010-CASH-BANK',
        accountTitle: 'Cash at Bank (Milestone 2 Inflow)',
        debit: Math.round(acc.turnkeyContractPriceBdt * 0.4),
        credit: 0,
        desc: 'Milestone 2: 40% Chittagong Port Delivery Disbursed',
      },
      {
        date: '2026-10-25',
        ref: `JV-${acc.id}-004`,
        accountCode: '4010-EPC-REV',
        accountTitle: 'Turnkey Contract Recognized Revenue',
        debit: 0,
        credit: Math.round(acc.turnkeyContractPriceBdt * 0.4),
        desc: 'Delivery Acceptance Milestone Booked',
      },
      {
        date: '2026-11-04',
        ref: `JV-${acc.id}-005`,
        accountCode: '1310-DLP-ESCROW',
        accountTitle: '5% Defect Liability Period (DLP) Escrow Retainage',
        debit: acc.retention5PercentBdt,
        credit: 0,
        desc: 'Statutory 365-Day Retainage Deposited into PFI Bank Escrow',
      },
      {
        date: '2026-11-04',
        ref: `JV-${acc.id}-005`,
        accountCode: '1010-CASH-BANK',
        accountTitle: 'Cash at Bank (Transfer to DLP Escrow)',
        debit: 0,
        credit: acc.retention5PercentBdt,
        desc: 'Bank Guarantee Ring-Fenced for 1-Year Workmanship Warranty',
      },
    ];
  };

  // Compute Balance Sheet Items for the active project
  const calculateBalanceSheet = (acc: ProjectFinancialAccount) => {
    const cashInBank = acc.totalCollectedBdt - Math.round(acc.actualTotalCostBdt * 0.7) - acc.retention5PercentBdt;
    const accountsReceivable = acc.totalOutstandingBdt;
    const workInProgress = Math.round(acc.actualTotalCostBdt * 0.3);
    const dlpEscrow = acc.retention5PercentBdt;
    const totalAssets = cashInBank + accountsReceivable + workInProgress + dlpEscrow;

    const oemPayables = Math.round(acc.actualTotalCostBdt * 0.2);
    const subcontractorRetainage = Math.round(acc.actualTotalCostBdt * 0.05);
    const totalLiabilities = oemPayables + subcontractorRetainage;

    const projectRetainedEarnings = totalAssets - totalLiabilities;

    return {
      cashInBank,
      accountsReceivable,
      workInProgress,
      dlpEscrow,
      totalAssets,
      oemPayables,
      subcontractorRetainage,
      totalLiabilities,
      projectRetainedEarnings,
      totalLiabilitiesAndEquity: totalLiabilities + projectRetainedEarnings,
    };
  };

  const bs = calculateBalanceSheet(activeAccount);
  const baseLedger = generateLedgerEntries(activeAccount);
  const extraEntries = (activeAccount && (customLedgerEntries[activeAccount.id] || customLedgerEntries[activeAccount.projectId])) || [];
  const ledger = [...baseLedger, ...extraEntries];

  return (
    <div className="space-y-6">
      {/* =========================================================================
          PORTFOLIO FINANCIAL KPI CARDS
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Total Portfolio Revenue</div>
          <div className="text-xl font-black text-[#0A1A2F] mt-1 font-mono">
            Tk {(totalContractPipelineBdt / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">{accounts.length} Commercial C&amp;I Projects</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Cash Collected</div>
          <div className="text-xl font-black text-emerald-700 mt-1 font-mono">
            Tk {(totalCollectedBdt / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">80% Bank Debt + 20% ERQ LC</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Audited Gross Margin</div>
          <div className="text-xl font-black text-[#C8A96A] mt-1 font-mono">
            Tk {(totalGrossProfitBdt / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[10px] font-bold text-emerald-800 font-mono mt-0.5">Strictly 25.0% Margin Lock</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">Outstanding Receivables</div>
          <div className="text-xl font-black text-amber-600 mt-1 font-mono">
            Tk {(totalOutstandingBdt / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Pending COD Milestones</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="text-[10px] font-mono font-bold uppercase text-slate-400">5% DLP Bank Escrow</div>
          <div className="text-xl font-black text-teal-700 mt-1 font-mono">
            Tk {(totalDlpRetentionBdt / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[10px] text-teal-800 font-mono mt-0.5">365-Day Retainage Lock</div>
        </div>
      </div>

      {/* =========================================================================
          CONTROL BAR: VIEW MODE TOGGLE & PROJECT SELECTOR
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('STATEMENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'STATEMENT'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Project Statements</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('PORTFOLIO_TABLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'PORTFOLIO_TABLE'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Portfolio Master Table</span>
            </button>
          </div>

          {viewMode === 'STATEMENT' && (
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
              >
                {accounts.map((acc) => (
                  <option key={acc.projectId} value={acc.projectId}>
                    {acc.projectName} ({acc.capacityKwp} kWp)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: Statutory Audit Badge */}
        <div className="flex items-center gap-2.5 text-xs font-mono">
          <span className="hidden sm:inline text-slate-500">Statutory Standard:</span>
          <span className="font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>AUDITED 25.0% GROSS MARGIN</span>
          </span>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: PROJECT FINANCIAL STATEMENTS (P&L • LEDGER • BALANCE SHEET)
          ========================================================================= */}
      {viewMode === 'STATEMENT' && activeAccount && (
        <div className="space-y-5">
          {/* Statement Sub-Tabs Navigation */}
          <div className="flex items-center gap-1 border-b border-slate-200 pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('pnl')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'pnl'
                  ? 'bg-[#0A1A2F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Project P&amp;L Statement</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'ledger'
                  ? 'bg-[#0A1A2F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>General Ledger (DR / CR Journal)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('balance_sheet')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'balance_sheet'
                  ? 'bg-[#0A1A2F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Project Balance Sheet &amp; 5% DLP</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('milestones')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'milestones'
                  ? 'bg-[#0A1A2F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-teal-400" />
              <span>Milestone Billing Waterfall (20/40/30/10)</span>
            </button>
          </div>

          {/* ---------------------------------------------------------------------
              TAB 1: PROJECT P&L STATEMENT (INCOME STATEMENT)
              --------------------------------------------------------------------- */}
          {activeTab === 'pnl' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: P&L Statement */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0A1A2F]">
                      Project Profit &amp; Loss Statement (Audited)
                    </h4>
                    <span className="text-xs text-slate-500 font-mono">
                      {activeAccount.projectName} &bull; {activeAccount.capacityKwp} kWp Turnkey EPC
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    IFRS Compliant
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {/* Revenue */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <span className="font-bold text-slate-900">1. Turnkey Contract Revenue (100%)</span>
                    <span className="font-extrabold text-emerald-800 text-sm">
                      Tk {activeAccount.turnkeyContractPriceBdt.toLocaleString()}
                    </span>
                  </div>

                  {/* COGS Breakdown */}
                  <div className="pl-4 space-y-2 border-l-2 border-slate-200 my-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                      Less: Cost of Goods Sold (COGS - 75.0%)
                    </div>
                    {activeAccount.costLedger.map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-slate-600 text-xs">
                        <span>&bull; {c.description} ({c.vendorName})</span>
                        <span className="font-bold text-slate-800">
                          (Tk {c.actualSpentAmountBdt.toLocaleString()})
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-900 font-bold">
                      <span>Total Direct EPC COGS:</span>
                      <span className="text-slate-900">
                        (Tk {activeAccount.actualTotalCostBdt.toLocaleString()})
                      </span>
                    </div>
                  </div>

                  {/* Gross Profit */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0A1A2F] text-white">
                    <div>
                      <div className="font-bold text-[#C8A96A] text-sm">2. Gross Profit (Audited 25.0%)</div>
                      <div className="text-[10px] text-slate-400 font-sans">
                        Contract Revenue / 0.75 margin lock formula
                      </div>
                    </div>
                    <span className="font-mono font-extrabold text-[#C8A96A] text-base">
                      Tk {activeAccount.grossProfitBdt.toLocaleString()}
                    </span>
                  </div>

                  {/* Operating Overheads & Net Yield */}
                  <div className="pl-4 space-y-1.5 border-l-2 border-slate-200 my-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                      Operating Overheads &amp; Financing:
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>&bull; Bank SFD Appraisal &amp; Legal Registration Fees</span>
                      <span className="text-slate-700">(Tk 350,000)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>&bull; IEB Field Engineering &amp; Supervision</span>
                      <span className="text-slate-700">(Tk 420,000)</span>
                    </div>
                  </div>

                  {/* Net Profit */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 border border-slate-200 font-bold text-slate-900">
                    <span>3. Net Commercial Operating Profit</span>
                    <span className="text-emerald-700 font-extrabold text-sm">
                      Tk {(activeAccount.grossProfitBdt - 770000).toLocaleString()} (
                      {(((activeAccount.grossProfitBdt - 770000) / activeAccount.turnkeyContractPriceBdt) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: SREDA Cash Export & Risk Controls */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>SREDA Net-Metering Yield</span>
                  </h4>
                  <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-amber-900 font-bold">
                      <span>Annual Surplus Buyback:</span>
                      <span className="font-mono">
                        Tk {(activeAccount.annualSurplusCashExportBdt / 100000).toFixed(2)} Lakh / yr
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-600">
                      Guaranteed Tk 10.50/kWh utility buyback cash credit against factory monthly electric bills.
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>5% Defect Liability Period (DLP)</span>
                  </h4>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-mono">DLP Escrow Deposit:</span>
                      <span className="font-bold font-mono text-[#0A1A2F]">
                        Tk {activeAccount.retention5PercentBdt.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-mono">Maturity Release Date:</span>
                      <span className="font-bold font-mono text-emerald-800">
                        {activeAccount.retentionMaturityDate}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Held by PFI Bank as performance security for 365 days post-SREDA commissioning.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 2: PROJECT GENERAL LEDGER (DOUBLE-ENTRY DR / CR JOURNAL)
              --------------------------------------------------------------------- */}
          {activeTab === 'ledger' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-extrabold text-[#0A1A2F] uppercase tracking-wider font-mono">
                    Project General Ledger (Double-Entry Audit Journal)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Real-time transaction posting for {activeAccount.projectName} ({activeAccount.projectId})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsVoucherModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1A2F] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer font-mono"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#C9A86A]" />
                    <span>Post Voucher</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export Ledger CSV</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Posting Date</th>
                      <th className="py-3 px-4">Voucher Ref #</th>
                      <th className="py-3 px-4">Account Code &amp; Title</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-right">Debit (BDT)</th>
                      <th className="py-3 px-4 text-right">Credit (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {ledger.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-slate-500">{entry.date}</td>
                        <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-900">{entry.ref}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#0A1A2F] block">{entry.accountCode}</span>
                          <span className="text-[10px] text-slate-500">{entry.accountTitle}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs">{entry.desc}</td>
                        <td className="py-3 px-4 text-right whitespace-nowrap font-bold text-emerald-700">
                          {entry.debit > 0 ? `Tk ${entry.debit.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap font-bold text-[#0A1A2F]">
                          {entry.credit > 0 ? `Tk ${entry.credit.toLocaleString()}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100/80 font-bold text-[#0A1A2F] border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={4} className="py-3 px-4 uppercase text-[10px]">
                        Total Journal Postings (Audited Balanced)
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-800">
                        Tk {ledger.reduce((acc, e) => acc + e.debit, 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#0A1A2F]">
                        Tk {ledger.reduce((acc, e) => acc + e.credit, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 3: COMPLETE PROJECT BALANCE SHEET & 5% DLP ESCROW
              --------------------------------------------------------------------- */}
          {activeTab === 'balance_sheet' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                <div>
                  <h4 className="text-sm font-extrabold text-[#0A1A2F]">
                    Project Balance Sheet &amp; Ring-Fenced Escrow
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">
                    Financial Position as of {activeAccount.updatedAt} &bull; {activeAccount.projectName}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto">
                  ✓ ASSETS = LIABILITIES + EQUITY
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                {/* Assets Column */}
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200">
                    <h5 className="font-bold text-emerald-900 uppercase text-[11px] tracking-wider mb-2 font-sans">
                      Current Assets
                    </h5>
                    <div className="space-y-2 text-slate-700">
                      <div className="flex items-center justify-between">
                        <span>&bull; Cash at Bank (PFI Escrow):</span>
                        <span className="font-bold text-slate-900">Tk {bs.cashInBank.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>&bull; Accounts Receivable (Billed Milestones):</span>
                        <span className="font-bold text-slate-900">Tk {bs.accountsReceivable.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>&bull; Work-in-Progress (Unbilled Staging):</span>
                        <span className="font-bold text-slate-900">Tk {bs.workInProgress.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-teal-800 font-bold pt-1 border-t border-emerald-200">
                        <span>&bull; 5% Defect Liability Escrow (365d Guarantee):</span>
                        <span>Tk {bs.dlpEscrow.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0A1A2F] text-white rounded-lg flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-[11px]">Total Project Assets:</span>
                    <span className="text-base font-extrabold text-emerald-400">
                      Tk {bs.totalAssets.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Liabilities & Equity Column */}
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2 font-sans">
                      Liabilities &amp; Project Equity
                    </h5>
                    <div className="space-y-2 text-slate-700">
                      <div className="flex items-center justify-between">
                        <span>&bull; OEM Hardware LC at Sight Payable:</span>
                        <span className="font-bold text-slate-900">Tk {bs.oemPayables.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>&bull; Subcontractor Retention Payable:</span>
                        <span className="font-bold text-slate-900">Tk {bs.subcontractorRetainage.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-500 font-semibold">
                        <span>Total Project Liabilities:</span>
                        <span>Tk {bs.totalLiabilities.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#C8A96A] font-bold pt-2 border-t border-slate-200">
                        <span>&bull; Retained Earnings (Realized 25% Margin):</span>
                        <span className="text-[#C8A96A]">Tk {bs.projectRetainedEarnings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0A1A2F] text-white rounded-lg flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-[11px]">Total Liabilities &amp; Equity:</span>
                    <span className="text-base font-extrabold text-[#C8A96A]">
                      Tk {bs.totalLiabilitiesAndEquity.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 4: MILESTONE BILLING WATERFALL (20/40/30/10)
              --------------------------------------------------------------------- */}
          {activeTab === 'milestones' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-xs font-extrabold text-[#0A1A2F] uppercase tracking-wider font-mono">
                    Milestone-Based Billing &amp; Invoicing Schedule (20 / 40 / 30 / 10)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Bank refinance disbursements tied to verifiable physical EPC progress.
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-emerald-800">
                  Collected: Tk {(activeAccount.totalCollectedBdt / 100000).toFixed(2)} Lakh / Tk {(activeAccount.turnkeyContractPriceBdt / 100000).toFixed(2)} Lakh
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0A1A2F] text-white uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Milestone Scope</th>
                      <th className="py-3 px-4">% Tranche</th>
                      <th className="py-3 px-4">Amount (BDT)</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Payment Status</th>
                      <th className="py-3 px-4 text-right">Invoice Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {activeAccount.milestones.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{m.milestoneTitle}</td>
                        <td className="py-3 px-4">{m.percentage}%</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          Tk {m.amountBdt.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-slate-500">{m.dueDate}</td>
                        <td className="py-3 px-4">
                          {m.status === 'paid_in_bank' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Paid in Bank Escrow
                            </span>
                          )}
                          {m.status === 'invoice_issued' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              Tax Invoice Issued
                            </span>
                          )}
                          {m.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">
                              Pending Milestone
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {m.status === 'invoice_issued' ? (
                            <button
                              type="button"
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition cursor-pointer"
                            >
                              Mark Paid
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition cursor-pointer"
                            >
                              VAT-11 Invoice
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: PORTFOLIO MASTER FINANCIAL TABLE
          ========================================================================= */}
      {viewMode === 'PORTFOLIO_TABLE' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-extrabold text-[#0A1A2F] uppercase tracking-wider font-mono">
                Portfolio Master Financial Audit Table ({filteredAccounts.length} Projects)
              </h4>
              <p className="text-[11px] text-slate-500">
                Auditing 25.0% gross margin lock, collections, and 5% DLP retainage across the active pipeline.
              </p>
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search project name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Project &amp; Capacity</th>
                  <th className="py-3 px-4">Turnkey Contract (BDT)</th>
                  <th className="py-3 px-4">Actual COGS (BDT)</th>
                  <th className="py-3 px-4">Gross Profit (25%)</th>
                  <th className="py-3 px-4">Cash Collected</th>
                  <th className="py-3 px-4">Receivables</th>
                  <th className="py-3 px-4">5% DLP Escrow</th>
                  <th className="py-3 px-4">SREDA Yield / yr</th>
                  <th className="py-3 px-4 text-right">Drilldown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAccounts.map((acc) => (
                  <tr
                    key={acc.id}
                    onClick={() => {
                      setSelectedProjectId(acc.projectId);
                      setViewMode('STATEMENT');
                    }}
                    className="hover:bg-emerald-50/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-[#0A1A2F]">{acc.projectName}</div>
                      <div className="text-[10px] text-slate-400">{acc.capacityKwp} kWp &bull; {acc.projectId}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                      Tk {acc.turnkeyContractPriceBdt.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      Tk {acc.actualTotalCostBdt.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#C8A96A] block">
                        Tk {acc.grossProfitBdt.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800">
                        {acc.realizedGrossMarginPct.toFixed(1)}% Audited
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-emerald-700">
                      Tk {acc.totalCollectedBdt.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-amber-700 font-bold">
                      Tk {acc.totalOutstandingBdt.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-teal-800">
                      Tk {acc.retention5PercentBdt.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-amber-600 font-semibold">
                      Tk {(acc.annualSurplusCashExportBdt / 100000).toFixed(1)}L
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProjectId(acc.projectId);
                          setViewMode('STATEMENT');
                        }}
                        className="px-2.5 py-1 rounded bg-[#0A1A2F] hover:bg-emerald-700 text-white text-[11px] font-bold transition cursor-pointer"
                      >
                        Statements &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Post Project General Ledger Voucher Modal */}
      <PostJournalVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        projects={accounts}
        activeProject={activeAccount}
        onPostVoucher={handlePostVoucherSubmitted}
        theme={theme}
      />
    </div>
  );
}
