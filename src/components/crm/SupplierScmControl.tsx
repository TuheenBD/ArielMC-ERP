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
} from 'lucide-react';

interface SupplierScmControlProps {
  suppliers: SolarSupplier[];
  shipments: ShipmentConsignment[];
  onFileDeclaration?: (payload: AsycudaPayload) => void;
  theme?: string;
}

export default function SupplierScmControl({
  suppliers,
  shipments,
  onFileDeclaration,
  theme = 'crm-green',
}: SupplierScmControlProps) {
  const [activeSubTab, setActiveSubTab] = useState<'SUPPLIERS' | 'SHIPMENTS'>('SUPPLIERS');
  const [displayMode, setDisplayMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAsycudaModalOpen, setIsAsycudaModalOpen] = useState(false);

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
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">6. Delivered Central Hub</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0A1A2F]">
              Supplier Sourcing Vault &amp; SCM Customs Control
            </h3>
            <p className="text-[11px] text-slate-500">
              Tier-1 OEM factory MoUs, Client ERQ USD LC tracking, and ASYCUDA World Box 44 SREDA NOC clearance.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search supplier, BoE, port..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Sub-Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveSubTab('SUPPLIERS')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'SUPPLIERS'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tier-1 Suppliers &amp; MoUs ({suppliers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('SHIPMENTS')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'SHIPMENTS'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shipments &amp; ASYCUDA Customs ({shipments.length})
            </button>
          </div>

          {/* View Toggle (Grid / Table) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setDisplayMode('GRID')}
              className={`p-1.5 rounded-md transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                displayMode === 'GRID'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Switch to Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('TABLE')}
              className={`p-1.5 rounded-md transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                displayMode === 'TABLE'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Switch to Enterprise Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* File ASYCUDA Declaration Button */}
          <button
            type="button"
            onClick={handleOpenAsycudaModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1A2F] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer font-mono"
          >
            <Plus className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>File ASYCUDA Box 44</span>
          </button>
        </div>
      </div>

      {/* 1. SUPPLIERS SUB-TAB */}
      {activeSubTab === 'SUPPLIERS' && (
        <div>
          {displayMode === 'GRID' ? (
            /* Suppliers Card Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSuppliers.map((sup) => (
                <div
                  key={sup.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {sup.tierClassification.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        Lead: {sup.leadTimeDaysToChittagong}d
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-[#0A1A2F]">{sup.companyName}</h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Globe2 className="w-3 h-3 text-slate-400" />
                        <span>{sup.countryOfOrigin}</span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="font-mono text-slate-400">Code: {sup.supplierCode}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase text-slate-400">MoU Ref: {sup.mouAgreementRef}</div>
                        <div className="text-slate-700 font-medium mt-0.5">Terms: {sup.paymentTerms}</div>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 text-slate-600">
                        <div>Contact: {sup.keyContactPerson}</div>
                        <div className="text-slate-400 text-[11px]">{sup.email}</div>
                        {sup.wechatId && <div className="text-emerald-700 text-[11px] font-mono">WeChat: {sup.wechatId}</div>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Brands Supplied:</div>
                      <div className="flex flex-wrap gap-1">
                        {sup.brandNames.map((b, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{sup.factoryAuditVerified ? 'Factory Audit Verified' : 'Audit Pending'}</span>
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">Active Orders: {sup.activeOrdersCount}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Suppliers Enterprise Table View */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                    <tr>
                      <th className="py-3 px-4">Tier &amp; Supplier Code</th>
                      <th className="py-3 px-4">Manufacturer Name &amp; Origin</th>
                      <th className="py-3 px-4">MoU Agreement &amp; Payment Terms</th>
                      <th className="py-3 px-4">Key Commercial Contact</th>
                      <th className="py-3 px-4">Lead Time</th>
                      <th className="py-3 px-4">Hardware Lines Supplied</th>
                      <th className="py-3 px-4">Active Orders</th>
                      <th className="py-3 px-4 text-right">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredSuppliers.map((sup) => (
                      <tr key={sup.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 block w-fit mb-1">
                            {sup.tierClassification.replace(/_/g, ' ')}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">{sup.supplierCode}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#0A1A2F]">{sup.companyName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Globe2 className="w-3 h-3 text-slate-400" />
                            <span>{sup.countryOfOrigin}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-800 text-[11px]">{sup.mouAgreementRef}</div>
                          <div className="text-slate-500 text-[10px]">{sup.paymentTerms}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-900">{sup.keyContactPerson}</div>
                          <div className="text-slate-400 text-[10px]">{sup.email}</div>
                          {sup.wechatId && <div className="text-emerald-700 text-[10px] font-mono">WeChat: {sup.wechatId}</div>}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-[#0A1A2F]">
                          {sup.leadTimeDaysToChittagong} Days
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {sup.brandNames.map((b, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-semibold">
                                {b}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-emerald-700">
                          {sup.activeOrdersCount} Orders
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                            <CheckCircle2 className="w-3 h-3 text-teal-600" />
                            <span>{sup.factoryAuditVerified ? 'Verified' : 'Pending'}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
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
            /* Shipments Card Grid */
            <div className="space-y-4">
              {filteredShipments.map((sh) => (
                <div
                  key={sh.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
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

                    <div>{getClearanceBadge(sh.clearanceStatus)}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Vessel &amp; Carrier</div>
                      <div className="font-bold text-slate-800 mt-0.5">{sh.vesselName}</div>
                      <div className="text-slate-500 text-[11px]">{sh.shippingLine}</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Bill of Lading</div>
                      <div className="font-bold text-slate-800 font-mono mt-0.5">{sh.billOfLadingNo}</div>
                      <div className="text-slate-400 text-[10px]">Origin: {sh.portOfLoading}</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Port Discharge / ETA</div>
                      <div className="font-bold text-[#0A1A2F] font-mono mt-0.5">ETA: {sh.etaPortDate}</div>
                      <div className="text-emerald-700 text-[11px] font-semibold">{sh.portOfDischarge}</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-[10px] uppercase font-mono font-bold text-slate-400">ASYCUDA Duty Assessment</div>
                      <div className="font-bold text-emerald-800 font-mono mt-0.5">Tk {sh.customsDutyPaidBdt.toLocaleString()}</div>
                      <div className="text-emerald-600 text-[10px] font-bold">1% Concession SRO 159/338</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                    <div>
                      C&amp;F Agent: <strong className="text-slate-800">{sh.cfAgentName}</strong> &bull; SREDA NOC: <span className="font-mono text-purple-700 font-bold">{sh.sredaNocNumber}</span>
                    </div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      {sh.erqAccountUtilized ? 'Client ERQ USD LC Utilized' : 'Standard Bank LC'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Shipments Enterprise Table View */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                    <tr>
                      <th className="py-3 px-4">Shipment &amp; BoE</th>
                      <th className="py-3 px-4">Client Factory &amp; LC Number</th>
                      <th className="py-3 px-4">Vessel &amp; Carrier</th>
                      <th className="py-3 px-4">B/L &amp; Loading Port</th>
                      <th className="py-3 px-4">SREDA NOC (Box 44)</th>
                      <th className="py-3 px-4">Duty (1% SRO)</th>
                      <th className="py-3 px-4">Port ETA &amp; Discharge</th>
                      <th className="py-3 px-4 text-right">Clearance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredShipments.map((sh) => (
                      <tr key={sh.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-[#0A1A2F] block">{sh.shipmentCode}</span>
                          <span className="text-slate-400 font-mono text-[10px]">BoE: {sh.customsBoeNumber}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#0A1A2F]">{sh.factoryName}</div>
                          <div className="text-[10px] font-mono text-emerald-700">LC: {sh.lcNumber}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-800">{sh.vesselName}</div>
                          <div className="text-slate-400 text-[10px]">{sh.shippingLine}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                          <div className="font-bold text-slate-900">{sh.billOfLadingNo}</div>
                          <div className="text-slate-400 text-[10px]">{sh.portOfLoading}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                            {sh.sredaNocNumber}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                          <div className="font-bold text-emerald-800">Tk {sh.customsDutyPaidBdt.toLocaleString()}</div>
                          <div className="text-[9px] text-emerald-600 font-bold">1% Concession (SRO)</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-mono text-slate-900 font-bold">ETA: {sh.etaPortDate}</div>
                          <div className="text-[10px] text-slate-500">{sh.portOfDischarge}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {getClearanceBadge(sh.clearanceStatus)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ASYCUDA World Box 44 Customs Declaration Modal */}
      <AsycudaCustomsModal
        isOpen={isAsycudaModalOpen}
        onClose={() => setIsAsycudaModalOpen(false)}
        onFileDeclaration={handleDeclarationFiled}
        theme={theme}
      />
    </div>
  );
}
