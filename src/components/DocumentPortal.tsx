'use client';

import React, { useState, useEffect } from 'react';
import { CompanyEntity, EntityCode } from '@/types/erp';
import { DocumentSection, DocumentStatus, OfficialDocument, RenewalTask, ComplianceChecklistItem } from '@/types/documentPortal';
import { INITIAL_OFFICIAL_DOCUMENTS } from '@/data/initialOfficialDocuments';
import { DocumentUploadModal } from '@/components/DocumentUploadModal';
import { BangladeshComplianceMatrix } from '@/components/BangladeshComplianceMatrix';
import { ThemeProfile } from '@/components/Sidebar';
import {
  FolderLock,
  FileText,
  UploadCloud,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  ShieldCheck,
  ShieldAlert,
  Download,
  Eye,
  Trash2,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  FileCheck2,
  Landmark,
  BadgeCheck,
  Printer,
  X,
  Share2
} from 'lucide-react';
import { OfficialDocumentViewerModal } from '@/components/OfficialDocumentViewerModal';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { ArielMC, renderBrandText } from '@/lib/brand';
import { DeleteDocumentConfirmModal } from '@/components/DeleteDocumentConfirmModal';

interface DocumentPortalProps {
  companies: CompanyEntity[];
  activeEntity: CompanyEntity;
  theme?: ThemeProfile;
  initialSectionFilter?: DocumentSection | 'ALL';
  initialStationFilter?: EntityCode | 'ALL';
}

const SECTION_METADATA: Record<DocumentSection, { label: string; icon: string; desc: string }> = {
  STATION_STATUTORY: {
    label: 'Station Statutory & Legal Licenses',
    icon: '🏛️',
    desc: 'RJSC Incorporation, DNCC Trade License, NBR BIN, TIN, LFMEAB, BJMA, Chamber & Bank Mandates',
  },
  FACTORY_COMPLIANCE: {
    label: 'Factory Compliance & Audits',
    icon: '🏭',
    desc: 'SEDEX SMETA, BSCI, Oeko-Tex, Fire Safety & Environmental ETP Accreditations',
  },
  RND_SAMPLING: {
    label: 'R&D, Tech Packs & Sampling',
    icon: '🧪',
    desc: 'Buyer Approved Tech Packs, Leathercraft Patterns, Chemical Swatches & Lab Test Reports',
  },
  COMMERCIAL_ORDERS: {
    label: 'Commercial & Export Contracts',
    icon: '📄',
    desc: 'Buyer Sales Contracts, Irrevocable Letters of Credit (L/C), Proforma Invoices',
  },
  LOGISTICS_CUSTOMS: {
    label: 'Logistics, Customs & Shipping',
    icon: '🚢',
    desc: 'Ocean Bill of Lading, Certificate of Origin, Shipping Invoices & Packing Lists',
  },
  FINANCE_TAX: {
    label: 'Finance, Banking & Corporate Tax',
    icon: '💳',
    desc: 'Audited Financials, Tax Assessment Orders, ERQ Limits & Bank Facilities',
  },
};

export const DocumentPortal: React.FC<DocumentPortalProps> = ({
  companies,
  activeEntity,
  theme = 'crm-green',
  initialSectionFilter = 'ALL',
  initialStationFilter = 'ALL',
}) => {
  const isRoyal = theme === 'royal-blue';
  const isHeritage = theme === 'heritage-tan';

  // State
  const [documents, setDocuments] = useState<OfficialDocument[]>(INITIAL_OFFICIAL_DOCUMENTS);
  const [selectedSection, setSelectedSection] = useState<DocumentSection | 'ALL'>(initialSectionFilter);
  const [selectedStation, setSelectedStation] = useState<EntityCode | 'ALL'>(initialStationFilter);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Modals State
  const [activePortalView, setActivePortalView] = useState<'ARCHIVES' | 'BD_COMPLIANCE'>('ARCHIVES');
  const [selectedChecklistItemForUpload, setSelectedChecklistItemForUpload] = useState<ComplianceChecklistItem | undefined>(undefined);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<OfficialDocument | null>(null);
  const [viewingDoc, setViewingDoc] = useState<OfficialDocument | null>(null);
  const [sharingDoc, setSharingDoc] = useState<OfficialDocument | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<OfficialDocument | null>(null);
  const [selectedTaskToManage, setSelectedTaskToManage] = useState<OfficialDocument | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Multiple Document Selection State
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [batchSharingDocs, setBatchSharingDocs] = useState<OfficialDocument[] | null>(null);
  const [batchDeletingDocs, setBatchDeletingDocs] = useState<OfficialDocument[] | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load from localStorage on mount & listen to changes across stations
  useEffect(() => {
    const reloadDocs = () => {
      try {
        const savedDocs = localStorage.getItem('arielmc_erp_official_documents_v1');
        if (savedDocs) {
          const parsed = JSON.parse(savedDocs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDocuments(parsed);
          }
        }
      } catch {}
    };
    reloadDocs();
    window.addEventListener('arielmc_documents_changed', reloadDocs);
    return () => window.removeEventListener('arielmc_documents_changed', reloadDocs);
  }, []);

  // Save to localStorage helper & dispatch sync event
  const saveDocuments = (updated: OfficialDocument[]) => {
    setDocuments(updated);
    try {
      localStorage.setItem('arielmc_erp_official_documents_v1', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('arielmc_documents_changed'));
    } catch {}
  };

  // Handle Upload
  const handleUploadSuccess = (newDoc: OfficialDocument) => {
    const updated = [newDoc, ...documents];
    saveDocuments(updated);
    showToast(`Document "${newDoc.title}" successfully archived.`);
  };

  // Handle Confirmed Delete
  const handleConfirmDeleteDoc = (id: string) => {
    const targetDoc = documents.find((d) => d.id === id);
    const updated = documents.filter((d) => d.id !== id);
    saveDocuments(updated);
    if (previewDoc?.id === id) setPreviewDoc(null);
    if (viewingDoc?.id === id) setViewingDoc(null);
    if (sharingDoc?.id === id) setSharingDoc(null);
    setDeletingDoc(null);
    showToast(`Document "${targetDoc?.title || 'Record'}" permanently deleted from archive.`);
  };

  // Handle Toggle Task Completion
  const handleToggleTask = (docId: string) => {
    const updated = documents.map((doc) => {
      if (doc.id === docId && doc.renewalTask) {
        return {
          ...doc,
          renewalTask: {
            ...doc.renewalTask,
            isCompleted: !doc.renewalTask.isCompleted,
          },
        };
      }
      return doc;
    });
    saveDocuments(updated);
  };

  // Handle Quick Renewal (+ 1 Year)
  const handleRenewOneYear = (docId: string) => {
    const updated = documents.map((doc) => {
      if (doc.id === docId) {
        const currentExp = new Date(doc.expiryDate);
        currentExp.setFullYear(currentExp.getFullYear() + 1);
        const newExpiryDate = currentExp.toISOString().split('T')[0];
        return {
          ...doc,
          expiryDate: newExpiryDate,
          status: 'ACTIVE' as DocumentStatus,
          renewalTask: doc.renewalTask
            ? {
                ...doc.renewalTask,
                isCompleted: true,
                renewalDeadline: newExpiryDate,
              }
            : undefined,
        };
      }
      return doc;
    });
    saveDocuments(updated);
    if (previewDoc?.id === docId) {
      setPreviewDoc(updated.find((d) => d.id === docId) || null);
    }
  };

  // Reset to default dataset
  const handleResetDefaults = () => {
    if (confirm('Reset official documents to official factory defaults? Any custom uploads will be replaced.')) {
      saveDocuments(INITIAL_OFFICIAL_DOCUMENTS);
    }
  };

  // Helper to calculate days remaining
  const getDaysLeft = (expiryDateStr: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiryDateStr).getTime();
    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  };

  // Filtered documents
  const filteredDocuments = documents.filter((doc) => {
    if (selectedSection !== 'ALL' && doc.section !== selectedSection) return false;
    if (selectedStation !== 'ALL' && doc.station !== selectedStation) return false;

    const days = getDaysLeft(doc.expiryDate);
    if (selectedStatus === 'CRITICAL_7' && (days > 7 || days < 0)) return false;
    if (selectedStatus === 'EXPIRING_30' && (days > 30 || days <= 7 || days < 0)) return false;
    if (selectedStatus === 'ACTIVE' && (days <= 30 || days < 0)) return false;
    if (selectedStatus === 'EXPIRED' && days >= 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchDocNo = doc.documentNumber.toLowerCase().includes(q);
      const matchAuthority = doc.issuingAuthority.toLowerCase().includes(q);
      const matchCategory = doc.category.toLowerCase().includes(q);
      const matchNotes = (doc.notes || '').toLowerCase().includes(q);
      return matchTitle || matchDocNo || matchAuthority || matchCategory || matchNotes;
    }

    return true;
  });

  // Critical documents expiring within 7 days
  const critical7DaysDocs = documents.filter((doc) => {
    const days = getDaysLeft(doc.expiryDate);
    return days >= 0 && days <= 7;
  });

  // Expiring within 30 days
  const expiring30DaysDocs = documents.filter((doc) => {
    const days = getDaysLeft(doc.expiryDate);
    return days > 7 && days <= 30;
  });

  const expiredDocs = documents.filter((doc) => getDaysLeft(doc.expiryDate) < 0);
  const activeDocs = documents.filter((doc) => getDaysLeft(doc.expiryDate) > 30);

  // Multi-Select Helpers
  const toggleSelectDoc = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id]
    );
  };

  const isAllFilteredSelected =
    filteredDocuments.length > 0 &&
    filteredDocuments.every((d) => selectedDocIds.includes(d.id));

  const toggleSelectAllFiltered = () => {
    if (isAllFilteredSelected) {
      const filteredIdSet = new Set(filteredDocuments.map((d) => d.id));
      setSelectedDocIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
    } else {
      const newSet = new Set([...selectedDocIds, ...filteredDocuments.map((d) => d.id)]);
      setSelectedDocIds(Array.from(newSet));
    }
  };

  // Bulk Delete Handler
  const handleConfirmBulkDeleteDocs = (ids: string[]) => {
    const updated = documents.filter((d) => !ids.includes(d.id));
    saveDocuments(updated);
    setSelectedDocIds((prev) => prev.filter((id) => !ids.includes(id)));
    setBatchDeletingDocs(null);
    showToast(`Successfully deleted ${ids.length} official document${ids.length > 1 ? 's' : ''} from archive.`);
  };

  // Color schemes
  const headerCardBg = isRoyal ? 'bg-[#0F1E36] border-[#1E3A8A]/40' : 'bg-[#183124] border-[#2C5240]';
  const tableHeaderBg = isRoyal ? 'bg-[#1E293B]' : 'bg-[#172D24]';

  return (
    <div className="space-y-6">
      {/* Top Banner / Document Portal Header */}
      <div className={`p-6 rounded-2xl ${headerCardBg} border text-white shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A96A]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/40 text-[10px] font-bold uppercase tracking-wider font-mono">
                Central Sovereign Compliance &amp; Regulatory Hub
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                ✓ Live Cloud Archive
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold">
                All 5 Operating Stations
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black font-heading tracking-tight flex items-center gap-3">
              <FolderLock className="w-8 h-8 text-[#C8A96A] shrink-0" />
              <span>Universal Document Portal</span>
            </h1>
            <p className="text-xs md:text-sm text-[#CFE0D5] max-w-3xl leading-relaxed">
              Official centralized repository for all operating stations. Houses corporate legal dossiers (RJSC, Trade License, NBR BIN, TIN, LFMEAB, BJMA, Chamber of Commerce, Bank Mandates) and across-section compliances with automated <strong>7-day expiration reminder alerts</strong> and actionable renewal workflows.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleResetDefaults}
              title="Reset sample certificates to factory defaults"
              className="p-2.5 rounded-xl border border-[#2C5240] text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#C8A96A] via-[#DFCA98] to-[#C8A96A] text-[#12231B] font-bold text-xs shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-[#12231B]" />
              <span>+ Upload Official Document</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
          <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 backdrop-blur-xs">
            <div className="text-[11px] text-gray-300 uppercase font-heading font-semibold">Total Documents</div>
            <div className="text-2xl font-black font-mono text-white mt-1">{documents.length}</div>
            <div className="text-[10px] text-[#C8A96A] mt-0.5">Across all 6 ERP sections</div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 backdrop-blur-xs">
            <div className="text-[11px] text-emerald-300 uppercase font-heading font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active &amp; Compliant</span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-300 mt-1">{activeDocs.length}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Valid &gt; 30 days</div>
          </div>

          <div className={`p-3.5 rounded-xl ${critical7DaysDocs.length > 0 ? 'bg-rose-950/60 border-rose-500/60 animate-pulse' : 'bg-black/20 border-white/5'}`}>
            <div className="text-[11px] text-rose-300 uppercase font-heading font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Expiring in &le; 7 Days</span>
            </div>
            <div className="text-2xl font-black font-mono text-rose-300 mt-1">{critical7DaysDocs.length}</div>
            <div className="text-[10px] text-rose-400 mt-0.5 font-bold">🚨 Urgent renewal required!</div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20 backdrop-blur-xs">
            <div className="text-[11px] text-amber-300 uppercase font-heading font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Expiring (8-30 Days)</span>
            </div>
            <div className="text-2xl font-black font-mono text-amber-300 mt-1">{expiring30DaysDocs.length}</div>
            <div className="text-[10px] text-amber-400 mt-0.5">Prepare renewals</div>
          </div>
        </div>
      </div>

      {/* Prominent Urgent 7-Day Renewal Reminder Banner */}
      {critical7DaysDocs.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border-2 border-rose-500 text-white shadow-xl animate-in fade-in duration-300 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/30 border border-rose-400 text-rose-200 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-mono font-bold text-[10px] tracking-wider uppercase">
                    Mandatory 7-Day Expiry Alert Triggered
                  </span>
                  <span className="text-xs text-rose-200">
                    ({critical7DaysDocs.length} official statutory documents require immediate action)
                  </span>
                </div>
                <h3 className="font-bold text-base font-heading text-white mt-1">
                  Urgent: Statutory Certificates Expiring Within 7 Days
                </h3>
                <p className="text-xs text-rose-100/90 leading-relaxed mt-0.5">
                  Operating licenses, association certificates, and customs bonds nearing expiry must be renewed at least 7 days in advance to avoid port embargoes, export subsidy blocks, or municipal penalties.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedStatus('CRITICAL_7')}
              className="px-4 py-2 rounded-xl bg-white text-rose-900 font-bold text-xs hover:bg-rose-50 transition-colors shrink-0 shadow-md flex items-center gap-1.5 self-start md:self-center"
            >
              <span>View Expiring Documents</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick list of the critical items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-2 border-t border-rose-800">
            {critical7DaysDocs.map((cdoc) => {
              const days = getDaysLeft(cdoc.expiryDate);
              const stationObj = companies.find((c) => c.code === cdoc.station);
              return (
                <div
                  key={cdoc.id}
                  onClick={() => setPreviewDoc(cdoc)}
                  className="p-2.5 rounded-lg bg-black/30 border border-rose-500/40 hover:border-white transition-all cursor-pointer flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span>{stationObj?.flag || '🌐'}</span>
                      <span className="font-bold text-white truncate text-[11px]">{cdoc.title}</span>
                    </div>
                    <div className="text-[10px] text-rose-200 truncate mt-0.5">
                      {renderBrandText(cdoc.issuingAuthority)}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono font-bold text-[10px]">
                      {days} {days === 1 ? 'day' : 'days'} left
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Portal View Switcher: Archives vs 34-Point BD Compliance Blueprint */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActivePortalView('ARCHIVES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activePortalView === 'ARCHIVES'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'text-slate-700 hover:bg-[#F4F6F4]'
            }`}
          >
            <FolderLock className="w-4 h-4 text-[#C8A96A]" />
            <span>Universal Archive Repository ({documents.length} Records)</span>
          </button>

          <button
            onClick={() => setActivePortalView('BD_COMPLIANCE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activePortalView === 'BD_COMPLIANCE'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'text-slate-700 hover:bg-[#F4F6F4]'
            }`}
          >
            <span>🇧🇩 34-Point Bangladesh Legal Compliance &amp; Launch Matrix</span>
            <span className="px-2 py-0.5 rounded-full bg-[#C8A96A] text-[#12231B] text-[10px] font-bold">
              Full Framework
            </span>
          </button>
        </div>

        <div className="text-[11px] text-[#6B7269] pr-3 hidden md:block">
          {activePortalView === 'ARCHIVES' ? 'Showing cross-section documents' : 'Showing 34 regulatory checkpoints'}
        </div>
      </div>

      {activePortalView === 'BD_COMPLIANCE' ? (
        <BangladeshComplianceMatrix
          existingDocuments={documents}
          onOpenUploadModal={(checklistItem) => {
            setSelectedChecklistItemForUpload(checklistItem);
            setIsUploadModalOpen(true);
          }}
          onViewDocument={(docId) => {
            const doc = documents.find((d) => d.id === docId);
            if (doc) setPreviewDoc(doc);
          }}
          theme={theme}
        />
      ) : (
        <>
          {/* Main Filter & Navigation Bar */}
          <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
            {/* Section Tabs */}
            <div>
              <div className="text-[11px] font-bold text-[#6B7269] uppercase tracking-wider mb-2 font-heading">
                Filter by ERP Section &amp; Functional Department:
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSection('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedSection === 'ALL'
                  ? 'bg-[#1F3A2E] text-white shadow-xs'
                  : 'bg-[#F4F6F4] text-[#4A5568] hover:bg-[#EAEFEA]'
              }`}
            >
              <span>📂 All Sections</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                {documents.length}
              </span>
            </button>

            {(Object.keys(SECTION_METADATA) as DocumentSection[]).map((secKey) => {
              const meta = SECTION_METADATA[secKey];
              const count = documents.filter((d) => d.section === secKey).length;
              const isSelected = selectedSection === secKey;
              return (
                <button
                  key={secKey}
                  onClick={() => setSelectedSection(secKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1F3A2E] text-white shadow-xs'
                      : 'bg-[#F4F6F4] text-[#4A5568] hover:bg-[#EAEFEA]'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20' : 'bg-black/5'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter Controls: Station, Expiry Status, Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-[#DDE3DD] items-center text-xs">
          {/* Station Selector */}
          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
              Station Jurisdiction:
            </label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value as EntityCode | 'ALL')}
              className="w-full p-2 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1F3A2E]"
            >
              <option value="ALL">🌐 All Operating Stations</option>
              {companies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code.replace('ARIEL_', '')} - {c.legalName}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry Status Selector */}
          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
              Validity &amp; Expiry Alert:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1F3A2E]"
            >
              <option value="ALL">Show All Statuses</option>
              <option value="CRITICAL_7">🚨 Critical: Expiring &le; 7 Days</option>
              <option value="EXPIRING_30">⚠️ Expiring Soon (8 - 30 Days)</option>
              <option value="ACTIVE">✅ Active &amp; Compliant (&gt; 30 Days)</option>
              <option value="EXPIRED">❌ Expired Documents</option>
            </select>
          </div>

          {/* Live Search */}
          <div className="md:col-span-6">
            <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
              Search by Title, Certificate # or Authority:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search RJSC, Trade License, BIN, LFMEAB, BJMA, Bank..."
                className="w-full pl-9 pr-8 p-2 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Records Display */}
      {filteredDocuments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#DDE3DD] space-y-3">
          <FolderLock className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-[#1F3A2E]">No documents match the current filter criteria</h3>
          <p className="text-xs text-[#6B7269] max-w-md mx-auto">
            Try adjusting your section, station, or expiry status filters, or click the button below to upload a new official document.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#1F3A2E] text-[#C8A96A] font-bold text-xs hover:bg-[#162B22] transition-colors"
          >
            + Upload New Document
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#DDE3DD] shadow-sm overflow-hidden">
          {/* Table Header Bar */}
          <div className="p-4 bg-[#F8FAF8] border-b border-[#DDE3DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1F3A2E] font-heading">
                Archived Documents ({filteredDocuments.length})
              </span>
              {selectedSection !== 'ALL' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                  Section: {SECTION_METADATA[selectedSection].label}
                </span>
              )}
              {selectedDocIds.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#1F3A2E] text-[#C8A96A] text-[10px] font-mono font-bold animate-pulse">
                  {selectedDocIds.length} Selected
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#6B7269] text-[11px] hidden md:inline">
                Inspect certificates, multi-select to share or delete, and track 7-day renewals.
              </span>
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-[#EAEFEA] p-0.5 rounded-lg text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-[#1F3A2E] text-[#C8A96A] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Table View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#1F3A2E] text-[#C8A96A] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Card View ({filteredDocuments.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Multiple Document Selection Action Bar (Appears when 1 or more documents selected) */}
          {selectedDocIds.length > 0 && (
            <div className="p-3.5 bg-[#12231B] border-b border-[#2C5240] text-white flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-[#C8A96A] text-[#12231B] font-mono font-bold text-xs">
                  {selectedDocIds.length} of {filteredDocuments.length} Selected
                </span>
                <span className="text-xs text-gray-300 hidden sm:inline">
                  Batch operations available for selected statutory certificates:
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Share Selected via Communication Hub */}
                <button
                  type="button"
                  onClick={() => {
                    const docsToShare = documents.filter((d) => selectedDocIds.includes(d.id));
                    setBatchSharingDocs(docsToShare);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Share all selected documents via Email / WhatsApp transmittal"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Selected ({selectedDocIds.length})</span>
                </button>

                {/* 2. Delete Selected Documents */}
                <button
                  type="button"
                  onClick={() => {
                    const docsToDelete = documents.filter((d) => selectedDocIds.includes(d.id));
                    setBatchDeletingDocs(docsToDelete);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Delete all selected documents from archive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedDocIds.length})</span>
                </button>

                {/* Select All Filtered / Deselect All */}
                <button
                  type="button"
                  onClick={toggleSelectAllFiltered}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isAllFilteredSelected ? 'Deselect All' : `Select All (${filteredDocuments.length})`}
                </button>

                {/* Clear Selection */}
                <button
                  type="button"
                  onClick={() => setSelectedDocIds([])}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Clear Selection"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW MODE 1: Table View */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`${tableHeaderBg} text-white text-[11px] font-heading`}>
                    <th className="p-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllFilteredSelected}
                        onChange={toggleSelectAllFiltered}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                        title={isAllFilteredSelected ? 'Deselect all filtered documents' : 'Select all filtered documents'}
                      />
                    </th>
                    <th className="p-3.5 font-semibold">Station</th>
                    <th className="p-3.5 font-semibold">Document Title &amp; Authority</th>
                    <th className="p-3.5 font-semibold">Section &amp; Category</th>
                    <th className="p-3.5 font-semibold">Registration / Ref #</th>
                    <th className="p-3.5 font-semibold">Issue Date</th>
                    <th className="p-3.5 font-semibold">Renewal Due Date</th>
                    <th className="p-3.5 font-semibold">Status / 7-Day Alert</th>
                    <th className="p-3.5 font-semibold">Renewal Task</th>
                    <th className="p-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-[#EAEFEA]">
                {filteredDocuments.map((doc) => {
                  const days = getDaysLeft(doc.expiryDate);
                  const stationObj = companies.find((c) => c.code === doc.station);
                  const isCritical = days >= 0 && days <= 7;
                  const isExpiringSoon = days > 7 && days <= 30;
                  const isExpired = days < 0;
                  const isSelected = selectedDocIds.includes(doc.id);

                  return (
                    <tr
                      key={doc.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-[#FAF5EC] border-l-4 border-l-[#C8A96A]'
                          : isCritical
                          ? 'bg-rose-50/50 hover:bg-rose-50'
                          : 'hover:bg-[#F8FAF8]'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 w-10 text-center whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectDoc(doc.id)}
                          className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                        />
                      </td>

                      {/* Station */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">{stationObj?.flag || '🌐'}</span>
                          <div>
                            <span className="font-bold text-[#1F3A2E] block text-[11px]">
                              {doc.station.replace('ARIEL_', '')}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {stationObj?.city}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Document Title & Authority */}
                      <td className="p-3.5">
                        <div className="max-w-xs space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono text-[9px] font-bold border border-slate-200">
                              {doc.fileFormat}
                            </span>
                            <span
                              onClick={() => setPreviewDoc(doc)}
                              className="font-bold text-[#1F3A2E] hover:text-[#8A6D3B] cursor-pointer hover:underline text-[12px] leading-tight"
                            >
                              {doc.title}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#6B7269] truncate">
                            {renderBrandText(doc.issuingAuthority)}
                          </p>
                        </div>
                      </td>

                      {/* Section & Category */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#FAF5EC] text-[#8A6D3B] border border-[#C8A96A]/40 text-[10px] font-semibold block w-fit">
                            {SECTION_METADATA[doc.section]?.icon} {doc.section.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-gray-500 block truncate max-w-[150px]">
                            {doc.category}
                          </span>
                        </div>
                      </td>

                      {/* Registration / Ref # */}
                      <td className="p-3.5 font-mono text-[11px] text-slate-800 font-medium">
                        {doc.documentNumber}
                      </td>

                      {/* Issue Date */}
                      <td className="p-3.5 text-[#6B7269] whitespace-nowrap">
                        {doc.issueDate}
                      </td>

                      {/* Expiry Date */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block">
                          {doc.expiryDate}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          Threshold: &le; {doc.renewalLeadDays}d
                        </span>
                      </td>

                      {/* Status / 7-Day Alert Countdown */}
                      <td className="p-3.5 whitespace-nowrap">
                        {isExpired ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-300 flex items-center gap-1 w-fit">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            Expired {Math.abs(days)}d ago
                          </span>
                        ) : isCritical ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-bold text-[10px] border border-rose-600 flex items-center gap-1 w-fit animate-pulse shadow-xs">
                            <AlertTriangle className="w-3 h-3" />
                            Due in {days} Days (🚨 7-Day Alert)
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-amber-700" />
                            Expiring in {days} Days
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Active ({days}d left)
                          </span>
                        )}
                      </td>

                      {/* Renewal Task */}
                      <td className="p-3.5">
                        {doc.renewalTask ? (
                          <div className="space-y-1">
                            <button
                              onClick={() => handleToggleTask(doc.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${
                                doc.renewalTask.isCompleted
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                              }`}
                            >
                              <CheckCircle2
                                className={`w-3 h-3 ${
                                  doc.renewalTask.isCompleted ? 'text-emerald-600' : 'text-amber-500'
                                }`}
                              />
                              <span>
                                {doc.renewalTask.isCompleted ? 'Task Done' : 'Task Pending'}
                              </span>
                            </button>
                            <span className="text-[10px] text-gray-500 block truncate max-w-[130px]">
                              {doc.renewalTask.assignedRole}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">No task bound</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. View Document */}
                          <button
                            onClick={() => setViewingDoc(doc)}
                            title="View Official Certificate"
                            className="px-2 py-1 rounded-lg bg-[#1F3A2E] hover:bg-[#12231B] text-[#C8A96A] text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {/* 2. Share Document */}
                          <button
                            onClick={() => setSharingDoc(doc)}
                            title="Share Document via Communication Hub (Email/WhatsApp)"
                            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Share</span>
                          </button>

                          {/* Quick Renew */}
                          <button
                            onClick={() => handleRenewOneYear(doc.id)}
                            title="Quick Renew (+1 Year)"
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. Delete Document */}
                          <button
                            onClick={() => setDeletingDoc(doc)}
                            title="Delete Document"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

          {/* VIEW MODE 2: Card Grid Mode */}
          {viewMode === 'grid' && (
            <div className="p-4 md:p-6 bg-[#F8FAF8] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => {
                const days = getDaysLeft(doc.expiryDate);
                const stationObj = companies.find((c) => c.code === doc.station);
                const isCritical = days >= 0 && days <= 7;
                const isExpiringSoon = days > 7 && days <= 30;
                const isExpired = days < 0;
                const isSelected = selectedDocIds.includes(doc.id);

                return (
                  <div
                    key={doc.id}
                    className={`p-4 rounded-xl border transition-all bg-white flex flex-col justify-between space-y-3 relative ${
                      isSelected
                        ? 'border-[#C8A96A] ring-2 ring-[#C8A96A]/70 bg-[#FFFDF9] shadow-md'
                        : isCritical
                        ? 'border-rose-400 bg-rose-50/20 hover:shadow-md'
                        : isExpiringSoon
                        ? 'border-amber-300 hover:shadow-md'
                        : 'border-[#DDE3DD] hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* Card Header with Checkbox */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectDoc(doc.id)}
                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                            title="Select for batch operations"
                          />
                          <div className="flex items-center gap-1.5">
                            <span className="text-xl">{stationObj?.flag || '🌐'}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] font-bold">
                              {doc.station.replace('ARIEL_', '')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isSelected && (
                            <span className="px-1.5 py-0.5 rounded bg-[#C8A96A] text-[#12231B] text-[9px] font-bold font-mono">
                              Selected
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-[#C8A96A]/20 text-[#8A6D3B] font-mono text-[9.5px] font-bold border border-[#C8A96A]/30">
                            {doc.docCode}
                          </span>
                        </div>
                      </div>

                      {/* Title & Authority */}
                      <div className="space-y-0.5">
                        <h4
                          onClick={() => setViewingDoc(doc)}
                          className="font-bold text-[#1F3A2E] text-xs leading-snug cursor-pointer hover:text-[#8A6D3B] transition-colors"
                        >
                          {doc.title}
                        </h4>
                        <p className="text-[10px] text-gray-500 truncate">{renderBrandText(doc.issuingAuthority)}</p>
                      </div>

                      {/* Key Certificate Info */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] space-y-1 font-mono">
                        <div className="flex justify-between text-gray-600">
                          <span className="font-sans">Registration #:</span>
                          <span className="font-bold text-slate-900 truncate max-w-[160px]">{doc.documentNumber}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span className="font-sans">Effective:</span>
                          <span className="text-slate-700">{doc.issueDate}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span className="font-sans">Renewal Due:</span>
                          <span className="font-bold text-slate-900">{doc.expiryDate}</span>
                        </div>
                      </div>

                      {/* Expiry Alert Badge */}
                      <div>
                        {isExpired ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[9.5px] border border-rose-300 flex items-center gap-1 w-fit">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            Expired {Math.abs(days)}d ago
                          </span>
                        ) : isCritical ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[9.5px] border border-rose-600 flex items-center gap-1 w-fit animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            Due in {days} Days (🚨 7-Day Alert)
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[9.5px] border border-amber-300 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-amber-700" />
                            Expiring in {days} Days
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9.5px] border border-emerald-300 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Active ({days}d left)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        {/* View Document */}
                        <button
                          type="button"
                          onClick={() => setViewingDoc(doc)}
                          className="px-2.5 py-1 rounded-lg bg-[#1F3A2E] hover:bg-[#12231B] text-[#C8A96A] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>

                        {/* Share Document */}
                        <button
                          type="button"
                          onClick={() => setSharingDoc(doc)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Share2 className="w-3 h-3 text-emerald-600" />
                          <span>Share</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleRenewOneYear(doc.id)}
                          title="Renew (+1 Year)"
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingDoc(doc)}
                          title="Delete Document"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      </>
      )}

      {/* Upload Official Document Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedChecklistItemForUpload(undefined);
        }}
        onUploadSuccess={(doc) => {
          handleUploadSuccess(doc);
          setSelectedChecklistItemForUpload(undefined);
        }}
        companies={companies}
        preSelectedStation={activeEntity.code}
        preSelectedSection={selectedSection === 'ALL' ? 'STATION_STATUTORY' : selectedSection}
        initialChecklistItem={selectedChecklistItemForUpload}
      />

      {/* Official Certificate Detail & Audit Inspection Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#12231B] border border-[#2C5240] text-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#2C5240] bg-[#162B22] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1F3A2E] border border-[#C8A96A]/60 flex items-center justify-center text-[#C8A96A] text-lg font-bold shadow-md">
                  {previewDoc.fileFormat}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#C8A96A]/20 text-[#C8A96A] font-mono text-[10px] font-bold">
                      {previewDoc.docCode}
                    </span>
                    <span className="text-[10px] text-gray-300">
                      Station: {previewDoc.station.replace('ARIEL_', '')}
                    </span>
                  </div>
                  <h2 className="text-base md:text-lg font-bold font-heading text-white mt-0.5">
                    {previewDoc.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 text-xs">
              {/* Document Certificate Replica Card */}
              <div className="p-5 rounded-2xl bg-white text-slate-900 border-2 border-[#C8A96A] shadow-md relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10">
                  <BadgeCheck className="w-36 h-36 text-[#1F3A2E]" />
                </div>

                <div className="relative z-10 space-y-4">
                  {/* Top Certificate Header */}
                  <div className="text-center pb-3 border-b border-gray-200 space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#8A6D3B]">
                      {renderBrandText(previewDoc.issuingAuthority)}
                    </p>
                    <h3 className="text-base font-bold font-heading text-[#1F3A2E]">
                      {renderBrandText(previewDoc.title)}
                    </h3>
                    <p className="text-[11px] font-mono text-gray-600 font-semibold">
                      Official Registration No: {renderBrandText(previewDoc.documentNumber)}
                    </p>
                  </div>

                  {/* Certificate Specs Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-gray-500 uppercase block">Effective Date</span>
                      <span className="font-bold text-slate-900">{previewDoc.issueDate}</span>
                    </div>

                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-gray-500 uppercase block">Renewal Due Date</span>
                      <span className="font-bold text-slate-900">{previewDoc.expiryDate}</span>
                    </div>

                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-gray-500 uppercase block">Days Remaining</span>
                      <span className="font-bold text-[#1F3A2E]">
                        {getDaysLeft(previewDoc.expiryDate)} Days
                      </span>
                    </div>

                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-gray-500 uppercase block">File Format</span>
                      <span className="font-bold text-slate-900">
                        {previewDoc.fileFormat} ({previewDoc.fileSize})
                      </span>
                    </div>
                  </div>

                  {/* Notes & Legal Scope */}
                  {previewDoc.notes && (
                    <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-[#4A3B22]">
                      <span className="text-[10px] font-bold uppercase block text-[#8A6D3B]">
                        Scope of Registration &amp; Official Description:
                      </span>
                      <p className="text-xs leading-relaxed mt-1 font-medium">
                        {renderBrandText(previewDoc.notes)}
                      </p>
                    </div>
                  )}

                  {/* Verification Seal */}
                  <div className="flex items-center justify-between pt-2 text-[11px] border-t border-gray-200">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verified Certified Official Document</span>
                    </div>
                    <div className="text-gray-500">
                      Recorded By: <span className="font-semibold">{previewDoc.uploadedBy}</span> on {previewDoc.uploadedAt}
                    </div>
                  </div>
                </div>
              </div>

              {/* Linked Renewal Task Section */}
              {previewDoc.renewalTask && (
                <div className="p-4 rounded-xl bg-[#172D24] border border-[#2C5240] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C8A96A]" />
                      <span className="font-bold text-white text-xs">
                        Automated Statutory Renewal Task
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleTask(previewDoc.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        previewDoc.renewalTask.isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                      }`}
                    >
                      {previewDoc.renewalTask.isCompleted ? '✓ Completed' : 'Mark Task Done'}
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 text-xs space-y-1">
                    <div className="font-bold text-white">{previewDoc.renewalTask.taskTitle}</div>
                    <div className="text-[11px] text-gray-300">
                      Assigned To: <span className="text-[#C8A96A] font-semibold">{previewDoc.renewalTask.assignedRole}</span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed pt-1 border-t border-white/10">
                      {previewDoc.renewalTask.actionRequired}
                    </p>
                    <div className="text-[10px] text-gray-400 pt-1 flex items-center gap-2">
                      <span>Deadline: {previewDoc.renewalTask.renewalDeadline}</span>
                      <span>•</span>
                      <span className="text-rose-300 font-bold">
                        Priority: {previewDoc.renewalTask.priority}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-[#2C5240] bg-[#162B22] flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* 3. Delete Document Button */}
              <button
                type="button"
                onClick={() => setDeletingDoc(previewDoc)}
                className="px-3.5 py-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-950/60 border border-rose-800/40 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Delete Document</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {/* 1. View Document Button */}
                <button
                  type="button"
                  onClick={() => setViewingDoc(previewDoc)}
                  className="px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] border border-[#C8A96A] text-[#C8A96A] hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Document</span>
                </button>

                {/* 2. Share Document Button (Via Communication Hub) */}
                <button
                  type="button"
                  onClick={() => setSharingDoc(previewDoc)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share (Email/WhatsApp)</span>
                </button>

                {/* Renew for 1 Year (+12 Months) */}
                <button
                  type="button"
                  onClick={() => handleRenewOneYear(previewDoc.id)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Renew (+12 Mo)</span>
                </button>

                {/* Download Document */}
                <button
                  type="button"
                  onClick={() => {
                    alert(`Simulating secure encrypted download of ${previewDoc.title} (${previewDoc.fileSize})`);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#DFCA98] text-[#12231B] font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Document Full Certificate Viewer Modal */}
      <OfficialDocumentViewerModal
        document={viewingDoc}
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        onShare={(doc) => setSharingDoc(doc)}
        onDelete={(doc) => setDeletingDoc(doc)}
        onRenewOneYear={handleRenewOneYear}
      />

      {/* Share Document via Communication Hub Modal (Email / WhatsApp) */}
      <ShareDocumentModal
        document={sharingDoc}
        documents={batchSharingDocs || undefined}
        isOpen={!!sharingDoc || !!batchSharingDocs}
        onClose={() => {
          setSharingDoc(null);
          setBatchSharingDocs(null);
        }}
      />

      {/* Safe Delete Document Confirmation Modal */}
      <DeleteDocumentConfirmModal
        document={deletingDoc}
        documents={batchDeletingDocs || undefined}
        isOpen={!!deletingDoc || !!batchDeletingDocs}
        onClose={() => {
          setDeletingDoc(null);
          setBatchDeletingDocs(null);
        }}
        onConfirmDelete={handleConfirmDeleteDoc}
        onConfirmBulkDelete={handleConfirmBulkDeleteDocs}
      />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[80] p-4 rounded-xl bg-[#12231B] border-2 border-[#C8A96A] text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
