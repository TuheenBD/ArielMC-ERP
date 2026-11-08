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
  Eye,
  Edit3,
  Trash2,
  Share2,
  Download,
  Check,
  FileText,
  Printer,
  Copy,
} from 'lucide-react';

interface AfterSalesSlaManagementProps {
  tickets: AfterSalesTicket[];
  onUpdateTicketStatus?: (ticketId: string, newStatus: TicketStatus) => void;
  onAddTicket?: (ticket: AfterSalesTicket) => void;
  onEditTicket?: (ticket: AfterSalesTicket) => void;
  onDeleteTicket?: (ticketId: string) => void;
  theme?: string;
}

export default function AfterSalesSlaManagement({
  tickets: initialTickets,
  onUpdateTicketStatus,
  onAddTicket,
  onEditTicket,
  onDeleteTicket,
  theme = 'crm-green',
}: AfterSalesSlaManagementProps) {
  const [tickets, setTickets] = useState<AfterSalesTicket[]>(initialTickets);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [displayMode, setDisplayMode] = useState<'GRID' | 'TABLE'>('TABLE');
  const [searchTerm, setSearchTerm] = useState('');

  // Selection state
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);

  // Modal states
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<AfterSalesTicket | null>(null);
  const [editingTicket, setEditingTicket] = useState<AfterSalesTicket | null>(null);
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with prop updates
  React.useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  // Show auto-dismiss toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

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
    showToast(`Status updated to ${newStatus.replace('_', ' ')}`);
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
        leadTechnician: 'Engr. Rakibul Islam',
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
      targetResolutionDate: `${newTargetDate} 17:00`,
      telemetryAlertTriggered: newCategory.includes('PR Alert'),
      performanceRatioDropPct: newCategory.includes('PR Alert') ? 68.4 : undefined,
      rootCauseAnalysis: newRootCause || 'Under dispatch investigation by field engineering team.',
      actionTakenNotes: ['Ticket logged via AREL-CRM Enterprise OS.'],
    };

    setTickets((prev) => [created, ...prev]);
    onAddTicket?.(created);
    setIsNewTicketModalOpen(false);
    showToast(`Ticket ${created.ticketNumber} created successfully`);
  };

  // Handle Edit ticket save
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket) return;

    setTickets((prev) =>
      prev.map((t) => (t.id === editingTicket.id ? editingTicket : t))
    );
    onEditTicket?.(editingTicket);
    setEditingTicket(null);
    showToast(`Ticket ${editingTicket.ticketNumber} updated`);
  };

  // Handle Delete ticket
  const handleDeleteConfirm = () => {
    if (!deletingTicketId) return;
    setTickets((prev) => prev.filter((t) => t.id !== deletingTicketId));
    setSelectedTicketIds((prev) => prev.filter((id) => id !== deletingTicketId));
    onDeleteTicket?.(deletingTicketId);
    setDeletingTicketId(null);
    showToast('Ticket removed successfully');
  };

  // Selection helpers
  const handleToggleSelect = (id: string, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    setSelectedTicketIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTicketIds.length === filteredTickets.length) {
      setSelectedTicketIds([]);
    } else {
      setSelectedTicketIds(filteredTickets.map((t) => t.id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedTicketIds.length} selected tickets?`)) {
      setTickets((prev) => prev.filter((t) => !selectedTicketIds.includes(t.id)));
      selectedTicketIds.forEach((id) => onDeleteTicket?.(id));
      setSelectedTicketIds([]);
      showToast(`${selectedTicketIds.length} tickets deleted`);
    }
  };

  const handleBulkStatusChange = (status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (selectedTicketIds.includes(t.id) ? { ...t, status } : t))
    );
    selectedTicketIds.forEach((id) => onUpdateTicketStatus?.(id, status));
    showToast(`${selectedTicketIds.length} tickets marked as ${status.replace('_', ' ')}`);
  };

  // Share handler
  const handleShare = (tkt: AfterSalesTicket, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const shareUrl = `https://energy.arielmc.com/crm?tab=after_sales&ticket=${tkt.ticketNumber}`;
    navigator.clipboard.writeText(shareUrl);
    showToast(`Tracking link for ${tkt.ticketNumber} copied to clipboard!`);
  };

  // Download PDF simulation / trigger
  const handleDownloadPdf = (tkt: AfterSalesTicket, e?: React.MouseEvent) => {
    e?.stopPropagation();
    showToast(`Generating SLA Report PDF for ${tkt.ticketNumber}...`);
    setTimeout(() => {
      // Create a printable text blob as emergency fallback or trigger window print
      const docContent = `
ARIEL RENEWABLE ENERGY LIMITED
ENTERPRISE AFTER-SALES SERVICE SLA & IOT TELEMETRY REPORT
---------------------------------------------------------
Ticket Number:      ${tkt.ticketNumber}
Factory / Plant:    ${tkt.factoryName}
Category:           ${tkt.ticketCategory}
Priority:           ${tkt.priority.toUpperCase()}
Status:             ${tkt.status.toUpperCase()}
Reported At:        ${tkt.reportedAt}
Target Resolution:  ${tkt.targetResolutionDate}

ASSIGNED FIELD CREW:
Company:            ${tkt.assignedSubcontractor?.companyName || 'N/A'}
Lead Technician:    ${tkt.assignedSubcontractor?.leadTechnician || 'N/A'}
Phone:              ${tkt.assignedSubcontractor?.technicianPhone || 'N/A'}

OEM RMA INFORMATION:
OEM Brand:          ${tkt.supplierRmaDetails?.oemBrand || 'None (In-House Service)'}
RMA Tracking Ref:   ${tkt.supplierRmaDetails?.rmaTrackingNumber || 'N/A'}

DIAGNOSTIC & TELEMETRY AUDIT:
Root Cause:         ${tkt.rootCauseAnalysis}
PR Drop Trigger:    ${tkt.performanceRatioDropPct ? `${tkt.performanceRatioDropPct}% PR Alert` : 'Normal Generation'}

ACTION AUDIT TRAIL:
${tkt.actionTakenNotes?.map((note, i) => `${i + 1}. ${note}`).join('\n') || 'None recorded'}
---------------------------------------------------------
Official Seal: Ariel Renewable Energy Limited • SREDA Net-Metering Compliance
      `;
      const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tkt.ticketNumber}_SLA_Report.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, 600);
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (
      searchTerm &&
      !t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !t.factoryName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !t.ticketCategory.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(t.rootCauseAnalysis?.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'critical_power_loss':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Critical: Generation Loss
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Routine Maintenance
          </span>
        );
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Open Ticket
          </span>
        );
      case 'subcontractor_dispatched':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            Crew Dispatched
          </span>
        );
      case 'oem_rma_in_progress':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
            OEM RMA Active
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Resolved • PR Recovered
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Archived / Closed
          </span>
        );
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

      {/* =========================================================================
          TOP SLA SUMMARY STATS
          ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#DDE3DD] shadow-2xs">
          <div className="text-[10px] font-mono font-bold uppercase text-[#6B7269] flex items-center justify-between">
            <span>Fleet Average PR</span>
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-[#1F3A2E] mt-1 font-mono">
            79.4% <span className="text-[10px] text-[#6B7269] font-normal">/ 81.5% Target</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Automated IoT Telemetry Bridge Active</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#DDE3DD] shadow-2xs">
          <div className="text-[10px] font-mono font-bold uppercase text-[#6B7269] flex items-center justify-between">
            <span>PR &lt; 75% Degradation Alerts</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-600 mt-1 font-mono">
            1 String Tripped
          </div>
          <div className="text-[10px] text-amber-700 font-bold mt-0.5">Ha-Meem Denim Inverter #3</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#DDE3DD] shadow-2xs">
          <div className="text-[10px] font-mono font-bold uppercase text-[#6B7269] flex items-center justify-between">
            <span>Bi-Weekly Washing SLA</span>
            <Droplets className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-xl font-black text-[#1F3A2E] mt-1 font-mono">
            94% Compliance
          </div>
          <div className="text-[10px] text-[#6B7269] font-medium mt-0.5">RO Demineralized High-Pressure</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#DDE3DD] shadow-2xs">
          <div className="text-[10px] font-mono font-bold uppercase text-[#6B7269] flex items-center justify-between">
            <span>Active Tri-Party Tickets</span>
            <Wrench className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl font-black text-[#0A1A2F] mt-1 font-mono">
            {tickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed').length} Active
          </div>
          <div className="text-[10px] text-purple-700 font-bold mt-0.5">Client ↔ Subcontractor ↔ OEM RMA</div>
        </div>
      </div>

      {/* =========================================================================
          CONTROLS TOOLBAR & BULK ACTIONS
          ========================================================================= */}
      <div className="bg-white p-3 rounded-xl border border-[#DDE3DD] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Filter & Search Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7269]" />
            <input
              type="text"
              placeholder="Search ticket #, factory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF9F5] border border-[#DDE3DD] rounded-lg text-[#1A1A1A] placeholder-[#6B7269] focus:outline-none focus:border-[#1F3A2E]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="p-1.5 bg-[#FAF9F5] border border-[#DDE3DD] rounded-lg text-xs font-semibold text-[#1A1A1A] focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="critical_power_loss">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-1.5 bg-[#FAF9F5] border border-[#DDE3DD] rounded-lg text-xs font-semibold text-[#1A1A1A] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="open">Open</option>
              <option value="subcontractor_dispatched">Dispatched</option>
              <option value="oem_rma_in_progress">OEM RMA</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Right Action Tools: Bulk bar or view toggles + log button */}
        <div className="flex items-center gap-2">
          {/* Bulk Selection Bar */}
          {selectedTicketIds.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#0A1A2F] text-white px-2.5 py-1 rounded-lg text-xs font-mono animate-in fade-in">
              <span className="font-bold text-emerald-300">{selectedTicketIds.length} Selected</span>
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={() => handleBulkStatusChange('resolved')}
                className="hover:text-emerald-300 text-[10px] font-bold cursor-pointer"
                title="Mark all selected as Resolved"
              >
                Mark Resolved
              </button>
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="hover:text-rose-300 text-[10px] font-bold cursor-pointer"
                title="Delete selected tickets"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setSelectedTicketIds([])}
                className="text-slate-400 hover:text-white ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Grid vs Table View Mode Toggle */}
          <div className="flex items-center bg-[#FAF9F5] p-0.5 rounded-lg border border-[#DDE3DD]">
            <button
              type="button"
              onClick={() => setDisplayMode('TABLE')}
              className={`p-1.5 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                displayMode === 'TABLE'
                  ? 'bg-white text-[#1F3A2E] shadow-2xs'
                  : 'text-[#6B7269] hover:text-[#1A1A1A]'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('GRID')}
              className={`p-1.5 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                displayMode === 'GRID'
                  ? 'bg-white text-[#1F3A2E] shadow-2xs'
                  : 'text-[#6B7269] hover:text-[#1A1A1A]'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Log Ticket Button */}
          <button
            type="button"
            onClick={() => setIsNewTicketModalOpen(true)}
            className="px-3 py-1.5 bg-[#1F3A2E] hover:bg-[#2C5240] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer font-mono"
          >
            <Plus className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>Log SLA Ticket</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          CONDITIONAL RENDERING: HIGH-DENSITY COMPACT TABLE WITH FULL ACTIONS
          ========================================================================= */}
      {displayMode === 'TABLE' ? (
        <div className="bg-white rounded-xl border border-[#DDE3DD] shadow-2xs overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-[11px] font-sans">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[9px] tracking-wider font-mono">
                <tr>
                  <th className="py-2.5 px-3 w-8 text-center">
                    <input
                      type="checkbox"
                      checked={filteredTickets.length > 0 && selectedTicketIds.length === filteredTickets.length}
                      onChange={handleSelectAll}
                      className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3">Ticket &amp; Factory</th>
                  <th className="py-2.5 px-3">Category &amp; Diagnostic</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Assigned Crew</th>
                  <th className="py-2.5 px-3">OEM RMA</th>
                  <th className="py-2.5 px-3">Target Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD] text-[#1A1A1A]">
                {filteredTickets.map((tkt) => {
                  const isSelected = selectedTicketIds.includes(tkt.id);

                  return (
                    <tr
                      key={tkt.id}
                      className={`hover:bg-[#FAF9F5] transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}
                    >
                      {/* Selection Checkbox */}
                      <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelect(tkt.id, e)}
                          className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

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

                      {/* Complete Action Suite: View | Edit | Share | Download | Delete */}
                      <td className="py-2 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() => setViewingTicket(tkt)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition"
                            title="View Full SLA Ticket Dossier"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => setEditingTicket(tkt)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition"
                            title="Edit Ticket Details"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                          </button>

                          {/* Share */}
                          <button
                            type="button"
                            onClick={(e) => handleShare(tkt, e)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition"
                            title="Share Tracking Link"
                          >
                            <Share2 className="w-3.5 h-3.5 text-teal-600" />
                          </button>

                          {/* Download PDF */}
                          <button
                            type="button"
                            onClick={(e) => handleDownloadPdf(tkt, e)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition"
                            title="Download SLA Report & PR Audit PDF"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-700" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeletingTicketId(tkt.id)}
                            className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                            title="Delete Ticket"
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
      ) : (
        /* Compact Grid View with Full Actions */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTickets.map((tkt) => {
            const isSelected = selectedTicketIds.includes(tkt.id);

            return (
              <div
                key={tkt.id}
                className={`bg-white rounded-xl border border-[#DDE3DD] p-4 shadow-2xs space-y-3 hover:border-emerald-400 transition-all flex flex-col justify-between ${
                  isSelected ? 'border-emerald-500 ring-1 ring-emerald-500' : ''
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleSelect(tkt.id, e)}
                        className="mt-1 rounded text-emerald-600 focus:ring-0 cursor-pointer"
                      />
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
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {getPriorityBadge(tkt.priority)}
                      {getStatusBadge(tkt.status)}
                    </div>
                  </div>

                  <p className="text-xs text-[#1A1A1A] bg-[#FAF9F5] p-2.5 rounded-lg border border-[#DDE3DD] font-mono leading-relaxed">
                    <strong>Diagnostic:</strong> {tkt.rootCauseAnalysis}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#DDE3DD]">
                      <div className="text-[10px] uppercase font-bold text-[#6B7269]">Subcontractor Crew</div>
                      <div className="font-bold text-[#1A1A1A] truncate mt-0.5">
                        {tkt.assignedSubcontractor?.companyName || 'Unassigned'}
                      </div>
                      <div className="text-[10px] text-[#1F3A2E] font-mono">
                        {tkt.assignedSubcontractor?.technicianPhone || '—'}
                      </div>
                    </div>

                    <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#DDE3DD]">
                      <div className="text-[10px] uppercase font-bold text-[#6B7269]">OEM RMA Tracking</div>
                      <div className="font-bold text-[#1A1A1A] truncate mt-0.5">
                        {tkt.supplierRmaDetails?.oemBrand || 'Direct Repair'}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-mono font-bold truncate">
                        {tkt.supplierRmaDetails?.rmaTrackingNumber || 'In-House'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid Card Actions Footer */}
                <div className="pt-3 border-t border-[#DDE3DD] flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-emerald-800">
                    Target: {tkt.targetResolutionDate}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setViewingTicket(tkt)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-blue-600" />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTicket(tkt)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3 text-amber-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleShare(tkt, e)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Share link"
                    >
                      <Share2 className="w-3 h-3 text-teal-600" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDownloadPdf(tkt, e)}
                      className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
                      title="Download PDF"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingTicketId(tkt.id)}
                      className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                      title="Delete ticket"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: VIEW TICKET DOSSIER INSPECTOR
          ========================================================================= */}
      {viewingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#DDE3DD] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#0A1A2F] text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#C9A86A]" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider font-mono">
                  SLA Ticket Dossier: {viewingTicket.ticketNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingTicket(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-base font-bold text-[#0A1A2F]">{viewingTicket.factoryName}</h4>
                  <div className="text-emerald-700 font-semibold">{viewingTicket.ticketCategory}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">Reported: {viewingTicket.reportedAt}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {getPriorityBadge(viewingTicket.priority)}
                  {getStatusBadge(viewingTicket.status)}
                </div>
              </div>

              {/* Diagnostic Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block mb-1">
                  Root Cause Analysis &amp; Diagnostic:
                </span>
                <p className="text-slate-800 leading-relaxed font-mono">{viewingTicket.rootCauseAnalysis}</p>
                {viewingTicket.performanceRatioDropPct && (
                  <div className="mt-2 text-rose-700 font-bold font-mono text-[11px] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Telemetry Alert: PR dropped to {viewingTicket.performanceRatioDropPct}% (&lt;75% threshold)</span>
                  </div>
                )}
              </div>

              {/* Tri-Party Stakeholders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Assigned Contractor</span>
                  <div className="font-bold text-[#0A1A2F] mt-1">{viewingTicket.assignedSubcontractor?.companyName}</div>
                  <div className="text-slate-600 mt-0.5">Lead: {viewingTicket.assignedSubcontractor?.leadTechnician}</div>
                  <div className="text-emerald-700 font-mono">{viewingTicket.assignedSubcontractor?.technicianPhone}</div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Supplier OEM RMA</span>
                  <div className="font-bold text-[#0A1A2F] mt-1">{viewingTicket.supplierRmaDetails?.oemBrand || 'In-House'}</div>
                  <div className="text-emerald-700 font-mono font-bold mt-0.5">
                    {viewingTicket.supplierRmaDetails?.rmaTrackingNumber || 'No RMA Required'}
                  </div>
                  <div className="text-slate-500 text-[10px]">{viewingTicket.supplierRmaDetails?.replacementPartStatus || 'Standard Warranty'}</div>
                </div>
              </div>

              {/* Action Trail */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">Audit Trail &amp; Actions</span>
                <div className="space-y-1">
                  {viewingTicket.actionTakenNotes?.map((note, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-700 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(viewingTicket)}
                    className="px-3 py-1.5 bg-[#0A1A2F] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 font-mono"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C9A86A]" />
                    <span>Download Report PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(viewingTicket)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Link</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingTicket(null)}
                  className="px-4 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: EDIT TICKET
          ========================================================================= */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#DDE3DD] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#0A1A2F] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider font-mono">
                  Edit SLA Ticket: {editingTicket.ticketNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTicket(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs font-sans bg-[#FAF9F5]">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Factory Name</label>
                <input
                  type="text"
                  value={editingTicket.factoryName}
                  onChange={(e) => setEditingTicket({ ...editingTicket, factoryName: e.target.value })}
                  className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    value={editingTicket.priority}
                    onChange={(e) => setEditingTicket({ ...editingTicket, priority: e.target.value as TicketPriority })}
                    className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:border-emerald-600"
                  >
                    <option value="critical_power_loss">Critical (Power Loss)</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low (Routine)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Workflow Status</label>
                  <select
                    value={editingTicket.status}
                    onChange={(e) => setEditingTicket({ ...editingTicket, status: e.target.value as TicketStatus })}
                    className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:border-emerald-600"
                  >
                    <option value="open">Open</option>
                    <option value="subcontractor_dispatched">Dispatched</option>
                    <option value="oem_rma_in_progress">OEM RMA</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Resolution Date</label>
                <input
                  type="text"
                  value={editingTicket.targetResolutionDate}
                  onChange={(e) => setEditingTicket({ ...editingTicket, targetResolutionDate: e.target.value })}
                  className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Diagnostics / Telemetry Notes</label>
                <textarea
                  rows={3}
                  value={editingTicket.rootCauseAnalysis || ''}
                  onChange={(e) => setEditingTicket({ ...editingTicket, rootCauseAnalysis: e.target.value })}
                  className="w-full p-2 bg-white border border-[#DDE3DD] rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 border-t border-[#DDE3DD] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTicket(null)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#DDE3DD] text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0A1A2F] hover:bg-emerald-700 text-white font-bold transition shadow-xs cursor-pointer font-mono"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: DELETE CONFIRMATION
          ========================================================================= */}
      {deletingTicketId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 rounded-full bg-rose-100">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0A1A2F]">Delete SLA Ticket?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete ticket{' '}
              <span className="font-mono font-bold text-rose-700">
                {tickets.find((t) => t.id === deletingTicketId)?.ticketNumber}
              </span>
              ? This action will remove the ticket and audit history.
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingTicketId(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: LOG NEW SLA TICKET
          ========================================================================= */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
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
                  <option value="Ha-Meem Denim Washing & Weaving Plant">Ha-Meem Denim Washing &amp; Weaving Plant (1.2 MWp)</option>
                  <option value="Envoy Textiles High-Efficiency Plant">Envoy Textiles High-Efficiency Plant (800 kWp)</option>
                  <option value="Square Pharmaceuticals Solar Division">Square Pharmaceuticals Solar Division (1.5 MWp)</option>
                  <option value="RAK Ceramics Tableware Division">RAK Ceramics Tableware Division (650 kWp)</option>
                  <option value="Apex Tannery & Artisan Leatherworks">Apex Tannery &amp; Artisan Leatherworks (500 kWp)</option>
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
                    <option value="Bengal Solar Mech & Civil Racking Works">Bengal Solar Mech &amp; Civil</option>
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
                  className="px-4 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white font-bold transition shadow-xs cursor-pointer font-mono"
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
