'use client';

import React, { useState } from 'react';
import { CurrencyRate } from '@/types/erp';
import { ThemeProfile } from '@/components/Sidebar';
import { ForexSyncPayload, syncLiveExchangeRates } from '@/lib/forexSync';
import {
  X,
  TrendingUp,
  RefreshCw,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  ExternalLink,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface LiveExchangeRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencies: CurrencyRate[];
  onCurrenciesUpdated: (newCurrencies: CurrencyRate[]) => void;
  forexMeta: ForexSyncPayload | null;
  onMetaUpdated: (newMeta: ForexSyncPayload) => void;
  theme?: ThemeProfile;
}

export const LiveExchangeRateModal: React.FC<LiveExchangeRateModalProps> = ({
  isOpen,
  onClose,
  currencies,
  onCurrenciesUpdated,
  forexMeta,
  onMetaUpdated,
  theme = 'crm-green',
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'RATES' | 'CROSS_MATRIX' | 'REGULATORY'>('RATES');

  if (!isOpen) return null;

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncSuccessMsg(null);
    try {
      const result = await syncLiveExchangeRates(currencies);
      onCurrenciesUpdated(result.currencies);
      onMetaUpdated(result.meta);
      setSyncSuccessMsg('Exchange rates successfully synchronized with Bangladesh Bank & Global Forex Feed.');
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Manual sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const isRoyal = theme === 'royal-blue';
  const isHydrangea = theme === 'hydrangea';

  // Get current rates with fallbacks
  const getRate = (code: string, fallback: number) => {
    const found = currencies.find(c => c.code === code);
    return found ? found.rateToUsd : fallback;
  };

  const usdBdt = getRate('BDT', 123.08);
  const usdGbp = getRate('GBP', 0.751);
  const usdEur = getRate('EUR', 0.890);
  const usdAud = getRate('AUD', 1.440);

  const bbMeta = forexMeta?.bangladeshBank || {
    interbankMidRateBdt: usdBdt,
    adBuyingRateBdt: Number((usdBdt * 0.995).toFixed(2)),
    adSellingRateBdt: Number((usdBdt * 1.005).toFixed(2)),
    spreadPct: 0.5,
    erqRetentionQuotaPct: 50.0,
    regulatoryCircular: 'FE Circular No. 48 & 31 (ERQ 50% & AD Authorized Dealer Framework)',
    crossRates: {
      GBP_BDT: Number((usdBdt / (usdGbp || 0.751)).toFixed(2)),
      EUR_BDT: Number((usdBdt / (usdEur || 0.890)).toFixed(2)),
      AUD_BDT: Number((usdBdt / (usdAud || 1.440)).toFixed(2)),
      GBP_USD: Number((1 / (usdGbp || 0.751)).toFixed(4)),
      EUR_USD: Number((1 / (usdEur || 0.890)).toFixed(4)),
    },
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-[#1A1A1A] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className={`px-6 py-4 flex items-center justify-between text-white border-b ${
          isRoyal ? 'bg-[#0F172A] border-[#1E293B]' : isHydrangea ? 'bg-[#230C2E] border-[#3D1A4D]' : 'bg-[#1F3A2E] border-[#2C5240]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#C8A96A] p-2 flex items-center justify-center shadow-inner">
              <Landmark className="w-6 h-6 text-[#C8A96A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-lg tracking-tight">
                  Bangladesh Bank &amp; Live Forex Sync Desk
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>PHASE 4 LIVE FEED</span>
                </span>
              </div>
              <p className="text-xs text-[#C8A96A] font-medium">
                Sovereign Central Bank Interbank Rates &amp; Real-Time Multi-Currency Valuation (USD, BDT, GBP, EUR, AUD)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Forex Desk"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('RATES')}
              className={`px-3 py-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'RATES'
                  ? 'border-[#1F3A2E] text-[#1F3A2E] font-bold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Primary Currencies (USD, BDT, GBP, EUR, AUD)
            </button>
            <button
              onClick={() => setActiveTab('CROSS_MATRIX')}
              className={`px-3 py-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'CROSS_MATRIX'
                  ? 'border-[#1F3A2E] text-[#1F3A2E] font-bold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Cross-Rate Valuation Matrix
            </button>
            <button
              onClick={() => setActiveTab('REGULATORY')}
              className={`px-3 py-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'REGULATORY'
                  ? 'border-[#1F3A2E] text-[#1F3A2E] font-bold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Bangladesh Bank Statutory Mandates
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isSyncing
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#1F3A2E] text-white hover:bg-[#2C5240] active:scale-95'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#C8A96A]' : 'text-[#C8A96A]'}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {syncSuccessMsg && (
          <div className="mx-6 mt-3 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncSuccessMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'RATES' && (
            <div className="space-y-6">
              {/* Primary 5 Currencies Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* 1. USD - Base Benchmark */}
                <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs hover:border-[#1F3A2E] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🇺🇸</span>
                      <div>
                        <div className="font-heading font-bold text-sm text-[#1A1A1A]">US Dollar (USD)</div>
                        <div className="text-[11px] text-gray-500">Global ERP Base Benchmark</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-mono font-bold border border-blue-200">
                      $ BASE
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                    <span className="text-xs text-gray-500 font-medium">Rate to USD:</span>
                    <span className="text-xl font-mono font-bold text-[#1F3A2E]">1.0000</span>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 flex items-center justify-between">
                    <span>Delaware Station (ArielMC US)</span>
                    <span className="text-emerald-600 font-semibold">Active Anchor</span>
                  </div>
                </div>

                {/* 2. BDT - Bangladesh Taka (BB Interbank) */}
                <div className="p-4 rounded-xl border-2 border-[#C8A96A]/60 bg-gradient-to-br from-amber-50/40 via-white to-white shadow-xs hover:border-[#C8A96A] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🇧🇩</span>
                      <div>
                        <div className="font-heading font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5">
                          <span>Bangladeshi Taka (BDT)</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-mono font-bold">BB</span>
                        </div>
                        <div className="text-[11px] text-gray-500">Central Bank Interbank Mid Rate</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-mono font-bold border border-amber-300">
                      ৳ BDT
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-baseline justify-between">
                    <span className="text-xs text-gray-600 font-medium">BB Mid-Market:</span>
                    <span className="text-2xl font-mono font-bold text-[#1F3A2E]">
                      ৳ {usdBdt.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-200 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="text-gray-500">
                      Buying: <span className="font-bold text-gray-700">৳ {bbMeta.adBuyingRateBdt.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-500 text-right">
                      Selling: <span className="font-bold text-gray-700">৳ {bbMeta.adSellingRateBdt.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 flex items-center justify-between">
                    <span>Dhaka Station (ArielMC BD)</span>
                    <span className="text-amber-700 font-semibold">Spread: ±0.5% AD</span>
                  </div>
                </div>

                {/* 3. GBP - British Pound */}
                <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs hover:border-[#1F3A2E] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🇬🇧</span>
                      <div>
                        <div className="font-heading font-bold text-sm text-[#1A1A1A]">British Pound (GBP)</div>
                        <div className="text-[11px] text-gray-500">UK Station Commercial Rate</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-xs font-mono font-bold border border-purple-200">
                      £ GBP
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                    <span className="text-xs text-gray-500 font-medium">Rate to USD:</span>
                    <span className="text-xl font-mono font-bold text-[#1F3A2E]">
                      {usdGbp.toFixed(4)}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-500">1 GBP in BDT:</span>
                    <span className="font-bold text-[#1F3A2E]">৳ {bbMeta.crossRates.GBP_BDT.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 flex items-center justify-between">
                    <span>London Station (ArielMC UK)</span>
                    <span className="text-indigo-600 font-semibold">$1.33 / £</span>
                  </div>
                </div>

                {/* 4. EUR - Euro */}
                <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs hover:border-[#1F3A2E] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🇪🇺</span>
                      <div>
                        <div className="font-heading font-bold text-sm text-[#1A1A1A]">Euro (EUR)</div>
                        <div className="text-[11px] text-gray-500">EU Sourcing &amp; Retail Benchmark</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200">
                      € EUR
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                    <span className="text-xs text-gray-500 font-medium">Rate to USD:</span>
                    <span className="text-xl font-mono font-bold text-[#1F3A2E]">
                      {usdEur.toFixed(4)}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-500">1 EUR in BDT:</span>
                    <span className="font-bold text-[#1F3A2E]">৳ {bbMeta.crossRates.EUR_BDT.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 flex items-center justify-between">
                    <span>Frankfurt Station (ArielMC EU)</span>
                    <span className="text-emerald-700 font-semibold">$1.12 / €</span>
                  </div>
                </div>

                {/* 5. AUD - Australian Dollar */}
                <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs hover:border-[#1F3A2E] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🇦🇺</span>
                      <div>
                        <div className="font-heading font-bold text-sm text-[#1A1A1A]">Australian Dollar (AUD)</div>
                        <div className="text-[11px] text-gray-500">Australasia Trade Station</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-xs font-mono font-bold border border-teal-200">
                      A$ AUD
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                    <span className="text-xs text-gray-500 font-medium">Rate to USD:</span>
                    <span className="text-xl font-mono font-bold text-[#1F3A2E]">
                      {usdAud.toFixed(4)}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-500">1 AUD in BDT:</span>
                    <span className="font-bold text-[#1F3A2E]">৳ {bbMeta.crossRates.AUD_BDT.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 flex items-center justify-between">
                    <span>Sydney Station (ArielMC AU)</span>
                    <span className="text-teal-700 font-semibold">$0.69 / A$</span>
                  </div>
                </div>

                {/* 6. Bangladesh Bank Feed Status Box */}
                <div className="p-4 rounded-xl border border-dashed border-[#C8A96A] bg-amber-50/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1F3A2E] uppercase font-heading">
                      <ShieldCheck className="w-4 h-4 text-[#C8A96A]" />
                      <span>Regulatory Feed Metadata</span>
                    </div>
                    <div className="mt-2 text-xs space-y-1.5 text-gray-600">
                      <div className="flex justify-between">
                        <span>Source:</span>
                        <span className="font-semibold text-[#1A1A1A]">{forexMeta?.source || 'Bangladesh Bank & Live Feed'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-semibold text-emerald-600">Synchronized (Live)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ERQ Quota:</span>
                        <span className="font-mono font-bold text-[#1F3A2E]">50% (FE Circ. 48/31)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-200/50 text-[10px] text-gray-400">
                    Auto-refreshed periodically across all stations.
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'CROSS_MATRIX' && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#1F3A2E] text-white text-[11px] font-heading font-semibold uppercase">
                    <tr>
                      <th className="px-4 py-3">Currency Pair</th>
                      <th className="px-4 py-3">Mid Market Rate</th>
                      <th className="px-4 py-3">AD Buying (Bid)</th>
                      <th className="px-4 py-3">AD Selling (Ask)</th>
                      <th className="px-4 py-3">10k B2B Order Equivalent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-mono">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900">USD / BDT</td>
                      <td className="px-4 py-3 font-bold text-[#1F3A2E]">৳ {usdBdt.toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600">৳ {bbMeta.adBuyingRateBdt.toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600">৳ {bbMeta.adSellingRateBdt.toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">৳ {(10000 * usdBdt).toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900">GBP / BDT</td>
                      <td className="px-4 py-3 font-bold text-[#1F3A2E]">৳ {bbMeta.crossRates.GBP_BDT.toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600">৳ {(bbMeta.crossRates.GBP_BDT * 0.995).toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600">৳ {(bbMeta.crossRates.GBP_BDT * 1.005).toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">৳ {(10000 * bbMeta.crossRates.GBP_BDT).toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900">EUR / BDT</td>
                      <td className="px-4 py-3 font-bold text-[#1F3A2E]">৳ {bbMeta.crossRates.EUR_BDT.toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600">৳ {(bbMeta.crossRates.EUR_BDT * 0.995).toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600">৳ {(bbMeta.crossRates.EUR_BDT * 1.005).toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">৳ {(10000 * bbMeta.crossRates.EUR_BDT).toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900">AUD / BDT</td>
                      <td className="px-4 py-3 font-bold text-[#1F3A2E]">৳ {bbMeta.crossRates.AUD_BDT.toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600">৳ {(bbMeta.crossRates.AUD_BDT * 0.995).toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600">৳ {(bbMeta.crossRates.AUD_BDT * 1.005).toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">৳ {(10000 * bbMeta.crossRates.AUD_BDT).toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900">GBP / USD</td>
                      <td className="px-4 py-3 font-bold text-[#1F3A2E]">${bbMeta.crossRates.GBP_USD.toFixed(4)}</td>
                      <td className="px-4 py-3 text-gray-600">${(bbMeta.crossRates.GBP_USD * 0.997).toFixed(4)}</td>
                      <td className="px-4 py-3 text-gray-600">${(bbMeta.crossRates.GBP_USD * 1.003).toFixed(4)}</td>
                      <td className="px-4 py-3 font-semibold text-indigo-700">${(10000 * bbMeta.crossRates.GBP_USD).toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900">EUR / USD</td>
                      <td className="px-4 py-3 font-bold text-[#1F3A2E]">${bbMeta.crossRates.EUR_USD.toFixed(4)}</td>
                      <td className="px-4 py-3 text-gray-600">${(bbMeta.crossRates.EUR_USD * 0.997).toFixed(4)}</td>
                      <td className="px-4 py-3 text-gray-600">${(bbMeta.crossRates.EUR_USD * 1.003).toFixed(4)}</td>
                      <td className="px-4 py-3 font-semibold text-indigo-700">${(10000 * bbMeta.crossRates.EUR_USD).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'REGULATORY' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-heading font-bold text-sm text-emerald-900">
                    Bangladesh Bank Foreign Exchange Regulation Act (FERA) &amp; Circulars
                  </h3>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  ArielMC Sourcing operations in Savar, Gazipur, and Dhamrai operate under strict compliance with the Foreign Exchange Circulars issued by the Foreign Exchange Policy Department (FEPD) of Bangladesh Bank:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-white border border-emerald-200">
                    <div className="font-bold text-emerald-900 mb-1">FE Circular No. 48 &amp; 31</div>
                    <div className="text-gray-600 text-[11px] leading-relaxed">
                      Authorizes 50% Exporter’s Retention Quota (ERQ) in foreign currency for 100% export-oriented leather, jute, and garment entities to hedge against import raw material price inflation.
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-emerald-200">
                    <div className="font-bold text-emerald-900 mb-1">Authorized Dealer (AD) Mandate</div>
                    <div className="text-gray-600 text-[11px] leading-relaxed">
                      All export proceeds realized via ArielMC BD Station (Dhaka) are processed through Principal Branch AD dealers with mandatory 120-day EXP realization filing.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Statutory FX settlement window: 120 calendar days from Export Shipping Date (B/L).</span>
                </div>
                <a
                  href="https://www.bb.org.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1F3A2E] font-semibold underline flex items-center gap-1 hover:text-[#C8A96A]"
                >
                  <span>BB Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Last Updated: <strong className="text-gray-700 font-mono">{forexMeta?.lastUpdatedUtc || new Date().toLocaleString()}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-400">Auto-refresh every 15 min</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold transition-colors cursor-pointer"
            >
              Close Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
