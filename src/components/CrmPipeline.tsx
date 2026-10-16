'use client';

import React, { useState, useMemo } from 'react';
import { CrmLead } from '@/types/erp';
import {
  Users2,
  ExternalLink,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  Globe2,
  Phone,
  Mail,
  Building,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Clock,
  Briefcase,
  AlertCircle,
  X,
  Plus
} from 'lucide-react';

interface CrmPipelineProps {
  initialLeads: CrmLead[];
}

export const CrmPipeline: React.FC<CrmPipelineProps> = ({ initialLeads }) => {
  const [leads, setLeads] = useState<CrmLead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedInterest, setSelectedInterest] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('TABLE');
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        searchQuery === '' ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.contact && lead.contact.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.notes && lead.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.nextAction && lead.nextAction.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMarket = selectedMarket === 'ALL' || lead.market === selectedMarket;
      const matchesTier = selectedTier === 'ALL' || lead.tier === selectedTier;
      const matchesPriority = selectedPriority === 'ALL' || lead.priority === selectedPriority;
      const matchesInterest =
        selectedInterest === 'ALL' ||
        (lead.interest && lead.interest.toLowerCase().includes(selectedInterest.toLowerCase())) ||
        (lead.focus && lead.focus.toLowerCase().includes(selectedInterest.toLowerCase()));

      return matchesSearch && matchesMarket && matchesTier && matchesPriority && matchesInterest;
    });
  }, [leads, searchQuery, selectedMarket, selectedTier, selectedPriority, selectedInterest]);

  // Market Counts
  const marketCounts = useMemo(() => {
    return {
      ALL: leads.length,
      UK: leads.filter((l) => l.market === 'UK').length,
      EU: leads.filter((l) => l.market === 'EU').length,
      USA: leads.filter((l) => l.market === 'USA').length,
      AU: leads.filter((l) => l.market === 'AU').length,
    };
  }, [leads]);

  // Stage Categories for Kanban
  const stages = [
    { id: '0 Watchlist', label: 'Watchlist', color: 'border-[#D5DEE7] bg-[#EEF2F6] text-[#475569]' },
    { id: '1 Prospect', label: 'Qualified Prospect', color: 'border-[#C5D7ED] bg-[#E8F0FA] text-[#17456F]' },
    { id: '2 Contacted', label: 'Contacted / Outreach', color: 'border-[#FBE3B0] bg-[#FEF6E4] text-[#7A5508]' },
    { id: '3 Replied', label: 'Replied / In Dialogue', color: 'border-[#D6C7EC] bg-[#EDE7F6] text-[#4A2E7A]' },
    { id: '4 Sampling', label: 'Sampling / Tech Pack', color: 'border-[#BAE6FD] bg-[#E0F2FE] text-[#0369A1]' },
    { id: '5 Quote Issued', label: 'Quotation / Commercials', color: 'border-[#C7D2FE] bg-[#EEF2FF] text-[#3730A3]' },
    { id: '6 Closed Won', label: 'Contract Signed / Won', color: 'border-[#BBE3C7] bg-[#E4F3E9] text-[#14512C]' },
  ];

  // Helper to change stage
  const handleStageChange = (leadId: string, newStage: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage, touches: l.touches + 1 } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, stage: newStage, touches: prev.touches + 1 } : null));
    }
  };

  const getMarketFlag = (market: string) => {
    switch (market) {
      case 'UK':
        return '🇬🇧';
      case 'EU':
        return '🇪🇺';
      case 'USA':
        return '🇺🇸';
      case 'AU':
        return '🇦🇺';
      default:
        return '🌐';
    }
  };

  // Market badge styling matching CRM index.html
  const getMarketBadge = (market: string) => {
    switch (market) {
      case 'UK':
        return 'bg-[#E8F0FA] text-[#17456F] border-[#C5D7ED]';
      case 'EU':
        return 'bg-[#EDE7F6] text-[#4A2E7A] border-[#D6C7EC]';
      case 'USA':
        return 'bg-[#E4F3E9] text-[#14512C] border-[#BBE3C7]';
      case 'AU':
        return 'bg-[#FDECE2] text-[#8A4415] border-[#F6CBB0]';
      default:
        return 'bg-[#F0F4F1] text-[#1A1A1A] border-[#DDE3DD]';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'A':
        return 'bg-[#FDEAEA] text-[#8A1515] border-[#F7C0C0] font-bold';
      case 'B':
        return 'bg-[#FEF6E4] text-[#7A5508] border-[#FBE3B0] font-semibold';
      default:
        return 'bg-[#EEF2F6] text-[#475569] border-[#D5DEE7]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Integration Links */}
      <div className="rounded-2xl bg-white border border-[#DDE3DD] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] font-bold">
                PHASE 4: LIVE REPOSITORY SYNC
              </span>
              <span className="text-xs text-[#6B7269]">Connected to ArielMC-CRM & ArielMC-Website</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-[#1F3A2E] mt-1 flex items-center gap-2.5">
              <span>Global B2B Sales CRM & Buyer Directory</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#E8F0FA] text-[#17456F] border border-[#C5D7ED] font-bold">
                {leads.length} Verified Buyer Accounts
              </span>
            </h1>
            <p className="text-xs text-[#6B7269] mt-1 max-w-2xl leading-relaxed">
              Curated department stores, supermarket chains, lifestyle retailers, and wholesale distributors across the UK (96), Europe (57), USA (56), and Australia (45).
            </p>
          </div>

          {/* Quick Integration Launcher Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://script.google.com/macros/s/AKfycbwB14a61CTXDxtH5m-yzgqPDtSLrmtLor_z43P_SzfXLAVCeGaNWlb2PRO-E8FgTC1r/exec"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF5EC] hover:bg-[#F3EAD7] text-[#8A6D3B] border border-[#C8A96A] text-xs font-bold shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Launch Live CRM WebApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://docs.google.com/spreadsheets/d/1BpXNvribNccFzBIKY7FlV1mVaT3c8t3Hr6xCUWVxy30/edit?gid=625671773#gid=625671773"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E4F3E9] hover:bg-[#D4EBD9] text-[#14512C] border border-[#BBE3C7] text-xs font-bold shadow-sm transition-all"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Open Master Google Sheet</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://github.com/TuheenBD/ArielMC-Website"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#F0F4F1] text-[#1F3A2E] border border-[#DDE3DD] text-xs font-semibold shadow-sm transition-all"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Website Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Market Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DDE3DD] pb-4">
        {/* Market Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedMarket('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedMarket === 'ALL'
                ? 'bg-[#1F3A2E] text-white shadow-sm'
                : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border border-[#DDE3DD]'
            }`}
          >
            All Markets ({marketCounts.ALL})
          </button>
          <button
            onClick={() => setSelectedMarket('UK')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              selectedMarket === 'UK'
                ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-sm'
                : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border-[#DDE3DD]'
            }`}
          >
            <span>🇬🇧 UK Market</span>
            <span className={`font-mono text-[10px] px-1.5 rounded-full ${selectedMarket === 'UK' ? 'bg-white/20 text-white' : 'bg-[#E8F0FA] text-[#17456F]'}`}>
              {marketCounts.UK}
            </span>
          </button>
          <button
            onClick={() => setSelectedMarket('EU')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              selectedMarket === 'EU'
                ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-sm'
                : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border-[#DDE3DD]'
            }`}
          >
            <span>🇪🇺 EU Market</span>
            <span className={`font-mono text-[10px] px-1.5 rounded-full ${selectedMarket === 'EU' ? 'bg-white/20 text-white' : 'bg-[#EDE7F6] text-[#4A2E7A]'}`}>
              {marketCounts.EU}
            </span>
          </button>
          <button
            onClick={() => setSelectedMarket('USA')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              selectedMarket === 'USA'
                ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-sm'
                : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border-[#DDE3DD]'
            }`}
          >
            <span>🇺🇸 US Market</span>
            <span className={`font-mono text-[10px] px-1.5 rounded-full ${selectedMarket === 'USA' ? 'bg-white/20 text-white' : 'bg-[#E4F3E9] text-[#14512C]'}`}>
              {marketCounts.USA}
            </span>
          </button>
          <button
            onClick={() => setSelectedMarket('AU')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              selectedMarket === 'AU'
                ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-sm'
                : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border-[#DDE3DD]'
            }`}
          >
            <span>🇦🇺 Australia / NZ</span>
            <span className={`font-mono text-[10px] px-1.5 rounded-full ${selectedMarket === 'AU' ? 'bg-white/20 text-white' : 'bg-[#FDECE2] text-[#8A4415]'}`}>
              {marketCounts.AU}
            </span>
          </button>
        </div>

        {/* View Switcher & Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7269]" />
            <input
              type="text"
              placeholder="Search 254 buyer accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-white border border-[#DDE3DD] text-xs text-[#1A1A1A] rounded-lg focus:outline-none focus:border-[#1F3A2E] w-56 shadow-sm"
            />
          </div>

          <div className="flex items-center bg-white border border-[#DDE3DD] rounded-lg p-0.5 text-xs shadow-sm">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md font-semibold transition-colors ${
                viewMode === 'TABLE' ? 'bg-[#1F3A2E] text-white shadow-sm' : 'text-[#6B7269] hover:text-[#1A1A1A]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md font-semibold transition-colors ${
                viewMode === 'KANBAN' ? 'bg-[#1F3A2E] text-white shadow-sm' : 'text-[#6B7269] hover:text-[#1A1A1A]'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs bg-white p-3 rounded-xl border border-[#DDE3DD] shadow-sm">
        <div className="flex items-center gap-1.5 text-[#6B7269] font-medium">
          <Filter className="w-3.5 h-3.5 text-[#1F3A2E]" />
          <span>Filter by:</span>
        </div>

        {/* Tier */}
        <select
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
          className="bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg px-2.5 py-1 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
        >
          <option value="ALL">All Buyer Tiers (Wholesaler, Retailer, Agent)</option>
          <option value="Wholesaler">Wholesaler (151 accounts)</option>
          <option value="Retailer">Retailer (58 accounts)</option>
          <option value="Sales agent">Sales Agent (45 accounts)</option>
        </select>

        {/* Priority */}
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg px-2.5 py-1 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
        >
          <option value="ALL">All Priorities (A / B / C)</option>
          <option value="A">Priority A (High Potential)</option>
          <option value="B">Priority B (Medium)</option>
          <option value="C">Priority C (Standard)</option>
        </select>

        {/* Sector Interest */}
        <select
          value={selectedInterest}
          onChange={(e) => setSelectedInterest(e.target.value)}
          className="bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg px-2.5 py-1 text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
        >
          <option value="ALL">All Sourcing Interests</option>
          <option value="Jute">🌾 Jute & Natural Fibre</option>
          <option value="Leather">👞 Leather Goods</option>
          <option value="Pottery">🏺 Pottery & Ceramics</option>
          <option value="Textile">🧵 Home Textiles</option>
        </select>

        <span className="text-[#6B7269] ml-auto font-mono text-[11px] font-medium">
          Showing {filteredLeads.length} of {leads.length} Leads
        </span>
      </div>

      {/* View Mode: TABLE */}
      {viewMode === 'TABLE' ? (
        <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
          <table className="w-full text-left text-xs text-[#1A1A1A]">
            <thead className="bg-[#1F3A2E] text-white uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-heading">ID & Company</th>
                <th className="py-3.5 px-4 font-heading">Market & Country</th>
                <th className="py-3.5 px-4 font-heading">Tier & Priority</th>
                <th className="py-3.5 px-4 font-heading">Sourcing Focus</th>
                <th className="py-3.5 px-4 font-heading">Current Stage</th>
                <th className="py-3.5 px-4 font-heading">Next Action</th>
                <th className="py-3.5 px-4 font-heading text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE3DD]">
              {filteredLeads.slice(0, 50).map((lead) => {
                const flag = getMarketFlag(lead.market);
                const priorityBadge = getPriorityBadge(lead.priority);
                const marketBadge = getMarketBadge(lead.market);

                return (
                  <tr
                    key={lead.id}
                    className="hover:bg-[#F7FAF8] transition-colors group cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1F3A2E] text-xs group-hover:text-[#8A6D3B] transition-colors">
                        {lead.company}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#6B7269] font-mono">
                        <span>{lead.id}</span>
                        {lead.website && (
                          <a
                            href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#1F5FA8] hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>site</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-[#1A1A1A]">
                        <span>{flag}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${marketBadge}`}>
                          {lead.market}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6B7269] mt-0.5">{lead.country}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-[#1A1A1A] font-medium">{lead.tier}</div>
                      <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded border font-mono mt-0.5 ${priorityBadge}`}>
                        Priority {lead.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-[#1A1A1A] truncate font-medium">
                        {lead.interest || lead.focus || 'Multi-Division'}
                      </div>
                      <div className="text-[10px] text-[#6B7269] truncate max-w-[200px]">
                        {lead.notes || 'Curated B2B account'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F0F4F1] text-[#1F3A2E] border border-[#DDE3DD] font-medium">
                        {lead.stage}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-[#1A1A1A] text-[11px] line-clamp-1 font-medium">
                        {lead.nextAction || 'Prepare buyer introductory lookbook'}
                      </div>
                      <div className="text-[10px] text-[#6B7269] font-mono">
                        Touches: {lead.touches} • Owner: {lead.owner || 'ArielMC'}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-2.5 py-1 rounded bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredLeads.length > 50 && (
            <div className="p-3 text-center text-xs text-[#6B7269] border-t border-[#DDE3DD] bg-[#F8FAF8]">
              Showing top 50 leads of {filteredLeads.length}. Use the filters or search bar to view specific accounts.
            </div>
          )}
        </div>
      ) : (
        /* View Mode: KANBAN PIPELINE */
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1400px]">
            {stages.map((stg) => {
              const leadsInStage = filteredLeads.filter((l) => l.stage.includes(stg.label) || l.stage === stg.id);

              return (
                <div
                  key={stg.id}
                  className="flex-1 min-w-[240px] rounded-xl bg-[#F4F6F4] border border-[#DDE3DD] flex flex-col max-h-[750px] shadow-sm"
                >
                  {/* Column Header */}
                  <div className="p-3 border-b border-[#DDE3DD] bg-[#E8EDE8] flex items-center justify-between rounded-t-xl">
                    <span className="font-bold text-xs text-[#1F3A2E] font-heading">{stg.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#1F3A2E] font-bold border border-[#DDE3DD]">
                      {leadsInStage.length}
                    </span>
                  </div>

                  {/* Card List */}
                  <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1">
                    {leadsInStage.length === 0 ? (
                      <div className="p-6 text-center text-[11px] text-[#6B7269]">No leads in stage</div>
                    ) : (
                      leadsInStage.slice(0, 20).map((l) => {
                        const flag = getMarketFlag(l.market);
                        const priorityBadge = getPriorityBadge(l.priority);
                        const marketBadge = getMarketBadge(l.market);

                        return (
                          <div
                            key={l.id}
                            onClick={() => setSelectedLead(l)}
                            className="p-3 rounded-lg bg-white border border-[#DDE3DD] hover:border-[#C8A96A] cursor-pointer shadow-sm hover:shadow-md transition-all text-xs space-y-2 group"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-[#1F3A2E] group-hover:text-[#8A6D3B] transition-colors line-clamp-1">
                                {l.company}
                              </span>
                              <span className="text-sm shrink-0">{flag}</span>
                            </div>

                            <div className="flex items-center justify-between text-[10px]">
                              <span className={`px-1.5 py-0.2 rounded border font-semibold ${marketBadge}`}>{l.market} • {l.tier}</span>
                              <span className={`px-1.5 py-0.2 rounded border font-mono ${priorityBadge}`}>
                                Pri {l.priority}
                              </span>
                            </div>

                            {l.interest && (
                              <div className="text-[10px] px-1.5 py-0.5 rounded bg-[#F8FAF8] text-[#1A1A1A] border border-[#DDE3DD] truncate">
                                {l.interest}
                              </div>
                            )}

                            {l.nextAction && (
                              <p className="text-[10px] text-[#6B7269] line-clamp-2 pt-1 border-t border-[#DDE3DD]">
                                {l.nextAction}
                              </p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b-[3px] border-[#C8A96A] bg-[#1F3A2E] text-white flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getMarketFlag(selectedLead.market)}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/20 text-white font-bold border border-white/30">
                    {selectedLead.id}
                  </span>
                  <span className="text-xs text-[#CFE0D5]">{selectedLead.market} • {selectedLead.country}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.2 rounded border ${getPriorityBadge(selectedLead.priority)}`}>
                    Priority {selectedLead.priority}
                  </span>
                </div>
                <h2 className="text-xl font-bold font-heading text-white mt-1.5">{selectedLead.company}</h2>
                <div className="text-xs text-[#CFE0D5] mt-0.5">Tier: {selectedLead.tier} • Channel: {selectedLead.channel}</div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg bg-[#2C5240] text-white hover:bg-[#3A6B54] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] text-xs text-[#1A1A1A]">
              {/* Contact Information */}
              <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-2">
                <span className="font-semibold text-[#1F3A2E] block text-[11px] uppercase tracking-wider font-heading">
                  Buyer Contact & Channels
                </span>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[#6B7269] text-[10px] block">Contact Person / Department</span>
                    <span className="font-medium text-[#1A1A1A]">{selectedLead.contact || 'Commercial / Sourcing Office'}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7269] text-[10px] block">Telephone</span>
                    <span className="font-mono text-[#1A1A1A]">{selectedLead.phone || 'Available via corporate switchboard'}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7269] text-[10px] block">Official Website</span>
                    {selectedLead.website ? (
                      <a
                        href={selectedLead.website.startsWith('http') ? selectedLead.website : `https://${selectedLead.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1F5FA8] hover:underline flex items-center gap-1 font-medium"
                      >
                        <span className="truncate max-w-[180px]">{selectedLead.website}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-[#6B7269]">Not specified</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[#6B7269] text-[10px] block">Sourcing Interest</span>
                    <span className="font-medium text-[#8A6D3B]">{selectedLead.interest || selectedLead.focus || 'Consolidated Program'}</span>
                  </div>
                </div>
              </div>

              {/* Next Action & Merchandising Notes */}
              <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-2">
                <span className="font-semibold text-[#1F3A2E] block text-[11px] uppercase tracking-wider font-heading">
                  Next Action & Sourcing Brief
                </span>
                <p className="text-[#1A1A1A] text-xs font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-[#DDE3DD]">
                  {selectedLead.nextAction || 'Prepare buyer introductory lookbook & technical catalog.'}
                </p>

                {selectedLead.notes && (
                  <div className="pt-2">
                    <span className="text-[#6B7269] text-[10px] block mb-1">Account History & Strategic Notes</span>
                    <p className="text-[#1A1A1A] text-xs leading-relaxed">{selectedLead.notes}</p>
                  </div>
                )}
              </div>

              {/* Stage Transition */}
              <div className="p-4 rounded-xl bg-[#FAF5EC] border border-[#C8A96A] space-y-2">
                <span className="font-semibold text-[#8A6D3B] block text-[11px] uppercase tracking-wider font-heading">
                  Advance Deal Pipeline Stage
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {stages.map((stg) => (
                    <button
                      key={stg.id}
                      onClick={() => handleStageChange(selectedLead.id, stg.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                        selectedLead.stage === stg.id
                          ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-sm'
                          : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border-[#DDE3DD]'
                      }`}
                    >
                      {stg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#DDE3DD] bg-[#F8FAF8] flex items-center justify-between">
              <span className="text-[#6B7269] text-xs">
                Account Owner: <strong className="text-[#1F3A2E]">{selectedLead.owner || 'ArielMC Merchandiser'}</strong>
              </span>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white font-semibold text-xs shadow-sm transition-colors"
              >
                Close Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
