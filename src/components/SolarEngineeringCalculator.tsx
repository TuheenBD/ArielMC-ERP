'use client';

import React, { useState, useMemo } from 'react';
import {
  Sun,
  Zap,
  TrendingUp,
  ShieldCheck,
  Leaf,
  DollarSign,
  ArrowRight,
  Calculator,
  Sliders,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
  Compass,
  Building2,
  Factory,
  Home,
  Layers,
  Sparkles,
  Info,
  Clock,
  BatteryCharging,
  Maximize2,
  Award,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

interface SolarCalculatorProps {
  onOpenDossierRequest?: (params: any) => void;
  isErpEmbedded?: boolean;
}

export default function SolarCalculator({ onOpenDossierRequest, isErpEmbedded = false }: SolarCalculatorProps) {
  // -------------------------------------------------------------
  // 1. INPUT STATES
  // -------------------------------------------------------------
  const [customerSector, setCustomerSector] = useState<'FACTORY' | 'COMMERCIAL' | 'HOUSEHOLD'>('FACTORY');
  const [lengthFeet, setLengthFeet] = useState<number>(200);
  const [widthFeet, setWidthFeet] = useState<number>(182);
  const [isManualAreaOverride, setIsManualAreaOverride] = useState<boolean>(false);
  const [manualAreaSqFt, setManualAreaSqFt] = useState<number>(36400);

  // Roof & Placement Attributes
  const [roofType, setRoofType] = useState<'PEB_METAL' | 'RCC_SLAB' | 'TERRACE_PERGOLA'>('PEB_METAL');
  const [positioning, setPositioning] = useState<'SOUTH' | 'SOUTH_EAST' | 'SOUTH_WEST' | 'EAST_WEST'>('SOUTH');
  
  // Optional Budget
  const [hasBudgetConstraint, setHasBudgetConstraint] = useState<boolean>(false);
  const [budgetBdt, setBudgetBdt] = useState<number>(25000000); // e.g. Tk 2.50 Cr

  // Financial & Operational Overrides
  const [operatingDays, setOperatingDays] = useState<number>(6); // 6 Days vs 7 Days
  const [utilityProvider, setUtilityProvider] = useState<string>('BREB');
  const [customTariffBdt, setCustomTariffBdt] = useState<number>(12.20);
  const [includeBessStorage, setIncludeBessStorage] = useState<boolean>(false);

  // Active Tab for Output View
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BOM' | 'OUTPUT' | 'WARRANTY' | 'QUOTATION'>('OVERVIEW');

  // -------------------------------------------------------------
  // 2. CORE MATHEMATICAL & ENGINEERING ENGINE
  // -------------------------------------------------------------
  const model = useMemo(() => {
    // 1. Space Calculation
    const calculatedAreaSqFt = isManualAreaOverride ? manualAreaSqFt : lengthFeet * widthFeet;
    
    // Usable Area Factor based on Roof Construction:
    // PEB Shed: 85% usable (15% for RSC fire corridors, skylights, gutters)
    // RCC Slab: 75% usable (25% for lift machine room, HVAC chillers, parapet shadow)
    // Terrace: 80% usable
    const usableRatio = roofType === 'PEB_METAL' ? 0.85 : roofType === 'RCC_SLAB' ? 0.75 : 0.80;
    const netUsableAreaSqFt = calculatedAreaSqFt * usableRatio;
    const netUsableAreaM2 = netUsableAreaSqFt / 10.7639;

    // 2. Solar PV Module Sizing (Tier-1 N-Type TOPCon 620W Bifacial)
    // 620W Module Dimensions: 2.278m x 1.134m = 2.583 m2 (27.8 sq ft)
    // Spacing + walkways + pitch tilt requires ~70 sq ft per kWp on PEB, ~85 sq ft on RCC ballasted
    const sqFtPerKwp = roofType === 'PEB_METAL' ? 72 : 86;
    const maxRoofCapacityKwp = Math.max(5, Math.round(netUsableAreaSqFt / sqFtPerKwp));
    const maxRoofPanelCount = Math.round((maxRoofCapacityKwp * 1000) / 620);

    // 3. Turnkey Cost Rate Benchmark (Base COGS per Wp in BDT)
    // Base COGS: Modules (Tk 13.50) + Inverters (Tk 5.50) + Structure (Tk 6.20) + Cables/BoS (Tk 4.80) + Civil/Labor (Tk 4.20) + Logistics/Eng (Tk 3.80) = ~Tk 38.00/Wp Base COGS
    let baseCogsPerWp = 38.70;
    if (customerSector === 'COMMERCIAL') baseCogsPerWp = 41.50; // Ballasted racking
    if (customerSector === 'HOUSEHOLD') baseCogsPerWp = 48.00; // Small array economies of scale
    if (includeBessStorage) baseCogsPerWp += 14.50; // LiFePO4 battery storage add-on

    // 4. Built-In 25% Profit Margin Formula
    // Price = COGS / (1 - Margin) -> Margin = 25% -> Commercial Price = COGS * 1.3333
    const profitMarginPct = 0.25;
    const turnkeyPricePerWp = baseCogsPerWp / (1 - profitMarginPct); // approx Tk 51.60/Wp for Industrial
    const commercialTurnkeyRatePerKwp = turnkeyPricePerWp * 1000;

    // 5. Budget Constrained Sizing (If budget is enabled)
    let installedCapacityKwp = maxRoofCapacityKwp;
    let budgetUtilizationPct = 100;
    let isConstrainedByBudget = false;

    if (hasBudgetConstraint && budgetBdt > 0) {
      const budgetMaxKwp = Math.floor(budgetBdt / commercialTurnkeyRatePerKwp);
      if (budgetMaxKwp < maxRoofCapacityKwp) {
        installedCapacityKwp = Math.max(5, budgetMaxKwp);
        isConstrainedByBudget = true;
        budgetUtilizationPct = Math.round((budgetMaxKwp / maxRoofCapacityKwp) * 100);
      }
    }

    const panelCount = Math.round((installedCapacityKwp * 1000) / 620);

    // Inverter Sizing (Optimal DC/AC ratio: ~1.15)
    const inverterAcCapacityKw = Math.round(installedCapacityKwp / 1.15);

    // 6. Orientation / Positioning Yield Derating Factor
    let orientationYieldFactor = 1.0;
    if (positioning === 'SOUTH_EAST' || positioning === 'SOUTH_WEST') orientationYieldFactor = 0.96;
    if (positioning === 'EAST_WEST') orientationYieldFactor = 0.88;

    // 7. Energy Yield Generation (Bangladesh Specific Solar Radiation: 4.3 PSH)
    // Specific Yield: 1,380 kWh/kWp/year baseline for Bangladesh * orientation factor
    const specificAnnualYield = 1380 * orientationYieldFactor;
    const annualGenKwh = Math.round(installedCapacityKwp * specificAnnualYield);
    const monthlyGenKwh = Math.round(annualGenKwh / 12);
    const dailyGenKwh = Math.round(annualGenKwh / 365);

    // 8. Grid Tariff & Weekend Cash Buyback Modeling
    const effectiveGridTariff = customTariffBdt || (customerSector === 'FACTORY' ? 12.20 : customerSector === 'COMMERCIAL' ? 14.85 : 11.50);
    const weekendBuybackRate = 10.50; // SREDA Net-Metering Cash Buyback

    // Friday export ratio (Factories closed 52 Fridays + 13 national holidays = ~65 days = ~18%)
    const weekendExportRatio = operatingDays === 6 ? (65 / 365) : 0.05;
    const selfConsumedAnnualKwh = annualGenKwh * (1 - weekendExportRatio);
    const exportedAnnualKwh = annualGenKwh * weekendExportRatio;

    const annualDirectSavingsBdt = selfConsumedAnnualKwh * effectiveGridTariff;
    const annualWeekendCashExportBdt = exportedAnnualKwh * weekendBuybackRate;
    const annualTotalFinancialBenefitBdt = annualDirectSavingsBdt + annualWeekendCashExportBdt;

    const monthlyTotalBenefitBdt = annualTotalFinancialBenefitBdt / 12;
    const dailyTotalBenefitBdt = annualTotalFinancialBenefitBdt / 365;

    // 9. Financial Quotation Modeling (Strict 25% Profit Margin)
    const totalCommercialTurnkeyBdt = Math.round(installedCapacityKwp * commercialTurnkeyRatePerKwp);
    const totalCommercialTurnkeyUsd = Math.round(totalCommercialTurnkeyBdt / 120);
    const baseCogsTotalBdt = Math.round(totalCommercialTurnkeyBdt * (1 - profitMarginPct));
    const grossProfitBdt = totalCommercialTurnkeyBdt - baseCogsTotalBdt; // Exactly 25% of commercial price
    const grossProfitUsd = Math.round(grossProfitBdt / 120);

    // SRO 159 Duty Benefit (Slashing duty from 17% to 1% saves ~16% on total project)
    const dutySavingsBdt = Math.round(totalCommercialTurnkeyBdt * 0.16);

    // 10. Concessionary Green Financing Modeling (80% Debt / 20% Equity, 4.5% Interest, 10-Yr, 1-Yr Grace)
    const greenLoanDebtBdt = totalCommercialTurnkeyBdt * 0.80;
    const clientEquityBdt = totalCommercialTurnkeyBdt * 0.20;
    
    // 84 monthly installments after 12-month grace
    const monthlyRate = 0.045 / 12;
    const numPayments = 84;
    const monthlyLoanEmiBdt = (greenLoanDebtBdt * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    // Year-1 Grace Period Savings (Client pays Tk 0 loan EMI for 12 months)
    const year1AccumulatedBillSavingsBdt = annualTotalFinancialBenefitBdt;
    const equityReimbursementPct = Math.round((year1AccumulatedBillSavingsBdt / clientEquityBdt) * 100);

    // Month 13+ Net Cashflow to Client (Bill savings minus loan installment)
    const netMonthlyCashSurplusBdt = monthlyTotalBenefitBdt - monthlyLoanEmiBdt;

    // Simple Payback & 25-Year Cumulative Net Profit
    const simplePaybackYears = (totalCommercialTurnkeyBdt / annualTotalFinancialBenefitBdt).toFixed(1);
    // 25-Year generation with 0.40%/yr linear degradation
    let lifetimeGenKwh = 0;
    for (let yr = 1; yr <= 25; yr++) {
      const degradation = yr === 1 ? 0.01 : 0.01 + (yr - 1) * 0.004;
      lifetimeGenKwh += annualGenKwh * (1 - degradation);
    }
    const lifetimeGrossSavingsBdt = Math.round(lifetimeGenKwh * effectiveGridTariff);
    const lifetimeNetProfitBdt = lifetimeGrossSavingsBdt - totalCommercialTurnkeyBdt;

    // Carbon Abatement (0.61 MT CO2e / MWh grid factor)
    const annualCo2Tons = Math.round((annualGenKwh / 1000) * 0.61);
    const lifetimeCo2Tons = Math.round((lifetimeGenKwh / 1000) * 0.61);

    return {
      calculatedAreaSqFt,
      netUsableAreaSqFt,
      netUsableAreaM2,
      maxRoofCapacityKwp,
      installedCapacityKwp,
      panelCount,
      inverterAcCapacityKw,
      orientationYieldFactor,
      isConstrainedByBudget,
      budgetUtilizationPct,
      dailyGenKwh,
      monthlyGenKwh,
      annualGenKwh,
      effectiveGridTariff,
      dailyTotalBenefitBdt,
      monthlyTotalBenefitBdt,
      annualTotalBenefitBdt: annualTotalFinancialBenefitBdt,
      annualWeekendCashExportBdt,
      baseCogsTotalBdt,
      grossProfitBdt,
      grossProfitUsd,
      profitMarginPct: 25.0,
      totalCommercialTurnkeyBdt,
      totalCommercialTurnkeyUsd,
      turnkeyPricePerWp,
      dutySavingsBdt,
      greenLoanDebtBdt,
      clientEquityBdt,
      monthlyLoanEmiBdt,
      year1AccumulatedBillSavingsBdt,
      equityReimbursementPct,
      netMonthlyCashSurplusBdt,
      simplePaybackYears,
      lifetimeGenKwh,
      lifetimeNetProfitBdt,
      annualCo2Tons,
      lifetimeCo2Tons,
    };
  }, [customerSector, lengthFeet, widthFeet, isManualAreaOverride, manualAreaSqFt, roofType, positioning, hasBudgetConstraint, budgetBdt, operatingDays, utilityProvider, customTariffBdt, includeBessStorage]);

  const formatBdt = (val: number) => {
    if (val >= 10000000) return `Tk ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `Tk ${(val / 100000).toFixed(2)} Lakh`;
    return `Tk ${Math.round(val).toLocaleString()}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="solar-engineering-calculator" className="py-12 sm:py-20 relative bg-white border-y border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ariel-SaaS™ Solar Engineering & Quotation Model</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1A2F] tracking-tight">
            Turnkey Solar Sizing, <span className="text-emerald-600">BOM & Quotation Engine</span>
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm">
            Input your available roof dimensions, orientation, and optional budget to automatically generate a complete 
            customer engineering plan, itemized material BoQ, energy output schedule, and bankable commercial quotation with a locked 25% profit margin.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DUAL COLUMN: INPUT CONTROLS VS LIVE OUTPUT DASHBOARD */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: PARAMETER INPUTS (5 Cols) */}
          <div className="lg:col-span-5 bg-[#F8FBF9] rounded-2xl p-6 border border-emerald-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" /> 1. Input Space & Placement
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                BNBC 2020 Wind Compliant
              </span>
            </div>

            {/* Customer Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">Customer Sector</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setCustomerSector('FACTORY'); setRoofType('PEB_METAL'); setCustomTariffBdt(12.20); }}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                    customerSector === 'FACTORY' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <Factory className="w-4 h-4" />
                  <span>Factory (C&I)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomerSector('COMMERCIAL'); setRoofType('RCC_SLAB'); setCustomTariffBdt(14.85); }}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                    customerSector === 'COMMERCIAL' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Commercial</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomerSector('HOUSEHOLD'); setRoofType('RCC_SLAB'); setCustomTariffBdt(11.50); }}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                    customerSector === 'HOUSEHOLD' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Household</span>
                </button>
              </div>
            </div>

            {/* Space Dimensions (Length x Width) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">Rooftop Physical Dimensions</label>
                <button
                  type="button"
                  onClick={() => setIsManualAreaOverride(!isManualAreaOverride)}
                  className="text-[11px] text-emerald-700 hover:underline font-semibold"
                >
                  {isManualAreaOverride ? 'Switch to Length × Width' : 'Manual Total Sq. Ft. Override'}
                </button>
              </div>

              {!isManualAreaOverride ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">Length (Feet)</span>
                    <div className="mt-1 flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus-within:border-emerald-500">
                      <input
                        type="number"
                        min={10}
                        max={1500}
                        value={lengthFeet}
                        onChange={(e) => setLengthFeet(Math.max(1, Number(e.target.value)))}
                        className="w-full text-xs font-bold text-slate-900 focus:outline-hidden"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">ft</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">Width (Feet)</span>
                    <div className="mt-1 flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus-within:border-emerald-500">
                      <input
                        type="number"
                        min={10}
                        max={1500}
                        value={widthFeet}
                        onChange={(e) => setWidthFeet(Math.max(1, Number(e.target.value)))}
                        className="w-full text-xs font-bold text-slate-900 focus:outline-hidden"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">ft</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Total Gross Rooftop Surface</span>
                  <div className="mt-1 flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus-within:border-emerald-500">
                    <input
                      type="number"
                      min={500}
                      max={500000}
                      value={manualAreaSqFt}
                      onChange={(e) => setManualAreaSqFt(Math.max(100, Number(e.target.value)))}
                      className="w-full text-xs font-bold text-slate-900 focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">sq. ft.</span>
                  </div>
                </div>
              )}

              {/* Calculated Area Indicator */}
              <div className="p-2.5 bg-white rounded-lg border border-emerald-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600">Calculated Gross Area:</span>
                <span className="font-bold text-emerald-800">{model.calculatedAreaSqFt.toLocaleString()} sq. ft. ({Math.round(model.calculatedAreaSqFt / 10.7639).toLocaleString()} m²)</span>
              </div>
            </div>

            {/* Roof Construction & Positioning Selector */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Roof Construction</label>
                <select
                  value={roofType}
                  onChange={(e: any) => setRoofType(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:border-emerald-500"
                >
                  <option value="PEB_METAL">PEB Corrugated / Seam Tin</option>
                  <option value="RCC_SLAB">Flat RCC Concrete Slab</option>
                  <option value="TERRACE_PERGOLA">Rooftop Garden / Pergola</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Azimuth Orientation</label>
                <select
                  value={positioning}
                  onChange={(e: any) => setPositioning(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:border-emerald-500"
                >
                  <option value="SOUTH">True South 180° (100% Peak Yield)</option>
                  <option value="SOUTH_EAST">South-East 135° (96% Yield)</option>
                  <option value="SOUTH_WEST">South-West 225° (96% Yield)</option>
                  <option value="EAST_WEST">East / West Split (88% Yield)</option>
                </select>
              </div>
            </div>

            {/* Optional Input Budget */}
            <div className="pt-2 border-t border-emerald-200/60">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Client Budget (Optional)</span>
                </label>
                <input
                  type="checkbox"
                  id="budgetToggle"
                  checked={hasBudgetConstraint}
                  onChange={(e) => setHasBudgetConstraint(e.target.checked)}
                  className="accent-emerald-600 w-3.5 h-3.5 cursor-pointer"
                />
              </div>

              {hasBudgetConstraint ? (
                <div className="space-y-2">
                  <div className="flex items-center bg-white border border-emerald-300 rounded-lg px-3 py-1.5 focus-within:border-emerald-500">
                    <span className="text-xs font-bold text-emerald-800 mr-2">৳</span>
                    <input
                      type="number"
                      step={500000}
                      min={500000}
                      max={200000000}
                      value={budgetBdt}
                      onChange={(e) => setBudgetBdt(Math.max(100000, Number(e.target.value)))}
                      className="w-full text-xs font-bold text-slate-900 focus:outline-hidden"
                    />
                    <span className="text-[11px] font-bold text-emerald-700 whitespace-nowrap ml-2">
                      ({formatBdt(budgetBdt)})
                    </span>
                  </div>
                  {model.isConstrainedByBudget && (
                    <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                      ⚠️ Budget restricts array to {model.installedCapacityKwp} kWp ({model.budgetUtilizationPct}% of maximum {model.maxRoofCapacityKwp} kWp roof potential).
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 italic">
                  Unchecked: Optimizing maximum high-efficiency capacity achievable on roof ({model.maxRoofCapacityKwp} kWp).
                </p>
              )}
            </div>

            {/* Hardware Add-on: Hybrid BESS */}
            <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Hybrid Battery Storage (BESS)</span>
                <span className="text-[10px] text-slate-500">10ms UPS switchover for 24/7 zero load-shedding</span>
              </div>
              <input
                type="checkbox"
                checked={includeBessStorage}
                onChange={(e) => setIncludeBessStorage(e.target.checked)}
                className="accent-emerald-600 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: EXECUTIVE CUSTOMER PLAN & 5-PILLAR TABS (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            
            {/* Top Quick Sizing Banner */}
            <div className="bg-[#064E3B] text-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold block">
                    Recommended High-Efficiency Engineering Sizing
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2 mt-0.5">
                    <span>{model.installedCapacityKwp} kWp DC</span>
                    <span className="text-xs font-normal text-emerald-200 bg-emerald-800/80 px-2 py-0.5 rounded">
                      ({model.inverterAcCapacityKw} kW AC Inverter)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold block">
                    Turnkey Commercial Investment (FOB + Turnkey)
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-amber-300">
                    {formatBdt(model.totalCommercialTurnkeyBdt)}
                  </div>
                  <span className="text-[10px] text-emerald-200">
                    ~${model.totalCommercialTurnkeyUsd.toLocaleString()} USD (@ Tk {model.turnkeyPricePerWp.toFixed(2)}/Wp)
                  </span>
                </div>
              </div>

              {/* 3 Metrics Ribbon */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-700/80 text-center font-mono text-xs">
                <div>
                  <span className="text-[10px] text-emerald-300 block">Annual Generation</span>
                  <span className="font-bold text-white">{model.annualGenKwh.toLocaleString()} kWh/yr</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300 block">Monthly Savings</span>
                  <span className="font-bold text-white">{formatBdt(model.monthlyTotalBenefitBdt)}/mo</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300 block">Simple Payback</span>
                  <span className="font-bold text-amber-300">{model.simplePaybackYears} Years</span>
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION BAR */}
            <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('OVERVIEW')}
                className={`py-3 px-4 shrink-0 transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'OVERVIEW'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> 1. Products & Implementation
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('BOM')}
                className={`py-3 px-4 shrink-0 transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'BOM'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> 2. Material BOM List
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('OUTPUT')}
                className={`py-3 px-4 shrink-0 transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'OUTPUT'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> 3. Output Valuation
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('WARRANTY')}
                className={`py-3 px-4 shrink-0 transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'WARRANTY'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> 4. Warranty & SLA
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('QUOTATION')}
                className={`py-3 px-4 shrink-0 transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'QUOTATION'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" /> 5. Commercial Quotation (25% Margin)
              </button>
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="p-6">
              
              {/* TAB 1: DETAIL PRODUCTS IMPLEMENTATION (HIGHEST OUTPUT & EFFICIENCY) */}
              {activeTab === 'OVERVIEW' && (
                <div className="space-y-4 text-xs text-slate-700">
                  <div className="border-l-4 border-emerald-600 pl-3">
                    <h3 className="font-bold text-slate-900 text-sm">Tier-1 High-Efficiency Component Architecture</h3>
                    <p className="text-[11px] text-slate-500">
                      Engineered to capture maximum kilowatt-hour yield in tropical, high-humidity environments.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Sun className="w-4 h-4" /> PV Modules
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                          23.2% Efficiency
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800">Jinko Tiger Neo / Longi Hi-MO 7 N-Type TOPCon (620Wp)</p>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 mt-1 space-y-0.5">
                        <li>Bifacial dual-glass (2.0+2.0mm) with 80%–85% rear albedo gain</li>
                        <li>Low temperature coefficient: -0.29%/°C (3.5% higher summer yield)</li>
                        <li>Total Installed: <strong>{model.panelCount} Modules</strong></li>
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Zap className="w-4 h-4" /> Inverter System
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                          98.8% Peak Eff.
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800">Huawei SUN2000 / Sungrow SG Multi-MPPT String Inverters</p>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 mt-1 space-y-0.5">
                        <li>Total AC Rating: <strong>{model.inverterAcCapacityKw} kW AC</strong></li>
                        <li>Built-in AI Arc-Fault Circuit Interrupters (AFCI &lt; 0.5s trip)</li>
                        <li>Decentralized multi-MPPT architecture with IP66 C5 protection</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Layers className="w-4 h-4" /> Mounting System
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                          BNBC 2020 Wind
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800">Kai 6063-T6 Anodized Aluminum + SUS304 Hardware</p>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 mt-1 space-y-0.5">
                        <li>100% Non-penetrative standing-seam clamps (zero roof leaks)</li>
                        <li>15–20 µm clear anodization with stainless A2-70 fasteners</li>
                        <li>Withstands 180 km/h (inland) to 260 km/h (coastal) winds</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <TrendingUp className="w-4 h-4" /> Ariel-SaaS™ Telemetry
                        </span>
                        <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono">
                          IoT / I-REC
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800">Industrial IoT Gateway &amp; Secondary Standard Pyranometer</p>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 mt-1 space-y-0.5">
                        <li>60-second cloud performance ratio (PR) monitoring</li>
                        <li>Automated 15-minute smart I-V curve string diagnostic</li>
                        <li>Automated I-REC certification for EU CBAM export compliance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DETAILED MATERIAL LIST WITH HARDWARE OPTIONS & PRICES */}
              {activeTab === 'BOM' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Itemized Material Bill of Quantities (BoQ)</h3>
                      <p className="text-[11px] text-slate-500">Calculated specifically for {model.installedCapacityKwp} kWp capacity</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      Total COGS: {formatBdt(model.baseCogsTotalBdt)}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] text-left border border-slate-200 rounded-lg">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2">Component</th>
                          <th className="p-2">Make / Specification</th>
                          <th className="p-2">BoQ Qty</th>
                          <th className="p-2 text-right">Estimated Cost</th>
                          <th className="p-2 text-center">Share</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        <tr>
                          <td className="p-2 font-semibold text-slate-800">Tier-1 N-Type TOPCon Panels</td>
                          <td className="p-2">Jinko / Longi 620W Bifacial Dual-Glass</td>
                          <td className="p-2 font-mono">{model.panelCount} Pcs</td>
                          <td className="p-2 text-right font-mono font-bold text-slate-800">{formatBdt(model.baseCogsTotalBdt * 0.43)}</td>
                          <td className="p-2 text-center">43.0%</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold text-slate-800">Grid-Tied String Inverters</td>
                          <td className="p-2">Huawei / Sungrow Multi-MPPT 100/125kW</td>
                          <td className="p-2 font-mono">{Math.ceil(model.inverterAcCapacityKw / 110)} Units</td>
                          <td className="p-2 text-right font-mono font-bold text-slate-800">{formatBdt(model.baseCogsTotalBdt * 0.18)}</td>
                          <td className="p-2 text-center">18.0%</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold text-slate-800">Aluminum Mounting Rails &amp; Clamps</td>
                          <td className="p-2">Kai 6063-T6 Anodized (15–20 µm) + SUS304</td>
                          <td className="p-2 font-mono">{model.installedCapacityKwp} kWp</td>
                          <td className="p-2 text-right font-mono font-bold text-slate-800">{formatBdt(model.baseCogsTotalBdt * 0.12)}</td>
                          <td className="p-2 text-center">12.0%</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold text-slate-800">DC &amp; AC Solar Cabling</td>
                          <td className="p-2">KBE 1500V XLPO DC + BRB/BBS Armored AC</td>
                          <td className="p-2 font-mono">~{Math.round(model.installedCapacityKwp * 14)} m</td>
                          <td className="p-2 text-right font-mono font-bold text-slate-800">{formatBdt(model.baseCogsTotalBdt * 0.08)}</td>
                          <td className="p-2 text-center">8.0%</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold text-slate-800">LT/HT Switchgear &amp; Net Meter</td>
                          <td className="p-2">ABB/Schneider ACB + Secure 0.2S Meter</td>
                          <td className="p-2 font-mono">1 Station</td>
                          <td className="p-2 text-right font-mono font-bold text-slate-800">{formatBdt(model.baseCogsTotalBdt * 0.06)}</td>
                          <td className="p-2 text-center">6.0%</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold text-slate-800">Chemical Earthing &amp; Lightning</td>
                          <td className="p-2">Erico Copper Bonded Rods (Earth R &lt; 1Ω)</td>
                          <td className="p-2 font-mono">1 Lot</td>
                          <td className="p-2 text-right font-mono font-bold text-slate-800">{formatBdt(model.baseCogsTotalBdt * 0.05)}</td>
                          <td className="p-2 text-center">5.0%</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold text-slate-800">Civil, Mechanical &amp; SREDA COD</td>
                          <td className="p-2">Ariel Turnkey Engineering + Grade-A Partner</td>
                          <td className="p-2 font-mono">Turnkey</td>
                          <td className="p-2 text-right font-mono font-bold text-slate-800">{formatBdt(model.baseCogsTotalBdt * 0.08)}</td>
                          <td className="p-2 text-center">8.0%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: DETAIL OUTPUT FOR CONSUMPTION & VALUATION */}
              {activeTab === 'OUTPUT' && (
                <div className="space-y-4">
                  <div className="border-l-4 border-emerald-600 pl-3">
                    <h3 className="font-bold text-slate-900 text-sm">Energy Generation &amp; Financial Valuation Breakdown</h3>
                    <p className="text-[11px] text-slate-500">Calculated at Tk {model.effectiveGridTariff.toFixed(2)}/kWh grid tariff &amp; Tk 10.50 weekend net-metering</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Daily Yield</span>
                      <div className="text-lg font-extrabold text-slate-900 font-mono mt-1">{model.dailyGenKwh.toLocaleString()} kWh</div>
                      <div className="text-xs font-bold text-emerald-700 mt-0.5">{formatBdt(model.dailyTotalBenefitBdt)} / Day</div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Monthly Yield</span>
                      <div className="text-lg font-extrabold text-slate-900 font-mono mt-1">{model.monthlyGenKwh.toLocaleString()} kWh</div>
                      <div className="text-xs font-bold text-emerald-700 mt-0.5">{formatBdt(model.monthlyTotalBenefitBdt)} / Month</div>
                    </div>

                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                      <span className="text-[10px] text-emerald-800 uppercase tracking-wider font-semibold block">Annual Benefit</span>
                      <div className="text-lg font-extrabold text-emerald-950 font-mono mt-1">{model.annualGenKwh.toLocaleString()} kWh</div>
                      <div className="text-xs font-extrabold text-emerald-700 mt-0.5">{formatBdt(model.annualTotalBenefitBdt)} / Year</div>
                    </div>
                  </div>

                  {/* Weekend Cash Buyback Highlight */}
                  <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900 block">Weekend &amp; Holiday Grid Cash Buyback (~Tk 10.50/kWh Pre-Feb 28, 2027 Cutoff)</span>
                      <span>On 52 Fridays and holidays when the facility is closed, surplus solar power earns an additional <strong>{formatBdt(model.annualWeekendCashExportBdt)}/year</strong> deposited in cash quarterly directly into your bank account.</span>
                    </div>
                  </div>

                  {/* 25-Year Cumulative Box */}
                  <div className="p-3.5 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider">25-Year Cumulative Output</span>
                      <span className="text-base font-extrabold font-mono text-emerald-400">{Math.round(model.lifetimeGenKwh / 1000).toLocaleString()} MWh</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider">25-Year Net Free Cash Savings</span>
                      <span className="text-base font-extrabold font-mono text-amber-300">{formatBdt(model.lifetimeNetProfitBdt)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: LIFETIME, LIFESPAN, WARRANTY & AFTER-SALES SERVICE POLICY */}
              {activeTab === 'WARRANTY' && (
                <div className="space-y-4 text-xs">
                  <div className="border-l-4 border-emerald-600 pl-3">
                    <h3 className="font-bold text-slate-900 text-sm">Comprehensive Warranty Spans &amp; Operations SLA</h3>
                    <p className="text-[11px] text-slate-500">Guaranteed performance curves and rapid on-site replacement protocol</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">Solar PV Modules</span>
                      <ul className="space-y-1 text-slate-600 text-[11px]">
                        <li>• <strong>Product Warranty</strong>: 15 Years Workmanship</li>
                        <li>• <strong>Performance Warranty</strong>: 30 Years Linear (87.4% at Y30)</li>
                        <li>• <strong>Design Lifespan</strong>: 30+ Years</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">Inverter System</span>
                      <ul className="space-y-1 text-slate-600 text-[11px]">
                        <li>• <strong>Factory Warranty</strong>: 5 Years Standard + 5 Years Extended</li>
                        <li>• <strong>Advance Swap SLA</strong>: 48-Hour Replacement</li>
                        <li>• <strong>Design Lifespan</strong>: 20 Years</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">Mounting Structure &amp; Roof</span>
                      <ul className="space-y-1 text-slate-600 text-[11px]">
                        <li>• <strong>Anti-Corrosion Guarantee</strong>: 15 Years</li>
                        <li>• <strong>Zero-Leak Roof Warranty</strong>: 5 Years Ariel Guarantee</li>
                        <li>• <strong>Design Lifespan</strong>: 30+ Years</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">Cabling &amp; Switchgear</span>
                      <ul className="space-y-1 text-slate-600 text-[11px]">
                        <li>• <strong>DC Cables (XLPO)</strong>: 25 Years Weather &amp; UV</li>
                        <li>• <strong>Switchgear &amp; VCB</strong>: 5 Years Manufacturer Warranty</li>
                        <li>• <strong>Design Lifespan</strong>: 25–30 Years</li>
                      </ul>
                    </div>
                  </div>

                  {/* After-Sales SLA Box */}
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                    <span className="font-bold block mb-1">Ariel Renewable Energy After-Sales SLA:</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>• <strong>Guaranteed Availability</strong>: 99.0% Daytime Uptime</div>
                      <div>• <strong>On-Site MTTR</strong>: Under 4 Hours in Dhaka/Gazipur/Savar</div>
                      <div>• <strong>Drone Thermography</strong>: Semi-Annual RTK Thermal Scans</div>
                      <div>• <strong>Zero-Downtime Buffer</strong>: 48-Hr Spares from Gazipur Depot</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: QUOTATION BUILDER (WITH EXACT 25% PROFIT MARGIN) */}
              {activeTab === 'QUOTATION' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Official Commercial Quotation Proposal</h3>
                      <p className="text-[11px] text-slate-500">Ref: AREL-QT-{Math.round(model.installedCapacityKwp)}KWP-2026</p>
                    </div>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / Export PDF</span>
                    </button>
                  </div>

                  {/* Commercial Figures Breakdown */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Engineering COGS (Hardware, Structure, Labor, SREDA):</span>
                      <span className="font-mono font-semibold">{formatBdt(model.baseCogsTotalBdt)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Ariel Turnkey Engineering &amp; EPC Gross Margin (25.0% Locked):</span>
                      <span className="font-mono">+{formatBdt(model.grossProfitBdt)} ({model.profitMarginPct.toFixed(1)}%)</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                      <span>SRO 159-Law/2026 Customs Duty Savings (1% vs 17% applied):</span>
                      <span className="font-mono text-emerald-600 font-bold">Saved ~{formatBdt(model.dutySavingsBdt)}</span>
                    </div>
                    <div className="flex justify-between text-slate-950 font-extrabold text-sm pt-2 border-t-2 border-slate-300">
                      <span>Total Commercial Turnkey Proposal:</span>
                      <span className="font-mono text-emerald-800">{formatBdt(model.totalCommercialTurnkeyBdt)}</span>
                    </div>
                    <div className="text-right text-[11px] text-slate-500 font-mono">
                      ~${model.totalCommercialTurnkeyUsd.toLocaleString()} USD (at Tk {model.turnkeyPricePerWp.toFixed(2)}/Wp)
                    </div>
                  </div>

                  {/* Government Green Financing Structure */}
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <span className="font-bold text-emerald-950 block mb-2">Concessionary Financing Structure (Tk 1,500 Cr Solar Fund):</span>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-slate-600 block">80% Government Debt (4.5%, 10-Yr):</span>
                        <span className="font-bold font-mono text-emerald-900">{formatBdt(model.greenLoanDebtBdt)}</span>
                        <span className="text-[10px] text-emerald-700 block">1-Year Grace Period (Tk 0 EMI Y1)</span>
                      </div>
                      <div>
                        <span className="text-slate-600 block">20% Client Equity Contribution:</span>
                        <span className="font-bold font-mono text-slate-900">{formatBdt(model.clientEquityBdt)}</span>
                        <span className="text-[10px] text-emerald-700 block">Reimbursed 100% via Year-1 savings</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-emerald-200/80 flex justify-between font-bold text-emerald-950">
                      <span>Net Monthly Free Cash Surplus to Client (M13+):</span>
                      <span className="font-mono text-emerald-700">+{formatBdt(model.netMonthlyCashSurplusBdt)} / Month</span>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenDossierRequest && onOpenDossierRequest({
                        roofAreaSqFt: model.calculatedAreaSqFt,
                        monthlyBillBdt: model.monthlyTotalBenefitBdt * 1.5,
                        capacityKwp: model.installedCapacityKwp,
                        annualSavingsBdt: model.annualTotalBenefitBdt,
                        utilityProvider,
                        operatingDays,
                      })}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <span>Lock In Tk 10.50/kWh Pre-Feasibility Audit</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
