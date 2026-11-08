'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  HardHat,
  FileCheck2,
  DollarSign,
  Calendar,
  AlertTriangle,
  X,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { SubcontractorEntity } from '@/types/arelCrm';

export interface WorkOrderPayload {
  workOrderNumber: string;
  subcontractorId: string;
  subcontractorName: string;
  projectName: string;
  scopeOfWork: string;
  contractValueBdt: number;
  advanceMobilizationPct: number;
  retentionPct: number;
  iebEngineerName: string;
  iebNumber: string;
  accordRscCompliance: boolean;
  startDate: string;
  completionDate: string;
  notes: string;
}

interface AssignWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  subcontractors: SubcontractorEntity[];
  selectedSubcontractor?: SubcontractorEntity | null;
  onAssignWorkOrder: (payload: WorkOrderPayload) => void;
  theme?: string;
}

export default function AssignWorkOrderModal({
  isOpen,
  onClose,
  subcontractors,
  selectedSubcontractor,
  onAssignWorkOrder,
  theme = 'crm-green',
}: AssignWorkOrderModalProps) {
  const [subcontractorId, setSubcontractorId] = useState<string>(
    selectedSubcontractor ? selectedSubcontractor.id : subcontractors[0]?.id || ''
  );
  const [projectName, setProjectName] = useState('Ha-Meem Denim Washing & Weaving Plant (1.2 MWp)');
  const [scopeOfWork, setScopeOfWork] = useState('Civil Pier Casting & Aluminum AL6005 Racking Erection');
  const [contractValueBdt, setContractValueBdt] = useState<number>(3850000);
  const [advanceMobilizationPct, setAdvanceMobilizationPct] = useState<number>(20);
  const [retentionPct, setRetentionPct] = useState<number>(5);
  const [iebEngineerName, setIebEngineerName] = useState('Engr. Tariqul Islam, PEng');
  const [iebNumber, setIebNumber] = useState('IEB-M-34192');
  const [accordRscCompliance, setAccordRscCompliance] = useState<boolean>(true);
  const [startDate, setStartDate] = useState('2026-11-15');
  const [completionDate, setCompletionDate] = useState('2026-12-30');
  const [notes, setNotes] = useState('Accord & RSC structural load test certified for 35 kg/sqm live wind shear tolerance.');
  const [submitted, setSubmitted] = useState(false);

  // Update default subcontractor if prop changes
  React.useEffect(() => {
    if (selectedSubcontractor) {
      setSubcontractorId(selectedSubcontractor.id);
      if (selectedSubcontractor.chiefEngineer) {
        setIebEngineerName(selectedSubcontractor.chiefEngineer);
      }
      if (selectedSubcontractor.licenseOrIebRegNo) {
        setIebNumber(selectedSubcontractor.licenseOrIebRegNo);
      }
    }
  }, [selectedSubcontractor]);

  if (!isOpen) return null;

  const currentSub = subcontractors.find((s) => s.id === subcontractorId) || selectedSubcontractor;
  const woNumber = `AREL-WO-2026-${Math.floor(100 + Math.random() * 900)}`;
  const advanceAmountBdt = Math.round((contractValueBdt * advanceMobilizationPct) / 100);
  const retentionAmountBdt = Math.round((contractValueBdt * retentionPct) / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accordRscCompliance) {
      alert('Accord / RSC safety compliance verification is mandatory for industrial execution.');
      return;
    }

    const payload: WorkOrderPayload = {
      workOrderNumber: woNumber,
      subcontractorId,
      subcontractorName: currentSub?.companyName || 'Subcontractor Partner',
      projectName,
      scopeOfWork,
      contractValueBdt,
      advanceMobilizationPct,
      retentionPct,
      iebEngineerName,
      iebNumber,
      accordRscCompliance,
      startDate,
      completionDate,
      notes,
    };

    onAssignWorkOrder(payload);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0A1A2F] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider font-mono flex items-center gap-2">
                <span>Issue Subcontractor Work Order</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  IEB Accredited
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Statutory engineering contractor dispatch, rate card lock &amp; Accord / RSC safety compliance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#0A1A2F]">Work Order Issued Successfully!</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Work Order <span className="font-mono font-bold text-emerald-800">{woNumber}</span> has been dispatched to {currentSub?.companyName}. Advance mobilization voucher staged in Project Financials.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
            {/* Subcontractor & Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Assigned Subcontractor</label>
                <select
                  value={subcontractorId}
                  onChange={(e) => setSubcontractorId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-600"
                >
                  {subcontractors.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.companyName} ({sub.category})
                    </option>
                  ))}
                </select>
                {currentSub && (
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                    <span>Lead: {currentSub.chiefEngineer} ({currentSub.phone})</span>
                    <span>•</span>
                    <span className="font-mono text-emerald-700 font-bold">Capacity: {currentSub.completedMwpCapacity} MWp</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Project / Factory</label>
                <select
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-600"
                >
                  <option value="Ha-Meem Denim Washing & Weaving Plant (1.2 MWp)">Ha-Meem Denim Washing &amp; Weaving Plant (1.2 MWp)</option>
                  <option value="Apex Tannery & Artisan Leatherworks (500 kWp)">Apex Tannery &amp; Artisan Leatherworks (500 kWp)</option>
                  <option value="RAK Ceramics Tableware Division (650 kWp)">RAK Ceramics Tableware Division (650 kWp)</option>
                  <option value="Envoy Textiles High-Efficiency Plant (800 kWp)">Envoy Textiles High-Efficiency Plant (800 kWp)</option>
                  <option value="Square Pharmaceuticals Solar Division (1.5 MWp)">Square Pharmaceuticals Solar Division (1.5 MWp)</option>
                </select>
              </div>
            </div>

            {/* Scope of Work */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Contract Scope of Work (SOW)</label>
              <select
                value={scopeOfWork}
                onChange={(e) => setScopeOfWork(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-600"
              >
                <option value="Civil Pier Casting & Aluminum AL6005 Racking Erection">Civil Pier Casting &amp; Aluminum AL6005 Racking Erection</option>
                <option value="DC Cable Trenching, String Inverter Mounting & AC DB Combiners">DC Cable Trenching, String Inverter Mounting &amp; AC DB Combiners</option>
                <option value="11kV / 33kV HT Substation, VCB Panel, Step-Up Transformer & Net-Meter">11kV / 33kV HT Substation, VCB Panel, Step-Up Transformer &amp; Net-Meter</option>
                <option value="High-Resolution Drone 3D LiDAR Topography & Shading Simulation">High-Resolution Drone 3D LiDAR Topography &amp; Shading Simulation</option>
                <option value="Turnkey Testing, Commissioning & SREDA COD Grid Synchronization">Turnkey Testing, Commissioning &amp; SREDA COD Grid Synchronization</option>
              </select>
            </div>

            {/* Financials & Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-slate-600 text-[11px] font-bold mb-1">Contract Value (BDT)</label>
                <input
                  type="number"
                  value={contractValueBdt}
                  onChange={(e) => setContractValueBdt(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-[11px] font-bold mb-1">Mobilization Advance (%)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={advanceMobilizationPct}
                    onChange={(e) => setAdvanceMobilizationPct(Number(e.target.value))}
                    min={0}
                    max={50}
                    className="w-20 p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[10px] text-emerald-800 font-mono font-bold">
                    Tk {advanceAmountBdt.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 text-[11px] font-bold mb-1">Defects Retention (%)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={retentionPct}
                    onChange={(e) => setRetentionPct(Number(e.target.value))}
                    min={0}
                    max={20}
                    className="w-20 p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[10px] text-slate-600 font-mono">
                    Tk {retentionAmountBdt.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* IEB Engineer & Compliance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">IEB Accredited Lead Engineer</label>
                <input
                  type="text"
                  value={iebEngineerName}
                  onChange={(e) => setIebEngineerName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">IEB Membership Number</label>
                <input
                  type="text"
                  value={iebNumber}
                  onChange={(e) => setIebNumber(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Site Mobilization Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Handover Date</label>
                <input
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>
            </div>

            {/* Safety Checkbox */}
            <label className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 cursor-pointer">
              <input
                type="checkbox"
                checked={accordRscCompliance}
                onChange={(e) => setAccordRscCompliance(e.target.checked)}
                className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span className="text-[11px] text-emerald-900 leading-tight">
                <strong>Accord / RSC &amp; Bangladesh National Building Code (BNBC) Compliance Certified:</strong> The contractor crew agrees to adhere to mandatory OSHA/RSC working-at-height harnesses, lifelines, and structural load safeguards.
              </span>
            </label>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#0A1A2F] hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer text-xs font-mono"
              >
                <FileCheck2 className="w-4 h-4 text-[#C9A86A]" />
                <span>Issue Work Order ({woNumber})</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
