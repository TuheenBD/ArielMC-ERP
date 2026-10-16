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

  // Status badge styling - Authentic Website & CRM Pastel Theme
  const getShipmentStatusBadge = (status: LogisticsConsignment['status']) => {
    switch (status) {
      case 'ON_VESSEL_TRANSIT':
        return {
          label: 'On Vessel (Ocean Transit)',
          color: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
          icon: Ship,
        };
      case 'CUSTOMS_CLEARED_CTG':
        return {
          label: 'Customs Cleared (CTG)',
          color: 'bg-[#FEF6E4] text-[#7A5508] border-[#FBE3B0]',
          icon: CheckCircle2,
        };
      case 'PORT_DISCHARGE':
        return {
          label: 'Port Discharging',
          color: 'bg-[#EDE7F6] text-[#4A2E7A] border-[#D6C7EC]',
          icon: Anchor,
        };
      case 'INBOUND_AT_3PL':
        return {
          label: 'Inbound at 3PL Hub',
          color: 'bg-[#E4F3E9] text-[#14512C] border-[#BBE3C7]',
          icon: Boxes,
        };
      default:
        return {
          label: status.replace(/_/g, ' '),
          color: 'bg-[#EEF2F6] text-[#475569] border-[#D5DEE7]',
          icon: Info,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#C8A96A] text-[#1F3A2E] shadow-sm">
              <Ship className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-wide font-['Montserrat']">
                  Dual-Hub Logistics & Export Documentation Engine
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 text-[#C8A96A] border border-[#C8A96A]/40 font-semibold">
                  Phase 6 Live
                </span>
              </div>
              <p className="text-xs text-[#E8EFE8] font-['Open_Sans'] mt-0.5">
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#b59557] text-[#1F3A2E] font-bold text-xs shadow-md transition-all font-['Montserrat']"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Official Export Docs</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DDE3DD] pb-2 overflow-x-auto text-xs font-['Montserrat']">
        <button
          onClick={() => setActiveTab('CONSIGNMENTS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeTab === 'CONSIGNMENTS'
              ? 'bg-[#1F3A2E] text-white shadow-sm'
              : 'text-[#4A5568] hover:text-[#1F3A2E] hover:bg-white'
          }`}
        >
          <Ship className={`w-4 h-4 ${activeTab === 'CONSIGNMENTS' ? 'text-[#C8A96A]' : 'text-gray-500'}`} />
          <span>Active Ocean Consignments ({consignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('HUBS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeTab === 'HUBS'
              ? 'bg-[#1F3A2E] text-white shadow-sm'
              : 'text-[#4A5568] hover:text-[#1F3A2E] hover:bg-white'
          }`}
        >
          <Boxes className={`w-4 h-4 ${activeTab === 'HUBS' ? 'text-[#C8A96A]' : 'text-gray-500'}`} />
          <span>Dual 3PL Hub Architecture (UK & Germany)</span>
        </button>

        <button
          onClick={() => setActiveTab('HYBRID_FBA')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeTab === 'HYBRID_FBA'
              ? 'bg-[#1F3A2E] text-white shadow-sm'
              : 'text-[#4A5568] hover:text-[#1F3A2E] hover:bg-white'
          }`}
        >
          <Barcode className={`w-4 h-4 ${activeTab === 'HYBRID_FBA' ? 'text-[#C8A96A]' : 'text-gray-500'}`} />
          <span>Amazon Hybrid FBA / FBM Allocation</span>
        </button>

        <button
          onClick={() => setActiveTab('DOCS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeTab === 'DOCS'
              ? 'bg-[#1F3A2E] text-white shadow-sm'
              : 'text-[#4A5568] hover:text-[#1F3A2E] hover:bg-white'
          }`}
        >
          <FileText className={`w-4 h-4 ${activeTab === 'DOCS' ? 'text-[#C8A96A]' : 'text-gray-500'}`} />
          <span>Export Compliance & Form EXP Registry</span>
        </button>

        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeTab === 'SECURITY'
              ? 'bg-[#1F3A2E] text-white shadow-sm'
              : 'text-[#4A5568] hover:text-[#1F3A2E] hover:bg-white'
          }`}
        >
          <ShieldCheck className={`w-4 h-4 ${activeTab === 'SECURITY' ? 'text-[#C8A96A]' : 'text-gray-500'}`} />
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
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden bg-white ${
                    isSelected
                      ? 'border-[#1F3A2E] shadow-md ring-2 ring-[#1F3A2E]/20'
                      : 'border-[#DDE3DD] hover:border-[#1F3A2E]/40 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1F3A2E]">
                          {cng.consignmentNumber}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="font-mono text-[11px] text-gray-600">
                          {cng.containerType} Container
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat']">
                        {cng.destinationPort}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Assigned Destination: <span className="text-[#1A1A1A] font-semibold">{cng.hubName}</span>
                      </p>
                    </div>

                    <span
                      className={`flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border font-bold ${statusBadge.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusBadge.label}</span>
                    </span>
                  </div>

                  {/* Ocean Route Strip */}
                  <div className="mt-4 p-3 rounded-xl bg-[#F4F6F4] border border-[#DDE3DD] text-xs grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-semibold">Origin Port</span>
                      <span className="font-semibold text-[#1A1A1A]">{cng.originPort}</span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">ETD: {cng.etdCtg}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-semibold">Carrier Vessel</span>
                      <span className="font-semibold text-[#1F3A2E]">{cng.carrierVessel}</span>
                      <span className="text-[10px] text-[#14512C] font-semibold block mt-0.5">ETA: {cng.etaDestination}</span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-[#DDE3DD]">
                    <span>
                      Cargo: <strong className="text-[#1A1A1A] font-mono">{cng.totalCartons} Cartons</strong> ({cng.totalUnits} Units)
                    </span>
                    <span>
                      CBM: <strong className="text-[#8A6D3B] font-mono">{cng.totalCbm} m³</strong>
                    </span>
                    <span>
                      Gross: <strong className="text-[#1A1A1A] font-mono">{cng.totalGrossWeightKg} kg</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Inspector for Selected Consignment */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#DDE3DD]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] font-mono text-xs font-bold">
                    {activeConsignment.consignmentNumber}
                  </span>
                  <span className="text-xs text-gray-500">Bill of Lading: {activeConsignment.billOfLadingNo}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">Seal: {activeConsignment.sealNumber}</span>
                </div>
                <h2 className="text-lg font-bold text-[#1F3A2E] mt-1 font-['Montserrat']">
                  Consignment Cargo Manifest & Maritime Tracking
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setDocumentPreviewType('INVOICE');
                    setShowDocModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F6F4] hover:bg-[#E8EFE8] text-[#1F3A2E] text-xs font-semibold border border-[#DDE3DD] transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#1F3A2E]" />
                  <span>Commercial Invoice</span>
                </button>
                <button
                  onClick={() => {
                    setDocumentPreviewType('PACKING_LIST');
                    setShowDocModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F6F4] hover:bg-[#E8EFE8] text-[#1F3A2E] text-xs font-semibold border border-[#DDE3DD] transition-colors"
                >
                  <Boxes className="w-3.5 h-3.5 text-[#8A6D3B]" />
                  <span>Master Packing List</span>
                </button>
                <button
                  onClick={() => {
                    setDocumentPreviewType('EDI_MANIFEST');
                    setShowDocModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E4F3E9] hover:bg-[#cbe8d4] text-[#14512C] text-xs font-semibold border border-[#BBE3C7] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>3PL WMS File</span>
                </button>
              </div>
            </div>

            {/* Maritime Integrity & Tariff Safeguards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1F3A2E] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#14512C]" />
                    Container Moisture Protocol
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] text-[10px] font-mono font-bold">
                    PASS
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Desiccant Poles:</span>
                    <strong className="text-[#1A1A1A] font-mono">{activeConsignment.desiccantProtocol.containerPolesCount} Units (Calcium Chloride)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cavity Clay Packets:</span>
                    <strong className="text-[#1A1A1A] font-mono">{activeConsignment.desiccantProtocol.cavityPacketsCount} Packets (5-10g)</strong>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 pt-1 border-t border-[#DDE3DD]">
                  Prevents leather bloom and mold creasing during 35-45 day sea voyage.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1F3A2E] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0369A1]" />
                    Quarantine & Phytosanitary
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] text-[10px] font-mono font-bold">
                    DAE CERTIFIED
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>DAE Cert No:</span>
                    <strong className="text-[#1A1A1A] font-mono">{activeConsignment.phytosanitaryClearance.daeCertificateNo}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Fumigation Spec:</span>
                    <strong className="text-[#1A1A1A]">{activeConsignment.phytosanitaryClearance.fumigationTreatment}</strong>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 pt-1 border-t border-[#DDE3DD]">
                  ISPM-15 quarantine clearance required for UK/EU port entry on jute & cotton blends.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1F3A2E] flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-[#8A6D3B]" />
                    Zero-Tariff Preference
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] text-[10px] font-mono font-bold">
                    0.0% IMPORT DUTY
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Trade Scheme:</span>
                    <strong className="text-[#14512C]">{activeConsignment.destinationHub === 'WH-UK' ? 'UK DCTS (Comprehensive)' : 'EU EBA (Everything But Arms)'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Bangladesh Bank EXP:</span>
                    <strong className="text-[#1A1A1A] font-mono">{activeConsignment.bangladeshBankFormExp}</strong>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 pt-1 border-t border-[#DDE3DD]">
                  Backed by REX statement of origin and Authorized Dealer EXP bank endorsement.
                </p>
              </div>
            </div>

            {/* Manifest Items Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider font-['Montserrat']">
                  Itemized Manifest & 3-Way Stock Allocation
                </h3>
                <span className="text-xs text-gray-500 font-mono">
                  Container No: {activeConsignment.containerNumber}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white">
                <table className="w-full text-left text-xs text-[#2B2B2B]">
                  <thead className="bg-[#1F3A2E] text-white uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Master SKU & Barcode</th>
                      <th className="py-3 px-4">Style & HS Code</th>
                      <th className="py-3 px-4">Cartons</th>
                      <th className="py-3 px-4">Total Units</th>
                      <th className="py-3 px-4 text-[#C8A96A]">Amazon FBA Drip</th>
                      <th className="py-3 px-4">3PL FBM Stock</th>
                      <th className="py-3 px-4">B2B Wholesale</th>
                      <th className="py-3 px-4 text-right">FOB Value (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDE3DD]">
                    {activeConsignment.items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F8F6F2] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#1F3A2E] text-xs">{item.productName}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-gray-600 text-[11px]">{item.sku}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#FEF6E4] text-[#7A5508] border border-[#FBE3B0] flex items-center gap-1 font-semibold">
                              <Barcode className="w-2.5 h-2.5 text-[#7A5508]" />
                              {item.eanBarcode}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#1F3A2E] font-mono text-xs">Style {item.styleCode}</div>
                          <div className="text-gray-500 text-[11px]">HS {item.hsCode}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium">
                          {item.cartons} ctn <span className="text-[10px] text-gray-400">({item.unitsPerCarton}/ctn)</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#1A1A1A]">
                          {item.totalUnits} pcs
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {item.fbaTransferUnits > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-[#FEF6E4] text-[#7A5508] border border-[#FBE3B0] font-bold text-[11px]">
                              {item.fbaTransferUnits} pcs (FBA)
                            </span>
                          ) : (
                            <span className="text-gray-400 font-mono">0 (Pure FBM)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#0369A1]">
                          {item.fbmInventoryUnits} pcs
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#4A2E7A]">
                          {item.b2bWholesaleUnits} pcs
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#14512C]">
                          ${item.totalPriceUsd.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#F4F6F4] font-semibold text-[#1F3A2E] border-t border-[#DDE3DD] text-xs">
                    <tr>
                      <td colSpan={2} className="py-3 px-4 text-gray-600">
                        Consignment Totals
                      </td>
                      <td className="py-3 px-4 font-mono">{activeConsignment.totalCartons} Cartons</td>
                      <td className="py-3 px-4 font-mono">{activeConsignment.totalUnits} Units</td>
                      <td colSpan={3} className="py-3 px-4 text-gray-500 text-[11px]">
                        Weight: {activeConsignment.totalGrossWeightKg} kg • Vol: {activeConsignment.totalCbm} m³
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#14512C] text-sm font-bold">
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
            <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] border-t-4 border-t-[#1F3A2E] shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇬🇧</span>
                    <h3 className="text-base font-bold text-[#1F3A2E] font-['Montserrat']">
                      United Kingdom Fulfillment Hub (WH-UK)
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">Location: Northampton, UK</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] text-[11px] font-bold">
                  OPERATIONAL
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] text-xs space-y-2">
                <div className="font-bold text-[#1F3A2E]">Legal & Tax Governance:</div>
                <div className="grid grid-cols-2 gap-2 text-gray-700">
                  <div>
                    <span className="text-gray-500 text-[10px] block uppercase font-semibold">Corporate Entity:</span>
                    <span className="font-medium">Ariel Marketing & Communications Ltd (UK)</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block uppercase font-semibold">HMRC VAT Registration:</span>
                    <span className="font-mono text-[#14512C] font-bold">20% UK VAT (GB EORI)</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block uppercase font-semibold">Registered Address:</span>
                    <span className="font-medium">Shelton Street, Covent Garden, London</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block uppercase font-semibold">Environmental Compliance:</span>
                    <span className="font-medium">UK EPR Packaging Waste Certified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider text-[11px]">
                  Negotiated Domestic Carrier Rates (Sub-2kg):
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#F4F6F4] border border-[#DDE3DD] flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Royal Mail Tracked 48:</span>
                    <span className="font-mono font-bold text-[#1A1A1A]">£2.85 – £3.40</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F4F6F4] border border-[#DDE3DD] flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Royal Mail Tracked 24:</span>
                    <span className="font-mono font-bold text-[#1A1A1A]">£3.80 – £4.50</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F4F6F4] border border-[#DDE3DD] flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Evri Standard Tracked:</span>
                    <span className="font-mono font-bold text-[#1A1A1A]">£2.60 – £3.10</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F4F6F4] border border-[#DDE3DD] flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Palletline B2B (Outbound):</span>
                    <span className="font-mono font-bold text-[#8A6D3B]">£45 – £85</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#DDE3DD] flex items-center justify-between text-xs text-gray-500">
                <span>Daily Order Cut-off: <strong className="text-[#1A1A1A] font-mono">2:00 PM GMT</strong></span>
                <span>WMS Integration: <strong className="text-[#1F3A2E] font-mono">Mintsoft / API</strong></span>
              </div>
            </div>

            {/* German Hub Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] border-t-4 border-t-[#C8A96A] shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇩🇪</span>
                    <h3 className="text-base font-bold text-[#1F3A2E] font-['Montserrat']">
                      European Union Fulfillment Hub (WH-DE)
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">Location: Hamburg / Ruhr Industrial Belt</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] text-[11px] font-bold">
                  OPERATIONAL
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] text-xs space-y-2">
                <div className="font-bold text-[#1F3A2E]">Legal & Tax Governance:</div>
                <div className="grid grid-cols-2 gap-2 text-gray-700">
                  <div>
                    <span className="text-gray-500 text-[10px] block uppercase font-semibold">Corporate Structure:</span>
                    <span className="font-medium">DE Permanent Establishment / Branch</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block uppercase font-semibold">German VAT & EU OSS:</span>
                    <span className="font-mono text-[#14512C] font-bold">19% USt-IdNr. (DE EORI)</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block uppercase font-semibold">Packaging Dual-System:</span>
                    <span className="text-[#8A6D3B] font-semibold">LUCID (VerpackG) Licensed</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block uppercase font-semibold">Pan-EU Sales System:</span>
                    <span className="font-medium">One-Stop Shop (OSS) Active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider text-[11px]">
                  Negotiated Domestic & Pan-EU Carrier Rates (Sub-2kg):
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#F4F6F4] border border-[#DDE3DD] flex justify-between items-center">
                    <span className="text-gray-700 font-medium">DHL Paket National:</span>
                    <span className="font-mono font-bold text-[#1A1A1A]">€3.85 – €4.60</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F4F6F4] border border-[#DDE3DD] flex justify-between items-center">
                    <span className="text-gray-700 font-medium">DPD Classic / GLS:</span>
                    <span className="font-mono font-bold text-[#1A1A1A]">€3.50 – €4.20</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F4F6F4] border border-[#DDE3DD] flex justify-between items-center">
                    <span className="text-gray-700 font-medium">DHL Pan-EU (FR/NL/AT):</span>
                    <span className="font-mono font-bold text-[#0369A1]">€7.20 – €9.80</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F4F6F4] border border-[#DDE3DD] flex justify-between items-center">
                    <span className="text-gray-700 font-medium">DB Schenker B2B Pallet:</span>
                    <span className="font-mono font-bold text-[#8A6D3B]">€55 – €110</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#DDE3DD] flex items-center justify-between text-xs text-gray-500">
                <span>Daily Order Cut-off: <strong className="text-[#1A1A1A] font-mono">2:00 PM CET</strong></span>
                <span>WMS Integration: <strong className="text-[#8A6D3B] font-mono font-bold">JTL / Descartes</strong></span>
              </div>
            </div>
          </div>

          {/* Central ERP Automated Geographic Router */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#8A6D3B]" />
                  Central Order Routing Engine (Pseudo-Logic Execution)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Automated warehouse assignment based on buyer shipping country across Shopify, Amazon FBM, Etsy and Direct B2B Quotes.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#E8F0FA] text-[#17456F] border border-[#C5D7ED] font-semibold">
                Server Action Active
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0A1A2F] font-mono text-xs text-slate-300 border border-slate-800 space-y-1">
              <div className="text-emerald-400"># Central Odoo Automated Warehouse Assignment Rule</div>
              <div><span className="text-purple-400">if</span> record.partner_shipping_id.country_id.code == <span className="text-amber-300">&apos;GB&apos;</span>:</div>
              <div className="pl-4 text-slate-200">record.warehouse_id = env[<span className="text-amber-300">&apos;stock.warehouse&apos;</span>].search([(<span className="text-amber-300">&apos;code&apos;</span>, <span className="text-amber-300">&apos;=&apos;</span>, <span className="text-amber-300">&apos;WH-UK&apos;</span>)], limit=1)</div>
              <div><span className="text-purple-400">elif</span> record.partner_shipping_id.country_id.code <span className="text-purple-400">in</span> [<span className="text-amber-300">&apos;DE&apos;</span>, <span className="text-amber-300">&apos;FR&apos;</span>, <span className="text-amber-300">&apos;IT&apos;</span>, <span className="text-amber-300">&apos;ES&apos;</span>, <span className="text-amber-300">&apos;NL&apos;</span>, <span className="text-amber-300">&apos;BE&apos;</span>, <span className="text-amber-300">&apos;AT&apos;</span>, <span className="text-amber-300">&apos;SE&apos;</span>, <span className="text-amber-300">&apos;DK&apos;</span>]:</div>
              <div className="pl-4 text-slate-200">record.warehouse_id = env[<span className="text-amber-300">&apos;stock.warehouse&apos;</span>].search([(<span className="text-amber-300">&apos;code&apos;</span>, <span className="text-amber-300">&apos;=&apos;</span>, <span className="text-amber-300">&apos;WH-DE&apos;</span>)], limit=1)</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AMAZON HYBRID FBA / FBM ALLOCATION */}
      {activeTab === 'HYBRID_FBA' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] border-l-4 border-l-[#C8A96A] shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <Barcode className="w-5 h-5 text-[#8A6D3B]" />
              <h2 className="text-base font-bold text-[#1F3A2E] font-['Montserrat']">
                Recommended Hybrid Strategy (FBA Prime Velocity + FBM Margin & Leather Protection)
              </h2>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-['Open_Sans']">
              Pure FBA destroys leather margins via automated returns liquidation and aged-stock penalties; pure FBM misses the Amazon Prime conversion multiplier. ArielMC operates a dynamic split: 100% of bulk ocean stock arrives at our UK & German 3PLs, which drip-feed fast runners into FBA while retaining high-ticket leather on FBM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#7A5508] text-sm font-['Montserrat']">
                  1. Amazon FBA Drip-Feed
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FEF6E4] text-[#7A5508] border border-[#FBE3B0] text-[10px] font-mono font-bold">
                  PRIME BADGE
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Transfer 30 to 45 days of supply from UK & German 3PLs into Amazon Fulfillment Centers.
              </p>
              <div className="space-y-2 pt-2 border-t border-[#DDE3DD] text-xs">
                <div className="p-2.5 rounded-lg bg-[#F8F6F2] border border-[#DDE3DD]">
                  <span className="font-semibold text-[#1A1A1A] block">AMC-JCT-JC-NAT-SGL</span>
                  <span className="text-[11px] text-gray-500">16&quot; Jute Commuter Tote (Natural)</span>
                  <span className="text-[#7A5508] font-mono text-[11px] block mt-1 font-bold">Allocation: 400 pcs / hub</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8F6F2] border border-[#DDE3DD]">
                  <span className="font-semibold text-[#1A1A1A] block">AMC-BLM-DL-IND-SGL</span>
                  <span className="text-[11px] text-gray-500">Bloom Embroidered Laptop Tote</span>
                  <span className="text-[#7A5508] font-mono text-[11px] block mt-1 font-bold">Allocation: 150 pcs / hub</span>
                </div>
              </div>
              <div className="text-[11px] text-[#14512C] bg-[#E4F3E9] p-2.5 rounded-lg border border-[#BBE3C7] font-semibold">
                ✓ Converts at 25%–35% with Prime next-day shipping without aged inventory risk.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0369A1] text-sm font-['Montserrat']">
                  2. 3PL Seller-Fulfilled (FBM)
                </span>
                <span className="px-2 py-0.5 rounded bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] text-[10px] font-mono font-bold">
                  WHITE-GLOVE QC
                </span>
              </div>
              <p className="text-xs text-gray-500">
                High-ticket full-grain leather totes fulfilled directly from UK (Northampton) & German (Hamburg) 3PLs.
              </p>
              <div className="space-y-2 pt-2 border-t border-[#DDE3DD] text-xs">
                <div className="p-2.5 rounded-lg bg-[#F8F6F2] border border-[#DDE3DD]">
                  <span className="font-semibold text-[#1A1A1A] block">AMC-LT2-LEA-BUR-SGL</span>
                  <span className="text-[11px] text-gray-500">Style 2 Full Leather Tote (€120 RRP)</span>
                  <span className="text-[#0369A1] font-mono text-[11px] block mt-1 font-bold">Allocation: 300 pcs at 3PL</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8F6F2] border border-[#DDE3DD]">
                  <span className="font-semibold text-[#1A1A1A] block">AMC-LT3-LEA-BUR-SGL</span>
                  <span className="text-[11px] text-gray-500">Style 3 Hex-Base Leather (€135 RRP)</span>
                  <span className="text-[#0369A1] font-mono text-[11px] block mt-1 font-bold">Allocation: 250 pcs at 3PL</span>
                </div>
              </div>
              <div className="text-[11px] text-[#0369A1] bg-[#E0F2FE] p-2.5 rounded-lg border border-[#BAE6FD] font-semibold">
                ✓ Manual QC on customer returns: dustbags replaced, leather wiped; zero automated write-offs.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#4A2E7A] text-sm font-['Montserrat']">
                  3. B2B Wholesale Reserve
                </span>
                <span className="px-2 py-0.5 rounded bg-[#EDE7F6] text-[#4A2E7A] border border-[#D6C7EC] text-[10px] font-mono font-bold">
                  INSTITUTIONAL
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Ring-fenced pallet inventory at 3PLs for European boutiques, corporate gifts, and trade accounts.
              </p>
              <div className="space-y-2 pt-2 border-t border-[#DDE3DD] text-xs">
                <div className="p-2.5 rounded-lg bg-[#F8F6F2] border border-[#DDE3DD]">
                  <span className="font-semibold text-[#1A1A1A] block">Palletline / Schenker Dispatch</span>
                  <span className="text-[11px] text-gray-500">Full carton master packaging</span>
                  <span className="text-[#4A2E7A] font-mono text-[11px] block mt-1 font-bold">Pallet Prep: £10–£18 / €12–€22</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8F6F2] border border-[#DDE3DD]">
                  <span className="font-semibold text-[#1A1A1A] block">24–48h Domestic Samples</span>
                  <span className="text-[11px] text-gray-500">Off-the-shelf samples dispatched locally</span>
                  <span className="text-[#4A2E7A] font-mono text-[11px] block mt-1 font-bold">Instant UK/EU buyer sampling</span>
                </div>
              </div>
              <div className="text-[11px] text-[#4A2E7A] bg-[#EDE7F6] p-2.5 rounded-lg border border-[#D6C7EC] font-semibold">
                ✓ Zero MCF surcharges and immediate settlement cash flow.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXPORT COMPLIANCE & FORM EXP REGISTRY */}
      {activeTab === 'DOCS' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#14512C]" />
                  Official Bangladesh Export Clearance & Regulatory Filings
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Reconciliation of Bangladesh Bank FE Circular No. 48/31, Form EXP, DAE Phytosanitary, and REX Origin.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setDocumentPreviewType('FORM_EXP');
                    setShowDocModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#15271F] text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#C8A96A]" />
                  <span>Inspect Form EXP Details</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-1">
                <span className="text-[10px] text-gray-500 block font-mono uppercase font-bold">BB FE Circular No. 48/31</span>
                <span className="text-sm font-bold text-[#1F3A2E] block">E-Commerce Export Waiver</span>
                <p className="text-[11px] text-gray-600 mt-1">
                  Enables export without upfront Letter of Credit (LC) for recognized e-commerce pipelines.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-1">
                <span className="text-[10px] text-gray-500 block font-mono uppercase font-bold">ERQ Account Governance</span>
                <span className="text-sm font-bold text-[#14512C] block">USD/GBP Retained</span>
                <p className="text-[11px] text-gray-600 mt-1">
                  Export Retention Quota utilized strictly for UK 3PL warehousing and overseas ad spend.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-1">
                <span className="text-[10px] text-gray-500 block font-mono uppercase font-bold">DAE Phytosanitary</span>
                <span className="text-sm font-bold text-[#0369A1] block">ISPM-15 Fumigation</span>
                <p className="text-[11px] text-gray-600 mt-1">
                  Required for natural golden jute and cotton shopping totes before Chittagong port gate-in.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] space-y-1">
                <span className="text-[10px] text-gray-500 block font-mono uppercase font-bold">EU REX & UK DCTS</span>
                <span className="text-sm font-bold text-[#8A6D3B] block">0% Preferential Duty</span>
                <p className="text-[11px] text-gray-600 mt-1">
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
          <div className="p-5 rounded-2xl bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#C8A96A]" />
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  Standardized Security Operating Procedure (SOP-SEC-2026-V1)
                </h2>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/20 text-[#C8A96A] border border-[#C8A96A]/40 font-semibold">
                Cross-Border Dual-Entity Protocol
              </span>
            </div>
            <p className="text-xs text-[#E8EFE8] font-['Open_Sans']">
              Dhaka HQ (Niketon, Gulshan) & London Subsidiary (Shelton Street). Mandated access control across Shopify DTC, Amazon Seller Central, Wise Business UK, and B2B wire settlement verifications.
            </p>
          </div>

          {/* Incident Kill-Switch Runbook Visual Diagram */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#8A6D3B]" />
              Incident Response Plan & Emergency Kill-Switch Runbook
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-[#F7C0C0] shadow-sm space-y-2">
                <div className="text-[10px] font-mono font-bold text-[#8A1515] uppercase px-2 py-0.5 rounded bg-[#FDEAEA] inline-block">
                  Step 1: First 5 Minutes
                </div>
                <div className="text-xs font-bold text-[#1A1A1A]">Isolate & Freeze</div>
                <ul className="text-[11px] text-gray-600 space-y-1">
                  <li>• Ad Hijack: Freeze Meta/TikTok via Master Portfolio.</li>
                  <li>• Financial Anomaly: Freeze Wise Virtual Cards via mobile app.</li>
                  <li>• Credential Leak: Terminate Google Workspace sessions.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#FBE3B0] shadow-sm space-y-2">
                <div className="text-[10px] font-mono font-bold text-[#7A5508] uppercase px-2 py-0.5 rounded bg-[#FEF6E4] inline-block">
                  Step 2: First 15 Minutes
                </div>
                <div className="text-xs font-bold text-[#1A1A1A]">Notify Command</div>
                <ul className="text-[11px] text-gray-600 space-y-1">
                  <li>• Dhaka Lead: Call <strong className="text-[#1A1A1A]">+880 2410 811 91</strong></li>
                  <li>• Mobile: <strong className="text-[#1A1A1A]">+880 1818273458</strong></li>
                  <li>• UK Operations Desk: Direct phone to Managing Director.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#C5D7ED] shadow-sm space-y-2">
                <div className="text-[10px] font-mono font-bold text-[#17456F] uppercase px-2 py-0.5 rounded bg-[#E8F0FA] inline-block">
                  Step 3: First 60 Minutes
                </div>
                <div className="text-xs font-bold text-[#1A1A1A]">Containment & Remediation</div>
                <ul className="text-[11px] text-gray-600 space-y-1">
                  <li>• Revoke OAuth tokens on Shopify & Stripe.</li>
                  <li>• Rotate master passwords in 1Password / Bitwarden.</li>
                  <li>• Terminate all active browser sessions.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#D6C7EC] shadow-sm space-y-2">
                <div className="text-[10px] font-mono font-bold text-[#4A2E7A] uppercase px-2 py-0.5 rounded bg-[#EDE7F6] inline-block">
                  Step 4: 24–72 Hours
                </div>
                <div className="text-xs font-bold text-[#1A1A1A]">Regulatory Assessment</div>
                <ul className="text-[11px] text-gray-600 space-y-1">
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
            <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#14512C]" />
                  Supplier Out-of-Band Callback Verification (BEC Defense)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] font-bold">
                  MANDATORY
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Any request from Savar leather tanneries, Narayanganj mills, or B2B buyers to change bank settlement details or Wise emails requires mandatory two-factor callback verification:
              </p>
              <div className="p-3.5 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD] text-xs space-y-2">
                <div className="flex items-center gap-2 text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-[#14512C] shrink-0" />
                  <span>Must contact verified executive contact via pre-established telephone number or video call.</span>
                </div>
                <div className="flex items-center gap-2 text-[#8A1515]">
                  <AlertTriangle className="w-4 h-4 text-[#8A1515] shrink-0" />
                  <span>Email confirmation alone is strictly prohibited as a basis for changing banking rails.</span>
                </div>
              </div>
            </div>

            {/* Annual Security Budget Tracker */}
            <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#8A6D3B]" />
                  Annual Security Implementation Budget (Year 1)
                </h3>
                <span className="text-xs font-mono font-bold text-[#1F3A2E]">
                  Total: £1,280 / ৳198,400
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white">
                <table className="w-full text-left text-[11px] text-[#2B2B2B]">
                  <thead className="bg-[#1F3A2E] text-white border-b border-[#DDE3DD]">
                    <tr>
                      <th className="py-2.5 px-3">Component</th>
                      <th className="py-2.5 px-3">Cost (GBP)</th>
                      <th className="py-2.5 px-3">Cost (BDT)</th>
                      <th className="py-2.5 px-3">Strategic Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDE3DD]">
                    {securityBudget.map((b) => (
                      <tr key={b.id} className="hover:bg-[#F8F6F2]">
                        <td className="py-2 px-3 font-semibold text-[#1F3A2E]">{b.component}</td>
                        <td className="py-2 px-3 font-mono font-bold text-[#1A1A1A]">£{b.annualCostGbp}</td>
                        <td className="py-2 px-3 font-mono text-gray-600">৳{b.annualCostBdt.toLocaleString()}</td>
                        <td className="py-2 px-3 text-gray-500 text-[10px]">{b.strategicPurpose}</td>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 border-b-[3px] border-[#C8A96A] bg-[#1F3A2E] flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#C8A96A]" />
                <h2 className="text-base font-bold font-['Montserrat']">
                  Official Export Documentation Generator (Print / Export Ready)
                </h2>
              </div>
              <button
                onClick={() => setShowDocModal(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>

            {/* Document Type Selector Bar */}
            <div className="flex items-center px-6 py-2.5 bg-[#F4F6F4] border-b border-[#DDE3DD] gap-2 text-xs overflow-x-auto">
              <button
                onClick={() => setDocumentPreviewType('INVOICE')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors font-bold ${
                  documentPreviewType === 'INVOICE'
                    ? 'bg-[#1F3A2E] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#1F3A2E] hover:bg-white'
                }`}
              >
                Commercial Invoice
              </button>
              <button
                onClick={() => setDocumentPreviewType('PACKING_LIST')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors font-bold ${
                  documentPreviewType === 'PACKING_LIST'
                    ? 'bg-[#1F3A2E] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#1F3A2E] hover:bg-white'
                }`}
              >
                Master Packing List
              </button>
              <button
                onClick={() => setDocumentPreviewType('FORM_EXP')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors font-bold ${
                  documentPreviewType === 'FORM_EXP'
                    ? 'bg-[#1F3A2E] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#1F3A2E] hover:bg-white'
                }`}
              >
                Bangladesh Bank Form EXP
              </button>
              <button
                onClick={() => setDocumentPreviewType('EDI_MANIFEST')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors font-bold ${
                  documentPreviewType === 'EDI_MANIFEST'
                    ? 'bg-[#1F3A2E] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#1F3A2E] hover:bg-white'
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
                  <div className="border-b-2 border-[#C8A96A] pb-4 flex items-start justify-between">
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
                      <span className="text-xs font-bold font-['Montserrat'] uppercase tracking-wider text-[#8A6D3B] block">
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
                    <thead className="bg-[#1F3A2E] text-white text-[11px] font-['Montserrat']">
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
                    <tfoot className="border-t-2 border-[#1F3A2E] font-bold text-xs">
                      <tr>
                        <td colSpan={3} className="p-2.5">TOTAL FOB VALUE (CHATTOGRAM):</td>
                        <td colSpan={2} className="p-2.5 text-right font-mono text-base text-[#14512C]">
                          ${activeConsignment.totalFobValueUsd.toLocaleString()} USD
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* Preferential Origin Declaration */}
                  <div className="p-3.5 rounded-lg border border-[#C8A96A] bg-amber-50/50 text-xs space-y-1">
                    <strong className="font-['Montserrat'] text-[#0A1A2F] block">
                      PREFERENTIAL ORIGIN DECLARATION (0% DUTY APPLIED):
                    </strong>
                    <p className="text-[11px] text-[#3A3A3A] italic">
                      &quot;{activeConsignment.rexStatementOfOrigin}&quot;
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
                  <div className="border-b-2 border-[#C8A96A] pb-4 flex items-start justify-between">
                    <div>
                      <h1 className="text-xl font-bold font-['Montserrat'] text-[#0A1A2F]">
                        ARIEL MARKETING & COMMUNICATIONS LIMITED
                      </h1>
                      <p className="text-xs text-[#3A3A3A]">Master Cargo Packing List & ITF-14 Shipping Markings</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-['Montserrat'] uppercase text-[#8A6D3B] block">
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
                    <thead className="bg-[#1F3A2E] text-white text-[11px] font-['Montserrat']">
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
                    <tfoot className="border-t-2 border-[#1F3A2E] font-bold text-xs">
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
                      <div>CCI&amp;E REGISTRATION: <strong>EPB-2026-DH-08819</strong></div>
                      <div>EXPORTER: <strong>ARIEL MARKETING &amp; COMMUNICATIONS LTD</strong></div>
                      <div>CONSIGNEE: <strong>ARIEL MARKETING &amp; COMMUNICATIONS LTD (UK)</strong></div>
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
                      className="px-3 py-1 rounded bg-[#1F3A2E] text-white text-[11px] font-semibold"
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
            <div className="p-4 border-t border-[#DDE3DD] bg-white flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Official document format verified under Bangladesh Ministry of Commerce &amp; HMRC/EU Customs rules.
              </span>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b59557] text-[#1F3A2E] font-bold shadow-md transition-all font-['Montserrat']"
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
