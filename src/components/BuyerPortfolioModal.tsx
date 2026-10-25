'use client';

import React, { useState } from 'react';
import {
  BuyerPortfolio,
  BuyerProductItem,
  BuyerFutureReachPlan,
  BuyerInteractionLog,
} from '@/types/buyerPortfolio';
import {
  Building2,
  Package,
  Target,
  CreditCard,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  X,
  ExternalLink,
  Mail,
  Phone,
  Sparkles,
  Layers,
  MapPin,
  Globe,
  Share2,
  Sliders,
  Award,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import Image from 'next/image';

interface BuyerPortfolioModalProps {
  portfolio: BuyerPortfolio;
  onClose: () => void;
  onSavePortfolio: (updated: BuyerPortfolio) => void;
  isBdStation?: boolean;
  bdtRate?: number;
  onIssueSalesOrder?: (buyerCompany: string) => void;
  onNavigateTab?: (tab: any) => void;
}

type PortfolioTab =
  | 'PRODUCTS'
  | 'INTERESTS'
  | 'FUTURE_REACH'
  | 'FINANCIALS'
  | 'BUSINESS'
  | 'INTELLIGENCE'
  | 'EDIT_UPDATE';

export const BuyerPortfolioModal: React.FC<BuyerPortfolioModalProps> = ({
  portfolio,
  onClose,
  onSavePortfolio,
  isBdStation = false,
  bdtRate = 120,
  onIssueSalesOrder,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<PortfolioTab>('PRODUCTS');
  const [currentPortfolio, setCurrentPortfolio] = useState<BuyerPortfolio>(portfolio);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Form State for Adding / Updating Time-to-Time Data
  const [newProduct, setNewProduct] = useState<Partial<BuyerProductItem>>({
    sku: '',
    styleName: '',
    sector: 'LEATHER',
    category: 'Handbags & Totes',
    description: '',
    wholesaleFobPriceUsd: 45,
    buyerCurrency: currentPortfolio.businessPortfolio.primaryStationBranch === 'UK' ? 'GBP' : 'USD',
    buyerSalesPrice: 160,
    estimatedMarkupMultiple: 3.8,
    activeOrderUnits: 1000,
    lifetimeOrderedUnits: 1000,
    orderStatus: 'IN_PRODUCTION',
    imageUrl: '/images/marketing/leather-compendium.jpg',
  });

  const [newFuturePlan, setNewFuturePlan] = useState<Partial<BuyerFutureReachPlan>>({
    seasonOrQuarter: 'AW 2027 Capsule Collection',
    targetCategory: 'Luxury Travel Suite',
    projectedVolumeUnits: 3000,
    targetWholesaleFobUsd: 65,
    targetRetailSalesPrice: 240,
    samplingTargetDate: '2027-02-15',
    shelfLaunchDate: '2027-08-01',
    developmentStage: 'TECH_PACK_DEV',
    strategicObjective: 'Expand department presence with higher margin Bangladeshi artisan goods.',
  });

  const [newLog, setNewLog] = useState<Partial<BuyerInteractionLog>>({
    date: new Date().toISOString().split('T')[0],
    type: 'ZOOM_CALL',
    summary: '',
    attendedBy: 'Merchandising Team',
    nextFollowUpDate: '',
  });

  // Dual Currency Helper
  const formatDualPrice = (amountUsd: number, buyerCurrency?: string, buyerPrice?: number) => {
    const usdStr = `$${amountUsd.toFixed(2)} USD`;
    if (isBdStation) {
      const bdtAmount = Math.round(amountUsd * bdtRate);
      return (
        <span>
          {usdStr}{' '}
          <span className="text-emerald-800 font-semibold font-mono text-[11px]">
            (৳{bdtAmount.toLocaleString()} BDT)
          </span>
        </span>
      );
    }
    if (buyerCurrency && buyerPrice && buyerCurrency !== 'USD') {
      const symbol = buyerCurrency === 'GBP' ? '£' : buyerCurrency === 'EUR' ? '€' : 'A$';
      return (
        <span>
          {usdStr}{' '}
          <span className="text-slate-500 font-medium text-[11px]">
            ({symbol}{buyerPrice.toFixed(2)} {buyerCurrency})
          </span>
        </span>
      );
    }
    return <span>{usdStr}</span>;
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.styleName || !newProduct.sku) return;

    const item: BuyerProductItem = {
      id: `prod-${Date.now()}`,
      sku: newProduct.sku || `SKU-${Date.now()}`,
      styleName: newProduct.styleName,
      sector: newProduct.sector || 'LEATHER',
      category: newProduct.category || 'Accessories',
      description: newProduct.description || '',
      wholesaleFobPriceUsd: Number(newProduct.wholesaleFobPriceUsd) || 50,
      buyerCurrency: newProduct.buyerCurrency || 'USD',
      buyerSalesPrice: Number(newProduct.buyerSalesPrice) || 150,
      estimatedMarkupMultiple: Number(newProduct.estimatedMarkupMultiple) || 3.5,
      activeOrderUnits: Number(newProduct.activeOrderUnits) || 500,
      lifetimeOrderedUnits: Number(newProduct.lifetimeOrderedUnits) || 500,
      orderStatus: newProduct.orderStatus || 'IN_PRODUCTION',
      imageUrl: newProduct.imageUrl || '/images/marketing/leather-compendium.jpg',
      firstOrderDate: new Date().toISOString().split('T')[0],
      lastOrderDate: new Date().toISOString().split('T')[0],
    };

    const updated: BuyerPortfolio = {
      ...currentPortfolio,
      currentProducts: [item, ...currentPortfolio.currentProducts],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setCurrentPortfolio(updated);
    onSavePortfolio(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);

    // Reset new product form
    setNewProduct({
      sku: '',
      styleName: '',
      sector: 'LEATHER',
      category: 'Handbags & Totes',
      description: '',
      wholesaleFobPriceUsd: 45,
      buyerCurrency: currentPortfolio.businessPortfolio.primaryStationBranch === 'UK' ? 'GBP' : 'USD',
      buyerSalesPrice: 160,
      estimatedMarkupMultiple: 3.8,
      activeOrderUnits: 1000,
      lifetimeOrderedUnits: 1000,
      orderStatus: 'IN_PRODUCTION',
      imageUrl: '/images/marketing/leather-compendium.jpg',
    });
  };

  const handleAddFuturePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFuturePlan.seasonOrQuarter || !newFuturePlan.targetCategory) return;

    const plan: BuyerFutureReachPlan = {
      id: `fut-${Date.now()}`,
      seasonOrQuarter: newFuturePlan.seasonOrQuarter,
      targetCategory: newFuturePlan.targetCategory,
      projectedVolumeUnits: Number(newFuturePlan.projectedVolumeUnits) || 2000,
      targetWholesaleFobUsd: Number(newFuturePlan.targetWholesaleFobUsd) || 55,
      targetRetailSalesPrice: Number(newFuturePlan.targetRetailSalesPrice) || 195,
      samplingTargetDate: newFuturePlan.samplingTargetDate || '2027-03-01',
      shelfLaunchDate: newFuturePlan.shelfLaunchDate || '2027-09-01',
      developmentStage: newFuturePlan.developmentStage || 'CONCEPT',
      strategicObjective: newFuturePlan.strategicObjective || '',
    };

    const updated: BuyerPortfolio = {
      ...currentPortfolio,
      futureReachPlanning: [plan, ...currentPortfolio.futureReachPlanning],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setCurrentPortfolio(updated);
    onSavePortfolio(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.summary) return;

    const log: BuyerInteractionLog = {
      id: `log-${Date.now()}`,
      date: newLog.date || new Date().toISOString().split('T')[0],
      type: newLog.type || 'ZOOM_CALL',
      summary: newLog.summary,
      attendedBy: newLog.attendedBy || 'Merchandising Team',
      nextFollowUpDate: newLog.nextFollowUpDate,
    };

    const updated: BuyerPortfolio = {
      ...currentPortfolio,
      interactionLogs: [log, ...currentPortfolio.interactionLogs],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setCurrentPortfolio(updated);
    onSavePortfolio(updated);
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      type: 'ZOOM_CALL',
      summary: '',
      attendedBy: 'Merchandising Team',
      nextFollowUpDate: '',
    });
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Top-Right Absolute Close Button (Standard Window Position) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/40 hover:bg-black/70 text-white/90 hover:text-white border border-white/20 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
          title="Close Window (X)"
          aria-label="Close Window"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ==================================================================== */}
        {/* TOP HEADER: BRAND PROFILE & CORE STATS                               */}
        {/* ==================================================================== */}
        <div className="p-5 pr-16 border-b-[3px] border-[#C8A96A] bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#162B22] text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-[#C8A96A] text-[#1F3A2E] font-bold shadow-sm">
                  {currentPortfolio.brandCode}
                </span>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-white/20 text-emerald-100 border border-white/20">
                  {currentPortfolio.marketStation} Station Account
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  {currentPortfolio.businessPortfolio.tierClassification}
                </span>
                <span className="text-[11px] text-emerald-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#C8A96A]" />
                  Updated: {currentPortfolio.lastUpdated}
                </span>
              </div>

              <h2 className="text-2xl font-bold font-heading text-white tracking-wide flex items-center gap-2.5">
                <span>{currentPortfolio.buyerCompany}</span>
                {currentPortfolio.websiteUrl && (
                  <a
                    href={currentPortfolio.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-normal text-emerald-300 hover:text-white flex items-center gap-1 underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </h2>

              <p className="text-xs text-emerald-100/90 max-w-2xl">
                {currentPortfolio.businessPortfolio.headquarters} • Corporate Turnover:{' '}
                <strong className="text-white">{currentPortfolio.businessPortfolio.annualCorporateTurnoverUsd}</strong>
              </p>
            </div>

            {/* Quick KPI Cards in Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center min-w-[110px]">
                <span className="text-[10px] uppercase tracking-wider text-emerald-200 block">Lifetime GMV</span>
                <span className="font-mono text-sm font-bold text-white block">
                  ${(currentPortfolio.financialPortfolio.lifetimeGmvUsd / 1000).toFixed(0)}k
                </span>
                {isBdStation && (
                  <span className="text-[9px] font-mono text-emerald-300 block">
                    ৳{Math.round((currentPortfolio.financialPortfolio.lifetimeGmvUsd * bdtRate) / 100000).toFixed(1)}L
                  </span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center min-w-[110px]">
                <span className="text-[10px] uppercase tracking-wider text-emerald-200 block">Credit Limit</span>
                <span className="font-mono text-sm font-bold text-[#C8A96A] block">
                  ${(currentPortfolio.financialPortfolio.approvedCreditLimitUsd / 1000).toFixed(0)}k
                </span>
                <span className="text-[9px] font-semibold text-emerald-200 block">
                  {currentPortfolio.financialPortfolio.creditRiskRating.split(' ')[0]}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center min-w-[110px]">
                <span className="text-[10px] uppercase tracking-wider text-emerald-200 block">Wallet Share</span>
                <span className="font-mono text-sm font-bold text-emerald-300 block">
                  {currentPortfolio.competitiveIntelligence.shareOfWalletPct}%
                </span>
                <span className="text-[9px] text-slate-300 block">Ariel Sourced</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SUB-NAVIGATION BAR (5 PILLARS + INTEL + EDIT)                         */}
        {/* ==================================================================== */}
        <div className="px-5 py-2.5 border-b border-[#DDE3DD] bg-[#F8FAF8] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {[
              { id: 'PRODUCTS' as PortfolioTab, label: `A. Current Products (${currentPortfolio.currentProducts.length})`, icon: Package },
              { id: 'INTERESTS' as PortfolioTab, label: 'B. Interest Points & ESG', icon: ShieldCheck },
              { id: 'FUTURE_REACH' as PortfolioTab, label: `C. Future Target Reach (${currentPortfolio.futureReachPlanning.length})`, icon: Target },
              { id: 'FINANCIALS' as PortfolioTab, label: 'D. Financial Portfolio', icon: CreditCard },
              { id: 'BUSINESS' as PortfolioTab, label: 'E. Business Portfolio', icon: Building2 },
              { id: 'INTELLIGENCE' as PortfolioTab, label: 'Market Intel & Meetings', icon: TrendingUp },
              { id: 'EDIT_UPDATE' as PortfolioTab, label: 'Store / Update Data', icon: Edit3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#1F3A2E] text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:text-[#1F3A2E] hover:bg-slate-100 border border-[#DDE3DD]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C8A96A]' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions in Navbar */}
          <div className="flex items-center gap-2 shrink-0">
            {saveSuccessNotice && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
                <Check className="w-3 h-3" /> Saved &amp; Persisted!
              </span>
            )}

            <button
              onClick={handlePrintDossier}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#DDE3DD] hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              title="Print or Export PDF Dossier"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Dossier PDF</span>
            </button>

            {onIssueSalesOrder && (
              <button
                onClick={() => {
                  onIssueSalesOrder(currentPortfolio.buyerCompany);
                  onClose();
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#162B22] text-white text-xs font-bold shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Issue SO</span>
              </button>
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SCROLLABLE BODY CONTENT                                              */}
        {/* ==================================================================== */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FCFDFC]">
          {/* ------------------------------------------------------------------ */}
          {/* TAB 1: PILLAR A - CURRENT PRODUCTS, PICTURES & SALES PRICE         */}
          {/* ------------------------------------------------------------------ */}
          {activeTab === 'PRODUCTS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#C8A96A]" />
                    <span>A. Current Product List, Visuals &amp; Buyer Retail Pricing</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live assortment manufactured by ArielMC for {currentPortfolio.buyerCompany}, showing wholesale FOB export costs vs. buyer retail sales prices &amp; margins.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('EDIT_UPDATE')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F3A2E] text-white text-xs font-bold hover:bg-[#162B22] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>Add Product to Portfolio</span>
                </button>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentPortfolio.currentProducts.map((prod) => {
                  const currSymbol =
                    prod.buyerCurrency === 'GBP'
                      ? '£'
                      : prod.buyerCurrency === 'EUR'
                      ? '€'
                      : prod.buyerCurrency === 'AUD'
                      ? 'A$'
                      : '$';

                  return (
                    <div
                      key={prod.id}
                      className="rounded-2xl bg-white border border-[#DDE3DD] shadow-sm hover:border-[#1F3A2E]/50 transition-all overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {/* Picture / Header Visual Banner */}
                        <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-[#DDE3DD]">
                          {prod.imageUrl ? (
                            <Image
                              src={prod.imageUrl}
                              alt={prod.styleName}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">
                              <Package className="w-12 h-12" />
                            </div>
                          )}

                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#1F3A2E]/90 text-white backdrop-blur-sm">
                              {prod.sku}
                            </span>
                          </div>

                          <div className="absolute top-2 right-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm ${
                                prod.orderStatus === 'IN_PRODUCTION'
                                  ? 'bg-amber-500/90 text-white'
                                  : prod.orderStatus === 'REPEAT_PLANNED'
                                  ? 'bg-blue-600/90 text-white'
                                  : 'bg-emerald-600/90 text-white'
                              }`}
                            >
                              {prod.orderStatus.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="absolute bottom-2 left-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm">
                              {prod.category}
                            </span>
                          </div>
                        </div>

                        {/* Product Meta */}
                        <div className="p-4 space-y-3">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{prod.styleName}</h4>
                            {prod.description && (
                              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{prod.description}</p>
                            )}
                          </div>

                          {/* Commercial Price Comparison Matrix */}
                          <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 font-medium">Wholesale FOB Export Cost:</span>
                              <div className="text-right font-mono font-bold text-[#1F3A2E]">
                                {formatDualPrice(prod.wholesaleFobPriceUsd)}
                              </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
                              <span className="text-slate-500 font-medium">Buyer Retail Price (MSRP):</span>
                              <div className="text-right">
                                <span className="font-mono font-bold text-purple-900 block">
                                  {currSymbol}{prod.buyerSalesPrice.toFixed(2)} {prod.buyerCurrency}
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-700 block">
                                  {prod.estimatedMarkupMultiple}x Retail Markup
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-200 pt-1.5 text-[11px]">
                              <span className="text-slate-500">Active Order Units:</span>
                              <span className="font-mono font-semibold text-slate-800">
                                {prod.activeOrderUnits.toLocaleString()} pcs
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">Lifetime Ordered:</span>
                              <span className="font-mono font-bold text-emerald-800">
                                {prod.lifetimeOrderedUnits.toLocaleString()} pcs
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-3 border-t border-[#DDE3DD] bg-slate-50 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500">
                          Sector: <strong className="text-slate-700">{prod.sector}</strong>
                        </span>

                        {onIssueSalesOrder && (
                          <button
                            onClick={() => {
                              onIssueSalesOrder(currentPortfolio.buyerCompany);
                              onClose();
                            }}
                            className="text-xs font-bold text-[#1F3A2E] hover:text-[#C8A96A] flex items-center gap-1 transition-colors"
                          >
                            <span>Order Re-order</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* TAB 2: PILLAR B - BUYER'S INTEREST POINTS & ESG MANDATES           */}
          {/* ------------------------------------------------------------------ */}
          {activeTab === 'INTERESTS' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C8A96A]" />
                  <span>B. Buyer&apos;s Strategic Interest Points, ESG Mandates &amp; AQL Quality Thresholds</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Critical merchandising guidelines, material preferences, chemical compliance protocols, and packaging standards demanded by {currentPortfolio.buyerCompany}.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Preferred Raw Materials */}
                <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-heading">
                    <Layers className="w-4 h-4 text-emerald-700" />
                    <span>Preferred Raw Materials &amp; Substance Specs</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {currentPortfolio.interestPoints.preferredMaterials.map((mat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Sustainability & ESG Mandates */}
                <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-heading">
                    <Award className="w-4 h-4 text-[#C8A96A]" />
                    <span>Sustainability, ESG &amp; Chemical Compliance</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {currentPortfolio.interestPoints.sustainabilityMandates.map((sus, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#C8A96A] shrink-0 mt-0.5" />
                        <span>{sus}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Quality Standards (AQL) & Lead Times */}
                <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-heading">
                    <Sliders className="w-4 h-4 text-blue-700" />
                    <span>Inspection Standards &amp; Production Cycle</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block">Acceptance Quality Limit (AQL):</span>
                      <strong className="text-slate-800 text-xs mt-0.5 block">
                        {currentPortfolio.interestPoints.qualityStandardsAql}
                      </strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 font-medium block">Target Lead Time:</span>
                        <strong className="text-slate-800 text-sm font-mono mt-0.5 block">
                          {currentPortfolio.interestPoints.targetLeadTimeWeeks} Weeks (~{currentPortfolio.interestPoints.targetLeadTimeWeeks * 7} Days)
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 font-medium block">Price Elasticity:</span>
                        <strong className="text-purple-800 text-xs font-semibold mt-0.5 block">
                          {currentPortfolio.interestPoints.priceSensitivity.replace('_', ' ')}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Packaging, Branding & Design Ethos */}
                <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-heading">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Packaging, Barcoding &amp; Design Ethos</span>
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium block">Design Aesthetic:</span>
                      <p className="text-slate-800 font-medium mt-0.5">{currentPortfolio.interestPoints.designAesthetic}</p>
                    </div>

                    <div className="border-t border-slate-200 pt-2">
                      <span className="text-slate-500 font-medium block">Packaging &amp; Labeling Protocol:</span>
                      <p className="text-slate-700 mt-0.5">{currentPortfolio.interestPoints.packagingAndBranding}</p>
                    </div>

                    {currentPortfolio.interestPoints.specialRequirementsNotes && (
                      <div className="border-t border-slate-200 pt-2">
                        <span className="text-slate-500 font-medium block">Special Technical Protocol:</span>
                        <p className="text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60 mt-1">
                          {currentPortfolio.interestPoints.specialRequirementsNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* TAB 3: PILLAR C - FUTURE TARGET PRODUCT REACH PLANNING             */}
          {/* ------------------------------------------------------------------ */}
          {activeTab === 'FUTURE_REACH' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#C8A96A]" />
                    <span>C. Buyer&apos;s Future Target Product Reach Planning &amp; Seasonal Roadmaps</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Collaborative seasonal milestones, target retail reach categories, prototype development timelines &amp; target commercial FOB launch windows.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('EDIT_UPDATE')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F3A2E] text-white text-xs font-bold hover:bg-[#162B22] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>Plan New Reach Project</span>
                </button>
              </div>

              {/* Roadmaps Timeline Cards */}
              <div className="space-y-3">
                {currentPortfolio.futureReachPlanning.map((plan, idx) => (
                  <div
                    key={plan.id}
                    className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm hover:border-[#1F3A2E]/50 transition-all space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-[#1F3A2E] text-white">
                            Stage: {plan.developmentStage.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {plan.seasonOrQuarter}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 font-heading">{plan.targetCategory}</h4>
                        <p className="text-xs text-slate-600 max-w-3xl">{plan.strategicObjective}</p>
                      </div>

                      {/* Commercial Targets Pill */}
                      <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] text-right shrink-0 min-w-[200px]">
                        <span className="text-[11px] text-slate-500 block">Projected Volume:</span>
                        <strong className="font-mono text-base text-[#1F3A2E] block">
                          {plan.projectedVolumeUnits.toLocaleString()} Units
                        </strong>
                        <span className="text-[11px] text-slate-600 block">
                          Target FOB: <strong>${plan.targetWholesaleFobUsd}</strong> • Retail Target:{' '}
                          <strong>${plan.targetRetailSalesPrice}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Proto Sampling Target</span>
                          <span className="font-mono font-bold text-slate-800">{plan.samplingTargetDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Target Shelf Launch</span>
                          <span className="font-mono font-bold text-slate-800">{plan.shelfLaunchDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* TAB 4: PILLAR D - FINANCIAL PORTFOLIO                              */}
          {/* ------------------------------------------------------------------ */}
          {activeTab === 'FINANCIALS' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#C8A96A]" />
                  <span>D. Financial Portfolio, Credit Limits, Banking Credentials &amp; Receivables</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Approved financial exposure limits, trade finance payment instruments, institutional risk evaluation, and dual-currency trade analytics.
                </p>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm">
                  <span className="text-xs text-slate-500 font-medium block">Approved Credit Limit</span>
                  <span className="text-lg font-bold font-mono text-[#1F3A2E] block mt-1">
                    ${currentPortfolio.financialPortfolio.approvedCreditLimitUsd.toLocaleString()} USD
                  </span>
                  {isBdStation && (
                    <span className="text-xs font-mono font-semibold text-emerald-800 block">
                      (৳{Math.round(currentPortfolio.financialPortfolio.approvedCreditLimitUsd * bdtRate).toLocaleString()} BDT)
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm">
                  <span className="text-xs text-slate-500 font-medium block">Institutional Credit Rating</span>
                  <span className="text-lg font-bold font-mono text-emerald-700 block mt-1">
                    {currentPortfolio.financialPortfolio.creditRiskRating}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Punctuality Score: {currentPortfolio.financialPortfolio.paymentPunctualityScorePct}%
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm">
                  <span className="text-xs text-slate-500 font-medium block">Outstanding Receivables</span>
                  <span className="text-lg font-bold font-mono text-blue-800 block mt-1">
                    ${currentPortfolio.financialPortfolio.outstandingReceivablesUsd.toLocaleString()} USD
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 block">
                    Overdue: ${currentPortfolio.financialPortfolio.overdueAmountUsd} (Zero Overdue)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm">
                  <span className="text-xs text-slate-500 font-medium block">Year-To-Date Spend</span>
                  <span className="text-lg font-bold font-mono text-purple-900 block mt-1">
                    ${currentPortfolio.financialPortfolio.ytdRevenueUsd.toLocaleString()} USD
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Lifetime: ${(currentPortfolio.financialPortfolio.lifetimeGmvUsd / 1000).toFixed(0)}k USD
                  </span>
                </div>
              </div>

              {/* Banking & Terms Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 font-heading">Contractual Payment Terms &amp; Security</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block font-medium">Standard Payment Terms:</span>
                      <strong className="text-slate-800 text-sm mt-0.5 block">
                        {currentPortfolio.financialPortfolio.paymentTerms}
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block font-medium">Preferred Settlement Currency:</span>
                      <strong className="text-emerald-800 text-sm font-mono mt-0.5 block">
                        {currentPortfolio.financialPortfolio.preferredTradeCurrency} (
                        {currentPortfolio.financialPortfolio.preferredTradeCurrency === 'GBP'
                          ? 'British Pound Sterling'
                          : currentPortfolio.financialPortfolio.preferredTradeCurrency === 'EUR'
                          ? 'Euro'
                          : currentPortfolio.financialPortfolio.preferredTradeCurrency === 'AUD'
                          ? 'Australian Dollar'
                          : 'US Dollar'}
                        )
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 font-heading">Advising / Issuing Bank Credentials</h4>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium block">Buyer Bank Name:</span>
                      <strong className="text-slate-800 text-sm block mt-0.5">
                        {currentPortfolio.financialPortfolio.advisingIssuingBank}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                      <span className="text-slate-500 font-medium">SWIFT / BIC Code:</span>
                      <span className="font-mono font-bold text-[#1F3A2E] text-xs">
                        {currentPortfolio.financialPortfolio.swiftBic}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                      <span className="text-slate-500 font-medium">Settlement Reliability:</span>
                      <span className="font-semibold text-emerald-700">Top-Tier Prime Sovereign Bank</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* TAB 5: PILLAR E - BUSINESS PORTFOLIO                               */}
          {/* ------------------------------------------------------------------ */}
          {activeTab === 'BUSINESS' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#C8A96A]" />
                  <span>E. Business Portfolio, Corporate Legal Governance &amp; Buying Team</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Corporate profile, headquarters location, retail store footprint, global e-commerce distribution channels, and verified key buying decision makers.
                </p>
              </div>

              {/* Corporate Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 font-heading">Corporate Legal Profile</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Full Legal Entity:</span>
                      <strong className="text-slate-800">{currentPortfolio.businessPortfolio.legalEntityName}</strong>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Commercial Trade Name:</span>
                      <strong className="text-slate-800">{currentPortfolio.businessPortfolio.tradeName}</strong>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Established Year:</span>
                      <span className="font-mono text-slate-800">{currentPortfolio.businessPortfolio.establishedYear}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Country &amp; Jurisdiction:</span>
                      <span className="font-medium text-slate-800">{currentPortfolio.businessPortfolio.country}</span>
                    </div>

                    <div className="pt-1">
                      <span className="text-slate-500 block">Global Corporate Headquarters:</span>
                      <p className="text-slate-800 font-medium mt-0.5">
                        {currentPortfolio.businessPortfolio.headquarters}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 font-heading">Retail Footprint &amp; Digital Channels</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Physical Store Count:</span>
                      <strong className="font-mono text-slate-800">
                        {currentPortfolio.businessPortfolio.storeCount} Outlets / Department Halls
                      </strong>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Corporate Annual Turnover:</span>
                      <strong className="font-mono text-emerald-800">
                        {currentPortfolio.businessPortfolio.annualCorporateTurnoverUsd}
                      </strong>
                    </div>

                    <div className="pt-1">
                      <span className="text-slate-500 block mb-1">Global E-Commerce Platforms:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentPortfolio.businessPortfolio.eCommerceChannels.map((ch, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Buying Team Contacts */}
              <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#C8A96A]" />
                  <span>Key Procurement Decision Makers &amp; Buying Team</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentPortfolio.businessPortfolio.keyDecisionMakers.map((contact, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-2 text-xs"
                    >
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">{contact.name}</h5>
                        <p className="text-[11px] font-semibold text-emerald-800">{contact.designation}</p>
                      </div>

                      <div className="space-y-1 text-slate-600 border-t border-slate-200 pt-1.5 text-[11px]">
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <a href={`mailto:${contact.email}`} className="text-blue-700 hover:underline truncate">
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{contact.phone}</span>
                        </div>
                      </div>

                      <div className="bg-white p-2 rounded-lg border border-slate-200 text-[10px] text-slate-600">
                        <span className="font-bold text-slate-700 block">Decision Scope:</span>
                        {contact.decisionScope}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* TAB 6: MARKET INTEL, COMPETITORS & MEETING LOGS (SUGGESTIONS)      */}
          {/* ------------------------------------------------------------------ */}
          {activeTab === 'INTELLIGENCE' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#C8A96A]" />
                  <span>Competitive Intelligence, Sourcing Hubs &amp; Buyer Interaction Logs</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Tracking share of wallet against alternative global manufacturing hubs (Vietnam, Italy, India, Mexico), strategic value propositions, and historical interaction records.
                </p>
              </div>

              {/* Competitive Positioning */}
              <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-900 font-heading">ArielMC Competitive Advantage vs. Rival Sourcing Hubs</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 uppercase font-bold block">Current Ariel Share of Wallet</span>
                    <strong className="text-xl font-bold font-mono text-emerald-900 block mt-1">
                      {currentPortfolio.competitiveIntelligence.shareOfWalletPct}%
                    </strong>
                    <span className="text-[11px] text-emerald-700">Targeting 55% by AW 2027</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Primary Alternative Sourcing Countries</span>
                    <div className="flex flex-wrap gap-1.5 py-1">
                      {currentPortfolio.competitiveIntelligence.primaryAlternativeSourcingHubs.map((hub, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-white text-slate-700 font-medium text-xs border border-slate-200">
                          {hub}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      <strong>Strategic Edge:</strong> {currentPortfolio.competitiveIntelligence.strategicAdvantageOverCompetitors}
                    </p>
                  </div>
                </div>
              </div>

              {/* Meeting & Interaction Timeline */}
              <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Buyer Interaction Timeline &amp; Meeting Minutes</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('EDIT_UPDATE')}
                    className="text-xs font-bold text-[#1F3A2E] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-[#C8A96A]" />
                    <span>Log Interaction</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {currentPortfolio.interactionLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#1F3A2E] bg-white px-2 py-0.5 rounded border border-[#DDE3DD]">
                            {log.date}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            {log.type.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">Attended by: {log.attendedBy}</span>
                      </div>
                      <p className="text-slate-800">{log.summary}</p>
                      {log.nextFollowUpDate && (
                        <div className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Next Follow-up: {log.nextFollowUpDate}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Merchandising Advisory Notes */}
              {currentPortfolio.internalMerchandisingNotes && (
                <div className="rounded-2xl bg-amber-50/60 border border-amber-200/80 p-4 text-xs space-y-1">
                  <strong className="text-amber-900 flex items-center gap-1.5 font-heading text-sm">
                    <Info className="w-4 h-4 text-amber-700" />
                    <span>Internal Merchandising Advisory</span>
                  </strong>
                  <p className="text-amber-800">{currentPortfolio.internalMerchandisingNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* TAB 7: TIME-TO-TIME DATA STORAGE & UPDATE FORM                    */}
          {/* ------------------------------------------------------------------ */}
          {activeTab === 'EDIT_UPDATE' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#1F3A2E] font-heading flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#C8A96A]" />
                  <span>Time-to-Time Portfolio Data Entry &amp; Live Storage</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Add new products, plan future seasonal reach projects, update credit limits, or log new buyer meetings. Changes are saved and persisted to local database storage immediately.
                </p>
              </div>

              {/* FORM A: Add New Product */}
              <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-[#1F3A2E] flex items-center gap-2 font-heading border-b border-slate-200 pb-2">
                  <Plus className="w-4 h-4 text-[#C8A96A]" />
                  <span>A. Add New Product to Buyer Assortment</span>
                </h4>

                <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">SKU / Code *</label>
                      <input
                        type="text"
                        required
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        placeholder="e.g. AM-LTH-99"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Style Name *</label>
                      <input
                        type="text"
                        required
                        value={newProduct.styleName}
                        onChange={(e) => setNewProduct({ ...newProduct, styleName: e.target.value })}
                        placeholder="e.g. Full-Grain Heritage Satchel"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Wholesale FOB ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={newProduct.wholesaleFobPriceUsd}
                        onChange={(e) => setNewProduct({ ...newProduct, wholesaleFobPriceUsd: parseFloat(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Buyer Retail Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={newProduct.buyerSalesPrice}
                        onChange={(e) => setNewProduct({ ...newProduct, buyerSalesPrice: parseFloat(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Buyer Currency</label>
                      <select
                        value={newProduct.buyerCurrency}
                        onChange={(e) => setNewProduct({ ...newProduct, buyerCurrency: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      >
                        <option value="GBP">GBP (£)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="AUD">AUD (A$)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Order Status</label>
                      <select
                        value={newProduct.orderStatus}
                        onChange={(e) => setNewProduct({ ...newProduct, orderStatus: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      >
                        <option value="IN_PRODUCTION">IN_PRODUCTION</option>
                        <option value="REPEAT_PLANNED">REPEAT_PLANNED</option>
                        <option value="DELIVERED_STOCK">DELIVERED_STOCK</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Short Description / Specs</label>
                    <input
                      type="text"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="e.g. Vegetable-tanned cowhide with brass hardware and organic cotton lining"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span>Save Product to Portfolio</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* FORM B: Add Future Target Reach Milestone */}
              <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-[#1F3A2E] flex items-center gap-2 font-heading border-b border-slate-200 pb-2">
                  <Target className="w-4 h-4 text-[#C8A96A]" />
                  <span>C. Add Future Target Product Reach Project</span>
                </h4>

                <form onSubmit={handleAddFuturePlan} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Season / Quarter *</label>
                      <input
                        type="text"
                        required
                        value={newFuturePlan.seasonOrQuarter}
                        onChange={(e) => setNewFuturePlan({ ...newFuturePlan, seasonOrQuarter: e.target.value })}
                        placeholder="e.g. SS 2028 Eco Capsule"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Target Category *</label>
                      <input
                        type="text"
                        required
                        value={newFuturePlan.targetCategory}
                        onChange={(e) => setNewFuturePlan({ ...newFuturePlan, targetCategory: e.target.value })}
                        placeholder="e.g. Leather Folios &amp; Tech Organizers"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Projected Units</label>
                      <input
                        type="number"
                        value={newFuturePlan.projectedVolumeUnits}
                        onChange={(e) => setNewFuturePlan({ ...newFuturePlan, projectedVolumeUnits: parseInt(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Target Wholesale FOB ($)</label>
                      <input
                        type="number"
                        value={newFuturePlan.targetWholesaleFobUsd}
                        onChange={(e) => setNewFuturePlan({ ...newFuturePlan, targetWholesaleFobUsd: parseFloat(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Target Retail Price</label>
                      <input
                        type="number"
                        value={newFuturePlan.targetRetailSalesPrice}
                        onChange={(e) => setNewFuturePlan({ ...newFuturePlan, targetRetailSalesPrice: parseFloat(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Target Shelf Date</label>
                      <input
                        type="date"
                        value={newFuturePlan.shelfLaunchDate}
                        onChange={(e) => setNewFuturePlan({ ...newFuturePlan, shelfLaunchDate: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Strategic Sourcing Objective</label>
                    <input
                      type="text"
                      value={newFuturePlan.strategicObjective}
                      onChange={(e) => setNewFuturePlan({ ...newFuturePlan, strategicObjective: e.target.value })}
                      placeholder="e.g. Win floor share against rival brands with superior margins"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      <Target className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span>Record Future Reach Plan</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* FORM C: Log Interaction / Meeting */}
              <div className="rounded-2xl bg-white border border-[#DDE3DD] p-5 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-[#1F3A2E] flex items-center gap-2 font-heading border-b border-slate-200 pb-2">
                  <Clock className="w-4 h-4 text-[#C8A96A]" />
                  <span>Log Interaction, Showroom Meeting or Proto Review</span>
                </h4>

                <form onSubmit={handleAddLog} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Date</label>
                      <input
                        type="date"
                        value={newLog.date}
                        onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Interaction Type</label>
                      <select
                        value={newLog.type}
                        onChange={(e) => setNewLog({ ...newLog, type: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      >
                        <option value="SHOWROOM_VISIT">SHOWROOM_VISIT</option>
                        <option value="ZOOM_CALL">ZOOM_CALL</option>
                        <option value="PROTO_FEEDBACK">PROTO_FEEDBACK</option>
                        <option value="FACTORY_INSPECTION">FACTORY_INSPECTION</option>
                        <option value="CONTRACT_NEGOTIATION">CONTRACT_NEGOTIATION</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Next Follow-Up</label>
                      <input
                        type="date"
                        value={newLog.nextFollowUpDate}
                        onChange={(e) => setNewLog({ ...newLog, nextFollowUpDate: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] font-mono text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Meeting Notes / Summary *</label>
                    <textarea
                      required
                      rows={2}
                      value={newLog.summary}
                      onChange={(e) => setNewLog({ ...newLog, summary: e.target.value })}
                      placeholder="e.g. Buyer reviewed leather swatches, approved burgundy shade, requested 5% higher margin on volume 5,000+"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DDE3DD] text-xs focus:ring-1 focus:ring-[#1F3A2E] outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span>Append Meeting Record</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
