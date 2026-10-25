'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CompanyEntity, CurrencyRate, EntityCode } from '@/types/erp';
import { ThemeProfile, ActiveTab } from '@/components/Sidebar';
import { 
  ChevronDown, 
  Search, 
  Bell, 
  TrendingUp, 
  Palette, 
  Check, 
  Video, 
  Database, 
  ShieldCheck, 
  Bot, 
  RefreshCw, 
  Wrench, 
  X,
  Star
} from 'lucide-react';
import { UserProfile } from '@/types/auth';
import { ALL_PAGE_DEFINITIONS } from '@/lib/favoritesManager';
import { FavoriteKey } from '@/types/favorites';

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
  onOpenArielAi?: () => void;
  isArielAiOpen?: boolean;
  onOpenForexSync?: () => void;
  isForexSyncing?: boolean;
  onRefreshForex?: () => void;
  onOpenSearchWindow?: () => void;
  onCloseSearchWindow?: () => void;
  isSearchWindowOpen?: boolean;
  isSearchWindowMinimized?: boolean;
  favoritePages?: FavoriteKey[];
  onToggleFavorite?: (id: FavoriteKey) => void;
  onSelectFavorite?: (id: FavoriteKey) => void;
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
      return typeof code === 'string' && code.startsWith('ARIEL_')
        ? `ArielMC ${code.replace('ARIEL_', '')}`
        : 'ArielMC';
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
  onOpenArielAi,
  isArielAiOpen = false,
  onOpenForexSync,
  isForexSyncing = false,
  onRefreshForex,
  onOpenSearchWindow,
  onCloseSearchWindow,
  isSearchWindowOpen = false,
  isSearchWindowMinimized = false,
  favoritePages = [],
  onToggleFavorite,
  onSelectFavorite,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const [isFavoritesMenuOpen, setIsFavoritesMenuOpen] = useState(false);
  const favoritesMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click with smooth detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (favoritesMenuRef.current && !favoritesMenuRef.current.contains(event.target as Node)) {
        setIsFavoritesMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isRoyal = theme === 'royal-blue';
  const isHydrangea = theme === 'hydrangea';
  const isCalifornia = theme === 'california-beaches';
  const isMossy = theme === 'mossy-hollow';
  const isInkWash = theme === 'ink-wash';
  const isPeach = theme === 'fresh-peach';
  const isStormy = theme === 'stormy-morning';

  const headerBg = isRoyal
    ? 'bg-[#0F172A] border-b-[3px] border-[#4169E1] text-white'
    : isHydrangea
    ? 'bg-[#230C2E] border-b-[3px] border-[#AD56C4] text-white'
    : isCalifornia
    ? 'bg-[#14232C] border-b-[3px] border-[#FFC067] text-white'
    : isMossy
    ? 'bg-[#282B1B] border-b-[3px] border-[#D4DE95] text-white'
    : isInkWash
    ? 'bg-[#24272A] border-b-[3px] border-[#6D8196] text-white'
    : isPeach
    ? 'bg-[#2A1D1A] border-b-[3px] border-[#E39A7B] text-white'
    : isStormy
    ? 'bg-[#1E2730] border-b-[3px] border-[#88BDF2] text-white'
    : 'bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white';

  const searchBoxBg = isRoyal
    ? 'bg-[#1E293B] text-white placeholder-[#94A3B8] border-[#334155] focus:border-[#4169E1]'
    : isHydrangea
    ? 'bg-[#341344] text-white placeholder-[#FFC2BA] border-[#4E2064] focus:border-[#AD56C4]'
    : isCalifornia
    ? 'bg-[#1B2F3B] text-white placeholder-[#BACDD6] border-[#2B4B5C] focus:border-[#66C4FF]'
    : isMossy
    ? 'bg-[#343823] text-white placeholder-[#BAC095] border-[#4E5434] focus:border-[#D4DE95]'
    : isInkWash
    ? 'bg-[#303438] text-white placeholder-[#CBCBCB] border-[#4A4F55] focus:border-[#6D8196]'
    : isPeach
    ? 'bg-[#382622] text-white placeholder-[#FFD3AC] border-[#543A34] focus:border-[#E39A7B]'
    : isStormy
    ? 'bg-[#283542] text-white placeholder-[#BDDDFC] border-[#3E5164] focus:border-[#88BDF2]'
    : 'bg-[#2C5240] text-white placeholder-[#A0B9A8] border-[#3A6B54] focus:border-[#C8A96A]';

  // Standard corporate toolbar button style - uniform 36px (h-9)
  const toolBtn = `h-9 flex items-center justify-center gap-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer select-none ${
    isRoyal
      ? 'bg-[#1E293B] text-white border-[#334155] hover:border-[#4169E1] hover:bg-[#334155]'
      : isHydrangea
      ? 'bg-[#341344] text-white border-[#4E2064] hover:border-[#AD56C4] hover:bg-[#45195A]'
      : isCalifornia
      ? 'bg-[#1B2F3B] text-white border-[#2B4B5C] hover:border-[#66C4FF] hover:bg-[#243d4d]'
      : isMossy
      ? 'bg-[#343823] text-white border-[#4E5434] hover:border-[#D4DE95] hover:bg-[#43492e]'
      : isInkWash
      ? 'bg-[#303438] text-white border-[#4A4F55] hover:border-[#6D8196] hover:bg-[#3d4348]'
      : isPeach
      ? 'bg-[#382622] text-white border-[#543A34] hover:border-[#E39A7B] hover:bg-[#4a332d]'
      : isStormy
      ? 'bg-[#283542] text-white border-[#3E5164] hover:border-[#88BDF2] hover:bg-[#354657]'
      : 'bg-[#2C5240] text-white border-[#3A6B54] hover:border-[#C8A96A] hover:bg-[#35614c]'
  }`;

  // Line 2 corporate toolbar button style - uniform 40px (h-10) matching search & profile
  const toolBtnH10 = `h-10 flex items-center justify-center gap-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer select-none ${
    isRoyal
      ? 'bg-[#1E293B] text-white border-[#334155] hover:border-[#4169E1] hover:bg-[#334155]'
      : isHydrangea
      ? 'bg-[#341344] text-white border-[#4E2064] hover:border-[#AD56C4] hover:bg-[#45195A]'
      : isCalifornia
      ? 'bg-[#1B2F3B] text-white border-[#2B4B5C] hover:border-[#66C4FF] hover:bg-[#243d4d]'
      : isMossy
      ? 'bg-[#343823] text-white border-[#4E5434] hover:border-[#D4DE95] hover:bg-[#43492e]'
      : isInkWash
      ? 'bg-[#303438] text-white border-[#4A4F55] hover:border-[#6D8196] hover:bg-[#3d4348]'
      : isPeach
      ? 'bg-[#382622] text-white border-[#543A34] hover:border-[#E39A7B] hover:bg-[#4a332d]'
      : isStormy
      ? 'bg-[#283542] text-white border-[#3E5164] hover:border-[#88BDF2] hover:bg-[#354657]'
      : 'bg-[#2C5240] text-white border-[#3A6B54] hover:border-[#C8A96A] hover:bg-[#35614c]'
  }`;

  // Line 2 Notification Icon button style - uniform 40px x 40px (h-10 w-10)
  const notifBtnH10 = `h-10 w-10 flex items-center justify-center relative rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0 ${
    isRoyal
      ? 'bg-[#1E293B] text-white border-[#334155] hover:border-[#4169E1] hover:bg-[#334155]'
      : isHydrangea
      ? 'bg-[#341344] text-white border-[#4E2064] hover:border-[#AD56C4] hover:bg-[#45195A]'
      : isCalifornia
      ? 'bg-[#1B2F3B] text-white border-[#2B4B5C] hover:border-[#66C4FF] hover:bg-[#243d4d]'
      : isMossy
      ? 'bg-[#343823] text-white border-[#4E5434] hover:border-[#D4DE95] hover:bg-[#43492e]'
      : isInkWash
      ? 'bg-[#303438] text-white border-[#4A4F55] hover:border-[#6D8196] hover:bg-[#3d4348]'
      : isPeach
      ? 'bg-[#382622] text-white border-[#543A34] hover:border-[#E39A7B] hover:bg-[#4a332d]'
      : isStormy
      ? 'bg-[#283542] text-white border-[#3E5164] hover:border-[#88BDF2] hover:bg-[#354657]'
      : 'bg-[#2C5240] text-white border-[#3A6B54] hover:border-[#C8A96A] hover:bg-[#35614c]'
  }`;

  const tickerBg = isRoyal
    ? 'bg-[#1E293B] text-white border-[#334155]'
    : isHydrangea
    ? 'bg-[#341344] text-white border-[#4E2064]'
    : isCalifornia
    ? 'bg-[#1B2F3B] text-white border-[#2B4B5C]'
    : isMossy
    ? 'bg-[#343823] text-white border-[#4E5434]'
    : isInkWash
    ? 'bg-[#303438] text-white border-[#4A4F55]'
    : isPeach
    ? 'bg-[#382622] text-white border-[#543A34]'
    : isStormy
    ? 'bg-[#283542] text-white border-[#3E5164]'
    : 'bg-[#2C5240] text-white border-[#3A6B54]';

  const tickerText = isRoyal
    ? 'text-[#93C5FD]'
    : isHydrangea
    ? 'text-[#FF9CE9]'
    : isCalifornia
    ? 'text-[#66F4FF]'
    : isMossy
    ? 'text-[#D4DE95]'
    : isInkWash
    ? 'text-[#CBCBCB]'
    : isPeach
    ? 'text-[#DBB06B]'
    : isStormy
    ? 'text-[#88BDF2]'
    : 'text-[#CFE0D5]';

  const tickerCurrency = isRoyal
    ? 'text-[#E2E8F0]'
    : isHydrangea
    ? 'text-[#FFC2BA]'
    : isCalifornia
    ? 'text-[#FFC067]'
    : isMossy
    ? 'text-[#D4DE95]'
    : isInkWash
    ? 'text-[#FFFFE3]'
    : isPeach
    ? 'text-[#FFD3AC]'
    : isStormy
    ? 'text-[#BDDDFC]'
    : 'text-[#E8F0EA]';

  const currencySelectBg = isRoyal
    ? 'bg-[#1E293B] text-white border-[#334155] focus:border-[#4169E1]'
    : isHydrangea
    ? 'bg-[#341344] text-white border-[#4E2064] focus:border-[#AD56C4]'
    : isCalifornia
    ? 'bg-[#1B2F3B] text-white border-[#2B4B5C] focus:border-[#66C4FF]'
    : isMossy
    ? 'bg-[#343823] text-white border-[#4E5434] focus:border-[#D4DE95]'
    : isInkWash
    ? 'bg-[#303438] text-white border-[#4A4F55] focus:border-[#6D8196]'
    : isPeach
    ? 'bg-[#382622] text-white border-[#543A34] focus:border-[#E39A7B]'
    : isStormy
    ? 'bg-[#283542] text-white border-[#3E5164] focus:border-[#88BDF2]'
    : 'bg-[#2C5240] text-white border-[#3A6B54] focus:border-[#C8A96A]';

  const profileBtnBg = isRoyal
    ? 'border-[#334155] bg-[#1E293B]'
    : isHydrangea
    ? 'border-[#4E2064] bg-[#341344]'
    : isCalifornia
    ? 'border-[#2B4B5C] bg-[#1B2F3B]'
    : isMossy
    ? 'border-[#4E5434] bg-[#343823]'
    : isInkWash
    ? 'border-[#4A4F55] bg-[#303438]'
    : isPeach
    ? 'border-[#543A34] bg-[#382622]'
    : isStormy
    ? 'border-[#3E5164] bg-[#283542]'
    : 'border-[#3A6B54] bg-[#2C5240]';

  const searchIconColor = isRoyal
    ? 'text-[#94A3B8]'
    : isHydrangea
    ? 'text-[#FF9CE9]'
    : isCalifornia
    ? 'text-[#66F4FF]'
    : isMossy
    ? 'text-[#BAC095]'
    : isInkWash
    ? 'text-[#CBCBCB]'
    : isPeach
    ? 'text-[#FFD3AC]'
    : isStormy
    ? 'text-[#88BDF2]'
    : 'text-[#A0B9A8]';

  const profileSubText = isRoyal
    ? 'text-[#94A3B8]'
    : isHydrangea
    ? 'text-[#FFC2BA]'
    : isCalifornia
    ? 'text-[#BACDD6]'
    : isMossy
    ? 'text-[#BAC095]'
    : isInkWash
    ? 'text-[#CBCBCB]'
    : isPeach
    ? 'text-[#FFD3AC]'
    : isStormy
    ? 'text-[#BDDDFC]'
    : 'text-[#CFE0D5]';

  return (
    <header className={`sticky top-0 z-30 ${headerBg} px-6 py-2.5 transition-colors shadow-md`}>
      {/* ========================================================
          LINE 1: Corporate Context Controls & Quick Action Tools
          All uniform h-9 buttons with ample breathing room
          ======================================================== */}
      <div className="w-full flex items-center justify-between gap-2.5 sm:gap-4 pb-2.5 border-b border-white/10">
        
        {/* Left Side: Currency Selector & Conversion FX Feed */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Display Currency Switcher */}
          <div className="relative shrink-0">
            <select
              id="currency-selector"
              value={activeCurrency.code}
              onChange={(e) => onSelectCurrency(e.target.value)}
              className={`h-9 text-xs font-mono border rounded-lg px-2.5 focus:outline-none text-center cursor-pointer font-bold shadow-xs ${currencySelectBg}`}
              title="Display Currency"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code} className="bg-[#1F3A2E] text-white">
                  {curr.code} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Conversion Tab: Live Bangladesh Bank & Interbank FX Feed Ticker (Line 1 beside US($)) */}
          <div
            id="header-live-fx-ticker"
            role="button"
            tabIndex={0}
            onClick={() => {
              if (onOpenForexSync) {
                onOpenForexSync();
              } else if (onSelectTab) {
                onSelectTab('FINANCE');
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (onOpenForexSync) {
                  onOpenForexSync();
                } else if (onSelectTab) {
                  onSelectTab('FINANCE');
                }
              }
            }}
            className={`flex items-center gap-2.5 h-9 px-3.5 rounded-lg border text-xs shrink-0 cursor-pointer transition-all hover:border-[#C8A96A]/60 select-none ${tickerBg}`}
            title="Live Currency Conversion Rates & Bangladesh Bank FX Feed (USD, BDT, GBP, EUR, AUD). Click to view full statutory rate matrix."
          >
            <div className={`flex items-center gap-1.5 font-medium ${tickerText}`}>
              <div className="relative flex items-center">
                <TrendingUp className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[11px] font-bold tracking-wider">Conversion:</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              {currencies.filter(c => c.code !== 'USD').map((curr) => (
                <span key={curr.code} className={`font-mono ${tickerCurrency}`}>
                  {curr.code}: <span className="text-[#C8A96A] font-semibold">{curr.rateToUsd}</span>
                </span>
              ))}
            </div>
            {onRefreshForex && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRefreshForex();
                }}
                disabled={isForexSyncing}
                className="ml-1 p-1 rounded-md text-white/50 hover:text-[#C8A96A] hover:bg-white/10 transition-colors disabled:opacity-50"
                title="Sync live rates now from Bangladesh Bank & Interbank feed"
              >
                <RefreshCw className={`w-3 h-3 ${isForexSyncing ? 'animate-spin text-[#C8A96A]' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Operational Tools (Comm Hub, Database, AI, Utilities) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Communication Hub Tab Button (Line 1) */}
          {onSelectTab && (
            <button
              id="header-comm-hub-tab-btn"
              type="button"
              onClick={() => onSelectTab('COMMUNICATIONS')}
              className={`h-9 flex items-center gap-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer select-none shrink-0 whitespace-nowrap ${
                activeTab === 'COMMUNICATIONS'
                  ? 'bg-[#C8A96A] text-[#1F3A2E] border-[#C8A96A] shadow-md ring-1 ring-[#C8A96A]/30 font-bold'
                  : toolBtn
              }`}
              title="Communication Hub - Real-time Supplier, Buyer & Enterprise Chat, Video Conference and Announcements"
            >
              <div className="relative flex items-center">
                <Video className={`w-3.5 h-3.5 ${activeTab === 'COMMUNICATIONS' ? 'text-[#1F3A2E]' : 'text-[#C8A96A]'}`} />
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="font-heading tracking-wide">Comm Hub</span>
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
          )}

          {/* Database Persistence Status & Sync Center */}
          {onOpenDatabaseSettings && (
            <button
              id="header-database-settings-btn"
              type="button"
              onClick={onOpenDatabaseSettings}
              className={`${toolBtn} shrink-0 whitespace-nowrap`}
              title="ArielMC ERP PostgreSQL Database & Persistent Storage Center (Supabase)"
            >
              <div className="relative flex items-center">
                <Database className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${isDatabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              </div>
              <span>Database</span>
            </button>
          )}

          {/* ArielMC AI Copilot Button (Compact & Sleek) */}
          {onOpenArielAi && (
            <button
              id="header-arielmc-ai-btn"
              type="button"
              onClick={onOpenArielAi}
              className={`h-9 flex items-center gap-2 px-3 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap select-none ${
                isArielAiOpen
                  ? 'bg-gradient-to-r from-[#C8A96A] to-[#E5C992] text-[#1F3A2E] border-[#C8A96A] shadow-md ring-2 ring-[#C8A96A]/40 font-bold'
                  : toolBtn
              }`}
              title="ArielMC AI / Online Assistant - Autonomous Operations Copilot"
            >
              <div className="relative flex items-center">
                <Bot className={`w-4 h-4 ${isArielAiOpen ? 'text-[#1F3A2E]' : 'text-[#C8A96A]'}`} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-black/30 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-heading font-bold text-xs tracking-tight">ArielMC AI</span>
                <span className="hidden 2xl:inline text-white/40 text-[10px]">/</span>
                <span className={`text-[10px] font-medium hidden 2xl:inline ${isArielAiOpen ? 'text-[#1F3A2E]' : 'text-emerald-400'}`}>Online Assistant</span>
              </div>
            </button>
          )}

          {/* Quick Office Utilities Launcher */}
          {onSelectTab && (
            <button
              id="header-utilities-btn"
              type="button"
              onClick={() => onSelectTab('UTILITIES')}
              className={`h-9 flex items-center gap-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap select-none ${
                activeTab === 'UTILITIES'
                  ? 'bg-[#C8A96A] text-[#1F3A2E] border-[#C8A96A] font-bold shadow-md'
                  : toolBtn
              }`}
              title="Office & Enterprise Utilities (Calculator, Note Pad, To Do / Calendar, Messages, Contacts, Wallet, Maps, Translator)"
            >
              <Wrench className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Utilities</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                activeTab === 'UTILITIES' ? 'bg-[#1F3A2E] text-[#C8A96A]' : 'bg-slate-800 text-slate-300'
              }`}>
                8
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          LINE 2: Left (Theme, Favorite Pages) & Right (Search, Notifications, Profile)
          ======================================================== */}
      <div className="w-full flex items-center justify-between gap-2.5 sm:gap-4 pt-2.5">
        
        {/* Left Side: Theme Selector & Favorite Pages */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Color Scheme Dropdown (Line 2) */}
          <div className="relative" ref={themeMenuRef}>
            <button
              id="theme-profile-selector-btn"
              type="button"
              onClick={() => {
                setIsThemeMenuOpen(prev => !prev);
              }}
              className={`${toolBtnH10} shrink-0 whitespace-nowrap`}
              title="ERP Color Scheme & Theme Profile"
            >
              <Palette className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span className="hidden sm:inline">
                {theme === 'crm-green'
                  ? 'Heritage Leather & Sand'
                  : theme === 'royal-blue'
                  ? 'Royal Blue'
                  : theme === 'hydrangea'
                  ? 'Hydrangea'
                  : theme === 'california-beaches'
                  ? 'California Beaches'
                  : theme === 'mossy-hollow'
                  ? 'Mossy Hollow'
                  : theme === 'ink-wash'
                  ? 'Ink Wash'
                  : theme === 'fresh-peach'
                  ? 'Fresh Peach'
                  : theme === 'stormy-morning'
                  ? 'Stormy Morning'
                  : 'Heritage Leather & Sand'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#C8A96A] transition-transform duration-200 ${isThemeMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Theme Dropdown Menu */}
            {isThemeMenuOpen && (
              <div 
                className="absolute left-0 mt-2 w-72 bg-white border border-[#DDE3DD] rounded-xl shadow-2xl p-2 text-[#1A1A1A] animate-in fade-in slide-in-from-top-1 duration-150 max-h-96 overflow-y-auto"
                style={{ zIndex: 9999 }}
              >
                <div className="px-3 py-2 border-b border-[#DDE3DD] text-[11px] font-semibold text-[#6B7269] uppercase tracking-wider flex items-center justify-between sticky top-0 bg-white z-10">
                  <span>ERP Color Scheme</span>
                  <Palette className="w-3.5 h-3.5 text-[#1F3A2E]" />
                </div>
                <div className="mt-1 space-y-1 text-xs">
                  {/* Option 1: Heritage Leather & Sand */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectTheme?.('crm-green');
                      setIsThemeMenuOpen(false);
                    }}
                    onClick={() => {
                      onSelectTheme?.('crm-green');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      theme === 'crm-green'
                        ? 'bg-[#E8F0EA] border border-[#C8A96A] text-[#1F3A2E] font-bold shadow-xs'
                        : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex items-center -space-x-1 shrink-0 p-0.5 rounded-full bg-slate-100 border border-slate-200">
                        {['#1F3A2E', '#C8A96A', '#3A6B54', '#FAF9F5'].map((c, i) => (
                          <span key={i} className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-snug text-[#1F3A2E] truncate">Heritage Leather &amp; Sand</div>
                        <div className="text-[10px] text-[#6B7269] leading-tight truncate">Deep Sourcing Forest &amp; Gold</div>
                      </div>
                    </div>
                    {theme === 'crm-green' && <Check className="w-3.5 h-3.5 text-[#1F3A2E] shrink-0 ml-1.5" />}
                  </button>

                  {/* Option 2: Royal Blue */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectTheme?.('royal-blue');
                      setIsThemeMenuOpen(false);
                    }}
                    onClick={() => {
                      onSelectTheme?.('royal-blue');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      theme === 'royal-blue'
                        ? 'bg-[#EFF6FF] border border-[#4169E1] text-[#1E3A8A] font-bold shadow-xs'
                        : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex items-center -space-x-1 shrink-0 p-0.5 rounded-full bg-slate-100 border border-slate-200">
                        {['#0F172A', '#4169E1', '#60A5FA', '#EFF6FF'].map((c, i) => (
                          <span key={i} className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-snug text-[#1E3A8A] truncate">Royal Blue</div>
                        <div className="text-[10px] text-[#64748B] leading-tight truncate">Royal Blue &amp; Ivory White</div>
                      </div>
                    </div>
                    {theme === 'royal-blue' && <Check className="w-3.5 h-3.5 text-[#4169E1] shrink-0 ml-1.5" />}
                  </button>

                  {/* Option 3: Hydrangea */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectTheme?.('hydrangea');
                      setIsThemeMenuOpen(false);
                    }}
                    onClick={() => {
                      onSelectTheme?.('hydrangea');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      theme === 'hydrangea'
                        ? 'bg-[#FDF2F8] border border-[#AD56C4] text-[#701A75] font-bold shadow-xs'
                        : 'hover:bg-[#FDF4F8] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex items-center -space-x-1 shrink-0 p-0.5 rounded-full bg-slate-100 border border-slate-200">
                        {['#FF8DA1', '#FFC2BA', '#FF9CE9', '#AD56C4'].map((c, i) => (
                          <span key={i} className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-snug text-[#701A75] truncate">Hydrangea</div>
                        <div className="text-[10px] text-[#A21CAF] leading-tight truncate">Rose Pink, Soft Blush &amp; Violet</div>
                      </div>
                    </div>
                    {theme === 'hydrangea' && <Check className="w-3.5 h-3.5 text-[#AD56C4] shrink-0 ml-1.5" />}
                  </button>

                  {/* Option 4: California beaches */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectTheme?.('california-beaches');
                      setIsThemeMenuOpen(false);
                    }}
                    onClick={() => {
                      onSelectTheme?.('california-beaches');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      theme === 'california-beaches'
                        ? 'bg-[#EBF7FF] border border-[#66C4FF] text-[#103E5C] font-bold shadow-xs'
                        : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex items-center -space-x-1 shrink-0 p-0.5 rounded-full bg-slate-100 border border-slate-200">
                        {['#F09A37', '#66C4FF', '#A3E3FF', '#4C6A78'].map((c, i) => (
                          <span key={i} className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-snug text-[#103E5C] truncate">California Beaches</div>
                        <div className="text-[10px] text-[#4C6A78] leading-tight truncate">Amber Sand, Cyan Foam &amp; Ocean Slate</div>
                      </div>
                    </div>
                    {theme === 'california-beaches' && <Check className="w-3.5 h-3.5 text-[#248AC8] shrink-0 ml-1.5" />}
                  </button>

                  {/* Option 5: Mossy hollow */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectTheme?.('mossy-hollow');
                      setIsThemeMenuOpen(false);
                    }}
                    onClick={() => {
                      onSelectTheme?.('mossy-hollow');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      theme === 'mossy-hollow'
                        ? 'bg-[#F4F7EB] border border-[#8F9E6D] text-[#2F3A1D] font-bold shadow-xs'
                        : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex items-center -space-x-1 shrink-0 p-0.5 rounded-full bg-slate-100 border border-slate-200">
                        {['#46532B', '#8F9E6D', '#B5C088', '#3F352B'].map((c, i) => (
                          <span key={i} className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-snug text-[#2F3A1D] truncate">Mossy Hollow</div>
                        <div className="text-[10px] text-[#6B7269] leading-tight truncate">Olive Moss, Pale Chartreuse &amp; Bark Lichen</div>
                      </div>
                    </div>
                    {theme === 'mossy-hollow' && <Check className="w-3.5 h-3.5 text-[#46532B] shrink-0 ml-1.5" />}
                  </button>

                  {/* Option 6: Ink wash */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectTheme?.('ink-wash');
                      setIsThemeMenuOpen(false);
                    }}
                    onClick={() => {
                      onSelectTheme?.('ink-wash');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      theme === 'ink-wash'
                        ? 'bg-[#F2F4F7] border border-[#6D8196] text-[#24272A] font-bold shadow-xs'
                        : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex items-center -space-x-1 shrink-0 p-0.5 rounded-full bg-slate-100 border border-slate-200">
                        {['#4A4A4A', '#CBCBCB', '#FFFFE3', '#6D8196'].map((c, i) => (
                          <span key={i} className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-snug text-[#24272A] truncate">Ink Wash</div>
                        <div className="text-[10px] text-[#6B7269] leading-tight truncate">Sumi Charcoal, Rice Paper &amp; Slate Wash</div>
                      </div>
                    </div>
                    {theme === 'ink-wash' && <Check className="w-3.5 h-3.5 text-[#6D8196] shrink-0 ml-1.5" />}
                  </button>

                  {/* Option 7: Fresh peach */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectTheme?.('fresh-peach');
                      setIsThemeMenuOpen(false);
                    }}
                    onClick={() => {
                      onSelectTheme?.('fresh-peach');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      theme === 'fresh-peach'
                        ? 'bg-[#FFF3EB] border border-[#E39A7B] text-[#2A1D1A] font-bold shadow-xs'
                        : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex items-center -space-x-1 shrink-0 p-0.5 rounded-full bg-slate-100 border border-slate-200">
                        {['#FFD3AC', '#FFB5AB', '#E39A7B', '#DBB06B'].map((c, i) => (
                          <span key={i} className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-snug text-[#2A1D1A] truncate">Fresh Peach</div>
                        <div className="text-[10px] text-[#6B7269] leading-tight truncate">Soft Peach, Coral Blush &amp; Terracotta Clay</div>
                      </div>
                    </div>
                    {theme === 'fresh-peach' && <Check className="w-3.5 h-3.5 text-[#E39A7B] shrink-0 ml-1.5" />}
                  </button>

                  {/* Option 8: Stormy morning */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectTheme?.('stormy-morning');
                      setIsThemeMenuOpen(false);
                    }}
                    onClick={() => {
                      onSelectTheme?.('stormy-morning');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      theme === 'stormy-morning'
                        ? 'bg-[#EBF4FC] border border-[#88BDF2] text-[#1E2730] font-bold shadow-xs'
                        : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex items-center -space-x-1 shrink-0 p-0.5 rounded-full bg-slate-100 border border-slate-200">
                        {['#6A89A7', '#BDDDFC', '#88BDF2', '#384959'].map((c, i) => (
                          <span key={i} className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-snug text-[#1E2730] truncate">Stormy Morning</div>
                        <div className="text-[10px] text-[#6B7269] leading-tight truncate">Storm Steel Blue, Ice Mist &amp; Deep Slate</div>
                      </div>
                    </div>
                    {theme === 'stormy-morning' && <Check className="w-3.5 h-3.5 text-[#6A89A7] shrink-0 ml-1.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Favorite Pages Dropdown Menu */}
          <div className="relative" ref={favoritesMenuRef}>
            <button
              id="header-favorite-pages-menu-btn"
              type="button"
              onClick={() => setIsFavoritesMenuOpen((prev) => !prev)}
              className={`h-10 flex items-center gap-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer select-none shrink-0 ${
                favoritePages.length > 0
                  ? 'bg-amber-500/10 text-amber-300 border-amber-400/40 hover:bg-amber-500/20'
                  : toolBtnH10
              }`}
              title="Favorite Pages - Quick Access List"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="hidden sm:inline">Favorite Pages</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[9px] font-bold border border-amber-400/40">
                {favoritePages.length}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#C8A96A] transition-transform duration-200 ${
                  isFavoritesMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isFavoritesMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-80 bg-white border border-[#DDE3DD] rounded-xl shadow-2xl p-2 text-[#1A1A1A] animate-in fade-in slide-in-from-top-1 duration-150 z-50 max-h-96 overflow-y-auto"
                style={{ zIndex: 9999 }}
              >
                <div className="px-3 py-2 border-b border-[#DDE3DD] text-[11px] font-semibold text-[#6B7269] uppercase tracking-wider flex items-center justify-between sticky top-0 bg-white z-10">
                  <div className="flex items-center gap-1.5 text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>Favorite Pages ({favoritePages.length})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 normal-case font-normal">
                    Click to navigate
                  </span>
                </div>

                {favoritePages.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700">No favorite pages pinned yet</p>
                    <p className="text-[11px]">
                      Click the ⭐ Add to Fav icon on any page header or sidebar to pin it here.
                    </p>
                  </div>
                ) : (
                  <div className="mt-1 space-y-1">
                    {favoritePages.map((favId) => {
                      const meta = ALL_PAGE_DEFINITIONS[favId];
                      if (!meta) return null;
                      const isCurrent = activeTab === (meta.targetTab || favId);
                      return (
                        <div
                          key={`header-fav-${favId}`}
                          className="flex items-center justify-between group/hfav rounded-lg hover:bg-slate-50 transition p-1"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectFavorite) {
                                onSelectFavorite(favId);
                              } else if (meta.targetTab) {
                                onSelectTab?.(meta.targetTab);
                              } else {
                                onSelectTab?.(favId as ActiveTab);
                              }
                              setIsFavoritesMenuOpen(false);
                            }}
                            className={`flex-1 flex items-center justify-between px-2.5 py-1.5 rounded-md text-left text-xs transition cursor-pointer ${
                              isCurrent
                                ? 'bg-amber-100/70 text-amber-900 font-bold border border-amber-300'
                                : 'text-slate-800'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="font-semibold text-xs truncate flex items-center gap-1.5">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
                                <span>{meta.label}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                {meta.category}
                              </div>
                            </div>
                            {meta.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono shrink-0">
                                {meta.badge}
                              </span>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite?.(favId);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition cursor-pointer"
                            title={`Remove "${meta.label}" from Favorites`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Global Search Bar, Notifications Bell & Executive Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto">
          {/* Search Bar - Positioned just before Notification & Profile */}
          <div className="relative w-44 sm:w-52 md:w-64 lg:w-72 xl:w-80">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${searchIconColor}`} />
            <input
              id="global-erp-search"
              type="text"
              placeholder="Search SKUs, POs, buyers, factories..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (e.target.value.trim() && onOpenSearchWindow) {
                  onOpenSearchWindow();
                }
              }}
              onFocus={() => {
                if (searchQuery.trim() && onOpenSearchWindow) {
                  onOpenSearchWindow();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onOpenSearchWindow?.();
                }
                if (e.key === 'Escape') {
                  onCloseSearchWindow?.();
                }
              }}
              className={`w-full min-w-0 h-10 pl-10 pr-8 text-xs rounded-lg border transition-all shadow-inner focus:outline-none focus:ring-1 focus:ring-[#C8A96A] ${searchBoxBg}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  onCloseSearchWindow?.();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1 rounded-full cursor-pointer transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Station Notifications Bell - Just after Search Bar / Just before Profile */}
          <button 
            id="header-notifications-btn"
            type="button"
            className={notifBtnH10}
            title="Station Notifications"
          >
            <Bell className="w-4 h-4 text-white" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#C8A96A] ring-2 ring-[#1F3A2E]" />
          </button>

          {/* Executive User Profile & Account Control (Prominent on Line 2) */}
          <button
            id="header-user-profile-btn"
            type="button"
            onClick={onOpenProfileControl || onOpenAuthModal}
            className={`h-10 flex items-center gap-2.5 px-3 rounded-lg border transition-all cursor-pointer hover:bg-white/10 shrink-0 whitespace-nowrap select-none ${profileBtnBg}`}
            title="ArielMC Profile Control & 2SA Center (Click to manage profile, password, and users)"
          >
            <div 
              className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shadow-xs shrink-0 overflow-hidden"
              style={{
                backgroundColor: currentUser?.avatarColor || '#C8A96A',
                color: '#1F3A2E'
              }}
            >
              {currentUser?.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                currentUser?.avatarInitials || 'AMC'
              )}
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <div className="font-bold text-white text-xs flex items-center gap-1.5 whitespace-nowrap">
                <span>{currentUser?.name || 'Syed Akramul Hassan'}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C8A96A] text-[#1F3A2E] font-bold">
                  SUPER ADMIN
                </span>
              </div>
              <div className={`text-[10px] flex items-center gap-1 whitespace-nowrap ${profileSubText}`}>
                <ShieldCheck className="w-3 h-3 text-[#C8A96A]" />
                <span>{currentUser?.designation || 'Managing Director & Founder'}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#C8A96A] ml-0.5 shrink-0" />
          </button>
        </div>
      </div>
    </header>
  );
};
