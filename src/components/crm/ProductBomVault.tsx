'use client';

import React, { useState } from 'react';
import { SolarProductMaster, BomPackage, ProductCategory } from '@/types/arelCrm';
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
  LayoutGrid,
  Table as TableIcon,
  Search,
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
  const [displayMode, setDisplayMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (
      searchTerm &&
      !p.brand.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !p.modelNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const filteredPackages = bomPackages.filter((pkg) => {
    if (
      searchTerm &&
      !pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !pkg.packageCode.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Toggle & Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
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

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SKU, brand, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Sub-Section Toggle (Product Master vs Turnkey Packages) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('PRODUCTS')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                viewMode === 'BOM_PACKAGES'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Turnkey BoQ Packages ({bomPackages.length})
            </button>
          </div>

          {/* View Toggle (Grid / Table) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setDisplayMode('GRID')}
              className={`p-1.5 rounded-md transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                displayMode === 'GRID'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Switch to Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('TABLE')}
              className={`p-1.5 rounded-md transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                displayMode === 'TABLE'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Switch to Enterprise Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. PRODUCT MASTER SECTION */}
      {viewMode === 'PRODUCTS' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'All Products' },
              { id: 'PV_MODULE', label: 'PV Modules' },
              { id: 'GRID_INVERTER', label: 'Grid Inverters' },
              { id: 'MOUNTING_ALUMINUM_RAIL', label: 'Mounting Rail' },
              { id: 'DC_AC_SOLAR_CABLE', label: 'Solar Cables' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0A1A2F] text-[#C9A86A] shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {displayMode === 'GRID' ? (
            /* Product Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {p.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {p.nominalRating}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-[#0A1A2F]">{p.brand}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Model: {p.modelNumber}</p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Efficiency / Rating:</span>
                        <span className="font-bold text-slate-800 font-mono">{p.efficiencyPct}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Warranty:</span>
                        <span className="font-bold text-slate-800">{p.warrantyYearsProduct}y Product / {p.warrantyYearsPerformance}y Perf</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Customs HS Code:</span>
                        <span className="font-mono text-slate-700">{p.hsCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Customs Duty:</span>
                        <span className="font-bold text-emerald-700 font-mono">{p.customsTaxPct}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">BDS IEC Certifications:</div>
                      <div className="flex flex-wrap gap-1">
                        {p.testCertifications.map((cert, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-[9px] uppercase font-bold text-slate-400 font-mono">Unit Cost</div>
                        <div className="font-bold text-slate-700 font-mono mt-0.5">
                          {p.unitCostUsd > 0 ? `$${p.unitCostUsd} / ` : ''}Tk {p.unitCostBdt.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase font-bold text-emerald-800 font-mono">Published (25% Mgn)</div>
                        <div className="font-bold text-emerald-800 font-mono mt-0.5">Tk {p.publishedSellingPriceBdt.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono">Stock: {p.inStockQuantity.toLocaleString()} {p.unitOfMeasure}</span>
                    <span className="text-emerald-700 font-bold text-[10px] uppercase font-mono">SREDA APPROVED</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Product Master Enterprise Table View */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                    <tr>
                      <th className="py-3 px-4">SKU &amp; Category</th>
                      <th className="py-3 px-4">Brand &amp; Model Specification</th>
                      <th className="py-3 px-4">Rating / Efficiency</th>
                      <th className="py-3 px-4">Warranty</th>
                      <th className="py-3 px-4">HS Code &amp; Duty (SRO)</th>
                      <th className="py-3 px-4">BDS IEC Certifications</th>
                      <th className="py-3 px-4">Unit Cost (BOM)</th>
                      <th className="py-3 px-4">Published Price (25% Margin)</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-[#0A1A2F] block">{p.sku}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            {p.category.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#0A1A2F]">{p.brand}</div>
                          <div className="text-[11px] text-slate-500">{p.modelNumber}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold font-mono text-slate-900">{p.nominalRating}</div>
                          <div className="text-[10px] text-emerald-700 font-mono font-semibold">
                            Eff: {p.efficiencyPct}%
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                          {p.warrantyYearsProduct}y Product / {p.warrantyYearsPerformance}y Perf
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-mono text-slate-800 font-semibold">{p.hsCode}</div>
                          <div className="text-[10px] font-mono text-emerald-700 font-bold">{p.customsTaxPct}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {p.testCertifications.slice(0, 2).map((cert, idx) => (
                              <span key={idx} className="px-1 py-0.2 rounded bg-slate-100 text-slate-700 text-[9px] font-mono">
                                {cert}
                              </span>
                            ))}
                            {p.testCertifications.length > 2 && (
                              <span className="text-[9px] text-slate-400 font-mono">+{p.testCertifications.length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                          {p.unitCostUsd > 0 && <div className="text-slate-500 text-[10px]">${p.unitCostUsd}</div>}
                          <div className="font-bold text-slate-800">Tk {p.unitCostBdt.toLocaleString()}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                          <div className="font-extrabold text-emerald-800 text-sm">
                            Tk {p.publishedSellingPriceBdt.toLocaleString()}
                          </div>
                          <div className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Locked 25% Mgn</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600">
                          {p.inStockQuantity.toLocaleString()} {p.unitOfMeasure}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                            SREDA OK
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. TURNKEY BOM PACKAGES SECTION */}
      {viewMode === 'BOM_PACKAGES' && (
        <div className="space-y-4">
          {displayMode === 'GRID' ? (
            /* BOM Package Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-emerald-400 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {pkg.packageCode}
                      </span>
                      <h4 className="text-lg font-bold text-[#0A1A2F] mt-1">{pkg.packageName}</h4>
                      <p className="text-xs text-slate-500">Standard Tier-1 Turnkey Solar BoQ Package</p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-700 font-mono">{pkg.ratedCapacityKwp} kWp</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">Turnkey DC Capacity</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                    <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Itemized BOM Breakdown ({pkg.items.length} Lines):</div>
                    {pkg.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-600">
                        <span>{it.quantity} {it.unit} &bull; {it.productName}</span>
                        <span className="font-mono font-semibold text-slate-800">Tk {it.totalCostBdt.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-mono uppercase font-bold text-slate-500">Turnkey Cost (BOM)</div>
                      <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                        Tk {(pkg.totalTurnkeyCostBdt / 10000000).toFixed(2)} Crore
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Tk {(pkg.totalTurnkeyCostBdt / (pkg.ratedCapacityKwp * 1000)).toFixed(2)} / Wp
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono uppercase font-bold text-emerald-800 flex items-center gap-1">
                        <span>Published Sale Price</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-200 text-emerald-900 font-black">25% MGN</span>
                      </div>
                      <div className="text-xl font-extrabold text-emerald-800 font-mono mt-0.5">
                        Tk {(pkg.turnkeySellingPriceBdt / 10000000).toFixed(2)} Crore
                      </div>
                      <div className="text-[10px] text-emerald-600 font-mono font-bold mt-0.5">
                        Tk {(pkg.turnkeySellingPriceBdt / (pkg.ratedCapacityKwp * 1000)).toFixed(2)} / Wp
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono">Est. Annual Yield: {(pkg.expectedAnnualYieldKwh / 1000).toFixed(0)} MWh</span>
                    <a
                      href="/documents/AREL_BNK_2026_FEAS_V1_Bankable_Feasibility_Study_Dossier.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1A2F] hover:bg-emerald-700 text-white rounded-lg font-bold transition text-xs"
                    >
                      <span>Export Full BoQ</span>
                      <ExternalLink className="w-3 h-3 text-[#C9A86A]" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Turnkey BOM Packages Enterprise Table View */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                    <tr>
                      <th className="py-3 px-4">Package Code &amp; Name</th>
                      <th className="py-3 px-4">DC Capacity</th>
                      <th className="py-3 px-4">Primary Modules &amp; Inverters</th>
                      <th className="py-3 px-4">BoQ Line Items</th>
                      <th className="py-3 px-4">Expected Annual Yield</th>
                      <th className="py-3 px-4">Turnkey Cost (BOM)</th>
                      <th className="py-3 px-4">Published Price (25% Margin)</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-emerald-700 block">{pkg.packageCode}</span>
                          <span className="font-bold text-[#0A1A2F]">{pkg.packageName}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-black text-base text-[#0A1A2F] font-mono">{pkg.ratedCapacityKwp} kWp</div>
                          <div className="text-[10px] text-slate-400">C&amp;I Turnkey</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                          <div>{pkg.primaryModuleSku}</div>
                          <div className="text-slate-400">{pkg.primaryInverterSku}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-700">
                          {pkg.items.length} Itemized Lines
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-emerald-700">
                          {(pkg.expectedAnnualYieldKwh / 1000).toFixed(0)} MWh / yr
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                          <div className="font-bold text-slate-800">Tk {(pkg.totalTurnkeyCostBdt / 10000000).toFixed(2)} Cr</div>
                          <div className="text-[10px] text-slate-400">Tk {(pkg.totalTurnkeyCostBdt / (pkg.ratedCapacityKwp * 1000)).toFixed(2)}/Wp</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                          <div className="font-extrabold text-emerald-800 text-sm">
                            Tk {(pkg.turnkeySellingPriceBdt / 10000000).toFixed(2)} Cr
                          </div>
                          <div className="text-[10px] text-emerald-600 font-bold">
                            Tk {(pkg.turnkeySellingPriceBdt / (pkg.ratedCapacityKwp * 1000)).toFixed(2)}/Wp (25% Mgn)
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <a
                            href="/documents/AREL_BNK_2026_FEAS_V1_Bankable_Feasibility_Study_Dossier.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#0A1A2F] hover:bg-emerald-700 text-white text-[11px] font-bold transition"
                          >
                            <span>BoQ Dossier</span>
                            <ExternalLink className="w-3 h-3 text-[#C9A86A]" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
