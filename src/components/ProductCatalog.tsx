'use client';

import React, { useState } from 'react';
import { ProductItem, ProductSector, CurrencyRate } from '@/types/erp';
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
  ExternalLink
} from 'lucide-react';

interface ProductCatalogProps {
  products: ProductItem[];
  activeCurrency: CurrencyRate;
  onOpenAddModal: () => void;
  onSelectProduct: (product: ProductItem) => void;
  searchQuery: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  activeCurrency,
  onOpenAddModal,
  onSelectProduct,
  searchQuery,
}) => {
  const [selectedSector, setSelectedSector] = useState<ProductSector | 'ALL'>('ALL');
  const [selectedMarket, setSelectedMarket] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Filter products by sector, market, and search query
  const filteredProducts = products.filter((prod) => {
    const matchesSector = selectedSector === 'ALL' || prod.sector === selectedSector;
    const matchesMarket = selectedMarket === 'ALL' || prod.targetMarkets.includes(selectedMarket as any);
    const matchesSearch = 
      searchQuery === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.partnerFactory.factoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.hsCode.includes(searchQuery);

    return matchesSector && matchesMarket && matchesSearch;
  });

  // Currency Converter Helper
  const formatPrice = (usdAmount: number) => {
    const converted = usdAmount * activeCurrency.rateToUsd;
    return `${activeCurrency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getSectorBadge = (sector: ProductSector) => {
    switch (sector) {
      case 'LEATHER':
        return {
          label: 'Leather Goods',
          icon: '👞',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      case 'JUTE':
        return {
          label: 'Jute & Diversified',
          icon: '🌾',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      case 'TEXTILE':
        return {
          label: 'Home Textiles',
          icon: '🧵',
          color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        };
      case 'CERAMICS':
        return {
          label: 'Ceramics & Pottery',
          icon: '🏺',
          color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        };
    }
  };

  const getSampleStatusBadge = (status: ProductItem['sampleStatus']) => {
    switch (status) {
      case 'BUYER_APPROVED':
        return {
          label: 'Buyer Approved',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'IN_BULK_PRODUCTION':
        return {
          label: 'In Bulk Production',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        };
      case 'DEVELOPMENT_PASSED':
        return {
          label: 'R&D Passed',
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        };
      case 'PROTO_REQUESTED':
        return {
          label: 'Proto Requested',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            <span>Master Product Catalog & Dynamic Taxonomy</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Technical specs, Bangladesh factory costs, locked sourcing margins, and export compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'GRID' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'TABLE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Table View
            </button>
          </div>

          {/* Add New Master Product */}
          <button
            id="add-new-sku-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Master SKU</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs by Sector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedSector('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedSector === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Sectors ({products.length})
          </button>

          {(['LEATHER', 'JUTE', 'TEXTILE', 'CERAMICS'] as ProductSector[]).map((sector) => {
            const badge = getSectorBadge(sector);
            const count = products.filter((p) => p.sector === sector).length;
            const isSelected = selectedSector === sector;

            return (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-slate-800 text-white border-blue-500 shadow-sm shadow-blue-500/20 ring-1 ring-blue-500/40'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Target Market Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Target Zone:</span>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="bg-slate-900 text-xs font-medium text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Markets (UK / EU / US / AU)</option>
            <option value="UK">🇬🇧 United Kingdom</option>
            <option value="EU">🇪🇺 European Union</option>
            <option value="US">🇺🇸 United States</option>
            <option value="AU">🇦🇺 Australia</option>
          </select>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((prod) => {
            const sectorBadge = getSectorBadge(prod.sector);
            const statusBadge = getSampleStatusBadge(prod.sampleStatus);

            return (
              <div
                key={prod.id}
                className="group rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col justify-between overflow-hidden shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/5"
              >
                <div className="p-5 space-y-4">
                  {/* Top: Sector & SKU */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${sectorBadge.color}`}
                    >
                      <span>{sectorBadge.icon}</span>
                      <span>{sectorBadge.label}</span>
                    </span>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusBadge.color}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Product Title & Category */}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                      {prod.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="font-mono text-slate-300 font-semibold">{prod.sku}</span>
                      <span>•</span>
                      <span>HS {prod.hsCode}</span>
                    </div>
                  </div>

                  {/* Sourcing Partner & Bangladesh Region */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Factory className="w-3.5 h-3.5 text-amber-400" />
                        <span>Sourcing Factory:</span>
                      </span>
                      <span className="font-semibold text-white truncate max-w-[150px]">
                        {prod.partnerFactory.factoryName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{prod.partnerFactory.location}</span>
                      <span className="text-slate-300 font-mono">
                        Lead: {prod.partnerFactory.leadTimeDays}d • MOQ: {prod.partnerFactory.moq}
                      </span>
                    </div>
                  </div>

                  {/* Sector Key Attributes Summary */}
                  <div className="text-[11px] text-slate-300 bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 space-y-1">
                    {prod.sector === 'LEATHER' && prod.attributes.sector === 'LEATHER' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Leather:</span>
                          <span className="font-medium text-slate-200">
                            {prod.attributes.data.leatherType} {prod.attributes.data.hideOrigin} ({prod.attributes.data.tanningMethod})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Hardware & Certification:</span>
                          <span className="font-medium text-slate-200">
                            {prod.attributes.data.hardwareFinish} • LWG {prod.attributes.data.lwgCertification}
                          </span>
                        </div>
                      </>
                    )}

                    {prod.sector === 'JUTE' && prod.attributes.sector === 'JUTE' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Weave & GSM:</span>
                          <span className="font-medium text-slate-200">
                            {prod.attributes.data.construction} • {prod.attributes.data.weightGsm} GSM
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Lamination:</span>
                          <span className="font-medium text-slate-200">
                            {prod.attributes.data.lamination}
                          </span>
                        </div>
                      </>
                    )}

                    {prod.sector === 'TEXTILE' && prod.attributes.sector === 'TEXTILE' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Fabric & TC:</span>
                          <span className="font-medium text-slate-200">
                            {prod.attributes.data.composition} • {prod.attributes.data.threadCount} TC
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Weave & Finish:</span>
                          <span className="font-medium text-slate-200">
                            {prod.attributes.data.weaveType} • {prod.attributes.data.finishType}
                          </span>
                        </div>
                      </>
                    )}

                    {prod.sector === 'CERAMICS' && prod.attributes.sector === 'CERAMICS' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Body & Glaze:</span>
                          <span className="font-medium text-slate-200">
                            {prod.attributes.data.clayBody} • {prod.attributes.data.glazeType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Firing & Food Safety:</span>
                          <span className="font-medium text-slate-200">
                            {prod.attributes.data.firingTempCelsius}°C • {prod.attributes.data.foodContactSafety.split(' ')[0]}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Multi-Tier Commercial Pricing Matrix */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Factory Base:</span>
                      <span className="font-mono text-slate-300">
                        ৳{prod.costing.factoryCostBdt.toLocaleString()} (${prod.costing.factoryCostUsd})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Ariel Locked Margin:</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        +{prod.costing.arielSourcingMarginPct}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-blue-950/30 border border-blue-500/20 text-xs">
                      <span className="text-blue-300 font-medium">B2B FOB Chattogram:</span>
                      <span className="font-mono font-bold text-white text-sm">
                        {formatPrice(prod.costing.b2bFobPriceUsd)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>D2C Retail (Amazon/Shopify):</span>
                      <span className="font-mono text-amber-300 font-semibold">
                        {formatPrice(prod.costing.d2cRetailPriceUsd)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {prod.targetMarkets.map((m) => (
                      <span
                        key={m}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectProduct(prod)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>View Tech Specs & BOM</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Master SKU & Name</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">HS Code</th>
                <th className="py-3 px-4">BD Sourcing Factory</th>
                <th className="py-3 px-4">Factory Cost</th>
                <th className="py-3 px-4">B2B FOB Ctg</th>
                <th className="py-3 px-4">D2C Retail</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.map((prod) => {
                const sectorBadge = getSectorBadge(prod.sector);
                const statusBadge = getSampleStatusBadge(prod.sampleStatus);

                return (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-xs">{prod.name}</div>
                      <div className="font-mono text-slate-400 text-[11px]">{prod.sku}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] ${sectorBadge.color}`}>
                        {sectorBadge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">{prod.hsCode}</td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200 font-medium">{prod.partnerFactory.factoryName}</div>
                      <div className="text-[10px] text-slate-400">{prod.partnerFactory.location}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      ৳{prod.costing.factoryCostBdt} (${prod.costing.factoryCostUsd})
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {formatPrice(prod.costing.b2bFobPriceUsd)}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-amber-400">
                      {formatPrice(prod.costing.d2cRetailPriceUsd)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectProduct(prod)}
                        className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-medium transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
