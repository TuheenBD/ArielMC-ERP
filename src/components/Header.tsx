'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CompanyEntity, CurrencyRate, EntityCode } from '@/types/erp';
import { ThemeProfile, ActiveTab } from '@/components/Sidebar';
import { CommunicationChannelsModal } from '@/components/CommunicationChannelsModal';
import { 
  Building2, 
  ChevronDown, 
  Search, 
  Bell, 
  Globe2, 
  ArrowUpRight, 
  ShieldCheck,
  TrendingUp,
  Palette,
  Check,
  PhoneCall,
  Video,
  FileText,
  Database,
  BookOpen
} from 'lucide-react';
import { UserProfile } from '@/types/auth';

interface HeaderProps {
  companies: CompanyEntity[];
  activeEntity: CompanyEntity;
  onSelectEntity: (code: EntityCode) => void;
  currencies: CurrencyRate[];
  activeCurrency: CurrencyRate;
  onSelectCurrency: (code: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  theme?: ThemeProfile;
  onSelectTheme?: (t: ThemeProfile) => void;
  activeTab?: ActiveTab;
  onSelectTab?: (tab: ActiveTab) => void;
  onOpenDocumentCenter?: () => void;
  onOpenDatabaseSettings?: () => void;
  isDatabaseConnected?: boolean;
  currentUser?: UserProfile;
  onOpenProfileControl?: () => void;
  onOpenAuthModal?: () => void;
  onOpenUserGuide?: () => void;
}

const getStationBrandName = (code: EntityCode) => {
  switch (code) {
    case 'ARIEL_BD':
      return 'ArielMC BD';
    case 'ARIEL_UK':
      return 'ArielMC UK';
    case 'ARIEL_US':
      return 'ArielMC US';
    case 'ARIEL_EU':
      return 'ArielMC EU';
    case 'ARIEL_AU':
      return 'ArielMC AU';
    default:
      return 'ArielMC';
  }
};

export const Header: React.FC<HeaderProps> = ({
  companies,
  activeEntity,
  onSelectEntity,
  currencies,
  activeCurrency,
  onSelectCurrency,
  searchQuery,
  onSearchChange,
  theme = 'crm-green',
  onSelectTheme,
  activeTab,
  onSelectTab,
  onOpenDocumentCenter,
  onOpenDatabaseSettings,
  isDatabaseConnected = false,
  currentUser,
  onOpenProfileControl,
  onOpenAuthModal,
  onOpenUserGuide,
}) => {
  const [isChannelsModalOpen, setIsChannelsModalOpen] = useState(false);

  const isRoyal = theme === 'royal-blue';
  const isHeritage = theme === 'heritage-tan';

  const headerBg = isRoyal
    ? 'bg-[#0F172A] border-b-[3px] border-[#4169E1] text-white'
    : isHeritage
    ? 'bg-[#183124] border-b-[3px] border-[#C8A96A] text-white'
    : 'bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white';

  const searchBoxBg = isRoyal
    ? 'bg-[#1E293B] text-white placeholder-[#94A3B8] border-[#334155] focus:border-[#4169E1]'
    : 'bg-[#2C5240] text-white placeholder-[#A0B9A8] border-[#3A6B54] focus:border-[#C8A96A]';

  const toolButtonBg = isRoyal
    ? 'bg-[#1E293B] text-white border-[#334155] hover:border-[#4169E1]'
    : 'bg-[#2C5240] text-white border-[#3A6B54] hover:border-[#C8A96A]';

  const tickerBg = isRoyal
    ? 'bg-[#1E293B] text-white border-[#334155]'
    : 'bg-[#2C5240] text-white border-[#3A6B54]';

  const tickerText = isRoyal ? 'text-[#93C5FD]' : 'text-[#CFE0D5]';
  const tickerCurrency = isRoyal ? 'text-[#E2E8F0]' : 'text-[#E8F0EA]';

  return (
    <header className={`sticky top-0 z-30 ${headerBg} px-6 py-3 transition-colors shadow-md`}>
      <div className="flex items-center justify-between gap-4">
        {/* Left: ArielMC Brand Pill & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <div
            onClick={() => onSelectTab && onSelectTab('STATIONS')}
            className="flex items-center gap-2 cursor-pointer shrink-0 bg-white/95 hover:bg-white rounded-lg px-2.5 py-1.5 shadow-xs border border-[#C8A96A]/60 transition-all hover:border-[#C8A96A] group"
            title="ArielMC Global Sourcing & Supply Chain ERP"
          >
            <div className="w-5 h-5 shrink-0 flex items-center justify-center">
              <Image
                src="/images/ArielMC_Emblem_Square.png"
                alt="ArielMC Logo"
                width={20}
                height={20}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="hidden sm:flex items-center gap-1 leading-none">
              <span className="font-heading font-black text-[#003177] text-xs tracking-tight">ArielMC</span>
              <span className="text-[8px] px-1 py-0.2 rounded bg-[#1F3A2E] text-[#C8A96A] font-mono font-bold">ERP</span>
            </div>
          </div>

          <div className="relative w-full">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isRoyal ? 'text-[#94A3B8]' : 'text-[#A0B9A8]'}`} />
            <input
              id="global-erp-search"
              type="text"
              placeholder="Search SKUs, HS codes, leather types, factories, buyers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border transition-all shadow-inner focus:outline-none focus:ring-1 focus:ring-[#C8A96A] ${searchBoxBg}`}
            />
          </div>
        </div>

        {/* Center: Live FX Ticker */}
        <div className={`hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg border text-xs ${tickerBg}`}>
          <div className={`flex items-center gap-1.5 font-medium ${tickerText}`}>
            <TrendingUp className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>FX (vs USD):</span>
          </div>
          <div className="flex items-center gap-3">
            {currencies.filter(c => c.code !== 'USD').map(curr => (
              <span key={curr.code} className={`font-mono ${tickerCurrency}`}>
                {curr.code}: <span className="text-[#C8A96A] font-semibold">{curr.rateToUsd}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: Station / Company Switcher & Tools */}
        <div className="flex items-center gap-2.5">
          {/* Channels & Display Currency (Stacked Column) */}
          <div className="flex flex-col gap-1 items-stretch shrink-0">
            {/* Supplier & Buyer Communication Channels Button */}
            <button
              id="header-channels-btn"
              onClick={() => setIsChannelsModalOpen(true)}
              className={`flex items-center justify-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-all shadow-sm ${toolButtonBg}`}
              title="Official Supplier & Buyer Communication Channels (Mobile, WhatsApp, E-Mails, Social Media)"
            >
              <PhoneCall className="w-3 h-3 text-[#C8A96A]" />
              <span>Channels</span>
            </button>

            {/* Display Currency Switcher (Placed directly under Channels) */}
            <select
              id="currency-selector"
              value={activeCurrency.code}
              onChange={(e) => onSelectCurrency(e.target.value)}
              className={`text-[10px] font-mono border rounded-md px-1.5 py-0.5 focus:outline-none focus:border-[#C8A96A] text-center cursor-pointer font-bold ${toolButtonBg}`}
              title="Display Currency"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code} className="bg-[#1F3A2E] text-white">
                  {curr.code} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Profile Selector Dropdown */}
          <div className="relative group">
            <button
              id="theme-profile-selector-btn"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm ${toolButtonBg}`}
              title="ERP Color System & Theme Profile"
            >
              <Palette className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="hidden sm:inline">
                {theme === 'crm-green'
                  ? 'CRM Green'
                  : theme === 'royal-blue'
                  ? 'Royal Blue'
                  : 'Heritage Tan'}
              </span>
              <ChevronDown className="w-3 h-3 text-[#C8A96A]" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#DDE3DD] rounded-xl shadow-2xl p-2 hidden group-hover:block transition-all z-50 text-[#1A1A1A]">
              <div className="px-3 py-2 border-b border-[#DDE3DD] text-[11px] font-semibold text-[#6B7269] uppercase tracking-wider flex items-center justify-between">
                <span>ERP Color Profile</span>
                <Palette className="w-3.5 h-3.5 text-[#1F3A2E]" />
              </div>
              <div className="mt-1 space-y-1 text-xs">
                {/* Option 1: CRM Green */}
                <button
                  onClick={() => onSelectTheme?.('crm-green')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    theme === 'crm-green'
                      ? 'bg-[#E8F0EA] border border-[#C8A96A] text-[#1F3A2E] font-bold'
                      : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#1F3A2E] border border-[#C8A96A] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#1F3A2E]">ArielMC Green (CRM)</div>
                      <div className="text-[10px] text-[#6B7269]">Deep Sourcing Forest &amp; Gold</div>
                    </div>
                  </div>
                  {theme === 'crm-green' && <Check className="w-3.5 h-3.5 text-[#1F3A2E]" />}
                </button>

                {/* Option 2: Royal Blue (#4169E1) */}
                <button
                  onClick={() => onSelectTheme?.('royal-blue')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    theme === 'royal-blue'
                      ? 'bg-[#EBF2FF] border border-[#4169E1] text-[#1E3A8A] font-bold'
                      : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#4169E1] border border-[#2563EB] shadow-sm shrink-0" />
                    <div>
                      <div className="font-semibold text-[#1E3A8A]">Royal Blue (#4169E1)</div>
                      <div className="text-[10px] text-[#64748B]">Royal Blue &amp; Deep Midnight Navy</div>
                    </div>
                  </div>
                  {theme === 'royal-blue' && <Check className="w-3.5 h-3.5 text-[#4169E1]" />}
                </button>

                {/* Option 3: Heritage Tan */}
                <button
                  onClick={() => onSelectTheme?.('heritage-tan')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    theme === 'heritage-tan'
                      ? 'bg-[#E8F0EA] border border-[#C8A96A] text-[#1F3A2E] font-bold'
                      : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#C8A96A] border border-[#8A6D3B] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#1A1A1A]">Heritage Leather &amp; Sand</div>
                      <div className="text-[10px] text-[#6B7269]">Saddle Tan &amp; British Cypress</div>
                    </div>
                  </div>
                  {theme === 'heritage-tan' && <Check className="w-3.5 h-3.5 text-[#1F3A2E]" />}
                </button>
              </div>
            </div>
          </div>

          {/* Active Entity Selector Dropdown */}
          <div className="relative group">
            <button 
              id="entity-selector-dropdown-btn"
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-sm ${toolButtonBg}`}
            >
              <span className="text-base leading-none">{activeEntity.flag}</span>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold tracking-wide text-white">
                    {getStationBrandName(activeEntity.code)}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C8A96A] text-[#1F3A2E] font-mono font-bold">
                    {activeEntity.baseCurrency}
                  </span>
                </div>
                <p className="text-[10px] leading-tight text-[#CFE0D5]">{activeEntity.city}, {activeEntity.country}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#C8A96A] ml-1 group-hover:scale-110 transition-transform" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#DDE3DD] rounded-xl shadow-2xl p-2 hidden group-hover:block transition-all z-50 text-[#1A1A1A]">
              <div className="px-3 py-2 border-b border-[#DDE3DD] text-[11px] font-semibold text-[#6B7269] uppercase tracking-wider flex items-center justify-between">
                <span>Switch Operating Station</span>
                <Globe2 className="w-3.5 h-3.5 text-[#1F3A2E]" />
              </div>
              <div className="mt-1 space-y-1">
                {companies.map((comp) => {
                  const isSelected = comp.code === activeEntity.code;
                  return (
                    <button
                      key={comp.code}
                      onClick={() => onSelectEntity(comp.code)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                        isSelected 
                          ? 'bg-[#E8F0EA] border border-[#C8A96A] text-[#1F3A2E] font-semibold' 
                          : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{comp.flag}</span>
                        <div>
                          <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                            <span>{getStationBrandName(comp.code)}</span>
                            <span className="text-[10px] text-gray-500 font-normal">({comp.city})</span>
                          </div>
                          <div className="text-[10px] text-[#6B7269]">{comp.taxIdentifier.type}: {comp.taxIdentifier.number}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F4F6F4] text-[#1F3A2E] border border-[#DDE3DD] font-semibold">
                        {comp.baseCurrency}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>


          {/* Official Documents PDF Generator */}
          {onOpenDocumentCenter && (
            <button
              id="header-official-docs-btn"
              onClick={onOpenDocumentCenter}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${toolButtonBg}`}
              title="Official ArielMC PDF Document Engine (Commercial Invoices, Proforma Invoices, Mushak 6.3, Purchase Orders)"
            >
              <FileText className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="hidden xl:inline">Export Docs</span>
            </button>
          )}

          {/* Database Persistence Status & Sync Center */}
          {onOpenDatabaseSettings && (
            <button
              id="header-database-settings-btn"
              onClick={onOpenDatabaseSettings}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${toolButtonBg}`}
              title="ArielMC ERP PostgreSQL Database & Persistent Storage Center (Supabase)"
            >
              <div className="relative flex items-center">
                <Database className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${isDatabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              </div>
              <span className="hidden xl:inline">Database</span>
            </button>
          )}

          {/* ArielMC ERP User Guide (PDF) */}
          {onOpenUserGuide && (
            <button
              id="header-user-guide-btn"
              onClick={onOpenUserGuide}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${toolButtonBg}`}
              title="ArielMC ERP User Guide & Operational Manual (Official PDF & Interactive Reader)"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="hidden xl:inline">User Guide</span>
            </button>
          )}

          {/* Notifications */}
          <button 
            id="header-notifications-btn"
            className={`relative p-2 rounded-lg border transition-colors ${toolButtonBg}`}
            title="Station Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C8A96A] ring-2 ring-[#1F3A2E]" />
          </button>

          {/* Communication Hub Upper Right Tab (Just Before Profile) */}
          <button
            id="header-comm-hub-tab-btn"
            onClick={() => onSelectTab?.('COMMUNICATIONS')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${
              activeTab === 'COMMUNICATIONS'
                ? 'bg-[#C8A96A] text-[#1F3A2E] border-[#C8A96A] shadow-md ring-2 ring-[#C8A96A]/30'
                : toolButtonBg
            }`}
            title="ArielMC Unified Communications & Meetings Hub"
          >
            <div className="relative flex items-center">
              <Video className={`w-3.5 h-3.5 ${activeTab === 'COMMUNICATIONS' ? 'text-[#1F3A2E]' : 'text-[#C8A96A]'}`} />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="font-heading tracking-wide hidden md:inline">Communication Hub</span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                activeTab === 'COMMUNICATIONS'
                  ? 'bg-[#1F3A2E] text-white'
                  : 'bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/40'
              }`}
            >
              LIVE
            </span>
          </button>

          {/* User Profile & Account Control */}
          <button
            id="header-user-profile-btn"
            onClick={onOpenProfileControl || onOpenAuthModal}
            className={`flex items-center gap-2.5 pl-2 py-1 pr-2 rounded-xl border-l transition-all hover:bg-black/10 group ${
              isRoyal ? 'border-[#334155]' : isHeritage ? 'border-[#2A4837]' : 'border-[#2C5240]'
            }`}
            title="ArielMC Profile Control & 2SA Center (Click to manage profile, password, and users)"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm transition-transform group-hover:scale-105"
              style={{
                backgroundColor: currentUser?.avatarColor || '#C8A96A',
                color: '#1F3A2E'
              }}
            >
              {currentUser?.avatarInitials || 'AMC'}
            </div>
            <div className="hidden xl:block text-left text-xs">
              <div className="font-semibold leading-tight flex items-center gap-1 group-hover:text-[#C8A96A] transition-colors text-white">
                <span>{currentUser?.name || 'Syed Akramul Hassan'}</span>
              </div>
              <div className={`text-[10px] flex items-center gap-1 ${isRoyal ? 'text-[#94A3B8]' : 'text-[#CFE0D5]'}`}>
                <ShieldCheck className="w-3 h-3 inline text-[#C8A96A]" /> {currentUser?.designation || 'Managing Director'}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Official Communication Channels & Social Hub Modal */}
      <CommunicationChannelsModal
        isOpen={isChannelsModalOpen}
        onClose={() => setIsChannelsModalOpen(false)}
      />
    </header>
  );
};
