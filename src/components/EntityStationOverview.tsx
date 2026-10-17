'use client';

import React, { useState, useEffect } from 'react';
import { CompanyEntity, EntityCode, CurrencyCode } from '@/types/erp';
import { OfficialDocument, RenewalTask, DocumentStatus, ComplianceChecklistItem } from '@/types/documentPortal';
import { INITIAL_OFFICIAL_DOCUMENTS } from '@/data/initialOfficialDocuments';
import { DocumentUploadModal } from '@/components/DocumentUploadModal';
import { BangladeshComplianceMatrix } from '@/components/BangladeshComplianceMatrix';
import { ThemeProfile } from '@/components/Sidebar';
import { 
  Building2, 
  Globe2, 
  CreditCard, 
  Warehouse, 
  FileCheck2, 
  ExternalLink, 
  CheckCircle2, 
  ShieldAlert, 
  Landmark,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  X,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  FolderLock,
  UploadCloud,
  Clock,
  Eye,
  RefreshCw,
  Download,
  BadgeCheck,
  FileText,
  Share2,
  Compass,
  Users,
  Printer,
  ShieldCheck,
  Check,
  Layers
} from 'lucide-react';
import { OfficialDocumentViewerModal } from '@/components/OfficialDocumentViewerModal';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { DeleteDocumentConfirmModal } from '@/components/DeleteDocumentConfirmModal';
import { StationComplianceDossierModal } from '@/components/StationComplianceDossierModal';
import { ArielMC, renderBrandText } from '@/lib/brand';

interface EntityStationOverviewProps {
  companies: CompanyEntity[];
  activeEntity: CompanyEntity;
  onSelectEntity: (code: EntityCode) => void;
  onAddCompany?: (newCompany: CompanyEntity) => void;
  onEditCompany?: (updatedCompany: CompanyEntity) => void;
  onDeleteCompany?: (code: EntityCode) => void;
  onResetCompanies?: () => void;
  onNavigateToDocuments?: () => void;
  theme?: ThemeProfile;
}

export const EntityStationOverview: React.FC<EntityStationOverviewProps> = ({
  companies,
  activeEntity,
  onSelectEntity,
  onAddCompany,
  onEditCompany,
  onDeleteCompany,
  onResetCompanies,
  onNavigateToDocuments,
  theme = 'crm-green',
}) => {
  const isRoyal = theme === 'royal-blue';
  const isHeritage = theme === 'heritage-tan';

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingStation, setEditingStation] = useState<CompanyEntity | null>(null);
  const [deleteConfirmStation, setDeleteConfirmStation] = useState<CompanyEntity | null>(null);

  // Document Portal & Station Statutory Vault State
  const [stationDocs, setStationDocs] = useState<OfficialDocument[]>(INITIAL_OFFICIAL_DOCUMENTS);
  const [isDocUploadModalOpen, setIsDocUploadModalOpen] = useState(false);
  const [stationPreviewDoc, setStationPreviewDoc] = useState<OfficialDocument | null>(null);
  const [stationViewingDoc, setStationViewingDoc] = useState<OfficialDocument | null>(null);
  const [stationSharingDoc, setStationSharingDoc] = useState<OfficialDocument | null>(null);
  const [stationDeletingDoc, setStationDeletingDoc] = useState<OfficialDocument | null>(null);
  const [dossierViewMode, setDossierViewMode] = useState<'DOCUMENTS' | 'BD_COMPLIANCE_MATRIX'>('DOCUMENTS');
  const [activeStationTab, setActiveStationTab] = useState<'DOCUMENTS' | 'BANKING' | 'OFFICERS' | 'ROUTES'>('DOCUMENTS');
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [selectedChecklistItemForUpload, setSelectedChecklistItemForUpload] = useState<ComplianceChecklistItem | undefined>(undefined);

  // Multi-Select & View Mode State
  const [selectedStationDocIds, setSelectedStationDocIds] = useState<string[]>([]);
  const [batchStationSharingDocs, setBatchStationSharingDocs] = useState<OfficialDocument[] | null>(null);
  const [batchStationDeletingDocs, setBatchStationDeletingDocs] = useState<OfficialDocument[] | null>(null);
  const [stationDocViewMode, setStationDocViewMode] = useState<'table' | 'grid'>('table');

  // Sync with localStorage & custom event listener
  useEffect(() => {
    const reloadDocs = () => {
      try {
        const savedDocs = localStorage.getItem('arielmc_erp_official_documents_v1');
        if (savedDocs) {
          const parsed = JSON.parse(savedDocs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStationDocs(parsed);
          }
        }
      } catch {}
    };
    reloadDocs();
    window.addEventListener('arielmc_documents_changed', reloadDocs);
    return () => window.removeEventListener('arielmc_documents_changed', reloadDocs);
  }, []);

  const saveStationDocuments = (updated: OfficialDocument[]) => {
    setStationDocs(updated);
    try {
      localStorage.setItem('arielmc_erp_official_documents_v1', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('arielmc_documents_changed'));
    } catch {}
  };

  const handleStationUploadSuccess = (newDoc: OfficialDocument) => {
    const updated = [newDoc, ...stationDocs];
    saveStationDocuments(updated);
  };

  const handleConfirmDeleteStationDoc = (docId: string) => {
    const updated = stationDocs.filter((d) => d.id !== docId);
    saveStationDocuments(updated);
    if (stationPreviewDoc?.id === docId) setStationPreviewDoc(null);
    if (stationViewingDoc?.id === docId) setStationViewingDoc(null);
    if (stationSharingDoc?.id === docId) setStationSharingDoc(null);
    setStationDeletingDoc(null);
  };

  const handleToggleStationTask = (docId: string) => {
    const updated = stationDocs.map((doc) => {
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
    saveStationDocuments(updated);
  };

  const handleRenewStationDocOneYear = (docId: string) => {
    const updated = stationDocs.map((doc) => {
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
    saveStationDocuments(updated);
    if (stationPreviewDoc?.id === docId) {
      setStationPreviewDoc(updated.find((d) => d.id === docId) || null);
    }
  };

  const handleDeleteStationDoc = (docId: string) => {
    if (confirm('Are you sure you want to delete this official document from this station?')) {
      const updated = stationDocs.filter((d) => d.id !== docId);
      saveStationDocuments(updated);
      if (stationPreviewDoc?.id === docId) {
        setStationPreviewDoc(null);
      }
    }
  };

  const getDaysLeft = (expiryDateStr: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiryDateStr).getTime();
    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  };

  // Documents for currently active station
  const activeStationDocuments = stationDocs.filter((d) => d.station === activeEntity.code);
  const activeStationCritical7 = activeStationDocuments.filter((d) => {
    const days = getDaysLeft(d.expiryDate);
    return days >= 0 && days <= 7;
  });
  const activeStationExpiring30 = activeStationDocuments.filter((d) => {
    const days = getDaysLeft(d.expiryDate);
    return days > 7 && days <= 30;
  });

  // Multi-Select Helpers for Station Documents
  const toggleSelectStationDoc = (id: string) => {
    setSelectedStationDocIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id]
    );
  };

  const isAllActiveStationSelected =
    activeStationDocuments.length > 0 &&
    activeStationDocuments.every((d) => selectedStationDocIds.includes(d.id));

  const toggleSelectAllActiveStation = () => {
    if (isAllActiveStationSelected) {
      const activeIdSet = new Set(activeStationDocuments.map((d) => d.id));
      setSelectedStationDocIds((prev) => prev.filter((id) => !activeIdSet.has(id)));
    } else {
      const newSet = new Set([...selectedStationDocIds, ...activeStationDocuments.map((d) => d.id)]);
      setSelectedStationDocIds(Array.from(newSet));
    }
  };

  const handleConfirmBulkDeleteStationDocs = (ids: string[]) => {
    const updated = stationDocs.filter((d) => !ids.includes(d.id));
    saveStationDocuments(updated);
    setSelectedStationDocIds((prev) => prev.filter((id) => !ids.includes(id)));
    setBatchStationDeletingDocs(null);
  };

  // Form Fields State
  const [formData, setFormData] = useState({
    code: '',
    legalName: '',
    country: '',
    countryCode: '',
    flag: '🌐',
    city: '',
    address: '',
    baseCurrency: 'USD' as CurrencyCode,
    taxType: 'Tax ID / VAT',
    taxNumber: '',
    legalStatus: 'Private Limited Company',
    role: 'Regional Distribution & Commercial Hub',
    domains: '',
    facilities: '',
    bankName: '',
    bankMask: '**** 0000',
    bankCurrency: 'USD' as CurrencyCode,
    bankType: 'Primary Operational Account',
  });

  const [formError, setFormError] = useState('');

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingStation(null);
    setFormError('');
    setFormData({
      code: 'ARIEL_',
      legalName: '',
      country: '',
      countryCode: '',
      flag: '🌐',
      city: '',
      address: '',
      baseCurrency: 'USD',
      taxType: 'Tax ID / VAT',
      taxNumber: '',
      legalStatus: 'Private Limited Company',
      role: 'Regional Distribution, Wholesale & Operations Hub',
      domains: 'www.arielmc.com',
      facilities: 'Central Logistics Warehouse',
      bankName: '',
      bankMask: '**** 1234',
      bankCurrency: 'USD',
      bankType: 'Primary Operational Account',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (station: CompanyEntity) => {
    setModalMode('edit');
    setEditingStation(station);
    setFormError('');
    const primaryBank = station.bankAccounts?.[0] || {
      bankName: '',
      accountNumberMask: '**** 0000',
      currency: station.baseCurrency,
      type: 'Primary Operational Account'
    };
    setFormData({
      code: station.code,
      legalName: station.legalName,
      country: station.country,
      countryCode: station.countryCode,
      flag: station.flag,
      city: station.city,
      address: station.address,
      baseCurrency: station.baseCurrency,
      taxType: station.taxIdentifier?.type || 'Tax ID / VAT',
      taxNumber: station.taxIdentifier?.number || '',
      legalStatus: station.legalStatus,
      role: station.role,
      domains: station.domains ? station.domains.join(', ') : '',
      facilities: station.activeFacilities ? station.activeFacilities.join(', ') : '',
      bankName: primaryBank.bankName,
      bankMask: primaryBank.accountNumberMask,
      bankCurrency: primaryBank.currency,
      bankType: primaryBank.type,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const formattedCode = formData.code.trim().toUpperCase();
    if (!formattedCode) {
      setFormError('Station code is required (e.g. ARIEL_CA)');
      return;
    }
    if (!formData.legalName.trim()) {
      setFormError('Legal Entity Name is required');
      return;
    }
    if (!formData.country.trim()) {
      setFormError('Country is required');
      return;
    }

    if (modalMode === 'add') {
      const exists = companies.some((c) => c.code === formattedCode);
      if (exists) {
        setFormError(`A station with code "${formattedCode}" already exists.`);
        return;
      }
    }

    const domainList = formData.domains
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const facilityList = formData.facilities
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const bankAccounts = [
      {
        bankName: formData.bankName.trim() || 'Treasury Commercial Account',
        accountNumberMask: formData.bankMask.trim() || '**** 0000',
        currency: formData.bankCurrency,
        type: formData.bankType.trim() || 'Primary Operational Account',
      },
    ];

    const entityPayload: CompanyEntity = {
      id: editingStation?.id || `comp_${formattedCode.toLowerCase().replace('ariel_', '')}_${Date.now()}`,
      code: formattedCode as EntityCode,
      legalName: formData.legalName.trim(),
      country: formData.country.trim(),
      countryCode: formData.countryCode.trim().toUpperCase() || 'XX',
      flag: formData.flag.trim() || '🌐',
      city: formData.city.trim() || 'Capital City',
      address: formData.address.trim() || `${formData.city}, ${formData.country}`,
      baseCurrency: formData.baseCurrency,
      taxIdentifier: {
        type: formData.taxType.trim() || 'Tax Identifier',
        number: formData.taxNumber.trim() || 'N/A',
      },
      legalStatus: formData.legalStatus.trim(),
      role: formData.role.trim(),
      domains: domainList.length > 0 ? domainList : ['www.arielmc.com'],
      activeFacilities: facilityList.length > 0 ? facilityList : ['Regional Logistics Hub'],
      bankAccounts: editingStation?.bankAccounts && editingStation.bankAccounts.length > 1
        ? [bankAccounts[0], ...editingStation.bankAccounts.slice(1)]
        : bankAccounts,
    };

    if (modalMode === 'add') {
      if (onAddCompany) onAddCompany(entityPayload);
    } else {
      if (onEditCompany) onEditCompany(entityPayload);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmStation) return;
    if (onDeleteCompany) {
      onDeleteCompany(deleteConfirmStation.code);
    }
    setDeleteConfirmStation(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#DDE3DD] p-6 shadow-sm">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A6D3B]">
              <Globe2 className="w-4 h-4 text-[#C8A96A]" />
              <span>Multi-Entity Corporate Architecture</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-[#1F3A2E] mt-1">
              Global Operating Stations & Jurisdictions
            </h1>
            <p className="text-sm text-[#6B7269] mt-1 max-w-2xl leading-relaxed">
              ArielMC operates across sovereign international jurisdictions with localized tax compliance (VAT, GST, Sales Tax, NBR), statutory corporate entities, and regional 3PL/FBA fulfillment networks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Active Operational Context Badge */}
            <div className="flex items-center gap-2.5 bg-[#F8FAF8] border border-[#DDE3DD] rounded-xl p-3 text-xs shadow-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
              <div>
                <span className="text-[#6B7269] block text-[10px] font-medium">Active Operational Context</span>
                <span className="font-bold text-[#1F3A2E] text-sm flex items-center gap-1.5">
                  <span>{activeEntity.flag}</span>
                  <span className="truncate max-w-[200px]">{activeEntity.legalName}</span>
                </span>
              </div>
            </div>

            {/* Actions: Export Dossier, Add Station & Restore */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsDossierModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1F3A2E] hover:bg-[#12231B] text-[#C8A96A] border border-[#C8A96A]/60 text-xs font-bold transition-all shadow-sm cursor-pointer"
                title="View & Print Official Station Statutory Dossier"
              >
                <Printer className="w-4 h-4 text-[#C8A96A]" />
                <span>Export Station Dossier</span>
              </button>

              {onAddCompany && (
                <button
                  id="btn-add-operating-station"
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1E6B3A] to-[#14512C] hover:from-[#258247] hover:to-[#1a6637] text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#C8A96A]" />
                  <span>Add Operating Station</span>
                </button>
              )}

              {onResetCompanies && (
                <button
                  onClick={() => {
                    if (window.confirm('Restore original 5 ArielMC Operating Stations (BD, UK, US, EU, AU)? Any custom stations will be reset.')) {
                      onResetCompanies();
                    }
                  }}
                  title="Reset to Default 5 Operating Stations"
                  className="p-2.5 rounded-xl border border-[#DDE3DD] bg-white text-[#6B7269] hover:text-[#1F3A2E] hover:border-[#8A6D3B] transition-colors shadow-2xs"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map((comp) => {
          const isActive = comp.code === activeEntity.code;
          return (
            <div
              key={comp.code}
              className={`rounded-xl border transition-all duration-200 relative flex flex-col justify-between overflow-hidden bg-white text-[#1A1A1A] ${
                isActive
                  ? 'border-[#C8A96A] shadow-md ring-1 ring-[#C8A96A]/60'
                  : 'border-[#DDE3DD] hover:border-[#C8A96A]/60 hover:shadow-sm'
              }`}
            >
              {/* Top Accent Bar */}
              <div
                className={`h-1.5 w-full ${
                  isActive ? 'bg-[#C8A96A]' : 'bg-[#DDE3DD]'
                }`}
              />

              <div className="p-5 flex-1 space-y-4">
                {/* Station Title, Flag & Management Controls */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1.5 rounded-lg bg-[#F4F6F4] border border-[#DDE3DD] shrink-0">
                      {comp.flag}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {comp.code}
                        </span>
                        <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-[#FAF5EC] text-[#8A6D3B] border border-[#C8A96A]/40">
                          {comp.baseCurrency}
                        </span>
                      </div>
                      <h3 className="font-bold font-heading text-[#1F3A2E] text-sm leading-snug mt-1">
                        {comp.legalName}
                      </h3>
                      <p className="text-xs text-[#6B7269] font-medium">
                        {comp.city}, {comp.country}
                      </p>
                    </div>
                  </div>

                  {/* Edit / Delete Action Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    {onEditCompany && (
                      <button
                        onClick={() => handleOpenEditModal(comp)}
                        title="Edit Station Details"
                        className="p-1.5 rounded-lg text-[#6B7269] hover:text-[#1F3A2E] hover:bg-slate-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDeleteCompany && companies.length > 1 && (
                      <button
                        onClick={() => setDeleteConfirmStation(comp)}
                        title="Delete Operating Station"
                        className="p-1.5 rounded-lg text-[#6B7269] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Role & Legal Description */}
                <div className="bg-[#F8FAF8] rounded-lg p-3 border border-[#DDE3DD] text-xs space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#6B7269] flex items-center justify-between">
                    <span>Legal Status:</span>
                    <span className="text-[#1A1A1A] text-right font-medium">{comp.legalStatus}</span>
                  </div>
                  <p className="text-[#1A1A1A] text-[11px] leading-relaxed pt-1 border-t border-[#DDE3DD]">
                    {comp.role}
                  </p>
                </div>

                {/* Tax & Compliance Identifiers */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#F4F6F4] border border-[#DDE3DD]">
                    <span className="text-[#6B7269] flex items-center gap-1.5 font-medium">
                      <FileCheck2 className="w-3.5 h-3.5 text-[#14512C]" />
                      <span>{comp.taxIdentifier?.type || 'Tax ID'}:</span>
                    </span>
                    <span className="font-mono text-[#1F3A2E] font-bold text-[11px] truncate max-w-[190px]">
                      {comp.taxIdentifier?.number || 'N/A'}
                    </span>
                  </div>

                  {/* Active Banking */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-[#6B7269] uppercase tracking-wider flex items-center gap-1 font-heading">
                      <Landmark className="w-3 h-3 text-[#1F5FA8]" />
                      <span>Commercial Treasury / Bank</span>
                    </div>
                    {comp.bankAccounts && comp.bankAccounts.length > 0 ? (
                      comp.bankAccounts.map((bank, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded bg-[#F8FAF8] border border-[#DDE3DD] text-[#1A1A1A]"
                        >
                          <span className="truncate max-w-[170px] font-medium">{bank.bankName}</span>
                          <span className="font-mono text-[#6B7269]">{bank.accountNumberMask}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-[11px] px-2.5 py-1.5 rounded bg-[#F8FAF8] border border-[#DDE3DD] text-gray-400 italic">
                        No bank accounts registered
                      </div>
                    )}
                  </div>

                  {/* Active Facilities */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-bold text-[#6B7269] uppercase tracking-wider flex items-center gap-1 font-heading">
                      <Warehouse className="w-3 h-3 text-[#8A6D3B]" />
                      <span>Operating Hubs & Facilities</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {comp.activeFacilities && comp.activeFacilities.length > 0 ? (
                        comp.activeFacilities.map((fac, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#1F3A2E] border border-[#DDE3DD] font-medium shadow-2xs"
                          >
                            {fac}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">No facilities assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 border-t border-[#DDE3DD] bg-[#F8FAF8] flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-[#6B7269] truncate max-w-[180px]">
                  <Globe2 className="w-3 h-3 text-[#6B7269] shrink-0" />
                  <span className="truncate">{comp.domains?.[0] || 'arielmc.com'}</span>
                </div>
                {isActive ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#14512C]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Station</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectEntity(comp.code)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1F3A2E] hover:text-[#8A6D3B] transition-colors group cursor-pointer"
                  >
                    <span>Switch Station</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE STATION STATUTORY DOSSIER & COMPLIANCE VAULT                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-[#DDE3DD] shadow-sm p-5 md:p-6 space-y-5">
        {/* Dossier Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#DDE3DD]">
          <div className="flex items-start gap-3">
            <span className="text-3xl p-2 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD] shrink-0">
              {activeEntity.flag}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                  {activeEntity.code}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FAF5EC] text-[#8A6D3B] text-[10px] font-bold border border-[#C8A96A]/40">
                  {activeEntity.baseCurrency} Treasury
                </span>
                <span className="text-xs text-[#6B7269] font-medium">
                  {activeEntity.city}, {activeEntity.country}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-heading text-[#1F3A2E] mt-1">
                {activeEntity.legalName} &mdash; Official Statutory Dossier
              </h2>
              <p className="text-xs text-[#6B7269] mt-0.5 max-w-2xl">
                Official regulatory licenses, incorporation charters, tax registrations (BIN/VAT, TIN), export association certificates (LFMEAB, BJMA, Chamber of Commerce), and corporate banking mandates with automated <strong>7-day renewal alerts</strong>.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDossierModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#DFCA98] text-[#12231B] font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              title="Print or Export Full Executive Station Dossier"
            >
              <Printer className="w-4 h-4" />
              <span>Export Dossier (Print / PDF)</span>
            </button>

            {onNavigateToDocuments && (
              <button
                onClick={onNavigateToDocuments}
                className="px-3.5 py-2.5 rounded-xl border border-[#2C5240] text-[#1F3A2E] hover:bg-[#F4F6F4] font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <FolderLock className="w-4 h-4 text-[#C8A96A]" />
                <span>Open Document Portal</span>
              </button>
            )}

            <button
              onClick={() => setIsDocUploadModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1F3A2E] to-[#12231B] text-[#C8A96A] hover:text-white border border-[#C8A96A]/60 font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>+ Upload Station Document</span>
            </button>
          </div>
        </div>

        {/* Station Stat Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
            <span className="text-[10px] uppercase font-bold text-[#6B7269] block">
              Active Station Documents
            </span>
            <span className="text-xl font-bold font-mono text-[#1F3A2E] mt-0.5 block">
              {activeStationDocuments.length}
            </span>
            <span className="text-[10px] text-gray-500">Official certificates filed</span>
          </div>

          <div className={`p-3 rounded-xl ${activeStationCritical7.length > 0 ? 'bg-rose-50 border border-rose-300' : 'bg-[#F8FAF8] border border-[#DDE3DD]'}`}>
            <span className={`text-[10px] uppercase font-bold block ${activeStationCritical7.length > 0 ? 'text-rose-700 font-black' : 'text-[#6B7269]'}`}>
              Expiring in &le; 7 Days
            </span>
            <span className={`text-xl font-bold font-mono mt-0.5 block ${activeStationCritical7.length > 0 ? 'text-rose-700' : 'text-gray-700'}`}>
              {activeStationCritical7.length}
            </span>
            <span className={`text-[10px] ${activeStationCritical7.length > 0 ? 'text-rose-600 font-bold' : 'text-gray-500'}`}>
              {activeStationCritical7.length > 0 ? '🚨 Immediate action required' : 'No urgent expirations'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
            <span className="text-[10px] uppercase font-bold text-[#6B7269] block">
              Expiring Soon (8-30 Days)
            </span>
            <span className="text-xl font-bold font-mono text-amber-700 mt-0.5 block">
              {activeStationExpiring30.length}
            </span>
            <span className="text-[10px] text-gray-500">Scheduled for renewal</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
            <span className="text-[10px] uppercase font-bold text-[#6B7269] block">
              Station Compliance Status
            </span>
            <span className="text-xl font-bold text-emerald-700 mt-0.5 block flex items-center gap-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{activeStationCritical7.length > 0 ? 'Review Needed' : 'Fully Compliant'}</span>
            </span>
            <span className="text-[10px] text-gray-500">Verified by legal &amp; treasury</span>
          </div>
        </div>

        {/* 7-Day Renewal Warning Alert if applicable */}
        {activeStationCritical7.length > 0 && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <span className="font-bold text-rose-900 block font-heading">
                  Attention: {activeStationCritical7.length} statutory document{activeStationCritical7.length > 1 ? 's are' : ' is'} due for renewal within 7 days!
                </span>
                <p className="text-rose-700 text-[11px] mt-0.5">
                  The automated compliance alert has notified the designated team. Complete statutory fees and renewal formalities before the expiry deadline.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-mono text-[10px] font-bold shrink-0">
              7-Day Alert Active
            </span>
          </div>
        )}

        {/* 4-Tab Station Navigation Suite */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD]">
          <button
            onClick={() => setActiveStationTab('DOCUMENTS')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeStationTab === 'DOCUMENTS'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>1. Statutory Vault &amp; Documents ({activeStationDocuments.length})</span>
          </button>

          <button
            onClick={() => setActiveStationTab('BANKING')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeStationTab === 'BANKING'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>2. Multi-Account Banking &amp; ERQ ({activeEntity.bankAccounts?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveStationTab('OFFICERS')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeStationTab === 'OFFICERS'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>3. Statutory Officers &amp; Signatories ({activeEntity.statutoryOfficers?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveStationTab('ROUTES')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeStationTab === 'ROUTES'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>4. Inter-Entity Supply Chain Route</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: STATUTORY DOCUMENTS & 34-POINT BANGLADESH LEGAL COMPLIANCE MATRIX  */}
        {/* ========================================================================= */}
        {activeStationTab === 'DOCUMENTS' && (
          <div className="space-y-4">
            {/* Top Bar: Sub-toggle for ARIEL_BD & View Mode Toggle (Table / Card) */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {activeEntity.code === 'ARIEL_BD' ? (
                <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                  <button
                    onClick={() => setDossierViewMode('DOCUMENTS')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      dossierViewMode === 'DOCUMENTS'
                        ? 'bg-[#1F3A2E] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#C8A96A]" />
                    <span>Active Station Documents ({activeStationDocuments.length})</span>
                  </button>

                  <button
                    onClick={() => setDossierViewMode('BD_COMPLIANCE_MATRIX')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      dossierViewMode === 'BD_COMPLIANCE_MATRIX'
                        ? 'bg-[#1F3A2E] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span>🇧🇩 34-Point Legal Compliance &amp; Launch Matrix</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#C8A96A] text-[#12231B] text-[9.5px] font-bold">
                      Blueprint
                    </span>
                  </button>
                </div>
              ) : (
                <div className="text-xs text-[#6B7269] flex items-center gap-2">
                  <span className="font-bold text-[#1F3A2E]">Station Archive:</span>
                  <span>{activeStationDocuments.length} registered official documents</span>
                </div>
              )}

              {/* View Mode Toggle: Table View vs Card View (when dossierViewMode === 'DOCUMENTS') */}
              {dossierViewMode === 'DOCUMENTS' && activeStationDocuments.length > 0 && (
                <div className="flex items-center gap-1 bg-[#EAEFEA] p-0.5 rounded-lg text-[11px] font-bold ml-auto">
                  <button
                    type="button"
                    onClick={() => setStationDocViewMode('table')}
                    className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      stationDocViewMode === 'table'
                        ? 'bg-[#1F3A2E] text-[#C8A96A] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Table View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStationDocViewMode('grid')}
                    className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      stationDocViewMode === 'grid'
                        ? 'bg-[#1F3A2E] text-[#C8A96A] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Card View ({activeStationDocuments.length})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Multiple Document Selection Action Bar (when 1 or more documents selected) */}
            {dossierViewMode === 'DOCUMENTS' && selectedStationDocIds.length > 0 && (
              <div className="p-3.5 bg-[#12231B] rounded-xl border border-[#2C5240] text-white flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-[#C8A96A] text-[#12231B] font-mono font-bold text-xs">
                    {selectedStationDocIds.length} of {activeStationDocuments.length} Selected
                  </span>
                  <span className="text-xs text-gray-300 hidden sm:inline">
                    Batch operations for selected station certificates:
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* 1. Share Selected via Communication Hub */}
                  <button
                    type="button"
                    onClick={() => {
                      const docsToShare = stationDocs.filter((d) => selectedStationDocIds.includes(d.id));
                      setBatchStationSharingDocs(docsToShare);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Share all selected documents via Email / WhatsApp transmittal"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Selected ({selectedStationDocIds.length})</span>
                  </button>

                  {/* 2. Delete Selected Documents */}
                  <button
                    type="button"
                    onClick={() => {
                      const docsToDelete = stationDocs.filter((d) => selectedStationDocIds.includes(d.id));
                      setBatchStationDeletingDocs(docsToDelete);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Delete all selected documents from station archive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedStationDocIds.length})</span>
                  </button>

                  {/* Select All Station / Deselect All */}
                  <button
                    type="button"
                    onClick={toggleSelectAllActiveStation}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {isAllActiveStationSelected ? 'Deselect All' : `Select All (${activeStationDocuments.length})`}
                  </button>

                  {/* Clear Selection */}
                  <button
                    type="button"
                    onClick={() => setSelectedStationDocIds([])}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Clear Selection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* View Mode Switching: 34-Point Bangladesh Compliance Matrix vs Active Documents */}
            {activeEntity.code === 'ARIEL_BD' && dossierViewMode === 'BD_COMPLIANCE_MATRIX' ? (
              <BangladeshComplianceMatrix
                existingDocuments={stationDocs}
                onOpenUploadModal={(checklistItem) => {
                  setSelectedChecklistItemForUpload(checklistItem);
                  setIsDocUploadModalOpen(true);
                }}
                onViewDocument={(docId) => {
                  const doc = stationDocs.find((d) => d.id === docId);
                  if (doc) setStationPreviewDoc(doc);
                }}
                theme={theme}
              />
            ) : activeStationDocuments.length === 0 ? (
              <div className="p-8 text-center bg-[#F8FAF8] rounded-xl border border-dashed border-[#DDE3DD] space-y-2">
                <FolderLock className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="font-bold text-[#1F3A2E] text-sm">No official documents uploaded yet for this station</h4>
                <p className="text-xs text-[#6B7269]">
                  Click "+ Upload Station Document" to upload RJSC, Trade License, VAT/BIN, or Bank Account Mandates.
                </p>
                <button
                  onClick={() => setIsDocUploadModalOpen(true)}
                  className="mt-2 px-4 py-2 rounded-lg bg-[#1F3A2E] text-[#C8A96A] text-xs font-bold hover:bg-[#12231B] transition-colors"
                >
                  + Upload First Station Document
                </button>
              </div>
            ) : (
              <>
                {/* VIEW MODE 1: Table View */}
                {stationDocViewMode === 'table' && (
                  <div className="overflow-x-auto rounded-xl border border-[#DDE3DD]">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#172D24] text-white text-[11px] font-heading">
                          <th className="p-3 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={isAllActiveStationSelected}
                              onChange={toggleSelectAllActiveStation}
                              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                              title={isAllActiveStationSelected ? 'Deselect All' : 'Select All'}
                            />
                          </th>
                          <th className="p-3 font-semibold">Document Title &amp; Authority</th>
                          <th className="p-3 font-semibold">Category</th>
                          <th className="p-3 font-semibold">Certificate / Ref #</th>
                          <th className="p-3 font-semibold">Effective Date</th>
                          <th className="p-3 font-semibold">Renewal Due Date</th>
                          <th className="p-3 font-semibold">Status / 7-Day Alert</th>
                          <th className="p-3 font-semibold">Renewal Action Task</th>
                          <th className="p-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAEFEA]">
                        {activeStationDocuments.map((doc) => {
                          const days = getDaysLeft(doc.expiryDate);
                          const isCritical = days >= 0 && days <= 7;
                          const isExpiringSoon = days > 7 && days <= 30;
                          const isExpired = days < 0;
                          const isSelected = selectedStationDocIds.includes(doc.id);

                          return (
                            <tr
                              key={doc.id}
                              className={`hover:bg-[#F8FAF8] transition-colors ${
                                isSelected
                                  ? 'bg-[#FAF5EC] border-l-4 border-l-[#C8A96A]'
                                  : isCritical
                                  ? 'bg-rose-50/60'
                                  : ''
                              }`}
                            >
                              {/* Multi-Select Checkbox */}
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectStationDoc(doc.id)}
                                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                                  title="Select document"
                                />
                              </td>

                              {/* Document Title & Authority */}
                              <td className="p-3">
                                <div className="space-y-0.5 max-w-xs">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono text-[9px] font-bold border border-slate-200">
                                      {doc.fileFormat}
                                    </span>
                                    <span
                                      onClick={() => setStationPreviewDoc(doc)}
                                      className="font-bold text-[#1F3A2E] hover:text-[#8A6D3B] cursor-pointer hover:underline text-[12px] leading-tight"
                                    >
                                      {doc.title}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-[#6B7269] truncate">
                                    {doc.issuingAuthority}
                                  </p>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="p-3 text-[11px] text-gray-600 max-w-[140px] truncate">
                                {doc.category}
                              </td>

                              {/* Document Number */}
                              <td className="p-3 font-mono text-[11px] text-slate-900 font-semibold">
                                {doc.documentNumber}
                              </td>

                              {/* Effective Date */}
                              <td className="p-3 text-gray-500 whitespace-nowrap">
                                {doc.issueDate}
                              </td>

                              {/* Renewal Due Date */}
                              <td className="p-3 whitespace-nowrap">
                                <span className="font-semibold text-slate-900 block">
                                  {doc.expiryDate}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  Alert: &le;{doc.renewalLeadDays}d
                                </span>
                              </td>

                              {/* Status / 7-Day Alert */}
                              <td className="p-3 whitespace-nowrap">
                                {isExpired ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-300 flex items-center gap-1 w-fit">
                                    <ShieldAlert className="w-3 h-3 text-rose-600" />
                                    Expired {Math.abs(days)}d ago
                                  </span>
                                ) : isCritical ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] border border-rose-600 flex items-center gap-1 w-fit animate-pulse shadow-2xs">
                                    <AlertTriangle className="w-3 h-3" />
                                    Due in {days} Days (🚨 7-Day Alert)
                                  </span>
                                ) : isExpiringSoon ? (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300 flex items-center gap-1 w-fit">
                                    <Clock className="w-3 h-3 text-amber-700" />
                                    Expiring in {days} Days
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300 flex items-center gap-1 w-fit">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    Active ({days}d left)
                                  </span>
                                )}
                              </td>

                              {/* Renewal Task */}
                              <td className="p-3">
                                {doc.renewalTask ? (
                                  <div className="space-y-0.5">
                                    <button
                                      onClick={() => handleToggleStationTask(doc.id)}
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
                                    <span className="text-[10px] text-gray-500 block truncate max-w-[120px]">
                                      {doc.renewalTask.assignedRole}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-gray-400 italic">No task bound</span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="p-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* 1. View Document */}
                                  <button
                                    onClick={() => setStationViewingDoc(doc)}
                                    title="View Official Certificate"
                                    className="px-2 py-1 rounded-lg bg-[#1F3A2E] hover:bg-[#12231B] text-[#C8A96A] text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View</span>
                                  </button>

                                  {/* 2. Share Document */}
                                  <button
                                    onClick={() => setStationSharingDoc(doc)}
                                    title="Share Document via Communication Hub (Email/WhatsApp)"
                                    className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Share</span>
                                  </button>

                                  {/* Quick Renew */}
                                  <button
                                    onClick={() => handleRenewStationDocOneYear(doc.id)}
                                    title="Quick Renew (+1 Year)"
                                    className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>

                                  {/* 3. Delete Document */}
                                  <button
                                    onClick={() => setStationDeletingDoc(doc)}
                                    title="Delete Document"
                                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

                {/* VIEW MODE 2: Card Grid View */}
                {stationDocViewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeStationDocuments.map((doc) => {
                      const days = getDaysLeft(doc.expiryDate);
                      const isCritical = days >= 0 && days <= 7;
                      const isExpiringSoon = days > 7 && days <= 30;
                      const isExpired = days < 0;
                      const isSelected = selectedStationDocIds.includes(doc.id);

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
                                  onChange={() => toggleSelectStationDoc(doc.id)}
                                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                                  title="Select document"
                                />
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xl">{activeEntity.flag || '🌐'}</span>
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
                                onClick={() => setStationViewingDoc(doc)}
                                className="font-bold text-[#1F3A2E] text-xs leading-snug cursor-pointer hover:text-[#8A6D3B] transition-colors"
                              >
                                {doc.title}
                              </h4>
                              <p className="text-[10px] text-gray-500 truncate">{doc.issuingAuthority}</p>
                            </div>

                            {/* Key Certificate Info */}
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] space-y-1 font-mono">
                              <div className="flex justify-between text-gray-600">
                                <span className="font-sans">Registration #:</span>
                                <span className="font-bold text-slate-900 truncate max-w-[160px]">{doc.documentNumber}</span>
                              </div>
                              <div className="flex justify-between text-gray-600">
                                <span className="font-sans">Effective:</span>
                                <span className="text-gray-700">{doc.issueDate}</span>
                              </div>
                              <div className="flex justify-between text-gray-600">
                                <span className="font-sans">Renewal Due:</span>
                                <span className="font-bold text-slate-900">{doc.expiryDate}</span>
                              </div>
                              <div className="flex justify-between text-gray-600">
                                <span className="font-sans">Category:</span>
                                <span className="text-gray-700 truncate max-w-[150px]">{doc.category}</span>
                              </div>
                            </div>

                            {/* Status / Expiry Alert Badge */}
                            <div className="flex items-center justify-between text-xs pt-1">
                              {isExpired ? (
                                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-300 flex items-center gap-1">
                                  <ShieldAlert className="w-3 h-3 text-rose-600" />
                                  Expired {Math.abs(days)}d ago
                                </span>
                              ) : isCritical ? (
                                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] border border-rose-600 flex items-center gap-1 animate-pulse shadow-2xs">
                                  <AlertTriangle className="w-3 h-3" />
                                  Due in {days}d (🚨 7-Day Alert)
                                </span>
                              ) : isExpiringSoon ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-700" />
                                  Expiring in {days}d
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Active ({days}d left)
                                </span>
                              )}

                              {doc.renewalTask && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleStationTask(doc.id)}
                                  className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold border transition-colors cursor-pointer ${
                                    doc.renewalTask.isCompleted
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                  }`}
                                >
                                  {doc.renewalTask.isCompleted ? '✓ Task Done' : '⏳ Task Pending'}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Card Action Buttons (View, Share, Renew, Delete) */}
                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1.5 text-xs">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setStationViewingDoc(doc)}
                                className="px-2.5 py-1 rounded-lg bg-[#1F3A2E] hover:bg-[#12231B] text-[#C8A96A] text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setStationSharingDoc(doc)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                title="Share via Communication Hub"
                              >
                                <Share2 className="w-3 h-3 text-emerald-600" />
                                <span>Share</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleRenewStationDocOneYear(doc.id)}
                                title="Quick Renew (+1 Year)"
                                className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setStationDeletingDoc(doc)}
                                title="Delete Document"
                                className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
              </>
            )}
        </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MULTI-ACCOUNT BANKING, AD MASTER L/C & BB CIRCULAR 48/31 ERQ DESK */}
        {/* ========================================================================= */}
        {activeStationTab === 'BANKING' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#8A6D3B]" />
                  <h4 className="font-bold text-[#1F3A2E] text-sm">
                    {activeEntity.legalName} &mdash; Multi-Account Banking Mandates
                  </h4>
                </div>
                <p className="text-[#6B7269] text-xs max-w-3xl leading-relaxed">
                  Authorized commercial dealer (AD) banking facilities, local operating accounts, and dedicated <strong>Foreign Currency ERQ (Export Retention Quota)</strong> accounts under <strong>Bangladesh Bank FE Circular 48/31</strong> allowing retention of foreign export earnings to fund overseas 3PL logistics, marketplace fees, and international digital ads.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-[#FAF5EC] border border-[#C8A96A] text-[#8A6D3B] text-xs font-mono font-bold shrink-0">
                Accounting Base: {activeEntity.baseCurrency}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeEntity.bankAccounts && activeEntity.bankAccounts.length > 0 ? (
                activeEntity.bankAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all space-y-2.5 flex flex-col justify-between ${
                      acc.isErq
                        ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                        : acc.isPrimary
                        ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                        : 'bg-white border-[#DDE3DD] shadow-2xs'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-[#1F3A2E] text-xs leading-snug">
                          {acc.bankName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white text-slate-800 font-mono text-[9.5px] font-bold border border-slate-200">
                          {acc.currency}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-black/5 text-slate-900 font-mono text-[11px] font-bold">
                          {acc.accountNumberMask}
                        </span>
                        {acc.isPrimary && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold">
                            Primary Operating
                          </span>
                        )}
                        {acc.isErq && (
                          <span className="px-2 py-0.5 rounded-full bg-[#C8A96A] text-[#12231B] text-[9px] font-bold animate-pulse">
                            BB Circular 48/31 ERQ
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] font-semibold text-slate-800">
                        {acc.type}
                      </p>

                      {acc.purpose && (
                        <p className="text-[10.5px] text-gray-600 italic leading-relaxed pt-1 border-t border-black/5">
                          {acc.purpose}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-black/5 text-[10px] font-mono text-gray-500 space-y-0.5">
                      {acc.branch && <div>Branch: <span className="font-semibold text-slate-700">{acc.branch}</span></div>}
                      {acc.swiftBic && <div>SWIFT / BIC: <span className="font-semibold text-slate-700">{acc.swiftBic}</span></div>}
                      {acc.routingOrSortCode && <div>{acc.routingOrSortCode}</div>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 p-8 text-center text-gray-400 italic bg-[#F8FAF8] rounded-xl border border-dashed border-[#DDE3DD]">
                  No banking accounts configured for this station.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: STATUTORY CORPORATE OFFICERS & AUTHORIZED SIGNATORIES             */}
        {/* ========================================================================= */}
        {activeStationTab === 'OFFICERS' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#8A6D3B]" />
                  <h4 className="font-bold text-[#1F3A2E] text-sm">
                    {activeEntity.legalName} &mdash; Statutory Officers &amp; Signatories
                  </h4>
                </div>
                <p className="text-[#6B7269] text-xs max-w-3xl leading-relaxed">
                  Registered company directors, statutory legal representatives, individual taxpayer IDs (e-TIN), and authorized signatories for commercial banking, Master L/C negotiation, and customs ASYCUDA declarations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeEntity.statutoryOfficers && activeEntity.statutoryOfficers.length > 0 ? (
                activeEntity.statutoryOfficers.map((officer) => (
                  <div
                    key={officer.id}
                    className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-bold text-[#1F3A2E] text-xs">{officer.name}</h5>
                          <span className="text-[10.5px] text-[#8A6D3B] font-semibold block">{officer.designation}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                          {officer.status}
                        </span>
                      </div>

                      <div>
                        <span
                          className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                            officer.signingAuthority === 'SOLO_A_SIGNATORY'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : officer.signingAuthority === 'JOINT_SIGNATORY'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {officer.signingAuthority.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {officer.nationalIdOrTin && (
                        <p className="text-[10px] font-mono text-gray-500 pt-1 border-t border-gray-100">
                          {officer.nationalIdOrTin}
                        </p>
                      )}

                      {officer.notes && (
                        <p className="text-[11px] text-gray-600 leading-relaxed italic pt-1">
                          {officer.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-500 space-y-0.5">
                      {officer.email && <div>Email: <span className="font-medium text-slate-800">{officer.email}</span></div>}
                      {officer.phone && <div>Tel: <span className="font-medium text-slate-800">{officer.phone}</span></div>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 p-8 text-center text-gray-400 italic bg-[#F8FAF8] rounded-xl border border-dashed border-[#DDE3DD]">
                  No statutory officers registered for this station.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: INTER-ENTITY SUPPLY CHAIN ROUTE & CONSIGNMENT BLUEPRINT            */}
        {/* ========================================================================= */}
        {activeStationTab === 'ROUTES' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#8A6D3B]" />
                  <h4 className="font-bold text-[#1F3A2E] text-sm">
                    Inter-Entity Consignment &amp; Cross-Border Trade Route
                  </h4>
                </div>
                <p className="text-[#6B7269] text-xs max-w-3xl leading-relaxed">
                  How ArielMC Bangladesh consigns merchandise overseas to international fulfillment hubs without an immediate retail buyer, under <strong>Bangladesh Bank FE Circular 48/31</strong> and sovereign duty-free trade schemes (UK DCTS, EU EBA, US CBP 321).
                </p>
              </div>
            </div>

            {activeEntity.interEntityRoute ? (
              <div className="p-5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
                {/* Visual Flow Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇧🇩</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8A6D3B] block">Origin Consignor Hub:</span>
                      <span className="font-bold text-[#1F3A2E] text-sm">
                        Ariel Marketing &amp; Communications Ltd (Dhaka)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#1F3A2E] text-[#C8A96A] text-xs font-mono font-bold">
                      Incoterms: {activeEntity.interEntityRoute.incoterm}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#C8A96A]" />
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8A6D3B] block">Destination Consignee Hub:</span>
                      <span className="font-bold text-[#1F3A2E] text-sm">
                        {activeEntity.legalName}
                      </span>
                    </div>
                    <span className="text-2xl">{activeEntity.flag}</span>
                  </div>
                </div>

                {/* 4 Key Framework Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#8A6D3B] block">1. Ocean &amp; Air Freight Corridor</span>
                    <p className="font-semibold text-slate-800 text-xs">
                      {activeEntity.interEntityRoute.freightCorridor}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Containerized ocean transit from Chattogram (CTG) Port to destination deep-sea harbors with electronic Bill of Lading (B/L) and bonded customs clearance.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#8A6D3B] block">2. Customs Clearance &amp; Tariff Preference</span>
                    <p className="font-semibold text-slate-800 text-xs">
                      {activeEntity.interEntityRoute.customsRegime}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {activeEntity.interEntityRoute.regulatoryCircular || 'Sovereign duty-free origin certification and open-account regulatory clearance.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#8A6D3B] block">3. Overseas 3PL &amp; Amazon FBA Warehousing</span>
                    <p className="font-semibold text-slate-800 text-xs">
                      {activeEntity.interEntityRoute.destination3PL}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Consigned cargo stored overseas in certified 3PL and Amazon FBA logistics centers with real-time barcode tracking and domestic micro-fulfillment.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#8A6D3B] block">4. Currency Repatriation &amp; ERQ Quota Flow</span>
                    <p className="font-semibold text-slate-800 text-xs">
                      {activeEntity.interEntityRoute.currencyRepatriation}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Foreign exchange proceeds wired back to Eastern Bank AD Bank with the regulated ERQ retention quota credited into the USD account.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 italic bg-[#F8FAF8] rounded-xl border border-dashed border-[#DDE3DD]">
                No inter-entity consignment route configured for this station.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Station Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-[#12231B] border border-[#2C5240] text-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#2C5240] bg-[#162B22] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1F3A2E] border border-[#C8A96A]/40 flex items-center justify-center text-xl shadow-xs">
                  {formData.flag || '🌐'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96A]">
                      {modalMode === 'add' ? 'Jurisdiction Setup' : 'Entity Configuration'}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold font-heading text-white">
                    {modalMode === 'add' ? 'Register New Operating Station' : `Edit Station: ${editingStation?.legalName}`}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Station Code & Flag */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Station Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ARIEL_CA"
                    value={formData.code}
                    disabled={modalMode === 'edit'}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white font-mono uppercase focus:border-[#C8A96A] focus:outline-none disabled:opacity-50"
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Prefix with ARIEL_ (e.g. ARIEL_SG)</p>
                </div>

                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Country Flag Emoji
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 🇨🇦"
                      value={formData.flag}
                      onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                      className="w-16 p-2.5 text-center text-lg rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                    />
                    <div className="flex gap-1 overflow-x-auto text-base">
                      {['🇧🇩', '🇬🇧', '🇺🇸', '🇪🇺', '🇦🇺', '🇨🇦', '🇯🇵', '🇸🇬', '🇦🇪', '🇩🇪'].map((fl) => (
                        <button
                          key={fl}
                          type="button"
                          onClick={() => setFormData({ ...formData, flag: fl })}
                          className="p-1 rounded hover:bg-white/10"
                        >
                          {fl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Base Currency <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.baseCurrency}
                    onChange={(e) => setFormData({ ...formData, baseCurrency: e.target.value as CurrencyCode })}
                    className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                  >
                    <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="AUD">AUD (A$) - Australian Dollar</option>
                    <option value="CAD">CAD (C$) - Canadian Dollar</option>
                    <option value="SGD">SGD (S$) - Singapore Dollar</option>
                    <option value="JPY">JPY (¥) - Japanese Yen</option>
                    <option value="AED">AED (د.إ) - UAE Dirham</option>
                  </select>
                </div>
              </div>

              {/* Legal Name */}
              <div>
                <label className="block text-[#CFE0D5] font-semibold mb-1">
                  Registered Legal Entity Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ariel Marketing & Communications Limited (Canada)"
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                  required
                />
              </div>

              {/* Country, City, Country Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Country <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Canada"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    City <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Toronto"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    ISO Country Code (2 letters)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CA"
                    maxLength={3}
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white font-mono uppercase focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Registered Legal Address */}
              <div>
                <label className="block text-[#CFE0D5] font-semibold mb-1">
                  Registered Statutory Address & Contacts
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bay Street, Financial District, Toronto, ON M5J 2T3, Canada (Tel: +1 ...)"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                />
              </div>

              {/* Legal Status & Operational Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Legal Status / Registration Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Federal Corporation / LLC / Private Limited"
                    value={formData.legalStatus}
                    onChange={(e) => setFormData({ ...formData, legalStatus: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Corporate Operational Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Canadian B2B Distribution & Amazon FBA Logistics"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tax Identifier Section */}
              <div className="p-3.5 rounded-xl bg-[#0F2018] border border-[#2C5240] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#C8A96A]">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>Statutory Tax & Regulatory Compliance</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#CFE0D5] text-[11px] font-semibold mb-1">
                      Tax Identifier Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CRA BN / GST, UK VAT, Federal EIN, BIN / TIN"
                      value={formData.taxType}
                      onChange={(e) => setFormData({ ...formData, taxType: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs focus:border-[#C8A96A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#CFE0D5] text-[11px] font-semibold mb-1">
                      Tax Registration Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BN 123456789 RT0001"
                      value={formData.taxNumber}
                      onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-mono focus:border-[#C8A96A] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Commercial Treasury / Bank Account */}
              <div className="p-3.5 rounded-xl bg-[#0F2018] border border-[#2C5240] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#C8A96A]">
                  <Landmark className="w-4 h-4 text-blue-400" />
                  <span>Commercial Banking & Treasury</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[#CFE0D5] text-[11px] font-semibold mb-1">
                      Bank Name & Branch
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Bank of Canada (Toronto Corporate)"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs focus:border-[#C8A96A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#CFE0D5] text-[11px] font-semibold mb-1">
                      Account Mask
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. **** 8821"
                      value={formData.bankMask}
                      onChange={(e) => setFormData({ ...formData, bankMask: e.target.value })}
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-mono focus:border-[#C8A96A] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Operating Facilities & Domains */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Operating Hubs & Facilities (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Toronto 3PL Hub, Montreal Cross-Dock"
                    value={formData.facilities}
                    onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#CFE0D5] font-semibold mb-1">
                    Domains & Email Systems (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. www.arielmc.ca, info@arielmc.ca"
                    value={formData.domains}
                    onChange={(e) => setFormData({ ...formData, domains: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#2C5240] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#2C5240] text-slate-300 hover:bg-white/10 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1E6B3A] to-[#14512C] hover:from-[#258247] hover:to-[#1a6637] text-white font-bold transition-all shadow-md shadow-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
                  <span>{modalMode === 'add' ? 'Confirm & Register Station' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Station Confirmation Safeguard Modal */}
      {deleteConfirmStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#12231B] border border-rose-800 text-white shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-600 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold font-heading text-white">
                Delete Operating Station?
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                You are about to remove operating station <strong className="text-white">{deleteConfirmStation.legalName}</strong> (<span className="font-mono text-[#C8A96A]">{deleteConfirmStation.code}</span>).
              </p>
              <div className="mt-3 p-3 rounded-lg bg-black/40 border border-rose-900/60 text-[11px] text-rose-300">
                ⚠️ All localized tax records, bank accounts, and active jurisdiction routing for this entity will be detached from your active stations view.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmStation(null)}
                className="px-4 py-2 rounded-xl border border-[#2C5240] text-slate-300 hover:bg-white/10 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Station Document Modal */}
      <DocumentUploadModal
        isOpen={isDocUploadModalOpen}
        onClose={() => {
          setIsDocUploadModalOpen(false);
          setSelectedChecklistItemForUpload(undefined);
        }}
        onUploadSuccess={(doc) => {
          handleStationUploadSuccess(doc);
          setSelectedChecklistItemForUpload(undefined);
        }}
        companies={companies}
        preSelectedStation={activeEntity.code}
        preSelectedSection="STATION_STATUTORY"
        initialChecklistItem={selectedChecklistItemForUpload}
      />

      {/* Station Certificate Detail & Audit Inspection Modal */}
      {stationPreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#12231B] border border-[#2C5240] text-white shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#2C5240] bg-[#162B22] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1F3A2E] border border-[#C8A96A]/60 flex items-center justify-center text-[#C8A96A] text-lg font-bold shadow-md">
                  {stationPreviewDoc.fileFormat}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#C8A96A]/20 text-[#C8A96A] font-mono text-[10px] font-bold">
                      {stationPreviewDoc.docCode}
                    </span>
                    <span className="text-[10px] text-gray-300">
                      Station: {stationPreviewDoc.station.replace('ARIEL_', '')}
                    </span>
                  </div>
                  <h2 className="text-base md:text-lg font-bold font-heading text-white mt-0.5">
                    {stationPreviewDoc.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setStationPreviewDoc(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-white text-slate-900 border-2 border-[#C8A96A] shadow-md relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10">
                  <BadgeCheck className="w-36 h-36 text-[#1F3A2E]" />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="text-center pb-3 border-b border-gray-200 space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#8A6D3B]">
                      {renderBrandText(stationPreviewDoc.issuingAuthority)}
                    </p>
                    <h3 className="text-base font-bold font-heading text-[#1F3A2E]">
                      {renderBrandText(stationPreviewDoc.title)}
                    </h3>
                    <p className="text-[11px] font-mono text-gray-600 font-semibold">
                      Official Registration No: {renderBrandText(stationPreviewDoc.documentNumber)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-gray-500 uppercase block">Effective Date</span>
                      <span className="font-bold text-slate-900">{stationPreviewDoc.issueDate}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-gray-500 uppercase block">Renewal Due Date</span>
                      <span className="font-bold text-slate-900">{stationPreviewDoc.expiryDate}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-gray-500 uppercase block">Days Remaining</span>
                      <span className="font-bold text-[#1F3A2E]">
                        {getDaysLeft(stationPreviewDoc.expiryDate)} Days
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-gray-500 uppercase block">File Format</span>
                      <span className="font-bold text-slate-900">
                        {stationPreviewDoc.fileFormat} ({stationPreviewDoc.fileSize})
                      </span>
                    </div>
                  </div>

                  {stationPreviewDoc.notes && (
                    <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-[#4A3B22]">
                      <span className="text-[10px] font-bold uppercase block text-[#8A6D3B]">
                        Scope of Registration &amp; Official Description:
                      </span>
                      <p className="text-xs leading-relaxed mt-1 font-medium">
                        {renderBrandText(stationPreviewDoc.notes)}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 text-[11px] border-t border-gray-200">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified Official Station Document</span>
                    </div>
                    <div className="text-gray-500">
                      Recorded By: <span className="font-semibold">{stationPreviewDoc.uploadedBy}</span>
                    </div>
                  </div>
                </div>
              </div>

              {stationPreviewDoc.renewalTask && (
                <div className="p-4 rounded-xl bg-[#172D24] border border-[#2C5240] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C8A96A]" />
                      <span className="font-bold text-white text-xs">
                        Automated Statutory Renewal Task
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleStationTask(stationPreviewDoc.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        stationPreviewDoc.renewalTask.isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                      }`}
                    >
                      {stationPreviewDoc.renewalTask.isCompleted ? '✓ Completed' : 'Mark Task Done'}
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 text-xs space-y-1">
                    <div className="font-bold text-white">{stationPreviewDoc.renewalTask.taskTitle}</div>
                    <div className="text-[11px] text-gray-300">
                      Assigned To: <span className="text-[#C8A96A] font-semibold">{stationPreviewDoc.renewalTask.assignedRole}</span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed pt-1 border-t border-white/10">
                      {stationPreviewDoc.renewalTask.actionRequired}
                    </p>
                    <div className="text-[10px] text-gray-400 pt-1 flex items-center gap-2">
                      <span>Deadline: {stationPreviewDoc.renewalTask.renewalDeadline}</span>
                      <span>•</span>
                      <span className="text-rose-300 font-bold">
                        Priority: {stationPreviewDoc.renewalTask.priority}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#2C5240] bg-[#162B22] flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* 3. Delete Document Button */}
              <button
                type="button"
                onClick={() => setStationDeletingDoc(stationPreviewDoc)}
                className="px-3.5 py-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-950/60 border border-rose-800/40 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Delete Document</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {/* 1. View Document Button */}
                <button
                  type="button"
                  onClick={() => setStationViewingDoc(stationPreviewDoc)}
                  className="px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] border border-[#C8A96A] text-[#C8A96A] hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Document</span>
                </button>

                {/* 2. Share Document Button (Via Communication Hub) */}
                <button
                  type="button"
                  onClick={() => setStationSharingDoc(stationPreviewDoc)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share (Email/WhatsApp)</span>
                </button>

                {/* Quick Renew (+12 Months) */}
                <button
                  type="button"
                  onClick={() => handleRenewStationDocOneYear(stationPreviewDoc.id)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Renew (+12 Mo)</span>
                </button>

                {/* Download Document */}
                <button
                  type="button"
                  onClick={() => {
                    alert(`Simulating download of ${stationPreviewDoc.title}`);
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
        document={stationViewingDoc}
        isOpen={!!stationViewingDoc}
        onClose={() => setStationViewingDoc(null)}
        onShare={(doc) => setStationSharingDoc(doc)}
        onDelete={(doc) => setStationDeletingDoc(doc)}
        onRenewOneYear={handleRenewStationDocOneYear}
      />

      {/* Share Document via Communication Hub Modal (Email / WhatsApp) */}
      <ShareDocumentModal
        document={stationSharingDoc}
        documents={batchStationSharingDocs || undefined}
        isOpen={!!stationSharingDoc || !!batchStationSharingDocs}
        onClose={() => {
          setStationSharingDoc(null);
          setBatchStationSharingDocs(null);
        }}
      />

      {/* Safe Delete Document Confirmation Modal */}
      <DeleteDocumentConfirmModal
        document={stationDeletingDoc}
        documents={batchStationDeletingDocs || undefined}
        isOpen={!!stationDeletingDoc || !!batchStationDeletingDocs}
        onClose={() => {
          setStationDeletingDoc(null);
          setBatchStationDeletingDocs(null);
        }}
        onConfirmDelete={handleConfirmDeleteStationDoc}
        onConfirmBulkDelete={handleConfirmBulkDeleteStationDocs}
      />

      {/* 1-Click Executive Station Compliance Dossier Printable Modal */}
      <StationComplianceDossierModal
        station={activeEntity}
        documents={stationDocs}
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
      />
    </div>
  );
};
