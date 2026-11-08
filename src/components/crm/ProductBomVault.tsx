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
  Eye,
  Edit3,
  Trash2,
  Share2,
  Download,
  X,
} from 'lucide-react';

interface ProductBomVaultProps {
  products: SolarProductMaster[];
  bomPackages: BomPackage[];
  onEditProduct?: (product: SolarProductMaster) => void;
  onDeleteProduct?: (id: string) => void;
  onDeletePackage?: (id: string) => void;
}

export default function ProductBomVault({
  products,
  bomPackages,
  onEditProduct,
  onDeleteProduct,
  onDeletePackage,
}: ProductBomVaultProps) {
  const [viewMode, setViewMode] = useState<'PRODUCTS' | 'BOM_PACKAGES'>('PRODUCTS');
  const [displayMode, setDisplayMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Multi-select & Action states
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [viewingProduct, setViewingProduct] = useState<SolarProductMaster | null>(null);
  const [editingProduct, setEditingProduct] = useState<SolarProductMaster | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<SolarProductMaster | null>(null);
  const [viewingPackage, setViewingPackage] = useState<BomPackage | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<BomPackage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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

  // Selection handlers
  const handleSelectAllProducts = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleToggleSelectProduct = (id: string, e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteProducts = () => {
    if (confirm(`Delete ${selectedProductIds.length} products?`)) {
      if (onDeleteProduct) {
        selectedProductIds.forEach((id) => onDeleteProduct(id));
      }
      setSelectedProductIds([]);
      showToast(`Deleted ${selectedProductIds.length} products`);
    }
  };

  // Share handlers
  const handleShareProduct = (p: SolarProductMaster, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/crm?tab=products&sku=${p.sku}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast(`Product URL for ${p.sku} copied to clipboard!`);
    } else {
      showToast(`Share URL: ${shareUrl}`);
    }
  };

  // Download PDF
  const handleDownloadProductPdf = (p: SolarProductMaster, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showToast(`Generating Spec Sheet for ${p.sku}...`);
    setTimeout(() => {
      const doc = `
================================================================================
TIER-1 SOLAR HARDWARE SPECIFICATION & BDS IEC COMPLIANCE
================================================================================
SKU:              ${p.sku}
Brand / OEM:      ${p.brand}
Model Number:     ${p.modelNumber}
Category:         ${p.category}
Rating:           ${p.nominalRating}
Module Eff:       ${p.efficiencyPct}%
HS Code:          ${p.hsCode} (Duty: ${p.customsTaxPct})
Product Warranty: ${p.warrantyYearsProduct} Years
Performance War:  ${p.warrantyYearsPerformance} Years (85% Linear)
Test Standards:   ${p.testCertifications.join(', ')}

COMMERCIAL COSTING:
Unit Cost (BOM):  Tk ${p.unitCostBdt.toLocaleString()}
Published Price:  Tk ${p.publishedSellingPriceBdt.toLocaleString()} (Strict 25.0% Margin)
In Stock Qty:     ${p.inStockQuantity.toLocaleString()} ${p.unitOfMeasure}
SREDA Status:     Approved for Net-Metering Grid Interconnection
================================================================================
      `;
      const blob = new Blob([doc], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${p.sku}_SpecSheet.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, 600);
  };

  // Save Edit
  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (onEditProduct) {
      onEditProduct(editingProduct);
    }
    showToast(`Updated Product ${editingProduct.sku}`);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0A1A2F] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/30 flex items-center gap-2 text-xs font-mono animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Toggle & Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#0A1A2F]">
              Solar Product Specification &amp; Standard BOM Vault
            </h3>
            <p className="text-[10px] text-slate-500">
              Tier-1 hardware specs, BDS IEC test certs, customs HS codes, and 25% margin BoQ packages.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SKU, brand, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Sub-Section Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('PRODUCTS')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                viewMode === 'PRODUCTS'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hardware ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('BOM_PACKAGES')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                viewMode === 'BOM_PACKAGES'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              BoQ Packages ({bomPackages.length})
            </button>
          </div>

          {/* Bulk Selection Bar */}
          {viewMode === 'PRODUCTS' && selectedProductIds.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#0A1A2F] text-white px-2.5 py-1 rounded-lg text-xs font-mono animate-in fade-in">
              <span className="font-bold text-emerald-300">{selectedProductIds.length} Selected</span>
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={handleBulkDeleteProducts}
                className="hover:text-rose-300 text-[10px] font-bold cursor-pointer"
                title="Delete selected products"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setSelectedProductIds([])}
                className="text-slate-400 hover:text-white ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setDisplayMode('TABLE')}
              className={`p-1.5 rounded transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                displayMode === 'TABLE'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('GRID')}
              className={`p-1.5 rounded transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                displayMode === 'GRID'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 1. PRODUCT MASTER SECTION */}
      {viewMode === 'PRODUCTS' && (
        <div>
          {displayMode === 'GRID' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => {
                const isSelected = selectedProductIds.includes(p.id);

                return (
                  <div
                    key={p.id}
                    className={`bg-white rounded-xl border p-4 shadow-2xs hover:border-emerald-400 transition-all flex flex-col justify-between ${
                      isSelected ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleToggleSelectProduct(p.id, e)}
                            className="rounded text-emerald-600 focus:ring-0 cursor-pointer mt-0.5"
                          />
                          <div>
                            <span className="font-mono text-[9px] text-slate-400 font-bold block">{p.sku}</span>
                            <h4 className="font-bold text-[#0A1A2F] text-sm">{p.brand}</h4>
                            <div className="text-[11px] text-slate-500">{p.modelNumber}</div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                          {p.category.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Rating:</span>
                          <span className="font-mono font-bold text-[#0A1A2F]">{p.nominalRating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Efficiency:</span>
                          <span className="font-mono font-bold text-emerald-700">{p.efficiencyPct}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">HS Code:</span>
                          <span className="font-mono text-slate-600">{p.hsCode} ({p.customsTaxPct})</span>
                        </div>
                      </div>

                      <div className="mt-2.5 p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-[9px] uppercase font-bold text-slate-400 font-mono">Unit Cost</div>
                          <div className="font-bold text-slate-700 font-mono mt-0.5">Tk {p.unitCostBdt.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-emerald-800 font-mono">25% Margin Price</div>
                          <div className="font-black text-emerald-800 font-mono mt-0.5">Tk {p.publishedSellingPriceBdt.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[10px]">Stock: {p.inStockQuantity.toLocaleString()}</span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingProduct(p)}
                          className="p-1 rounded hover:bg-slate-100 text-blue-600 transition"
                          title="View Technical Specs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...p })}
                          className="p-1 rounded hover:bg-slate-100 text-amber-600 transition"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleShareProduct(p, e)}
                          className="p-1 rounded hover:bg-slate-100 text-teal-600 transition"
                          title="Share Product"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDownloadProductPdf(p, e)}
                          className="p-1 rounded hover:bg-slate-100 text-emerald-700 transition"
                          title="Download Spec Sheet"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingProduct(p)}
                          className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Product Master Enterprise Table View */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                    <tr>
                      <th className="py-2.5 px-3 w-8 text-center">
                        <input
                          type="checkbox"
                          checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                          onChange={handleSelectAllProducts}
                          className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                        />
                      </th>
                      <th className="py-2.5 px-3">SKU &amp; Category</th>
                      <th className="py-2.5 px-3">Brand &amp; Specification</th>
                      <th className="py-2.5 px-3">Rating / Eff</th>
                      <th className="py-2.5 px-3">Warranty</th>
                      <th className="py-2.5 px-3">HS Code &amp; Tax</th>
                      <th className="py-2.5 px-3">Cost (BOM)</th>
                      <th className="py-2.5 px-3">Selling Price (25% Mgn)</th>
                      <th className="py-2.5 px-3">Stock</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredProducts.map((p) => {
                      const isSelected = selectedProductIds.includes(p.id);

                      return (
                        <tr key={p.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                          <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleToggleSelectProduct(p.id, e)}
                              className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                            />
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="font-mono font-bold text-[#0A1A2F] block">{p.sku}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              {p.category.replace(/_/g, ' ')}
                            </span>
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="font-bold text-[#0A1A2F]">{p.brand}</div>
                            <div className="text-[10px] text-slate-500">{p.modelNumber}</div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-bold font-mono text-slate-900">{p.nominalRating}</div>
                            <div className="text-[10px] text-emerald-700 font-mono font-semibold">
                              {p.efficiencyPct}%
                            </div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 text-[11px]">
                            {p.warrantyYearsProduct}y / {p.warrantyYearsPerformance}y
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-mono text-slate-800 font-semibold">{p.hsCode}</div>
                            <div className="text-[10px] font-mono text-emerald-700 font-bold">{p.customsTaxPct}</div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                            <div className="font-bold text-slate-800">Tk {p.unitCostBdt.toLocaleString()}</div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                            <div className="font-black text-emerald-800 text-xs">
                              Tk {p.publishedSellingPriceBdt.toLocaleString()}
                            </div>
                            <div className="text-[8.5px] text-emerald-600 font-bold uppercase tracking-wider">Locked 25% Mgn</div>
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-600 text-[11px]">
                            {p.inStockQuantity.toLocaleString()} {p.unitOfMeasure}
                          </td>

                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setViewingProduct(p)}
                                className="p-1 rounded hover:bg-slate-100 text-blue-600 transition"
                                title="View Tech Specs"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingProduct({ ...p })}
                                className="p-1 rounded hover:bg-slate-100 text-amber-600 transition"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleShareProduct(p, e)}
                                className="p-1 rounded hover:bg-slate-100 text-teal-600 transition"
                                title="Share"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDownloadProductPdf(p, e)}
                                className="p-1 rounded hover:bg-slate-100 text-emerald-700 transition"
                                title="Download Spec Sheet"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingProduct(p)}
                                className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* 2. BOM PACKAGES SECTION */}
      {viewMode === 'BOM_PACKAGES' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1A2F] text-white uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-2.5 px-3">Package Code &amp; Name</th>
                  <th className="py-2.5 px-3">DC Capacity</th>
                  <th className="py-2.5 px-3">Primary Hardware</th>
                  <th className="py-2.5 px-3">BoQ Lines</th>
                  <th className="py-2.5 px-3">Annual Yield</th>
                  <th className="py-2.5 px-3">Turnkey Cost (BOM)</th>
                  <th className="py-2.5 px-3">Selling Price (25% Mgn)</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-emerald-700 block">{pkg.packageCode}</span>
                      <span className="font-bold text-[#0A1A2F]">{pkg.packageName}</span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-black text-sm text-[#0A1A2F] font-mono">{pkg.ratedCapacityKwp} kWp</div>
                      <div className="text-[10px] text-slate-400">C&amp;I Turnkey</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[10px]">
                      <div>{pkg.primaryModuleSku}</div>
                      <div className="text-slate-400">{pkg.primaryInverterSku}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-semibold text-slate-700">
                      {pkg.items.length} Lines
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-mono font-bold text-emerald-700">
                      {(pkg.expectedAnnualYieldKwh / 1000).toFixed(0)} MWh / yr
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-mono">
                      <div className="font-bold text-slate-800">Tk {(pkg.totalTurnkeyCostBdt / 10000000).toFixed(2)} Cr</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-mono">
                      <div className="font-black text-emerald-800 text-xs">
                        Tk {(pkg.turnkeySellingPriceBdt / 10000000).toFixed(2)} Cr
                      </div>
                      <div className="text-[9px] text-emerald-600 font-bold">25.0% Margin Lock</div>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingPackage(pkg)}
                          className="p-1 rounded hover:bg-slate-100 text-blue-600 transition"
                          title="View BoQ Items"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(`${window.location.origin}/crm?tab=products&pkg=${pkg.packageCode}`);
                              showToast(`BoQ Link copied: ${pkg.packageCode}`);
                            }
                          }}
                          className="p-1 rounded hover:bg-slate-100 text-teal-600 transition"
                          title="Share BoQ"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href="/documents/AREL_BNK_2026_FEAS_V1_Bankable_Feasibility_Study_Dossier.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-slate-100 text-emerald-700 transition"
                          title="Download BoQ Dossier"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setDeletingPackage(pkg)}
                          className="p-1 rounded hover:bg-rose-50 text-rose-600 transition"
                          title="Delete Package"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {viewingProduct.category}
                </span>
                <h3 className="text-base font-black text-[#0A1A2F] mt-1">{viewingProduct.brand} - {viewingProduct.modelNumber}</h3>
                <div className="text-xs font-mono text-slate-400">SKU: {viewingProduct.sku} | HS Code: {viewingProduct.hsCode}</div>
              </div>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-mono">Rating</span>
                  <div className="font-bold text-slate-900 mt-0.5">{viewingProduct.nominalRating}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-mono">Efficiency</span>
                  <div className="font-mono font-bold text-emerald-700 mt-0.5">{viewingProduct.efficiencyPct}%</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-mono">Product Warranty</span>
                  <div className="font-bold text-slate-900 mt-0.5">{viewingProduct.warrantyYearsProduct} Years</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[9px] font-mono">Performance Warranty</span>
                  <div className="font-bold text-slate-900 mt-0.5">{viewingProduct.warrantyYearsPerformance} Years (Linear)</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 uppercase text-[9px] font-mono">BOM Unit Cost</span>
                  <div className="font-mono font-bold text-slate-800 text-sm mt-0.5">Tk {viewingProduct.unitCostBdt.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-emerald-800 uppercase text-[9px] font-mono font-bold">Published Selling Price</span>
                  <div className="font-mono font-black text-emerald-800 text-sm mt-0.5">Tk {viewingProduct.publishedSellingPriceBdt.toLocaleString()}</div>
                  <div className="text-[8.5px] text-emerald-600 font-bold">25.0% Gross Margin</div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 uppercase text-[9px] font-mono font-bold block mb-1">BDS IEC Test Certifications</span>
                <div className="flex flex-wrap gap-1">
                  {viewingProduct.testCertifications.map((cert, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px]">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => handleDownloadProductPdf(viewingProduct, e)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Download Spec Sheet</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0A1A2F] text-white text-xs font-bold font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black text-[#0A1A2F]">Edit Product: {editingProduct.sku}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Model Number</label>
                  <input
                    type="text"
                    value={editingProduct.modelNumber}
                    onChange={(e) => setEditingProduct({ ...editingProduct, modelNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nominal Rating</label>
                  <input
                    type="text"
                    value={editingProduct.nominalRating}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nominalRating: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Efficiency (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingProduct.efficiencyPct}
                    onChange={(e) => setEditingProduct({ ...editingProduct, efficiencyPct: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Unit Cost (BDT)</label>
                  <input
                    type="number"
                    value={editingProduct.unitCostBdt}
                    onChange={(e) => {
                      const cost = Number(e.target.value);
                      const price = Math.round(cost / 0.75); // auto-calculate 25% margin
                      setEditingProduct({ ...editingProduct, unitCostBdt: cost, publishedSellingPriceBdt: price });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Published Price (25% Mgn)</label>
                  <input
                    type="number"
                    value={editingProduct.publishedSellingPriceBdt}
                    onChange={(e) => setEditingProduct({ ...editingProduct, publishedSellingPriceBdt: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">In Stock Quantity</label>
                <input
                  type="number"
                  value={editingProduct.inStockQuantity}
                  onChange={(e) => setEditingProduct({ ...editingProduct, inStockQuantity: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs font-mono font-bold"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-mono"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation for Product */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Confirm Deletion</h3>
                <p className="text-[11px] text-slate-500">
                  Delete SKU <span className="font-bold text-rose-600 font-mono">{deletingProduct.sku}</span> ({deletingProduct.brand})?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteProduct) onDeleteProduct(deletingProduct.id);
                  showToast(`Deleted ${deletingProduct.sku}`);
                  setDeletingProduct(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation for Package */}
      {deletingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Confirm Deletion</h3>
                <p className="text-[11px] text-slate-500">
                  Delete BoQ package <span className="font-bold text-rose-600 font-mono">{deletingPackage.packageCode}</span>?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingPackage(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeletePackage) onDeletePackage(deletingPackage.id);
                  showToast(`Deleted ${deletingPackage.packageCode}`);
                  setDeletingPackage(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
