'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  ArrowLeft,
  RefreshCw,
  SlidersHorizontal,
  Table,
  Check,
  Globe2,
  PieChart,
  Receipt,
  FileSpreadsheet,
  Eye,
  CheckCheck,
  ExternalLink
} from 'lucide-react';
import { CompanyEntity, EntityCode } from '@/types/erp';
import { B2B_ORDER_PNL_DATA, B2C_LOT_SHIPMENT_PNL_DATA } from '@/data/pnlCalculationData';
import { INITIAL_STANDARD_VOUCHERS } from '@/data/initialVouchers';
import { StandardVoucher } from '@/types/voucher';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { OfficialDocument } from '@/types/documentPortal';
import { CustomDateRangeModal } from '@/components/CustomDateRangeModal';
import Image from 'next/image';
import {
  ARIELMC_EMBLEM_DATA_URI,
  ARIELMC_EMBLEM_PATH,
  SYED_AKRAMUL_HASSAN_SIGNATURE_DATA_URI,
  SYED_AKRAMUL_HASSAN_SIGNATURE_PATH
} from '@/lib/brandLogoData';

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
  initialViewMode?: 'BUILDER' | 'PREVIEW';
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

const CURRENCY_CONFIG: Record<string, { symbol: string; rate: number; name: string }> = {
  BDT: { symbol: '৳', rate: 121.5, name: 'BDT' },
  USD: { symbol: '$', rate: 1.0, name: 'USD' },
  GBP: { symbol: '£', rate: 0.79, name: 'GBP' },
  EUR: { symbol: '€', rate: 0.92, name: 'EUR' },
  AUD: { symbol: 'A$', rate: 1.52, name: 'AUD' },
};

export const ReportGenerationModal: React.FC<ReportGenerationModalProps> = ({
  isOpen,
  onClose,
  initialReportType = 'ANNUAL_FINANCIAL_MATRIX',
  initialViewMode = 'BUILDER',
  activeEntity,
}) => {
  // View Stage State: 'BUILDER' (Configuration) vs 'PREVIEW' (Dedicated Preview Screen)
  const [viewMode, setViewMode] = useState<'BUILDER' | 'PREVIEW'>(initialViewMode || 'BUILDER');
  const [previewZoom, setPreviewZoom] = useState<'100%' | '95%' | '85%'>('100%');

  // Report Config State
  const [selectedType, setSelectedType] = useState<ReportType>(initialReportType);
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('CURRENT_MONTH');
  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [endDate, setEndDate] = useState<string>('2026-10-18');
  const [isCustomRangeModalOpen, setIsCustomRangeModalOpen] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BDT');
  const [detailLevel, setDetailLevel] = useState<'SUMMARY' | 'DETAILED' | 'AUDIT_TRAIL'>('DETAILED');

  // Generation View State
  const [isCompiled, setIsCompiled] = useState<boolean>(true);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);
  const [showResultFeedback, setShowResultFeedback] = useState<boolean>(false);

  // Dynamic references
  const resultPreviewRef = useRef<HTMLDivElement>(null);
  const [compiledTimestamp, setCompiledTimestamp] = useState<string>(() => {
    return `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}`;
  });
  const [reportRefCode, setReportRefCode] = useState<string>(() => {
    return `AMC-REP-${initialReportType || 'ANNUAL_FINANCIAL_MATRIX'}-0842`;
  });

  // Sync initialReportType and initialViewMode whenever modal opens or updates
  useEffect(() => {
    if (isOpen) {
      if (initialViewMode) {
        setViewMode(initialViewMode);
      }
      if (initialReportType) {
        setSelectedType(initialReportType);
        setReportRefCode(`AMC-REP-${initialReportType}-0842`);
      }
    }
  }, [isOpen, initialReportType, initialViewMode]);

  // Current Currency exchange rate and formatter
  const currentRate = CURRENCY_CONFIG[selectedCurrency] || CURRENCY_CONFIG.BDT;

  const formatCurr = (usdVal: number) => {
    const converted = usdVal * currentRate.rate;
    return `${currentRate.symbol} ${Math.round(converted).toLocaleString()}`;
  };

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

  // 12-Month Consolidated Financial Statement Dataset
  const annualFinancialRows = useMemo(() => [
    { item: 'Gross Contracted Revenue (B2B Wholesale Contracts)', q1: 220000, q2: 280000, q3: 310000, q4: 390000, total: 1200000, pct: '69.0%', isHeader: false, isBold: false, highlight: 'none' },
    { item: 'Direct Consignment GMV (B2C E-Commerce & Retail)', q1: 90000, q2: 125000, q3: 145000, q4: 180000, total: 540000, pct: '31.0%', isHeader: false, isBold: false, highlight: 'none' },
    { item: '1. Total Gross Consolidated Revenue', q1: 310000, q2: 405000, q3: 455000, q4: 570000, total: 1740000, pct: '100.0%', isHeader: true, isBold: true, highlight: 'emerald' },
    { item: 'Factory Raw Materials & Finished PO COGS (FOB Dhaka)', q1: 145000, q2: 188000, q3: 210000, q4: 262000, total: 805000, pct: '46.3%', isHeader: false, isBold: false, highlight: 'none' },
    { item: 'Ocean / Air Freight, CFS Customs & 3PL Logistics', q1: 32000, q2: 41000, q3: 46000, q4: 58000, total: 177000, pct: '10.2%', isHeader: false, isBold: false, highlight: 'none' },
    { item: '2. Total Cost of Goods Sold (COGS)', q1: 177000, q2: 229000, q3: 256000, q4: 320000, total: 982000, pct: '56.4%', isHeader: true, isBold: true, highlight: 'rose' },
    { item: '3. Gross Operating Margin (Contribution)', q1: 133000, q2: 176000, q3: 199000, q4: 250000, total: 758000, pct: '43.6%', isHeader: true, isBold: true, highlight: 'gold' },
    { item: 'Station Hub Overhead, SG&A, Tech & Headcount OPEX', q1: 48000, q2: 52000, q3: 54000, q4: 58000, total: 212000, pct: '12.2%', isHeader: false, isBold: false, highlight: 'none' },
    { item: '4. Operating Profit / EBITDA', q1: 85000, q2: 124000, q3: 145000, q4: 192000, total: 546000, pct: '31.4%', isHeader: true, isBold: true, highlight: 'emerald' },
    { item: 'Bangladesh NBR VAT & Statutory Corporate Tax Provision', q1: 15000, q2: 22000, q3: 26000, q4: 34000, total: 97000, pct: '5.6%', isHeader: false, isBold: false, highlight: 'none' },
    { item: '5. Net Retained Profit / Equity Reserve', q1: 70000, q2: 102000, q3: 119000, q4: 158000, total: 449000, pct: '25.8%', isHeader: true, isBold: true, highlight: 'cyan' },
  ], []);

  // Production Tasks & Sampling Milestone Dataset
  const sampleOperationsTasks = useMemo(() => [
    { code: 'TSK-SMP-01', task: 'SS27 Full-Grain Leather Weekender Sampling', factory: 'Apex Leather Crafts Ltd', dept: 'Sampling R&D', dueDate: '2026-10-24', status: 'AQL 1.0 Passed', leadDays: '5 Days', merchant: 'Tariqul Islam (Sr Merchant)' },
    { code: 'TSK-SMP-02', task: 'Jute-Cotton Heritage Tote Batch Weave Test', factory: 'Bengal Natural Jute Mills Ltd', dept: 'Weaving & Dyeing', dueDate: '2026-10-26', status: 'In Progress', leadDays: '7 Days', merchant: 'Rafiq Ahmed (Tech Merchant)' },
    { code: 'TSK-SMP-03', task: 'Chromium-Free Tannery Chemical Audit', factory: 'Savar Eco Tannery Lab', dept: 'Lab Testing', dueDate: '2026-10-28', status: 'Certified REACH', leadDays: '3 Days', merchant: 'Nusrat Jahan (Compliance)' },
    { code: 'TSK-SMP-04', task: 'Gold-Foil Debossing & Hardware Quality QC', factory: 'Veritas Processing Group', dept: 'Finishing & Pack', dueDate: '2026-10-30', status: 'AQL 1.5 Pending', leadDays: '4 Days', merchant: 'Tanvir Hossain (Accounts/Ops)' },
    { code: 'TSK-SMP-05', task: 'Export Pallet Fumigation & Container Seal', factory: 'Chittagong CFS Dock', dept: 'Logistics Hub', dueDate: '2026-11-02', status: 'Customs Scheduled', leadDays: '2 Days', merchant: 'Kamal Uddin (Logistics Lead)' },
  ], []);

  // Global CRM Pipeline Dataset
  const sampleCrmLeads = useMemo(() => [
    { code: 'CRM-UK-01', account: 'Harrods London (Department Store)', market: 'United Kingdom', contact: 'Eleanor Vance (Buying Director)', stage: 'Contract Signed', dealUsd: 380000, winPct: '95%', closeDate: '2026-11-15', owner: 'Syed Akramul Hassan' },
    { code: 'CRM-US-02', account: 'Nordstrom Inc. (US Retail Chain)', market: 'United States', contact: 'Marcus Sterling (VP Merchandising)', stage: 'Sampling Review', dealUsd: 520000, winPct: '80%', closeDate: '2026-11-28', owner: 'Farhana Yasmin' },
    { code: 'CRM-EU-03', account: 'Le Bon Marché Paris (B2B Boutique)', market: 'France (EU)', contact: 'Camille Dubois (Head of Sourcing)', stage: 'Commercial Terms', dealUsd: 290000, winPct: '70%', closeDate: '2026-12-05', owner: 'Syed Akramul Hassan' },
    { code: 'CRM-AU-04', account: 'David Jones Sydney (Department Store)', market: 'Australia', contact: 'Lachlan Murdoch (Category Lead)', stage: 'Tech Pack Validation', dealUsd: 340000, winPct: '60%', closeDate: '2026-12-18', owner: 'Tariqul Islam' },
    { code: 'CRM-EU-05', account: 'KaDeWe Berlin Department Store', market: 'Germany (EU)', contact: 'Jürgen Schmidt (Senior Buyer)', stage: 'Initial Discovery', dealUsd: 310000, winPct: '45%', closeDate: '2027-01-10', owner: 'Farhana Yasmin' },
  ], []);

  // Filtered Cashflow Vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      const matchStation = selectedStation === 'ALL' || v.stationCode === selectedStation || (!v.stationCode && selectedStation === 'ARIEL_BD');
      if (!matchStation) return false;
      if (selectedPeriod === 'CUSTOM') {
        const vDate = v.date ? v.date.substring(0, 10) : '';
        if (vDate && (vDate < startDate || vDate > endDate)) return false;
      }
      return true;
    });
  }, [vouchers, selectedStation, selectedPeriod, startDate, endDate]);

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
        
        // Convert to selected currency
        const inUsdInflows = totalInflows / 121.5;
        const inUsdDisbursements = totalDisbursements / 121.5;
        const inUsdNet = netCash / 121.5;

        return {
          metric1: { label: 'Total Inflows (Receive)', value: formatCurr(inUsdInflows), color: 'text-emerald-400' },
          metric2: { label: 'Total Disbursements', value: formatCurr(inUsdDisbursements), color: 'text-rose-400' },
          metric3: { label: 'Net Cash Balance', value: formatCurr(inUsdNet), color: 'text-[#C8A96A]' },
          metric4: { label: 'Physical Memo Rate', value: `${memoRate.toFixed(0)}% Verified`, color: 'text-cyan-300' },
        };
      }
      case 'B2B_ORDER_PNL': {
        const totalRev = B2B_ORDER_PNL_DATA.reduce((sum, r) => sum + r.contractRevenueUsd, 0);
        const totalCogs = B2B_ORDER_PNL_DATA.reduce((sum, r) => sum + r.factoryCogsUsd, 0);
        const totalProfit = B2B_ORDER_PNL_DATA.reduce((sum, r) => sum + r.orderNetProfitUsd, 0);
        const avgMargin = totalRev > 0 ? (totalProfit / totalRev) * 100 : 0;
        return {
          metric1: { label: 'Contracted Revenue', value: formatCurr(totalRev), color: 'text-emerald-400' },
          metric2: { label: 'Factory PO COGS', value: formatCurr(totalCogs), color: 'text-rose-400' },
          metric3: { label: 'Order Net Profit', value: formatCurr(totalProfit), color: 'text-[#C8A96A]' },
          metric4: { label: 'Average Margin %', value: `${avgMargin.toFixed(1)}% (Target ≥ 25%)`, color: 'text-emerald-300' },
        };
      }
      case 'B2C_LOT_PNL': {
        const totalGmv = B2C_LOT_SHIPMENT_PNL_DATA.reduce((sum, l) => sum + l.grossSalesUsd, 0);
        const totalCogs = B2C_LOT_SHIPMENT_PNL_DATA.reduce((sum, l) => sum + l.factoryFobCogsUsd, 0);
        const totalProfit = B2C_LOT_SHIPMENT_PNL_DATA.reduce((sum, l) => sum + l.lotNetProfitUsd, 0);
        const avgMargin = totalGmv > 0 ? (totalProfit / totalGmv) * 100 : 0;
        return {
          metric1: { label: 'Gross Retail GMV', value: formatCurr(totalGmv), color: 'text-cyan-300' },
          metric2: { label: 'Factory FOB COGS', value: formatCurr(totalCogs), color: 'text-rose-400' },
          metric3: { label: 'Lot Net Profit', value: formatCurr(totalProfit), color: 'text-[#C8A96A]' },
          metric4: { label: 'Net Margin %', value: `${avgMargin.toFixed(1)}% (Consignment)`, color: 'text-emerald-300' },
        };
      }
      case 'ACCOUNTS_PAYABLE': {
        const totalDebt = samplePayables.reduce((sum, p) => sum + p.balanceUsd, 0);
        const totalDebit = samplePayables.reduce((sum, p) => sum + p.debitTurnover, 0);
        const totalCredit = samplePayables.reduce((sum, p) => sum + p.creditTurnover, 0);
        return {
          metric1: { label: 'Total Outstanding Liabilities', value: formatCurr(totalDebt), color: 'text-rose-400' },
          metric2: { label: 'Debit Turnover (Invoices)', value: formatCurr(totalDebit), color: 'text-amber-300' },
          metric3: { label: 'Credit Turnover (Settled)', value: formatCurr(totalCredit), color: 'text-emerald-400' },
          metric4: { label: 'Active Factory Vendors', value: `${samplePayables.length} Accounts`, color: 'text-cyan-300' },
        };
      }
      case 'COMMERCIAL_INVOICES': {
        return {
          metric1: { label: 'Total Invoiced Volume', value: formatCurr(195900), color: 'text-emerald-400' },
          metric2: { label: 'Settled & Realized', value: formatCurr(154620), color: 'text-cyan-300' },
          metric3: { label: 'Unsettled Receivables', value: formatCurr(41280), color: 'text-amber-400' },
          metric4: { label: 'NBR Mushak Compliance', value: '100% Tax Chalans', color: 'text-emerald-300' },
        };
      }
      case 'TASKS_OPERATIONS': {
        return {
          metric1: { label: 'Active Sampling SDOs', value: '28 Milestones', color: 'text-emerald-400' },
          metric2: { label: 'AQL 1.5 Inspection Pass', value: '98.4% (Certified)', color: 'text-cyan-300' },
          metric3: { label: 'Avg Sampling Velocity', value: '5.8 Days Lead Time', color: 'text-[#C8A96A]' },
          metric4: { label: 'Merchant Workload SLA', value: '96.2% On-Time', color: 'text-emerald-300' },
        };
      }
      case 'CRM_PIPELINE': {
        return {
          metric1: { label: 'Total Pipeline GMV', value: formatCurr(1840000), color: 'text-emerald-400' },
          metric2: { label: 'Active Retail Accounts', value: '254 Global Buyers', color: 'text-cyan-300' },
          metric3: { label: 'Weighted Forecast', value: formatCurr(1316000), color: 'text-[#C8A96A]' },
          metric4: { label: 'Win-Loss Conversion', value: '38.5% (Tier-1 Retail)', color: 'text-emerald-300' },
        };
      }
      case 'ANNUAL_FINANCIAL_MATRIX':
      default: {
        return {
          metric1: { label: 'Consolidated Gross Revenue', value: formatCurr(1740000), color: 'text-emerald-400' },
          metric2: { label: 'Total COGS & Logistics', value: formatCurr(982000), color: 'text-rose-400' },
          metric3: { label: 'Operating Profit (EBITDA)', value: formatCurr(546000), color: 'text-[#C8A96A]' },
          metric4: { label: 'Statutory Compliance', value: 'Certified Clean (EPB/BB)', color: 'text-cyan-300' },
        };
      }
    }
  }, [selectedType, filteredVouchers, samplePayables, currentRate]);

  // Primary action: Handle View Result / Compile Report
  const handleViewResult = (targetMode: 'BUILDER' | 'PREVIEW' = 'PREVIEW') => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      setIsCompiled(true);
      setCompiledTimestamp(`${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}`);
      setReportRefCode(`AMC-REP-${selectedType}-${Math.floor(1000 + Math.random() * 9000)}`);
      setIsFlashActive(true);
      setShowResultFeedback(true);
      if (targetMode === 'PREVIEW') {
        setViewMode('PREVIEW');
      }
      setTimeout(() => setIsFlashActive(false), 1400);
      setTimeout(() => setShowResultFeedback(false), 3000);

      // Smooth scroll to results
      resultPreviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 350);
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
      headers = ['Sl', 'Date', 'Voucher Number', 'Type', 'Station', 'Station Bank', 'Head', 'Sub-Category', 'Party', `Amount (${selectedCurrency})`];
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
        Math.round((v.totalAmountBdt / 121.5) * currentRate.rate),
      ]);
    } else if (selectedType === 'B2B_ORDER_PNL') {
      headers = ['SO Number', 'Buyer', 'Market', 'Units', `Revenue (${selectedCurrency})`, `PO COGS (${selectedCurrency})`, 'Net Profit USD', 'Margin %'];
      rows = B2B_ORDER_PNL_DATA.map((r) => [
        r.soNumber,
        r.buyerCompany,
        r.targetMarket,
        r.totalQuantity,
        Math.round(r.contractRevenueUsd * currentRate.rate),
        Math.round(r.factoryCogsUsd * currentRate.rate),
        r.orderNetProfitUsd,
        `${r.orderProfitMarginPct}%`,
      ]);
    } else if (selectedType === 'B2C_LOT_PNL') {
      headers = ['Lot Number', 'Vessel / Carrier', 'Station', 'Units', `Gross GMV (${selectedCurrency})`, `COGS (${selectedCurrency})`, 'Net Profit USD', 'Margin %'];
      rows = B2C_LOT_SHIPMENT_PNL_DATA.map((l) => [
        l.lotNumber,
        l.carrierVessel,
        l.hubLocation,
        l.totalUnits,
        Math.round(l.grossSalesUsd * currentRate.rate),
        Math.round(l.factoryFobCogsUsd * currentRate.rate),
        l.lotNetProfitUsd,
        `${l.lotProfitMarginPct}%`,
      ]);
    } else if (selectedType === 'ACCOUNTS_PAYABLE') {
      headers = ['Vendor', 'Station', 'Category', 'Payment Terms', 'Due Date', `Debit Turnover (${selectedCurrency})`, `Credit Turnover (${selectedCurrency})`, `Outstanding (${selectedCurrency})`, 'Status'];
      rows = samplePayables.map((p) => [
        p.vendor,
        p.station,
        p.category,
        p.terms,
        p.dueDate,
        Math.round(p.debitTurnover * currentRate.rate),
        Math.round(p.creditTurnover * currentRate.rate),
        Math.round(p.balanceUsd * currentRate.rate),
        p.status,
      ]);
    } else if (selectedType === 'ANNUAL_FINANCIAL_MATRIX') {
      headers = ['Line Item', `Q1 (${selectedCurrency})`, `Q2 (${selectedCurrency})`, `Q3 (${selectedCurrency})`, `Q4 (${selectedCurrency})`, `Full Year (${selectedCurrency})`, '% of Revenue'];
      rows = annualFinancialRows.map((r) => [
        r.item,
        Math.round(r.q1 * currentRate.rate),
        Math.round(r.q2 * currentRate.rate),
        Math.round(r.q3 * currentRate.rate),
        Math.round(r.q4 * currentRate.rate),
        Math.round(r.total * currentRate.rate),
        r.pct,
      ]);
    } else if (selectedType === 'TASKS_OPERATIONS') {
      headers = ['Code', 'Milestone Task', 'Partner Factory', 'Department', 'Target Due Date', 'AQL Status', 'Lead Time', 'Merchant Lead'];
      rows = sampleOperationsTasks.map((t) => [
        t.code,
        t.task,
        t.factory,
        t.dept,
        t.dueDate,
        t.status,
        t.leadDays,
        t.merchant,
      ]);
    } else if (selectedType === 'CRM_PIPELINE') {
      headers = ['Code', 'Buyer Account', 'Market', 'Contact', 'Pipeline Stage', `Deal Value (${selectedCurrency})`, 'Win Probability', 'Close Date', 'Owner'];
      rows = sampleCrmLeads.map((c) => [
        c.code,
        c.account,
        c.market,
        c.contact,
        c.stage,
        Math.round(c.dealUsd * currentRate.rate),
        c.winPct,
        c.closeDate,
        c.owner,
      ]);
    } else {
      headers = ['Invoice No', 'Date', 'Customer', 'Station', 'Foreign Value', 'BDT Value', 'NBR Mushak 6.3', 'Payment Mode', 'Status'];
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

  // Format numbers for clean print rendering with non-breaking spaces
  const formatPrintCurr = (usdVal: number) => {
    const converted = usdVal * currentRate.rate;
    return `${currentRate.symbol}\u00A0${Math.round(converted).toLocaleString()}`;
  };

  // Open Document Preview in External Window as Print Version
  const handleOpenExternalPrintWindow = () => {
    // Open popup synchronously during user gesture so browsers don't block it
    const printWin = window.open(
      '',
      '_blank',
      'width=1150,height=920,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes'
    );

    if (!printWin) {
      alert('Please allow pop-ups for this site to open the external print preview window.');
      return;
    }

    // Set title immediately
    printWin.document.title = `${currentMeta.title} - ArielMC Official Audited Statement`;

    // Generate Table Rows based on selected report type
    let tableHtml = '';
    if (selectedType === 'ANNUAL_FINANCIAL_MATRIX') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 38%; text-align: left;">Financial Line Item &amp; Performance Ledger</th>
              <th style="width: 10%; text-align: right;">Q1 (Jan–Mar)</th>
              <th style="width: 10%; text-align: right;">Q2 (Apr–Jun)</th>
              <th style="width: 10%; text-align: right;">Q3 (Jul–Sep)</th>
              <th style="width: 10%; text-align: right;">Q4 (Oct–Dec)</th>
              <th style="width: 14%; text-align: right;">FY 2026 Total</th>
              <th style="width: 8%; text-align: center;">% of Rev</th>
            </tr>
          </thead>
          <tbody>
            ${annualFinancialRows.map((r) => {
              let trClass = '';
              if (r.highlight === 'emerald') trClass = 'row-tot-emerald';
              else if (r.highlight === 'rose') trClass = 'row-tot-rose';
              else if (r.highlight === 'gold') trClass = 'row-tot-gold';
              else if (r.highlight === 'cyan') trClass = 'row-tot-cyan';
              else if (r.isHeader) trClass = 'row-subhead';

              return `
                <tr class="${trClass}">
                  <td class="cell-item ${r.isBold ? 'font-bold' : ''}">${r.item}</td>
                  <td class="cell-num">${formatPrintCurr(r.q1)}</td>
                  <td class="cell-num">${formatPrintCurr(r.q2)}</td>
                  <td class="cell-num">${formatPrintCurr(r.q3)}</td>
                  <td class="cell-num">${formatPrintCurr(r.q4)}</td>
                  <td class="cell-num font-bold highlight-val">${formatPrintCurr(r.total)}</td>
                  <td class="cell-center"><span class="pct-badge ${r.highlight !== 'none' ? 'badge-' + r.highlight : ''}">${r.pct}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'CASHFLOW_DAILY') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 11%; text-align: left;">Date</th>
              <th style="width: 14%; text-align: left;">Voucher #</th>
              <th style="width: 11%; text-align: center;">Type</th>
              <th style="width: 16%; text-align: left;">Station Bank</th>
              <th style="width: 18%; text-align: left;">Account Head</th>
              <th style="width: 16%; text-align: left;">Party / Vendor</th>
              <th style="width: 14%; text-align: right;">Amount (${selectedCurrency})</th>
            </tr>
          </thead>
          <tbody>
            ${filteredVouchers.slice(0, 15).map((v) => {
              const convertedAmt = Math.round((v.totalAmountBdt / 121.5) * currentRate.rate);
              const isReceive = v.type === 'CASH_RECEIVE';
              return `
                <tr>
                  <td class="cell-muted">${v.date}</td>
                  <td class="font-bold">${v.voucherNumber}</td>
                  <td class="cell-center"><span class="type-badge ${isReceive ? 'badge-receive' : 'badge-purchase'}">${isReceive ? 'RECEIVE' : 'PURCHASE'}</span></td>
                  <td class="cell-muted">${v.stationBankName || 'Eastern Bank PLC'}</td>
                  <td>${v.mainAccountHead}</td>
                  <td class="font-bold">${v.partyName}</td>
                  <td class="cell-num ${isReceive ? 'text-emerald' : 'text-rose'} font-bold">
                    ${isReceive ? '+' : '-'}${currentRate.symbol}\u00A0${convertedAmt.toLocaleString()}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'B2B_ORDER_PNL') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 12%; text-align: left;">SO Number</th>
              <th style="width: 22%; text-align: left;">Buyer &amp; Target Market</th>
              <th style="width: 10%; text-align: right;">Quantity</th>
              <th style="width: 15%; text-align: right;">Contract Rev (${selectedCurrency})</th>
              <th style="width: 14%; text-align: right;">Factory COGS</th>
              <th style="width: 13%; text-align: right;">Freight &amp; Port</th>
              <th style="width: 14%; text-align: right;">Order Net Profit</th>
            </tr>
          </thead>
          <tbody>
            ${B2B_ORDER_PNL_DATA.map((r) => `
              <tr>
                <td class="font-bold">${r.soNumber}</td>
                <td>${r.buyerCompany} <span class="cell-muted">(${r.targetMarket})</span></td>
                <td class="cell-num cell-muted">${r.totalQuantity.toLocaleString()} pcs</td>
                <td class="cell-num text-emerald font-bold">${formatPrintCurr(r.contractRevenueUsd)}</td>
                <td class="cell-num text-rose">${formatPrintCurr(r.factoryCogsUsd)}</td>
                <td class="cell-num cell-muted">${formatPrintCurr(r.inlandFreightPortCfsUsd)}</td>
                <td class="cell-num text-gold font-bold">${formatPrintCurr(r.orderNetProfitUsd)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'B2C_LOT_PNL') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 14%; text-align: left;">Lot Number</th>
              <th style="width: 20%; text-align: left;">Vessel &amp; Carrier</th>
              <th style="width: 14%; text-align: left;">Destination Hub</th>
              <th style="width: 10%; text-align: right;">Total Units</th>
              <th style="width: 16%; text-align: right;">Gross Retail GMV</th>
              <th style="width: 14%; text-align: right;">Factory FOB COGS</th>
              <th style="width: 12%; text-align: right;">Lot Net Profit</th>
            </tr>
          </thead>
          <tbody>
            ${B2C_LOT_SHIPMENT_PNL_DATA.map((l) => `
              <tr>
                <td class="font-bold">${l.lotNumber}</td>
                <td>${l.carrierVessel}</td>
                <td><span class="hub-badge">${l.hubLocation}</span></td>
                <td class="cell-num cell-muted">${l.totalUnits.toLocaleString()} units</td>
                <td class="cell-num text-emerald font-bold">${formatPrintCurr(l.grossSalesUsd)}</td>
                <td class="cell-num text-rose">${formatPrintCurr(l.factoryFobCogsUsd)}</td>
                <td class="cell-num text-gold font-bold">${formatPrintCurr(l.lotNetProfitUsd)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'ACCOUNTS_PAYABLE') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 20%; text-align: left;">Factory / Vendor</th>
              <th style="width: 12%; text-align: left;">Station</th>
              <th style="width: 16%; text-align: left;">Category</th>
              <th style="width: 12%; text-align: left;">Payment Terms</th>
              <th style="width: 12%; text-align: left;">Due Date</th>
              <th style="width: 14%; text-align: right;">Debit Turnover</th>
              <th style="width: 14%; text-align: right;">Outstanding Liability</th>
            </tr>
          </thead>
          <tbody>
            ${samplePayables.map((p) => `
              <tr>
                <td class="font-bold">${p.vendor}</td>
                <td class="cell-muted">${p.station}</td>
                <td>${p.category}</td>
                <td class="cell-muted">${p.terms}</td>
                <td class="cell-muted">${p.dueDate}</td>
                <td class="cell-num">${formatPrintCurr(p.debitTurnover)}</td>
                <td class="cell-num text-rose font-bold">${formatPrintCurr(p.balanceUsd)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'COMMERCIAL_INVOICES') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 14%; text-align: left;">Invoice #</th>
              <th style="width: 11%; text-align: left;">Issue Date</th>
              <th style="width: 22%; text-align: left;">Customer / Buyer</th>
              <th style="width: 12%; text-align: left;">Station</th>
              <th style="width: 14%; text-align: right;">Declared Foreign</th>
              <th style="width: 15%; text-align: right;">Value (${selectedCurrency})</th>
              <th style="width: 12%; text-align: center;">Mushak 6.3 Chalan</th>
            </tr>
          </thead>
          <tbody>
            ${sampleInvoices.map((inv) => `
              <tr>
                <td class="font-bold">${inv.invNo}</td>
                <td class="cell-muted">${inv.date}</td>
                <td class="font-bold">${inv.customer}</td>
                <td><span class="hub-badge">${inv.station}</span></td>
                <td class="cell-num text-emerald">${inv.amountForeign}</td>
                <td class="cell-num font-bold">${inv.amountBdt}</td>
                <td class="cell-center text-gold font-bold">${inv.vatChalan}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'TASKS_OPERATIONS') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 13%; text-align: left;">SDO Code</th>
              <th style="width: 28%; text-align: left;">Sampling &amp; Production Milestone</th>
              <th style="width: 20%; text-align: left;">Factory Partner</th>
              <th style="width: 14%; text-align: left;">Target Date</th>
              <th style="width: 13%; text-align: center;">QC Status</th>
              <th style="width: 12%; text-align: right;">Lead Days</th>
            </tr>
          </thead>
          <tbody>
            ${sampleOperationsTasks.map((t) => `
              <tr>
                <td class="font-bold">${t.code}</td>
                <td>${t.task}</td>
                <td class="cell-muted">${t.factory}</td>
                <td class="cell-muted">${t.dueDate}</td>
                <td class="cell-center"><span class="status-badge badge-green">${t.status}</span></td>
                <td class="cell-num text-gold font-bold">${t.leadDays}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 12%; text-align: left;">Deal Ref</th>
              <th style="width: 24%; text-align: left;">Buyer / Retail Client</th>
              <th style="width: 15%; text-align: left;">Market Territory</th>
              <th style="width: 18%; text-align: left;">Commercial Contact</th>
              <th style="width: 15%; text-align: right;">Contract GMV</th>
              <th style="width: 16%; text-align: center;">Pipeline Stage</th>
            </tr>
          </thead>
          <tbody>
            ${sampleCrmLeads.map((c) => `
              <tr>
                <td class="font-bold">${c.code}</td>
                <td class="font-bold">${c.account}</td>
                <td class="cell-muted">${c.market}</td>
                <td>${c.contact}</td>
                <td class="cell-num text-emerald font-bold">${formatPrintCurr(c.dealUsd)}</td>
                <td class="cell-center"><span class="status-badge badge-blue">${c.stage}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <base href="${typeof window !== 'undefined' ? window.location.origin : ''}/" />
  <title>${currentMeta.title} - ArielMC Official Audited Print Dossier</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #0f172a;
      color: #0f172a;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.45;
      -webkit-font-smoothing: antialiased;
    }

    /* Top Sticky Control Toolbar */
    .print-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #111827;
      color: #f9fafb;
      border-bottom: 1px solid #374151;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
    }
    .print-toolbar .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .print-toolbar .toolbar-title {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 13.5px;
      color: #ffffff;
      letter-spacing: -0.01em;
    }
    .print-toolbar .toolbar-ref {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      background: #064e3b;
      color: #6ee7b7;
      border: 1px solid #059669;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
    }
    .print-toolbar .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      font-family: 'Montserrat', sans-serif;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
      text-decoration: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, #059669, #0d9488);
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(5, 150, 105, 0.4);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #10b981, #14b8a6);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: #1f2937;
      color: #e5e7eb;
      border: 1px solid #4b5563;
    }
    .btn-secondary:hover {
      background: #374151;
      color: #ffffff;
    }

    /* Studio Paper Stage */
    .paper-stage {
      padding: 24px 16px 60px;
      display: flex;
      justify-content: center;
      background: #0f172a;
    }

    /* Pure White Executive A4 Sheet */
    .a4-sheet {
      width: 210mm;
      min-height: 297mm;
      background: #ffffff !important;
      color: #0f172a !important;
      padding: 14mm 14mm 16mm;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.4);
      border-radius: 4px;
      position: relative;
    }

    /* Corporate Header Layout */
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      padding-bottom: 10px;
    }
    .header-left {
      flex: 1;
    }
    .company-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .company-brand-logo {
      width: 48px;
      height: 48px;
      object-fit: contain;
      flex-shrink: 0;
    }
    .company-name {
      font-family: 'Montserrat', sans-serif;
      font-size: 14px;
      font-weight: 800;
      color: #064e3b;
      letter-spacing: 0.04em;
      line-height: 1.2;
    }
    .company-tagline {
      font-size: 8.5px;
      font-weight: 700;
      color: #92400e;
      letter-spacing: 0.06em;
      margin-top: 2px;
    }
    .company-legal-bar {
      font-size: 9px;
      color: #64748b;
      margin-top: 5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .company-legal-bar .dot {
      color: #cbd5e1;
    }
    .report-title-box {
      margin-top: 10px;
    }
    .report-main-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 15.5px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
    }
    .report-subtitle {
      font-size: 10.5px;
      color: #64748b;
      margin-top: 2px;
      max-width: 480px;
      line-height: 1.35;
    }

    /* Right Metadata Box */
    .header-right {
      flex-shrink: 0;
    }
    .meta-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 7px 11px;
      width: 240px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .meta-badge {
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #064e3b;
      background: #d1fae5;
      border: 1px solid #a7f3d0;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 4px;
    }
    .meta-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.5px;
      padding: 2px 0;
      border-bottom: 1px dashed #f1f5f9;
    }
    .meta-item:last-child {
      border-bottom: none;
    }
    .m-lbl {
      color: #64748b;
      font-weight: 500;
    }
    .m-val {
      font-weight: 700;
      color: #0f172a;
    }
    .ref-tag {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 9px;
      background: #e2e8f0;
      padding: 1px 5px;
      border-radius: 3px;
    }
    .highlight-station {
      color: #92400e;
    }
    .highlight-curr {
      color: #047857;
    }

    /* Gradient Divider */
    .gold-emerald-separator {
      height: 2.5px;
      background: linear-gradient(90deg, #059669 0%, #10b981 60%, #C8A96A 100%);
      border-radius: 2px;
      margin: 6px 0 12px;
    }

    /* 4 Executive KPI Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }
    .kpi-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }
    .kpi-label {
      display: block;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.04em;
      margin-bottom: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .kpi-num {
      display: block;
      font-size: 15px;
      font-weight: 800;
      font-family: 'Inter', sans-serif;
      letter-spacing: -0.02em;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .text-emerald { color: #047857; }
    .text-rose { color: #b91c1c; }
    .text-gold { color: #92400e; }
    .text-cyan { color: #0284c7; }

    /* Report Tables */
    .report-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      font-size: 10.5px;
      margin-bottom: 14px;
    }
    .report-table thead {
      background: #f1f5f9;
    }
    .report-table th {
      background: #f1f5f9;
      color: #1e293b;
      font-family: 'Montserrat', sans-serif;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 6.5px 8px;
      border-bottom: 2px solid #cbd5e1;
      border-right: 1px solid #e2e8f0;
    }
    .report-table th:last-child {
      border-right: none;
    }
    .report-table td {
      padding: 6px 8px;
      border-bottom: 1px solid #f1f5f9;
      border-right: 1px solid #f8fafc;
      color: #1e293b;
      vertical-align: middle;
    }
    .report-table td:last-child {
      border-right: none;
    }
    .report-table tbody tr:nth-child(even) td {
      background-color: #fafbfc;
    }
    .report-table tbody tr:hover td {
      background-color: #f1f5f9;
    }
    .cell-num {
      text-align: right;
      white-space: nowrap !important;
      font-variant-numeric: tabular-nums;
      font-feature-settings: 'tnum';
      font-family: 'Inter', sans-serif;
      font-weight: 500;
    }
    .cell-center {
      text-align: center;
    }
    .cell-muted {
      color: #64748b;
    }
    .font-bold {
      font-weight: 700;
    }
    .highlight-val {
      font-size: 11px;
    }

    /* Highlighted summary rows */
    .row-tot-emerald td {
      background-color: #ecfdf5 !important;
      color: #065f46 !important;
      font-weight: 700;
      border-top: 1.5px solid #6ee7b7 !important;
      border-bottom: 1.5px solid #6ee7b7 !important;
    }
    .row-tot-rose td {
      background-color: #fff1f2 !important;
      color: #9f1239 !important;
      font-weight: 700;
      border-top: 1.5px solid #fecdd3 !important;
      border-bottom: 1.5px solid #fecdd3 !important;
    }
    .row-tot-gold td {
      background-color: #fefce8 !important;
      color: #854d0e !important;
      font-weight: 700;
      border-top: 1.5px solid #fde047 !important;
      border-bottom: 1.5px solid #fde047 !important;
    }
    .row-tot-cyan td {
      background-color: #eff6ff !important;
      color: #1e40af !important;
      font-weight: 700;
      border-top: 1.5px solid #93c5fd !important;
      border-bottom: 1.5px solid #93c5fd !important;
    }
    .row-subhead td {
      background-color: #f8fafc !important;
      font-weight: 700;
    }

    /* Percentage & Status Badges */
    .pct-badge {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 9999px;
      font-size: 8.5px;
      font-weight: 700;
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #cbd5e1;
    }
    .badge-emerald {
      background: #dcfce7;
      color: #166534;
      border-color: #86efac;
    }
    .badge-rose {
      background: #ffe4e6;
      color: #9f1239;
      border-color: #fca5a5;
    }
    .badge-gold {
      background: #fef3c7;
      color: #92400e;
      border-color: #fcd34d;
    }
    .type-badge {
      display: inline-block;
      padding: 1.5px 6px;
      border-radius: 4px;
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 0.04em;
    }
    .badge-receive {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #6ee7b7;
    }
    .badge-purchase {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
    }
    .hub-badge {
      background: #f1f5f9;
      color: #0369a1;
      border: 1px solid #cbd5e1;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 8.5px;
      font-weight: 600;
    }
    .status-badge {
      display: inline-block;
      padding: 1.5px 6px;
      border-radius: 4px;
      font-size: 8.5px;
      font-weight: 700;
    }
    .badge-green {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .badge-blue {
      background: #eff6ff;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }

    /* Verified Audit & Signatures Footer */
    .audit-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 10px;
      margin-top: 12px;
    }
    .seal-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 12px;
      margin-bottom: 10px;
    }
    .seal-left {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 8.5px;
      color: #1e293b;
    }
    .seal-left strong {
      color: #064e3b;
      font-size: 9px;
      display: block;
    }
    .hash-text {
      color: #64748b;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 8px;
      margin-top: 1px;
    }
    .seal-right {
      font-size: 8.5px;
      font-weight: 800;
      color: #92400e;
      letter-spacing: 0.06em;
    }
    .signatures-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .sig-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
    }
    .sig-mark-area {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 1px solid #94a3b8;
      padding-bottom: 4px;
      margin-bottom: 4px;
      min-height: 26px;
    }
    .sig-cursive {
      font-family: 'Brush Script MT', 'Dancing Script', cursive, serif;
      font-size: 18px;
      color: #064e3b;
      letter-spacing: 0.05em;
    }
    .md-cursive {
      color: #92400e;
    }
    .sig-stamp-pill {
      font-size: 7.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      padding: 1.5px 5px;
      border-radius: 3px;
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #6ee7b7;
    }
    .gold-stamp {
      background: #fffbeb;
      color: #92400e;
      border-color: #fde68a;
    }
    .sig-name {
      font-size: 10.5px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-desig {
      font-size: 8.5px;
      color: #475569;
    }
    .sig-date {
      font-size: 8px;
      color: #64748b;
      margin-top: 1px;
    }

    /* Print Overrides */
    @media print {
      @page {
        size: A4 portrait;
        margin: 8mm 8mm 8mm 8mm;
      }
      html, body {
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .no-print {
        display: none !important;
      }
      .paper-stage {
        padding: 0 !important;
        background: transparent !important;
      }
      .a4-sheet {
        width: 100% !important;
        min-height: auto !important;
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .report-table tr {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .audit-footer {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  <!-- Top Floating Toolbar -->
  <div class="print-toolbar no-print">
    <div class="toolbar-left">
      <img src="${ARIELMC_EMBLEM_DATA_URI}" onerror="this.src='/images/ArielMC_Emblem_Square.png'" alt="ArielMC" width="28" height="28" style="width: 28px; height: 28px; object-fit: contain; border-radius: 6px; flex-shrink: 0;" />
      <div>
        <div class="toolbar-title">${currentMeta.title}</div>
        <div style="display: flex; align-items: center; gap: 8px; margin-top: 2px;">
          <span class="toolbar-ref">${reportRefCode}</span>
          <span style="font-size: 11px; color: #9ca3af; font-family: ui-monospace, monospace;">Scope: ${selectedStation} • Period: ${selectedPeriod === 'CUSTOM' ? `${startDate} → ${endDate}` : (selectedPeriod === 'CURRENT_MONTH' ? 'October 2026' : selectedPeriod === 'TODAY' ? 'Today' : selectedPeriod === 'Q4_2026' ? 'Q4 2026' : 'FY 2026/27')} • Currency: ${selectedCurrency} (${currentRate.symbol})</span>
        </div>
      </div>
    </div>
    <div class="toolbar-actions">
      <button class="btn btn-secondary" onclick="window.close()">
        <span>✕ Close Window</span>
      </button>
      <button class="btn btn-primary" onclick="window.print()">
        <span>🖨️ Print / Save as PDF</span>
      </button>
    </div>
  </div>

  <!-- Studio Paper Stage -->
  <div class="paper-stage">
    <div class="a4-sheet">

      <!-- Corporate Header -->
      <div class="header-container">
        <div class="header-left">
          <div class="company-brand">
            <img src="${ARIELMC_EMBLEM_DATA_URI}" onerror="this.src='/images/ArielMC_Emblem_Square.png'" alt="ArielMC Official Logo" class="company-brand-logo" width="48" height="48" style="width: 48px; height: 48px; object-fit: contain; flex-shrink: 0;" />
            <div>
              <div class="company-name">ARIEL MARKETING &amp; COMMUNICATIONS LTD.</div>
              <div class="company-tagline">DIRECTORATE OF CORPORATE FINANCE &amp; COMMERCIAL AUDIT</div>
            </div>
          </div>
          <div class="company-legal-bar">
            <span><strong>Registered BIN:</strong> 003892714-0102</span>
            <span class="dot">•</span>
            <span><strong>HQ:</strong> Dhaka Central (Gulshan-1)</span>
            <span class="dot">•</span>
            <span><strong>Compliance:</strong> EPB / NBR / BB AD</span>
          </div>
          <div class="report-title-box">
            <h1 class="report-main-title">${currentMeta.title}</h1>
            <p class="report-subtitle">${currentMeta.description}</p>
          </div>
        </div>

        <div class="header-right">
          <div class="meta-card">
            <div class="meta-badge">OFFICIAL AUDITED DOSSIER</div>
            <div class="meta-item"><span class="m-lbl">Reference Code</span><span class="m-val ref-tag">${reportRefCode}</span></div>
            <div class="meta-item"><span class="m-lbl">Compiled On</span><span class="m-val">${compiledTimestamp || new Date().toLocaleString()}</span></div>
            <div class="meta-item"><span class="m-lbl">Operating Station</span><span class="m-val highlight-station">${selectedStation}</span></div>
            <div class="meta-item"><span class="m-lbl">Audit Period</span><span class="m-val" style="color: #065f46; font-weight: 700;">${selectedPeriod === 'CUSTOM' ? `${startDate} to ${endDate}` : (selectedPeriod === 'CURRENT_MONTH' ? 'October 2026' : selectedPeriod === 'TODAY' ? 'Today' : selectedPeriod === 'Q4_2026' ? 'Q4 2026' : 'FY 2026/27')}</span></div>
            <div class="meta-item"><span class="m-lbl">Audit Currency</span><span class="m-val highlight-curr">${selectedCurrency} (${currentRate.symbol})</span></div>
            <div class="meta-item"><span class="m-lbl">Conversion Parity</span><span class="m-val">1 USD = ${currentRate.rate} ${selectedCurrency}</span></div>
          </div>
        </div>
      </div>

      <div class="gold-emerald-separator"></div>

      <!-- 4 Summary KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-label">${currentReportStats.metric1.label}</span>
          <span class="kpi-num text-emerald">${currentReportStats.metric1.value.replace(/ /g, '\u00A0')}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">${currentReportStats.metric2.label}</span>
          <span class="kpi-num text-rose">${currentReportStats.metric2.value.replace(/ /g, '\u00A0')}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">${currentReportStats.metric3.label}</span>
          <span class="kpi-num text-gold">${currentReportStats.metric3.value.replace(/ /g, '\u00A0')}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">${currentReportStats.metric4.label}</span>
          <span class="kpi-num text-cyan">${currentReportStats.metric4.value.replace(/ /g, '\u00A0')}</span>
        </div>
      </div>

      <!-- Itemized Ledger Table -->
      ${tableHtml}

      <!-- Verified Audit & Signatures Footer -->
      <div class="audit-footer">
        <div class="seal-banner">
          <div class="seal-left">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <div>
              <strong>ARIELMC AUDITED RECORD &amp; CRYPTOGRAPHIC LEDGER SEAL</strong>
              <div class="hash-text">SHA-256 Digest: #9038-AF-2026-ARLMC • Verified against Eastern Bank PLC &amp; Bangladesh Bank AD returns</div>
            </div>
          </div>
          <div class="seal-right">ISO 9001:2015 &amp; NBR COMPLIANT</div>
        </div>

        <div class="signatures-row">
          <div class="sig-card">
            <div class="sig-mark-area">
              <span class="sig-cursive">Tanvir Hossain</span>
              <span class="sig-stamp-pill">AUDITED &amp; VERIFIED</span>
            </div>
            <div class="sig-name">Tanvir Hossain</div>
            <div class="sig-desig">Head of Accounts, Taxation &amp; Commercial Audit</div>
            <div class="sig-date">Certified: ${compiledTimestamp || new Date().toLocaleString()}</div>
          </div>

          <div class="sig-card">
            <div class="sig-mark-area" style="min-height: 48px; display: flex; align-items: flex-end; justify-content: space-between;">
              <img src="${SYED_AKRAMUL_HASSAN_SIGNATURE_DATA_URI}" onerror="this.src='/images/syed_akramul_hassan_signature.png'" alt="Syed Akramul Hassan Signature" style="height: 42px; max-width: 140px; object-fit: contain; margin-bottom: -6px;" />
              <span class="sig-stamp-pill gold-stamp">BOARD APPROVED</span>
            </div>
            <div class="sig-name">Syed Akramul Hassan</div>
            <div class="sig-desig">Managing Director &amp; Chief Executive Officer</div>
            <div class="sig-date">Approved: ${compiledTimestamp || new Date().toLocaleString()}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</body>
</html>`;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
    printWin.focus();
  };

  // Official Document for Sharing
  const officialReportDoc: OfficialDocument = {
    id: `DOC-REP-${selectedType}-${Date.now()}`,
    docCode: reportRefCode,
    documentNumber: reportRefCode,
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
            1. STICKY MODAL HEADER WITH MODE TABS
            ========================================================= */}
        <div className="px-5 py-3 bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#12231B] border-b border-[#2C5240] flex items-center justify-between shrink-0 no-print">
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

          {/* Segmented Mode Switcher Tabs */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-black/40 border border-[#2C5240]">
              <button
                type="button"
                onClick={() => setViewMode('BUILDER')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewMode === 'BUILDER'
                    ? 'bg-[#1E6B3A] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>1. Scope Builder</span>
              </button>
              <button
                type="button"
                onClick={() => handleViewResult('PREVIEW')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  viewMode === 'PREVIEW'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>2. Document Preview</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================
            2. WORKSPACE CONTENT: BUILDER OR DEDICATED PREVIEW
            ========================================================= */}
        {viewMode === 'BUILDER' ? (
          /* =======================================================
             STAGE 1: SCOPE BUILDER & PARAMETERS CONFIGURATION
             ======================================================= */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* STEP 1: REPORT TEMPLATE SELECTOR TILES */}
          <div className="space-y-2 no-print">
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
                      setReportRefCode(`AMC-REP-${opt.type}-0842`);
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
          <div className="p-3.5 rounded-xl bg-[#0A140F] border border-[#2C5240] space-y-3 no-print">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#C8A96A] font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>2. Statement Scope, Parameters &amp; Currency Conversion</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleViewResult('BUILDER')}
                  disabled={isCompiling}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-mono transition-all cursor-pointer border border-white/10"
                  title="Re-compile with latest database state"
                >
                  <RefreshCw className={`w-3 h-3 text-[#C8A96A] ${isCompiling ? 'animate-spin' : ''}`} />
                  <span>Re-Compile</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleViewResult('PREVIEW')}
                  disabled={isCompiling}
                  className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all cursor-pointer font-['Montserrat'] shadow-xs border border-emerald-400/40"
                  title="Apply scope filters and open statement preview screen"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>{isCompiling ? 'Compiling...' : 'Preview Screen →'}</span>
                </button>
              </div>
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
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedPeriod(val);
                    if (val === 'CUSTOM') {
                      setIsCustomRangeModalOpen(true);
                    }
                  }}
                  className="w-full bg-[#12231B] border border-[#2C5240] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                >
                  <option value="CURRENT_MONTH">Current Month (October 2026)</option>
                  <option value="TODAY">Today / Real-Time Daily Inflows</option>
                  <option value="Q4_2026">Q4 2026 (Oct – Dec 2026)</option>
                  <option value="FY_2026">Fiscal Year 2026 / 2027</option>
                  <option value="CUSTOM">
                    {selectedPeriod === 'CUSTOM' ? `Custom Range (${startDate} → ${endDate})` : 'Custom Range...'}
                  </option>
                </select>

                {/* Quick Edit Pill when Custom Range is active */}
                {selectedPeriod === 'CUSTOM' && (
                  <button
                    type="button"
                    onClick={() => setIsCustomRangeModalOpen(true)}
                    className="mt-1 flex items-center justify-between w-full px-2.5 py-1.5 rounded-md bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 hover:text-white hover:bg-emerald-900/80 transition-all text-[11px] font-mono cursor-pointer shadow-xs group"
                    title="Click to change Custom Date Range in pop-up window"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
                      <span className="truncate">{startDate} → {endDate}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold underline group-hover:text-emerald-200 shrink-0 ml-1">
                      Change ✎
                    </span>
                  </button>
                )}
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

            {/* Scope Summary & Explicit "Apply & View Result" Action Bar */}
            <div className="pt-2 border-t border-[#2C5240]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-[10px] text-gray-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">
                  Selected Scope: <strong className="text-emerald-300">{selectedStation}</strong> • Period: <strong className="text-white">{selectedPeriod === 'CUSTOM' ? `Custom (${startDate} → ${endDate})` : selectedPeriod}</strong> • Currency: <strong className="text-[#C8A96A]">{selectedCurrency} ({currentRate.symbol})</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleViewResult('PREVIEW')}
                  disabled={isCompiling}
                  className="flex items-center gap-2 px-5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer font-['Montserrat'] border border-emerald-400/50"
                  title="Apply scope filters and render statement results"
                >
                  <Eye className="w-4 h-4 text-[#C8A96A]" />
                  <span>{isCompiling ? 'Compiling Live Ledger...' : 'Apply & Preview Statement →'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* CTA CARD: TRANSITION TO PREVIEW SCREEN BEFORE DOWNLOAD/SHARE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#0A140F] border-2 border-[#C8A96A]/60 shadow-xl no-print">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#C8A96A] text-[#12231B] font-mono text-[10px] font-black uppercase">
                    Stage 1 Configured
                  </span>
                  <span className="text-xs text-emerald-300 font-mono font-bold flex items-center gap-1">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Parameters Locked
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold font-heading text-white">
                  Preview Statement Before Download or Share
                </h3>
                <p className="text-xs text-gray-300 font-['Open_Sans'] max-w-xl leading-relaxed">
                  Open the official full-screen Document Preview to review itemized ledgers, EBITDA margins, VAT chalan numbers, and authorized digital seals before exporting or distributing.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleOpenExternalPrintWindow}
                  disabled={isCompiling}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1a382b] hover:bg-[#234b3a] text-emerald-300 hover:text-white font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer font-['Montserrat'] border border-emerald-500/60 hover:scale-[1.02] active:scale-[0.98]"
                  title="Pop out this compiled statement into a dedicated external window with clean A4 print formatting"
                >
                  <ExternalLink className="w-4 h-4 text-[#C8A96A]" />
                  <span>External Window (Print) ↗</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleViewResult('PREVIEW')}
                  disabled={isCompiling}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-[#0A140F] font-black text-xs sm:text-sm shadow-xl transition-all cursor-pointer font-['Montserrat'] border border-emerald-300/80 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Eye className="w-4 h-4 text-[#12231B]" />
                  <span>{isCompiling ? 'Compiling Ledger...' : 'Compile & Preview Statement Screen →'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* =========================================================
            VIEW 2: DEDICATED DOCUMENT PREVIEW SCREEN (BEFORE DOWNLOAD/SHARE)
            ========================================================= */
        <div className="flex-1 flex flex-col overflow-hidden bg-[#070e0a]">
          
          {/* TOP PREVIEW CONTROL TOOLBAR */}
          <div className="px-4 py-3 bg-[#0d1c15] border-b border-[#2C5240] flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('BUILDER')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
                title="Return to Scope & Parameters configuration"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>← Back to Scope Builder</span>
              </button>

              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  {reportRefCode}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  Compiled: {compiledTimestamp}
                </span>
              </div>
            </div>

            {/* Live Currency Switcher in Preview Screen */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-[#2C5240]">
              <span className="text-[10px] text-gray-400 font-mono px-1.5 hidden md:inline">Currency:</span>
              {(['BDT', 'USD', 'GBP', 'EUR', 'AUD'] as const).map((curr) => {
                const isSel = selectedCurrency === curr;
                return (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setSelectedCurrency(curr)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      isSel
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {curr} ({CURRENCY_CONFIG[curr].symbol})
                  </button>
                );
              })}
            </div>

            {/* Quick Action Buttons on Top Bar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenExternalPrintWindow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a382b] hover:bg-[#234b3a] text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/60 transition-all cursor-pointer font-['Montserrat'] shadow-xs"
                title="Pop out this compiled statement into a dedicated external window formatted for standard A4 printing"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span className="hidden sm:inline">External Window (Print)</span>
                <span className="sm:hidden">External ↗</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold border border-teal-500/40 transition-all cursor-pointer font-['Montserrat']"
                title="Download structured CSV spreadsheet"
              >
                <Download className="w-3.5 h-3.5 text-teal-200" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer font-mono"
                title="Share officially signed report for customer or bank verification"
              >
                <Share2 className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span className="hidden sm:inline">Share (Verify / Ack)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer font-['Montserrat'] border border-emerald-400/40"
                title="Print official standard A4 report dossier or save as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Print / Export PDF</span>
              </button>
            </div>
          </div>

          {/* DOCUMENT CANVAS SCROLL AREA */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#070e0a]">
            {/* STEP 3: LIVE PREVIEW OF THE COMPILED REPORT DOSSIER */}
            <div
              ref={resultPreviewRef}
              id="official-printable-canvas"
              className={`printable-content rounded-xl border bg-[#0A140F] p-4 sm:p-5 space-y-4 shadow-xl transition-all duration-300 max-w-4xl mx-auto border-emerald-500/50 ${
                isFlashActive
                  ? 'border-emerald-400 ring-2 ring-emerald-400/60 shadow-emerald-900/30'
                  : 'border-emerald-500/50'
              }`}
            >
            {/* Live Success Banner when View Result is clicked */}
            {showResultFeedback && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Statement results compiled and validated with real-time audit ledger!</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">{compiledTimestamp}</span>
              </div>
            )}
            
            {/* Dossier Letterhead Banner */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-[#2C5240] pb-3.5 gap-3">
              <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white p-1 border border-[#C8A96A]/60 shadow-md">
                  <Image
                    src={ARIELMC_EMBLEM_PATH}
                    alt="ArielMC Official Emblem"
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
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
              </div>

              <div className="text-right font-mono text-[10px] text-gray-400 space-y-0.5">
                <div>Report Ref: <strong className="text-white">{reportRefCode}</strong></div>
                <div>Compiled: <span className="text-emerald-400">{compiledTimestamp}</span></div>
                <div>Station Scope: <span className="text-[#C8A96A] font-bold">{selectedStation}</span> • Currency: <span className="text-emerald-300 font-bold">{selectedCurrency}</span></div>
                <div>Period: <span className="text-white font-bold">{selectedPeriod === 'CUSTOM' ? `Custom (${startDate} → ${endDate})` : (selectedPeriod === 'CURRENT_MONTH' ? 'October 2026' : selectedPeriod === 'TODAY' ? 'Today' : selectedPeriod === 'Q4_2026' ? 'Q4 2026' : 'FY 2026/27')}</span></div>
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
                      <th className="py-2 px-3 text-right">Debit / Credit ({selectedCurrency})</th>
                      <th className="py-2 px-3 text-center">Memo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {filteredVouchers.slice(0, 8).map((v) => {
                      const convertedAmt = Math.round((v.totalAmountBdt / 121.5) * currentRate.rate);
                      return (
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
                            {v.type === 'CASH_RECEIVE' ? '+' : '-'}{currentRate.symbol} {convertedAmt.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {v.physicalAttachment ? (
                              <span className="text-[9px] text-emerald-400 font-bold">✓ Attached</span>
                            ) : (
                              <span className="text-[9px] text-gray-500">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
                      <th className="py-2 px-3 text-right">Revenue ({selectedCurrency})</th>
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
                        <td className="py-2 px-3 text-right font-bold text-emerald-400">{formatCurr(r.contractRevenueUsd)}</td>
                        <td className="py-2 px-3 text-right text-rose-300">{formatCurr(r.factoryCogsUsd)}</td>
                        <td className="py-2 px-3 text-right text-gray-300">{formatCurr(r.inlandFreightPortCfsUsd)}</td>
                        <td className="py-2 px-3 text-right font-bold text-[#C8A96A]">{formatCurr(r.orderNetProfitUsd)}</td>
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
                      <th className="py-2 px-3 text-right">Gross GMV ({selectedCurrency})</th>
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
                        <td className="py-2 px-3 text-right font-bold text-emerald-400">{formatCurr(l.grossSalesUsd)}</td>
                        <td className="py-2 px-3 text-right text-rose-300">{formatCurr(l.factoryFobCogsUsd)}</td>
                        <td className="py-2 px-3 text-right font-bold text-[#C8A96A]">{formatCurr(l.lotNetProfitUsd)}</td>
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
                      <th className="py-2 px-3 text-right">Outstanding Debt ({selectedCurrency})</th>
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
                        <td className="py-2 px-3 text-right text-amber-300">{formatCurr(p.debitTurnover)}</td>
                        <td className="py-2 px-3 text-right text-emerald-400">{formatCurr(p.creditTurnover)}</td>
                        <td className="py-2 px-3 text-right font-bold text-rose-400">{formatCurr(p.balanceUsd)}</td>
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
                      <th className="py-2 px-3 text-right">Value ({selectedCurrency})</th>
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

              {/* 12-Month Consolidated Financial Matrix Table */}
              {selectedType === 'ANNUAL_FINANCIAL_MATRIX' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Financial Line Item &amp; Performance Ledger</th>
                      <th className="py-2.5 px-3 text-right">Q1 (Jan–Mar)</th>
                      <th className="py-2.5 px-3 text-right">Q2 (Apr–Jun)</th>
                      <th className="py-2.5 px-3 text-right">Q3 (Jul–Sep)</th>
                      <th className="py-2.5 px-3 text-right">Q4 (Oct–Dec)</th>
                      <th className="py-2.5 px-3 text-right">FY 2026 Total</th>
                      <th className="py-2.5 px-3 text-center">% of Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {annualFinancialRows.map((r, idx) => {
                      const isHighlighted = r.highlight !== 'none';
                      return (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            r.isHeader
                              ? 'bg-white/5 font-bold hover:bg-white/10'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <td className={`py-2 px-3 ${
                            r.highlight === 'emerald' ? 'text-emerald-300 font-bold' :
                            r.highlight === 'gold' ? 'text-[#C8A96A] font-bold' :
                            r.highlight === 'rose' ? 'text-rose-300 font-bold' :
                            r.highlight === 'cyan' ? 'text-cyan-300 font-bold' :
                            'text-gray-300'
                          }`}>
                            {r.item}
                          </td>
                          <td className="py-2 px-3 text-right text-gray-300">{formatCurr(r.q1)}</td>
                          <td className="py-2 px-3 text-right text-gray-300">{formatCurr(r.q2)}</td>
                          <td className="py-2 px-3 text-right text-gray-300">{formatCurr(r.q3)}</td>
                          <td className="py-2 px-3 text-right text-gray-300">{formatCurr(r.q4)}</td>
                          <td className={`py-2 px-3 text-right font-bold ${
                            r.highlight === 'emerald' ? 'text-emerald-400 text-xs' :
                            r.highlight === 'gold' ? 'text-[#C8A96A] text-xs' :
                            r.highlight === 'rose' ? 'text-rose-400 text-xs' :
                            r.highlight === 'cyan' ? 'text-cyan-400 text-xs' :
                            'text-white'
                          }`}>
                            {formatCurr(r.total)}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              r.highlight === 'emerald' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              r.highlight === 'gold' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                              r.highlight === 'rose' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                              'bg-white/5 text-gray-400'
                            }`}>
                              {r.pct}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* Operations & Sampling Milestone Table */}
              {selectedType === 'TASKS_OPERATIONS' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">SDO Ref</th>
                      <th className="py-2.5 px-3">Sampling / Production Task</th>
                      <th className="py-2.5 px-3">Partner Factory Hub</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Target Date</th>
                      <th className="py-2.5 px-3">AQL Inspection Status</th>
                      <th className="py-2.5 px-3 text-center">Lead Time</th>
                      <th className="py-2.5 px-3">Merchant Sign-off</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {sampleOperationsTasks.map((t) => (
                      <tr key={t.code} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{t.code}</td>
                        <td className="py-2 px-3 text-gray-200 font-semibold">{t.task}</td>
                        <td className="py-2 px-3 text-cyan-300">{t.factory}</td>
                        <td className="py-2 px-3 text-gray-400">{t.dept}</td>
                        <td className="py-2 px-3 text-gray-300">{t.dueDate}</td>
                        <td className="py-2 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">
                            {t.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center text-[#C8A96A] font-bold">{t.leadDays}</td>
                        <td className="py-2 px-3 text-gray-300">{t.merchant}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* CRM Pipeline Table */}
              {selectedType === 'CRM_PIPELINE' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Account Code</th>
                      <th className="py-2.5 px-3">Wholesale Retail Buyer</th>
                      <th className="py-2.5 px-3">Market Region</th>
                      <th className="py-2.5 px-3">Buying Director / Contact</th>
                      <th className="py-2.5 px-3">Pipeline Stage</th>
                      <th className="py-2.5 px-3 text-right">Contract GMV ({selectedCurrency})</th>
                      <th className="py-2.5 px-3 text-center">Win %</th>
                      <th className="py-2.5 px-3 text-right">Close Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {sampleCrmLeads.map((c) => (
                      <tr key={c.code} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{c.code}</td>
                        <td className="py-2 px-3 text-gray-200 font-semibold">{c.account}</td>
                        <td className="py-2 px-3 text-cyan-300">{c.market}</td>
                        <td className="py-2 px-3 text-gray-400">{c.contact}</td>
                        <td className="py-2 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            c.stage === 'Contract Signed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            c.stage === 'Sampling Review' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                            'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {c.stage}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-400">{formatCurr(c.dealUsd)}</td>
                        <td className="py-2 px-3 text-center text-[#C8A96A] font-bold">{c.winPct}</td>
                        <td className="py-2 px-3 text-right text-gray-400">{c.closeDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Official Signature Box */}
            <div className="pt-3 border-t border-[#2C5240] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Digitally Sealed: ArielMC Finance Directorate • Hash #9038-AF-2026</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">Verified:</span>
                  <span className="text-white font-semibold">Tanvir Hossain (Accounts Lead)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2 bg-[#12231B] px-2.5 py-1 rounded-lg border border-[#2C5240]">
                  <span className="text-gray-400">Approved:</span>
                  <div className="h-6 w-24 bg-white/95 rounded px-1 flex items-center justify-center border border-[#C8A96A]/60 shrink-0">
                    <Image
                      src={SYED_AKRAMUL_HASSAN_SIGNATURE_PATH}
                      alt="Syed Akramul Hassan Signature"
                      width={86}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[#C8A96A] font-bold">Syed Akramul Hassan (MD)</span>
                </div>
              </div>
            </div>

            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          3. STICKY MODAL FOOTER (ADAPTED TO CURRENT VIEW MODE)
          ========================================================= */}
      {viewMode === 'BUILDER' ? (
        <div className="px-5 py-3.5 bg-[#0A140F] border-t border-[#2C5240] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 no-print">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <SlidersHorizontal className="w-4 h-4 text-[#C8A96A] shrink-0" />
            <span>
              Scope Configured: <strong className="text-white">{currentMeta.title}</strong>
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

            {/* External Window Print Version Button */}
            <button
              type="button"
              onClick={handleOpenExternalPrintWindow}
              disabled={isCompiling}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a382b] hover:bg-[#234b3a] text-emerald-300 hover:text-white text-xs font-bold transition-all cursor-pointer font-['Montserrat'] border border-emerald-500/50"
              title="Open document preview in an external window as print version"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>External Window (Print) ↗</span>
            </button>

            {/* Generate & Preview Statement Button */}
            <button
              type="button"
              onClick={() => handleViewResult('PREVIEW')}
              disabled={isCompiling}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer font-['Montserrat'] border border-emerald-400/40"
              title="Compile statement and open document preview screen before download or share"
            >
              <Eye className="w-4 h-4 text-[#C8A96A]" />
              <span>{isCompiling ? 'Compiling Live Ledger...' : 'Generate & Preview Statement Screen →'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="px-5 py-3.5 bg-[#0A140F] border-t border-[#2C5240] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('BUILDER')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-mono transition-all cursor-pointer border border-white/10"
              title="Return to Scope Builder to change templates or filters"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>← Edit Scope</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#C8A96A] shrink-0" />
              <span className="hidden sm:inline">
                Preview Verified: <strong className="text-white">{currentMeta.title}</strong>
              </span>
              <span className="sm:hidden font-bold text-white">Preview Verified</span>
            </div>
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

            {/* External Window Print Version */}
            <button
              type="button"
              onClick={handleOpenExternalPrintWindow}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1a382b] hover:bg-[#234b3a] text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/50 transition-all cursor-pointer font-['Montserrat'] shadow-md"
              title="Open document preview in an external window as print version"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="hidden sm:inline">External Window (Print) ↗</span>
              <span className="sm:hidden">External ↗</span>
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
      )}

      </div>

      {/* Custom Date Range Pop-up Window */}
      <CustomDateRangeModal
        isOpen={isCustomRangeModalOpen}
        onClose={() => setIsCustomRangeModalOpen(false)}
        startDate={startDate}
        endDate={endDate}
        totalAvailableRecords={vouchers.length + samplePayables.length + sampleInvoices.length}
        onApply={(start, end) => {
          setStartDate(start);
          setEndDate(end);
          setSelectedPeriod('CUSTOM');
          setIsCompiled(true);
        }}
      />

      {/* Share Document Modal */}
      <ShareDocumentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        document={officialReportDoc}
      />
    </div>
  );
};
