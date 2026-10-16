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
  ExternalLink,
  Barcode
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
          color: 'bg-[#FAF5EC] text-[#8A6D3B] border-[#C8A96A]',
        };
      case 'JUTE':
        return {
          label: 'Jute & Diversified',
          icon: '🌾',
          color: 'bg-[#E4F3E9] text-[#14512C] border-[#BBE3C7]',
        };
      case 'TEXTILE':
        return {
          label: 'Home Textiles',
          icon: '🧵',
          color: 'bg-[#E8F0FA] text-[#17456F] border-[#C5D7ED]',
        };
      case 'CERAMICS':
        return {
          label: 'Ceramics & Pottery',
          icon: '🏺',
          color: 'bg-[#EDE7F6] text-[#4A2E7A] border-[#D6C7EC]',
        };
    }
  };

  const getSampleStatusBadge = (status: ProductItem['sampleStatus']) => {
    switch (status) {
      case 'BUYER_APPROVED':
        return {
          label: 'Buyer Approved',
          color: 'bg-[#E4F3E9] text-[#14512C] border-[#BBE3C7]',
        };
      case 'IN_BULK_PRODUCTION':
        return {
          label: 'In Bulk Production',
          color: 'bg-[#E8F0FA] text-[#17456F] border-[#C5D7ED]',
        };
      case 'DEVELOPMENT_PASSED':
        return {
          label: 'R&D Passed',
          color: 'bg-[#EDE7F6] text-[#4A2E7A] border-[#D6C7EC]',
        };
      case 'PROTO_REQUESTED':
        return {
          label: 'Proto Requested',
          color: 'bg-[#FEF6E4] text-[#7A5508] border-[#FBE3B0]',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-[#1F3A2E] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#1F3A2E]" />
            <span>Master Product Catalog & Dynamic Taxonomy</span>
          </h2>
          <p className="text-xs text-[#6B7269] mt-0.5">
            Technical specs, Bangladesh factory costs, locked sourcing margins, and export compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center bg-white border border-[#DDE3DD] rounded-lg p-0.5 text-xs shadow-sm">
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                viewMode === 'GRID' ? 'bg-[#1F3A2E] text-white shadow-sm' : 'text-[#6B7269] hover:text-[#1A1A1A]'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                viewMode === 'TABLE' ? 'bg-[#1F3A2E] text-white shadow-sm' : 'text-[#6B7269] hover:text-[#1A1A1A]'
              }`}
            >
              Table View
            </button>
          </div>

          {/* Add New Master Product */}
          <button
            id="add-new-sku-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-[#C8A96A]" />
            <span>Create Master SKU</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs by Sector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDE3DD] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedSector('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedSector === 'ALL'
                ? 'bg-[#1F3A2E] text-white shadow-sm'
                : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border border-[#DDE3DD]'
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
                    ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-sm'
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

        {/* Target Market Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#6B7269] font-medium">Target Zone:</span>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="bg-white text-xs font-medium text-[#1A1A1A] border border-[#DDE3DD] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#1F3A2E] shadow-sm"
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
                className="group rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md text-[#1A1A1A]"
              >
                <div className="p-5 space-y-4">
                  {/* Top: Sector & SKU */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sectorBadge.color}`}
                    >
                      <span>{sectorBadge.icon}</span>
                      <span>{sectorBadge.label}</span>
                    </span>

                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${statusBadge.color}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Product Title & Category */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="font-mono text-[#1F3A2E] font-semibold text-xs bg-[#F4F6F4] px-2 py-0.5 rounded border border-[#DDE3DD]">
                        {prod.sku}
                      </span>
                      {prod.styleCode && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E8F0FA] text-[#17456F] border border-[#C5D7ED] font-semibold">
                          Style {prod.styleCode}
                        </span>
                      )}
                      {prod.eanBarcode && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FEF6E4] text-[#7A5508] border border-[#FBE3B0] flex items-center gap-1 font-semibold">
                          <Barcode className="w-3 h-3 text-[#7A5508]" />
                          {prod.eanBarcode}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold font-heading text-[#1F3A2E] group-hover:text-[#8A6D3B] transition-colors line-clamp-2">
                      {prod.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-[#6B7269] flex-wrap">
                      <span>HS {prod.hsCode}</span>
                      {prod.packagingMode && (
                        <>
                          <span>•</span>
                          <span className="text-[11px] text-[#1A1A1A] font-medium bg-[#F8FAF8] px-2 py-0.5 rounded border border-[#DDE3DD]">
                            📦 {prod.packagingMode}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sourcing Partner & Bangladesh Region */}
                  <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[#1A1A1A]">
                      <span className="flex items-center gap-1.5 text-[#6B7269] text-[11px]">
                        <Factory className="w-3.5 h-3.5 text-[#8A6D3B]" />
                        <span>Sourcing Factory:</span>
                      </span>
                      <span className="font-semibold text-[#1F3A2E] truncate max-w-[150px]">
                        {prod.partnerFactory.factoryName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#6B7269]">
                      <span>{prod.partnerFactory.location}</span>
                      <span className="text-[#1A1A1A] font-mono font-medium">
                        Lead: {prod.partnerFactory.leadTimeDays}d • MOQ: {prod.partnerFactory.moq}
                      </span>
                    </div>
                  </div>

                  {/* Sector Key Attributes Summary */}
                  <div className="text-[11px] text-[#1A1A1A] bg-[#F4F6F4] rounded-lg p-2.5 border border-[#DDE3DD] space-y-1">
                    {prod.sector === 'LEATHER' && prod.attributes.sector === 'LEATHER' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-[#6B7269]">Leather:</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {prod.attributes.data.leatherType} {prod.attributes.data.hideOrigin} ({prod.attributes.data.tanningMethod})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B7269]">Hardware & Certification:</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {prod.attributes.data.hardwareFinish} • LWG {prod.attributes.data.lwgCertification}
                          </span>
                        </div>
                      </>
                    )}

                    {prod.sector === 'JUTE' && prod.attributes.sector === 'JUTE' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-[#6B7269]">Weave & GSM:</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {prod.attributes.data.construction} • {prod.attributes.data.weightGsm} GSM
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B7269]">Lamination:</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {prod.attributes.data.lamination}
                          </span>
                        </div>
                      </>
                    )}

                    {prod.sector === 'TEXTILE' && prod.attributes.sector === 'TEXTILE' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-[#6B7269]">Fabric & TC:</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {prod.attributes.data.composition} • {prod.attributes.data.threadCount} TC
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B7269]">Weave & Finish:</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {prod.attributes.data.weaveType} • {prod.attributes.data.finishType}
                          </span>
                        </div>
                      </>
                    )}

                    {prod.sector === 'CERAMICS' && prod.attributes.sector === 'CERAMICS' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-[#6B7269]">Body & Glaze:</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {prod.attributes.data.clayBody} • {prod.attributes.data.glazeType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B7269]">Firing & Food Safety:</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {prod.attributes.data.firingTempCelsius}°C • {prod.attributes.data.foodContactSafety.split(' ')[0]}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Multi-Tier Commercial Pricing Matrix */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B7269]">Factory Base:</span>
                      <span className="font-mono text-[#1A1A1A]">
                        ৳{prod.costing.factoryCostBdt.toLocaleString()} (${prod.costing.factoryCostUsd})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B7269]">ArielMC Locked Margin:</span>
                      <span className="font-mono text-[#14512C] font-bold">
                        +{prod.costing.arielSourcingMarginPct}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#E4F3E9] border border-[#BBE3C7] text-xs">
                      <span className="text-[#14512C] font-semibold">B2B FOB Chattogram:</span>
                      <span className="font-mono font-bold text-[#14512C] text-sm">
                        {formatPrice(prod.costing.b2bFobPriceUsd)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#6B7269] px-1">
                      <span>D2C Retail (Amazon/Shopify):</span>
                      <span className="font-mono text-[#8A6D3B] font-bold">
                        {formatPrice(prod.costing.d2cRetailPriceUsd)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-3 border-t border-[#DDE3DD] bg-[#F8FAF8] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {prod.targetMarkets.map((m) => (
                      <span
                        key={m}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#1F3A2E] border border-[#DDE3DD] font-semibold"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectProduct(prod)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#1F3A2E] hover:text-[#8A6D3B] transition-colors"
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
        <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
          <table className="w-full text-left text-xs text-[#1A1A1A]">
            <thead className="bg-[#1F3A2E] text-white uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-heading">Master SKU & Name</th>
                <th className="py-3.5 px-4 font-heading">Sector</th>
                <th className="py-3.5 px-4 font-heading">HS Code</th>
                <th className="py-3.5 px-4 font-heading">BD Sourcing Factory</th>
                <th className="py-3.5 px-4 font-heading">Factory Cost</th>
                <th className="py-3.5 px-4 font-heading">B2B FOB Ctg</th>
                <th className="py-3.5 px-4 font-heading">D2C Retail</th>
                <th className="py-3.5 px-4 font-heading">Status</th>
                <th className="py-3.5 px-4 font-heading text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE3DD]">
              {filteredProducts.map((prod) => {
                const sectorBadge = getSectorBadge(prod.sector);
                const statusBadge = getSampleStatusBadge(prod.sampleStatus);

                return (
                  <tr key={prod.id} className="hover:bg-[#F7FAF8] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1F3A2E] text-xs">{prod.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="font-mono text-[#1F3A2E] font-semibold text-[11px] bg-[#F4F6F4] px-1.5 py-0.5 rounded border border-[#DDE3DD]">{prod.sku}</span>
                        {prod.styleCode && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E8F0FA] text-[#17456F] border border-[#C5D7ED] font-semibold">
                            Style {prod.styleCode}
                          </span>
                        )}
                        {prod.eanBarcode && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FEF6E4] text-[#7A5508] border border-[#FBE3B0] flex items-center gap-1 font-semibold">
                            <Barcode className="w-2.5 h-2.5 text-[#7A5508]" />
                            {prod.eanBarcode}
                          </span>
                        )}
                      </div>
                      {prod.packagingMode && (
                        <div className="text-[10px] text-[#6B7269] mt-1">
                          📦 {prod.packagingMode}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${sectorBadge.color}`}>
                        {sectorBadge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#6B7269]">{prod.hsCode}</td>
                    <td className="py-3 px-4">
                      <div className="text-[#1F3A2E] font-medium">{prod.partnerFactory.factoryName}</div>
                      <div className="text-[10px] text-[#6B7269]">{prod.partnerFactory.location}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      ৳{prod.costing.factoryCostBdt} (${prod.costing.factoryCostUsd})
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#14512C]">
                      {formatPrice(prod.costing.b2bFobPriceUsd)}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#8A6D3B]">
                      {formatPrice(prod.costing.d2cRetailPriceUsd)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectProduct(prod)}
                        className="px-2.5 py-1 rounded bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-semibold shadow-sm transition-all"
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
