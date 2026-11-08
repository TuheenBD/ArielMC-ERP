'use client';

import React, { useState, useMemo } from 'react';
import { SolarLead, LeadStage } from '@/types/crm';
import {
  Zap,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileSpreadsheet,
  Download,
  Share2,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  Plus,
  Sliders,
  ShieldCheck,
  Cpu,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  Eye,
  Edit3,
  Trash2,
  X,
} from 'lucide-react';

interface LeadManagementProps {
  leads: SolarLead[];
  onSelectLead: (lead: SolarLead) => void;
  onOpenNewLeadModal: () => void;
  onOpenTechnicalForLead: (lead: SolarLead) => void;
  onUpdateLeadStage: (leadId: string, newStage: LeadStage) => void;
  onEditLead?: (updatedLead: SolarLead) => void;
  onDeleteLead?: (leadId: string) => void;
  theme?: string;
}

const STAGE_CONFIG: Record<
  LeadStage,
  { label: string; step: number; color: string; badgeCol: string }
> = {
  inbound: { label: 'Inbound Dossier Request', step: 1, color: '#64748B', badgeCol: 'bg-slate-100 text-slate-700' },
  satellite_audit: { label: '3D Satellite Audit Completed', step: 2, color: '#3B82F6', badgeCol: 'bg-blue-100 text-blue-800' },
  site_audit_scheduled: { label: 'Drone & Civil Audit Scheduled', step: 3, color: '#8B5CF6', badgeCol: 'bg-purple-100 text-purple-800' },
  proposal_submitted: { label: 'Techno-Commercial Submitted', step: 4, color: '#F59E0B', badgeCol: 'bg-amber-100 text-amber-800' },
  bank_financing: { label: '4.5% Bank Debt Sanctioned', step: 5, color: '#10B981', badgeCol: 'bg-emerald-100 text-emerald-800' },
  contract_executed: { label: 'EPC Contract Executed', step: 6, color: '#059669', badgeCol: 'bg-emerald-200 text-emerald-900 font-bold' },
  sreda_connected: { label: 'SREDA Net-Metered (Tk 10.50)', step: 7, color: '#0A1A2F', badgeCol: 'bg-[#0A1A2F] text-[#C9A86A] font-extrabold' },
};

export default function LeadManagement({
  leads,
  onSelectLead,
  onOpenNewLeadModal,
  onOpenTechnicalForLead,
  onUpdateLeadStage,
  onEditLead,
  onDeleteLead,
  theme = 'crm-green',
}: LeadManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('All');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [displayMode, setDisplayMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Selection, Edit, and Delete State
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [editingLead, setEditingLead] = useState<SolarLead | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedLeadIds.length} selected leads?`)) {
      selectedLeadIds.forEach((id) => onDeleteLead?.(id));
      setSelectedLeadIds([]);
      showToast(`${selectedLeadIds.length} leads deleted`);
    }
  };

  const handleShareLead = (lead: SolarLead, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const shareUrl = `https://energy.arielmc.com/crm?tab=leads&leadId=${lead.id}`;
    navigator.clipboard.writeText(shareUrl);
    showToast(`Dossier link for ${lead.factoryName} copied to clipboard!`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    onEditLead?.(editingLead);
    setEditingLead(null);
    showToast(`Lead ${editingLead.factoryName} updated`);
  };

  const handleConfirmDelete = () => {
    if (!deletingLeadId) return;
    onDeleteLead?.(deletingLeadId);
    setSelectedLeadIds((prev) => prev.filter((id) => id !== deletingLeadId));
    setDeletingLeadId(null);
    showToast('Lead deleted successfully');
  };

  // SREDA Cutoff Date: Feb 28, 2027
  const sredaDaysRemaining = useMemo(() => {
    const target = new Date('2027-02-28').getTime();
    const now = new Date().getTime();
    const diff = target - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        l.factoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.parentGroup && l.parentGroup.toLowerCase().includes(searchTerm.toLowerCase())) ||
        l.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCorridor = selectedCorridor === 'All' || l.corridor === selectedCorridor;
      const matchSector = selectedSector === 'All' || l.industrySector === selectedSector;
      const matchStage = selectedStage === 'All' || l.stage === selectedStage;

      return matchSearch && matchCorridor && matchSector && matchStage;
    });
  }, [leads, searchTerm, selectedCorridor, selectedSector, selectedStage]);

  // Executive Pipeline Metrics
  const pipelineMetrics = useMemo(() => {
    const totalPipelineValue = leads.reduce((acc, l) => acc + l.projectValueBdt, 0);
    const totalCapacityKwp = leads.reduce((acc, l) => acc + l.estimatedCapacityKwp, 0);
    const activeAuditsCount = leads.filter(
      (l) => l.stage === 'satellite_audit' || l.stage === 'site_audit_scheduled'
    ).length;
    const closingStagesCount = leads.filter(
      (l) => l.stage === 'proposal_submitted' || l.stage === 'bank_financing' || l.stage === 'contract_executed'
    ).length;

    return {
      totalPipelineValue,
      totalCapacityKwp,
      activeAuditsCount,
      closingStagesCount,
    };
  }, [leads]);

  // Instant PDF Dossier Download Trigger
  const handleDownloadDossier = async (lead: SolarLead, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadingId(lead.id);
    try {
      const payload = {
        companyName: lead.factoryName,
        contactName: lead.contactPerson,
        designation: lead.designation,
        phone: lead.phone,
        email: lead.email,
        location: lead.location,
        roofType: lead.technical.roofSubstrate,
        roofAreaSqFt: lead.roofAreaSqFt,
        monthlyBillBdt: lead.monthlyBillBdt,
        utilityProvider: lead.technical.utilityProvider,
        operatingDays: 6,
      };

      const res = await fetch('/api/generate-dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to generate dossier');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ariel_Energy_Dossier_${lead.factoryName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Could not download PDF dossier. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Executive KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pipeline CapEx */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Total Pipeline Value
            </span>
            <div className="text-2xl font-black text-[#0A1A2F] font-mono">
              Tk {(pipelineMetrics.totalPipelineValue / 10000000).toFixed(2)} Cr
            </div>
            <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">
              Across {leads.length} industrial factories
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Megawatts Capacity */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Target C&I Capacity
            </span>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              {(pipelineMetrics.totalCapacityKwp / 1000).toFixed(2)} MWp
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
              {pipelineMetrics.totalCapacityKwp.toLocaleString()} kWp solar PV
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* Closing Stages */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Active Negotiations
            </span>
            <div className="text-2xl font-black text-[#0A1A2F] font-mono">
              {pipelineMetrics.closingStagesCount} Accounts
            </div>
            <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">
              Bank debt & EPC contracting
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* SREDA Cutoff Clock */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0A1A2F] to-[#152a45] text-white shadow-xs flex items-center justify-between border border-[#C9A86A]/40">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A86A] block mb-1">
              SREDA Tk 10.50 Cutoff
            </span>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {sredaDaysRemaining} Days
            </div>
            <span className="text-[10px] text-slate-300 font-light mt-0.5 block">
              Target COD: Feb 28, 2027
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 text-[#C9A86A] flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Controls & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by factory name, contact, group, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
            />
          </div>

          {/* Sector Filter */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Sectors</option>
              <option value="RMG / Apparel">RMG / Apparel</option>
              <option value="Textiles & Dyeing">Textiles & Dyeing</option>
              <option value="Steel & Heavy Engineering">Steel & Heavy Engineering</option>
              <option value="Ceramics & Tableware">Ceramics & Tableware</option>
              <option value="Leather & Footwear">Leather & Footwear</option>
              <option value="Agro & Food Processing">Agro & Food Processing</option>
              <option value="Jute Mills">Jute Mills</option>
              <option value="Heavy Packaging">Heavy Packaging</option>
            </select>
          </div>

          {/* Corridor Dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCorridor}
              onChange={(e) => setSelectedCorridor(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Corridors</option>
              <option value="Dhaka / Gazipur / Savar">Dhaka / Gazipur / Savar</option>
              <option value="Chattogram / Narayanganj">Chattogram / Narayanganj</option>
              <option value="Mymensingh / Valuka">Mymensingh / Valuka</option>
            </select>
          </div>

          {/* Stage Filter */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Pipeline Stages</option>
              <option value="inbound">Inbound Request</option>
              <option value="satellite_audit">3D Satellite Audit</option>
              <option value="site_audit_scheduled">Site Audit Scheduled</option>
              <option value="proposal_submitted">Proposal Submitted</option>
              <option value="bank_financing">Bank Financing</option>
              <option value="contract_executed">Contract Executed</option>
              <option value="sreda_connected">SREDA Connected</option>
            </select>
          </div>
        </div>

        {/* Action Buttons: Bank Feasibility Dossier & New Lead Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Grid vs Table View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
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

          <a
            href="/documents/AREL_BNK_2026_FEAS_V1_Bankable_Feasibility_Study_Dossier.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition"
            title="Download Official 10-Page Bankable Feasibility Dossier (AREL-BNK-2026-FEAS-V1)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Bank Dossier (PDF)</span>
          </a>
          <button
            type="button"
            onClick={onOpenNewLeadModal}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-[0_8px_25px_rgba(16,185,129,0.35)] hover:backdrop-blur-md hover:border hover:border-emerald-300/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Factory Lead</span>
          </button>
        </div>
      </div>

      {/* Main Leads Table & Detail Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header & Bulk Actions */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-[#0A1A2F] uppercase tracking-wider">
              Industrial Rooftop Accounts ({filteredLeads.length})
            </h3>
          </div>

          {selectedLeadIds.length > 0 ? (
            <div className="flex items-center gap-2 bg-[#0A1A2F] text-white px-3 py-1 rounded-lg text-xs font-mono">
              <span className="font-bold text-emerald-300">{selectedLeadIds.length} Selected</span>
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="hover:text-emerald-300 text-[11px] font-bold cursor-pointer"
              >
                {selectedLeadIds.length === filteredLeads.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="hover:text-rose-300 text-[11px] font-bold text-rose-400 cursor-pointer"
              >
                Delete Selected
              </button>
              <button
                type="button"
                onClick={() => setSelectedLeadIds([])}
                className="text-slate-400 hover:text-white ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500 font-mono">
              Guaranteed Tk 10.50/kWh Buyback Tracking Active
            </span>
          )}
        </div>

        {displayMode === 'GRID' ? (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {filteredLeads.map((lead) => {
              const stageCfg = STAGE_CONFIG[lead.stage];
              const isDownloading = downloadingId === lead.id;

              return (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className={`p-5 hover:bg-emerald-50/40 transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 cursor-pointer group ${
                    selectedLeadIds.includes(lead.id) ? 'bg-emerald-50/60 ring-1 ring-emerald-500' : ''
                  }`}
                >
                  {/* Left Info: Checkbox, Factory, Group, Contact */}
                  <div className="flex-1 min-w-[300px] flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedLeadIds.includes(lead.id)}
                      onChange={(e) => handleToggleSelect(lead.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 rounded text-emerald-600 focus:ring-0 cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <span className="font-bold text-sm text-[#0A1A2F] group-hover:text-emerald-700 transition">
                          {lead.factoryName}
                        </span>
                        {lead.parentGroup && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            {lead.parentGroup}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            lead.priority === 'Critical (SREDA Cutoff)'
                              ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lead.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{lead.contactPerson} ({lead.phone})</span>
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">{lead.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Info: Capacity & CapEx Valuation */}
                  <div className="flex items-center gap-6 shrink-0 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">
                        Target Capacity
                      </span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {lead.estimatedCapacityKwp} kWp
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {lead.roofAreaSqFt.toLocaleString()} sq ft
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">
                        CapEx Project Value
                      </span>
                      <span className="font-bold text-[#0A1A2F] text-sm">
                        Tk {(lead.projectValueBdt / 10000000).toFixed(2)} Cr
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        ~Tk {(lead.monthlyBillBdt / 100000).toFixed(1)}L/mo Bill
                      </span>
                    </div>

                    {/* Stage Badge & Dropdown */}
                    <div className="min-w-[160px]">
                      <span className="text-[10px] text-slate-400 block uppercase font-sans mb-0.5">
                        Pipeline Stage
                      </span>
                      <select
                        value={lead.stage}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onUpdateLeadStage(lead.id, e.target.value as LeadStage)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 cursor-pointer focus:outline-none ${stageCfg.badgeCol}`}
                      >
                        <option value="inbound">1. Inbound Request</option>
                        <option value="satellite_audit">2. 3D Satellite Audit</option>
                        <option value="site_audit_scheduled">3. Site Audit Scheduled</option>
                        <option value="proposal_submitted">4. Proposal Submitted</option>
                        <option value="bank_financing">5. Bank Financing (4.5%)</option>
                        <option value="contract_executed">6. Contract Executed</option>
                        <option value="sreda_connected">7. SREDA Net-Metered</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSelectLead(lead)}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="View Lead Dossier & Turnkey Conversion"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingLead(lead)}
                      className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Edit Lead Specifications"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={(e) => handleDownloadDossier(lead, e)}
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Download Dossier PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">
                        {isDownloading ? 'Building...' : 'PDF'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleShareLead(lead, e)}
                      className="p-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 text-xs font-bold transition cursor-pointer"
                      title="Share Dossier Link & WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenTechnicalForLead(lead)}
                      className="p-1.5 rounded-lg bg-[#0A1A2F] hover:bg-[#152a45] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Technical Substation SLD"
                    >
                      <Cpu className="w-3.5 h-3.5 text-[#C9A86A]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingLeadId(lead.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* High-Density Industrial Rooftop Accounts Table View */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-3 w-8 text-center">
                    <input
                      type="checkbox"
                      checked={filteredLeads.length > 0 && selectedLeadIds.length === filteredLeads.length}
                      onChange={handleSelectAll}
                      className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Factory &amp; Group</th>
                  <th className="py-3 px-4">Sector &amp; Location</th>
                  <th className="py-3 px-4">Sanctioned kVA &amp; 70% Limit</th>
                  <th className="py-3 px-4">Capacity &amp; Area</th>
                  <th className="py-3 px-4">CapEx (Tk Cr)</th>
                  <th className="py-3 px-4">80% Green Loan @ 4.5%</th>
                  <th className="py-3 px-4">Pipeline Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLeads.map((lead) => {
                  const stageCfg = STAGE_CONFIG[lead.stage];
                  const maxAllowedAcKw = Math.round(lead.technical.sanctionedLoadKw * 0.7);
                  const isWithinLimit = lead.estimatedCapacityKwp <= maxAllowedAcKw;
                  const isDownloading = downloadingId === lead.id;

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className={`hover:bg-emerald-50/50 transition cursor-pointer ${
                        selectedLeadIds.includes(lead.id) ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      {/* Checkbox Column */}
                      <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedLeadIds.includes(lead.id)}
                          onChange={(e) => handleToggleSelect(lead.id, e)}
                          className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#0A1A2F]">{lead.factoryName}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {lead.parentGroup && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              {lead.parentGroup}
                            </span>
                          )}
                          <span className="font-mono text-[10px] text-slate-400">{lead.id}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{lead.industrySector}</div>
                        <div className="text-[11px] text-slate-500">{lead.location}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="font-bold text-slate-900">{lead.technical.sanctionedLoadKw} kW</div>
                        <div className={`text-[10px] ${isWithinLimit ? 'text-emerald-700 font-semibold' : 'text-red-700 font-bold'}`}>
                          Cap: {maxAllowedAcKw} kW {isWithinLimit ? '✓ SREDA OK' : '⚠ Exceeds'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="font-bold text-emerald-700 text-sm">{lead.estimatedCapacityKwp} kWp</div>
                        <div className="text-[10px] text-slate-500">{lead.roofAreaSqFt.toLocaleString()} sq ft</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="font-bold text-[#0A1A2F]">Tk {(lead.projectValueBdt / 10000000).toFixed(2)} Cr</div>
                        <div className="text-[10px] text-slate-500">25% Gross Mgn Locked</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="font-bold text-teal-700">Tk {((lead.projectValueBdt * 0.8) / 10000000).toFixed(2)} Cr</div>
                        <div className="text-[10px] text-slate-500">Equity 20%: Tk {((lead.projectValueBdt * 0.2) / 10000000).toFixed(2)} Cr</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={lead.stage}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onUpdateLeadStage(lead.id, e.target.value as LeadStage)}
                          className={`text-[10px] font-bold px-2 py-1 rounded border border-slate-200 cursor-pointer focus:outline-none ${stageCfg.badgeCol}`}
                        >
                          <option value="inbound">1. Inbound</option>
                          <option value="satellite_audit">2. 3D Satellite</option>
                          <option value="site_audit_scheduled">3. Site Audit</option>
                          <option value="proposal_submitted">4. Proposal</option>
                          <option value="bank_financing">5. Bank Loan (4.5%)</option>
                          <option value="contract_executed">6. Contract</option>
                          <option value="sreda_connected">7. SREDA COD</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => onSelectLead(lead)}
                            className="p-1.5 rounded hover:bg-blue-50 text-blue-700 transition"
                            title="View Lead Dossier & Turnkey Conversion"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingLead(lead)}
                            className="p-1.5 rounded hover:bg-amber-50 text-amber-700 transition"
                            title="Edit Lead"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={isDownloading}
                            onClick={(e) => handleDownloadDossier(lead, e)}
                            className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition"
                            title="Download 10-Page Dossier PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleShareLead(lead, e)}
                            className="p-1.5 rounded bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 transition"
                            title="Share Link & WhatsApp"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenTechnicalForLead(lead)}
                            className="p-1.5 rounded bg-[#0A1A2F] hover:bg-[#152a45] text-white transition"
                            title="Technical Substation SLD"
                          >
                            <Cpu className="w-3.5 h-3.5 text-[#C9A86A]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingLeadId(lead.id)}
                            className="p-1.5 rounded hover:bg-rose-50 text-rose-600 transition"
                            title="Delete Lead"
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
        )}
      </div>

      {/* =========================================================================
          MODAL 1: EDIT LEAD MODAL
          ========================================================================= */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#0A1A2F] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider font-mono">
                  Edit Lead: {editingLead.factoryName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingLead(null)}
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
                  value={editingLead.factoryName}
                  onChange={(e) => setEditingLead({ ...editingLead, factoryName: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Parent Corporate Group</label>
                  <input
                    type="text"
                    value={editingLead.parentGroup || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, parentGroup: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Industry Sector</label>
                  <input
                    type="text"
                    value={editingLead.industrySector}
                    onChange={(e) => setEditingLead({ ...editingLead, industrySector: e.target.value as any })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Capacity (kWp)</label>
                  <input
                    type="number"
                    value={editingLead.estimatedCapacityKwp}
                    onChange={(e) => setEditingLead({ ...editingLead, estimatedCapacityKwp: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">CapEx Value (BDT)</label>
                  <input
                    type="number"
                    value={editingLead.projectValueBdt}
                    onChange={(e) => setEditingLead({ ...editingLead, projectValueBdt: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={editingLead.contactPerson}
                    onChange={(e) => setEditingLead({ ...editingLead, contactPerson: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pipeline Stage</label>
                <select
                  value={editingLead.stage}
                  onChange={(e) => setEditingLead({ ...editingLead, stage: e.target.value as LeadStage })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-600"
                >
                  <option value="inbound">1. Inbound Dossier Request</option>
                  <option value="satellite_audit">2. 3D Satellite Audit Completed</option>
                  <option value="site_audit_scheduled">3. Drone &amp; Civil Audit Scheduled</option>
                  <option value="proposal_submitted">4. Techno-Commercial Submitted</option>
                  <option value="bank_financing">5. 4.5% Bank Debt Sanctioned</option>
                  <option value="contract_executed">6. EPC Contract Executed</option>
                  <option value="sreda_connected">7. SREDA Net-Metered</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0A1A2F] hover:bg-emerald-700 text-white font-bold transition shadow-xs cursor-pointer font-mono"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: DELETE LEAD CONFIRMATION
          ========================================================================= */}
      {deletingLeadId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 rounded-full bg-rose-100">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0A1A2F]">Delete Lead?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete lead{' '}
              <span className="font-bold text-rose-700">
                {leads.find((l) => l.id === deletingLeadId)?.factoryName}
              </span>
              ? This action will remove the lead from the active pipeline.
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingLeadId(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0A1A2F] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/30 flex items-center gap-2 text-xs font-mono animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

