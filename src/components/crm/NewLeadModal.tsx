'use client';

import React, { useState } from 'react';
import { SolarLead } from '@/types/crm';
import { X, Building, Plus, Zap, CheckCircle2 } from 'lucide-react';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (newLead: SolarLead) => void;
}

export default function NewLeadModal({ isOpen, onClose, onAddLead }: NewLeadModalProps) {
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      industrySector: formData.industrySector,
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
      notes: ['Lead onboarded into Ariel Energy CRM.'],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-slate-800 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
          <Building className="w-4 h-4" />
          <span>Onboard New Industrial Lead</span>
        </div>
        <h3 className="text-xl font-bold text-[#0A1A2F] mb-4">
          Add Factory Account to Ariel Energy CRM
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Factory Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ha-Meem Denim Mills Ltd"
                value={formData.factoryName}
                onChange={(e) => setFormData({ ...formData, factoryName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Parent Group (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Ha-Meem Group"
                value={formData.parentGroup}
                onChange={(e) => setFormData({ ...formData, parentGroup: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Industrial Sector</label>
              <select
                value={formData.industrySector}
                onChange={(e) => setFormData({ ...formData, industrySector: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="RMG / Apparel">RMG / Apparel</option>
                <option value="Textiles & Dyeing">Textiles &amp; Dyeing</option>
                <option value="Leather & Footwear">Leather &amp; Footwear</option>
                <option value="Ceramics & Tableware">Ceramics &amp; Tableware</option>
                <option value="Jute Mills">Jute Mills</option>
                <option value="Heavy Packaging">Heavy Packaging</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Industrial Corridor</label>
              <select
                value={formData.corridor}
                onChange={(e) => setFormData({ ...formData, corridor: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Dhaka / Gazipur / Savar">Dhaka / Gazipur / Savar</option>
                <option value="Chattogram / Narayanganj">Chattogram / Narayanganj</option>
                <option value="Mymensingh / Valuka">Mymensingh / Valuka</option>
                <option value="Other Industrial Belt">Other Industrial Belt</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Key Decision Maker Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. A.K. Azad (Chairman)"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="+880 1711 XXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Roof Area (sq ft) *</label>
              <input
                type="number"
                required
                value={formData.roofAreaSqFt}
                onChange={(e) => setFormData({ ...formData, roofAreaSqFt: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Electricity Bill (BDT) *</label>
              <input
                type="number"
                required
                value={formData.monthlyBillBdt}
                onChange={(e) => setFormData({ ...formData, monthlyBillBdt: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Roof Substrate</label>
              <select
                value={formData.roofSubstrate}
                onChange={(e) => setFormData({ ...formData, roofSubstrate: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Corrugated Metal PEB Shed">Corrugated Metal PEB Shed</option>
                <option value="Standing Seam Metal">Standing Seam Metal</option>
                <option value="RCC Concrete Slab">RCC Concrete Slab</option>
                <option value="Pre-Engineered Steel Truss">Pre-Engineered Steel Truss</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Utility Distribution Zone</label>
              <select
                value={formData.utilityProvider}
                onChange={(e) => setFormData({ ...formData, utilityProvider: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="BREB">BREB</option>
                <option value="BPDB">BPDB</option>
                <option value="DESCO">DESCO</option>
                <option value="DPDC">DPDC</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create &amp; Initialize Solar Account</span>
          </button>
        </form>
      </div>
    </div>
  );
}

