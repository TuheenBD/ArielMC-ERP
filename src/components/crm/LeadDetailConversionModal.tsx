'use client';

import React, { useState } from 'react';
import { SolarLead } from '@/types/crm';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Zap,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Boxes,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Download,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface ProjectConversionPayload {
  leadId: string;
  projectCode: string;
  projectName: string;
  capacityKwp: number;
  projectValueBdt: number;
  structuralSubcontractor: string;
  mechanicalSubcontractor: string;
  electricalSubcontractor: string;
  pvModuleBrand: string;
  pvModuleWattage: number;
  pvModuleCount: number;
  inverterBrand: string;
  inverterCount: number;
  bankPfi: string;
  targetCodDate: string;
}

interface LeadDetailConversionModalProps {
  lead: SolarLead | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmConversion: (payload: ProjectConversionPayload) => void;
  theme?: string;
}

export const LeadDetailConversionModal: React.FC<LeadDetailConversionModalProps> = ({
  lead,
  isOpen,
  onClose,
  onConfirmConversion,
}) => {
  const [step, setStep] = useState<'DETAILS' | 'CONVERT_WIZARD' | 'SUCCESS'>('DETAILS');

  // Wizard state initialized when lead changes
  const [projectCode, setProjectCode] = useState('');
  const [structuralSub, setStructuralSub] = useState('Bureau of Structural Engineering & Research (BSER)');
  const [mechanicalSub, setMechanicalSub] = useState('Bengal Solar Mech & Civil Racking Works');
  const [electricalSub, setElectricalSub] = useState('Electro-Grid HT/LT Substation Engineers');
  const [bankPfi, setBankPfi] = useState('City Bank PLC (Lead PFI)');
  const [targetCodDate, setTargetCodDate] = useState('2027-02-15');

  if (!isOpen || !lead) return null;

  const currentProjectCode = projectCode || `AREL-PRJ-2026-${lead.id.split('-').pop() || '004'}`;
  const ratePerWp = (lead.projectValueBdt / (lead.estimatedCapacityKwp * 1000)).toFixed(2);
  const debt80 = Math.round(lead.projectValueBdt * 0.80);
  const equity20 = Math.round(lead.projectValueBdt * 0.20);
  const annualYieldKwh = lead.estimatedCapacityKwp * 1450;
  const annualSavingsBdt = Math.round(annualYieldKwh * 0.86 * 14.25 + annualYieldKwh * 0.14 * 10.50);

  const handleStartConversion = () => {
    setProjectCode(currentProjectCode);
    setStep('CONVERT_WIZARD');
  };

  const handleExecuteConversion = () => {
    const payload: ProjectConversionPayload = {
      leadId: lead.id,
      projectCode: currentProjectCode,
      projectName: `${lead.factoryName} ${lead.estimatedCapacityKwp} kWp Turnkey EPC`,
      capacityKwp: lead.estimatedCapacityKwp,
      projectValueBdt: lead.projectValueBdt,
      structuralSubcontractor: structuralSub,
      mechanicalSubcontractor: mechanicalSub,
      electricalSubcontractor: electricalSub,
      pvModuleBrand: lead.technical.moduleBrand,
      pvModuleWattage: lead.technical.moduleWattageW,
      pvModuleCount: lead.technical.moduleCount,
      inverterBrand: lead.technical.inverterBrand,
      inverterCount: lead.technical.inverterCount,
      bankPfi,
      targetCodDate,
    };

    onConfirmConversion(payload);
    setStep('SUCCESS');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#1A1A1A]">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-[#0A1A2F] text-white flex items-center justify-between border-b border-[#1B2D45] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black truncate">{lead.factoryName}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {lead.estimatedCapacityKwp} kWp
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {lead.id}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate">
                {lead.industrySector} &bull; {lead.location} &bull; Corridor: {lead.corridor}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          {/* STEP 1: LEAD DETAIL & TECHNICAL-COMMERCIAL VIEW */}
          {step === 'DETAILS' && (
            <div className="space-y-5">
              {/* Top Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 bg-[#FAF9F5] border border-[#DDE3DD] rounded-xl">
                  <span className="text-[10px] text-[#6B7269] uppercase font-sans block">CapEx Value</span>
                  <span className="text-sm font-black text-[#1F3A2E]">
                    Tk {(lead.projectValueBdt / 10000000).toFixed(2)} Cr
                  </span>
                  <span className="text-[10px] text-slate-500 block">Tk {ratePerWp} / Wp (25% Mgn)</span>
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#DDE3DD] rounded-xl">
                  <span className="text-[10px] text-[#6B7269] uppercase font-sans block">4.5% Bank Debt (80%)</span>
                  <span className="text-sm font-black text-emerald-700">
                    Tk {(debt80 / 10000000).toFixed(2)} Cr
                  </span>
                  <span className="text-[10px] text-slate-500 block">10y Tenor &bull; 1y Moratorium</span>
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#DDE3DD] rounded-xl">
                  <span className="text-[10px] text-[#6B7269] uppercase font-sans block">Client Equity (20%)</span>
                  <span className="text-sm font-black text-[#1A1A1A]">
                    Tk {(equity20 / 10000000).toFixed(2)} Cr
                  </span>
                  <span className="text-[10px] text-slate-500 block">Or Client ERQ USD LC</span>
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#DDE3DD] rounded-xl">
                  <span className="text-[10px] text-[#6B7269] uppercase font-sans block">Annual Savings</span>
                  <span className="text-sm font-black text-[#C9A86A]">
                    Tk {(annualSavingsBdt / 1000000).toFixed(2)}M / yr
                  </span>
                  <span className="text-[10px] text-slate-500 block">Payback: 3.9 Years</span>
                </div>
              </div>

              {/* SREDA 70% Cap Audit Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-900 text-xs">
                      SREDA Net-Metering 70% Sanctioned Load Audit Passed
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      Sanctioned Load: {lead.technical.sanctionedLoadKw} kW &bull; Maximum Allowed AC Capacity:{' '}
                      {Math.round(lead.technical.sanctionedLoadKw * 0.70)} kW &bull; Proposed AC:{' '}
                      {Math.round(lead.estimatedCapacityKwp / 1.20)} kW (Compliant)
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-mono font-bold text-[10px] shrink-0">
                  Pre-Approved
                </span>
              </div>

              {/* Technical Blueprint Two-Column Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: Substation & Grid Sync */}
                <div className="p-4 bg-white border border-[#DDE3DD] rounded-xl space-y-2.5">
                  <h4 className="font-bold text-[#1F3A2E] flex items-center gap-2 pb-1.5 border-b border-[#DDE3DD]">
                    <Cpu className="w-4 h-4 text-[#C9A86A]" />
                    <span>Substation &amp; Grid Interconnection Specs</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Supply Voltage</span>
                      <span className="font-bold font-mono">{lead.technical.supplyVoltage}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Utility DisCom</span>
                      <span className="font-bold">{lead.technical.utilityProvider}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Transformer Capacity</span>
                      <span className="font-bold font-mono">{lead.technical.transformerCapacityKva} kVA</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Earthing Resistance</span>
                      <span className="font-bold font-mono text-emerald-700">
                        {lead.technical.earthingResistanceOhm} &Omega; (&lt; 1.0 &Omega;)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Roof Substrate</span>
                      <span className="font-bold">{lead.technical.roofSubstrate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Accord/RSC Compliance</span>
                      <span className="font-bold text-emerald-700">Walkways Compliant</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Bill of Materials (BOM) Specs */}
                <div className="p-4 bg-white border border-[#DDE3DD] rounded-xl space-y-2.5">
                  <h4 className="font-bold text-[#1F3A2E] flex items-center gap-2 pb-1.5 border-b border-[#DDE3DD]">
                    <Boxes className="w-4 h-4 text-[#C9A86A]" />
                    <span>Hardware Specifications &amp; BOM Allocation</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Tier-1 PV Modules</span>
                      <span className="font-bold">{lead.technical.moduleBrand}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Module Rating &amp; Count</span>
                      <span className="font-bold font-mono">
                        {lead.technical.moduleWattageW} Wp &bull; {lead.technical.moduleCount.toLocaleString()} PCS
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Grid Inverters</span>
                      <span className="font-bold">{lead.technical.inverterBrand}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Inverter Units</span>
                      <span className="font-bold font-mono">
                        {lead.technical.inverterCapacityKw} kW &bull; {lead.technical.inverterCount} Units
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Mounting Racking</span>
                      <span className="font-bold">Kai AL6005-T5 Anodized</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Certifications</span>
                      <span className="font-bold text-emerald-700">BDS IEC 61215:2016</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Person Details */}
              <div className="p-3.5 bg-[#FAF9F5] border border-[#DDE3DD] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Contact Representative</span>
                    <span className="font-bold text-[#1A1A1A]">{lead.contactPerson} ({lead.designation})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Direct Phone</span>
                    <span className="font-mono font-bold text-emerald-800">{lead.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Email</span>
                    <span className="font-mono text-slate-700">{lead.email}</span>
                  </div>
                </div>

                <a
                  href="/documents/AREL_BNK_2026_FEAS_V1_Bankable_Feasibility_Study_Dossier.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-[#DDE3DD] text-[#1F3A2E] font-bold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-[#C9A86A]" />
                  <span>Download Bank Dossier</span>
                </a>
              </div>
            </div>
          )}

          {/* STEP 2: PROVISIONING CONFIRMATION WIZARD */}
          {step === 'CONVERT_WIZARD' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
                <div className="text-xs text-amber-900">
                  <strong>Turnkey EPC Project Provisioning Wizard</strong>: This action will transition{' '}
                  <span className="font-bold text-black">{lead.factoryName}</span> into an active turnkey project,
                  automatically creating its General Ledger, reserving inventory lot, assigning IEB subcontractors, and filing bank financing.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Project Reference & Commercials */}
                <div className="p-4 bg-[#FAF9F5] border border-[#DDE3DD] rounded-xl space-y-3">
                  <h4 className="font-bold text-[#1F3A2E] flex items-center gap-2 pb-1 border-b border-[#DDE3DD]">
                    <Building className="w-4 h-4 text-[#C9A86A]" />
                    <span>Project Identity &amp; Financials</span>
                  </h4>

                  <div>
                    <label className="text-[10.5px] text-slate-500 font-semibold block mb-1">
                      Turnkey Project Reference Code
                    </label>
                    <input
                      type="text"
                      value={projectCode}
                      onChange={(e) => setProjectCode(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#DDE3DD] rounded-lg font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10.5px] text-slate-500 font-semibold block mb-1">
                      Lead Financing Institution (PFI)
                    </label>
                    <select
                      value={bankPfi}
                      onChange={(e) => setBankPfi(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#DDE3DD] rounded-lg font-bold text-xs"
                    >
                      <option value="City Bank PLC (Lead PFI)">City Bank PLC (Lead PFI - 4.5% SFD)</option>
                      <option value="IDCOL Concessionary Window">IDCOL Concessionary Window (80:20 Debt)</option>
                      <option value="Prime Bank PLC">Prime Bank PLC (Green SCM Desk)</option>
                      <option value="Eastern Bank PLC">Eastern Bank PLC (Export Refinance)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10.5px] text-slate-500 font-semibold block mb-1">
                      Target Commercial Operation Date (COD)
                    </label>
                    <input
                      type="date"
                      value={targetCodDate}
                      onChange={(e) => setTargetCodDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#DDE3DD] rounded-lg font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                {/* 2. Subcontractor & IEB Engineering Allocation */}
                <div className="p-4 bg-[#FAF9F5] border border-[#DDE3DD] rounded-xl space-y-3">
                  <h4 className="font-bold text-[#1F3A2E] flex items-center gap-2 pb-1 border-b border-[#DDE3DD]">
                    <ShieldCheck className="w-4 h-4 text-[#C9A86A]" />
                    <span>Subcontractor &amp; IEB Engineering Bodies</span>
                  </h4>

                  <div>
                    <label className="text-[10.5px] text-slate-500 font-semibold block mb-1">
                      IEB Structural Engineering Firm
                    </label>
                    <select
                      value={structuralSub}
                      onChange={(e) => setStructuralSub(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#DDE3DD] rounded-lg text-xs"
                    >
                      <option value="Bureau of Structural Engineering & Research (BSER)">
                        Bureau of Structural Engineering &amp; Research (BSER) - Tk 75,000 / Site
                      </option>
                      <option value="AeroLiDAR Drone Geomatics Bangladesh">
                        AeroLiDAR Drone Geomatics Bangladesh - Tk 45,000 / Survey
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10.5px] text-slate-500 font-semibold block mb-1">
                      Civil &amp; Mechanical Mounting Contractor
                    </label>
                    <select
                      value={mechanicalSub}
                      onChange={(e) => setMechanicalSub(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#DDE3DD] rounded-lg text-xs"
                    >
                      <option value="Bengal Solar Mech & Civil Racking Works">
                        Bengal Solar Mech &amp; Civil Racking Works - Tk 1.80 / Wp (OSHA 30)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10.5px] text-slate-500 font-semibold block mb-1">
                      Electrical HT/LT Substation Contractor
                    </label>
                    <select
                      value={electricalSub}
                      onChange={(e) => setElectricalSub(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#DDE3DD] rounded-lg text-xs"
                    >
                      <option value="Electro-Grid HT/LT Substation Engineers">
                        Electro-Grid HT/LT Substation Engineers - Tk 2.20 / Wp (ABC License)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 5-Stage Milestone Waterfall Auto-Provisioning Matrix */}
              <div className="p-3.5 bg-white border border-[#DDE3DD] rounded-xl space-y-2">
                <span className="text-[10.5px] font-bold text-[#1F3A2E] uppercase font-mono block">
                  Automatic 5-Stage Milestone Billing Schedule (25.0% Gross Margin Lock)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10.5px] font-mono">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[9.5px]">M1: 15% Advance</span>
                    <span className="font-bold text-[#1F3A2E]">
                      Tk {(lead.projectValueBdt * 0.15 / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[9.5px]">M2: 40% SCM / Box 44</span>
                    <span className="font-bold text-[#1F3A2E]">
                      Tk {(lead.projectValueBdt * 0.40 / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[9.5px]">M3: 25% Site Mounting</span>
                    <span className="font-bold text-[#1F3A2E]">
                      Tk {(lead.projectValueBdt * 0.25 / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[9.5px]">M4: 15% HT/LT Grid</span>
                    <span className="font-bold text-[#1F3A2E]">
                      Tk {(lead.projectValueBdt * 0.15 / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[9.5px]">M5: 5% SREDA COD</span>
                    <span className="font-bold text-emerald-700">
                      Tk {(lead.projectValueBdt * 0.05 / 100000).toFixed(1)}L
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONVERSION COMPLETED SUCCESS SCREEN */}
          {step === 'SUCCESS' && (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-black text-[#1F3A2E]">
                  Turnkey EPC Project Successfully Provisioned!
                </h4>
                <p className="text-xs text-[#6B7269] mt-1 max-w-lg mx-auto">
                  <span className="font-bold text-[#1A1A1A]">{lead.factoryName}</span> has transitioned to{' '}
                  <span className="font-mono font-bold text-emerald-800">{currentProjectCode}</span>.
                  Hardware BOM has been reserved in Staging Lots, Subcontractor Work Orders issued, and 4.5% Bank Debt submitted.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#DDE3DD] max-w-md mx-auto text-left font-mono text-[11px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Project Code:</span>
                  <span className="font-bold text-[#1F3A2E]">{currentProjectCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contract CapEx:</span>
                  <span className="font-bold text-[#1A1A1A]">Tk {(lead.projectValueBdt / 10000000).toFixed(2)} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Audited Gross Margin:</span>
                  <span className="font-bold text-emerald-700">25.0% Locked</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Inventory Lot Reserved:</span>
                  <span className="font-bold text-[#1F3A2E]">LOT-2026-004 ({lead.technical.moduleCount} Modules)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Disbursement Window:</span>
                  <span className="font-bold text-slate-700">{bankPfi}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white font-bold text-xs transition cursor-pointer"
                >
                  Close &amp; Return to Workspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        {step !== 'SUCCESS' && (
          <div className="p-4 bg-slate-50 border-t border-[#DDE3DD] flex items-center justify-between shrink-0">
            {step === 'DETAILS' ? (
              <>
                <div className="text-[11px] text-[#6B7269]">
                  Stage: <strong className="text-[#1F3A2E] uppercase">{lead.stage.replace('_', ' ')}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg border border-[#DDE3DD] bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleStartConversion}
                    className="px-4 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>Convert to Turnkey EPC Project</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C9A86A]" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep('DETAILS')}
                  className="px-3 py-1.5 rounded-lg border border-[#DDE3DD] bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  &larr; Back to Details
                </button>
                <button
                  type="button"
                  onClick={handleExecuteConversion}
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Confirm &amp; Provision Project</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadDetailConversionModal;

