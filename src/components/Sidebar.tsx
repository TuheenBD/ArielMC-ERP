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
          badge: '10k P&L Live',
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
    <aside className="w-72 bg-[#0A1A2F] border-r border-[#1B2D46] flex flex-col justify-between h-screen sticky top-0 select-none shadow-xl">
      {/* Top Branding */}
      <div>
        <div className="p-4 border-b border-[#1B2D46] bg-[#071322]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-[#C8A96A] p-1 flex items-center justify-center shadow-md">
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
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C8A96A] text-[#0A1A2F] font-mono font-bold">
                  ERP
                </span>
              </div>
              <p className="text-[10px] text-[#C8A96A] font-medium tracking-tight truncate max-w-[170px]">
                Ariel Marketing & Communications Ltd
              </p>
            </div>
          </div>

          {/* Active Operating Entity Bar */}
          <div className="mt-3.5 p-2 rounded-lg bg-[#10233F] border border-[#1E365D] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">{activeEntity.flag}</span>
              <div>
                <span className="font-medium text-white block text-[11px] leading-tight">
                  {activeEntity.city} Station
                </span>
                <span className="text-[9px] text-[#8EA3BE]">
                  {activeEntity.legalStatus.split(' ')[0]}
                </span>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#C8A96A]/20 text-[#C8A96A] font-mono text-[10px] font-bold border border-[#C8A96A]/40">
              {activeEntity.baseCurrency}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)]">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#C8A96A] uppercase font-heading">
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
                          ? 'bg-[#C8A96A] text-[#0A1A2F] font-bold shadow-md shadow-[#C8A96A]/20'
                          : isLive
                          ? 'text-[#CFE0D5] hover:bg-[#10233F] hover:text-white'
                          : 'text-slate-400 hover:bg-[#10233F]/60 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#0A1A2F]' : isLive ? 'text-[#C8A96A]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        isActive 
                          ? 'bg-[#0A1A2F]/20 text-[#0A1A2F] font-bold border border-[#0A1A2F]/30' 
                          : 'bg-[#10233F] text-[#CFE0D5] border border-[#1E365D]'
                      }`}>
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
      <div className="p-3.5 border-t border-[#1B2D46] bg-[#071322] text-[11px] space-y-2">
        <div className="flex items-center justify-between text-[#8EA3BE]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[10px] font-mono text-[#85E3A1] font-medium">ERP Engine Live</span>
          </span>
          <span className="text-[10px] font-mono text-[#C8A96A]">v1.0.0</span>
        </div>
        <div className="text-[10px] text-[#8EA3BE] flex items-center justify-between pt-1 border-t border-[#1B2D46]">
          <span>PostgreSQL Active</span>
          <span>Next.js 16</span>
        </div>
      </div>
    </aside>
  );
};
