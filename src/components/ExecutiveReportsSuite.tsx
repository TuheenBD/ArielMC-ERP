'use client';

import React, { useState, useEffect } from 'react';
import { CompanyEntity, EntityCode, CurrencyRate } from '@/types/erp';
import { ThemeProfile } from '@/components/Sidebar';
import {
  BarChart3,
  BarChart2,
  TrendingUp,
  Target,
  Smile,
  Infinity,
  Clock,
  ArrowLeftRight,
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  ClipboardCheck,
  CreditCard,
  History,
  FileText,
  Search,
  Filter,
  Download,
  Settings,
  Plus,
  Building2,
  ChevronRight,
  ArrowRight,
  X,
  AlertTriangle,
  FileSpreadsheet,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  Share2
} from 'lucide-react';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { OfficialDocument } from '@/types/documentPortal';
import { ReportGenerationModal, ReportType } from '@/components/ReportGenerationModal';

export type ReportCategory = 'ALL' | 'TASKS' | 'CRM' | 'PROJECTS' | 'FINANCE';
export type ReportView = 'DIRECTORY' | 'ACCOUNTS_PAYABLE' | 'CASH_FLOW' | 'PNL' | 'INVOICES';

interface VendorPayable {
  id: string;
  name: string;
  type: 'Partner Factory' | 'Raw Material Tannery' | 'Jute Mill' | 'Logistics Carrier' | 'Testing Lab';
  tag: 'Partner' | 'Vendor' | 'Subcontractor' | 'Carrier';
  openingDebitUsd: number;
  openingCreditUsd: number;
  debitTurnoverUsd: number;
  creditTurnoverUsd: number;
  station: EntityCode;
  paymentTerms: string;
  dueDate: string;
  status: 'CURRENT' | 'DUE_SOON' | 'OVERDUE' | 'CLEARED';
}

const INITIAL_VENDOR_PAYABLES: VendorPayable[] = [
  {
    id: 'vp-01',
    name: 'Apex Leather Crafts Ltd',
    type: 'Partner Factory',
    tag: 'Partner',
    openingDebitUsd: 40000.0,
    openingCreditUsd: 0.0,
    debitTurnoverUsd: 10600.0,
    creditTurnoverUsd: 2200.0,
    station: 'ARIEL_BD',
    paymentTerms: 'Net 30 Days',
    dueDate: '2026-11-15',
    status: 'CURRENT',
  },
  {
    id: 'vp-02',
    name: 'Veritas Processing Group',
    type: 'Partner Factory',
    tag: 'Partner',
    openingDebitUsd: 110300.0,
    openingCreditUsd: 0.0,
    debitTurnoverUsd: 24500.0,
    creditTurnoverUsd: 5000.0,
    station: 'ARIEL_BD',
    paymentTerms: 'Confirmed Irrevocable LC',
    dueDate: '2026-11-20',
    status: 'CURRENT',
  },
  {
    id: 'vp-03',
    name: 'Bengal Natural Jute Mills Ltd',
    type: 'Jute Mill',
    tag: 'Vendor',
    openingDebitUsd: 0.0,
    openingCreditUsd: 50000.0,
    debitTurnoverUsd: 14200.0,
    creditTurnoverUsd: 8000.0,
    station: 'ARIEL_BD',
    paymentTerms: 'Net 45 Days',
    dueDate: '2026-11-05',
    status: 'DUE_SOON',
  },
  {
    id: 'vp-04',
    name: 'Savar Tannery Environmental Lab',
    type: 'Testing Lab',
    tag: 'Subcontractor',
    openingDebitUsd: 4200.0,
    openingCreditUsd: 0.0,
    debitTurnoverUsd: 1200.0,
    creditTurnoverUsd: 0.0,
    station: 'ARIEL_BD',
    paymentTerms: 'Immediate upon Inspection Report',
    dueDate: '2026-10-31',
    status: 'DUE_SOON',
  },
  {
    id: 'vp-05',
    name: 'DHL Express International (BD)',
    type: 'Logistics Carrier',
    tag: 'Carrier',
    openingDebitUsd: 8900.0,
    openingCreditUsd: 0.0,
    debitTurnoverUsd: 3400.0,
    creditTurnoverUsd: 1200.0,
    station: 'ARIEL_BD',
    paymentTerms: 'Corporate Net 30',
    dueDate: '2026-11-10',
    status: 'CURRENT',
  },
  {
    id: 'vp-06',
    name: 'Maersk Ocean Freight Line BD',
    type: 'Logistics Carrier',
    tag: 'Carrier',
    openingDebitUsd: 19500.0,
    openingCreditUsd: 0.0,
    debitTurnoverUsd: 6000.0,
    creditTurnoverUsd: 2500.0,
    station: 'ARIEL_BD',
    paymentTerms: 'Bill of Lading Surrender',
    dueDate: '2026-11-25',
    status: 'CURRENT',
  },
];

interface ExecutiveReportsSuiteProps {
  activeEntity: CompanyEntity;
  activeCurrency: CurrencyRate;
  theme?: ThemeProfile;
  initialView?: ReportView;
}

export const ExecutiveReportsSuite: React.FC<ExecutiveReportsSuiteProps> = ({
  activeEntity,
  activeCurrency,
  theme = 'crm-green',
  initialView = 'DIRECTORY',
}) => {
  const isRoyal = theme === 'royal-blue';
  const isHydrangea = theme === 'hydrangea';
  const isCalifornia = theme === 'california-beaches';
  const isMossy = theme === 'mossy-hollow';
  const isInkWash = theme === 'ink-wash';
  const isPeach = theme === 'fresh-peach';
  const isStormy = theme === 'stormy-morning';

  const activeTabClass = isRoyal
    ? 'bg-[#1E293B] text-white shadow-2xs'
    : isHydrangea
    ? 'bg-[#341344] text-white shadow-2xs'
    : isCalifornia
    ? 'bg-[#1B2F3B] text-white shadow-2xs'
    : isMossy
    ? 'bg-[#343823] text-white shadow-2xs'
    : isInkWash
    ? 'bg-[#303438] text-white shadow-2xs'
    : isPeach
    ? 'bg-[#382622] text-white shadow-2xs'
    : isStormy
    ? 'bg-[#283542] text-white shadow-2xs'
    : 'bg-[#1F3A2E] text-white shadow-2xs';

  const generateReportBtnBg = isRoyal
    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
    : isHydrangea
    ? 'bg-gradient-to-r from-[#AD56C4] to-[#7E22CE] hover:from-[#C084FC] hover:to-[#9333EA]'
    : isCalifornia
    ? 'bg-gradient-to-r from-[#2B6B88] to-[#1E526B] hover:from-[#357F9F] hover:to-[#2B6B88]'
    : isMossy
    ? 'bg-gradient-to-r from-[#636B2F] to-[#4D5324] hover:from-[#717A35] hover:to-[#5E662D]'
    : isInkWash
    ? 'bg-gradient-to-r from-[#4A5568] to-[#2D3748] hover:from-[#5A6678] hover:to-[#3E4B5B]'
    : isPeach
    ? 'bg-gradient-to-r from-[#C87552] to-[#A3593B] hover:from-[#D98764] hover:to-[#C87552]'
    : isStormy
    ? 'bg-gradient-to-r from-[#486581] to-[#334E68] hover:from-[#5E7B98] hover:to-[#415C76]'
    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500';

  const generateStatementBtnBg = isRoyal
    ? 'bg-blue-600 hover:bg-blue-700'
    : isHydrangea
    ? 'bg-[#AD56C4] hover:bg-[#86198F]'
    : isCalifornia
    ? 'bg-[#2B6B88] hover:bg-[#20526B]'
    : isMossy
    ? 'bg-[#636B2F] hover:bg-[#515826]'
    : isInkWash
    ? 'bg-[#4A5568] hover:bg-[#374151]'
    : isPeach
    ? 'bg-[#C87552] hover:bg-[#B56543]'
    : isStormy
    ? 'bg-[#486581] hover:bg-[#384E66]'
    : 'bg-[#007A4D] hover:bg-[#00633e]';

  // Navigation State
  const [currentView, setCurrentView] = useState<ReportView>(initialView);
  const [activeCategory, setActiveCategory] = useState<ReportCategory>('ALL');

  // Filters State
  const [selectedPeriod, setSelectedPeriod] = useState('Current Month');
  const [selectedOrg, setSelectedOrg] = useState<string>('All Organizations');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);

  // Vendor Payables State
  const [payables, setPayables] = useState<VendorPayable[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('arielmc_erp_vendor_payables_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return INITIAL_VENDOR_PAYABLES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('arielmc_erp_vendor_payables_v1', JSON.stringify(payables));
    } catch {}
  }, [payables]);

  // Record Liability Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isSharePnlOpen, setIsSharePnlOpen] = useState(false);

  // Report Generation Modal State
  const [isReportGenModalOpen, setIsReportGenModalOpen] = useState(false);
  const [selectedGenReportType, setSelectedGenReportType] = useState<ReportType>('CASHFLOW_DAILY');
  const [genReportViewMode, setGenReportViewMode] = useState<'BUILDER' | 'PREVIEW'>('PREVIEW');

  const handleOpenReportModal = (type: ReportType, mode: 'BUILDER' | 'PREVIEW' = 'PREVIEW') => {
    setSelectedGenReportType(type);
    setGenReportViewMode(mode);
    setIsReportGenModalOpen(true);
  };

  // Cash Flow Statement Interactive Controls & Filter States
  const [cashFlowMode, setCashFlowMode] = useState<'CATEGORIES' | 'ACTIVITIES'>('CATEGORIES');
  const [cashFlowOrg, setCashFlowOrg] = useState<string>('ALL');
  const [cashFlowDate, setCashFlowDate] = useState<string>('DEFAULT');
  const [cashFlowType, setCashFlowType] = useState<string>('ALL');
  const [cashFlowBreakdown, setCashFlowBreakdown] = useState<'MONTHLY' | 'QUARTERLY' | 'ANNUAL'>('MONTHLY');
  const [cashFlowAccount, setCashFlowAccount] = useState<string>('ALL');

  const isCashFlowDefault = 
    cashFlowMode === 'CATEGORIES' &&
    cashFlowOrg === 'ALL' &&
    cashFlowDate === 'DEFAULT' &&
    cashFlowType === 'ALL' &&
    cashFlowBreakdown === 'MONTHLY' &&
    cashFlowAccount === 'ALL';

  const resetCashFlowFilters = () => {
    setCashFlowMode('CATEGORIES');
    setCashFlowOrg('ALL');
    setCashFlowDate('DEFAULT');
    setCashFlowType('ALL');
    setCashFlowBreakdown('MONTHLY');
    setCashFlowAccount('ALL');
  };

  const orgMultiplier = cashFlowOrg === 'ARIEL_BD' ? 0.55
    : cashFlowOrg === 'ARIEL_UK' ? 0.25
    : cashFlowOrg === 'ARIEL_US' ? 0.15
    : cashFlowOrg === 'ARIEL_EU' ? 0.08
    : cashFlowOrg === 'ARIEL_AU' ? 0.05
    : 1.0;

  const orgLabel = cashFlowOrg === 'ARIEL_BD' ? 'ArielMC BD (Dhaka Sourcing HQ)'
    : cashFlowOrg === 'ARIEL_UK' ? 'ArielMC UK (London Mayfair)'
    : cashFlowOrg === 'ARIEL_US' ? 'ArielMC US (New York / Delaware)'
    : cashFlowOrg === 'ARIEL_EU' ? 'ArielMC EU (Frankfurt / Amsterdam)'
    : cashFlowOrg === 'ARIEL_AU' ? 'ArielMC AU (Sydney)'
    : 'All Global Stations (Consolidated)';

  const handleDownloadCashFlowCsv = () => {
    const isActivities = cashFlowMode === 'ACTIVITIES';
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (cashFlowBreakdown === 'QUARTERLY') {
      headers = ['Category / Activity', 'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Total FY 2026'];
      if (!isActivities) {
        rows = [
          ['Opening Cash Balance', Math.round(59000 * orgMultiplier), Math.round(72500 * orgMultiplier), Math.round(94000 * orgMultiplier), Math.round(118000 * orgMultiplier), Math.round(59000 * orgMultiplier)],
          ['Revenue - Services (Bespoke & Sourcing)', Math.round(32000 * orgMultiplier), Math.round(48000 * orgMultiplier), Math.round(62000 * orgMultiplier), Math.round(78000 * orgMultiplier), Math.round(220000 * orgMultiplier)],
          ['Revenue - Products (Leather, Jute, Textiles, Ceramics, Pottery)', Math.round(85000 * orgMultiplier), Math.round(142000 * orgMultiplier), Math.round(188000 * orgMultiplier), Math.round(235000 * orgMultiplier), Math.round(650000 * orgMultiplier)],
          ['COGS - Materials & Raw Supplies', Math.round(-42000 * orgMultiplier), Math.round(-68000 * orgMultiplier), Math.round(-88000 * orgMultiplier), Math.round(-112000 * orgMultiplier), Math.round(-310000 * orgMultiplier)],
          ['COGS - Delivery & Freight (Sea & Air)', Math.round(-14000 * orgMultiplier), Math.round(-22000 * orgMultiplier), Math.round(-29000 * orgMultiplier), Math.round(-36000 * orgMultiplier), Math.round(-101000 * orgMultiplier)],
          ['COGS - Subcontractors & Factory QA', Math.round(-18000 * orgMultiplier), Math.round(-26000 * orgMultiplier), Math.round(-34000 * orgMultiplier), Math.round(-42000 * orgMultiplier), Math.round(-120000 * orgMultiplier)],
          ['Operating Overhead (Lease & Admin)', Math.round(-9500 * orgMultiplier), Math.round(-14500 * orgMultiplier), Math.round(-18000 * orgMultiplier), Math.round(-23000 * orgMultiplier), Math.round(-65000 * orgMultiplier)],
          ['Net Operating Cash Flow', Math.round(33500 * orgMultiplier), Math.round(59500 * orgMultiplier), Math.round(81000 * orgMultiplier), Math.round(100000 * orgMultiplier), Math.round(274000 * orgMultiplier)],
          ['Closing Cash Balance', Math.round(92500 * orgMultiplier), Math.round(132000 * orgMultiplier), Math.round(175000 * orgMultiplier), Math.round(218000 * orgMultiplier), Math.round(218000 * orgMultiplier)],
        ];
      } else {
        rows = [
          ['OPERATING ACTIVITIES: Inflows from Customers', Math.round(117000 * orgMultiplier), Math.round(190000 * orgMultiplier), Math.round(250000 * orgMultiplier), Math.round(313000 * orgMultiplier), Math.round(870000 * orgMultiplier)],
          ['OPERATING ACTIVITIES: Payments to Suppliers & Tanneries', Math.round(-74000 * orgMultiplier), Math.round(-116000 * orgMultiplier), Math.round(-151000 * orgMultiplier), Math.round(-190000 * orgMultiplier), Math.round(-531000 * orgMultiplier)],
          ['OPERATING ACTIVITIES: Operational Freight & QA', Math.round(-18000 * orgMultiplier), Math.round(-26000 * orgMultiplier), Math.round(-34000 * orgMultiplier), Math.round(-42000 * orgMultiplier), Math.round(-120000 * orgMultiplier)],
          ['Net Cash from Operating Activities', Math.round(25000 * orgMultiplier), Math.round(48000 * orgMultiplier), Math.round(65000 * orgMultiplier), Math.round(81000 * orgMultiplier), Math.round(219000 * orgMultiplier)],
          ['INVESTING ACTIVITIES: Tooling, Moulds & Hardware', Math.round(-8000 * orgMultiplier), Math.round(-12000 * orgMultiplier), Math.round(-15000 * orgMultiplier), Math.round(-18000 * orgMultiplier), Math.round(-53000 * orgMultiplier)],
          ['FINANCING ACTIVITIES: Inter-station Working Capital & LC', Math.round(-3500 * orgMultiplier), Math.round(-5000 * orgMultiplier), Math.round(-6000 * orgMultiplier), Math.round(-8000 * orgMultiplier), Math.round(-22500 * orgMultiplier)],
          ['Net Increase in Cash & Equivalents', Math.round(13500 * orgMultiplier), Math.round(31000 * orgMultiplier), Math.round(44000 * orgMultiplier), Math.round(55000 * orgMultiplier), Math.round(143500 * orgMultiplier)],
          ['Closing Cash & Equivalents', Math.round(72500 * orgMultiplier), Math.round(103500 * orgMultiplier), Math.round(147500 * orgMultiplier), Math.round(202500 * orgMultiplier), Math.round(202500 * orgMultiplier)],
        ];
      }
    } else if (cashFlowBreakdown === 'ANNUAL') {
      headers = ['Category / Activity', 'FY 2024 Actual', 'FY 2025 Actual', 'FY 2026 Budget', 'FY 2026 Projected', 'Variance'];
      if (!isActivities) {
        rows = [
          ['Opening Cash Balance', Math.round(42000 * orgMultiplier), Math.round(48000 * orgMultiplier), Math.round(59000 * orgMultiplier), Math.round(59000 * orgMultiplier), '0.0%'],
          ['Revenue - Services', Math.round(110000 * orgMultiplier), Math.round(165000 * orgMultiplier), Math.round(200000 * orgMultiplier), Math.round(220000 * orgMultiplier), '+10.0%'],
          ['Revenue - Products', Math.round(350000 * orgMultiplier), Math.round(490000 * orgMultiplier), Math.round(600000 * orgMultiplier), Math.round(650000 * orgMultiplier), '+8.3%'],
          ['COGS - Raw Materials', Math.round(-180000 * orgMultiplier), Math.round(-245000 * orgMultiplier), Math.round(-295000 * orgMultiplier), Math.round(-310000 * orgMultiplier), '+5.1%'],
          ['COGS - Delivery & Freight', Math.round(-55000 * orgMultiplier), Math.round(-78000 * orgMultiplier), Math.round(-95000 * orgMultiplier), Math.round(-101000 * orgMultiplier), '+6.3%'],
          ['COGS - Subcontractors & QA', Math.round(-65000 * orgMultiplier), Math.round(-92000 * orgMultiplier), Math.round(-112000 * orgMultiplier), Math.round(-120000 * orgMultiplier), '+7.1%'],
          ['Net Operating Cash Flow', Math.round(160000 * orgMultiplier), Math.round(230000 * orgMultiplier), Math.round(298000 * orgMultiplier), Math.round(339000 * orgMultiplier), '+13.8%'],
        ];
      } else {
        rows = [
          ['Cash generated from Operations', Math.round(160000 * orgMultiplier), Math.round(230000 * orgMultiplier), Math.round(298000 * orgMultiplier), Math.round(339000 * orgMultiplier), '+13.8%'],
          ['Cash used in Investing Activities', Math.round(-35000 * orgMultiplier), Math.round(-45000 * orgMultiplier), Math.round(-50000 * orgMultiplier), Math.round(-53000 * orgMultiplier), '+6.0%'],
          ['Cash from Financing Activities', Math.round(-15000 * orgMultiplier), Math.round(-18000 * orgMultiplier), Math.round(-20000 * orgMultiplier), Math.round(-22500 * orgMultiplier), '+12.5%'],
          ['Net Increase in Cash & Equivalents', Math.round(110000 * orgMultiplier), Math.round(167000 * orgMultiplier), Math.round(228000 * orgMultiplier), Math.round(263500 * orgMultiplier), '+15.6%'],
        ];
      }
    } else {
      const months = ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026'];
      headers = ['Category / Item', ...months, 'Balance'];
      if (!isActivities) {
        rows = [
          ['Opening Cash Balance', 59000, 59000, 59000, 59000, 59000, 59000, 59000, 59000, 59000, 59000, 59000].map(v => typeof v === 'number' ? Math.round(v * orgMultiplier) : v),
          ['Revenue - Services', 12500, 14000, 15500, 17000, 18500, 20000, 21500, 23000, 24500, 26000, 192500].map(v => typeof v === 'number' ? Math.round(v * orgMultiplier) : v),
          ['Revenue - Products', 28000, 32200, 36400, 40600, 44800, 49000, 53200, 57400, 61600, 65800, 469000].map(v => typeof v === 'number' ? Math.round(v * orgMultiplier) : v),
          ['COGS - Raw Materials', -14000, -15800, -17600, -19400, -21200, -23000, -24800, -26600, -28400, -30200, -221000].map(v => typeof v === 'number' ? Math.round(v * orgMultiplier) : v),
          ['COGS - Delivery & Freight', -4500, -5100, -5700, -6300, -6900, -7500, -8100, -8700, -9300, -9900, -72000].map(v => typeof v === 'number' ? Math.round(v * orgMultiplier) : v),
          ['COGS - Subcontractors & QA', -6200, -7000, -7800, -8600, -9400, -10200, -11000, -11800, -12600, -13400, -98000].map(v => typeof v === 'number' ? Math.round(v * orgMultiplier) : v),
          ['Net Cashflow', 15800, 18300, 20800, 23300, 25800, 28300, 30800, 33300, 35800, 38300, 270500].map(v => typeof v === 'number' ? Math.round(v * orgMultiplier) : v),
        ];
      } else {
        rows = [
          ['OPERATING: Inflows from Customers', 40500, 46200, 51900, 57600, 63300, 69000, 74700, 80400, 86100, 91800, 661500].map(v => typeof v === 'number' ? Math.round(v * orgMultiplier) : v),
          ['OPERATING: Supplier Outflows', -20200, -22800, -25400, -28000, -30600, -33200, -35800, -38400, -41000, -43600, -319000].map(v => typeof v === 'number' ? Math.round(v * orgMultiplier) : v),
          ['OPERATING: Freight & Logistics', -4500, -5100, -5700, -6300, -6900, -7500, -8100, -8700, -9300, -9900, -72000].map(v => typeof v === 'number' ? Math.round(v * orgMultiplier) : v),
          ['INVESTING: Moulds & QA Tooling', -3000, -3500, -4000, -4500, -5000, -5500, -6000, -6500, -7000, -7500, -52500].map(v => typeof v === 'number' ? Math.round(v * orgMultiplier) : v),
          ['FINANCING: LC Settlements & Wire', -1500, -1800, -2100, -2400, -2700, -3000, -3300, -3600, -3900, -4200, -28500].map(v => typeof v === 'number' ? Math.round(v * orgMultiplier) : v),
          ['Net Increase in Cash', 11300, 13000, 14700, 16400, 18100, 19800, 21500, 23200, 24900, 26600, 189500].map(v => typeof v === 'number' ? Math.round(v * orgMultiplier) : v),
        ];
      }
    }

    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ArielMC_CashFlow_${cashFlowMode}_${cashFlowOrg}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const [newLiability, setNewLiability] = useState({
    vendorName: 'Apex Leather Crafts Ltd',
    type: 'Partner Factory' as const,
    amountUsd: 10600,
    paymentTerms: 'Net 30 Days',
    invoiceNumber: 'INV-APEX-2026-881',
    dueDate: '2026-11-30',
    description: 'Leather Batch Sourcing & Production Balance',
    station: activeEntity.code,
  });

  const handleRecordLiabilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: VendorPayable = {
      id: `vp-${Date.now()}`,
      name: newLiability.vendorName,
      type: newLiability.type,
      tag: 'Partner',
      openingDebitUsd: Number(newLiability.amountUsd),
      openingCreditUsd: 0,
      debitTurnoverUsd: Number(newLiability.amountUsd),
      creditTurnoverUsd: 0,
      station: newLiability.station,
      paymentTerms: newLiability.paymentTerms,
      dueDate: newLiability.dueDate,
      status: 'CURRENT',
    };
    setPayables((prev) => [created, ...prev]);
    setIsRecordModalOpen(false);
  };

  // Filtered Payables
  const filteredPayables = payables.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrg = selectedOrg === 'All Organizations' || p.station === selectedOrg;
    return matchesSearch && matchesOrg;
  });

  // Calculate Accounts Payable KPI aggregates
  const totalOpeningDebit = filteredPayables.reduce((acc, curr) => acc + curr.openingDebitUsd, 0);
  const totalDebitTurnover = filteredPayables.reduce((acc, curr) => acc + curr.debitTurnoverUsd, 0);
  const totalCreditTurnover = filteredPayables.reduce((acc, curr) => acc + curr.creditTurnoverUsd, 0);
  const totalOutstandingDebt = totalDebitTurnover - totalCreditTurnover;

  const toggleSelectAll = () => {
    if (selectedVendorIds.length === filteredPayables.length) {
      setSelectedVendorIds([]);
    } else {
      setSelectedVendorIds(filteredPayables.map((p) => p.id));
    }
  };

  const toggleSelectVendor = (id: string) => {
    if (selectedVendorIds.includes(id)) {
      setSelectedVendorIds(selectedVendorIds.filter((item) => item !== id));
    } else {
      setSelectedVendorIds([...selectedVendorIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Global Reports Breadcrumb Navigation */}
      <div className="bg-white border border-[#DDE3DD] rounded-xl px-4 py-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-medium">
          <button
            onClick={() => setCurrentView('DIRECTORY')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              currentView === 'DIRECTORY'
                ? activeTabClass
                : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50'
            }`}
          >
            All Reports
          </button>
          <span className="text-slate-300">/</span>

          <button
            onClick={() => setCurrentView('CASH_FLOW')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              currentView === 'CASH_FLOW'
                ? activeTabClass
                : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50'
            }`}
          >
            Cash Flow
          </button>

          <button
            onClick={() => setCurrentView('PNL')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              currentView === 'PNL'
                ? activeTabClass
                : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50'
            }`}
          >
            Profit & Loss
          </button>

          <button
            onClick={() => setCurrentView('INVOICES')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              currentView === 'INVOICES'
                ? activeTabClass
                : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50'
            }`}
          >
            Invoices
          </button>

          <button
            onClick={() => setCurrentView('ACCOUNTS_PAYABLE')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              currentView === 'ACCOUNTS_PAYABLE'
                ? activeTabClass
                : 'text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-50'
            }`}
          >
            Accounts Payable to Vendors
          </button>
        </div>

        {/* Quick Context Pill & Generate Report Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenReportModal('CASHFLOW_DAILY', 'BUILDER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${generateReportBtnBg} text-white font-bold text-xs shadow-sm transition-all cursor-pointer font-['Montserrat']`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>+ Generate Report</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] text-[#6B7269] font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              {activeEntity.code}
            </span>
            <span>{activeEntity.city}</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: REPORTS DIRECTORY HUB (Matching Screenshots 1 & 3) */}
      {currentView === 'DIRECTORY' && (
        <div className="space-y-6">
          {/* Header Banner & Category Filter Tabs */}
          <div className="bg-white border border-[#DDE3DD] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold font-heading text-[#1F3A2E]">
                  Reports
                </h1>
                <p className="text-xs text-[#6B7269] mt-1">
                  Centralized multi-entity analytics, production lead times, CRM pipeline conversions, and statutory finance statements.
                </p>
              </div>

              {/* Category Filter Pills (All, Tasks, CRM, Projects, Finance) */}
              <div className="flex items-center gap-1.5 p-1 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl text-xs font-semibold overflow-x-auto">
                {(['ALL', 'TASKS', 'CRM', 'PROJECTS', 'FINANCE'] as ReportCategory[]).map((cat) => {
                  const label =
                    cat === 'ALL'
                      ? 'All'
                      : cat === 'TASKS'
                      ? 'Tasks'
                      : cat === 'CRM'
                      ? 'CRM'
                      : cat === 'PROJECTS'
                      ? 'Projects'
                      : 'Finance';
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeCategory === cat
                          ? 'bg-white text-[#1F3A2E] shadow-xs font-bold border border-[#DDE3DD]'
                          : 'text-[#6B7269] hover:text-[#1F3A2E]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: TASKS */}
          {(activeCategory === 'ALL' || activeCategory === 'TASKS') && (
            <div className="space-y-3">
              <h2 className="text-base font-bold font-heading text-[#1F3A2E] flex items-center gap-2">
                <span>Tasks</span>
                <span className="text-xs font-normal text-[#6B7269] font-mono">(7 Reports)</span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div
                  onClick={() => handleOpenReportModal('TASK_SUMMARY')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate Task Summary Report"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      Task Summary
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">Status &amp; milestones</p>
                  </div>
                </div>

                <div
                  onClick={() => handleOpenReportModal('TASKS_IN_PROGRESS')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate Tasks In Progress Report"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-3 group-hover:scale-105 transition-transform">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      Tasks In Progress
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">14 line active</p>
                  </div>
                </div>

                <div
                  onClick={() => handleOpenReportModal('TASKS_BY_ASSIGNEE')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate Tasks By Assignee Report"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-105 transition-transform">
                    <Smile className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      Tasks By Assignee
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">Merchant allocation</p>
                  </div>
                </div>

                <div
                  onClick={() => handleOpenReportModal('ALL_TASKS')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate All Tasks Master Report"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-3 group-hover:scale-105 transition-transform">
                    <Infinity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      All Tasks
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">Master log</p>
                  </div>
                </div>

                <div
                  onClick={() => handleOpenReportModal('SPENT_TIME_WEEKLY')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate Spent Time Weekly Report"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-3 group-hover:scale-105 transition-transform">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      Spent Time Weekly
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">182.5 hrs logged</p>
                  </div>
                </div>

                <div
                  onClick={() => handleOpenReportModal('ESTIMATED_SPENT_ALL')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate Estimated vs Spent Time Report"
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-3 group-hover:scale-105 transition-transform">
                    <ArrowLeftRight className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      Estimated/Spent Time (All Tasks)
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">Planned vs actual</p>
                  </div>
                </div>

                <div
                  onClick={() => handleOpenReportModal('SDO_SAMPLING_VARIANCE')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate SDO Sampling Variance Report"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 group-hover:scale-105 transition-transform">
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      Estimated/Spent Time...
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">SDO sampling variance</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: CRM */}
          {(activeCategory === 'ALL' || activeCategory === 'CRM') && (
            <div className="space-y-3">
              <h2 className="text-base font-bold font-heading text-[#1F3A2E] flex items-center gap-2">
                <span>CRM</span>
                <span className="text-xs font-normal text-[#6B7269] font-mono">(2 Reports)</span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  onClick={() => handleOpenReportModal('CRM_ACCOUNTS_REPORT')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate CRM Lead Report"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-3 group-hover:scale-105 transition-transform">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      CRM Report
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">254 Qualified Accounts</p>
                  </div>
                </div>

                <div
                  onClick={() => handleOpenReportModal('CRM_OPPORTUNITIES_FUNNEL')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate All Opportunities Pipeline Report"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-105 transition-transform">
                    <Infinity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      All Opportunities
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">US/UK/EU Pipeline Funnel</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: PROJECTS */}
          {(activeCategory === 'ALL' || activeCategory === 'PROJECTS') && (
            <div className="space-y-3">
              <h2 className="text-base font-bold font-heading text-[#1F3A2E] flex items-center gap-2">
                <span>Projects</span>
                <span className="text-xs font-normal text-[#6B7269] font-mono">(5 Reports)</span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div
                  onClick={() => handleOpenReportModal('PAYMENTS_DISBURSEMENTS')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate Payments Disbursement Ledger"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-105 transition-transform">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      Payments
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">Disbursements ledger</p>
                  </div>
                </div>

                <div
                  onClick={() => handleOpenReportModal('UPCOMING_EXPENSES_COMMITMENTS')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate Upcoming Expenses Report"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-105 transition-transform">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      Upcoming Expenses
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">30-day factory commitments</p>
                  </div>
                </div>

                <div
                  onClick={() => handleOpenReportModal('UPCOMING_INCOME_MILESTONES')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate Upcoming Income & Receivables Report"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-3 group-hover:scale-105 transition-transform">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      Upcoming Income
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">Milestone LC installments</p>
                  </div>
                </div>

                <div
                  onClick={() => handleOpenReportModal('PROJECT_CASH_FLOW_ALLOCATION')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate Project Cash Flow Report"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-3 group-hover:scale-105 transition-transform">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      Project Cash Flow
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">Per-batch allocation</p>
                  </div>
                </div>

                <div
                  onClick={() => handleOpenReportModal('PAID_TASKS_CERTIFICATES')}
                  className="p-4 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  title="Generate Paid Tasks & QC Certificates Report"
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-3 group-hover:scale-105 transition-transform">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors leading-snug">
                      Paid Tasks
                    </h3>
                    <p className="text-[10px] text-[#6B7269] mt-1">AQL &amp; lab certificates</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: FINANCE (Matching Screenshot 3) */}
          {(activeCategory === 'ALL' || activeCategory === 'FINANCE') && (
            <div className="space-y-3">
              <h2 className="text-base font-bold font-heading text-[#1F3A2E] flex items-center gap-2">
                <span>Finance</span>
                <span className="text-xs font-normal text-[#6B7269] font-mono">(4 Core Statements)</span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. Cash Flow */}
                <div
                  onClick={() => setCurrentView('CASH_FLOW')}
                  className="p-5 rounded-2xl bg-white border border-[#DDE3DD] hover:border-[#1E6B3A] hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform shadow-xs">
                    <ArrowLeftRight className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors">
                      Cash Flow
                    </h3>
                    <p className="text-xs text-[#6B7269] mt-1 leading-relaxed">
                      12-Month Calendar Matrix with Opening Cash Balance ($59,000.00).
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#1E6B3A]">
                    <span>View Matrix Table</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. Profit & Loss */}
                <div
                  onClick={() => setCurrentView('PNL')}
                  className="p-5 rounded-2xl bg-white border border-[#DDE3DD] hover:border-[#8A6D3B] hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform shadow-xs">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1F3A2E] group-hover:text-[#8A6D3B] transition-colors">
                      Profit & Loss
                    </h3>
                    <p className="text-xs text-[#6B7269] mt-1 leading-relaxed">
                      Revenue, COGS, Operating Costs & Accumulated Financial Results.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#8A6D3B]">
                    <span>View 12-Month P&L</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 3. Invoices */}
                <div
                  onClick={() => setCurrentView('INVOICES')}
                  className="p-5 rounded-2xl bg-white border border-[#DDE3DD] hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform shadow-xs">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1F3A2E] group-hover:text-blue-600 transition-colors">
                      Invoices
                    </h3>
                    <p className="text-xs text-[#6B7269] mt-1 leading-relaxed">
                      B2B Commercial Invoices, Mushak 6.3 Tax, and Payment Tracking.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600">
                    <span>Manage Receivables</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 4. Accounts Payable to Vendors */}
                <div
                  onClick={() => setCurrentView('ACCOUNTS_PAYABLE')}
                  className="p-5 rounded-2xl bg-white border-2 border-[#1E6B3A]/40 hover:border-[#1E6B3A] hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/20"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100/60 border border-emerald-300 flex items-center justify-center text-emerald-800 mb-4 group-hover:scale-110 transition-transform shadow-xs">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Active Supplier Ledger
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#1F3A2E] group-hover:text-[#1E6B3A] transition-colors">
                      Accounts Payable to Vendors
                    </h3>
                    <p className="text-xs text-[#6B7269] mt-1 leading-relaxed">
                      Supplier debit/credit turnover, liability tracking, and payment terms.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-[11px] font-bold text-[#1E6B3A]">
                    <span>Open Supplier Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ACCOUNTS PAYABLE TO VENDORS (Matching Screenshot 4) */}
      {currentView === 'ACCOUNTS_PAYABLE' && (
        <div className="space-y-6">
          {/* Header Banner & Subtitle */}
          <div className="bg-white border border-[#DDE3DD] rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold font-heading text-[#1F3A2E]">
                  Accounts Payable to Vendors
                </h1>
                <p className="text-xs text-[#6B7269] mt-1 max-w-3xl leading-relaxed">
                  This section shows accounts payable to vendors by supplier for the selected period. Access to CRM, Finance, Inventory, and Products & Services modules is required to view the report.
                </p>
              </div>

              {/* Actions: Generate AP Statement & Record Liability Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGenReportType('ACCOUNTS_PAYABLE');
                    setIsReportGenModalOpen(true);
                  }}
                  className="px-3.5 py-2.5 rounded-xl border border-[#DDE3DD] hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  title="Generate official Accounts Payable Statement"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Generate AP Statement</span>
                </button>

                <button
                  onClick={() => setIsRecordModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1E6B3A] to-[#14512C] hover:from-[#258247] hover:to-[#1a6637] text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/20 flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#C8A96A]" />
                  <span>Record Liability</span>
                </button>
              </div>
            </div>

            {/* Filter Toolbar (Pills) */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Date Dropdown */}
                <div className="relative">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-blue-50/50 border border-blue-200 text-blue-900 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="Current Month">Date: Current Month (Oct 2026)</option>
                    <option value="Q3 2026">Date: Q3 2026</option>
                    <option value="Q2 2026">Date: Q2 2026</option>
                    <option value="Full Year 2026">Date: Full Year 2026</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-800 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>

                {/* Organization Dropdown */}
                <div className="relative">
                  <select
                    value={selectedOrg}
                    onChange={(e) => setSelectedOrg(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="All Organizations">Organization: All Operating Stations</option>
                    <option value="ARIEL_BD">Organization: ArielMC BD (Dhaka Sourcing HQ)</option>
                    <option value="ARIEL_UK">Organization: ArielMC UK (London)</option>
                    <option value="ARIEL_US">Organization: ArielMC US (Wilmington)</option>
                    <option value="ARIEL_EU">Organization: ArielMC EU (Amsterdam)</option>
                    <option value="ARIEL_AU">Organization: ArielMC AU (Sydney)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>

                {/* Currency Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCurrencyCode}
                    onChange={(e) => setSelectedCurrencyCode(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="USD">Currency: USD ($)</option>
                    <option value="BDT">Currency: BDT (৳)</option>
                    <option value="GBP">Currency: GBP (£)</option>
                    <option value="EUR">Currency: EUR (€)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Search Supplier */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search supplier / factory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-[#DDE3DD] text-xs focus:border-[#C8A96A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Accounts Payable Executive Layout: Left Table + Right Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Supplier Ledger Table */}
            <div className="lg:col-span-2 bg-white border border-[#DDE3DD] rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[#DDE3DD] flex items-center justify-between bg-[#F8FAF8]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#1F3A2E]">
                    Supplier & Vendor Payables Ledger
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                    {filteredPayables.length} Accounts
                  </span>
                </div>
                <div className="text-[11px] text-[#6B7269]">
                  Total Debit: <span className="font-mono font-bold text-[#1F3A2E]">${totalDebitTurnover.toLocaleString()}</span>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFBF9] border-b border-[#DDE3DD] text-[#6B7269] text-[11px] font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-3 w-8">
                        <input
                          type="checkbox"
                          checked={selectedVendorIds.length === filteredPayables.length && filteredPayables.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded text-[#1E6B3A] focus:ring-[#C8A96A]"
                        />
                      </th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3 text-right">Opening Debit</th>
                      <th className="py-3 px-3 text-right">Opening Credit</th>
                      <th className="py-3 px-3 text-right">Credit Turnover</th>
                      <th className="py-3 px-3 text-right">Debit Turnover</th>
                      <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDE3DD]">
                    {filteredPayables.map((item) => {
                      const isSelected = selectedVendorIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <td className="py-3.5 px-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectVendor(item.id)}
                              className="rounded text-[#1E6B3A] focus:ring-[#C8A96A]"
                            />
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                              <Building2 className="w-3.5 h-3.5" />
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-[#1F3A2E] text-xs">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-[#6B7269] flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 font-semibold text-slate-600">
                                {item.tag}
                              </span>
                              <span>•</span>
                              <span>{item.paymentTerms}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-medium text-slate-700">
                            {item.openingDebitUsd > 0 ? `$ ${item.openingDebitUsd.toLocaleString()}` : '-'}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-medium text-slate-700">
                            {item.openingCreditUsd > 0 ? `$ ${item.openingCreditUsd.toLocaleString()}` : '-'}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-medium text-blue-700">
                            {item.creditTurnoverUsd > 0 ? `$ ${item.creditTurnoverUsd.toLocaleString()}` : '-'}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-[#1E6B3A]">
                            {item.debitTurnoverUsd > 0 ? `$ ${item.debitTurnoverUsd.toLocaleString()}` : '-'}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Opening Payables & Turnover Widgets (Matching Screenshot 4) */}
            <div className="space-y-4">
              {/* Summary Widget 1: Opening Accounts Payable & Record Liability */}
              <div className="bg-white border border-[#DDE3DD] rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold font-heading text-xs uppercase tracking-wider text-[#6B7269]">
                    Opening Accounts Payable
                  </h3>
                  <button
                    onClick={() => setIsRecordModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold border border-blue-200 transition-colors"
                  >
                    Record Liability
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-[#6B7269] block font-medium">Opening AP</span>
                    <span className="text-sm font-bold font-mono text-[#1F3A2E] mt-0.5 block">
                      ${totalDebitTurnover.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-[#6B7269]">Debit Q1</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-[#6B7269] block font-medium">Credit Turn</span>
                    <span className="text-sm font-bold font-mono text-blue-700 mt-0.5 block">
                      ${totalCreditTurnover.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-[#6B7269]">Credit Q1</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 block font-medium">Net Debt</span>
                    <span className="text-sm font-bold font-mono text-[#1E6B3A] mt-0.5 block">
                      ${totalOutstandingDebt.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-emerald-700 font-bold">Outstanding</span>
                  </div>
                </div>
              </div>

              {/* Summary Widget 2: Turnover for the Period List (Matching Screenshot 4) */}
              <div className="bg-white border border-[#DDE3DD] rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold font-heading text-xs uppercase tracking-wider text-[#6B7269]">
                    Turnover for the Period
                  </h3>
                  <span className="text-[10px] text-[#6B7269] font-mono">Q1 2026 Audit</span>
                </div>

                <div className="overflow-hidden border border-[#DDE3DD] rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAFBF9] border-b border-[#DDE3DD] text-[10px] text-[#6B7269] uppercase font-semibold">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3 text-right">Debit Turnover</th>
                        <th className="py-2 px-3 text-right">Credit Turnover</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DDE3DD] text-[11px] font-mono">
                      <tr>
                        <td className="py-2.5 px-3 text-[#1F3A2E] font-sans">03/13/2026</td>
                        <td className="py-2.5 px-3 text-right text-blue-600 font-bold">$ 10,600.00</td>
                        <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-[#1F3A2E] font-sans">02/02/2026</td>
                        <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                        <td className="py-2.5 px-3 text-right text-[#1E6B3A] font-bold">$ 2,200.00</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-[#1F3A2E] font-sans">01/18/2026</td>
                        <td className="py-2.5 px-3 text-right text-blue-600 font-bold">$ 15,800.00</td>
                        <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-[#1F3A2E] font-sans">01/05/2026</td>
                        <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                        <td className="py-2.5 px-3 text-right text-[#1E6B3A] font-bold">$ 4,500.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CASH FLOW MATRIX (Matching User Screenshot & IAS 7 Standards) */}
      {currentView === 'CASH_FLOW' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-[#DDE3DD] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold font-heading text-[#1F3A2E]">
                  Cash Flow Statement
                </h1>
                <p className="text-xs text-[#6B7269] mt-1">
                  12-Month Calendar Matrix breakdown across all 5 international operating stations.
                </p>
              </div>

              {/* Sub-toggle: By Financial Categories | Activity types */}
              <div className="flex items-center gap-1 p-1 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCashFlowMode('CATEGORIES')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                    cashFlowMode === 'CATEGORIES'
                      ? 'bg-white text-[#1F3A2E] shadow-xs border border-[#DDE3DD]'
                      : 'text-[#6B7269] hover:text-[#1F3A2E]'
                  }`}
                >
                  By Financial Categories
                </button>
                <button
                  type="button"
                  onClick={() => setCashFlowMode('ACTIVITIES')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                    cashFlowMode === 'ACTIVITIES'
                      ? 'bg-white text-[#1F3A2E] shadow-xs border border-[#DDE3DD]'
                      : 'text-[#6B7269] hover:text-[#1F3A2E]'
                  }`}
                >
                  Activity types
                </button>
              </div>
            </div>

            {/* Filter Toolbar matching Screenshot */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Default Filter Button */}
                <button
                  type="button"
                  onClick={resetCashFlowFilters}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
                    isCashFlowDefault
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                  title={isCashFlowDefault ? 'Default Filters Active' : 'Filters Active - Click to Reset to Default'}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>{isCashFlowDefault ? 'Default' : 'Filtered'}</span>
                  <X className="w-3.5 h-3.5 ml-1 hover:scale-125 transition-transform" />
                </button>

                {/* Organization Dropdown */}
                <div className="relative inline-flex items-center">
                  <select
                    value={cashFlowOrg}
                    onChange={(e) => setCashFlowOrg(e.target.value)}
                    className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg border font-medium text-xs focus:outline-none cursor-pointer transition-all ${
                      cashFlowOrg !== 'ALL'
                        ? 'bg-emerald-50 border-emerald-600 text-[#1F3A2E] font-bold shadow-2xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <option value="ALL">Organization</option>
                    <option value="ARIEL_BD">Organization: Ariel BD (Dhaka HQ)</option>
                    <option value="ARIEL_UK">Organization: Ariel UK (London)</option>
                    <option value="ARIEL_US">Organization: Ariel US (New York)</option>
                    <option value="ARIEL_EU">Organization: Ariel EU (Frankfurt)</option>
                    <option value="ARIEL_AU">Organization: Ariel AU (Sydney)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
                </div>

                {/* Date Dropdown */}
                <div className="relative inline-flex items-center">
                  <select
                    value={cashFlowDate}
                    onChange={(e) => setCashFlowDate(e.target.value)}
                    className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg border font-medium text-xs focus:outline-none cursor-pointer transition-all ${
                      cashFlowDate !== 'DEFAULT'
                        ? 'bg-emerald-50 border-emerald-600 text-[#1F3A2E] font-bold shadow-2xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <option value="DEFAULT">Date</option>
                    <option value="FY_2026">Date: FY 2026/27</option>
                    <option value="CY_2026">Date: Full Year 2026</option>
                    <option value="Q1">Date: Q1 (Jan - Mar)</option>
                    <option value="Q2">Date: Q2 (Apr - Jun)</option>
                    <option value="Q3">Date: Q3 (Jul - Sep)</option>
                    <option value="Q4">Date: Q4 (Oct - Dec)</option>
                    <option value="CURRENT_MONTH">Date: Current Month</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
                </div>

                {/* Cash flow type Dropdown */}
                <div className="relative inline-flex items-center">
                  <select
                    value={cashFlowType}
                    onChange={(e) => setCashFlowType(e.target.value)}
                    className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg border font-medium text-xs focus:outline-none cursor-pointer transition-all ${
                      cashFlowType !== 'ALL'
                        ? 'bg-emerald-50 border-emerald-600 text-[#1F3A2E] font-bold shadow-2xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <option value="ALL">Cash flow type</option>
                    <option value="ALL_FLOWS">Cash flow type: All Flows</option>
                    <option value="OPERATING">Cash flow type: Operating Inflows & Outflows</option>
                    <option value="INVESTING">Cash flow type: Capex & Tooling</option>
                    <option value="FINANCING">Cash flow type: Financing & L/C</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
                </div>

                {/* Period Breakdown Dropdown */}
                <div className="relative inline-flex items-center">
                  <select
                    value={cashFlowBreakdown}
                    onChange={(e) => setCashFlowBreakdown(e.target.value as any)}
                    className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg border font-medium text-xs focus:outline-none cursor-pointer transition-all ${
                      cashFlowBreakdown !== 'MONTHLY'
                        ? 'bg-emerald-50 border-emerald-600 text-[#1F3A2E] font-bold shadow-2xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <option value="MONTHLY">Period Breakdown</option>
                    <option value="MONTHLY_EXP">Period Breakdown: By Month</option>
                    <option value="QUARTERLY">Period Breakdown: By Quarter</option>
                    <option value="ANNUAL">Period Breakdown: By Year</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
                </div>

                {/* Account Dropdown */}
                <div className="relative inline-flex items-center">
                  <select
                    value={cashFlowAccount}
                    onChange={(e) => setCashFlowAccount(e.target.value)}
                    className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg border font-medium text-xs focus:outline-none cursor-pointer transition-all ${
                      cashFlowAccount !== 'ALL'
                        ? 'bg-emerald-50 border-emerald-600 text-[#1F3A2E] font-bold shadow-2xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <option value="ALL">Account</option>
                    <option value="ALL_ACCOUNTS">Account: All Accounts</option>
                    <option value="PRIME_BDT">Account: Prime Bank Corp (BDT)</option>
                    <option value="HSBC_GBP">Account: HSBC Commercial (GBP)</option>
                    <option value="CHASE_USD">Account: Chase Business (USD)</option>
                    <option value="DB_EUR">Account: Deutsche Bank (EUR)</option>
                    <option value="PETTY_CASH">Account: Central Vault Cash (BDT)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
                </div>
              </div>

              {/* Action Buttons: Generate Statement & Download */}
              <div className="flex items-center gap-2 text-slate-600">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGenReportType('CASHFLOW_DAILY');
                    setIsReportGenModalOpen(true);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg ${generateStatementBtnBg} text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors font-['Montserrat']`}
                  title="Generate Formal Cash Flow Statement"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#C8A96A]" />
                  <span>Generate Statement</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCashFlowCsv}
                  className="p-2 rounded-lg border border-[#DDE3DD] hover:bg-slate-50 text-slate-700 hover:text-emerald-700 cursor-pointer transition-colors shadow-2xs"
                  title="Download Cash Flow Matrix as CSV (Excel)"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Status Badge Bar */}
            <div className="text-xs text-slate-600 pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Station: <strong className="text-[#1F3A2E]">{orgLabel}</strong></span>
                {cashFlowAccount !== 'ALL' && (
                  <span> | Account: <strong className="text-blue-700 font-mono">{cashFlowAccount}</strong></span>
                )}
                <span> | Mode: <strong className="text-emerald-800">{cashFlowMode === 'CATEGORIES' ? 'Financial Categories' : 'IAS 7 Activity Types'}</strong></span>
                <span> | Breakdown: <strong className="text-slate-800">{cashFlowBreakdown === 'QUARTERLY' ? 'Quarterly' : cashFlowBreakdown === 'ANNUAL' ? 'Annual' : 'Monthly'}</strong></span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Currency: Multi-Station FX Consolidated
              </div>
            </div>
          </div>

          {/* Matrix Table: Dynamically Responsive to Mode and Breakdown */}
          <div className="bg-white border border-[#DDE3DD] rounded-2xl shadow-sm overflow-x-auto">
            {cashFlowBreakdown === 'QUARTERLY' ? (
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="bg-[#FAFBF9] border-b border-[#DDE3DD] text-[#6B7269] text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-72">Category / Item</th>
                    <th className="py-3 px-3 text-right">Q1 2026 (Jan - Mar)</th>
                    <th className="py-3 px-3 text-right">Q2 2026 (Apr - Jun)</th>
                    <th className="py-3 px-3 text-right">Q3 2026 (Jul - Sep)</th>
                    <th className="py-3 px-3 text-right">Q4 2026 (Oct - Dec)</th>
                    <th className="py-3 px-4 text-right font-bold text-[#1F3A2E]">Total FY 2026</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD] text-[11px] font-mono">
                  {cashFlowMode === 'CATEGORIES' ? (
                    <>
                      <tr className="bg-slate-50/80 font-bold text-[#1F3A2E]">
                        <td className="py-3 px-4 font-sans">Opening cash balance</td>
                        <td className="py-3 px-3 text-right">${Math.round(59000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">${Math.round(72500 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">${Math.round(94000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">${Math.round(118000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold">${Math.round(59000 * orgMultiplier).toLocaleString()}</td>
                      </tr>
                      <tr className="font-bold text-[#1E6B3A] bg-emerald-50/30">
                        <td className="py-2.5 px-4 font-sans" colSpan={6}>Revenue Inflows</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-6 font-medium text-slate-700 font-sans">+ Services (Bespoke &amp; Sourcing)</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(32000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(48000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(62000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(78000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-4 text-right font-bold text-[#1E6B3A]">${Math.round(220000 * orgMultiplier).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-6 font-medium text-slate-700 font-sans">+ Products (Leather, Jute, Textiles, Ceramics, Pottery)</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(85000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(142000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(188000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(235000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-4 text-right font-bold text-[#1E6B3A]">${Math.round(650000 * orgMultiplier).toLocaleString()}</td>
                      </tr>
                      <tr className="font-bold text-rose-800 bg-rose-50/30">
                        <td className="py-2.5 px-4 font-sans" colSpan={6}>Production &amp; Cost of Goods Sold</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-6 font-medium text-slate-700 font-sans">Materials and Raw Supplies</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(42000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(68000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(88000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(112000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-4 text-right font-bold text-rose-700">${Math.round(310000 * orgMultiplier).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-6 font-medium text-slate-700 font-sans">Delivery &amp; Freight (Sea &amp; Air)</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(14000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(22000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(29000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(36000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-4 text-right font-bold text-rose-700">${Math.round(101000 * orgMultiplier).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-6 font-medium text-slate-700 font-sans">Subcontractors &amp; Factory QA</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(18000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(26000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(34000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(42000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-4 text-right font-bold text-rose-700">${Math.round(120000 * orgMultiplier).toLocaleString()}</td>
                      </tr>
                      <tr className="bg-emerald-50/70 font-bold text-[#14512C]">
                        <td className="py-2.5 px-4 font-sans">Net Cashflow for Period</td>
                        <td className="py-2.5 px-3 text-right">${Math.round(33500 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right">${Math.round(59500 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right">${Math.round(81000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right">${Math.round(100000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-emerald-800">${Math.round(274000 * orgMultiplier).toLocaleString()}</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="font-bold text-[#1F3A2E] bg-emerald-50/40">
                        <td className="py-2.5 px-4 font-sans" colSpan={6}>1. Cash Flows from Operating Activities</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-6 font-medium text-slate-700 font-sans">+ Cash receipts from Wholesale &amp; Retail Customers</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(117000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(190000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(250000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-600">${Math.round(313000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-4 text-right font-bold text-[#1E6B3A]">${Math.round(870000 * orgMultiplier).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-6 font-medium text-slate-700 font-sans">- Cash payments to raw material suppliers &amp; tanneries</td>
                        <td className="py-2 px-3 text-right text-rose-600">(${Math.round(74000 * orgMultiplier).toLocaleString()})</td>
                        <td className="py-2 px-3 text-right text-rose-600">(${Math.round(116000 * orgMultiplier).toLocaleString()})</td>
                        <td className="py-2 px-3 text-right text-rose-600">(${Math.round(151000 * orgMultiplier).toLocaleString()})</td>
                        <td className="py-2 px-3 text-right text-rose-600">(${Math.round(190000 * orgMultiplier).toLocaleString()})</td>
                        <td className="py-2 px-4 text-right font-bold text-rose-700">(${Math.round(531000 * orgMultiplier).toLocaleString()})</td>
                      </tr>
                      <tr className="bg-emerald-50/50 font-bold text-[#1E6B3A]">
                        <td className="py-2 px-4 font-sans">Net Cash generated from Operating Activities</td>
                        <td className="py-2 px-3 text-right">${Math.round(25000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">${Math.round(48000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">${Math.round(65000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">${Math.round(81000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-2 px-4 text-right font-bold">${Math.round(219000 * orgMultiplier).toLocaleString()}</td>
                      </tr>
                      <tr className="font-bold text-[#1F3A2E] bg-amber-50/40">
                        <td className="py-2.5 px-4 font-sans" colSpan={6}>2. Cash Flows from Investing Activities</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-6 font-medium text-slate-700 font-sans">- Tooling, Precision Moulds &amp; SDO Machinery Capex</td>
                        <td className="py-2 px-3 text-right text-rose-600">(${Math.round(8000 * orgMultiplier).toLocaleString()})</td>
                        <td className="py-2 px-3 text-right text-rose-600">(${Math.round(12000 * orgMultiplier).toLocaleString()})</td>
                        <td className="py-2 px-3 text-right text-rose-600">(${Math.round(15000 * orgMultiplier).toLocaleString()})</td>
                        <td className="py-2 px-3 text-right text-rose-600">(${Math.round(18000 * orgMultiplier).toLocaleString()})</td>
                        <td className="py-2 px-4 text-right font-bold text-rose-700">(${Math.round(53000 * orgMultiplier).toLocaleString()})</td>
                      </tr>
                      <tr className="font-bold text-[#1F3A2E] bg-blue-50/40">
                        <td className="py-2.5 px-4 font-sans" colSpan={6}>3. Cash Flows from Financing Activities</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-6 font-medium text-slate-700 font-sans">- Inter-station Transfers &amp; Bank L/C Settlement Fees</td>
                        <td className="py-2 px-3 text-right text-rose-600">(${Math.round(3500 * orgMultiplier).toLocaleString()})</td>
                        <td className="py-2 px-3 text-right text-rose-600">(${Math.round(5000 * orgMultiplier).toLocaleString()})</td>
                        <td className="py-2 px-3 text-right text-rose-600">(${Math.round(6000 * orgMultiplier).toLocaleString()})</td>
                        <td className="py-2 px-3 text-right text-rose-600">(${Math.round(8000 * orgMultiplier).toLocaleString()})</td>
                        <td className="py-2 px-4 text-right font-bold text-rose-700">(${Math.round(22500 * orgMultiplier).toLocaleString()})</td>
                      </tr>
                      <tr className="bg-emerald-100/60 font-bold text-[#14512C]">
                        <td className="py-3 px-4 font-sans">Net Increase in Cash &amp; Equivalents</td>
                        <td className="py-3 px-3 text-right">${Math.round(13500 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">${Math.round(31000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">${Math.round(44000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">${Math.round(55000 * orgMultiplier).toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-800">${Math.round(143500 * orgMultiplier).toLocaleString()}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            ) : cashFlowBreakdown === 'ANNUAL' ? (
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-[#FAFBF9] border-b border-[#DDE3DD] text-[#6B7269] text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-72">Category / Item</th>
                    <th className="py-3 px-3 text-right">FY 2024 Actual</th>
                    <th className="py-3 px-3 text-right">FY 2025 Actual</th>
                    <th className="py-3 px-3 text-right">FY 2026 Budget</th>
                    <th className="py-3 px-3 text-right font-bold text-blue-600">FY 2026 Projected</th>
                    <th className="py-3 px-4 text-right font-bold text-[#1F3A2E]">Variance (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD] text-[11px] font-mono">
                  <tr className="bg-slate-50/80 font-bold text-[#1F3A2E]">
                    <td className="py-3 px-4 font-sans">Opening cash balance</td>
                    <td className="py-3 px-3 text-right">${Math.round(42000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-3 px-3 text-right">${Math.round(48000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-3 px-3 text-right">${Math.round(59000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-3 px-3 text-right">${Math.round(59000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-slate-400">0.0%</td>
                  </tr>
                  <tr className="font-bold text-[#1E6B3A] bg-emerald-50/30">
                    <td className="py-2.5 px-4 font-sans" colSpan={6}>Revenue Turnover</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-6 font-medium text-slate-700 font-sans">+ Services (Bespoke &amp; Sourcing)</td>
                    <td className="py-2 px-3 text-right text-slate-600">${Math.round(110000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-600">${Math.round(165000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-600">${Math.round(200000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-bold text-blue-700">${Math.round(220000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-4 text-right font-bold text-emerald-600">+10.0%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-6 font-medium text-slate-700 font-sans">+ Products (Leather &amp; Crafts)</td>
                    <td className="py-2 px-3 text-right text-slate-600">${Math.round(350000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-600">${Math.round(490000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-600">${Math.round(600000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-bold text-blue-700">${Math.round(650000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-4 text-right font-bold text-emerald-600">+8.3%</td>
                  </tr>
                  <tr className="font-bold text-rose-800 bg-rose-50/30">
                    <td className="py-2.5 px-4 font-sans" colSpan={6}>Direct Production &amp; COGS</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-6 font-medium text-slate-700 font-sans">Materials and Raw Supplies</td>
                    <td className="py-2 px-3 text-right text-slate-600">${Math.round(180000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-600">${Math.round(245000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-600">${Math.round(295000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-bold text-rose-700">${Math.round(310000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-4 text-right font-bold text-rose-600">+5.1%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-6 font-medium text-slate-700 font-sans">Delivery &amp; Freight (Sea &amp; Air)</td>
                    <td className="py-2 px-3 text-right text-slate-600">${Math.round(55000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-600">${Math.round(78000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-600">${Math.round(95000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-bold text-rose-700">${Math.round(101000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2 px-4 text-right font-bold text-rose-600">+6.3%</td>
                  </tr>
                  <tr className="bg-emerald-50/70 font-bold text-[#14512C]">
                    <td className="py-2.5 px-4 font-sans">Net Cash Result</td>
                    <td className="py-2.5 px-3 text-right">${Math.round(160000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">${Math.round(230000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">${Math.round(298000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-700">${Math.round(339000 * orgMultiplier).toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-700">+13.8%</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs min-w-[1000px]">
                <thead className="bg-[#FAFBF9] border-b border-[#DDE3DD] text-[#6B7269] text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-60">Category</th>
                    <th className="py-3 px-3 text-right">March 2026</th>
                    <th className="py-3 px-3 text-right">April 2026</th>
                    <th className="py-3 px-3 text-right">May 2026</th>
                    <th className="py-3 px-3 text-right">June 2026</th>
                    <th className="py-3 px-3 text-right">July 2026</th>
                    <th className="py-3 px-3 text-right">August 2026</th>
                    <th className="py-3 px-3 text-right font-bold text-blue-600">September 2026</th>
                    <th className="py-3 px-3 text-right">October 2026</th>
                    <th className="py-3 px-3 text-right">November 2026</th>
                    <th className="py-3 px-3 text-right">December 2026</th>
                    <th className="py-3 px-4 text-right font-bold text-[#1F3A2E]">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD] text-[11px]">
                  {/* Opening cash balance */}
                  <tr className="bg-slate-50/80 font-bold text-[#1F3A2E]">
                    <td className="py-3 px-4">Opening cash balance</td>
                    {[...Array(10)].map((_, i) => (
                      <td key={i} className={`py-3 px-3 text-right font-mono ${i === 6 ? 'text-blue-700' : ''}`}>
                        {Math.round(59000 * orgMultiplier).toLocaleString()}.00
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right font-mono text-slate-400">-</td>
                  </tr>

                  {/* Revenue */}
                  <tr className="font-bold text-[#1E6B3A] bg-emerald-50/30">
                    <td className="py-2.5 px-4" colSpan={12}>Revenue</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-6 font-medium text-slate-700">+ Services (Bespoke Crafting &amp; Sourcing)</td>
                    {[...Array(10)].map((_, i) => (
                      <td key={i} className="py-2 px-3 text-right font-mono text-slate-600">
                        {i >= 2 ? Math.round((12500 + i * 1500) * orgMultiplier).toLocaleString() : '-'}
                      </td>
                    ))}
                    <td className="py-2 px-4 text-right font-mono font-bold text-[#1E6B3A]">
                      ${Math.round(148000 * orgMultiplier).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-6 font-medium text-slate-700">+ Products (Leather Goods, Jute, Ceramics)</td>
                    {[...Array(10)].map((_, i) => (
                      <td key={i} className="py-2 px-3 text-right font-mono text-slate-600">
                        {i >= 1 ? Math.round((28000 + i * 4200) * orgMultiplier).toLocaleString() : '-'}
                      </td>
                    ))}
                    <td className="py-2 px-4 text-right font-mono font-bold text-[#1E6B3A]">
                      ${Math.round(422000 * orgMultiplier).toLocaleString()}
                    </td>
                  </tr>

                  {/* Expenses */}
                  <tr className="font-bold text-rose-800 bg-rose-50/30">
                    <td className="py-2.5 px-4" colSpan={12}>Expenses</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-6 font-medium text-slate-700">Materials and Raw Supplies</td>
                    {[...Array(10)].map((_, i) => (
                      <td key={i} className="py-2 px-3 text-right font-mono text-slate-600">
                        {i >= 1 ? Math.round((14000 + i * 1800) * orgMultiplier).toLocaleString() : '-'}
                      </td>
                    ))}
                    <td className="py-2 px-4 text-right font-mono font-bold text-rose-700">
                      ${Math.round(189000 * orgMultiplier).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-6 font-medium text-slate-700">Delivery &amp; Freight (Sea &amp; Air)</td>
                    {[...Array(10)].map((_, i) => (
                      <td key={i} className="py-2 px-3 text-right font-mono text-slate-600">
                        {i >= 2 ? Math.round((4500 + i * 600) * orgMultiplier).toLocaleString() : '-'}
                      </td>
                    ))}
                    <td className="py-2 px-4 text-right font-mono font-bold text-rose-700">
                      ${Math.round(58200 * orgMultiplier).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-6 font-medium text-slate-700">Subcontractors &amp; Factory QA</td>
                    {[...Array(10)].map((_, i) => (
                      <td key={i} className="py-2 px-3 text-right font-mono text-slate-600">
                        {i >= 2 ? Math.round((6200 + i * 800) * orgMultiplier).toLocaleString() : '-'}
                      </td>
                    ))}
                    <td className="py-2 px-4 text-right font-mono font-bold text-rose-700">
                      ${Math.round(78400 * orgMultiplier).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: PROFIT & LOSS (Matching 2-Page PDF) */}
      {currentView === 'PNL' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#DDE3DD] rounded-2xl p-6 shadow-sm space-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold font-heading text-[#1F3A2E]">
                  Profit & Loss Statement (P&L)
                </h1>
                <p className="text-xs text-[#6B7269]">
                  Organization: <strong className="text-[#1F3A2E]">{activeEntity.legalName}</strong> | Period: 2026-01-01 - 2026-12-31 | Period Breakdown: By Month
                </p>
              </div>
              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl border border-[#DDE3DD] hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSharePnlOpen(true)}
                  className={`px-3.5 py-2 rounded-xl ${generateReportBtnBg} text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer`}
                  title="Share P&L Statement for Verification & Acknowledgement"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share (Verify / Ack)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Statement Table matching the PDF */}
          <div className="printable-content bg-white border border-[#DDE3DD] rounded-2xl shadow-sm overflow-x-auto p-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] border-b border-[#DDE3DD] text-[11px] font-semibold text-[#6B7269]">
                <tr>
                  <th className="py-2.5 px-3 w-72">Category</th>
                  <th className="py-2.5 px-3 text-right">Q1 2026</th>
                  <th className="py-2.5 px-3 text-right">Q2 2026</th>
                  <th className="py-2.5 px-3 text-right">Q3 2026</th>
                  <th className="py-2.5 px-3 text-right">Q4 2026</th>
                  <th className="py-2.5 px-3 text-right font-bold text-[#1F3A2E]">FY 2026 Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                <tr className="font-bold text-[#1E6B3A] bg-emerald-50/40">
                  <td className="py-2 px-3">Revenue</td>
                  <td className="py-2 px-3 text-right font-mono">$ 85,000</td>
                  <td className="py-2 px-3 text-right font-mono">$ 142,000</td>
                  <td className="py-2 px-3 text-right font-mono">$ 188,000</td>
                  <td className="py-2 px-3 text-right font-mono">$ 235,000</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">$ 650,000</td>
                </tr>
                <tr className="font-bold text-rose-700 bg-rose-50/40">
                  <td className="py-2 px-3">Cost of Goods Sold (COGS)</td>
                  <td className="py-2 px-3 text-right font-mono">$ 46,750</td>
                  <td className="py-2 px-3 text-right font-mono">$ 78,100</td>
                  <td className="py-2 px-3 text-right font-mono">$ 103,400</td>
                  <td className="py-2 px-3 text-right font-mono">$ 129,250</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">$ 357,500</td>
                </tr>
                <tr className="font-bold bg-slate-50 text-[#1F3A2E]">
                  <td className="py-2 px-3">Gross Profit (GP)</td>
                  <td className="py-2 px-3 text-right font-mono">$ 38,250</td>
                  <td className="py-2 px-3 text-right font-mono">$ 63,900</td>
                  <td className="py-2 px-3 text-right font-mono">$ 84,600</td>
                  <td className="py-2 px-3 text-right font-mono">$ 105,750</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-[#1E6B3A]">$ 292,500</td>
                </tr>
                <tr className="text-[#6B7269]">
                  <td className="py-1.5 px-3 italic pl-6">Gross Profit Margin %</td>
                  <td className="py-1.5 px-3 text-right font-mono">45.0%</td>
                  <td className="py-1.5 px-3 text-right font-mono">45.0%</td>
                  <td className="py-1.5 px-3 text-right font-mono">45.0%</td>
                  <td className="py-1.5 px-3 text-right font-mono">45.0%</td>
                  <td className="py-1.5 px-3 text-right font-mono font-bold text-[#1E6B3A]">45.0%</td>
                </tr>
                <tr className="font-bold text-slate-800 bg-slate-50/60">
                  <td className="py-2 px-3">Total Operating Expenses (OPEX)</td>
                  <td className="py-2 px-3 text-right font-mono">$ 18,500</td>
                  <td className="py-2 px-3 text-right font-mono">$ 24,000</td>
                  <td className="py-2 px-3 text-right font-mono">$ 29,500</td>
                  <td className="py-2 px-3 text-right font-mono">$ 36,000</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">$ 108,000</td>
                </tr>
                <tr className="font-bold bg-[#FAF5EC] text-[#8A6D3B]">
                  <td className="py-2 px-3">Operating Profit (EBIT)</td>
                  <td className="py-2 px-3 text-right font-mono">$ 19,750</td>
                  <td className="py-2 px-3 text-right font-mono">$ 39,900</td>
                  <td className="py-2 px-3 text-right font-mono">$ 55,100</td>
                  <td className="py-2 px-3 text-right font-mono">$ 69,750</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-[#1E6B3A]">$ 184,500</td>
                </tr>
                <tr className="font-bold bg-emerald-100/50 text-[#14512C]">
                  <td className="py-2.5 px-3">Accumulated Financial Result</td>
                  <td className="py-2.5 px-3 text-right font-mono">$ 59,000</td>
                  <td className="py-2.5 px-3 text-right font-mono">$ 88,900</td>
                  <td className="py-2.5 px-3 text-right font-mono">$ 133,000</td>
                  <td className="py-2.5 px-3 text-right font-mono">$ 188,500</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">$ 243,500</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: INVOICES REPORT */}
      {currentView === 'INVOICES' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#DDE3DD] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-heading text-[#1F3A2E]">
                Commercial Invoices &amp; Tax Billing
              </h1>
              <p className="text-xs text-[#6B7269] mt-1">
                Active export commercial invoices, pro-formas, and official Bangladesh NBR Mushak 6.3 VAT chalans.
              </p>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={() => {
                  setSelectedGenReportType('COMMERCIAL_INVOICES');
                  setIsReportGenModalOpen(true);
                }}
                className={`px-3.5 py-2 rounded-xl ${generateReportBtnBg} text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer font-['Montserrat']`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>+ Generate Invoice Statement</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl border border-[#DDE3DD] hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* 4 Invoices KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-2xs">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">Total Invoiced Volume</span>
              <div className="text-lg font-bold font-mono text-[#1F3A2E] mt-0.5">৳ 23,800,400</div>
              <span className="text-[10px] text-emerald-600 font-mono font-medium block">~ $195,800 Foreign Realized</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-2xs">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">Realized Inflow Settlements</span>
              <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">৳ 18,786,400</div>
              <span className="text-[10px] text-gray-500 font-mono font-medium block">78.9% Collection Rate</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-2xs">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">Unsettled Receivables</span>
              <div className="text-lg font-bold font-mono text-amber-600 mt-0.5">৳ 5,014,000</div>
              <span className="text-[10px] text-amber-700 font-mono font-medium block">Under Standby L/C Cover</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-2xs">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">NBR Mushak 6.3 Audit</span>
              <div className="text-lg font-bold font-mono text-cyan-700 mt-0.5">100% Tax Compliant</div>
              <span className="text-[10px] text-cyan-800 font-mono font-medium block">Registered VAT Chalans</span>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="printable-content bg-white border border-[#DDE3DD] rounded-2xl shadow-sm overflow-x-auto p-4">
            <table className="w-full text-left text-xs font-['Open_Sans']">
              <thead className="bg-[#FAFBF9] border-b border-[#DDE3DD] text-[11px] font-semibold text-[#6B7269]">
                <tr>
                  <th className="py-2.5 px-3">Invoice Number</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Customer / Trade Entity</th>
                  <th className="py-2.5 px-3">Station</th>
                  <th className="py-2.5 px-3 text-right">Foreign Value</th>
                  <th className="py-2.5 px-3 text-right">Value (BDT)</th>
                  <th className="py-2.5 px-3">NBR Mushak 6.3 Chalan</th>
                  <th className="py-2.5 px-3">Payment Terms</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] font-mono">
                {[
                  { invNo: 'INV-2026-UK-001', date: '2026-10-12', customer: 'Harrods London (Department Store)', station: 'ARIEL_UK', amountForeign: '£67,500', amountBdt: '৳ 10,260,000', vatChalan: 'NBR-VAT-6.3-9021', status: 'PAID_SETTLED', paymentMode: 'Confirmed Irrevocable LC' },
                  { invNo: 'INV-2026-US-001', date: '2026-10-14', customer: 'Nordstrom Inc. (US Retail Chain)', station: 'ARIEL_US', amountForeign: '$48,000', amountBdt: '৳ 5,832,000', vatChalan: 'NBR-VAT-6.3-9022', status: 'PARTIAL_ADVANCE', paymentMode: 'TT Wire Advance (30%)' },
                  { invNo: 'INV-2026-EU-002', date: '2026-10-16', customer: 'Le Bon Marché Paris (B2B Boutique)', station: 'ARIEL_EU', amountForeign: '€37,500', amountBdt: '৳ 4,950,000', vatChalan: 'NBR-VAT-6.3-9023', status: 'ISSUED_PENDING', paymentMode: 'Net 30 Days Standby LC' },
                  { invNo: 'INV-2026-D2C-UK-104', date: '2026-10-17', customer: 'Shopify UK Direct Retail Consumers', station: 'ARIEL_UK', amountForeign: '£450', amountBdt: '৳ 68,400', vatChalan: 'UK-HMRC-VAT-8841', status: 'PAID_SETTLED', paymentMode: 'Barclays Station Settlement' },
                  { invNo: 'INV-2026-AU-001', date: '2026-10-18', customer: 'David Jones Sydney (Department Store)', station: 'ARIEL_AU', amountForeign: 'A$33,600', amountBdt: '৳ 2,688,000', vatChalan: 'NBR-VAT-6.3-9025', status: 'PAID_SETTLED', paymentMode: 'Irrevocable LC at Sight' },
                ].map((inv) => (
                  <tr key={inv.invNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#1F3A2E]">{inv.invNo}</td>
                    <td className="py-2.5 px-3 text-[#6B7269]">{inv.date}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">{inv.customer}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {inv.station}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{inv.amountForeign}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{inv.amountBdt}</td>
                    <td className="py-2.5 px-3 text-[#8A6D3B] font-mono">{inv.vatChalan}</td>
                    <td className="py-2.5 px-3 text-[#6B7269] font-sans">{inv.paymentMode}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'PAID_SETTLED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'PARTIAL_ADVANCE'
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.status === 'PAID_SETTLED' ? 'Settled / Paid' : inv.status === 'PARTIAL_ADVANCE' ? '30% Advance' : 'Issued / Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: RECORD LIABILITY (Matching Screenshot 4) */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#12231B] border border-[#2C5240] text-white shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#2C5240] bg-[#162B22] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1F3A2E] border border-[#C8A96A]/40 flex items-center justify-center text-[#C8A96A]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-heading text-white">
                    Record Vendor Liability
                  </h2>
                  <p className="text-[10px] text-[#C8A96A]">Post factory invoice into Accounts Payable ledger</p>
                </div>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordLiabilitySubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[#CFE0D5] font-semibold mb-1">
                  Vendor / Supplier Name
                </label>
                <select
                  value={newLiability.vendorName}
                  onChange={(e) => setNewLiability({ ...newLiability, vendorName: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                >
                  <option value="Apex Leather Crafts Ltd">Apex Leather Crafts Ltd (Savar)</option>
                  <option value="Veritas Processing Group">Veritas Processing Group (Gazipur)</option>
                  <option value="Bengal Natural Jute Mills Ltd">Bengal Natural Jute Mills Ltd (Narsingdi)</option>
                  <option value="Savar Tannery Environmental Lab">Savar Tannery Environmental Lab</option>
                  <option value="DHL Express International (BD)">DHL Express International (BD)</option>
                  <option value="Maersk Ocean Freight Line BD">Maersk Ocean Freight Line BD</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Invoice / Bill Reference
                  </label>
                  <input
                    type="text"
                    required
                    value={newLiability.invoiceNumber}
                    onChange={(e) => setNewLiability({ ...newLiability, invoiceNumber: e.target.value })}
                    className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white font-mono focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Liability Amount ($USD)
                  </label>
                  <input
                    type="number"
                    required
                    value={newLiability.amountUsd}
                    onChange={(e) => setNewLiability({ ...newLiability, amountUsd: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white font-mono focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    value={newLiability.paymentTerms}
                    onChange={(e) => setNewLiability({ ...newLiability, paymentTerms: e.target.value })}
                    className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newLiability.dueDate}
                    onChange={(e) => setNewLiability({ ...newLiability, dueDate: e.target.value })}
                    className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#CFE0D5] font-semibold mb-1">
                  Description / Production Batch
                </label>
                <textarea
                  rows={2}
                  value={newLiability.description}
                  onChange={(e) => setNewLiability({ ...newLiability, description: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#2C5240] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#2C5240] text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#1E6B3A] to-[#14512C] hover:from-[#258247] hover:to-[#1a6637] text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#C8A96A]" />
                  <span>Confirm Liability Entry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share P&L Statement Modal */}
      <ShareDocumentModal
        isOpen={isSharePnlOpen}
        onClose={() => setIsSharePnlOpen(false)}
        document={{
          id: `DOC-PNL-${activeEntity.code}-2026`,
          docCode: `AMC-PNL-${activeEntity.code}-2026-FY`,
          documentNumber: `AMC-PNL-${activeEntity.code}-2026-FY`,
          title: `ArielMC Official Profit & Loss Statement - ${activeEntity.legalName}`,
          category: 'FINANCIAL_AUDIT',
          section: 'STATION_STATUTORY',
          issuingAuthority: 'ArielMC Executive Finance Directorate (Dhaka / London)',
          station: activeEntity.code as any,
          countryCode: activeEntity.country,
          entityCode: activeEntity.code,
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: '2026-12-31',
          status: 'ACTIVE',
          verificationUrl: `https://erp.arielmc.com/verify-doc?code=AMC-PNL-${activeEntity.code}-2026-FY&ack=true`,
          qrCodeData: `AMC-PNL-${activeEntity.code}-2026-FY|${activeEntity.legalName}|AUDIT_VERIFIED`,
          fileUrl: '/docs/ArielMC_Financial_Pnl_Statement.pdf',
          fileType: 'PDF',
          fileSize: '1.8 MB',
          version: '2026.1',
          tags: ['Finance', 'P&L', 'Executive Audit', 'Accounts Payable', 'Verified'],
          notes: `Official audited Profit & Loss Statement for ${activeEntity.legalName} covering FY 2026 financial operations and dual-track cash flow.`,
          isStatutoryRequirement: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }}
      />

      {/* Executive Report Generation Modal */}
      <ReportGenerationModal
        isOpen={isReportGenModalOpen}
        onClose={() => setIsReportGenModalOpen(false)}
        initialReportType={selectedGenReportType}
        initialViewMode={genReportViewMode}
        activeEntity={activeEntity}
        theme={theme}
      />
    </div>
  );
};
