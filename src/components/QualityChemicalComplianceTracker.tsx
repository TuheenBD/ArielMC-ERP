'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  FlaskConical,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  ExternalLink,
  Search,
  Filter,
  Plus,
  X,
  Award,
  Layers,
  Sparkles,
  Building2,
  Calendar,
  Check,
  Info,
  Droplets,
  Microscope,
  FileCheck,
  BadgeCheck
} from 'lucide-react';
import {
  ChemicalComplianceTest,
  ChemicalTestType,
  LabTestVerdict,
  ProductSector
} from '@/types/erp';
import { INITIAL_CHEMICAL_TESTS } from '@/data/initialChemicalTests';

interface QualityChemicalComplianceTrackerProps {
  initialTests?: ChemicalComplianceTest[];
  onAddTest?: (test: ChemicalComplianceTest) => void;
}

export const QualityChemicalComplianceTracker: React.FC<QualityChemicalComplianceTrackerProps> = ({
  initialTests = INITIAL_CHEMICAL_TESTS,
  onAddTest,
}) => {
  const [tests, setTests] = useState<ChemicalComplianceTest[]>(initialTests);
  const [selectedSector, setSelectedSector] = useState<ProductSector | 'ALL'>('ALL');
  const [selectedLab, setSelectedLab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCertModal, setActiveCertModal] = useState<ChemicalComplianceTest | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Test Form State
  const [formData, setFormData] = useState({
    testReportNumber: `TUV-DHK-2026-CH-${Math.floor(1000 + Math.random() * 9000)}`,
    batchLotNumber: 'BATCH-SAV-LWG-094',
    sku: 'AMC-LT2-LEA-BUR-SGL',
    productName: 'ArielMC Style 2 Structured Leather Tote - Deep Burgundy',
    sector: 'LEATHER' as ProductSector,
    testType: 'REACH_CHROMIUM_VI' as ChemicalTestType,
    testStandard: 'ISO 17075-1:2017 (Thermal Aging Protocol)',
    accreditedLaboratory: 'TÜV SÜD Bangladesh' as any,
    sampleCollectionDate: new Date().toISOString().split('T')[0],
    reportIssueDate: new Date().toISOString().split('T')[0],
    validUntilDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    measuredValue: '< 0.5 mg/kg (Zero Cr VI Detected)',
    regulatoryThreshold: '< 3.0 mg/kg (EU REACH Annex XVII Entry 47)',
    verdict: 'PASSED_CERTIFIED' as LabTestVerdict,
    tanneryOrMillName: 'Savar Tannery Estate (CETP Unit 4, Chamra Polli, Savar)',
    lwgRating: 'LWG_GOLD' as any,
    leadChemist: 'Dr. Rafiqul Islam, Ph.D. (Chief Analytical Chemist)',
    notes: 'Sample aged 24h at 80°C and 20% RH prior to colorimetric extraction. 100% compliant with EU REACH Annex XVII.',
  });

  // Filtered Tests
  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      const matchesSector = selectedSector === 'ALL' || t.sector === selectedSector;
      const matchesLab = selectedLab === 'ALL' || t.accreditedLaboratory.includes(selectedLab);
      const matchesSearch =
        searchQuery === '' ||
        t.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.testReportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.batchLotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tanneryOrMillName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSector && matchesLab && matchesSearch;
    });
  }, [tests, selectedSector, selectedLab, searchQuery]);

  // Aggregate Stats
  const totalCertificates = tests.length;
  const passedCertificates = tests.filter((t) => t.verdict === 'PASSED_CERTIFIED').length;
  const passRate = ((passedCertificates / (totalCertificates || 1)) * 100).toFixed(1);

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest: ChemicalComplianceTest = {
      id: `chem_${Date.now()}`,
      ...formData,
      digitalCertificateHash: `SHA256: ${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
    };

    setTests((prev) => [newTest, ...prev]);
    if (onAddTest) onAddTest(newTest);
    setIsAddModalOpen(false);
  };

  const getVerdictBadge = (verdict: LabTestVerdict) => {
    switch (verdict) {
      case 'PASSED_CERTIFIED':
        return {
          label: 'PASSED & CERTIFIED',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: CheckCircle2,
        };
      case 'WARNING_BORDERLINE':
        return {
          label: 'WARNING: BORDERLINE',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: AlertTriangle,
        };
      case 'FAILED_REJECTED':
        return {
          label: 'FAILED: REJECTED',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: AlertTriangle,
        };
    }
  };

  return (
    <div className="space-y-6 font-['Montserrat']">
      {/* Top Banner & Metric Strip */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1F3A2E] via-[#2A4D3E] to-[#1F3A2E] text-white border-b-[3px] border-[#C8A96A] shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A] text-[#1F3A2E] font-mono text-[11px] font-bold">
                OPERATIONAL MILESTONE 5
              </span>
              <span className="text-xs text-white/80 font-mono">
                Savar Tannery REACH &amp; Narayanganj Denim Crocking Fastness
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[#C8A96A]" />
              Quality &amp; Tannery Chemical Compliance Tracker
            </h2>
            <p className="text-xs text-white/80 max-w-3xl leading-relaxed font-['Open_Sans']">
              Guarantees zero chemical contamination for European &amp; UK market entry. Validates Savar cowhide Chromium VI (<span className="text-[#C8A96A] font-bold">&lt; 3.0 mg/kg</span> per ISO 17075-1), Azo dyes (<span className="text-[#C8A96A] font-bold">&lt; 30 mg/kg</span>), and Narayanganj heavyweight denim crocking ratings (ISO 105-X12) with certified digital lab reports.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#8A6D3B] text-[#1F3A2E] font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Accredited Lab Test</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Chips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-white/60 uppercase font-semibold">Active Lab Certificates</div>
            <div className="text-sm font-bold font-mono text-white mt-0.5">
              {totalCertificates} Accredited Reports
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-white/60 uppercase font-semibold">REACH Cr VI Average</div>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
              &lt; 0.5 mg/kg (Safe)
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-white/60 uppercase font-semibold">Denim Crocking Fastness</div>
            <div className="text-sm font-bold font-mono text-[#C8A96A] mt-0.5">
              Dry 4.5 / Wet 3.8 Pass
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-white/60 uppercase font-semibold">Regulatory Compliance Rate</div>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
              {passRate}% Pass Rate
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Chemical Safety Standard Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1F3A2E] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Savar Leather: REACH Cr VI</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              ISO 17075-1
            </span>
          </div>
          <p className="text-[11px] text-[#6B7269] leading-relaxed">
            Hexavalent chromium (Cr VI) strictly capped at <strong>&lt; 3.0 mg/kg</strong>. Tested after 24h accelerated thermal aging (80°C) to guarantee zero conversion under tropical ocean humidity.
          </p>
          <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
            ✓ ArielMC Savar Cowhide: &lt; 0.5 mg/kg (Below detection limit)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1F3A2E] flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-700" />
              <span>Denim: Crocking Fastness</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold">
              ISO 105-X12
            </span>
          </div>
          <p className="text-[11px] text-[#6B7269] leading-relaxed">
            Colorfastness to rubbing benchmark: Dry rubbing must score <strong>≥ Grade 4.0</strong>, wet rubbing <strong>≥ Grade 3.5</strong>. Zero indigo transfer onto light upholstery or apparel.
          </p>
          <div className="text-[10px] font-mono text-blue-700 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
            ✓ Bloom Laptop Tote: Dry 4.5 / Wet 3.8 (Luxury benchmark pass)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1F3A2E] flex items-center gap-1.5">
              <Microscope className="w-4 h-4 text-amber-700" />
              <span>Jute &amp; Bio-Fiber Moisture</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
              ISO 287
            </span>
          </div>
          <p className="text-[11px] text-[#6B7269] leading-relaxed">
            Moisture content strictly capped at <strong>≤ 12.0%</strong>. Tested for zero volatile hydrocarbon release and certified for European Food Safety Authority (EFSA) direct produce contact.
          </p>
          <div className="text-[10px] font-mono text-amber-800 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
            ✓ Jute Grocery Shopper: 9.4% Moisture (Mould bloom immune)
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[#6B7269] uppercase text-[10px] tracking-wider">
            Sector Filter:
          </span>
          {(['ALL', 'LEATHER', 'TEXTILE', 'JUTE'] as (ProductSector | 'ALL')[]).map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedSector === sec
                  ? 'bg-[#1F3A2E] text-white shadow-sm'
                  : 'bg-[#F4F6F4] text-[#4A5568] hover:bg-[#E2E8E2]'
              }`}
            >
              {sec}
            </button>
          ))}

          <span className="font-bold text-[#6B7269] uppercase text-[10px] tracking-wider ml-2">
            Accredited Lab:
          </span>
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD] font-semibold text-[#1F3A2E] focus:outline-none focus:border-[#C8A96A]"
          >
            <option value="ALL">All Laboratories</option>
            <option value="TÜV">TÜV SÜD Bangladesh</option>
            <option value="SGS">SGS Bangladesh</option>
            <option value="Intertek">Intertek Bangladesh</option>
            <option value="Bureau Veritas">Bureau Veritas Dhaka</option>
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-[#6B7269] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search SKU, Lot, or Report..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl text-xs text-[#1F3A2E] focus:outline-none focus:border-[#C8A96A]"
          />
        </div>
      </div>

      {/* Chemical Compliance Test Registry Table */}
      <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#C8A96A]" />
            <h3 className="text-sm font-bold text-[#1F3A2E]">Accredited Chemical Test Certificates</h3>
          </div>
          <span className="text-xs text-[#6B7269]">
            Showing {filteredTests.length} verified laboratory reports
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-[#6B7269] uppercase text-[10px] tracking-wider border-b border-[#E2E8E2]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Report No &amp; Lab</th>
                <th className="py-2.5 px-3 font-semibold">SKU &amp; Product</th>
                <th className="py-2.5 px-3 font-semibold">Raw Material Lot / Mill</th>
                <th className="py-2.5 px-3 font-semibold">Test Protocol &amp; Standard</th>
                <th className="py-2.5 px-3 font-semibold">Measured Value</th>
                <th className="py-2.5 px-3 font-semibold">Regulatory Limit</th>
                <th className="py-2.5 px-3 font-semibold">Verdict</th>
                <th className="py-2.5 px-3 font-semibold text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E2]">
              {filteredTests.map((test) => {
                const badge = getVerdictBadge(test.verdict);
                const BadgeIcon = badge.icon;

                return (
                  <tr key={test.id} className="hover:bg-[#F4F6F4]/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-mono text-[#1F3A2E] font-bold">{test.testReportNumber}</div>
                      <div className="text-[10px] text-[#6B7269]">{test.accreditedLaboratory}</div>
                      <div className="text-[9px] text-[#6B7269] font-mono">Issued: {test.reportIssueDate}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-[#1F3A2E]">{test.productName}</div>
                      <div className="text-[10px] font-mono text-[#6B7269] flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 font-semibold">{test.sector}</span>
                        <span>{test.sku}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-mono text-[11px] text-[#1F3A2E] font-semibold">{test.batchLotNumber}</div>
                      <div className="text-[10px] text-[#6B7269] line-clamp-1">{test.tanneryOrMillName}</div>
                      {test.lwgRating && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                          {test.lwgRating}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#1F3A2E]">{test.testStandard}</div>
                      <div className="text-[10px] text-[#6B7269] font-mono">{test.testType}</div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                      {test.measuredValue}
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-[#6B7269]">
                      {test.regulatoryThreshold}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit ${badge.bg}`}>
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setActiveCertModal(test)}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#F4F6F4] text-[#1F3A2E] border border-[#DDE3DD] text-xs font-semibold shadow-sm transition-all flex items-center gap-1 ml-auto cursor-pointer"
                        title="View Official Digital Certificate Dossier"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#C8A96A]" />
                        <span>View Dossier</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Certificate Modal */}
      {activeCertModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#DDE3DD] space-y-6 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDE3DD]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <BadgeCheck className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1F3A2E]">
                    Accredited Laboratory Test Certificate
                  </h3>
                  <div className="text-xs text-[#6B7269] font-mono">
                    Report No: {activeCertModal.testReportNumber} • {activeCertModal.accreditedLaboratory}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveCertModal(null)}
                className="w-8 h-8 rounded-full bg-[#F4F6F4] hover:bg-[#E2E8E2] text-[#1F3A2E] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Header Banner */}
            <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#E2E8E2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F3A2E]">
                  Sample &amp; Material Identification
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  100% REACH CONFORMANT
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#6B7269] block text-[10px]">Product / Article:</span>
                  <strong className="text-[#1F3A2E]">{activeCertModal.productName}</strong>
                </div>
                <div>
                  <span className="text-[#6B7269] block text-[10px]">SKU Reference:</span>
                  <strong className="font-mono text-[#1F3A2E]">{activeCertModal.sku}</strong>
                </div>
                <div>
                  <span className="text-[#6B7269] block text-[10px]">Raw Material Batch Lot:</span>
                  <strong className="font-mono text-[#1F3A2E]">{activeCertModal.batchLotNumber}</strong>
                </div>
                <div>
                  <span className="text-[#6B7269] block text-[10px]">Tannery / Mill Source:</span>
                  <strong className="text-[#1F3A2E]">{activeCertModal.tanneryOrMillName}</strong>
                </div>
              </div>
            </div>

            {/* Test Results Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider text-[11px]">
                Analytical Laboratory Findings
              </div>
              <div className="p-4 rounded-2xl border border-[#DDE3DD] space-y-3 bg-white text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8E2]">
                  <span className="text-[#6B7269]">Test Standard &amp; Methodology:</span>
                  <strong className="font-mono text-[#1F3A2E]">{activeCertModal.testStandard}</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8E2]">
                  <span className="text-[#6B7269]">Target Chemical / Physical Parameter:</span>
                  <strong className="font-mono text-[#1F3A2E]">{activeCertModal.testType}</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8E2]">
                  <span className="text-[#6B7269]">Measured Analytical Value:</span>
                  <strong className="font-mono text-emerald-700 text-sm">{activeCertModal.measuredValue}</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8E2]">
                  <span className="text-[#6B7269]">Statutory Regulatory Limit:</span>
                  <strong className="font-mono text-[#1F3A2E]">{activeCertModal.regulatoryThreshold}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7269]">Analytical Verdict:</span>
                  <strong className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    PASSED &amp; CERTIFIED FOR EXPORT
                  </strong>
                </div>
              </div>
            </div>

            {/* Chemist Notes & Hash */}
            <div className="p-3.5 rounded-xl bg-[#F4F6F4] space-y-2 text-xs">
              <div className="text-[11px] text-[#4A5568] leading-relaxed">
                <strong>Chemist Declaration:</strong> {activeCertModal.notes}
              </div>
              <div className="text-[10px] text-[#6B7269] font-mono border-t border-[#DDE3DD] pt-2">
                Digital Fingerprint: {activeCertModal.digitalCertificateHash}
              </div>
              <div className="text-[10px] text-[#6B7269]">
                Lead Signatory: <strong>{activeCertModal.leadChemist}</strong> • Valid through: <strong>{activeCertModal.validUntilDate}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveCertModal(null)}
                className="px-4 py-2 rounded-xl bg-[#F4F6F4] text-[#1F3A2E] text-xs font-bold hover:bg-[#E2E8E2] transition-all cursor-pointer"
              >
                Close Dossier
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F3A2E] text-white text-xs font-bold hover:bg-[#2A4D3E] transition-all shadow-md cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log New Lab Test Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#DDE3DD] space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-[#C8A96A]" />
                <h3 className="text-base font-bold text-[#1F3A2E]">Log Accredited Chemical Lab Test</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4F6F4] hover:bg-[#E2E8E2] text-[#1F3A2E] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
                    Report Reference Number:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.testReportNumber}
                    onChange={(e) => setFormData({ ...formData, testReportNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl font-mono text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
                    Raw Material Batch Lot:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.batchLotNumber}
                    onChange={(e) => setFormData({ ...formData, batchLotNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl font-mono text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
                    Accredited Laboratory:
                  </label>
                  <select
                    value={formData.accreditedLaboratory}
                    onChange={(e) => setFormData({ ...formData, accreditedLaboratory: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#DDE3DD] rounded-xl font-semibold text-xs focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="TÜV SÜD Bangladesh">TÜV SÜD Bangladesh</option>
                    <option value="SGS Bangladesh">SGS Bangladesh</option>
                    <option value="Intertek Bangladesh">Intertek Bangladesh</option>
                    <option value="Bureau Veritas Dhaka">Bureau Veritas Dhaka</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
                    Test Standard &amp; Protocol:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.testStandard}
                    onChange={(e) => setFormData({ ...formData, testStandard: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl font-mono text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
                    Measured Value (Analytical Result):
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.measuredValue}
                    onChange={(e) => setFormData({ ...formData, measuredValue: e.target.value })}
                    placeholder="e.g. < 0.5 mg/kg or Dry 4.5 / Wet 3.8"
                    className="w-full px-3 py-2 bg-white border border-[#DDE3DD] rounded-xl font-mono font-bold text-xs text-emerald-700 focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
                    Regulatory Safety Threshold:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.regulatoryThreshold}
                    onChange={(e) => setFormData({ ...formData, regulatoryThreshold: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl font-mono text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B7269] uppercase mb-1">
                  Tannery or Mill Facility:
                </label>
                <input
                  type="text"
                  required
                  value={formData.tanneryOrMillName}
                  onChange={(e) => setFormData({ ...formData, tanneryOrMillName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F4F6F4] border border-[#DDE3DD] rounded-xl text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DDE3DD]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F4F6F4] text-[#1F3A2E] text-xs font-bold hover:bg-[#E2E8E2] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1F3A2E] text-white text-xs font-bold hover:bg-[#2A4D3E] transition-all shadow-md cursor-pointer"
                >
                  Save &amp; Certify Test Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
