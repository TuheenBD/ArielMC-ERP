'use client';

import React, { useState } from 'react';
import {
  Calculator as CalcIcon,
  FileText,
  Calendar as CalendarIcon,
  MessageSquare,
  Users2,
  Wallet,
  Globe2,
  Languages,
  Sparkles,
  Layers,
  Wrench,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ArielMC } from '@/lib/brand';
import { CompanyEntity, CurrencyRate } from '@/types/erp';
import { ThemeProfile } from '@/components/Sidebar';
import { UtilityTab } from '@/types/utilities';
import { CalculatorUtility } from './CalculatorUtility';
import { NotePadUtility } from './NotePadUtility';
import { TodoCalendarUtility } from './TodoCalendarUtility';
import { MessageCenterUtility } from './MessageCenterUtility';
import { ContactsDirectoryUtility } from './ContactsDirectoryUtility';
import { WalletBankingUtility } from './WalletBankingUtility';
import { MapsUtility } from './MapsUtility';
import { TranslatorUtility } from './TranslatorUtility';

interface UtilitiesManagementProps {
  activeEntity?: CompanyEntity;
  activeCurrency?: CurrencyRate;
  theme?: ThemeProfile;
  defaultTab?: UtilityTab;
}

export const UtilitiesManagement: React.FC<UtilitiesManagementProps> = ({
  activeEntity,
  activeCurrency,
  theme = 'crm-green',
  defaultTab = 'TODO_CALENDAR',
}) => {
  const [activeTab, setActiveTab] = useState<UtilityTab>(defaultTab);

  const utilityNav = [
    {
      id: 'TODO_CALENDAR' as UtilityTab,
      label: 'To Do / Calendar',
      icon: CalendarIcon,
      badge: 'Flowlu Engine',
      summary: 'Task creation, workload scheduling, time tracking & checklists',
    },
    {
      id: 'CALCULATOR' as UtilityTab,
      label: 'Calculator',
      icon: CalcIcon,
      badge: '4 Modes',
      summary: 'Sourcing margin, multi-currency forex, freight CBM, standard keypad',
    },
    {
      id: 'NOTEPAD' as UtilityTab,
      label: 'Note Pad',
      icon: FileText,
      badge: 'Scratchpad',
      summary: 'Quick memos, meeting minutes, technical pattern specs & TXT export',
    },
    {
      id: 'MESSAGES' as UtilityTab,
      label: 'Message Center',
      icon: MessageSquare,
      badge: 'Live Desks',
      summary: 'Global station broadcasts, operational memos & compliance bulletins',
    },
    {
      id: 'CONTACTS' as UtilityTab,
      label: 'Contacts',
      icon: Users2,
      badge: 'All Stakeholders',
      summary: 'Buyers, suppliers, partner factories & internal staff phonebook',
    },
    {
      id: 'WALLET' as UtilityTab,
      label: 'Wallet',
      icon: Wallet,
      badge: 'Banking Vault',
      summary: 'Wise UK, Dhaka AD Bank (ERQ), US Chase, EU SEPA wire instructions',
    },
    {
      id: 'MAPS' as UtilityTab,
      label: 'Maps',
      icon: Globe2,
      badge: 'Global Supply Chain',
      summary: 'Dhaka HQ, London, Savar, Narayanganj & maritime/air cargo gateways',
    },
    {
      id: 'TRANSLATOR' as UtilityTab,
      label: 'Translator',
      icon: Languages,
      badge: 'Cross-Border',
      summary: 'Trade phrase translation & technical garment/textile glossary',
    },
  ];

  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-200">
      {/* =========================================================================
          EXECUTIVE HERO BANNER
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1a14] via-[#12261d] to-[#0a1510] border border-[#234534] shadow-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A96A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#C8A96A]" />
                Head Section Utilities
              </span>
              <span className="px-3 py-1 rounded-full bg-[#203a2c] border border-[#C8A96A]/50 text-[#C8A96A] text-xs font-mono font-semibold">
                8 Mandatory Tools
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
                Enterprise &amp; Office Workspace
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <ArielMC /> Enterprise &amp; Office Utilities Suite
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed">
              Essential daily operational tools: Flowlu-grade Task &amp; Workload Calendar, Sourcing Margin &amp; Freight Calculator,
              Scratchpad Memos, Internal Bulletins, Master Stakeholder Contacts, Sovereign Banking Wallet, Supply Chain Maps, and Trade Translator.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="shrink-0 p-4 rounded-xl bg-[#14291f]/90 border border-[#2b5540] shadow-xl flex flex-col gap-2 min-w-[240px]">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Utilities Hub Status</span>
            <div className="text-xl font-bold text-emerald-400 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              All 8 Tools Live
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Station: {activeEntity?.legalName || 'Dual-Entity (Dhaka & London)'}
            </p>
          </div>
        </div>

        {/* 8-Tab Navigation Bar */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-[#234534] pt-4">
          {utilityNav.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#C8A96A] text-slate-950 font-bold shadow-lg shadow-[#C8A96A]/20 scale-102'
                    : 'bg-[#152a20] text-slate-300 hover:bg-[#1a3528] hover:text-white border border-[#234534]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-mono font-bold ${
                      isActive ? 'bg-slate-950 text-[#C8A96A]' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          ACTIVE TAB RENDERER
          ========================================================================= */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'TODO_CALENDAR' && <TodoCalendarUtility theme={theme} />}
        {activeTab === 'CALCULATOR' && <CalculatorUtility activeCurrency={activeCurrency} theme={theme} />}
        {activeTab === 'NOTEPAD' && <NotePadUtility />}
        {activeTab === 'MESSAGES' && <MessageCenterUtility />}
        {activeTab === 'CONTACTS' && <ContactsDirectoryUtility />}
        {activeTab === 'WALLET' && <WalletBankingUtility />}
        {activeTab === 'MAPS' && <MapsUtility />}
        {activeTab === 'TRANSLATOR' && <TranslatorUtility />}
      </div>
    </div>
  );
};
