'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { SupplierFactory, ProductSector, VendorEnlistmentDocument, VendorClassification } from '@/types/erp';
import { FactorySupplierPortfolio, SupplierActiveProduct } from '@/types/factoryPortfolio';
import { INITIAL_FACTORY_PORTFOLIOS } from '@/data/initialFactoryPortfolios';
import { INITIAL_FACTORIES } from '@/data/initialFactories';
import { INITIAL_PRODUCTS } from '@/data/initialData';
import { fetchFactoryPortfolios, persistFactoryPortfolios } from '@/lib/erpPersistence';
import { FactorySupplierPortfolioModal } from './FactorySupplierPortfolioModal';
import {
  Factory,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  Sparkles,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Percent,
  X,
  FileCheck2,
  Building,
  ArrowRight,
  FileText,
  Printer,
  FileCheck,
  Building2,
  Download,
  Globe,
  Award,
  FlaskConical,
  Edit,
  Trash2,
  CheckSquare,
  Square,
  Check,
} from 'lucide-react';
import { ArielMC } from '@/lib/brand';
import { VendorEnlistmentModal } from './VendorEnlistmentModal';
import { OfficialVendorProfilePdfModal } from './OfficialVendorProfilePdfModal';
import { FactoryRatingModelModal } from './FactoryRatingModelModal';
import { QualityChemicalComplianceTracker } from './QualityChemicalComplianceTracker';
import { EditSupplierModal } from './EditSupplierModal';

interface FactoryManagementProps {
  factories?: SupplierFactory[];
  onAddFactory: (newFactory: SupplierFactory) => void;
  onUpdateFactory?: (updated: SupplierFactory) => void;
  onDeleteFactory?: (factoryId: string) => void;
}

export const FactoryManagement: React.FC<FactoryManagementProps> = ({
  factories: propFactories,
  onAddFactory,
  onUpdateFactory,
  onDeleteFactory,
}) => {
  const initialList = (propFactories && propFactories.length > 0) ? propFactories : INITIAL_FACTORIES;
  const [localFactories, setLocalFactories] = useState<SupplierFactory[]>(initialList);

  useEffect(() => {
    if (propFactories && propFactories.length > 0) {
      setLocalFactories(propFactories);
    }
  }, [propFactories]);

  const [selectedFactoryIds, setSelectedFactoryIds] = useState<string[]>([]);
  const [editingFactory, setEditingFactory] = useState<SupplierFactory | null>(null);

  const toggleSelectFactory = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedFactoryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const filteredIds = filteredFactories.map((f) => f.id);
    const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedFactoryIds.includes(id));
    if (allSelected) {
      setSelectedFactoryIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedFactoryIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleDeleteFactory = (facId: string, facName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm(`Are you sure you want to delete supplier "${facName}"? This will remove this profile from the ERP.`)) {
      setLocalFactories((prev) => prev.filter((f) => f.id !== facId));
      setSelectedFactoryIds((prev) => prev.filter((id) => id !== facId));
      if (selectedFactory?.id === facId) setSelectedFactory(null);
      if (selectedPortfolioFactory?.id === facId) setSelectedPortfolioFactory(null);
      onDeleteFactory?.(facId);
    }
  };

  const handleBatchDelete = () => {
    if (selectedFactoryIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedFactoryIds.length} selected supplier(s)?`)) {
      const idsToDelete = new Set(selectedFactoryIds);
      setLocalFactories((prev) => prev.filter((f) => !idsToDelete.has(f.id)));
      selectedFactoryIds.forEach((id) => onDeleteFactory?.(id));
      setSelectedFactoryIds([]);
      if (selectedFactory && idsToDelete.has(selectedFactory.id)) setSelectedFactory(null);
      if (selectedPortfolioFactory && idsToDelete.has(selectedPortfolioFactory.id)) setSelectedPortfolioFactory(null);
    }
  };

  const handleSaveEditedFactory = (updated: SupplierFactory) => {
    setLocalFactories((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    onUpdateFactory?.(updated);
    if (selectedFactory?.id === updated.id) {
      setSelectedFactory(updated);
    }
    setEditingFactory(null);
  };

  const factories = localFactories;
  const [selectedSector, setSelectedSector] = useState<ProductSector | 'ALL'>('ALL');
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [selectedVendorType, setSelectedVendorType] = useState<VendorClassification | 'ALL'>('ALL');
  const [factoryTierCategory, setFactoryTierCategory] = useState<'ALL' | 'ARTISAN' | 'INDUSTRIAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFactory, setSelectedFactory] = useState<SupplierFactory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingPdfFactory, setViewingPdfFactory] = useState<SupplierFactory | null>(null);
  const [isRatingModelOpen, setIsRatingModelOpen] = useState(false);
  const [ratingModelFactory, setRatingModelFactory] = useState<SupplierFactory | null>(null);
  const [factoryViewMode, setFactoryViewMode] = useState<'FACILITIES' | 'CHEMICAL_COMPLIANCE'>('FACILITIES');
  const [viewFormat, setViewFormat] = useState<'CARDS' | 'TABLE'>('CARDS');

  // Factory & Supplier Portfolio States & Persistence
  const [factoryPortfolios, setFactoryPortfolios] = useState<FactorySupplierPortfolio[]>(INITIAL_FACTORY_PORTFOLIOS);
  const [selectedPortfolioFactory, setSelectedPortfolioFactory] = useState<FactorySupplierPortfolio | null>(null);

  useEffect(() => {
    fetchFactoryPortfolios().then((persisted) => {
      if (persisted && persisted.length > 0) {
        // Merge with INITIAL_FACTORY_PORTFOLIOS so newly added factories (e.g. Bangla Eco) are never lost
        const merged = [...INITIAL_FACTORY_PORTFOLIOS];
        persisted.forEach((p) => {
          const idx = merged.findIndex((m) => m.id === p.id || m.factoryCode === p.factoryCode);
          if (idx >= 0) {
            if ((!p.activeProducts || p.activeProducts.length === 0) && merged[idx].activeProducts && merged[idx].activeProducts.length > 0) {
              merged[idx] = { ...p, activeProducts: merged[idx].activeProducts };
            } else {
              merged[idx] = p;
            }
          } else {
            merged.push(p);
          }
        });
        setFactoryPortfolios(merged);
      }
    });
  }, []);

  const handleSaveFactoryPortfolio = (updated: FactorySupplierPortfolio) => {
    setFactoryPortfolios((prev) => {
      const idx = prev.findIndex((f) => f.id === updated.id || f.factoryCode === updated.factoryCode);
      let next: FactorySupplierPortfolio[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = updated;
      } else {
        next = [updated, ...prev];
      }
      persistFactoryPortfolios(next);
      return next;
    });
    setSelectedPortfolioFactory(updated);
  };

  const getPortfolioForFactory = (fac: SupplierFactory): FactorySupplierPortfolio => {
    const initialMatch = INITIAL_FACTORY_PORTFOLIOS.find(
      (p) => p.id === fac.id || p.factoryCode === fac.code || p.factoryName?.toLowerCase() === fac.name?.toLowerCase()
    );
    const found = factoryPortfolios.find(
      (p) => p.id === fac.id || p.factoryCode === fac.code || p.factoryName?.toLowerCase() === fac.name?.toLowerCase()
    );

    // Auto-relational product discovery from Catalog Products
    const dynamicallyMatchedSkus: SupplierActiveProduct[] = INITIAL_PRODUCTS.filter((prod) => {
      const pFac = prod.partnerFactory;
      if (!pFac) return false;
      if (pFac.factoryId && (pFac.factoryId === fac.id || pFac.factoryId === fac.code)) return true;
      if (pFac.factoryCode && pFac.factoryCode === fac.code) return true;
      if (pFac.factoryName && fac.name) {
        const fn1 = pFac.factoryName.toLowerCase().trim();
        const fn2 = fac.name.toLowerCase().trim();
        if (fn1 === fn2) return true;
        const stopWords = new Set(['craft', 'crafts', 'ltd', 'limited', 'handicrafts', 'handicraft', 'handcrafted', 'industries', 'mill', 'mills', 'co-operative', 'bd', 'bangladesh', 'artisan', 'artisans', 'studio', 'goods', 'fabrics']);
        const words1 = fn1.split(/[\s,.-]+/).filter((w) => w.length > 3 && !stopWords.has(w));
        const words2 = fn2.split(/[\s,.-]+/).filter((w) => w.length > 3 && !stopWords.has(w));
        if (words1.length > 0 && words2.length > 0) {
          if (words1.some((w) => words2.includes(w))) return true;
        }
      }
      return false;
    }).map((p, idx) => {
      const purchaseBdt = p.costing.factoryCostBdt || Math.round((p.costing.factoryCostUsd || 0) * 120);
      const purchaseUsd = p.costing.factoryCostUsd || (purchaseBdt / 120);
      const fobUsd = p.costing.b2bFobPriceUsd || (purchaseUsd * 1.45);
      const marginUsd = fobUsd - purchaseUsd;
      const marginPct = fobUsd > 0 ? (marginUsd / fobUsd) * 100 : 35;
      return {
        id: `act-dyn-${p.id || p.sku}`,
        sku: p.sku,
        productName: p.name,
        category: p.category || (p.sector === 'LEATHER' ? 'Everyday Carry & SLGs' : 'Jute Home Decor'),
        divisionTitle: p.sector === 'LEATHER' ? '01 The Leather Compendium' : p.sector === 'JUTE' ? '02 The Golden Fiber Edit' : '05 Fine Ceramics',
        imageUrl: p.images && p.images.length > 0 ? p.images[0] : '/images/products/jute/rugs/mandala-jute-rug-natural.jpg',
        specifications: p.description || `${p.dimensions || ''} - Export grade`,
        factoryPurchasePriceBdt: purchaseBdt,
        factoryPurchasePriceUsd: purchaseUsd,
        publishedExportFobUsd: fobUsd,
        marginUsd: Number(marginUsd.toFixed(2)),
        marginPct: Number(marginPct.toFixed(1)),
        totalUnitsProduced: (idx + 1) * 850,
        totalSpendBdt: (idx + 1) * 850 * purchaseBdt,
        totalSpendUsd: Number(((idx + 1) * 850 * purchaseUsd).toFixed(0)),
        firstBatchDate: '2026-02-15',
        lastBatchDate: '2026-10-30',
        activePoNumber: `PO-AMC-2026-${String(40 + idx).padStart(3, '0')}`,
        pipelineUnits: 300,
        pipelineStatus: 'IN_CUTTING',
        targetDispatchDate: '2026-11-28',
      };
    });

    if (found) {
      let activeProducts = (found.activeProducts && found.activeProducts.length > 0)
        ? found.activeProducts
        : (initialMatch?.activeProducts && initialMatch.activeProducts.length > 0)
          ? initialMatch.activeProducts
          : dynamicallyMatchedSkus;

      // Merge dynamic SKUs if not already in activeProducts
      if (dynamicallyMatchedSkus.length > 0) {
        const existingSkus = new Set(activeProducts.map((p) => p.sku));
        const missingSkus = dynamicallyMatchedSkus.filter((p) => !existingSkus.has(p.sku));
        if (missingSkus.length > 0) {
          activeProducts = [...activeProducts, ...missingSkus];
        }
      }

      const potentialProducts = (found.potentialProducts && found.potentialProducts.length > 0)
        ? found.potentialProducts
        : (initialMatch?.potentialProducts || []);
      return {
        ...found,
        activeProducts,
        potentialProducts,
        locationProfile: found.locationProfile || initialMatch?.locationProfile || {
          factoryPlantAddress: fac.factoryAddress,
          headOfficeAddress: fac.factoryAddress,
          industrialCluster: fac.cluster,
          totalFloorAreaSqFt: 45000,
        },
      };
    }

    if (initialMatch) {
      let activeProducts = (initialMatch.activeProducts && initialMatch.activeProducts.length > 0)
        ? initialMatch.activeProducts
        : dynamicallyMatchedSkus;
      if (dynamicallyMatchedSkus.length > 0) {
        const existingSkus = new Set(activeProducts.map((p) => p.sku));
        const missingSkus = dynamicallyMatchedSkus.filter((p) => !existingSkus.has(p.sku));
        if (missingSkus.length > 0) {
          activeProducts = [...activeProducts, ...missingSkus];
        }
      }
      return {
        ...initialMatch,
        activeProducts,
      };
    }

    return {
      id: fac.id,
      factoryCode: fac.code,
      factoryName: fac.name,
      vendorClassification: fac.vendorType || (fac.code?.includes('SUP') ? 'SUPPLIER' : 'FULL_FLEDGED_FACTORY'),
      sectors: fac.sectors,
      clusterRegion: fac.cluster,
      factoryAddress: fac.factoryAddress,
      establishedYear: 2010,
      tier: fac.tier,
      lastUpdated: new Date().toISOString().split('T')[0],
      activeProducts: dynamicallyMatchedSkus,
      potentialProducts: [],
      locationProfile: {
        factoryPlantAddress: fac.factoryAddress,
        headOfficeAddress: fac.factoryAddress,
        industrialCluster: fac.cluster,
        totalFloorAreaSqFt: 45000,
      },
      keyManagementContacts: [
        {
          name: fac.contactPerson,
          designation: fac.designation,
          phone: fac.phone,
          email: fac.email,
        },
      ],
      digitalChannels: {
        website: fac.website,
        facebook: fac.facebookUrl,
        linkedIn: fac.linkedInUrl,
      },
      capacityAndMachinery: {
        monthlyCapacityUnits: fac.capacity.monthlyCapacityUnits,
        allocatedCapacityUnits: fac.capacity.allocatedUnits,
        arielMcReservedCapacityUnits: Math.round(fac.capacity.monthlyCapacityUnits * 0.35),
        utilizationRatePct: Math.round((fac.capacity.allocatedUnits / (fac.capacity.monthlyCapacityUnits || 1)) * 100),
        activeLinesCount: fac.capacity.activeLines,
        totalWorkforce: 450,
        shiftStructure: 'Single Shift',
        machinery: fac.capacity.machineryList.map((m) => ({
          machineName: m,
          originCountry: 'Germany / Japan',
          quantity: 8,
          purpose: 'Precision manufacturing line equipment',
        })),
      },
      complianceAudits: fac.complianceAudits.map((a) => ({
        id: a.id,
        standardName: a.standardName,
        status: a.status as any,
        ratingGrade: a.ratingGrade,
        auditBody: a.auditBody,
        auditDate: '2025-05-10',
        validUntil: a.validUntil,
        reportNumber: a.reportNumber,
      })),
      subSupplierNetwork: [
        {
          id: `sub-${fac.id}-1`,
          materialType: fac.sectors.includes('LEATHER') ? 'Raw Full-Grain Wet-Blue Leather' : 'Certified Organic Cotton Yarn',
          supplierName: 'Savar Relocated Tannery Estate Unit',
          locationCluster: 'Savar, Dhaka',
          complianceTier: 'Certified Tier 1',
          traceabilityVerified: true,
        },
      ],
      financialAndBanking: {
        bankName: fac.bankDetails?.bankName || 'Eastern Bank PLC',
        branchName: fac.bankDetails?.branch || 'Corporate Branch',
        routingNumber: fac.bankDetails?.routingNumber || '090264182',
        backToBackLcAccepted: true,
        preferredLcTenorDays: 90,
        nbrBinNumber: fac.binNumber || '001892837-0101',
        tinNumber: fac.tinNumber || '8492817291',
        epbRegistrationNo: fac.epbRegistrationNo || 'EPB-REG-0941',
        totalSpendYtdBdt: 36000000,
        totalSpendYtdUsd: 300000,
        outstandingPayablesBdt: 4500000,
        creditTerms: fac.paymentTerms || '30% Advance, 70% Upon FRI Inspection Pass',
        paymentPunctualityScorePct: 98.8,
      },
      qualityScorecard: {
        aqlPassRatePct: fac.scorecard.aqlPassRatePct,
        onTimeDeliveryRatePct: fac.scorecard.onTimeDeliveryPct,
        averageDefectRatePct: 0.9,
        sampleApprovalTurnaroundDays: 4.5,
        overallRatingScore: fac.scorecard.ratingScore,
      },
      operationalNotes: `Strategic vendor partner in ${fac.cluster}. Maintains reliable production lead time of ${fac.leadTimeDays} days.`,
    };
  };

  const isArtisanVendor = (fac: SupplierFactory): boolean => {
    const artisanCodes = ['FAC-BEN-01', 'FAC-DHM-01', 'FAC-DHK-04', 'FAC-DHK-05', 'FAC-DHM-02', 'FAC-PAT-01'];
    if (artisanCodes.includes(fac.code)) return true;
    if (fac.code === 'FAC-GAZ-02' && fac.sectors.includes('JUTE')) return true;
    return fac.vendorType === 'FACTORY_CUM_SUPPLIER' || fac.vendorType === 'SUPPLIER';
  };

  const artisanCount = useMemo(() => factories.filter(isArtisanVendor).length, [factories]);
  const industrialCount = useMemo(() => factories.filter((f) => !isArtisanVendor(f)).length, [factories]);

  // Filter factories
  const filteredFactories = useMemo(() => {
    return factories.filter((fac) => {
      const matchesSector = selectedSector === 'ALL' || fac.sectors.includes(selectedSector);
      const matchesCluster = selectedCluster === 'ALL' || fac.cluster.toLowerCase().includes(selectedCluster.toLowerCase());
      const currentVendorType: VendorClassification = fac.vendorType || (fac.code?.includes('SUP') ? 'SUPPLIER' : 'FULL_FLEDGED_FACTORY');
      const matchesVendorType =
        selectedVendorType === 'ALL' ||
        currentVendorType === selectedVendorType ||
        (selectedVendorType === 'SUPPLIER' && (currentVendorType === 'SUPPLIER' || currentVendorType === 'FACTORY_CUM_SUPPLIER'));
      const matchesTierCategory =
        factoryTierCategory === 'ALL' ||
        (factoryTierCategory === 'ARTISAN' && isArtisanVendor(fac)) ||
        (factoryTierCategory === 'INDUSTRIAL' && !isArtisanVendor(fac));
      const matchesSearch =
        searchQuery === '' ||
        fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.cluster.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.capacity.machineryList.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSector && matchesCluster && matchesVendorType && matchesTierCategory && matchesSearch;
    });
  }, [factories, selectedSector, selectedCluster, selectedVendorType, factoryTierCategory, searchQuery]);

  // Aggregate stats
  const totalCapacity = factories.reduce((acc, f) => acc + f.capacity.monthlyCapacityUnits, 0);
  const totalAllocated = factories.reduce((acc, f) => acc + f.capacity.allocatedUnits, 0);
  const avgUtilization = ((totalAllocated / (totalCapacity || 1)) * 100).toFixed(1);
  const avgAqlRate = (factories.reduce((acc, f) => acc + f.scorecard.aqlPassRatePct, 0) / (factories.length || 1)).toFixed(1);

  // Upcoming audit expiries (within 60 days)
  const expiringAudits = useMemo(() => {
    const list: { factory: SupplierFactory; auditName: string; validUntil: string; daysLeft: number }[] = [];
    const today = new Date('2026-10-16');

    factories.forEach((fac) => {
      fac.complianceAudits.forEach((aud) => {
        const auditDate = new Date(aud.validUntil);
        const diffTime = auditDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 60) {
          list.push({
            factory: fac,
            auditName: aud.standardName,
            validUntil: aud.validUntil,
            daysLeft: diffDays,
          });
        }
      });
    });
    return list.sort((a, b) => a.daysLeft - b.daysLeft);
  }, [factories]);

  // Helper to ensure all 7 statutory documents are present and displayed
  const getFactoryDocuments = (fac: SupplierFactory): VendorEnlistmentDocument[] => {
    if (fac.enlistmentDocuments && fac.enlistmentDocuments.length > 0) {
      return fac.enlistmentDocuments;
    }
    return [
      {
        id: `doc_tl_${fac.id}`,
        docType: 'TRADE_LICENSE',
        title: 'Trade Licence (TIN/ETIN) Copy with Renewal',
        fileName: `Trade_License_${fac.code}_2026_Renewal.pdf`,
        fileSize: '2.4 MB',
        uploadedAt: '2026-09-15',
        validUntil: '2027-06-30',
        status: 'VERIFIED',
        documentNumber: fac.tradeLicenseNo || 'TRAD/SAV/004819/2026',
        issuingAuthority: 'City Corporation / Union Parishad',
        mandatory: true,
      },
      {
        id: `doc_inc_${fac.id}`,
        docType: 'CERTIFICATE_OF_INCORPORATION',
        title: 'Certificates of Incorporation (If LTD)',
        fileName: `RJSC_Incorporation_Cert_${fac.code}.pdf`,
        fileSize: '1.8 MB',
        uploadedAt: '2026-09-15',
        status: 'VERIFIED',
        documentNumber: `C-184918/${fac.code}`,
        issuingAuthority: 'RJSC Bangladesh',
        mandatory: true,
      },
      {
        id: `doc_nid_${fac.id}`,
        docType: 'NID_CERTIFICATE',
        title: 'NID Certificate (Managing Director / Signatory)',
        fileName: `MD_National_ID_${fac.code}.pdf`,
        fileSize: '1.1 MB',
        uploadedAt: '2026-09-15',
        status: 'VERIFIED',
        documentNumber: '8291 0491 8841',
        issuingAuthority: 'Bangladesh Election Commission',
        mandatory: true,
      },
      {
        id: `doc_bin_${fac.id}`,
        docType: 'BIN_CERTIFICATE',
        title: 'BIN Certificate (13-Digit Customs BIN)',
        fileName: `NBR_13_Digit_BIN_Mushak_${fac.code}.pdf`,
        fileSize: '1.5 MB',
        uploadedAt: '2026-09-15',
        status: 'VERIFIED',
        documentNumber: fac.binNumber || '001892837-0101',
        issuingAuthority: 'National Board of Revenue (NBR)',
        mandatory: true,
      },
      {
        id: `doc_bs_${fac.id}`,
        docType: 'BANK_SOLVENCY',
        title: 'Bank Solvency Statements',
        fileName: `Bank_Solvency_Cert_ScheduledBank_${fac.code}.pdf`,
        fileSize: '1.9 MB',
        uploadedAt: '2026-09-20',
        status: 'VERIFIED',
        documentNumber: `SOLV-${fac.code}-2026`,
        issuingAuthority: fac.bankDetails.bankName,
        mandatory: true,
      },
      {
        id: `doc_bd_${fac.id}`,
        docType: 'BANK_DETAIL',
        title: 'Bank Detail (Official Account Credentials & AD Branch)',
        fileName: `Bank_Account_Confirmation_Letter_${fac.code}.pdf`,
        fileSize: '1.3 MB',
        uploadedAt: '2026-09-20',
        status: 'VERIFIED',
        documentNumber: `AC-${fac.bankDetails.routingNumber}-01`,
        issuingAuthority: fac.bankDetails.bankName,
        mandatory: true,
      },
      {
        id: `doc_chq_${fac.id}`,
        docType: 'CHEQUE_SCAN',
        title: 'Scan Copy of Cheque (Voided Leaf for MICR)',
        fileName: `Voided_MICR_Cheque_Leaf_${fac.code}.pdf`,
        fileSize: '0.9 MB',
        uploadedAt: '2026-09-20',
        status: 'VERIFIED',
        documentNumber: 'CHQ-8920194',
        issuingAuthority: fac.bankDetails.bankName,
        mandatory: true,
      },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Strip */}
      <div className="rounded-2xl bg-white border border-[#DDE3DD] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF5EC] text-[#8A6D3B] border border-[#C8A96A] font-bold">
                PHASE 2: SOURCING ECOSYSTEM
              </span>
              <span className="text-xs text-[#6B7269]">Bangladesh Manufacturing Hubs</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-[#1F3A2E] mt-1 flex items-center gap-2.5">
              <span>Verified Bangladesh Suppliers &amp; Factory Directory</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] font-bold">
                {factories.length} Verified Partners
              </span>
            </h1>
            <p className="text-xs text-[#6B7269] mt-1 max-w-2xl leading-relaxed">
              Industrial cluster tracking across Savar, Gazipur, Narsingdi, Dhamrai &amp; Faridpur. Comprehensive directory of verified suppliers, manufacturing factories, artisan workshops (including Beni Boonon), and compliance audits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="view-rating-model-btn"
              onClick={() => {
                setRatingModelFactory(null);
                setIsRatingModelOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F2C59] text-xs font-bold font-heading shadow-sm transition-all border border-[#0F2C59]/30 hover:border-[#E87722] active:scale-[0.98]"
              title="View Standardized Global B2B Supply Chain Evaluation Matrix (A4 Vector PDF)"
            >
              <Award className="w-4 h-4 text-[#E87722]" />
              <span>Factory Rating Model (B2B Matrix)</span>
            </button>

            <button
              id="register-factory-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] border-b-2 border-[#C8A96A]"
            >
              <FileCheck2 className="w-4 h-4 text-[#C8A96A]" />
              <span>Enlist Vendor (B2B Profile &amp; Docs)</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#DDE3DD]">
          <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
            <span className="text-[11px] text-[#6B7269] block font-medium">Total Monthly Capacity</span>
            <span className="text-xl font-bold font-mono text-[#1F3A2E] mt-0.5 block">
              {(totalCapacity / 1000).toFixed(0)}k <span className="text-xs text-[#6B7269] font-sans font-normal">Units/mo</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
            <span className="text-[11px] text-[#6B7269] block font-medium">Capacity Utilization</span>
            <span className="text-xl font-bold font-mono text-[#8A6D3B] mt-0.5 block">
              {avgUtilization}%
            </span>
            <span className="text-[10px] text-[#6B7269]">{(100 - Number(avgUtilization)).toFixed(0)}% available for new orders</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
            <span className="text-[11px] text-[#6B7269] block font-medium">Average AQL Pass Rate</span>
            <span className="text-xl font-bold font-mono text-[#14512C] mt-0.5 block">
              {avgAqlRate}%
            </span>
            <span className="text-[10px] text-[#6B7269]">AQL 1.5/2.5 export standard</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
            <span className="text-[11px] text-[#6B7269] block font-medium">Expiring Audits (60 Days)</span>
            <span className="text-xl font-bold font-mono text-[#8A1515] mt-0.5 block flex items-center gap-1.5">
              <span>{expiringAudits.length} Audits</span>
              <AlertTriangle className="w-4 h-4 text-[#8A1515] inline" />
            </span>
            <span className="text-[10px] text-[#6B7269]">Scheduled for renewal</span>
          </div>
        </div>
      </div>

      {/* View Switcher: Facilities vs Quality & Chemical Compliance (Clean Wrap - No Horizontal Scroll) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DDE3DD] pb-2 text-xs font-['Montserrat']">
        <button
          onClick={() => setFactoryViewMode('FACILITIES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer shrink-0 ${
            factoryViewMode === 'FACILITIES'
              ? 'bg-[#1F3A2E] text-white shadow-sm'
              : 'text-[#4A5568] hover:text-[#1F3A2E] hover:bg-white'
          }`}
        >
          <Building2 className={`w-4 h-4 ${factoryViewMode === 'FACILITIES' ? 'text-[#C8A96A]' : 'text-gray-500'}`} />
          <span>Partner Facilities &amp; Factory Directory</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-mono text-[9px]">
            {factories.length} Facilities
          </span>
        </button>

        <button
          onClick={() => setFactoryViewMode('CHEMICAL_COMPLIANCE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer shrink-0 ${
            factoryViewMode === 'CHEMICAL_COMPLIANCE'
              ? 'bg-[#1F3A2E] text-white shadow-sm'
              : 'text-[#4A5568] hover:text-[#1F3A2E] hover:bg-white'
          }`}
        >
          <FlaskConical className={`w-4 h-4 ${factoryViewMode === 'CHEMICAL_COMPLIANCE' ? 'text-[#C8A96A]' : 'text-gray-500'}`} />
          <span>Quality &amp; Tannery Chemical Compliance Tracker</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#C8A96A] text-[#1F3A2E] font-mono text-[9px] font-bold">
            REACH / Crocking
          </span>
        </button>
      </div>

      {factoryViewMode === 'CHEMICAL_COMPLIANCE' ? (
        <QualityChemicalComplianceTracker />
      ) : (
        <>
          {/* Proactive Compliance Expiry Alert Banner */}
      {expiringAudits.length > 0 && (
        <div className="p-4 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-xs space-y-2">
          <div className="flex items-center gap-2 text-[#8A1515] font-semibold">
            <AlertTriangle className="w-4 h-4 text-[#8A1515] shrink-0" />
            <span>Compliance Alert: {expiringAudits.length} International Audits Require Scheduled Re-Inspection</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
            {expiringAudits.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-white border border-[#F8B4B4] text-[11px] flex items-center justify-between shadow-xs"
              >
                <div>
                  <div className="font-semibold text-[#1A1A1A] truncate max-w-[170px]">{item.factory.name}</div>
                  <div className="text-[#6B7269] text-[10px]">{item.auditName}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#FDEAEA] text-[#8A1515] font-mono text-[10px] font-bold border border-[#F7C0C0]">
                  {item.daysLeft}d left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Classification Quick Toggles: Industrial vs Artisan Clusters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl bg-white border border-[#DDE3DD] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#1F3A2E] font-heading uppercase tracking-wider px-2">
            Supplier Classification:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFactoryTierCategory('ALL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                factoryTierCategory === 'ALL'
                  ? 'bg-[#1F3A2E] text-white shadow-xs'
                  : 'bg-[#F4F6F4] text-[#4A5568] hover:text-[#1F3A2E] hover:bg-slate-200'
              }`}
            >
              <span>All Partners</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${factoryTierCategory === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {factories.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFactoryTierCategory('ARTISAN')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                factoryTierCategory === 'ARTISAN'
                  ? 'bg-[#14512C] text-white border-[#14512C] shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span>🌿</span>
              <span>Artisan Clusters &amp; Workshops</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${factoryTierCategory === 'ARTISAN' ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-900'}`}>
                {artisanCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFactoryTierCategory('INDUSTRIAL')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                factoryTierCategory === 'INDUSTRIAL'
                  ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span>🏭</span>
              <span>Industrial Composite Plants</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${factoryTierCategory === 'INDUSTRIAL' ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'}`}>
                {industrialCount}
              </span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-medium px-2">
          {factoryTierCategory === 'ALL' && 'Showing all 13 verified Bangladesh manufacturing facilities'}
          {factoryTierCategory === 'ARTISAN' && 'Handcrafted jute, living wage terracotta studios & co-ops'}
          {factoryTierCategory === 'INDUSTRIAL' && 'LWG tanneries, composite textile mills & bone china plants'}
        </div>
      </div>

      {/* Filter Tabs by Sector & Cluster */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DDE3DD] pb-4">
        {/* Sector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedSector('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedSector === 'ALL'
                ? 'bg-[#1F3A2E] text-white shadow-sm'
                : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border border-[#DDE3DD]'
            }`}
          >
            All Factories ({factories.length})
          </button>
          {(['LEATHER', 'JUTE', 'TEXTILE', 'CERAMICS', 'POTTERY'] as ProductSector[]).map((sec) => {
            const count = factories.filter((f) => f.sectors.includes(sec)).length;
            const isSelected = selectedSector === sec;
            const icon = sec === 'LEATHER' ? '💼' : sec === 'JUTE' ? '🛍️' : sec === 'TEXTILE' ? '🧵' : sec === 'CERAMICS' ? '🍽️' : '🏺';

            return (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-sm'
                    : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border-[#DDE3DD]'
                }`}
              >
                <span>{icon}</span>
                <span>{sec}</span>
                <span className={`text-[10px] font-mono px-1.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F0F4F1] text-[#1A1A1A]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cluster Filter, Vendor Type & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7269]" />
            <input
              type="text"
              placeholder="Search vendors, products, machinery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-white border border-[#DDE3DD] text-xs text-[#1A1A1A] rounded-lg focus:outline-none focus:border-[#1F3A2E] w-52 shadow-sm"
            />
          </div>

          <select
            value={selectedVendorType}
            onChange={(e) => setSelectedVendorType(e.target.value as any)}
            className="bg-white border border-[#DDE3DD] text-xs text-[#1A1A1A] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#1F3A2E] shadow-sm font-semibold"
          >
            <option value="ALL">All Vendor Types (Suppliers &amp; Factories)</option>
            <option value="SUPPLIER">🏢 Suppliers &amp; Cum-Suppliers</option>
            <option value="FACTORY_CUM_SUPPLIER">🌿 Factory-cum-Suppliers (Artisan &amp; Workshop)</option>
            <option value="FULL_FLEDGED_FACTORY">🏭 Full-Fledged Factories (Own Raw Materials)</option>
            <option value="FACTORY">🏗️ Open-Market Factories</option>
          </select>

          {/* Cards vs Table View Toggle */}
          <div className="flex items-center gap-1 bg-[#F4F6F4] p-1 rounded-lg border border-[#DDE3DD]">
            <button
              type="button"
              onClick={() => setViewFormat('CARDS')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewFormat === 'CARDS'
                  ? 'bg-[#1F3A2E] text-white shadow-xs'
                  : 'text-[#6B7269] hover:text-[#1A1A1A]'
              }`}
              title="Card Grid View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewFormat('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewFormat === 'TABLE'
                  ? 'bg-[#1F3A2E] text-white shadow-xs'
                  : 'text-[#6B7269] hover:text-[#1A1A1A]'
              }`}
              title="Supplier List Directory Table"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Supplier List Table</span>
            </button>
          </div>

          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            className="bg-white border border-[#DDE3DD] text-xs text-[#1A1A1A] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#1F3A2E] shadow-sm"
          >
            <option value="ALL">All Industrial Clusters</option>
            <option value="Savar">Savar Tannery Park</option>
            <option value="Narsingdi">Narsingdi Jute Mills</option>
            <option value="Gazipur">Gazipur Textile & Ceramic Park</option>
            <option value="Dhamrai">Dhamrai Pottery Belt</option>
          </select>
        </div>
      </div>

      {/* Selection & Batch Action Toolbar (Select / Edit / Delete) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#DDE3DD] bg-white hover:bg-slate-50 font-semibold text-[#1F3A2E] cursor-pointer shadow-2xs"
          >
            {selectedFactoryIds.length > 0 && filteredFactories.length > 0 && filteredFactories.every(f => selectedFactoryIds.includes(f.id)) ? (
              <CheckSquare className="w-4 h-4 text-[#1F3A2E]" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>Select All ({filteredFactories.length})</span>
          </button>

          {selectedFactoryIds.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#1F3A2E] text-white font-mono font-bold text-[11px]">
              {selectedFactoryIds.length} Selected
            </span>
          )}
        </div>

        {selectedFactoryIds.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBatchDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedFactoryIds.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFactoryIds([])}
              className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-xs cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        )}
      </div>

      {/* Supplier & Factory Directory: Table View */}
      {viewFormat === 'TABLE' ? (
        <div className="rounded-2xl bg-white border border-[#DDE3DD] shadow-sm overflow-hidden text-[#1A1A1A]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF8] border-b border-[#DDE3DD] text-[11px] font-bold text-[#1F3A2E] font-heading uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">
                    <button type="button" onClick={toggleSelectAll} className="cursor-pointer text-[#1F3A2E]">
                      {selectedFactoryIds.length > 0 && filteredFactories.length > 0 && filteredFactories.every(f => selectedFactoryIds.includes(f.id)) ? (
                        <CheckSquare className="w-4 h-4 text-[#1F3A2E]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Supplier / Factory</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Sectors &amp; Cluster</th>
                  <th className="py-3 px-4">Key Contact Person</th>
                  <th className="py-3 px-4">Phone &amp; Email</th>
                  <th className="py-3 px-4">Monthly Capacity</th>
                  <th className="py-3 px-4">AQL Pass</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD]">
                {filteredFactories.map((fac) => {
                  const vType: VendorClassification = fac.vendorType || (fac.code?.includes('SUP') ? 'SUPPLIER' : 'FULL_FLEDGED_FACTORY');
                  return (
                    <tr key={fac.id} className={`hover:bg-[#F9FAF9] transition-colors ${selectedFactoryIds.includes(fac.id) ? 'bg-[#F0F5F2]' : ''}`}>
                      <td className="py-3 px-3 text-center">
                        <button type="button" onClick={(e) => toggleSelectFactory(fac.id, e)} className="cursor-pointer text-[#1F3A2E]">
                          {selectedFactoryIds.includes(fac.id) ? (
                            <CheckSquare className="w-4 h-4 text-[#1F3A2E]" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1F3A2E] text-xs font-heading">{fac.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#FAF5EC] text-[#8A6D3B] font-semibold border border-[#C8A96A]/40">
                            {fac.code}
                          </span>
                          <span className="text-[10px] font-mono text-[#14512C] font-semibold">
                            {fac.tier.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {vType === 'FULL_FLEDGED_FACTORY' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-amber-50 text-amber-900 border-amber-300">
                            🏭 Full-Fledged
                          </span>
                        )}
                        {vType === 'FACTORY' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-800 border-emerald-200">
                            🏗️ Factory
                          </span>
                        )}
                        {vType === 'SUPPLIER' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-blue-50 text-blue-700 border-blue-200">
                            🏢 Supplier
                          </span>
                        )}
                        {vType === 'FACTORY_CUM_SUPPLIER' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-purple-50 text-purple-800 border-purple-300">
                            🌿 Factory-cum-Supplier
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-700">{fac.sectors.join(', ')}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#8A6D3B]" />
                          <span>{fac.cluster}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#1A1A1A]">{fac.contactPerson}</div>
                        <div className="text-[10px] text-slate-500">{fac.designation}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="text-slate-800">{fac.phone}</div>
                        <div className="text-[10px] text-slate-500">{fac.email}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-[#1F3A2E]">
                          {(fac.capacity.monthlyCapacityUnits / 1000).toFixed(0)}k <span className="text-[10px] font-normal text-slate-500">units</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {((fac.capacity.allocatedUnits / fac.capacity.monthlyCapacityUnits) * 100).toFixed(0)}% allocated
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#14512C]">
                        {fac.scorecard.aqlPassRatePct}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedPortfolioFactory(getPortfolioForFactory(fac))}
                            className="px-2.5 py-1 rounded bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-[11px] font-semibold transition cursor-pointer shadow-xs"
                            title="Open Strategic Supplier & Factory Living Portfolio"
                          >
                            Living Portfolio
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingFactory(fac)}
                            className="p-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs transition cursor-pointer border border-amber-300"
                            title="Edit Supplier Profile"
                          >
                            <Edit className="w-3.5 h-3.5 text-amber-700" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteFactory(fac.id, fac.name, e)}
                            className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-700 text-xs transition cursor-pointer border border-red-200"
                            title="Delete Supplier Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewingPdfFactory(fac)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition cursor-pointer"
                            title="View Official Vendor Profile PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Factory Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFactories.map((fac) => {
          const utilPct = ((fac.capacity.allocatedUnits / fac.capacity.monthlyCapacityUnits) * 100).toFixed(0);
          const vType: VendorClassification = fac.vendorType || (fac.code?.includes('SUP') ? 'SUPPLIER' : 'FULL_FLEDGED_FACTORY');

          return (
            <div
              key={fac.id}
              className="group rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md text-[#1A1A1A]"
            >
              <div className="p-5 space-y-3.5">
                {/* Header: Select Checkbox, Code, Entity Type & Tier */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={(e) => toggleSelectFactory(fac.id, e)}
                      className="cursor-pointer text-[#1F3A2E]"
                      title="Select Supplier"
                    >
                      {selectedFactoryIds.includes(fac.id) ? (
                        <CheckSquare className="w-4 h-4 text-[#1F3A2E]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#FAF5EC] text-[#8A6D3B] font-semibold border border-[#C8A96A]/40">
                      {fac.code}
                    </span>
                    {isArtisanVendor(fac) ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-900 border-emerald-300 flex items-center gap-1" title="Artisan Workshop & Heritage Cluster">
                        <span>🌿</span>
                        <span>Artisan Workshop</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-amber-50 text-amber-950 border-amber-300 flex items-center gap-1" title="Industrial Composite Manufacturing Plant">
                        <span>🏭</span>
                        <span>Industrial Composite</span>
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-[#1F3A2E] bg-[#F4F6F4] px-2 py-0.5 rounded">
                      {fac.sectors.join(', ')}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] font-semibold shrink-0">
                    {fac.tier.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Name & Cluster */}
                <div>
                  <h3 className="text-base font-bold font-heading text-[#1F3A2E] group-hover:text-[#8A6D3B] transition-colors">
                    {fac.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7269] mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8A6D3B] shrink-0" />
                    <span className="truncate">{fac.cluster}</span>
                  </div>
                </div>

                {/* 3-Second Glance CRM Cockpit Module */}
                <div className="space-y-2 pt-1 border-t border-[#DDE3DD]">
                  {/* Live CRM Status Pill */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-950 truncate">
                      {fac.crmStatus || 'Production In Line • AQL Inspection Scheduled'}
                    </span>
                  </div>

                  {/* Direct WhatsApp Call & Phone Action Bar */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-500 block truncate">
                        {fac.contactPerson} ({fac.designation})
                      </span>
                      <span className="text-[11px] font-mono font-bold text-[#1F3A2E] truncate block">
                        {fac.phone}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/${fac.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-xs transition-transform active:scale-95 shrink-0"
                      title={`Open WhatsApp chat with ${fac.contactPerson}`}
                    >
                      <Phone className="w-3 h-3 fill-current" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Master Compromise Payment Terms Snapshot */}
                  <div className="p-2.5 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]/40 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-[#8A6D3B] uppercase tracking-wider block">
                        Payment Terms (30/50/20 NOC):
                      </span>
                      <span className="font-mono text-xs font-bold text-[#1F3A2E] truncate block">
                        {fac.paymentTerms || '30% Advance | 50% FRI Pass | 20% Delivery NOC'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#8A6D3B] font-bold border border-[#C8A96A]/30 shrink-0">
                      30/50/20
                    </span>
                  </div>

                  {/* Export Incentive Stamped Deed Badge */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-semibold truncate">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">Stamped Deed (Tk. 300)</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 shrink-0">
                      Clause 3 Waived ✔
                    </span>
                  </div>

                  {/* Last Interaction Memo */}
                  {fac.lastInteractionMemo && (
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Last Interaction Memo:</span>
                      </span>
                      <p className="text-[11px] leading-relaxed line-clamp-2 italic text-slate-800 mt-0.5">
                        &ldquo;{fac.lastInteractionMemo}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Capacity Allocation Meter */}
                <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B7269]">Monthly Capacity Allocation:</span>
                    <span className="font-mono font-bold text-[#1F3A2E]">{utilPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E5EAE5] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        Number(utilPct) > 80 ? 'bg-[#8A1515]' : 'bg-[#1F3A2E]'
                      }`}
                      style={{ width: `${utilPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#6B7269]">
                    <span>
                      Allocated: <strong className="text-[#1A1A1A]">{(fac.capacity.allocatedUnits / 1000).toFixed(0)}k</strong>
                    </span>
                    <span>
                      Max: <strong className="text-[#1A1A1A]">{(fac.capacity.monthlyCapacityUnits / 1000).toFixed(0)}k units</strong>
                    </span>
                  </div>
                </div>

                {/* Compliance Audits Pills */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-[#6B7269] uppercase tracking-wider flex items-center justify-between font-heading">
                    <span>Verified Audit Standards:</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#14512C]" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {fac.complianceAudits.map((aud, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#E8F0FA] text-[#17456F] border border-[#C5D7ED] flex items-center gap-1 font-medium"
                        title={`Valid until: ${aud.validUntil} (${aud.ratingGrade})`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#17456F]" />
                        <span>{aud.standardName.split(' ')[0]}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DDE3DD] text-xs">
                  <div className="p-2 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD]">
                    <span className="text-[10px] text-[#6B7269] block">On-Time Delivery</span>
                    <span className="font-mono font-bold text-[#1F3A2E]">{fac.scorecard.onTimeDeliveryPct}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD]">
                    <span className="text-[10px] text-[#6B7269] block">FRI AQL Pass Rate</span>
                    <span className="font-mono font-bold text-[#14512C]">{fac.scorecard.aqlPassRatePct}%</span>
                  </div>
                </div>

                {/* Digital & Social Communication Channels Strip */}
                <div className="pt-2 border-t border-[#DDE3DD] flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#6B7269] font-medium">Channels:</span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`mailto:${fac.email}`}
                      title={`Email: ${fac.email}`}
                      className="p-1 rounded bg-[#F4F6F4] hover:bg-emerald-100 text-emerald-800 border border-[#DDE3DD] transition-colors"
                    >
                      <Mail className="w-3 h-3" />
                    </a>
                    {fac.website && (
                      <a
                        href={`https://${fac.website.replace(/^https?:\/\//, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        title={`Website: ${fac.website}`}
                        className="p-1 rounded bg-[#F4F6F4] hover:bg-blue-100 text-blue-700 border border-[#DDE3DD] transition-colors"
                      >
                        <Globe className="w-3 h-3" />
                      </a>
                    )}
                    {fac.facebookUrl && (
                      <a
                        href={`https://${fac.facebookUrl.replace(/^https?:\/\//, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        title={`Facebook: ${fac.facebookUrl}`}
                        className="w-5 h-5 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-bold text-[9px] transition-colors"
                      >
                        f
                      </a>
                    )}
                    {fac.linkedInUrl && (
                      <a
                        href={`https://${fac.linkedInUrl.replace(/^https?:\/\//, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        title={`LinkedIn: ${fac.linkedInUrl}`}
                        className="w-5 h-5 rounded bg-[#0A66C2] hover:bg-[#004182] text-white flex items-center justify-center font-bold text-[9px] transition-colors"
                      >
                        in
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 border-t border-[#DDE3DD] bg-[#F8FAF8] flex items-center justify-between gap-2">
                <div className="text-[11px] text-[#6B7269] truncate">
                  Lead: <strong className="text-[#1A1A1A]">{fac.leadTimeDays}d</strong> • MOQ: <strong className="text-[#1A1A1A]">{fac.minimumOrderQuantity}</strong>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setSelectedPortfolioFactory(getPortfolioForFactory(fac))}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1F3A2E] hover:bg-[#162B22] text-white text-xs font-bold transition-colors shadow-sm"
                    title="View living Factory & Supplier Portfolio (5 Pillars)"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#C8A96A]" />
                    <span>Portfolio</span>
                  </button>

                  <button
                    onClick={() => setEditingFactory(fac)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer"
                    title="Edit Supplier Profile"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-700" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={(e) => handleDeleteFactory(fac.id, fac.name, e)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs transition-colors cursor-pointer"
                    title="Delete Supplier Profile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedFactory(fac)}
                    className="flex items-center gap-1 text-xs font-bold text-[#1F3A2E] hover:text-[#8A6D3B] transition-colors ml-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Modal: Factory Detail View */}
      {selectedFactory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b-[3px] border-[#C8A96A] bg-[#1F3A2E] text-white flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E] font-bold">
                    {selectedFactory.code}
                  </span>
                  {((selectedFactory.vendorType === 'FULL_FLEDGED_FACTORY') || (!selectedFactory.vendorType && !selectedFactory.code?.includes('SUP'))) && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-amber-400/20 text-[#E87722] border-[#E87722]/50" title="Full-Fledged Factory: Own Raw Materials & In-House Finished Goods Production">
                      🏭 Full-Fledged Factory (Own Raw Materials)
                    </span>
                  )}
                  {selectedFactory.vendorType === 'FACTORY' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-emerald-900/60 text-emerald-200 border-emerald-400" title="Factory: Manufacturer (Raw Materials Sourced from Open Market)">
                      🏗️ Factory (Open Market Raw Materials)
                    </span>
                  )}
                  {((selectedFactory.vendorType === 'SUPPLIER') || (!selectedFactory.vendorType && selectedFactory.code?.includes('SUP'))) && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-blue-900/60 text-blue-200 border-blue-400" title="Supplier: Collect Finished Goods & Supply">
                      🏢 Supplier (Collect Finished Goods &amp; Supply)
                    </span>
                  )}
                  <span className="text-xs text-emerald-100 font-medium">{selectedFactory.cluster}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5 font-['Montserrat']">{selectedFactory.name}</h2>
                <div className="text-xs text-white/80 mt-0.5 font-['Open_Sans']">{selectedFactory.factoryAddress}</div>
              </div>

              <button
                onClick={() => setSelectedFactory(null)}
                className="p-1.5 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs bg-[#F4F6F4]">
              {/* Compliance Audit Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#1F3A2E] uppercase tracking-wider text-[11px] font-['Montserrat'] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Audit Certificates & Validity Registry</span>
                </h4>

                <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1F3A2E] text-white text-[10px] uppercase font-semibold border-b border-[#1F3A2E]">
                      <tr>
                        <th className="py-2.5 px-3">Audit Standard</th>
                        <th className="py-2.5 px-3">Rating / Grade</th>
                        <th className="py-2.5 px-3">Auditing Body</th>
                        <th className="py-2.5 px-3">Valid Until</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8EFE8] text-[#1A1A1A]">
                      {selectedFactory.complianceAudits.map((aud) => (
                        <tr key={aud.id} className="hover:bg-[#F4F6F4]">
                          <td className="py-2.5 px-3 font-semibold text-[#1F3A2E]">{aud.standardName}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{aud.ratingGrade}</td>
                          <td className="py-2.5 px-3 text-gray-600">{aud.auditBody}</td>
                          <td className="py-2.5 px-3 font-mono text-gray-800">{aud.validUntil}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] text-[10px] font-mono border border-[#BBE3C7] font-semibold">
                              {aud.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Machinery & Technology Profile */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                <span className="font-bold text-[#1F3A2E] block text-[11px] uppercase tracking-wider font-['Montserrat']">
                  Industrial Machinery & Automation Profile
                </span>
                <ul className="space-y-1.5 pt-1 text-gray-700">
                  {selectedFactory.capacity.machineryList.map((m, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-[#C8A96A] font-bold">▹</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mandatory Statutory Documents Registry (7 Requirements) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#1F3A2E] uppercase tracking-wider text-[11px] font-['Montserrat'] flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    <span>Mandatory Statutory Enlistment Documents (7 Requirements)</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    7 / 7 VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {getFactoryDocuments(selectedFactory).map((doc, idx) => (
                    <div
                      key={doc.id || idx}
                      className="p-3 rounded-xl bg-white border border-[#DDE3DD] shadow-sm hover:border-[#1F3A2E] transition-all flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="p-1.5 rounded-lg bg-[#E4F3E9] text-[#14512C] shrink-0 mt-0.5">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-[#1F3A2E] leading-tight truncate">
                            {doc.title}
                          </div>
                          <div className="text-[11px] font-mono text-gray-500 truncate mt-0.5">
                            {doc.fileName}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span>Ref: <strong className="text-gray-700 font-mono">{doc.documentNumber}</strong></span>
                            {doc.validUntil && <span>• Exp: <strong className="text-gray-700 font-mono">{doc.validUntil}</strong></span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] text-[10px] font-mono font-bold border border-[#BBE3C7]">
                          {doc.status}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">
                          {doc.uploadedAt}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact & Banking Credentials */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                  <span className="font-bold text-[#1F3A2E] block text-[11px] uppercase tracking-wider font-['Montserrat']">
                    Commercial Contact Officer
                  </span>
                  <div className="space-y-1 text-gray-700">
                    <div className="font-semibold text-[#1F3A2E]">{selectedFactory.contactPerson}</div>
                    <div className="text-[11px] text-gray-500">{selectedFactory.designation}</div>
                    <div className="text-[11px] font-mono text-gray-800 pt-1">Phone: {selectedFactory.phone}</div>
                    <div className="text-[11px] text-emerald-700 font-medium">Email: {selectedFactory.email}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                  <span className="font-bold text-[#1F3A2E] block text-[11px] uppercase tracking-wider font-['Montserrat']">
                    Statutory & Banking Credentials
                  </span>
                  <div className="space-y-1 text-gray-700 text-[11px]">
                    <div>BIN: <span className="font-mono text-[#1F3A2E] font-semibold">{selectedFactory.binNumber}</span></div>
                    <div>EPB Reg: <span className="font-mono text-[#1F3A2E] font-semibold">{selectedFactory.epbRegistrationNo}</span></div>
                    <div>Bank: <span className="text-[#1F3A2E] font-medium">{selectedFactory.bankDetails.bankName}</span></div>
                    <div>Routing: <span className="font-mono text-gray-600">{selectedFactory.bankDetails.routingNumber}</span></div>
                  </div>
                </div>
              </div>

              {/* Corporate Communication & Social Channels */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
                <span className="font-bold text-[#1F3A2E] block text-[11px] uppercase tracking-wider font-['Montserrat'] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Corporate Digital &amp; Social Communication Channels</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {/* Email */}
                  <div className="p-2.5 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-800 shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-gray-500 font-semibold uppercase">Email</div>
                      <a
                        href={`mailto:${selectedFactory.email}`}
                        className="text-[11px] text-[#1F3A2E] hover:text-emerald-700 font-medium truncate block font-mono hover:underline"
                        title={selectedFactory.email}
                      >
                        {selectedFactory.email || 'export@factory-bd.com'}
                      </a>
                    </div>
                  </div>

                  {/* Web */}
                  <div className="p-2.5 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-100 text-blue-800 shrink-0">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-gray-500 font-semibold uppercase">Official Web</div>
                      <a
                        href={`https://${(selectedFactory.website || selectedFactory.vendorProfile?.websiteUrl || 'www.apexartisan-bd.com').replace(/^https?:\/\//, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-700 hover:text-blue-900 font-medium truncate block font-mono hover:underline"
                      >
                        {selectedFactory.website || selectedFactory.vendorProfile?.websiteUrl || 'www.apexartisan-bd.com'}
                      </a>
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="p-2.5 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      f
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-gray-500 font-semibold uppercase">Facebook</div>
                      <a
                        href={`https://${(selectedFactory.facebookUrl || selectedFactory.vendorProfile?.facebookUrl || 'facebook.com/apexartisan.bd').replace(/^https?:\/\//, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-medium truncate block font-mono hover:underline"
                      >
                        {selectedFactory.facebookUrl || selectedFactory.vendorProfile?.facebookUrl || 'facebook.com/apexartisan.bd'}
                      </a>
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="p-2.5 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#0A66C2] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      in
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-gray-500 font-semibold uppercase">LinkedIn</div>
                      <a
                        href={`https://${(selectedFactory.linkedInUrl || selectedFactory.vendorProfile?.linkedInUrl || 'linkedin.com/company/apex-artisan-bd').replace(/^https?:\/\//, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-sky-700 hover:text-sky-900 font-medium truncate block font-mono hover:underline"
                      >
                        {selectedFactory.linkedInUrl || selectedFactory.vendorProfile?.linkedInUrl || 'linkedin.com/company/apex-artisan-bd'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#DDE3DD] bg-white flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-gray-600">
                Payment Terms: <strong className="text-[#1F3A2E]">{selectedFactory.paymentTerms}</strong>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedPortfolioFactory(getPortfolioForFactory(selectedFactory));
                    setSelectedFactory(null);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#C8A96A] hover:bg-[#b59556] text-[#1F3A2E] text-xs font-bold shadow-sm transition-colors"
                  title="Open Living Factory & Supplier Portfolio (5 Pillars)"
                >
                  <Layers className="w-4 h-4 text-[#1F3A2E]" />
                  <span>Open Factory Portfolio Dossier</span>
                </button>

                <button
                  onClick={() => {
                    setRatingModelFactory(selectedFactory);
                    setIsRatingModelOpen(true);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0F2C59] hover:bg-[#163E7A] text-[#C8A96A] text-xs font-bold shadow-sm border border-[#C8A96A]/50 transition-colors"
                  title="View Factory Evaluation in Official Rating Model"
                >
                  <Award className="w-4 h-4 text-[#E87722]" />
                  <span>Rating Model &amp; Evaluation</span>
                </button>

                <button
                  onClick={() => {
                    setViewingPdfFactory(selectedFactory);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-bold shadow-sm border-b-2 border-[#C8A96A] transition-colors"
                >
                  <Printer className="w-4 h-4 text-[#C8A96A]" />
                  <span>Export Official B2B Profile (PDF Form)</span>
                </button>

                <button
                  onClick={() => setEditingFactory(selectedFactory)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer"
                  title="Edit Supplier Profile"
                >
                  <Edit className="w-3.5 h-3.5 text-amber-700" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={(e) => handleDeleteFactory(selectedFactory.id, selectedFactory.name, e)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors cursor-pointer"
                  title="Delete Supplier Profile"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Supplier</span>
                </button>

                <button
                  onClick={() => setSelectedFactory(null)}
                  className="px-4 py-2 rounded-lg bg-[#E8EFE8] hover:bg-[#DDE3DD] text-[#1F3A2E] text-xs font-semibold transition-colors"
                >
                  Close Audit Sheet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Modal: Vendor Enlistment & Profile Form Wizard */}
      <VendorEnlistmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEnlistVendor={(newFactory) => {
          onAddFactory(newFactory);
          setIsAddModalOpen(false);
        }}
      />

      {/* Modal: Official B2B Vendor Profile 2-Page Vector PDF Form */}
      <OfficialVendorProfilePdfModal
        isOpen={!!viewingPdfFactory}
        onClose={() => setViewingPdfFactory(null)}
        factory={viewingPdfFactory}
      />

      {/* Modal: Official ArielMC Factory Rating Model Vector PDF Form */}
      <FactoryRatingModelModal
        isOpen={isRatingModelOpen}
        onClose={() => {
          setIsRatingModelOpen(false);
          setRatingModelFactory(null);
        }}
        factory={ratingModelFactory}
      />

      {/* Modal: Edit Supplier Profile */}
      <EditSupplierModal
        isOpen={!!editingFactory}
        factory={editingFactory}
        onClose={() => setEditingFactory(null)}
        onSave={handleSaveEditedFactory}
      />

      {/* Modal: Living Factory & Supplier Portfolio Dossier (5 Pillars) */}
      {selectedPortfolioFactory && (
        <FactorySupplierPortfolioModal
          portfolio={selectedPortfolioFactory}
          onClose={() => setSelectedPortfolioFactory(null)}
          onSavePortfolio={handleSaveFactoryPortfolio}
          isBdStation={true}
          bdtRate={120}
        />
      )}
    </div>
  );
};
