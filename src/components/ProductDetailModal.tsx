'use client';

import React, { useState } from 'react';
import { ProductItem, CurrencyRate } from '@/types/erp';
import {
  X,
  Package,
  Factory,
  ShieldCheck,
  DollarSign,
  Layers,
  FileCheck2,
  Calendar,
  Sparkles,
  Download,
  CheckCircle2,
  Info,
  Barcode,
  Box,
  Truck,
  ShieldAlert
} from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductItem | null;
  activeCurrency: CurrencyRate;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  activeCurrency,
  onClose,
}) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'SPECS' | 'COSTING' | 'FACTORY' | 'COMPLIANCE' | 'PACKAGING'>('SPECS');

  const formatPrice = (usdAmount: number) => {
    const converted = usdAmount * activeCurrency.rateToUsd;
    return `${activeCurrency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F3A2E]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] flex items-start justify-between gap-4 text-white">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/15 text-white border border-white/20 font-semibold">
                {product.sku}
              </span>
              {product.styleCode && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-white/90 border border-white/20 font-semibold">
                  Style: {product.styleCode}
                </span>
              )}
              {product.eanBarcode && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#C8A96A]/25 text-[#F4E3B8] border border-[#C8A96A]/40 flex items-center gap-1 font-semibold">
                  <Barcode className="w-3.5 h-3.5 text-[#C8A96A]" />
                  EAN: {product.eanBarcode}
                </span>
              )}
              <span className="text-xs text-white/70">HS Code: {product.hsCode}</span>
              <span className="text-xs text-white/50">•</span>
              <span className="text-xs text-white/70">{product.category}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 font-montserrat tracking-tight">{product.name}</h2>
            {product.packagingMode && (
              <div className="mt-1 text-xs text-white/80 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span className="text-white/60">Packaging:</span>
                <span className="font-medium text-white">{product.packagingMode}</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tab Bar */}
        <div className="flex items-center px-6 border-b border-[#DDE3DD] bg-[#F8FAF8] gap-4 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('SPECS')}
            className={`py-3 border-b-2 transition-colors shrink-0 font-montserrat ${
              activeTab === 'SPECS'
                ? 'border-[#1F3A2E] text-[#1F3A2E] font-bold'
                : 'border-transparent text-[#6B7269] hover:text-[#1A1A1A]'
            }`}
          >
            Technical Specs & Attributes
          </button>
          <button
            onClick={() => setActiveTab('PACKAGING')}
            className={`py-3 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 font-montserrat ${
              activeTab === 'PACKAGING'
                ? 'border-[#C8A96A] text-[#1F3A2E] font-bold'
                : 'border-transparent text-[#6B7269] hover:text-[#1A1A1A]'
            }`}
          >
            <Barcode className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>GS1 Barcodes & 3PL Packaging</span>
          </button>
          <button
            onClick={() => setActiveTab('COSTING')}
            className={`py-3 border-b-2 transition-colors shrink-0 font-montserrat ${
              activeTab === 'COSTING'
                ? 'border-[#1F3A2E] text-[#1F3A2E] font-bold'
                : 'border-transparent text-[#6B7269] hover:text-[#1A1A1A]'
            }`}
          >
            4-Tier Costing & Margin Engine
          </button>
          <button
            onClick={() => setActiveTab('FACTORY')}
            className={`py-3 border-b-2 transition-colors shrink-0 font-montserrat ${
              activeTab === 'FACTORY'
                ? 'border-[#1F3A2E] text-[#1F3A2E] font-bold'
                : 'border-transparent text-[#6B7269] hover:text-[#1A1A1A]'
            }`}
          >
            Bangladesh Factory Profile
          </button>
          <button
            onClick={() => setActiveTab('COMPLIANCE')}
            className={`py-3 border-b-2 transition-colors shrink-0 font-montserrat ${
              activeTab === 'COMPLIANCE'
                ? 'border-[#1F3A2E] text-[#1F3A2E] font-bold'
                : 'border-transparent text-[#6B7269] hover:text-[#1A1A1A]'
            }`}
          >
            Export Compliance & Certifications
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs bg-[#F4F6F4]">
          {activeTab === 'SPECS' && (
            <div className="space-y-6">
              {/* Product Overview */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                <div className="font-semibold text-[#1F3A2E] text-sm font-montserrat">Product Description & Export Use-Case</div>
                <p className="text-[#1A1A1A] leading-relaxed text-xs">{product.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-full bg-[#E8EDE8] text-[#1F3A2E] text-[11px] font-medium border border-[#DDE3DD]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Physical Specifications */}
              <div>
                <h4 className="font-bold text-[#1F3A2E] uppercase tracking-wider text-[11px] mb-3 font-montserrat">
                  Physical Dimensions & Cargo Handling
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                    <span className="text-[#6B7269] text-[10px] block uppercase font-medium">Dimensions</span>
                    <span className="font-semibold text-[#1A1A1A] text-sm">{product.dimensions}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                    <span className="text-[#6B7269] text-[10px] block uppercase font-medium">Unit Net Weight</span>
                    <span className="font-semibold text-[#1A1A1A] text-sm">{product.weightKg} kg</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                    <span className="text-[#6B7269] text-[10px] block uppercase font-medium">Unit of Measure</span>
                    <span className="font-semibold text-[#1A1A1A] text-sm">{product.unit}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Sector Attributes */}
              <div>
                <h4 className="font-bold text-[#1F3A2E] uppercase tracking-wider text-[11px] mb-3 font-montserrat">
                  Sector-Specific Manufacturing Parameters ({product.sector})
                </h4>

                {product.attributes.sector === 'LEATHER' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Leather Classification</span>
                      <span className="font-semibold text-[#8A4415]">{product.attributes.data.leatherType}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Tanning Process</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.tanningMethod}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Raw Hide Origin</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.hideOrigin}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Thickness / Substance</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.thicknessMm}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Hardware Finish</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.hardwareFinish}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Edge Finishing</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.edgeFinish}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">EU REACH Compliance</span>
                      <span className="font-semibold text-[#14512C]">
                        {product.attributes.data.reachCompliant ? 'Fully Certified' : 'Pending'}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">LWG Tannery Rating</span>
                      <span className="font-bold text-[#8A6D3B]">{product.attributes.data.lwgCertification} Grade</span>
                    </div>
                  </div>
                )}

                {product.attributes.sector === 'JUTE' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Fabric Weave</span>
                      <span className="font-semibold text-[#14512C]">{product.attributes.data.construction}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Fabric Weight (GSM)</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.weightGsm} GSM</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Yarn Count</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.yarnCount}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Inner Lamination</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.lamination}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Bleach Standard</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.bleachStatus}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm col-span-2">
                      <span className="text-[#6B7269] text-[10px] block">Biodegradability Lifecycle</span>
                      <span className="font-semibold text-[#14512C]">{product.attributes.data.biodegradabilityRate}</span>
                    </div>
                  </div>
                )}

                {product.attributes.sector === 'TEXTILE' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Fiber Composition</span>
                      <span className="font-semibold text-[#4A2E7A]">{product.attributes.data.composition}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Thread Count (TC)</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.threadCount} TC</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Weave Pattern</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.weaveType}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Finishing Treatment</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.finishType}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm col-span-2">
                      <span className="text-[#6B7269] text-[10px] block">Dye Standard</span>
                      <span className="font-semibold text-[#14512C]">{product.attributes.data.dyeStandard}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm col-span-2">
                      <span className="text-[#6B7269] text-[10px] block">Shrinkage Tolerance</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.shrinkageLimit}</span>
                    </div>
                  </div>
                )}

                {product.attributes.sector === 'CERAMICS' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Clay Body Type</span>
                      <span className="font-semibold text-[#17456F]">{product.attributes.data.clayBody}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Glaze Finish</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.glazeType}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Kiln Firing Temperature</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.firingTempCelsius}°C</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm">
                      <span className="text-[#6B7269] text-[10px] block">Water Absorption Rate</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.waterAbsorption}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm col-span-2">
                      <span className="text-[#6B7269] text-[10px] block">Food Contact & Leaching Standard</span>
                      <span className="font-semibold text-[#14512C]">{product.attributes.data.foodContactSafety}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDE3DD] shadow-sm col-span-2">
                      <span className="text-[#6B7269] text-[10px] block">Thermal Shock Resistance</span>
                      <span className="font-medium text-[#1A1A1A]">{product.attributes.data.thermalShockResistance}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'COSTING' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] flex items-center justify-between text-white shadow-sm">
                <div>
                  <span className="text-xs text-[#C8A96A] font-bold uppercase tracking-wider">Pricing Architecture</span>
                  <div className="text-base font-bold text-white mt-0.5 font-montserrat">
                    Multi-Tier Commercial Export & D2C Margin Chain
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/70 block uppercase">Locked ArielMC Gross Margin</span>
                  <span className="text-lg font-mono font-bold text-[#C8A96A]">
                    +{product.costing.arielSourcingMarginPct}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cost Step 1: BD Factory Price */}
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7269] font-semibold text-xs uppercase tracking-wider">1. BD Factory Gate Cost</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F4F6F4] text-[#1A1A1A] border border-[#DDE3DD]">BDT & USD</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[#1A1A1A]">
                    ৳{product.costing.factoryCostBdt.toLocaleString()}
                  </div>
                  <div className="text-xs text-[#6B7269]">
                    Equivalent: <span className="font-mono text-[#1F3A2E] font-bold">${product.costing.factoryCostUsd.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Cost Step 2: B2B FOB Chattogram */}
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1F3A2E] font-semibold text-xs uppercase tracking-wider">2. B2B FOB Chattogram Port</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] font-semibold">Export Price</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[#1F3A2E]">
                    {formatPrice(product.costing.b2bFobPriceUsd)}
                  </div>
                  <div className="text-xs text-[#6B7269]">
                    Base FOB: <span className="font-mono text-[#1A1A1A] font-semibold">${product.costing.b2bFobPriceUsd.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Cost Step 3: CIF Regional Destinations */}
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                  <span className="text-[#6B7269] font-semibold text-xs uppercase tracking-wider">3. Regional Landed CIF Quotes</span>
                  <div className="space-y-2 pt-1 divide-y divide-[#DDE3DD]">
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-[#1A1A1A]">🇬🇧 CIF Felixstowe (UK):</span>
                      <span className="font-mono font-bold text-[#1F3A2E]">
                        £{product.costing.b2bCifPriceGbp?.toFixed(2) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1.5">
                      <span className="text-[#1A1A1A]">🇪🇺 CIF Rotterdam (EU):</span>
                      <span className="font-mono font-bold text-[#1F3A2E]">
                        €{product.costing.b2bCifPriceEur?.toFixed(2) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1.5">
                      <span className="text-[#1A1A1A]">🇺🇸 DDP Los Angeles (US):</span>
                      <span className="font-mono font-bold text-[#1F3A2E]">
                        ${product.costing.b2bDdpPriceUsd?.toFixed(2) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cost Step 4: D2C Flagship Store / Amazon FBA */}
                <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#C8A96A] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8A6D3B] font-semibold text-xs uppercase tracking-wider">4. D2C Flagship / Amazon Retail</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FEF6E4] text-[#7A5508] border border-[#FBE3B0] font-semibold">Consumer MSRP</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[#8A6D3B]">
                    {formatPrice(product.costing.d2cRetailPriceUsd)}
                  </div>
                  <div className="text-xs text-[#6B7269]">
                    Gross Brand Multiple: <span className="font-semibold text-[#14512C]">
                      {(product.costing.d2cRetailPriceUsd / product.costing.factoryCostUsd).toFixed(1)}x Factory Base
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FACTORY' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#1F3A2E] font-montserrat">
                      {product.partnerFactory.factoryName}
                    </h3>
                    <p className="text-xs text-[#6B7269] mt-0.5">
                      {product.partnerFactory.location}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-[#1F3A2E] text-[#C8A96A] font-bold font-mono border border-[#C8A96A]">
                    ★ {product.partnerFactory.rating} / 5.0
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#DDE3DD] text-xs">
                  <div>
                    <span className="text-[#6B7269] block text-[10px] uppercase font-medium">Standard Production Lead Time</span>
                    <span className="font-bold text-[#1A1A1A] text-sm">{product.partnerFactory.leadTimeDays} Calendar Days</span>
                  </div>
                  <div>
                    <span className="text-[#6B7269] block text-[10px] uppercase font-medium">Minimum Order Quantity (MOQ)</span>
                    <span className="font-bold text-[#1A1A1A] text-sm">{product.partnerFactory.moq} {product.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'COMPLIANCE' && (
            <div className="space-y-4">
              <div className="text-xs text-[#6B7269]">
                Verified compliance certifications required for customs clearance in target zones (UK, EU, US, AU):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.complianceCertificates.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-white border border-[#DDE3DD] shadow-sm flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#14512C] shrink-0" />
                    <span className="font-semibold text-[#1A1A1A] text-xs">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'PACKAGING' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-4 rounded-xl bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white flex items-start justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-[#C8A96A]" />
                    <span className="font-bold text-white text-sm font-montserrat">Official GS1 Bangladesh Barcoding & Dual-3PL Packaging</span>
                  </div>
                  <p className="text-white/80 text-xs">
                    Standardized SKU syntax, GS1 GEPIR-registered EAN-13 barcodes, and dual 3PL warehouse prep guidelines for UK (Northampton) & Germany (Hamburg/Ruhr).
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#C8A96A]/20 border border-[#C8A96A]/40 text-[#F4E3B8] font-mono text-xs font-semibold shrink-0">
                  GS1 Prefix: 053 (BD)
                </div>
              </div>

              {/* Grid 1: Barcode & Hierarchy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1F3A2E] uppercase tracking-wider text-[11px] flex items-center gap-1.5 font-montserrat">
                      <Barcode className="w-3.5 h-3.5 text-[#1F3A2E]" />
                      GTIN-13 / EAN-13 Barcode
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] font-mono text-[10px] font-semibold">
                      GS1 GEPIR Verified
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#6B7269] block font-mono">Assigned EAN-13</span>
                      <span className="text-base font-bold font-mono text-[#8A6D3B] tracking-wider">
                        {product.eanBarcode || 'Pending Generation'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#6B7269] block">Style Code</span>
                      <span className="text-xs font-mono font-bold text-[#1F3A2E]">
                        {product.styleCode || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-[#1A1A1A]">
                    <div className="flex justify-between py-1 border-b border-[#DDE3DD]">
                      <span className="text-[#6B7269]">GS1 Issuing Authority:</span>
                      <span className="font-semibold text-[#1A1A1A]">MCCI Dhaka (GS1 Bangladesh)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#DDE3DD]">
                      <span className="text-[#6B7269]">SKU Code Architecture:</span>
                      <span className="font-mono text-[#1F3A2E] font-semibold">{product.sku}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#6B7269]">Amazon Marketplace:</span>
                      <span className="text-[#14512C] font-semibold">Valid for Amazon UK & DE Brand Registry</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1F3A2E] uppercase tracking-wider text-[11px] flex items-center gap-1.5 font-montserrat">
                      <Box className="w-3.5 h-3.5 text-[#C8A96A]" />
                      3PL Packaging Specification
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#E8F0FA] text-[#17456F] border border-[#C5D7ED] text-[10px] font-semibold">
                      Dual-Hub Standard
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD]">
                    <span className="text-[10px] text-[#6B7269] block uppercase font-medium">Unit Packaging Mode</span>
                    <span className="text-xs font-semibold text-[#1A1A1A] block mt-0.5">
                      {product.packagingMode || 'Standard poly-sleeve with hangtag'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-[#1A1A1A]">
                    <div className="flex justify-between py-1 border-b border-[#DDE3DD]">
                      <span className="text-[#6B7269]">Hangtag / Polybag Label:</span>
                      <span className="font-semibold text-[#1A1A1A]">50x30mm or 60x40mm (EAN-13 + Made in BD)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#DDE3DD]">
                      <span className="text-[#6B7269]">Leather Surface Rule:</span>
                      <span className="text-[#8A4415] font-semibold">Affix to dustbag only, never on leather</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#6B7269]">Master Shipping Barcode:</span>
                      <span className="font-mono text-[#1F3A2E] font-semibold">ITF-14 / Code-128 Master Carton</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Ocean Freight & Warehouse Handling Protocols */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
                <h4 className="font-bold text-[#1F3A2E] uppercase tracking-wider text-[11px] flex items-center gap-2 font-montserrat">
                  <Truck className="w-4 h-4 text-[#14512C]" />
                  Maritime Transit Protection & 3PL Warehouse Routing
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] space-y-1">
                    <span className="text-[#6B7269] text-[10px] block uppercase font-medium">Moisture & Mold Defense</span>
                    <span className="text-xs font-bold text-[#1F3A2E] block">Calcium Chloride Poles</span>
                    <p className="text-[11px] text-[#6B7269] mt-1 leading-relaxed">
                      Container desiccant poles + 5g–10g clay packet inside bag cavity for 35-45 day voyage.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] space-y-1">
                    <span className="text-[#6B7269] text-[10px] block uppercase font-medium">ISO Master Carton Icons</span>
                    <span className="text-xs font-bold text-[#1F3A2E] block">↑↑ This Side Up & Umbrella</span>
                    <p className="text-[11px] text-[#6B7269] mt-1 leading-relaxed">
                      Printed on master shipping boxes to prevent port workers stacking leather boxes upside down.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] space-y-1">
                    <span className="text-[#6B7269] text-[10px] block uppercase font-medium">Zero-Tariff Preference</span>
                    <span className="text-xs font-bold text-[#14512C] block">0% Duty (EBA & DCTS)</span>
                    <p className="text-[11px] text-[#6B7269] mt-1 leading-relaxed">
                      EU Everything But Arms (REX on invoice) and UK DCTS comprehensive preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#DDE3DD] bg-[#F8FAF8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7269]">Sample Approval Status:</span>
            <span className="font-bold text-[#14512C] text-xs font-mono uppercase">
              {product.sampleStatus.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-[#1A1A1A] border border-[#DDE3DD] text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => alert(`Exporting Tech Pack PDF & BOM for SKU: ${product.sku}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-bold shadow-md shadow-[#1F3A2E]/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Tech Pack & BOM</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
