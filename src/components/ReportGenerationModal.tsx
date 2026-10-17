'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  Download,
  Share2,
  X,
  CheckCircle2,
  Calendar,
  Building2,
  DollarSign,
  TrendingUp,
  Layers,
  ShieldCheck,
  Filter,
  Sparkles,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  Table,
  Check,
  Globe2,
  PieChart,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { CompanyEntity, EntityCode } from '@/types/erp';
import { B2B_ORDER_PNL_DATA, B2C_LOT_SHIPMENT_PNL_DATA } from '@/data/pnlCalculationData';
import { INITIAL_STANDARD_VOUCHERS } from '@/data/initialVouchers';
import { StandardVoucher } from '@/types/voucher';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { OfficialDocument } from '@/types/documentPortal';

export type ReportType =
  | 'CASHFLOW_DAILY'
  | 'B2B_ORDER_PNL'
  | 'B2C_LOT_PNL'
  | 'ACCOUNTS_PAYABLE'
  | 'COMMERCIAL_INVOICES'
  | 'TASKS_OPERATIONS'
  | 'CRM_PIPELINE'
  | 'ANNUAL_FINANCIAL_MATRIX';

export interface ReportGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReportType?: ReportType;
  activeEntity?: CompanyEntity;
}

interface ReportOptionMeta {
  type: ReportType;
  title: string;
  category: 'FINANCE' | 'SALES' | 'OPERATIONS';
  description: string;
  badge: string;
}

const REPORT_OPTIONS: ReportOptionMeta[] = [
  {
    type: 'CASHFLOW_DAILY',
    title: 'Daily Cashflow & Voucher Ledger Statement',
    category: 'FINANCE',
    description: 'Income inflows vs expense disbursements, running cash balance, and physical cash memo audit rate.',
    badge: 'Station Banks Real-Time',
  },
  {
    type: 'B2B_ORDER_PNL',
    title: 'B2B Wholesale Profit & Loss (Order Wise)',
    category: 'SALES',
    description: 'Per-order commercial contracts, PO factory COGS, inland logistics, LC bank fees, and target margins.',
    badge: 'Min 25%–30% Margin',
  },
  {
    type: 'B2C_LOT_PNL',
    title: 'B2C Retail Profit & Loss (Lot / Shipment Wise)',
    category: 'SALES',
    description: 'Ocean/air consignment unit economics, landed COGS, foreign VAT, Amazon/Shopify fees, and marketing CAC.',
    badge: 'Consignment Lots',
  },
  {
    type: 'ACCOUNTS_PAYABLE',
    title: 'Accounts Payable to Vendors & Aging Report',
    category: 'FINANCE',
    description: 'Partner factories, tanneries, and mills liabilities, payment terms, turnover debit/credit, and overdue dates.',
    badge: 'Supplier Liabilities',
  },
  {
    type: 'COMMERCIAL_INVOICES',
    title: 'Commercial Invoices & NBR Tax Billing Register',
    category: 'FINANCE',
    description: 'Export commercial invoices, pro-formas, HS customs declarations, and Bangladesh NBR Mushak 6.3 VAT chalans.',
    badge: 'NBR Mushak 6.3',
  },
  {
    type: 'TASKS_OPERATIONS',
    title: 'Production Tasks & Sampling Milestone Report',
    category: 'OPERATIONS',
    description: 'Factory sampling velocity, AQL 1.5 inspection lead times, tech packs, and merchant workload allocation.',
    badge: 'AQL 1.5 SDOs',
  },
  {
    type: 'CRM_PIPELINE',
    title: 'Global CRM Pipeline & Buyer Conversion Funnel',
    category: 'SALES',
    description: 'Wholesale retail buyer leads (US/UK/EU/AU), projected GMV pipeline, win-loss conversion, and contract stages.',
    badge: '254 Accounts',
  },
  {
    type: 'ANNUAL_FINANCIAL_MATRIX',
    title: '12-Month Consolidated Financial Matrix (Cash Flow & P&L)',
    category: 'FINANCE',
    description: 'Quarterly financial calendar matrix, revenue, COGS, operating OPEX, EBITDA, and retained net profit.',
    badge: 'Fiscal Year 2026',
  },
];

export const ReportGenerationModal: React.FC<ReportGenerationModalProps> = ({
  isOpen,
  onClose,
  initialReportType = 'CASHFLOW_DAILY',
  activeEntity,
}) => {
  // Report Config State
  const [selectedType, setSelectedType] = useState<ReportType>(initialReportType);
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('CURRENT_MONTH');
  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [endDate, setEndDate] = useState<string>('2026-10-31');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BDT');
  const [detailLevel, setDetailLevel] = useState<'SUMMARY' | 'DETAILED' | 'AUDIT_TRAIL'>('DETAILED');

  // Generation View State
  const [isCompiled, setIsCompiled] = useState<boolean>(true);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Sync initialReportType
  React.useEffect(() => {
    if (initialReportType) {
      setSelectedType(initialReportType);
    }
  }, [initialReportType]);

  // Vouchers state from localStorage or fallback
  const vouchers: StandardVoucher[] = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('arielmc_erp_vouchers_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return INITIAL_STANDARD_VOUCHERS;
  }, []);

  // Commercial Invoices Mock Dataset
  const sampleInvoices = useMemo(() => [
    {
      invNo: 'INV-2026-UK-001',
      date: '2026-10-12',
      customer: 'Harrods London (Department Store)',
      station: 'ARIEL_UK',
      amountForeign: '£67,500',
      amountBdt: '৳ 10,260,000',
      vatChalan: 'NBR-VAT-6.3-9021',
      status: 'PAID_SETTLED',
      paymentMode: 'Confirmed Irrevocable LC',
    },
    {
      invNo: 'INV-2026-US-001',
      date: '2026-10-14',
      customer: 'Nordstrom Inc. (US Retail Chain)',
      station: 'ARIEL_US',
      amountForeign: '$48,000',
      amountBdt: '৳ 5,832,000',
      vatChalan: 'NBR-VAT-6.3-9022',
      status: 'PARTIAL_ADVANCE',
      paymentMode: 'TT Wire Advance (30%)',
    },
    {
      invNo: 'INV-2026-EU-002',
      date: '2026-10-16',
      customer: 'Le Bon Marché Paris (B2B Boutique)',
      station: 'ARIEL_EU',
      amountForeign: '€37,500',
      amountBdt: '৳ 4,950,000',
      vatChalan: 'NBR-VAT-6.3-9023',
      status: 'ISSUED_PENDING',
      paymentMode: 'Net 30 Days Standby LC',
    },
    {
      invNo: 'INV-2026-D2C-UK-104',
      date: '2026-10-17',
      customer: 'Shopify UK Direct Retail Consumers',
      station: 'ARIEL_UK',
      amountForeign: '£450',
      amountBdt: '৳ 68,400',
      vatChalan: 'UK-HMRC-VAT-8841',
      status: 'PAID_SETTLED',
      paymentMode: 'Barclays Station Settlement',
    },
    {
      invNo: 'INV-2026-AU-001',
      date: '2026-10-18',
      customer: 'David Jones Sydney (Department Store)',
      station: 'ARIEL_AU',
      amountForeign: 'A$33,600',
      amountBdt: '৳ 2,688,000',
      vatChalan: 'NBR-VAT-6.3-9025',
      status: 'PAID_SETTLED',
      paymentMode: 'Irrevocable LC at Sight',
    },
  ], []);

  // Vendor Payables Mock / Local Dataset
  const samplePayables = useMemo(() => [
    {
      vendor: 'Apex Leather Crafts Ltd',
      station: 'ARIEL_BD',
      category: 'Partner Factory',
      terms: 'Net 30 Days',
      dueDate: '2026-11-15',
      debitTurnover: 10600,
      creditTurnover: 2200,
      balanceUsd: 8400,
      status: 'CURRENT',
    },
    {
      vendor: 'Veritas Processing Group',
      station: 'ARIEL_BD',
      category: 'Partner Factory',
      terms: 'Confirmed Irrevocable LC',
      dueDate: '2026-11-20',
      debitTurnover: 24500,
      creditTurnover: 5000,
      balanceUsd: 19500,
      status: 'CURRENT',
    },
    {
      vendor: 'Bengal Natural Jute Mills Ltd',
      station: 'ARIEL_BD',
      category: 'Jute Mill',
      terms: 'Net 45 Days',
      dueDate: '2026-11-05',
      debitTurnover: 14200,
      creditTurnover: 8000,
      balanceUsd: 6200,
      status: 'DUE_SOON',
    },
    {
      vendor: 'Savar Tannery Environmental Lab',
      station: 'ARIEL_BD',
      category: 'Testing Lab',
      terms: 'Immediate upon Inspection',
      dueDate: '2026-10-31',
      debitTurnover: 1200,
      creditTurnover: 0,
      balanceUsd: 1200,
      status: 'DUE_SOON',
    },
    {
      vendor: 'DHL Express International (BD)',
      station: 'ARIEL_BD',
      category: 'Logistics Carrier',
      terms: 'Corporate Net 30',
      dueDate: '2026-11-10',
      debitTurnover: 3400,
      creditTurnover: 1200,
      balanceUsd: 2200,
      status: 'CURRENT',
    },
  ], []);

  // Filtered Cashflow Vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      const matchStation = selectedStation === 'ALL' || v.stationCode === selectedStation || (!v.stationCode && selectedStation === 'ARIEL_BD');
      return matchStation;
    });
  }, [vouchers, selectedStation]);

  // Aggregate Stats for Current Report
  const currentReportStats = useMemo(() => {
    switch (selectedType) {
      case 'CASHFLOW_DAILY': {
        const totalDisbursements = filteredVouchers
          .filter((v) => v.type === 'CASH_PURCHASE')
          .reduce((sum, v) => sum + v.totalAmountBdt, 0);
        const totalInflows = filteredVouchers
          .filter((v) => v.type === 'CASH_RECEIVE')
          .reduce((sum, v) => sum + v.totalAmountBdt, 0);
        const netCash = totalInflows - totalDisbursements;
        const memoRate = filteredVouchers.length > 0 ? (filteredVouchers.filter((v) => !!v.physicalAttachment).length / filteredVouchers.length) * 100 : 0;
        return {
          metric1: { label: 'Total Inflows (Receive)', value: `৳ ${totalInflows.toLocaleString()}`, color: 'text-emerald-400' },
          metric2: { label: 'Total Disbursements', value: `৳ ${totalDisbursements.toLocaleString()}`, color: 'text-rose-400' },
          metric3: { label: 'Net Cash Balance', value: `৳ ${netCash.toLocaleString()}`, color: 'text-[#C8A96A]' },
          metric4: { label: 'Physical Memo Rate', value: `${memoRate.toFixed(0)}% Verified`, color: 'text-cyan-300' },
        };
      }
      case 'B2B_ORDER_PNL': {
        const totalRev = B2B_ORDER_PNL_DATA.reduce((sum, r) => sum + r.contractRevenueUsd, 0);
        const totalCogs = B2B_ORDER_PNL_DATA.reduce((sum, r) => sum + r.factoryCogsUsd, 0);
        const totalProfit = B2B_ORDER_PNL_DATA.reduce((sum, r) => sum + r.orderNetProfitUsd, 0);
        const avgMargin = totalRev > 0 ? (totalProfit / totalRev) * 100 : 0;
        return {
          metric1: { label: 'Contracted Revenue', value: `$ ${totalRev.toLocaleString()}`, color: 'text-emerald-400' },
          metric2: { label: 'Factory PO COGS', value: `$ ${totalCogs.toLocaleString()}`, color: 'text-rose-400' },
          metric3: { label: 'Order Net Profit', value: `$ ${totalProfit.toLocaleString()}`, color: 'text-[#C8A96A]' },
          metric4: { label: 'Average Margin %', value: `${avgMargin.toFixed(1)}% (Target ≥ 25%)`, color: 'text-emerald-300' },
        };
      }
      case 'B2C_LOT_PNL': {
        const totalGmv = B2C_LOT_SHIPMENT_PNL_DATA.reduce((sum, l) => sum + l.grossSalesUsd, 0);
        const totalCogs = B2C_LOT_SHIPMENT_PNL_DATA.reduce((sum, l) => sum + l.factoryFobCogsUsd, 0);
        const totalProfit = B2C_LOT_SHIPMENT_PNL_DATA.reduce((sum, l) => sum + l.lotNetProfitUsd, 0);
        const avgMargin = totalGmv > 0 ? (totalProfit / totalGmv) * 100 : 0;
        return {
          metric1: { label: 'Gross Retail GMV', value: `$ ${totalGmv.toLocaleString()}`, color: 'text-cyan-300' },
          metric2: { label: 'Factory FOB COGS', value: `$ ${totalCogs.toLocaleString()}`, color: 'text-rose-400' },
          metric3: { label: 'Lot Net Profit', value: `$ ${totalProfit.toLocaleString()}`, color: 'text-[#C8A96A]' },
          metric4: { label: 'Net Margin %', value: `${avgMargin.toFixed(1)}% (Consignment)`, color: 'text-emerald-300' },
        };
      }
      case 'ACCOUNTS_PAYABLE': {
        const totalDebt = samplePayables.reduce((sum, p) => sum + p.balanceUsd, 0);
        const totalDebit = samplePayables.reduce((sum, p) => sum + p.debitTurnover, 0);
        const totalCredit = samplePayables.reduce((sum, p) => sum + p.creditTurnover, 0);
        return {
          metric1: { label: 'Total Outstanding Liabilities', value: `$ ${totalDebt.toLocaleString()}`, color: 'text-rose-400' },
          metric2: { label: 'Debit Turnover (Invoices)', value: `$ ${totalDebit.toLocaleString()}`, color: 'text-amber-300' },
          metric3: { label: 'Credit Turnover (Settled)', value: `$ ${totalCredit.toLocaleString()}`, color: 'text-emerald-400' },
          metric4: { label: 'Active Factory Vendors', value: `${samplePayables.length} Accounts`, color: 'text-cyan-300' },
        };
      }
      case 'COMMERCIAL_INVOICES': {
        return {
          metric1: { label: 'Total Invoiced Volume', value: '৳ 23,800,400', color: 'text-emerald-400' },
          metric2: { label: 'Settled & Realized', value: '৳ 18,786,400', color: 'text-cyan-300' },
          metric3: { label: 'Unsettled Receivables', value: '৳ 5,014,000', color: 'text-amber-400' },
          metric4: { label: 'NBR Mushak Compliance', value: '100% Tax Chalans', color: 'text-emerald-300' },
        };
      }
      default: {
        return {
          metric1: { label: 'Fiscal Metric 1', value: '$ 650,000', color: 'text-emerald-400' },
          metric2: { label: 'Fiscal Metric 2', value: '$ 357,500', color: 'text-rose-400' },
          metric3: { label: 'Operating Profit (EBIT)', value: '$ 184,500', color: 'text-[#C8A96A]' },
          metric4: { label: 'Statutory Compliance', value: 'Certified Clean', color: 'text-cyan-300' },
        };
      }
    }
  }, [selectedType, filteredVouchers, samplePayables]);

  // Handle Compile / Regenerate
  const handleCompileReport = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      setIsCompiled(true);
    }, 600);
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    const nowStr = new Date().toISOString().split('T')[0];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    if (selectedType === 'CASHFLOW_DAILY') {
      headers = ['Sl', 'Date', 'Voucher Number', 'Type', 'Station', 'Station Bank', 'Head', 'Sub-Category', 'Party', 'Amount BDT'];
      rows = filteredVouchers.map((v, i) => [
        i + 1,
        v.date,
        v.voucherNumber,
        v.type === 'CASH_RECEIVE' ? 'RECEIVE / INFLOW' : 'PURCHASE / DISBURSEMENT',
        v.stationCode || 'ARIEL_BD',
        v.stationBankName || 'Eastern Bank PLC',
        v.mainAccountHead,
        v.subCategoryHead || '',
        v.partyName,
        v.totalAmountBdt,
      ]);
    } else if (selectedType === 'B2B_ORDER_PNL') {
      headers = ['SO Number', 'Buyer', 'Market', 'Units', 'Revenue USD', 'PO COGS USD', 'Freight USD', 'Tooling USD', 'LC Bank USD', 'Net Profit USD', 'Margin %'];
      rows = B2B_ORDER_PNL_DATA.map((r) => [
        r.soNumber,
        r.buyerCompany,
        r.targetMarket,
        r.totalQuantity,
        r.contractRevenueUsd,
        r.factoryCogsUsd,
        r.inlandFreightPortCfsUsd,
        r.customBrandingToolingUsd,
        r.exportFinanceBankingLcUsd,
        r.orderNetProfitUsd,
        `${r.orderProfitMarginPct}%`,
      ]);
    } else if (selectedType === 'B2C_LOT_PNL') {
      headers = ['Lot Number', 'Vessel / Carrier', 'Station', 'Units', 'Gross GMV USD', 'VAT Deducted USD', 'Factory COGS USD', 'Freight USD', '3PL / FBA USD', 'CAC USD', 'Net Profit USD', 'Margin %'];
      rows = B2C_LOT_SHIPMENT_PNL_DATA.map((l) => [
        l.lotNumber,
        l.carrierVessel,
        l.hubLocation,
        l.totalUnits,
        l.grossSalesUsd,
        l.vatOrSalesTaxRemittanceUsd,
        l.factoryFobCogsUsd,
        l.oceanOrAirFreightUsd,
        l.amazonFbaOrLocalPickPackUsd,
        l.channelPerformanceAdSpendUsd,
        l.lotNetProfitUsd,
        `${l.lotProfitMarginPct}%`,
      ]);
    } else if (selectedType === 'ACCOUNTS_PAYABLE') {
      headers = ['Vendor', 'Station', 'Category', 'Payment Terms', 'Due Date', 'Debit Turnover USD', 'Credit Turnover USD', 'Outstanding USD', 'Status'];
      rows = samplePayables.map((p) => [
        p.vendor,
        p.station,
        p.category,
        p.terms,
        p.dueDate,
        p.debitTurnover,
        p.creditTurnover,
        p.balanceUsd,
        p.status,
      ]);
    } else {
      headers = ['Invoice No', 'Date', 'Customer', 'Station', 'Amount Foreign', 'Amount BDT', 'Mushak 6.3 Chalan', 'Payment Mode', 'Status'];
      rows = sampleInvoices.map((inv) => [
        inv.invNo,
        inv.date,
        inv.customer,
        inv.station,
        inv.amountForeign,
        inv.amountBdt,
        inv.vatChalan,
        inv.paymentMode,
        inv.status,
      ]);
    }

    const csvContent = [headers.map(escapeCsv).join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ArielMC_${selectedType}_Report_${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Official Document for Sharing
  const officialReportDoc: OfficialDocument = {
    id: `DOC-REP-${selectedType}-${Date.now()}`,
    docCode: `AMC-REP-${selectedType}-2026`,
    documentNumber: `AMC-REP-${selectedType}-2026`,
    title: `ArielMC Official Audited Report: ${REPORT_OPTIONS.find((o) => o.type === selectedType)?.title}`,
    category: 'STATUTORY_FINANCIAL_REPORT',
    section: 'FINANCE_TAX',
    issuingAuthority: 'ArielMC Directorate of Finance & Commercial Operations',
    station: (selectedStation === 'ALL' ? 'ARIEL_BD' : selectedStation) as EntityCode,
    countryCode: 'BD',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '2026-12-31',
    renewalLeadDays: 30,
    status: 'ACTIVE',
    verificationUrl: `https://erp.arielmc.com/verify-report?type=${selectedType}&station=${selectedStation}&ack=true`,
    qrCodeData: `AMC-REPORT-VERIFY|TYPE_${selectedType}|STATION_${selectedStation}|TIMESTAMP_${new Date().toISOString()}`,
    fileUrl: '/docs/ArielMC_Compliance_Dossier.pdf',
    fileFormat: 'PDF',
    fileSize: '1.8 MB',
    version: '2026.1',
    verified: true,
    uploadedBy: 'Tanvir Hossain (Accounts & Finance Lead)',
    uploadedAt: new Date().toISOString(),
    tags: ['Statutory Report', 'Audit Statement', 'Commercial Verification', selectedType],
    notes: `Official audited executive report compiled for Bangladesh Bank AD & international tax compliance.`,
    isStatutoryRequirement: true,
  };

  if (!isOpen) return null;

  const currentMeta = REPORT_OPTIONS.find((o) => o.type === selectedType) || REPORT_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#12231B] border-2 border-[#2C5240] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* =========================================================
            1. STICKY MODAL HEADER
            ========================================================= */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#12231B] border-b border-[#2C5240] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#8C6D37] text-[#12231B] shadow-md font-bold">
              <FileSpreadsheet className="w-5 h-5 text-[#12231B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-heading text-white">
                  Executive Report &amp; Financial Statement Generator
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  STATUTORY AUDIT READY
                </span>
              </div>
              <p className="text-[11px] text-gray-300 font-['Open_Sans'] line-clamp-1 mt-0.5">
                Compile real-time cashflow statements, order-wise &amp; lot-wise P&amp;L ledgers, vendor liabilities, and tax billing reports.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================================
            2. SCROLLABLE REPORT BUILDER & PREVIEW BODY
            ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* STEP 1: REPORT TEMPLATE SELECTOR TILES */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#C8A96A] font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>1. Select Report Template &amp; Statement Classification</span>
              </label>
              <span className="text-[10px] text-gray-400 font-mono">
                {REPORT_OPTIONS.length} Certified Operational Templates
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {REPORT_OPTIONS.map((opt) => {
                const isSelected = selectedType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => {
                      setSelectedType(opt.type);
                      setIsCompiled(true);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#1E6B3A] to-[#14512C] border-emerald-400 shadow-md text-white'
                        : 'bg-[#0A140F] border-[#2C5240] text-gray-400 hover:text-white hover:border-[#3d6e56]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-black/40 text-emerald-300' : 'bg-white/5 text-gray-400'
                        }`}>
                          {opt.category}
                        </span>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-[#C8A96A]" />
                        )}
                      </div>
                      <div className="font-bold text-xs line-clamp-1 text-white">
                        {opt.title}
                      </div>
                      <p className="text-[10px] text-gray-300 line-clamp-2 mt-0.5 leading-snug">
                        {opt.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-1 border-t border-white/10 flex items-center justify-between text-[9px] font-mono font-semibold text-emerald-300">
                      <span>{opt.badge}</span>
                      <ArrowRight className="w-3 h-3 text-[#C8A96A]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: REPORT FILTERS & COMPILATION SCOPE */}
          <div className="p-3.5 rounded-xl bg-[#0A140F] border border-[#2C5240] space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#C8A96A] font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>2. Statement Scope, Parameters &amp; Currency Conversion</span>
              </span>
              <button
                type="button"
                onClick={handleCompileReport}
                disabled={isCompiling}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer font-['Montserrat'] shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
                <span>{isCompiling ? 'Compiling Live Data...' : 'Re-Compile Statement'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {/* Station Filter */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#C8A96A]" />
                  <span>Station / Organization</span>
                </label>
                <select
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                  className="w-full bg-[#12231B] border border-[#2C5240] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                >
                  <option value="ALL">All Stations (Consolidated Global)</option>
                  <option value="ARIEL_BD">ARIEL_BD — Dhaka Central Headquarters</option>
                  <option value="ARIEL_UK">ARIEL_UK — London Mayfair Station</option>
                  <option value="ARIEL_US">ARIEL_US — New York Commercial Station</option>
                  <option value="ARIEL_EU">ARIEL_EU — Amsterdam Logistics Station</option>
                  <option value="ARIEL_AU">ARIEL_AU — Sydney Oceania Station</option>
                </select>
              </div>

              {/* Reporting Period */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  <span>Reporting Period</span>
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full bg-[#12231B] border border-[#2C5240] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                >
                  <option value="CURRENT_MONTH">Current Month (October 2026)</option>
                  <option value="TODAY">Today / Real-Time Daily Inflows</option>
                  <option value="Q4_2026">Q4 2026 (Oct – Dec 2026)</option>
                  <option value="FY_2026">Fiscal Year 2026 / 2027</option>
                  <option value="CUSTOM">Custom Range</option>
                </select>
              </div>

              {/* Base Currency */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-cyan-400" />
                  <span>Reporting Currency</span>
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full bg-[#12231B] border border-[#2C5240] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                >
                  <option value="BDT">BDT (৳) — Bangladesh Bank Statutory</option>
                  <option value="USD">USD ($) — International Trade Commercial</option>
                  <option value="GBP">GBP (£) — UK Mayfair Station Standard</option>
                  <option value="EUR">EUR (€) — EU Continent Standard</option>
                  <option value="AUD">AUD (A$) — Australia Pacific Standard</option>
                </select>
              </div>

              {/* Detail Granularity */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <Table className="w-3 h-3 text-[#C8A96A]" />
                  <span>Audit Detail Level</span>
                </label>
                <select
                  value={detailLevel}
                  onChange={(e) => setDetailLevel(e.target.value as any)}
                  className="w-full bg-[#12231B] border border-[#2C5240] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                >
                  <option value="DETAILED">Detailed Itemized Ledger</option>
                  <option value="SUMMARY">Executive High-Level Summary</option>
                  <option value="AUDIT_TRAIL">Full Statutory Audit Trail with Memos</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 3: LIVE PREVIEW OF THE COMPILED REPORT DOSSIER */}
          <div className="rounded-xl border border-emerald-500/50 bg-[#0A140F] p-4 sm:p-5 space-y-4 shadow-xl">
            
            {/* Dossier Letterhead Banner */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-[#2C5240] pb-3.5 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-base text-white tracking-wider uppercase">
                    Ariel Marketing &amp; Communications Limited
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#C8A96A] text-[#12231B] font-mono text-[9px] font-bold">
                    OFFICIAL DOSSIER
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5 space-x-2">
                  <span>Registered BIN: 003892714-0102</span>
                  <span>•</span>
                  <span>Issuing Hub: Dhaka Central (Gulshan-1)</span>
                  <span>•</span>
                  <span>Compliance: EPB / BB AD &amp; NBR</span>
                </div>
                <h3 className="text-sm font-bold font-heading text-emerald-300 mt-2">
                  {currentMeta.title}
                </h3>
              </div>

              <div className="text-right font-mono text-[10px] text-gray-400 space-y-0.5">
                <div>Report Ref: <strong className="text-white">AMC-REP-{selectedType}-0842</strong></div>
                <div>Compiled: <span className="text-emerald-400">{new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString()}</span></div>
                <div>Station Scope: <span className="text-[#C8A96A] font-bold">{selectedStation}</span></div>
              </div>
            </div>

            {/* 4 Summary Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-lg bg-[#12231B] border border-[#2C5240]">
                <span className="text-[9px] text-gray-400 font-mono block">{currentReportStats.metric1.label}</span>
                <span className={`text-base font-bold font-mono ${currentReportStats.metric1.color}`}>
                  {currentReportStats.metric1.value}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#12231B] border border-[#2C5240]">
                <span className="text-[9px] text-gray-400 font-mono block">{currentReportStats.metric2.label}</span>
                <span className={`text-base font-bold font-mono ${currentReportStats.metric2.color}`}>
                  {currentReportStats.metric2.value}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#12231B] border border-[#2C5240]">
                <span className="text-[9px] text-gray-400 font-mono block">{currentReportStats.metric3.label}</span>
                <span className={`text-base font-bold font-mono ${currentReportStats.metric3.color}`}>
                  {currentReportStats.metric3.value}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#12231B] border border-[#2C5240]">
                <span className="text-[9px] text-gray-400 font-mono block">{currentReportStats.metric4.label}</span>
                <span className={`text-base font-bold font-mono ${currentReportStats.metric4.color}`}>
                  {currentReportStats.metric4.value}
                </span>
              </div>
            </div>

            {/* Structured Table Preview */}
            <div className="rounded-lg border border-[#2C5240] overflow-x-auto bg-[#070E0A]">
              {selectedType === 'CASHFLOW_DAILY' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Voucher #</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Station Bank</th>
                      <th className="py-2 px-3">Account Head</th>
                      <th className="py-2 px-3">Party / Buyer</th>
                      <th className="py-2 px-3 text-right">Credit / Debit (BDT)</th>
                      <th className="py-2 px-3 text-center">Memo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {filteredVouchers.slice(0, 8).map((v) => (
                      <tr key={v.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 text-gray-400">{v.date}</td>
                        <td className="py-2 px-3 font-bold text-white">{v.voucherNumber}</td>
                        <td className="py-2 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            v.type === 'CASH_RECEIVE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {v.type === 'CASH_RECEIVE' ? 'RECEIVE' : 'PURCHASE'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-gray-300">{v.stationBankName || 'Eastern Bank PLC'}</td>
                        <td className="py-2 px-3 text-gray-300 truncate max-w-[150px]">{v.mainAccountHead}</td>
                        <td className="py-2 px-3 text-white truncate max-w-[140px]">{v.partyName}</td>
                        <td className={`py-2 px-3 text-right font-bold ${v.type === 'CASH_RECEIVE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {v.type === 'CASH_RECEIVE' ? '+' : '-'}৳ {v.totalAmountBdt.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {v.physicalAttachment ? (
                            <span className="text-[9px] text-emerald-400 font-bold">✓ Attached</span>
                          ) : (
                            <span className="text-[9px] text-gray-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedType === 'B2B_ORDER_PNL' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2 px-3">SO Number</th>
                      <th className="py-2 px-3">Buyer &amp; Market</th>
                      <th className="py-2 px-3 text-right">Units</th>
                      <th className="py-2 px-3 text-right">Revenue (USD)</th>
                      <th className="py-2 px-3 text-right">Factory COGS</th>
                      <th className="py-2 px-3 text-right">Freight &amp; Port</th>
                      <th className="py-2 px-3 text-right">Net Profit</th>
                      <th className="py-2 px-3 text-center">Net Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {B2B_ORDER_PNL_DATA.map((r) => (
                      <tr key={r.soNumber} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{r.soNumber}</td>
                        <td className="py-2 px-3 text-gray-300">{r.buyerCompany} ({r.targetMarket})</td>
                        <td className="py-2 px-3 text-right text-gray-400">{r.totalQuantity.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-400">$ {r.contractRevenueUsd.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-rose-300">$ {r.factoryCogsUsd.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-gray-300">$ {r.inlandFreightPortCfsUsd.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-bold text-[#C8A96A]">$ {r.orderNetProfitUsd.toLocaleString()}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                            {r.orderProfitMarginPct}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedType === 'B2C_LOT_PNL' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2 px-3">Lot Number</th>
                      <th className="py-2 px-3">Vessel / Vessel Line</th>
                      <th className="py-2 px-3">Station</th>
                      <th className="py-2 px-3 text-right">Units</th>
                      <th className="py-2 px-3 text-right">Gross GMV</th>
                      <th className="py-2 px-3 text-right">Landed COGS</th>
                      <th className="py-2 px-3 text-right">Net Profit</th>
                      <th className="py-2 px-3 text-center">Net Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {B2C_LOT_SHIPMENT_PNL_DATA.map((l) => (
                      <tr key={l.lotNumber} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{l.lotNumber}</td>
                        <td className="py-2 px-3 text-gray-300">{l.carrierVessel}</td>
                        <td className="py-2 px-3 text-cyan-300">{l.hubLocation}</td>
                        <td className="py-2 px-3 text-right text-gray-400">{l.totalUnits.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-400">$ {l.grossSalesUsd.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-rose-300">$ {l.factoryFobCogsUsd.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-bold text-[#C8A96A]">$ {l.lotNetProfitUsd.toLocaleString()}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                            {l.lotProfitMarginPct}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedType === 'ACCOUNTS_PAYABLE' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2 px-3">Vendor Name</th>
                      <th className="py-2 px-3">Station</th>
                      <th className="py-2 px-3">Classification</th>
                      <th className="py-2 px-3">Payment Terms</th>
                      <th className="py-2 px-3">Due Date</th>
                      <th className="py-2 px-3 text-right">Debit Turnover</th>
                      <th className="py-2 px-3 text-right">Credit Settled</th>
                      <th className="py-2 px-3 text-right">Outstanding Debt</th>
                      <th className="py-2 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {samplePayables.map((p, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{p.vendor}</td>
                        <td className="py-2 px-3 text-gray-400">{p.station}</td>
                        <td className="py-2 px-3 text-gray-300">{p.category}</td>
                        <td className="py-2 px-3 text-gray-300">{p.terms}</td>
                        <td className="py-2 px-3 text-gray-400">{p.dueDate}</td>
                        <td className="py-2 px-3 text-right text-amber-300">$ {p.debitTurnover.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-emerald-400">$ {p.creditTurnover.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-bold text-rose-400">$ {p.balanceUsd.toLocaleString()}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            p.status === 'CURRENT' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedType === 'COMMERCIAL_INVOICES' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2 px-3">Invoice #</th>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Customer / Buyer</th>
                      <th className="py-2 px-3">Station</th>
                      <th className="py-2 px-3 text-right">Foreign Value</th>
                      <th className="py-2 px-3 text-right">Value (BDT)</th>
                      <th className="py-2 px-3">NBR Mushak 6.3</th>
                      <th className="py-2 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {sampleInvoices.map((inv) => (
                      <tr key={inv.invNo} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{inv.invNo}</td>
                        <td className="py-2 px-3 text-gray-400">{inv.date}</td>
                        <td className="py-2 px-3 text-gray-200">{inv.customer}</td>
                        <td className="py-2 px-3 text-cyan-300">{inv.station}</td>
                        <td className="py-2 px-3 text-right text-emerald-300 font-bold">{inv.amountForeign}</td>
                        <td className="py-2 px-3 text-right text-white font-bold">{inv.amountBdt}</td>
                        <td className="py-2 px-3 text-[#C8A96A]">{inv.vatChalan}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            inv.status === 'PAID_SETTLED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {(selectedType === 'TASKS_OPERATIONS' || selectedType === 'CRM_PIPELINE' || selectedType === 'ANNUAL_FINANCIAL_MATRIX') && (
                <div className="p-4 text-center space-y-2">
                  <p className="text-xs text-gray-300 font-mono">
                    {currentMeta.title} compiled with live metrics across all participating stations.
                  </p>
                  <div className="text-[11px] text-[#C8A96A] font-bold">
                    ✓ Full statutory audit trace validated for {selectedStation} in {selectedPeriod}
                  </div>
                </div>
              )}
            </div>

            {/* Official Signature Box */}
            <div className="pt-3 border-t border-[#2C5240] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Digitally Sealed: ArielMC Finance Directorate • Hash #9038-AF-2026</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Verified: Tanvir Hossain (Accounts Lead)</span>
                <span>•</span>
                <span>Approved: Syed Akramul Hassan (MD)</span>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================
            3. STICKY MODAL FOOTER WITH REAL EXPORT ACTIONS
            ========================================================= */}
        <div className="px-5 py-3.5 bg-[#0A140F] border-t border-[#2C5240] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#C8A96A] shrink-0" />
            <span>
              Compilation Ready: <strong className="text-white">{currentMeta.title}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Close
            </button>

            {/* Share Statement Modal Button */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer font-mono"
              title="Share officially signed report for customer or bank verification"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Share (Verify / Ack)</span>
            </button>

            {/* Export CSV / Spreadsheet Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold border border-teal-500/40 transition-all cursor-pointer font-['Montserrat'] shadow-md"
              title="Download structured CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-teal-200" />
              <span>Export CSV</span>
            </button>

            {/* Print / Download PDF Dossier */}
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer font-['Montserrat'] border border-emerald-400/40"
              title="Print official standard A4 report dossier or save as PDF"
            >
              <Printer className="w-4 h-4 text-[#C8A96A]" />
              <span>Print / Export PDF</span>
            </button>
          </div>
        </div>

      </div>

      {/* Share Document Modal */}
      <ShareDocumentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        document={officialReportDoc}
      />
    </div>
  );
};
