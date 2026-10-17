'use client';

import React, { useState } from 'react';
import {
  MASTER_PRODUCT_ROADMAP,
  FIVE_DIVISIONS_OVERVIEW,
  ProductRoadmapItem,
  DivisionOverview,
} from '@/data/productRoadmap';
import { ProductSector, CurrencyRate } from '@/types/erp';
import {
  X,
  Search,
  BookOpen,
  Filter,
  DollarSign,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Plus,
  Info,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ProductRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCurrency?: CurrencyRate;
  onSelectRoadmapItem?: (item: ProductRoadmapItem) => void;
}

export const ProductRoadmapModal: React.FC<ProductRoadmapModalProps> = ({
  isOpen,
  onClose,
  activeCurrency,
  onSelectRoadmapItem,
}) => {
  if (!isOpen) return null;

  const [selectedSector, setSelectedSector] = useState<ProductSector | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemDetail, setSelectedItemDetail] = useState<ProductRoadmapItem | null>(null);

  const filteredItems = MASTER_PRODUCT_ROADMAP.filter((item) => {
    const matchesSector = selectedSector === 'ALL' || item.sector === selectedSector;
    const matchesSearch =
      searchQuery === '' ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.prodtId).includes(searchQuery) ||
      (item.hsCode && item.hsCode.includes(searchQuery));
    return matchesSector && matchesSearch;
  });

  const activeDivision = selectedSector !== 'ALL' ? FIVE_DIVISIONS_OVERVIEW[selectedSector] : null;

  const getSectorMeta = (sector: ProductSector) => {
    switch (sector) {
      case 'LEATHER':
        return {
          label: 'Leather Products',
          divisionName: 'The Leather Compendium',
          icon: '💼',
          color: 'bg-[#FAF5EC] text-[#8A6D3B] border-[#C8A96A]',
        };
      case 'JUTE':
        return {
          label: 'Jute Products',
          divisionName: 'The Golden Fiber Edit',
          icon: '🛍️',
          color: 'bg-[#E4F3E9] text-[#14512C] border-[#BBE3C7]',
        };
      case 'TEXTILE':
        return {
          label: 'Apparel & Home Textiles',
          divisionName: 'Thread & Weave',
          icon: '🧵',
          color: 'bg-[#E8F0FA] text-[#17456F] border-[#C5D7ED]',
        };
      case 'CERAMICS':
        return {
          label: 'Ceramics & Tableware',
          divisionName: 'The Ceramic Index',
          icon: '🍽️',
          color: 'bg-[#EDE7F6] text-[#4A2E7A] border-[#D6C7EC]',
        };
      case 'POTTERY':
        return {
          label: 'Pottery & Terracotta',
          divisionName: 'Earth & Form',
          icon: '🏺',
          color: 'bg-[#FDF3E7] text-[#9A3412] border-[#FDBA74]',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#12231B]/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#1A1A1A]">
        
        {/* Header */}
        <div className="p-5 bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8A96A]/25 text-[#F4E3B8] border border-[#C8A96A]/40 font-bold uppercase tracking-wider">
                Official ArielMC Product Road Map
              </span>
              <span className="text-xs text-white/70">
                5 Industrial Divisions • 74 Production Lines
              </span>
              <span className="text-xs text-[#C8A96A] font-semibold">
                • Min 25%–30% Gross Margin • B2B 40%–50% below D2C Retail
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
              Ariel Marketing & Communications Limited — Product Line Directory
            </h2>
            <p className="text-xs text-white/80 mt-1 max-w-3xl">
              Standard product headings, category hierarchies, Sub-Categories, Prodt_ID codes, and volume-tiered target purchasing formulas (Min 25%–30% Margin: Max Buy = FOB Sell × 0.70–0.75 | B2B Wholesale is 40%–50% below D2C/Retail MSRP).
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Division Selector Tabs */}
        <div className="px-5 py-3 border-b border-[#DDE3DD] bg-[#F8FAF8] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedSector('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                selectedSector === 'ALL'
                  ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-sm'
                  : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border-[#DDE3DD]'
              }`}
            >
              All 5 Divisions (74)
            </button>

            {(['LEATHER', 'JUTE', 'TEXTILE', 'CERAMICS', 'POTTERY'] as ProductSector[]).map((sec) => {
              const meta = getSectorMeta(sec);
              const count = MASTER_PRODUCT_ROADMAP.filter((i) => i.sector === sec).length;
              const isSelected = selectedSector === sec;

              return (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-sm'
                      : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border-[#DDE3DD]'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span className="hidden md:inline">{meta.label}</span>
                  <span className="md:hidden">{sec}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-[#F0F4F1] text-[#1A1A1A]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#6B7269] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, title, category..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#DDE3DD] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
            />
          </div>
        </div>

        {/* Division Highlight Banner (if a single division is active) */}
        {activeDivision && (
          <div className="px-5 py-3 bg-[#FAF5EC] border-b border-[#E8CD96] text-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#8A6D3B] uppercase tracking-wider text-[11px] font-mono">
                    Division {activeDivision.divisionNumber}: {activeDivision.title}
                  </span>
                  <span className="text-[#6B7269]">•</span>
                  <span className="italic text-[#1A1A1A] font-medium">{activeDivision.subline}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6B7269] flex-wrap">
                  <span><strong>AQL Standard:</strong> {activeDivision.aqlStandard}</span>
                  <span>•</span>
                  <span><strong>Lead Time:</strong> {activeDivision.leadTime}</span>
                  <span>•</span>
                  <span><strong>Packaging:</strong> {activeDivision.packagingSpec}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-white border border-[#C8A96A] text-[#14512C] font-mono font-bold text-[11px] shadow-sm">
                  Margin Policy: Min 25%–30% Margin (Target Buy ≤ 70%–75% FOB) | B2B 40%–50% &lt; D2C MSRP
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area: 74 Lines Table */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1F3A2E] text-white uppercase text-[10px] font-semibold tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">SL</th>
                  <th className="py-3 px-3">Code & Ref</th>
                  <th className="py-3 px-3">Product Name & Heading</th>
                  <th className="py-3 px-3">Category / Sub-Category</th>
                  <th className="py-3 px-3">Fit / Tech Clearance</th>
                  <th className="py-3 px-3">MOQ & HS</th>
                  <th className="py-3 px-3">4-Tier Buying Line (FOB Sell → Target Buy)</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDE8]">
                {filteredItems.map((item, idx) => {
                  const meta = getSectorMeta(item.sector);

                  return (
                    <tr
                      key={`${item.code}-${idx}`}
                      className="hover:bg-[#F7FAF8] transition-colors"
                    >
                      {/* SL & Prodt_ID */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-[#1F3A2E] bg-[#FAFCFA]">
                        {item.prodtId}
                      </td>

                      {/* Code */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-mono font-bold text-xs text-[#1F3A2E] bg-[#F4F6F4] px-2 py-0.5 rounded border border-[#DDE3DD] inline-block">
                          {item.code}
                        </div>
                        <div className="text-[10px] text-[#6B7269] mt-0.5 flex items-center gap-1">
                          <span>{meta.icon}</span>
                          <span className="font-semibold">{meta.label}</span>
                        </div>
                      </td>

                      {/* Product Heading */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-bold text-[#1F3A2E] text-xs leading-snug">
                          {item.productHeading || item.productName}
                        </div>
                        <div className="text-[10px] text-[#8A6D3B] font-mono mt-0.5">
                          {item.divisionName}
                        </div>
                      </td>

                      {/* Category & Sub-Category */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#1A1A1A] text-xs">
                          {item.category}
                        </div>
                        <div className="text-[11px] text-[#6B7269] mt-0.5">
                          {item.subCategory}
                        </div>
                      </td>

                      {/* Fit / Target Device */}
                      <td className="py-3 px-3 text-[#1A1A1A] max-w-[180px]">
                        <span className="text-[11px] text-[#1F3A2E] font-medium bg-[#F8FAF8] px-2 py-1 rounded border border-[#DDE3DD] inline-block">
                          {item.targetDeviceOrFit || 'Standard Commercial Dimensions'}
                        </span>
                      </td>

                      {/* MOQ & HS */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-mono text-[#1A1A1A] font-semibold">
                          MOQ: {item.typicalMoq} pcs
                        </div>
                        <div className="font-mono text-[10px] text-[#6B7269] mt-0.5">
                          HS {item.hsCode}
                        </div>
                      </td>

                      {/* Volume Pricing Tiers */}
                      <td className="py-3 px-3">
                        {item.tierPricing || item.volumePricing ? (
                          (() => {
                            const p = (item.tierPricing || item.volumePricing)!;
                            const t1Sell = (p.tier1 as any).sellUsd ?? (p.tier1 as any).sellPriceUsd;
                            const t2Sell = (p.tier2 as any).sellUsd ?? (p.tier2 as any).sellPriceUsd;
                            const t3Sell = (p.tier3 as any).sellUsd ?? (p.tier3 as any).sellPriceUsd;
                            const t4Sell = (p.tier4 as any).sellUsd ?? (p.tier4 as any).sellPriceUsd;
                            return (
                              <div className="space-y-0.5 text-[10px] font-mono">
                                <div className="flex items-center gap-1.5 text-[#14512C]">
                                  <span className="text-[#6B7269] font-medium">T1 ({p.tier1.qty}):</span>
                                  <span className="font-bold">${t1Sell}</span>
                                  <span className="text-[#6B7269]">→</span>
                                  <span className="bg-[#E4F3E9] px-1 py-0.2 rounded border border-[#BBE3C7] font-bold">
                                    Buy ${p.tier1.targetBuyUsd}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[#17456F]">
                                  <span className="text-[#6B7269] font-medium">T2:</span>
                                  <span>${t2Sell}</span>
                                  <span className="text-[#6B7269]">→</span>
                                  <span>Buy ${p.tier2.targetBuyUsd}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[#4A2E7A]">
                                  <span className="text-[#6B7269] font-medium">T3:</span>
                                  <span>${t3Sell}</span>
                                  <span className="text-[#6B7269]">→</span>
                                  <span>Buy ${p.tier3.targetBuyUsd}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[#8A6D3B]">
                                  <span className="text-[#6B7269] font-medium">T4:</span>
                                  <span>${t4Sell}</span>
                                  <span className="text-[#6B7269]">→</span>
                                  <span className="font-bold">Buy ${p.tier4.targetBuyUsd}</span>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <span className="text-[10px] text-[#6B7269] italic">
                            Formula: Max Buy = FOB Sell × 0.70–0.75 (25%–30% Margin)
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (onSelectRoadmapItem) {
                              onSelectRoadmapItem(item);
                            }
                            onClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1 ml-auto"
                          title="Adopt this official road map item into Product Development"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#C8A96A]" />
                          <span>Develop Model</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#DDE3DD] bg-[#F8FAF8] flex items-center justify-between text-xs text-[#6B7269] flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#1F3A2E]">
              Showing {filteredItems.length} of {MASTER_PRODUCT_ROADMAP.length} Official Catalog Lines
            </span>
            <span>•</span>
            <span>All FOB Prices quoted Ex-Chattogram Port / Dhaka Air Cargo</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-[#DDE3DD] hover:bg-slate-100 text-[#1A1A1A] font-semibold transition-colors"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
