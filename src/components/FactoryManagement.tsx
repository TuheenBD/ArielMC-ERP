'use client';

import React, { useState, useMemo } from 'react';
import { SupplierFactory, ProductSector, VendorEnlistmentDocument, VendorClassification } from '@/types/erp';
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
  Award
} from 'lucide-react';
import { ArielMC } from '@/lib/brand';
import { VendorEnlistmentModal } from './VendorEnlistmentModal';
import { OfficialVendorProfilePdfModal } from './OfficialVendorProfilePdfModal';
import { FactoryRatingModelModal } from './FactoryRatingModelModal';

interface FactoryManagementProps {
  factories: SupplierFactory[];
  onAddFactory: (newFactory: SupplierFactory) => void;
}

export const FactoryManagement: React.FC<FactoryManagementProps> = ({
  factories,
  onAddFactory,
}) => {
  const [selectedSector, setSelectedSector] = useState<ProductSector | 'ALL'>('ALL');
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [selectedVendorType, setSelectedVendorType] = useState<VendorClassification | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFactory, setSelectedFactory] = useState<SupplierFactory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingPdfFactory, setViewingPdfFactory] = useState<SupplierFactory | null>(null);
  const [isRatingModelOpen, setIsRatingModelOpen] = useState(false);
  const [ratingModelFactory, setRatingModelFactory] = useState<SupplierFactory | null>(null);

  // Filter factories
  const filteredFactories = useMemo(() => {
    return factories.filter((fac) => {
      const matchesSector = selectedSector === 'ALL' || fac.sectors.includes(selectedSector);
      const matchesCluster = selectedCluster === 'ALL' || fac.cluster.toLowerCase().includes(selectedCluster.toLowerCase());
      const currentVendorType: VendorClassification = fac.vendorType || (fac.code?.includes('SUP') ? 'SUPPLIER' : 'FULL_FLEDGED_FACTORY');
      const matchesVendorType = selectedVendorType === 'ALL' || currentVendorType === selectedVendorType;
      const matchesSearch =
        searchQuery === '' ||
        fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.cluster.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.capacity.machineryList.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSector && matchesCluster && matchesVendorType && matchesSearch;
    });
  }, [factories, selectedSector, selectedCluster, selectedVendorType, searchQuery]);

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
              <span>Bangladesh Factory Sourcing & Compliance</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] font-bold">
                {factories.length} Partner Facilities
              </span>
            </h1>
            <p className="text-xs text-[#6B7269] mt-1 max-w-2xl leading-relaxed">
              Industrial cluster tracking across Savar, Gazipur, Narsingdi, and Dhamrai. Audited for BSCI, SEDEX, LWG, GOTS, and FDA food-contact standards.
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
            <option value="ALL">All Vendor Entities (3 Tiers)</option>
            <option value="FULL_FLEDGED_FACTORY">🏭 Full-Fledged Factories (Own Raw Materials)</option>
            <option value="FACTORY">🏗️ Factories (Open Market Raw Materials)</option>
            <option value="SUPPLIER">🏢 Suppliers (Collect &amp; Supply)</option>
          </select>

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

      {/* Factory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFactories.map((fac) => {
          const utilPct = ((fac.capacity.allocatedUnits / fac.capacity.monthlyCapacityUnits) * 100).toFixed(0);
          const vType: VendorClassification = fac.vendorType || (fac.code?.includes('SUP') ? 'SUPPLIER' : 'FULL_FLEDGED_FACTORY');

          return (
            <div
              key={fac.id}
              className="group rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md text-[#1A1A1A]"
            >
              <div className="p-5 space-y-4">
                {/* Header: Code, Entity Type & Tier */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#FAF5EC] text-[#8A6D3B] font-semibold border border-[#C8A96A]/40">
                      {fac.code}
                    </span>
                    {vType === 'FULL_FLEDGED_FACTORY' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-amber-50 text-amber-900 border-amber-300" title="Full-Fledged Factory: Own Raw Materials & Finished Goods Production">
                        🏭 Full-Fledged
                      </span>
                    )}
                    {vType === 'FACTORY' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-800 border-emerald-200" title="Factory: Manufacturer (Open Market Raw Materials)">
                        🏗️ Factory
                      </span>
                    )}
                    {vType === 'SUPPLIER' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-blue-50 text-blue-700 border-blue-200" title="Supplier: Collect Finished Goods & Supply">
                        🏢 Supplier
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-[#6B7269]">{fac.sectors.join(', ')}</span>
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
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7269] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8A6D3B] shrink-0" />
                    <span className="truncate">{fac.cluster}</span>
                  </div>
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

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setViewingPdfFactory(fac)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#DDE3DD] hover:border-[#1F3A2E] text-xs font-semibold text-[#1F3A2E] hover:bg-[#F4F6F4] transition-colors"
                    title="Export Official 2-Page B2B Vendor Profile Form (PDF)"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#8A6D3B]" />
                    <span>B2B Profile PDF</span>
                  </button>

                  <button
                    onClick={() => setSelectedFactory(fac)}
                    className="flex items-center gap-1 text-xs font-bold text-[#1F3A2E] hover:text-[#8A6D3B] transition-colors"
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
    </div>
  );
};
