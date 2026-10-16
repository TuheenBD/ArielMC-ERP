'use client';

import React from 'react';
import Image from 'next/image';
import { CompanyEntity } from '@/types/erp';
import {
  Building2,
  Package,
  Factory,
  FlaskConical,
  Users2,
  Repeat,
  Ship,
  Boxes,
  Landmark,
  Store,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export type ActiveTab = 
  | 'STATIONS' 
  | 'PRODUCTS' 
  | 'FACTORIES' 
  | 'RND' 
  | 'CRM' 
  | 'ORDERS' 
  | 'LOGISTICS' 
  | 'INVENTORY' 
  | 'FINANCE' 
  | 'POS';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  activeEntity: CompanyEntity;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeEntity,
}) => {
  const navSections = [
    {
      group: 'Phase 1: Foundation (Live)',
      items: [
        {
          id: 'STATIONS' as ActiveTab,
          label: 'Multi-Entity Stations',
          icon: Building2,
          badge: '5 Stations',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          phase: 'Phase 1',
        },
        {
          id: 'PRODUCTS' as ActiveTab,
          label: 'Sector Product Master',
          icon: Package,
          badge: '4 Sectors',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          phase: 'Phase 1',
        },
      ],
    },
    {
      group: 'Supply Chain & Manufacturing',
      items: [
        {
          id: 'FACTORIES' as ActiveTab,
          label: 'BD Factory & Compliance',
          icon: Factory,
          badge: '8 Factories',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          phase: 'Phase 2',
        },
        {
          id: 'RND' as ActiveTab,
          label: 'R&D, Tech Packs & Sampling',
          icon: FlaskConical,
          badge: '8 SDOs',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          phase: 'Phase 3',
        },
        {
          id: 'ORDERS' as ActiveTab,
          label: 'Two-Way Order Management',
          icon: Repeat,
          badge: '5 Orders',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          phase: 'Phase 5',
        },
      ],
    },
    {
      group: 'Commercial & Global Trade',
      items: [
        {
          id: 'CRM' as ActiveTab,
          label: 'Global CRM & B2B Leads',
          icon: Users2,
          badge: '254 Leads',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          phase: 'Phase 4',
        },
        {
          id: 'LOGISTICS' as ActiveTab,
          label: 'Logistics & Export Docs',
          icon: Ship,
          badge: 'Dual-Hub Live',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          phase: 'Phase 6',
        },
        {
          id: 'INVENTORY' as ActiveTab,
          label: 'Multi-Warehouse Inventory',
          icon: Boxes,
          badge: 'Phase 7',
          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
          phase: 'Phase 7',
        },
      ],
    },
    {
      group: 'Accounting & Expansion',
      items: [
        {
          id: 'FINANCE' as ActiveTab,
          label: 'Global Multi-Station Finance',
          icon: Landmark,
          badge: 'Phase 8',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          phase: 'Phase 8',
        },
        {
          id: 'POS' as ActiveTab,
          label: 'Omnichannel Store POS',
          icon: Store,
          badge: 'Year 2+',
          badgeColor: 'bg-slate-700/50 text-slate-400 border-slate-600/30',
          phase: 'Phase 9',
        },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-[#060e1a] border-r border-[#182e4b] flex flex-col justify-between h-screen sticky top-0 select-none">
      {/* Top Branding */}
      <div>
        <div className="p-4 border-b border-[#182e4b] bg-gradient-to-b from-[#0a1a2f] to-[#060e1a]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#0a1a2f] border border-[#c9a86a]/40 p-1 flex items-center justify-center shadow-lg shadow-[#c9a86a]/10">
              <Image
                src="/images/ArielMC_Logo.png"
                alt="ArielMC Logo"
                width={36}
                height={36}
                className="object-contain w-auto h-auto"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-white text-base tracking-wide">ArielMC</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c9a86a]/20 text-[#c9a86a] font-mono font-bold border border-[#c9a86a]/40">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] text-[#c9a86a] font-medium tracking-tight truncate max-w-[170px]">
                Ariel Marketing & Communications Ltd
              </p>
            </div>
          </div>

          {/* Active Operating Entity Bar */}
          <div className="mt-3.5 p-2 rounded-lg bg-[#0a1a2f]/90 border border-[#182e4b] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">{activeEntity.flag}</span>
              <div>
                <span className="font-medium text-slate-200 block text-[11px] leading-tight">
                  {activeEntity.city} Station
                </span>
                <span className="text-[9px] text-slate-400">
                  {activeEntity.legalStatus.split(' ')[0]}
                </span>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#c9a86a]/20 text-[#c9a86a] font-mono text-[10px] font-bold border border-[#c9a86a]/40">
              {activeEntity.baseCurrency}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)]">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                {section.group}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isLive = item.id === 'STATIONS' || item.id === 'PRODUCTS' || item.id === 'FACTORIES' || item.id === 'CRM' || item.id === 'RND' || item.id === 'ORDERS';
                  
                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id.toLowerCase()}`}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                          : isLive
                          ? 'text-slate-200 hover:bg-slate-800/70 hover:text-white'
                          : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isLive ? 'text-blue-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / System Health */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 text-[11px] space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 font-medium">ERP Core Online</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">v1.0.0</span>
        </div>
        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-900">
          <span>PostgreSQL Ready</span>
          <span>Next.js 16</span>
        </div>
      </div>
    </aside>
  );
};
