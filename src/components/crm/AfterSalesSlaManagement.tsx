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

  const filteredTickets = tickets.filter((t) => {
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
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
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0A1A2F]">
              Tri-Party After-Sales SLA &amp; Telemetry Maintenance
            </h3>
            <p className="text-[11px] text-slate-500">
              Synchronizing Customer &bull; OEM Supplier (Huawei/Longi) &bull; Subcontractor field crews with Ariel-SaaS IoT PR telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
      </div>

      {/* SLA Tickets List */}
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

            {/* Tri-Party Stakeholder Assignment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-mono">1. Client Contact</div>
                <div className="font-bold text-slate-900 mt-0.5">{tkt.clientContact.name}</div>
                <div className="text-slate-500 text-[11px]">{tkt.clientContact.designation} &bull; {tkt.clientContact.phone}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <div className="text-[10px] text-emerald-800 uppercase font-mono font-bold">2. Assigned Field Crew</div>
                <div className="font-bold text-emerald-900 mt-0.5">{tkt.assignedSubcontractor.companyName}</div>
                <div className="text-emerald-700 text-[11px]">{tkt.assignedSubcontractor.leadTechnician} ({tkt.assignedSubcontractor.technicianPhone})</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-mono">3. OEM Warranty RMA</div>
                <div className="font-bold text-slate-900 mt-0.5">{tkt.supplierRmaDetails?.oemBrand || 'Direct Ariel O&M SLA'}</div>
                <div className="text-slate-500 text-[11px]">RMA: {tkt.supplierRmaDetails?.rmaTrackingNumber || 'Routine SLA Washing'}</div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 gap-2">
              <div>
                Reported: <strong className="text-slate-700 font-mono">{tkt.reportedAt}</strong> &bull; Target: <strong className="text-slate-700 font-mono">{tkt.targetResolutionDate}</strong>
              </div>
              {tkt.resolvedAt && (
                <div className="text-emerald-700 font-semibold font-mono">
                  &check; Resolved: {tkt.resolvedAt}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
