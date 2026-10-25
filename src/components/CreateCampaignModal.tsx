'use client';

import React, { useState } from 'react';
import { MarketingCampaign, ProductSector } from '@/types/marketing';
import { ArielMC } from '@/lib/brand';
import {
  X,
  Megaphone,
  Plus,
  Sparkles,
  Calendar,
  DollarSign,
  Target,
  Globe2,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCampaign: (campaign: MarketingCampaign) => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onAddCampaign,
}) => {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [targetMarkets, setTargetMarkets] = useState<string[]>(['UK', 'EU']);
  const [targetSectors, setTargetSectors] = useState<ProductSector[]>(['CERAMICS']);
  const [currency, setCurrency] = useState('USD');
  const [plannedBudget, setPlannedBudget] = useState('25000');
  const [targetLeads, setTargetLeads] = useState('50');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [manager, setManager] = useState('Tuheen Hassan (Chief Commercial Officer)');
  const [channels, setChannels] = useState(
    'Direct Executive Outreach, Trade Fair Showcase, Digital Lookbook Syndication'
  );

  if (!isOpen) return null;

  const handleToggleMarket = (m: string) => {
    setTargetMarkets((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const handleToggleSector = (s: ProductSector) => {
    setTargetSectors((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCampaign: MarketingCampaign = {
      id: `camp-${Date.now()}`,
      code: `AMC-MKT-${new Date().getFullYear().toString().slice(-2)}-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      tagline: tagline.trim() || 'Accelerating B2B wholesale procurement and private label manufacturing',
      targetMarkets: targetMarkets.length > 0 ? targetMarkets : ['UK', 'USA'],
      targetSectors: targetSectors.length > 0 ? targetSectors : ['ALL'],
      status: 'ACTIVE',
      startDate,
      endDate,
      budget: {
        currency,
        planned: parseFloat(plannedBudget) || 20000,
        spent: 0,
      },
      kpis: {
        targetLeads: parseInt(targetLeads, 10) || 50,
        leadsAcquired: 0,
        sampleOrdersGenerated: 0,
        estimatedPipelineUsd: (parseInt(targetLeads, 10) || 50) * 8000,
        roiPercent: 0,
      },
      channels: channels
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      keyDeliverables: [
        'Curated Sector Digital Lookbook',
        'Official Compliance & Statutory Audit Dossier',
        'High-Resolution Product Line-Sheet',
      ],
      featuredCollateralIds: [],
      manager,
      stationCode: 'ARIEL_BD',
    };

    onAddCampaign(newCampaign);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden text-[#1A1A1A] flex flex-col max-h-[90vh]">
        {/* Top-Right Absolute Close Button (Standard Window Position) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/30 hover:bg-black/60 text-white/90 hover:text-white border border-white/20 transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
          title="Close Window (X)"
          aria-label="Close Window"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pr-16 py-4 bg-gradient-to-r from-[#1F3A2E] to-[#12231B] text-white border-b border-[#C8A96A]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-[#C8A96A] border border-[#C8A96A]/30">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                Launch New B2B Marketing Campaign
              </h3>
              <p className="text-xs text-white/70">
                Deploy multi-station marketing outreach across UK, USA, EU, AU &amp; BD
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 bg-white">
          <div>
            <label className="block text-xs font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
              Campaign Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spring 2027 Nordic Homeware & Ceramics Procurement Drive"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-sm text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:border-[#1F3A2E] focus:bg-white shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
              Strategic Tagline / Mission
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Introducing ethical Bangladeshi bone china to Tier-1 European department stores"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-sm text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:border-[#1F3A2E] focus:bg-white shadow-2xs"
            />
          </div>

          {/* Target Markets */}
          <div>
            <label className="block text-xs font-bold text-[#1F3A2E] uppercase tracking-wider mb-1.5">
              Target Sovereign Operating Markets
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'UK', label: '🇬🇧 United Kingdom' },
                { code: 'USA', label: '🇺🇸 United States' },
                { code: 'EU', label: '🇪🇺 European Union' },
                { code: 'AU', label: '🇦🇺 Australia / NZ' },
                { code: 'BD', label: '🇧🇩 Bangladesh HQ' },
              ].map((m) => {
                const isSelected = targetMarkets.includes(m.code);
                return (
                  <button
                    key={m.code}
                    type="button"
                    onClick={() => handleToggleMarket(m.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1F3A2E] border-[#1F3A2E] text-white shadow-xs font-bold'
                        : 'bg-[#F8FAF8] border-[#DDE3DD] text-[#4A5568] hover:text-[#1F3A2E] hover:bg-white'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Sectors */}
          <div>
            <label className="block text-xs font-bold text-[#1F3A2E] uppercase tracking-wider mb-1.5">
              Target Manufacturing Sectors
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'CERAMICS' as ProductSector, label: '🍽️ Fine Ceramics' },
                { code: 'LEATHER' as ProductSector, label: '👜 Artisan Leather' },
                { code: 'JUTE' as ProductSector, label: '🌿 Golden Jute' },
                { code: 'HOME_TEXTILES' as ProductSector, label: '🛏️ Home Textiles' },
                { code: 'TERRACOTTA' as ProductSector, label: '🏺 Terracotta' },
              ].map((s) => {
                const isSelected = targetSectors.includes(s.code);
                return (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => handleToggleSector(s.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#C8A96A] border-[#C8A96A] text-[#1F3A2E] font-bold shadow-xs'
                        : 'bg-[#F8FAF8] border-[#DDE3DD] text-[#4A5568] hover:text-[#1F3A2E] hover:bg-white'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget & Target Leads */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] shadow-2xs"
              >
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="BDT">BDT (৳)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
                Planned Budget
              </label>
              <input
                type="number"
                value={plannedBudget}
                onChange={(e) => setPlannedBudget(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
                Target Buyer Leads
              </label>
              <input
                type="number"
                value={targetLeads}
                onChange={(e) => setTargetLeads(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] shadow-2xs"
              />
            </div>
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
                Campaign Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
                Target Completion Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] shadow-2xs"
              />
            </div>
          </div>

          {/* Channels & Manager */}
          <div>
            <label className="block text-xs font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
              Marketing Channels (Comma separated)
            </label>
            <input
              type="text"
              value={channels}
              onChange={(e) => setChannels(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-sm text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:border-[#1F3A2E] shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F3A2E] uppercase tracking-wider mb-1">
              Assigned Campaign Lead
            </label>
            <input
              type="text"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E] shadow-2xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#DDE3DD] flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#4A5568] text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1F3A2E] to-[#162B22] hover:from-[#162B22] hover:to-[#0F1E18] text-[#C8A96A] text-xs font-bold shadow-md transition-all flex items-center gap-2 border border-[#C8A96A]/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Campaign</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
