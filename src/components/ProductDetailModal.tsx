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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/30 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                {product.sku}
              </span>
              {product.styleCode && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-900/30 text-blue-200 border border-blue-700/40 font-semibold">
                  Style: {product.styleCode}
                </span>
              )}
              {product.eanBarcode && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-600/40 flex items-center gap-1 font-semibold">
                  <Barcode className="w-3.5 h-3.5 text-amber-400" />
                  EAN: {product.eanBarcode}
                </span>
              )}
              <span className="text-xs text-slate-400">HS Code: {product.hsCode}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400">{product.category}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5">{product.name}</h2>
            {product.packagingMode && (
              <div className="mt-1 text-xs text-slate-300 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Packaging:</span>
                <span className="font-medium text-slate-200">{product.packagingMode}</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tab Bar */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-950/40 gap-4 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('SPECS')}
            className={`py-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'SPECS'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Technical Specs & Attributes
          </button>
          <button
            onClick={() => setActiveTab('PACKAGING')}
            className={`py-3 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'PACKAGING'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Barcode className="w-3.5 h-3.5" />
            <span>GS1 Barcodes & 3PL Packaging</span>
          </button>
          <button
            onClick={() => setActiveTab('COSTING')}
            className={`py-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'COSTING'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4-Tier Costing & Margin Engine
          </button>
          <button
            onClick={() => setActiveTab('FACTORY')}
            className={`py-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'FACTORY'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Bangladesh Factory Profile
          </button>
          <button
            onClick={() => setActiveTab('COMPLIANCE')}
            className={`py-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'COMPLIANCE'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Export Compliance & Certifications
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'SPECS' && (
            <div className="space-y-6">
              {/* Product Overview */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="font-semibold text-slate-200 text-sm">Product Description & Export Use-Case</div>
                <p className="text-slate-300 leading-relaxed text-xs">{product.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Physical Specifications */}
              <div>
                <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
                  Physical Dimensions & Cargo Handling
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Dimensions</span>
                    <span className="font-semibold text-slate-100">{product.dimensions}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Unit Net Weight</span>
                    <span className="font-semibold text-slate-100">{product.weightKg} kg</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Unit of Measure</span>
                    <span className="font-semibold text-slate-100">{product.unit}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Sector Attributes */}
              <div>
                <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
                  Sector-Specific Manufacturing Parameters ({product.sector})
                </h4>

                {product.attributes.sector === 'LEATHER' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Leather Classification</span>
                      <span className="font-medium text-amber-300">{product.attributes.data.leatherType}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Tanning Process</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.tanningMethod}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Raw Hide Origin</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.hideOrigin}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Thickness / Substance</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.thicknessMm}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Hardware Finish</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.hardwareFinish}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Edge Finishing</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.edgeFinish}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">EU REACH Compliance</span>
                      <span className="font-medium text-emerald-400">
                        {product.attributes.data.reachCompliant ? 'Fully Certified' : 'Pending'}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">LWG Tannery Rating</span>
                      <span className="font-medium text-amber-400 font-bold">{product.attributes.data.lwgCertification} Grade</span>
                    </div>
                  </div>
                )}

                {product.attributes.sector === 'JUTE' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Fabric Weave</span>
                      <span className="font-medium text-emerald-300">{product.attributes.data.construction}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Fabric Weight (GSM)</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.weightGsm} GSM</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Yarn Count</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.yarnCount}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Inner Lamination</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.lamination}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Bleach Standard</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.bleachStatus}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 col-span-2">
                      <span className="text-slate-400 text-[10px] block">Biodegradability Lifecycle</span>
                      <span className="font-medium text-emerald-400">{product.attributes.data.biodegradabilityRate}</span>
                    </div>
                  </div>
                )}

                {product.attributes.sector === 'TEXTILE' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Fiber Composition</span>
                      <span className="font-medium text-indigo-300">{product.attributes.data.composition}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Thread Count (TC)</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.threadCount} TC</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Weave Pattern</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.weaveType}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Finishing Treatment</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.finishType}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 col-span-2">
                      <span className="text-slate-400 text-[10px] block">Dye Standard</span>
                      <span className="font-medium text-emerald-400">{product.attributes.data.dyeStandard}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 col-span-2">
                      <span className="text-slate-400 text-[10px] block">Shrinkage Tolerance</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.shrinkageLimit}</span>
                    </div>
                  </div>
                )}

                {product.attributes.sector === 'CERAMICS' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Clay Body Type</span>
                      <span className="font-medium text-cyan-300">{product.attributes.data.clayBody}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Glaze Finish</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.glazeType}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Kiln Firing Temperature</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.firingTempCelsius}°C</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Water Absorption Rate</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.waterAbsorption}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 col-span-2">
                      <span className="text-slate-400 text-[10px] block">Food Contact & Leaching Standard</span>
                      <span className="font-medium text-emerald-400">{product.attributes.data.foodContactSafety}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 col-span-2">
                      <span className="text-slate-400 text-[10px] block">Thermal Shock Resistance</span>
                      <span className="font-medium text-slate-200">{product.attributes.data.thermalShockResistance}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'COSTING' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-300 font-semibold uppercase">Pricing Architecture</span>
                  <div className="text-base font-bold text-white mt-0.5">
                    Multi-Tier Commercial Export & D2C Margin Chain
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Locked ArielMC Gross Margin</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">
                    +{product.costing.arielSourcingMarginPct}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cost Step 1: BD Factory Price */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">1. BD Factory Gate Cost</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">BDT & USD</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    ৳{product.costing.factoryCostBdt.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">
                    Equivalent: <span className="font-mono text-slate-200 font-semibold">${product.costing.factoryCostUsd.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Cost Step 2: B2B FOB Chattogram */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-medium">2. B2B FOB Chattogram Port</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Export Price</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-blue-300">
                    {formatPrice(product.costing.b2bFobPriceUsd)}
                  </div>
                  <div className="text-xs text-slate-400">
                    Base FOB: <span className="font-mono text-slate-200 font-semibold">${product.costing.b2bFobPriceUsd.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Cost Step 3: CIF Regional Destinations */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-medium">3. Regional Landed CIF Quotes</span>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span>🇬🇧 CIF Felixstowe (UK):</span>
                      <span className="font-mono font-semibold text-white">
                        £{product.costing.b2bCifPriceGbp?.toFixed(2) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>🇪🇺 CIF Rotterdam (EU):</span>
                      <span className="font-mono font-semibold text-white">
                        €{product.costing.b2bCifPriceEur?.toFixed(2) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>🇺🇸 DDP Los Angeles (US):</span>
                      <span className="font-mono font-semibold text-white">
                        ${product.costing.b2bDdpPriceUsd?.toFixed(2) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cost Step 4: D2C Flagship Store / Amazon FBA */}
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-medium">4. D2C Flagship / Amazon Retail</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Consumer MSRP</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-amber-300">
                    {formatPrice(product.costing.d2cRetailPriceUsd)}
                  </div>
                  <div className="text-xs text-slate-400">
                    Gross Brand Multiple: <span className="font-semibold text-emerald-400">
                      {(product.costing.d2cRetailPriceUsd / product.costing.factoryCostUsd).toFixed(1)}x Factory Base
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FACTORY' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {product.partnerFactory.factoryName}
                    </h3>
                    <p className="text-xs text-blue-400 mt-0.5">
                      {product.partnerFactory.location}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold font-mono">
                    ★ {product.partnerFactory.rating} / 5.0
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Standard Production Lead Time</span>
                    <span className="font-semibold text-white">{product.partnerFactory.leadTimeDays} Calendar Days</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Minimum Order Quantity (MOQ)</span>
                    <span className="font-semibold text-white">{product.partnerFactory.moq} {product.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'COMPLIANCE' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300">
                Verified compliance certifications required for customs clearance in target zones (UK, EU, US, AU):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.complianceCertificates.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium text-slate-200">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'PACKAGING' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-600/30 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-amber-300 text-sm">Official GS1 Bangladesh Barcoding & Dual-3PL Packaging</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Standardized SKU syntax, GS1 GEPIR-registered EAN-13 barcodes, and dual 3PL warehouse prep guidelines for UK (Northampton) & Germany (Hamburg/Ruhr).
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold shrink-0">
                  GS1 Prefix: 053 (BD)
                </div>
              </div>

              {/* Grid 1: Barcode & Hierarchy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Barcode className="w-3.5 h-3.5 text-blue-400" />
                      GTIN-13 / EAN-13 Barcode
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[10px]">
                      GS1 GEPIR Verified
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Assigned EAN-13</span>
                      <span className="text-base font-bold font-mono text-amber-400 tracking-wider">
                        {product.eanBarcode || 'Pending Generation'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Style Code</span>
                      <span className="text-xs font-mono font-bold text-blue-300">
                        {product.styleCode || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">GS1 Issuing Authority:</span>
                      <span className="font-medium text-slate-200">MCCI Dhaka (GS1 Bangladesh)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">SKU Code Architecture:</span>
                      <span className="font-mono text-slate-200">{product.sku}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Amazon Marketplace:</span>
                      <span className="text-emerald-400 font-medium">Valid for Amazon UK & DE Brand Registry</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5 text-amber-400" />
                      3PL Packaging Specification
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px]">
                      Dual-Hub Standard
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Unit Packaging Mode</span>
                    <span className="text-xs font-semibold text-slate-100 block mt-0.5">
                      {product.packagingMode || 'Standard poly-sleeve with hangtag'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Hangtag / Polybag Label:</span>
                      <span className="font-medium text-slate-200">50x30mm or 60x40mm (EAN-13 + Made in BD)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Leather Surface Rule:</span>
                      <span className="text-amber-400 font-medium">Affix to dustbag only, never on leather</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Master Shipping Barcode:</span>
                      <span className="font-mono text-slate-200">ITF-14 / Code-128 Master Carton</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Ocean Freight & Warehouse Handling Protocols */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  Maritime Transit Protection & 3PL Warehouse Routing
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Moisture & Mold Defense</span>
                    <span className="text-xs font-semibold text-slate-200 block">Calcium Chloride Poles</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Container desiccant poles + 5g–10g clay packet inside bag cavity for 35-45 day voyage.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">ISO Master Carton Icons</span>
                    <span className="text-xs font-semibold text-slate-200 block">↑↑ This Side Up & Umbrella</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Printed on master shipping boxes to prevent port workers stacking leather boxes upside down.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Zero-Tariff Preference</span>
                    <span className="text-xs font-semibold text-emerald-300 block">0% Duty (EBA & DCTS)</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      EU Everything But Arms (REX on invoice) and UK DCTS comprehensive preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Sample Approval Status:</span>
            <span className="font-semibold text-emerald-400 text-xs font-mono">
              {product.sampleStatus.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => alert(`Exporting Tech Pack PDF & BOM for SKU: ${product.sku}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
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
