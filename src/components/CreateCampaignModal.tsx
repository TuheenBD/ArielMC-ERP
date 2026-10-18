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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1E293B] border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/30">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Launch New B2B Marketing Campaign
              </h3>
              <p className="text-xs text-slate-400">
                Deploy multi-station marketing outreach across UK, USA, EU, AU &amp; BD
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Campaign Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spring 2027 Nordic Homeware & Ceramics Procurement Drive"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Strategic Tagline / Mission
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Introducing ethical Bangladeshi bone china to Tier-1 European department stores"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          {/* Target Markets */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-[#003B73] border-blue-400 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
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
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-[#C8A96A] border-[#C8A96A] text-[#0A1A2F] font-bold shadow-sm'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
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
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#C8A96A]"
              >
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="BDT">BDT (৳)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Planned Budget
              </label>
              <input
                type="number"
                value={plannedBudget}
                onChange={(e) => setPlannedBudget(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#C8A96A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Target Buyer Leads
              </label>
              <input
                type="number"
                value={targetLeads}
                onChange={(e) => setTargetLeads(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#C8A96A]"
              />
            </div>
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Campaign Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#C8A96A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Target Completion Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#C8A96A]"
              />
            </div>
          </div>

          {/* Channels & Manager */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Marketing Channels (Comma separated)
            </label>
            <input
              type="text"
              value={channels}
              onChange={(e) => setChannels(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Assigned Campaign Lead
            </label>
            <input
              type="text"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#b89552] text-[#0A1A2F] text-xs font-bold shadow-lg transition-colors flex items-center gap-2"
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
