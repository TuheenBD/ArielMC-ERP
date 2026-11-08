'use client';

import React, { useState } from 'react';
import { SolarSupplier, ShipmentConsignment, CustomsClearanceStatus } from '@/types/arelCrm';
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
} from 'lucide-react';

interface SupplierScmControlProps {
  suppliers: SolarSupplier[];
  shipments: ShipmentConsignment[];
}

export default function SupplierScmControl({
  suppliers,
  shipments,
}: SupplierScmControlProps) {
  const [activeSubTab, setActiveSubTab] = useState<'SUPPLIERS' | 'SHIPMENTS'>('SUPPLIERS');

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
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
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

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveSubTab('SUPPLIERS')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
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
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              activeSubTab === 'SHIPMENTS'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shipments &amp; ASYCUDA Customs ({shipments.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: SUPPLIERS DIRECTORY */}
      {activeSubTab === 'SUPPLIERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {suppliers.map((supp) => (
            <div
              key={supp.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {supp.tierClassification.replace(/_/g, ' ')}
                    </span>
                    <h4 className="text-base font-bold text-[#0A1A2F] mt-1.5">
                      {supp.companyName}
                    </h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Globe2 className="w-3 h-3 text-slate-400" />
                      <span>{supp.countryOfOrigin} &bull; Code: {supp.supplierCode}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Lead: {supp.leadTimeDaysToChittagong}d
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="font-semibold text-slate-900">
                    MoU Ref: <span className="font-mono text-emerald-800">{supp.mouAgreementRef}</span>
                  </div>
                  <div className="text-slate-500">
                    Terms: <strong className="text-slate-800">{supp.paymentTerms}</strong>
                  </div>
                  <div className="text-slate-500">
                    Contact: {supp.keyContactPerson} ({supp.email})
                  </div>
                  {supp.wechatId && (
                    <div className="text-slate-500 font-mono text-[10px]">
                      WeChat: {supp.wechatId}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-mono mb-1">Brands Supplied:</div>
                  <div className="flex flex-wrap gap-1">
                    {supp.brandNames.map((brand, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Factory Audit Passed</span>
                </span>
                <span className="text-slate-500 font-mono text-[10px]">
                  Active LCs: <strong>{supp.activeOrdersCount}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: SHIPMENTS & CUSTOMS CLEARANCE */}
      {activeSubTab === 'SHIPMENTS' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Shipment &amp; Factory</th>
                  <th className="py-3 px-4">Vessel &amp; B/L #</th>
                  <th className="py-3 px-4">SREDA NOC (Box 44)</th>
                  <th className="py-3 px-4">Customs BoE &amp; 1% Tax</th>
                  <th className="py-3 px-4">ETA &amp; C&amp;F Agent</th>
                  <th className="py-3 px-4">Clearance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {shipments.map((ship) => (
                  <tr key={ship.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0A1A2F]">{ship.factoryName}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {ship.shipmentCode} &bull; LC: {ship.lcNumber}
                      </div>
                      {ship.erqAccountUtilized && (
                        <span className="inline-block mt-0.5 text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          ERQ USD LC (2.5% Forex Saved)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-semibold text-slate-900">{ship.vesselName}</div>
                      <div className="text-[10px] text-slate-500">B/L: {ship.billOfLadingNo}</div>
                      <div className="text-[9.5px] text-slate-400">{ship.portOfLoading} &rarr; {ship.portOfDischarge}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="font-bold text-emerald-800">{ship.sredaNocNumber}</div>
                      <div className="text-[10px] text-slate-400">Issued: {ship.sredaNocDate}</div>
                      <div className="text-[9px] text-emerald-600 font-semibold">Attached in ASYCUDA Box 44</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900">{ship.customsBoeNumber}</div>
                      <div className="text-[10px] text-emerald-700 font-bold">
                        Duty Paid: Tk {ship.customsDutyPaidBdt.toLocaleString()} (1% AIT)
                      </div>
                      <div className="text-[9.5px] text-slate-400">HS Code: {ship.hsCode}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">ETA: {ship.etaPortDate}</div>
                      <div className="text-[10px] text-slate-500">{ship.cfAgentName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getClearanceBadge(ship.clearanceStatus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
