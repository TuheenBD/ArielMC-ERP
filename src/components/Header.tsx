'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CompanyEntity, CurrencyRate, EntityCode } from '@/types/erp';
import { ThemeProfile, ActiveTab } from '@/components/Sidebar';
import { CommunicationChannelsModal } from '@/components/CommunicationChannelsModal';
import { 
  ChevronDown, 
  Search, 
  Bell, 
  Globe2, 
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
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isStationMenuOpen, setIsStationMenuOpen] = useState(false);

  const themeMenuRef = useRef<HTMLDivElement>(null);
  const stationMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click for immediate, smooth 1-click UX
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (stationMenuRef.current && !stationMenuRef.current.contains(event.target as Node)) {
        setIsStationMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    ? 'bg-[#1E293B] text-white border-[#334155] hover:border-[#4169E1] hover:bg-[#334155]/60'
    : 'bg-[#2C5240] text-white border-[#3A6B54] hover:border-[#C8A96A] hover:bg-[#35614c]';

  const tickerBg = isRoyal
    ? 'bg-[#1E293B] text-white border-[#334155]'
    : 'bg-[#2C5240] text-white border-[#3A6B54]';

  const tickerText = isRoyal ? 'text-[#93C5FD]' : 'text-[#CFE0D5]';
  const tickerCurrency = isRoyal ? 'text-[#E2E8F0]' : 'text-[#E8F0EA]';

  return (
    <header className={`sticky top-0 z-30 ${headerBg} px-5 py-2.5 transition-colors shadow-md`}>
      <div className="flex items-center justify-between gap-3">
        {/* Left Section: Global ERP Search (Logo removed per user instruction) */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isRoyal ? 'text-[#94A3B8]' : 'text-[#A0B9A8]'}`} />
            <input
              id="global-erp-search"
              type="text"
              placeholder="Search SKUs, HS codes, leather types, factories, buyers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full h-9 pl-9 pr-4 text-xs rounded-lg border transition-all shadow-inner focus:outline-none focus:ring-1 focus:ring-[#C8A96A] ${searchBoxBg}`}
            />
          </div>

          {/* Live FX Ticker (Standardized h-9) */}
          <div className={`hidden 2xl:flex items-center gap-2.5 h-9 px-3 rounded-lg border text-xs shrink-0 ${tickerBg}`}>
            <div className={`flex items-center gap-1.5 font-medium ${tickerText}`}>
              <TrendingUp className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="text-[11px] font-semibold">FX:</span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px]">
              {currencies.filter(c => c.code !== 'USD').map(curr => (
                <span key={curr.code} className={`font-mono ${tickerCurrency}`}>
                  {curr.code}: <span className="text-[#C8A96A] font-semibold">{curr.rateToUsd}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Standardized Corporate Button Grid (All Uniform h-9 Height) */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Operating Station Switcher Dropdown (Controlled 1-Click Menu) */}
          <div className="relative" ref={stationMenuRef}>
            <button 
              id="entity-selector-dropdown-btn"
              onClick={() => {
                setIsStationMenuOpen(prev => !prev);
                setIsThemeMenuOpen(false);
              }}
              className={`h-9 flex items-center gap-2 px-3 rounded-lg border text-xs font-medium transition-all shadow-xs cursor-pointer ${toolButtonBg}`}
              title="Switch Operating Station"
            >
              <span className="text-sm leading-none">{activeEntity.flag}</span>
              <div className="text-left hidden sm:block">
                <span className="font-heading font-bold text-xs tracking-wide text-white">
                  {getStationBrandName(activeEntity.code)}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#C8A96A] transition-transform duration-200 ${isStationMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Station Dropdown Menu */}
            {isStationMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white border border-[#DDE3DD] rounded-xl shadow-2xl p-2 z-50 text-[#1A1A1A] animate-in fade-in slide-in-from-top-1 duration-150">
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
                        onClick={() => {
                          onSelectEntity(comp.code);
                          setIsStationMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-[#E8F0EA] border border-[#C8A96A] text-[#1F3A2E] font-semibold' 
                            : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{comp.flag}</span>
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
            )}
          </div>

          {/* Display Currency Switcher (Unstacked, clean h-9 select) */}
          <div className="relative">
            <select
              id="currency-selector"
              value={activeCurrency.code}
              onChange={(e) => onSelectCurrency(e.target.value)}
              className={`h-9 text-xs font-mono border rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#C8A96A] text-center cursor-pointer font-bold shadow-xs ${toolButtonBg}`}
              title="Display Currency"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code} className="bg-[#1F3A2E] text-white">
                  {curr.code} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Profile Selector (Instant 1-Click Controlled Dropdown) */}
          <div className="relative" ref={themeMenuRef}>
            <button
              id="theme-profile-selector-btn"
              onClick={() => {
                setIsThemeMenuOpen(prev => !prev);
                setIsStationMenuOpen(false);
              }}
              className={`h-9 flex items-center gap-2 px-3 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer ${toolButtonBg}`}
              title="ERP Color Scheme & Theme Profile"
            >
              <Palette className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="hidden md:inline">
                {theme === 'crm-green'
                  ? 'CRM Green'
                  : theme === 'royal-blue'
                  ? 'Royal Blue'
                  : 'Heritage Tan'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#C8A96A] transition-transform duration-200 ${isThemeMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Theme Dropdown Menu (Fixed 1-click select & instant close) */}
            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-[#DDE3DD] rounded-xl shadow-2xl p-2 z-50 text-[#1A1A1A] animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-2 border-b border-[#DDE3DD] text-[11px] font-semibold text-[#6B7269] uppercase tracking-wider flex items-center justify-between">
                  <span>ERP Color Scheme</span>
                  <Palette className="w-3.5 h-3.5 text-[#1F3A2E]" />
                </div>
                <div className="mt-1 space-y-1 text-xs">
                  {/* Option 1: CRM Green */}
                  <button
                    onClick={() => {
                      onSelectTheme?.('crm-green');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
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
                    onClick={() => {
                      onSelectTheme?.('royal-blue');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      theme === 'royal-blue'
                        ? 'bg-[#EFF6FF] border border-[#4169E1] text-[#1E3A8A] font-bold'
                        : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#4169E1] border border-[#2563EB] shadow-xs shrink-0" />
                      <div>
                        <div className="font-semibold text-[#1E3A8A]">Royal Blue (#4169E1)</div>
                        <div className="text-[10px] text-[#64748B]">Royal Blue &amp; Ivory White</div>
                      </div>
                    </div>
                    {theme === 'royal-blue' && <Check className="w-3.5 h-3.5 text-[#4169E1]" />}
                  </button>

                  {/* Option 3: Heritage Tan */}
                  <button
                    onClick={() => {
                      onSelectTheme?.('heritage-tan');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      theme === 'heritage-tan'
                        ? 'bg-[#FAF6EE] border border-[#C8A96A] text-[#1F3A2E] font-bold'
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
            )}
          </div>

          <div className="h-5 w-[1px] bg-white/20 mx-0.5 hidden sm:block" />

          {/* Supplier & Buyer Communication Channels Button (Standardized h-9) */}
          <button
            id="header-channels-btn"
            onClick={() => setIsChannelsModalOpen(true)}
            className={`h-9 flex items-center justify-center gap-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer ${toolButtonBg}`}
            title="Official Supplier & Buyer Communication Channels (Mobile, WhatsApp, E-Mails, Social Media)"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span className="hidden sm:inline">Channels</span>
          </button>

          {/* Official Documents PDF Generator (Standardized h-9) */}
          {onOpenDocumentCenter && (
            <button
              id="header-official-docs-btn"
              onClick={onOpenDocumentCenter}
              className={`h-9 flex items-center gap-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer ${toolButtonBg}`}
              title="Official ArielMC PDF Document Engine (Commercial Invoices, Proforma Invoices, Mushak 6.3, Purchase Orders)"
            >
              <FileText className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="hidden xl:inline">Export Docs</span>
            </button>
          )}

          {/* Database Persistence Status & Sync Center (Standardized h-9) */}
          {onOpenDatabaseSettings && (
            <button
              id="header-database-settings-btn"
              onClick={onOpenDatabaseSettings}
              className={`h-9 flex items-center gap-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer ${toolButtonBg}`}
              title="ArielMC ERP PostgreSQL Database & Persistent Storage Center (Supabase)"
            >
              <div className="relative flex items-center">
                <Database className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${isDatabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              </div>
              <span className="hidden xl:inline">Database</span>
            </button>
          )}

          {/* ArielMC ERP User Guide (PDF) (Standardized h-9) */}
          {onOpenUserGuide && (
            <button
              id="header-user-guide-btn"
              onClick={onOpenUserGuide}
              className={`h-9 flex items-center gap-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer ${toolButtonBg}`}
              title="ArielMC ERP User Guide & Operational Manual (Official PDF & Interactive Reader)"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="hidden xl:inline">User Guide</span>
            </button>
          )}

          {/* Notifications (Standardized h-9 w-9) */}
          <button 
            id="header-notifications-btn"
            className={`h-9 w-9 flex items-center justify-center relative rounded-lg border transition-colors cursor-pointer ${toolButtonBg}`}
            title="Station Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C8A96A] ring-2 ring-[#1F3A2E]" />
          </button>

          {/* Communication Hub LIVE Tab (Standardized h-9) */}
          <button
            id="header-comm-hub-tab-btn"
            onClick={() => onSelectTab?.('COMMUNICATIONS')}
            className={`h-9 flex items-center gap-2 px-3 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer ${
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
            <span className="font-heading tracking-wide hidden lg:inline">Comm Hub</span>
            <span
              className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                activeTab === 'COMMUNICATIONS'
                  ? 'bg-[#1F3A2E] text-white'
                  : 'bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/40'
              }`}
            >
              LIVE
            </span>
          </button>

          <div className="h-5 w-[1px] bg-white/20 mx-0.5 hidden sm:block" />

          {/* User Profile & Account Control (Standardized h-9) */}
          <button
            id="header-user-profile-btn"
            onClick={onOpenProfileControl || onOpenAuthModal}
            className={`h-9 flex items-center gap-2 pl-1.5 pr-2.5 rounded-lg border transition-all cursor-pointer hover:bg-white/10 group ${
              isRoyal ? 'border-[#334155] bg-[#1E293B]' : isHeritage ? 'border-[#2A4837] bg-[#2C5240]' : 'border-[#3A6B54] bg-[#2C5240]'
            }`}
            title="ArielMC Profile Control & 2SA Center (Click to manage profile, password, and users)"
          >
            <div 
              className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shadow-xs shrink-0"
              style={{
                backgroundColor: currentUser?.avatarColor || '#C8A96A',
                color: '#1F3A2E'
              }}
            >
              {currentUser?.avatarInitials || 'AMC'}
            </div>
            <div className="hidden xl:block text-left text-xs leading-none">
              <div className="font-semibold text-white group-hover:text-[#C8A96A] transition-colors truncate max-w-[120px]">
                {currentUser?.name || 'Syed Akramul Hassan'}
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
