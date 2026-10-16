'use client';

import React, { useState } from 'react';
import {
  LogisticsConsignment,
  ConsignmentItem,
  SecurityBudgetLine,
  SecurityIncident,
  HubLocation
} from '@/types/erp';
import {
  Ship,
  Boxes,
  Truck,
  ShieldCheck,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Barcode,
  Anchor,
  Globe2,
  Calendar,
  Lock,
  PhoneCall,
  Key,
  CreditCard,
  Building2,
  Printer,
  ChevronRight,
  Info,
  Layers,
  Search,
  Filter
} from 'lucide-react';

interface LogisticsManagementProps {
  consignments: LogisticsConsignment[];
  securityBudget: SecurityBudgetLine[];
  securityIncidents: SecurityIncident[];
  onSelectConsignment?: (cng: LogisticsConsignment) => void;
}

export const LogisticsManagement: React.FC<LogisticsManagementProps> = ({
  consignments,
  securityBudget,
  securityIncidents,
}) => {
  const [activeTab, setActiveTab] = useState<'HUBS' | 'CONSIGNMENTS' | 'HYBRID_FBA' | 'DOCS' | 'SECURITY'>('CONSIGNMENTS');
  const [selectedHub, setSelectedHub] = useState<HubLocation>('WH-UK');
  const [activeConsignment, setActiveConsignment] = useState<LogisticsConsignment>(consignments[0]);
  const [documentPreviewType, setDocumentPreviewType] = useState<'INVOICE' | 'PACKING_LIST' | 'FORM_EXP' | 'EDI_MANIFEST'>('INVOICE');
  const [showDocModal, setShowDocModal] = useState(false);

  // Status badge styling
  const getShipmentStatusBadge = (status: LogisticsConsignment['status']) => {
    switch (status) {
      case 'ON_VESSEL_TRANSIT':
        return {
          label: 'On Vessel (Ocean Transit)',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: Ship,
        };
      case 'CUSTOMS_CLEARED_CTG':
        return {
          label: 'Customs Cleared (CTG)',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: CheckCircle2,
        };
      case 'PORT_DISCHARGE':
        return {
          label: 'Port Discharging',
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          icon: Anchor,
        };
      case 'INBOUND_AT_3PL':
        return {
          label: 'Inbound at 3PL Hub',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: Boxes,
        };
      default:
        return {
          label: status.replace(/_/g, ' '),
          color: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: Info,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0A1A2F] via-[#0D1F38] to-[#122846] border border-[#C9A86A]/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#C9A86A]/20 text-[#C9A86A] border border-[#C9A86A]/40">
              <Ship className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-wide font-['Montserrat']">
                  Dual-Hub Logistics & Export Documentation Engine
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Phase 6 Live
                </span>
              </div>
              <p className="text-xs text-slate-300 font-['Open_Sans'] mt-0.5">
                Chattogram (CTG) Ocean Corridors ➔ Dual 3PL Hubs: WH-UK (Northampton) & WH-DE (Hamburg/Ruhr) • Amazon Hybrid FBA/FBM • 0% Preferential Duty
              </p>
            </div>
          </div>
        </div>

        {/* Global Quick Action */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              setDocumentPreviewType('INVOICE');
              setShowDocModal(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#C9A86A] to-[#B08D4D] text-[#0A1A2F] font-semibold text-xs shadow-lg shadow-[#C9A86A]/20 hover:brightness-110 transition-all font-['Montserrat']"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Official Export Docs</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-['Montserrat']">
        <button
          onClick={() => setActiveTab('CONSIGNMENTS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all shrink-0 ${
            activeTab === 'CONSIGNMENTS'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Ship className="w-4 h-4 text-blue-400" />
          <span>Active Ocean Consignments ({consignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('HUBS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all shrink-0 ${
            activeTab === 'HUBS'
              ? 'bg-[#C9A86A]/20 text-[#C9A86A] border border-[#C9A86A]/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Boxes className="w-4 h-4 text-[#C9A86A]" />
          <span>Dual 3PL Hub Architecture (UK & Germany)</span>
        </button>

        <button
          onClick={() => setActiveTab('HYBRID_FBA')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all shrink-0 ${
            activeTab === 'HYBRID_FBA'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Barcode className="w-4 h-4 text-amber-400" />
          <span>Amazon Hybrid FBA / FBM Allocation</span>
        </button>

        <button
          onClick={() => setActiveTab('DOCS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all shrink-0 ${
            activeTab === 'DOCS'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Export Compliance & Form EXP Registry</span>
        </button>

        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all shrink-0 ${
            activeTab === 'SECURITY'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>SOP-SEC-2026-V1 Cyber Security Governance</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE OCEAN CONSIGNMENTS */}
      {activeTab === 'CONSIGNMENTS' && (
        <div className="space-y-6">
          {/* Consignments Selector Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consignments.map((cng) => {
              const isSelected = activeConsignment.id === cng.id;
              const statusBadge = getShipmentStatusBadge(cng.status);
              const StatusIcon = statusBadge.icon;

              return (
                <div
                  key={cng.id}
                  onClick={() => setActiveConsignment(cng)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900/90 border-blue-500/60 shadow-xl ring-1 ring-blue-500/40'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-300">
                          {cng.consignmentNumber}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="font-mono text-[11px] text-slate-300">
                          {cng.containerType} Container
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white font-['Montserrat']">
                        {cng.destinationPort}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Assigned Destination: <span className="text-slate-200 font-semibold">{cng.hubName}</span>
                      </p>
                    </div>

                    <span
                      className={`flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border ${statusBadge.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusBadge.label}</span>
                    </span>
                  </div>

                  {/* Ocean Route Strip */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Origin Port</span>
                      <span className="font-semibold text-slate-200">{cng.originPort}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">ETD: {cng.etdCtg}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Carrier Vessel</span>
                      <span className="font-semibold text-blue-300">{cng.carrierVessel}</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">ETA: {cng.etaDestination}</span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>
                      Cargo: <strong className="text-white font-mono">{cng.totalCartons} Cartons</strong> ({cng.totalUnits} Units)
                    </span>
                    <span>
                      CBM: <strong className="text-amber-400 font-mono">{cng.totalCbm} m³</strong>
                    </span>
                    <span>
                      Gross: <strong className="text-slate-200 font-mono">{cng.totalGrossWeightKg} kg</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Inspector for Selected Consignment */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-xs font-semibold">
                    {activeConsignment.consignmentNumber}
                  </span>
                  <span className="text-xs text-slate-400">Bill of Lading: {activeConsignment.billOfLadingNo}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400">Seal: {activeConsignment.sealNumber}</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1 font-['Montserrat']">
                  Consignment Cargo Manifest & Maritime Tracking
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setDocumentPreviewType('INVOICE');
                    setShowDocModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Commercial Invoice</span>
                </button>
                <button
                  onClick={() => {
                    setDocumentPreviewType('PACKING_LIST');
                    setShowDocModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                >
                  <Boxes className="w-3.5 h-3.5 text-amber-400" />
                  <span>Master Packing List</span>
                </button>
                <button
                  onClick={() => {
                    setDocumentPreviewType('EDI_MANIFEST');
                    setShowDocModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium border border-emerald-500/30 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>3PL WMS File</span>
                </button>
              </div>
            </div>

            {/* Maritime Integrity & Tariff Safeguards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Container Moisture Protocol
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                    PASS
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Desiccant Poles:</span>
                    <strong className="text-white font-mono">{activeConsignment.desiccantProtocol.containerPolesCount} Units (Calcium Chloride)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cavity Clay Packets:</span>
                    <strong className="text-white font-mono">{activeConsignment.desiccantProtocol.cavityPacketsCount} Packets (5-10g)</strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  Prevents leather bloom and mold creasing during 35-45 day sea voyage.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    Quarantine & Phytosanitary
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                    DAE CERTIFIED
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>DAE Cert No:</span>
                    <strong className="text-white font-mono">{activeConsignment.phytosanitaryClearance.daeCertificateNo}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Fumigation Spec:</span>
                    <strong className="text-white">{activeConsignment.phytosanitaryClearance.fumigationTreatment}</strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  ISPM-15 quarantine clearance required for UK/EU port entry on jute & cotton blends.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-[#C9A86A]" />
                    Zero-Tariff Preference
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                    0.0% IMPORT DUTY
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Trade Scheme:</span>
                    <strong className="text-emerald-300">{activeConsignment.destinationHub === 'WH-UK' ? 'UK DCTS (Comprehensive)' : 'EU EBA (Everything But Arms)'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Bangladesh Bank EXP:</span>
                    <strong className="text-white font-mono">{activeConsignment.bangladeshBankFormExp}</strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  Backed by REX statement of origin and Authorized Dealer EXP bank endorsement.
                </p>
              </div>
            </div>

            {/* Manifest Items Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-['Montserrat']">
                  Itemized Manifest & 3-Way Stock Allocation
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Container No: {activeConsignment.containerNumber}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Master SKU & Barcode</th>
                      <th className="py-3 px-4">Style & HS Code</th>
                      <th className="py-3 px-4">Cartons</th>
                      <th className="py-3 px-4">Total Units</th>
                      <th className="py-3 px-4 text-amber-400">Amazon FBA Drip</th>
                      <th className="py-3 px-4 text-blue-400">3PL FBM Stock</th>
                      <th className="py-3 px-4 text-purple-400">B2B Wholesale</th>
                      <th className="py-3 px-4 text-right">FOB Value (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {activeConsignment.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white text-xs">{item.productName}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-slate-300 text-[11px]">{item.sku}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/40 text-amber-300 border border-amber-800/50 flex items-center gap-1">
                              <Barcode className="w-2.5 h-2.5 text-amber-400" />
                              {item.eanBarcode}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-blue-300 font-mono text-xs">Style {item.styleCode}</div>
                          <div className="text-slate-400 text-[11px]">HS {item.hsCode}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium">
                          {item.cartons} ctn <span className="text-[10px] text-slate-500">({item.unitsPerCarton}/ctn)</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {item.totalUnits} pcs
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {item.fbaTransferUnits > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                              {item.fbaTransferUnits} pcs (FBA)
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono">0 (Pure FBM)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-blue-300">
                          {item.fbmInventoryUnits} pcs
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-purple-300">
                          {item.b2bWholesaleUnits} pcs
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                          ${item.totalPriceUsd.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-950/90 font-semibold text-white border-t border-slate-800 text-xs">
                    <tr>
                      <td colSpan={2} className="py-3 px-4 text-slate-400">
                        Consignment Totals
                      </td>
                      <td className="py-3 px-4 font-mono">{activeConsignment.totalCartons} Cartons</td>
                      <td className="py-3 px-4 font-mono">{activeConsignment.totalUnits} Units</td>
                      <td colSpan={3} className="py-3 px-4 text-slate-400 text-[11px]">
                        Weight: {activeConsignment.totalGrossWeightKg} kg • Vol: {activeConsignment.totalCbm} m³
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400 text-sm">
                        ${activeConsignment.totalFobValueUsd.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DUAL 3PL HUB ARCHITECTURE (UK & GERMANY) */}
      {activeTab === 'HUBS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UK Hub Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900 to-[#0A1A2F] border border-blue-500/40 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🇬🇧</span>
                    <h3 className="text-base font-bold text-white font-['Montserrat']">
                      United Kingdom Fulfillment Hub (WH-UK)
                    </h3>
                  </div>
                  <p className="text-xs text-blue-400 font-mono mt-0.5">Location: Northampton, UK</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                  OPERATIONAL
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
                <div className="font-semibold text-slate-200">Legal & Tax Governance:</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Corporate Entity:</span>
                    <span>Ariel Marketing & Communications Ltd (UK)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">HMRC VAT Registration:</span>
                    <span className="font-mono text-emerald-400">20% UK VAT (GB EORI)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Registered Address:</span>
                    <span>Shelton Street, Covent Garden, London</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Environmental Compliance:</span>
                    <span>UK EPR Packaging Waste Certified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                  Negotiated Domestic Carrier Rates (Sub-2kg):
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">Royal Mail Tracked 48:</span>
                    <span className="font-mono font-bold text-white">£2.85 – £3.40</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">Royal Mail Tracked 24:</span>
                    <span className="font-mono font-bold text-white">£3.80 – £4.50</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">Evri Standard Tracked:</span>
                    <span className="font-mono font-bold text-white">£2.60 – £3.10</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">Palletline B2B (Outbound):</span>
                    <span className="font-mono font-bold text-amber-400">£45 – £85</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Daily Order Cut-off: <strong className="text-white font-mono">2:00 PM GMT</strong></span>
                <span>WMS Integration: <strong className="text-blue-300 font-mono">Mintsoft / API</strong></span>
              </div>
            </div>

            {/* German Hub Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900 to-[#0A1A2F] border border-amber-500/40 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🇩🇪</span>
                    <h3 className="text-base font-bold text-white font-['Montserrat']">
                      European Union Fulfillment Hub (WH-DE)
                    </h3>
                  </div>
                  <p className="text-xs text-amber-400 font-mono mt-0.5">Location: Hamburg / Ruhr Industrial Belt</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                  OPERATIONAL
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
                <div className="font-semibold text-slate-200">Legal & Tax Governance:</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Corporate Structure:</span>
                    <span>DE Permanent Establishment / Branch</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">German VAT & EU OSS:</span>
                    <span className="font-mono text-emerald-400">19% USt-IdNr. (DE EORI)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Packaging Dual-System:</span>
                    <span className="text-amber-300">LUCID (VerpackG) Licensed</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Pan-EU Sales System:</span>
                    <span>One-Stop Shop (OSS) Active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                  Negotiated Domestic & Pan-EU Carrier Rates (Sub-2kg):
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">DHL Paket National:</span>
                    <span className="font-mono font-bold text-white">€3.85 – €4.60</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">DPD Classic / GLS:</span>
                    <span className="font-mono font-bold text-white">€3.50 – €4.20</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">DHL Pan-EU (FR/NL/AT):</span>
                    <span className="font-mono font-bold text-blue-300">€7.20 – €9.80</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">DB Schenker B2B Pallet:</span>
                    <span className="font-mono font-bold text-amber-400">€55 – €110</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Daily Order Cut-off: <strong className="text-white font-mono">2:00 PM CET</strong></span>
                <span>WMS Integration: <strong className="text-amber-300 font-mono">JTL / Descartes</strong></span>
              </div>
            </div>
          </div>

          {/* Odoo / Central ERP Automated Geographic Router */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-['Montserrat'] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#C9A86A]" />
                  Central Order Routing Engine (Pseudo-Logic Execution)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated warehouse assignment based on buyer shipping country across Shopify, Amazon FBM, Etsy and Direct B2B Quotes.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Server Action Active
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 space-y-1">
              <div className="text-emerald-400"># Central Odoo Automated Warehouse Assignment Rule</div>
              <div><span className="text-purple-400">if</span> record.partner_shipping_id.country_id.code == <span className="text-amber-300">'GB'</span>:</div>
              <div className="pl-4 text-slate-200">record.warehouse_id = env[<span className="text-amber-300">'stock.warehouse'</span>].search([(<span className="text-amber-300">'code'</span>, <span className="text-amber-300">'='</span>, <span className="text-amber-300">'WH-UK'</span>)], limit=1)</div>
              <div><span className="text-purple-400">elif</span> record.partner_shipping_id.country_id.code <span className="text-purple-400">in</span> [<span className="text-amber-300">'DE'</span>, <span className="text-amber-300">'FR'</span>, <span className="text-amber-300">'IT'</span>, <span className="text-amber-300">'ES'</span>, <span className="text-amber-300">'NL'</span>, <span className="text-amber-300">'BE'</span>, <span className="text-amber-300">'AT'</span>, <span className="text-amber-300">'SE'</span>, <span className="text-amber-300">'DK'</span>]:</div>
              <div className="pl-4 text-slate-200">record.warehouse_id = env[<span className="text-amber-300">'stock.warehouse'</span>].search([(<span className="text-amber-300">'code'</span>, <span className="text-amber-300">'='</span>, <span className="text-amber-300">'WH-DE'</span>)], limit=1)</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AMAZON HYBRID FBA / FBM ALLOCATION */}
      {activeTab === 'HYBRID_FBA' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-600/30 space-y-2">
            <div className="flex items-center gap-2">
              <Barcode className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white font-['Montserrat']">
                Recommended Hybrid Strategy (FBA Prime Velocity + FBM Margin & Leather Protection)
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-['Open_Sans']">
              Pure FBA destroys leather margins via automated returns liquidation and aged-stock penalties; pure FBM misses the Amazon Prime conversion multiplier. ArielMC operates a dynamic split: 100% of bulk ocean stock arrives at our UK & German 3PLs, which drip-feed fast runners into FBA while retaining high-ticket leather on FBM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 text-sm font-['Montserrat']">
                  1. Amazon FBA Drip-Feed
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-semibold">
                  PRIME BADGE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transfer 30 to 45 days of supply from UK & German 3PLs into Amazon Fulfillment Centers.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-white block">AMC-JCT-JC-NAT-SGL</span>
                  <span className="text-[11px] text-slate-400">16" Jute Commuter Tote (Natural)</span>
                  <span className="text-amber-400 font-mono text-[11px] block mt-1">Allocation: 400 pcs / hub</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-white block">AMC-BLM-DL-IND-SGL</span>
                  <span className="text-[11px] text-slate-400">Bloom Embroidered Laptop Tote</span>
                  <span className="text-amber-400 font-mono text-[11px] block mt-1">Allocation: 150 pcs / hub</span>
                </div>
              </div>
              <div className="text-[11px] text-emerald-400 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-800/40">
                ✓ Converts at 25%–35% with Prime next-day shipping without aged inventory risk.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-blue-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-300 text-sm font-['Montserrat']">
                  2. 3PL Seller-Fulfilled (FBM)
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-semibold">
                  WHITE-GLOVE QC
                </span>
              </div>
              <p className="text-xs text-slate-400">
                High-ticket full-grain leather totes fulfilled directly from UK (Northampton) & German (Hamburg) 3PLs.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-white block">AMC-LT2-LEA-BUR-SGL</span>
                  <span className="text-[11px] text-slate-400">Style 2 Full Leather Tote (€120 RRP)</span>
                  <span className="text-blue-300 font-mono text-[11px] block mt-1">Allocation: 300 pcs at 3PL</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-white block">AMC-LT3-LEA-BUR-SGL</span>
                  <span className="text-[11px] text-slate-400">Style 3 Hex-Base Leather (€135 RRP)</span>
                  <span className="text-blue-300 font-mono text-[11px] block mt-1">Allocation: 250 pcs at 3PL</span>
                </div>
              </div>
              <div className="text-[11px] text-blue-300 bg-blue-950/30 p-2.5 rounded-lg border border-blue-800/40">
                ✓ Manual QC on customer returns: dustbags replaced, leather wiped; zero automated write-offs.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-purple-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300 text-sm font-['Montserrat']">
                  3. B2B Wholesale Reserve
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-semibold">
                  INSTITUTIONAL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ring-fenced pallet inventory at 3PLs for European boutiques, corporate gifts, and trade accounts.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-white block">Palletline / Schenker Dispatch</span>
                  <span className="text-[11px] text-slate-400">Full carton master packaging</span>
                  <span className="text-purple-300 font-mono text-[11px] block mt-1">Pallet Prep: £10–£18 / €12–€22</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-white block">24–48h Domestic Samples</span>
                  <span className="text-[11px] text-slate-400">Off-the-shelf samples dispatched locally</span>
                  <span className="text-purple-300 font-mono text-[11px] block mt-1">Instant UK/EU buyer sampling</span>
                </div>
              </div>
              <div className="text-[11px] text-purple-300 bg-purple-950/30 p-2.5 rounded-lg border border-purple-800/40">
                ✓ Zero MCF surcharges and immediate settlement cash flow.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXPORT COMPLIANCE & FORM EXP REGISTRY */}
      {activeTab === 'DOCS' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white font-['Montserrat'] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Official Bangladesh Export Clearance & Regulatory Filings
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reconciliation of Bangladesh Bank FE Circular No. 48/31, Form EXP, DAE Phytosanitary, and REX Origin.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setDocumentPreviewType('FORM_EXP');
                    setShowDocModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Inspect Form EXP Details</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">BB FE Circular No. 48/31</span>
                <span className="text-sm font-bold text-white block">E-Commerce Export Waiver</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enables export without upfront Letter of Credit (LC) for recognized e-commerce pipelines.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">ERQ Account Governance</span>
                <span className="text-sm font-bold text-emerald-300 block">USD/GBP Retained</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Export Retention Quota utilized strictly for UK 3PL warehousing and overseas ad spend.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">DAE Phytosanitary</span>
                <span className="text-sm font-bold text-blue-300 block">ISPM-15 Fumigation</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Required for natural golden jute and cotton shopping totes before Chittagong port gate-in.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">EU REX & UK DCTS</span>
                <span className="text-sm font-bold text-[#C9A86A] block">0% Preferential Duty</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Origin declaration text on Commercial Invoice saves 3%–9% standard third-country import tariff.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SOP-SEC-2026-V1 CYBER SECURITY GOVERNANCE */}
      {activeTab === 'SECURITY' && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-[#0A1A2F] border border-purple-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  Standardized Security Operating Procedure (SOP-SEC-2026-V1)
                </h2>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                Cross-Border Dual-Entity Protocol
              </span>
            </div>
            <p className="text-xs text-slate-300 font-['Open_Sans']">
              Dhaka HQ (Niketon, Gulshan) & London Subsidiary (Shelton Street). Mandated access control across Shopify DTC, Amazon Seller Central, Wise Business UK, and B2B wire settlement verifications.
            </p>
          </div>

          {/* Incident Kill-Switch Runbook Visual Diagram */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white font-['Montserrat'] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Incident Response Plan & Emergency Kill-Switch Runbook
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-red-500/30 space-y-2">
                <div className="text-[10px] font-mono font-bold text-red-400 uppercase">
                  Step 1: First 5 Minutes
                </div>
                <div className="text-xs font-bold text-white">Isolate & Freeze</div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Ad Hijack: Freeze Meta/TikTok via Master Portfolio.</li>
                  <li>• Financial Anomaly: Freeze Wise Virtual Cards via mobile app.</li>
                  <li>• Credential Leak: Terminate Google Workspace sessions.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2">
                <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  Step 2: First 15 Minutes
                </div>
                <div className="text-xs font-bold text-white">Notify Command</div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Dhaka Lead: Call <strong className="text-white">+880 2410 811 91</strong></li>
                  <li>• Mobile: <strong className="text-white">+880 1818273458</strong></li>
                  <li>• UK Operations Desk: Direct phone to Managing Director.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 space-y-2">
                <div className="text-[10px] font-mono font-bold text-blue-400 uppercase">
                  Step 3: First 60 Minutes
                </div>
                <div className="text-xs font-bold text-white">Containment & Remediation</div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Revoke OAuth tokens on Shopify & Stripe.</li>
                  <li>• Rotate master passwords in 1Password / Bitwarden.</li>
                  <li>• Terminate all active browser sessions.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-2">
                <div className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                  Step 4: 24–72 Hours
                </div>
                <div className="text-xs font-bold text-white">Regulatory Assessment</div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Evaluate exposure under UK GDPR.</li>
                  <li>• Notify UK ICO within 72h if customer PII breached.</li>
                  <li>• Bangladesh Cyber Security statutory reporting.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Out-of-Band Callback Verification & Security Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Out-of-band wire verification */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-['Montserrat'] flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  Supplier Out-of-Band Callback Verification (BEC Defense)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  MANDATORY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Any request from Savar leather tanneries, Narayanganj mills, or B2B buyers to change bank settlement details or Wise emails requires mandatory two-factor callback verification:
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Must contact verified executive contact via pre-established telephone number or video call.</span>
                </div>
                <div className="flex items-center gap-2 text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Email confirmation alone is strictly prohibited as a basis for changing banking rails.</span>
                </div>
              </div>
            </div>

            {/* Annual Security Budget Tracker */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-['Montserrat'] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#C9A86A]" />
                  Annual Security Implementation Budget (Year 1)
                </h3>
                <span className="text-xs font-mono font-bold text-[#C9A86A]">
                  Total: £1,280 / ৳198,400
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-[11px] text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Component</th>
                      <th className="py-2 px-3">Cost (GBP)</th>
                      <th className="py-2 px-3">Cost (BDT)</th>
                      <th className="py-2 px-3">Strategic Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {securityBudget.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-medium text-white">{b.component}</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-200">£{b.annualCostGbp}</td>
                        <td className="py-2 px-3 font-mono text-slate-400">৳{b.annualCostBdt.toLocaleString()}</td>
                        <td className="py-2 px-3 text-slate-400 text-[10px]">{b.strategicPurpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-[#0A1A2F] to-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C9A86A]" />
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  Official Export Documentation Generator (Print / Export Ready)
                </h2>
              </div>
              <button
                onClick={() => setShowDocModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Close
              </button>
            </div>

            {/* Document Type Selector Bar */}
            <div className="flex items-center px-6 py-2.5 bg-slate-950/90 border-b border-slate-800 gap-3 text-xs">
              <button
                onClick={() => setDocumentPreviewType('INVOICE')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  documentPreviewType === 'INVOICE'
                    ? 'bg-[#C9A86A] text-[#0A1A2F] font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Commercial Invoice
              </button>
              <button
                onClick={() => setDocumentPreviewType('PACKING_LIST')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  documentPreviewType === 'PACKING_LIST'
                    ? 'bg-[#C9A86A] text-[#0A1A2F] font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Master Packing List
              </button>
              <button
                onClick={() => setDocumentPreviewType('FORM_EXP')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  documentPreviewType === 'FORM_EXP'
                    ? 'bg-[#C9A86A] text-[#0A1A2F] font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Bangladesh Bank Form EXP
              </button>
              <button
                onClick={() => setDocumentPreviewType('EDI_MANIFEST')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  documentPreviewType === 'EDI_MANIFEST'
                    ? 'bg-[#C9A86A] text-[#0A1A2F] font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                3PL EDI Manifest (CSV)
              </button>
            </div>

            {/* Document Body (Clean Ivory Paper Theme for Printing) */}
            <div className="p-8 overflow-y-auto flex-1 bg-[#F8F6F2] text-[#0A1A2F] font-['Open_Sans']">
              {documentPreviewType === 'INVOICE' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  {/* Official Letterhead Header */}
                  <div className="border-b-2 border-[#C9A86A] pb-4 flex items-start justify-between">
                    <div>
                      <h1 className="text-xl font-bold font-['Montserrat'] tracking-tight text-[#0A1A2F]">
                        ARIEL MARKETING & COMMUNICATIONS LIMITED
                      </h1>
                      <p className="text-xs text-[#3A3A3A] mt-0.5">
                        Global Sourcing • Export Management • Private Label Brand Development
                      </p>
                      <p className="text-[11px] text-[#3A3A3A] mt-1">
                        House - 30 (1st Floor), Road - 07, Block - C, Niketon, Gulshan, Dhaka-1212, Bangladesh<br />
                        Tel: +880 2410 811 91 / +880 1818273458 • Email: info@arielmc.com / arielmc.bd@gmail.com
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-['Montserrat'] uppercase tracking-wider text-[#C9A86A] block">
                        COMMERCIAL INVOICE
                      </span>
                      <span className="text-xs font-mono font-bold text-[#0A1A2F] block mt-1">
                        INV-{activeConsignment.consignmentNumber}
                      </span>
                      <span className="text-[11px] text-[#3A3A3A] block">Date: {activeConsignment.etdCtg}</span>
                    </div>
                  </div>

                  {/* Consignee & Shipping Details */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-lg border border-slate-300 bg-white">
                      <strong className="block text-[#0A1A2F] font-['Montserrat'] mb-1">CONSIGNEE / BUYER:</strong>
                      <p className="text-[#3A3A3A]">
                        Ariel Marketing & Communications Ltd (UK)<br />
                        71-75 Shelton Street, Covent Garden, London WC2H 9JQ<br />
                        United Kingdom • GB VAT Registered
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-300 bg-white">
                      <strong className="block text-[#0A1A2F] font-['Montserrat'] mb-1">PORT & VESSEL DETAILS:</strong>
                      <p className="text-[#3A3A3A]">
                        Port of Loading: Chattogram (CTG), Bangladesh<br />
                        Port of Discharge: {activeConsignment.destinationPort}<br />
                        Vessel: {activeConsignment.carrierVessel} • B/L: {activeConsignment.billOfLadingNo}
                      </p>
                    </div>
                  </div>

                  {/* Table */}
                  <table className="w-full text-left text-xs border border-slate-300 bg-white">
                    <thead className="bg-[#0A1A2F] text-white text-[11px] font-['Montserrat']">
                      <tr>
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5">HS Code</th>
                        <th className="p-2.5">Qty</th>
                        <th className="p-2.5">Unit Price (USD)</th>
                        <th className="p-2.5 text-right">Total Amount (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {activeConsignment.items.map((it) => (
                        <tr key={it.id}>
                          <td className="p-2.5">
                            <strong className="block text-[#0A1A2F]">{it.productName}</strong>
                            <span className="text-[10px] text-slate-500 font-mono">SKU: {it.sku} (EAN: {it.eanBarcode})</span>
                          </td>
                          <td className="p-2.5 font-mono">{it.hsCode}</td>
                          <td className="p-2.5 font-mono">{it.totalUnits} pcs</td>
                          <td className="p-2.5 font-mono">${it.unitPriceUsd.toFixed(2)}</td>
                          <td className="p-2.5 text-right font-mono font-bold">${it.totalPriceUsd.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-[#0A1A2F] font-bold text-xs">
                      <tr>
                        <td colSpan={3} className="p-2.5">TOTAL FOB VALUE (CHATTOGRAM):</td>
                        <td colSpan={2} className="p-2.5 text-right font-mono text-base text-[#0A1A2F]">
                          ${activeConsignment.totalFobValueUsd.toLocaleString()} USD
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* Preferential Origin Declaration */}
                  <div className="p-3.5 rounded-lg border border-[#C9A86A] bg-amber-50/50 text-xs space-y-1">
                    <strong className="font-['Montserrat'] text-[#0A1A2F] block">
                      PREFERENTIAL ORIGIN DECLARATION (0% DUTY APPLIED):
                    </strong>
                    <p className="text-[11px] text-[#3A3A3A] italic">
                      "{activeConsignment.rexStatementOfOrigin}"
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="pt-8 flex justify-between text-xs text-[#3A3A3A]">
                    <div>
                      <div className="w-48 border-b border-slate-400 mb-1"></div>
                      <span>Prepared by: Trade Desk, Dhaka HQ</span>
                    </div>
                    <div className="text-right">
                      <div className="w-48 border-b border-slate-400 mb-1 ml-auto"></div>
                      <span>Authorised Signatory: Ariel Marketing & Communications Ltd</span>
                    </div>
                  </div>
                </div>
              )}

              {documentPreviewType === 'PACKING_LIST' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="border-b-2 border-[#C9A86A] pb-4 flex items-start justify-between">
                    <div>
                      <h1 className="text-xl font-bold font-['Montserrat'] text-[#0A1A2F]">
                        ARIEL MARKETING & COMMUNICATIONS LIMITED
                      </h1>
                      <p className="text-xs text-[#3A3A3A]">Master Cargo Packing List & ITF-14 Shipping Markings</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-['Montserrat'] uppercase text-[#C9A86A] block">
                        PACKING LIST
                      </span>
                      <span className="text-xs font-mono font-bold text-[#0A1A2F] block mt-1">
                        PKL-{activeConsignment.consignmentNumber}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-300 bg-white grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block">Container No:</span>
                      <strong className="font-mono text-[#0A1A2F]">{activeConsignment.containerNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Seal Number:</span>
                      <strong className="font-mono text-[#0A1A2F]">{activeConsignment.sealNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Destination Marker:</span>
                      <strong className="text-blue-800">{activeConsignment.hubName}</strong>
                    </div>
                  </div>

                  <table className="w-full text-left text-xs border border-slate-300 bg-white">
                    <thead className="bg-[#0A1A2F] text-white text-[11px] font-['Montserrat']">
                      <tr>
                        <th className="p-2.5">Carton Range</th>
                        <th className="p-2.5">Item Description & SKU</th>
                        <th className="p-2.5">Units/Ctn</th>
                        <th className="p-2.5">Total Units</th>
                        <th className="p-2.5">Net Wt (kg)</th>
                        <th className="p-2.5 text-right">Gross Wt (kg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {activeConsignment.items.map((it, idx) => (
                        <tr key={it.id}>
                          <td className="p-2.5 font-mono">CTN #{idx * 40 + 1} - #{(idx + 1) * 40}</td>
                          <td className="p-2.5">
                            <strong className="block text-[#0A1A2F]">{it.productName}</strong>
                            <span className="text-[10px] text-slate-500">{it.packagingMode}</span>
                          </td>
                          <td className="p-2.5 font-mono">{it.unitsPerCarton}</td>
                          <td className="p-2.5 font-mono font-bold">{it.totalUnits}</td>
                          <td className="p-2.5 font-mono">{it.netWeightKg}</td>
                          <td className="p-2.5 text-right font-mono font-bold">{it.grossWeightKg}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-[#0A1A2F] font-bold text-xs">
                      <tr>
                        <td colSpan={2} className="p-2.5">TOTALS:</td>
                        <td className="p-2.5 font-mono">{activeConsignment.totalCartons} Cartons</td>
                        <td className="p-2.5 font-mono">{activeConsignment.totalUnits} Units</td>
                        <td className="p-2.5 text-slate-500">{activeConsignment.totalCbm} CBM</td>
                        <td className="p-2.5 text-right font-mono">{activeConsignment.totalGrossWeightKg} kg</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {documentPreviewType === 'FORM_EXP' && (
                <div className="space-y-4 max-w-2xl mx-auto font-mono text-xs">
                  <div className="border border-slate-400 p-4 bg-white space-y-2">
                    <div className="text-center font-bold text-sm text-[#0A1A2F] pb-2 border-b border-slate-300">
                      BANGLADESH BANK • FOREIGN EXCHANGE OPERATION DEPARTMENT<br />
                      FORM EXP (COMMERCIAL EXPORT DECLARATION)
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2">
                      <div>EXP NO: <strong>{activeConsignment.bangladeshBankFormExp}</strong></div>
                      <div>DATE: <strong>{activeConsignment.etdCtg}</strong></div>
                      <div>AUTHORIZED DEALER: <strong>{activeConsignment.authorizedDealerBank}</strong></div>
                      <div>CCI&E REGISTRATION: <strong>EPB-2026-DH-08819</strong></div>
                      <div>EXPORTER: <strong>ARIEL MARKETING & COMMUNICATIONS LTD</strong></div>
                      <div>CONSIGNEE: <strong>ARIEL MARKETING & COMMUNICATIONS LTD (UK)</strong></div>
                      <div>PORT OF SHIPMENT: <strong>CHATTOGRAM (CTG) PORT, BANGLADESH</strong></div>
                      <div>PORT OF DESTINATION: <strong>{activeConsignment.destinationPort}</strong></div>
                      <div>INVOICE VALUE: <strong>${activeConsignment.totalFobValueUsd.toLocaleString()} USD</strong></div>
                      <div>FE CIRCULAR: <strong>BB FE CIRCULAR NO. 48/31 COMPLIANT</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {documentPreviewType === 'EDI_MANIFEST' && (
                <div className="space-y-3 max-w-2xl mx-auto font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#0A1A2F]">3PL WMS Inbound Manifest (CSV Data Format):</span>
                    <button
                      onClick={() => alert('Downloading CSV format manifest for 3PL auto-ingestion...')}
                      className="px-3 py-1 rounded bg-[#0A1A2F] text-white text-[11px] font-semibold"
                    >
                      Download .CSV
                    </button>
                  </div>
                  <pre className="p-4 rounded border border-slate-300 bg-white text-[11px] overflow-x-auto text-[#0A1A2F] leading-relaxed">
{`SKU,BARCODE_EAN13,STYLE,PRODUCT_NAME,CARTONS,TOTAL_QTY,FBA_DRIP,FBM_STOCK,WHOLESALE,GROSS_KG,CBM
${activeConsignment.items
  .map(
    (i) =>
      `${i.sku},${i.eanBarcode},${i.styleCode},"${i.productName}",${i.cartons},${i.totalUnits},${i.fbaTransferUnits},${i.fbmInventoryUnits},${i.b2bWholesaleUnits},${i.grossWeightKg},${i.cbm}`
  )
  .join('\n')}`}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Official document format verified under Bangladesh Ministry of Commerce & HMRC/EU Customs rules.
              </span>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A86A] to-[#B08D4D] text-[#0A1A2F] font-bold shadow-md hover:brightness-110 transition-all font-['Montserrat']"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
