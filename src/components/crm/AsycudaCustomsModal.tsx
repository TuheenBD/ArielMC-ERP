'use client';

import React, { useState } from 'react';
import {
  Truck,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  X,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  Building,
  ShieldCheck,
  Ship,
} from 'lucide-react';
import { ShipmentConsignment } from '@/types/arelCrm';

export interface AsycudaPayload {
  blNumber: string;
  lcNumber: string;
  sredaNocNumber: string;
  equipmentDescription: string;
  supplierName: string;
  quantityUnits: number;
  cifValueUsd: number;
  exchangeRateBdtPerUsd: number;
  customsDutyPaidBdt: number;
  portOfDischarge: string;
  etaPortDate: string;
  customsStationCode: string;
}

interface AsycudaCustomsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileDeclaration: (payload: AsycudaPayload) => void;
  theme?: string;
}

export default function AsycudaCustomsModal({
  isOpen,
  onClose,
  onFileDeclaration,
  theme = 'crm-green',
}: AsycudaCustomsModalProps) {
  const [blNumber, setBlNumber] = useState('COSCO-BL-2026-9921');
  const [lcNumber, setLcNumber] = useState('LC-EBL-2026-8812');
  const [sredaNocNumber, setSredaNocNumber] = useState('SREDA-NOC-2026-9921');
  const [equipmentDescription, setEquipmentDescription] = useState('LONGi Hi-MO X6 Explorer 580W Bifacial Solar PV Modules');
  const [supplierName, setSupplierName] = useState('LONGi Solar Co., Ltd. (Xi&apos;an, China)');
  const [quantityUnits, setQuantityUnits] = useState<number>(2400);
  const [cifValueUsd, setCifValueUsd] = useState<number>(145000);
  const [exchangeRateBdtPerUsd, setExchangeRateBdtPerUsd] = useState<number>(122.50);
  const [portOfDischarge, setPortOfDischarge] = useState('Chittagong Port (Station 301)');
  const [etaPortDate, setEtaPortDate] = useState('2026-11-20');
  const [customsStationCode, setCustomsStationCode] = useState('301 - Chittagong Customs House');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Real-time duty calculation (1.0% statutory concessionary rate under SRO 159/338)
  const assessableValueBdt = Math.round(cifValueUsd * exchangeRateBdtPerUsd);
  const statutoryDutyBdt = Math.round(assessableValueBdt * 0.01); // 1.0%
  const regularDutyBdt = Math.round(assessableValueBdt * 0.37); // normal 37% tariff avoided
  const netExemptionSavingsBdt = regularDutyBdt - statutoryDutyBdt;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: AsycudaPayload = {
      blNumber,
      lcNumber,
      sredaNocNumber,
      equipmentDescription,
      supplierName,
      quantityUnits,
      cifValueUsd,
      exchangeRateBdtPerUsd,
      customsDutyPaidBdt: statutoryDutyBdt,
      portOfDischarge,
      etaPortDate,
      customsStationCode,
    };

    onFileDeclaration(payload);
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
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider font-mono flex items-center gap-2">
                <span>ASYCUDA World Box 44 Customs Declaration</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  1% Duty SRO 159
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Statutory renewable energy hardware clearance &amp; SREDA exemption filing
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
            <h4 className="text-lg font-bold text-[#0A1A2F]">ASYCUDA Box 44 Declaration Filed!</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Declaration for B/L <span className="font-mono font-bold text-emerald-800">{blNumber}</span> has been logged with Chittagong Customs House. Statutory duty: <span className="font-mono font-bold">Tk {statutoryDutyBdt.toLocaleString()}</span> (1.0% rate applied).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
            {/* Regulatory Exemption Banner */}
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-[11px] text-emerald-900 leading-tight">
                <strong>Statutory Exemption SRO 159-Act/2021/Customs &amp; SRO 338-Act/2024:</strong> Tier-1 Solar PV modules &amp; on-grid inverters qualify for statutory 1.0% concessionary duty upon attachment of SREDA Net-Metering NOC in ASYCUDA Box 44.
              </div>
            </div>

            {/* B/L & LC References */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Bill of Lading (B/L) #</label>
                <input
                  type="text"
                  value={blNumber}
                  onChange={(e) => setBlNumber(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Import L/C Number</label>
                <input
                  type="text"
                  value={lcNumber}
                  onChange={(e) => setLcNumber(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">SREDA NOC Cert #</label>
                <input
                  type="text"
                  value={sredaNocNumber}
                  onChange={(e) => setSredaNocNumber(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>
            </div>

            {/* Hardware & Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Equipment Specification</label>
                <select
                  value={equipmentDescription}
                  onChange={(e) => setEquipmentDescription(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-emerald-600 text-xs"
                >
                  <option value="LONGi Hi-MO X6 Explorer 580W Bifacial Solar PV Modules">
                    LONGi Hi-MO X6 Explorer 580W Bifacial Solar PV Modules
                  </option>
                  <option value="Huawei SUN2000-100KTL-M2 100kW On-Grid String Inverters">
                    Huawei SUN2000-100KTL-M2 100kW On-Grid String Inverters
                  </option>
                  <option value="SMA Sunny HighPower PEAK3 150kW Utility Inverters">
                    SMA Sunny HighPower PEAK3 150kW Utility Inverters
                  </option>
                  <option value="JA Solar DeepBlue 4.0 Pro 585W N-Type Modules">
                    JA Solar DeepBlue 4.0 Pro 585W N-Type Modules
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Quantity (Units / Pieces)</label>
                <input
                  type="number"
                  value={quantityUnits}
                  onChange={(e) => setQuantityUnits(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>
            </div>

            {/* Valuation & Duty Computation */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-extrabold text-[11px] uppercase tracking-wider font-mono text-slate-800 block">
                Valuation &amp; Statutory Duty Assessment (Chittagong Port 301)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 text-[10px] font-bold mb-1">CIF Invoice (USD)</label>
                  <input
                    type="number"
                    value={cifValueUsd}
                    onChange={(e) => setCifValueUsd(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 text-[10px] font-bold mb-1">Exchange Rate (BDT/USD)</label>
                  <input
                    type="number"
                    value={exchangeRateBdtPerUsd}
                    onChange={(e) => setExchangeRateBdtPerUsd(Number(e.target.value))}
                    step="0.1"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 text-[10px] font-bold mb-1">Assessable Value (BDT)</label>
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-800 font-mono font-bold text-xs">
                    Tk {assessableValueBdt.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Duty Calculation Summary */}
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] uppercase font-mono text-emerald-800 font-bold block">
                    Concessionary Duty (1.0%)
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-900">
                    Tk {statutoryDutyBdt.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="text-[10px] uppercase font-mono text-blue-800 font-bold block">
                    Tariff Exemption Savings
                  </span>
                  <span className="text-sm font-bold font-mono text-blue-900">
                    Tk {netExemptionSavingsBdt.toLocaleString()} (Saved 36%)
                  </span>
                </div>
              </div>
            </div>

            {/* Port & Arrival */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Customs Station &amp; Discharge</label>
                <input
                  type="text"
                  value={portOfDischarge}
                  onChange={(e) => setPortOfDischarge(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Estimated Date of Arrival (ETA)</label>
                <input
                  type="date"
                  value={etaPortDate}
                  onChange={(e) => setEtaPortDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

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
                <span>File Declaration ({blNumber})</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
