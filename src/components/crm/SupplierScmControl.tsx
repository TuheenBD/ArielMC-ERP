'use client';

import React, { useState } from 'react';
import { SolarSupplier, ShipmentConsignment, CustomsClearanceStatus } from '@/types/arelCrm';
import AsycudaCustomsModal, { AsycudaPayload } from './AsycudaCustomsModal';
import {
  Truck,
  Ship,
  Globe2,
  FileCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Phone,
  Mail,
  ShieldCheck,
  Building,
  Tag,
  DollarSign,
  LayoutGrid,
  Table as TableIcon,
  Search,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Share2,
  Download,
  X,
} from 'lucide-react';

interface SupplierScmControlProps {
  suppliers: SolarSupplier[];
  shipments: ShipmentConsignment[];
  onFileDeclaration?: (payload: AsycudaPayload) => void;
  onEditShipment?: (shipment: ShipmentConsignment) => void;
  onDeleteShipment?: (id: string) => void;
  onEditSupplier?: (supplier: SolarSupplier) => void;
  onDeleteSupplier?: (id: string) => void;
  theme?: string;
}

export default function SupplierScmControl({
  suppliers,
  shipments,
  onFileDeclaration,
  onEditShipment,
  onDeleteShipment,
  onEditSupplier,
  onDeleteSupplier,
  theme = 'crm-green',
}: SupplierScmControlProps) {
  const [activeSubTab, setActiveSubTab] = useState<'SUPPLIERS' | 'SHIPMENTS'>('SUPPLIERS');
  const [displayMode, setDisplayMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAsycudaModalOpen, setIsAsycudaModalOpen] = useState(false);

  // Multi-select & Action states
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<string[]>([]);
  const [viewingSupplier, setViewingSupplier] = useState<SolarSupplier | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<SolarSupplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<SolarSupplier | null>(null);

  const [viewingShipment, setViewingShipment] = useState<ShipmentConsignment | null>(null);
  const [editingShipment, setEditingShipment] = useState<ShipmentConsignment | null>(null);
  const [deletingShipment, setDeletingShipment] = useState<ShipmentConsignment | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAsycudaModal = () => {
    setIsAsycudaModalOpen(true);
  };

  const handleDeclarationFiled = (payload: AsycudaPayload) => {
    if (onFileDeclaration) {
      onFileDeclaration(payload);
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    if (
      searchTerm &&
      !s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !s.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !s.countryOfOrigin.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const filteredShipments = shipments.filter((sh) => {
    if (
      searchTerm &&
      !sh.shipmentCode.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !sh.customsBoeNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !sh.factoryName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Supplier Selection Handlers
  const handleSelectAllSuppliers = () => {
    if (selectedSupplierIds.length === filteredSuppliers.length) {
      setSelectedSupplierIds([]);
    } else {
      setSelectedSupplierIds(filteredSuppliers.map((s) => s.id));
    }
  };

  const handleToggleSelectSupplier = (id: string, e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedSupplierIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteSuppliers = () => {
    if (confirm(`Delete ${selectedSupplierIds.length} suppliers?`)) {
      if (onDeleteSupplier) {
        selectedSupplierIds.forEach((id) => onDeleteSupplier(id));
      }
      setSelectedSupplierIds([]);
      showToast(`Deleted ${selectedSupplierIds.length} suppliers`);
    }
  };

  // Shipment Selection Handlers
  const handleSelectAllShipments = () => {
    if (selectedShipmentIds.length === filteredShipments.length) {
      setSelectedShipmentIds([]);
    } else {
      setSelectedShipmentIds(filteredShipments.map((s) => s.id));
    }
  };

  const handleToggleSelectShipment = (id: string, e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedShipmentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteShipments = () => {
    if (confirm(`Delete ${selectedShipmentIds.length} shipments?`)) {
      if (onDeleteShipment) {
        selectedShipmentIds.forEach((id) => onDeleteShipment(id));
      }
      setSelectedShipmentIds([]);
      showToast(`Deleted ${selectedShipmentIds.length} shipments`);
    }
  };

  // Share Handlers
  const handleShareSupplier = (sup: SolarSupplier, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/crm?tab=suppliers_scm&subTab=SUPPLIERS&id=${sup.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast(`Supplier URL for ${sup.companyName} copied to clipboard!`);
    } else {
      showToast(`Share URL: ${shareUrl}`);
    }
  };

  const handleShareShipment = (sh: ShipmentConsignment, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/crm?tab=suppliers_scm&subTab=SHIPMENTS&id=${sh.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast(`Consignment URL for ${sh.shipmentCode} copied to clipboard!`);
    } else {
      showToast(`Share URL: ${shareUrl}`);
    }
  };

  // Download PDF / Manifest
  const handleDownloadSupplierPdf = (sup: SolarSupplier, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast(`Generating Supplier Dossier for ${sup.companyName}...`);
    setTimeout(() => {
      const doc = `
================================================================================
GLOBAL SOURCING VAULT: TIER-1 OEM SUPPLIER DOSSIER
================================================================================
Company:          ${sup.companyName} (${sup.supplierCode})
Origin:           ${sup.countryOfOrigin}
Tier:             ${sup.tierClassification}
MoU Agreement:    ${sup.mouAgreementRef}
Payment Terms:    ${sup.paymentTerms}
Lead Time:        ${sup.leadTimeDaysToChittagong} Days to Chittagong Port
Contact:          ${sup.keyContactPerson} (${sup.email})
WeChat / Mobile:  ${sup.wechatId || 'N/A'}
Audited:          ${sup.factoryAuditVerified ? 'LWG/IEC/TUV Audit Verified' : 'Pending Verification'}
Hardware Lines:   ${sup.brandNames.join(', ')}
================================================================================
      `;
      const blob = new Blob([doc], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sup.supplierCode}_Supplier_Dossier.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, 600);
  };

  const handleDownloadShipmentPdf = (sh: ShipmentConsignment, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast(`Generating ASYCUDA Box 44 Customs Clearance Dossier for ${sh.shipmentCode}...`);
    setTimeout(() => {
      const doc = `
================================================================================
BANGLADESH CUSTOMS ASYCUDA WORLD BOX 44 STATUTORY CLEARANCE DOSSIER
NATIONAL BOARD OF REVENUE & SREDA COMPLIANCE DECLARATION
================================================================================
Shipment Code:    ${sh.shipmentCode}
Customs BoE No:   ${sh.customsBoeNumber}
Client Factory:   ${sh.factoryName}
Import LC Number: ${sh.lcNumber}
ERQ Settlement:   ${sh.erqAccountUtilized ? '100% Exporter ERQ USD Account' : 'Standard Cash LC'}

MARITIME LOGISTICS:
Vessel:           ${sh.vesselName} (${sh.shippingLine})
Bill of Lading:   ${sh.billOfLadingNo}
Port of Loading:  ${sh.portOfLoading}
Port of Arrival:  ${sh.portOfDischarge} (ETA: ${sh.etaPortDate})

ASYCUDA BOX 44 STATUTORY VERIFICATION:
SREDA NOC No:     ${sh.sredaNocNumber} (Date: ${sh.sredaNocDate})
HS Code:          ${sh.hsCode} (Photovoltaic Solar Modules & Inverters)
Duty Tariff:      1.0% Statutory Customs Duty under SRO 159/2021 & SRO 338/2022
Duty Amount:      Tk ${sh.customsDutyPaidBdt.toLocaleString()} BDT
Clearance Status: ${sh.clearanceStatus.toUpperCase()}
C&F Agent:        ${sh.cfAgentName} (${sh.cfAgentContact})
================================================================================
      `;
      const blob = new Blob([doc], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sh.shipmentCode}_ASYCUDA_Box44.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, 600);
  };

  const getClearanceBadge = (status: CustomsClearanceStatus) => {
    switch (status) {
      case 'awaiting_port_arrival':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">1. High Seas In-Transit</span>;
      case 'berthing_chittagong':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">2. Berthing Chittagong</span>;
      case 'box44_sreda_noc_verified':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 font-mono">3. Box 44 SREDA NOC Verified</span>;
      case 'customs_duty_1pct_assessed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 font-mono">4. 1% Tax Paid (SRO 159/338)</span>;
      case 'port_gate_out_cleared':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">5. Port Gate-Out Cleared</span>;
      case 'delivered_central_hub':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">6. Central Hub Staged</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0A1A2F] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/30 flex items-center gap-2 text-xs font-mono animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Filter and Sub-Tab Navigation Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('SUPPLIERS');
                setSearchTerm('');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'SUPPLIERS'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>OEM Manufacturers ({suppliers.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('SHIPMENTS');
                setSearchTerm('');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'SHIPMENTS'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Ship className="w-3.5 h-3.5" />
              <span>Chittagong Port &amp; ASYCUDA ({shipments.length})</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeSubTab === 'SUPPLIERS' ? 'Search OEM supplier, code...' : 'Search BoE, LC, factory...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Bulk Action Bar for Active Tab */}
          {activeSubTab === 'SUPPLIERS' && selectedSupplierIds.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#0A1A2F] text-white px-2.5 py-1 rounded-lg text-xs font-mono animate-in fade-in">
              <span className="font-bold text-emerald-300">{selectedSupplierIds.length} Selected</span>
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={handleBulkDeleteSuppliers}
                className="hover:text-rose-300 text-[10px] font-bold cursor-pointer"
                title="Delete selected suppliers"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setSelectedSupplierIds([])}
                className="text-slate-400 hover:text-white ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {activeSubTab === 'SHIPMENTS' && selectedShipmentIds.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#0A1A2F] text-white px-2.5 py-1 rounded-lg text-xs font-mono animate-in fade-in">
              <span className="font-bold text-emerald-300">{selectedShipmentIds.length} Selected</span>
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={handleBulkDeleteShipments}
                className="hover:text-rose-300 text-[10px] font-bold cursor-pointer"
                title="Delete selected shipments"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setSelectedShipmentIds([])}
                className="text-slate-400 hover:text-white ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setDisplayMode('TABLE')}
              className={`p-1.5 rounded transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                displayMode === 'TABLE'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('GRID')}
              className={`p-1.5 rounded transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                displayMode === 'GRID'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenAsycudaModal}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition font-mono cursor-pointer shadow-2xs"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>File ASYCUDA (Box 44)</span>
          </button>
        </div>
      </div>

      {/* 1. SUPPLIERS SUB-TAB */}
      {activeSubTab === 'SUPPLIERS' && (
        <div>
          {displayMode === 'GRID' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSuppliers.map((sup) => {
                const isSelected = selectedSupplierIds.includes(sup.id);

                return (
                  <div
                    key={sup.id}
                    className={`bg-white rounded-xl border p-4 shadow-2xs hover:border-emerald-400 transition-all flex flex-col justify-between ${
                      isSelected ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleToggleSelectSupplier(sup.id, e)}
                            className="rounded text-emerald-600 focus:ring-0 cursor-pointer mt-0.5"
                          />
                          <div>
                            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                              {sup.tierClassification.replace(/_/g, ' ')}
                            </span>
                            <h4 className="font-bold text-[#0A1A2F] text-sm">{sup.companyName}</h4>
                            <div className="text-[10px] text-slate-400 font-mono">Code: {sup.supplierCode}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{sup.countryOfOrigin}</span>
                        </div>
                      </div>

                      <div className="mt-2.5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400">MoU Ref:</span>
                          <span className="font-mono font-bold text-slate-800">{sup.mouAgreementRef}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400">Payment:</span>
                          <span className="font-semibold text-slate-700">{sup.paymentTerms}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400">Lead Time:</span>
                          <span className="font-mono font-bold text-emerald-700">{sup.leadTimeDaysToChittagong} Days to CGP</span>
                        </div>
                      </div>

                      <div className="mt-2.5">
                        <div className="text-[9px] uppercase font-bold text-slate-400 font-mono mb-1">Hardware Lines:</div>
                        <div className="flex flex-wrap gap-1">
                          {sup.brandNames.map((b, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-semibold">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-[10px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{sup.factoryAuditVerified ? 'Audit Verified' : 'Audit Pending'}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingSupplier(sup)}
                          className="p-1 rounded hover:bg-slate-100 text-blue-600 transition"
                          title="View Supplier Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSupplier({ ...sup })}
                          className="p-1 rounded hover:bg-slate-100 text-amber-600 transition"
                          title="Edit Supplier"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleShareSupplier(sup, e)}
                          className="p-1 rounded hover:bg-slate-100 text-teal-600 transition"
                          title="Share Supplier"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDownloadSupplierPdf(sup, e)}
                          className="p-1 rounded hover:bg-slate-100 text-emerald-700 transition"
                          title="Download Dossier"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingSupplier(sup)}
                          className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                          title="Delete Supplier"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Suppliers Enterprise Table View */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                    <tr>
                      <th className="py-2.5 px-3 w-8 text-center">
                        <input
                          type="checkbox"
                          checked={filteredSuppliers.length > 0 && selectedSupplierIds.length === filteredSuppliers.length}
                          onChange={handleSelectAllSuppliers}
                          className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                        />
                      </th>
                      <th className="py-2.5 px-3">Tier &amp; Code</th>
                      <th className="py-2.5 px-3">Manufacturer &amp; Origin</th>
                      <th className="py-2.5 px-3">MoU Agreement</th>
                      <th className="py-2.5 px-3">Commercial Contact</th>
                      <th className="py-2.5 px-3">Lead Time</th>
                      <th className="py-2.5 px-3">Hardware Lines</th>
                      <th className="py-2.5 px-3">Audit</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredSuppliers.map((sup) => {
                      const isSelected = selectedSupplierIds.includes(sup.id);

                      return (
                        <tr key={sup.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                          <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleToggleSelectSupplier(sup.id, e)}
                              className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                            />
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 block w-fit mb-0.5">
                              {sup.tierClassification.replace(/_/g, ' ')}
                            </span>
                            <span className="text-slate-400 font-mono text-[9px]">{sup.supplierCode}</span>
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="font-bold text-[#0A1A2F]">{sup.companyName}</div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Globe2 className="w-3 h-3 text-slate-400" />
                              <span>{sup.countryOfOrigin}</span>
                            </div>
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="font-mono font-bold text-slate-800 text-[11px]">{sup.mouAgreementRef}</div>
                            <div className="text-slate-500 text-[10px]">{sup.paymentTerms}</div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-semibold text-slate-900">{sup.keyContactPerson}</div>
                            <div className="text-slate-400 text-[10px]">{sup.email}</div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-[#0A1A2F]">
                            {sup.leadTimeDaysToChittagong} Days
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="flex flex-wrap gap-1 max-w-[160px]">
                              {sup.brandNames.map((b, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-semibold">
                                  {b}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                              <CheckCircle2 className="w-3 h-3 text-teal-600" />
                              <span>{sup.factoryAuditVerified ? 'Verified' : 'Pending'}</span>
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setViewingSupplier(sup)}
                                className="p-1 rounded hover:bg-slate-100 text-blue-600 transition"
                                title="View Supplier Profile"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingSupplier({ ...sup })}
                                className="p-1 rounded hover:bg-slate-100 text-amber-600 transition"
                                title="Edit Supplier"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleShareSupplier(sup, e)}
                                className="p-1 rounded hover:bg-slate-100 text-teal-600 transition"
                                title="Share"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDownloadSupplierPdf(sup, e)}
                                className="p-1 rounded hover:bg-slate-100 text-emerald-700 transition"
                                title="Download Dossier"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingSupplier(sup)}
                                className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. SHIPMENTS & CUSTOMS SUB-TAB */}
      {activeSubTab === 'SHIPMENTS' && (
        <div>
          {displayMode === 'GRID' ? (
            <div className="space-y-3">
              {filteredShipments.map((sh) => {
                const isSelected = selectedShipmentIds.includes(sh.id);

                return (
                  <div
                    key={sh.id}
                    className={`bg-white rounded-xl border p-4 shadow-2xs hover:border-emerald-400 transition-all space-y-3 ${
                      isSelected ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-100 gap-2">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelectShipment(sh.id, e)}
                          className="rounded text-emerald-600 focus:ring-0 cursor-pointer mt-0.5"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#0A1A2F] font-mono">{sh.shipmentCode}</span>
                            <span className="text-slate-300">&bull;</span>
                            <span className="text-xs font-mono text-slate-500">BoE: {sh.customsBoeNumber}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Client: <strong className="text-slate-800">{sh.factoryName}</strong> (LC: {sh.lcNumber})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getClearanceBadge(sh.clearanceStatus)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="text-[9px] uppercase font-mono font-bold text-slate-400">Vessel &amp; Carrier</div>
                        <div className="font-bold text-slate-800 mt-0.5">{sh.vesselName}</div>
                        <div className="text-slate-500 text-[10px]">{sh.shippingLine}</div>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="text-[9px] uppercase font-mono font-bold text-slate-400">Bill of Lading</div>
                        <div className="font-bold text-slate-800 font-mono mt-0.5">{sh.billOfLadingNo}</div>
                        <div className="text-slate-400 text-[10px]">Origin: {sh.portOfLoading}</div>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="text-[9px] uppercase font-mono font-bold text-slate-400">Port Discharge / ETA</div>
                        <div className="font-bold text-[#0A1A2F] font-mono mt-0.5">ETA: {sh.etaPortDate}</div>
                        <div className="text-emerald-700 text-[10px] font-semibold">{sh.portOfDischarge}</div>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="text-[9px] uppercase font-mono font-bold text-slate-400">ASYCUDA Duty</div>
                        <div className="font-bold text-emerald-800 font-mono mt-0.5">Tk {sh.customsDutyPaidBdt.toLocaleString()}</div>
                        <div className="text-emerald-600 text-[9px] font-bold">1% Concession SRO</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                      <div>
                        C&amp;F Agent: <strong className="text-slate-800">{sh.cfAgentName}</strong> &bull; SREDA NOC: <span className="font-mono text-purple-700 font-bold">{sh.sredaNocNumber}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingShipment(sh)}
                          className="p-1 rounded hover:bg-slate-100 text-blue-600 transition"
                          title="View Customs Clearance Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingShipment({ ...sh })}
                          className="p-1 rounded hover:bg-slate-100 text-amber-600 transition"
                          title="Edit Consignment"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleShareShipment(sh, e)}
                          className="p-1 rounded hover:bg-slate-100 text-teal-600 transition"
                          title="Share Consignment"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDownloadShipmentPdf(sh, e)}
                          className="p-1 rounded hover:bg-slate-100 text-emerald-700 transition"
                          title="Download ASYCUDA Dossier"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingShipment(sh)}
                          className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                          title="Delete Shipment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Shipments Enterprise Table View */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                    <tr>
                      <th className="py-2.5 px-3 w-8 text-center">
                        <input
                          type="checkbox"
                          checked={filteredShipments.length > 0 && selectedShipmentIds.length === filteredShipments.length}
                          onChange={handleSelectAllShipments}
                          className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                        />
                      </th>
                      <th className="py-2.5 px-3">Shipment &amp; BoE</th>
                      <th className="py-2.5 px-3">Client Factory &amp; LC</th>
                      <th className="py-2.5 px-3">Vessel &amp; Carrier</th>
                      <th className="py-2.5 px-3">B/L &amp; Port</th>
                      <th className="py-2.5 px-3">Box 44 SREDA</th>
                      <th className="py-2.5 px-3">Duty (1%)</th>
                      <th className="py-2.5 px-3">ETA &amp; Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredShipments.map((sh) => {
                      const isSelected = selectedShipmentIds.includes(sh.id);

                      return (
                        <tr key={sh.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                          <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleToggleSelectShipment(sh.id, e)}
                              className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                            />
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="font-mono font-bold text-[#0A1A2F] block">{sh.shipmentCode}</span>
                            <span className="text-slate-400 font-mono text-[9px]">BoE: {sh.customsBoeNumber}</span>
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="font-bold text-[#0A1A2F]">{sh.factoryName}</div>
                            <div className="text-[10px] font-mono text-emerald-700">LC: {sh.lcNumber}</div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-bold text-slate-800">{sh.vesselName}</div>
                            <div className="text-slate-400 text-[10px]">{sh.shippingLine}</div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                            <div className="font-bold text-slate-900">{sh.billOfLadingNo}</div>
                            <div className="text-slate-400 text-[10px]">{sh.portOfLoading}</div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                              {sh.sredaNocNumber}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                            <div className="font-bold text-emerald-800">Tk {sh.customsDutyPaidBdt.toLocaleString()}</div>
                            <div className="text-[9px] text-emerald-600 font-bold">1% Concession</div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-mono text-slate-900 font-bold text-[10px]">ETA: {sh.etaPortDate}</div>
                            <div className="mt-0.5">{getClearanceBadge(sh.clearanceStatus)}</div>
                          </td>

                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setViewingShipment(sh)}
                                className="p-1 rounded hover:bg-slate-100 text-blue-600 transition"
                                title="View Consignment"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingShipment({ ...sh })}
                                className="p-1 rounded hover:bg-slate-100 text-amber-600 transition"
                                title="Edit Consignment"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleShareShipment(sh, e)}
                                className="p-1 rounded hover:bg-slate-100 text-teal-600 transition"
                                title="Share"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDownloadShipmentPdf(sh, e)}
                                className="p-1 rounded hover:bg-slate-100 text-emerald-700 transition"
                                title="Download ASYCUDA Dossier"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingShipment(sh)}
                                className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ASYCUDA Declaration Modal */}
      <AsycudaCustomsModal
        isOpen={isAsycudaModalOpen}
        onClose={() => setIsAsycudaModalOpen(false)}
        onFileDeclaration={handleDeclarationFiled}
        theme={theme}
      />

      {/* Delete Confirmation for Supplier */}
      {deletingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Confirm Deletion</h3>
                <p className="text-[11px] text-slate-500">
                  Delete supplier <span className="font-bold text-rose-600">{deletingSupplier.companyName}</span> ({deletingSupplier.supplierCode})?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingSupplier(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteSupplier) onDeleteSupplier(deletingSupplier.id);
                  showToast(`Deleted ${deletingSupplier.companyName}`);
                  setDeletingSupplier(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation for Shipment */}
      {deletingShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Confirm Deletion</h3>
                <p className="text-[11px] text-slate-500">
                  Delete shipment <span className="font-bold text-rose-600">{deletingShipment.shipmentCode}</span> (BoE: {deletingShipment.customsBoeNumber})?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingShipment(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteShipment) onDeleteShipment(deletingShipment.id);
                  showToast(`Deleted ${deletingShipment.shipmentCode}`);
                  setDeletingShipment(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
