'use client';

import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Printer,
  Download,
  Info,
  Layers,
  ArrowRight,
  Store,
  ShoppingBag,
  Building2,
  Package,
  Truck,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { ChannelContributionSimulation } from '@/types/erp';

interface ProductPreset {
  id: string;
  name: string;
  sector: string;
  defaultPrice: number;
  defaultLandedCost: number;
  defaultFulfillment: number;
  defaultWholesalePrice: number;
  currency: 'EUR' | 'GBP' | 'USD';
  description: string;
}

const PRESETS: ProductPreset[] = [
  {
    id: 'leather-tote',
    name: 'Style 2/3 Full-Grain Leather Tote (Handbook Baseline)',
    sector: 'LEATHER',
    defaultPrice: 120.00,
    defaultLandedCost: 28.00,
    defaultFulfillment: 7.50,
    defaultWholesalePrice: 50.00,
    currency: 'EUR',
    description: 'Handbook Part 5.1 baseline: Premium cowhide tote retailing at €120 incl. 19% German VAT.',
  },
  {
    id: 'jute-shopper',
    name: 'Organic Jute-Cotton Daily Shopper (Natural/Ecru)',
    sector: 'JUTE',
    defaultPrice: 35.00,
    defaultLandedCost: 7.20,
    defaultFulfillment: 4.80,
    defaultWholesalePrice: 15.00,
    currency: 'EUR',
    description: 'High-volume eco shopper bag. Suitable for hybrid Amazon FBA drip-feeding.',
  },
  {
    id: 'selvedge-denim',
    name: 'Heritage Selvedge Denim Overshirt (14oz Raw)',
    sector: 'TEXTILE',
    defaultPrice: 110.00,
    defaultLandedCost: 24.50,
    defaultFulfillment: 6.80,
    defaultWholesalePrice: 48.00,
    currency: 'EUR',
    description: 'Woven in Chittagong from organic cotton selvedge twill with horn buttons.',
  },
  {
    id: 'ceramic-carafe',
    name: 'Artisan Terracotta & Glazed Ceramic Carafe',
    sector: 'CERAMICS',
    defaultPrice: 65.00,
    defaultLandedCost: 14.00,
    defaultFulfillment: 6.20,
    defaultWholesalePrice: 28.00,
    currency: 'EUR',
    description: 'High-fired stoneware with double-wall protection packaging for mail orders.',
  },
];

export function ChannelProfitabilitySimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('leather-tote');
  const activePreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  // Dynamic Simulator State
  const [currencySymbol, setCurrencySymbol] = useState<string>('€');
  const [grossPrice, setGrossPrice] = useState<number>(activePreset.defaultPrice);
  const [vatRate, setVatRate] = useState<number>(19); // 19% Germany, 20% UK, 0% US
  const [landedCost, setLandedCost] = useState<number>(activePreset.defaultLandedCost);
  const [fulfillmentCost, setFulfillmentCost] = useState<number>(activePreset.defaultFulfillment);
  const [wholesalePrice, setWholesalePrice] = useState<number>(activePreset.defaultWholesalePrice);
  
  // Variable Channel Expenses
  const [shopifyCac, setShopifyCac] = useState<number>(25.00); // Meta/Google Ads per unit
  const [etsyAdSpend, setEtsyAdSpend] = useState<number>(0.00); // Optional Etsy Offsite Ads

  // Monthly Multi-Channel Mix Simulation
  const [monthlyUnits, setMonthlyUnits] = useState<number>(1000);
  const [amazonShare, setAmazonShare] = useState<number>(35);
  const [etsyShare, setEtsyShare] = useState<number>(20);
  const [shopifyShare, setShopifyShare] = useState<number>(25);
  const [wholesaleShare, setWholesaleShare] = useState<number>(20);

  // Load Preset
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = PRESETS.find((item) => item.id === presetId);
    if (p) {
      setGrossPrice(p.defaultPrice);
      setLandedCost(p.defaultLandedCost);
      setFulfillmentCost(p.defaultFulfillment);
      setWholesalePrice(p.defaultWholesalePrice);
      setCurrencySymbol(p.currency === 'GBP' ? '£' : p.currency === 'USD' ? '$' : '€');
    }
  };

  // Reset to Baseline
  const handleResetToHandbookBaseline = () => {
    handleSelectPreset('leather-tote');
    setVatRate(19);
    setShopifyCac(25.00);
    setEtsyAdSpend(0.00);
  };

  // Unit Economics Calculations
  const calculations = useMemo(() => {
    // 1. VAT & Net Revenue
    const vatMultiplier = 1 + vatRate / 100;
    const netRevenueD2c = vatRate > 0 ? grossPrice / vatMultiplier : grossPrice;
    const vatAmountD2c = grossPrice - netRevenueD2c;

    // Operating margin pool before channel fees
    const remainingMarginPoolD2c = netRevenueD2c - landedCost - fulfillmentCost;

    // Wholesale is quoted ex-VAT:
    const netRevenueWholesale = wholesalePrice;
    const remainingMarginPoolWholesale = netRevenueWholesale - landedCost - (fulfillmentCost * 0.4); // B2B bulk pallet pick is cheaper per unit

    // 2. Channel Specifics
    // A. Amazon FBM
    const amzCommission = grossPrice * 0.15; // 15% referral fee
    const amzGateway = 0.00; // included
    const amzListing = 0.00;
    const amzAds = 0.00; // Organic traffic
    const amzTotalCost = amzCommission + amzGateway + amzListing + amzAds;
    const amzNetProfit = remainingMarginPoolD2c - amzTotalCost;
    const amzMarginPct = (amzNetProfit / grossPrice) * 100;

    // B. Etsy
    const etsyCommission = grossPrice * 0.065; // 6.5% transaction fee
    const etsyGateway = grossPrice * 0.04 + 0.30; // 4% + €0.30
    const etsyListing = 0.19; // $0.20 listing fee renewal
    const etsyAds = etsyAdSpend;
    const etsyTotalCost = etsyCommission + etsyGateway + etsyListing + etsyAds;
    const etsyNetProfit = remainingMarginPoolD2c - etsyTotalCost;
    const etsyMarginPct = (etsyNetProfit / grossPrice) * 100;

    // C. Shopify DTC
    const shopifyCommission = 0.00;
    const shopifyGateway = grossPrice * 0.017 + 0.25; // ~1.7% + €0.25 Shopify Payments
    const shopifyListing = 0.00;
    const shopifyAds = shopifyCac; // Customer acquisition
    const shopifyTotalCost = shopifyCommission + shopifyGateway + shopifyListing + shopifyAds;
    const shopifyNetProfit = remainingMarginPoolD2c - shopifyTotalCost;
    const shopifyMarginPct = (shopifyNetProfit / grossPrice) * 100;

    // D. B2B Wholesale
    const wsCommission = 0.00;
    const wsGateway = 0.20; // SEPA / BACS direct bank settlement per unit share
    const wsListing = 0.00;
    const wsAds = 0.00;
    const wsTotalCost = wsCommission + wsGateway + wsListing + wsAds;
    const wsNetProfit = remainingMarginPoolWholesale - wsTotalCost;
    const wsMarginPct = (wsNetProfit / wholesalePrice) * 100;

    // Breakeven CAC tolerance for Shopify before it falls below Amazon FBM profit
    const maxShopifyCacToMatchAmz = shopifyCac + (shopifyNetProfit - amzNetProfit);

    // Channels Array
    const channels: ChannelContributionSimulation[] = [
      {
        channelName: 'AMAZON_FBM',
        label: 'Amazon FBM (Seller Fulfilled)',
        grossSellingPrice: grossPrice,
        vatRatePercent: vatRate,
        vatDeduction: vatAmountD2c,
        netRevenue: netRevenueD2c,
        landedFobCost: landedCost,
        fulfillment3PlCost: fulfillmentCost,
        platformFeePercent: 15.0,
        platformFeeAmount: amzCommission,
        paymentGatewayFeePercent: 0,
        paymentGatewayFixedFee: 0,
        paymentGatewayFeeAmount: amzGateway,
        listingFeeAmount: amzListing,
        marketingCacPerUnit: amzAds,
        totalChannelCosts: amzTotalCost,
        netContributionMargin: amzNetProfit,
        contributionMarginPercent: amzMarginPct,
      },
      {
        channelName: 'ETSY',
        label: 'Etsy Marketplace',
        grossSellingPrice: grossPrice,
        vatRatePercent: vatRate,
        vatDeduction: vatAmountD2c,
        netRevenue: netRevenueD2c,
        landedFobCost: landedCost,
        fulfillment3PlCost: fulfillmentCost,
        platformFeePercent: 6.5,
        platformFeeAmount: etsyCommission,
        paymentGatewayFeePercent: 4.0,
        paymentGatewayFixedFee: 0.30,
        paymentGatewayFeeAmount: etsyGateway,
        listingFeeAmount: etsyListing,
        marketingCacPerUnit: etsyAds,
        totalChannelCosts: etsyTotalCost,
        netContributionMargin: etsyNetProfit,
        contributionMarginPercent: etsyMarginPct,
      },
      {
        channelName: 'SHOPIFY_DTC',
        label: 'Shopify D2C Brand Flagship',
        grossSellingPrice: grossPrice,
        vatRatePercent: vatRate,
        vatDeduction: vatAmountD2c,
        netRevenue: netRevenueD2c,
        landedFobCost: landedCost,
        fulfillment3PlCost: fulfillmentCost,
        platformFeePercent: 0.0,
        platformFeeAmount: shopifyCommission,
        paymentGatewayFeePercent: 1.7,
        paymentGatewayFixedFee: 0.25,
        paymentGatewayFeeAmount: shopifyGateway,
        listingFeeAmount: shopifyListing,
        marketingCacPerUnit: shopifyAds,
        totalChannelCosts: shopifyTotalCost,
        netContributionMargin: shopifyNetProfit,
        contributionMarginPercent: shopifyMarginPct,
      },
      {
        channelName: 'B2B_WHOLESALE',
        label: `B2B Wholesale (${currencySymbol}${wholesalePrice.toFixed(2)} ex-VAT)`,
        grossSellingPrice: wholesalePrice,
        vatRatePercent: 0,
        vatDeduction: 0,
        netRevenue: netRevenueWholesale,
        landedFobCost: landedCost,
        fulfillment3PlCost: fulfillmentCost * 0.4,
        platformFeePercent: 0.0,
        platformFeeAmount: wsCommission,
        paymentGatewayFeePercent: 0,
        paymentGatewayFixedFee: 0.20,
        paymentGatewayFeeAmount: wsGateway,
        listingFeeAmount: wsListing,
        marketingCacPerUnit: wsAds,
        totalChannelCosts: wsTotalCost,
        netContributionMargin: wsNetProfit,
        contributionMarginPercent: wsMarginPct,
      },
    ];

    // Monthly Portfolio Rollup
    const amzUnits = Math.round((monthlyUnits * amazonShare) / 100);
    const etsyUnits = Math.round((monthlyUnits * etsyShare) / 100);
    const shopifyUnits = Math.round((monthlyUnits * shopifyShare) / 100);
    const wsUnits = Math.round((monthlyUnits * wholesaleShare) / 100);

    const monthlyGmv =
      (amzUnits + etsyUnits + shopifyUnits) * grossPrice + wsUnits * wholesalePrice;
    const monthlyNetContribution =
      amzUnits * amzNetProfit +
      etsyUnits * etsyNetProfit +
      shopifyUnits * shopifyNetProfit +
      wsUnits * wsNetProfit;
    const blendedMargin = monthlyGmv > 0 ? (monthlyNetContribution / monthlyGmv) * 100 : 0;

    return {
      netRevenueD2c,
      vatAmountD2c,
      remainingMarginPoolD2c,
      netRevenueWholesale,
      remainingMarginPoolWholesale,
      channels,
      maxShopifyCacToMatchAmz,
      monthly: {
        amzUnits,
        etsyUnits,
        shopifyUnits,
        wsUnits,
        monthlyGmv,
        monthlyNetContribution,
        blendedMargin,
      },
    };
  }, [
    grossPrice,
    vatRate,
    landedCost,
    fulfillmentCost,
    wholesalePrice,
    shopifyCac,
    etsyAdSpend,
    monthlyUnits,
    amazonShare,
    etsyShare,
    shopifyShare,
    wholesaleShare,
    currencySymbol,
  ]);

  // Export CSV Function
  const handleExportCsv = () => {
    const headers = [
      'Channel',
      'Gross Price',
      'VAT Deduction',
      'Net Revenue',
      'Landed Product Cost',
      '3PL Outbound Fulfillment',
      'Platform Commission',
      'Payment Gateway Fee',
      'Listing Fee',
      'Marketing CAC',
      'Total Sales Cost',
      'Net Contribution Margin',
      'Contribution Margin %',
    ];

    const rows = calculations.channels.map((c) => [
      c.label,
      c.grossSellingPrice.toFixed(2),
      c.vatDeduction.toFixed(2),
      c.netRevenue.toFixed(2),
      c.landedFobCost.toFixed(2),
      c.fulfillment3PlCost.toFixed(2),
      c.platformFeeAmount.toFixed(2),
      c.paymentGatewayFeeAmount.toFixed(2),
      c.listingFeeAmount.toFixed(2),
      c.marketingCacPerUnit.toFixed(2),
      c.totalChannelCosts.toFixed(2),
      c.netContributionMargin.toFixed(2),
      `${c.contributionMarginPercent.toFixed(1)}%`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `arielmc-channel-profitability-${selectedPresetId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#1e3a8a] text-white shadow-xl relative overflow-hidden border border-slate-700">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                Operational Handbook Part 5
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5" />
                Unit Margin Optimizer
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Channel Contribution &amp; Per-Unit Profitability Simulator
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Mathematical financial comparison across <strong>Amazon FBM</strong>, <strong>Etsy</strong>, <strong>Shopify D2C</strong>, 
              and <strong>B2B Wholesale</strong>. Accounts for VAT regimes, landed ocean freight, 3PL outbound pick &amp; pack, platform commissions, and ad CAC.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              onClick={handleResetToHandbookBaseline}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Part 5.1 Baseline
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export Scenario CSV
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600 transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print P&amp;L
            </button>
          </div>
        </div>

        {/* Dynamic Formula Callout */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] block">Gross Retail Price</span>
            <span className="text-lg font-bold text-white font-mono">{currencySymbol}{grossPrice.toFixed(2)}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">incl. {vatRate}% VAT</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] block">Net Revenue</span>
            <span className="text-lg font-bold text-blue-300 font-mono">{currencySymbol}{calculations.netRevenueD2c.toFixed(2)}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">VAT: -{currencySymbol}{calculations.vatAmountD2c.toFixed(2)}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] block">Landed + 3PL Fulfillment</span>
            <span className="text-lg font-bold text-amber-300 font-mono">-{currencySymbol}{(landedCost + fulfillmentCost).toFixed(2)}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">FOB: {currencySymbol}{landedCost} • 3PL: {currencySymbol}{fulfillmentCost}</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
            <span className="text-emerald-300 uppercase tracking-wider text-[10px] block">Operating Margin Pool</span>
            <span className="text-lg font-bold text-emerald-300 font-mono">{currencySymbol}{calculations.remainingMarginPoolD2c.toFixed(2)}</span>
            <span className="text-[11px] text-emerald-200/80 block mt-0.5">Before Channel Fees &amp; Ads</span>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-500 uppercase tracking-wider mr-1 text-[11px]">
          Product Baseline:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p.id)}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-2 ${
              selectedPresetId === p.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{p.name.split('(')[0]}</span>
            <span className="text-[10px] font-mono opacity-80">
              ({currencySymbol}{p.defaultPrice})
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Control Sliders */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Unit Cost &amp; Price Modeling Controls
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Slide parameters to dynamically observe real-time channel margin shifts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {/* 1. Gross Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Retail Price:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">
                {currencySymbol}{grossPrice.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={250}
              step={1}
              value={grossPrice}
              onChange={(e) => setGrossPrice(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>{currencySymbol}20</span>
              <span>{currencySymbol}250</span>
            </div>
          </div>

          {/* 2. VAT Regime */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">VAT Rate:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">{vatRate}%</span>
            </div>
            <select
              value={vatRate}
              onChange={(e) => setVatRate(Number(e.target.value))}
              className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value={19}>19% (Germany / EU)</option>
              <option value={20}>20% (UK Standard)</option>
              <option value={21}>21% (Netherlands)</option>
              <option value={0}>0% (US Sales Tax Ex-VAT)</option>
            </select>
            <div className="text-[10px] text-slate-400">
              Net: {currencySymbol}{calculations.netRevenueD2c.toFixed(2)}
            </div>
          </div>

          {/* 3. Landed Product Cost */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Landed Cost (FOB+Ocean):</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">
                {currencySymbol}{landedCost.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={80}
              step={0.5}
              value={landedCost}
              onChange={(e) => setLandedCost(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>{currencySymbol}5</span>
              <span>{currencySymbol}80</span>
            </div>
          </div>

          {/* 4. 3PL Outbound Fulfillment */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">3PL Pick/Pack/Courier:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">
                {currencySymbol}{fulfillmentCost.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              step={0.25}
              value={fulfillmentCost}
              onChange={(e) => setFulfillmentCost(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>{currencySymbol}3</span>
              <span>{currencySymbol}15</span>
            </div>
          </div>

          {/* 5. Shopify Ad CAC */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Shopify Ad CAC:</span>
              <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {currencySymbol}{shopifyCac.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={1}
              value={shopifyCac}
              onChange={(e) => setShopifyCac(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>{currencySymbol}0 (Organic)</span>
              <span>{currencySymbol}60 (Paid)</span>
            </div>
          </div>

          {/* 6. Wholesale Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">B2B Wholesale Price:</span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {currencySymbol}{wholesalePrice.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={120}
              step={1}
              value={wholesalePrice}
              onChange={(e) => setWholesalePrice(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>{currencySymbol}10</span>
              <span>{currencySymbol}120</span>
            </div>
          </div>
        </div>
      </div>

      {/* SIDE-BY-SIDE 4-CHANNEL CONTRIBUTION MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {calculations.channels.map((ch, idx) => {
          const isHighest = Math.max(...calculations.channels.map((c) => c.netContributionMargin)) === ch.netContributionMargin;
          const isAmz = ch.channelName === 'AMAZON_FBM';
          const isEtsy = ch.channelName === 'ETSY';
          const isShopify = ch.channelName === 'SHOPIFY_DTC';
          const isWholesale = ch.channelName === 'B2B_WHOLESALE';

          return (
            <div
              key={ch.channelName}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all relative flex flex-col justify-between shadow-sm ${
                isHighest
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-500/80 shadow-emerald-500/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {isHighest && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                  Highest Per-Unit Margin
                </div>
              )}

              <div className="space-y-4">
                {/* Channel Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {isAmz && <Store className="w-5 h-5 text-amber-500" />}
                    {isEtsy && <ShoppingBag className="w-5 h-5 text-orange-500" />}
                    {isShopify && <Layers className="w-5 h-5 text-indigo-500" />}
                    {isWholesale && <Building2 className="w-5 h-5 text-emerald-500" />}
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {ch.label.split('(')[0]}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {isWholesale ? 'Ex-VAT Wholesale' : `Incl. ${vatRate}% VAT`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Contribution Profit Highlight */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Net Contribution Profit
                  </span>
                  <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {currencySymbol}{ch.netContributionMargin.toFixed(2)}
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-block mt-1">
                    ~{ch.contributionMarginPercent.toFixed(1)}% of Revenue
                  </span>
                </div>

                {/* Itemized P&L Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Gross Order Value:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      {currencySymbol}{ch.grossSellingPrice.toFixed(2)}
                    </span>
                  </div>

                  {ch.vatDeduction > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-500">
                      <span>Less VAT ({ch.vatRatePercent}%):</span>
                      <span className="font-mono text-rose-500">
                        -{currencySymbol}{ch.vatDeduction.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-500">
                    <span>Landed Cost (FOB):</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      -{currencySymbol}{ch.landedFobCost.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-500">
                    <span>3PL Outbound Pick/Courier:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      -{currencySymbol}{ch.fulfillment3PlCost.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-500">
                    <span>Platform Commission:</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">
                      {ch.platformFeeAmount > 0
                        ? `-${currencySymbol}${ch.platformFeeAmount.toFixed(2)} (${ch.platformFeePercent}%)`
                        : `${currencySymbol}0.00`}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-500">
                    <span>Payment Gateway:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {ch.paymentGatewayFeeAmount > 0
                        ? `-${currencySymbol}${ch.paymentGatewayFeeAmount.toFixed(2)}`
                        : `${currencySymbol}0.00 (incl)`}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-500">
                    <span>Marketing / Ad CAC:</span>
                    <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {ch.marketingCacPerUnit > 0
                        ? `-${currencySymbol}${ch.marketingCacPerUnit.toFixed(2)}`
                        : `${currencySymbol}0.00 (organic)`}
                    </span>
                  </div>

                  <div className="flex justify-between pt-1 font-bold text-slate-900 dark:text-white">
                    <span>Total Channel Costs:</span>
                    <span className="font-mono text-rose-600 dark:text-rose-400">
                      -{currencySymbol}{ch.totalChannelCosts.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Insight Tag */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                {isAmz && (
                  <span>
                    💡 <strong>FBM Protection:</strong> Eliminates Amazon warehouse damage and return liquidations on high-end leather.
                  </span>
                )}
                {isEtsy && (
                  <span>
                    💡 <strong>Artisan Appeal:</strong> 43.5% margin driven by low 6.5% commission and strong organic leather demand.
                  </span>
                )}
                {isShopify && (
                  <span>
                    💡 <strong>CAC Tolerance:</strong> Profitable up to {currencySymbol}{calculations.maxShopifyCacToMatchAmz.toFixed(2)} CAC before Amz FBM yields higher net cash.
                  </span>
                )}
                {isWholesale && (
                  <span>
                    💡 <strong>Volume Velocity:</strong> Lower absolute per-unit margin compensated by zero ad CAC and 300+ unit order size.
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MONTHLY MULTI-CHANNEL VOLUME SIMULATOR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Monthly Multi-Channel Portfolio Revenue &amp; Net Contribution Rollup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Simulate blended company margin when distributing monthly production across all 4 channels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Monthly Production Volume</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {monthlyUnits.toLocaleString()} units
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={5000}
              step={100}
              value={monthlyUnits}
              onChange={(e) => setMonthlyUnits(Number(e.target.value))}
              className="w-32 accent-blue-600"
            />
          </div>
        </div>

        {/* Channel Mix Sliders */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-1.5">
            <div className="flex justify-between font-semibold text-amber-900 dark:text-amber-200">
              <span>Amazon FBM:</span>
              <span className="font-mono">{amazonShare}% ({calculations.monthly.amzUnits} pcs)</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={amazonShare}
              onChange={(e) => setAmazonShare(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/60 space-y-1.5">
            <div className="flex justify-between font-semibold text-orange-900 dark:text-orange-200">
              <span>Etsy:</span>
              <span className="font-mono">{etsyShare}% ({calculations.monthly.etsyUnits} pcs)</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={etsyShare}
              onChange={(e) => setEtsyShare(Number(e.target.value))}
              className="w-full accent-orange-600"
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 space-y-1.5">
            <div className="flex justify-between font-semibold text-indigo-900 dark:text-indigo-200">
              <span>Shopify D2C:</span>
              <span className="font-mono">{shopifyShare}% ({calculations.monthly.shopifyUnits} pcs)</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={shopifyShare}
              onChange={(e) => setShopifyShare(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-1.5">
            <div className="flex justify-between font-semibold text-emerald-900 dark:text-emerald-200">
              <span>B2B Wholesale:</span>
              <span className="font-mono">{wholesaleShare}% ({calculations.monthly.wsUnits} pcs)</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={wholesaleShare}
              onChange={(e) => setWholesaleShare(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>

        {/* Monthly Projection KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Projected Monthly Gross GMV
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
              {currencySymbol}{calculations.monthly.monthlyGmv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Across all 4 retail &amp; trade channels
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-bold">
              Total Monthly Net Contribution Profit
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {currencySymbol}{calculations.monthly.monthlyNetContribution.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 block">
              Retained cash after all 3PL, ads, and platform commissions
            </span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <span className="text-[11px] uppercase tracking-wider text-blue-700 dark:text-blue-300 font-bold">
              Blended Portfolio Contribution Margin
            </span>
            <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
              {calculations.monthly.blendedMargin.toFixed(1)}%
            </div>
            <span className="text-xs text-blue-700 dark:text-blue-300 mt-1 block">
              Exceeds 25%–30% sovereign ERP corporate hurdle rate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
