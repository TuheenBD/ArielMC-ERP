'use client';

import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Printer,
  Share2,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Truck,
  Boxes,
  FileText,
  BadgeCheck,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  X,
  CreditCard,
  SlidersHorizontal,
  Landmark,
  Paperclip,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  Upload,
  Download,
  FolderTree,
  FileSpreadsheet,
  ArrowUpDown,
  Check,
  RotateCcw,
  BookOpen,
  Globe2
} from 'lucide-react';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { OfficialDocument } from '@/types/documentPortal';
import { ArielMC } from '@/lib/brand';
import { StandardVoucher, VoucherType, VoucherPaymentMode, PhysicalAttachment } from '@/types/voucher';
import { AccountHead, AccountHeadType } from '@/types/accountHead';
import { INITIAL_STANDARD_VOUCHERS } from '@/data/initialVouchers';
import { INITIAL_ACCOUNT_HEADS } from '@/data/initialAccountHeads';
import { StandardVoucherModal } from '@/components/StandardVoucherModal';
import { AccountHeadManagementModal } from '@/components/AccountHeadManagementModal';
import { PhysicalMemoViewerModal } from '@/components/PhysicalMemoViewerModal';
import { StationB2CPaymentModal } from '@/components/StationB2CPaymentModal';
import { ReportGenerationModal } from '@/components/ReportGenerationModal';
import { STATION_BANK_ACCOUNTS, STATION_METADATA } from '@/data/stationBankAccounts';
import { persistVoucher, fetchAccountHeads, persistAccountHeads, getCachedAccountHeads } from '@/lib/erpPersistence';

export const ACCOUNT_HEADS_CONFIG = {
  HEAD_1_COGS: {
    headNumber: 1,
    title: 'Direct Sourcing & Supply Chain Costs (Cost of Goods Sold - COGS)',
    shortTitle: 'Direct Sourcing & COGS',
    categoryDesc: 'Raw materials, tanneries, artisan CMT labor, packaging & export fumigation',
    colorBg: 'bg-emerald-950/20',
    colorBorder: 'border-emerald-700/40',
    colorText: 'text-emerald-400',
    colorBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  HEAD_2_LOGISTICS: {
    headNumber: 2,
    title: 'Logistics & Port Freight Operations',
    shortTitle: 'Logistics & Port Freight',
    categoryDesc: 'Inland trucking, customs C&F brokerage, CPA terminal charges & ocean freight',
    colorBg: 'bg-blue-950/20',
    colorBorder: 'border-blue-700/40',
    colorText: 'text-blue-400',
    colorBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  HEAD_3_BIZDEV_COMPLIANCE: {
    headNumber: 3,
    title: 'Business Development & Compliance Audits',
    shortTitle: 'Business Dev & Audits',
    categoryDesc: 'Lab testing (ISO/REACH), social audits (Sedex/BSCI), trade associations & sampling hospitality',
    colorBg: 'bg-amber-950/20',
    colorBorder: 'border-amber-700/40',
    colorText: 'text-amber-400',
    colorBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  HEAD_4_ADMIN_OVERHEAD: {
    headNumber: 4,
    title: 'Admin, Tech & Office Overhead',
    shortTitle: 'Admin & Office Overhead',
    categoryDesc: 'ERP cloud infrastructure, Dhaka Niketon studio utilities, bank wire fees & legal filings',
    colorBg: 'bg-purple-950/20',
    colorBorder: 'border-purple-700/40',
    colorText: 'text-purple-400',
    colorBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
};

export const DailyExpensesEntrySection: React.FC = () => {
  // Master Voucher Database State (Loaded from initial vouchers and persisted)
  const [vouchers, setVouchers] = useState<StandardVoucher[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arielmc_vouchers_db');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_STANDARD_VOUCHERS;
  });

  // Modal States
  const [activeModalVoucher, setActiveModalVoucher] = useState<StandardVoucher | null>(null);
  const [modalMode, setModalMode] = useState<'VIEW' | 'EDIT' | 'CREATE'>('VIEW');
  const [createVoucherType, setCreateVoucherType] = useState<VoucherType>('CASH_PURCHASE');
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Master Account Heads Database State
  const [accountHeads, setAccountHeads] = useState<AccountHead[]>(() => {
    return getCachedAccountHeads();
  });
  const [isAccountHeadModalOpen, setIsAccountHeadModalOpen] = useState(false);

  // Station Bank Inflow Modal State
  const [isStationB2CModalOpen, setIsStationB2CModalOpen] = useState(false);

  // Report Generation Modal State
  const [isReportGenModalOpen, setIsReportGenModalOpen] = useState(false);

  // Background refresh from Supabase if online
  React.useEffect(() => {
    fetchAccountHeads().then((heads) => {
      if (heads && heads.length > 0) {
        setAccountHeads(heads);
      }
    });
  }, []);

  // Active Ledger View Mode
  const [activeLedgerView, setActiveLedgerView] = useState<'CASHFLOW_LEDGER' | 'VOUCHER_REGISTER' | 'ACCOUNT_HEADS'>('CASHFLOW_LEDGER');
  
  // Sorting for Cashflow Ledger
  const [ledgerSortOrder, setLedgerSortOrder] = useState<'CHRONOLOGICAL_ASC' | 'LATEST_FIRST'>('CHRONOLOGICAL_ASC');

  // Physical Memo Viewer State
  const [activeMemoAttachment, setActiveMemoAttachment] = useState<PhysicalAttachment | null>(null);
  const [activeMemoVoucherMeta, setActiveMemoVoucherMeta] = useState<{
    voucherNumber: string;
    voucherType: VoucherType;
    partyName: string;
  } | null>(null);
  const [isMemoViewerOpen, setIsMemoViewerOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // FILTER & SEARCH CONSOLE STATE
  // ---------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | VoucherType>('ALL');
  const [selectedHead, setSelectedHead] = useState<string>('ALL');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'ALL' | VoucherPaymentMode>('ALL');
  const [attachmentFilter, setAttachmentFilter] = useState<'ALL' | 'WITH_ATTACHMENT' | 'WITHOUT_ATTACHMENT'>('ALL');
  const [datePreset, setDatePreset] = useState<'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'FY_2026' | 'CUSTOM'>('ALL');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [stationFilter, setStationFilter] = useState<string>('ALL');
  const [showAnalyticsDetails, setShowAnalyticsDetails] = useState<boolean>(false);

  // Persist vouchers to localStorage
  const saveVouchersToState = (updated: StandardVoucher[]) => {
    setVouchers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('arielmc_vouchers_db', JSON.stringify(updated));
    }
  };

  // Handler: Save Account Heads from Modal
  const handleSaveAccountHeads = (updatedHeads: AccountHead[]) => {
    setAccountHeads(updatedHeads);
    persistAccountHeads(updatedHeads);
    setToastMessage('✓ Account Heads updated and persisted successfully.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handler: Cascade Rename of Head in historical Vouchers
  const handleRenameHeadInVouchers = (oldHeadName: string, newHeadName: string) => {
    let affectedCount = 0;
    const updated = vouchers.map((v) => {
      if (v.mainAccountHead === oldHeadName) {
        affectedCount++;
        return {
          ...v,
          mainAccountHead: newHeadName,
          updatedAt: new Date().toISOString(),
        };
      }
      return v;
    });

    if (affectedCount > 0) {
      saveVouchersToState(updated);
      setToastMessage(`✓ Renamed Account Head in ${affectedCount} linked vouchers: "${oldHeadName}" → "${newHeadName}".`);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  // FX Conversion Rates
  const BDT_TO_USD = 120.0;
  const BDT_TO_GBP = 150.0;

  // Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.voucherNumber.toLowerCase().includes(q) ||
        v.partyName.toLowerCase().includes(q) ||
        v.mainAccountHead.toLowerCase().includes(q) ||
        v.subCategoryHead.toLowerCase().includes(q) ||
        (v.taxChalanRef && v.taxChalanRef.toLowerCase().includes(q)) ||
        (v.bankReference && v.bankReference.toLowerCase().includes(q)) ||
        (v.linkedOrderNumber && v.linkedOrderNumber.toLowerCase().includes(q)) ||
        v.items.some((it) => it.description.toLowerCase().includes(q));

      // 2. Type Filter
      const matchesType = typeFilter === 'ALL' || v.type === typeFilter;

      // 3. Head Filter
      const matchesHead =
        selectedHead === 'ALL' ||
        v.mainAccountHead.toLowerCase().includes(selectedHead.toLowerCase());

      // 4. Payment Mode Filter
      const matchesPayment =
        selectedPaymentMode === 'ALL' || v.paymentMode === selectedPaymentMode;

      // 5. Attachment Filter
      const matchesAttachment =
        attachmentFilter === 'ALL' ||
        (attachmentFilter === 'WITH_ATTACHMENT' && !!v.physicalAttachment) ||
        (attachmentFilter === 'WITHOUT_ATTACHMENT' && !v.physicalAttachment);

      // 6. Date Filter
      let matchesDate = true;
      const todayStr = new Date().toISOString().split('T')[0];
      if (datePreset === 'TODAY') {
        matchesDate = v.date === todayStr;
      } else if (datePreset === 'THIS_MONTH') {
        const currentMonth = todayStr.substring(0, 7);
        matchesDate = v.date.startsWith(currentMonth);
      } else if (datePreset === 'FY_2026') {
        matchesDate = v.date.startsWith('2026');
      } else if (datePreset === 'CUSTOM') {
        if (customStartDate && v.date < customStartDate) matchesDate = false;
        if (customEndDate && v.date > customEndDate) matchesDate = false;
      }

      // 7. Station Bank Filter
      const matchesStation =
        stationFilter === 'ALL' ||
        v.stationCode === stationFilter ||
        (!v.stationCode && stationFilter === 'ARIEL_BD');

      return matchesSearch && matchesType && matchesHead && matchesPayment && matchesAttachment && matchesDate && matchesStation;
    });
  }, [vouchers, searchQuery, typeFilter, selectedHead, selectedPaymentMode, attachmentFilter, datePreset, customStartDate, customEndDate, stationFilter]);

  // ---------------------------------------------------------------------------
  // CHRONOLOGICAL CASHFLOW LEDGER WITH CONTINUOUS RUNNING BALANCE
  // ---------------------------------------------------------------------------
  const chronologicalLedgerEntries = useMemo(() => {
    // Sort all vouchers ascending by date, then voucher number for cumulative ledger calculation
    const sorted = [...vouchers].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return a.voucherNumber.localeCompare(b.voucherNumber);
    });

    let running = 0;
    return sorted.map((v, index) => {
      const isReceive = v.type === 'CASH_RECEIVE';
      const incomeAmount = isReceive ? v.totalAmountBdt : 0;
      const expenseAmount = !isReceive ? v.totalAmountBdt : 0;
      running = running + incomeAmount - expenseAmount;

      return {
        id: v.id,
        index: index + 1,
        voucher: v,
        incomeAmount,
        expenseAmount,
        runningBalance: running,
      };
    });
  }, [vouchers]);

  // Filtered Ledger Entries (with selectable chronological or latest-first sorting)
  const filteredLedgerEntries = useMemo(() => {
    const list = chronologicalLedgerEntries.filter(({ voucher: v }) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.voucherNumber.toLowerCase().includes(q) ||
        v.partyName.toLowerCase().includes(q) ||
        v.mainAccountHead.toLowerCase().includes(q) ||
        v.subCategoryHead.toLowerCase().includes(q) ||
        (v.taxChalanRef && v.taxChalanRef.toLowerCase().includes(q)) ||
        (v.bankReference && v.bankReference.toLowerCase().includes(q)) ||
        (v.linkedOrderNumber && v.linkedOrderNumber.toLowerCase().includes(q)) ||
        v.items.some((it) => it.description.toLowerCase().includes(q));

      // 2. Type Filter
      const matchesType = typeFilter === 'ALL' || v.type === typeFilter;

      // 3. Head Filter
      const matchesHead =
        selectedHead === 'ALL' ||
        v.mainAccountHead.toLowerCase().includes(selectedHead.toLowerCase());

      // 4. Payment Mode Filter
      const matchesPayment =
        selectedPaymentMode === 'ALL' || v.paymentMode === selectedPaymentMode;

      // 5. Attachment Filter
      const matchesAttachment =
        attachmentFilter === 'ALL' ||
        (attachmentFilter === 'WITH_ATTACHMENT' && !!v.physicalAttachment) ||
        (attachmentFilter === 'WITHOUT_ATTACHMENT' && !v.physicalAttachment);

      // 6. Date Filter
      let matchesDate = true;
      const todayStr = new Date().toISOString().split('T')[0];
      if (datePreset === 'TODAY') {
        matchesDate = v.date === todayStr;
      } else if (datePreset === 'THIS_MONTH') {
        const currentMonth = todayStr.substring(0, 7);
        matchesDate = v.date.startsWith(currentMonth);
      } else if (datePreset === 'FY_2026') {
        matchesDate = v.date.startsWith('2026');
      } else if (datePreset === 'CUSTOM') {
        if (customStartDate && v.date < customStartDate) matchesDate = false;
        if (customEndDate && v.date > customEndDate) matchesDate = false;
      }

      // 7. Station Bank Filter
      const matchesStation =
        stationFilter === 'ALL' ||
        v.stationCode === stationFilter ||
        (!v.stationCode && stationFilter === 'ARIEL_BD');

      return matchesSearch && matchesType && matchesHead && matchesPayment && matchesAttachment && matchesDate && matchesStation;
    });

    if (ledgerSortOrder === 'LATEST_FIRST') {
      return [...list].reverse();
    }
    return list;
  }, [chronologicalLedgerEntries, searchQuery, typeFilter, selectedHead, selectedPaymentMode, attachmentFilter, datePreset, customStartDate, customEndDate, ledgerSortOrder, stationFilter]);

  const filteredTotalIncome = useMemo(() => {
    return filteredLedgerEntries.reduce((sum, item) => sum + item.incomeAmount, 0);
  }, [filteredLedgerEntries]);

  const filteredTotalExpenditure = useMemo(() => {
    return filteredLedgerEntries.reduce((sum, item) => sum + item.expenseAmount, 0);
  }, [filteredLedgerEntries]);

  const filteredNetCashflow = filteredTotalIncome - filteredTotalExpenditure;

  // Station Bank Inflows Breakdown
  const stationInflowMetrics = useMemo(() => {
    const stations = [
      { code: 'ARIEL_UK', name: 'UK Station', flag: '🇬🇧', bank: 'Barclays / Wise', currency: 'GBP', defaultFx: 152.0 },
      { code: 'ARIEL_US', name: 'US Station', flag: '🇺🇸', bank: 'Chase / Stripe', currency: 'USD', defaultFx: 121.5 },
      { code: 'ARIEL_EU', name: 'EU Station', flag: '🇪🇺', bank: 'ING / Rabobank', currency: 'EUR', defaultFx: 132.0 },
      { code: 'ARIEL_AU', name: 'AU Station', flag: '🇦🇺', bank: 'CBA / Airwallex', currency: 'AUD', defaultFx: 80.0 },
      { code: 'ARIEL_BD', name: 'BD Central', flag: '🇧🇩', bank: 'Eastern Bank PLC', currency: 'BDT', defaultFx: 1.0 },
    ];

    return stations.map((st) => {
      const matching = vouchers.filter(
        (v) => v.type === 'CASH_RECEIVE' && (v.stationCode === st.code || (!v.stationCode && st.code === 'ARIEL_BD'))
      );
      const totalBdt = matching.reduce((sum, v) => sum + v.totalAmountBdt, 0);
      const totalForeign = matching.reduce((sum, v) => sum + (v.currency === st.currency ? v.totalAmount : 0), 0);
      return {
        ...st,
        count: matching.length,
        totalBdt,
        totalForeign,
      };
    });
  }, [vouchers]);

  // Export Daily Cashflow Ledger to CSV
  const handleExportCashflowCSV = () => {
    const headers = [
      'Sl',
      'Date',
      'Voucher Number',
      'Classification',
      'Station Code',
      'Station Bank Account',
      'D2C Channel',
      'Account Head',
      'Sub-Category',
      'Party / Payee / Buyer',
      'Particulars',
      'Payment Mode',
      'Bank / Cheque Ref',
      'Linked Order',
      'Currency',
      'Original Amount',
      'Income (Receive) [BDT]',
      'Expenditure [BDT]',
      'Running Cash Balance [BDT]',
      'Physical Memo Number',
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredLedgerEntries.map((item, idx) => {
      const v = item.voucher;
      return [
        idx + 1,
        v.date,
        v.voucherNumber,
        v.type === 'CASH_RECEIVE' ? 'INCOME / RECEIVE' : 'EXPENDITURE / PAYMENT',
        v.stationCode || 'ARIEL_BD',
        v.stationBankName || 'Eastern Bank PLC',
        v.channel || 'Standard Wire/Cash',
        v.mainAccountHead,
        v.subCategoryHead || '',
        v.partyName,
        v.items?.[0]?.description || v.notes || '',
        v.paymentMode,
        v.bankReference || v.taxChalanRef || '',
        v.linkedOrderNumber || '',
        v.currency,
        v.totalAmount,
        item.incomeAmount,
        item.expenseAmount,
        item.runningBalance,
        v.physicalAttachment?.memoNumber || '',
      ].map(escapeCsv).join(',');
    });

    const csvContent = [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ArielMC_Daily_Cashflow_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aggregate Totals
  const totalDisbursementsBdt = useMemo(() => {
    return vouchers
      .filter((v) => v.type === 'CASH_PURCHASE')
      .reduce((sum, v) => sum + v.totalAmountBdt, 0);
  }, [vouchers]);

  const totalInflowsBdt = useMemo(() => {
    return vouchers
      .filter((v) => v.type === 'CASH_RECEIVE')
      .reduce((sum, v) => sum + v.totalAmountBdt, 0);
  }, [vouchers]);

  const netCashBalanceBdt = totalInflowsBdt - totalDisbursementsBdt;

  // Totals by the 4 standard expense heads
  const totalsByExpenseHead = useMemo(() => {
    const res = {
      HEAD_1_COGS: 0,
      HEAD_2_LOGISTICS: 0,
      HEAD_3_BIZDEV_COMPLIANCE: 0,
      HEAD_4_ADMIN_OVERHEAD: 0,
    };
    vouchers
      .filter((v) => v.type === 'CASH_PURCHASE')
      .forEach((v) => {
        if (v.mainAccountHead.includes('1.')) res.HEAD_1_COGS += v.totalAmountBdt;
        else if (v.mainAccountHead.includes('2.')) res.HEAD_2_LOGISTICS += v.totalAmountBdt;
        else if (v.mainAccountHead.includes('3.')) res.HEAD_3_BIZDEV_COMPLIANCE += v.totalAmountBdt;
        else if (v.mainAccountHead.includes('4.')) res.HEAD_4_ADMIN_OVERHEAD += v.totalAmountBdt;
      });
    return res;
  }, [vouchers]);

  // Domestic Value Addition Calculation
  const localValueBdt = useMemo(() => {
    return vouchers
      .filter((v) => v.type === 'CASH_PURCHASE' && v.isLocalValueAddition)
      .reduce((sum, v) => sum + v.totalAmountBdt, 0);
  }, [vouchers]);

  const domesticValueAdditionPct = totalDisbursementsBdt > 0 ? (localValueBdt / totalDisbursementsBdt) * 100 : 0;
  const cogsPct = totalDisbursementsBdt > 0 ? (totalsByExpenseHead.HEAD_1_COGS / totalDisbursementsBdt) * 100 : 0;
  const overheadPct = 100 - cogsPct;

  // Attached Physical Memo Statistics
  const memoAttachmentCount = useMemo(() => {
    return vouchers.filter((v) => !!v.physicalAttachment).length;
  }, [vouchers]);
  const attachmentRatePct = vouchers.length > 0 ? (memoAttachmentCount / vouchers.length) * 100 : 0;

  // Handler: Open Create Modal (Properly set initial voucher type for Cash Purchase or Money Receive)
  const handleOpenCreateVoucher = (type: VoucherType) => {
    setActiveModalVoucher(null);
    setCreateVoucherType(type);
    setModalMode('CREATE');
    setIsVoucherModalOpen(true);
  };

  // Handler: Open View Voucher
  const handleOpenViewVoucher = (v: StandardVoucher) => {
    setActiveModalVoucher(v);
    setCreateVoucherType(v.type);
    setModalMode('VIEW');
    setIsVoucherModalOpen(true);
  };

  // Handler: Open Edit Voucher
  const handleOpenEditVoucher = (v: StandardVoucher) => {
    setActiveModalVoucher(v);
    setCreateVoucherType(v.type);
    setModalMode('EDIT');
    setIsVoucherModalOpen(true);
  };

  // Handler: Save Voucher from Modal (Saves to both state/localStorage & database persistence)
  const handleSaveVoucher = (saved: StandardVoucher) => {
    const existingIndex = vouchers.findIndex((v) => v.id === saved.id);
    let updated: StandardVoucher[];
    if (existingIndex >= 0) {
      updated = [...vouchers];
      updated[existingIndex] = saved;
    } else {
      updated = [saved, ...vouchers];
    }
    saveVouchersToState(updated);
    persistVoucher(saved);
    setActiveModalVoucher(saved);
    setModalMode('VIEW');
    setToastMessage(`✓ ${saved.type === 'CASH_PURCHASE' ? 'Cash Purchase' : 'Money Receive'} Voucher [${saved.voucherNumber}] saved successfully to ledger!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Handler: Quick File Upload on a table row
  const handleQuickUploadMemo = (voucherId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const targetV = vouchers.find((v) => v.id === voucherId);
    if (!targetV) return;

    const newAtt: PhysicalAttachment = {
      id: `att-${Date.now()}`,
      fileName: file.name,
      fileUrl: fileUrl,
      fileType: file.type.includes('pdf') ? 'PDF' : file.type.includes('png') ? 'IMAGE_PNG' : 'IMAGE_JPG',
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toISOString(),
      memoNumber: `MEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      memoDate: targetV.date,
      supplierShopName: targetV.partyName,
      notes: 'Physical cash memo / supplier bill uploaded and archived for statutory audit.',
    };

    const updated = vouchers.map((v) => (v.id === voucherId ? { ...v, physicalAttachment: newAtt } : v));
    saveVouchersToState(updated);
  };

  // Handler: View Physical Memo
  const handleViewMemo = (att: PhysicalAttachment, v: StandardVoucher) => {
    setActiveMemoAttachment(att);
    setActiveMemoVoucherMeta({
      voucherNumber: v.voucherNumber,
      voucherType: v.type,
      partyName: v.partyName,
    });
    setIsMemoViewerOpen(true);
  };

  // Official Audit Document for Statement Sharing
  const dailyAuditDoc: OfficialDocument = {
    id: 'DOC-FIN-VOUCHERS-AUDIT-2026',
    docCode: 'AMC-VOUCHER-LEDGER-2026',
    documentNumber: 'AMC-VOUCHER-LEDGER-2026',
    title: 'ArielMC Accounts & Finance - Official Voucher Ledger & Audit Statement',
    category: 'STATUTORY_VOUCHER_AUDIT',
    section: 'STATION_STATUTORY',
    issuingAuthority: 'ArielMC Directorate of Accounts & Finance (Dhaka Central Station)',
    station: 'ARIEL_BD',
    countryCode: 'BD',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '2026-12-31',
    renewalLeadDays: 30,
    status: 'ACTIVE',
    verificationUrl: 'https://erp.arielmc.com/verify-doc?code=AMC-VOUCHER-LEDGER-2026&ack=true',
    qrCodeData: `AMC-VOUCHER-LEDGER-2026|DISBURSEMENTS_${totalDisbursementsBdt}|INFLOWS_${totalInflowsBdt}|DOMESTIC_VALUE_${domesticValueAdditionPct.toFixed(1)}%`,
    fileUrl: '/docs/ArielMC_Compliance_Dossier.pdf',
    fileFormat: 'PDF',
    fileSize: '2.1 MB',
    version: '2026.1',
    verified: true,
    uploadedBy: 'Tanvir Hossain (Accounts / Finance Lead)',
    uploadedAt: new Date().toISOString(),
    tags: ['Cash Purchase Vouchers', 'Money Receive Vouchers', 'Physical Memo Audit', 'Domestic Value Addition'],
    notes: `Official audited cash vouchers statement comprising ${vouchers.length} verified records (Disbursements: ৳ ${totalDisbursementsBdt.toLocaleString()}, Buyer Inflows: ৳ ${totalInflowsBdt.toLocaleString()}). Domestic value addition certified at ${domesticValueAdditionPct.toFixed(1)}% for Bangladesh EPB & Customs compliance.`,
    isStatutoryRequirement: true,
  };

  return (
    <div className="space-y-6">
      
      {/* Save Success Ledger Notification Toast */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#12231B] to-[#1F3A2E] border-2 border-emerald-500/60 text-white flex items-center justify-between text-xs font-mono shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#C8A96A] shrink-0" />
            <span className="font-bold text-emerald-200">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================
          1. COMPACT EXECUTIVE VOUCHER COMMAND BAR & MASTER ACTIONS
          ========================================================= */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#12231B] via-[#162B22] to-[#1F3A2E] border border-[#2C5240] text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left Title: Single horizontal line */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#C8A96A]/20 border border-[#C8A96A]/40 text-[#C8A96A] shrink-0">
              <Receipt className="w-5 h-5 text-[#C8A96A]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold font-heading tracking-tight text-white whitespace-nowrap">
                  Cash Purchase &amp; Money Receive Voucher Console
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#C8A96A] text-[#12231B] font-mono text-[10px] font-bold">
                  ACCOUNTS &amp; FINANCE
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-300 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Statutory Audited
                </span>
              </div>
              <p className="text-[11px] text-white/70 line-clamp-1 font-['Open_Sans'] mt-0.5">
                Standardized dual-flow voucher ledger with instant physical supplier cash memo verification &amp; real-time station bank sync.
              </p>
            </div>
          </div>

          {/* Right Action Buttons: Clean 2-Line Layout */}
          <div className="flex flex-col gap-1.5 shrink-0 sm:items-end">
            {/* Line 1: Voucher Entries & Inflow Operations */}
            <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
              {/* Real-time Station B2C Inflow */}
              <button
                type="button"
                onClick={() => setIsStationB2CModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer font-['Montserrat'] border border-cyan-400/50"
                title="Record daily B2C / D2C payment received directly into overseas station bank accounts"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <Landmark className="w-3.5 h-3.5 text-cyan-200" />
                <span>+ Station Inflow</span>
              </button>

              {/* New Cash Purchase Voucher */}
              <button
                type="button"
                onClick={() => handleOpenCreateVoucher('CASH_PURCHASE')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>+ Purchase Voucher</span>
              </button>

              {/* New Money Receive Voucher */}
              <button
                type="button"
                onClick={() => handleOpenCreateVoucher('CASH_RECEIVE')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8A96A] hover:bg-[#d5b97d] text-[#12231B] text-xs font-bold shadow transition-all cursor-pointer font-['Montserrat']"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-[#12231B]" />
                <span>+ Receive Voucher</span>
              </button>
            </div>

            {/* Line 2: Report Generator, Account Heads, Print & Share Tools */}
            <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap justify-start sm:justify-end w-full">
              {/* Generate Report Button */}
              <button
                type="button"
                onClick={() => setIsReportGenModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-500/50 text-xs font-bold shadow transition-all cursor-pointer font-['Montserrat']"
                title="Generate and export comprehensive Cashflow Ledger Statement"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>+ Generate Report</span>
              </button>

              {/* Manage Account Heads */}
              <button
                type="button"
                onClick={() => setIsAccountHeadModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-white border border-purple-400/40 text-xs font-semibold shadow transition-all cursor-pointer font-['Montserrat']"
                title="Create, rename or delete Account Heads"
              >
                <FolderTree className="w-3.5 h-3.5 text-purple-300" />
                <span>Account Heads ({accountHeads.length})</span>
              </button>

              {/* Print Statement */}
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs transition-all cursor-pointer"
                title="Print Voucher Ledger & Audit Statement"
              >
                <Printer className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Print Ledger</span>
              </button>

              {/* Share Option */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold shadow transition-all cursor-pointer border border-teal-500/40"
                title="Share Ledger Statement for Verified / Acknowledgement"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share (Verify / Ack)</span>
              </button>
            </div>
          </div>
        </div>

        {/* High-Density Inline Financial Metrics Ribbon */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase text-gray-400 font-semibold">Disbursements:</span>
              <span className="font-bold text-[#C8A96A]">৳ {totalDisbursementsBdt.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400 hidden lg:inline">(≈${(totalDisbursementsBdt / BDT_TO_USD).toFixed(0)} USD)</span>
            </div>

            <span className="text-gray-600 hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase text-emerald-400 font-semibold">Received:</span>
              <span className="font-bold text-emerald-400">৳ {totalInflowsBdt.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400 hidden lg:inline">(≈${(totalInflowsBdt / BDT_TO_USD).toFixed(0)} USD)</span>
            </div>

            <span className="text-gray-600 hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase text-gray-300 font-semibold">Net Balance:</span>
              <span className={`font-bold ${netCashBalanceBdt >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                {netCashBalanceBdt >= 0 ? '+' : ''}৳ {netCashBalanceBdt.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 font-sans hidden md:inline">
                ({netCashBalanceBdt >= 0 ? 'Surplus Runway' : 'Drawdown'})
              </span>
            </div>

            <span className="text-gray-600 hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="text-[10px] uppercase text-gray-300 font-semibold">Memos:</span>
              <span className="font-bold text-white">{memoAttachmentCount}/{vouchers.length}</span>
              <span className="text-[10px] text-emerald-400">({attachmentRatePct.toFixed(0)}%)</span>
            </div>
          </div>

          {/* Quick toggle to show/hide heavy station & compliance cards */}
          <button
            type="button"
            onClick={() => setShowAnalyticsDetails(!showAnalyticsDetails)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] text-cyan-200 transition-colors font-sans ml-auto cursor-pointer border border-white/10"
          >
            <Landmark className="w-3 h-3 text-cyan-300" />
            <span>Station Accounts &amp; Compliance ({domesticValueAdditionPct.toFixed(0)}%)</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAnalyticsDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* =========================================================
          COLLAPSIBLE STATION BANK ACCOUNTS & DOMESTIC COMPLIANCE
          (Kept collapsed by default to save screen space)
          ========================================================= */}
      {showAnalyticsDetails && (
        <div className="space-y-4 animate-fadeIn">
          {/* Station Bank Accounts Monitor */}
          <div className="p-4 rounded-xl bg-[#0A140F] border border-cyan-800/50 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2C5240]/60">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-cyan-300" />
                <h3 className="font-bold text-xs text-white font-heading">
                  Overseas &amp; Station Bank Inflows — Daily B2C / D2C Settlements
                </h3>
                <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono font-bold">
                  REAL-TIME ERP SYNC
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsStationB2CModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white text-[11px] font-bold shadow transition-all cursor-pointer font-['Montserrat'] border border-cyan-400/40"
              >
                <Plus className="w-3 h-3 text-cyan-200" />
                <span>Record Inflow</span>
              </button>
            </div>

            {/* 5 Station Bank Inflow Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 font-mono">
              {stationInflowMetrics.map((st) => (
                <div
                  key={st.code}
                  onClick={() => {
                    setStationFilter(stationFilter === st.code ? 'ALL' : st.code);
                  }}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    stationFilter === st.code
                      ? 'bg-gradient-to-br from-[#162B22] to-[#1F3A2E] border-cyan-400 shadow ring-1 ring-cyan-400'
                      : 'bg-[#12231B]/60 border-[#2C5240] hover:border-cyan-600/60 hover:bg-[#12231B]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base">{st.flag}</span>
                    <span className="text-[9px] font-bold text-gray-400 px-1 py-0.2 rounded bg-black/40">
                      {st.currency}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {st.name}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {st.bank}
                  </div>
                  
                  <div className="mt-1.5 pt-1.5 border-t border-white/10 space-y-0.5">
                    <div className="text-xs font-bold text-emerald-400">
                      ৳ {st.totalBdt.toLocaleString()}
                    </div>
                    {st.currency !== 'BDT' && (
                      <div className="text-[9px] text-gray-400">
                        {st.currency} {st.totalForeign.toLocaleString()} @ ৳{st.defaultFx}
                      </div>
                    )}
                    <div className="text-[9px] text-gray-500 flex items-center justify-between pt-0.5">
                      <span>{st.count} received</span>
                      {stationFilter === st.code && (
                        <span className="text-cyan-400 font-bold">● Filtered</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Domestic Value Addition & 4 Heads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Metric 1: Domestic Value Addition Gauge */}
            <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold">
                  DOMESTIC VALUE-ADDITION (%)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold">
                  NBR / EPB Rule: ≥ 40%
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold font-mono text-[#1F3A2E]">
                  {domesticValueAdditionPct.toFixed(1)}%
                </div>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Statutory Compliant
                </span>
              </div>

              <div className="space-y-1">
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(domesticValueAdditionPct, 100)}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-500"
                    style={{ left: '40%' }}
                    title="40% Statutory Threshold"
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-gray-400">
                  <span>0%</span>
                  <span className="text-rose-600 font-bold">40% Min Threshold</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Metric 2: Operational Overhead vs. Direct Sourcing */}
            <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold">
                  OVERHEAD VS DIRECT SOURCING
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[9px] font-mono font-bold">
                  Efficiency Ratio
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-[9px] text-emerald-800 uppercase block font-semibold">Direct COGS</span>
                  <div className="text-base font-bold text-emerald-900">{cogsPct.toFixed(1)}%</div>
                  <span className="text-[9px] text-emerald-700">৳ {totalsByExpenseHead.HEAD_1_COGS.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="text-[9px] text-amber-800 uppercase block font-semibold">Overhead</span>
                  <div className="text-base font-bold text-amber-900">{overheadPct.toFixed(1)}%</div>
                  <span className="text-[9px] text-amber-700">৳ {(totalDisbursementsBdt - totalsByExpenseHead.HEAD_1_COGS).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Metric 3: Head Breakdown Quick Selector */}
            <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold block">
                THE 4 STATUTORY EXPENSE HEADS
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                <div
                  onClick={() => setSelectedHead(selectedHead === '1.' ? 'ALL' : '1.')}
                  className={`p-1.5 rounded border flex flex-col justify-between cursor-pointer transition-colors ${
                    selectedHead === '1.' ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">1. Sourcing COGS</span>
                  <span className="font-bold">৳ {totalsByExpenseHead.HEAD_1_COGS.toLocaleString()}</span>
                </div>

                <div
                  onClick={() => setSelectedHead(selectedHead === '2.' ? 'ALL' : '2.')}
                  className={`p-1.5 rounded border flex flex-col justify-between cursor-pointer transition-colors ${
                    selectedHead === '2.' ? 'bg-blue-100 border-blue-500 text-blue-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">2. Freight &amp; Port</span>
                  <span className="font-bold">৳ {totalsByExpenseHead.HEAD_2_LOGISTICS.toLocaleString()}</span>
                </div>

                <div
                  onClick={() => setSelectedHead(selectedHead === '3.' ? 'ALL' : '3.')}
                  className={`p-1.5 rounded border flex flex-col justify-between cursor-pointer transition-colors ${
                    selectedHead === '3.' ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">3. BizDev &amp; Audit</span>
                  <span className="font-bold">৳ {totalsByExpenseHead.HEAD_3_BIZDEV_COMPLIANCE.toLocaleString()}</span>
                </div>

                <div
                  onClick={() => setSelectedHead(selectedHead === '4.' ? 'ALL' : '4.')}
                  className={`p-1.5 rounded border flex flex-col justify-between cursor-pointer transition-colors ${
                    selectedHead === '4.' ? 'bg-purple-100 border-purple-500 text-purple-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">4. Admin &amp; Office</span>
                  <span className="font-bold">৳ {totalsByExpenseHead.HEAD_4_ADMIN_OVERHEAD.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* =========================================================
          3. ADVANCED SEARCH & FILTER CONSOLE
          ========================================================= */}
      <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
        
        {/* Top Search Input & Type Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Voucher No (AMC-EXP-...), Payee / Buyer, Particulars, Chalan Ref, Bank Ref..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#1F3A2E] focus:border-transparent outline-none font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Voucher Type Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                typeFilter === 'ALL'
                  ? 'bg-[#1F3A2E] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Vouchers ({vouchers.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('CASH_PURCHASE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                typeFilter === 'CASH_PURCHASE'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Purchase / Expense ({vouchers.filter(v => v.type === 'CASH_PURCHASE').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('CASH_RECEIVE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                typeFilter === 'CASH_RECEIVE'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Money Receive ({vouchers.filter(v => v.type === 'CASH_RECEIVE').length})</span>
            </button>
          </div>
        </div>

        {/* Secondary Filter Row: Date Presets, Account Head, Payment Mode, Memo Attachment, Station Bank */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs pt-1 border-t border-gray-100">
          
          {/* 1. Date Range Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">
              Date Filter
            </label>
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-gray-300 text-xs bg-white text-gray-800 font-mono focus:border-[#1F3A2E] outline-none"
            >
              <option value="ALL">All Dates (Full Ledger)</option>
              <option value="TODAY">Today Only</option>
              <option value="THIS_MONTH">This Month (Oct 2026)</option>
              <option value="FY_2026">Financial Year 2026</option>
              <option value="CUSTOM">Custom Date Range...</option>
            </select>
          </div>

          {/* 2. Account Head Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">
              Account Head Filter
            </label>
            <select
              value={selectedHead}
              onChange={(e) => setSelectedHead(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 text-xs bg-white text-gray-800 truncate focus:border-[#1F3A2E] outline-none"
            >
              <option value="ALL">All Account Heads ({accountHeads.length})</option>
              <optgroup label="Expense Heads">
                {accountHeads.filter(h => h.type === 'EXPENSE').map(h => (
                  <option key={h.id} value={h.name}>{h.code ? `[${h.code}] ` : ''}{h.name}</option>
                ))}
              </optgroup>
              <optgroup label="Income Heads">
                {accountHeads.filter(h => h.type === 'INCOME').map(h => (
                  <option key={h.id} value={h.name}>{h.code ? `[${h.code}] ` : ''}{h.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* 3. Payment Mode Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">
              Payment Instrument
            </label>
            <select
              value={selectedPaymentMode}
              onChange={(e) => setSelectedPaymentMode(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-gray-300 text-xs bg-white text-gray-800 font-mono focus:border-[#1F3A2E] outline-none"
            >
              <option value="ALL">All Instruments</option>
              <option value="CASH">Cash in Hand / Cash Counter</option>
              <option value="BEFTN_BANK">Bank Transfer (BEFTN/RTGS)</option>
              <option value="SWIFT_WIRE">SWIFT Wire / Foreign TT</option>
              <option value="CHEQUE">Cheque / Pay Order</option>
              <option value="LC_AT_SIGHT">Irrevocable L/C at Sight</option>
              <option value="CORP_CARD">Corporate Visa / Mastercard</option>
            </select>
          </div>

          {/* 4. Physical Attachment Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">
              Physical Memo Attachment
            </label>
            <select
              value={attachmentFilter}
              onChange={(e) => setAttachmentFilter(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-gray-300 text-xs bg-white text-gray-800 font-mono focus:border-[#1F3A2E] outline-none"
            >
              <option value="ALL">All (Attached &amp; Pending)</option>
              <option value="WITH_ATTACHMENT">📎 Has Physical Cash Memo</option>
              <option value="WITHOUT_ATTACHMENT">Missing Physical Memo</option>
            </select>
          </div>

          {/* 5. Station Bank Account Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1">
              Station Bank Desk
            </label>
            <select
              value={stationFilter}
              onChange={(e) => setStationFilter(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 text-xs bg-white text-gray-800 font-mono focus:border-[#1F3A2E] outline-none"
            >
              <option value="ALL">All Stations (Global)</option>
              <option value="ARIEL_UK">🇬🇧 UK Station (Barclays/Wise)</option>
              <option value="ARIEL_US">🇺🇸 US Station (Chase/Stripe)</option>
              <option value="ARIEL_EU">🇪🇺 EU Station (ING/Rabobank)</option>
              <option value="ARIEL_AU">🇦🇺 AU Station (CBA/Airwallex)</option>
              <option value="ARIEL_BD">🇧🇩 BD Central (Eastern Bank)</option>
            </select>
          </div>
        </div>

        {/* Custom Date Pickers if enabled */}
        {datePreset === 'CUSTOM' && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono">
            <span className="font-bold text-gray-700">From Date:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="p-1.5 rounded border border-gray-300 bg-white"
            />
            <span className="font-bold text-gray-700">To Date:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="p-1.5 rounded border border-gray-300 bg-white"
            />
            <button
              type="button"
              onClick={() => {
                setCustomStartDate('');
                setCustomEndDate('');
              }}
              className="text-xs text-gray-500 hover:text-gray-800 underline ml-2"
            >
              Clear Range
            </button>
          </div>
        )}

        {/* Active Filters Summary Pill Strip */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <div>
            Showing <strong className="text-gray-900">{filteredVouchers.length}</strong> of {vouchers.length} vouchers matching criteria.
          </div>
          {(searchQuery || typeFilter !== 'ALL' || selectedHead !== 'ALL' || selectedPaymentMode !== 'ALL' || attachmentFilter !== 'ALL' || datePreset !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('ALL');
                setSelectedHead('ALL');
                setSelectedPaymentMode('ALL');
                setAttachmentFilter('ALL');
                setDatePreset('ALL');
                setCustomStartDate('');
                setCustomEndDate('');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* =========================================================
          4. MULTI-VIEW CONSOLE SWITCHER TABS
          ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-[#0A140F] border-2 border-[#2C5240] rounded-2xl shadow-lg">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Tab 1: Daily Cashflow Ledger */}
          <button
            type="button"
            onClick={() => setActiveLedgerView('CASHFLOW_LEDGER')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeLedgerView === 'CASHFLOW_LEDGER'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-[#C8A96A]" />
            <span>Daily Cashflow Ledger (Income &amp; Expenditure)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white">
              {filteredLedgerEntries.length}
            </span>
          </button>

          {/* Tab 2: Voucher Register */}
          <button
            type="button"
            onClick={() => setActiveLedgerView('VOUCHER_REGISTER')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeLedgerView === 'VOUCHER_REGISTER'
                ? 'bg-gradient-to-r from-[#1E6B3A] to-[#14512C] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Receipt className="w-4 h-4 text-[#C8A96A]" />
            <span>Voucher Register &amp; Memos</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white">
              {filteredVouchers.length}
            </span>
          </button>

          {/* Tab 3: Account Heads Directory */}
          <button
            type="button"
            onClick={() => setActiveLedgerView('ACCOUNT_HEADS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeLedgerView === 'ACCOUNT_HEADS'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-900 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderTree className="w-4 h-4 text-purple-300" />
            <span>Account Heads Directory</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/30 text-purple-200">
              {accountHeads.length} Heads
            </span>
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2 px-2">
          {activeLedgerView === 'CASHFLOW_LEDGER' && (
            <>
              {/* Chronological sorting toggle */}
              <button
                type="button"
                onClick={() => setLedgerSortOrder(prev => prev === 'CHRONOLOGICAL_ASC' ? 'LATEST_FIRST' : 'CHRONOLOGICAL_ASC')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-all cursor-pointer border border-white/10"
                title="Toggle between Chronological Running Balance and Latest First"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>{ledgerSortOrder === 'CHRONOLOGICAL_ASC' ? 'Running Flow (Oldest First)' : 'Latest First'}</span>
              </button>

              {/* Export CSV button */}
              <button
                type="button"
                onClick={handleExportCashflowCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer border border-emerald-500/30"
                title="Export Daily Cashflow Ledger to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </>
          )}

          {activeLedgerView === 'ACCOUNT_HEADS' && (
            <button
              type="button"
              onClick={() => setIsAccountHeadModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create / Manage Heads</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================
          VIEW 1: DAILY CASHFLOW LEDGER (INCOME & EXPENDITURE TABLE)
          ========================================================= */}
      {activeLedgerView === 'CASHFLOW_LEDGER' && (
        <div className="printable-content bg-white rounded-2xl border border-[#DDE3DD] shadow-sm overflow-hidden">
          {/* Ledger Header Bar */}
          <div className="p-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-[#DDE3DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300">
                <FileSpreadsheet className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm font-heading text-gray-900">
                    Daily Cashflow Ledger — Income (Receive) &amp; Expenditure
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Double-Entry Running Balance
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-['Open_Sans'] mt-0.5">
                  Chronological cashflow ledger displaying daily money receives, disbursements, associated statutory account heads, and dynamic running cash balance.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={handleExportCashflowCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold transition-all cursor-pointer"
                title="Download CSV Spreadsheet of Cashflow Ledger"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 text-xs font-mono transition-all cursor-pointer"
                title="Print Daily Cashflow Ledger Statement"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Ledger</span>
              </button>
            </div>
          </div>

          {/* Cashflow Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#12231B] text-white font-mono text-[11px]">
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-3 w-28">Date</th>
                  <th className="py-3 px-3 w-36">Voucher No</th>
                  <th className="py-3 px-3 w-28 text-center">Flow Type</th>
                  <th className="py-3 px-3">Account Head &amp; Sub-Category</th>
                  <th className="py-3 px-3">Particulars / Payee / Buyer</th>
                  <th className="py-3 px-3 w-28">Payment Mode</th>
                  <th className="py-3 px-3 w-32 text-right bg-emerald-950/50 text-emerald-300">
                    Income (Receive) (৳)
                  </th>
                  <th className="py-3 px-3 w-32 text-right bg-amber-950/50 text-amber-300">
                    Expenditure (৳)
                  </th>
                  <th className="py-3 px-3 w-36 text-right bg-[#162B22] text-[#C8A96A]">
                    Running Balance (৳)
                  </th>
                  <th className="py-3 px-3 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLedgerEntries.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-gray-400 font-mono">
                      <FileSpreadsheet className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      No cashflow ledger entries match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLedgerEntries.map((item, index) => {
                    const v = item.voucher;
                    const isReceive = v.type === 'CASH_RECEIVE';

                    return (
                      <tr key={v.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Serial */}
                        <td className="py-3 px-3 text-center align-middle font-mono text-[11px] text-gray-400">
                          {index + 1}
                        </td>

                        {/* Date */}
                        <td className="py-3 px-3 align-middle font-mono text-gray-700 whitespace-nowrap">
                          <div className="font-semibold">{v.date}</div>
                        </td>

                        {/* Voucher No */}
                        <td className="py-3 px-3 align-middle font-mono">
                          <button
                            type="button"
                            onClick={() => handleOpenViewVoucher(v)}
                            className="font-bold text-[#1F3A2E] hover:text-[#C8A96A] cursor-pointer hover:underline text-xs text-left"
                          >
                            {v.voucherNumber}
                          </button>
                          {v.linkedOrderNumber && (
                            <div className="text-[10px] text-emerald-700 font-bold">
                              Ord: {v.linkedOrderNumber}
                            </div>
                          )}
                        </td>

                        {/* Flow Type Badge */}
                        <td className="py-3 px-3 align-middle text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                              isReceive
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {isReceive ? (
                              <>
                                <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                                <span>INCOME</span>
                              </>
                            ) : (
                              <>
                                <ArrowUpRight className="w-3 h-3 text-amber-600" />
                                <span>EXPENSE</span>
                              </>
                            )}
                          </span>
                        </td>

                        {/* Account Head */}
                        <td className="py-3 px-3 align-middle">
                          <div className="font-bold text-gray-900 text-xs">
                            {v.mainAccountHead}
                          </div>
                          <div className="text-[10px] text-gray-500 truncate max-w-xs mt-0.5">
                            {v.subCategoryHead || 'General Particulars'}
                          </div>
                        </td>

                        {/* Particulars & Party */}
                        <td className="py-3 px-3 align-middle">
                          <div className="font-semibold text-gray-900 text-xs">
                            {v.partyName}
                          </div>
                          <div className="text-[11px] text-gray-600 truncate max-w-sm mt-0.5 font-['Open_Sans']">
                            {v.items?.[0]?.description || v.notes}
                          </div>
                          {v.stationCode && (
                            <div className="flex flex-wrap items-center gap-1 mt-1">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-900/10 text-cyan-800 border border-cyan-300">
                                {v.stationCode === 'ARIEL_UK' ? '🇬🇧 UK Station' : v.stationCode === 'ARIEL_US' ? '🇺🇸 US Station' : v.stationCode === 'ARIEL_EU' ? '🇪🇺 EU Station' : v.stationCode === 'ARIEL_AU' ? '🇦🇺 AU Station' : '🇧🇩 BD Station'} • {v.stationBankName || 'Station Account'}
                              </span>
                              {v.channel && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {v.channel}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Payment Mode & Ref */}
                        <td className="py-3 px-3 align-middle font-mono text-[11px]">
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700 font-semibold block w-fit">
                            {v.paymentMode}
                          </span>
                          {v.isStationB2CInflow && (
                            <span className="inline-block mt-0.5 text-[9px] font-bold text-cyan-700 font-mono">
                              ● Real-Time D2C
                            </span>
                          )}
                          {(v.bankReference || v.taxChalanRef) && (
                            <div className="text-[10px] text-gray-500 truncate mt-0.5 max-w-[120px]" title={v.bankReference || v.taxChalanRef}>
                              Ref: {v.bankReference || v.taxChalanRef}
                            </div>
                          )}
                        </td>

                        {/* Income (Receive) Amount */}
                        <td className="py-3 px-3 text-right align-middle font-mono bg-emerald-50/40">
                          {isReceive ? (
                            <div>
                              <div className="font-bold text-emerald-800 text-xs">
                                ৳ {item.incomeAmount.toLocaleString()}
                              </div>
                              {v.currency !== 'BDT' && (
                                <div className="text-[10px] text-gray-500">
                                  {v.currency} {v.totalAmount.toLocaleString()} @ ৳{v.exchangeRateToBdt}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-300 font-bold">—</span>
                          )}
                        </td>

                        {/* Expenditure Amount */}
                        <td className="py-3 px-3 text-right align-middle font-mono bg-amber-50/40">
                          {!isReceive ? (
                            <div>
                              <div className="font-bold text-amber-900 text-xs">
                                ৳ {item.expenseAmount.toLocaleString()}
                              </div>
                              {v.currency !== 'BDT' && (
                                <div className="text-[10px] text-gray-500">
                                  {v.currency} {v.totalAmount.toLocaleString()}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-300 font-bold">—</span>
                          )}
                        </td>

                        {/* Running Balance */}
                        <td className="py-3 px-3 text-right align-middle font-mono bg-[#162B22]/5">
                          <div className={`font-bold text-xs ${item.runningBalance >= 0 ? 'text-[#1F3A2E]' : 'text-rose-700'}`}>
                            ৳ {item.runningBalance.toLocaleString()}
                          </div>
                          <div className="text-[9px] text-gray-400">
                            {item.runningBalance >= 0 ? 'Surplus' : 'Deficit'}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-center align-middle">
                          <div className="flex items-center justify-center gap-1">
                            {/* Physical Memo Badge */}
                            {v.physicalAttachment ? (
                              <button
                                type="button"
                                onClick={() => handleViewMemo(v.physicalAttachment!, v)}
                                className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 transition-colors"
                                title="View Physical Scanned Memo"
                              >
                                <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                              </button>
                            ) : null}

                            {/* View */}
                            <button
                              type="button"
                              onClick={() => handleOpenViewVoucher(v)}
                              className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                              title="View Voucher"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditVoucher(v)}
                              className="px-2 py-0.5 rounded bg-[#1F3A2E] hover:bg-[#162B22] text-white text-[10px] font-bold transition-colors"
                              title="Edit Voucher"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Consolidated Summary Footer */}
              {filteredLedgerEntries.length > 0 && (
                <tfoot className="bg-[#0A140F] text-white font-mono text-xs border-t-2 border-[#C8A96A]">
                  <tr>
                    <td colSpan={7} className="py-3.5 px-3 font-bold text-right text-gray-300 uppercase tracking-wider text-[11px]">
                      Total Filtered Period Cashflow Summary:
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-400 bg-emerald-950/60">
                      ৳ {filteredTotalIncome.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-amber-300 bg-amber-950/60">
                      ৳ {filteredTotalExpenditure.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-[#C8A96A] bg-[#162B22]">
                      <div className="text-[11px] text-gray-300">Net Flow:</div>
                      <div>৳ {filteredNetCashflow.toLocaleString()}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center text-[10px] text-gray-400">
                      {filteredLedgerEntries.length} Items
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW 2: VOUCHER REGISTER & PHYSICAL ATTACHMENTS
          ========================================================= */}
      {activeLedgerView === 'VOUCHER_REGISTER' && (
        <div className="bg-white rounded-2xl border border-[#DDE3DD] shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-[#DDE3DD] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#1F3A2E]" />
              <h3 className="font-bold text-sm font-heading text-gray-900">
                Transactions &amp; Voucher Disbursement / Inflow Register
              </h3>
            </div>
            <span className="text-xs text-gray-500 font-mono">
              Directly Linked to ERP Accounts Ledger &amp; Bangladesh Customs Audit
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#12231B] text-white font-mono text-[11px]">
                  <th className="py-3 px-3 w-10 text-center">Type</th>
                  <th className="py-3 px-3 w-40">Voucher No &amp; Date</th>
                  <th className="py-3 px-3">Particulars / Payee / Buyer</th>
                  <th className="py-3 px-3">Account Head &amp; Category</th>
                  <th className="py-3 px-3 w-28 text-right">Amount</th>
                  <th className="py-3 px-3 w-44 text-center">Physical Cash Memo</th>
                  <th className="py-3 px-3 w-48 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVouchers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400 font-mono">
                      <Receipt className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      No vouchers match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((v) => {
                    const isPurchase = v.type === 'CASH_PURCHASE';

                    return (
                      <tr key={v.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Type Badge */}
                        <td className="py-3 px-3 text-center align-top">
                          <span
                            className={`inline-flex p-1.5 rounded-lg ${
                              isPurchase
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                            title={isPurchase ? 'Cash Purchase / Disbursement' : 'Money Receive (Buyer Inflow)'}
                          >
                            {isPurchase ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                          </span>
                        </td>

                        {/* Voucher No & Date */}
                        <td className="py-3 px-3 align-top font-mono">
                          <div
                            onClick={() => handleOpenViewVoucher(v)}
                            className="font-bold text-[#1F3A2E] hover:text-[#C8A96A] cursor-pointer hover:underline text-xs"
                          >
                            {v.voucherNumber}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{v.date}</div>
                          {v.linkedOrderNumber && (
                            <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                              Order: {v.linkedOrderNumber}
                            </div>
                          )}
                        </td>

                        {/* Particulars & Party Name */}
                        <td className="py-3 px-3 align-top">
                          <div className="font-bold text-gray-900 text-xs">{v.partyName}</div>
                          <div className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 font-['Open_Sans']">
                            {v.items[0]?.description || v.notes}
                          </div>
                          {v.stationCode && (
                            <div className="flex flex-wrap items-center gap-1 mt-1">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-900/10 text-cyan-800 border border-cyan-300">
                                {v.stationCode === 'ARIEL_UK' ? '🇬🇧 UK' : v.stationCode === 'ARIEL_US' ? '🇺🇸 US' : v.stationCode === 'ARIEL_EU' ? '🇪🇺 EU' : v.stationCode === 'ARIEL_AU' ? '🇦🇺 AU' : '🇧🇩 BD'} • {v.stationBankName || 'Station Account'}
                              </span>
                              {v.channel && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {v.channel}
                                </span>
                              )}
                            </div>
                          )}
                          {v.bankReference && (
                            <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                              Ref: {v.bankReference}
                            </div>
                          )}
                        </td>

                        {/* Account Head */}
                        <td className="py-3 px-3 align-top">
                          <div className="font-semibold text-gray-800 text-[11px]">
                            {v.mainAccountHead}
                          </div>
                          <div className="text-[10px] text-gray-500 truncate max-w-xs mt-0.5">
                            {v.subCategoryHead}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-3 px-3 text-right align-top font-mono">
                          <div className={`font-bold text-xs ${isPurchase ? 'text-amber-900' : 'text-emerald-800'}`}>
                            {v.currency === 'BDT' ? '৳ ' : `${v.currency} `}
                            {v.totalAmount.toLocaleString()}
                          </div>
                          {v.currency !== 'BDT' && (
                            <div className="text-[10px] text-gray-500">
                              ≈ ৳ {v.totalAmountBdt.toLocaleString()} BDT
                            </div>
                          )}
                        </td>

                        {/* Physical Cash Memo Attachment */}
                        <td className="py-3 px-3 align-top text-center">
                          {v.physicalAttachment ? (
                            <button
                              type="button"
                              onClick={() => handleViewMemo(v.physicalAttachment!, v)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-[10px] font-bold flex items-center justify-center gap-1 mx-auto transition-all cursor-pointer shadow-2xs"
                              title="Click to View Physical Scanned Memo"
                            >
                              <Paperclip className="w-3 h-3 text-emerald-600" />
                              <span>{v.physicalAttachment.memoNumber || 'View Memo'}</span>
                            </button>
                          ) : (
                            <div className="relative inline-block">
                              <input
                                type="file"
                                id={`upload-${v.id}`}
                                accept="image/*,application/pdf"
                                onChange={(e) => handleQuickUploadMemo(v.id, e)}
                                className="hidden"
                              />
                              <label
                                htmlFor={`upload-${v.id}`}
                                className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 font-mono text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                title="Attach Scanned Physical Memo / Bill"
                              >
                                <Upload className="w-3 h-3 text-gray-500" />
                                <span>+ Attach Memo</span>
                              </label>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right align-top">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Standard View / Print */}
                            <button
                              type="button"
                              onClick={() => handleOpenViewVoucher(v)}
                              className="px-2.5 py-1 rounded-lg bg-[#1F3A2E] hover:bg-[#162B22] text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                              title="View Standard Printable Voucher"
                            >
                              <FileText className="w-3 h-3 text-[#C8A96A]" />
                              <span>View</span>
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditVoucher(v)}
                              className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-medium transition-all cursor-pointer"
                              title="Edit Voucher Details"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW 3: ACCOUNT HEADS DIRECTORY & MANAGEMENT
          ========================================================= */}
      {activeLedgerView === 'ACCOUNT_HEADS' && (
        <div className="space-y-4">
          {/* Top Account Heads Banner */}
          <div className="p-5 rounded-2xl bg-[#12231B] border-2 border-[#2C5240] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300">
                <FolderTree className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                  <span>ArielMC Chart of Accounts &amp; Statutory Account Heads</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {accountHeads.length} Total Heads
                  </span>
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  Full control to Create new heads, in-place Edit or Rename existing titles, and Delete obsolete accounts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAccountHeadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-purple-200" />
              <span>+ Create / Edit / Delete Heads</span>
            </button>
          </div>

          {/* Quick Heads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Expense Heads Column */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-amber-100 text-amber-800">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-xs uppercase font-mono text-gray-900">
                    Expense / Disbursement Heads ({accountHeads.filter(h => h.type === 'EXPENSE').length})
                  </h4>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">Used in Cash Purchase</span>
              </div>

              <div className="space-y-2.5">
                {accountHeads.filter(h => h.type === 'EXPENSE').map((head) => {
                  const linkedCount = vouchers.filter(v => v.mainAccountHead === head.name).length;
                  return (
                    <div
                      key={head.id}
                      className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-emerald-500/50 hover:shadow-xs transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            {head.code && (
                              <span className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-800 font-mono text-[10px] font-bold">
                                {head.code}
                              </span>
                            )}
                            <span className="font-bold text-xs text-gray-900">{head.name}</span>
                          </div>
                          {head.description && (
                            <p className="text-[11px] text-gray-500 mt-1">{head.description}</p>
                          )}
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-mono shrink-0">
                          {linkedCount} Vouchers
                        </span>
                      </div>

                      {/* Sub-categories preview pills */}
                      {head.subCategories && head.subCategories.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {head.subCategories.map((sub, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[10px] text-gray-600 font-['Open_Sans']"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Income Heads Column */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-emerald-100 text-emerald-800">
                    <ArrowDownLeft className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-xs uppercase font-mono text-gray-900">
                    Income / Money Receive Heads ({accountHeads.filter(h => h.type === 'INCOME').length})
                  </h4>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">Used in Money Receive</span>
              </div>

              <div className="space-y-2.5">
                {accountHeads.filter(h => h.type === 'INCOME').map((head) => {
                  const linkedCount = vouchers.filter(v => v.mainAccountHead === head.name).length;
                  return (
                    <div
                      key={head.id}
                      className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-emerald-500/50 hover:shadow-xs transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            {head.code && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">
                                {head.code}
                              </span>
                            )}
                            <span className="font-bold text-xs text-gray-900">{head.name}</span>
                          </div>
                          {head.description && (
                            <p className="text-[11px] text-gray-500 mt-1">{head.description}</p>
                          )}
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono shrink-0">
                          {linkedCount} Vouchers
                        </span>
                      </div>

                      {/* Sub-categories preview pills */}
                      {head.subCategories && head.subCategories.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {head.subCategories.map((sub, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[10px] text-gray-600 font-['Open_Sans']"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          5. MODAL INSTANTIATIONS
          ========================================================= */}
      {/* 1. Master Clean Standard Voucher Modal (View, Print, Share, Edit) */}
      <StandardVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        voucher={activeModalVoucher}
        mode={modalMode}
        initialType={createVoucherType}
        onSaveVoucher={handleSaveVoucher}
        accountHeads={accountHeads}
        onOpenAccountHeadManager={() => setIsAccountHeadModalOpen(true)}
      />

      {/* 2. Account Head Management Modal (Create, Edit/Rename, Delete) */}
      <AccountHeadManagementModal
        isOpen={isAccountHeadModalOpen}
        onClose={() => setIsAccountHeadModalOpen(false)}
        accountHeads={accountHeads}
        onSaveAccountHeads={handleSaveAccountHeads}
        vouchers={vouchers}
        onRenameHeadInVouchers={handleRenameHeadInVouchers}
      />

      {/* 3. Physical Cash Memo / Supplier Bill Viewer Modal */}
      {activeMemoAttachment && activeMemoVoucherMeta && (
        <PhysicalMemoViewerModal
          isOpen={isMemoViewerOpen}
          onClose={() => setIsMemoViewerOpen(false)}
          attachment={activeMemoAttachment}
          voucherNumber={activeMemoVoucherMeta.voucherNumber}
          voucherType={activeMemoVoucherMeta.voucherType}
          partyName={activeMemoVoucherMeta.partyName}
        />
      )}

      {/* 4. Global Ledger Statement Share & Verification Modal */}
      <ShareDocumentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        document={dailyAuditDoc}
      />

      {/* 5. Real-Time Station Bank B2C/D2C Inflow Entry Modal */}
      <StationB2CPaymentModal
        isOpen={isStationB2CModalOpen}
        onClose={() => setIsStationB2CModalOpen(false)}
        onSavePayment={handleSaveVoucher}
        accountHeads={accountHeads}
        existingVouchersCount={vouchers.length}
      />

      {/* 6. Executive Report Generation Modal */}
      <ReportGenerationModal
        isOpen={isReportGenModalOpen}
        onClose={() => setIsReportGenModalOpen(false)}
        initialReportType="CASHFLOW_DAILY"
      />

    </div>
  );
};
