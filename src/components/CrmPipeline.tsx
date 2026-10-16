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
    { id: '0 Watchlist', label: 'Watchlist', color: 'border-slate-700 bg-slate-900/40 text-slate-400' },
    { id: '1 Prospect', label: 'Qualified Prospect', color: 'border-blue-500/40 bg-blue-950/20 text-blue-300' },
    { id: '2 Contacted', label: 'Contacted / Outreach', color: 'border-amber-500/40 bg-amber-950/20 text-amber-300' },
    { id: '3 Replied', label: 'Replied / In Dialogue', color: 'border-purple-500/40 bg-purple-950/20 text-purple-300' },
    { id: '4 Sampling', label: 'Sampling / Tech Pack', color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300' },
    { id: '5 Quote Issued', label: 'Quotation / Commercials', color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300' },
    { id: '6 Closed Won', label: 'Contract Signed / Won', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' },
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'A':
        return 'bg-red-500/20 text-red-300 border-red-500/40 font-bold';
      case 'B':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-700/40 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Integration Links */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/50 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                PHASE 4: LIVE REPOSITORY SYNC
              </span>
              <span className="text-xs text-slate-400">Connected to ArielMC-CRM & ArielMC-Website</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2.5">
              <span>Global B2B Sales CRM & Buyer Directory</span>
              <span className="text-sm font-mono px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40">
                {leads.length} Verified Buyer Leads
              </span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Curated department stores, supermarket chains, lifestyle retailers, and wholesale distributors across the UK (96), Europe (57), USA (56), and Australia (45).
            </p>
          </div>

          {/* Quick Integration Launcher Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://script.google.com/macros/s/AKfycbwB14a61CTXDxtH5m-yzgqPDtSLrmtLor_z43P_SzfXLAVCeGaNWlb2PRO-E8FgTC1r/exec"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Live CRM WebApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://docs.google.com/spreadsheets/d/1BpXNvribNccFzBIKY7FlV1mVaT3c8t3Hr6xCUWVxy30/edit?gid=625671773#gid=625671773"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold shadow-sm transition-all"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Open Master Google Sheet</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://github.com/TuheenBD/ArielMC-Website"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Website Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Market Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Market Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedMarket('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedMarket === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Markets ({marketCounts.ALL})
          </button>
          <button
            onClick={() => setSelectedMarket('UK')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              selectedMarket === 'UK'
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border-slate-800'
            }`}
          >
            <span>🇬🇧 UK Market</span>
            <span className="font-mono text-[10px] px-1.5 rounded-full bg-slate-800 text-slate-200">
              {marketCounts.UK}
            </span>
          </button>
          <button
            onClick={() => setSelectedMarket('EU')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              selectedMarket === 'EU'
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border-slate-800'
            }`}
          >
            <span>🇪🇺 EU Market</span>
            <span className="font-mono text-[10px] px-1.5 rounded-full bg-slate-800 text-slate-200">
              {marketCounts.EU}
            </span>
          </button>
          <button
            onClick={() => setSelectedMarket('USA')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              selectedMarket === 'USA'
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border-slate-800'
            }`}
          >
            <span>🇺🇸 US Market</span>
            <span className="font-mono text-[10px] px-1.5 rounded-full bg-slate-800 text-slate-200">
              {marketCounts.USA}
            </span>
          </button>
          <button
            onClick={() => setSelectedMarket('AU')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              selectedMarket === 'AU'
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border-slate-800'
            }`}
          >
            <span>🇦🇺 Australia / NZ</span>
            <span className="font-mono text-[10px] px-1.5 rounded-full bg-slate-800 text-slate-200">
              {marketCounts.AU}
            </span>
          </button>
        </div>

        {/* View Switcher & Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search 254 buyer accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-white rounded-lg focus:outline-none focus:border-blue-500 w-56"
            />
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'TABLE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'KANBAN' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Filter by:</span>
        </div>

        {/* Tier */}
        <select
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-blue-500"
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
          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-blue-500"
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
          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Sourcing Interests</option>
          <option value="Jute">🌾 Jute & Natural Fibre</option>
          <option value="Leather">👞 Leather Goods</option>
          <option value="Pottery">🏺 Pottery & Ceramics</option>
          <option value="Textile">🧵 Home Textiles</option>
        </select>

        <span className="text-slate-500 ml-auto font-mono text-[11px]">
          Showing {filteredLeads.length} of {leads.length} Leads
        </span>
      </div>

      {/* View Mode: TABLE */}
      {viewMode === 'TABLE' ? (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ID & Company</th>
                <th className="py-3 px-4">Market & Country</th>
                <th className="py-3 px-4">Tier & Priority</th>
                <th className="py-3 px-4">Sourcing Focus</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Next Action</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLeads.slice(0, 50).map((lead) => {
                const flag = getMarketFlag(lead.market);
                const priorityBadge = getPriorityBadge(lead.priority);

                return (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-xs group-hover:text-blue-300 transition-colors">
                        {lead.company}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                        <span>{lead.id}</span>
                        {lead.website && (
                          <a
                            href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-0.5"
                          >
                            <span>site</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-200">
                        <span>{flag}</span>
                        <span>{lead.market}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{lead.country}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-200 font-medium">{lead.tier}</div>
                      <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded border font-mono mt-0.5 ${priorityBadge}`}>
                        Priority {lead.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-300 truncate font-medium">
                        {lead.interest || lead.focus || 'Multi-Division'}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        {lead.notes || 'Curated B2B account'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                        {lead.stage}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-300 text-[11px] line-clamp-1">
                        {lead.nextAction || 'Prepare buyer introductory lookbook'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Touches: {lead.touches} • Owner: {lead.owner || 'ArielMC'}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-medium transition-all"
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
            <div className="p-3 text-center text-xs text-slate-400 border-t border-slate-800 bg-slate-950/40">
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
                  className="flex-1 min-w-[240px] rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col max-h-[750px]"
                >
                  {/* Column Header */}
                  <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">{stg.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                      {leadsInStage.length}
                    </span>
                  </div>

                  {/* Card List */}
                  <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                    {leadsInStage.length === 0 ? (
                      <div className="p-6 text-center text-[11px] text-slate-500">No leads in stage</div>
                    ) : (
                      leadsInStage.slice(0, 20).map((l) => {
                        const flag = getMarketFlag(l.market);
                        return (
                          <div
                            key={l.id}
                            onClick={() => setSelectedLead(l)}
                            className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 cursor-pointer shadow-sm transition-all text-xs space-y-2 group"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                                {l.company}
                              </span>
                              <span className="text-sm shrink-0">{flag}</span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>{l.tier}</span>
                              <span className={`px-1.5 py-0.2 rounded border font-mono ${getPriorityBadge(l.priority)}`}>
                                Pri {l.priority}
                              </span>
                            </div>

                            {l.interest && (
                              <div className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 truncate">
                                {l.interest}
                              </div>
                            )}

                            {l.nextAction && (
                              <p className="text-[10px] text-slate-400 line-clamp-2 pt-1 border-t border-slate-800/60">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getMarketFlag(selectedLead.market)}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {selectedLead.id}
                  </span>
                  <span className="text-xs text-slate-400">{selectedLead.market} • {selectedLead.country}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.2 rounded border ${getPriorityBadge(selectedLead.priority)}`}>
                    Priority {selectedLead.priority}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5">{selectedLead.company}</h2>
                <div className="text-xs text-slate-400 mt-0.5">Tier: {selectedLead.tier} • Channel: {selectedLead.channel}</div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] text-xs">
              {/* Contact Information */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="font-semibold text-slate-200 block text-[11px] uppercase tracking-wider">
                  Buyer Contact & Channels
                </span>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Contact Person / Department</span>
                    <span className="font-medium text-white">{selectedLead.contact || 'Commercial / Sourcing Office'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Telephone</span>
                    <span className="font-mono text-slate-200">{selectedLead.phone || 'Available via corporate switchboard'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Official Website</span>
                    {selectedLead.website ? (
                      <a
                        href={selectedLead.website.startsWith('http') ? selectedLead.website : `https://${selectedLead.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span className="truncate max-w-[180px]">{selectedLead.website}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-slate-500">Not specified</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Sourcing Interest</span>
                    <span className="font-medium text-amber-300">{selectedLead.interest || selectedLead.focus || 'Consolidated Program'}</span>
                  </div>
                </div>
              </div>

              {/* Next Action & Merchandising Notes */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="font-semibold text-slate-200 block text-[11px] uppercase tracking-wider">
                  Next Action & Sourcing Brief
                </span>
                <p className="text-slate-200 text-xs font-medium leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  {selectedLead.nextAction || 'Prepare buyer introductory lookbook & technical catalog.'}
                </p>

                {selectedLead.notes && (
                  <div className="pt-2">
                    <span className="text-slate-400 text-[10px] block mb-1">Account History & Strategic Notes</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{selectedLead.notes}</p>
                  </div>
                )}
              </div>

              {/* Stage Transition */}
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-2">
                <span className="font-semibold text-blue-300 block text-[11px] uppercase tracking-wider">
                  Advance Deal Pipeline Stage
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {stages.map((stg) => (
                    <button
                      key={stg.id}
                      onClick={() => handleStageChange(selectedLead.id, stg.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                        selectedLead.stage === stg.id
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm ring-1 ring-blue-500/50'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800'
                      }`}
                    >
                      {stg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <span className="text-slate-400 text-xs">
                Account Owner: <strong className="text-white">{selectedLead.owner || 'ArielMC Merchandiser'}</strong>
              </span>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
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
