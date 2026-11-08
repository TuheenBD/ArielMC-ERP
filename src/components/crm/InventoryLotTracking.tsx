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
  Eye,
  Edit3,
  Trash2,
  Share2,
  Download,
  X,
  ArrowRightLeft,
} from 'lucide-react';

interface InventoryLotTrackingProps {
  lots: InventoryLot[];
  onEditLot?: (lot: InventoryLot) => void;
  onDeleteLot?: (id: string) => void;
}

export default function InventoryLotTracking({
  lots,
  onEditLot,
  onDeleteLot,
}: InventoryLotTrackingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [displayMode, setDisplayMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Multi-select & Action states
  const [selectedLotIds, setSelectedLotIds] = useState<string[]>([]);
  const [viewingLot, setViewingLot] = useState<InventoryLot | null>(null);
  const [editingLot, setEditingLot] = useState<InventoryLot | null>(null);
  const [deletingLot, setDeletingLot] = useState<InventoryLot | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedLotIds.length === filteredLots.length) {
      setSelectedLotIds([]);
    } else {
      setSelectedLotIds(filteredLots.map((l) => l.id));
    }
  };

  const handleToggleSelect = (id: string, e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedLotIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedLotIds.length} inventory lots?`)) {
      if (onDeleteLot) {
        selectedLotIds.forEach((id) => onDeleteLot(id));
      }
      setSelectedLotIds([]);
      showToast(`Deleted ${selectedLotIds.length} inventory lots`);
    }
  };

  // Share handler
  const handleShare = (lot: InventoryLot, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/crm?tab=inventory&lot=${lot.lotNumber}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast(`Lot Tracking URL for ${lot.lotNumber} copied to clipboard!`);
    } else {
      showToast(`Share URL: ${shareUrl}`);
    }
  };

  // Download PDF / Gate Pass
  const handleDownloadPdf = (lot: InventoryLot, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast(`Generating Warehouse Gate Pass for ${lot.lotNumber}...`);
    setTimeout(() => {
      const doc = `
================================================================================
WAREHOUSE CUSTODY & SITE STAGING GATE PASS
ARIEL RENEWABLE ENERGY LIMITED • SCM LOGISTICS DESK
================================================================================
Lot Number:       ${lot.lotNumber}
Product:          ${lot.productName} (ID: ${lot.productId})
Total Quantity:   ${lot.quantity.toLocaleString()} ${lot.unit}
Current Custody:  ${lot.currentLocation}
Allocated Client: ${lot.assignedFactoryName || 'Central SCM Buffer Stock'}
Customs BoE:      ${lot.customsBoeNumber || 'N/A'}
Container #:      ${lot.containerNumber || 'N/A'}
Serial Range:     ${lot.serialNumberStart ? `${lot.serialNumberStart} → ${lot.serialNumberEnd}` : 'Standard Batch'}
Quality Inspector:${lot.inspectedBy || 'Ariel QA/QC Inspector'}
Status:           ${lot.status.toUpperCase()}
Gate Pass Date:   ${new Date().toISOString().split('T')[0]}
================================================================================
      `;
      const blob = new Blob([doc], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lot.lotNumber}_GatePass.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, 600);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLot) return;
    if (onEditLot) {
      onEditLot(editingLot);
    }
    showToast(`Updated Lot ${editingLot.lotNumber}`);
    setEditingLot(null);
  };

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
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0A1A2F] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/30 flex items-center gap-2 text-xs font-mono animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#0A1A2F]">
              Hardware Inventory Lot Staging &amp; Custody ({filteredLots.length})
            </h3>
            <p className="text-[10px] text-slate-500">
              Serial-tracked Tier-1 hardware lots from Chittagong Port CFS to rooftop staging.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lot #, product, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Lot Stages</option>
            <option value="chittagong_port_cfs">Chittagong Port CFS</option>
            <option value="central_warehouse_tongi">Central Warehouse Tongi</option>
            <option value="in_transit_to_factory">In-Transit to Site</option>
            <option value="staged_at_roof">Staged at Roof</option>
            <option value="installed_and_commissioned">Installed &amp; Commissioned</option>
          </select>

          {/* Bulk Selection Bar */}
          {selectedLotIds.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#0A1A2F] text-white px-2.5 py-1 rounded-lg text-xs font-mono animate-in fade-in">
              <span className="font-bold text-emerald-300">{selectedLotIds.length} Selected</span>
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="hover:text-rose-300 text-[10px] font-bold cursor-pointer"
                title="Delete selected lots"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setSelectedLotIds([])}
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
        </div>
      </div>

      {/* Grid vs Table View */}
      {displayMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLots.map((lot) => {
            const isSelected = selectedLotIds.includes(lot.id);

            return (
              <div
                key={lot.id}
                className={`bg-white rounded-xl border p-4 shadow-2xs hover:border-emerald-400 transition-all flex flex-col justify-between ${
                  isSelected ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleSelect(lot.id, e)}
                        className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-[#0A1A2F]">
                        {lot.lotNumber}
                      </span>
                    </div>
                    {getStatusBadge(lot.status)}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#0A1A2F]">{lot.productName}</h4>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Product ID: {lot.productId}</div>
                  </div>

                  <div className="space-y-1.5 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Quantity:</span>
                      <span className="font-bold text-slate-800 font-mono">{lot.quantity.toLocaleString()} {lot.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Location:</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span className="truncate max-w-[150px]">{lot.currentLocation}</span>
                      </span>
                    </div>
                    {lot.assignedFactoryName && (
                      <div className="flex justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400">Client:</span>
                        <span className="font-bold text-emerald-800 truncate max-w-[160px]">{lot.assignedFactoryName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">{lot.arrivalDate || 'In-Transit'}</span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewingLot(lot)}
                      className="p-1 rounded hover:bg-slate-100 text-blue-600 transition"
                      title="View Lot Manifest"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingLot({ ...lot })}
                      className="p-1 rounded hover:bg-slate-100 text-amber-600 transition"
                      title="Edit Lot Custody"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleShare(lot, e)}
                      className="p-1 rounded hover:bg-slate-100 text-teal-600 transition"
                      title="Share Tracking Link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDownloadPdf(lot, e)}
                      className="p-1 rounded hover:bg-slate-100 text-emerald-700 transition"
                      title="Download Gate Pass"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingLot(lot)}
                      className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                      title="Delete Lot"
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
        /* Lots Enterprise Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-2.5 px-3 w-8 text-center">
                    <input
                      type="checkbox"
                      checked={filteredLots.length > 0 && selectedLotIds.length === filteredLots.length}
                      onChange={handleSelectAll}
                      className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3">Lot # &amp; Product</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">Custody Location</th>
                  <th className="py-2.5 px-3">Client Allocation</th>
                  <th className="py-2.5 px-3">BoE / Container</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLots.map((lot) => {
                  const isSelected = selectedLotIds.includes(lot.id);

                  return (
                    <tr key={lot.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelect(lot.id, e)}
                          className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-[#0A1A2F] block">{lot.lotNumber}</span>
                        <span className="text-[11px] text-slate-800 font-semibold">{lot.productName}</span>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-slate-900">
                        {lot.quantity.toLocaleString()} {lot.unit}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{lot.currentLocation}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        {lot.assignedFactoryName ? (
                          <div className="font-bold text-emerald-800">{lot.assignedFactoryName}</div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned (Buffer Stock)</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px]">
                        <div>{lot.customsBoeNumber || '—'}</div>
                        <div className="text-slate-400 text-[10px]">{lot.containerNumber}</div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {getStatusBadge(lot.status)}
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingLot(lot)}
                            className="p-1 rounded hover:bg-slate-100 text-blue-600 transition"
                            title="View Manifest"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingLot({ ...lot })}
                            className="p-1 rounded hover:bg-slate-100 text-amber-600 transition"
                            title="Edit Lot"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleShare(lot, e)}
                            className="p-1 rounded hover:bg-slate-100 text-teal-600 transition"
                            title="Share Tracking"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDownloadPdf(lot, e)}
                            className="p-1 rounded hover:bg-slate-100 text-emerald-700 transition"
                            title="Download Gate Pass"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingLot(lot)}
                            className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                            title="Delete Lot"
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

      {/* View Lot Modal */}
      {viewingLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  LOT MANIFEST
                </span>
                <h3 className="text-base font-black text-[#0A1A2F] mt-1">{viewingLot.lotNumber}</h3>
                <div className="text-xs font-mono text-slate-500">{viewingLot.productName}</div>
              </div>
              <button
                type="button"
                onClick={() => setViewingLot(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-mono">Quantity</span>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{viewingLot.quantity.toLocaleString()} {viewingLot.unit}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-mono">Status</span>
                  <div className="mt-0.5">{getStatusBadge(viewingLot.status)}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-mono">Current Location</span>
                  <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{viewingLot.currentLocation}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-mono">Assigned Factory</span>
                  <div className="font-bold text-emerald-800 mt-0.5">{viewingLot.assignedFactoryName || 'Unassigned'}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">BoE Number:</span>
                  <span className="font-bold text-slate-800">{viewingLot.customsBoeNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Container No:</span>
                  <span className="font-bold text-slate-800">{viewingLot.containerNumber || 'N/A'}</span>
                </div>
                {viewingLot.serialNumberStart && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Serial Range:</span>
                    <span className="text-emerald-700">{viewingLot.serialNumberStart} → {viewingLot.serialNumberEnd}</span>
                  </div>
                )}
                {viewingLot.inspectedBy && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">QA Inspector:</span>
                    <span className="text-slate-700">{viewingLot.inspectedBy}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => handleDownloadPdf(viewingLot, e)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export Gate Pass</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingLot(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0A1A2F] text-white text-xs font-bold font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lot Modal */}
      {editingLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black text-[#0A1A2F]">Edit Lot: {editingLot.lotNumber}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingLot(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Current Custody Location</label>
                <input
                  type="text"
                  value={editingLot.currentLocation}
                  onChange={(e) => setEditingLot({ ...editingLot, currentLocation: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingLot.status}
                    onChange={(e) => setEditingLot({ ...editingLot, status: e.target.value as InventoryLotStatus })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-semibold"
                  >
                    <option value="chittagong_port_cfs">Chittagong Port CFS</option>
                    <option value="central_warehouse_tongi">Central Warehouse Tongi</option>
                    <option value="in_transit_to_factory">In-Transit to Site</option>
                    <option value="staged_at_roof">Staged at Roof</option>
                    <option value="installed_and_commissioned">Installed &amp; Commissioned</option>
                    <option value="damaged_or_rma">Damaged / RMA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={editingLot.quantity}
                    onChange={(e) => setEditingLot({ ...editingLot, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Factory Client</label>
                <input
                  type="text"
                  value={editingLot.assignedFactoryName || ''}
                  onChange={(e) => setEditingLot({ ...editingLot, assignedFactoryName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-semibold"
                  placeholder="e.g. Apex Tannery or leave empty for Buffer"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLot(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-mono"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation for Lot */}
      {deletingLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Confirm Deletion</h3>
                <p className="text-[11px] text-slate-500">
                  Delete inventory lot <span className="font-bold text-rose-600 font-mono">{deletingLot.lotNumber}</span> ({deletingLot.productName})?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingLot(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteLot) onDeleteLot(deletingLot.id);
                  showToast(`Deleted ${deletingLot.lotNumber}`);
                  setDeletingLot(null);
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
