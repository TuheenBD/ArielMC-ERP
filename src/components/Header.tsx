'use client';

import React from 'react';
import Image from 'next/image';
import { CompanyEntity, CurrencyRate, EntityCode } from '@/types/erp';
import { 
  Building2, 
  ChevronDown, 
  Search, 
  Bell, 
  Globe2, 
  ArrowUpRight, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface HeaderProps {
  companies: CompanyEntity[];
  activeEntity: CompanyEntity;
  onSelectEntity: (code: EntityCode) => void;
  currencies: CurrencyRate[];
  activeCurrency: CurrencyRate;
  onSelectCurrency: (code: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  companies,
  activeEntity,
  onSelectEntity,
  currencies,
  activeCurrency,
  onSelectCurrency,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0c1222]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Search Bar & Global Scope */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="global-erp-search"
              type="text"
              placeholder="Search SKUs, HS codes, leather types, factories, buyers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 text-sm text-slate-100 placeholder-slate-400 rounded-lg border border-slate-700/60 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Center: Live FX Ticker */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>FX (vs USD):</span>
          </div>
          <div className="flex items-center gap-3">
            {currencies.filter(c => c.code !== 'USD').map(curr => (
              <span key={curr.code} className="text-slate-300 font-mono">
                {curr.code}: <span className="text-emerald-400 font-semibold">{curr.rateToUsd}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: Station / Company Switcher & User Profile */}
        <div className="flex items-center gap-3">
          {/* Active Entity Selector Dropdown */}
          <div className="relative group">
            <button 
              id="entity-selector-dropdown-btn"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 hover:border-blue-400 text-xs font-medium text-slate-100 transition-all shadow-sm shadow-blue-500/10"
            >
              <span className="text-base leading-none">{activeEntity.flag}</span>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white tracking-wide">{activeEntity.legalName.split(' ')[0]} {activeEntity.countryCode}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                    {activeEntity.baseCurrency}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">{activeEntity.city}, {activeEntity.country}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 group-hover:text-blue-400 transition-transform" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl p-2 hidden group-hover:block transition-all z-50">
              <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Switch Operating Station</span>
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
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
                          ? 'bg-blue-600/20 border border-blue-500/40 text-blue-200' 
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{comp.flag}</span>
                        <div>
                          <div className="font-medium text-white">{comp.legalName}</div>
                          <div className="text-[10px] text-slate-400">{comp.taxIdentifier.type}: {comp.taxIdentifier.number}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {comp.baseCurrency}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Currency Switcher */}
          <select
            id="currency-selector"
            value={activeCurrency.code}
            onChange={(e) => onSelectCurrency(e.target.value)}
            className="bg-slate-900 text-xs font-mono text-slate-200 border border-slate-700/70 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            title="Display Currency"
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} ({curr.symbol})
              </option>
            ))}
          </select>

          {/* Notifications */}
          <button 
            id="header-notifications-btn"
            className="relative p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Station Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-950 animate-pulse" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              AH
            </div>
            <div className="hidden xl:block text-left text-xs">
              <div className="font-semibold text-white leading-tight">Syed A. Hassan</div>
              <div className="text-[10px] text-blue-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 inline" /> Managing Director
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
