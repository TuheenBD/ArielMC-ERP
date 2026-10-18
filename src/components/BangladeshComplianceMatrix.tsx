'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CompanyEntity, EntityCode } from '@/types/erp';
import { OfficialDocument, DocumentSection, ComplianceChecklistItem } from '@/types/documentPortal';
import {
  BANGLADESH_34_COMPLIANCE_CHECKLIST,
  BANGLADESH_SEQUENCING_STEPS,
  BANGLADESH_BUDGET_SUMMARY
} from '@/data/bangladeshComplianceChecklist';
import { ThemeProfile } from '@/components/Sidebar';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Building2,
  FileText,
  UploadCloud,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  Calendar,
  Landmark,
  BadgeCheck,
  Search,
  Check,
  ArrowRight,
  Calculator,
  Coins,
  Scale,
  Receipt,
  ClipboardCheck,
  FlaskConical,
  Factory,
  FileSpreadsheet,
  FileCheck,
  Phone,
  MapPin,
  Copy,
  Printer,
  Download,
  Mail,
  Globe2,
  Share2
} from 'lucide-react';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';

interface BangladeshComplianceMatrixProps {
  onOpenUploadModal: (checklistItem?: ComplianceChecklistItem) => void;
  onViewDocument?: (docId: string) => void;
  existingDocuments: OfficialDocument[];
  theme?: ThemeProfile;
}

type ComplianceSubTab =
  | 'CHECKLIST'
  | 'SEQUENCING'
  | 'INCENTIVES_CALCULATOR'
  | 'SECTOR_CLEARANCES'
  | 'BUDGET'
  | 'RISKS';

export const BangladeshComplianceMatrix: React.FC<BangladeshComplianceMatrixProps> = ({
  onOpenUploadModal,
  onViewDocument,
  existingDocuments,
  theme = 'crm-green',
}) => {
  const isRoyal = theme === 'royal-blue';
  const isHeritage = theme === 'heritage-tan';

  // Navigation sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<ComplianceSubTab>('CHECKLIST');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 10% Cash Incentive Calculator State
  const [calcFobUsd, setCalcFobUsd] = useState<number>(10000);
  const [calcRateBdt, setCalcRateBdt] = useState<number>(120);
  const [calcSector, setCalcSector] = useState<'JUTE_DIVERSIFIED' | 'LEATHER_FINISHED' | 'LEATHER_CRUST' | 'JUTE_TRADITIONAL'>('JUTE_DIVERSIFIED');
  const [activeTemplateModal, setActiveTemplateModal] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [isTemplateShareModalOpen, setIsTemplateShareModalOpen] = useState(false);

  // Sector Clearances & Lab Testing State
  const [sectorClearanceCat, setSectorClearanceCat] = useState<'JUTE' | 'LEATHER' | 'CERAMICS' | 'LABS'>('JUTE');

  // Math for Cash Incentive
  const incentiveRate = calcSector === 'JUTE_DIVERSIFIED' ? 10
    : calcSector === 'LEATHER_FINISHED' ? 10
    : calcSector === 'LEATHER_CRUST' ? 6
    : 5;
  const grossRealizedBdt = calcFobUsd * calcRateBdt;
  const grossIncentiveBdt = grossRealizedBdt * (incentiveRate / 100);
  const sourceTaxAitBdt = grossIncentiveBdt * 0.05; // 5% AIT halved in FY2026-27 National Budget
  const netProceedsBdt = grossIncentiveBdt - sourceTaxAitBdt;
  const netProceedsUsd = Number((netProceedsBdt / calcRateBdt).toFixed(2));
  const netYieldPct = (netProceedsBdt / grossRealizedBdt) * 100;

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(key);
    setTimeout(() => setCopiedTemplate(null), 2500);
  };


  // Map checklist items with live document status
  const checklistWithLiveStatus: ComplianceChecklistItem[] = BANGLADESH_34_COMPLIANCE_CHECKLIST.map((item) => {
    // Check if matched document exists
    const matchedDoc = existingDocuments.find(
      (d) => d.checklistItemId === item.id || d.title.toLowerCase().includes(item.title.toLowerCase().slice(0, 15))
    );

    if (matchedDoc) {
      const now = new Date().getTime();
      const expiry = new Date(matchedDoc.expiryDate).getTime();
      const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

      let status: ComplianceChecklistItem['status'] = 'COMPLIANT';
      if (daysLeft < 0) status = 'EXPIRED';
      else if (daysLeft <= 7) status = 'EXPIRING_7_DAYS';
      else if (daysLeft <= 30) status = 'EXPIRING_30_DAYS';

      return {
        ...item,
        documentId: matchedDoc.id,
        status,
      };
    }

    return item;
  });

  // Calculate live compliance statistics
  const totalItems = checklistWithLiveStatus.length;
  const compliantCount = checklistWithLiveStatus.filter((i) => i.status === 'COMPLIANT').length;
  const critical7DaysCount = checklistWithLiveStatus.filter((i) => i.status === 'EXPIRING_7_DAYS').length;
  const expiring30DaysCount = checklistWithLiveStatus.filter((i) => i.status === 'EXPIRING_30_DAYS').length;
  const pendingCount = checklistWithLiveStatus.filter((i) => i.status === 'PENDING_UPLOAD').length;

  // Filtered items
  const filteredChecklist = checklistWithLiveStatus.filter((item) => {
    if (selectedCategoryFilter !== 'ALL' && item.category !== selectedCategoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.issuingAuthority.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.id.toString() === q
      );
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#DDE3DD] shadow-sm p-5 md:p-6 space-y-6">
      {/* Top Header Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#172D24] via-[#1F3A2E] to-[#12231B] text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#C8A96A]/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl">🇧🇩</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/40 font-mono text-[10px] font-bold uppercase tracking-wider">
                Official Bangladesh Legal Compliances
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                B2B (Wholesale Export) &amp; B2C (Cross-Border D2C)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-heading tracking-tight text-white">
              34-Point Regulatory Compliance &amp; Launch Readiness Matrix
            </h2>
            <p className="text-xs text-[#CFE0D5] max-w-3xl leading-relaxed">
              Complete regulatory roadmap covering foundational corporate registrations (RJSC, Trade License, 13-Digit BIN, e-TIN), core export trade licenses (ERC, EPB, REX), B2C cross-border e-commerce (DBID, BB FE Circular 48/31, ERQ), and product clearances (Jute, Leather, Ceramics, Textiles) with <strong>7-day renewal reminder alerts</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenUploadModal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#DFCA98] text-[#12231B] font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-[#12231B]" />
              <span>+ Upload Official Document</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 mt-5 border-t border-white/10">
          <div className="p-3 rounded-xl bg-black/20 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-gray-300 block">Total Checklist</span>
            <span className="text-2xl font-bold font-mono text-white mt-0.5 block">34 Items</span>
            <span className="text-[10px] text-[#C8A96A]">Full sovereign legal stack</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Compliant &amp; Active</span>
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-300 mt-0.5 block">
              {compliantCount} / {totalItems}
            </span>
            <span className="text-[10px] text-emerald-400">Verified official records</span>
          </div>

          <div className={`p-3 rounded-xl ${critical7DaysCount > 0 ? 'bg-rose-950/70 border border-rose-500 animate-pulse' : 'bg-black/20 border-white/5'}`}>
            <span className="text-[10px] uppercase font-bold text-rose-300 block flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Expiring in &le; 7 Days</span>
            </span>
            <span className="text-2xl font-bold font-mono text-rose-300 mt-0.5 block">
              {critical7DaysCount} Items
            </span>
            <span className="text-[10px] text-rose-400 font-bold">🚨 7-Day Renewal Alert</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
            <span className="text-[10px] uppercase font-bold text-amber-300 block flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-amber-400" />
              <span>Launch Reserve Budget</span>
            </span>
            <span className="text-lg md:text-xl font-bold font-mono text-amber-300 mt-0.5 block truncate">
              {BANGLADESH_BUDGET_SUMMARY.recommendedLaunchReserveBDT}
            </span>
            <span className="text-[10px] text-amber-400">
              {BANGLADESH_BUDGET_SUMMARY.recommendedLaunchReserveUSD}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDE3DD] pb-3 text-xs">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('CHECKLIST')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'CHECKLIST'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'bg-[#F4F6F4] text-[#4A5568] hover:bg-[#EAEFEA]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#C8A96A]" />
            <span>1. 34-Item Checklist</span>
          </button>

          <button
            onClick={() => setActiveSubTab('SEQUENCING')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'SEQUENCING'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'bg-[#F4F6F4] text-[#4A5568] hover:bg-[#EAEFEA]'
            }`}
          >
            <ArrowRight className="w-4 h-4 text-[#C8A96A]" />
            <span>2. 6-Step Sequencing</span>
          </button>

          <button
            onClick={() => setActiveSubTab('INCENTIVES_CALCULATOR')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'INCENTIVES_CALCULATOR'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Calculator className="w-4 h-4 text-[#C8A96A]" />
            <span>3. 10% Cash Incentive &amp; BRAC Bank SOP</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 font-mono text-[9px] font-bold">
              10% BB
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('SECTOR_CLEARANCES')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'SECTOR_CLEARANCES'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Factory className="w-4 h-4 text-[#C8A96A]" />
            <span>4. Sourcing, Labs &amp; Savar Directory</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-mono text-[9px] font-bold">
              JDPC / Savar
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('BUDGET')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'BUDGET'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'bg-[#F4F6F4] text-[#4A5568] hover:bg-[#EAEFEA]'
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#C8A96A]" />
            <span>5. Sovereign Budget &amp; Fees</span>
          </button>

          <button
            onClick={() => setActiveSubTab('RISKS')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'RISKS'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'bg-[#F4F6F4] text-[#4A5568] hover:bg-[#EAEFEA]'
            }`}
          >
            <Info className="w-4 h-4 text-[#C8A96A]" />
            <span>6. Ground Realities &amp; Risks</span>
          </button>
        </div>

        <div className="text-[11px] text-[#6B7269] font-medium hidden lg:block">
          Source: Official Bangladesh Legal Compliance Blueprint &amp; Central Bank Circulars
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COMPLETE 34-ITEM CHECKLIST                                         */}
      {/* ========================================================================= */}
      {activeSubTab === 'CHECKLIST' && (
        <div className="space-y-4">
          {/* Category Filter Pills & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'ALL', label: 'All 34 Items' },
                { id: 'FOUNDATIONAL_CORPORATE', label: '1. Foundational (1-5)' },
                { id: 'CORE_EXPORT_TRADE', label: '2. Core Export (6-9)' },
                { id: 'B2C_CROSS_BORDER_ECOMMERCE', label: '3. B2C E-Commerce (10-13)' },
                { id: 'CUSTOMS_SHIPPING', label: '4. Customs & Shipping (14-16)' },
                { id: 'SECTOR_JUTE', label: '5a. Jute Goods (17-19)' },
                { id: 'SECTOR_LEATHER', label: '5b. Leather & Footwear (20-23)' },
                { id: 'SECTOR_CERAMICS', label: '5c. Ceramics (24-28)' },
                { id: 'SECTOR_TEXTILES', label: '5d. Home Textiles (29-34)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-[#1F3A2E] text-white'
                      : 'bg-[#F4F6F4] text-slate-700 hover:bg-[#EAEFEA]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search checklist #, title or authority..."
                className="w-full pl-8 pr-3 p-1.5 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] text-xs text-slate-900 focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
          </div>

          {/* Checklist Table */}
          <div className="overflow-x-auto rounded-xl border border-[#DDE3DD]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#172D24] text-white text-[11px] font-heading">
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3">Compliance Title &amp; Category</th>
                  <th className="p-3">Issuing Authority / Regulatory Body</th>
                  <th className="p-3">Official Scope &amp; Destination Audit</th>
                  <th className="p-3">Estimated Budget (Govt + Agency)</th>
                  <th className="p-3">Compliance Status / 7-Day Alert</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEFEA]">
                {filteredChecklist.map((item) => {
                  const isCritical = item.status === 'EXPIRING_7_DAYS';
                  const isExpiringSoon = item.status === 'EXPIRING_30_DAYS';
                  const isCompliant = item.status === 'COMPLIANT';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#F8FAF8] transition-colors ${
                        isCritical ? 'bg-rose-50/60' : ''
                      }`}
                    >
                      {/* Number # */}
                      <td className="p-3 text-center font-mono font-bold text-slate-800">
                        {item.id}
                      </td>

                      {/* Title & Category */}
                      <td className="p-3">
                        <div className="space-y-0.5 max-w-xs">
                          <span className="font-bold text-[#1F3A2E] text-[12px] block">
                            {item.title}
                          </span>
                          <span className="px-2 py-0.2 rounded-full bg-[#FAF5EC] text-[#8A6D3B] text-[9.5px] font-semibold border border-[#C8A96A]/30 block w-fit">
                            {item.categoryLabel}
                          </span>
                        </div>
                      </td>

                      {/* Authority */}
                      <td className="p-3 text-slate-700 text-[11px] font-medium max-w-[200px]">
                        {item.issuingAuthority}
                      </td>

                      {/* Description & Destination Market */}
                      <td className="p-3">
                        <p className="text-[11px] text-[#6B7269] max-w-md leading-relaxed">
                          {item.description}
                        </p>
                        {item.destinationMarketAudit && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-blue-700 font-semibold">
                            <span>Destination Audits:</span>
                            <span className="px-1.5 py-0.2 rounded bg-blue-50 border border-blue-200">
                              {item.destinationMarketAudit}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Estimated Budget */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 font-mono text-[11px] block">
                            {item.totalBudgetEstimate}
                          </span>
                          <span className="text-[10px] text-gray-500 block">
                            Govt: {item.govtFeeEstimate}
                          </span>
                        </div>
                      </td>

                      {/* Status / 7-Day Alert */}
                      <td className="p-3 whitespace-nowrap">
                        {isCritical ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-bold text-[10px] border border-rose-600 flex items-center gap-1 w-fit animate-pulse shadow-2xs">
                            <AlertTriangle className="w-3 h-3" />
                            Expiring in &le;7 Days (🚨 Urgent Renewal)
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-amber-700" />
                            Expiring in &le;30 Days
                          </span>
                        ) : isCompliant ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Compliant &amp; Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-300 flex items-center gap-1 w-fit">
                            Pending Document Upload
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-3 text-right whitespace-nowrap">
                        {item.documentId ? (
                          <button
                            onClick={() => onViewDocument && item.documentId && onViewDocument(item.documentId)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-colors"
                          >
                            View Stored Doc
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenUploadModal(item)}
                            className="px-2.5 py-1 rounded-lg bg-[#1F3A2E] hover:bg-[#12231B] text-[#C8A96A] text-[11px] font-bold transition-colors"
                          >
                            + Upload Doc
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RECOMMENDED SEQUENCING TO LAUNCH (6-STEP BLUEPRINT)                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'SEQUENCING' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-xs space-y-1">
            <span className="font-bold text-[#1F3A2E] text-sm font-heading block">
              Step-by-Step Sovereign Launch Timeline (Estimated 4 to 6 Weeks)
            </span>
            <p className="text-[#6B7269]">
              Following this systematic chronological order prevents bureaucratic deadlock. For example, obtaining an Export Registration Certificate (ERC) strictly requires active Chamber of Commerce membership and an AD Bank solvency certificate first.
            </p>
          </div>

          <div className="space-y-3">
            {BANGLADESH_SEQUENCING_STEPS.map((step) => (
              <div
                key={step.stepNumber}
                className="p-4 rounded-xl bg-white border-2 border-[#DDE3DD] hover:border-[#1F3A2E] transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EAEFEA]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-[#1F3A2E] text-[#C8A96A] font-bold font-mono text-sm flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <div>
                      <h4 className="font-bold text-[#1F3A2E] text-sm font-heading">
                        {step.title}
                      </h4>
                      <span className="text-[11px] text-[#8A6D3B] font-semibold">
                        Timeline: {step.timeline}
                      </span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold w-fit">
                    Key Output: {step.keyOutput}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {step.description}
                </p>

                <div className="pt-2 border-t border-[#EAEFEA] flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">
                    Linked Checklist Items:
                  </span>
                  {step.requiredItems.map((itemId) => {
                    const chk = BANGLADESH_34_COMPLIANCE_CHECKLIST.find((c) => c.id === itemId);
                    return (
                      <span
                        key={itemId}
                        className="px-2 py-0.5 rounded bg-[#F4F6F4] border border-[#DDE3DD] text-[10.5px] font-medium text-slate-800"
                      >
                        #{itemId} {chk?.title.slice(0, 24)}...
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 10% EXPORT CASH INCENTIVE & BRAC BANK CLAIM SOP                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'INCENTIVES_CALCULATOR' && (
        <div className="space-y-6 text-xs animate-in fade-in duration-200">
          {/* Header Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#172D24] via-[#1B362A] to-[#12231B] text-white border border-[#2C5240] space-y-3 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] font-bold uppercase">
                    Bangladesh Bank FEPD Circular 59 &amp; 53
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#C8A96A]/20 text-[#C8A96A] font-mono text-[10px] font-bold">
                    BRAC Bank Trade Desk Realization
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold font-heading text-white">
                  10% Export Cash Assistance &amp; Merchant Traceability Engine
                </h3>
                <p className="text-xs text-[#CFE0D5] max-w-3xl leading-relaxed">
                  As an outsourced merchant exporter, claiming the government cash subsidy requires an unbroken compliance trail across your trade association (BJGEA for Jute / LFMEAB for Leather), BRAC Bank PLC, and the central-bank-appointed external audit firm. Under the FY2026–27 National Budget, <strong>Advance Income Tax (AIT) source deduction was halved from 10% to 5%</strong>, delivering a net <strong>9.5% financial yield</strong> on realized FOB value.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 shrink-0 space-y-0.5">
                <span className="text-[10px] font-bold uppercase flex items-center gap-1 text-amber-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>The 180-Day Rule</span>
                </span>
                <span className="text-xs font-semibold block">Strict Statutory Filing Deadline</span>
                <span className="text-[10px] text-amber-300/80 block">
                  Claims must be locked with AD Bank within 180 days of realization.
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Card */}
          <div className="p-5 rounded-2xl bg-white border-2 border-[#DDE3DD] shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDE3DD] pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#1F3A2E]" />
                <h4 className="font-bold font-heading text-sm text-[#1F3A2E]">
                  Live Cash Incentive &amp; Net Yield Simulation
                </h4>
              </div>
              <span className="text-[11px] text-gray-500 font-mono">
                Formula: Realized FOB &times; FX Rate &times; Subsidy % &minus; 5% AIT
              </span>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                <label className="text-[11px] font-bold text-[#1F3A2E] block uppercase tracking-wider">
                  Select Export Sourcing Sector
                </label>
                <select
                  value={calcSector}
                  onChange={(e) => setCalcSector(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#DDE3DD] text-xs font-bold text-[#1F3A2E] focus:outline-none focus:border-[#1F3A2E]"
                >
                  <option value="JUTE_DIVERSIFIED">Diversified Jute Goods (10% Subsidy)</option>
                  <option value="LEATHER_FINISHED">Finished Leather Goods &amp; Footwear (10% Subsidy)</option>
                  <option value="LEATHER_CRUST">Crust / Finished Leather (6% Subsidy)</option>
                  <option value="JUTE_TRADITIONAL">Traditional Jute Sacking/Yarn (5% Subsidy)</option>
                </select>
                <span className="text-[10px] text-gray-500 block">
                  {calcSector === 'JUTE_DIVERSIFIED' && 'Must contain &ge;50% jute fiber (shopping bags, totes, placemats).'}
                  {calcSector === 'LEATHER_FINISHED' && 'Wallets, folios, belts, boots sourced from Savar CETP tanneries.'}
                  {calcSector === 'LEATHER_CRUST' && 'Crust leather processed in certified Savar ETP tanneries.'}
                  {calcSector === 'JUTE_TRADITIONAL' && 'Standard raw jute, hessian cloth, or industrial yarn.'}
                </span>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#1F3A2E] block uppercase tracking-wider">
                    Realized FOB Value (USD)
                  </label>
                  <div className="flex gap-1">
                    {[5000, 10000, 25000, 50000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCalcFobUsd(amt)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                          calcFobUsd === amt ? 'bg-[#1F3A2E] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        ${amt / 1000}k
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    value={calcFobUsd}
                    onChange={(e) => setCalcFobUsd(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-white border border-[#DDE3DD] text-xs font-bold text-[#1F3A2E] focus:outline-none focus:border-[#1F3A2E] font-mono"
                  />
                </div>
                <span className="text-[10px] text-gray-500 block">
                  Foreign remittance confirmed via Proceed Realization Certificate (PRC).
                </span>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#1F3A2E] block uppercase tracking-wider">
                    BRAC Bank Realization Rate
                  </label>
                  <div className="flex gap-1">
                    {[120.0, 121.5, 122.5].map((rt) => (
                      <button
                        key={rt}
                        type="button"
                        onClick={() => setCalcRateBdt(rt)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                          calcRateBdt === rt ? 'bg-[#1F3A2E] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        ৳{rt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <span className="text-gray-500 font-bold absolute left-3 top-2 text-xs">৳</span>
                  <input
                    type="number"
                    step="0.5"
                    value={calcRateBdt}
                    onChange={(e) => setCalcRateBdt(Math.max(1, Number(e.target.value)))}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-white border border-[#DDE3DD] text-xs font-bold text-[#1F3A2E] focus:outline-none focus:border-[#1F3A2E] font-mono"
                  />
                </div>
                <span className="text-[10px] text-gray-500 block">
                  Assumed commercial foreign inward remittance exchange rate.
                </span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Realized Revenue</span>
                <span className="text-lg font-bold font-mono text-slate-900 block">
                  ৳{grossRealizedBdt.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-600 font-mono">
                  ${calcFobUsd.toLocaleString()} USD
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-700 block">
                  Gross Cash Subsidy ({incentiveRate}%)
                </span>
                <span className="text-lg font-bold font-mono text-blue-900 block">
                  ৳{grossIncentiveBdt.toLocaleString()}
                </span>
                <span className="text-[10px] text-blue-600 font-mono">
                  ${(grossIncentiveBdt / calcRateBdt).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-700 block">
                  Source Tax Deduction (5% AIT)
                </span>
                <span className="text-lg font-bold font-mono text-rose-900 block">
                  &minus; ৳{sourceTaxAitBdt.toLocaleString()}
                </span>
                <span className="text-[10px] text-rose-600 font-mono">
                  Halved from 10% in FY26-27 Budget
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-400 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block flex items-center justify-between">
                  <span>Net BRAC Bank Payout</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 font-mono font-bold text-[9px]">
                    {netYieldPct.toFixed(1)}% Net Yield
                  </span>
                </span>
                <span className="text-xl font-black font-mono text-emerald-900 block">
                  ৳{netProceedsBdt.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">
                  ${netProceedsUsd.toLocaleString()} USD Net Cash Added
                </span>
              </div>
            </div>

            {/* Minor Out-of-Pocket Cost Advisory */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Out-of-pocket reality:</strong> BRAC Bank charges BDT 500–2,000 handling fee per EXP file. Bangladesh Bank external audit review may charge a nominal processing token upon disbursement.
                </span>
              </div>
              <div className="text-[10px] text-amber-800 font-mono shrink-0">
                Net effective profit adder: <strong>+~8.8% to +9.3%</strong>
              </div>
            </div>
          </div>

          {/* Two-Phase Bank & Association Submission Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phase 1: Association Clearance */}
            <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] space-y-3">
              <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1F3A2E] text-[#C8A96A] font-bold text-xs flex items-center justify-center font-mono">
                    1
                  </span>
                  <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                    Phase 1: Association Clearance (BJGEA / LFMEAB)
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Mandatory Prerequisite
                </span>
              </div>

              <p className="text-[11px] text-gray-600">
                Submit this initial compliance docket to BJGEA (Arambagh) or LFMEAB (Gulshan-1) to obtain the official Cash Incentive Certificate:
              </p>

              <ul className="space-y-1.5 text-[11px] text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Prescribed Incentive Form:</strong> Form Ka/Kha/Ga/Gha fully filled and signed.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Bill of Lading (B/L) / Airway Bill:</strong> Certified original transport carrier copy.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Bill of Export:</strong> Certified and stamped by Bangladesh Customs at port of exit.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Proceed Realization Certificate (PRC):</strong> Issued by BRAC Bank verifying inward wire.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Commercial Invoice &amp; Packing List:</strong> Itemized quantities, net weights, and HS codes.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Sales Contract / Proforma Invoice (PI) &amp; Bill of Exchange:</strong> Signed with overseas buyer.</span>
                </li>
              </ul>
            </div>

            {/* Phase 2: AD Bank Submission */}
            <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] space-y-3">
              <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1F3A2E] text-[#C8A96A] font-bold text-xs flex items-center justify-center font-mono">
                    2
                  </span>
                  <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                    Phase 2: BRAC Bank Payout File &amp; External Audit
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-[#8A6D3B] bg-[#FAF5EC] px-2 py-0.5 rounded font-bold">
                  Funds Payout Gate
                </span>
              </div>

              <p className="text-[11px] text-gray-600">
                Submit the complete payout file to BRAC Bank's International Trade Finance Desk for central bank audit clearance:
              </p>

              <ul className="space-y-1.5 text-[11px] text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F3A2E] shrink-0 mt-0.5" />
                  <span><strong>Original Association Certificate:</strong> Issued by BJGEA or LFMEAB.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F3A2E] shrink-0 mt-0.5" />
                  <span><strong>Company Undertaking:</strong> Executed on Tk. 300 non-judicial stamp paper swearing validity.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F3A2E] shrink-0 mt-0.5" />
                  <span><strong>SWIFT Advice &amp; Bank Rate Sheet:</strong> Confirming exact credit amounts and transaction date.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F3A2E] shrink-0 mt-0.5" />
                  <span><strong>Sourcing Deed of Agreement:</strong> Legal outsourcing deed with compliant factory (Tk. 300 stamp).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F3A2E] shrink-0 mt-0.5" />
                  <span><strong>Partner Factory Proofs:</strong> DIFE Factory License &amp; Jute Directorate / Tannery VAT-6.3 Chalan.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F3A2E] shrink-0 mt-0.5" />
                  <span><strong>Material Consumption &amp; Yield Sheet:</strong> Reconciles leather/jute used vs. exported pieces.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Official Statutory Document & Letterhead Templates */}
          <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-[#1F3A2E] text-sm font-heading flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#C8A96A]" />
                  <span>Official Legal &amp; Banking Templates (Ready to Print &amp; Execute)</span>
                </h4>
                <p className="text-[11px] text-gray-500">
                  Click any template to review full legal text, copy to clipboard, or print on official letterhead / non-judicial stamp paper.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setActiveTemplateModal('SOURCING_DEED')}
                className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#1F3A2E] hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-lg bg-[#FAF5EC] text-[#8A6D3B] group-hover:bg-[#1F3A2E] group-hover:text-white transition-all">
                    📜
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 font-bold">Tk 300 Stamp</span>
                </div>
                <div>
                  <span className="font-bold text-[#1F3A2E] text-xs block group-hover:text-emerald-800">
                    Sourcing Deed of Agreement
                  </span>
                  <p className="text-[10px] text-gray-500 line-clamp-2">
                    5-clause merchant exporter agreement with factory; waives manufacturer subsidy claim in favor of ArielMC.
                  </p>
                </div>
                <span className="text-[10px] text-[#C8A96A] font-bold flex items-center gap-1">
                  <span>View Contract Text</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTemplateModal('BRAC_BANK_LETTER')}
                className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#1F3A2E] hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-lg bg-emerald-50 text-emerald-800 group-hover:bg-[#1F3A2E] group-hover:text-white transition-all">
                    🏦
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">Bank Letterhead</span>
                </div>
                <div>
                  <span className="font-bold text-[#1F3A2E] text-xs block group-hover:text-emerald-800">
                    BRAC Bank 10% Cash Incentive Letter
                  </span>
                  <p className="text-[10px] text-gray-500 line-clamp-2">
                    Formal application to Trade Finance desk referencing EXP, PRC, and net realized FOB value.
                  </p>
                </div>
                <span className="text-[10px] text-[#C8A96A] font-bold flex items-center gap-1">
                  <span>View Bank Letter</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTemplateModal('SAVAR_CETP_LETTER')}
                className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#1F3A2E] hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-lg bg-blue-50 text-blue-800 group-hover:bg-[#1F3A2E] group-hover:text-white transition-all">
                    💼
                  </span>
                  <span className="text-[10px] font-mono text-blue-700 font-bold">Tannery Seal</span>
                </div>
                <div>
                  <span className="font-bold text-[#1F3A2E] text-xs block group-hover:text-emerald-800">
                    Savar CETP Connection Undertaking
                  </span>
                  <p className="text-[10px] text-gray-500 line-clamp-2">
                    Tannery declaration confirming BSCIC Savar plot number, active CETP effluent connection, and VAT-6.3 chalan.
                  </p>
                </div>
                <span className="text-[10px] text-[#C8A96A] font-bold flex items-center gap-1">
                  <span>View Undertaking</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTemplateModal('MATERIAL_YIELD_SHEET')}
                className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] hover:border-[#1F3A2E] hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-lg bg-amber-50 text-amber-800 group-hover:bg-[#1F3A2E] group-hover:text-white transition-all">
                    📐
                  </span>
                  <span className="text-[10px] font-mono text-amber-700 font-bold">Yield Audit</span>
                </div>
                <div>
                  <span className="font-bold text-[#1F3A2E] text-xs block group-hover:text-emerald-800">
                    Material Consumption &amp; Yield Sheet
                  </span>
                  <p className="text-[10px] text-gray-500 line-clamp-2">
                    Auditor-approved yield reconciliation (4.20 sq ft net + 25% waste = 4.86 sq ft/bag for 500 MOQ).
                  </p>
                </div>
                <span className="text-[10px] text-[#C8A96A] font-bold flex items-center gap-1">
                  <span>View Yield Matrix</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SECTOR CLEARANCES, LAB PARTNERS & SAVAR DIRECTORY                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'SECTOR_CLEARANCES' && (
        <div className="space-y-6 text-xs animate-in fade-in duration-200">
          {/* Header & Category Switcher */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#172D24] via-[#1B362A] to-[#12231B] text-white border border-[#2C5240] space-y-3 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-[#C8A96A]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/40 font-mono text-[10px] font-bold uppercase">
                    Non-RMG Sovereign Sourcing Framework
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                    80%–95% Value Addition Retained
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold font-heading text-white">
                  Sourcing Hubs, Savar Tanneries Directory &amp; Laboratory Partners
                </h3>
                <p className="text-xs text-[#CFE0D5] max-w-3xl leading-relaxed">
                  Direct commercial guidance for sourcing Jute from Tejgaon/Arambagh, Finished Leather from verified Savar CETP tanneries, and Terracotta/Ceramics with ISO 17025 accredited laboratory clearances in Dhaka.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 shrink-0 bg-black/30 p-1.5 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setSectorClearanceCat('JUTE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sectorClearanceCat === 'JUTE' ? 'bg-[#C8A96A] text-[#12231B] shadow-sm' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🌿 Jute (JDPC/BJGEA)
                </button>
                <button
                  type="button"
                  onClick={() => setSectorClearanceCat('LEATHER')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sectorClearanceCat === 'LEATHER' ? 'bg-[#C8A96A] text-[#12231B] shadow-sm' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  💼 Leather &amp; Savar
                </button>
                <button
                  type="button"
                  onClick={() => setSectorClearanceCat('CERAMICS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sectorClearanceCat === 'CERAMICS' ? 'bg-[#C8A96A] text-[#12231B] shadow-sm' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🏺 Ceramics &amp; Terracotta
                </button>
                <button
                  type="button"
                  onClick={() => setSectorClearanceCat('LABS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sectorClearanceCat === 'LABS' ? 'bg-[#C8A96A] text-[#12231B] shadow-sm' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🔬 Dhaka Testing Labs
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 1: JUTE (JDPC & BJGEA) */}
          {sectorClearanceCat === 'JUTE' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* JDPC Box */}
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌿</span>
                      <div>
                        <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                          Jute Diversification Promotion Centre (JDPC)
                        </h4>
                        <span className="text-[10px] text-gray-500">Ministry of Textiles and Jute</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold">
                      Nominal / Free Listing
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-700">
                    <p className="leading-relaxed">
                      JDPC specifically supports diversified jute entrepreneurs. Since ArielMC designs, sources, and markets finished products globally, you qualify for their promotional listing as a merchant-backed entrepreneur.
                    </p>

                    <div className="p-2.5 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] space-y-1 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span><strong>Office:</strong> 145, Monipuripara, Tejgaon, Dhaka-1215</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span><strong>Registration Desk:</strong> 01711973849</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span><strong>Email:</strong> info@jdpc.gov.bd | Portal: jdpc.gov.bd</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-[#1F3A2E] block">Required Enrolment Documents:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                        <li>Valid DNCC Commercial Trade License (listing Exporter/Trader)</li>
                        <li>NBR 12-digit e-TIN &amp; 13-digit BIN Certificate (Mushak 2.8)</li>
                        <li>Letter of Intent detailing outsourced merchant production model</li>
                        <li>Digital product catalog (Laminated totes, wine carriers, storage baskets)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* BJGEA Box */}
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏢</span>
                      <div>
                        <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                          Bangladesh Jute Goods Exporters Association (BJGEA)
                        </h4>
                        <span className="text-[10px] text-gray-500">Statutory Export Guild for 10% Cash Subsidy</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-mono text-[10px] font-bold">
                      BDT 20,300 Total Fee
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-700">
                    <p className="leading-relaxed">
                      To obtain export clearance and process the 10% cash incentive under BB Circular 59, you must register as an <strong>Associate Member</strong> with BJGEA.
                    </p>

                    <div className="p-2.5 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] space-y-1 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span><strong>Central Office:</strong> A &amp; A Tower (3rd Floor), 173, Arambagh, Motijheel, Dhaka-1000</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span><strong>Phone:</strong> +880 2224401568</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span><strong>Email:</strong> bjgea2016@gmail.com | bjgea.net.bd</span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900 space-y-0.5">
                      <strong>The Non-Manufacturer Rule:</strong> Since you do not own a jute weaving mill, you must submit a notarized <strong>Sourcing Deed of Agreement</strong> linking your company to the compliance-certified manufacturing factory, alongside copies of their Factory License and Jute Directorate License.
                    </div>
                  </div>
                </div>
              </div>

              {/* Jute Mandatory Licensing Breakdown */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] space-y-3">
                <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                  Statutory Government Licensing for Jute Exporters
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] space-y-1">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">1. Jute Exporter License</span>
                    <span className="font-bold font-mono text-sm text-[#1F3A2E] block">BDT 25,000</span>
                    <span className="text-[10px] text-gray-600 block">Issued by Directorate General of Jute</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] space-y-1">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">2. Export Registration (ERC)</span>
                    <span className="font-bold font-mono text-sm text-[#1F3A2E] block">BDT 9,200</span>
                    <span className="text-[10px] text-gray-600 block">CCI&amp;E via OLM (includes 15% VAT)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] space-y-1">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">3. EPB Enrolment</span>
                    <span className="font-bold font-mono text-sm text-[#1F3A2E] block">BDT 1,000</span>
                    <span className="text-[10px] text-gray-600 block">Export Promotion Bureau of Bangladesh</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: LEATHER & SAVAR CETP DIRECTORY */}
          {sectorClearanceCat === 'LEATHER' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* LFMEAB & Savar ETP Traceability Box */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDE3DD] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💼</span>
                    <div>
                      <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                        LFMEAB Membership &amp; Savar CETP Traceability Protocol
                      </h4>
                      <span className="text-[10px] text-gray-500">
                        Police Plaza Concord, Gulshan-1, Dhaka &bull; Bangladesh Bank Foreign Exchange Audit
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold">
                    10% Cash Incentive Protected
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-slate-700">
                  <div className="space-y-2">
                    <span className="font-bold text-[#1F3A2E] block">LFMEAB Membership Docket (Associate Category):</span>
                    <p className="leading-relaxed">
                      To qualify for export verification and the 10% cash incentive on finished leather goods, submit your associate packet to LFMEAB at <strong>Police Plaza Concord, Gulshan-1</strong>:
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                      <li>Application on company letterhead addressed to Executive Director</li>
                      <li>Trade License (specifying leather export/trade), e-TIN, and e-BIN</li>
                      <li>Active ERC valid for current fiscal year &amp; BRAC Bank Solvency Certificate</li>
                      <li>Notarized Sourcing Deed with factory partner + DIFE Factory &amp; Fire licenses</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 space-y-1.5 text-amber-950">
                    <span className="font-bold flex items-center gap-1.5 text-amber-900">
                      <ShieldAlert className="w-4 h-4 text-amber-700" />
                      <span>Savar CETP Environmental Traceability Link</span>
                    </span>
                    <p className="leading-relaxed text-[11px]">
                      Auditors will strictly verify whether the crust/finished leather used was sourced from tanneries connected to the <strong>Central Effluent Treatment Plant (CETP) in Hemayetpur, Savar</strong>. For every batch, collect:
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[10.5px]">
                      <li><strong>Tannery VAT-6.3 Chalan:</strong> Declaring exact square footage and Savar plot number</li>
                      <li><strong>Tannery Delivery Gate Pass:</strong> Physical transit from Savar to factory cutting floor</li>
                      <li><strong>Tannery CETP Undertaking:</strong> Formal signed letterhead certificate of compliance</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Savar Tanneries Directory */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                    Vetted Savar Tanneries Directory (Audit-Proof Supply Base)
                  </h4>
                  <span className="text-[10px] text-gray-500 font-mono">
                    BSCIC Chamra Shilpa Nagari, Savar
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Tier 1 Gold */}
                  <div className="p-3.5 rounded-xl bg-white border-2 border-emerald-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold font-mono text-[10px]">
                        TIER 1: GOLD STANDARD (LWG CERTIFIED)
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">Zero Audit Friction</span>
                    </div>

                    <div className="space-y-2 text-[11px] pt-1">
                      <div className="p-2 rounded bg-emerald-50/50 border border-emerald-100 space-y-0.5">
                        <strong className="text-emerald-950 block">1. ABC Leather Limited</strong>
                        <span className="text-gray-600 block">Zirabo, Ashulia, Savar &bull; LWG Silver Rating</span>
                        <span className="text-emerald-800 text-[10px]">Full-grain cow leather, bag-grade finished nappa.</span>
                      </div>

                      <div className="p-2 rounded bg-emerald-50/50 border border-emerald-100 space-y-0.5">
                        <strong className="text-emerald-950 block">2. Pioneer Simona Tanning BD Limited</strong>
                        <span className="text-gray-600 block">Plots XS10, XS11, XA5, XA6, BSCIC Tannery Estate, Savar</span>
                        <span className="text-emerald-800 text-[10px]">LWG certified inside Savar. Premium crust &amp; finished hides.</span>
                      </div>

                      <div className="p-2 rounded bg-emerald-50/50 border border-emerald-100 space-y-0.5">
                        <strong className="text-emerald-950 block">3. Bay Tanneries Ltd. (Bay Group)</strong>
                        <span className="text-gray-600 block">BSCIC Tannery Industrial Estate, Hemayetpur, Savar</span>
                        <span className="text-emerald-800 text-[10px]">Chrome-free, semi-chrome, vegetable-tanned with complete docs.</span>
                      </div>
                    </div>
                  </div>

                  {/* Tier 2 Established CETP */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold font-mono text-[10px]">
                        TIER 2: BSCIC SAVAR CETP-CONNECTED
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">Routine VAT-6.3 Issuers</span>
                    </div>

                    <div className="space-y-2 text-[11px] pt-1">
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                        <strong className="text-slate-900 block">1. Sadar Tannery Ltd.</strong>
                        <span className="text-gray-600 block">Harindhara, Hemayetpur, Savar &bull; 100% Export-Oriented</span>
                        <span className="text-gray-700 text-[10px]">Vegetable-tanned, chrome-free, tested via ISO 17025 labs.</span>
                      </div>

                      <div className="p-2 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                        <strong className="text-slate-900 block">2. Samata Leather Complex Ltd.</strong>
                        <span className="text-gray-600 block">Plots ZC-4, 5, 6, BSCIC Tannery Estate, Savar</span>
                        <span className="text-gray-700 text-[10px]">Crust and finished leather formulated for handbags and folios.</span>
                      </div>

                      <div className="p-2 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                        <strong className="text-slate-900 block">3. Reliance Tannery Ltd. &amp; Karim Leathers Ltd.</strong>
                        <span className="text-gray-600 block">Plots YA 7, YA 8 / Plots YS-16, YS-17, BSCIC Chamra Shilpa Nagari</span>
                        <span className="text-gray-700 text-[10px]">Large-scale commercial processors with established NBR VAT structures.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savar Market Price Benchmarks & Footage Calculator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price Benchmarks Table */}
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                      Savar Market Prices for Finished Cow Leather
                    </h4>
                    <span className="text-[10px] font-mono text-gray-500">Per Square Foot</span>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-[#DDE3DD]">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#FAF5EC] text-[#1F3A2E] font-bold">
                        <tr>
                          <th className="p-2">Leather Finish</th>
                          <th className="p-2">Thickness</th>
                          <th className="p-2 text-right">Price (BDT)</th>
                          <th className="p-2 text-right">USD Equiv</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DDE3DD] text-slate-800">
                        <tr>
                          <td className="p-2 font-medium">Cow Nappa (Milled/Smooth)</td>
                          <td className="p-2 text-gray-600">1.1 &ndash; 1.3 mm</td>
                          <td className="p-2 text-right font-mono font-bold text-[#1F3A2E]">৳240 &ndash; 310</td>
                          <td className="p-2 text-right font-mono text-gray-600">$2.00 &ndash; $2.60</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Semi-Aniline / Corrected</td>
                          <td className="p-2 text-gray-600">1.2 &ndash; 1.4 mm</td>
                          <td className="p-2 text-right font-mono font-bold text-[#1F3A2E]">৳190 &ndash; 240</td>
                          <td className="p-2 text-right font-mono text-gray-600">$1.60 &ndash; $2.00</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Vegetable-Tanned Cow</td>
                          <td className="p-2 text-gray-600">1.4 &ndash; 1.8 mm</td>
                          <td className="p-2 text-right font-mono font-bold text-[#1F3A2E]">৳260 &ndash; 350</td>
                          <td className="p-2 text-right font-mono text-gray-600">$2.20 &ndash; $2.90</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Cow Lining (Split/Crust)</td>
                          <td className="p-2 text-gray-600">0.8 &ndash; 1.0 mm</td>
                          <td className="p-2 text-right font-mono font-bold text-[#1F3A2E]">৳100 &ndash; 145</td>
                          <td className="p-2 text-right font-mono text-gray-600">$0.85 &ndash; $1.20</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-gray-500 italic">
                    Note: LWG-certified tanneries typically charge a 15%–25% premium above basic BSCIC Savar rates.
                  </p>
                </div>

                {/* Leather Footage & AQL Quality Protocol */}
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] space-y-2.5">
                  <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                    500 Pcs MOQ Leather Budget &amp; IQC AQL Gates
                  </h4>

                  <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] space-y-2 text-[11px]">
                    <div className="flex justify-between items-center text-slate-800">
                      <span>Standard Shopping Tote (14" &times; 12" &times; 4") Net Area:</span>
                      <span className="font-mono font-bold">3.89 Sq. Ft.</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-800">
                      <span>(+) 25% Cutting Wastage Factor (natural contours):</span>
                      <span className="font-mono font-bold">+0.97 Sq. Ft.</span>
                    </div>
                    <div className="flex justify-between items-center text-[#1F3A2E] font-bold border-t border-[#DDE3DD] pt-1">
                      <span>Gross Raw Leather Required Per Bag:</span>
                      <span className="font-mono text-xs">4.86 Sq. Ft. / Bag</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-800 font-bold bg-emerald-50 p-2 rounded">
                      <span>500 Bags Total Order Target:</span>
                      <span className="font-mono">2,430 Sq. Ft. (৳583,200 / ~$4,860)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-900">
                      <strong>AQL 2.5 Major (Immediate Reject):</strong> Deep knife gouges &gt;25% thickness, Cr VI &gt;3ppm failure, under-gauge &lt;1.2mm, top-coat delamination.
                    </div>
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900">
                      <strong>AQL 4.0 Minor (Yield Mark):</strong> Loose spongy bellies, healed insect marks, slight D65 light-box shade variance.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: CERAMICS & TERRACOTTA */}
          {sectorClearanceCat === 'CERAMICS' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Food-Use Items Box */}
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍽️</span>
                      <div>
                        <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                          Food-Use Items (Bowls, Plates, Mugs, Matir Bhar)
                        </h4>
                        <span className="text-[10px] text-gray-500">Chemical Leaching (Lead &amp; Cadmium) Controls</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-mono text-[10px] font-bold">
                      Strict Border Check
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700">
                    The primary concern for Western authorities is chemical migration from glazes or raw clay. Passing reports are required prior to shipment loading:
                  </p>

                  <div className="space-y-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#1F3A2E]">🇺🇸 USA (FDA CPG 7117.06 &amp; 7117.07)</strong>
                        <span className="text-[10px] font-mono text-gray-500">SGS / Intertek</span>
                      </div>
                      <p className="text-gray-600 text-[10.5px]">
                        Must pass US FDA leachable heavy-metal thresholds via accredited ISO 17025 laboratory.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#1F3A2E]">🇪🇺 EU &amp; 🇬🇧 UK (Directive 84/500/EEC)</strong>
                        <span className="text-[10px] font-mono text-gray-500">EC No 1935/2004</span>
                      </div>
                      <p className="text-gray-600 text-[10.5px]">
                        Mandatory Declaration of Compliance (DoC) certifying lead and cadmium migration safety limits.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#1F3A2E]">🇦🇺 Australia (FSANZ Guideline 1.4.1)</strong>
                        <span className="text-[10px] font-mono text-gray-500">DAFF Quarantine</span>
                      </div>
                      <p className="text-gray-600 text-[10.5px]">
                        Food Standards Australia New Zealand compliance lab report for toxic contaminants.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Planters, Garden Ware & Home Decor */}
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🪴</span>
                      <div>
                        <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                          Planters &amp; Garden Ware (Biosecurity &amp; Kiln-Firing)
                        </h4>
                        <span className="text-[10px] text-gray-500">Unglazed, Porous Decorative Ceramics</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold">
                      DAFF Biosecurity
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700">
                    Because outdoor planters and garden pots are unglazed and made of raw earthenware, they face intensive biosecurity inspection against soil pathogens:
                  </p>

                  <div className="space-y-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1 text-emerald-950">
                      <strong>1. Manufacturing / Kiln-Firing Certificate (&gt;900&deg;C):</strong>
                      <p className="text-[10.5px] leading-relaxed">
                        Formal factory declaration that terracotta was kiln-fired at high temperatures (typically <strong>above 900&deg;C / 1650&deg;F</strong>). Proves clay is chemically transformed and completely sterile.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200 space-y-1 text-blue-950">
                      <strong>2. Biosecurity Cleanliness Declaration (Crucial for Australia):</strong>
                      <p className="text-[10.5px] leading-relaxed">
                        Certifies shipment is 100% free of raw soil, seeds, organic plant matter, and animal debris. Australian DAFF will reject crates if residual dust/dirt is found.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 space-y-1 text-amber-950">
                      <strong>3. Packaging Compliance &mdash; ISPM-15 vs Corrugated Cartons:</strong>
                      <p className="text-[10.5px] leading-relaxed">
                        If wood pallets or crates are used, they must have heat-treatment / methyl bromide <strong>ISPM-15 stamp</strong>. <em>Best practice:</em> Use heavy-duty double-walled corrugated cartons with paper honeycomb cushioning to completely bypass wood fumigation paperwork!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: CERTIFIED DHAKA TESTING LABS */}
          {sectorClearanceCat === 'LABS' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Intertek */}
                <div className="p-4 rounded-xl bg-white border-2 border-emerald-300 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-bold text-[10px]">
                      TOP RECOMMENDATION
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">ISO 17025</span>
                  </div>
                  <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                    1. Intertek Bangladesh
                  </h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    World-class testing lab providing globally recognized "Total Quality Assurance" documentation for US FDA, EU REACH, and AU standards.
                  </p>
                  <div className="p-2.5 rounded bg-[#F8FAF8] border border-[#DDE3DD] space-y-1 text-[10.5px] text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>Phoenix Tower (2nd &amp; 3rd Fl), 407 Tejgaon I/A, Dhaka 1208</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>+880 9666776669</span>
                    </div>
                  </div>
                </div>

                {/* SGS */}
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] space-y-2.5">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono font-bold text-[10px]">
                    GLOBAL RECOGNITION
                  </span>
                  <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                    2. SGS Bangladesh
                  </h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Premier international inspection and certification body. Test reports are trusted unconditionally by major Western department stores and customs officials.
                  </p>
                  <div className="p-2.5 rounded bg-[#F8FAF8] border border-[#DDE3DD] space-y-1 text-[10.5px] text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>Noor Tower (7th &amp; 8th Fl), 110 Bir Uttam C.R. Datta Rd, Dhaka 1205</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>+880 2-9632535</span>
                    </div>
                  </div>
                </div>

                {/* BCSIR */}
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] space-y-2.5">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold text-[10px]">
                    GOVERNMENT INSTITUTE
                  </span>
                  <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                    3. BCSIR &ndash; IGCRT (Dhanmondi)
                  </h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Bangladesh Council of Scientific and Industrial Research (Glass &amp; Ceramic Research Institute). Ideal for low-cost baseline material analysis and XRF/SEM scans.
                  </p>
                  <div className="p-2.5 rounded bg-[#F8FAF8] border border-[#DDE3DD] space-y-1 text-[10.5px] text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>Dr. Qudrat-I-Khuda Road, Dhanmondi, Dhaka 1205</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>igcrt.bcsir.gov.bd</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Testing Cost Comparison & Cost-Saving Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] space-y-2.5">
                  <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                    Testing Fee Comparison: Government vs. Private Labs
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-[#DDE3DD]">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#FAF5EC] text-[#1F3A2E] font-bold">
                        <tr>
                          <th className="p-2">Laboratory Tier</th>
                          <th className="p-2">Service / Scope</th>
                          <th className="p-2 text-right">Fee (BDT)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DDE3DD] text-slate-800">
                        <tr>
                          <td className="p-2 font-medium">BCSIR / BUET (Govt)</td>
                          <td className="p-2 text-gray-600">Per Element (Pb / Cd)</td>
                          <td className="p-2 text-right font-mono font-bold text-[#1F3A2E]">৳2,500 &ndash; 3,500</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">BCSIR / BUET (Govt)</td>
                          <td className="p-2 text-gray-600">Full Sample Set (Atomic Absorption)</td>
                          <td className="p-2 text-right font-mono font-bold text-[#1F3A2E]">৳5,000 &ndash; 7,000</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">BCSIR / BUET (Govt)</td>
                          <td className="p-2 text-gray-600">Advanced Material Scan (XRF / SEM)</td>
                          <td className="p-2 text-right font-mono font-bold text-[#1F3A2E]">৳25,300</td>
                        </tr>
                        <tr className="bg-emerald-50/50">
                          <td className="p-2 font-medium text-emerald-900">SGS / Intertek (Private)</td>
                          <td className="p-2 text-gray-600">Export Certified Sample Set (FDA/EU)</td>
                          <td className="p-2 text-right font-mono font-bold text-emerald-900">৳20,000 &ndash; 35,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono block">
                    Turnaround time: 7 to 14 business days in Dhaka.
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-amber-950">
                  <span className="font-bold flex items-center gap-1.5 text-amber-900 text-xs">
                    <Sparkles className="w-4 h-4 text-[#8A6D3B]" />
                    <span>Cost-Saving Best Practices for Exporters</span>
                  </span>
                  <ul className="space-y-1.5 text-[11px] leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-800">1.</span>
                      <span><strong>Group by Batch Material:</strong> If exporting 10 different styles of unglazed planters, do NOT test 10 styles separately. Test ONE single sample representing the uniform clay body and kiln-firing batch.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-800">2.</span>
                      <span><strong>Clarify Buyer Standards First:</strong> Confirm whether your overseas importer accepts an ISO 17025 accredited government report from BCSIR. If they require international certs, go directly to Intertek/SGS to avoid paying twice.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-800">3.</span>
                      <span><strong>Submitting Protocol:</strong> Always prepare 2 sets of physical samples (3-5 pcs each) and specify exact target market regulations (US FDA 7117.06/07 or EU 84/500/EEC).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BUDGET BREAKDOWN & FEE ESTIMATOR                                    */}
      {/* ========================================================================= */}
      {activeSubTab === 'BUDGET' && (
        <div className="space-y-5 text-xs">
          {/* Baseline Budget Table */}
          <div className="space-y-2">
            <h3 className="font-bold font-heading text-sm text-[#1F3A2E]">
              Baseline Compliance Budget (Corporate, Export &amp; B2C Readiness)
            </h3>
            <p className="text-[11px] text-gray-500">
              Covers a private limited sourcing/trading entity operating both B2B and B2C channels without owned factory premises.
            </p>
            <div className="overflow-x-auto rounded-xl border border-[#DDE3DD]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#172D24] text-white text-[11px] font-heading">
                    <th className="p-3">Statutory Clearance / Document</th>
                    <th className="p-3">Official Govt Fee (BDT)</th>
                    <th className="p-3">Real-World Facilitation / Agency Fee (BDT)</th>
                    <th className="p-3 font-bold text-right">Total Estimated Budget (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEFEA]">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">RJSC Company Incorporation (OPC / Pvt Ltd, BDT 20L Capital)</td>
                    <td className="p-3">12,500 – 16,000</td>
                    <td className="p-3">18,000 – 25,000 (MoA/AoA drafting &amp; filing)</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">30,000 – 41,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Trade License (Dhaka City Corp, Commercial/Export category)</td>
                    <td className="p-3">15,000 – 20,000 (incl. 15% VAT &amp; Signboard tax)</td>
                    <td className="p-3">10,000 – 15,000 (Inspector verification &amp; zoning fee)</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">25,000 – 35,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">e-TIN &amp; 13-Digit BIN (VAT)</td>
                    <td className="p-3">0 (Free online)</td>
                    <td className="p-3">3,000 – 5,000 (VAT portal activation &amp; filings)</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">3,000 – 5,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Corporate AD Bank Account &amp; Solvency Certificate</td>
                    <td className="p-3">1,000 (Solvency charge)</td>
                    <td className="p-3">0 (Bank documentation)</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">1,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Chamber Membership (DCCI Associate / MCCI)</td>
                    <td className="p-3">30,000 – 40,000</td>
                    <td className="p-3">5,000 (Notarization &amp; documentation)</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">35,000 – 45,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Export Registration Certificate (ERC) (CCI&amp;E via OLM)</td>
                    <td className="p-3">11,500 (incl. 15% VAT)</td>
                    <td className="p-3">5,000 – 8,000 (OLM filing &amp; delivery)</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">16,500 – 19,500</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">EPB Enrolment &amp; REX Registration</td>
                    <td className="p-3">3,500 – 5,000</td>
                    <td className="p-3">3,000 (EPB desk processing)</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">6,500 – 8,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Digital Business Identification (DBID)</td>
                    <td className="p-3">0 (Free officially)</td>
                    <td className="p-3">3,000 – 5,000 (Verification support)</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">3,000 – 5,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">e-CAB Membership (B2C Association)</td>
                    <td className="p-3">15,000 – 20,000</td>
                    <td className="p-3">0 – 2,000</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">15,000 – 22,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Customs ASYCUDA World &amp; AD Bank EXP/ERQ Setup</td>
                    <td className="p-3">2,000 – 3,000</td>
                    <td className="p-3">8,000 – 12,000 (C&amp;F agent portal enlistment)</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">10,000 – 15,000</td>
                  </tr>
                  <tr className="bg-[#FAF5EC] font-bold text-[#1F3A2E]">
                    <td className="p-3">Total Baseline Budget (Ready to Trade)</td>
                    <td className="p-3">BDT 89,000 – 117,000</td>
                    <td className="p-3">BDT 55,000 – 75,000</td>
                    <td className="p-3 text-right font-mono text-sm text-[#8A6D3B]">
                      BDT 145,000 – 196,500
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Product Specific & Manufacturing Add-Ons */}
          <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-3">
            <h4 className="font-bold text-[#1F3A2E] text-sm font-heading">
              Product-Specific &amp; Manufacturing Add-Ons (As Applicable)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] space-y-1">
                <span className="font-bold text-[#1F3A2E] block">🌱 Jute Goods Clearances</span>
                <p className="text-gray-600">
                  Directorate General of Jute Exporter License runs <strong>BDT 15,000 – 20,000</strong>. Phytosanitary (Plant Quarantine Wing) &amp; third-party fumigation cost <strong>BDT 5,000 – 8,000</strong> per consignment.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] space-y-1">
                <span className="font-bold text-[#1F3A2E] block">💼 LFMEAB (Leathergoods Association)</span>
                <p className="text-gray-600">
                  Joining LFMEAB requires an initial membership subscription fee of <strong>BDT 50,000 – 75,000</strong> (unlocks 15% cash subsidy claims).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] space-y-1">
                <span className="font-bold text-[#1F3A2E] block">🏭 Factory Premises (Owned Production Units)</span>
                <p className="text-gray-600">
                  Fire License FSCD: <strong>BDT 20,000 – 40,000</strong>. DoE ECC: <strong>BDT 35,000 – 80,000+</strong> (incl. EMP). DIFE Factory License: <strong>BDT 10,000 – 25,000</strong>.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] space-y-1">
                <span className="font-bold text-[#1F3A2E] block">🧪 Destination Lab Testing (REACH, Prop 65, FDA, OEKO-TEX)</span>
                <p className="text-gray-600">
                  Billed in USD directly by accredited international agencies (SGS, Intertek, TÜV SÜD), averaging <strong>$350 – $1,200 USD</strong> per product category / material batch.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: GROUND REALITIES & EXECUTION RISKS                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'RISKS' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-1">
            <span className="font-bold text-amber-900 text-sm font-heading flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Critical Advisory: Bangladesh Ground Realities &amp; Bureaucracy Management</span>
            </span>
            <p className="text-amber-800 leading-relaxed">
              Real-world execution tips to prevent weeks of delays during initial entity setup and foreign exchange banking onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BANGLADESH_BUDGET_SUMMARY.groundRealities.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border-2 border-[#DDE3DD] space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1F3A2E] text-[#C8A96A] font-bold text-xs flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-[#1F3A2E] text-xs font-heading">
                    {item.title}
                  </h4>
                </div>

                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-900 text-[11px] leading-relaxed">
                  <strong>Risk:</strong> {item.risk}
                </div>

                <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed">
                  <strong>Mitigation:</strong> {item.mitigation}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#172D24] text-white space-y-1 border border-[#2C5240]">
            <span className="text-[11px] font-bold text-[#C8A96A] uppercase font-heading">
              Executive Launch Summary Recommendation
            </span>
            <p className="text-xs text-[#CFE0D5] leading-relaxed">
              A realistic launch reserve of <strong>BDT 200,000 – 250,000 (~$1,650 – $2,100 USD)</strong> safely covers all foundational corporate documents, agency legal retainers, trade association memberships, and municipal administrative contingencies over an estimated setup timeline of <strong>4 to 6 weeks</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OFFICIAL LEGAL & BANKING TEMPLATES VIEWER                           */}
      {/* ========================================================================= */}
      {activeTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-white border border-[#DDE3DD] shadow-2xl overflow-hidden text-slate-900">
            {/* Modal Header */}
            <div className="p-4 bg-[#1F3A2E] text-white flex items-center justify-between gap-3 shrink-0 no-print">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#C8A96A]" />
                <div>
                  <h3 className="font-bold text-sm text-white font-heading">
                    {activeTemplateModal === 'SOURCING_DEED' && 'Deed of Sourcing & Manufacturing Agreement (Tk. 300 Stamp)'}
                    {activeTemplateModal === 'BRAC_BANK_LETTER' && 'BRAC Bank Trade Desk Application Letter (10% Cash Incentive)'}
                    {activeTemplateModal === 'SAVAR_CETP_LETTER' && 'Tannery Environmental Compliance & Savar CETP Connection Undertaking'}
                    {activeTemplateModal === 'MATERIAL_YIELD_SHEET' && 'Leather Material Consumption, Yield & Wastage Sheet (500 Pcs MOQ)'}
                  </h3>
                  <span className="text-[10px] text-[#CFE0D5] font-mono">
                    Official Statutory Instrument &bull; Ready for Commercial Execution
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = activeTemplateModal === 'SOURCING_DEED'
                      ? `DEED OF SOURCING & MANUFACTURING AGREEMENT\nExecuted on Tk. 300 Non-Judicial Stamp Paper\n\nBETWEEN: Ariel Marketing & Communications Limited (ArielMC), Dhaka (FIRST PARTY / EXPORTER)\nAND: [MANUFACTURER FACTORY NAME], holding DIFE Factory License & Jute Directorate / Leather License (SECOND PARTY / MANUFACTURER)\n\nCLAUSE 1: SCOPE OF WORK & SOURCING\nThe Second Party shall manufacture and supply diversified goods strictly according to designs and work orders provided by the First Party.\n\nCLAUSE 2: COMPLIANCE & LEGAL CERTIFICATION\nThe Second Party warrants maintaining a valid Factory License, environmental permits, and labor compliance.\n\nCLAUSE 3: CASH INCENTIVES & ENTITLEMENT\nBoth parties explicitly agree that the First Party (ArielMC) is the SOLE OWNER AND BENEFICIARY of all Export Cash Incentives, subsidies, or promotional benefits granted by the Government of Bangladesh / Bangladesh Bank. The Second Party waives any claim over such incentives and agrees to sign all bank forms.\n\nCLAUSE 4: QUALITY CONTROL & INSPECTION\nThe First Party or its designated QC retains the right to inspect raw materials and finished goods at the factory.\n\nCLAUSE 5: DURATION & TERMINATION\nValid for 3 years; renewable upon mutual consent.`
                      : activeTemplateModal === 'BRAC_BANK_LETTER'
                      ? `To: The Branch Manager / Head of Trade Finance Desk\nBRAC Bank PLC, Gulshan / Motijheel Corporate Branch, Dhaka, Bangladesh\n\nSubject: Application for 10% Cash Incentive against Export of Diversified Goods\n\nDear Sir/Madam,\nWe would like to bring to your attention that our company, Ariel Marketing & Communications Limited, is a registered entrepreneur-merchant exporter. We have successfully executed an export shipment and foreign currency proceeds have been fully realized into our account.\n\nIn accordance with Bangladesh Bank Foreign Exchange Policy Department (FEPD) Circulars, we are eligible to claim a 10% alternative cash incentive on the realized FOB export value.\n\nTransaction Summary:\n- EXP Form No: [EXP Number] | Date: [Date]\n- Commercial Invoice No: [Invoice Number] | Date: [Date]\n- Bill of Lading (B/L) No: [B/L Number]\n- Net Realized FOB Value: USD $10,000.00 (BDT 1,200,000 @ 120.00)\n- Gross Cash Incentive (10%): BDT 120,000.00\n- Less: Source Tax Deduction (5% AIT): BDT 6,000.00\n- Net BRAC Bank Payout: BDT 114,000.00\n\nEnclosed: BJGEA/LFMEAB Certificate, Customs Certified Bill of Export, PRC, Sourcing Deed of Agreement, Factory Licenses.\n\nYours Faithfully,\nSyed Akramul Hassan\nManaging Director, Ariel Marketing & Communications Limited`
                      : activeTemplateModal === 'SAVAR_CETP_LETTER'
                      ? `CERTIFICATE OF ENVIRONMENTAL COMPLIANCE & RAW MATERIAL TRACEABILITY\n(Savar CETP Connection Undertaking)\nPrinted on Official Tannery Letterhead\n\nTO WHOM IT MAY CONCERN\n\nThis is to certify that [Supplying Tannery Name], located at Plot No: [Plot Number], Road No: [Road Number], BSCIC Tannery Industrial Estate, Hemayetpur, Savar, Dhaka, is a fully compliant operational unit holding a valid Leather License, NBR e-TIN, and e-BIN.\n\nWe further declare that our production facility is fully integrated, connected to, and actively utilizes the Central Effluent Treatment Plant (CETP) operated by BSCIC at Savar. All liquid waste and effluents are treated in accordance with Department of Environment regulations.\n\nWe verify that finished/crust leather supplied to [Partner Factory Name] under VAT-6.3 Chalan No: [Number] dated [Date], consisting of [Quantity] Sq. Ft. of Cow Finished Nappa Leather, was processed entirely within our Savar facility.\n\nIssued for BRAC Bank PLC & Bangladesh Bank external audit.\n\nAuthorized Signatory & Seal`
                      : `LEATHER CONSUMPTION, YIELD & WASTAGE SHEET\n(Declared prior to production layout for Export Order Validation)\n\nMerchant Exporter: Ariel Marketing & Communications Limited\nManufacturer: [Partner Factory Name]\nTarget Export Item: Genuine Leather Diversified Shopping Bags\nSavar Tannery Source: [Supplying Tannery Name, BSCIC Savar] (VAT-6.3 Attached)\n\nTechnical Yield Per Bag (14" W x 12" H x 4" D):\n- Main Front & Back Panels (2x): 14"x12" = 336 sq in = 2.33 sq ft\n- Side Gussets (2x): 12"x4" = 96 sq in = 0.67 sq ft\n- Bottom Base Panel (1x): 14"x4" = 56 sq in = 0.39 sq ft\n- Handles & Straps (2x): 24"x1.5" = 72 sq in = 0.50 sq ft\nTotal Net Material: 560 sq in = 3.89 Sq. Ft.\n(+) 25% Sourcing Cutting Waste Factor = 140 sq in = 0.97 Sq. Ft.\nGross Allocated Leather Required Per Bag: 4.86 Sq. Ft.\n\nTarget Order Quantity: 500 Bags\nTotal Leather Footage Required: 4.86 sq ft x 500 = 2,430 Square Feet\nFinancial Budget (@ BDT 240/sq ft for Cow Nappa): BDT 583,200 (~USD $4,860 @ 120 BDT/USD)\n\nCertified by Factory Production Manager & Managing Director`;
                    handleCopyText(activeTemplateModal, text);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#C8A96A] text-[#12231B] text-xs font-bold hover:bg-[#DFCA98] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedTemplate === activeTemplateModal ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center gap-1 text-xs"
                  title="Print Template"
                >
                  <Printer className="w-4 h-4 text-[#C8A96A]" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsTemplateShareModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                  title="Share Legal Template Deed for Verification & Acknowledgement"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share (Verify / Ack)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTemplateModal(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="printable-content p-5 md:p-8 overflow-y-auto space-y-4 font-serif text-xs md:text-sm leading-relaxed text-slate-800 bg-[#FAF9F5]">
              {activeTemplateModal === 'SOURCING_DEED' && (
                <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="text-center border-b-2 border-slate-800 pb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block">
                      To be executed on Tk. 300 Non-Judicial Stamp Paper
                    </span>
                    <h2 className="text-base md:text-lg font-bold font-serif text-slate-900 uppercase pt-1">
                      Deed of Sourcing &amp; Manufacturing Agreement
                    </h2>
                  </div>

                  <p className="italic text-gray-600">
                    THIS DEED OF AGREEMENT is executed on this _____ day of _______________, 2026 at Dhaka, Bangladesh.
                  </p>

                  <div className="space-y-2 bg-slate-50 p-3 rounded border border-slate-200">
                    <p>
                      <strong>BETWEEN:</strong> <strong>Ariel Marketing &amp; Communications Limited</strong>, having its registered commercial office at House 32, Road 11, Block D, Banani, Dhaka-1213, Bangladesh, represented by its Managing Director, <strong>Syed Akramul Hassan</strong> (hereinafter referred to as the <strong>"FIRST PARTY / EXPORTER"</strong>).
                    </p>
                    <p>
                      <strong>AND:</strong> <strong>[MANUFACTURER FACTORY NAME]</strong>, having its manufacturing facility at [Factory Address, Bangladesh], holding Jute Directorate License No: [License Number] / DIFE Factory License No: [DIFE Number], represented by its Managing Director/Proprietor (hereinafter referred to as the <strong>"SECOND PARTY / MANUFACTURER"</strong>).
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p><strong>WHEREAS:</strong></p>
                    <p className="pl-3 border-l-2 border-slate-300">
                      A. The First Party is an entrepreneur and merchant exporter engaged in designing, marketing, and exporting diversified goods to global markets.<br />
                      B. The Second Party owns and operates a fully equipped manufacturing facility capable of producing goods to international quality standards.<br />
                      C. The First Party wishes to outsource production to the Second Party for its export contracts.
                    </p>

                    <p><strong>NOW, THEREFORE, IT IS MUTUALLY AGREED:</strong></p>
                    <div className="space-y-2 pl-3 border-l-2 border-[#1F3A2E]">
                      <p><strong>1. Scope of Work &amp; Sourcing:</strong> The Second Party shall manufacture and supply diversified goods strictly according to the design, material specifications, and quality standards provided by the First Party via separate Work Orders.</p>
                      <p><strong>2. Compliance &amp; Legal Certification:</strong> The Second Party warrants that it maintains a valid Factory License, Jute/Leather License, and complies with local labor and environmental laws, providing copies of these licenses to the First Party.</p>
                      <p className="p-2 rounded bg-amber-50 border border-amber-200 font-sans text-xs text-amber-950 font-medium">
                        <strong>3. Cash Incentives &amp; Entitlement (Mandatory Audit Clause):</strong> Both parties explicitly agree that the First Party (Exporter) is the SOLE OWNER AND BENEFICIARY of any and all Export Cash Incentives, subsidies, or promotional benefits granted by the Government of Bangladesh / Bangladesh Bank. The Second Party waives any claim over such incentives and agrees to sign necessary bank forms (e.g. certificates of manufacture) as required by the auditing firm.
                      </p>
                      <p><strong>4. Quality Control &amp; Inspection:</strong> The First Party or its designated inspection agency retains the right to inspect raw materials and finished goods at the Second Party's production facility prior to packing and final shipment dispatch.</p>
                      <p><strong>5. Duration &amp; Termination:</strong> This agreement shall remain valid for a period of Three (3) Years from the date of signing, renewable upon mutual written consent.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-300 font-sans text-xs">
                    <div>
                      <span className="block text-gray-500">For and on behalf of First Party:</span>
                      <div className="h-10 w-36 relative mt-2">
                        <Image
                          src="/images/syed_akramul_hassan_signature.png"
                          alt="Syed Akramul Hassan Signature"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="border-t border-slate-400 pt-1 font-bold">
                        Syed Akramul Hassan<br />
                        <span className="text-[10px] text-gray-500 font-normal">Managing Director, ArielMC Ltd</span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-gray-500">For and on behalf of Second Party:</span>
                      <div className="mt-8 border-t border-slate-400 pt-1 font-bold">
                        Authorized Signatory<br />
                        <span className="text-[10px] text-gray-500 font-normal">Proprietor / MD, Partner Factory</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTemplateModal === 'BRAC_BANK_LETTER' && (
                <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4 font-sans text-xs">
                  <div className="border-b-2 border-[#1F3A2E] pb-3 text-right">
                    <span className="font-bold text-sm text-[#1F3A2E]">Ariel Marketing &amp; Communications Limited</span>
                    <span className="block text-[10px] text-gray-500">House 32, Road 11, Block D, Banani, Dhaka-1213, Bangladesh</span>
                    <span className="text-[10px] text-gray-500">e-TIN: 893021948210 &bull; BIN: 004819204-0101 &bull; ERC: RA-0192841</span>
                  </div>

                  <div className="space-y-1">
                    <p className="font-mono text-gray-600">Date: [Current Date], 2026</p>
                    <p>To,<br />
                    The Branch Manager / Head of Trade Finance Desk<br />
                    <strong>BRAC Bank PLC</strong><br />
                    Gulshan / Motijheel Corporate Branch, Dhaka, Bangladesh.</p>
                  </div>

                  <div className="p-2 bg-slate-100 rounded border border-slate-200 font-bold text-slate-900">
                    Subject: Application for 10% Cash Incentive against Export of Diversified Goods
                  </div>

                  <p className="leading-relaxed">
                    Dear Sir/Madam,<br />
                    We would like to bring to your kind attention that our company, <strong>Ariel Marketing &amp; Communications Limited</strong>, is a registered entrepreneur-merchant exporter of diversified goods. We have successfully executed an export shipment and the foreign currency proceeds have been fully realized into our corporate account with your branch.
                  </p>

                  <p>
                    In accordance with the guidelines issued under Bangladesh Bank Foreign Exchange Policy Department (FEPD) Circulars governing export cash assistance, we are eligible to claim a <strong>10% alternative cash incentive</strong> on the realized FOB export value:
                  </p>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between"><span>Exporter Name:</span><span className="font-bold">Ariel Marketing &amp; Communications Limited</span></div>
                    <div className="flex justify-between"><span>EXP Form No. &amp; Date:</span><span className="font-bold">[EXP Number] dated [Date]</span></div>
                    <div className="flex justify-between"><span>Commercial Invoice No. &amp; Date:</span><span className="font-bold">[Invoice Number] dated [Date]</span></div>
                    <div className="flex justify-between"><span>Bill of Lading (B/L) / Airway Bill No:</span><span className="font-bold">[B/L Number]</span></div>
                    <div className="flex justify-between"><span>Net Realized FOB Value (USD):</span><span className="font-bold">USD $10,000.00</span></div>
                    <div className="flex justify-between"><span>Gross Cash Incentive (10%):</span><span className="font-bold">BDT 120,000.00 (@ ৳120.00)</span></div>
                    <div className="flex justify-between text-rose-700"><span>(&minus;) Source Tax Deduction (5% AIT):</span><span className="font-bold">&minus; BDT 6,000.00</span></div>
                    <div className="flex justify-between text-emerald-800 font-bold border-t border-slate-300 pt-1">
                      <span>Net Cash Payout Expected:</span><span>BDT 114,000.00 (Net 9.5%)</span>
                    </div>
                  </div>

                  <p className="leading-relaxed">
                    As a merchant exporter utilizing an outsourced production model, we have securely attached our tripartite sourcing documents, including our signed Sourcing Deed of Agreement and the manufacturer's local licenses to fulfill external audit requirements.
                  </p>

                  <div className="pt-4">
                    <span className="font-bold block">Yours Faithfully,</span>
                    <div className="h-10 w-36 relative mt-2">
                      <Image
                        src="/images/syed_akramul_hassan_signature.png"
                        alt="Syed Akramul Hassan Signature"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="border-t border-slate-300 pt-1 w-48 font-bold">
                      Syed Akramul Hassan<br />
                      <span className="text-[10px] text-gray-500 font-normal">Managing Director, ArielMC Ltd</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTemplateModal === 'SAVAR_CETP_LETTER' && (
                <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4 font-sans text-xs">
                  <div className="border-b-2 border-slate-800 pb-3 text-center">
                    <span className="text-xs uppercase font-mono tracking-widest text-gray-500 block">
                      To be printed on official letterhead of Savar-based Supplying Tannery
                    </span>
                    <h2 className="text-sm md:text-base font-bold font-serif uppercase pt-1 text-slate-900">
                      Certificate of Environmental Compliance &amp; Raw Material Traceability
                    </h2>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">
                      Savar Central Effluent Treatment Plant (CETP) Active Connection
                    </span>
                  </div>

                  <p className="font-mono text-gray-600">Date: [Date], 2026</p>
                  <p className="font-bold text-slate-900">TO WHOM IT MAY CONCERN</p>

                  <p className="leading-relaxed">
                    Dear Sir/Madam,<br />
                    This is to formally certify and declare that <strong>[Insert Supplying Tannery Name]</strong>, located at <strong>Plot No: [Plot Number], Road No: [Road Number], BSCIC Tannery Industrial Estate, Hemayetpur, Savar, Dhaka</strong>, is a fully compliant operational unit holding a valid Leather License, NBR e-TIN: [e-TIN], and NBR e-BIN/VAT Registration: [e-BIN].
                  </p>

                  <p className="leading-relaxed p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
                    We further declare that our production facility is fully integrated, connected to, and actively utilizes the central infrastructure of the <strong>Central Effluent Treatment Plant (CETP)</strong> operated by Bangladesh Small and Cottage Industries Corporation (BSCIC) at the Savar Tannery Industrial Estate. All liquid waste, chemical effluents, and by-products generated during the tanning process are discharged and treated strictly in accordance with environmental regulations enforced by the Department of Environment.
                  </p>

                  <p className="leading-relaxed">
                    We hereby verify that the finished/crust leather supplied to the manufacturer, <strong>[Insert Partner Factory Name]</strong>, under our official <strong>VAT-6.3 Invoice/Chalan No: ______________ dated ______________</strong>, consisting of <strong>[Quantity, e.g. 2,430] Sq. Ft. of Cow Finished Nappa Leather</strong>, was entirely processed within our Savar facility under the aforementioned eco-compliance conditions.
                  </p>

                  <p className="text-gray-600">
                    This certificate is issued to facilitate the export cash incentive verification process via BRAC Bank PLC and the Bangladesh Bank-appointed external audit firm for the merchant exporter <strong>Ariel Marketing &amp; Communications Limited</strong>.
                  </p>

                  <div className="pt-6 grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-gray-500">Authorized Signatory &amp; Seal:</span>
                      <div className="mt-8 border-t border-slate-300 pt-1 font-bold">
                        Managing Director / Plant Operations<br />
                        <span className="text-[10px] text-gray-500 font-normal">[Supplying Tannery Name, Savar]</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTemplateModal === 'MATERIAL_YIELD_SHEET' && (
                <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4 font-sans text-xs">
                  <div className="border-b-2 border-slate-800 pb-3 text-center">
                    <h2 className="text-sm md:text-base font-bold font-serif uppercase text-slate-900">
                      Leather Consumption, Yield &amp; Wastage Sheet
                    </h2>
                    <span className="text-[10px] font-mono text-gray-500">
                      Declared Prior to Production Layout for Bangladesh Bank Export Order Validation
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                    <div><span>Merchant Exporter:</span> <strong>Ariel Marketing &amp; Communications Ltd</strong></div>
                    <div><span>Manufacturer:</span> <strong>[Partner Factory Name, Dhaka]</strong></div>
                    <div><span>Target Product:</span> <strong>Genuine Leather Shopping Bags (14"x12"x4")</strong></div>
                    <div><span>Savar Tannery:</span> <strong>[Supplying Tannery, BSCIC Savar] (VAT-6.3 Attached)</strong></div>
                  </div>

                  <div className="overflow-x-auto rounded border border-slate-200">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#FAF5EC] text-slate-900 font-bold">
                        <tr>
                          <th className="p-2">Component Panel</th>
                          <th className="p-2">Qty/Bag</th>
                          <th className="p-2">Dimensions</th>
                          <th className="p-2">Area (Sq In)</th>
                          <th className="p-2 text-right">Net Footage/Bag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="p-2">Main Front &amp; Back Panels</td>
                          <td className="p-2">2</td>
                          <td className="p-2">14.0" &times; 12.0"</td>
                          <td className="p-2">336.00</td>
                          <td className="p-2 text-right font-mono">2.33 Sq. Ft.</td>
                        </tr>
                        <tr>
                          <td className="p-2">Side Gussets</td>
                          <td className="p-2">2</td>
                          <td className="p-2">12.0" &times; 4.0"</td>
                          <td className="p-2">96.00</td>
                          <td className="p-2 text-right font-mono">0.67 Sq. Ft.</td>
                        </tr>
                        <tr>
                          <td className="p-2">Bottom Base Panel</td>
                          <td className="p-2">1</td>
                          <td className="p-2">14.0" &times; 4.0"</td>
                          <td className="p-2">56.00</td>
                          <td className="p-2 text-right font-mono">0.39 Sq. Ft.</td>
                        </tr>
                        <tr>
                          <td className="p-2">Handles &amp; Strap Trims</td>
                          <td className="p-2">2</td>
                          <td className="p-2">24.0" &times; 1.5"</td>
                          <td className="p-2">72.00</td>
                          <td className="p-2 text-right font-mono">0.50 Sq. Ft.</td>
                        </tr>
                        <tr className="bg-slate-50 font-bold">
                          <td colSpan={3} className="p-2">Total Net Material per Bag</td>
                          <td className="p-2">560.00</td>
                          <td className="p-2 text-right font-mono">3.89 Sq. Ft.</td>
                        </tr>
                        <tr className="bg-amber-50/60 text-amber-900 font-bold">
                          <td colSpan={3} className="p-2">(+) 25% Sourcing Cutting Waste Factor</td>
                          <td className="p-2">140.00</td>
                          <td className="p-2 text-right font-mono">+0.97 Sq. Ft.</td>
                        </tr>
                        <tr className="bg-[#1F3A2E] text-white font-bold">
                          <td colSpan={4} className="p-2">Gross Allocated Leather Required Per Bag</td>
                          <td className="p-2 text-right font-mono">4.86 Sq. Ft. / Bag</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-950 font-mono text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span>Total Target Order Quantity:</span>
                      <span className="font-bold">500 Pcs (Bags)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Leather Footage Required:</span>
                      <span className="font-bold">4.86 &times; 500 = 2,430 Square Feet</span>
                    </div>
                    <div className="flex justify-between border-t border-emerald-200 pt-1 text-xs">
                      <span>Financial Procurement Budget (@ ৳240/sq ft):</span>
                      <span className="font-bold">BDT 583,200 (~$4,860 USD @ ৳120)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-300">
                    <div>
                      <span className="block text-gray-500">Factory Production Manager:</span>
                      <div className="mt-6 border-t border-slate-300 pt-1 font-bold">Signature &amp; Stamp</div>
                    </div>
                    <div>
                      <span className="block text-gray-500">Managing Director / Exporter:</span>
                      <div className="mt-6 border-t border-slate-300 pt-1 font-bold">Syed Akramul Hassan, ArielMC</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTemplateModal(null)}
                className="px-4 py-2 rounded-xl bg-[#1F3A2E] text-white text-xs font-bold hover:bg-[#162B22] transition-all cursor-pointer"
              >
                Close Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Legal Template Modal */}
      {activeTemplateModal && (
        <ShareDocumentModal
          isOpen={isTemplateShareModalOpen}
          onClose={() => setIsTemplateShareModalOpen(false)}
          document={{
            id: `LEGAL-${activeTemplateModal}`,
            docCode: `AMC-LEGAL-${activeTemplateModal}-2026`,
            documentNumber: `AMC-LEGAL-${activeTemplateModal}-2026`,
            title: `ArielMC Legal Deed & Statutory Undertaking - ${activeTemplateModal}`,
            category: 'STATION_STATUTORY',
            section: 'STATION_STATUTORY',
            issuingAuthority: 'ArielMC Legal & Compliance Directorate (Dhaka / London)',
            station: 'ARIEL_BD',
            countryCode: 'BD',
            entityCode: 'BD_HUB',
            issueDate: new Date().toISOString().split('T')[0],
            expiryDate: '2027-12-31',
            status: 'ACTIVE',
            verificationUrl: `https://erp.arielmc.com/verify-doc?code=AMC-LEGAL-${activeTemplateModal}-2026&ack=true`,
            qrCodeData: `AMC-LEGAL-${activeTemplateModal}|ARIELMC_LEGAL_UNDERTAKING`,
            fileUrl: '/docs/ArielMC_Compliance_Dossier.pdf',
            fileType: 'PDF',
            fileSize: '1.2 MB',
            version: '2026.1',
            tags: ['Legal Deed', 'Stamp Paper', 'Statutory Undertaking', 'Verified'],
            notes: 'Official legal deed template executed on Tk. 300 Non-Judicial Stamp Paper.',
            isStatutoryRequirement: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
        />
      )}
    </div>
  );
};
