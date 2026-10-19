'use client';

import React from 'react';
import { CompanyEntity, EntityCode, CurrencyRate } from '@/types/erp';
import { ActiveTab, ThemeProfile } from '@/components/Sidebar';
import {
  Globe2,
  Package,
  Factory,
  Users2,
  Building2,
  FolderLock,
  FlaskConical,
  Repeat,
  Ship,
  Boxes,
  Landmark,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Clock,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  ExternalLink
} from 'lucide-react';

interface ExecutiveDashboardProps {
  companies: CompanyEntity[];
  activeEntity: CompanyEntity;
  onSelectEntity: (code: EntityCode) => void;
  totalProducts: number;
  totalFactories: number;
  totalLeads: number;
  totalOrders: number;
  onNavigate: (tab: ActiveTab) => void;
  theme?: ThemeProfile;
  activeCurrency: CurrencyRate;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  companies,
  activeEntity,
  onSelectEntity,
  totalProducts,
  totalFactories,
  totalLeads,
  totalOrders,
  onNavigate,
  theme = 'crm-green',
  activeCurrency,
}) => {
  // Theme color accents
  const isRoyalBlue = theme === 'royal-blue';
  const isHeritageTan = theme === 'heritage-tan';
  const isCalifornia = theme === 'california-beaches';
  const isMossy = theme === 'mossy-hollow';
  const isInkWash = theme === 'ink-wash';
  const isPeach = theme === 'fresh-peach';
  const isStormy = theme === 'stormy-morning';

  const headerAccent = isRoyalBlue
    ? 'text-[#64B5F6]'
    : isCalifornia
    ? 'text-[#FFC067]'
    : isMossy
    ? 'text-[#D4DE95]'
    : isInkWash
    ? 'text-[#6D8196]'
    : isPeach
    ? 'text-[#E39A7B]'
    : isStormy
    ? 'text-[#88BDF2]'
    : isHeritageTan
    ? 'text-[#C8A96A]'
    : 'text-[#C8A96A]';

  const cardHoverBorder = isRoyalBlue
    ? 'hover:border-[#1E3A8A]'
    : isCalifornia
    ? 'hover:border-[#66C4FF]'
    : isMossy
    ? 'hover:border-[#636B2F]'
    : isInkWash
    ? 'hover:border-[#6D8196]'
    : isPeach
    ? 'hover:border-[#E39A7B]'
    : isStormy
    ? 'hover:border-[#6A89A7]'
    : isHeritageTan
    ? 'hover:border-[#A27B5C]'
    : 'hover:border-[#2C5240]';

  const bannerBg = isRoyalBlue
    ? 'bg-gradient-to-r from-[#0B132B] via-[#0F172A] to-[#0B132B] border-[#1E293B]'
    : isCalifornia
    ? 'bg-gradient-to-r from-[#101C24] via-[#14232C] to-[#101C24] border-[#203642]'
    : isMossy
    ? 'bg-gradient-to-r from-[#1B1D12] via-[#282B1B] to-[#1B1D12] border-[#3D4127]'
    : isInkWash
    ? 'bg-gradient-to-r from-[#17191B] via-[#24272A] to-[#17191B] border-[#363A3F]'
    : isPeach
    ? 'bg-gradient-to-r from-[#1D1412] via-[#2A1D1A] to-[#1D1412] border-[#422E29]'
    : isStormy
    ? 'bg-gradient-to-r from-[#141B21] via-[#1E2730] to-[#141B21] border-[#2E3C4A]'
    : isHeritageTan
    ? 'bg-gradient-to-r from-[#11231A] via-[#183124] to-[#11231A] border-[#2A4837]'
    : 'bg-gradient-to-r from-[#12231B] via-[#1F3A2E] to-[#12231B] border-[#2C5240]';

  // Quick launch modules for ArielMC ERP
  const quickModules = [
    {
      tab: 'REPORTS' as ActiveTab,
      title: 'Executive Reports Suite',
      phase: 'Executive Suite (Live)',
      description: 'Formal enterprise reporting engine: B2B P&L Statements, Daily Cashflow, Consignments, Audits & Print/CSV exports.',
      icon: BarChart3,
      badge: 'Executive',
      color: 'text-amber-700',
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
    },
    {
      tab: 'STATIONS' as ActiveTab,
      title: 'Multi-Entity Stations',
      phase: 'Foundation (Live)',
      description: '5 Sovereign operating stations (BD, UK, US, EU, AU) with local banking, AD Dealer mandates, and legal compliance.',
      icon: Building2,
      badge: '5 Stations',
      color: 'text-[#1F5FA8]',
      bg: 'bg-blue-50/70',
      border: 'border-blue-200',
    },
    {
      tab: 'DOCUMENTS' as ActiveTab,
      title: 'Document Portal',
      phase: 'Statutory Hub',
      description: '27 statutory certificates, RJSC corporate dossiers, 34-point BD launch matrix, and 7-day automated expiration alerts.',
      icon: FolderLock,
      badge: '27 Archived',
      color: 'text-[#8A6D3B]',
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
    },
    {
      tab: 'PRODUCTS' as ActiveTab,
      title: 'Sector Product Master',
      phase: 'Foundation (Live)',
      description: 'Centralized product catalogue covering Leather, Jute, Textiles, and Ceramics with multi-tier BOM costing.',
      icon: Package,
      badge: `${totalProducts} SKUs`,
      color: 'text-[#1E6B3A]',
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
    },
    {
      tab: 'CRM' as ActiveTab,
      title: 'Global CRM & B2B Leads',
      phase: 'CRM Suite (Live)',
      description: '254 qualified buyer accounts across UK, EU, USA, and Australia with stage pipeline and communication logs.',
      icon: Users2,
      badge: `${totalLeads} Leads`,
      color: 'text-[#7B1FA2]',
      bg: 'bg-purple-50/70',
      border: 'border-purple-200',
    },
    {
      tab: 'FINANCE' as ActiveTab,
      title: 'Global Multi-Station Finance',
      phase: 'Phase 8 (Live)',
      description: 'Multi-currency ledger, Bangladesh Bank FE Circular 48/31 ERQ desk, FX forward hedging, and consolidated 10k P&L.',
      icon: Landmark,
      badge: '10k P&L Live',
      color: 'text-emerald-800',
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
    },
    {
      tab: 'FACTORIES' as ActiveTab,
      title: 'BD Factory & Compliance',
      phase: 'Phase 2 (Live)',
      description: '8 Tier-1 Bangladesh manufacturing facilities audited across Savar, Gazipur, Narsingdi, and Dhamrai.',
      icon: Factory,
      badge: `${totalFactories} Facilities`,
      color: 'text-[#8A5A00]',
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
    },
    {
      tab: 'RND' as ActiveTab,
      title: 'R&D, Tech Packs & Sampling',
      phase: 'Phase 3 (Live)',
      description: 'Sample Development Orders (SDOs), lab dips, proto approvals, and golden seal approvals with direct factory dispatch.',
      icon: FlaskConical,
      badge: '8 SDOs',
      color: 'text-teal-700',
      bg: 'bg-teal-50/70',
      border: 'border-teal-200',
    },
    {
      tab: 'ORDERS' as ActiveTab,
      title: 'Two-Way Order Management',
      phase: 'Phase 5 (Live)',
      description: 'Back-to-back PO mirror architecture linking Harrods, M&S, and Ralph Lauren with BD partner factories.',
      icon: Repeat,
      badge: `${totalOrders} Orders`,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-200',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Executive Command Banner */}
      <div className={`p-6 md:p-8 rounded-2xl ${bannerBg} text-white shadow-lg border relative overflow-hidden`}>
        {/* Subtle decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#C8A96A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A] text-[#12231B] text-[10px] font-bold font-mono tracking-wider uppercase">
                Executive Command Center
              </span>
              <span className="text-xs text-gray-300 font-mono flex items-baseline gap-0.5">
                <span className="text-white font-bold">ArielMC</span><sup className="text-[0.65em] font-bold text-[#C8A96A]">™</sup>
                <span className="text-gray-300 ml-0.5">Enterprise Resource Planning System</span>
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold font-heading tracking-tight text-white flex items-center gap-2.5">
              <span>Sovereign Operations &amp; Enterprise Dashboard</span>
            </h2>

            <p className="text-xs md:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Real-time executive oversight across 5 sovereign operating stations, Bangladesh manufacturing partners, international wholesale buyer pipelines, and cross-border commercial execution.
            </p>
          </div>

          {/* Active Operating Station Quick Badge & Clock */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 shrink-0 md:min-w-[240px]">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-gray-300">Active Station:</span>
              <span className="px-2 py-0.5 rounded bg-[#C8A96A]/20 text-[#C8A96A] font-mono text-[10px] font-bold border border-[#C8A96A]/30">
                {activeEntity.code}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeEntity.flag}</span>
              <div>
                <h4 className="font-bold text-white text-xs leading-tight">
                  {activeEntity.legalName}
                </h4>
                <p className="text-[10px] text-gray-300">
                  {activeEntity.city} Hub &bull; Currency: <span className="font-mono font-bold text-[#C8A96A]">{activeEntity.baseCurrency}</span>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-300 font-mono">
              <span>Base FX: 1 {activeCurrency.code}</span>
              <span className="text-emerald-400 font-bold">● Network Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE 4 KEY KPI CARDS (Moved here from all pages) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Operating Stations */}
        <div
          onClick={() => onNavigate('STATIONS')}
          className={`p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm hover:shadow-md transition-all cursor-pointer group ${cardHoverBorder}`}
        >
          <div className="flex items-center justify-between text-[#6B7269] text-xs font-semibold uppercase tracking-wider">
            <span className="group-hover:text-[#1F5FA8] transition-colors">Operating Stations</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#1F5FA8] group-hover:scale-110 transition-transform">
              <Globe2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#1F3A2E] mt-1.5 flex items-baseline gap-1.5">
            <span>5</span>
            <span className="text-xs text-[#6B7269] font-sans font-normal">Entities</span>
          </div>
          <div className="text-[11px] text-[#6B7269] mt-1.5 flex items-center gap-1 font-mono">
            <span>🇧🇩 BD, 🇬🇧 UK, 🇺🇸 US, 🇪🇺 EU, 🇦🇺 AU</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-[#1F5FA8] font-bold group-hover:translate-x-0.5 transition-transform">
            <span>Manage Stations &amp; Banking</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 2: Master Product SKUs */}
        <div
          onClick={() => onNavigate('PRODUCTS')}
          className={`p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm hover:shadow-md transition-all cursor-pointer group ${cardHoverBorder}`}
        >
          <div className="flex items-center justify-between text-[#6B7269] text-xs font-semibold uppercase tracking-wider">
            <span className="group-hover:text-[#1E6B3A] transition-colors">Master Product SKUs</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[#1E6B3A] group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#1E6B3A] mt-1.5 flex items-baseline gap-1.5">
            <span>{totalProducts}</span>
            <span className="text-xs text-[#6B7269] font-sans font-normal">Registered</span>
          </div>
          <div className="text-[11px] text-[#1E6B3A] mt-1.5 flex items-center gap-1 font-medium">
            <span>Leather, Jute, Textiles, Ceramics</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-[#1E6B3A] font-bold group-hover:translate-x-0.5 transition-transform">
            <span>View Product Catalog &amp; BOM</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 3: Partner Factories */}
        <div
          onClick={() => onNavigate('FACTORIES')}
          className={`p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm hover:shadow-md transition-all cursor-pointer group ${cardHoverBorder}`}
        >
          <div className="flex items-center justify-between text-[#6B7269] text-xs font-semibold uppercase tracking-wider">
            <span className="group-hover:text-[#8A5A00] transition-colors">Partner Factories</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-[#8A5A00] group-hover:scale-110 transition-transform">
              <Factory className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#8A5A00] mt-1.5 flex items-baseline gap-1.5">
            <span>{totalFactories}</span>
            <span className="text-xs text-[#6B7269] font-sans font-normal">Facilities</span>
          </div>
          <div className="text-[11px] text-[#6B7269] mt-1.5">
            <span>Savar, Gazipur, Narsingdi, Dhamrai</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-[#8A5A00] font-bold group-hover:translate-x-0.5 transition-transform">
            <span>Audit Records &amp; Compliance</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 4: Global B2B Leads */}
        <div
          onClick={() => onNavigate('CRM')}
          className={`p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm hover:shadow-md transition-all cursor-pointer group ${cardHoverBorder}`}
        >
          <div className="flex items-center justify-between text-[#6B7269] text-xs font-semibold uppercase tracking-wider">
            <span className="group-hover:text-[#7B1FA2] transition-colors">Global B2B Leads</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-[#7B1FA2] group-hover:scale-110 transition-transform">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#7B1FA2] mt-1.5 flex items-baseline gap-1.5">
            <span>{totalLeads}</span>
            <span className="text-xs text-[#6B7269] font-sans font-normal">Accounts</span>
          </div>
          <div className="text-[11px] text-[#6B7269] mt-1.5 font-mono">
            <span>UK (96), EU (57), USA (56), AU (45)</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-[#7B1FA2] font-bold group-hover:translate-x-0.5 transition-transform">
            <span>Open Commercial CRM Pipeline</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* 3. Sovereign Station Network Overview */}
      <div className="p-5 md:p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-[#1F3A2E] text-base font-heading flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#C8A96A]" />
              <span>International Sovereign Operating Stations (5 Entities)</span>
            </h3>
            <p className="text-xs text-[#6B7269] mt-0.5">
              Multi-entity sovereign structure configured for international trade, customs compliance, and direct banking mandates.
            </p>
          </div>

          <button
            onClick={() => onNavigate('STATIONS')}
            className="px-3.5 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#12231B] text-[#C8A96A] text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>Station Settings &amp; Legal Dossiers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {companies.map((station) => {
            const isCurrentActive = activeEntity.code === station.code;
            return (
              <div
                key={station.code}
                onClick={() => onSelectEntity(station.code)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isCurrentActive
                    ? 'bg-[#FAF5EC] border-[#C8A96A] ring-2 ring-[#C8A96A]/60 shadow-xs'
                    : 'bg-[#F8FAF8] border-[#DDE3DD] hover:border-slate-400 hover:bg-white'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{station.flag}</span>
                    <span className="px-2 py-0.5 rounded bg-white text-slate-800 font-mono text-[9.5px] font-bold border border-slate-200">
                      {station.code.replace('ARIEL_', '')}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#1F3A2E] text-xs leading-tight">
                      {station.legalName}
                    </h4>
                    <p className="text-[10px] text-gray-500">{station.city}, {station.country}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-[#8A6D3B]">{station.baseCurrency}</span>
                  {isCurrentActive ? (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px] flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Selected
                    </span>
                  ) : (
                    <span className="text-gray-400 text-[9.5px]">Click to switch</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Core ERP Modules Direct Access Grid */}
      <div className="p-5 md:p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-[#1F3A2E] text-base font-heading flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-[#1E6B3A]" />
            <span>ERP Enterprise Workspaces</span>
          </h3>
          <p className="text-xs text-[#6B7269] mt-0.5">
            Click any operational domain below to launch its dedicated, full-screen workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.tab}
                onClick={() => onNavigate(mod.tab)}
                className={`p-4 rounded-xl border border-[#DDE3DD] hover:border-[#1F3A2E] bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`p-2 rounded-lg ${mod.bg} ${mod.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                      {mod.phase}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#1F3A2E] text-sm group-hover:text-[#8A6D3B] transition-colors leading-snug">
                      {mod.title}
                    </h4>
                    <p className="text-[11px] text-[#6B7269] leading-relaxed mt-1">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] font-bold text-gray-500">
                    {mod.badge}
                  </span>
                  <span className="text-[#1F3A2E] font-bold text-[11px] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3 text-[#C8A96A]" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Dashboard Roadmap & Finalization Notice */}
      <div className="p-4 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]/60 flex items-center justify-between gap-4 text-xs text-[#8A6D3B]">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#C8A96A] shrink-0" />
          <div>
            <div className="font-heading font-bold text-[#1F3A2E] text-xs flex items-baseline gap-1">
              <span className="text-[#003177] font-black">ArielMC</span><sup className="text-[0.65em] font-bold text-[#003177] -top-0.5">™</sup>
              <span className="font-bold text-slate-900">Enterprise Resource Planning System</span>
            </div>
            <p className="text-[11px] text-[#6B7269] mt-0.5">
              © Ariel Marketing &amp; Communications Limited | All Right Reserve &bull; 4 Core Pillars Anchored
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-lg bg-[#1F3A2E] text-[#C8A96A] font-mono text-[10px] font-bold shrink-0 hidden sm:inline">
          Foundation Mode
        </span>
      </div>
    </div>
  );
};
