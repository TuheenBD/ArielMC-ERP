'use client';

import React, { useState } from 'react';
import { InventoryLot, InventoryLotStatus } from '@/types/arelCrm';
import {
  Boxes,
  Truck,
  Ship,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Tag,
  Building2,
} from 'lucide-react';

interface InventoryLotTrackingProps {
  lots: InventoryLot[];
}

export default function InventoryLotTracking({ lots }: InventoryLotTrackingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredLots = lots.filter((l) => {
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    if (searchTerm && !l.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) && !l.productName.toLowerCase().includes(searchTerm.toLowerCase()) && !l.assignedFactoryName?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: InventoryLotStatus) => {
    switch (status) {
      case 'order_placed_oem':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">OEM Order Placed</span>;
      case 'high_seas_in_transit':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">High Seas In-Transit</span>;
      case 'chittagong_port_cfs':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Chittagong Port CFS</span>;
      case 'central_warehouse_tongi':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Central Warehouse Tongi</span>;
      case 'in_transit_to_factory':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">In-Transit to Site</span>;
      case 'staged_at_roof':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">Staged at Roof</span>;
      case 'installed_and_commissioned':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Installed &amp; Commissioned</span>;
      case 'damaged_or_rma':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">Damaged / RMA</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Lot #, product, or assigned factory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Lot Stages</option>
            <option value="chittagong_port_cfs">Chittagong Port CFS</option>
            <option value="central_warehouse_tongi">Central Warehouse Tongi</option>
            <option value="staged_at_roof">Staged at Roof</option>
            <option value="installed_and_commissioned">Commissioned</option>
          </select>
        </div>
      </div>

      {/* Inventory Lots Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Lot # &amp; Component</th>
                <th className="py-3 px-4">Quantity &amp; UOM</th>
                <th className="py-3 px-4">Current Staging Location</th>
                <th className="py-3 px-4">Assigned Project / Client</th>
                <th className="py-3 px-4">Container &amp; Customs BoE</th>
                <th className="py-3 px-4">Stage Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLots.map((lot) => (
                <tr key={lot.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0A1A2F] font-mono">{lot.lotNumber}</div>
                    <div className="text-[11px] text-slate-500">{lot.productName}</div>
                    {lot.serialNumberStart && (
                      <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                        S/N: {lot.serialNumberStart} &bull; {lot.serialNumberEnd}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-slate-900 text-sm">
                      {lot.quantity.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase">{lot.unit}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{lot.currentLocation}</span>
                    </div>
                    {lot.arrivalDate && (
                      <div className="text-[10px] text-slate-400 mt-0.5">Arrived: {lot.arrivalDate}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {lot.assignedFactoryName ? (
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{lot.assignedFactoryName}</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-700">Allocated to Roof</div>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                        Central Buffer Stock
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div className="text-slate-700">Cont: {lot.containerNumber || 'N/A'}</div>
                    <div className="text-slate-400 text-[10px]">BoE: {lot.customsBoeNumber || 'Local Procurement'}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    {getStatusBadge(lot.status)}
                    {lot.inspectedBy && (
                      <div className="text-[9.5px] text-slate-400 mt-1">Verified: {lot.inspectedBy}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
