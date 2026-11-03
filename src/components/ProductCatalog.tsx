'use client';

import React, { useState } from 'react';
import { ProductItem, ProductSector, CurrencyRate } from '@/types/erp';
import { StandardFactoryTechPack } from '@/types/techPack';
import { StandardFactoryTechPackModal } from '@/components/StandardFactoryTechPackModal';
import { ProductRoadmapModal } from '@/components/ProductRoadmapModal';
import { ExportLandedCostingModal } from '@/components/ExportLandedCostingModal';
import { SourcingVaultModal } from '@/components/SourcingVaultModal';
import {
  Package,
  Plus,
  Filter,
  Eye,
  SlidersHorizontal,
  Layers,
  Factory,
  Clock,
  CheckCircle,
  FileText,
  DollarSign,
  Tag,
  ArrowRight,
  Sparkles,
  Search,
  ExternalLink,
  Barcode,
  BookOpen,
  Calculator,
  ShieldCheck,
  TrendingUp,
  Landmark,
  Phone,
  MessageCircle,
  FileCheck2,
} from 'lucide-react';

interface ProductCatalogProps {
  products: ProductItem[];
  activeCurrency: CurrencyRate;
  onOpenAddModal: () => void;
  onSelectProduct: (product: ProductItem) => void;
  searchQuery: string;
  onUpdateProduct?: (updatedProduct: ProductItem) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  activeCurrency,
  onOpenAddModal,
  onSelectProduct,
  searchQuery,
  onUpdateProduct,
}) => {
  const [selectedSector, setSelectedSector] = useState<ProductSector | 'ALL'>('ALL');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'ALL' | 'LIVE' | 'NEGOTIATION' | 'COSTING_DRAFT'>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  
  // Modals state
  const [viewingTechPack, setViewingTechPack] = useState<StandardFactoryTechPack | null>(null);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [costingProduct, setCostingProduct] = useState<ProductItem | null>(null);
  const [vaultProduct, setVaultProduct] = useState<ProductItem | null>(null);

  // Filter products by sector, status, and search query
  const filteredProducts = products.filter((prod) => {
    const matchesSector = selectedSector === 'ALL' || prod.sector === selectedSector;
    
    let matchesStatus = true;
    if (selectedStatusTab === 'LIVE') {
      matchesStatus = prod.sampleStatus === 'BUYER_APPROVED' || prod.sampleStatus === 'IN_BULK_PRODUCTION';
    } else if (selectedStatusTab === 'NEGOTIATION') {
      matchesStatus = prod.sampleStatus === 'PROTO_REQUESTED' || (prod.costing?.negotiatedSavingsUsd || 0) > 0;
    } else if (selectedStatusTab === 'COSTING_DRAFT') {
      matchesStatus = prod.sampleStatus === 'DEVELOPMENT_PASSED' || !prod.costing?.b2bFobPriceUsd;
    }

    const matchesSearch =
      searchQuery === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.partnerFactory?.factoryName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.hsCode || '').includes(searchQuery);

    return matchesSector && matchesStatus && matchesSearch;
  });

  const getSectorBadge = (sector: ProductSector) => {
    switch (sector) {
      case 'LEATHER':
        return { label: 'Leather Goods', icon: '💼', color: 'bg-[#FAF5EC] text-[#8A6D3B] border-[#C8A96A]' };
      case 'JUTE':
        return { label: 'Jute Products', icon: '🛍️', color: 'bg-[#E4F3E9] text-[#14512C] border-[#BBE3C7]' };
      case 'TEXTILE':
        return { label: 'Apparel & Textiles', icon: '🧵', color: 'bg-[#E8F0FA] text-[#17456F] border-[#C5D7ED]' };
      case 'CERAMICS':
        return { label: 'Ceramics & Tableware', icon: '🍽️', color: 'bg-[#EDE7F6] text-[#4A2E7A] border-[#D6C7EC]' };
      case 'POTTERY':
        return { label: 'Pottery & Terracotta', icon: '🏺', color: 'bg-[#FDF3E7] text-[#9A3412] border-[#FDBA74]' };
    }
  };

  const getSampleStatusBadge = (status: ProductItem['sampleStatus']) => {
    switch (status) {
      case 'BUYER_APPROVED':
        return { label: 'Buyer Approved', color: 'bg-[#E4F3E9] text-[#14512C] border-[#BBE3C7]' };
      case 'IN_BULK_PRODUCTION':
        return { label: 'In Bulk Production', color: 'bg-[#E8F0FA] text-[#17456F] border-[#C5D7ED]' };
      case 'DEVELOPMENT_PASSED':
        return { label: 'R&D Passed', color: 'bg-[#EDE7F6] text-[#4A2E7A] border-[#D6C7EC]' };
      case 'PROTO_REQUESTED':
        return { label: 'Proto Requested', color: 'bg-[#FEF6E4] text-[#7A5508] border-[#FBE3B0]' };
    }
  };

  const bdtRate = 124.0;

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[#1F3A2E] text-[#C8A96A] text-[10px] font-mono font-bold tracking-wider uppercase">
              Department 1
            </span>
            <span className="text-xs text-[#8A6D3B] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#8A6D3B]" />
              <span>Product Master & Export Costing Engine</span>
            </span>
          </div>
          <h2 className="text-xl font-bold font-heading text-[#1F3A2E]">
            Export Product Master & Sourcing Vault
          </h2>
          <p className="text-xs text-[#6B7269] mt-0.5">
            “Win on purchase” tracking, 35-40% export landed costing, Bangladesh Bank 9.5% cash incentive, and verified factory MoUs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsRoadmapModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]/60 hover:bg-[#F3EAD8] text-xs font-semibold text-[#8A6D3B] transition shadow-xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#8A6D3B]" />
            <span>Master Roadmap (74 SKUs)</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-[#C8A96A] text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C8A96A]" />
            <span>+ Enlist New Product</span>
          </button>
        </div>
      </div>

      {/* Sourcing Lifecycle Tabs & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-[#DDE3DD]">
        {/* Status Lifecycle */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedStatusTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedStatusTab === 'ALL'
                ? 'bg-[#1F3A2E] text-white shadow-xs font-bold'
                : 'text-[#6B7269] hover:text-[#1A1A1A] hover:bg-slate-100'
            }`}
          >
            All Products ({products.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatusTab('LIVE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedStatusTab === 'LIVE'
                ? 'bg-[#14512C] text-white shadow-xs font-bold'
                : 'text-[#6B7269] hover:text-[#1A1A1A] hover:bg-slate-100'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#BBE3C7]" />
            <span>Catalog Live (Published FOB)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatusTab('NEGOTIATION')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedStatusTab === 'NEGOTIATION'
                ? 'bg-[#8A6D3B] text-white shadow-xs font-bold'
                : 'text-[#6B7269] hover:text-[#1A1A1A] hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#FBE3B0]" />
            <span>In Negotiation / Sourcing</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatusTab('COSTING_DRAFT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedStatusTab === 'COSTING_DRAFT'
                ? 'bg-[#17456F] text-white shadow-xs font-bold'
                : 'text-[#6B7269] hover:text-[#1A1A1A] hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-[#C5D7ED]" />
            <span>Costing Draft</span>
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center rounded-lg border border-[#DDE3DD] bg-white p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('GRID')}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                viewMode === 'GRID' ? 'bg-[#1F3A2E] text-white shadow-xs' : 'text-[#6B7269] hover:text-[#1A1A1A]'
              }`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('TABLE')}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                viewMode === 'TABLE' ? 'bg-[#1F3A2E] text-white shadow-xs' : 'text-[#6B7269] hover:text-[#1A1A1A]'
              }`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* Sector Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedSector('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border cursor-pointer ${
            selectedSector === 'ALL'
              ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-xs'
              : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border-[#DDE3DD]'
          }`}
        >
          All 5 Sectors ({products.length})
        </button>

        {(["JUTE", "LEATHER", "CERAMICS", "POTTERY", "TEXTILE"] as ProductSector[]).map((sector) => {
          const badge = getSectorBadge(sector);
          const count = products.filter((p) => p.sector === sector).length;
          const isSelected = selectedSector === sector;

          return (
            <button
              key={sector}
              type="button"
              onClick={() => setSelectedSector(sector)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-xs'
                  : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border-[#DDE3DD]'
              }`}
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F0F4F1] text-[#1A1A1A]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid View */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((prod) => {
            const sectorBadge = getSectorBadge(prod.sector);
            const statusBadge = getSampleStatusBadge(prod.sampleStatus);
            const costing = prod.costing || {};
            const savingsUsd = costing.negotiatedSavingsUsd || 0;
            const savingsBdt = costing.negotiatedSavingsBdt || savingsUsd * bdtRate;
            const purchaseUsd = costing.factoryCostUsd || 0;
            const purchaseBdt = costing.factoryCostBdt || purchaseUsd * bdtRate;
            const fobUsd = costing.b2bFobPriceUsd || 0;
            const marginPct = costing.arielSourcingMarginPct || 35.0;
            const netIncentivePct = costing.netIncentivePct ?? (prod.sector === 'JUTE' || prod.sector === 'LEATHER' ? 9.5 : 9.5);
            const totalYieldPct = costing.totalEnterpriseMarginPct || Number((marginPct + netIncentivePct).toFixed(1));

            return (
              <div
                key={prod.id}
                className="group rounded-2xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 text-[#1A1A1A]"
              >
                <div className="p-5 space-y-4">
                  {/* Top: Sector & Sample Status */}
                  <div className="flex items-start justify-between gap-2">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sectorBadge.color}`}>
                      <span>{sectorBadge.icon}</span>
                      <span>{sectorBadge.label}</span>
                    </span>

                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Title & SKU */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <span className="font-mono text-[#1F3A2E] font-bold text-xs bg-[#F4F6F4] px-2 py-0.5 rounded border border-[#DDE3DD]">
                        {prod.sku}
                      </span>
                      {prod.roadmapCode && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FAF5EC] text-[#8A6D3B] border border-[#C8A96A] font-bold">
                          Ref #{prod.prodtId} • {prod.roadmapCode}
                        </span>
                      )}
                      {prod.hsCode && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          HS {prod.hsCode}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold font-heading text-[#1F3A2E] group-hover:text-[#8A6D3B] transition-colors line-clamp-2">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-[#6B7269] mt-1 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  {/* Sourcing & Negotiation Section (Golden Rule) */}
                  <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#DDE3DD] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B7269] flex items-center gap-1 font-medium">
                        <Factory className="w-3.5 h-3.5 text-[#8A6D3B]" />
                        <span>Factory Purchase Cost:</span>
                      </span>
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#1F3A2E] text-xs">
                          ${purchaseUsd.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-[#6B7269] block font-mono">
                          (৳{purchaseBdt.toFixed(0)})
                        </span>
                      </div>
                    </div>

                    {/* Negotiation Savings Pill */}
                    {savingsUsd > 0 && (
                      <div className="p-1.5 rounded-lg bg-[#E4F3E9] border border-[#BBE3C7] flex items-center justify-between text-[10px]">
                        <span className="text-[#14512C] font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-[#14512C]" />
                          Negotiated Savings:
                        </span>
                        <span className="font-mono font-bold text-[#14512C]">
                          Saved +${savingsUsd.toFixed(2)} (৳{savingsBdt.toFixed(0)})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Export Pricing, Margins & Bangladesh Bank Subsidy */}
                  <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6B7269] font-medium">Published Export FOB:</span>
                      <span className="text-lg font-bold font-mono text-[#1F3A2E]">
                        ${fobUsd.toFixed(2)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#DDE3DD]">
                      <div>
                        <span className="text-[#6B7269] block text-[10px]">Commercial Margin</span>
                        <span className="font-mono font-bold text-[#1F3A2E]">
                          {marginPct.toFixed(1)}% (+${(fobUsd * (marginPct / 100)).toFixed(2)})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#14512C] block text-[10px] font-semibold">
                          Govt Cash Incentive
                        </span>
                        <span className="font-mono font-bold text-[#14512C]">
                          +{netIncentivePct}% Net
                        </span>
                      </div>
                    </div>

                    {/* True Enterprise Net Yield Banner */}
                    <div className="p-2 rounded-lg bg-[#1F3A2E] text-white flex items-center justify-between text-[11px]">
                      <span className="text-[#C8A96A] font-bold flex items-center gap-1">
                        <Landmark className="w-3 h-3 text-[#C8A96A]" />
                        <span>True Enterprise Yield:</span>
                      </span>
                      <span className="font-mono font-bold text-[#C8A96A] text-xs">
                        {totalYieldPct}% Return
                      </span>
                    </div>
                  </div>

                  {/* Partner Factory & Sourcing Link Pill */}
                  <div className="p-2.5 rounded-xl bg-white border border-[#DDE3DD] text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1F3A2E] truncate max-w-[180px]">
                        {prod.partnerFactory?.factoryName || 'Enlisted Partner Factory'}
                      </span>
                      <span className="text-[10px] font-mono text-[#8A6D3B] font-bold">
                        Lead: {prod.partnerFactory?.leadTimeDays || 21}d • MOQ: {prod.partnerFactory?.moq || 300}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#6B7269] pt-1 border-t border-slate-100">
                      <span>Sample: <strong>{prod.partnerFactory?.sampleTurnaroundDays || 7}d (Buyer DHL)</strong></span>
                      {prod.partnerFactory?.contactPhone && (
                        <a
                          href={`https://wa.me/${prod.partnerFactory.contactPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 border-t border-[#DDE3DD] bg-[#FAF9F5] flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCostingProduct(prod)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-white border border-[#DDE3DD] hover:border-[#1F3A2E] text-[11px] font-bold text-[#1F3A2E] transition cursor-pointer shadow-2xs"
                    title="Open Export Landed Costing & Bangladesh Bank Incentive Calculator"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#8A6D3B]" />
                    <span>Costing Engine</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVaultProduct(prod)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#FAF5EC] border border-[#C8A96A]/60 hover:bg-[#F3EAD8] text-[11px] font-bold text-[#8A6D3B] transition cursor-pointer shadow-2xs"
                    title="View Signed MoU, Factory Rating Scorecard, and Studio Photo Assets"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#8A6D3B]" />
                    <span>MoU & Vault</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectProduct(prod)}
                    className="p-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#162B22] text-[#C8A96A] transition cursor-pointer"
                    title="View Full Product TechPack & Specifications Dossier"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-[#DDE3DD] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead className="bg-[#FAF9F5] text-[11px] text-[#6B7269] uppercase font-bold border-b border-[#DDE3DD]">
                <tr>
                  <th className="py-3 px-4">SKU / Product</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">Factory Purchase</th>
                  <th className="py-3 px-4">Negotiated Savings</th>
                  <th className="py-3 px-4">Published FOB</th>
                  <th className="py-3 px-4">Commercial Margin</th>
                  <th className="py-3 px-4">Govt Incentive</th>
                  <th className="py-3 px-4">Total Net Yield</th>
                  <th className="py-3 px-4">Partner Factory</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD]">
                {filteredProducts.map((prod) => {
                  const costing = prod.costing || {};
                  const purchaseUsd = costing.factoryCostUsd || 0;
                  const savingsUsd = costing.negotiatedSavingsUsd || 0;
                  const fobUsd = costing.b2bFobPriceUsd || 0;
                  const marginPct = costing.arielSourcingMarginPct || 35.0;
                  const netIncentivePct = costing.netIncentivePct ?? 9.5;
                  const totalYieldPct = costing.totalEnterpriseMarginPct || Number((marginPct + netIncentivePct).toFixed(1));

                  return (
                    <tr key={prod.id} className="hover:bg-[#F8FAF8] transition">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-[#1F3A2E]">{prod.sku}</div>
                        <div className="font-semibold text-[#1A1A1A] truncate max-w-[200px]">{prod.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">{prod.sector}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#1F3A2E]">
                        ${purchaseUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#14512C] font-semibold">
                        {savingsUsd > 0 ? `+$${savingsUsd.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#1F3A2E]">
                        ${fobUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#1F3A2E]">
                        {marginPct.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#14512C]">
                        +{netIncentivePct}% Net
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#14512C]">
                        {totalYieldPct}%
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#1F3A2E] truncate max-w-[150px]">
                          {prod.partnerFactory?.factoryName || 'Factory'}
                        </div>
                        <div className="text-[10px] text-[#6B7269]">
                          Sample: {prod.partnerFactory?.sampleTurnaroundDays || 7}d (Buyer DHL)
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setCostingProduct(prod)}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-[#1F3A2E] text-xs transition cursor-pointer"
                            title="Open Costing Engine"
                          >
                            <Calculator className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setVaultProduct(prod)}
                            className="p-1 rounded bg-[#FAF5EC] hover:bg-[#F3EAD8] text-[#8A6D3B] text-xs transition cursor-pointer"
                            title="View MoU & Rating Vault"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectProduct(prod)}
                            className="p-1 rounded bg-[#1F3A2E] hover:bg-[#162B22] text-[#C8A96A] text-xs transition cursor-pointer"
                            title="View TechPack"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      <ExportLandedCostingModal
        product={costingProduct}
        isOpen={!!costingProduct}
        onClose={() => setCostingProduct(null)}
        onSaveCosting={(updated) => {
          onUpdateProduct?.(updated);
        }}
        bdtRate={bdtRate}
      />

      <SourcingVaultModal
        product={vaultProduct}
        isOpen={!!vaultProduct}
        onClose={() => setVaultProduct(null)}
      />

      {isRoadmapModalOpen && (
        <ProductRoadmapModal
          isOpen={isRoadmapModalOpen}
          onClose={() => setIsRoadmapModalOpen(false)}
        />
      )}

      {viewingTechPack && (
        <StandardFactoryTechPackModal
          isOpen={!!viewingTechPack}
          techPack={viewingTechPack}
          onClose={() => setViewingTechPack(null)}
        />
      )}
    </div>
  );
};
