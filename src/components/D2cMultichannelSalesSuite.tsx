'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  D2cPlatformType,
  D2cRegion,
  D2cSalesPoint,
  D2cSaleOrder,
  D2cSaleOrderItem,
  D2cChannelSummary
} from '@/types/d2cSales';
import { CurrencyCode, ProductSector } from '@/types/erp';
import { ArielMC } from '@/lib/brand';
import {
  fetchD2cSalesPoints,
  persistD2cSalesPoints,
  fetchD2cSaleOrders,
  persistD2cSaleOrders
} from '@/lib/erpPersistence';
import {
  ShoppingCart,
  Store,
  Globe2,
  Package,
  TrendingUp,
  DollarSign,
  Filter,
  Search,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Sparkles,
  X,
  AlertTriangle,
  RefreshCw,
  Building2,
  Percent,
  Check,
  Star,
  Layers,
  BarChart3,
  FileSpreadsheet,
  HelpCircle,
  Eye,
  Info
} from 'lucide-react';

interface D2cMultichannelSalesSuiteProps {
  isBdStation?: boolean;
  bdtRate?: number;
  onNavigateToInventory?: () => void;
}

type MainSuiteTab = 'TRACKER' | 'SALES_POINTS' | 'REPORT';

const PLATFORM_CONFIG: Record<
  D2cPlatformType,
  { label: string; color: string; bg: string; border: string; badge: string; icon: string }
> = {
  AMAZON_FBA: {
    label: 'Amazon US (FBA Prime)',
    color: 'text-amber-400',
    bg: 'bg-amber-950/30',
    border: 'border-amber-500/40',
    badge: 'bg-[#FF9900]/20 text-[#FF9900] border-[#FF9900]/40',
    icon: '📦 Prime FBA',
  },
  AMAZON_FBM: {
    label: 'Amazon UK (FBM Merchant)',
    color: 'text-orange-400',
    bg: 'bg-orange-950/30',
    border: 'border-orange-500/40',
    badge: 'bg-[#FF9900]/15 text-[#FF9900] border-[#FF9900]/30',
    icon: '🚚 Amazon FBM',
  },
  SHOPIFY: {
    label: 'Shopify Flagship Store',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/30',
    border: 'border-emerald-500/40',
    badge: 'bg-[#96BF48]/20 text-[#96BF48] border-[#96BF48]/40',
    icon: '🛍️ Shopify Online',
  },
  ETSY: {
    label: 'Etsy Artisan Studio',
    color: 'text-rose-400',
    bg: 'bg-rose-950/30',
    border: 'border-rose-500/40',
    badge: 'bg-[#F16521]/20 text-[#F16521] border-[#F16521]/40',
    icon: '✨ Etsy Handmade',
  },
  TIKTOK_SHOP: {
    label: 'TikTok Shop Live',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/30',
    border: 'border-cyan-500/40',
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    icon: '📱 TikTok Shop',
  },
  EBAY: {
    label: 'eBay Global Store',
    color: 'text-blue-400',
    bg: 'bg-blue-950/30',
    border: 'border-blue-500/40',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    icon: '🏷️ eBay Direct',
  },
  RETAIL_STORE: {
    label: 'Physical Brand Showroom',
    color: 'text-teal-400',
    bg: 'bg-teal-950/30',
    border: 'border-teal-500/40',
    badge: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
    icon: '🏬 Retail Showroom',
  },
};

export const D2cMultichannelSalesSuite: React.FC<D2cMultichannelSalesSuiteProps> = ({
  isBdStation = true,
  bdtRate = 120,
  onNavigateToInventory,
}) => {
  // 1. Data States
  const [salesPoints, setSalesPoints] = useState<D2cSalesPoint[]>([]);
  const [orders, setOrders] = useState<D2cSaleOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<MainSuiteTab>('TRACKER');

  // 3. Filter & Search States (Order Tracker)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState<'ALL' | '7D' | '30D'>('ALL');

  // 4. Modals State
  const [isSalesPointModalOpen, setIsSalesPointModalOpen] = useState(false);
  const [editingSalesPoint, setEditingSalesPoint] = useState<D2cSalesPoint | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [salesPointToDelete, setSalesPointToDelete] = useState<D2cSalesPoint | null>(null);

  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<D2cSaleOrder | null>(null);

  // Notice & Sync state
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Form State for Sales Point Add / Edit
  const [spForm, setSpForm] = useState<Partial<D2cSalesPoint>>({
    name: '',
    platform: 'AMAZON_FBA',
    storeUrl: '',
    region: 'US',
    currency: 'USD',
    feePercentage: 15.0,
    fixedFeePerOrder: 0.0,
    fbaPickPackFeePerUnit: 4.85,
    status: 'ACTIVE',
    syncStatus: 'LIVE_CONNECTED',
    description: '',
  });

  // Form State for Manual Order Intake
  const [orderForm, setOrderForm] = useState({
    salesPointId: '',
    orderNumber: '',
    customerName: '',
    customerEmail: '',
    customerCountry: 'United States',
    shippingCity: 'New York, NY',
    sku: 'AMC-LT2-LEA-BUR-SGL',
    styleName: 'Style 2 Full Leather Tote - Burgundy',
    quantity: 1,
    unitPrice: 185,
    currency: 'USD' as CurrencyCode,
    fulfillmentMethod: 'FBA' as const,
    orderStatus: 'DELIVERED' as const,
    notes: '',
  });

  // Load from local storage / initial data
  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchD2cSalesPoints(), fetchD2cSaleOrders()]).then(([pts, ords]) => {
      if (isMounted) {
        setSalesPoints(pts);
        setOrders(ords);
        if (pts.length > 0 && !orderForm.salesPointId) {
          setOrderForm((prev) => ({ ...prev, salesPointId: pts[0].id }));
        }
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const triggerNotice = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  // --------------------------------------------------------------------------
  // COMPUTED METRICS & CHANNEL SUMMARIES
  // --------------------------------------------------------------------------
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Platform filter
      if (selectedPlatformFilter !== 'ALL' && order.platform !== selectedPlatformFilter) {
        return false;
      }
      // Status filter
      if (selectedStatusFilter !== 'ALL' && order.orderStatus !== selectedStatusFilter) {
        return false;
      }
      // Search query (order #, customer name, sku, city)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesOrder = order.orderNumber.toLowerCase().includes(q);
        const matchesCust = order.customerName.toLowerCase().includes(q);
        const matchesCity = order.shippingCity?.toLowerCase().includes(q) || false;
        const matchesSku = order.items.some(
          (i) => i.sku.toLowerCase().includes(q) || i.styleName.toLowerCase().includes(q)
        );
        if (!matchesOrder && !matchesCust && !matchesCity && !matchesSku) {
          return false;
        }
      }
      return true;
    });
  }, [orders, selectedPlatformFilter, selectedStatusFilter, searchQuery]);

  const summaryKpis = useMemo(() => {
    const totalOrdersCount = orders.length;
    const totalUnitsSold = orders.reduce((acc, o) => acc + o.totalQuantity, 0);
    const grossRevenueUsd = orders.reduce((acc, o) => acc + o.grossAmountUsd, 0);
    const totalPlatformFeesUsd = orders.reduce((acc, o) => acc + o.platformFeesUsd, 0);
    const netPayoutUsd = orders.reduce((acc, o) => acc + o.netPayoutUsd, 0);
    const averageOrderValueUsd = totalOrdersCount > 0 ? grossRevenueUsd / totalOrdersCount : 0;
    const returnCount = orders.filter((o) => o.orderStatus === 'RETURNED').length;
    const returnRatePct = totalOrdersCount > 0 ? (returnCount / totalOrdersCount) * 100 : 0;

    return {
      totalOrdersCount,
      totalUnitsSold,
      grossRevenueUsd,
      totalPlatformFeesUsd,
      netPayoutUsd,
      averageOrderValueUsd,
      returnCount,
      returnRatePct,
    };
  }, [orders]);

  const channelSummaries: D2cChannelSummary[] = useMemo(() => {
    return salesPoints.map((sp) => {
      const spOrders = orders.filter((o) => o.salesPointId === sp.id || o.platform === sp.platform);
      const totalOrders = spOrders.length;
      const totalUnitsSold = spOrders.reduce((acc, o) => acc + o.totalQuantity, 0);
      const grossRevenueUsd = spOrders.reduce((acc, o) => acc + o.grossAmountUsd, 0);
      const totalFeesUsd = spOrders.reduce((acc, o) => acc + o.platformFeesUsd, 0);
      const netPayoutUsd = spOrders.reduce((acc, o) => acc + o.netPayoutUsd, 0);
      const averageOrderValueUsd = totalOrders > 0 ? grossRevenueUsd / totalOrders : 0;
      const returnCount = spOrders.filter((o) => o.orderStatus === 'RETURNED').length;
      const returnRatePct = totalOrders > 0 ? (returnCount / totalOrders) * 100 : 0;

      return {
        platform: sp.platform,
        salesPointName: sp.name,
        totalOrders,
        totalUnitsSold,
        grossRevenueUsd,
        totalFeesUsd,
        netPayoutUsd,
        averageOrderValueUsd,
        returnCount,
        returnRatePct,
      };
    });
  }, [salesPoints, orders]);

  // Top SKUs breakdown
  const topSkus = useMemo(() => {
    const skuMap: Record<string, { sku: string; styleName: string; units: number; revenueUsd: number }> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        if (!skuMap[item.sku]) {
          skuMap[item.sku] = {
            sku: item.sku,
            styleName: item.styleName,
            units: 0,
            revenueUsd: 0,
          };
        }
        skuMap[item.sku].units += item.quantity;
        skuMap[item.sku].revenueUsd += item.totalPrice;
      });
    });
    return Object.values(skuMap).sort((a, b) => b.units - a.units).slice(0, 5);
  }, [orders]);

  // --------------------------------------------------------------------------
  // SALES POINT CRUD OPERATIONS
  // --------------------------------------------------------------------------
  const handleOpenAddSalesPoint = () => {
    setEditingSalesPoint(null);
    setSpForm({
      name: '',
      platform: 'AMAZON_FBA',
      storeUrl: '',
      region: 'US',
      currency: 'USD',
      feePercentage: 15.0,
      fixedFeePerOrder: 0.0,
      fbaPickPackFeePerUnit: 4.85,
      status: 'ACTIVE',
      syncStatus: 'LIVE_CONNECTED',
      description: '',
    });
    setIsSalesPointModalOpen(true);
  };

  const handleOpenEditSalesPoint = (sp: D2cSalesPoint) => {
    setEditingSalesPoint(sp);
    setSpForm({ ...sp });
    setIsSalesPointModalOpen(true);
  };

  const handleSaveSalesPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spForm.name || !spForm.platform) return;

    if (editingSalesPoint) {
      // Edit mode
      const updated = salesPoints.map((item) =>
        item.id === editingSalesPoint.id
          ? ({
              ...item,
              ...spForm,
              lastSyncedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            } as D2cSalesPoint)
          : item
      );
      setSalesPoints(updated);
      persistD2cSalesPoints(updated);
      triggerNotice(`Successfully updated sales point "${spForm.name}".`);
    } else {
      // Add mode
      const newSp: D2cSalesPoint = {
        id: `sp-${Date.now()}`,
        name: spForm.name || 'New Marketplace Channel',
        platform: spForm.platform || 'SHOPIFY',
        storeUrl: spForm.storeUrl || '',
        region: spForm.region || 'GLOBAL',
        currency: spForm.currency || 'USD',
        feePercentage: Number(spForm.feePercentage) || 0,
        fixedFeePerOrder: Number(spForm.fixedFeePerOrder) || 0,
        fbaPickPackFeePerUnit: Number(spForm.fbaPickPackFeePerUnit) || 0,
        status: spForm.status || 'ACTIVE',
        syncStatus: spForm.syncStatus || 'LIVE_CONNECTED',
        lastSyncedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        description: spForm.description || '',
        createdDate: new Date().toISOString().split('T')[0],
      };
      const updated = [...salesPoints, newSp];
      setSalesPoints(updated);
      persistD2cSalesPoints(updated);
      triggerNotice(`Created new B2C sales channel "${newSp.name}".`);
    }

    setIsSalesPointModalOpen(false);
  };

  const handleConfirmDeleteSalesPoint = () => {
    if (!salesPointToDelete) return;
    const updated = salesPoints.filter((s) => s.id !== salesPointToDelete.id);
    setSalesPoints(updated);
    persistD2cSalesPoints(updated);
    triggerNotice(`Removed sales point "${salesPointToDelete.name}".`);
    setIsDeleteModalOpen(false);
    setSalesPointToDelete(null);
  };

  // --------------------------------------------------------------------------
  // MANUAL ORDER CREATION
  // --------------------------------------------------------------------------
  const handleSaveManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = salesPoints.find((s) => s.id === orderForm.salesPointId) || salesPoints[0];
    const grossAmount = orderForm.unitPrice * orderForm.quantity;
    const grossAmountUsd = grossAmount; // assuming USD for simplicity or 1:1

    // Fee calculation based on sales point
    const referralFee = (grossAmountUsd * (sp?.feePercentage || 10)) / 100;
    const fixedFee = sp?.fixedFeePerOrder || 0;
    const fbaFee = (sp?.fbaPickPackFeePerUnit || 0) * orderForm.quantity;
    const platformFeesUsd = Math.round((referralFee + fixedFee + fbaFee) * 100) / 100;
    const netPayoutUsd = Math.round((grossAmountUsd - platformFeesUsd) * 100) / 100;

    const newOrder: D2cSaleOrder = {
      id: `d2c-${Date.now()}`,
      orderNumber:
        orderForm.orderNumber ||
        `${sp.platform.slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`,
      salesPointId: sp.id,
      salesPointName: sp.name,
      platform: sp.platform,
      orderDate: new Date().toISOString().split('T')[0],
      orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: orderForm.customerName || 'Anonymous Collector',
      customerEmail: orderForm.customerEmail || 'orders@arielmc.com',
      customerCountry: orderForm.customerCountry,
      shippingCity: orderForm.shippingCity,
      items: [
        {
          sku: orderForm.sku,
          styleName: orderForm.styleName,
          quantity: orderForm.quantity,
          unitPrice: orderForm.unitPrice,
          currency: orderForm.currency,
          totalPrice: grossAmount,
        },
      ],
      totalQuantity: orderForm.quantity,
      currency: orderForm.currency,
      grossAmount,
      grossAmountUsd,
      platformFeesUsd,
      shippingFeeUsd: 0,
      taxAmountUsd: 0,
      netPayoutUsd,
      fulfillmentMethod: orderForm.fulfillmentMethod,
      orderStatus: orderForm.orderStatus,
      notes: orderForm.notes || 'Manually recorded B2C order.',
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    persistD2cSaleOrders(updated);
    triggerNotice(`Order #${newOrder.orderNumber} successfully logged.`);
    setIsCreateOrderModalOpen(false);
  };

  // --------------------------------------------------------------------------
  // SIMULATE MULTICHANNEL WEBHOOK SYNC
  // --------------------------------------------------------------------------
  const handleSyncMarketplaces = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const updatedPts = salesPoints.map((s) => ({ ...s, lastSyncedAt: now }));
      setSalesPoints(updatedPts);
      persistD2cSalesPoints(updatedPts);
      setIsSyncing(false);
      triggerNotice('Marketplace Webhooks Synced: Amazon FBA/FBM, Shopify & Etsy up to date!');
    }, 1200);
  };

  // --------------------------------------------------------------------------
  // EXPORT CSV
  // --------------------------------------------------------------------------
  const handleExportCsv = () => {
    const headers = [
      'Order Number',
      'Platform',
      'Sales Point',
      'Date',
      'Customer',
      'Country',
      'SKU',
      'Quantity',
      'Gross USD',
      'Platform Fees USD',
      'Net Payout USD',
      'Status',
      'Fulfillment',
    ];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.platform,
      `"${o.salesPointName}"`,
      o.orderDate,
      `"${o.customerName}"`,
      `"${o.customerCountry}"`,
      o.items.map((i) => i.sku).join('; '),
      o.totalQuantity,
      o.grossAmountUsd,
      o.platformFeesUsd,
      o.netPayoutUsd,
      o.orderStatus,
      o.fulfillmentMethod,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ArielMC_ECom_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotice('Downloaded E-Com Sales Ledger CSV.');
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ==================================================================== */}
      {/* TOP NOTIFICATION TOAST                                               */}
      {/* ==================================================================== */}
      {noticeMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#12231B] text-emerald-300 border border-emerald-500/50 shadow-2xl animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{noticeMessage}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* EXECUTIVE HEADER: TITLE & TOP ACTIONS                                */}
      {/* ==================================================================== */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#12231B] via-[#1F3A2E] to-[#12231B] text-white border-2 border-[#2C5240] shadow-xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A96A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-[#C8A96A] text-[#12231B] font-bold shadow-sm">
                MULTICHANNEL E-COM SALES
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                Amazon FBA/FBM • Shopify • Etsy
              </span>
              {isBdStation && (
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-white/10 text-emerald-100 border border-white/20">
                  Dual Currency: USD + BDT (৳{bdtRate}/$)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-wide flex items-center gap-2">
              <ArielMC className="text-[#C8A96A]" />
              <span>Multichannel E-Com Sales Operations</span>
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
              Real-time consumer sales tracking across global e-commerce storefronts, marketplace
              settlements, Amazon Prime FBA logistics, Shopify payments, and Etsy handmade crafts.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleSyncMarketplaces}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition cursor-pointer active:scale-95 disabled:opacity-50"
              title="Poll marketplace webhooks and refresh settlements"
            >
              <RefreshCw className={`w-4 h-4 text-[#C8A96A] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Marketplaces'}</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition cursor-pointer active:scale-95"
              title="Export complete order ledger to CSV"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrintReport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#d4b576] text-[#12231B] text-xs font-bold font-heading shadow-md transition cursor-pointer active:scale-95"
              title="Print executive performance and profitability dossier"
            >
              <Printer className="w-4 h-4 text-[#12231B]" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* QUICK PERFORMANCE KPI TILES                                        */}
        {/* ================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-200 block">
              Gross Sales (GMV)
            </span>
            <span className="font-mono text-base font-bold text-white block mt-0.5">
              ${summaryKpis.grossRevenueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {isBdStation && (
              <span className="font-mono text-[10px] text-emerald-300 block">
                ৳{Math.round(summaryKpis.grossRevenueUsd * bdtRate).toLocaleString()}
              </span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-200 block">
              Units Sold
            </span>
            <span className="font-mono text-base font-bold text-[#C8A96A] block mt-0.5">
              {summaryKpis.totalUnitsSold.toLocaleString()} Pcs
            </span>
            <span className="text-[10px] text-slate-300 block">
              Across {summaryKpis.totalOrdersCount} Orders
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-200 block">
              Platform Fees Paid
            </span>
            <span className="font-mono text-base font-bold text-amber-300 block mt-0.5">
              ${summaryKpis.totalPlatformFeesUsd.toFixed(2)}
            </span>
            <span className="text-[10px] text-amber-200/80 block">
              {summaryKpis.grossRevenueUsd > 0
                ? ((summaryKpis.totalPlatformFeesUsd / summaryKpis.grossRevenueUsd) * 100).toFixed(1)
                : 0}
              % effective rate
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-200 block">
              Net Payout Disbursed
            </span>
            <span className="font-mono text-base font-bold text-emerald-400 block mt-0.5">
              ${summaryKpis.netPayoutUsd.toFixed(2)}
            </span>
            {isBdStation && (
              <span className="font-mono text-[10px] text-emerald-300 block">
                ৳{Math.round(summaryKpis.netPayoutUsd * bdtRate).toLocaleString()}
              </span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-200 block">
              Average Order Value
            </span>
            <span className="font-mono text-base font-bold text-white block mt-0.5">
              ${summaryKpis.averageOrderValueUsd.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-300 block">Per checkout</span>
          </div>

          <div className="p-3 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-200 block">
              Return Rate
            </span>
            <span className="font-mono text-base font-bold text-emerald-300 block mt-0.5">
              {summaryKpis.returnRatePct.toFixed(1)}%
            </span>
            <span className="text-[10px] text-emerald-200/70 block">
              {summaryKpis.returnCount} returns logged
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3 CORE PILLARS TAB STRIP                                             */}
      {/* ==================================================================== */}
      <div className="flex items-center justify-between border-b border-[#DDE3DD] bg-white p-2 rounded-xl shadow-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab('TRACKER')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-heading transition-all cursor-pointer ${
              activeTab === 'TRACKER'
                ? 'bg-[#1F3A2E] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-[#C8A96A]" />
            <span>1. E-Com Sales Tracker ({orders.length} Orders)</span>
          </button>

          <button
            onClick={() => setActiveTab('SALES_POINTS')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-heading transition-all cursor-pointer ${
              activeTab === 'SALES_POINTS'
                ? 'bg-[#1F3A2E] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Store className="w-4 h-4 text-[#C8A96A]" />
            <span>2. Modify Sales Points ({salesPoints.length} Channels)</span>
          </button>

          <button
            onClick={() => setActiveTab('REPORT')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-heading transition-all cursor-pointer ${
              activeTab === 'REPORT'
                ? 'bg-[#1F3A2E] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#C8A96A]" />
            <span>3. Executive Performance &amp; Profitability Report</span>
          </button>
        </div>

        {activeTab === 'TRACKER' && (
          <button
            onClick={() => setIsCreateOrderModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F3A2E] hover:bg-[#162B22] text-[#C8A96A] text-xs font-bold border border-[#C8A96A]/40 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record B2C Order</span>
          </button>
        )}

        {activeTab === 'SALES_POINTS' && (
          <button
            onClick={handleOpenAddSalesPoint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C8A96A] hover:bg-[#b89552] text-[#12231B] text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sales Point</span>
          </button>
        )}
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: B2C / D2C SALES TRACKER LEDGER                                */}
      {/* ==================================================================== */}
      {activeTab === 'TRACKER' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="p-4 bg-white rounded-xl border border-[#DDE3DD] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by order #, customer, SKU, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#1F3A2E]"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Channel filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                <span className="text-[10px] text-slate-500 font-bold px-1 uppercase">Channel:</span>
                <select
                  value={selectedPlatformFilter}
                  onChange={(e) => setSelectedPlatformFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
                >
                  <option value="ALL">All Platforms</option>
                  <option value="AMAZON_FBA">Amazon FBA (Prime)</option>
                  <option value="AMAZON_FBM">Amazon FBM (UK)</option>
                  <option value="SHOPIFY">Shopify Store</option>
                  <option value="ETSY">Etsy Artisan</option>
                </select>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                <span className="text-[10px] text-slate-500 font-bold px-1 uppercase">Status:</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="RETURNED">Returned</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl border border-[#DDE3DD] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#1F3A2E] text-white uppercase text-[10px] tracking-wider font-mono">
                    <th className="py-3 px-4">Order Ref &amp; Store</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer &amp; Market</th>
                    <th className="py-3 px-4">Items &amp; SKU</th>
                    <th className="py-3 px-3 text-center">Qty</th>
                    <th className="py-3 px-3 text-right">Gross Amount</th>
                    <th className="py-3 px-3 text-right">Channel Fee</th>
                    <th className="py-3 px-3 text-right">Net Payout</th>
                    <th className="py-3 px-3">Fulfillment</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400">
                        <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                        <p className="font-semibold">No B2C sales orders found matching your filter criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const platformInfo = PLATFORM_CONFIG[order.platform] || PLATFORM_CONFIG.SHOPIFY;
                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-emerald-50/40 transition-colors group cursor-pointer"
                          onClick={() => setSelectedOrderDetail(order)}
                        >
                          {/* Order Ref & Store */}
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-[#1F3A2E] block">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border mt-0.5 ${platformInfo.badge}`}
                            >
                              {platformInfo.icon}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3 px-3 font-mono text-slate-600">
                            <div>{order.orderDate}</div>
                            {order.orderTime && (
                              <div className="text-[10px] text-slate-400">{order.orderTime}</div>
                            )}
                          </td>

                          {/* Customer & Market */}
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-800 block truncate max-w-[130px]">
                              {order.customerName}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                              {order.shippingCity || order.customerCountry}
                            </span>
                          </td>

                          {/* Items & SKU */}
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                  <span className="font-mono text-[10px] px-1 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                                    {item.sku}
                                  </span>
                                  <span className="text-[11px] text-slate-700 truncate max-w-[170px]" title={item.styleName}>
                                    {item.styleName}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Total Quantity */}
                          <td className="py-3 px-3 text-center">
                            <span className="font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#1F3A2E]">
                              {order.totalQuantity}
                            </span>
                          </td>

                          {/* Gross Amount */}
                          <td className="py-3 px-3 text-right">
                            <span className="font-mono font-bold text-slate-900 block">
                              ${order.grossAmountUsd.toFixed(2)}
                            </span>
                            {isBdStation && (
                              <span className="font-mono text-[10px] text-emerald-700 block">
                                ৳{Math.round(order.grossAmountUsd * bdtRate).toLocaleString()}
                              </span>
                            )}
                          </td>

                          {/* Channel Fee */}
                          <td className="py-3 px-3 text-right">
                            <span className="font-mono text-amber-600 font-bold block">
                              -${order.platformFeesUsd.toFixed(2)}
                            </span>
                            <span className="text-[9px] text-slate-400 block">
                              {((order.platformFeesUsd / order.grossAmountUsd) * 100).toFixed(0)}%
                            </span>
                          </td>

                          {/* Net Payout */}
                          <td className="py-3 px-3 text-right">
                            <span className="font-mono font-bold text-emerald-700 block">
                              ${order.netPayoutUsd.toFixed(2)}
                            </span>
                            {isBdStation && (
                              <span className="font-mono text-[9px] text-emerald-600 block">
                                ৳{Math.round(order.netPayoutUsd * bdtRate).toLocaleString()}
                              </span>
                            )}
                          </td>

                          {/* Fulfillment */}
                          <td className="py-3 px-3">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200 block truncate max-w-[110px]">
                              {order.fulfillmentMethod}
                            </span>
                            {order.carrier && (
                              <span className="text-[9px] text-slate-400 block truncate max-w-[110px] mt-0.5">
                                {order.carrier}
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                                order.orderStatus === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.orderStatus === 'IN_TRANSIT'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.orderStatus === 'PROCESSING'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrderDetail(order);
                              }}
                              className="p-1 rounded hover:bg-slate-200 text-slate-600 hover:text-[#1F3A2E] transition"
                              title="View Order Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer info */}
            <div className="p-3 bg-[#F8FAF8] border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredOrders.length} of {orders.length} total orders</span>
              <span className="font-mono">
                Total Filtered Net Payout:{' '}
                <strong className="text-emerald-700 font-bold">
                  ${filteredOrders.reduce((acc, o) => acc + o.netPayoutUsd, 0).toFixed(2)}
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: MODIFY SALES POINTS (ADD / EDIT / DELETE)                     */}
      {/* ==================================================================== */}
      {activeTab === 'SALES_POINTS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1F3A2E] font-heading">
                Configured E-Com Sales Points &amp; Marketplace Channels
              </h3>
              <p className="text-xs text-slate-500">
                Connect, adjust platform commission rates, FBA pick &amp; pack fees, and manage active store status.
              </p>
            </div>

            <button
              onClick={handleOpenAddSalesPoint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-[#C8A96A] text-xs font-bold border border-[#C8A96A]/40 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Sales Point</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {salesPoints.map((sp) => {
              const platformInfo = PLATFORM_CONFIG[sp.platform] || PLATFORM_CONFIG.SHOPIFY;
              const spOrders = orders.filter((o) => o.salesPointId === sp.id || o.platform === sp.platform);
              const spGross = spOrders.reduce((acc, o) => acc + o.grossAmountUsd, 0);
              const spUnits = spOrders.reduce((acc, o) => acc + o.totalQuantity, 0);

              return (
                <div
                  key={sp.id}
                  className="bg-white rounded-2xl border-2 border-slate-200 hover:border-[#1F3A2E] p-5 shadow-xs transition-all relative flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-inner ${platformInfo.bg} ${platformInfo.border} border`}
                        >
                          {platformInfo.icon.split(' ')[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${platformInfo.badge}`}
                            >
                              {sp.platform.replace('_', ' ')}
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                              {sp.region} Region
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 font-heading mt-0.5">
                            {sp.name}
                          </h4>
                        </div>
                      </div>

                      {/* Status pill */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          sp.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sp.status === 'MAINTENANCE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sp.status}
                      </span>
                    </div>

                    {/* Store URL */}
                    {sp.storeUrl && (
                      <a
                        href={sp.storeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 hover:underline font-mono"
                      >
                        <span>{sp.storeUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {/* Description */}
                    {sp.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {sp.description}
                      </p>
                    )}

                    {/* Fee Matrix Pills */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-500 uppercase block font-mono">
                          Referral Fee
                        </span>
                        <span className="font-mono text-xs font-bold text-amber-700">
                          {sp.feePercentage}%
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-500 uppercase block font-mono">
                          Fixed / Order
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-700">
                          ${sp.fixedFeePerOrder.toFixed(2)}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-500 uppercase block font-mono">
                          FBA Pick/Pack
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-700">
                          ${(sp.fbaPickPackFeePerUnit || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Performance mini stats */}
                    <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Orders Handled</span>
                        <span className="font-mono font-bold text-slate-800">
                          {spOrders.length} orders ({spUnits} units)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Gross Yield</span>
                        <span className="font-mono font-bold text-emerald-700">
                          ${spGross.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Last Synced: {sp.lastSyncedAt || 'Live Auto'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditSalesPoint(sp)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#1F3A2E] hover:text-white text-slate-700 text-xs font-bold transition cursor-pointer"
                        title="Edit Sales Point Parameters"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#C8A96A]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          setSalesPointToDelete(sp);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition cursor-pointer"
                        title="Delete this sales channel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: EXECUTIVE PERFORMANCE & PROFITABILITY REPORT                  */}
      {/* ==================================================================== */}
      {activeTab === 'REPORT' && (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-[#DDE3DD] shadow-xs printable-report">
          {/* Formal Report Header */}
          <div className="border-b-2 border-[#1F3A2E] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#C8A96A] text-[#12231B] font-bold">
                  EXECUTIVE DOSSIER
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  REF: AMC-ECOM-REP-{new Date().getFullYear()}
                </span>
              </div>
              <h2 className="text-xl font-bold font-heading text-[#1F3A2E] mt-1">
                Multichannel E-Com Sales &amp; Profitability Performance Report
              </h2>
              <p className="text-xs text-slate-600">
                Settlement audit across Amazon North America, Amazon UK, Shopify Global, and Etsy Handmade Studio.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">Generated:</span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                {new Date().toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Channel Comparison Matrix Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider font-mono">
              Marketplace Channel Yield &amp; Fee Distribution
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#1F3A2E] text-white uppercase text-[10px] tracking-wider font-mono">
                    <th className="py-2.5 px-3">Sales Channel</th>
                    <th className="py-2.5 px-3 text-center">Orders</th>
                    <th className="py-2.5 px-3 text-center">Units Sold</th>
                    <th className="py-2.5 px-3 text-right">Gross GMV</th>
                    {isBdStation && <th className="py-2.5 px-3 text-right">BDT Equiv</th>}
                    <th className="py-2.5 px-3 text-right">Platform Fees</th>
                    <th className="py-2.5 px-3 text-right">Fee Rate</th>
                    <th className="py-2.5 px-3 text-right">Net Payout</th>
                    <th className="py-2.5 px-3 text-right">Avg Order</th>
                    <th className="py-2.5 px-3 text-center">Return %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {channelSummaries.map((summary, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-800 block">{summary.salesPointName}</span>
                        <span className="font-mono text-[9px] text-slate-400">
                          {summary.platform.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">{summary.totalOrders}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-[#1F3A2E]">
                        {summary.totalUnitsSold}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ${summary.grossRevenueUsd.toFixed(2)}
                      </td>
                      {isBdStation && (
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                          ৳{Math.round(summary.grossRevenueUsd * bdtRate).toLocaleString()}
                        </td>
                      )}
                      <td className="py-2.5 px-3 text-right font-mono text-amber-600">
                        ${summary.totalFeesUsd.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-600">
                        {summary.grossRevenueUsd > 0
                          ? ((summary.totalFeesUsd / summary.grossRevenueUsd) * 100).toFixed(1)
                          : 0}
                        %
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                        ${summary.netPayoutUsd.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                        ${summary.averageOrderValueUsd.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                        {summary.returnRatePct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td className="py-2.5 px-3 font-heading uppercase text-[11px]">Consolidated Total</td>
                    <td className="py-2.5 px-3 text-center font-mono">{summaryKpis.totalOrdersCount}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-[#1F3A2E]">{summaryKpis.totalUnitsSold}</td>
                    <td className="py-2.5 px-3 text-right font-mono">${summaryKpis.grossRevenueUsd.toFixed(2)}</td>
                    {isBdStation && (
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-800">
                        ৳{Math.round(summaryKpis.grossRevenueUsd * bdtRate).toLocaleString()}
                      </td>
                    )}
                    <td className="py-2.5 px-3 text-right font-mono text-amber-700">${summaryKpis.totalPlatformFeesUsd.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {summaryKpis.grossRevenueUsd > 0
                        ? ((summaryKpis.totalPlatformFeesUsd / summaryKpis.grossRevenueUsd) * 100).toFixed(1)
                        : 0}
                      %
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700">${summaryKpis.netPayoutUsd.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">${summaryKpis.averageOrderValueUsd.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{summaryKpis.returnRatePct.toFixed(1)}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Top Selling SKUs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider font-mono mb-2">
                Top 5 Best-Selling B2C SKUs Across Channels
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {topSkus.map((skuItem, i) => (
                  <div key={i} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] w-5 h-5 rounded-full bg-[#1F3A2E] text-white flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-mono font-bold text-slate-800 block">{skuItem.sku}</span>
                        <span className="text-[11px] text-slate-600 block">{skuItem.styleName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#1F3A2E] block">
                        {skuItem.units} Pcs Sold
                      </span>
                      <span className="font-mono text-[11px] text-emerald-700 block">
                        ${skuItem.revenueUsd.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Channel Findings & Next Actions */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-[#1F3A2E] uppercase tracking-wider font-mono">
                Executive Commercial Insights
              </h4>
              <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4 leading-relaxed">
                <li>
                  <strong>Amazon US Prime (FBA)</strong> generates the highest checkout velocity (45% of total units), benefiting from Prime 2-day delivery badges and high trust.
                </li>
                <li>
                  <strong>Shopify Flagship</strong> achieves the highest net retention margin (97.1% yield) due to low payment fees (2.9% + $0.30) versus marketplace referral charges.
                </li>
                <li>
                  <strong>Etsy Artisan Studio</strong> attracts luxury craft collectors at full retail price points with high personalization willingness (monogrammed leather).
                </li>
                <li>
                  <strong>Fulfillment Recommendation:</strong> Continue expanding FBA stock levels for top styles while retaining direct artisan dispatch for bespoke monogrammed items.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: ADD / EDIT SALES POINT (Close Button at absolute top-4)     */}
      {/* ==================================================================== */}
      {isSalesPointModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[92vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
            {/* Top-Right Absolute Close Button (Standard Window Position) */}
            <button
              type="button"
              onClick={() => setIsSalesPointModalOpen(false)}
              className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/40 hover:bg-black/70 text-white/90 hover:text-white border border-white/20 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
              title="Close Window (X)"
              aria-label="Close Window"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-5 pr-16 border-b-[3px] border-[#C8A96A] bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#162B22] text-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-[#C8A96A] border border-white/20">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-white">
                    {editingSalesPoint ? 'Edit E-Com Sales Point' : 'Add New E-Com Sales Channel'}
                  </h3>
                  <p className="text-xs text-emerald-100/80">
                    Configure store parameters, platform referral rates, and fulfillment model.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveSalesPoint} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Sales Point / Store Name *
                </label>
                <input
                  type="text"
                  required
                  value={spForm.name || ''}
                  onChange={(e) => setSpForm({ ...spForm, name: e.target.value })}
                  placeholder="e.g. Amazon US Storefront (FBA Prime)"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1F3A2E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Platform Type *
                  </label>
                  <select
                    value={spForm.platform || 'AMAZON_FBA'}
                    onChange={(e) =>
                      setSpForm({ ...spForm, platform: e.target.value as D2cPlatformType })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1F3A2E] bg-white"
                  >
                    <option value="AMAZON_FBA">Amazon (FBA Prime)</option>
                    <option value="AMAZON_FBM">Amazon (FBM Merchant)</option>
                    <option value="SHOPIFY">Shopify Official Store</option>
                    <option value="ETSY">Etsy Artisan Studio</option>
                    <option value="TIKTOK_SHOP">TikTok Shop</option>
                    <option value="EBAY">eBay Global Store</option>
                    <option value="RETAIL_STORE">Physical Showroom / POS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Marketplace Region *
                  </label>
                  <select
                    value={spForm.region || 'US'}
                    onChange={(e) => setSpForm({ ...spForm, region: e.target.value as D2cRegion })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1F3A2E] bg-white"
                  >
                    <option value="US">United States (US)</option>
                    <option value="UK">United Kingdom (UK)</option>
                    <option value="EU">European Union (EU)</option>
                    <option value="AU">Australia (AU)</option>
                    <option value="GLOBAL">Global / Multi-Region</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Store URL / Marketplace Portal Link
                </label>
                <input
                  type="url"
                  value={spForm.storeUrl || ''}
                  onChange={(e) => setSpForm({ ...spForm, storeUrl: e.target.value })}
                  placeholder="https://www.amazon.com/shops/..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1F3A2E]"
                />
              </div>

              {/* Commission & Fee Structure */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-[#1F3A2E] uppercase font-mono block">
                  Channel Fee &amp; Commission Matrix
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Referral Fee %
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={spForm.feePercentage ?? 15}
                      onChange={(e) =>
                        setSpForm({ ...spForm, feePercentage: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Fixed Fee / Order ($)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={spForm.fixedFeePerOrder ?? 0}
                      onChange={(e) =>
                        setSpForm({ ...spForm, fixedFeePerOrder: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      FBA Pick/Pack ($)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={spForm.fbaPickPackFeePerUnit ?? 0}
                      onChange={(e) =>
                        setSpForm({
                          ...spForm,
                          fbaPickPackFeePerUnit: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Store Operational Status
                  </label>
                  <select
                    value={spForm.status || 'ACTIVE'}
                    onChange={(e) =>
                      setSpForm({
                        ...spForm,
                        status: e.target.value as 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE',
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="ACTIVE">Active (Live Checkout)</option>
                    <option value="MAINTENANCE">Maintenance Mode</option>
                    <option value="INACTIVE">Inactive / Paused</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sync Integration
                  </label>
                  <select
                    value={spForm.syncStatus || 'LIVE_CONNECTED'}
                    onChange={(e) =>
                      setSpForm({
                        ...spForm,
                        syncStatus: e.target.value as 'LIVE_CONNECTED' | 'MANUAL_ENTRY' | 'SCHEDULED_BATCH',
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="LIVE_CONNECTED">Live Webhook Connected</option>
                    <option value="SCHEDULED_BATCH">Hourly Batch Polling</option>
                    <option value="MANUAL_ENTRY">Manual Entry Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description &amp; Operational Notes
                </label>
                <textarea
                  rows={2}
                  value={spForm.description || ''}
                  onChange={(e) => setSpForm({ ...spForm, description: e.target.value })}
                  placeholder="Notes on fulfillment warehouse, packaging inserts, or advertising campaign..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1F3A2E]"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSalesPointModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-[#C8A96A] font-bold text-xs shadow-md transition"
                >
                  {editingSalesPoint ? 'Save Changes' : 'Create Sales Point'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: CONFIRM DELETE SALES POINT (Close Button at top right)      */}
      {/* ==================================================================== */}
      {isDeleteModalOpen && salesPointToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden p-6 text-[#1A1A1A] font-sans">
            {/* Top-Right Absolute Close Button (Standard Window Position) */}
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
              title="Close Window (X)"
              aria-label="Close Window"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3 pr-8">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-slate-900">
                  Delete Sales Point?
                </h3>
                <span className="text-xs text-slate-500">
                  {salesPointToDelete.name}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to remove this B2C sales channel? All associated historical
              order analytics will remain in the database archive.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSalesPoint}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
              >
                Yes, Delete Channel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: MANUAL RECORD B2C ORDER (Close Button at top right)         */}
      {/* ==================================================================== */}
      {isCreateOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[92vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
            {/* Top-Right Absolute Close Button (Standard Window Position) */}
            <button
              type="button"
              onClick={() => setIsCreateOrderModalOpen(false)}
              className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/40 hover:bg-black/70 text-white/90 hover:text-white border border-white/20 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
              title="Close Window (X)"
              aria-label="Close Window"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-5 pr-16 border-b-[3px] border-[#C8A96A] bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#162B22] text-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-[#C8A96A] border border-white/20">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-white">
                    Record Manual E-Com Order
                  </h3>
                  <p className="text-xs text-emerald-100/80">
                    Log custom orders, phone inquiries, or offline showroom checkout receipts.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveManualOrder} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sales Channel *
                  </label>
                  <select
                    value={orderForm.salesPointId}
                    onChange={(e) => setOrderForm({ ...orderForm, salesPointId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {salesPoints.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Order Ref / Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderForm.orderNumber}
                    onChange={(e) => setOrderForm({ ...orderForm, orderNumber: e.target.value })}
                    placeholder="Auto-generated if blank"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    value={orderForm.customerEmail}
                    onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                    placeholder="customer@domain.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Destination Country
                  </label>
                  <input
                    type="text"
                    value={orderForm.customerCountry}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, customerCountry: e.target.value })
                    }
                    placeholder="United States"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Shipping City
                  </label>
                  <input
                    type="text"
                    value={orderForm.shippingCity}
                    onChange={(e) => setOrderForm({ ...orderForm, shippingCity: e.target.value })}
                    placeholder="Austin, TX"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Item selection */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-[#1F3A2E] uppercase font-mono block">
                  Product Item Ordered
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Style Name
                  </label>
                  <input
                    type="text"
                    required
                    value={orderForm.styleName}
                    onChange={(e) => setOrderForm({ ...orderForm, styleName: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      required
                      value={orderForm.sku}
                      onChange={(e) => setOrderForm({ ...orderForm, sku: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Unit Price ($)
                    </label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={orderForm.unitPrice}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, unitPrice: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={orderForm.quantity}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, quantity: parseInt(e.target.value, 10) || 1 })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Fulfillment Method
                  </label>
                  <select
                    value={orderForm.fulfillmentMethod}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        fulfillmentMethod: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="FBA">Amazon FBA</option>
                    <option value="FBM">Amazon FBM</option>
                    <option value="SHOPIFY_3PL">Shopify 3PL Warehouse</option>
                    <option value="DIRECT_POST">Direct Artisan Post</option>
                    <option value="IN_STORE">In-Store Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Initial Status
                  </label>
                  <select
                    value={orderForm.orderStatus}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        orderStatus: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="DELIVERED">Delivered</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="PROCESSING">Processing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                  placeholder="Special customer requests, monogramming initials..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#162B22] text-[#C8A96A] font-bold text-xs shadow-md transition"
                >
                  Record Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: ORDER DETAIL DRAWER / POPUP (Close Button at top right)     */}
      {/* ==================================================================== */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[92vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
            {/* Top-Right Absolute Close Button (Standard Window Position) */}
            <button
              type="button"
              onClick={() => setSelectedOrderDetail(null)}
              className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/40 hover:bg-black/70 text-white/90 hover:text-white border border-white/20 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
              title="Close Window (X)"
              aria-label="Close Window"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-5 pr-16 border-b-[3px] border-[#C8A96A] bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#162B22] text-white">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-[#C8A96A] text-[#12231B] font-bold">
                  {selectedOrderDetail.orderNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-emerald-100">
                  {selectedOrderDetail.platform.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300">
                  {selectedOrderDetail.orderStatus}
                </span>
              </div>
              <h3 className="text-xl font-bold font-heading text-white">
                B2C Order Details &amp; Settlement Breakdown
              </h3>
              <p className="text-xs text-emerald-100/80">
                Channel: {selectedOrderDetail.salesPointName} • Logged {selectedOrderDetail.orderDate}
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* Customer & Shipping Tile */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Customer</span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {selectedOrderDetail.customerName}
                  </span>
                  {selectedOrderDetail.customerEmail && (
                    <span className="text-slate-500 text-[11px] block">
                      {selectedOrderDetail.customerEmail}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Shipping Destination</span>
                  <span className="font-semibold text-slate-800 block">
                    {selectedOrderDetail.shippingCity || 'N/A'}
                  </span>
                  <span className="text-slate-500 text-[11px] block">
                    {selectedOrderDetail.customerCountry}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <span className="font-mono font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Line Items ({selectedOrderDetail.items.length})
                </span>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1F3A2E] text-white text-[10px] uppercase font-mono">
                      <tr>
                        <th className="py-2 px-3">Item Description</th>
                        <th className="py-2 px-3">SKU</th>
                        <th className="py-2 px-2 text-center">Qty</th>
                        <th className="py-2 px-3 text-right">Unit Price</th>
                        <th className="py-2 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrderDetail.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {item.styleName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{item.sku}</td>
                          <td className="py-2.5 px-2 text-center font-mono font-bold">
                            {item.quantity}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            ${item.totalPrice.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-2">
                <span className="font-mono font-bold text-slate-800 uppercase block">
                  Settlement &amp; Fee Ledger
                </span>
                <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                  <span>Gross Order Amount</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${selectedOrderDetail.grossAmountUsd.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 text-amber-700">
                  <span>Platform &amp; Referral Fees Deducted</span>
                  <span className="font-mono font-bold">
                    -${selectedOrderDetail.platformFeesUsd.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-sm text-[#1F3A2E]">
                  <span>Net Payout to ArielMC</span>
                  <span className="font-mono text-base text-emerald-700">
                    ${selectedOrderDetail.netPayoutUsd.toFixed(2)}
                    {isBdStation && (
                      <span className="text-xs font-normal text-emerald-600 ml-2">
                        (৳{Math.round(selectedOrderDetail.netPayoutUsd * bdtRate).toLocaleString()} BDT)
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Carrier & Tracking */}
              {selectedOrderDetail.trackingNumber && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="text-[10px] text-blue-600 font-bold uppercase block">
                        Fulfillment &amp; Dispatch
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-900">
                        {selectedOrderDetail.carrier || 'Standard Courier'}: {selectedOrderDetail.trackingNumber}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    {selectedOrderDetail.fulfillmentMethod}
                  </span>
                </div>
              )}

              {/* Customer Rating & Review */}
              {selectedOrderDetail.customerRating && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: selectedOrderDetail.customerRating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-xs font-bold text-amber-900 ml-1">
                      Verified Buyer Rating ({selectedOrderDetail.customerRating}/5)
                    </span>
                  </div>
                  {selectedOrderDetail.customerReview && (
                    <p className="text-xs text-amber-900/90 italic">
                      &ldquo;{selectedOrderDetail.customerReview}&rdquo;
                    </p>
                  )}
                </div>
              )}

              {selectedOrderDetail.notes && (
                <div className="text-slate-500 text-xs italic">
                  <strong>Notes:</strong> {selectedOrderDetail.notes}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrderDetail(null)}
                className="px-5 py-2 rounded-xl bg-[#1F3A2E] text-white text-xs font-bold transition hover:bg-[#162B22]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
