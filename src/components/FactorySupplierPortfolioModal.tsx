'use client';

import React, { useState, useEffect } from 'react';
import {
  FactorySupplierPortfolio,
  FactoryComplianceAudit,
  FactoryMachineryUnit,
  FactorySubSupplier,
  SupplierActiveProduct,
  SupplierPotentialProduct,
  SupplierLocationProfile,
} from '@/types/factoryPortfolio';
import { INITIAL_FACTORY_PORTFOLIOS } from '@/data/initialFactoryPortfolios';
import {
  Factory,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Phone,
  Mail,
  Clock,
  Printer,
  X,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Award,
  CreditCard,
  Building2,
  TrendingUp,
  Boxes,
  ShoppingBag,
  DollarSign,
  FileCheck2,
  Sparkles,
  Check,
  Info,
  Globe,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

interface FactorySupplierPortfolioModalProps {
  portfolio: FactorySupplierPortfolio;
  onClose: () => void;
  onSavePortfolio: (updated: FactorySupplierPortfolio) => void;
  isBdStation?: boolean;
  bdtRate?: number;
}

type FactoryTab =
  | 'ACTIVE_PRODUCTS'
  | 'POTENTIAL_PRODUCTS'
  | 'PRODUCTION'
  | 'COMPLIANCE'
  | 'SUB_SUPPLIERS'
  | 'FINANCIAL'
  | 'CONTACTS_LOCATIONS'
  | 'SCORECARD'
  | 'UPDATE_DATA';

export const FactorySupplierPortfolioModal: React.FC<FactorySupplierPortfolioModalProps> = ({
  portfolio,
  onClose,
  onSavePortfolio,
  isBdStation = true,
  bdtRate = 120,
}) => {
  const [activeTab, setActiveTab] = useState<FactoryTab>('ACTIVE_PRODUCTS');
  const [currentPortfolio, setCurrentPortfolio] = useState<FactorySupplierPortfolio>(portfolio);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  useEffect(() => {
    const master = INITIAL_FACTORY_PORTFOLIOS.find(
      (m) => m.id === portfolio.id || m.factoryCode === portfolio.factoryCode || m.factoryName?.toLowerCase() === portfolio.factoryName?.toLowerCase()
    );
    const enriched: FactorySupplierPortfolio = {
      ...portfolio,
      activeProducts: (portfolio.activeProducts && portfolio.activeProducts.length > 0)
        ? portfolio.activeProducts
        : (master?.activeProducts || []),
      potentialProducts: (portfolio.potentialProducts && portfolio.potentialProducts.length > 0)
        ? portfolio.potentialProducts
        : (master?.potentialProducts || []),
      capacityAndMachinery: portfolio.capacityAndMachinery || master?.capacityAndMachinery,
      complianceAudits: (portfolio.complianceAudits && portfolio.complianceAudits.length > 0)
        ? portfolio.complianceAudits
        : (master?.complianceAudits || []),
      subSupplierNetwork: (portfolio.subSupplierNetwork && portfolio.subSupplierNetwork.length > 0)
        ? portfolio.subSupplierNetwork
        : (master?.subSupplierNetwork || []),
      financialAndBanking: portfolio.financialAndBanking || master?.financialAndBanking,
      qualityScorecard: portfolio.qualityScorecard || master?.qualityScorecard,
      locationProfile: portfolio.locationProfile || master?.locationProfile,
      keyManagementContacts: (portfolio.keyManagementContacts && portfolio.keyManagementContacts.length > 0)
        ? portfolio.keyManagementContacts
        : (master?.keyManagementContacts || []),
    };
    setCurrentPortfolio(enriched);
  }, [portfolio]);

  // Active products & potential products with fallbacks
  const activeProducts = currentPortfolio.activeProducts || [];
  const potentialProducts = currentPortfolio.potentialProducts || [];

  // Summary Metrics for Active Products
  const totalActiveSkus = activeProducts.length;
  const totalUnitsProduced = activeProducts.reduce((sum, p) => sum + (p.totalUnitsProduced || 0), 0);
  const totalSpendBdt = activeProducts.reduce((sum, p) => sum + (p.totalSpendBdt || 0), 0);
  const totalSpendUsd = activeProducts.reduce((sum, p) => sum + (p.totalSpendUsd || 0), 0);
  const totalPipelineUnits = activeProducts.reduce((sum, p) => sum + (p.pipelineUnits || 0), 0);
  const avgMarginPct = activeProducts.length > 0
    ? (activeProducts.reduce((sum, p) => sum + p.marginPct, 0) / activeProducts.length).toFixed(1)
    : '0.0';

  // State for adding new Active Sourced SKU
  const [newActiveSku, setNewActiveSku] = useState<Partial<SupplierActiveProduct>>({
    sku: '',
    productName: '',
    category: currentPortfolio.sectors[0] || 'Jute',
    divisionTitle: '02 The Golden Fiber Edit',
    factoryPurchasePriceBdt: 0,
    factoryPurchasePriceUsd: 0,
    publishedExportFobUsd: 0,
    marginUsd: 0,
    marginPct: 0,
    totalUnitsProduced: 0,
    totalSpendBdt: 0,
    totalSpendUsd: 0,
    pipelineUnits: 0,
    pipelineStatus: 'IN_CUTTING',
    specifications: '',
    imageUrl: '',
  });

  // State for adding new Factory Catalog Potential Item
  const [newPotentialItem, setNewPotentialItem] = useState<Partial<SupplierPotentialProduct>>({
    factoryItemCode: '',
    name: '',
    category: currentPortfolio.sectors[0] || 'Jute',
    material: '',
    specifications: '',
    factoryOfferedPriceBdt: 0,
    factoryOfferedPriceUsd: 0,
    projectedExportFobUsd: 0,
    projectedMarginPct: 0,
    factoryMoq: 200,
    sampleStatus: 'OFF_SHELF_AVAILABLE',
    evaluationVerdict: 'HIGHLY_RECOMMENDED',
    merchandiserNotes: '',
  });

  // State for new Audit
  const [newAudit, setNewAudit] = useState<Partial<FactoryComplianceAudit>>({
    standardName: 'Sedex SMETA 4-Pillar',
    status: 'VALID',
    ratingGrade: 'Grade A / Zero Non-Conformance',
    auditBody: 'SGS Bangladesh',
    auditDate: new Date().toISOString().split('T')[0],
    validUntil: '2028-06-30',
    reportNumber: 'SGS-BD-2026-09',
  });

  // State for new Machine
  const [newMachine, setNewMachine] = useState<Partial<FactoryMachineryUnit>>({
    machineName: '',
    originCountry: 'Germany',
    quantity: 5,
    purpose: 'Precision hemming line',
  });

  // State for new Sub-Supplier
  const [newSubSupplier, setNewSubSupplier] = useState<Partial<FactorySubSupplier>>({
    materialType: 'Raw Golden Jute Fiber',
    supplierName: '',
    locationCluster: 'Faridpur Cooperative',
    complianceTier: 'Certified Tier 1',
    traceabilityVerified: true,
  });

  // Handle Add Active Sourced SKU
  const handleAddActiveSku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActiveSku.sku || !newActiveSku.productName) return;

    const purchaseUsd = Number(newActiveSku.factoryPurchasePriceUsd) || (Number(newActiveSku.factoryPurchasePriceBdt) / bdtRate);
    const publishUsd = Number(newActiveSku.publishedExportFobUsd) || 0;
    const marginUsd = publishUsd - purchaseUsd;
    const marginPct = publishUsd > 0 ? (marginUsd / publishUsd) * 100 : 0;
    const units = Number(newActiveSku.totalUnitsProduced) || 0;
    const spendBdt = Number(newActiveSku.totalSpendBdt) || (units * (Number(newActiveSku.factoryPurchasePriceBdt) || purchaseUsd * bdtRate));
    const spendUsd = spendBdt / bdtRate;

    const item: SupplierActiveProduct = {
      id: `act-${Date.now()}`,
      sku: newActiveSku.sku,
      productName: newActiveSku.productName,
      category: newActiveSku.category || 'Jute',
      divisionTitle: newActiveSku.divisionTitle || '02 The Golden Fiber Edit',
      imageUrl: newActiveSku.imageUrl || '/images/products/jute/doormats/jute-doormat-english-rose.jpg',
      specifications: newActiveSku.specifications || 'Standard export specification',
      factoryPurchasePriceBdt: Number(newActiveSku.factoryPurchasePriceBdt) || Math.round(purchaseUsd * bdtRate),
      factoryPurchasePriceUsd: Number(purchaseUsd.toFixed(2)),
      publishedExportFobUsd: Number(publishUsd.toFixed(2)),
      marginUsd: Number(marginUsd.toFixed(2)),
      marginPct: Number(marginPct.toFixed(1)),
      totalUnitsProduced: units,
      totalSpendBdt: Math.round(spendBdt),
      totalSpendUsd: Math.round(spendUsd),
      firstBatchDate: new Date().toISOString().split('T')[0],
      lastBatchDate: new Date().toISOString().split('T')[0],
      activePoNumber: newActiveSku.activePoNumber || `PO-AMC-2026-${Math.floor(10 + Math.random() * 90)}`,
      pipelineUnits: Number(newActiveSku.pipelineUnits) || 0,
      pipelineStatus: newActiveSku.pipelineStatus || 'IN_CUTTING',
      targetDispatchDate: newActiveSku.targetDispatchDate || '2026-12-15',
    };

    const updated: FactorySupplierPortfolio = {
      ...currentPortfolio,
      activeProducts: [item, ...(currentPortfolio.activeProducts || [])],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setCurrentPortfolio(updated);
    onSavePortfolio(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);

    // Reset form
    setNewActiveSku({
      sku: '',
      productName: '',
      category: currentPortfolio.sectors[0] || 'Jute',
      factoryPurchasePriceBdt: 0,
      factoryPurchasePriceUsd: 0,
      publishedExportFobUsd: 0,
      totalUnitsProduced: 0,
      pipelineUnits: 0,
      specifications: '',
    });
  };

  // Handle Add Factory Catalog Potential Item
  const handleAddPotentialItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPotentialItem.name) return;

    const offUsd = Number(newPotentialItem.factoryOfferedPriceUsd) || (Number(newPotentialItem.factoryOfferedPriceBdt) / bdtRate);
    const projUsd = Number(newPotentialItem.projectedExportFobUsd) || 0;
    const projMarginPct = projUsd > 0 ? ((projUsd - offUsd) / projUsd) * 100 : 0;

    const item: SupplierPotentialProduct = {
      id: `pot-${Date.now()}`,
      factoryItemCode: newPotentialItem.factoryItemCode || `FAC-${Math.floor(100 + Math.random() * 900)}`,
      name: newPotentialItem.name,
      category: newPotentialItem.category || 'Home Decor',
      imageUrl: newPotentialItem.imageUrl || '/images/products/jute/trivets/jute-trivet-set-7pcs-holly.jpg',
      material: newPotentialItem.material || 'Natural Bangladesh Artisan Materials',
      specifications: newPotentialItem.specifications || 'Export sample specification',
      factoryOfferedPriceBdt: Number(newPotentialItem.factoryOfferedPriceBdt) || Math.round(offUsd * bdtRate),
      factoryOfferedPriceUsd: Number(offUsd.toFixed(2)),
      projectedExportFobUsd: Number(projUsd.toFixed(2)),
      projectedMarginPct: Number(projMarginPct.toFixed(1)),
      factoryMoq: Number(newPotentialItem.factoryMoq) || 200,
      sampleStatus: newPotentialItem.sampleStatus || 'OFF_SHELF_AVAILABLE',
      evaluationVerdict: newPotentialItem.evaluationVerdict || 'HIGHLY_RECOMMENDED',
      merchandiserNotes: newPotentialItem.merchandiserNotes || 'Sample evaluated by ArielMC merchandising desk.',
    };

    const updated: FactorySupplierPortfolio = {
      ...currentPortfolio,
      potentialProducts: [item, ...(currentPortfolio.potentialProducts || [])],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setCurrentPortfolio(updated);
    onSavePortfolio(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);

    setNewPotentialItem({
      factoryItemCode: '',
      name: '',
      material: '',
      specifications: '',
      factoryOfferedPriceBdt: 0,
      factoryOfferedPriceUsd: 0,
      projectedExportFobUsd: 0,
      factoryMoq: 200,
      merchandiserNotes: '',
    });
  };

  // Add Machine
  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMachine.machineName) return;

    const machineItem: FactoryMachineryUnit = {
      machineName: newMachine.machineName,
      originCountry: newMachine.originCountry || 'Germany',
      quantity: Number(newMachine.quantity) || 1,
      purpose: newMachine.purpose || 'Precision manufacturing line equipment',
    };

    const updated: FactorySupplierPortfolio = {
      ...currentPortfolio,
      capacityAndMachinery: {
        ...currentPortfolio.capacityAndMachinery,
        machinery: [machineItem, ...currentPortfolio.capacityAndMachinery.machinery],
      },
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setCurrentPortfolio(updated);
    onSavePortfolio(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
    setNewMachine({ machineName: '', originCountry: 'Germany', quantity: 5, purpose: '' });
  };

  // Add Audit
  const handleAddAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAudit.standardName) return;

    const auditItem: FactoryComplianceAudit = {
      id: `aud-${Date.now()}`,
      standardName: newAudit.standardName,
      status: newAudit.status || 'VALID',
      ratingGrade: newAudit.ratingGrade || 'Compliant',
      auditBody: newAudit.auditBody || 'TÜV Rheinland',
      auditDate: newAudit.auditDate || new Date().toISOString().split('T')[0],
      validUntil: newAudit.validUntil || '2028-01-01',
      reportNumber: newAudit.reportNumber || `REP-${Date.now()}`,
    };

    const updated: FactorySupplierPortfolio = {
      ...currentPortfolio,
      complianceAudits: [auditItem, ...currentPortfolio.complianceAudits],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setCurrentPortfolio(updated);
    onSavePortfolio(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
    setNewAudit({ standardName: '', reportNumber: '' });
  };

  // Add Sub-Supplier
  const handleAddSubSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubSupplier.supplierName) return;

    const subItem: FactorySubSupplier = {
      id: `sub-${Date.now()}`,
      materialType: newSubSupplier.materialType || 'Raw Material',
      supplierName: newSubSupplier.supplierName,
      locationCluster: newSubSupplier.locationCluster || 'Bangladesh',
      complianceTier: newSubSupplier.complianceTier || 'Certified Tier 1',
      traceabilityVerified: true,
    };

    const updated: FactorySupplierPortfolio = {
      ...currentPortfolio,
      subSupplierNetwork: [subItem, ...currentPortfolio.subSupplierNetwork],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setCurrentPortfolio(updated);
    onSavePortfolio(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
    setNewSubSupplier({ supplierName: '', materialType: 'Raw Material' });
  };

  // Print Dossier
  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#1A1A1A]">
        
        {/* Top Header */}
        <div className="p-5 sm:px-6 sm:py-4.5 bg-[#1F3A2E] text-white flex items-start justify-between gap-4 border-b-[3px] border-[#C8A96A] shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E] font-bold shadow-xs">
                {currentPortfolio.factoryCode}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-white/90 border border-white/20 uppercase tracking-wider font-semibold">
                {currentPortfolio.vendorClassification.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#10B981]/20 text-[#6EE7B7] border border-[#10B981]/40 font-semibold">
                {currentPortfolio.tier.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-white/60 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-[#C8A96A]" />
                Updated: {currentPortfolio.lastUpdated}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2 mt-1">
              <span>{currentPortfolio.factoryName}</span>
            </h2>

            <div className="flex items-center gap-2 text-xs text-white/80 flex-wrap">
              <MapPin className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
              <span>{currentPortfolio.locationProfile?.headOfficeAddress || currentPortfolio.factoryAddress}</span>
              {currentPortfolio.digitalChannels.website && (
                <>
                  <span className="text-white/40">&bull;</span>
                  <a
                    href={`https://${currentPortfolio.digitalChannels.website.replace(/^https?:\/\//, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#C8A96A] hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>{currentPortfolio.digitalChannels.website}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrintDossier}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Print Formal Supplier Sourcing Dossier (PDF)"
            >
              <Printer className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="hidden sm:inline">Print Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
              title="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Notice Banner */}
        {saveSuccessNotice && (
          <div className="bg-emerald-500 text-white px-6 py-2 text-xs font-bold flex items-center justify-between animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Supplier living dossier updated and persisted successfully to enterprise database!</span>
            </div>
          </div>
        )}

        {/* Comprehensive Tab Bar (9 Core Pillars - Clean 2-Line Layout, No Horizontal Scroll) */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[#DDE3DD] bg-[#FAF9F5] px-4 py-2 text-xs shrink-0 select-none">
          <button
            onClick={() => setActiveTab('ACTIVE_PRODUCTS')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 font-bold font-heading border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ACTIVE_PRODUCTS'
                ? 'border-[#1F3A2E] text-[#1F3A2E] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-[#1F3A2E] hover:bg-white/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#C8A96A]" />
            <span>1. Active SKUs / Published</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#1F3A2E] text-white font-mono text-[10px]">
              {activeProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('POTENTIAL_PRODUCTS')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 font-bold font-heading border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'POTENTIAL_PRODUCTS'
                ? 'border-[#1F3A2E] text-[#1F3A2E] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-[#1F3A2E] hover:bg-white/50'
            }`}
          >
            <Boxes className="w-4 h-4 text-[#E87722]" />
            <span>2. Factory Catalog &amp; Future</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#E87722] text-white font-mono text-[10px]">
              {potentialProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('PRODUCTION')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 font-bold font-heading border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'PRODUCTION'
                ? 'border-[#1F3A2E] text-[#1F3A2E] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-[#1F3A2E] hover:bg-white/50'
            }`}
          >
            <Factory className="w-4 h-4 text-[#1F3A2E]" />
            <span>3. Production &amp; Machinery</span>
          </button>

          <button
            onClick={() => setActiveTab('COMPLIANCE')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 font-bold font-heading border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'COMPLIANCE'
                ? 'border-[#1F3A2E] text-[#1F3A2E] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-[#1F3A2E] hover:bg-white/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>4. Audits &amp; ESG</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-700 text-white font-mono text-[10px]">
              {currentPortfolio.complianceAudits.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('SUB_SUPPLIERS')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 font-bold font-heading border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'SUB_SUPPLIERS'
                ? 'border-[#1F3A2E] text-[#1F3A2E] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-[#1F3A2E] hover:bg-white/50'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>5. Sourcing Network</span>
          </button>

          <button
            onClick={() => setActiveTab('FINANCIAL')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 font-bold font-heading border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'FINANCIAL'
                ? 'border-[#1F3A2E] text-[#1F3A2E] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-[#1F3A2E] hover:bg-white/50'
            }`}
          >
            <CreditCard className="w-4 h-4 text-purple-600" />
            <span>6. B2B L/C &amp; Spend</span>
          </button>

          <button
            onClick={() => setActiveTab('CONTACTS_LOCATIONS')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 font-bold font-heading border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'CONTACTS_LOCATIONS'
                ? 'border-[#1F3A2E] text-[#1F3A2E] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-[#1F3A2E] hover:bg-white/50'
            }`}
          >
            <Building2 className="w-4 h-4 text-cyan-600" />
            <span>7. Contacts &amp; Factory/Office</span>
          </button>

          <button
            onClick={() => setActiveTab('SCORECARD')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 font-bold font-heading border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'SCORECARD'
                ? 'border-[#1F3A2E] text-[#1F3A2E] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-[#1F3A2E] hover:bg-white/50'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>8. Quality Scorecard</span>
          </button>

          <button
            onClick={() => setActiveTab('UPDATE_DATA')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 font-bold font-heading border-b-2 transition-all cursor-pointer whitespace-nowrap ml-auto ${
              activeTab === 'UPDATE_DATA'
                ? 'border-[#C8A96A] text-[#1F3A2E] bg-amber-50/50 rounded-t-lg shadow-xs'
                : 'border-transparent text-amber-800 hover:bg-amber-50/30'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>Store / Update Data</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">

          {/* ========================================================================= */}
          {/* TAB 1: ACTIVE SKUS & PRODUCTS WORKING WITH (PUBLISHED ON WEBSITE)         */}
          {/* ========================================================================= */}
          {activeTab === 'ACTIVE_PRODUCTS' && (
            <div className="space-y-6">
              {/* Header Context & KPI strip */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-heading text-[#1F3A2E] flex items-center gap-2">
                      <span>Pillar 1: Active Sourced SKUs &amp; Published Products</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] font-bold border border-[#BBE3C7]">
                        {activeProducts.length} Published Styles
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Products currently manufactured by this supplier and actively published in ArielMC's digital line sheet &amp; website.
                    </p>
                  </div>
                </div>

                {/* 5 Quick KPI Tiles */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                  <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                    <span className="text-[10px] text-slate-500 block font-medium uppercase tracking-wider">Active SKUs</span>
                    <span className="text-xl font-bold font-mono text-[#1F3A2E] mt-0.5 block">{totalActiveSkus}</span>
                    <span className="text-[10px] text-slate-500">In current catalog</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                    <span className="text-[10px] text-slate-500 block font-medium uppercase tracking-wider">Total Units Produced</span>
                    <span className="text-xl font-bold font-mono text-[#1F3A2E] mt-0.5 block">
                      {totalUnitsProduced.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500">Lifetime procurement</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                    <span className="text-[10px] text-slate-500 block font-medium uppercase tracking-wider">Total Sourcing Spend</span>
                    <span className="text-xl font-bold font-mono text-[#8A6D3B] mt-0.5 block">
                      ${totalSpendUsd.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">৳{(totalSpendBdt / 100000).toFixed(1)} Lakh BDT</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                    <span className="text-[10px] text-slate-500 block font-medium uppercase tracking-wider">Average Export Margin</span>
                    <span className="text-xl font-bold font-mono text-[#14512C] mt-0.5 block">{avgMarginPct}%</span>
                    <span className="text-[10px] text-slate-500">Factory vs FOB spread</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                    <span className="text-[10px] text-slate-500 block font-medium uppercase tracking-wider">Pipeline In Production</span>
                    <span className="text-xl font-bold font-mono text-[#0A66C2] mt-0.5 block flex items-center gap-1">
                      <span>{totalPipelineUnits.toLocaleString()}</span>
                      <span className="text-xs font-normal font-sans text-slate-500">pcs</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Active POs</span>
                  </div>
                </div>
              </div>

              {/* Active Products List */}
              {activeProducts.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-bold text-slate-700 text-sm">No active SKUs linked to this supplier yet</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Use the form below to link catalog products with purchase price, published export price, and lifetime production numbers.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="rounded-2xl border border-[#DDE3DD] hover:border-[#C8A96A] bg-white p-5 shadow-xs hover:shadow-md transition-all space-y-4"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                          {/* Thumbnail */}
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative flex items-center justify-center">
                            {prod.imageUrl ? (
                              <img
                                src={prod.imageUrl}
                                alt={prod.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ShoppingBag className="w-8 h-8 text-slate-400" />
                            )}
                            <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] font-mono text-white text-center py-0.5 truncate px-1">
                              {prod.sku}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#FAF5EC] text-[#8A6D3B] font-bold border border-[#C8A96A]/40">
                                {prod.sku}
                              </span>
                              <span className="text-xs text-slate-500 font-medium">
                                {prod.divisionTitle || prod.category}
                              </span>
                            </div>

                            <h4 className="text-base font-bold font-heading text-[#1F3A2E]">
                              {prod.productName}
                            </h4>

                            <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl">
                              {prod.specifications || 'Standard precision export specification with guaranteed quality inspection.'}
                            </p>
                          </div>
                        </div>

                        {/* Current Production Pipeline Pill */}
                        {prod.pipelineUnits && prod.pipelineUnits > 0 ? (
                          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 shrink-0 min-w-[220px]">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-bold text-blue-900">{prod.activePoNumber}</span>
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-blue-600 text-white font-bold">
                                {prod.pipelineStatus?.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <div className="flex items-baseline justify-between mt-1.5">
                              <span className="text-xs text-blue-800 font-semibold">
                                {prod.pipelineUnits.toLocaleString()} pcs in production
                              </span>
                              <span className="text-[10px] text-blue-600 font-mono">
                                Due: {prod.targetDispatchDate}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs shrink-0">
                            <span>No active PO in line &bull; Ready for reorder</span>
                          </div>
                        )}
                      </div>

                      {/* Commercial Pricing & Business History Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">Factory Purchase Price</span>
                          <span className="font-mono font-bold text-[#1F3A2E] text-sm mt-0.5 block">
                            ${prod.factoryPurchasePriceUsd.toFixed(2)} USD
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ৳{prod.factoryPurchasePriceBdt} BDT
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]/40">
                          <span className="text-[10px] text-[#8A6D3B] block uppercase font-medium">Published Export FOB</span>
                          <span className="font-mono font-bold text-[#8A6D3B] text-sm mt-0.5 block">
                            ${prod.publishedExportFobUsd.toFixed(2)} USD
                          </span>
                          <span className="text-[10px] text-[#8A6D3B]">Catalog / Website</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#E4F3E9] border border-[#BBE3C7]">
                          <span className="text-[10px] text-[#14512C] block uppercase font-medium">Gross Margin Spread</span>
                          <span className="font-mono font-bold text-[#14512C] text-sm mt-0.5 block">
                            +${prod.marginUsd.toFixed(2)} USD
                          </span>
                          <span className="text-[10px] text-[#14512C] font-semibold">
                            {prod.marginPct}% Markup
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">Lifetime Procurement</span>
                          <span className="font-mono font-bold text-[#1F3A2E] text-sm mt-0.5 block">
                            {prod.totalUnitsProduced.toLocaleString()} pcs
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ${prod.totalSpendUsd.toLocaleString()} (৳{(prod.totalSpendBdt / 100000).toFixed(1)}L)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Form: Link / Add New Active Product */}
              <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#DDE3DD] space-y-4">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#C8A96A]" />
                  <h4 className="font-bold text-[#1F3A2E] text-sm font-heading">
                    Link / Register Active Sourced SKU to this Supplier
                  </h4>
                </div>

                <form onSubmit={handleAddActiveSku} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Catalog SKU Code *</label>
                      <input
                        type="text"
                        placeholder="e.g. JD-MLD-28-XYZ"
                        value={newActiveSku.sku}
                        onChange={(e) => setNewActiveSku({ ...newActiveSku, sku: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Product Official Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. ArielMC Handcrafted Natural Coir Doormat"
                        value={newActiveSku.productName}
                        onChange={(e) => setNewActiveSku({ ...newActiveSku, productName: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Factory Purchase Price (BDT)</label>
                      <input
                        type="number"
                        placeholder="e.g. 740"
                        value={newActiveSku.factoryPurchasePriceBdt || ''}
                        onChange={(e) => setNewActiveSku({ ...newActiveSku, factoryPurchasePriceBdt: Number(e.target.value), factoryPurchasePriceUsd: Number((Number(e.target.value)/bdtRate).toFixed(2)) })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Factory Purchase Price (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 6.20"
                        value={newActiveSku.factoryPurchasePriceUsd || ''}
                        onChange={(e) => setNewActiveSku({ ...newActiveSku, factoryPurchasePriceUsd: Number(e.target.value), factoryPurchasePriceBdt: Math.round(Number(e.target.value) * bdtRate) })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Published Export FOB (USD) *</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 9.50"
                        value={newActiveSku.publishedExportFobUsd || ''}
                        onChange={(e) => setNewActiveSku({ ...newActiveSku, publishedExportFobUsd: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Lifetime Units Produced</label>
                      <input
                        type="number"
                        placeholder="e.g. 1500"
                        value={newActiveSku.totalUnitsProduced || ''}
                        onChange={(e) => setNewActiveSku({ ...newActiveSku, totalUnitsProduced: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Pipeline PO #</label>
                      <input
                        type="text"
                        placeholder="e.g. PO-AMC-2026-045"
                        value={newActiveSku.activePoNumber || ''}
                        onChange={(e) => setNewActiveSku({ ...newActiveSku, activePoNumber: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Pipeline Batch Units</label>
                      <input
                        type="number"
                        placeholder="e.g. 500"
                        value={newActiveSku.pipelineUnits || ''}
                        onChange={(e) => setNewActiveSku({ ...newActiveSku, pipelineUnits: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Target Dispatch Date</label>
                      <input
                        type="date"
                        value={newActiveSku.targetDispatchDate || ''}
                        onChange={(e) => setNewActiveSku({ ...newActiveSku, targetDispatchDate: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#C8A96A]" />
                      <span>Save &amp; Link Active SKU</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: FACTORY CATALOG & FUTURE POTENTIAL PRODUCTS                        */}
          {/* ========================================================================= */}
          {activeTab === 'POTENTIAL_PRODUCTS' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold font-heading text-[#1F3A2E] flex items-center gap-2">
                  <span>Pillar 2: Factory Catalog &amp; Future Potential Products</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FAF5EC] text-[#8A6D3B] font-bold border border-[#C8A96A]">
                    {potentialProducts.length} Evaluated Styles
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Products manufactured by this supplier that we may introduce in future seasonal edits if pricing and MOQ align.
                </p>
              </div>

              {/* Potential Products Grid */}
              {potentialProducts.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <Boxes className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-bold text-slate-700 text-sm">No factory catalog samples recorded yet</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Record counter-samples and factory models here to evaluate for future buyer line sheets.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {potentialProducts.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#DDE3DD] hover:border-[#E87722] bg-white p-5 shadow-xs hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#FAF5EC] text-[#8A6D3B] font-bold border border-[#C8A96A]/40">
                              {item.factoryItemCode}
                            </span>
                            <span className="text-xs text-slate-500 ml-2 font-medium">
                              {item.category}
                            </span>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            item.sampleStatus === 'COUNTER_SAMPLE_APPROVED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : item.sampleStatus === 'OFF_SHELF_AVAILABLE'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {item.sampleStatus.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <h4 className="text-base font-bold font-heading text-[#1F3A2E]">
                          {item.name}
                        </h4>

                        <div className="space-y-1 text-xs text-slate-600">
                          <div><strong className="text-slate-700">Material:</strong> {item.material}</div>
                          <div><strong className="text-slate-700">Specs:</strong> {item.specifications}</div>
                        </div>

                        {/* Price Spread Box */}
                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-center">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Factory Price</span>
                            <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">
                              ${item.factoryOfferedPriceUsd.toFixed(2)}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">৳{item.factoryOfferedPriceBdt}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#8A6D3B] block">Target Export FOB</span>
                            <span className="font-mono font-bold text-[#8A6D3B] text-xs mt-0.5 block">
                              ${item.projectedExportFobUsd.toFixed(2)}
                            </span>
                            <span className="text-[9px] text-slate-500">MOQ: {item.factoryMoq}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-emerald-700 block">Est. Margin</span>
                            <span className="font-mono font-bold text-emerald-700 text-xs mt-0.5 block">
                              {item.projectedMarginPct}%
                            </span>
                            <span className="text-[9px] text-emerald-600 font-bold">+${(item.projectedExportFobUsd - item.factoryOfferedPriceUsd).toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Merchandiser Notes */}
                        <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs text-amber-900">
                          <span className="font-bold font-heading block mb-0.5 text-[11px]">Sourcing Assessment:</span>
                          <p className="text-[11px] leading-snug">{item.merchandiserNotes}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                          Verdict: {item.evaluationVerdict.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Form: Add Factory Catalog Item */}
              <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#DDE3DD] space-y-4">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#E87722]" />
                  <h4 className="font-bold text-[#1F3A2E] text-sm font-heading">
                    Record New Factory Catalog Item / Future Counter-Sample
                  </h4>
                </div>

                <form onSubmit={handleAddPotentialItem} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Factory Model Code</label>
                      <input
                        type="text"
                        placeholder="e.g. BEN-RN-02"
                        value={newPotentialItem.factoryItemCode || ''}
                        onChange={(e) => setNewPotentialItem({ ...newPotentialItem, factoryItemCode: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Sample / Style Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Artisan Spiral Jute Wall Hanging with Brass Ring"
                        value={newPotentialItem.name}
                        onChange={(e) => setNewPotentialItem({ ...newPotentialItem, name: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Factory Price (BDT)</label>
                      <input
                        type="number"
                        placeholder="e.g. 540"
                        value={newPotentialItem.factoryOfferedPriceBdt || ''}
                        onChange={(e) => setNewPotentialItem({ ...newPotentialItem, factoryOfferedPriceBdt: Number(e.target.value), factoryOfferedPriceUsd: Number((Number(e.target.value)/bdtRate).toFixed(2)) })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Factory Price (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 4.50"
                        value={newPotentialItem.factoryOfferedPriceUsd || ''}
                        onChange={(e) => setNewPotentialItem({ ...newPotentialItem, factoryOfferedPriceUsd: Number(e.target.value), factoryOfferedPriceBdt: Math.round(Number(e.target.value)*bdtRate) })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Projected Export FOB (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 7.90"
                        value={newPotentialItem.projectedExportFobUsd || ''}
                        onChange={(e) => setNewPotentialItem({ ...newPotentialItem, projectedExportFobUsd: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Factory MOQ</label>
                      <input
                        type="number"
                        placeholder="e.g. 200"
                        value={newPotentialItem.factoryMoq || ''}
                        onChange={(e) => setNewPotentialItem({ ...newPotentialItem, factoryMoq: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Specifications &amp; Dimensions</label>
                      <input
                        type="text"
                        placeholder="e.g. 14 x 48 inches (35 x 122 cm), 6mm thick"
                        value={newPotentialItem.specifications || ''}
                        onChange={(e) => setNewPotentialItem({ ...newPotentialItem, specifications: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">Merchandiser Evaluation Notes</label>
                      <input
                        type="text"
                        placeholder="e.g. High quality sample, recommend for AW 2027 home edit"
                        value={newPotentialItem.merchandiserNotes || ''}
                        onChange={(e) => setNewPotentialItem({ ...newPotentialItem, merchandiserNotes: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#E87722] hover:bg-[#d06718] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Save Future Catalog Item</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PRODUCTION & MACHINERY                                             */}
          {/* ========================================================================= */}
          {activeTab === 'PRODUCTION' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold font-heading text-[#1F3A2E]">
                  Pillar 3: Production Capabilities, Machinery Roster &amp; Line Allocation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed inspection of manufacturing equipment, floor line configuration, shift structures, and ArielMC monthly reserved capacity.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#FAF9F5] border border-[#DDE3DD]">
                <div>
                  <span className="text-xs text-[#6B7269] block">Active Production Lines:</span>
                  <span className="text-base font-bold font-mono text-[#1F3A2E]">
                    {currentPortfolio.capacityAndMachinery.activeLinesCount} Dedicated Lines
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#6B7269] block">Total Factory Workforce:</span>
                  <span className="text-base font-bold font-mono text-[#1F3A2E]">
                    {currentPortfolio.capacityAndMachinery.totalWorkforce} Artisans &amp; Staff
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#6B7269] block">Shift Operating Model:</span>
                  <span className="text-base font-bold text-[#1F3A2E]">
                    {currentPortfolio.capacityAndMachinery.shiftStructure}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#6B7269] block">Reserved for ArielMC:</span>
                  <span className="text-base font-bold font-mono text-[#8A6D3B]">
                    {currentPortfolio.capacityAndMachinery.arielMcReservedCapacityUnits.toLocaleString()} Pcs / Month
                  </span>
                </div>
              </div>

              {/* Machinery Table */}
              <div className="rounded-xl border border-[#DDE3DD] overflow-hidden">
                <div className="px-4 py-3 bg-[#F8FAF8] border-b border-[#DDE3DD] font-bold font-heading text-xs text-[#1F3A2E]">
                  High-Precision Industrial Machinery Inventory
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-[#DDE3DD] text-[11px] text-slate-500">
                    <tr>
                      <th className="py-2.5 px-4">Equipment / Machine Model</th>
                      <th className="py-2.5 px-4">Country of Origin</th>
                      <th className="py-2.5 px-4 text-center">Quantity</th>
                      <th className="py-2.5 px-4">Production Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDE3DD]">
                    {currentPortfolio.capacityAndMachinery.machinery.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-semibold text-slate-800">{m.machineName}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-600">{m.originCountry}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-center text-[#1F3A2E]">{m.quantity}</td>
                        <td className="py-2.5 px-4 text-slate-600">{m.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Machine Form */}
              <form onSubmit={handleAddMachine} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
                <span className="font-bold text-slate-700">+ Add Machine:</span>
                <input
                  type="text"
                  placeholder="Machine name & model"
                  value={newMachine.machineName}
                  onChange={(e) => setNewMachine({ ...newMachine, machineName: e.target.value })}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg flex-1 min-w-[200px]"
                  required
                />
                <input
                  type="text"
                  placeholder="Country (e.g. Germany)"
                  value={newMachine.originCountry}
                  onChange={(e) => setNewMachine({ ...newMachine, originCountry: e.target.value })}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg w-32"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={newMachine.quantity || ''}
                  onChange={(e) => setNewMachine({ ...newMachine, quantity: Number(e.target.value) })}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg w-20 text-center font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1F3A2E] text-white font-bold hover:bg-[#2C5240] transition cursor-pointer"
                >
                  Add Machine
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: COMPLIANCE AUDITS & ESG                                            */}
          {/* ========================================================================= */}
          {activeTab === 'COMPLIANCE' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold font-heading text-[#1F3A2E]">
                  Pillar 4: International Compliance Audits, ESG &amp; Quality Certifications
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified third-party audits (BSCI, SEDEX SMETA, LWG, GOTS, LFGB) for export tariff preferences in UK &amp; EU.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPortfolio.complianceAudits.map((aud) => (
                  <div key={aud.id} className="p-4 rounded-xl border border-[#DDE3DD] bg-white space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold font-heading text-sm text-[#1F3A2E]">{aud.standardName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                        {aud.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      <div><strong>Grade:</strong> {aud.ratingGrade}</div>
                      <div><strong>Audit Body:</strong> {aud.auditBody} (Report #{aud.reportNumber})</div>
                      <div className="text-slate-500 font-mono text-[11px] mt-1">
                        Valid from {aud.auditDate} until <strong className="text-[#1F3A2E]">{aud.validUntil}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Audit Form */}
              <form onSubmit={handleAddAudit} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
                <span className="font-bold text-slate-700">+ Record Audit:</span>
                <input
                  type="text"
                  placeholder="Audit standard (e.g. BSCI Grade A)"
                  value={newAudit.standardName}
                  onChange={(e) => setNewAudit({ ...newAudit, standardName: e.target.value })}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg flex-1 min-w-[200px]"
                  required
                />
                <input
                  type="text"
                  placeholder="Audit Body (e.g. SGS)"
                  value={newAudit.auditBody}
                  onChange={(e) => setNewAudit({ ...newAudit, auditBody: e.target.value })}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg w-32"
                />
                <input
                  type="date"
                  value={newAudit.validUntil}
                  onChange={(e) => setNewAudit({ ...newAudit, validUntil: e.target.value })}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1F3A2E] text-white font-bold hover:bg-[#2C5240] transition cursor-pointer"
                >
                  Add Audit
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: SOURCING NETWORK & SUB-SUPPLIERS                                   */}
          {/* ========================================================================= */}
          {activeTab === 'SUB_SUPPLIERS' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold font-heading text-[#1F3A2E]">
                  Pillar 5: Raw Material Network, Component Sourcing &amp; Traceability
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Traceability mapping for raw golden jute, leather hides, organic yarn, and certified trims.
                </p>
              </div>

              <div className="rounded-xl border border-[#DDE3DD] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAF8] border-b border-[#DDE3DD] text-[11px] font-bold text-slate-600">
                    <tr>
                      <th className="py-3 px-4">Material / Component</th>
                      <th className="py-3 px-4">Sub-Supplier / Mill Name</th>
                      <th className="py-3 px-4">Cluster Location</th>
                      <th className="py-3 px-4">Compliance Tier</th>
                      <th className="py-3 px-4 text-center">Traceability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDE3DD]">
                    {currentPortfolio.subSupplierNetwork.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-[#1F3A2E]">{s.materialType}</td>
                        <td className="py-3 px-4 text-slate-800">{s.supplierName}</td>
                        <td className="py-3 px-4 text-slate-600">{s.locationCluster}</td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                            {s.complianceTier}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {s.traceabilityVerified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Sub-Supplier Form */}
              <form onSubmit={handleAddSubSupplier} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
                <span className="font-bold text-slate-700">+ Add Sub-Supplier:</span>
                <input
                  type="text"
                  placeholder="Material type (e.g. Raw Golden Jute TD-4)"
                  value={newSubSupplier.materialType}
                  onChange={(e) => setNewSubSupplier({ ...newSubSupplier, materialType: e.target.value })}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg flex-1 min-w-[200px]"
                  required
                />
                <input
                  type="text"
                  placeholder="Supplier Name / Mill"
                  value={newSubSupplier.supplierName}
                  onChange={(e) => setNewSubSupplier({ ...newSubSupplier, supplierName: e.target.value })}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg flex-1 min-w-[180px]"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1F3A2E] text-white font-bold hover:bg-[#2C5240] transition cursor-pointer"
                >
                  Add Sourcing Link
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: FINANCIAL, BANKING & B2B SPEND                                     */}
          {/* ========================================================================= */}
          {activeTab === 'FINANCIAL' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold font-heading text-[#1F3A2E]">
                  Pillar 6: Financial Credibility, Banking Channels &amp; Commercial Spend
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Back-to-Back L/C acceptance, NBR tax registrations, payment terms, and lifetime sourcing volume.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Banking Credentials */}
                <div className="p-5 rounded-2xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#DDE3DD] pb-2 text-[#1F3A2E] font-bold font-heading text-sm">
                    <CreditCard className="w-4 h-4 text-[#8A6D3B]" />
                    <span>Official Scheduled Bank Account</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Bank Name:</span>
                      <strong className="text-[#1F3A2E]">{currentPortfolio.financialAndBanking.bankName}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Branch &amp; Location:</span>
                      <strong className="text-slate-800">{currentPortfolio.financialAndBanking.branchName}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Routing Number:</span>
                      <strong className="font-mono text-slate-800">{currentPortfolio.financialAndBanking.routingNumber}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">SWIFT / BIC Code:</span>
                      <strong className="font-mono text-slate-800">{currentPortfolio.financialAndBanking.swiftBic || 'N/A'}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Back-to-Back L/C:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {currentPortfolio.financialAndBanking.backToBackLcAccepted ? 'ACCEPTED (Preferred)' : 'Direct TT Only'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Government Statutory Registrations */}
                <div className="p-5 rounded-2xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#DDE3DD] pb-2 text-[#1F3A2E] font-bold font-heading text-sm">
                    <ShieldCheck className="w-4 h-4 text-[#14512C]" />
                    <span>Statutory Tax &amp; Export Credentials</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">NBR BIN Number:</span>
                      <strong className="font-mono text-slate-800">{currentPortfolio.financialAndBanking.nbrBinNumber}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">e-TIN Number:</span>
                      <strong className="font-mono text-slate-800">{currentPortfolio.financialAndBanking.tinNumber}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">EPB Export Reg:</span>
                      <strong className="font-mono text-slate-800">{currentPortfolio.financialAndBanking.epbRegistrationNo}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Commercial Terms:</span>
                      <span className="font-bold text-slate-800 text-right max-w-[220px]">
                        {currentPortfolio.financialAndBanking.creditTerms}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spend Analysis */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]/40 text-xs">
                <div>
                  <span className="text-slate-600 block">Total Sourcing Spend YTD:</span>
                  <span className="text-xl font-bold font-mono text-[#8A6D3B] mt-0.5 block">
                    ${currentPortfolio.financialAndBanking.totalSpendYtdUsd.toLocaleString()} USD
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ৳{(currentPortfolio.financialAndBanking.totalSpendYtdBdt / 100000).toFixed(1)} Lakh BDT
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 block">Outstanding Payables:</span>
                  <span className="text-xl font-bold font-mono text-[#1F3A2E] mt-0.5 block">
                    ৳{(currentPortfolio.financialAndBanking.outstandingPayablesBdt / 100000).toFixed(2)} Lakh
                  </span>
                  <span className="text-[10px] text-slate-500">Against open FRI inspections</span>
                </div>
                <div>
                  <span className="text-slate-600 block">Payment Punctuality Score:</span>
                  <span className="text-xl font-bold font-mono text-emerald-700 mt-0.5 block">
                    {currentPortfolio.financialAndBanking.paymentPunctualityScorePct}%
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Grade AAA Vendor Partner</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: CONTACT PERSONS & FACTORY / OFFICE LOCATIONS                       */}
          {/* ========================================================================= */}
          {activeTab === 'CONTACTS_LOCATIONS' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold font-heading text-[#1F3A2E]">
                  Pillar 7: Key Management Contacts, Factory Plant &amp; Corporate Locations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct executive contacts, phone numbers, WhatsApp links, and physical facility coordinates.
                </p>
              </div>

              {/* Management Contacts */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold font-heading text-slate-700 uppercase tracking-wider">
                  Key Executive &amp; Operations Contacts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPortfolio.keyManagementContacts.map((contact, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-[#DDE3DD] bg-[#F8FAF8] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-heading text-sm text-[#1F3A2E]">{contact.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300 font-semibold">
                          {contact.designation}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-slate-700 pt-1">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
                          <a href={`tel:${contact.phone}`} className="font-mono hover:text-[#1F3A2E] hover:underline">
                            {contact.phone}
                          </a>
                          <span className="text-emerald-600 font-mono text-[10px] font-bold">(WhatsApp)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
                          <a href={`mailto:${contact.email}`} className="hover:text-[#1F3A2E] hover:underline">
                            {contact.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factory & Office Directory */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold font-heading text-slate-700 uppercase tracking-wider">
                  Physical Manufacturing Plant &amp; Corporate Office Directory
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-[#DDE3DD] bg-white space-y-2">
                    <div className="flex items-center gap-2 text-slate-800 font-bold font-heading">
                      <Factory className="w-4 h-4 text-[#1F3A2E]" />
                      <span>Manufacturing Plant / Factory Complex</span>
                    </div>
                    <p className="text-slate-600">
                      {currentPortfolio.locationProfile?.factoryPlantAddress || currentPortfolio.factoryAddress}
                    </p>
                    <div className="text-[11px] text-slate-500 font-mono pt-1">
                      Cluster: <strong>{currentPortfolio.locationProfile?.industrialCluster || currentPortfolio.clusterRegion}</strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#DDE3DD] bg-white space-y-2">
                    <div className="flex items-center gap-2 text-slate-800 font-bold font-heading">
                      <Building2 className="w-4 h-4 text-[#8A6D3B]" />
                      <span>Corporate Head Office / Studio</span>
                    </div>
                    <p className="text-slate-600">
                      {currentPortfolio.locationProfile?.headOfficeAddress || currentPortfolio.factoryAddress}
                    </p>
                    {currentPortfolio.locationProfile?.showroomAddress && (
                      <p className="text-slate-500 text-[11px] pt-1">
                        <strong>Showroom:</strong> {currentPortfolio.locationProfile.showroomAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: QUALITY SCORECARD                                                  */}
          {/* ========================================================================= */}
          {activeTab === 'SCORECARD' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold font-heading text-[#1F3A2E]">
                  Pillar 8: Comprehensive Quality Scorecard &amp; Delivery Punctuality
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Statistical scorecard based on Final Random Inspection (FRI) pass rates and on-time shipment logs.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-xl bg-[#E4F3E9] border border-[#BBE3C7]">
                  <span className="text-[10px] text-[#14512C] uppercase font-bold block">AQL 1.5/2.5 Pass Rate</span>
                  <span className="text-2xl font-bold font-mono text-[#14512C] mt-1 block">
                    {currentPortfolio.qualityScorecard.aqlPassRatePct}%
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                  <span className="text-[10px] text-slate-600 uppercase font-bold block">On-Time Delivery</span>
                  <span className="text-2xl font-bold font-mono text-[#1F3A2E] mt-1 block">
                    {currentPortfolio.qualityScorecard.onTimeDeliveryRatePct}%
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                  <span className="text-[10px] text-slate-600 uppercase font-bold block">Average Defect Rate</span>
                  <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">
                    {currentPortfolio.qualityScorecard.averageDefectRatePct}%
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                  <span className="text-[10px] text-slate-600 uppercase font-bold block">Sample Approval Turnaround</span>
                  <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">
                    {currentPortfolio.qualityScorecard.sampleApprovalTurnaroundDays}d
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]">
                  <span className="text-[10px] text-[#8A6D3B] uppercase font-bold block">Overall Rating Score</span>
                  <span className="text-2xl font-bold font-mono text-[#8A6D3B] mt-1 block">
                    {currentPortfolio.qualityScorecard.overallRatingScore} / 5.0
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: UPDATE / STORE DATA                                                */}
          {/* ========================================================================= */}
          {activeTab === 'UPDATE_DATA' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold font-heading text-[#1F3A2E]">
                  Store / Update Supplier Living Dossier
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Edit core fields, add operational notes, and persist immediately to enterprise database.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 uppercase text-[10px]">Operational Sourcing Notes</label>
                  <textarea
                    rows={4}
                    value={currentPortfolio.operationalNotes}
                    onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, operationalNotes: e.target.value })}
                    className="w-full p-3 bg-white border border-[#DDE3DD] rounded-xl focus:outline-none focus:border-[#1F3A2E] text-xs"
                    placeholder="Enter operational notes regarding lead times, quality tolerances, holiday shutdowns..."
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = {
                        ...currentPortfolio,
                        lastUpdated: new Date().toISOString().split('T')[0],
                      };
                      setCurrentPortfolio(updated);
                      onSavePortfolio(updated);
                      setSaveSuccessNotice(true);
                      setTimeout(() => setSaveSuccessNotice(false), 3000);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-[#C8A96A]" />
                    <span>Save &amp; Persist Supplier Portfolio</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
