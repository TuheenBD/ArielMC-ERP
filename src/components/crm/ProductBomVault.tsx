'use client';

import React, { useState } from 'react';
import { SolarProductMaster, BomPackage } from '@/types/arelCrm';
import {
  Package,
  Cpu,
  Layers,
  ShieldCheck,
  Tag,
  Boxes,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface ProductBomVaultProps {
  products: SolarProductMaster[];
  bomPackages: BomPackage[];
}

export default function ProductBomVault({
  products,
  bomPackages,
}: ProductBomVaultProps) {
  const [viewMode, setViewMode] = useState<'PRODUCTS' | 'BOM_PACKAGES'>('PRODUCTS');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Toggle Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0A1A2F]">
              Solar Product Specification &amp; Standard BOM Vault
            </h3>
            <p className="text-[11px] text-slate-500">
              Tier-1 hardware specifications, BDS IEC test certifications, customs HS codes, and 25% margin BoQ packages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('PRODUCTS')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              viewMode === 'PRODUCTS'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Product Master ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('BOM_PACKAGES')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              viewMode === 'BOM_PACKAGES'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Turnkey BoQ Packages ({bomPackages.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: PRODUCTS MASTER */}
      {viewMode === 'PRODUCTS' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['ALL', 'PV_MODULE', 'GRID_INVERTER', 'MOUNTING_ALUMINUM_RAIL', 'DC_AC_SOLAR_CABLE'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-[#0A1A2F] text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {prod.category.replace(/_/g, ' ')}
                      </span>
                      <h4 className="text-base font-bold text-[#0A1A2F] mt-1.5">
                        {prod.brand}
                      </h4>
                      <div className="text-[11px] font-mono text-slate-500">
                        Model: {prod.modelNumber}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {prod.nominalRating}
                    </span>
                  </div>

                  {/* Certifications and Specs */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Efficiency / Rating:</span>
                      <span className="font-bold text-slate-900">{prod.efficiencyPct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Warranty:</span>
                      <span className="font-bold text-slate-900">{prod.warrantyYearsProduct}y Product / {prod.warrantyYearsPerformance}y Perf</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customs HS Code:</span>
                      <span className="font-mono text-slate-900">{prod.hsCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customs Duty:</span>
                      <span className="font-mono font-bold text-emerald-700">{prod.customsTaxPct}</span>
                    </div>
                  </div>

                  {/* Certifications Tags */}
                  <div className="flex flex-wrap gap-1">
                    {prod.testCertifications.map((cert, i) => (
                      <span key={i} className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {cert}
                      </span>
                    ))}
                  </div>

                  {/* Commercial Margin Calculation */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <div className="text-[9px] text-slate-400 uppercase">Unit Cost</div>
                      <div className="font-bold text-slate-800 mt-0.5">
                        {prod.unitCostUsd > 0 ? `$${prod.unitCostUsd} / ` : ''}Tk {prod.unitCostBdt.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-emerald-50 border border-emerald-100">
                      <div className="text-[9px] text-emerald-700 uppercase font-bold">Published (25% Mgn)</div>
                      <div className="font-bold text-emerald-800 mt-0.5">
                        Tk {prod.publishedSellingPriceBdt.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">
                    Stock: <strong className="text-slate-900">{prod.inStockQuantity} {prod.unitOfMeasure}</strong>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase">
                    SREDA Approved
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: BOM PACKAGES */}
      {viewMode === 'BOM_PACKAGES' && (
        <div className="space-y-6">
          {bomPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono uppercase">
                    <Sparkles className="w-3 h-3" />
                    <span>{pkg.packageCode}</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#0A1A2F] mt-1">
                    {pkg.packageName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Standard turn-key engineering package with 25% turnkey profit margin.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Turnkey BOM Cost</div>
                    <div className="text-sm font-bold text-slate-700 font-mono">
                      Tk {(pkg.totalTurnkeyCostBdt / 100000).toFixed(2)} Lakh
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-700 font-mono font-bold uppercase">Turnkey Price (25% Mgn)</div>
                    <div className="text-lg font-extrabold text-emerald-700 font-mono">
                      Tk {(pkg.turnkeySellingPriceBdt / 100000).toFixed(2)} Lakh
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">BOM Component / Scope</th>
                      <th className="py-2.5 px-3">Quantity</th>
                      <th className="py-2.5 px-3">Unit</th>
                      <th className="py-2.5 px-3">Unit Cost (BDT)</th>
                      <th className="py-2.5 px-3 text-right">Total Cost (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    {pkg.items.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-semibold text-slate-900">{item.productName}</td>
                        <td className="py-2 px-3">{item.quantity.toLocaleString()}</td>
                        <td className="py-2 px-3">{item.unit}</td>
                        <td className="py-2 px-3">Tk {item.unitCostBdt.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">
                          Tk {item.totalCostBdt.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Annual Specific Yield: <strong className="text-slate-900">{pkg.expectedAnnualYieldKwh.toLocaleString()} kWh/yr</strong>
                </span>
                <span className="text-emerald-700 font-bold font-mono">
                  Statutory Turnkey Margin: Exactly 25.0%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
