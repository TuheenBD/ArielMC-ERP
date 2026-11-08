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
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';

interface InventoryLotTrackingProps {
  lots: InventoryLot[];
}

export default function InventoryLotTracking({ lots }: InventoryLotTrackingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [displayMode, setDisplayMode] = useState<'GRID' | 'TABLE'>('GRID');

  const filteredLots = lots.filter((l) => {
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    if (
      searchTerm &&
      !l.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !l.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !l.assignedFactoryName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
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
      {/* Top Search, Filter & View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0A1A2F]">
              Solar Inventory Lot Staging &amp; Traceability ({filteredLots.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              End-to-end custody tracking: Chittagong Port CFS &bull; Central Tongi Warehouse &bull; Factory Rooftop staging.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Lot #, product, or factory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Lot Stages</option>
              <option value="chittagong_port_cfs">Chittagong Port CFS</option>
              <option value="central_warehouse_tongi">Central Warehouse Tongi</option>
              <option value="in_transit_to_factory">In-Transit to Site</option>
              <option value="staged_at_roof">Staged at Roof</option>
              <option value="installed_and_commissioned">Installed &amp; Commissioned</option>
            </select>
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
        </div>
      </div>

      {/* Conditional Rendering: Grid vs Table View */}
      {displayMode === 'GRID' ? (
        /* Lots Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLots.map((lot) => (
            <div
              key={lot.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-[#0A1A2F]">
                    {lot.lotNumber}
                  </span>
                  {getStatusBadge(lot.status)}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#0A1A2F]">{lot.productName}</h4>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">Product ID: {lot.productId}</div>
                </div>

                <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Quantity:</span>
                    <span className="font-bold text-slate-800 font-mono">{lot.quantity.toLocaleString()} {lot.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Location:</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{lot.currentLocation}</span>
                    </span>
                  </div>
                  {lot.inspectedBy && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Inspected By:</span>
                      <span className="font-mono text-slate-600">{lot.inspectedBy}</span>
                    </div>
                  )}
                  {lot.assignedFactoryName && (
                    <div className="flex justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400">Assigned Client:</span>
                      <span className="font-bold text-emerald-800">{lot.assignedFactoryName}</span>
                    </div>
                  )}
                </div>

                <div className="text-[11px] space-y-1 text-slate-500">
                  {lot.customsBoeNumber && (
                    <div className="font-mono">Customs BoE: <span className="text-slate-800 font-semibold">{lot.customsBoeNumber}</span></div>
                  )}
                  {lot.containerNumber && (
                    <div className="font-mono">Container: <span className="text-slate-800 font-semibold">{lot.containerNumber}</span></div>
                  )}
                  {lot.serialNumberStart && (
                    <div className="font-mono text-[10px] text-slate-400 truncate">
                      Serials: {lot.serialNumberStart} → {lot.serialNumberEnd}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Arrival: {lot.arrivalDate || 'In-Transit'}</span>
                <button
                  type="button"
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                >
                  Transfer Lot
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Lots Enterprise Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Lot # &amp; Product ID</th>
                  <th className="py-3 px-4">Product Name &amp; Serials</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Current Custody Location</th>
                  <th className="py-3 px-4">Client Factory Allocation</th>
                  <th className="py-3 px-4">BoE &amp; Container #</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLots.map((lot) => (
                  <tr key={lot.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-[#0A1A2F] block">{lot.lotNumber}</span>
                      <span className="text-[10px] font-mono text-slate-400">{lot.productId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{lot.productName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {lot.serialNumberStart ? `${lot.serialNumberStart} → ${lot.serialNumberEnd}` : 'Bulk Asset'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-slate-900">
                      {lot.quantity.toLocaleString()} {lot.unit}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{lot.currentLocation}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {lot.assignedFactoryName ? (
                        <div className="font-bold text-emerald-800">{lot.assignedFactoryName}</div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned (Buffer Stock)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                      <div>{lot.customsBoeNumber || '—'}</div>
                      <div className="text-slate-400 text-[10px]">{lot.containerNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(lot.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded bg-[#0A1A2F] hover:bg-emerald-700 text-white text-[11px] font-bold transition cursor-pointer"
                      >
                        Transfer
                      </button>
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
