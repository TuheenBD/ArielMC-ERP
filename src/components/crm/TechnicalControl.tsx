'use client';

import React, { useState } from 'react';
import { SolarLead } from '@/types/crm';
import {
  Cpu,
  Layers,
  Zap,
  Building,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  FileCheck,
  Download,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface TechnicalControlProps {
  leads: SolarLead[];
  activeLeadId?: string;
  onSelectLeadId: (id: string) => void;
  onUpdateLeadTechnical: (leadId: string, updatedTech: SolarLead['technical']) => void;
}

export default function TechnicalControl({
  leads,
  activeLeadId,
  onSelectLeadId,
  onUpdateLeadTechnical,
}: TechnicalControlProps) {
  const selectedLead = leads.find((l) => l.id === activeLeadId) || leads[0];

  const [techData, setTechData] = useState<SolarLead['technical']>(
    selectedLead?.technical
  );

  // Sync if lead changes
  React.useEffect(() => {
    if (selectedLead) {
      setTechData(selectedLead.technical);
    }
  }, [selectedLead]);

  if (!selectedLead || !techData) {
    return <div className="p-8 text-center text-slate-500">No factory lead selected.</div>;
  }

  const handleSave = () => {
    onUpdateLeadTechnical(selectedLead.id, techData);
    alert(`Technical specifications saved for ${selectedLead.factoryName}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Selector Bar: Select Active Factory */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#0A1A2F] text-[#C9A86A] flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
              Active Engineering Profile
            </span>
            <select
              value={selectedLead.id}
              onChange={(e) => onSelectLeadId(e.target.value)}
              className="font-bold text-sm text-[#0A1A2F] bg-transparent focus:outline-none cursor-pointer"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.factoryName} ({l.estimatedCapacityKwp} kWp • {l.location})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Callout */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-sans">SREDA Status</span>
            <span className="text-xs font-bold text-emerald-700 font-mono">
              {techData.sredaApplicationStatus}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
          >
            Save Technical Spec
          </button>
        </div>
      </div>

      {/* Grid: 4 Core Technical Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PILLAR 1: CIVIL & STRUCTURAL ROOFTOP AUDIT */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-700" />
              <h4 className="text-sm font-bold text-[#0A1A2F] uppercase tracking-wider">
                1. Civil &amp; Structural Rooftop Audit
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Accord / RSC Scope
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Roof Substrate</label>
              <select
                value={techData.roofSubstrate}
                onChange={(e) => setTechData({ ...techData, roofSubstrate: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
              >
                <option value="Corrugated Metal PEB Shed">Corrugated Metal PEB Shed</option>
                <option value="Standing Seam Metal">Standing Seam Metal (No-Drill)</option>
                <option value="RCC Concrete Slab">RCC Concrete Slab</option>
                <option value="Pre-Engineered Steel Truss">Pre-Engineered Steel Truss</option>
                <option value="Curved Arch Metal">Curved Arch Metal</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Structural Health</label>
              <select
                value={techData.roofCondition}
                onChange={(e) => setTechData({ ...techData, roofCondition: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
              >
                <option value="Excellent">Excellent (Deadload &gt; 20 kg/m²)</option>
                <option value="Good - Requires minor repair">Good - Minor Purlin Strengthening</option>
                <option value="Structural reinforcement required">Reinforcement Required</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Azimuth &amp; Tilt Angle</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={techData.azimuthDeg}
                  onChange={(e) => setTechData({ ...techData, azimuthDeg: Number(e.target.value) })}
                  className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  placeholder="Azimuth"
                />
                <input
                  type="number"
                  value={techData.tiltAngleDeg}
                  onChange={(e) => setTechData({ ...techData, tiltAngleDeg: Number(e.target.value) })}
                  className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  placeholder="Tilt °"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">180° = South, 10°–15° Optimal</span>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Shading Loss Model (%)</label>
              <input
                type="number"
                step="0.1"
                value={techData.shadingLossPct}
                onChange={(e) => setTechData({ ...techData, shadingLossPct: Number(e.target.value) })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">3D Near-horizon obstacle simulation</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium">Accord / RSC Fire Egress Walkways (1.2m)</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={techData.accordRscWalkwaysCompliant}
                onChange={(e) => setTechData({ ...techData, accordRscWalkwaysCompliant: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* PILLAR 2: ELECTRICAL SUBSTATION & GRID SYNCHRONIZATION */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold text-[#0A1A2F] uppercase tracking-wider">
                2. Electrical Substation &amp; Interconnection
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Utility Interconnection
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Utility Distribution Zone</label>
              <select
                value={techData.utilityProvider}
                onChange={(e) => setTechData({ ...techData, utilityProvider: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
              >
                <option value="BREB">BREB (Rural Electrification Board)</option>
                <option value="BPDB">BPDB (Power Development Board)</option>
                <option value="DESCO">DESCO (Dhaka Electric Supply)</option>
                <option value="DPDC">DPDC (Dhaka Power Distribution)</option>
                <option value="WZPDCL">WZPDCL (West Zone Power)</option>
                <option value="NESCO">NESCO (Northern Electricity)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Distribution Voltage</label>
              <select
                value={techData.supplyVoltage}
                onChange={(e) => setTechData({ ...techData, supplyVoltage: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
              >
                <option value="11 kV">11 kV (HT Dedicated Feeder)</option>
                <option value="33 kV">33 kV (Bulk Industrial Consumer)</option>
                <option value="415 V (LT)">415 V (LT Low Tension)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Sanctioned Load (kW)</label>
              <input
                type="number"
                value={techData.sanctionedLoadKw}
                onChange={(e) => setTechData({ ...techData, sanctionedLoadKw: Number(e.target.value) })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Transformer Capacity (kVA)</label>
              <input
                type="number"
                value={techData.transformerCapacityKva}
                onChange={(e) => setTechData({ ...techData, transformerCapacityKva: Number(e.target.value) })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase">Earthing Pit Resistance</span>
              <span className="font-bold text-emerald-700 font-mono text-sm">
                {techData.earthingResistanceOhm} Ω (Target ≤ 1.0 Ω)
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase">HT Breaker Bay</span>
              <span className="font-bold text-[#0A1A2F] text-sm">
                {techData.availableBreakerBay ? 'Available Spare Bay' : 'Bus Coupler Needed'}
              </span>
            </div>
          </div>
        </div>

        {/* PILLAR 3: BILL OF QUANTITIES (BOM) & EQUIPMENT ARCHITECTURE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-[#0A1A2F] uppercase tracking-wider">
                3. Tier-1 Equipment Sizing &amp; BOM Architecture
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              DC/AC Loading: {techData.dcAcRatio}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800">Photovoltaic Modules</span>
                <span className="font-mono text-emerald-700 font-bold">{techData.moduleCount} Units</span>
              </div>
              <p className="text-slate-600 font-light text-[11px]">
                {techData.moduleBrand} ({techData.moduleWattageW}W N-Type TOPCon Bifacial). Total DC capacity: {(techData.moduleCount * techData.moduleWattageW / 1000).toFixed(1)} kWp.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800">String Inverters</span>
                <span className="font-mono text-[#0A1A2F] font-bold">{techData.inverterCount} Inverters</span>
              </div>
              <p className="text-slate-600 font-light text-[11px]">
                {techData.inverterBrand} ({techData.inverterCapacityKw} kW units). Total AC power: {(techData.inverterCount * techData.inverterCapacityKw)} kW.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-slate-500 font-sans block">Performance Ratio (PR)</span>
                <span className="font-bold text-emerald-800 text-sm">{techData.performanceRatioPct}%</span>
              </div>
              <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200">
                <span className="text-[10px] text-slate-500 font-sans block">Annual Solar Output</span>
                <span className="font-bold text-blue-900 text-sm">{techData.annualYieldMwh.toLocaleString()} MWh/yr</span>
              </div>
            </div>
          </div>
        </div>

        {/* PILLAR 4: SREDA REGULATORY NET-METERING MILESTONES */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-[#0A1A2F] uppercase tracking-wider">
                4. SREDA Net-Metering &amp; Grid Synchronization
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              Tk 10.50 Buyback Lock
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Regulatory Milestone Stage</label>
              <select
                value={techData.sredaApplicationStatus}
                onChange={(e) => setTechData({ ...techData, sredaApplicationStatus: e.target.value as any })}
                className="w-full p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 font-bold"
              >
                <option value="Not Started">1. Not Started</option>
                <option value="Submitted to SREDA">2. Interconnection Application Submitted</option>
                <option value="Utility Inspection Completed">3. Joint Witness Testing Completed</option>
                <option value="Bi-Directional Meter Calibrated">4. Class 0.2s Smart Meter Calibrated</option>
                <option value="COD Commissioned (Tk 10.50 Locked)">5. Commercial Operation (Tk 10.50 20-Yr Locked!)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Application Date</label>
                <input
                  type="date"
                  value={techData.sredaApplicationDate || ''}
                  onChange={(e) => setTechData({ ...techData, sredaApplicationDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Target COD Commissioning</label>
                <input
                  type="date"
                  value={techData.targetCodDate}
                  onChange={(e) => setTechData({ ...techData, targetCodDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs font-bold text-red-600"
                />
              </div>
            </div>

            {/* Statutory Reminder Alert */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">February 28, 2027 Policy Threshold</strong>
                <span className="text-[11px] font-light leading-relaxed">
                  Interconnection approval and smart meter energization must conclude prior to this statutory cutoff to lock in the 20-year guaranteed Tk 10.50/kWh weekend export buyback.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

