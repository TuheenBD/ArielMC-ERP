'use client';

import React, { useState } from 'react';
import {
  FactorySupplierPortfolio,
  FactoryComplianceAudit,
  FactoryMachineryUnit,
  FactorySubSupplier,
} from '@/types/factoryPortfolio';
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
  Edit3,
  Award,
  CreditCard,
  Building2,
  TrendingUp,
  Cpu,
  Truck,
  Check,
} from 'lucide-react';

interface FactorySupplierPortfolioModalProps {
  portfolio: FactorySupplierPortfolio;
  onClose: () => void;
  onSavePortfolio: (updated: FactorySupplierPortfolio) => void;
  isBdStation?: boolean;
  bdtRate?: number;
}

type FactoryTab =
  | 'PRODUCTION'
  | 'COMPLIANCE'
  | 'SUB_SUPPLIERS'
  | 'FINANCIAL'
  | 'SCORECARD'
  | 'UPDATE_DATA';

export const FactorySupplierPortfolioModal: React.FC<FactorySupplierPortfolioModalProps> = ({
  portfolio,
  onClose,
  onSavePortfolio,
  isBdStation = true,
  bdtRate = 120,
}) => {
  const [activeTab, setActiveTab] = useState<FactoryTab>('PRODUCTION');
  const [currentPortfolio, setCurrentPortfolio] = useState<FactorySupplierPortfolio>(portfolio);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // New Audit State
  const [newAudit, setNewAudit] = useState<Partial<FactoryComplianceAudit>>({
    standardName: 'Sedex SMETA 4-Pillar',
    status: 'VALID',
    ratingGrade: 'Grade A / Zero Non-Conformance',
    auditBody: 'SGS Bangladesh',
    auditDate: new Date().toISOString().split('T')[0],
    validUntil: '2028-06-30',
    reportNumber: 'SGS-BD-2026-09',
  });

  // New Machine State
  const [newMachine, setNewMachine] = useState<Partial<FactoryMachineryUnit>>({
    machineName: '',
    originCountry: 'Germany',
    quantity: 5,
    purpose: 'Precision leather stitching',
  });

  // New Sub-Supplier State
  const [newSubSupplier, setNewSubSupplier] = useState<Partial<FactorySubSupplier>>({
    materialType: 'Hardware & Accessories',
    supplierName: '',
    locationCluster: 'Gazipur Industrial Zone',
    complianceTier: 'Certified Tier 1',
    traceabilityVerified: true,
  });

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
  };

  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMachine.machineName) return;

    const machineItem: FactoryMachineryUnit = {
      machineName: newMachine.machineName,
      originCountry: newMachine.originCountry || 'Germany',
      quantity: Number(newMachine.quantity) || 1,
      purpose: newMachine.purpose || 'Production line equipment',
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
    setNewMachine({
      machineName: '',
      originCountry: 'Germany',
      quantity: 5,
      purpose: 'Precision leather stitching',
    });
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleAddSubSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubSupplier.supplierName) return;

    const subItem: FactorySubSupplier = {
      id: `sub-${Date.now()}`,
      materialType: newSubSupplier.materialType || 'Raw Materials',
      supplierName: newSubSupplier.supplierName,
      locationCluster: newSubSupplier.locationCluster || 'Dhaka',
      complianceTier: newSubSupplier.complianceTier || 'Certified Tier 1',
      traceabilityVerified: newSubSupplier.traceabilityVerified ?? true,
    };

    const updated: FactorySupplierPortfolio = {
      ...currentPortfolio,
      subSupplierNetwork: [subItem, ...currentPortfolio.subSupplierNetwork],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setCurrentPortfolio(updated);
    onSavePortfolio(updated);
    setNewSubSupplier({
      materialType: 'Hardware & Accessories',
      supplierName: '',
      locationCluster: 'Gazipur Industrial Zone',
      complianceTier: 'Certified Tier 1',
      traceabilityVerified: true,
    });
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Top-Right Absolute Close Button (Standard Window Position) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/40 hover:bg-black/70 text-white/90 hover:text-white border border-white/20 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
          title="Close Window (X)"
          aria-label="Close Window"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-5 pr-16 border-b-[3px] border-[#C8A96A] bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#162B22] text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-[#C8A96A] text-[#1F3A2E] font-bold shadow-sm">
                  {currentPortfolio.factoryCode}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-emerald-100 border border-white/20">
                  {currentPortfolio.vendorClassification.replace(/_/g, ' ')}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  {currentPortfolio.tier.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] text-emerald-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#C8A96A]" />
                  Updated: {currentPortfolio.lastUpdated}
                </span>
              </div>

              <h2 className="text-2xl font-bold font-heading text-white tracking-wide">
                {currentPortfolio.factoryName}
              </h2>

              <p className="text-xs text-emerald-100/90 max-w-2xl flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
                <span>{currentPortfolio.factoryAddress}</span>
              </p>
            </div>

            {/* Quick KPI Cards */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center min-w-[110px]">
                <span className="text-[10px] uppercase tracking-wider text-emerald-200 block">Monthly Cap</span>
                <span className="font-mono text-sm font-bold text-white block">
                  {currentPortfolio.capacityAndMachinery.monthlyCapacityUnits.toLocaleString()}
                </span>
                <span className="text-[9px] text-emerald-300 block">
                  {currentPortfolio.capacityAndMachinery.utilizationRatePct}% Utilized
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center min-w-[110px]">
                <span className="text-[10px] uppercase tracking-wider text-emerald-200 block">Ariel Reserved</span>
                <span className="font-mono text-sm font-bold text-[#C8A96A] block">
                  {currentPortfolio.capacityAndMachinery.arielMcReservedCapacityUnits.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-300 block">Dedicated Pcs</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center min-w-[110px]">
                <span className="text-[10px] uppercase tracking-wider text-emerald-200 block">AQL Pass Rate</span>
                <span className="font-mono text-sm font-bold text-emerald-300 block">
                  {currentPortfolio.qualityScorecard.aqlPassRatePct}%
                </span>
                <span className="text-[9px] text-slate-300 block">
                  OTIF: {currentPortfolio.qualityScorecard.onTimeDeliveryRatePct}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="px-5 py-2.5 border-b border-[#DDE3DD] bg-[#F8FAF8] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {[
              { id: 'PRODUCTION' as FactoryTab, label: '1. Production & Machinery', icon: Cpu },
              { id: 'COMPLIANCE' as FactoryTab, label: `2. Audits & ESG (${currentPortfolio.complianceAudits.length})`, icon: ShieldCheck },
              { id: 'SUB_SUPPLIERS' as FactoryTab, label: `3. Sourcing Network (${currentPortfolio.subSupplierNetwork.length})`, icon: Truck },
              { id: 'FINANCIAL' as FactoryTab, label: '4. B2B L/C & Spend', icon: CreditCard },
              { id: 'SCORECARD' as FactoryTab, label: '5. Quality Scorecard', icon: Award },
              { id: 'UPDATE_DATA' as FactoryTab, label: 'Store / Update Data', icon: Edit3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#1F3A2E] text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:text-[#1F3A2E] hover:bg-slate-100 border border-[#DDE3DD]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C8A96A]' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {saveSuccessNotice && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
                <Check className="w-3 h-3" /> Saved &amp; Persisted!
              </span>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#DDE3DD] hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FCFDFC]">
          {/* TAB 1: PRODUCTION & MACHINERY */}
          {activeTab === 'PRODUCTION' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#C8A96A]" />
                  <span>Pillar 1: Production Capabilities, Machinery Roster &amp; Line Allocation</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed inspection of manufacturing equipment, floor line configuration, shift structures, and ArielMC monthly reserved capacity.
                </p>
              </div>

              {/* Line & Capacity Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
                  <span className="text-slate-500">Active Production Lines:</span>
                  <strong className="text-base font-mono font-bold text-slate-800 block mt-0.5">
                    {currentPortfolio.capacityAndMachinery.activeLinesCount} Dedicated Lines
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
                  <span className="text-slate-500">Total Factory Workforce:</span>
                  <strong className="text-base font-mono font-bold text-slate-800 block mt-0.5">
                    {currentPortfolio.capacityAndMachinery.totalWorkforce.toLocaleString()} Artisans &amp; Staff
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
                  <span className="text-slate-500">Shift Operating Model:</span>
                  <strong className="text-sm font-semibold text-emerald-800 block mt-0.5">
                    {currentPortfolio.capacityAndMachinery.shiftStructure}
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
                  <span className="text-slate-500">Reserved for ArielMC:</span>
                  <strong className="text-base font-mono font-bold text-[#1F3A2E] block mt-0.5">
                    {currentPortfolio.capacityAndMachinery.arielMcReservedCapacityUnits.toLocaleString()} Pcs / Month
                  </strong>
                </div>
              </div>

              {/* Machinery Roster Table */}
              <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-900 font-heading">High-Precision Industrial Machinery Inventory</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Equipment / Machine Model</th>
                        <th className="py-2.5 px-3 font-semibold">Country of Origin</th>
                        <th className="py-2.5 px-3 font-semibold text-center">Quantity</th>
                        <th className="py-2.5 px-3 font-semibold">Production Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentPortfolio.capacityAndMachinery.machinery.map((mach, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">{mach.machineName}</td>
                          <td className="py-2.5 px-3 text-slate-600">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-mono">
                              {mach.originCountry}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-center text-[#1F3A2E]">{mach.quantity}</td>
                          <td className="py-2.5 px-3 text-slate-600">{mach.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPLIANCE AUDITS & ESG */}
          {activeTab === 'COMPLIANCE' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C8A96A]" />
                  <span>Pillar 2: Social, Structural &amp; Environmental Compliance Audits</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Third-party verified factory audits, chemical toxicology passes (EU REACH/ZDHC), social labor assessments (Sedex/BSCI), and safety certificates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPortfolio.complianceAudits.map((aud) => (
                  <div
                    key={aud.id}
                    className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{aud.standardName}</h4>
                        <p className="text-xs font-semibold text-emerald-800 mt-0.5">{aud.ratingGrade}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {aud.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-500 block">Audit Body:</span>
                        <strong className="text-slate-700">{aud.auditBody}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Report Number:</span>
                        <span className="font-mono text-slate-700">{aud.reportNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Audit Date:</span>
                        <span className="font-mono text-slate-700">{aud.auditDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Valid Until:</span>
                        <span className="font-mono font-bold text-emerald-700">{aud.validUntil}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SUB-SUPPLIER NETWORK */}
          {activeTab === 'SUB_SUPPLIERS' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C8A96A]" />
                  <span>Pillar 3: Raw Material Sourcing &amp; Sub-Supplier Traceability Network</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Traceability mapping from raw bovine hides, cotton yarn spinning mills, and brass casting foundries to ensure end-to-end provenance.
                </p>
              </div>

              <div className="space-y-3">
                {currentPortfolio.subSupplierNetwork.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#1F3A2E] text-white">
                          {sub.complianceTier}
                        </span>
                        {sub.traceabilityVerified && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Traceability Verified
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{sub.supplierName}</h4>
                      <p className="text-slate-500">Material Category: <strong className="text-slate-700">{sub.materialType}</strong></p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 sm:text-right shrink-0">
                      <span className="text-[10px] text-slate-500 block">Cluster Location</span>
                      <strong className="text-slate-800">{sub.locationCluster}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FINANCIAL & B2B L/C */}
          {activeTab === 'FINANCIAL' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#C8A96A]" />
                  <span>Pillar 4: Commercial Banking Credentials, Back-to-Back L/C &amp; YTD Spend</span>
                </h3>
                <p className="text-xs text-slate-500">
                  NBR tax compliance registration, trade finance routing, Back-to-Back L/C acceptance, and total manufacturing spend in Bangladeshi Taka (৳).
                </p>
              </div>

              {/* Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm">
                  <span className="text-xs text-slate-500 font-medium block">Total Spend YTD (BDT)</span>
                  <span className="text-lg font-bold font-mono text-[#1F3A2E] block mt-1">
                    ৳{currentPortfolio.financialAndBanking.totalSpendYtdBdt.toLocaleString()} BDT
                  </span>
                  <span className="text-xs font-mono text-slate-500 block">
                    (${currentPortfolio.financialAndBanking.totalSpendYtdUsd.toLocaleString()} USD)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm">
                  <span className="text-xs text-slate-500 font-medium block">Outstanding Payables</span>
                  <span className="text-lg font-bold font-mono text-blue-900 block mt-1">
                    ৳{currentPortfolio.financialAndBanking.outstandingPayablesBdt.toLocaleString()} BDT
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 block">
                    Payment Punctuality: {currentPortfolio.financialAndBanking.paymentPunctualityScorePct}%
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm">
                  <span className="text-xs text-slate-500 font-medium block">B2B L/C Acceptance</span>
                  <span className="text-lg font-bold font-mono text-emerald-700 block mt-1">
                    {currentPortfolio.financialAndBanking.backToBackLcAccepted ? 'Verified & Active' : 'Not Configured'}
                  </span>
                  <span className="text-xs text-slate-600 block">
                    Preferred Tenor: {currentPortfolio.financialAndBanking.preferredLcTenorDays} Days USANCE
                  </span>
                </div>
              </div>

              {/* Tax & Banking Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                  <h4 className="font-bold text-slate-900 font-heading">Designated Trade Finance Bank</h4>
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Bank &amp; Branch:</span>
                      <strong className="text-slate-800">
                        {currentPortfolio.financialAndBanking.bankName} - {currentPortfolio.financialAndBanking.branchName}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
                      <span className="text-slate-500">Routing Number:</span>
                      <span className="font-mono font-bold text-[#1F3A2E]">{currentPortfolio.financialAndBanking.routingNumber}</span>
                    </div>
                    {currentPortfolio.financialAndBanking.swiftBic && (
                      <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
                        <span className="text-slate-500">SWIFT / BIC:</span>
                        <span className="font-mono text-slate-700">{currentPortfolio.financialAndBanking.swiftBic}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                  <h4 className="font-bold text-slate-900 font-heading">Bangladesh Tax &amp; Export Registrations</h4>
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">NBR BIN Number:</span>
                      <span className="font-mono font-bold text-slate-800">{currentPortfolio.financialAndBanking.nbrBinNumber}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
                      <span className="text-slate-500">TIN Number:</span>
                      <span className="font-mono text-slate-700">{currentPortfolio.financialAndBanking.tinNumber}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
                      <span className="text-slate-500">EPB Registration:</span>
                      <span className="font-mono font-semibold text-emerald-800">{currentPortfolio.financialAndBanking.epbRegistrationNo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SCORECARD */}
          {activeTab === 'SCORECARD' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C8A96A]" />
                  <span>Pillar 5: Quality Assurance &amp; Operational Scorecard</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Performance metrics calculated across past production runs: FRI AQL pass rate, on-time delivery %, and proto turnaround agility.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm text-center">
                  <span className="text-xs text-slate-500 block">FRI AQL Pass Rate</span>
                  <span className="text-2xl font-mono font-bold text-emerald-700 block mt-1">
                    {currentPortfolio.qualityScorecard.aqlPassRatePct}%
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Strict Pass Threshold</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm text-center">
                  <span className="text-xs text-slate-500 block">On-Time In-Full (OTIF)</span>
                  <span className="text-2xl font-mono font-bold text-[#1F3A2E] block mt-1">
                    {currentPortfolio.qualityScorecard.onTimeDeliveryRatePct}%
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Ex-Factory Punctuality</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm text-center">
                  <span className="text-xs text-slate-500 block">Average Defect Rate</span>
                  <span className="text-2xl font-mono font-bold text-blue-800 block mt-1">
                    {currentPortfolio.qualityScorecard.averageDefectRatePct}%
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Below 1.5% Target</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm text-center">
                  <span className="text-xs text-slate-500 block">Proto Sample Turnaround</span>
                  <span className="text-2xl font-mono font-bold text-purple-900 block mt-1">
                    {currentPortfolio.qualityScorecard.sampleApprovalTurnaroundDays}d
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Fast-Track Agility</span>
                </div>
              </div>

              {currentPortfolio.operationalNotes && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <strong className="text-slate-900 font-heading text-sm block">Factory Operational Notes</strong>
                  <p>{currentPortfolio.operationalNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: STORE / UPDATE FACTORY DATA */}
          {activeTab === 'UPDATE_DATA' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#C8A96A]" />
                  <span>Time-to-Time Factory Data Entry &amp; Live Storage</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Record new audit certificates, add newly commissioned machinery, or register sub-supplier traceability links.
                </p>
              </div>

              {/* Form 1: Add Machine */}
              <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-[#1F3A2E] flex items-center gap-2 font-heading border-b border-slate-200 pb-2">
                  <Cpu className="w-4 h-4 text-[#C8A96A]" />
                  <span>Add Newly Commissioned Machine</span>
                </h4>
                <form onSubmit={handleAddMachine} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Machine Model &amp; Brand *</label>
                      <input
                        type="text"
                        required
                        value={newMachine.machineName}
                        onChange={(e) => setNewMachine({ ...newMachine, machineName: e.target.value })}
                        placeholder="e.g. Juki Automated Computerized Bar-Tack Machine"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Origin Country</label>
                      <input
                        type="text"
                        value={newMachine.originCountry}
                        onChange={(e) => setNewMachine({ ...newMachine, originCountry: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Quantity</label>
                      <input
                        type="number"
                        value={newMachine.quantity}
                        onChange={(e) => setNewMachine({ ...newMachine, quantity: parseInt(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Purpose / Process</label>
                      <input
                        type="text"
                        value={newMachine.purpose}
                        onChange={(e) => setNewMachine({ ...newMachine, purpose: e.target.value })}
                        placeholder="e.g. Heavy duty structural joins"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-white text-xs font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span>Add Machine to Roster</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Form 2: Add Compliance Audit */}
              <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-[#1F3A2E] flex items-center gap-2 font-heading border-b border-slate-200 pb-2">
                  <ShieldCheck className="w-4 h-4 text-[#C8A96A]" />
                  <span>Record Verified Audit Certificate</span>
                </h4>
                <form onSubmit={handleAddAudit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Standard / Certification *</label>
                      <input
                        type="text"
                        required
                        value={newAudit.standardName}
                        onChange={(e) => setNewAudit({ ...newAudit, standardName: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Rating / Grade *</label>
                      <input
                        type="text"
                        required
                        value={newAudit.ratingGrade}
                        onChange={(e) => setNewAudit({ ...newAudit, ratingGrade: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Audit Body</label>
                      <input
                        type="text"
                        value={newAudit.auditBody}
                        onChange={(e) => setNewAudit({ ...newAudit, auditBody: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Valid Until Date</label>
                      <input
                        type="date"
                        value={newAudit.validUntil}
                        onChange={(e) => setNewAudit({ ...newAudit, validUntil: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Report Number</label>
                      <input
                        type="text"
                        value={newAudit.reportNumber}
                        onChange={(e) => setNewAudit({ ...newAudit, reportNumber: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-white text-xs font-bold transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span>Save Audit Record</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
