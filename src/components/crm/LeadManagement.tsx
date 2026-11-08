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
} from 'lucide-react';

interface LeadManagementProps {
  leads: SolarLead[];
  onSelectLead: (lead: SolarLead) => void;
  onOpenNewLeadModal: () => void;
  onOpenTechnicalForLead: (lead: SolarLead) => void;
  onUpdateLeadStage: (leadId: string, newStage: LeadStage) => void;
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
}: LeadManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('All');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [displayMode, setDisplayMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Factory Lead</span>
          </button>
        </div>
      </div>

      {/* Main Leads Table & Detail Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-[#0A1A2F] uppercase tracking-wider">
              Industrial Rooftop Accounts ({filteredLeads.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Guaranteed Tk 10.50/kWh Buyback Tracking Active
          </span>
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
                  className="p-5 hover:bg-emerald-50/40 transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 cursor-pointer group"
                >
                  {/* Left Info: Factory, Group, Contact */}
                  <div className="flex-1 min-w-[300px]">
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
                  <div className="flex items-center gap-2 shrink-0">
                    {/* 1-Click Generate 4-Page Dossier PDF */}
                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={(e) => handleDownloadDossier(lead, e)}
                      className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Generate & Download 4-Page Executive Bespoke Dossier PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">
                        {isDownloading ? 'Building...' : 'Dossier PDF'}
                      </span>
                    </button>

                    {/* WhatsApp Quick Link */}
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Dear%20${encodeURIComponent(
                        lead.contactPerson
                      )}%2C%20Ariel%20Renewable%20Energy%20Limited%20has%20completed%20the%20${lead.estimatedCapacityKwp}kWp%20solar%20feasibility%20for%20${encodeURIComponent(
                        lead.factoryName
                      )}.%20Would%20you%20like%20to%20review%20the%204.5%25%20bank%20waterfall%3F`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 text-xs font-bold transition"
                      title="Open WhatsApp Chat with Decision Maker"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </a>

                    {/* Open Technical Control */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTechnicalForLead(lead);
                      }}
                      className="p-2 rounded-lg bg-[#0A1A2F] hover:bg-[#152a45] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Open Technical Control & Substation Specifications"
                    >
                      <Cpu className="w-3.5 h-3.5 text-[#C9A86A]" />
                      <span className="hidden sm:inline">Technical Control</span>
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
                      className="hover:bg-emerald-50/50 transition cursor-pointer"
                    >
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
                        <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            disabled={isDownloading}
                            onClick={(e) => handleDownloadDossier(lead, e)}
                            className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition"
                            title="Download 10-Page Dossier PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Dear%20${encodeURIComponent(
                              lead.contactPerson
                            )}%2C%20Ariel%20Renewable%20Energy%20Limited%20has%20completed%20the%20${lead.estimatedCapacityKwp}kWp%20solar%20feasibility%20for%20${encodeURIComponent(
                              lead.factoryName
                            )}.%20Would%20you%20like%20to%20review%20the%204.5%25%20bank%20waterfall%3F`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 transition"
                            title="WhatsApp Chat"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => onOpenTechnicalForLead(lead)}
                            className="p-1.5 rounded bg-[#0A1A2F] hover:bg-[#152a45] text-white transition"
                            title="Technical Substation SLD"
                          >
                            <Cpu className="w-3.5 h-3.5 text-[#C9A86A]" />
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
    </div>
  );
}

