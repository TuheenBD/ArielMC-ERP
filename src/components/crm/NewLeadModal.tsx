'use client';

import React, { useState } from 'react';
import { SolarLead } from '@/types/crm';
import {
  X,
  Building,
  Plus,
  Zap,
  CheckCircle2,
  Tag,
  PlusCircle,
  Check,
  Sparkles,
  MapPin,
  User,
  Phone,
  Layers,
  DollarSign,
  Maximize2,
} from 'lucide-react';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (newLead: SolarLead) => void;
}

export default function NewLeadModal({ isOpen, onClose, onAddLead }: NewLeadModalProps) {
  // Master Sector Options List (Extensible dynamically)
  const [sectorOptions, setSectorOptions] = useState<string[]>([
    'RMG / Apparel',
    'Textiles & Dyeing',
    'Steel & Heavy Engineering',
    'Leather & Footwear',
    'Ceramics & Tableware',
    'Jute & Natural Fiber',
    'Agro & Food Processing',
    'Pharmaceuticals',
    'Heavy Packaging',
    'Commercial & Corporate',
  ]);

  const [formData, setFormData] = useState({
    factoryName: '',
    parentGroup: '',
    industrySector: 'RMG / Apparel' as SolarLead['industrySector'],
    location: 'Gazipur Industrial Zone',
    corridor: 'Dhaka / Gazipur / Savar' as SolarLead['corridor'],
    contactPerson: '',
    designation: 'Managing Director / Director',
    phone: '',
    email: '',
    roofAreaSqFt: 40000,
    monthlyBillBdt: 1200000,
    roofSubstrate: 'Corrugated Metal PEB Shed' as SolarLead['technical']['roofSubstrate'],
    utilityProvider: 'BREB' as SolarLead['technical']['utilityProvider'],
    priority: 'High' as SolarLead['priority'],
  });

  const [isOtherSector, setIsOtherSector] = useState(false);
  const [customSectorInput, setCustomSectorInput] = useState('');
  const [isEnlistMode, setIsEnlistMode] = useState(false);

  if (!isOpen) return null;

  const handleSectorChange = (val: string) => {
    if (val === 'Other, Pls mention') {
      setIsOtherSector(true);
      if (customSectorInput.trim()) {
        setFormData((prev) => ({ ...prev, industrySector: customSectorInput.trim() }));
      }
    } else {
      setIsOtherSector(false);
      setIsEnlistMode(false);
      setFormData((prev) => ({ ...prev, industrySector: val as any }));
    }
  };

  const handleEnlistCustomSector = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSectorInput.trim();
    if (!trimmed) return;

    if (!sectorOptions.includes(trimmed)) {
      setSectorOptions((prev) => [...prev, trimmed]);
    }
    setFormData((prev) => ({ ...prev, industrySector: trimmed }));
    setIsOtherSector(false);
    setIsEnlistMode(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine final industry sector
    const finalSector =
      isOtherSector || isEnlistMode
        ? customSectorInput.trim() || 'Other / Specialized Sector'
        : formData.industrySector;

    // Auto-compute kWp and project valuation
    const grossAreaM2 = formData.roofAreaSqFt / 10.7639;
    const netUsableM2 = grossAreaM2 * 0.85;
    const capacityKwp = Math.max(25, Math.round(netUsableM2 / 6.8));
    const projectValueBdt = capacityKwp * 51600; // Tk 51.60/Wp turnkey
    const annualGenKwh = capacityKwp * 1450;

    const newLead: SolarLead = {
      id: `AREL-LEAD-${Date.now().toString().slice(-4)}`,
      factoryName: formData.factoryName,
      parentGroup: formData.parentGroup || undefined,
      industrySector: finalSector,
      location: formData.location,
      corridor: formData.corridor,
      contactPerson: formData.contactPerson,
      designation: formData.designation,
      phone: formData.phone,
      email: formData.email,
      roofAreaSqFt: Number(formData.roofAreaSqFt),
      monthlyBillBdt: Number(formData.monthlyBillBdt),
      estimatedCapacityKwp: capacityKwp,
      projectValueBdt: projectValueBdt,
      stage: 'inbound',
      priority: formData.priority,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      notes: ['Lead onboarded into Ariel Renewable Energy CRM.'],
      technical: {
        roofSubstrate: formData.roofSubstrate,
        roofCondition: 'Excellent',
        azimuthDeg: 180,
        tiltAngleDeg: 12,
        shadingLossPct: 2.0,
        structuralLoadKgM2: 24,
        accordRscWalkwaysCompliant: true,
        sanctionedLoadKw: Math.round(capacityKwp * 1.5),
        supplyVoltage: '11 kV',
        utilityProvider: formData.utilityProvider,
        transformerCapacityKva: Math.round(capacityKwp * 1.8),
        availableBreakerBay: true,
        earthingResistanceOhm: 0.7,
        moduleBrand: 'JinkoSolar Tiger Neo',
        moduleWattageW: 585,
        moduleCount: Math.round((capacityKwp * 1000) / 585),
        inverterBrand: 'Huawei SUN2000',
        inverterCapacityKw: 100,
        inverterCount: Math.max(1, Math.round(capacityKwp / 100)),
        dcAcRatio: 1.22,
        performanceRatioPct: 82.0,
        annualYieldMwh: Math.round(annualGenKwh / 1000),
        sredaApplicationStatus: 'Not Started',
        targetCodDate: '2027-01-31',
        netMeteringTariffBdt: 10.5,
      },
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fadeIn">
      {/* Frosted Glass Modal Container with onMouseOver Specular Glass Sheen */}
      <div className="relative w-full max-w-xl bg-white/85 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] p-6 sm:p-7 text-slate-800 max-h-[90vh] overflow-y-auto transition-all duration-300 hover:shadow-[0_30px_70px_-10px_rgba(16,185,129,0.22)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-xl bg-white/40 hover:bg-white/90 hover:backdrop-blur-md border border-white/50 hover:border-slate-300 shadow-2xs hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 w-fit text-xs font-bold uppercase tracking-wider text-emerald-800">
          <Building className="w-3.5 h-3.5 text-emerald-600" />
          <span>Onboard New Industrial Lead</span>
        </div>
        <h3 className="text-xl font-black text-[#0A1A2F] mb-4 tracking-tight">
          Add Factory Account to Ariel Energy CRM
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Factory Name & Parent Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>Factory Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ha-Meem Denim Mills Ltd"
                value={formData.factoryName}
                onChange={(e) => setFormData({ ...formData, factoryName: e.target.value })}
                className="w-full p-2.5 bg-white/70 backdrop-blur-sm border border-slate-200/90 rounded-xl text-slate-800 font-medium transition-all duration-300 hover:bg-white/95 hover:backdrop-blur-md hover:border-emerald-400 hover:shadow-[0_6px_20px_rgba(16,185,129,0.12)] hover:-translate-y-0.5 focus:bg-white focus:border-emerald-600 focus:shadow-[0_6px_20px_rgba(16,185,129,0.18)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Parent Group (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ha-Meem Group"
                value={formData.parentGroup}
                onChange={(e) => setFormData({ ...formData, parentGroup: e.target.value })}
                className="w-full p-2.5 bg-white/70 backdrop-blur-sm border border-slate-200/90 rounded-xl text-slate-800 font-medium transition-all duration-300 hover:bg-white/95 hover:backdrop-blur-md hover:border-emerald-400 hover:shadow-[0_6px_20px_rgba(16,185,129,0.12)] hover:-translate-y-0.5 focus:bg-white focus:border-emerald-600 focus:shadow-[0_6px_20px_rgba(16,185,129,0.18)] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Industry / Sector with "Other, Pls mention" & Enlist New Sector Option */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Industry / Sector *</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsEnlistMode(!isEnlistMode);
                    if (!isEnlistMode) setIsOtherSector(true);
                  }}
                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50/80 backdrop-blur-sm border border-emerald-300/70 hover:bg-emerald-100 hover:backdrop-blur-md hover:shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  title="Enlist a new custom industry sector"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>{isEnlistMode ? 'Select Sector' : '+ Enlist New Sector'}</span>
                </button>
              </div>

              {/* Standard Sector Dropdown with Glass Hover Effect */}
              {!isEnlistMode && (
                <div className="relative">
                  <select
                    value={isOtherSector ? 'Other, Pls mention' : formData.industrySector}
                    onChange={(e) => handleSectorChange(e.target.value)}
                    className="w-full p-2.5 bg-white/70 backdrop-blur-sm border border-slate-200/90 rounded-xl text-slate-800 font-medium transition-all duration-300 hover:bg-white/95 hover:backdrop-blur-md hover:border-emerald-400 hover:shadow-[0_6px_20px_rgba(16,185,129,0.14)] hover:-translate-y-0.5 focus:bg-white focus:border-emerald-600 focus:shadow-[0_6px_20px_rgba(16,185,129,0.18)] focus:outline-none"
                  >
                    {sectorOptions.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                    <option value="Other, Pls mention">Other, Pls mention...</option>
                  </select>
                </div>
              )}

              {/* "Other, Pls mention" or New Sector Enlist Option Panel with Glass Effect */}
              {(isOtherSector || isEnlistMode) && (
                <div className="mt-2 p-3 rounded-2xl bg-emerald-50/60 backdrop-blur-md border border-emerald-300/80 shadow-[0_4px_20px_rgba(16,185,129,0.12)] transition-all duration-300 hover:bg-white/90 hover:backdrop-blur-xl hover:border-emerald-400 hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-emerald-950 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isEnlistMode ? 'Enlist New Industry Sector' : 'Other, Pls Mention:'}</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">Type sector name</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      required={isOtherSector || isEnlistMode}
                      placeholder="e.g. Cold Storage, Plastics & Polymers, Glass Manufacturing..."
                      value={customSectorInput}
                      onChange={(e) => {
                        setCustomSectorInput(e.target.value);
                        setFormData({ ...formData, industrySector: e.target.value });
                      }}
                      className="flex-1 p-2 bg-white/85 backdrop-blur-sm border border-emerald-300 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 transition-all duration-200 hover:bg-white hover:border-emerald-500 hover:shadow-[0_2px_12px_rgba(16,185,129,0.15)] focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleEnlistCustomSector()}
                      disabled={!customSectorInput.trim()}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1 shadow-2xs hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 cursor-pointer shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Enlist</span>
                    </button>
                  </div>
                  {customSectorInput.trim() && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Active Custom Sector: &ldquo;{customSectorInput.trim()}&rdquo;</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Industrial Corridor</span>
              </label>
              <select
                value={formData.corridor}
                onChange={(e) => setFormData({ ...formData, corridor: e.target.value as any })}
                className="w-full p-2.5 bg-white/70 backdrop-blur-sm border border-slate-200/90 rounded-xl text-slate-800 font-medium transition-all duration-300 hover:bg-white/95 hover:backdrop-blur-md hover:border-emerald-400 hover:shadow-[0_6px_20px_rgba(16,185,129,0.14)] hover:-translate-y-0.5 focus:bg-white focus:border-emerald-600 focus:shadow-[0_6px_20px_rgba(16,185,129,0.18)] focus:outline-none"
              >
                <option value="Dhaka / Gazipur / Savar">Dhaka / Gazipur / Savar</option>
                <option value="Chattogram / Narayanganj">Chattogram / Narayanganj</option>
                <option value="Mymensingh / Valuka">Mymensingh / Valuka</option>
                <option value="Other Industrial Belt">Other Industrial Belt</option>
              </select>
            </div>
          </div>

          {/* Row 3: Decision Maker & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Key Decision Maker Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. A.K. Azad (Chairman)"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full p-2.5 bg-white/70 backdrop-blur-sm border border-slate-200/90 rounded-xl text-slate-800 font-medium transition-all duration-300 hover:bg-white/95 hover:backdrop-blur-md hover:border-emerald-400 hover:shadow-[0_6px_20px_rgba(16,185,129,0.12)] hover:-translate-y-0.5 focus:bg-white focus:border-emerald-600 focus:shadow-[0_6px_20px_rgba(16,185,129,0.18)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mobile / WhatsApp *</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+880 1711 XXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-white/70 backdrop-blur-sm border border-slate-200/90 rounded-xl text-slate-800 font-medium transition-all duration-300 hover:bg-white/95 hover:backdrop-blur-md hover:border-emerald-400 hover:shadow-[0_6px_20px_rgba(16,185,129,0.12)] hover:-translate-y-0.5 focus:bg-white focus:border-emerald-600 focus:shadow-[0_6px_20px_rgba(16,185,129,0.18)] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Roof Area & Monthly Electricity Bill */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Roof Area (sq ft) *</span>
              </label>
              <input
                type="number"
                required
                value={formData.roofAreaSqFt}
                onChange={(e) => setFormData({ ...formData, roofAreaSqFt: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/70 backdrop-blur-sm border border-slate-200/90 rounded-xl text-slate-800 font-mono font-bold transition-all duration-300 hover:bg-white/95 hover:backdrop-blur-md hover:border-emerald-400 hover:shadow-[0_6px_20px_rgba(16,185,129,0.12)] hover:-translate-y-0.5 focus:bg-white focus:border-emerald-600 focus:shadow-[0_6px_20px_rgba(16,185,129,0.18)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Monthly Electricity Bill (BDT) *</span>
              </label>
              <input
                type="number"
                required
                value={formData.monthlyBillBdt}
                onChange={(e) => setFormData({ ...formData, monthlyBillBdt: Number(e.target.value) })}
                className="w-full p-2.5 bg-white/70 backdrop-blur-sm border border-slate-200/90 rounded-xl text-slate-800 font-mono font-bold transition-all duration-300 hover:bg-white/95 hover:backdrop-blur-md hover:border-emerald-400 hover:shadow-[0_6px_20px_rgba(16,185,129,0.12)] hover:-translate-y-0.5 focus:bg-white focus:border-emerald-600 focus:shadow-[0_6px_20px_rgba(16,185,129,0.18)] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 5: Roof Substrate & Utility Distribution Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Roof Substrate</span>
              </label>
              <select
                value={formData.roofSubstrate}
                onChange={(e) => setFormData({ ...formData, roofSubstrate: e.target.value as any })}
                className="w-full p-2.5 bg-white/70 backdrop-blur-sm border border-slate-200/90 rounded-xl text-slate-800 font-medium transition-all duration-300 hover:bg-white/95 hover:backdrop-blur-md hover:border-emerald-400 hover:shadow-[0_6px_20px_rgba(16,185,129,0.14)] hover:-translate-y-0.5 focus:bg-white focus:border-emerald-600 focus:shadow-[0_6px_20px_rgba(16,185,129,0.18)] focus:outline-none"
              >
                <option value="Corrugated Metal PEB Shed">Corrugated Metal PEB Shed</option>
                <option value="Standing Seam Metal">Standing Seam Metal</option>
                <option value="RCC Concrete Slab">RCC Concrete Slab</option>
                <option value="Pre-Engineered Steel Truss">Pre-Engineered Steel Truss</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Utility Distribution Zone</span>
              </label>
              <select
                value={formData.utilityProvider}
                onChange={(e) => setFormData({ ...formData, utilityProvider: e.target.value as any })}
                className="w-full p-2.5 bg-white/70 backdrop-blur-sm border border-slate-200/90 rounded-xl text-slate-800 font-medium transition-all duration-300 hover:bg-white/95 hover:backdrop-blur-md hover:border-emerald-400 hover:shadow-[0_6px_20px_rgba(16,185,129,0.14)] hover:-translate-y-0.5 focus:bg-white focus:border-emerald-600 focus:shadow-[0_6px_20px_rgba(16,185,129,0.18)] focus:outline-none"
              >
                <option value="BREB">BREB</option>
                <option value="BPDB">BPDB</option>
                <option value="DESCO">DESCO</option>
                <option value="DPDC">DPDC</option>
              </select>
            </div>
          </div>

          {/* Submit Button with Glass Specular Sheen & Glow */}
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 hover:from-emerald-500 hover:via-emerald-500 hover:to-teal-600 text-white font-bold uppercase tracking-wider rounded-2xl transition-all duration-300 shadow-md hover:shadow-[0_12px_35px_rgba(16,185,129,0.4)] hover:backdrop-blur-xl hover:border hover:border-emerald-300/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            <span>Create &amp; Initialize Solar Account</span>
          </button>
        </form>
      </div>
    </div>
  );
}
