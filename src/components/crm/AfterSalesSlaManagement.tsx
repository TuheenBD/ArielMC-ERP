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
  const [displayMode, setDisplayMode] = useState<'GRID' | 'TABLE'>('TABLE'); // Default to compact table
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
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse whitespace-nowrap">
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 whitespace-nowrap">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800 whitespace-nowrap">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 whitespace-nowrap">
            Routine
          </span>
        );
    }
  };

  const getStatusBadge = (s: TicketStatus) => {
    switch (s) {
      case 'open':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-300 whitespace-nowrap">
            Open
          </span>
        );
      case 'subcontractor_dispatched':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800 font-mono border border-purple-200 whitespace-nowrap">
            Dispatched
          </span>
        );
      case 'oem_rma_in_progress':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 font-mono border border-amber-300 whitespace-nowrap">
            OEM RMA
          </span>
        );
      case 'resolved':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 font-mono border border-emerald-300 whitespace-nowrap">
            Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 whitespace-nowrap">
            Closed
          </span>
        );
    }
  };

  return (
    <div className="space-y-3.5 font-sans">
      {/* =========================================================================
          COMPACT IOT TELEMETRY & PR KPI CARDS (ArielMC-ERP Styling)
          ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-white border border-[#DDE3DD] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold uppercase text-[#6B7269]">
              Fleet Average PR
            </span>
            <Activity className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <div className="text-lg font-black text-emerald-800 mt-0.5 font-mono">
            79.4% <span className="text-[10px] text-[#6B7269] font-normal">/ 81.5% Target</span>
          </div>
          <div className="text-[9px] text-[#6B7269] mt-0.5">Automated Telemetry Active</div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#DDE3DD] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold uppercase text-[#6B7269]">
              PR &lt; 75% Alerts
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-lg font-black text-amber-600 mt-0.5 font-mono">
            1 String Tripped
          </div>
          <div className="text-[9px] text-amber-800 font-semibold mt-0.5">Ha-Meem Inverter #3</div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#DDE3DD] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold uppercase text-[#6B7269]">
              Bi-Weekly Wash SLA
            </span>
            <Droplets className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-lg font-black text-teal-800 mt-0.5 font-mono">
            94% Compliance
          </div>
          <div className="text-[9px] text-[#6B7269] mt-0.5">RO Demineralized High-Pressure</div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#DDE3DD] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold uppercase text-[#6B7269]">
              Active Tri-Party Tickets
            </span>
            <Wrench className="w-3.5 h-3.5 text-[#1F3A2E]" />
          </div>
          <div className="text-lg font-black text-[#1A1A1A] mt-0.5 font-mono">
            {tickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed').length} Active
          </div>
          <div className="text-[9px] text-[#6B7269] mt-0.5">Customer &bull; Crew &bull; OEM</div>
        </div>
      </div>

      {/* =========================================================================
          TOOLBAR: SEARCH, FILTERS, VIEW TOGGLE & COMPACT BUTTON
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-white rounded-xl border border-[#DDE3DD] shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#1A1A1A] leading-tight">
              After-Sales SLA &amp; Telemetry Maintenance ({filteredTickets.length})
            </h3>
            <p className="text-[10px] text-[#6B7269]">
              Customer &bull; OEM Supplier (Huawei/LONGi) &bull; Subcontractor field crews.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative w-36 sm:w-44">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-2 py-1 text-[11px] bg-[#FAF9F5] border border-[#DDE3DD] rounded-lg focus:outline-none focus:border-[#1F3A2E] font-mono"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-[11px] font-semibold bg-[#FAF9F5] border border-[#DDE3DD] rounded-lg px-2 py-1 text-[#1A1A1A] focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="critical_power_loss">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Routine</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-[11px] font-semibold bg-[#FAF9F5] border border-[#DDE3DD] rounded-lg px-2 py-1 text-[#1A1A1A] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="open">Open</option>
            <option value="subcontractor_dispatched">Dispatched</option>
            <option value="oem_rma_in_progress">OEM RMA</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Grid vs Table View Mode Toggle */}
          <div className="flex items-center bg-[#FAF9F5] p-0.5 rounded-lg border border-[#DDE3DD]">
            <button
              type="button"
              onClick={() => setDisplayMode('TABLE')}
              className={`p-1 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                displayMode === 'TABLE'
                  ? 'bg-white text-[#1F3A2E] shadow-2xs'
                  : 'text-[#6B7269] hover:text-[#1A1A1A]'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('GRID')}
              className={`p-1 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                displayMode === 'GRID'
                  ? 'bg-white text-[#1F3A2E] shadow-2xs'
                  : 'text-[#6B7269] hover:text-[#1A1A1A]'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3 h-3" />
            </button>
          </div>

          {/* Log Ticket Button */}
          <button
            type="button"
            onClick={() => setIsNewTicketModalOpen(true)}
            className="px-2.5 py-1 bg-[#1F3A2E] hover:bg-[#2C5240] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Log Ticket</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          CONDITIONAL RENDERING: HIGH-DENSITY COMPACT TABLE (NO OVERFLOW)
          ========================================================================= */}
      {displayMode === 'TABLE' ? (
        <div className="bg-white rounded-xl border border-[#DDE3DD] shadow-2xs overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-[11px] font-sans">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[9px] tracking-wider font-mono">
                <tr>
                  <th className="py-2.5 px-3">Ticket &amp; Factory</th>
                  <th className="py-2.5 px-3">Category &amp; Diagnostic</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Assigned Crew</th>
                  <th className="py-2.5 px-3">OEM RMA</th>
                  <th className="py-2.5 px-3">Target Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD] text-[#1A1A1A]">
                {filteredTickets.map((tkt) => (
                  <tr key={tkt.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-[#0A1A2F] block">{tkt.ticketNumber}</span>
                      <span className="text-[#1F3A2E] font-semibold text-[11px] truncate max-w-[170px] block">
                        {tkt.factoryName.replace(' & Artisan Leatherworks', '').replace(' Washing & Weaving Plant', '')}
                      </span>
                    </td>

                    <td className="py-2 px-3 max-w-[220px]">
                      <div className="font-bold text-[#1A1A1A] truncate">{tkt.ticketCategory}</div>
                      <div className="text-[10px] text-[#6B7269] truncate font-mono">
                        {tkt.rootCauseAnalysis}
                      </div>
                    </td>

                    <td className="py-2 px-3 whitespace-nowrap">
                      {getPriorityBadge(tkt.priority)}
                    </td>

                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className="font-semibold text-[#1A1A1A] truncate max-w-[140px]">
                        {tkt.assignedSubcontractor?.companyName.split(' ')[0]} Engineers
                      </div>
                      <div className="text-[9px] text-[#6B7269] font-mono">
                        {tkt.assignedSubcontractor?.technicianPhone}
                      </div>
                    </td>

                    <td className="py-2 px-3 whitespace-nowrap font-mono text-[10px]">
                      {tkt.supplierRmaDetails ? (
                        <div>
                          <span className="font-bold text-[#1A1A1A]">{tkt.supplierRmaDetails.oemBrand.split(' ')[0]}</span>
                          <span className="text-emerald-700 block text-[9px]">{tkt.supplierRmaDetails.rmaTrackingNumber}</span>
                        </div>
                      ) : (
                        <span className="text-[#6B7269]">—</span>
                      )}
                    </td>

                    <td className="py-2 px-3 whitespace-nowrap font-mono font-bold text-emerald-800 text-[10px]">
                      {tkt.targetResolutionDate}
                    </td>

                    <td className="py-2 px-3 whitespace-nowrap">
                      {getStatusBadge(tkt.status)}
                    </td>

                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      <select
                        value={tkt.status}
                        onChange={(e) => handleStatusChange(tkt.id, e.target.value as TicketStatus)}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FAF9F5] border border-[#DDE3DD] text-[#1A1A1A] cursor-pointer focus:outline-none"
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
      ) : (
        /* Compact Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTickets.map((tkt) => (
            <div
              key={tkt.id}
              className="bg-white rounded-xl border border-[#DDE3DD] p-4 shadow-2xs space-y-3 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#6B7269] block">
                      {tkt.ticketNumber} &bull; {tkt.reportedAt}
                    </span>
                    <h4 className="text-sm font-bold text-[#1A1A1A] mt-0.5">
                      {tkt.factoryName}
                    </h4>
                    <div className="text-xs font-semibold text-[#1F3A2E] mt-0.5">
                      {tkt.ticketCategory}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {getPriorityBadge(tkt.priority)}
                    {getStatusBadge(tkt.status)}
                  </div>
                </div>

                {tkt.rootCauseAnalysis && (
                  <div className="p-2.5 bg-[#FAF9F5] rounded-lg border border-[#DDE3DD] text-[11px] text-[#6B7269]">
                    <span className="text-[9px] font-mono font-bold uppercase text-[#1A1A1A] block mb-0.5">
                      Diagnostic:
                    </span>
                    {tkt.rootCauseAnalysis}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#DDE3DD] flex items-center justify-between text-[11px]">
                <span className="font-mono text-[#6B7269]">
                  Target: <strong className="text-emerald-800">{tkt.targetResolutionDate}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  {tkt.status !== 'resolved' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(tkt.id, 'resolved')}
                      className="px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition text-[10px] cursor-pointer"
                    >
                      Resolve
                    </button>
                  )}
                  {tkt.status === 'open' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(tkt.id, 'subcontractor_dispatched')}
                      className="px-2 py-0.5 rounded bg-[#0A1A2F] hover:bg-[#152a45] text-white font-bold transition text-[10px] cursor-pointer"
                    >
                      Dispatch
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          MODAL: LOG NEW SLA TICKET
          ========================================================================= */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#DDE3DD] overflow-hidden max-h-[90vh] overflow-y-auto">
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
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 space-y-3.5 text-xs font-sans bg-[#FAF9F5]">
              <div>
                <label className="block text-[#1A1A1A] font-bold mb-1">Factory / Plant</label>
                <select
                  value={newFactory}
                  onChange={(e) => setNewFactory(e.target.value)}
                  className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] font-mono text-xs"
                >
                  <option value="Ha-Meem Denim Washing & Weaving Plant">Ha-Meem Denim Washing & Weaving Plant (1.2 MWp)</option>
                  <option value="Envoy Textiles High-Efficiency Plant">Envoy Textiles High-Efficiency Plant (800 kWp)</option>
                  <option value="Square Pharmaceuticals Solar Division">Square Pharmaceuticals Solar Division (1.5 MWp)</option>
                  <option value="RAK Ceramics Tableware Division">RAK Ceramics Tableware Division (650 kWp)</option>
                  <option value="Apex Tannery & Artisan Leatherworks">Apex Tannery & Artisan Leatherworks (500 kWp)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#1A1A1A] font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] text-[11px]"
                  >
                    <option value="Performance Ratio Drop (<75% PR Alert)">PR Drop (&lt;75% PR)</option>
                    <option value="Inverter String Trip / Grid Synchronization Error">Inverter String Trip</option>
                    <option value="Routine Bi-Weekly High-Pressure Panel Wash">Routine Panel Wash</option>
                    <option value="Module Hotspot / Glass Defect (OEM RMA)">Module Hotspot (RMA)</option>
                    <option value="Annual Statutory SREDA & IEB Electrical Audit">SREDA &amp; IEB Audit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-bold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
                    className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] font-mono text-[11px]"
                  >
                    <option value="critical_power_loss">Critical (Power Loss)</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low (Routine)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#1A1A1A] font-bold mb-1">Subcontractor Crew</label>
                  <select
                    value={newSubcontractor}
                    onChange={(e) => setNewSubcontractor(e.target.value)}
                    className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] font-mono text-[11px]"
                  >
                    <option value="Electro-Grid HT/LT Substation Engineers">Electro-Grid HT/LT Engineers</option>
                    <option value="Bengal Solar Mech & Civil Racking Works">Bengal Solar Mech & Civil</option>
                    <option value="Bureau of Structural Engineering & Research (BSER)">BSER Structural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-bold mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1A1A1A] font-bold mb-1">Diagnostics / Telemetry Alert</label>
                <textarea
                  rows={2}
                  placeholder="Detail string anomaly, fuse failure, or washing scope..."
                  value={newRootCause}
                  onChange={(e) => setNewRootCause(e.target.value)}
                  className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 border-t border-[#DDE3DD] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#DDE3DD] text-[#1A1A1A] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
