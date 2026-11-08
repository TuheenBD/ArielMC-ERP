'use client';

import React, { useState } from 'react';
import { AfterSalesTicket, TicketPriority, TicketStatus } from '@/types/arelCrm';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldCheck,
  Zap,
  Activity,
  FileCheck,
  Filter,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  Search,
} from 'lucide-react';

interface AfterSalesSlaManagementProps {
  tickets: AfterSalesTicket[];
  onUpdateTicketStatus?: (ticketId: string, newStatus: TicketStatus) => void;
}

export default function AfterSalesSlaManagement({
  tickets,
  onUpdateTicketStatus,
}: AfterSalesSlaManagementProps) {
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [displayMode, setDisplayMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter((t) => {
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (
      searchTerm &&
      !t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !t.factoryName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !t.ticketCategory.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getPriorityBadge = (p: TicketPriority) => {
    switch (p) {
      case 'critical_power_loss':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">Critical: Generation Loss</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">High Priority</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Routine Maintenance</span>;
    }
  };

  const getStatusBadge = (s: TicketStatus) => {
    switch (s) {
      case 'open':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Open Ticket</span>;
      case 'subcontractor_dispatched':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 font-mono">Crew Dispatched to Roof</span>;
      case 'oem_rma_in_progress':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 font-mono">OEM RMA Active</span>;
      case 'resolved':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono">Resolved &bull; PR Recovered</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">Closed</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0A1A2F]">
              Tri-Party After-Sales SLA &amp; Telemetry Maintenance ({filteredTickets.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Synchronizing Customer &bull; OEM Supplier (Huawei/Longi) &bull; Subcontractor field crews with Ariel-SaaS IoT PR telemetry.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticket #, factory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Ticket Priorities</option>
              <option value="critical_power_loss">Critical Generation Loss</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Routine Cleaning</option>
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
        /* SLA Tickets Card Grid */
        <div className="space-y-4">
          {filteredTickets.map((tkt) => (
            <div
              key={tkt.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{tkt.ticketNumber}</span>
                  <span className="text-slate-300">&bull;</span>
                  <h4 className="text-sm font-bold text-[#0A1A2F]">{tkt.factoryName}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(tkt.priority)}
                  {getStatusBadge(tkt.status)}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800">{tkt.ticketCategory}</div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {tkt.rootCauseAnalysis}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase block">Subcontractor Assigned:</span>
                  <span className="font-semibold text-slate-800">{tkt.assignedSubcontractor?.companyName || 'In-House Crew'}</span>
                  <div className="text-[10px] text-slate-500 font-mono">{tkt.assignedSubcontractor?.technicianPhone}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase block">Supplier OEM RMA:</span>
                  <span className="font-semibold text-slate-800">{tkt.supplierRmaDetails?.rmaTrackingNumber || 'Not Required'}</span>
                  {tkt.supplierRmaDetails?.oemBrand && (
                    <div className="text-[10px] text-slate-500">{tkt.supplierRmaDetails.oemBrand}</div>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase block">Target Resolution:</span>
                  <span className="font-mono font-bold text-emerald-800">{tkt.targetResolutionDate}</span>
                </div>
              </div>

              {tkt.actionTakenNotes && tkt.actionTakenNotes.length > 0 && (
                <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-mono block mb-1">Actions Taken:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    {tkt.actionTakenNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Reported: {tkt.reportedAt}</span>
                <button
                  type="button"
                  onClick={() => onUpdateTicketStatus?.(tkt.id, 'resolved')}
                  className="px-3 py-1 rounded bg-[#0A1A2F] hover:bg-emerald-700 text-white font-bold transition cursor-pointer"
                >
                  Update SLA Status
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* SLA Tickets Enterprise Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Ticket # &amp; Factory</th>
                  <th className="py-3 px-4">Category &amp; Diagnostic</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Crew</th>
                  <th className="py-3 px-4">Supplier OEM RMA</th>
                  <th className="py-3 px-4">Target Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTickets.map((tkt) => (
                  <tr key={tkt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-[#0A1A2F] block">{tkt.ticketNumber}</span>
                      <span className="font-semibold text-slate-700">{tkt.factoryName}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900">{tkt.ticketCategory}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{tkt.rootCauseAnalysis}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getPriorityBadge(tkt.priority)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{tkt.assignedSubcontractor?.companyName || 'In-House Crew'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{tkt.assignedSubcontractor?.technicianPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      {tkt.supplierRmaDetails?.rmaTrackingNumber || '—'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-emerald-800">
                      {tkt.targetResolutionDate}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(tkt.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onUpdateTicketStatus?.(tkt.id, 'resolved')}
                        className="px-2.5 py-1 rounded bg-[#0A1A2F] hover:bg-emerald-700 text-white text-[11px] font-bold transition cursor-pointer"
                      >
                        Update
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
