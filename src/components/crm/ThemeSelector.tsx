'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, ChevronDown, Check } from 'lucide-react';

export interface ThemeOption {
  id: string;
  name: string;
  subtitle: string;
  swatches: string[];
  activeBg: string;
  border: string;
  textColor: string;
  checkColor: string;
}

export interface ThemeTokens {
  id: string;
  name: string;
  sidebarBg: string;
  sidebarHeaderBg: string;
  sidebarBorder: string;
  sidebarFooterBg: string;
  sidebarActionBtnBg: string;
  sidebarActiveItem: string;
  sidebarInactiveItem: string;
  sidebarSectionText: string;
  sidebarSubtext: string;
  sidebarPulseBox: string;
  sidebarBadgeActive: string;
  sidebarBadgeInactive: string;
  headerIconBg: string;
  headerIconBorder: string;
  headerIconText: string;
  headerPrimaryBtn: string;
  headerPrimaryBtnText: string;
  accentText: string;
  accentBorder: string;
  accentBg: string;
  cardHighlightBg: string;
  cardHighlightBorder: string;
  tableHeaderHex: string;
  darkCardHex: string;
  darkCardBorderHex: string;
  darkCardSubtextHex: string;
}

export const ERP_THEMES: ThemeOption[] = [
  {
    id: 'crm-green',
    name: 'Heritage Leather & Sand',
    subtitle: 'Deep Sourcing Forest & Gold (Canonical ERP)',
    swatches: ['#1F3A2E', '#C8A96A', '#3A6B54', '#FAF9F5'],
    activeBg: 'bg-[#E8F0EA]',
    border: 'border-[#C8A96A]',
    textColor: 'text-[#1F3A2E]',
    checkColor: 'text-[#1F3A2E]'
  },
  {
    id: 'royal-blue',
    name: 'Royal Blue',
    subtitle: 'Royal Blue & Ivory White',
    swatches: ['#0F172A', '#4169E1', '#60A5FA', '#EFF6FF'],
    activeBg: 'bg-[#EFF6FF]',
    border: 'border-[#4169E1]',
    textColor: 'text-[#1E3A8A]',
    checkColor: 'text-[#4169E1]'
  },
  {
    id: 'hydrangea',
    name: 'Hydrangea',
    subtitle: 'Rose Pink, Soft Blush & Violet',
    swatches: ['#FF8DA1', '#FFC2BA', '#FF9CE9', '#AD56C4'],
    activeBg: 'bg-[#FDF2F8]',
    border: 'border-[#AD56C4]',
    textColor: 'text-[#701A75]',
    checkColor: 'text-[#AD56C4]'
  },
  {
    id: 'california-beaches',
    name: 'California Beaches',
    subtitle: 'Amber Sand, Cyan Foam & Ocean Slate',
    swatches: ['#F09A37', '#66C4FF', '#A3E3FF', '#4C6A78'],
    activeBg: 'bg-[#EBF7FF]',
    border: 'border-[#66C4FF]',
    textColor: 'text-[#103E5C]',
    checkColor: 'text-[#248AC8]'
  },
  {
    id: 'mossy-hollow',
    name: 'Mossy Hollow',
    subtitle: 'Olive Moss, Pale Chartreuse & Bark Lichen',
    swatches: ['#46532B', '#8F9E6D', '#B5C088', '#3F352B'],
    activeBg: 'bg-[#F4F7EB]',
    border: 'border-[#8F9E6D]',
    textColor: 'text-[#2F3A1D]',
    checkColor: 'text-[#46532B]'
  },
  {
    id: 'ink-wash',
    name: 'Ink Wash',
    subtitle: 'Sumi Charcoal, Rice Paper & Slate Wash',
    swatches: ['#4A4A4A', '#CBCBCB', '#FFFFE3', '#6D8196'],
    activeBg: 'bg-[#F2F4F7]',
    border: 'border-[#6D8196]',
    textColor: 'text-[#24272A]',
    checkColor: 'text-[#6D8196]'
  },
  {
    id: 'fresh-peach',
    name: 'Fresh Peach',
    subtitle: 'Soft Peach, Coral Blush & Terracotta Clay',
    swatches: ['#FFD3AC', '#FFB5AB', '#E39A7B', '#DBB06B'],
    activeBg: 'bg-[#FFF3EB]',
    border: 'border-[#E39A7B]',
    textColor: 'text-[#2A1D1A]',
    checkColor: 'text-[#E39A7B]'
  },
  {
    id: 'stormy-morning',
    name: 'Stormy Morning',
    subtitle: 'Storm Steel Blue, Ice Mist & Deep Slate',
    swatches: ['#6A89A7', '#BDDDFC', '#88BDF2', '#384959'],
    activeBg: 'bg-[#EBF4FC]',
    border: 'border-[#88BDF2]',
    textColor: 'text-[#1E2730]',
    checkColor: 'text-[#6A89A7]'
  }
];

export const getThemeTokens = (themeId: string): ThemeTokens => {
  switch (themeId) {
    case 'royal-blue':
      return {
        id: 'royal-blue',
        name: 'Royal Blue',
        sidebarBg: 'bg-[#0B132B]',
        sidebarHeaderBg: 'bg-[#0F172A]',
        sidebarBorder: 'border-[#1E293B]',
        sidebarFooterBg: 'bg-[#0F172A]',
        sidebarActionBtnBg: 'bg-[#1E293B] hover:bg-[#2A3C52] text-white border border-[#334155]',
        sidebarActiveItem: 'bg-[#4169E1] text-white font-bold shadow-md shadow-[#4169E1]/20 border border-[#60A5FA]/40',
        sidebarInactiveItem: 'text-[#93C5FD] hover:bg-[#1E293B] hover:text-white',
        sidebarSectionText: 'text-[#60A5FA]',
        sidebarSubtext: 'text-[#93C5FD]',
        sidebarPulseBox: 'bg-[#0F172A] border-[#1E293B]',
        sidebarBadgeActive: 'bg-white/20 text-white',
        sidebarBadgeInactive: 'bg-[#1E293B] text-[#93C5FD]',
        headerIconBg: 'bg-[#EFF6FF]',
        headerIconBorder: 'border-[#3B82F6]/40',
        headerIconText: 'text-[#1E3A8A]',
        headerPrimaryBtn: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white',
        headerPrimaryBtnText: 'text-white',
        accentText: 'text-[#2563EB]',
        accentBorder: 'border-[#3B82F6]',
        accentBg: 'bg-[#4169E1]',
        cardHighlightBg: 'bg-[#EFF6FF]',
        cardHighlightBorder: 'border-[#3B82F6]',
        tableHeaderHex: '#0F172A',
        darkCardHex: '#0B132B',
        darkCardBorderHex: '#1E293B',
        darkCardSubtextHex: '#60A5FA'
      };
    case 'hydrangea':
      return {
        id: 'hydrangea',
        name: 'Hydrangea',
        sidebarBg: 'bg-[#230C2E]',
        sidebarHeaderBg: 'bg-[#1C0824]',
        sidebarBorder: 'border-[#3D1A4D]',
        sidebarFooterBg: 'bg-[#1C0824]',
        sidebarActionBtnBg: 'bg-[#341344] hover:bg-[#4E2064] text-white border border-[#4E2064]',
        sidebarActiveItem: 'bg-[#AD56C4] text-white font-bold shadow-md shadow-[#AD56C4]/30 border border-[#C084FC]/40',
        sidebarInactiveItem: 'text-[#FFC2BA] hover:bg-[#341344] hover:text-white',
        sidebarSectionText: 'text-[#FF8DA1]',
        sidebarSubtext: 'text-[#FF9CE9]',
        sidebarPulseBox: 'bg-[#1C0824] border-[#3D1A4D]',
        sidebarBadgeActive: 'bg-white/20 text-white',
        sidebarBadgeInactive: 'bg-[#341344] text-[#FFC2BA]',
        headerIconBg: 'bg-[#FDF2F8]',
        headerIconBorder: 'border-[#AD56C4]/40',
        headerIconText: 'text-[#701A75]',
        headerPrimaryBtn: 'bg-[#AD56C4] hover:bg-[#9333EA] text-white',
        headerPrimaryBtnText: 'text-white',
        accentText: 'text-[#AD56C4]',
        accentBorder: 'border-[#AD56C4]',
        accentBg: 'bg-[#AD56C4]',
        cardHighlightBg: 'bg-[#FDF2F8]',
        cardHighlightBorder: 'border-[#AD56C4]',
        tableHeaderHex: '#1C0824',
        darkCardHex: '#230C2E',
        darkCardBorderHex: '#3D1A4D',
        darkCardSubtextHex: '#FF8DA1'
      };
    case 'california-beaches':
      return {
        id: 'california-beaches',
        name: 'California Beaches',
        sidebarBg: 'bg-[#14232C]',
        sidebarHeaderBg: 'bg-[#0E1A21]',
        sidebarBorder: 'border-[#203642]',
        sidebarFooterBg: 'bg-[#0E1A21]',
        sidebarActionBtnBg: 'bg-[#1B2F3B] hover:bg-[#2B4B5C] text-white border border-[#2B4B5C]',
        sidebarActiveItem: 'bg-[#66C4FF] text-[#0E1A21] font-bold shadow-md shadow-[#66C4FF]/25 border border-[#38BDF8]/40',
        sidebarInactiveItem: 'text-[#BACDD6] hover:bg-[#1B2F3B] hover:text-white',
        sidebarSectionText: 'text-[#FFC067]',
        sidebarSubtext: 'text-[#66F4FF]',
        sidebarPulseBox: 'bg-[#0E1A21] border-[#203642]',
        sidebarBadgeActive: 'bg-[#0E1A21]/30 text-[#0E1A21]',
        sidebarBadgeInactive: 'bg-[#1B2F3B] text-[#BACDD6]',
        headerIconBg: 'bg-[#EBF7FF]',
        headerIconBorder: 'border-[#66C4FF]/40',
        headerIconText: 'text-[#103E5C]',
        headerPrimaryBtn: 'bg-[#0284C7] hover:bg-[#0369A1] text-white',
        headerPrimaryBtnText: 'text-[#FFC067]',
        accentText: 'text-[#0284C7]',
        accentBorder: 'border-[#66C4FF]',
        accentBg: 'bg-[#66C4FF]',
        cardHighlightBg: 'bg-[#EBF7FF]',
        cardHighlightBorder: 'border-[#66C4FF]',
        tableHeaderHex: '#0E1A21',
        darkCardHex: '#14232C',
        darkCardBorderHex: '#203642',
        darkCardSubtextHex: '#66C4FF'
      };
    case 'mossy-hollow':
      return {
        id: 'mossy-hollow',
        name: 'Mossy Hollow',
        sidebarBg: 'bg-[#282B1B]',
        sidebarHeaderBg: 'bg-[#1D2013]',
        sidebarBorder: 'border-[#3D4127]',
        sidebarFooterBg: 'bg-[#1D2013]',
        sidebarActionBtnBg: 'bg-[#343823] hover:bg-[#4E5434] text-white border border-[#4E5434]',
        sidebarActiveItem: 'bg-[#D4DE95] text-[#1D2013] font-bold shadow-md shadow-[#D4DE95]/25 border border-[#A3E635]/40',
        sidebarInactiveItem: 'text-[#DCE0C5] hover:bg-[#343823] hover:text-white',
        sidebarSectionText: 'text-[#D4DE95]',
        sidebarSubtext: 'text-[#D4DE95]',
        sidebarPulseBox: 'bg-[#1D2013] border-[#3D4127]',
        sidebarBadgeActive: 'bg-[#1D2013]/30 text-[#1D2013]',
        sidebarBadgeInactive: 'bg-[#343823] text-[#DCE0C5]',
        headerIconBg: 'bg-[#F4F7EB]',
        headerIconBorder: 'border-[#8F9E6D]/40',
        headerIconText: 'text-[#2F3A1D]',
        headerPrimaryBtn: 'bg-[#46532B] hover:bg-[#3B4624] text-white',
        headerPrimaryBtnText: 'text-[#D4DE95]',
        accentText: 'text-[#46532B]',
        accentBorder: 'border-[#8F9E6D]',
        accentBg: 'bg-[#8F9E6D]',
        cardHighlightBg: 'bg-[#F4F7EB]',
        cardHighlightBorder: 'border-[#8F9E6D]',
        tableHeaderHex: '#1D2013',
        darkCardHex: '#282B1B',
        darkCardBorderHex: '#3D4127',
        darkCardSubtextHex: '#D4DE95'
      };
    case 'ink-wash':
      return {
        id: 'ink-wash',
        name: 'Ink Wash',
        sidebarBg: 'bg-[#24272A]',
        sidebarHeaderBg: 'bg-[#1B1D1F]',
        sidebarBorder: 'border-[#363A3F]',
        sidebarFooterBg: 'bg-[#1B1D1F]',
        sidebarActionBtnBg: 'bg-[#303438] hover:bg-[#4A4F55] text-white border border-[#4A4F55]',
        sidebarActiveItem: 'bg-[#6D8196] text-[#FFFFE3] font-bold shadow-md shadow-[#6D8196]/25 border border-[#94A3B8]/40',
        sidebarInactiveItem: 'text-[#CBCBCB] hover:bg-[#303438] hover:text-white',
        sidebarSectionText: 'text-[#FFFFE3]',
        sidebarSubtext: 'text-[#CBCBCB]',
        sidebarPulseBox: 'bg-[#1B1D1F] border-[#363A3F]',
        sidebarBadgeActive: 'bg-white/20 text-white',
        sidebarBadgeInactive: 'bg-[#303438] text-[#CBCBCB]',
        headerIconBg: 'bg-[#F2F4F7]',
        headerIconBorder: 'border-[#6D8196]/40',
        headerIconText: 'text-[#24272A]',
        headerPrimaryBtn: 'bg-[#334155] hover:bg-[#1E293B] text-white',
        headerPrimaryBtnText: 'text-[#FFFFE3]',
        accentText: 'text-[#334155]',
        accentBorder: 'border-[#6D8196]',
        accentBg: 'bg-[#6D8196]',
        cardHighlightBg: 'bg-[#F2F4F7]',
        cardHighlightBorder: 'border-[#6D8196]',
        tableHeaderHex: '#1B1D1F',
        darkCardHex: '#24272A',
        darkCardBorderHex: '#363A3F',
        darkCardSubtextHex: '#CBCBCB'
      };
    case 'fresh-peach':
      return {
        id: 'fresh-peach',
        name: 'Fresh Peach',
        sidebarBg: 'bg-[#2A1D1A]',
        sidebarHeaderBg: 'bg-[#1F1513]',
        sidebarBorder: 'border-[#422E29]',
        sidebarFooterBg: 'bg-[#1F1513]',
        sidebarActionBtnBg: 'bg-[#382622] hover:bg-[#543A34] text-white border border-[#543A34]',
        sidebarActiveItem: 'bg-[#E39A7B] text-[#1F1513] font-bold shadow-md shadow-[#E39A7B]/25 border border-[#FB923C]/40',
        sidebarInactiveItem: 'text-[#FFD3AC] hover:bg-[#382622] hover:text-white',
        sidebarSectionText: 'text-[#FFD3AC]',
        sidebarSubtext: 'text-[#DBB06B]',
        sidebarPulseBox: 'bg-[#1F1513] border-[#422E29]',
        sidebarBadgeActive: 'bg-[#1F1513]/30 text-[#1F1513]',
        sidebarBadgeInactive: 'bg-[#382622] text-[#FFD3AC]',
        headerIconBg: 'bg-[#FFF3EB]',
        headerIconBorder: 'border-[#E39A7B]/40',
        headerIconText: 'text-[#2A1D1A]',
        headerPrimaryBtn: 'bg-[#EA580C] hover:bg-[#C2410C] text-white',
        headerPrimaryBtnText: 'text-white',
        accentText: 'text-[#EA580C]',
        accentBorder: 'border-[#E39A7B]',
        accentBg: 'bg-[#E39A7B]',
        cardHighlightBg: 'bg-[#FFF3EB]',
        cardHighlightBorder: 'border-[#E39A7B]',
        tableHeaderHex: '#1F1513',
        darkCardHex: '#2A1D1A',
        darkCardBorderHex: '#422E29',
        darkCardSubtextHex: '#FFD3AC'
      };
    case 'stormy-morning':
      return {
        id: 'stormy-morning',
        name: 'Stormy Morning',
        sidebarBg: 'bg-[#1E2730]',
        sidebarHeaderBg: 'bg-[#161D24]',
        sidebarBorder: 'border-[#2E3C4A]',
        sidebarFooterBg: 'bg-[#161D24]',
        sidebarActionBtnBg: 'bg-[#283542] hover:bg-[#3E5164] text-white border border-[#3E5164]',
        sidebarActiveItem: 'bg-[#6A89A7] text-white font-bold shadow-md shadow-[#6A89A7]/30 border border-[#93C5FD]/40',
        sidebarInactiveItem: 'text-[#BDDDFC] hover:bg-[#283542] hover:text-white',
        sidebarSectionText: 'text-[#BDDDFC]',
        sidebarSubtext: 'text-[#88BDF2]',
        sidebarPulseBox: 'bg-[#161D24] border-[#2E3C4A]',
        sidebarBadgeActive: 'bg-white/20 text-white',
        sidebarBadgeInactive: 'bg-[#283542] text-[#BDDDFC]',
        headerIconBg: 'bg-[#EBF4FC]',
        headerIconBorder: 'border-[#6A89A7]/40',
        headerIconText: 'text-[#1E2730]',
        headerPrimaryBtn: 'bg-[#475569] hover:bg-[#334155] text-white',
        headerPrimaryBtnText: 'text-[#88BDF2]',
        accentText: 'text-[#475569]',
        accentBorder: 'border-[#6A89A7]',
        accentBg: 'bg-[#6A89A7]',
        cardHighlightBg: 'bg-[#EBF4FC]',
        cardHighlightBorder: 'border-[#6A89A7]',
        tableHeaderHex: '#161D24',
        darkCardHex: '#1E2730',
        darkCardBorderHex: '#2E3C4A',
        darkCardSubtextHex: '#BDDDFC'
      };
    case 'crm-green':
    default:
      return {
        id: 'crm-green',
        name: 'Heritage Leather & Sand',
        sidebarBg: 'bg-[#1F3A2E]',
        sidebarHeaderBg: 'bg-[#172D24]',
        sidebarBorder: 'border-[#2C5240]',
        sidebarFooterBg: 'bg-[#172D24]',
        sidebarActionBtnBg: 'bg-[#172D24] hover:bg-[#28493A] text-white border border-[#2C5240]',
        sidebarActiveItem: 'bg-[#C8A96A] text-[#1F3A2E] font-bold shadow-md shadow-[#C8A96A]/20 border border-[#C8A96A]',
        sidebarInactiveItem: 'text-[#CFE0D5] hover:bg-[#28493A] hover:text-white',
        sidebarSectionText: 'text-[#C8A96A]',
        sidebarSubtext: 'text-[#C8A96A]',
        sidebarPulseBox: 'bg-[#172D24] border-[#2C5240]',
        sidebarBadgeActive: 'bg-[#1F3A2E] text-[#C8A96A]',
        sidebarBadgeInactive: 'bg-[#172D24] text-[#CFE0D5]',
        headerIconBg: 'bg-[#E8F0EA]',
        headerIconBorder: 'border-[#2C5240]/40',
        headerIconText: 'text-[#1F3A2E]',
        headerPrimaryBtn: 'bg-[#1F3A2E] hover:bg-[#2C5240] text-white',
        headerPrimaryBtnText: 'text-[#C8A96A]',
        accentText: 'text-[#C8A96A]',
        accentBorder: 'border-[#C8A96A]',
        accentBg: 'bg-[#C8A96A]',
        cardHighlightBg: 'bg-[#E8F0EA]',
        cardHighlightBorder: 'border-[#2C5240]',
        tableHeaderHex: '#162E23',
        darkCardHex: '#13261E',
        darkCardBorderHex: '#28493A',
        darkCardSubtextHex: '#C8A96A'
      };
  }
};

interface ThemeSelectorProps {
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTheme = ERP_THEMES.find(t => t.id === currentTheme) || ERP_THEMES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer select-none"
        title="Switch ERP Color Scheme & Theme Palette"
      >
        <Palette className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
        <div className="flex items-center -space-x-1 shrink-0">
          {activeTheme.swatches.slice(0, 3).map((c, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-white/30 shadow-2xs"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <span className="hidden xl:inline text-[11px] font-semibold text-slate-200 max-w-[130px] truncate">
          {activeTheme.name}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-76 bg-white border border-[#DDE3DD] rounded-xl shadow-2xl p-2 text-[#1A1A1A] z-50 animate-in fade-in slide-in-from-top-1 duration-150 max-h-96 overflow-y-auto"
          style={{ zIndex: 9999 }}
        >
          <div className="px-3 py-2 border-b border-[#DDE3DD] text-[11px] font-bold text-[#6B7269] uppercase tracking-wider flex items-center justify-between sticky top-0 bg-white z-10">
            <span>ERP Color Scheme</span>
            <div className="flex items-center gap-1 text-[10px] text-[#1F3A2E] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>8 Palettes</span>
            </div>
          </div>

          <div className="mt-1 space-y-1 text-xs">
            {ERP_THEMES.map((t) => {
              const isSelected = t.id === currentTheme;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onSelectTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected
                      ? `${t.activeBg} border ${t.border} ${t.textColor} font-bold shadow-xs`
                      : 'hover:bg-[#F4F6F4] text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex items-center -space-x-1 shrink-0 p-0.5 rounded-full bg-slate-100 border border-slate-200">
                      {t.swatches.map((c, i) => (
                        <span
                          key={i}
                          className="w-2.5 h-2.5 rounded-full border border-white"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="min-w-0">
                      <div className={`font-semibold text-xs leading-snug truncate ${isSelected ? t.textColor : 'text-[#1A1A1A]'}`}>
                        {t.name}
                      </div>
                      <div className="text-[10px] text-[#6B7269] leading-tight truncate">
                        {t.subtitle}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className={`w-3.5 h-3.5 ${t.checkColor} shrink-0 ml-1.5`} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
