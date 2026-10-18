'use client';

import React, { useState } from 'react';
import {
  Calculator as CalcIcon,
  DollarSign,
  TrendingUp,
  Package,
  RefreshCw,
  Copy,
  Check,
  Percent,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CurrencyRate } from '@/types/erp';
import { ThemeProfile } from '@/components/Sidebar';

interface CalculatorUtilityProps {
  activeCurrency?: CurrencyRate;
  theme?: ThemeProfile;
}

export const CalculatorUtility: React.FC<CalculatorUtilityProps> = ({
  activeCurrency,
  theme = 'crm-green',
}) => {
  const [calcMode, setCalcMode] = useState<'MARGIN' | 'FOREX' | 'FREIGHT_CBM' | 'STANDARD'>('MARGIN');
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  // 1. Margin & Costing Calculator State
  const [unitCost, setUnitCost] = useState<number>(24.50);
  const [targetMarginPct, setTargetMarginPct] = useState<number>(38);
  const [orderQuantity, setOrderQuantity] = useState<number>(1200);
  const [vatPct, setVatPct] = useState<number>(15); // Bangladesh Mushak 6.3 or UK VAT 20%
  const [shippingPerUnit, setShippingPerUnit] = useState<number>(3.20);

  // Computations
  const sellingPricePerUnit = (unitCost + shippingPerUnit) / (1 - targetMarginPct / 100);
  const grossProfitPerUnit = sellingPricePerUnit - (unitCost + shippingPerUnit);
  const totalOrderRevenue = sellingPricePerUnit * orderQuantity;
  const totalGrossProfit = grossProfitPerUnit * orderQuantity;
  const totalCost = (unitCost + shippingPerUnit) * orderQuantity;
  const vatAmount = totalOrderRevenue * (vatPct / 100);

  // 2. Forex Converter State
  const [forexAmount, setForexAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<'GBP' | 'USD' | 'EUR' | 'BDT' | 'AUD'>('GBP');
  const [toCurrency, setToCurrency] = useState<'BDT' | 'GBP' | 'USD' | 'EUR' | 'AUD'>('BDT');

  // Rates anchored to official ERP schedule (£1 GBP base)
  const ratesToGBP: Record<string, number> = {
    GBP: 1,
    BDT: 155,
    USD: 1.28,
    EUR: 1.17,
    AUD: 1.95,
  };

  const convertForex = (amount: number, from: string, to: string) => {
    const amountInGBP = amount / ratesToGBP[from];
    return amountInGBP * ratesToGBP[to];
  };
  const convertedForexResult = convertForex(forexAmount, fromCurrency, toCurrency);

  // 3. Freight CBM & Shipping Calculator State
  const [cartonLengthCm, setCartonLengthCm] = useState<number>(60);
  const [cartonWidthCm, setCartonWidthCm] = useState<number>(40);
  const [cartonHeightCm, setCartonHeightCm] = useState<number>(35);
  const [numberOfCartons, setNumberOfCartons] = useState<number>(150);
  const [pcsPerCarton, setPcsPerCarton] = useState<number>(12);

  // Computations
  const singleCartonCbm = (cartonLengthCm * cartonWidthCm * cartonHeightCm) / 1000000;
  const totalConsignmentCbm = singleCartonCbm * numberOfCartons;
  const totalProductUnits = numberOfCartons * pcsPerCarton;
  const container20ftCapacity = 28; // usable CBM
  const container40ftCapacity = 58; // usable CBM
  const fill20ftPct = Math.min(100, (totalConsignmentCbm / container20ftCapacity) * 100);
  const fill40ftPct = Math.min(100, (totalConsignmentCbm / container40ftCapacity) * 100);
  const airVolumetricWeightKg = (cartonLengthCm * cartonWidthCm * cartonHeightCm) / 5000 * numberOfCartons;

  // 4. Standard Calculator Keypad State
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [historyTape, setHistoryTape] = useState<string[]>([]);

  const handleNumClick = (digit: string) => {
    setDisplayValue(prev => (prev === '0' ? digit : prev + digit));
  };

  const handleOpClick = (op: string) => {
    setPrevValue(parseFloat(displayValue));
    setOperation(op);
    setDisplayValue('0');
  };

  const handleEquals = () => {
    if (prevValue === null || !operation) return;
    const current = parseFloat(displayValue);
    let result = 0;
    if (operation === '+') result = prevValue + current;
    if (operation === '-') result = prevValue - current;
    if (operation === '×') result = prevValue * current;
    if (operation === '÷') result = current !== 0 ? prevValue / current : 0;

    const tapeEntry = `${prevValue} ${operation} ${current} = ${result}`;
    setHistoryTape(prev => [tapeEntry, ...prev.slice(0, 7)]);
    setDisplayValue(String(result));
    setPrevValue(null);
    setOperation(null);
  };

  const handleClear = () => {
    setDisplayValue('0');
    setPrevValue(null);
    setOperation(null);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  return (
    <div className="space-y-6 text-slate-900 animate-in fade-in duration-200">
      {/* Sub-Tabs Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#C8A96A]/30 pb-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold font-heading text-[#1F3A2E] flex items-center gap-2">
            <CalcIcon className="w-5 h-5 text-[#C8A96A]" />
            Enterprise Financial, Margin &amp; Freight Calculator Suite
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Four specialized calculators: B2B Unit Costing &amp; Margin, Real-Time Forex, Freight CBM &amp; Container Estimator, and Standard Keypad.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#12241b] border border-[#2b5540] text-xs">
          {[
            { id: 'MARGIN', label: '📊 Sourcing Margin & Costing' },
            { id: 'FOREX', label: '💱 Multi-Station Forex' },
            { id: 'FREIGHT_CBM', label: '🚢 Freight CBM & Container' },
            { id: 'STANDARD', label: '🔢 Keypad Calculator' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCalcMode(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                calcMode === tab.id
                  ? 'bg-[#C8A96A] text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-[#1a382b]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== 1. SOURCING MARGIN & COSTING CALCULATOR ==================== */}
      {calcMode === 'MARGIN' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs Column */}
          <div className="lg:col-span-1 rounded-xl bg-[#12241b] border border-[#2b5540] p-5 space-y-4 shadow-xl">
            <span className="text-xs font-mono font-bold text-[#C8A96A] uppercase tracking-wider block">
              1. Sourcing Parameters &amp; Cost Inputs
            </span>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Ex-Factory Unit Cost (£ or $):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono">£</span>
                  <input
                    type="number"
                    step="0.5"
                    value={unitCost}
                    onChange={e => setUnitCost(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-mono focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Freight &amp; Packaging per Unit:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono">£</span>
                  <input
                    type="number"
                    step="0.1"
                    value={shippingPerUnit}
                    onChange={e => setShippingPerUnit(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-mono focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-medium">Target Ariel Sourcing Margin:</label>
                  <span className="font-mono font-bold text-[#C8A96A]">{targetMarginPct}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="65"
                  value={targetMarginPct}
                  onChange={e => setTargetMarginPct(parseInt(e.target.value))}
                  className="w-full accent-[#C8A96A] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Total Production Batch Units:</label>
                <input
                  type="number"
                  step="50"
                  value={orderQuantity}
                  onChange={e => setOrderQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-mono focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">VAT / Duty Rate (%):</label>
                <input
                  type="number"
                  value={vatPct}
                  onChange={e => setVatPct(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-mono focus:outline-none focus:border-[#C8A96A]"
                />
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2 rounded-xl bg-[#0f1f18] border border-[#2b5540] p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#234534] pb-3">
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                  Commercial Pricing Output
                </span>
                <h4 className="text-lg font-bold text-white">Recommended FOB / CIF Selling Terms</h4>
              </div>

              <button
                onClick={() => handleCopy(`FOB Quote: £${sellingPricePerUnit.toFixed(2)}/unit | Margin: ${targetMarginPct}% | Total: £${totalOrderRevenue.toFixed(2)}`, 'quote')}
                className="px-3 py-1.5 rounded-lg bg-[#183225] hover:bg-[#204231] text-xs font-mono text-[#C8A96A] border border-[#2e5d45] flex items-center gap-1.5 transition-colors"
              >
                {copiedLabel === 'quote' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLabel === 'quote' ? 'Copied Quote' : 'Copy Quote'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#14281f] border border-[#2b5540] space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Selling Price / Unit</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  £{sellingPricePerUnit.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  ৳{(sellingPricePerUnit * 155).toFixed(0)} BDT
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#14281f] border border-[#2b5540] space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Gross Margin / Unit</span>
                <div className="text-2xl font-black text-[#C8A96A] font-mono">
                  £{grossProfitPerUnit.toFixed(2)}
                </div>
                <span className="text-[10px] text-emerald-400 block font-mono">
                  {targetMarginPct}% Net Gross Profit
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#14281f] border border-[#2b5540] space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Total Batch Profit</span>
                <div className="text-2xl font-black text-cyan-400 font-mono">
                  £{totalGrossProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  On {orderQuantity.toLocaleString()} Units
                </span>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="rounded-xl border border-[#254c37] bg-[#12241b] p-4 text-xs space-y-2">
              <span className="font-bold text-slate-200 block text-xs uppercase tracking-wider font-mono">
                Batch Economics Summary
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Factory Cost:</span>
                  <span className="font-bold font-mono text-slate-100">£{totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Buyer Invoicing:</span>
                  <span className="font-bold font-mono text-emerald-400">£{totalOrderRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Statutory VAT ({vatPct}%):</span>
                  <span className="font-bold font-mono text-amber-300">£{vatAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Gross Profit (BDT):</span>
                  <span className="font-bold font-mono text-[#C8A96A]">৳{(totalGrossProfit * 155).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 2. MULTI-STATION FOREX CONVERTER ==================== */}
      {calcMode === 'FOREX' && (
        <div className="rounded-xl bg-[#0f1f18] border border-[#2b5540] p-6 space-y-6 shadow-xl max-w-3xl mx-auto">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-bold text-[#C8A96A] uppercase tracking-wider">
              ArielMC Station Cross-Currency Converter
            </span>
            <h4 className="text-xl font-bold text-white">Live Multi-Station Exchange Simulator</h4>
            <p className="text-xs text-slate-300">
              Anchored to statutory treasury rates: £1 GBP = ৳155 BDT • $1.28 USD • €1.17 EUR • A$1.95 AUD
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#14281f] border border-[#2b5540] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-slate-300 font-medium">Source Amount:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={forexAmount}
                    onChange={e => setForexAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-mono text-base font-bold focus:outline-none focus:border-[#C8A96A]"
                  />
                  <select
                    value={fromCurrency}
                    onChange={e => setFromCurrency(e.target.value as any)}
                    className="px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-[#C8A96A] font-bold text-xs"
                  >
                    <option value="GBP">GBP (£)</option>
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="AUD">AUD (A$)</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-1 flex justify-center pt-4">
                <div className="w-10 h-10 rounded-full bg-[#1e3c2d] border border-[#2d5942] flex items-center justify-center text-[#C8A96A]">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-slate-300 font-medium">Destination Currency:</label>
                <div className="flex gap-2">
                  <div className="w-full px-3 py-2 rounded-lg bg-[#0e1c14] border border-[#2e5d45] text-emerald-400 font-mono text-base font-bold flex items-center">
                    {convertedForexResult.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <select
                    value={toCurrency}
                    onChange={e => setToCurrency(e.target.value as any)}
                    className="px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-[#C8A96A] font-bold text-xs"
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="AUD">AUD (A$)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#12241b] border border-[#244935] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                1 {fromCurrency} = {(convertForex(1, fromCurrency, toCurrency)).toFixed(4)} {toCurrency}
              </span>
              <button
                onClick={() => handleCopy(`${forexAmount} ${fromCurrency} = ${convertedForexResult.toFixed(2)} ${toCurrency}`, 'forex')}
                className="text-[#C8A96A] hover:underline flex items-center gap-1"
              >
                {copiedLabel === 'forex' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLabel === 'forex' ? 'Copied' : 'Copy Result'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. FREIGHT CBM & CONTAINER LOAD ESTIMATOR ==================== */}
      {calcMode === 'FREIGHT_CBM' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-xl bg-[#12241b] border border-[#2b5540] p-5 space-y-4 shadow-xl">
            <span className="text-xs font-mono font-bold text-[#C8A96A] uppercase tracking-wider block">
              Carton Packaging Specs
            </span>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Length (cm):</label>
                  <input
                    type="number"
                    value={cartonLengthCm}
                    onChange={e => setCartonLengthCm(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded bg-[#183326] border border-[#2e5d45] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Width (cm):</label>
                  <input
                    type="number"
                    value={cartonWidthCm}
                    onChange={e => setCartonWidthCm(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded bg-[#183326] border border-[#2e5d45] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Height (cm):</label>
                  <input
                    type="number"
                    value={cartonHeightCm}
                    onChange={e => setCartonHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded bg-[#183326] border border-[#2e5d45] text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Total Number of Cartons:</label>
                <input
                  type="number"
                  value={numberOfCartons}
                  onChange={e => setNumberOfCartons(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Pieces per Carton (Units):</label>
                <input
                  type="number"
                  value={pcsPerCarton}
                  onChange={e => setPcsPerCarton(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-xl bg-[#0f1f18] border border-[#2b5540] p-6 space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                Logistics Stuffing Plan
              </span>
              <h4 className="text-lg font-bold text-white">Chittagong ⇄ UK Felixstowe / Southampton Ocean Load</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#14281f] border border-[#2b5540] space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Total Consignment CBM</span>
                <div className="text-2xl font-black text-cyan-400 font-mono">
                  {totalConsignmentCbm.toFixed(2)} m³
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Single carton: {singleCartonCbm.toFixed(3)} CBM
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#14281f] border border-[#2b5540] space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">20ft Container Fill %</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {fill20ftPct.toFixed(1)}%
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, fill20ftPct)}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#14281f] border border-[#2b5540] space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-mono block">Air Volumetric Weight</span>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {airVolumetricWeightKg.toFixed(0)} kg
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  @ 1:5000 Air Freight Ratio
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#14281f] border border-[#2b5540] flex items-center justify-between text-xs font-mono">
              <span>Total Product Quantity: <strong className="text-white">{totalProductUnits.toLocaleString()} Pcs</strong></span>
              <span>40ft Container Fill: <strong className="text-cyan-300">{fill40ftPct.toFixed(1)}%</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 4. STANDARD KEYPAD CALCULATOR ==================== */}
      {calcMode === 'STANDARD' && (
        <div className="max-w-md mx-auto rounded-2xl bg-[#0f1f18] border border-[#2b5540] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#234534] pb-2 text-xs">
            <span className="text-slate-400 font-mono uppercase font-bold">Standard Office Keypad</span>
            <button
              onClick={handleClear}
              className="text-[#C8A96A] hover:underline font-mono"
            >
              Clear Screen
            </button>
          </div>

          {/* LCD Screen */}
          <div className="p-4 rounded-xl bg-[#08120c] border border-[#254d37] text-right font-mono">
            <div className="text-xs text-slate-500 h-4">
              {prevValue !== null && `${prevValue} ${operation || ''}`}
            </div>
            <div className="text-3xl font-black text-emerald-400 overflow-x-auto tracking-wider">
              {displayValue}
            </div>
          </div>

          {/* Keypad Buttons */}
          <div className="grid grid-cols-4 gap-2 text-sm font-bold font-mono">
            {['C', '±', '%', '÷'].map(key => (
              <button
                key={key}
                onClick={() => {
                  if (key === 'C') handleClear();
                  else if (key === '÷') handleOpClick('÷');
                }}
                className="p-3.5 rounded-xl bg-[#1c3829] hover:bg-[#254d37] text-[#C8A96A] transition-colors"
              >
                {key}
              </button>
            ))}

            {['7', '8', '9', '×'].map(key => (
              <button
                key={key}
                onClick={() => (key === '×' ? handleOpClick('×') : handleNumClick(key))}
                className={`p-3.5 rounded-xl transition-colors ${
                  key === '×'
                    ? 'bg-[#1c3829] text-[#C8A96A] hover:bg-[#254d37]'
                    : 'bg-[#14261d] text-white hover:bg-[#1c3529]'
                }`}
              >
                {key}
              </button>
            ))}

            {['4', '5', '6', '-'].map(key => (
              <button
                key={key}
                onClick={() => (key === '-' ? handleOpClick('-') : handleNumClick(key))}
                className={`p-3.5 rounded-xl transition-colors ${
                  key === '-'
                    ? 'bg-[#1c3829] text-[#C8A96A] hover:bg-[#254d37]'
                    : 'bg-[#14261d] text-white hover:bg-[#1c3529]'
                }`}
              >
                {key}
              </button>
            ))}

            {['1', '2', '3', '+'].map(key => (
              <button
                key={key}
                onClick={() => (key === '+' ? handleOpClick('+') : handleNumClick(key))}
                className={`p-3.5 rounded-xl transition-colors ${
                  key === '+'
                    ? 'bg-[#1c3829] text-[#C8A96A] hover:bg-[#254d37]'
                    : 'bg-[#14261d] text-white hover:bg-[#1c3529]'
                }`}
              >
                {key}
              </button>
            ))}

            <button
              onClick={() => handleNumClick('0')}
              className="col-span-2 p-3.5 rounded-xl bg-[#14261d] text-white hover:bg-[#1c3529] transition-colors"
            >
              0
            </button>
            <button
              onClick={() => handleNumClick('.')}
              className="p-3.5 rounded-xl bg-[#14261d] text-white hover:bg-[#1c3529] transition-colors"
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className="p-3.5 rounded-xl bg-[#C8A96A] text-slate-950 hover:bg-[#d6b97d] transition-colors shadow-lg"
            >
              =
            </button>
          </div>

          {/* History Tape */}
          {historyTape.length > 0 && (
            <div className="pt-2 border-t border-[#234534] text-[11px] text-slate-400 font-mono space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Recent Calculations:</span>
              {historyTape.map((entry, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{entry}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
