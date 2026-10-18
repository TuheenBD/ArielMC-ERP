'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CompanyEntity, CurrencyRate, ProductItem } from '@/types/erp';
import {
  MarketingCampaign,
  DigitalCollateral,
  TradeShowExhibition,
  BrandIdentityAsset,
  InboundGrowthAnalytics,
  ProductSector,
  CampaignStatus
} from '@/types/marketing';
import {
  INITIAL_MARKETING_CAMPAIGNS,
  INITIAL_DIGITAL_COLLATERALS,
  INITIAL_TRADE_SHOWS,
  INITIAL_BRAND_ASSETS,
  INITIAL_GROWTH_ANALYTICS
} from '@/data/initialMarketingData';
import { ThemeProfile } from '@/components/Sidebar';
import { ArielMC } from '@/lib/brand';
import { LookbookViewerModal } from '@/components/LookbookViewerModal';
import { CreateCampaignModal } from '@/components/CreateCampaignModal';
import { LetterheadStudioModal } from '@/components/LetterheadStudioModal';
import { B2bRoiCalculatorSection } from '@/components/B2bRoiCalculatorSection';
import { MarketingStrategyPlaybookSection } from '@/components/MarketingStrategyPlaybookSection';
import { CyberSecuritySopSection } from '@/components/CyberSecuritySopSection';
import {
  Megaphone,
  BookOpen,
  Calendar,
  Globe2,
  Download,
  Share2,
  Plus,
  Eye,
  FileText,
  Search,
  Filter,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Building2,
  Tag,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Check,
  Printer,
  Copy,
  Users2,
  Calculator,
  Target
} from 'lucide-react';

interface MarketingManagementProps {
  activeEntity: CompanyEntity;
  activeCurrency: CurrencyRate;
  theme?: ThemeProfile;
  products?: ProductItem[];
  onNavigateTab?: (tab: any) => void;
}

type MarketingSubTab = 
  | 'ROI_CALCULATOR'
  | 'STRATEGY_PLAYBOOK'
  | 'CYBER_SECURITY'
  | 'CAMPAIGNS' 
  | 'COLLATERALS' 
  | 'SECTORS' 
  | 'STATIONERY' 
  | 'TRADE_SHOWS' 
  | 'ANALYTICS';

export const MarketingManagement: React.FC<MarketingManagementProps> = ({
  activeEntity,
  activeCurrency,
  theme = 'crm-green',
  products = [],
  onNavigateTab,
}) => {
  // State
  const [activeSubTab, setActiveSubTab] = useState<MarketingSubTab>('ROI_CALCULATOR');
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(INITIAL_MARKETING_CAMPAIGNS);
  const [collaterals, setCollaterals] = useState<DigitalCollateral[]>(INITIAL_DIGITAL_COLLATERALS);
  const [tradeShows] = useState<TradeShowExhibition[]>(INITIAL_TRADE_SHOWS);
  const [brandAssets] = useState<BrandIdentityAsset[]>(INITIAL_BRAND_ASSETS);
  const [analytics] = useState<InboundGrowthAnalytics>(INITIAL_GROWTH_ANALYTICS);

  // Filters
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<'ALL' | CampaignStatus>('ALL');
  const [collateralSectorFilter, setCollateralSectorFilter] = useState<ProductSector>('ALL');
  const [collateralSearchQuery, setCollateralSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals
  const [selectedCollateralForView, setSelectedCollateralForView] = useState<DigitalCollateral | null>(null);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [isLetterheadStudioOpen, setIsLetterheadStudioOpen] = useState(false);

  // Theme Helpers
  const isRoyal = theme === 'royal-blue';
  const isHeritage = theme === 'heritage-tan';
  const isCalifornia = theme === 'california-beaches';
  const isMossy = theme === 'mossy-hollow';
  const isInkWash = theme === 'ink-wash';
  const isPeach = theme === 'fresh-peach';
  const isStormy = theme === 'stormy-morning';

  const cardBg = isRoyal
    ? 'bg-[#1E293B] border-[#334155]'
    : isHeritage
    ? 'bg-[#1A3828] border-[#2C553E]'
    : isCalifornia
    ? 'bg-[#162B37] border-[#244558]'
    : isMossy
    ? 'bg-[#313521] border-[#494F32]'
    : isInkWash
    ? 'bg-[#2D3035] border-[#444850]'
    : isPeach
    ? 'bg-[#382622] border-[#523A34]'
    : isStormy
    ? 'bg-[#253240] border-[#394C61]'
    : 'bg-[#1E3B2F] border-[#2E5A47]'; // crm-green default

  const handleCopyLink = (code: string) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://www.arielmc.com'}/lookbook/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddCampaign = (newCamp: MarketingCampaign) => {
    setCampaigns((prev) => [newCamp, ...prev]);
  };

  // Filtered lists
  const filteredCampaigns = campaigns.filter((c) => {
    if (campaignStatusFilter !== 'ALL' && c.status !== campaignStatusFilter) return false;
    return true;
  });

  const filteredCollaterals = collaterals.filter((col) => {
    if (collateralSectorFilter !== 'ALL' && col.sector !== collateralSectorFilter) return false;
    if (
      collateralSearchQuery &&
      !col.title.toLowerCase().includes(collateralSearchQuery.toLowerCase()) &&
      !col.subtitle.toLowerCase().includes(collateralSearchQuery.toLowerCase()) &&
      !col.tags.some((t) => t.toLowerCase().includes(collateralSearchQuery.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* =========================================================================
          TOP EXECUTIVE COMMAND BAR: Header & KPI Summary
          ========================================================================= */}
      <div className={`p-6 rounded-2xl ${cardBg} border shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-white`}>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/30 shadow-inner">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 font-heading">
                  <ArielMC /> <span>Brand &amp; Marketing Hub</span>
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  Global Hub
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Strategic B2B campaigns, downloadable lookbooks, A4 stationery studio &amp; international trade show presence
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsLetterheadStudioOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900/90 hover:bg-slate-900 text-slate-200 border border-slate-700 shadow transition-all hover:border-[#C8A96A]"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Stationery &amp; Letterhead Studio</span>
          </button>

          <button
            onClick={() => setIsCreateCampaignOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#C8A96A] hover:bg-[#b89552] text-[#0A1A2F] shadow-lg transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Launch New Campaign</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          KEY MARKETING METRIC CARDS
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className={`p-4 rounded-xl ${cardBg} border shadow flex items-center justify-between`}>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active B2B Campaigns
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white font-mono">
                {campaigns.filter((c) => c.status === 'ACTIVE').length}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                of {campaigns.length} total
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Est. Pipeline: ${(analytics.pipelineAttributedUsd / 1000000).toFixed(2)}M
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Megaphone className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`p-4 rounded-xl ${cardBg} border shadow flex items-center justify-between`}>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Digital Lookbooks &amp; Collaterals
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white font-mono">
                {collaterals.length}
              </span>
              <span className="text-xs text-[#C8A96A] font-semibold">
                Across 5 Sectors
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {analytics.totalDownloads.toLocaleString()} Buyer Downloads
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`p-4 rounded-xl ${cardBg} border shadow flex items-center justify-between`}>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              International Expos &amp; Trade Shows
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white font-mono">
                {tradeShows.length}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                Scheduled
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Ambiente, Spring Fair, NY NOW, Reed AU
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`p-4 rounded-xl ${cardBg} border shadow flex items-center justify-between`}>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Global Sovereign Markets
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white font-mono">5 Stations</span>
              <span className="text-xs text-slate-400 font-semibold">
                UK • US • EU • AU • BD
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              In-Country Invoicing &amp; Direct Contracts
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Globe2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          NAVIGATION SUB-TABS
          ========================================================================= */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white">
        {[
          { id: 'ROI_CALCULATOR' as MarketingSubTab, label: 'B2B ROI & TCO Engine', icon: Calculator, badge: 'CFO Model' },
          { id: 'STRATEGY_PLAYBOOK' as MarketingSubTab, label: '12-Mo Strategy & Playbooks', icon: Target, badge: 'Deliverable 2' },
          { id: 'CYBER_SECURITY' as MarketingSubTab, label: 'Cyber Security & Platform SOP', icon: ShieldCheck, badge: 'SOP-SEC-2026' },
          { id: 'CAMPAIGNS' as MarketingSubTab, label: 'B2B Campaigns & Outreach', icon: Megaphone, count: campaigns.length },
          { id: 'COLLATERALS' as MarketingSubTab, label: 'Digital Collaterals & Lookbooks', icon: BookOpen, count: collaterals.length },
          { id: 'SECTORS' as MarketingSubTab, label: '5 Pride Sectors Showcase', icon: Layers },
          { id: 'STATIONERY' as MarketingSubTab, label: 'Stationery & Brand Studio', icon: FileText, badge: 'Official A4' },
          { id: 'TRADE_SHOWS' as MarketingSubTab, label: 'Global Trade Shows & Expos', icon: Calendar, count: tradeShows.length },
          { id: 'ANALYTICS' as MarketingSubTab, label: 'Growth & Inbound Analytics', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
                isActive
                  ? 'bg-[#C8A96A] text-[#0A1A2F] font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-[#0A1A2F]/20 text-[#0A1A2F]' : 'bg-slate-800 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold tracking-wider ${
                  isActive ? 'bg-[#0A1A2F] text-amber-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SUB-TAB: B2B INTERACTIVE ROI & TCO CALCULATOR (Deliverable 1 & Appendix D)
          ========================================================================= */}
      {activeSubTab === 'ROI_CALCULATOR' && (
        <B2bRoiCalculatorSection theme={theme} />
      )}

      {/* =========================================================================
          SUB-TAB: HYBRID MARKETING POLICY & 12-MONTH STRATEGY (Deliverable 2 & Appendices A–C)
          ========================================================================= */}
      {activeSubTab === 'STRATEGY_PLAYBOOK' && (
        <MarketingStrategyPlaybookSection theme={theme} />
      )}

      {/* =========================================================================
          SUB-TAB: CYBER SECURITY & CROSS-BORDER PLATFORM GOVERNANCE (SOP-SEC-2026-V1)
          ========================================================================= */}
      {activeSubTab === 'CYBER_SECURITY' && (
        <CyberSecuritySopSection
          activeEntity={activeEntity}
          activeCurrency={activeCurrency}
          theme={theme}
        />
      )}

      {/* =========================================================================
          SUB-TAB 1: CAMPAIGNS & OUTREACH
          ========================================================================= */}
      {activeSubTab === 'CAMPAIGNS' && (
        <div className="space-y-4">
          {/* Status Filter Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 px-2 font-medium">Status:</span>
              {(['ALL', 'ACTIVE', 'SCHEDULED', 'COMPLETED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setCampaignStatusFilter(st)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    campaignStatusFilter === st
                      ? 'bg-[#003B73] text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'ALL' ? 'All Campaigns' : st}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              Showing {filteredCampaigns.length} of {campaigns.length} active initiatives
            </span>
          </div>

          {/* Campaign Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCampaigns.map((camp) => {
              const leadProgress = Math.min(
                100,
                Math.round((camp.kpis.leadsAcquired / (camp.kpis.targetLeads || 1)) * 100)
              );
              const budgetProgress = Math.min(
                100,
                Math.round((camp.budget.spent / (camp.budget.planned || 1)) * 100)
              );

              return (
                <div
                  key={camp.id}
                  className={`p-5 rounded-xl ${cardBg} border shadow-lg flex flex-col justify-between space-y-4 transition-all hover:border-slate-500`}
                >
                  <div className="space-y-3">
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono font-bold text-amber-300">
                            {camp.code}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            camp.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : camp.status === 'SCHEDULED'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {camp.status}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                          {camp.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                          {camp.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Target Markets & Sectors */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Markets:</span>
                        {camp.targetMarkets.map((m, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-semibold text-slate-200 border border-slate-800">
                            {m}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 ml-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Sectors:</span>
                        {camp.targetSectors.map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-[10px] font-semibold text-amber-300 border border-amber-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bars: Leads & Budget */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Leads Acquired</span>
                          <span className="font-bold text-white font-mono">
                            {camp.kpis.leadsAcquired} / {camp.kpis.targetLeads} ({leadProgress}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full transition-all"
                            style={{ width: `${leadProgress}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Budget Spent</span>
                          <span className="font-bold text-white font-mono">
                            {camp.budget.currency} {camp.budget.spent.toLocaleString()} / {camp.budget.planned.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#C8A96A] h-full rounded-full transition-all"
                            style={{ width: `${budgetProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Channels & Deliverables preview */}
                    <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Deployment Channels
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {camp.channels.map((ch, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Dates, Manager & Quick Action */}
                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-3 text-xs">
                    <div className="text-[11px] text-slate-400">
                      <span className="font-medium text-slate-300">{camp.manager}</span>
                      <span className="block text-[10px]">
                        {camp.startDate} to {camp.endDate}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveSubTab('COLLATERALS')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#003B73] hover:bg-[#002D59] text-white text-xs font-semibold shadow transition-colors"
                    >
                      <span>View Collaterals</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: DIGITAL COLLATERALS & LOOKBOOKS
          ========================================================================= */}
      {activeSubTab === 'COLLATERALS' && (
        <div className="space-y-5">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            {/* Sector Filters */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 px-2 font-medium">Sector:</span>
              {(['ALL', 'CERAMICS', 'LEATHER', 'JUTE', 'HOME_TEXTILES', 'TERRACOTTA'] as ProductSector[]).map((sec) => (
                <button
                  key={sec}
                  onClick={() => setCollateralSectorFilter(sec)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    collateralSectorFilter === sec
                      ? 'bg-[#C8A96A] text-[#0A1A2F] font-bold shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {sec === 'ALL' ? 'All Sectors' : sec.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={collateralSearchQuery}
                onChange={(e) => setCollateralSearchQuery(e.target.value)}
                placeholder="Search lookbooks & specs..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C8A96A]"
              />
            </div>
          </div>

          {/* Lookbook Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCollaterals.map((col) => (
              <div
                key={col.id}
                className={`rounded-2xl ${cardBg} border shadow-xl overflow-hidden flex flex-col justify-between transition-all hover:border-[#C8A96A]/60 group`}
              >
                {/* Cover Image Stage */}
                <div
                  onClick={() => setSelectedCollateralForView(col)}
                  className="relative h-56 w-full cursor-pointer overflow-hidden bg-slate-950"
                  title="Click to open interactive lookbook viewer"
                >
                  <Image
                    src={col.coverImage}
                    alt={col.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/30" />

                  {/* Badges on Cover */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-mono font-bold text-amber-300 border border-white/10">
                      {col.code}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#003B73]/90 backdrop-blur text-[10px] font-bold text-white border border-blue-400/20">
                      {col.sector}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[10px] text-slate-300 border border-white/10">
                    {col.pages} Pages
                  </div>

                  {/* Hover Quick Action Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                    <div className="px-4 py-2 rounded-xl bg-[#C8A96A] text-[#0A1A2F] text-xs font-bold shadow-xl flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>Open Lookbook Viewer</span>
                    </div>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-white leading-snug group-hover:text-[#C8A96A] transition-colors">
                      {col.title}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {col.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {col.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[9.5px] bg-slate-900 text-slate-400 border border-slate-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics & Actions */}
                  <div className="pt-3 border-t border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Downloads: {col.downloadCount}</span>
                      <span>Format: {col.fileFormat} ({col.fileSize})</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setSelectedCollateralForView(col)}
                        className="col-span-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <a
                        href={col.downloadUrl}
                        download
                        className="col-span-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#C8A96A] hover:bg-[#b89552] text-[#0A1A2F] text-xs font-bold shadow transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </a>

                      <button
                        onClick={() => handleCopyLink(col.code)}
                        className="col-span-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                        title="Copy share link"
                      >
                        {copiedCode === col.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedCode === col.code ? 'Copied' : 'Share'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: 5 PRIDE SECTORS SHOWCASE
          ========================================================================= */}
      {activeSubTab === 'SECTORS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div>
              <span className="font-bold text-white text-sm block">Bangladesh Generational Pride Sectors</span>
              ArielMC manages industrial manufacturing across 5 Sovereign pillars, eliminating intermediaries and guaranteeing institutional compliance.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                sector: 'Fine Ceramics & Tableware',
                image: '/images/marketing/ceramic-catalogue-cover.jpg',
                standards: 'FDA Food Contact Safe • LFGB • Lead & Cadmium Leaching Pass',
                highlights: 'Bone China, Reactive Glaze Stoneware, High-Fire 1350°C Kilns',
                region: 'Dhamrai & Gazipur Ceramic Hub',
                filterCode: 'CERAMICS' as ProductSector
              },
              {
                sector: 'Master Leather Goods',
                image: '/images/marketing/leather-craft-artisan.jpg',
                standards: 'LWG Audited Gold/Silver • REACH Annex XVII • Zero Chrome VI',
                highlights: 'Full-Grain Cowhide, Vegetable Tanned, YKK Solid Brass, Hand-Stitched',
                region: 'Savar Tannery Estate',
                filterCode: 'LEATHER' as ProductSector
              },
              {
                sector: 'Golden Jute (Sonali Aash)',
                image: '/images/marketing/golden-jute-fiber.jpg',
                standards: '100% Biodegradable • OEKO-TEX Eco-Dyes • AZO Free',
                highlights: 'High-Density Hessian, Juco Blends, Plant-Based Waterproof Lamination',
                region: 'Faridpur & Narsingdi River Basins',
                filterCode: 'JUTE' as ProductSector
              },
              {
                sector: 'Ethical Home Textiles & Linens',
                image: '/images/marketing/textile-index.jpg',
                standards: 'GOTS Certified Organic • Sedex SMETA • BSCI Audited',
                highlights: '400TC Percale Sheeting, Waffle Weave Throws, Yarn-Dyed Napkins',
                region: 'Narsingdi Weaving Belt',
                filterCode: 'HOME_TEXTILES' as ProductSector
              },
              {
                sector: 'Architectural Terracotta & Pottery',
                image: '/images/marketing/terracotta-potter-wheel.jpg',
                standards: 'Freeze-Thaw Tested • ASTM C1167 • Non-Toxic Alluvial Clay',
                highlights: 'Hand-thrown Planters, Clay Cooking Vessels, Architectural Wall Panels',
                region: 'Dhamrai Traditional Pottery Enclave',
                filterCode: 'TERRACOTTA' as ProductSector
              },
              {
                sector: 'Global Sourcing Architecture',
                image: '/images/marketing/bangladesh-craft-hero.jpg',
                standards: 'ISO 2859-1 Level II (AQL 2.5) • In-Country Station Invoicing',
                highlights: 'Zero Intermediaries, Chittagong Sea Port (BDCGP), Air Express Hub (DAC)',
                region: 'Dhaka Headquarters & Overseas Stations',
                filterCode: 'ALL' as ProductSector
              }
            ].map((sec, idx) => (
              <div key={idx} className={`rounded-2xl ${cardBg} border shadow-xl overflow-hidden flex flex-col justify-between`}>
                <div className="relative h-48 w-full bg-slate-950">
                  <Image src={sec.image} alt={sec.sector} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/20" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-base font-bold text-white tracking-tight drop-shadow-md">
                      {sec.sector}
                    </h4>
                    <span className="text-[11px] text-amber-300 font-medium">
                      {sec.region}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Compliance</span>
                      <p className="text-[11px] text-emerald-400 font-semibold">{sec.standards}</p>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Highlights</span>
                      <p className="text-[11px] text-slate-300">{sec.highlights}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCollateralSectorFilter(sec.filterCode);
                      setActiveSubTab('COLLATERALS');
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  >
                    <span>Browse {sec.filterCode === 'ALL' ? 'All' : sec.filterCode} Lookbooks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: STATIONERY & BRAND STUDIO
          ========================================================================= */}
      {activeSubTab === 'STATIONERY' && (
        <div className="space-y-5">
          {/* Banner Promo to launch the Interactive Studio */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#003B73] via-[#0A2540] to-[#1E3B2F] border border-blue-400/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
            <div className="space-y-2">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider">
                Interactive Stationery Studio
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Calibrated 38mm Official ArielMC Letterhead &amp; Correspondence Generator
              </h3>
              <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
                Draft official executive letters, B2B wholesale proposals, and trade show invitations directly on the official A4 stationery. Export to borderless vector PDF or copy letterhead text with one click.
              </p>
            </div>

            <button
              onClick={() => setIsLetterheadStudioOpen(true)}
              className="px-5 py-3 rounded-xl bg-[#C8A96A] hover:bg-[#b89552] text-[#0A1A2F] text-xs font-bold shadow-xl transition transform active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Open Letterhead Studio</span>
            </button>
          </div>

          {/* Master Brand Assets Suite */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Official Master Brand Assets &amp; Guidelines
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brandAssets.map((asset) => (
                <div
                  key={asset.id}
                  className={`p-4 rounded-xl ${cardBg} border shadow flex flex-col justify-between space-y-3`}
                >
                  <div className="space-y-2">
                    <div className="relative h-28 w-full rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-3 overflow-hidden">
                      <Image
                        src={asset.previewImage}
                        alt={asset.title}
                        width={180}
                        height={60}
                        className="object-contain max-h-full max-w-full"
                      />
                    </div>

                    <div>
                      <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold bg-slate-900 text-amber-400 border border-slate-800">
                        {asset.format}
                      </span>
                      <h5 className="text-xs font-bold text-white mt-1 leading-snug">
                        {asset.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                        {asset.usageDescription}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{asset.fileSize}</span>
                    <a
                      href={asset.fileUrl}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#C8A96A] hover:bg-[#b89552] text-[#0A1A2F] text-xs font-bold shadow transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strict Brand Style Guide Card */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>ArielMC Mandatory Brand Capitalization &amp; Spelling Rule</span>
            </div>
            <p className="leading-relaxed">
              In all marketing collateral, web portals, print media, and email correspondence, the brand name must <strong>strictly</strong> be rendered as <ArielMC /> (Capital <strong>A</strong>, lowercase <strong>riel</strong>, capital <strong>M</strong>, capital <strong>C</strong>, zero spaces). Prohibited variants: <em>Ariel MC, Arielmc, arielmc, ARIELMC</em>.
            </p>
            <div className="flex flex-wrap gap-4 text-[11px] pt-1">
              <div><strong className="text-white">Primary Navy:</strong> <span className="font-mono text-blue-400">#003B73 / #0A1A2F</span></div>
              <div><strong className="text-white">Heritage Amber Gold:</strong> <span className="font-mono text-amber-400">#C8A96A / #EAA023</span></div>
              <div><strong className="text-white">Logo Calibration:</strong> <span className="font-mono text-emerald-400">38mm Standard Golden Ratio</span></div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 5: GLOBAL TRADE SHOWS & EXPOS
          ========================================================================= */}
      {activeSubTab === 'TRADE_SHOWS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {tradeShows.map((show) => (
              <div
                key={show.id}
                className={`p-5 rounded-2xl ${cardBg} border shadow-xl flex flex-col justify-between space-y-4`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{show.countryFlag}</span>
                        <h4 className="text-base font-black text-white font-heading">
                          {show.name}
                        </h4>
                      </div>
                      <p className="text-xs text-amber-300 font-medium mt-0.5">
                        {show.edition}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                      {show.status}
                    </span>
                  </div>

                  {/* Logistics Detail Box */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Dates &amp; Venue</span>
                      <p className="text-slate-200 font-semibold mt-0.5">{show.dates}</p>
                      <p className="text-[11px] text-slate-400">{show.venue}, {show.city}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Stand / Booth</span>
                      <p className="text-amber-400 font-semibold mt-0.5">{show.boothNumber}</p>
                      <p className="text-[11px] text-slate-400">Station Lead: {show.assignedStation}</p>
                    </div>
                  </div>

                  {/* Confirmed Meetings */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">
                        Confirmed Executive Buyer Meetings ({show.confirmedMeetings.length})
                      </span>
                      <span className="text-[11px] text-emerald-400 font-mono">
                        Target: {show.expectedBuyerVisits}+ Visitors
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {show.confirmedMeetings.map((m) => (
                        <div
                          key={m.id}
                          className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm shrink-0">{m.countryFlag}</span>
                            <div className="min-w-0">
                              <span className="font-bold text-white block truncate">
                                {m.buyerName} — {m.company}
                              </span>
                              <span className="text-[10px] text-slate-400 truncate block">
                                {m.interest}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-amber-300 font-semibold shrink-0">
                            {m.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer link to official site */}
                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Budget: {show.budget.currency} {show.budget.planned.toLocaleString()}
                  </div>

                  <a
                    href={show.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    <span>Official Exhibition Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 6: GROWTH & INBOUND ANALYTICS
          ========================================================================= */}
      {activeSubTab === 'ANALYTICS' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Regional Breakdown */}
            <div className={`p-5 rounded-2xl ${cardBg} border shadow-xl space-y-4`}>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-sky-400" />
                <span>B2B Buyer Geographic Interest Breakdown</span>
              </h4>

              <div className="space-y-3">
                {analytics.regionalInterest.map((reg, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-medium flex items-center gap-2">
                        <span>{reg.flag}</span>
                        <span>{reg.region}</span>
                      </span>
                      <span className="text-slate-300 font-mono font-bold">
                        {reg.inquiries} Inquiries ({reg.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-[#003B73] h-full rounded-full transition-all"
                        style={{ width: `${reg.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sector Lookbook Downloads */}
            <div className={`p-5 rounded-2xl ${cardBg} border shadow-xl space-y-4`}>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Sector Lookbook &amp; Spec Sheet Download Volume</span>
              </h4>

              <div className="space-y-3">
                {analytics.sectorBreakdown.map((sec, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-medium">
                        {sec.sector} Sector
                      </span>
                      <span className="text-slate-300 font-mono font-bold">
                        {sec.downloads} Downloads ({sec.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-[#C8A96A] h-full rounded-full transition-all"
                        style={{ width: `${sec.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS
          ========================================================================= */}
      <LookbookViewerModal
        isOpen={!!selectedCollateralForView}
        collateral={selectedCollateralForView}
        onClose={() => setSelectedCollateralForView(null)}
        onNavigateToSamples={() => onNavigateTab?.('RND')}
      />

      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onAddCampaign={handleAddCampaign}
      />

      <LetterheadStudioModal
        isOpen={isLetterheadStudioOpen}
        onClose={() => setIsLetterheadStudioOpen(false)}
      />

    </div>
  );
};
