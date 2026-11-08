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
  Sparkles,
  Droplets,
  RotateCcw,
  X,
} from 'lucide-react';

interface AfterSalesSlaManagementProps {
  tickets: AfterSalesTicket[];
  onUpdateTicketStatus?: (ticketId: string, newStatus: TicketStatus) => void;
  onAddTicket?: (ticket: AfterSalesTicket) => void;
}

export default function AfterSalesSlaManagement({
  tickets: initialTickets,
  onUpdateTicketStatus,
  onAddTicket,
}: AfterSalesSlaManagementProps) {
  const [tickets, setTickets] = useState<AfterSalesTicket[]>(initialTickets);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [displayMode, setDisplayMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  // New Ticket Form State
  const [newFactory, setNewFactory] = useState('Ha-Meem Denim Washing & Weaving Plant');
  const [newCategory, setNewCategory] = useState<AfterSalesTicket['ticketCategory']>(
    'Performance Ratio Drop (<75% PR Alert)'
  );
  const [newPriority, setNewPriority] = useState<TicketPriority>('high');
  const [newSubcontractor, setNewSubcontractor] = useState('Electro-Grid HT/LT Substation Engineers');
  const [newTechPhone, setNewTechPhone] = useState('+880 1912-384910');
  const [newOemBrand, setNewOemBrand] = useState('Huawei Digital Power');
  const [newRmaNumber, setNewRmaNumber] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('2026-11-12');
  const [newRootCause, setNewRootCause] = useState('');

  // Handle local status transition
  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    onUpdateTicketStatus?.(ticketId, newStatus);
  };

  // Handle new ticket submission
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AfterSalesTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `AREL-TKT-2026-${String(tickets.length + 1).padStart(2, '0')}`,
      projectLeadId: 'lead-001',
      factoryName: newFactory,
      ticketCategory: newCategory,
      priority: newPriority,
      status: 'open',
      clientContact: {
        name: 'Factory Maintenance Desk',
        phone: '+880 1711-000000',
        designation: 'General Manager Utilities',
      },
      assignedSubcontractor: {
        companyName: newSubcontractor,
        leadTechnician: 'Duty Field Engineer',
        technicianPhone: newTechPhone,
      },
      supplierRmaDetails: newRmaNumber
        ? {
            oemBrand: newOemBrand,
            rmaTrackingNumber: newRmaNumber,
            replacementPartStatus: 'Diagnosed',
          }
        : undefined,
      reportedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      targetResolutionDate: newTargetDate,
      rootCauseAnalysis: newRootCause || 'Under preliminary diagnostic review.',
      actionTakenNotes: ['Ticket initiated in AREL-CRM. Field technician notified.'],
    };

    setTickets([created, ...tickets]);
    onAddTicket?.(created);
    setIsNewTicketModalOpen(false);
    setNewRootCause('');
    setNewRmaNumber('');
  };

  const filteredTickets = tickets.filter((t) => {
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
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
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">
            Critical: Generation Loss
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
            Routine Maintenance
          </span>
        );
    }
  };

  const getStatusBadge = (s: TicketStatus) => {
    switch (s) {
      case 'open':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            Open Ticket
          </span>
        );
      case 'subcontractor_dispatched':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 font-mono border border-purple-200">
            Crew Dispatched
          </span>
        );
      case 'oem_rma_in_progress':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 font-mono border border-amber-300">
            OEM RMA Active
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono border border-emerald-300">
            Resolved &bull; PR Recovered
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">
            Closed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          IOT TELEMETRY & SITE PR PERFORMANCE METRICS
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
              Fleet Average PR
            </span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
            79.4% <span className="text-xs text-slate-400 font-normal">/ 81.5% Target</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Automated IoT Telemetry Bridge Active</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
              PR &lt; 75% Degradation Alerts
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1 font-mono">
            1 String Tripped
          </div>
          <div className="text-[10px] text-amber-700 font-bold mt-0.5">Ha-Meem Denim Inverter #3</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
              Bi-Weekly Washing SLA
            </span>
            <Droplets className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-700 mt-1 font-mono">
            94% Compliance
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">RO Demineralized High-Pressure</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
              Active Tri-Party Tickets
            </span>
            <Wrench className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-[#0A1A2F] mt-1 font-mono">
            {tickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed').length} Active
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Client &bull; Subcontractor &bull; OEM RMA</div>
        </div>
      </div>

      {/* =========================================================================
          TOOLBAR: SEARCH, FILTERS, VIEW TOGGLE & NEW TICKET BUTTON
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0A1A2F]">
              Tri-Party After-Sales SLA &amp; Telemetry Maintenance ({filteredTickets.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Synchronizing Customer &bull; OEM Supplier (Huawei/LONGi) &bull; Subcontractor field crews with IoT PR telemetry.
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
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="critical_power_loss">Critical (Generation Loss)</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium</option>
              <option value="low">Low (Routine Cleaning)</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="open">Open</option>
            <option value="subcontractor_dispatched">Crew Dispatched</option>
            <option value="oem_rma_in_progress">OEM RMA In Progress</option>
            <option value="resolved">Resolved (PR Recovered)</option>
          </select>

          {/* Grid vs Table View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setDisplayMode('GRID')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                displayMode === 'GRID'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Card / Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('TABLE')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                displayMode === 'TABLE'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Enterprise Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Log Ticket Button */}
          <button
            type="button"
            onClick={() => setIsNewTicketModalOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log SLA Ticket</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          CONDITIONAL RENDERING: CARD GRID VS TABLE VIEW
          ========================================================================= */}
      {displayMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTickets.map((tkt) => (
            <div
              key={tkt.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-slate-400 block">
                      {tkt.ticketNumber} &bull; {tkt.reportedAt}
                    </span>
                    <h4 className="text-base font-bold text-[#0A1A2F] mt-0.5">
                      {tkt.factoryName}
                    </h4>
                    <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                      {tkt.ticketCategory}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {getPriorityBadge(tkt.priority)}
                    {getStatusBadge(tkt.status)}
                  </div>
                </div>

                {/* Diagnostics & Root Cause */}
                {tkt.rootCauseAnalysis && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Telemetry Diagnostics &amp; Root Cause:
                    </span>
                    {tkt.rootCauseAnalysis}
                  </div>
                )}

                {/* Tri-Party Coordination Box */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-mono text-[10px] uppercase block">
                      Assigned Crew:
                    </span>
                    <span className="font-bold text-slate-900 block truncate">
                      {tkt.assignedSubcontractor?.companyName || 'In-House Rapid Team'}
                    </span>
                    <span className="text-slate-500 text-[11px] font-mono">
                      Lead: {tkt.assignedSubcontractor?.leadTechnician} ({tkt.assignedSubcontractor?.technicianPhone})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-mono text-[10px] uppercase block">
                      Supplier OEM RMA:
                    </span>
                    <span className="font-bold text-slate-900 block truncate">
                      {tkt.supplierRmaDetails ? `${tkt.supplierRmaDetails.oemBrand}` : 'No Part RMA Required'}
                    </span>
                    {tkt.supplierRmaDetails && (
                      <span className="text-emerald-700 font-mono text-[10px] font-bold block">
                        RMA: {tkt.supplierRmaDetails.rmaTrackingNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Notes */}
                {tkt.actionTakenNotes && tkt.actionTakenNotes.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-mono block mb-1">
                      Actions Taken:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      {tkt.actionTakenNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Card Footer: Quick Status Update Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 text-[11px]">
                  Target: <strong className="text-emerald-800">{tkt.targetResolutionDate}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  {tkt.status !== 'resolved' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(tkt.id, 'resolved')}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition text-[11px] cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  )}
                  {tkt.status === 'open' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(tkt.id, 'subcontractor_dispatched')}
                      className="px-2.5 py-1 rounded bg-[#0A1A2F] hover:bg-[#152a45] text-white font-bold transition text-[11px] cursor-pointer"
                    >
                      Dispatch Crew
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* High-Density SLA Tickets Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ticket # &amp; Factory</th>
                  <th className="py-3 px-4">Category &amp; Diagnostic</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Crew</th>
                  <th className="py-3 px-4">Supplier OEM RMA</th>
                  <th className="py-3 px-4">Target Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTickets.map((tkt) => (
                  <tr key={tkt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#0A1A2F] block">{tkt.ticketNumber}</span>
                      <span className="text-slate-700 font-sans text-xs">{tkt.factoryName}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs font-sans">
                      <div className="font-bold text-slate-900">{tkt.ticketCategory}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{tkt.rootCauseAnalysis}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                      {getPriorityBadge(tkt.priority)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                      <div className="font-semibold text-slate-900">
                        {tkt.assignedSubcontractor?.companyName || 'In-House Crew'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {tkt.assignedSubcontractor?.technicianPhone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      {tkt.supplierRmaDetails ? (
                        <div>
                          <div className="font-bold text-slate-900">{tkt.supplierRmaDetails.oemBrand}</div>
                          <div className="text-[10px] text-emerald-700">{tkt.supplierRmaDetails.rmaTrackingNumber}</div>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-emerald-800">
                      {tkt.targetResolutionDate}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                      {getStatusBadge(tkt.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <select
                        value={tkt.status}
                        onChange={(e) => handleStatusChange(tkt.id, e.target.value as TicketStatus)}
                        className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 border border-slate-300 text-slate-800 cursor-pointer focus:outline-none"
                      >
                        <option value="open">Open</option>
                        <option value="subcontractor_dispatched">Dispatched</option>
                        <option value="oem_rma_in_progress">OEM RMA</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: LOG NEW SLA TICKET
          ========================================================================= */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-4 bg-[#0A1A2F] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#C9A86A]" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider font-mono">
                  Log New After-Sales SLA Ticket
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTicketModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Factory / Industrial Rooftop Plant</label>
                <select
                  value={newFactory}
                  onChange={(e) => setNewFactory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="Ha-Meem Denim Washing & Weaving Plant">Ha-Meem Denim Washing & Weaving Plant (1.2 MWp)</option>
                  <option value="Envoy Textiles High-Efficiency Plant">Envoy Textiles High-Efficiency Plant (800 kWp)</option>
                  <option value="Square Pharmaceuticals Solar Division">Square Pharmaceuticals Solar Division (1.5 MWp)</option>
                  <option value="RAK Ceramics Tableware Division">RAK Ceramics Tableware Division (650 kWp)</option>
                  <option value="Apex Tannery & Artisan Leatherworks">Apex Tannery & Artisan Leatherworks (500 kWp)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ticket Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Performance Ratio Drop (<75% PR Alert)">Performance Ratio Drop (&lt;75% PR)</option>
                    <option value="Inverter String Trip / Grid Synchronization Error">Inverter String Trip / Grid Error</option>
                    <option value="Routine Bi-Weekly High-Pressure Panel Wash">Routine Bi-Weekly Panel Wash</option>
                    <option value="Module Hotspot / Glass Defect (OEM RMA)">Module Hotspot / Glass Defect (RMA)</option>
                    <option value="Annual Statutory SREDA & IEB Electrical Audit">Annual SREDA &amp; IEB Audit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="critical_power_loss">Critical (Generation Loss)</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low (Routine Cleaning)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Subcontractor Crew</label>
                  <select
                    value={newSubcontractor}
                    onChange={(e) => setNewSubcontractor(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="Electro-Grid HT/LT Substation Engineers">Electro-Grid HT/LT Substation Engineers</option>
                    <option value="Bengal Solar Mech & Civil Racking Works">Bengal Solar Mech & Civil Racking Works</option>
                    <option value="Bureau of Structural Engineering & Research (BSER)">Bureau of Structural Engineering (BSER)</option>
                    <option value="AeroLiDAR Drone Geomatics Bangladesh">AeroLiDAR Drone Geomatics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Resolution Date</label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">OEM RMA Brand (Optional)</label>
                  <select
                    value={newOemBrand}
                    onChange={(e) => setNewOemBrand(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="Huawei Digital Power">Huawei Digital Power (Inverter)</option>
                    <option value="LONGi Solar Co., Ltd.">LONGi Solar (PV Module)</option>
                    <option value="JinkoSolar Holding Co.">JinkoSolar (PV Module)</option>
                    <option value="Sungrow Power Supply">Sungrow (Inverter)</option>
                    <option value="Kai Aluminum Ltd.">Kai Aluminum (Racking)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">RMA Tracking Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. HUA-RMA-BD-2026-99"
                    value={newRmaNumber}
                    onChange={(e) => setNewRmaNumber(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Diagnostics &amp; Root Cause Notes</label>
                <textarea
                  rows={3}
                  placeholder="Detail the telemetry alert, string ID, voltage/fuse diagnostic, or cleaning scope..."
                  value={newRootCause}
                  onChange={(e) => setNewRootCause(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm cursor-pointer"
                >
                  Create SLA Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
