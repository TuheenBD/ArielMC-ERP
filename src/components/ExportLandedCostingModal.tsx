'use client';

import React, { useState, useEffect } from "react";
import { ProductItem } from "@/types/erp";
import {
  X,
  Calculator,
  DollarSign,
  TrendingUp,
  Percent,
  Truck,
  Box,
  ShieldCheck,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Landmark,
  Save,
  CheckCircle2,
  Layers,
  Info,
} from "lucide-react";

interface ExportLandedCostingModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCosting: (updatedProduct: ProductItem) => void;
  bdtRate?: number;
}

export const ExportLandedCostingModal: React.FC<ExportLandedCostingModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaveCosting,
  bdtRate = 124.0,
}) => {
  if (!isOpen || !product) return null;

  // Currency Mode: "USD" or "BDT"
  const [currencyMode, setCurrencyMode] = useState<"USD" | "BDT">("USD");

  // Step 1: Factory Costs & Negotiation
  const [factoryAskingUsd, setFactoryAskingUsd] = useState<number>(
    product.costing.initialFactoryAskingCostUsd || product.costing.factoryCostUsd * 1.2
  );
  const [factoryPurchaseUsd, setFactoryPurchaseUsd] = useState<number>(
    product.costing.factoryCostUsd || 6.20
  );

  // Step 2: Landed Cost Allowances (Per Unit USD)
  const [packagingUsd, setPackagingUsd] = useState<number>(
    product.costing.exportPackagingUsd ?? 0.35
  );
  const [inlandFreightUsd, setInlandFreightUsd] = useState<number>(
    product.costing.inlandFreightPortUsd ?? 0.25
  );
  const [qcReserveUsd, setQcReserveUsd] = useState<number>(
    product.costing.qualityInspectionReserveUsd ?? 0.15
  );
  const [complianceBufferUsd, setComplianceBufferUsd] = useState<number>(
    product.costing.complianceOverheadReserveUsd ?? 0.15
  );

  // Step 3: Target Commercial Margin
  const [targetMarginPct, setTargetMarginPct] = useState<number>(
    product.costing.arielSourcingMarginPct || 35.0
  );

  // Step 4: Bangladesh Bank Cash Incentive
  const [incentiveCategory, setIncentiveCategory] = useState<string>(
    product.costing.incentiveCategory || (product.sector === "JUTE" ? "DIVERSIFIED_JUTE_10" : product.sector === "LEATHER" ? "FINISHED_LEATHER_10" : "CERAMICS_TABLEWARE_10")
  );

  // Auto-derived calculations
  const negotiatedSavingsUsd = Math.max(0, factoryAskingUsd - factoryPurchaseUsd);
  const negotiatedSavingsPct = factoryAskingUsd > 0 ? (negotiatedSavingsUsd / factoryAskingUsd) * 100 : 0;
  const negotiatedSavingsBdt = negotiatedSavingsUsd * bdtRate;

  // Total Landed FOB Cost
  const totalLandedCostUsd =
    factoryPurchaseUsd + packagingUsd + inlandFreightUsd + qcReserveUsd + complianceBufferUsd;
  const totalLandedCostBdt = totalLandedCostUsd * bdtRate;

  // Published Export FOB Price: Cost / (1 - Margin/100)
  const calculatedFobPriceUsd =
    targetMarginPct < 100
      ? Number((totalLandedCostUsd / (1 - targetMarginPct / 100)).toFixed(2))
      : totalLandedCostUsd;
  const commercialProfitPerUnitUsd = calculatedFobPriceUsd - totalLandedCostUsd;

  // Incentive Rates
  const getIncentiveRates = (cat: string) => {
    switch (cat) {
      case "DIVERSIFIED_JUTE_10":
      case "FINISHED_LEATHER_10":
      case "CERAMICS_TABLEWARE_10":
        return { gross: 10, ait: 5, net: 9.5 };
      case "HANDICRAFTS_BENGAL_15":
        return { gross: 15, ait: 5, net: 14.25 };
      case "CRUST_LEATHER_6":
        return { gross: 6, ait: 5, net: 5.7 };
      case "TRADITIONAL_JUTE_5":
        return { gross: 5, ait: 5, net: 4.75 };
      default:
        return { gross: 0, ait: 0, net: 0 };
    }
  };

  const currentRates = getIncentiveRates(incentiveCategory);
  const grossIncentiveUsd = (calculatedFobPriceUsd * currentRates.gross) / 100;
  const netIncentiveUsd = (calculatedFobPriceUsd * currentRates.net) / 100;
  const netIncentiveBdt = netIncentiveUsd * bdtRate;
  const totalEnterpriseYieldPct = Number((targetMarginPct + currentRates.net).toFixed(2));
  const totalEnterpriseProfitUsd = commercialProfitPerUnitUsd + netIncentiveUsd;

  // Multi-tier MOQ Volume Slabs
  const slab1Fob = calculatedFobPriceUsd;
  const slab2Fob = Number((calculatedFobPriceUsd * 0.93).toFixed(2)); // 7% volume discount
  const slab3Fob = Number((calculatedFobPriceUsd * 0.86).toFixed(2)); // 14% FCL discount

  const handleSave = () => {
    const updated: ProductItem = {
      ...product,
      costing: {
        ...product.costing,
        factoryCostUsd: Number(factoryPurchaseUsd.toFixed(2)),
        factoryCostBdt: Number((factoryPurchaseUsd * bdtRate).toFixed(2)),
        initialFactoryAskingCostUsd: Number(factoryAskingUsd.toFixed(2)),
        initialFactoryAskingCostBdt: Number((factoryAskingUsd * bdtRate).toFixed(2)),
        negotiatedSavingsUsd: Number(negotiatedSavingsUsd.toFixed(2)),
        negotiatedSavingsBdt: Number(negotiatedSavingsBdt.toFixed(2)),
        exportPackagingUsd: Number(packagingUsd.toFixed(2)),
        inlandFreightPortUsd: Number(inlandFreightUsd.toFixed(2)),
        qualityInspectionReserveUsd: Number(qcReserveUsd.toFixed(2)),
        complianceOverheadReserveUsd: Number(complianceBufferUsd.toFixed(2)),
        totalLandedCostUsd: Number(totalLandedCostUsd.toFixed(2)),
        arielSourcingMarginPct: Number(targetMarginPct.toFixed(1)),
        b2bFobPriceUsd: calculatedFobPriceUsd,
        incentiveCategory,
        incentiveRatePct: currentRates.gross,
        sourceTaxRatePct: currentRates.ait,
        netIncentivePct: currentRates.net,
        netIncentiveUsd: Number(netIncentiveUsd.toFixed(2)),
        totalEnterpriseMarginPct: totalEnterpriseYieldPct,
      },
      volumePricingSlabs: [
        {
          slabName: "Pilot Run (MOQ 250 - 499 pcs)",
          moqRange: "250 - 499 pcs",
          fobPriceUsd: slab1Fob,
          marginPct: Number(targetMarginPct.toFixed(1)),
        },
        {
          slabName: "Wholesale Tier 2 (500 - 999 pcs)",
          moqRange: "500 - 999 pcs",
          fobPriceUsd: slab2Fob,
          marginPct: Number((((slab2Fob - totalLandedCostUsd) / slab2Fob) * 100).toFixed(1)),
        },
        {
          slabName: "FCL Bulk Volume (1,000+ pcs)",
          moqRange: "1,000+ pcs",
          fobPriceUsd: slab3Fob,
          marginPct: Number((((slab3Fob - totalLandedCostUsd) / slab3Fob) * 100).toFixed(1)),
        },
      ],
    };

    onSaveCosting(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-[#DDE3DD] overflow-hidden text-[#1A1A1A]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#DDE3DD] bg-[#1F3A2E] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8A96A]/20 border border-[#C8A96A]/40 flex items-center justify-center text-[#C8A96A]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E]">
                  {product.sku}
                </span>
                <span className="text-xs text-[#C8A96A] font-semibold">
                  Department 1: Export Costing & Incentive Engine
                </span>
              </div>
              <h2 className="text-base font-bold font-heading truncate max-w-[500px]">
                {product.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Mode Switcher */}
            <div className="flex items-center rounded-lg bg-white/10 p-0.5 border border-white/20 text-xs">
              <button
                type="button"
                onClick={() => setCurrencyMode("USD")}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  currencyMode === "USD" ? "bg-[#C8A96A] text-[#1F3A2E] shadow-xs" : "text-white/80 hover:text-white"
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrencyMode("BDT")}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  currencyMode === "BDT" ? "bg-[#C8A96A] text-[#1F3A2E] shadow-xs" : "text-white/80 hover:text-white"
                }`}
              >
                BDT (৳)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs bg-[#FAF9F5]">
          {/* Top Banner: Golden Rule */}
          <div className="p-3.5 rounded-xl bg-[#FAF5EC] border border-[#C8A96A]/50 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#8A6D3B] shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-[#5C4518]">
              <strong className="text-[#8A6D3B] font-bold">ArielMC Merchant Law:</strong> “If you cannot win on purchase, you cannot stand in export business.” Calculate your purchase savings, allocate export transit reserves, lock your 35-40% margin, and capture the 9.5% Bangladesh Bank cash subsidy.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Sourcing & Cost Breakdown */}
            <div className="space-y-5">
              {/* Pillar 1: Purchase & Negotiation */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#DDE3DD]">
                  <span className="font-bold text-[#1F3A2E] text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#8A6D3B]" />
                    <span>1. Factory Purchase & Negotiation</span>
                  </span>
                  <span className="text-[11px] text-[#6B7269]">
                    Rate: <strong>৳{bdtRate.toFixed(2)}</strong> / $1
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#6B7269] mb-1">
                      Factory Initial Asking Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-[#6B7269]">
                        {currencyMode === "USD" ? "$" : "৳"}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={
                          currencyMode === "USD"
                            ? factoryAskingUsd
                            : Number((factoryAskingUsd * bdtRate).toFixed(2))
                        }
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setFactoryAskingUsd(currencyMode === "USD" ? val : val / bdtRate);
                        }}
                        className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1F3A2E] mb-1">
                      Final Negotiated Purchase Cost
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-[#1F3A2E] font-bold">
                        {currencyMode === "USD" ? "$" : "৳"}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={
                          currencyMode === "USD"
                            ? factoryPurchaseUsd
                            : Number((factoryPurchaseUsd * bdtRate).toFixed(2))
                        }
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setFactoryPurchaseUsd(currencyMode === "USD" ? val : val / bdtRate);
                        }}
                        className="w-full pl-7 pr-3 py-1.5 rounded-lg border-2 border-[#1F3A2E] bg-[#F4F6F4] font-mono text-xs font-bold text-[#1F3A2E] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Savings Indicator */}
                <div className="p-2.5 rounded-lg bg-[#E4F3E9] border border-[#BBE3C7] flex items-center justify-between text-[11px]">
                  <span className="text-[#14512C] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#14512C]" />
                    Negotiated Purchase Savings:
                  </span>
                  <span className="font-mono font-bold text-[#14512C]">
                    +${negotiatedSavingsUsd.toFixed(2)} (৳{negotiatedSavingsBdt.toFixed(0)}) / {negotiatedSavingsPct.toFixed(1)}% Saved
                  </span>
                </div>
              </div>

              {/* Pillar 2: Landed Cost Allowances */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-3">
                <div className="pb-2 border-b border-[#DDE3DD]">
                  <span className="font-bold text-[#1F3A2E] text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <Box className="w-4 h-4 text-[#8A6D3B]" />
                    <span>2. Landed Export Allowances (Per Unit)</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-[#6B7269] mb-1">
                      Export Packaging (Carton/Poly/Tags)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={packagingUsd}
                      onChange={(e) => setPackagingUsd(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#6B7269] mb-1">
                      Factory to Port Inland Transport
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={inlandFreightUsd}
                      onChange={(e) => setInlandFreightUsd(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#6B7269] mb-1">
                      Production QC Reserve (Inline & FRI)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={qcReserveUsd}
                      onChange={(e) => setQcReserveUsd(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#6B7269] mb-1">
                      Compliance, Lab Test & Overhead
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={complianceBufferUsd}
                      onChange={(e) => setComplianceBufferUsd(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs text-[#1A1A1A]"
                    />
                  </div>
                </div>

                {/* Total Landed Cost Display */}
                <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD] flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#1F3A2E]">
                    Total Landed FOB Cost (Base):
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-[#1F3A2E]">
                      ${totalLandedCostUsd.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#6B7269] block font-mono">
                      (৳{totalLandedCostBdt.toFixed(1)})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing Engine & Govt Subsidy */}
            <div className="space-y-5">
              {/* Pillar 3: Target Margin & FOB Price */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-3">
                <div className="pb-2 border-b border-[#DDE3DD] flex items-center justify-between">
                  <span className="font-bold text-[#1F3A2E] text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#8A6D3B]" />
                    <span>3. Commercial Margin & Published FOB</span>
                  </span>
                  <span className="text-xs font-bold text-[#14512C] font-mono">
                    {targetMarginPct.toFixed(1)}% Markup
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[#6B7269]">ArielMC Commercial Sourcing Margin:</span>
                    <span className="font-bold text-[#1F3A2E]">{targetMarginPct.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    step="0.5"
                    value={targetMarginPct}
                    onChange={(e) => setTargetMarginPct(parseFloat(e.target.value))}
                    className="w-full accent-[#1F3A2E] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#6B7269] mt-1">
                    <span>20% (Low Margin)</span>
                    <span className="font-semibold text-[#8A6D3B]">35% - 40% (Standard Benchmark)</span>
                    <span>50% (High Premium)</span>
                  </div>
                </div>

                {/* Published FOB Result Box */}
                <div className="p-3.5 rounded-xl bg-[#1F3A2E] text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#C8A96A] font-bold uppercase tracking-wider block">
                      Published Catalog FOB Price
                    </span>
                    <span className="text-2xl font-bold font-mono text-white">
                      ${calculatedFobPriceUsd.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-white/70 block">
                      Per {product.unit} (FOB Chattogram Port)
                    </span>
                  </div>

                  <div className="text-right border-l border-white/20 pl-4">
                    <span className="text-[10px] text-white/70 block uppercase">Commercial Spread</span>
                    <span className="text-base font-bold font-mono text-[#C8A96A]">
                      +${commercialProfitPerUnitUsd.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-white/60 block font-mono">
                      (৳{(commercialProfitPerUnitUsd * bdtRate).toFixed(0)}) / unit
                    </span>
                  </div>
                </div>
              </div>

              {/* Pillar 4: Bangladesh Bank Cash Incentive Engine */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-3">
                <div className="pb-2 border-b border-[#DDE3DD] flex items-center justify-between">
                  <span className="font-bold text-[#1F3A2E] text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-[#8A6D3B]" />
                    <span>4. Bangladesh Bank Cash Incentive</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E4F3E9] text-[#14512C] text-[10px] font-bold border border-[#BBE3C7]">
                    +{currentRates.net}% Net Subsidy
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-[#6B7269] mb-1">
                    Statutory Incentive Sector Category
                  </label>
                  <select
                    value={incentiveCategory}
                    onChange={(e) => setIncentiveCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDE3DD] text-xs font-semibold text-[#1F3A2E] bg-white focus:outline-none"
                  >
                    <option value="DIVERSIFIED_JUTE_10">
                      Diversified Jute Goods (10% Gross - 5% AIT = 9.5% Net)
                    </option>
                    <option value="FINISHED_LEATHER_10">
                      Finished Leather Goods & Footwear (10% Gross - 5% AIT = 9.5% Net)
                    </option>
                    <option value="CERAMICS_TABLEWARE_10">
                      Export Fine Bone China & Ceramics (10% Gross - 5% AIT = 9.5% Net)
                    </option>
                    <option value="HANDICRAFTS_BENGAL_15">
                      Bengal Pottery & Heritage Handicrafts (15% Gross - 5% AIT = 14.25% Net)
                    </option>
                    <option value="CRUST_LEATHER_6">
                      Crust / Finished Leather (6% Gross - 5% AIT = 5.7% Net)
                    </option>
                    <option value="TRADITIONAL_JUTE_5">
                      Traditional Raw Jute & Hessian (5% Gross - 5% AIT = 4.75% Net)
                    </option>
                    <option value="NONE">No Incentive Applicable (0%)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#DDE3DD]">
                    <span className="text-[10px] text-[#6B7269] block">Govt Cash Assistance</span>
                    <span className="font-mono font-bold text-[#14512C] text-sm">
                      +${netIncentiveUsd.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#6B7269] block font-mono">
                      (৳{netIncentiveBdt.toFixed(0)}) / unit
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#E4F3E9] border border-[#BBE3C7]">
                    <span className="text-[10px] text-[#14512C] font-semibold block">True Enterprise Net Yield</span>
                    <span className="font-mono font-bold text-[#14512C] text-base">
                      {totalEnterpriseYieldPct}%
                    </span>
                    <span className="text-[10px] text-[#14512C] block font-mono">
                      (Commercial + Subsidy)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Multi-Tier MOQ Volume Slabs */}
          <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDE3DD]">
              <span className="font-bold text-[#1F3A2E] text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#8A6D3B]" />
                <span>Auto-Generated MOQ Volume Slabs (For Catalog & PI)</span>
              </span>
              <span className="text-[11px] text-[#6B7269]">
                Volume discount structure based on manufacturing batch economies
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD]">
                <span className="text-[10px] font-bold text-[#8A6D3B] uppercase block">
                  Tier 1: Pilot / Test Order
                </span>
                <span className="text-xs font-semibold text-[#1A1A1A] block">MOQ 250 - 499 pcs</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-base font-bold font-mono text-[#1F3A2E]">
                    ${slab1Fob.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-mono text-[#14512C] font-bold">
                    {targetMarginPct.toFixed(1)}% margin
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD]">
                <span className="text-[10px] font-bold text-[#17456F] uppercase block">
                  Tier 2: Wholesale Standard
                </span>
                <span className="text-xs font-semibold text-[#1A1A1A] block">MOQ 500 - 999 pcs</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-base font-bold font-mono text-[#1F3A2E]">
                    ${slab2Fob.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-mono text-[#14512C] font-bold">
                    {(((slab2Fob - totalLandedCostUsd) / slab2Fob) * 100).toFixed(1)}% margin
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD]">
                <span className="text-[10px] font-bold text-[#4A2E7A] uppercase block">
                  Tier 3: FCL Full Container
                </span>
                <span className="text-xs font-semibold text-[#1A1A1A] block">MOQ 1,000+ pcs</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-base font-bold font-mono text-[#1F3A2E]">
                    ${slab3Fob.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-mono text-[#14512C] font-bold">
                    {(((slab3Fob - totalLandedCostUsd) / slab3Fob) * 100).toFixed(1)}% margin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#DDE3DD] bg-white flex items-center justify-between shrink-0">
          <div className="text-xs text-[#6B7269]">
            Product SKU: <strong className="text-[#1F3A2E]">{product.sku}</strong> • Sourcing Partner:{" "}
            <strong className="text-[#1F3A2E]">{product.partnerFactory.factoryName}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DDE3DD] hover:bg-[#F4F6F4] text-xs font-semibold text-[#1A1A1A] transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-[#C8A96A] text-xs font-bold transition shadow-md"
            >
              <Save className="w-4 h-4 text-[#C8A96A]" />
              <span>Save & Apply Costing to Catalog</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
