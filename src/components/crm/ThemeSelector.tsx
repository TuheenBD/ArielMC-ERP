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
        className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-50 text-[#1A1A1A] border border-[#DDE3DD] rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer select-none"
        title="Switch ERP Color Scheme & Theme Palette"
      >
        <Palette className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
        <div className="flex items-center -space-x-1 shrink-0">
          {activeTheme.swatches.slice(0, 3).map((c, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-white shadow-2xs"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <span className="hidden xl:inline text-[11px] font-semibold text-[#1F3A2E] max-w-[130px] truncate">
          {activeTheme.name}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-[#6B7269] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
