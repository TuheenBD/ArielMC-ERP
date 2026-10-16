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
    <header className="sticky top-0 z-30 bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] px-6 py-3 transition-colors shadow-md">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Search Bar & Global Scope */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0B9A8]" />
            <input
              id="global-erp-search"
              type="text"
              placeholder="Search SKUs, HS codes, leather types, factories, buyers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#2C5240] text-sm text-white placeholder-[#A0B9A8] rounded-lg border border-[#3A6B54] focus:outline-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A] transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Center: Live FX Ticker */}
        <div className="hidden lg:flex items-center gap-3 bg-[#2C5240] px-3 py-1.5 rounded-lg border border-[#3A6B54] text-xs">
          <div className="flex items-center gap-1.5 text-[#CFE0D5] font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>FX (vs USD):</span>
          </div>
          <div className="flex items-center gap-3">
            {currencies.filter(c => c.code !== 'USD').map(curr => (
              <span key={curr.code} className="text-[#E8F0EA] font-mono">
                {curr.code}: <span className="text-[#C8A96A] font-semibold">{curr.rateToUsd}</span>
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
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#2C5240] border border-[#C8A96A]/60 hover:border-[#C8A96A] text-xs font-medium text-white transition-all shadow-sm"
            >
              <span className="text-base leading-none">{activeEntity.flag}</span>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-semibold text-white tracking-wide">{activeEntity.legalName.split(' ')[0]} {activeEntity.countryCode}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C8A96A] text-[#1F3A2E] font-mono font-bold">
                    {activeEntity.baseCurrency}
                  </span>
                </div>
                <p className="text-[10px] text-[#CFE0D5] leading-tight">{activeEntity.city}, {activeEntity.country}</p>
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
                          <div className="font-medium text-[#1A1A1A]">{comp.legalName}</div>
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

          {/* Currency Switcher */}
          <select
            id="currency-selector"
            value={activeCurrency.code}
            onChange={(e) => onSelectCurrency(e.target.value)}
            className="bg-[#2C5240] text-xs font-mono text-white border border-[#3A6B54] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#C8A96A]"
            title="Display Currency"
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code} className="bg-[#1F3A2E] text-white">
                {curr.code} ({curr.symbol})
              </option>
            ))}
          </select>

          {/* Notifications */}
          <button 
            id="header-notifications-btn"
            className="relative p-2 rounded-lg bg-[#2C5240] border border-[#3A6B54] hover:border-[#C8A96A] text-[#CFE0D5] hover:text-white transition-colors"
            title="Station Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C8A96A] ring-2 ring-[#1F3A2E]" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#2C5240]">
            <div className="w-8 h-8 rounded-lg bg-[#C8A96A] text-[#1F3A2E] flex items-center justify-center text-xs font-bold shadow-sm">
              AMC
            </div>
            <div className="hidden xl:block text-left text-xs">
              <div className="font-semibold text-white leading-tight">Syed Akramul Hassan</div>
              <div className="text-[10px] text-[#CFE0D5] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 inline text-[#C8A96A]" /> Managing Director
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
