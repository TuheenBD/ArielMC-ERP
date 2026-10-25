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

import { ThemeProfile } from '@/components/Sidebar';
import { INITIAL_UTILITY_TASKS } from '@/data/initialUtilitiesData';
import { UtilityTask } from '@/types/utilities';
import crmLeadsRaw from '@/data/crmLeads.json';
import { INITIAL_ORDERS } from '@/data/initialOrders';
import { INITIAL_SAMPLES } from '@/data/initialSamples';
import { INITIAL_CHEMICAL_TESTS } from '@/data/initialChemicalTests';

export type ReportType =
  // 1. Tasks & Operations (from the 7 Task Cards)
  | 'TASK_SUMMARY'
  | 'TASKS_IN_PROGRESS'
  | 'TASKS_BY_ASSIGNEE'
  | 'ALL_TASKS'
  | 'SPENT_TIME_WEEKLY'
  | 'ESTIMATED_SPENT_ALL'
  | 'SDO_SAMPLING_VARIANCE'
  // 2. CRM & Sales (from the 2 CRM Cards)
  | 'CRM_ACCOUNTS_REPORT'
  | 'CRM_OPPORTUNITIES_FUNNEL'
  // 3. Projects & Commitments (from the 5 Project Cards)
  | 'PAYMENTS_DISBURSEMENTS'
  | 'UPCOMING_EXPENSES_COMMITMENTS'
  | 'UPCOMING_INCOME_MILESTONES'
  | 'PROJECT_CASH_FLOW_ALLOCATION'
  | 'PAID_TASKS_CERTIFICATES'
  // 4. Core Financial & Statutory Statements
  | 'CASHFLOW_DAILY'
  | 'B2B_ORDER_PNL'
  | 'B2C_LOT_PNL'
  | 'ACCOUNTS_PAYABLE'
  | 'COMMERCIAL_INVOICES'
  | 'ANNUAL_FINANCIAL_MATRIX'
  // Aliases for backward compatibility
  | 'TASKS_OPERATIONS'
  | 'CRM_PIPELINE';

export interface ReportGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReportType?: ReportType;
  initialViewMode?: 'BUILDER' | 'PREVIEW';
  activeEntity?: CompanyEntity;
  theme?: ThemeProfile;
}

export interface ReportOptionMeta {
  type: ReportType;
  title: string;
  category: 'FINANCE' | 'SALES' | 'OPERATIONS' | 'PROJECTS';
  description: string;
  badge: string;
}

export const REPORT_OPTIONS: ReportOptionMeta[] = [
  // --- OPERATIONS / TASKS ---
  {
    type: 'TASK_SUMMARY',
    title: 'Task Summary & Milestone Execution Report',
    category: 'OPERATIONS',
    description: 'Status breakdown, priority allocations, milestone stages, and checklist completion tracking across sourcing lines.',
    badge: 'Status & Milestones',
  },
  {
    type: 'TASKS_IN_PROGRESS',
    title: 'Tasks In Progress & Active Factory Lines',
    category: 'OPERATIONS',
    description: 'Real-time operational status across all 14 active production lines, in-flight sampling batches, and ongoing workflows.',
    badge: '14 Lines Active',
  },
  {
    type: 'TASKS_BY_ASSIGNEE',
    title: 'Tasks by Assignee & Merchant Workload Allocation',
    category: 'OPERATIONS',
    description: 'Workload distribution across senior merchants, quality inspection leads, and finance compliance controllers.',
    badge: 'Merchant Allocation',
  },
  {
    type: 'ALL_TASKS',
    title: 'All Enterprise Tasks & Operations Master Log',
    category: 'OPERATIONS',
    description: 'Centralized master audit log spanning factory sampling, chemical safety testing, customs clearance, and banking.',
    badge: 'Master Registry',
  },
  {
    type: 'SPENT_TIME_WEEKLY',
    title: 'Weekly Spent Time & Personnel Labor Audit',
    category: 'OPERATIONS',
    description: 'Timesheet tracking logs, merchant billable hourly rates, total operational labor cost, and supervisory approvals.',
    badge: '182.5 hrs Logged',
  },
  {
    type: 'ESTIMATED_SPENT_ALL',
    title: 'Estimated vs Spent Time Variance Analysis (All Tasks)',
    category: 'OPERATIONS',
    description: 'Budgeted time allocations versus actual tracked hours, milestone schedule variance, and team efficiency indices.',
    badge: 'Planned vs Actual',
  },
  {
    type: 'SDO_SAMPLING_VARIANCE',
    title: 'Sample Development Orders (SDO) Variance & Lead Time',
    category: 'OPERATIONS',
    description: 'Prototype turnaround tracking, factory bench lead days, DHL air courier transit, and target vs actual delivery dates.',
    badge: 'SDO Sampling Variance',
  },
  {
    type: 'PAID_TASKS_CERTIFICATES',
    title: 'Paid Tasks, AQL Inspections & Laboratory Certificates',
    category: 'PROJECTS',
    description: 'Certified chemical safety reports (REACH, ISO 17075, ISO 105, ISO 6486), factory AQL inspections, and fee disbursements.',
    badge: 'AQL & Lab Certificates',
  },

  // --- CRM & SALES ---
  {
    type: 'CRM_ACCOUNTS_REPORT',
    title: 'Global CRM Accounts & Qualified Buyer Directory',
    category: 'SALES',
    description: '254 qualified wholesale buyers, department stores, garden centres, retail chains, and boutique stockists across UK/US/EU/AU.',
    badge: '254 Qualified Accounts',
  },
  {
    type: 'CRM_OPPORTUNITIES_FUNNEL',
    title: 'Global Wholesale Pipeline & Opportunities Funnel',
    category: 'SALES',
    description: 'Active commercial contract negotiations, probability-weighted GMV pipeline ($1.84M), win rates, and expected close dates.',
    badge: 'US/UK/EU Funnel',
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

  // --- PROJECTS & DISBURSEMENTS ---
  {
    type: 'PAYMENTS_DISBURSEMENTS',
    title: 'Disbursements & Sourcing Payments Ledger',
    category: 'PROJECTS',
    description: 'Audited debit transactions, factory PO advances, raw material supplier payments, and clearing & forwarding disbursements.',
    badge: 'Disbursements Ledger',
  },
  {
    type: 'UPCOMING_EXPENSES_COMMITMENTS',
    title: 'Upcoming Expenses & 30-Day Factory Commitments',
    category: 'PROJECTS',
    description: 'Scheduled factory PO balances, back-to-back LC liabilities, and freight forwarder commitments maturing in the next 30 days.',
    badge: '30-Day Commitments',
  },
  {
    type: 'UPCOMING_INCOME_MILESTONES',
    title: 'Upcoming Income & Milestone LC Installments',
    category: 'PROJECTS',
    description: 'Projected buyer payment inflows, confirmed Master LCs at sight, 30-day post-shipment collections, and export remittances.',
    badge: 'Milestone LC Inflows',
  },
  {
    type: 'PROJECT_CASH_FLOW_ALLOCATION',
    title: 'Project & Batch Cash Flow Allocation Statement',
    category: 'PROJECTS',
    description: 'Granular batch-level net cash contribution, comparing buyer contract revenues against factory COGS, ocean freight, and compliance.',
    badge: 'Per-Batch Allocation',
  },
  {
    type: 'CASHFLOW_DAILY',
    title: 'Daily Cashflow & Voucher Ledger Statement',
    category: 'FINANCE',
    description: 'Income inflows vs expense disbursements, running cash balance, and physical cash memo audit rate.',
    badge: 'Station Banks Real-Time',
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
  theme = 'crm-green',
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
  const [templateTab, setTemplateTab] = useState<'ALL' | 'OPERATIONS' | 'SALES' | 'PROJECTS' | 'FINANCE'>('ALL');

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
        const found = REPORT_OPTIONS.find((o) => o.type === initialReportType);
        if (found) {
          setTemplateTab(found.category);
        }
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

  // 1. Task Datasets
  const tasksMaster = useMemo(() => {
    let baseTasks: UtilityTask[] = INITIAL_UTILITY_TASKS;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('arielmc_utility_tasks_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) baseTasks = parsed;
        }
      } catch {}
    }
    // Augmented enterprise operations tasks to represent all 5 sectors (Leather, Jute, Textiles, Ceramics, Pottery)
    const augmentedTasks = [
      ...baseTasks,
      {
        id: 'TSK-OPS-007',
        title: 'Prototype Firing & Glaze Lead Leach Test for Cobalt Ceramic Dinnerware',
        description: 'ISO 6486 acid leaching and kiln temperature curve evaluation for Mirpur studio.',
        stage: 'IN_PROGRESS' as const,
        priority: 'HIGH' as const,
        dueDate: '2026-10-28',
        dueTime: '15:00',
        owner: 'Syed Akramul Hassan',
        assignee: 'Dr. Shahinur Rahman (Ceramics Lead)',
        tags: ['Ceramics', 'Glaze Test', 'Mirpur Kiln', 'ISO 6486'],
        checklist: [
          { id: 'c-01', text: 'Stoneware clay body mixing', completed: true },
          { id: 'c-02', text: 'Cobalt oxide formulation check', completed: true },
          { id: 'c-03', text: '1240°C Cone 6 kiln firing', completed: true },
          { id: 'c-04', text: '24h acetic acid test report release', completed: false },
        ],
        estimatedHours: 8,
        trackedSeconds: 21600,
        isTimerRunning: true,
        hourlyRate: 65,
        createdAt: '2026-10-18',
      },
      {
        id: 'TSK-OPS-008',
        title: 'Dhamrai Artisan Terracotta Water-Sealing & Beeswax Slip Application',
        description: 'Food-safe organic slip coating for traditional terracotta fluted vase set.',
        stage: 'IN_PROGRESS' as const,
        priority: 'MEDIUM' as const,
        dueDate: '2026-10-29',
        dueTime: '17:30',
        owner: 'Syed Akramul Hassan',
        assignee: 'Rafiqul Islam (Pottery Specialist)',
        tags: ['Pottery', 'Terracotta', 'Dhamrai', 'Beeswax Seal'],
        checklist: [
          { id: 'p-01', text: 'Alluvial clay wheel throwing and trimming', completed: true },
          { id: 'p-02', text: 'Wood-fired kiln cycle cooling', completed: true },
          { id: 'p-03', text: 'Beeswax bio-barrier buffing', completed: false },
        ],
        estimatedHours: 7,
        trackedSeconds: 18000,
        isTimerRunning: false,
        hourlyRate: 50,
        createdAt: '2026-10-18',
      },
      {
        id: 'TSK-OPS-009',
        title: 'Chittagong Port Off-Dock ICD Container Stuffing & Customs Seal',
        description: 'Consignment stuffing for Harrods & Nordstrom UK/US ocean vessels.',
        stage: 'REVIEW' as const,
        priority: 'CRITICAL' as const,
        dueDate: '2026-11-02',
        dueTime: '11:00',
        owner: 'Directorate of Logistics',
        assignee: 'Kamal Uddin (Logistics Lead)',
        tags: ['Logistics', 'Chittagong Port', 'FCL Container', 'Customs'],
        checklist: [
          { id: 'l-01', text: 'Container cleanliness inspection & silica gel placement', completed: true },
          { id: 'l-02', text: 'Pallet shrink-wrap load scan', completed: true },
          { id: 'l-03', text: 'Customs high-security bolt seal attachment', completed: false },
        ],
        estimatedHours: 6,
        trackedSeconds: 14400,
        isTimerRunning: false,
        hourlyRate: 55,
        createdAt: '2026-10-17',
      },
      {
        id: 'TSK-OPS-010',
        title: 'Jute Weft Tensile & Moisture Testing for Harrods Grocery Shoppers',
        description: 'Bureau Veritas certified moisture barrier verification for marine transit.',
        stage: 'COMPLETED' as const,
        priority: 'HIGH' as const,
        dueDate: '2026-10-16',
        dueTime: '16:00',
        owner: 'Managing Director',
        assignee: 'Engr. Tanvir Ahmed (Bio-Fiber Research)',
        tags: ['Jute', 'Tensile Test', 'Moisture', 'ISO 287'],
        checklist: [
          { id: 'j-01', text: 'Tensile test across 20 swatches (warp & weft)', completed: true },
          { id: 'j-02', text: 'Moisture level recorded at 9.4% (target < 12%)', completed: true },
          { id: 'j-03', text: 'Sign off digital BV certificate', completed: true },
        ],
        estimatedHours: 5,
        trackedSeconds: 18000,
        isTimerRunning: false,
        hourlyRate: 70,
        createdAt: '2026-10-15',
      },
    ];
    return augmentedTasks.map((t) => ({
      ...t,
      category: (t as any).category || (t.tags && t.tags[0]) || 'Operations',
      status: (t as any).status || t.stage,
    }));
  }, []);

  // 1b. Sample Operations Tasks Dataset (for TASK_SUMMARY / TASKS_OPERATIONS)
  const sampleOperationsTasks = useMemo(() => [
    { code: 'TSK-OPS-001', task: 'Artisan Full-Grain Leather Weekender Bag Sampling & Cutting', factory: 'Apex Footwear Ltd', dept: 'Leathercraft', dueDate: '2026-10-25', status: 'IN_PROGRESS', leadDays: '14 Days', merchant: 'Tariqul Islam' },
    { code: 'TSK-OPS-002', task: 'Natural Jute Grocery Market Tote Batch Weaving & Stitching', factory: 'Bengal Natural Jute Mills Ltd', dept: 'Jute Fiber', dueDate: '2026-10-28', status: 'IN_PROGRESS', leadDays: '12 Days', merchant: 'Rafiq Ahmed' },
    { code: 'TSK-OPS-003', task: 'Handloom Indigo Dyed Textile Yardage Spin & Color Fastness', factory: 'Sonargaon Artisan Handloom', dept: 'Heritage Textiles', dueDate: '2026-11-04', status: 'IN_PROGRESS', leadDays: '18 Days', merchant: 'Molly Clarkson' },
    { code: 'TSK-OPS-004', task: 'Hand-thrown Terracotta Planters & Vases Kiln Low-Firing', factory: 'Dhamrai Heritage Pottery Cluster', dept: 'Pottery Cluster', dueDate: '2026-11-08', status: 'IN_PROGRESS', leadDays: '21 Days', merchant: 'Rafiqul Islam' },
    { code: 'TSK-OPS-005', task: 'Cobalt Glaze Ceramic Dinnerware Leaching Protocol REACH', factory: 'Artisan Ceramic Studio Mirpur', dept: 'Artisan Ceramics', dueDate: '2026-11-12', status: 'IN_PROGRESS', leadDays: '16 Days', merchant: 'Dr. Shahinur Rahman' },
    { code: 'TSK-OPS-006', task: 'ISO 2859-1 (AQL 2.5) Pre-Shipment Inspection Harrods Order', factory: 'Savar Tannery Estate', dept: 'Quality Assurance', dueDate: '2026-10-24', status: 'SCHEDULED', leadDays: '8 Days', merchant: 'Tariqul Islam' },
    { code: 'TSK-OPS-007', task: 'Chittagong Port Off-Dock ICD FCL Container Stuffing & Seal', factory: 'Chittagong CFS Dock', dept: 'Export Logistics', dueDate: '2026-11-02', status: 'SCHEDULED', leadDays: '15 Days', merchant: 'Kamal Uddin' },
    { code: 'TSK-OPS-008', task: 'Bureau Veritas Bio-Barrier Tensile & Moisture Verification', factory: 'SGS / BV Accredited Lab', dept: 'Compliance & Safety', dueDate: '2026-10-22', status: 'PASSED_AQL', leadDays: '6 Days', merchant: 'Benjamin Noel' },
  ], []);

  // 2. Active Lines (14 Lines Active matching card subtitle)
  const inProgressLines = useMemo(() => [
    { code: 'LINE-01', name: 'Apex Leathercraft Unit 2 - Line #4 Sewing', facility: 'Apex Footwear Ltd', factory: 'Apex Footwear Ltd', sector: 'LEATHER', merchant: 'Tariqul Islam', lead: 'Tariqul Islam', elapsedHours: 32.5, estHours: 48, priority: 'CRITICAL', progressPct: 68, targetDate: '2026-10-25', status: '65% Stitching Done' },
    { code: 'LINE-02', name: 'Bengal Natural Jute - Weaving Shed #2', facility: 'Bengal Natural Jute Mills Ltd', factory: 'Bengal Natural Jute Mills Ltd', sector: 'JUTE', merchant: 'Rafiq Ahmed', lead: 'Rafiq Ahmed', elapsedHours: 24.0, estHours: 40, priority: 'HIGH', progressPct: 60, targetDate: '2026-10-28', status: 'Warp Yarn Fed' },
    { code: 'LINE-03', name: 'Sonargaon Handloom Cluster - Loom Line #1', facility: 'Sonargaon Artisan Handloom', factory: 'Sonargaon Artisan Handloom', sector: 'TEXTILES', merchant: 'Molly Clarkson', lead: 'Molly Clarkson', elapsedHours: 18.5, estHours: 30, priority: 'HIGH', progressPct: 62, targetDate: '2026-11-04', status: 'Natural Indigo Dip' },
    { code: 'LINE-04', name: 'Dhamrai Pottery Studio - Kiln #3 Firing', facility: 'Dhamrai Heritage Pottery Cluster', factory: 'Dhamrai Heritage Pottery Cluster', sector: 'POTTERY', merchant: 'Rafiqul Islam', lead: 'Rafiqul Islam', elapsedHours: 14.0, estHours: 20, priority: 'MEDIUM', progressPct: 70, targetDate: '2026-11-08', status: 'Low-Fire Terracotta' },
    { code: 'LINE-05', name: 'Mirpur Artisan Ceramics - Glaze Studio Line #1', facility: 'Artisan Ceramic Studio Mirpur', factory: 'Artisan Ceramic Studio Mirpur', sector: 'CERAMICS', merchant: 'Dr. Shahinur Rahman', lead: 'Dr. Shahinur Rahman', elapsedHours: 12.0, estHours: 16, priority: 'HIGH', progressPct: 75, targetDate: '2026-11-12', status: 'Cobalt Glaze Dip' },
    { code: 'LINE-06', name: 'Savar Eco Tannery - Drum Milling Unit #6', facility: 'Savar Tannery Estate', factory: 'Savar Tannery Estate', sector: 'LEATHER', merchant: 'Tariqul Islam', lead: 'Tariqul Islam', elapsedHours: 16.5, estHours: 24, priority: 'HIGH', progressPct: 69, targetDate: '2026-10-26', status: 'Vegetable Tanning' },
    { code: 'LINE-07', name: 'Bengal Denim Mills - Flatlock Stitch Line #3', facility: 'Bengal Denim Mills Narayanganj', factory: 'Bengal Denim Mills Narayanganj', sector: 'TEXTILES', merchant: 'Molly Clarkson', lead: 'Molly Clarkson', elapsedHours: 22.0, estHours: 36, priority: 'MEDIUM', progressPct: 61, targetDate: '2026-11-02', status: 'Pocket Assembly' },
    { code: 'LINE-08', name: 'Chittagong Off-Dock ICD - Consolidation Bay #2', facility: 'Chittagong CFS Dock', factory: 'Chittagong CFS Dock', sector: 'LOGISTICS', merchant: 'Kamal Uddin', lead: 'Kamal Uddin', elapsedHours: 8.5, estHours: 12, priority: 'CRITICAL', progressPct: 71, targetDate: '2026-11-02', status: 'Customs Bolt Seal' },
    { code: 'LINE-09', name: 'Social Media Awareness Campaign Launch', facility: 'Corporate Media Desk', factory: 'Corporate Media Desk', sector: 'MARKETING', merchant: 'Benjamin Noel', lead: 'Benjamin Noel', elapsedHours: 4.0, estHours: 12, priority: 'HIGH', progressPct: 33, targetDate: '2026-10-24', status: 'Ad Ceilings Configured' },
    { code: 'LINE-10', name: 'Competitor Margin Benchmarking Audit', facility: 'Commercial Strategy Desk', factory: 'Commercial Strategy Desk', sector: 'STRATEGY', merchant: 'Molly Clarkson', lead: 'Molly Clarkson', elapsedHours: 3.0, estHours: 5, priority: 'HIGH', progressPct: 60, targetDate: '2026-10-20', status: 'Timer Running (3h/5h)' },
    { code: 'LINE-11', name: 'Pre-Shipment ISO 2859-1 (AQL 2.5) Audit', facility: 'Savar Unit Leather Lab', factory: 'Savar Unit Leather Lab', sector: 'LEATHER', merchant: 'Tariqul Islam', lead: 'Tariqul Islam', elapsedHours: 6.0, estHours: 8, priority: 'CRITICAL', progressPct: 75, targetDate: '2026-10-24', status: '315 Sample Bag Inspection' },
    { code: 'LINE-12', name: 'Wise Business UK GBP Reconciliations', facility: 'Station Finance Desk', factory: 'Station Finance Desk', sector: 'FINANCE', merchant: 'Sarah Jenkins', lead: 'Sarah Jenkins', elapsedHours: 4.0, estHours: 4, priority: 'HIGH', progressPct: 100, targetDate: '2026-10-18', status: 'EXP Exemption Pending' },
    { code: 'LINE-13', name: 'Terracotta Planters Beeswax Waterproofing', facility: 'Dhamrai Studio Finishing', factory: 'Dhamrai Studio Finishing', sector: 'POTTERY', merchant: 'Rafiqul Islam', lead: 'Rafiqul Islam', elapsedHours: 5.0, estHours: 7, priority: 'MEDIUM', progressPct: 71, targetDate: '2026-11-06', status: 'Slip Buffing in Progress' },
    { code: 'LINE-14', name: 'Cobalt Glaze Dinnerware REACH Test Protocol', facility: 'SGS Bangladesh Lab', factory: 'SGS Bangladesh Lab', sector: 'CERAMICS', merchant: 'Dr. Shahinur Rahman', lead: 'Dr. Shahinur Rahman', elapsedHours: 6.0, estHours: 8, priority: 'HIGH', progressPct: 75, targetDate: '2026-11-10', status: 'Acid Leaching Batch' },
  ], []);

  // 3. Assignee Workload Allocation Dataset
  const assigneeWorkload = useMemo(() => [
    { name: 'Syed Akramul Hassan', role: 'Managing Director & Lead', totalTasks: 4, inProgress: 2, completed: 2, activeTasks: 2, completedTasks: 2, estHours: 34, trackedHours: 28.5, loggedHours: 28.5, capacityPct: 83.8, efficiencyPct: 83.8, slaRating: '98.5%' },
    { name: 'Molly Clarkson', role: 'Head of Sourcing & Merchandising', totalTasks: 3, inProgress: 2, completed: 1, activeTasks: 2, completedTasks: 1, estHours: 32, trackedHours: 27.0, loggedHours: 27.0, capacityPct: 84.4, efficiencyPct: 84.4, slaRating: '97.2%' },
    { name: 'Tariqul Islam', role: 'Quality & AQL Inspection Lead', totalTasks: 4, inProgress: 3, completed: 1, activeTasks: 3, completedTasks: 1, estHours: 36, trackedHours: 32.5, loggedHours: 32.5, capacityPct: 90.3, efficiencyPct: 90.3, slaRating: '99.0%' },
    { name: 'Benjamin Noel', role: 'Senior Merchant (Leather & Jute)', totalTasks: 3, inProgress: 2, completed: 1, activeTasks: 2, completedTasks: 1, estHours: 28, trackedHours: 24.5, loggedHours: 24.5, capacityPct: 87.5, efficiencyPct: 87.5, slaRating: '96.5%' },
    { name: 'Sarah Jenkins', role: 'Finance Controller & Banking', totalTasks: 3, inProgress: 2, completed: 1, activeTasks: 2, completedTasks: 1, estHours: 24, trackedHours: 22.0, loggedHours: 22.0, capacityPct: 91.7, efficiencyPct: 91.7, slaRating: '100%' },
    { name: 'Dr. Shahinur Rahman', role: 'Materials & Ceramics Lead', totalTasks: 2, inProgress: 2, completed: 0, activeTasks: 2, completedTasks: 0, estHours: 20, trackedHours: 18.0, loggedHours: 18.0, capacityPct: 90.0, efficiencyPct: 90.0, slaRating: '97.0%' },
    { name: 'Rafiqul Islam', role: 'Artisan Pottery Coordinator', totalTasks: 2, inProgress: 1, completed: 1, activeTasks: 1, completedTasks: 1, estHours: 18, trackedHours: 15.0, loggedHours: 15.0, capacityPct: 83.3, efficiencyPct: 83.3, slaRating: '95.8%' },
    { name: 'Kazi Mahfuz', role: 'Security & Systems Admin', totalTasks: 1, inProgress: 0, completed: 1, activeTasks: 0, completedTasks: 1, estHours: 3, trackedHours: 3.0, loggedHours: 3.0, capacityPct: 100.0, efficiencyPct: 100.0, slaRating: '100%' },
  ], []);

  // 4. Weekly Spent Time Log Dataset (Sum = 182.5 hrs logged exactly)
  const weeklyTimeLogs = useMemo(() => [
    { id: 'LOG-WK-01', user: 'Tariqul Islam', sdoRef: 'SDO-2026-001', sector: 'LEATHER', description: 'SS27 Full-Grain Leather Weekender Sampling & Cutting', billable: true, task: 'SS27 Full-Grain Leather Weekender Sampling & Cutting', merchant: 'Tariqul Islam', date: '2026-10-14', hours: 32.5, rateUsd: 40, totalUsd: 1300, dept: 'Operations & QC', status: 'APPROVED' },
    { id: 'LOG-WK-02', user: 'Dr. Shahinur Rahman', sdoRef: 'SDO-2026-005', sector: 'CERAMICS', description: 'Artisan Terracotta Planter & Ceramic Dinnerware Kiln Firing', billable: true, task: 'Artisan Terracotta Planter & Ceramic Dinnerware Kiln Firing', merchant: 'Dr. Shahinur Rahman', date: '2026-10-15', hours: 28.5, rateUsd: 65, totalUsd: 1852.5, dept: 'Sampling & Kilns', status: 'APPROVED' },
    { id: 'LOG-WK-03', user: 'Benjamin Noel', sdoRef: 'SDO-2026-002', sector: 'JUTE', description: 'Jute-Cotton Heritage Tote Batch Weave QA & Inspection', billable: true, task: 'Jute-Cotton Heritage Tote Batch Weave QA & Inspection', merchant: 'Benjamin Noel', date: '2026-10-16', hours: 31.0, rateUsd: 55, totalUsd: 1705, dept: 'Merchandising', status: 'APPROVED' },
    { id: 'LOG-WK-04', user: 'Molly Clarkson', sdoRef: 'INT-BIZ-01', sector: 'COMMERCIAL', description: 'Commercial Sourcing Margin & Competitor Pricing Audit', billable: false, task: 'Commercial Sourcing Margin & Competitor Pricing Audit', merchant: 'Molly Clarkson', date: '2026-10-16', hours: 26.5, rateUsd: 65, totalUsd: 1722.5, dept: 'Commercial Desk', status: 'APPROVED' },
    { id: 'LOG-WK-05', user: 'Syed Akramul Hassan', sdoRef: 'SDO-2026-ALL', sector: 'EXECUTIVE', description: 'Executive Buyer SDO Sign-offs & Commercial LC Structuring', billable: true, task: 'Executive Buyer SDO Sign-offs & Commercial LC Structuring', merchant: 'Syed Akramul Hassan', date: '2026-10-17', hours: 24.5, rateUsd: 120, totalUsd: 2940, dept: 'Executive Desk', status: 'APPROVED' },
    { id: 'LOG-WK-06', user: 'Sarah Jenkins', sdoRef: 'FIN-BANK-01', sector: 'FINANCE', description: 'Wise UK GBP Settlement & Sonali Bank ERQ Reconciliations', billable: false, task: 'Wise UK GBP Settlement & Sonali Bank ERQ Reconciliations', merchant: 'Sarah Jenkins', date: '2026-10-17', hours: 22.0, rateUsd: 75, totalUsd: 1650, dept: 'Finance & Banking', status: 'APPROVED' },
    { id: 'LOG-WK-07', user: 'Rafiqul Islam', sdoRef: 'SDO-2026-010', sector: 'POTTERY', description: 'Dhamrai Pottery Hand-Throwing & Natural Beeswax Waterproofing', billable: true, task: 'Dhamrai Pottery Hand-Throwing & Natural Beeswax Waterproofing', merchant: 'Rafiqul Islam', date: '2026-10-18', hours: 17.5, rateUsd: 50, totalUsd: 875, dept: 'Pottery Cluster', status: 'APPROVED' },
  ], []);

  // 5. Estimated vs Spent Variance Dataset (Planned 210h vs Actual 182.5h, -27.5h variance)
  const timeVarianceData = useMemo(() => [
    { code: 'TSK-01', ref: 'TSK-01', task: 'Full-Grain Leather Weekender Sampling', desc: 'Full-Grain Leather Weekender Sampling', sector: 'LEATHER', assignee: 'Tariqul Islam', planned: 36, plannedHours: 36, actual: 32.5, actualHours: 32.5, variance: -3.5, varianceHours: -3.5, variancePct: '-9.7%', efficiency: 'Ahead of Schedule', status: 'UNDER_BUDGET' },
    { code: 'TSK-02', ref: 'TSK-02', task: 'Artisan Ceramics & Pottery Kiln Firing', desc: 'Artisan Ceramics & Pottery Kiln Firing', sector: 'CERAMICS', assignee: 'Dr. Shahinur Rahman', planned: 32, plannedHours: 32, actual: 28.5, actualHours: 28.5, variance: -3.5, varianceHours: -3.5, variancePct: '-10.9%', efficiency: 'Ahead of Schedule', status: 'UNDER_BUDGET' },
    { code: 'TSK-03', ref: 'TSK-03', task: 'Jute Heritage Tote Batch Inspection', desc: 'Jute Heritage Tote Batch Inspection', sector: 'JUTE', assignee: 'Benjamin Noel', planned: 35, plannedHours: 35, actual: 31.0, actualHours: 31.0, variance: -4.0, varianceHours: -4.0, variancePct: '-11.4%', efficiency: 'Ahead of Schedule', status: 'UNDER_BUDGET' },
    { code: 'TSK-04', ref: 'TSK-04', task: 'Sourcing Margin Competitor Benchmark', desc: 'Sourcing Margin Competitor Benchmark', sector: 'COMMERCIAL', assignee: 'Molly Clarkson', planned: 30, plannedHours: 30, actual: 26.5, actualHours: 26.5, variance: -3.5, varianceHours: -3.5, variancePct: '-11.7%', efficiency: 'Ahead of Schedule', status: 'UNDER_BUDGET' },
    { code: 'TSK-05', ref: 'TSK-05', task: 'Executive Buyer SDO Sign-off & L/C', desc: 'Executive Buyer SDO Sign-off & L/C', sector: 'EXECUTIVE', assignee: 'Syed Akramul Hassan', planned: 28, plannedHours: 28, actual: 24.5, actualHours: 24.5, variance: -3.5, varianceHours: -3.5, variancePct: '-12.5%', efficiency: 'Ahead of Schedule', status: 'UNDER_BUDGET' },
    { code: 'TSK-06', ref: 'TSK-06', task: 'Wise UK GBP Settlement & EXP Waivers', desc: 'Wise UK GBP Settlement & EXP Waivers', sector: 'FINANCE', assignee: 'Sarah Jenkins', planned: 26, plannedHours: 26, actual: 22.0, actualHours: 22.0, variance: -4.0, varianceHours: -4.0, variancePct: '-15.4%', efficiency: 'Ahead of Schedule', status: 'UNDER_BUDGET' },
    { code: 'TSK-07', ref: 'TSK-07', task: 'Dhamrai Pottery Cluster Throwing & Wax', desc: 'Dhamrai Pottery Cluster Throwing & Wax', sector: 'POTTERY', assignee: 'Rafiqul Islam', planned: 23, plannedHours: 23, actual: 17.5, actualHours: 17.5, variance: -5.5, varianceHours: -5.5, variancePct: '-23.9%', efficiency: 'Substantial Savings', status: 'UNDER_BUDGET' },
  ], []);

  // 6. SDO Sampling Variance Dataset (from INITIAL_SAMPLES)
  const sdoVarianceData = useMemo(() => {
    return INITIAL_SAMPLES.map((s, idx) => ({
      sdoNumber: s.sdoNumber,
      ref: s.sdoNumber,
      buyer: s.buyerCompany,
      buyerName: s.buyerCompany,
      product: s.styleName,
      styleName: s.styleName,
      sector: s.sector,
      factory: s.factoryName,
      stage: s.stage,
      targetDate: s.targetDeliveryDate,
      actualDate: s.courier?.estimatedDeliveryDate || s.targetDeliveryDate,
      targetDays: 14,
      actualDays: 14 + (idx % 2 === 0 ? -1 : 0),
      awb: s.courier?.awbNumber || 'DHL-PENDING',
      varianceDays: idx % 2 === 0 ? -1 : 0,
      costUsd: s.costing.totalCostUsd,
      status: s.status,
      qcStatus: (s as any).qualityVerdict || 'PASSED_AQL',
    }));
  }, []);

  // 7. CRM Accounts Dataset (from crmLeadsRaw, 254 items)
  const crmAccountsData = useMemo(() => {
    return (crmLeadsRaw as any[]).map((lead: any, idx: number) => ({
      id: lead.id || `LEAD-${idx + 1}`,
      company: lead.company || 'Enterprise Account',
      country: lead.country || lead.market || 'International',
      market: lead.market || 'Export',
      tier: lead.tier || 'Wholesale Buyer',
      focus: lead.focus || 'Artisan Goods',
      contactPerson: lead.contact || 'Commercial Buying Office',
      contact: lead.contact || 'Commercial Buying Office',
      email: lead.email || `procurement@${(lead.company || 'buyer').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      annualBuyingPotentialUsd: lead.price ? Number(lead.price) : (lead.priority === 'A' ? 450000 : lead.priority === 'B' ? 250000 : 120000),
      priority: lead.priority || 'B',
      stage: lead.stage || '1 Prospect',
      owner: lead.owner || 'Syed',
    }));
  }, []);

  // 8. CRM Pipeline Opportunities Funnel Dataset
  const crmOpportunitiesData = useMemo(() => [
    { ref: 'OPP-UK-01', code: 'OPP-UK-01', buyer: 'Harrods London (Department Store)', market: 'UK', sector: 'LEATHER', title: 'Luxury Leather Luggage Capsule', stage: 'Contract Signed', dealUsd: 380000, valueUsd: 380000, winPct: 95, weightedUsd: 361000, closeDate: '2026-11-15', owner: 'Syed Akramul Hassan' },
    { ref: 'OPP-US-02', code: 'OPP-US-02', buyer: 'Nordstrom Inc. (US Retail Chain)', market: 'US', sector: 'JUTE', title: 'Sustainable Jute Market Shoppers', stage: 'Sampling Review', dealUsd: 520000, valueUsd: 520000, winPct: 80, weightedUsd: 416000, closeDate: '2026-11-28', owner: 'Farhana Yasmin' },
    { ref: 'OPP-EU-03', code: 'OPP-EU-03', buyer: 'Galeries Lafayette Paris', market: 'EU (France)', sector: 'TEXTILE', title: 'Artisan Indigo Apparel & Home', stage: 'Commercial Terms', dealUsd: 290000, valueUsd: 290000, winPct: 70, weightedUsd: 203000, closeDate: '2026-12-05', owner: 'Syed Akramul Hassan' },
    { ref: 'OPP-AU-04', code: 'OPP-AU-04', buyer: 'David Jones Sydney', market: 'Australia', sector: 'LEATHER', title: 'Bridle Leather Small Goods', stage: 'Tech Pack Validation', dealUsd: 340000, valueUsd: 340000, winPct: 60, weightedUsd: 204000, closeDate: '2026-12-18', owner: 'Tariqul Islam' },
    { ref: 'OPP-UK-05', code: 'OPP-UK-05', buyer: 'Blue Diamond Garden Centres', market: 'UK', sector: 'POTTERY', title: 'Artisan Terracotta Planter Wave 1', stage: 'Sampling Review', dealUsd: 180000, valueUsd: 180000, winPct: 85, weightedUsd: 153000, closeDate: '2026-12-10', owner: 'Syed Akramul Hassan' },
    { ref: 'OPP-EU-06', code: 'OPP-EU-06', buyer: 'KaDeWe Berlin Department Store', market: 'EU (Germany)', sector: 'CERAMICS', title: 'Cobalt Glaze Dinnerware Range', stage: 'Initial Discovery', dealUsd: 130000, valueUsd: 130000, winPct: 45, weightedUsd: 58500, closeDate: '2027-01-10', owner: 'Farhana Yasmin' },
  ], []);

  // 9. Upcoming Expenses & Factory Commitments (30/60 Days)
  const upcomingExpensesData = useMemo(() => [
    { id: 'EXP-FAC-01', ref: 'EXP-FAC-01', vendor: 'Apex Footwear Ltd - Unit 2 Leathercraft', poNumber: 'PO-2026-FAC-001', category: 'Finished Goods PO Balance', horizon: 'Due in 25 Days', dueDate: '2026-11-12', amountUsd: 57500, terms: 'B2B Letter of Credit (90 Days)', bank: 'Eastern Bank PLC', station: 'ARIEL_BD', status: 'PENDING_APPROVAL' },
    { id: 'EXP-FAC-02', ref: 'EXP-FAC-02', vendor: 'Bengal Natural Jute Mills Ltd', poNumber: 'PO-2026-FAC-002', category: 'Raw Jute Fabric & Sewing PO', horizon: 'Due in 30 Days', dueDate: '2026-11-18', amountUsd: 42500, terms: 'Confirmed B2B L/C', bank: 'Sonali Bank Ltd', station: 'ARIEL_BD', status: 'SCHEDULED' },
    { id: 'EXP-FAC-03', ref: 'EXP-FAC-03', vendor: 'Sonargaon Artisan Handloom', poNumber: 'PO-2026-FAC-003', category: 'Indigo Dyed Textile Yardage', horizon: 'Due in 15 Days', dueDate: '2026-11-02', amountUsd: 22000, terms: '30% Milestone Advance', bank: 'Eastern Bank PLC', station: 'ARIEL_BD', status: 'CURRENT' },
    { id: 'EXP-FAC-04', ref: 'EXP-FAC-04', vendor: 'Dhamrai Heritage Pottery Artisan Cluster', poNumber: 'PO-2026-FAC-004', category: 'Terracotta Planters & Kiln Batch', horizon: 'Due in 28 Days', dueDate: '2026-11-15', amountUsd: 12500, terms: 'Factory Net 15 Days', bank: 'Eastern Bank PLC', station: 'ARIEL_BD', status: 'SCHEDULED' },
    { id: 'EXP-LOG-05', ref: 'EXP-LOG-05', vendor: 'Maersk Line / Chittagong Off-Dock ICD', poNumber: 'LOG-2026-CT-092', category: 'Ocean Freight & Port Terminal Charges', horizon: 'Due in 12 Days', dueDate: '2026-10-30', amountUsd: 8000, terms: 'Corporate Net 30', bank: 'Standard Chartered', station: 'ARIEL_BD', status: 'CURRENT' },
  ], []);

  // 10. Upcoming Income & Milestone LC Installments
  const upcomingIncomeData = useMemo(() => [
    { ref: 'INC-LC-01', buyer: 'Harrods London', soNumber: 'SO-2026-UK-001', lcNumber: 'HSBC-LON-LC-948102', milestone: 'Confirmed Irrevocable L/C at Sight', dueDate: '2026-11-12', maturityDate: '2026-11-12', amountUsd: 87750, channel: 'HSBC London AD', status: 'CONFIRMED_AT_SIGHT', risk: 'Zero Risk (HSBC London)' },
    { ref: 'INC-LC-02', buyer: 'Nordstrom Inc.', soNumber: 'SO-2026-US-001', lcNumber: 'CITI-NYC-LC-119284', milestone: 'Port Cut-Off Document Negotiated', dueDate: '2026-11-25', maturityDate: '2026-11-25', amountUsd: 125000, channel: 'Citi Bank NY', status: 'DOCS_NEGOTIATED', risk: 'Zero Risk (Citi Bank NY)' },
    { ref: 'INC-LC-03', buyer: 'Galeries Lafayette Paris', soNumber: 'SO-2026-EU-001', lcNumber: 'BNP-PAR-LC-772910', milestone: 'Bill of Lading Sea Carrier Dispatch', dueDate: '2026-12-08', maturityDate: '2026-12-08', amountUsd: 80660, channel: 'BNP Paribas', status: 'TRANSIT_MILESTONE', risk: 'Zero Risk (BNP Paribas)' },
    { ref: 'INC-DTC-04', buyer: 'Amazon US & UK Consignment Lots', soNumber: 'DTC-LOT-2026-48', lcNumber: 'WISE-GBP-ERQ-4410', milestone: '14-Day E-Commerce Marketplace Payout', dueDate: '2026-10-31', maturityDate: '2026-10-31', amountUsd: 42500, channel: 'Wise Business ERQ', status: 'ESCROW_CLEARED', risk: 'Direct Merchant Escrow' },
    { ref: 'INC-B2B-05', buyer: 'Blue Diamond Garden Centres', soNumber: 'SO-2026-UK-002', lcNumber: 'BARC-UK-LC-882104', milestone: 'Wave 1 Terracotta Deposit LC', dueDate: '2026-11-18', maturityDate: '2026-11-18', amountUsd: 24050, channel: 'Barclays UK', status: 'DEPOSIT_CLEARED', risk: 'Zero Risk (Barclays UK)' },
  ], []);

  // 11. Project Cash Flow Allocation Dataset (Per-Batch Allocation)
  const projectCashFlowData = useMemo(() => [
    { batchRef: 'PRJ-BCH-01', ref: 'PRJ-BCH-01', buyer: 'Harrods London', name: 'Harrods London Luxury Messenger Bag SO-001', product: 'Artisan Full-Grain Messenger Bag', sector: 'LEATHER', inflowUsd: 87750, cogsUsd: 52000, freightUsd: 10000, outflowUsd: 62000, netCashUsd: 25750, netUsd: 25750, marginPct: '29.3', status: 'IN_PRODUCTION' },
    { batchRef: 'PRJ-BCH-02', ref: 'PRJ-BCH-02', buyer: 'Nordstrom Inc.', name: 'Nordstrom Inc. Natural Jute Market Tote SO-001', product: 'Natural Heritage Jute Market Tote', sector: 'JUTE', inflowUsd: 125000, cogsUsd: 76000, freightUsd: 13500, outflowUsd: 89500, netCashUsd: 35500, netUsd: 35500, marginPct: '28.4', status: 'FABRICATION' },
    { batchRef: 'PRJ-BCH-03', ref: 'PRJ-BCH-03', buyer: 'Galeries Lafayette Paris', name: 'Galeries Lafayette Indigo Handloom Weekender SO-001', product: 'Indigo Dyed Handloom Weekender', sector: 'TEXTILE', inflowUsd: 80660, cogsUsd: 48000, freightUsd: 8500, outflowUsd: 56500, netCashUsd: 24160, netUsd: 24160, marginPct: '30.0', status: 'CONFIRMED' },
    { batchRef: 'PRJ-BCH-04', ref: 'PRJ-BCH-04', buyer: 'Blue Diamond Garden Centres', name: 'Blue Diamond Artisan Terracotta Planter SO-002', product: 'Artisan Terracotta Planter & Fluted Vase', sector: 'POTTERY', inflowUsd: 64000, cogsUsd: 38000, freightUsd: 6500, outflowUsd: 44500, netCashUsd: 19500, netUsd: 19500, marginPct: '30.5', status: 'SAMPLE_APPROVED' },
    { batchRef: 'PRJ-BCH-05', ref: 'PRJ-BCH-05', buyer: 'Amazon Retail UK/US Consignment', name: 'Amazon US/UK Consignment Lot #48', product: 'Consolidated Consignment Lot #48', sector: 'LEATHER', inflowUsd: 66000, cogsUsd: 37500, freightUsd: 7500, outflowUsd: 45000, netCashUsd: 21000, netUsd: 21000, marginPct: '31.8', status: 'TRANSIT_OCEAN' },
  ], []);

  // 12. Paid Tasks & Quality Laboratory Certificates Dataset (10 Certified Reports covering all 5 sectors)
  const paidTasksData = useMemo(() => {
    return [
      ...INITIAL_CHEMICAL_TESTS.map((chem) => ({
        certRef: chem.testReportNumber,
        ref: chem.testReportNumber,
        task: `${chem.testType.replace(/_/g, ' ')} (${chem.productName})`,
        type: chem.testType.replace(/_/g, ' '),
        standard: chem.testStandard,
        product: chem.productName,
        sector: chem.sector,
        facility: chem.tanneryOrMillName,
        lab: chem.accreditedLaboratory,
        date: chem.reportIssueDate,
        costUsd: 380,
        feeUsd: 380,
        status: chem.verdict === 'PASSED_CERTIFIED' ? 'PASSED & CERTIFIED' : chem.verdict,
        verdict: chem.verdict,
        hash: chem.digitalCertificateHash,
      })),
      {
        certRef: 'AQL-2026-SAV-048',
        ref: 'AQL-2026-SAV-048',
        task: 'ISO 2859-1 Level II Pre-Shipment FRI Inspection',
        type: 'ISO 2859-1 Level II Pre-Shipment FRI Inspection',
        standard: 'ISO 2859-1 (AQL 1.5 Major / 2.5 Minor)',
        product: 'Artisan Full-Grain Messenger Bag (Savar Lot #48)',
        sector: 'LEATHER' as const,
        facility: 'Apex Footwear Ltd - Unit 2',
        lab: 'Bureau Veritas Dhaka' as const,
        date: '2026-10-17',
        costUsd: 580,
        feeUsd: 580,
        status: 'PASSED & CERTIFIED',
        verdict: 'PASSED_CERTIFIED' as const,
        hash: 'SHA256: 48f91048bce21984210a48b109e24810291aql',
      },
      {
        certRef: 'AQL-2026-NAR-012',
        ref: 'AQL-2026-NAR-012',
        task: 'Seam Tensile & Stitching AQL Inspection',
        type: 'Seam Tensile & Stitching AQL Inspection',
        standard: 'ISO 13934-1 Seam Rupture Strength',
        product: 'Natural Jute-Cotton Grocery Shopper',
        sector: 'JUTE' as const,
        facility: 'Bengal Natural Jute Mills Ltd',
        lab: 'Intertek Bangladesh' as const,
        date: '2026-10-18',
        costUsd: 350,
        feeUsd: 350,
        status: 'PASSED & CERTIFIED',
        verdict: 'PASSED_CERTIFIED' as const,
        hash: 'SHA256: 129048bce21984210a48b109e24810291nar',
      },
    ];
  }, []);

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
  interface ReportMetricItem {
    label: string;
    value: string;
    color: string;
    subtext?: string;
  }

  const currentReportStats: {
    metric1: ReportMetricItem;
    metric2: ReportMetricItem;
    metric3: ReportMetricItem;
    metric4: ReportMetricItem;
  } = useMemo(() => {
    switch (selectedType) {
      case 'TASK_SUMMARY':
      case 'TASKS_OPERATIONS': {
        const total = tasksMaster.length;
        const completed = tasksMaster.filter(t => t.stage === 'COMPLETED').length;
        const highCrit = tasksMaster.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length;
        const allChecklists = tasksMaster.flatMap(t => t.checklist);
        const checklistPct = allChecklists.length > 0 ? Math.round((allChecklists.filter(c => c.completed).length / allChecklists.length) * 100) : 0;
        return {
          metric1: { label: 'Total Registered Tasks', value: `${total} Milestones`, color: 'text-emerald-400' },
          metric2: { label: 'Milestone Completion', value: `${Math.round((completed / total) * 100)}% Signed Off`, color: 'text-cyan-300' },
          metric3: { label: 'High & Critical Priority', value: `${highCrit} Urgent Milestones`, color: 'text-amber-400' },
          metric4: { label: 'Checklist Execution', value: `${checklistPct}% Actions Complete`, color: 'text-emerald-300' },
        };
      }
      case 'TASKS_IN_PROGRESS': {
        return {
          metric1: { label: 'Active Execution Lines', value: '14 Lines Active', color: 'text-emerald-400' },
          metric2: { label: 'Factory Assembly Lines', value: '8 Factory Floors', color: 'text-cyan-300' },
          metric3: { label: 'Sourcing Workstreams', value: '6 Operations Units', color: 'text-[#C8A96A]' },
          metric4: { label: 'Schedule Adherence', value: '92.9% On Schedule', color: 'text-emerald-300' },
        };
      }
      case 'TASKS_BY_ASSIGNEE': {
        return {
          metric1: { label: 'Sourcing Specialists', value: `${assigneeWorkload.length} Team Members`, color: 'text-emerald-400' },
          metric2: { label: 'Total Allocated Hours', value: '198.5 Est Hours', color: 'text-cyan-300' },
          metric3: { label: 'Average Capacity Load', value: '84.8% Capacity', color: 'text-[#C8A96A]' },
          metric4: { label: 'Team Milestone SLA', value: '98.2% On-Time', color: 'text-emerald-300' },
        };
      }
      case 'ALL_TASKS': {
        return {
          metric1: { label: 'Consolidated Task Registry', value: `${tasksMaster.length} Enterprise Tasks`, color: 'text-emerald-400' },
          metric2: { label: 'Sector Coverage', value: '5 Material Sectors', color: 'text-cyan-300' },
          metric3: { label: 'Live Active Timers', value: '3 Active Sessions', color: 'text-[#C8A96A]' },
          metric4: { label: 'Critical SLA Breaches', value: '0 Overdue Breaches', color: 'text-emerald-300' },
        };
      }
      case 'SPENT_TIME_WEEKLY': {
        return {
          metric1: { label: 'Weekly Logged Hours', value: '182.5 hrs Logged', color: 'text-emerald-400' },
          metric2: { label: 'Direct Labor Value', value: formatCurr(11862.50), color: 'text-cyan-300' },
          metric3: { label: 'Average Labor Rate', value: `${formatCurr(65.00)}/Hour`, color: 'text-[#C8A96A]' },
          metric4: { label: 'Timesheet Verification', value: '100% Signed by MD', color: 'text-emerald-300' },
        };
      }
      case 'ESTIMATED_SPENT_ALL': {
        return {
          metric1: { label: 'Total Planned Time', value: '210.0 Hours Est', color: 'text-cyan-300' },
          metric2: { label: 'Total Actual Logged', value: '182.5 Hours Tracked', color: 'text-emerald-400' },
          metric3: { label: 'Schedule Variance', value: '-27.5 Hours (Ahead)', color: 'text-[#C8A96A]' },
          metric4: { label: 'Budget Efficiency Ratio', value: '86.9% Burn Ratio', color: 'text-emerald-300' },
        };
      }
      case 'SDO_SAMPLING_VARIANCE': {
        return {
          metric1: { label: 'Active SDO Prototypes', value: `${sdoVarianceData.length} Sample Orders`, color: 'text-emerald-400' },
          metric2: { label: 'Target Turnaround SLA', value: '7.0 Days Standard', color: 'text-cyan-300' },
          metric3: { label: 'Actual Achieved Turnaround', value: '6.2 Days Avg (-0.8d)', color: 'text-[#C8A96A]' },
          metric4: { label: 'First-Round Approval', value: '90.0% Pass Rate', color: 'text-emerald-300' },
        };
      }
      case 'CRM_ACCOUNTS_REPORT': {
        return {
          metric1: { label: 'Qualified Accounts', value: '254 Global Buyers', color: 'text-emerald-400' },
          metric2: { label: 'Tier-A High Priority', value: '42 Enterprise Buyers', color: 'text-cyan-300' },
          metric3: { label: 'Target Markets', value: 'UK, US, EU, AU', color: 'text-[#C8A96A]' },
          metric4: { 
            label: 'Sourcing Sectors', 
            value: '5 Core Sectors', 
            subtext: 'Leather, Jute, Textiles, Ceramics, Pottery', 
            color: 'text-emerald-300' 
          },
        };
      }
      case 'CRM_OPPORTUNITIES_FUNNEL':
      case 'CRM_PIPELINE': {
        return {
          metric1: { label: 'Total Pipeline GMV', value: formatCurr(1840000), color: 'text-emerald-400' },
          metric2: { label: 'Weighted Forecast', value: formatCurr(1280000), color: 'text-cyan-300' },
          metric3: { label: 'Top Wholesale Account', value: 'Harrods UK (£380k)', color: 'text-[#C8A96A]' },
          metric4: { label: 'Blended Win Rate', value: '68.5% Close Rate', color: 'text-emerald-300' },
        };
      }
      case 'PAYMENTS_DISBURSEMENTS': {
        const totalPurchasesBdt = vouchers
          .filter(v => v.type === 'CASH_PURCHASE')
          .reduce((sum, v) => sum + v.totalAmountBdt, 0);
        return {
          metric1: { label: 'Total Disbursed Volume', value: formatCurr(totalPurchasesBdt / 121.5), color: 'text-rose-400' },
          metric2: { label: 'Vouchers Reconciled', value: `${vouchers.filter(v => v.type === 'CASH_PURCHASE').length} Debit Vouchers`, color: 'text-cyan-300' },
          metric3: { label: 'Active Station Banks', value: '3 Station Banks', subtext: 'Eastern Bank, Sonali Bank, Wise UK', color: 'text-[#C8A96A]' },
          metric4: { label: 'Physical Memo Audit', value: '100% Tax Compliant', color: 'text-emerald-300' },
        };
      }
      case 'UPCOMING_EXPENSES_COMMITMENTS': {
        const totalExp = upcomingExpensesData.reduce((sum, e) => sum + e.amountUsd, 0);
        return {
          metric1: { label: '30-Day Maturing Liabilities', value: formatCurr(totalExp), color: 'text-rose-400' },
          metric2: { label: '60-Day Forward Exposure', value: formatCurr(98000), color: 'text-amber-400' },
          metric3: { label: 'Back-to-Back LC Coverage', value: '100% Backed by Master LC', color: 'text-[#C8A96A]' },
          metric4: { label: 'Partner Sourcing Units', value: '4 Partner Units', subtext: 'Apex, Bengal, Sonargaon, Dhamrai', color: 'text-cyan-300' },
        };
      }
      case 'UPCOMING_INCOME_MILESTONES': {
        const totalInc = upcomingIncomeData.reduce((sum, i) => sum + i.amountUsd, 0);
        return {
          metric1: { label: 'Total Expected Inflows', value: formatCurr(totalInc), color: 'text-emerald-400' },
          metric2: { label: 'Confirmed Master LCs', value: formatCurr(293410), color: 'text-cyan-300' },
          metric3: { label: 'Consignment Payouts', value: formatCurr(42500), color: 'text-[#C8A96A]' },
          metric4: { label: 'Credit Default Risk', value: '0.0% AAA Rated Banks', color: 'text-emerald-300' },
        };
      }
      case 'PROJECT_CASH_FLOW_ALLOCATION': {
        const totalIn = projectCashFlowData.reduce((sum, p) => sum + p.inflowUsd, 0);
        const totalOut = projectCashFlowData.reduce((sum, p) => sum + p.outflowUsd, 0);
        const netCash = totalIn - totalOut;
        const avgMargin = totalIn > 0 ? (netCash / totalIn) * 100 : 0;
        return {
          metric1: { label: 'Consolidated Project Inflows', value: formatCurr(totalIn), color: 'text-emerald-400' },
          metric2: { label: 'Factory & Freight COGS', value: formatCurr(totalOut), color: 'text-rose-400' },
          metric3: { label: 'Net Operating Margin', value: formatCurr(netCash), color: 'text-[#C8A96A]' },
          metric4: { label: 'Blended Batch Margin', value: `${avgMargin.toFixed(1)}% (Target ≥ 25%)`, color: 'text-emerald-300' },
        };
      }
      case 'PAID_TASKS_CERTIFICATES': {
        const totalFees = paidTasksData.reduce((sum, p) => sum + p.feeUsd, 0);
        return {
          metric1: { label: 'Paid Compliance Audits', value: `${paidTasksData.length} Certified Inspections`, color: 'text-emerald-400' },
          metric2: { label: 'Chemical Safety Rating', value: '100% Passed (Zero Defects)', color: 'text-cyan-300' },
          metric3: { label: 'Testing Bodies', value: 'TÜV SÜD, SGS, Intertek, BV', color: 'text-[#C8A96A]' },
          metric4: { label: 'Total Testing Fees Paid', value: formatCurr(totalFees), color: 'text-emerald-300' },
        };
      }
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
  }, [
    selectedType,
    filteredVouchers,
    samplePayables,
    currentRate,
    tasksMaster,
    assigneeWorkload,
    sdoVarianceData,
    upcomingExpensesData,
    upcomingIncomeData,
    projectCashFlowData,
    paidTasksData,
  ]);

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
    } else if (selectedType === 'TASK_SUMMARY' || selectedType === 'TASKS_OPERATIONS') {
      headers = ['Task Code', 'Sampling / Production Milestone', 'Factory Partner', 'Department / Sector', 'Target Due Date', 'QC Status', 'Lead Days', 'Merchant Lead'];
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
    } else if (selectedType === 'TASKS_IN_PROGRESS') {
      headers = ['Line Code', 'Assembly Line / Task', 'Material Sector', 'Factory Partner', 'Assignee / Lead', 'Target Completion', 'Progress %', 'Status'];
      rows = inProgressLines.map((l) => [
        l.code,
        l.name,
        l.sector,
        l.factory,
        l.lead,
        l.targetDate,
        `${l.progressPct}%`,
        l.status,
      ]);
    } else if (selectedType === 'TASKS_BY_ASSIGNEE') {
      headers = ['Staff Member', 'Role / Department', 'Active Tasks', 'Completed Tasks', 'Logged Hours', 'Efficiency Score'];
      rows = assigneeWorkload.map((a) => [
        a.name,
        a.role,
        a.activeTasks,
        a.completedTasks,
        `${a.loggedHours}h`,
        `${a.efficiencyPct}%`,
      ]);
    } else if (selectedType === 'ALL_TASKS') {
      headers = ['Task ID', 'Title', 'Category', 'Priority', 'Assignee', 'Due Date', 'Status'];
      rows = tasksMaster.map((t) => [
        t.id,
        t.title,
        t.category,
        t.priority,
        t.assignee,
        t.dueDate,
        t.status,
      ]);
    } else if (selectedType === 'SPENT_TIME_WEEKLY') {
      headers = ['Log ID', 'Date', 'Staff Member', 'SDO / Job Ref', 'Sector', 'Task Description', 'Logged Hours', 'Billable'];
      rows = weeklyTimeLogs.map((log) => [
        log.id,
        log.date,
        log.user,
        log.sdoRef,
        log.sector,
        log.description,
        log.hours,
        log.billable ? 'YES' : 'NO',
      ]);
    } else if (selectedType === 'ESTIMATED_SPENT_ALL') {
      headers = ['Job / SDO Ref', 'Description', 'Material Sector', 'Planned Hours', 'Actual Logged Hours', 'Variance Hours', 'Status'];
      rows = timeVarianceData.map((tv) => [
        tv.ref,
        tv.desc,
        tv.sector,
        tv.plannedHours,
        tv.actualHours,
        tv.varianceHours > 0 ? `+${tv.varianceHours}h` : `${tv.varianceHours}h`,
        tv.status,
      ]);
    } else if (selectedType === 'SDO_SAMPLING_VARIANCE') {
      headers = ['SDO Number', 'Material Sector', 'Buyer / Client', 'Product Title', 'Target Days', 'Actual Days', 'Variance Days', 'QC Status'];
      rows = sdoVarianceData.map((s) => [
        s.sdoNumber,
        s.sector,
        s.buyer,
        s.product,
        s.targetDays,
        s.actualDays,
        s.varianceDays > 0 ? `+${s.varianceDays}d` : `${s.varianceDays}d`,
        s.qcStatus,
      ]);
    } else if (selectedType === 'CRM_ACCOUNTS_REPORT') {
      headers = ['Lead ID', 'Buyer Company Name', 'Target Market', 'Primary Contact', 'Email Address', `Annual Buying Potential (${selectedCurrency})`, 'Account Stage', 'Account Owner'];
      rows = crmAccountsData.map((c) => [
        c.id,
        c.company,
        c.country,
        c.contactPerson,
        c.email,
        Math.round(c.annualBuyingPotentialUsd * currentRate.rate),
        c.stage,
        c.owner,
      ]);
    } else if (selectedType === 'CRM_OPPORTUNITIES_FUNNEL' || selectedType === 'CRM_PIPELINE') {
      headers = ['Deal Ref', 'Buyer Account', 'Market Territory', 'Opportunity Title', 'Pipeline Stage', `Contract GMV (${selectedCurrency})`, 'Win Probability', `Weighted Forecast (${selectedCurrency})`, 'Target Close'];
      rows = crmOpportunitiesData.map((c) => [
        c.ref,
        c.buyer,
        c.market,
        c.title,
        c.stage,
        Math.round(c.valueUsd * currentRate.rate),
        `${c.winPct}%`,
        Math.round(c.weightedUsd * currentRate.rate),
        c.closeDate,
      ]);
    } else if (selectedType === 'PAYMENTS_DISBURSEMENTS') {
      headers = ['Voucher No', 'Disbursement Date', 'Party / Beneficiary', 'Station Bank', 'Account Head', `Disbursed (${selectedCurrency})`, 'Payment Mode', 'Status'];
      rows = filteredVouchers
        .filter((v) => v.type === 'CASH_PURCHASE')
        .map((v) => [
          v.voucherNumber,
          v.date,
          v.partyName,
          v.stationBankName || 'Eastern Bank PLC',
          v.mainAccountHead,
          Math.round((v.totalAmountBdt / 121.5) * currentRate.rate),
          v.paymentMode || 'BANK_TRANSFER',
          'SETTLED',
        ]);
    } else if (selectedType === 'UPCOMING_EXPENSES_COMMITMENTS') {
      headers = ['Commitment ID', 'Factory / Vendor', 'Expense Category', 'Payment Terms', 'Payment Due Date', `Commitment Amount (${selectedCurrency})`, 'Station Hub', 'Status'];
      rows = upcomingExpensesData.map((exp) => [
        exp.id,
        exp.vendor,
        exp.category,
        exp.terms,
        exp.dueDate,
        Math.round(exp.amountUsd * currentRate.rate),
        exp.station,
        exp.status,
      ]);
    } else if (selectedType === 'UPCOMING_INCOME_MILESTONES') {
      headers = ['Milestone Ref', 'Buyer Account', 'Export Contract / LC', 'Milestone Tranche', 'Target Due Date', `Milestone Amount (${selectedCurrency})`, 'Payment Route', 'LC Status'];
      rows = upcomingIncomeData.map((inc) => [
        inc.ref,
        inc.buyer,
        inc.lcNumber,
        inc.milestone,
        inc.dueDate,
        Math.round(inc.amountUsd * currentRate.rate),
        inc.channel,
        inc.status,
      ]);
    } else if (selectedType === 'PROJECT_CASH_FLOW_ALLOCATION') {
      headers = ['Batch Ref', 'Export Project / SO', 'Sector', `Contract Inflow (${selectedCurrency})`, `Factory PO COGS (${selectedCurrency})`, `Freight & Port (${selectedCurrency})`, `Net Cash Flow (${selectedCurrency})`, 'Net Margin %'];
      rows = projectCashFlowData.map((pcf) => [
        pcf.batchRef,
        pcf.name,
        pcf.sector,
        Math.round(pcf.inflowUsd * currentRate.rate),
        Math.round(pcf.cogsUsd * currentRate.rate),
        Math.round(pcf.freightUsd * currentRate.rate),
        Math.round(pcf.netCashUsd * currentRate.rate),
        `${pcf.marginPct}%`,
      ]);
    } else if (selectedType === 'PAID_TASKS_CERTIFICATES') {
      headers = ['Certificate Ref', 'Inspection / Testing Task', 'Material Sector', 'Accredited Laboratory', 'Inspection Date', 'Compliance Standard', `Certification Cost (${selectedCurrency})`, 'Certification Status'];
      rows = paidTasksData.map((pt) => [
        pt.certRef,
        pt.task,
        pt.sector,
        pt.lab,
        pt.date,
        pt.standard,
        Math.round(pt.costUsd * currentRate.rate),
        pt.status,
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
    } else if (selectedType === 'TASK_SUMMARY' || selectedType === 'TASKS_OPERATIONS') {
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
    } else if (selectedType === 'TASKS_IN_PROGRESS') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 12%; text-align: left;">Line Code</th>
              <th style="width: 28%; text-align: left;">Active Operation / Assembly Line</th>
              <th style="width: 14%; text-align: left;">Sector</th>
              <th style="width: 18%; text-align: left;">Factory Partner</th>
              <th style="width: 14%; text-align: left;">Merchant Lead</th>
              <th style="width: 14%; text-align: center;">Progress</th>
            </tr>
          </thead>
          <tbody>
            ${inProgressLines.map((l) => `
              <tr>
                <td class="font-bold">${l.code}</td>
                <td class="font-bold">${l.name}</td>
                <td><span class="hub-badge">${l.sector}</span></td>
                <td class="cell-muted">${l.factory}</td>
                <td>${l.lead}</td>
                <td class="cell-center font-bold text-emerald">${l.progressPct}% (${l.status})</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'TASKS_BY_ASSIGNEE') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 24%; text-align: left;">Staff Member</th>
              <th style="width: 28%; text-align: left;">Department Role</th>
              <th style="width: 12%; text-align: right;">Active</th>
              <th style="width: 12%; text-align: right;">Completed</th>
              <th style="width: 12%; text-align: right;">Logged Hours</th>
              <th style="width: 12%; text-align: center;">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            ${assigneeWorkload.map((a) => `
              <tr>
                <td class="font-bold">${a.name}</td>
                <td class="cell-muted">${a.role}</td>
                <td class="cell-num">${a.activeTasks}</td>
                <td class="cell-num text-emerald font-bold">${a.completedTasks}</td>
                <td class="cell-num font-bold">${a.loggedHours} hrs</td>
                <td class="cell-center text-gold font-bold">${a.efficiencyPct}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'ALL_TASKS') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 14%; text-align: left;">Task ID</th>
              <th style="width: 32%; text-align: left;">Milestone Title</th>
              <th style="width: 14%; text-align: left;">Category</th>
              <th style="width: 12%; text-align: center;">Priority</th>
              <th style="width: 14%; text-align: left;">Assignee</th>
              <th style="width: 14%; text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${tasksMaster.slice(0, 15).map((t) => `
              <tr>
                <td class="font-bold">${t.id}</td>
                <td class="font-bold">${t.title}</td>
                <td><span class="hub-badge">${t.category}</span></td>
                <td class="cell-center font-bold ${t.priority === 'CRITICAL' ? 'text-rose' : t.priority === 'HIGH' ? 'text-gold' : 'text-emerald'}">${t.priority}</td>
                <td class="cell-muted">${t.assignee}</td>
                <td class="cell-center"><span class="status-badge badge-green">${t.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'SPENT_TIME_WEEKLY') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 12%; text-align: left;">Date</th>
              <th style="width: 18%; text-align: left;">Merchant Lead</th>
              <th style="width: 14%; text-align: left;">SDO Ref</th>
              <th style="width: 14%; text-align: left;">Sector</th>
              <th style="width: 30%; text-align: left;">Operational Activity</th>
              <th style="width: 12%; text-align: right;">Logged Time</th>
            </tr>
          </thead>
          <tbody>
            ${weeklyTimeLogs.map((log) => `
              <tr>
                <td class="cell-muted">${log.date}</td>
                <td class="font-bold">${log.user}</td>
                <td><span class="hub-badge">${log.sdoRef}</span></td>
                <td>${log.sector}</td>
                <td>${log.description}</td>
                <td class="cell-num font-bold text-emerald">${log.hours.toFixed(1)} hrs</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'ESTIMATED_SPENT_ALL') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 16%; text-align: left;">Job / SDO Ref</th>
              <th style="width: 32%; text-align: left;">Milestone Description</th>
              <th style="width: 14%; text-align: left;">Sector</th>
              <th style="width: 12%; text-align: right;">Planned Time</th>
              <th style="width: 12%; text-align: right;">Actual Spent</th>
              <th style="width: 14%; text-align: center;">Variance</th>
            </tr>
          </thead>
          <tbody>
            ${timeVarianceData.map((tv) => `
              <tr>
                <td class="font-bold">${tv.ref}</td>
                <td>${tv.desc}</td>
                <td><span class="hub-badge">${tv.sector}</span></td>
                <td class="cell-num cell-muted">${tv.plannedHours} hrs</td>
                <td class="cell-num font-bold">${tv.actualHours} hrs</td>
                <td class="cell-center font-bold ${tv.varianceHours <= 0 ? 'text-emerald' : 'text-rose'}">
                  ${tv.varianceHours > 0 ? `+${tv.varianceHours}` : tv.varianceHours} hrs
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'SDO_SAMPLING_VARIANCE') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 15%; text-align: left;">SDO Number</th>
              <th style="width: 12%; text-align: left;">Sector</th>
              <th style="width: 22%; text-align: left;">Buyer Account</th>
              <th style="width: 25%; text-align: left;">Product Item</th>
              <th style="width: 13%; text-align: right;">Target / Actual</th>
              <th style="width: 13%; text-align: center;">Variance</th>
            </tr>
          </thead>
          <tbody>
            ${sdoVarianceData.map((s) => `
              <tr>
                <td class="font-bold">${s.sdoNumber}</td>
                <td><span class="hub-badge">${s.sector}</span></td>
                <td class="font-bold">${s.buyer}</td>
                <td>${s.product}</td>
                <td class="cell-num cell-muted">${s.targetDays}d / ${s.actualDays}d</td>
                <td class="cell-center font-bold ${s.varianceDays <= 0 ? 'text-emerald' : 'text-rose'}">
                  ${s.varianceDays > 0 ? `+${s.varianceDays}` : s.varianceDays} days
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'CRM_ACCOUNTS_REPORT') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 12%; text-align: left;">Lead ID</th>
              <th style="width: 25%; text-align: left;">Buyer Company</th>
              <th style="width: 14%; text-align: left;">Country</th>
              <th style="width: 18%; text-align: left;">Primary Contact</th>
              <th style="width: 15%; text-align: right;">Buying Potential</th>
              <th style="width: 16%; text-align: center;">Account Stage</th>
            </tr>
          </thead>
          <tbody>
            ${crmAccountsData.slice(0, 16).map((c) => `
              <tr>
                <td class="font-bold">${c.id}</td>
                <td class="font-bold">${c.company}</td>
                <td><span class="hub-badge">${c.country}</span></td>
                <td>${c.contactPerson}</td>
                <td class="cell-num font-bold text-emerald">${formatPrintCurr(c.annualBuyingPotentialUsd)}</td>
                <td class="cell-center"><span class="status-badge badge-blue">${c.stage}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'CRM_OPPORTUNITIES_FUNNEL' || selectedType === 'CRM_PIPELINE') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 12%; text-align: left;">Deal Ref</th>
              <th style="width: 22%; text-align: left;">Buyer Account</th>
              <th style="width: 14%; text-align: left;">Territory</th>
              <th style="width: 16%; text-align: center;">Stage</th>
              <th style="width: 18%; text-align: right;">Contract GMV</th>
              <th style="width: 18%; text-align: right;">Weighted Value</th>
            </tr>
          </thead>
          <tbody>
            ${crmOpportunitiesData.map((c) => `
              <tr>
                <td class="font-bold">${c.ref}</td>
                <td class="font-bold">${c.buyer}</td>
                <td class="cell-muted">${c.market}</td>
                <td class="cell-center"><span class="status-badge badge-blue">${c.stage}</span></td>
                <td class="cell-num text-emerald font-bold">${formatPrintCurr(c.valueUsd)}</td>
                <td class="cell-num text-gold font-bold">${formatPrintCurr(c.weightedUsd)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'PAYMENTS_DISBURSEMENTS') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 12%; text-align: left;">Voucher #</th>
              <th style="width: 11%; text-align: left;">Date</th>
              <th style="width: 22%; text-align: left;">Beneficiary Party</th>
              <th style="width: 18%; text-align: left;">Station Bank</th>
              <th style="width: 19%; text-align: left;">Account Head</th>
              <th style="width: 18%; text-align: right;">Disbursed (${selectedCurrency})</th>
            </tr>
          </thead>
          <tbody>
            ${filteredVouchers.filter((v) => v.type === 'CASH_PURCHASE').slice(0, 15).map((v) => {
              const convertedAmt = Math.round((v.totalAmountBdt / 121.5) * currentRate.rate);
              return `
                <tr>
                  <td class="font-bold">${v.voucherNumber}</td>
                  <td class="cell-muted">${v.date}</td>
                  <td class="font-bold">${v.partyName}</td>
                  <td class="cell-muted">${v.stationBankName || 'Eastern Bank PLC'}</td>
                  <td>${v.mainAccountHead}</td>
                  <td class="cell-num text-rose font-bold">-${currentRate.symbol}\u00A0${convertedAmt.toLocaleString()}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'UPCOMING_EXPENSES_COMMITMENTS') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 14%; text-align: left;">Commitment</th>
              <th style="width: 24%; text-align: left;">Beneficiary Factory</th>
              <th style="width: 18%; text-align: left;">Category</th>
              <th style="width: 12%; text-align: left;">Due Date</th>
              <th style="width: 16%; text-align: right;">Amount Due</th>
              <th style="width: 16%; text-align: center;">Terms</th>
            </tr>
          </thead>
          <tbody>
            ${upcomingExpensesData.map((exp) => `
              <tr>
                <td class="font-bold">${exp.id}</td>
                <td class="font-bold">${exp.vendor}</td>
                <td><span class="hub-badge">${exp.category}</span></td>
                <td class="cell-muted">${exp.dueDate}</td>
                <td class="cell-num text-rose font-bold">${formatPrintCurr(exp.amountUsd)}</td>
                <td class="cell-center font-bold text-gold">${exp.terms}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'UPCOMING_INCOME_MILESTONES') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 14%; text-align: left;">Milestone Ref</th>
              <th style="width: 22%; text-align: left;">Buyer / LC Acc</th>
              <th style="width: 20%; text-align: left;">Tranche Milestone</th>
              <th style="width: 12%; text-align: left;">Target Date</th>
              <th style="width: 16%; text-align: right;">Amount Expected</th>
              <th style="width: 16%; text-align: center;">Route Status</th>
            </tr>
          </thead>
          <tbody>
            ${upcomingIncomeData.map((inc) => `
              <tr>
                <td class="font-bold">${inc.ref}</td>
                <td class="font-bold">${inc.buyer}</td>
                <td>${inc.milestone}</td>
                <td class="cell-muted">${inc.dueDate}</td>
                <td class="cell-num text-emerald font-bold">${formatPrintCurr(inc.amountUsd)}</td>
                <td class="cell-center font-bold text-cyan">${inc.channel}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'PROJECT_CASH_FLOW_ALLOCATION') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 12%; text-align: left;">Batch Ref</th>
              <th style="width: 26%; text-align: left;">Export Project / SO</th>
              <th style="width: 12%; text-align: left;">Sector</th>
              <th style="width: 16%; text-align: right;">Inflow Revenue</th>
              <th style="width: 16%; text-align: right;">Total Outflow</th>
              <th style="width: 18%; text-align: right;">Net Cash Margin</th>
            </tr>
          </thead>
          <tbody>
            ${projectCashFlowData.map((pcf) => `
              <tr>
                <td class="font-bold">${pcf.batchRef}</td>
                <td class="font-bold">${pcf.name}</td>
                <td><span class="hub-badge">${pcf.sector}</span></td>
                <td class="cell-num text-emerald font-bold">${formatPrintCurr(pcf.inflowUsd)}</td>
                <td class="cell-num text-rose">${formatPrintCurr(pcf.cogsUsd + pcf.freightUsd)}</td>
                <td class="cell-num text-gold font-bold">${formatPrintCurr(pcf.netCashUsd)} (${pcf.marginPct}%)</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (selectedType === 'PAID_TASKS_CERTIFICATES') {
      tableHtml = `
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 14%; text-align: left;">Cert Ref</th>
              <th style="width: 26%; text-align: left;">Testing &amp; Inspection Task</th>
              <th style="width: 12%; text-align: left;">Sector</th>
              <th style="width: 16%; text-align: left;">Accredited Lab</th>
              <th style="width: 16%; text-align: left;">Compliance Standard</th>
              <th style="width: 16%; text-align: center;">QC Status</th>
            </tr>
          </thead>
          <tbody>
            ${paidTasksData.map((pt) => `
              <tr>
                <td class="font-bold">${pt.certRef}</td>
                <td class="font-bold">${pt.task}</td>
                <td><span class="hub-badge">${pt.sector}</span></td>
                <td class="cell-muted">${pt.lab}</td>
                <td class="cell-muted font-bold">${pt.standard}</td>
                <td class="cell-center"><span class="status-badge badge-green">${pt.status}</span></td>
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
    :root {
      --bg-stage: #06130D;
      --bg-toolbar: #0A140F;
      --border-toolbar: #2C5240;
      --text-toolbar: #ffffff;
      --accent-gold: #C8A96A;
      --accent-emerald: #10B981;
      --sheet-bg: #ffffff;
      --sheet-text: #0f172a;
      --sheet-border: 1px solid rgba(44, 82, 64, 0.4);
      --sheet-shadow: 0 14px 40px -5px rgba(0, 0, 0, 0.65), 0 6px 12px -4px rgba(0, 0, 0, 0.4);
    }

    /* Screen Color Mode Themes */
    body.theme-emerald {
      --bg-stage: #06130D;
      --bg-toolbar: #0A140F;
      --border-toolbar: #2C5240;
      --sheet-bg: #ffffff;
      --sheet-text: #0f172a;
      --sheet-border: 1px solid rgba(44, 82, 64, 0.4);
      --sheet-shadow: 0 16px 45px -5px rgba(0, 0, 0, 0.7);
    }

    body.theme-light {
      --bg-stage: #E6ECE8;
      --bg-toolbar: #12231B;
      --border-toolbar: #2C5240;
      --sheet-bg: #ffffff;
      --sheet-text: #0f172a;
      --sheet-border: 1px solid #CBD5E1;
      --sheet-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 4px 10px -3px rgba(0, 0, 0, 0.08);
    }

    body.theme-dark {
      --bg-stage: #040906;
      --bg-toolbar: #0A140F;
      --border-toolbar: #2C5240;
      --sheet-bg: #0C1A14;
      --sheet-text: #E2E8F0;
      --sheet-border: 2px solid #2C5240;
      --sheet-shadow: 0 18px 50px -5px rgba(0, 0, 0, 0.85);
    }

    body.theme-parchment {
      --bg-stage: #14211A;
      --bg-toolbar: #0A140F;
      --border-toolbar: #2C5240;
      --sheet-bg: #FFFDF9;
      --sheet-text: #1C1917;
      --sheet-border: 3px double #C8A96A;
      --sheet-shadow: 0 14px 40px -5px rgba(0, 0, 0, 0.65);
    }

    /* Dark Mode Dossier on-screen styling */
    body.theme-dark .a4-sheet {
      background: var(--sheet-bg) !important;
      color: var(--sheet-text) !important;
      border: var(--sheet-border) !important;
    }
    body.theme-dark .report-main-title {
      color: #34D399 !important;
    }
    body.theme-dark .report-subtitle,
    body.theme-dark .company-legal-bar,
    body.theme-dark .m-lbl {
      color: #94A3B8 !important;
    }
    body.theme-dark .m-val,
    body.theme-dark .company-name {
      color: #F8FAFC !important;
    }
    body.theme-dark .meta-card,
    body.theme-dark .kpi-card {
      background: #12231B !important;
      border-color: #2C5240 !important;
      color: #E2E8F0 !important;
    }
    body.theme-dark .kpi-subtext {
      color: #94A3B8 !important;
    }
    body.theme-dark .report-table th {
      background: #162B22 !important;
      color: #C8A96A !important;
      border-color: #2C5240 !important;
    }
    body.theme-dark .report-table td {
      border-color: #1F3A2E !important;
      color: #CBD5E1 !important;
    }
    body.theme-dark .report-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.04) !important;
    }
    body.theme-dark .audit-seal-box,
    body.theme-dark .sig-card {
      background: #12231B !important;
      border-color: #2C5240 !important;
    }
    body.theme-dark .sig-title,
    body.theme-dark .sig-name {
      color: #F8FAFC !important;
    }
    body.theme-dark .sig-desig {
      color: #94A3B8 !important;
    }
    body.theme-dark .sig-box-inner {
      background: #FFFFFF !important;
    }

    body {
      background-color: var(--bg-stage);
      color: #0f172a;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.45;
      -webkit-font-smoothing: antialiased;
      transition: background-color 0.25s ease;
    }

    /* Top Sticky Control Toolbar */
    .print-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--bg-toolbar);
      color: var(--text-toolbar);
      border-bottom: 1px solid var(--border-toolbar);
      padding: 10px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 18px rgba(0,0,0,0.5);
      transition: all 0.25s ease;
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

    /* Screen Color Mode Picker */
    .screen-color-picker {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border-toolbar);
      padding: 4px 8px;
      border-radius: 10px;
    }
    .picker-label {
      font-size: 10.5px;
      font-weight: 700;
      color: #C8A96A;
      font-family: 'Montserrat', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .picker-group {
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .theme-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      color: #94A3B8;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: 'Inter', sans-serif;
    }
    .theme-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #FFFFFF;
    }
    .theme-btn.active {
      background: rgba(44, 82, 64, 0.7);
      border-color: #C8A96A;
      color: #FFFFFF;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
    .color-swatch {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .swatch-emerald { background: #06130D; border-color: #2C5240; }
    .swatch-light { background: #E6ECE8; border-color: #94A3B8; }
    .swatch-dark { background: #0C1A14; border-color: #C8A96A; }
    .swatch-parchment { background: #FFFDF9; border-color: #C8A96A; }

    .print-toolbar .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 15px;
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
      border: 1px solid #34D399;
      box-shadow: 0 2px 8px rgba(5, 150, 105, 0.45);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #10b981, #14b8a6);
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.6);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: #162B22;
      color: #E2E8F0;
      border: 1px solid #2C5240;
    }
    .btn-secondary:hover {
      background: #1F3A2E;
      color: #FFFFFF;
      border-color: #C8A96A;
    }

    /* Studio Paper Stage */
    .paper-stage {
      padding: 24px 16px 60px;
      display: flex;
      justify-content: center;
      background: var(--bg-stage);
      min-height: calc(100vh - 65px);
      transition: background-color 0.25s ease;
    }

    /* Executive A4 Sheet */
    .a4-sheet {
      width: 210mm;
      min-height: 297mm;
      background: var(--sheet-bg) !important;
      color: var(--sheet-text) !important;
      border: var(--sheet-border);
      padding: 14mm 14mm 16mm;
      box-shadow: var(--sheet-shadow);
      border-radius: 4px;
      position: relative;
      transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease;
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
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 14px;
      width: 100%;
    }
    .kpi-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      min-width: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .kpi-label {
      display: block;
      font-size: 8.5px;
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
      font-size: 14px;
      font-weight: 800;
      font-family: 'Inter', sans-serif;
      letter-spacing: -0.02em;
      line-height: 1.25;
      font-variant-numeric: tabular-nums;
      overflow-wrap: break-word;
      word-break: normal;
    }
    .kpi-num.kpi-text-dense {
      font-size: 11px;
      font-weight: 700;
      line-height: 1.3;
      white-space: normal;
      letter-spacing: -0.01em;
    }
    .kpi-subtext {
      display: block;
      font-size: 8.5px;
      font-weight: 600;
      line-height: 1.25;
      margin-top: 2.5px;
      overflow-wrap: break-word;
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
      html, body, body.theme-dark, body.theme-emerald, body.theme-light, body.theme-parchment {
        background: #ffffff !important;
        color: #0f172a !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .no-print {
        display: none !important;
      }
      .paper-stage {
        padding: 0 !important;
        background: transparent !important;
        min-height: auto !important;
      }
      .a4-sheet {
        width: 100% !important;
        min-height: auto !important;
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        background: #ffffff !important;
        color: #0f172a !important;
      }
      body.theme-dark .report-main-title {
        color: #0f172a !important;
      }
      body.theme-dark .company-name {
        color: #064e3b !important;
      }
      body.theme-dark .company-legal-bar,
      body.theme-dark .report-subtitle,
      body.theme-dark .m-lbl {
        color: #64748b !important;
      }
      body.theme-dark .m-val {
        color: #0f172a !important;
      }
      body.theme-dark .meta-card,
      body.theme-dark .kpi-card,
      body.theme-dark .audit-seal-box,
      body.theme-dark .sig-card {
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        color: #0f172a !important;
      }
      body.theme-dark .kpi-subtext {
        color: #64748b !important;
      }
      body.theme-dark .report-table th {
        background: #064e3b !important;
        color: #ffffff !important;
        border-color: #047857 !important;
      }
      body.theme-dark .report-table td {
        border-color: #e2e8f0 !important;
        color: #1e293b !important;
      }
      body.theme-dark .sig-name {
        color: #0f172a !important;
      }
      body.theme-dark .sig-desig {
        color: #64748b !important;
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
<body class="theme-emerald">
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

    <!-- Screen Canvas Color Mode Switcher -->
    <div class="screen-color-picker no-print">
      <span class="picker-label">🎨 Screen Color:</span>
      <div class="picker-group">
        <button type="button" class="theme-btn active" id="btn-theme-emerald" onclick="setScreenColor('theme-emerald')" title="ArielMC Signature Deep Emerald Canvas">
          <span class="color-swatch swatch-emerald"></span>
          <span>Emerald Dark</span>
        </button>
        <button type="button" class="theme-btn" id="btn-theme-light" onclick="setScreenColor('theme-light')" title="Soft Light Studio Drafting Canvas">
          <span class="color-swatch swatch-light"></span>
          <span>Soft Light</span>
        </button>
        <button type="button" class="theme-btn" id="btn-theme-dark" onclick="setScreenColor('theme-dark')" title="Executive Dark Mode Dossier">
          <span class="color-swatch swatch-dark"></span>
          <span>Dark Dossier</span>
        </button>
        <button type="button" class="theme-btn" id="btn-theme-parchment" onclick="setScreenColor('theme-parchment')" title="Ivory Parchment & Gold Borders">
          <span class="color-swatch swatch-parchment"></span>
          <span>Ivory / Gold</span>
        </button>
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
          <span class="kpi-num text-emerald ${currentReportStats.metric1.value.length > 20 ? 'kpi-text-dense' : ''}">${currentReportStats.metric1.value}</span>
          ${currentReportStats.metric1.subtext ? `<span class="kpi-subtext" style="color: #047857;">${currentReportStats.metric1.subtext}</span>` : ''}
        </div>
        <div class="kpi-card">
          <span class="kpi-label">${currentReportStats.metric2.label}</span>
          <span class="kpi-num text-rose ${currentReportStats.metric2.value.length > 20 ? 'kpi-text-dense' : ''}">${currentReportStats.metric2.value}</span>
          ${currentReportStats.metric2.subtext ? `<span class="kpi-subtext" style="color: #b91c1c;">${currentReportStats.metric2.subtext}</span>` : ''}
        </div>
        <div class="kpi-card">
          <span class="kpi-label">${currentReportStats.metric3.label}</span>
          <span class="kpi-num text-gold ${currentReportStats.metric3.value.length > 20 ? 'kpi-text-dense' : ''}">${currentReportStats.metric3.value}</span>
          ${currentReportStats.metric3.subtext ? `<span class="kpi-subtext" style="color: #92400e;">${currentReportStats.metric3.subtext}</span>` : ''}
        </div>
        <div class="kpi-card">
          <span class="kpi-label">${currentReportStats.metric4.label}</span>
          <span class="kpi-num text-cyan ${currentReportStats.metric4.value.length > 20 ? 'kpi-text-dense' : ''}">${currentReportStats.metric4.value}</span>
          ${currentReportStats.metric4.subtext ? `<span class="kpi-subtext" style="color: #0284c7;">${currentReportStats.metric4.subtext}</span>` : ''}
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

  <script>
    function setScreenColor(theme) {
      document.body.className = theme;
      var buttons = document.querySelectorAll('.theme-btn');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
      }
      var activeBtn = document.getElementById('btn-' + theme);
      if (activeBtn) activeBtn.classList.add('active');
      try {
        localStorage.setItem('arielmc_print_screen_theme', theme);
      } catch (e) {}
    }

    // Auto-restore saved screen color preference if present
    try {
      var savedTheme = localStorage.getItem('arielmc_print_screen_theme');
      if (savedTheme) {
        setScreenColor(savedTheme);
      }
    } catch (e) {}
  </script>
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      data-theme={theme}
    >
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

            {/* Template Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'ALL', label: 'All Templates', count: REPORT_OPTIONS.length },
                { id: 'OPERATIONS', label: 'Tasks & Operations', count: REPORT_OPTIONS.filter((o) => o.category === 'OPERATIONS').length },
                { id: 'SALES', label: 'CRM & Pipeline', count: REPORT_OPTIONS.filter((o) => o.category === 'SALES').length },
                { id: 'PROJECTS', label: 'Projects & Cash Flow', count: REPORT_OPTIONS.filter((o) => o.category === 'PROJECTS').length },
                { id: 'FINANCE', label: 'Finance & Statements', count: REPORT_OPTIONS.filter((o) => o.category === 'FINANCE').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTemplateTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                    templateTab === tab.id
                      ? 'bg-[#1E6B3A] text-white border border-emerald-400/50 shadow-xs'
                      : 'bg-[#12231B] text-gray-400 hover:text-white border border-[#2C5240]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="ml-1 opacity-60">({tab.count})</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {REPORT_OPTIONS
                .filter((opt) => templateTab === 'ALL' || opt.category === templateTab)
                .map((opt) => {
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
              <div className="p-2.5 rounded-lg bg-[#12231B] border border-[#2C5240] min-w-0 flex flex-col justify-center">
                <span className="text-[9px] text-gray-400 font-mono block truncate">{currentReportStats.metric1.label}</span>
                <span className={`text-sm sm:text-base font-bold font-mono break-words ${currentReportStats.metric1.color}`}>
                  {currentReportStats.metric1.value}
                </span>
                {currentReportStats.metric1.subtext && (
                  <span className="text-[10px] text-gray-400 font-mono mt-0.5 break-words">
                    {currentReportStats.metric1.subtext}
                  </span>
                )}
              </div>
              <div className="p-2.5 rounded-lg bg-[#12231B] border border-[#2C5240] min-w-0 flex flex-col justify-center">
                <span className="text-[9px] text-gray-400 font-mono block truncate">{currentReportStats.metric2.label}</span>
                <span className={`text-sm sm:text-base font-bold font-mono break-words ${currentReportStats.metric2.color}`}>
                  {currentReportStats.metric2.value}
                </span>
                {currentReportStats.metric2.subtext && (
                  <span className="text-[10px] text-gray-400 font-mono mt-0.5 break-words">
                    {currentReportStats.metric2.subtext}
                  </span>
                )}
              </div>
              <div className="p-2.5 rounded-lg bg-[#12231B] border border-[#2C5240] min-w-0 flex flex-col justify-center">
                <span className="text-[9px] text-gray-400 font-mono block truncate">{currentReportStats.metric3.label}</span>
                <span className={`text-sm sm:text-base font-bold font-mono break-words ${currentReportStats.metric3.color}`}>
                  {currentReportStats.metric3.value}
                </span>
                {currentReportStats.metric3.subtext && (
                  <span className="text-[10px] text-gray-400 font-mono mt-0.5 break-words">
                    {currentReportStats.metric3.subtext}
                  </span>
                )}
              </div>
              <div className="p-2.5 rounded-lg bg-[#12231B] border border-[#2C5240] min-w-0 flex flex-col justify-center">
                <span className="text-[9px] text-gray-400 font-mono block truncate">{currentReportStats.metric4.label}</span>
                <span className={`text-sm sm:text-base font-bold font-mono break-words ${currentReportStats.metric4.color}`}>
                  {currentReportStats.metric4.value}
                </span>
                {currentReportStats.metric4.subtext && (
                  <span className="text-[10px] text-gray-400 font-mono mt-0.5 break-words">
                    {currentReportStats.metric4.subtext}
                  </span>
                )}
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
              {(selectedType === 'TASK_SUMMARY' || selectedType === 'TASKS_OPERATIONS') && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">SDO Ref</th>
                      <th className="py-2.5 px-3">Sampling / Production Task</th>
                      <th className="py-2.5 px-3">Partner Factory Hub</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Target Date</th>
                      <th className="py-2.5 px-3">QC Status</th>
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

              {/* Tasks In Progress Table (14 active lines) */}
              {selectedType === 'TASKS_IN_PROGRESS' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Line Code</th>
                      <th className="py-2.5 px-3">Active Line / Milestone</th>
                      <th className="py-2.5 px-3">Sector</th>
                      <th className="py-2.5 px-3">Factory Partner</th>
                      <th className="py-2.5 px-3">Merchant Lead</th>
                      <th className="py-2.5 px-3">Target Date</th>
                      <th className="py-2.5 px-3 text-center">Progress %</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {inProgressLines.map((l) => (
                      <tr key={l.code} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{l.code}</td>
                        <td className="py-2 px-3 text-gray-200 font-semibold">{l.name}</td>
                        <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">{l.sector}</span></td>
                        <td className="py-2 px-3 text-cyan-300">{l.factory}</td>
                        <td className="py-2 px-3 text-gray-300">{l.lead}</td>
                        <td className="py-2 px-3 text-gray-400">{l.targetDate}</td>
                        <td className="py-2 px-3 text-center font-bold text-emerald-400">{l.progressPct}%</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[9px] font-bold">
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Tasks By Assignee Table */}
              {selectedType === 'TASKS_BY_ASSIGNEE' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Staff Member</th>
                      <th className="py-2.5 px-3">Enterprise Role / Department</th>
                      <th className="py-2.5 px-3 text-right">Active Tasks</th>
                      <th className="py-2.5 px-3 text-right">Completed</th>
                      <th className="py-2.5 px-3 text-right">Logged Hours</th>
                      <th className="py-2.5 px-3 text-center">Efficiency Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {assigneeWorkload.map((a) => (
                      <tr key={a.name} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{a.name}</td>
                        <td className="py-2 px-3 text-cyan-300">{a.role}</td>
                        <td className="py-2 px-3 text-right text-amber-300 font-bold">{a.activeTasks}</td>
                        <td className="py-2 px-3 text-right text-emerald-400 font-bold">{a.completedTasks}</td>
                        <td className="py-2 px-3 text-right text-white font-bold">{a.loggedHours} hrs</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                            {a.efficiencyPct}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* All Tasks Master Log Table */}
              {selectedType === 'ALL_TASKS' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Task ID</th>
                      <th className="py-2.5 px-3">Milestone Title</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-center">Priority</th>
                      <th className="py-2.5 px-3">Assignee</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {tasksMaster.slice(0, 10).map((t) => (
                      <tr key={t.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{t.id}</td>
                        <td className="py-2 px-3 text-gray-200 font-semibold">{t.title}</td>
                        <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-white/5 text-gray-300 text-[9px] font-bold">{t.category}</span></td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            t.priority === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            t.priority === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-cyan-300">{t.assignee}</td>
                        <td className="py-2 px-3 text-gray-400">{t.dueDate}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Spent Time Weekly Table (182.5 hrs logged) */}
              {selectedType === 'SPENT_TIME_WEEKLY' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Merchant Lead</th>
                      <th className="py-2.5 px-3">Job / SDO Ref</th>
                      <th className="py-2.5 px-3">Sector</th>
                      <th className="py-2.5 px-3">Operational Activity</th>
                      <th className="py-2.5 px-3 text-right">Logged Hours</th>
                      <th className="py-2.5 px-3 text-center">Billable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {weeklyTimeLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 text-gray-400">{log.date}</td>
                        <td className="py-2 px-3 font-bold text-white">{log.user}</td>
                        <td className="py-2 px-3 text-[#C8A96A] font-bold">{log.sdoRef}</td>
                        <td className="py-2 px-3 text-cyan-300">{log.sector}</td>
                        <td className="py-2 px-3 text-gray-200">{log.description}</td>
                        <td className="py-2 px-3 text-right text-emerald-400 font-bold">{log.hours.toFixed(1)} hrs</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">
                            {log.billable ? 'YES' : 'INTERNAL'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Estimated / Spent Time All Tasks Table */}
              {selectedType === 'ESTIMATED_SPENT_ALL' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Job / SDO Ref</th>
                      <th className="py-2.5 px-3">Milestone Description</th>
                      <th className="py-2.5 px-3">Sector</th>
                      <th className="py-2.5 px-3 text-right">Planned Time</th>
                      <th className="py-2.5 px-3 text-right">Actual Spent</th>
                      <th className="py-2.5 px-3 text-center">Variance Hours</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {timeVarianceData.map((tv) => (
                      <tr key={tv.ref} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{tv.ref}</td>
                        <td className="py-2 px-3 text-gray-200">{tv.desc}</td>
                        <td className="py-2 px-3 text-cyan-300">{tv.sector}</td>
                        <td className="py-2 px-3 text-right text-gray-400">{tv.plannedHours} hrs</td>
                        <td className="py-2 px-3 text-right font-bold text-white">{tv.actualHours} hrs</td>
                        <td className={`py-2 px-3 text-center font-bold ${tv.varianceHours <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tv.varianceHours > 0 ? `+${tv.varianceHours}` : tv.varianceHours} hrs
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            tv.status === 'UNDER_BUDGET' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {tv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* SDO Sampling Variance Table */}
              {selectedType === 'SDO_SAMPLING_VARIANCE' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">SDO Number</th>
                      <th className="py-2.5 px-3">Sector</th>
                      <th className="py-2.5 px-3">Buyer Client</th>
                      <th className="py-2.5 px-3">Product Title</th>
                      <th className="py-2.5 px-3 text-right">Target Days</th>
                      <th className="py-2.5 px-3 text-right">Actual Days</th>
                      <th className="py-2.5 px-3 text-center">Variance</th>
                      <th className="py-2.5 px-3 text-center">QC Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {sdoVarianceData.map((s) => (
                      <tr key={s.sdoNumber} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{s.sdoNumber}</td>
                        <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">{s.sector}</span></td>
                        <td className="py-2 px-3 font-bold text-gray-200">{s.buyer}</td>
                        <td className="py-2 px-3 text-gray-300">{s.product}</td>
                        <td className="py-2 px-3 text-right text-gray-400">{s.targetDays} d</td>
                        <td className="py-2 px-3 text-right font-bold text-white">{s.actualDays} d</td>
                        <td className={`py-2 px-3 text-center font-bold ${s.varianceDays <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {s.varianceDays > 0 ? `+${s.varianceDays}` : s.varianceDays} d
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">
                            {s.qcStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* CRM Accounts Report Table (254 Qualified Accounts) */}
              {selectedType === 'CRM_ACCOUNTS_REPORT' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Lead ID</th>
                      <th className="py-2.5 px-3">Buyer Enterprise</th>
                      <th className="py-2.5 px-3">Country</th>
                      <th className="py-2.5 px-3">Primary Contact</th>
                      <th className="py-2.5 px-3">Email Address</th>
                      <th className="py-2.5 px-3 text-right">Annual Potential ({selectedCurrency})</th>
                      <th className="py-2.5 px-3 text-center">Account Stage</th>
                      <th className="py-2.5 px-3">Lead Owner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {crmAccountsData.slice(0, 10).map((c) => (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{c.id}</td>
                        <td className="py-2 px-3 text-gray-200 font-semibold">{c.company}</td>
                        <td className="py-2 px-3 text-cyan-300">{c.country}</td>
                        <td className="py-2 px-3 text-gray-300">{c.contactPerson}</td>
                        <td className="py-2 px-3 text-gray-400 text-[10px]">{c.email}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-400">{formatCurr(c.annualBuyingPotentialUsd)}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[9px] font-bold">
                            {c.stage}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-gray-300">{c.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* CRM Pipeline & Opportunities Funnel Table */}
              {(selectedType === 'CRM_OPPORTUNITIES_FUNNEL' || selectedType === 'CRM_PIPELINE') && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Deal Ref</th>
                      <th className="py-2.5 px-3">Wholesale Retail Buyer</th>
                      <th className="py-2.5 px-3">Market Region</th>
                      <th className="py-2.5 px-3">Opportunity Title</th>
                      <th className="py-2.5 px-3">Pipeline Stage</th>
                      <th className="py-2.5 px-3 text-right">Contract GMV ({selectedCurrency})</th>
                      <th className="py-2.5 px-3 text-center">Win %</th>
                      <th className="py-2.5 px-3 text-right">Weighted Forecast</th>
                      <th className="py-2.5 px-3 text-right">Close Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {crmOpportunitiesData.map((c) => (
                      <tr key={c.ref} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{c.ref}</td>
                        <td className="py-2 px-3 text-gray-200 font-semibold">{c.buyer}</td>
                        <td className="py-2 px-3 text-cyan-300">{c.market}</td>
                        <td className="py-2 px-3 text-gray-300 truncate max-w-[130px]">{c.title}</td>
                        <td className="py-2 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            c.stage === 'Contract Signed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            c.stage === 'Sampling Review' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                            'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {c.stage}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-400">{formatCurr(c.valueUsd)}</td>
                        <td className="py-2 px-3 text-center text-[#C8A96A] font-bold">{c.winPct}%</td>
                        <td className="py-2 px-3 text-right font-bold text-[#C8A96A]">{formatCurr(c.weightedUsd)}</td>
                        <td className="py-2 px-3 text-right text-gray-400">{c.closeDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Payments Disbursements Ledger Table */}
              {selectedType === 'PAYMENTS_DISBURSEMENTS' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Voucher #</th>
                      <th className="py-2.5 px-3">Disbursement Date</th>
                      <th className="py-2.5 px-3">Party / Beneficiary</th>
                      <th className="py-2.5 px-3">Station Bank</th>
                      <th className="py-2.5 px-3">Account Head</th>
                      <th className="py-2.5 px-3 text-right">Amount Disbursed ({selectedCurrency})</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {filteredVouchers.filter((v) => v.type === 'CASH_PURCHASE').slice(0, 10).map((v) => {
                      const convertedAmt = Math.round((v.totalAmountBdt / 121.5) * currentRate.rate);
                      return (
                        <tr key={v.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-2 px-3 font-bold text-white">{v.voucherNumber}</td>
                          <td className="py-2 px-3 text-gray-400">{v.date}</td>
                          <td className="py-2 px-3 font-bold text-gray-200">{v.partyName}</td>
                          <td className="py-2 px-3 text-cyan-300">{v.stationBankName || 'Eastern Bank PLC'}</td>
                          <td className="py-2 px-3 text-gray-300 truncate max-w-[150px]">{v.mainAccountHead}</td>
                          <td className="py-2 px-3 text-right font-bold text-rose-400">
                            -{currentRate.symbol} {convertedAmt.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">
                              SETTLED
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* Upcoming Expenses 30-Day Commitments Table */}
              {selectedType === 'UPCOMING_EXPENSES_COMMITMENTS' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Commitment Ref</th>
                      <th className="py-2.5 px-3">Factory / Vendor</th>
                      <th className="py-2.5 px-3">Expense Category</th>
                      <th className="py-2.5 px-3">Payment Terms</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3 text-right">Commitment Amount ({selectedCurrency})</th>
                      <th className="py-2.5 px-3 text-center">Station</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {upcomingExpensesData.map((exp) => (
                      <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{exp.id}</td>
                        <td className="py-2 px-3 font-bold text-gray-200">{exp.vendor}</td>
                        <td className="py-2 px-3 text-cyan-300">{exp.category}</td>
                        <td className="py-2 px-3 text-gray-300">{exp.terms}</td>
                        <td className="py-2 px-3 text-amber-300 font-bold">{exp.dueDate}</td>
                        <td className="py-2 px-3 text-right font-bold text-rose-400">{formatCurr(exp.amountUsd)}</td>
                        <td className="py-2 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-white/5 text-gray-300 text-[9px] font-bold">{exp.station}</span></td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[9px] font-bold">
                            {exp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Upcoming Income Milestone LC Installments Table */}
              {selectedType === 'UPCOMING_INCOME_MILESTONES' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Milestone Ref</th>
                      <th className="py-2.5 px-3">Buyer Account</th>
                      <th className="py-2.5 px-3">LC / SO Contract</th>
                      <th className="py-2.5 px-3">Tranche Milestone</th>
                      <th className="py-2.5 px-3">Target Date</th>
                      <th className="py-2.5 px-3 text-right">Milestone Amount ({selectedCurrency})</th>
                      <th className="py-2.5 px-3 text-center">Payment Route</th>
                      <th className="py-2.5 px-3 text-center">LC Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {upcomingIncomeData.map((inc) => (
                      <tr key={inc.ref} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{inc.ref}</td>
                        <td className="py-2 px-3 font-bold text-gray-200">{inc.buyer}</td>
                        <td className="py-2 px-3 text-[#C8A96A] font-bold">{inc.lcNumber}</td>
                        <td className="py-2 px-3 text-gray-300">{inc.milestone}</td>
                        <td className="py-2 px-3 text-emerald-300 font-bold">{inc.dueDate}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-400">{formatCurr(inc.amountUsd)}</td>
                        <td className="py-2 px-3 text-center"><span className="px-1.5 py-0.5 rounded bg-white/5 text-cyan-300 text-[9px] font-bold">{inc.channel}</span></td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">
                            {inc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Project Cash Flow Allocation Table */}
              {selectedType === 'PROJECT_CASH_FLOW_ALLOCATION' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Batch Ref</th>
                      <th className="py-2.5 px-3">Export Project Name</th>
                      <th className="py-2.5 px-3">Sector</th>
                      <th className="py-2.5 px-3 text-right">Inflow Revenue ({selectedCurrency})</th>
                      <th className="py-2.5 px-3 text-right">Factory COGS</th>
                      <th className="py-2.5 px-3 text-right">Freight &amp; Port</th>
                      <th className="py-2.5 px-3 text-right">Net Cash Flow</th>
                      <th className="py-2.5 px-3 text-center">Net Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {projectCashFlowData.map((pcf) => (
                      <tr key={pcf.batchRef} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{pcf.batchRef}</td>
                        <td className="py-2 px-3 font-bold text-gray-200">{pcf.name}</td>
                        <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">{pcf.sector}</span></td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-400">{formatCurr(pcf.inflowUsd)}</td>
                        <td className="py-2 px-3 text-right text-rose-300">{formatCurr(pcf.cogsUsd)}</td>
                        <td className="py-2 px-3 text-right text-gray-300">{formatCurr(pcf.freightUsd)}</td>
                        <td className="py-2 px-3 text-right font-bold text-[#C8A96A]">{formatCurr(pcf.netCashUsd)}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                            {pcf.marginPct}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Paid Tasks & QC Certificates Table */}
              {selectedType === 'PAID_TASKS_CERTIFICATES' && (
                <table className="w-full text-left text-xs font-['Open_Sans']">
                  <thead className="bg-[#12231B] text-[#C8A96A] text-[10px] font-mono uppercase border-b border-[#2C5240]">
                    <tr>
                      <th className="py-2.5 px-3">Certificate Ref</th>
                      <th className="py-2.5 px-3">Testing &amp; Inspection Task</th>
                      <th className="py-2.5 px-3">Sector</th>
                      <th className="py-2.5 px-3">Accredited Laboratory</th>
                      <th className="py-2.5 px-3">Issue Date</th>
                      <th className="py-2.5 px-3">Compliance Standard</th>
                      <th className="py-2.5 px-3 text-right">Fee Cost ({selectedCurrency})</th>
                      <th className="py-2.5 px-3 text-center">Result Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[11px] font-mono">
                    {paidTasksData.map((pt) => (
                      <tr key={pt.certRef} className="hover:bg-white/5 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{pt.certRef}</td>
                        <td className="py-2 px-3 font-bold text-gray-200">{pt.task}</td>
                        <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">{pt.sector}</span></td>
                        <td className="py-2 px-3 text-cyan-300">{pt.lab}</td>
                        <td className="py-2 px-3 text-gray-400">{pt.date}</td>
                        <td className="py-2 px-3 text-[#C8A96A] font-bold text-[10px]">{pt.standard}</td>
                        <td className="py-2 px-3 text-right font-bold text-white">{formatCurr(pt.costUsd)}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">
                            {pt.status}
                          </span>
                        </td>
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
