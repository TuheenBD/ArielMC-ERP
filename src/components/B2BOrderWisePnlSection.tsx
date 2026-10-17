'use client';

import React, { useState, useMemo } from 'react';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Percent,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Calendar,
  Landmark,
  ExternalLink,
  Coins,
  FileSpreadsheet
} from 'lucide-react';
import {
  B2B_ORDER_PNL_DATA,
  getB2bOrderPnlSummary,
  B2BOrderPnl,
  B2bOrderStatus
} from '@/data/pnlCalculationData';

export const B2BOrderWisePnlSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [marketFilter, setMarketFilter] = useState<'ALL' | 'UK' | 'US' | 'EU' | 'AU'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | B2bOrderStatus>('ALL');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return B2B_ORDER_PNL_DATA.filter((ord) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ord.soNumber.toLowerCase().includes(q) ||
        ord.buyerCompany.toLowerCase().includes(q) ||
        ord.linkedPoNumber.toLowerCase().includes(q) ||
        ord.factoryName.toLowerCase().includes(q) ||
        ord.incoterm.toLowerCase().includes(q);

      const matchesMarket = marketFilter === 'ALL' || ord.targetMarket === marketFilter;
      const matchesStatus = statusFilter === 'ALL' || ord.status === statusFilter;

      return matchesSearch && matchesMarket && matchesStatus;
    });
  }, [searchQuery, marketFilter, statusFilter]);

  const summary = useMemo(() => getB2bOrderPnlSummary(filteredOrders), [filteredOrders]);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  // Helper for status styling
  const getStatusBadge = (status: B2bOrderStatus) => {
    switch (status) {
      case 'SETTLED':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">SETTLED</span>;
      case 'SHIPPED':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">SHIPPED</span>;
      case 'IN_PRODUCTION':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">IN PRODUCTION</span>;
      case 'CONFIRMED':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-mono font-bold">CONFIRMED</span>;
    }
  };

  const getMarketFlag = (market: string) => {
    switch (market) {
      case 'UK': return '🇬🇧';
      case 'US': return '🇺🇸';
      case 'EU': return '🇪🇺';
      case 'AU': return '🇦🇺';
      default: return '🌐';
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Card & Commercial Policy Rule */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1F3A2E] via-[#162B22] to-[#12231B] border-2 border-[#C8A96A]/40 text-white shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A] text-[#12231B] font-mono text-xs font-bold">
                COMMERCIAL POLICY
              </span>
              <span className="text-xs text-emerald-300 font-mono font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                B2B P&amp;L Method: Order-Wise
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono">
                Min 25%–30% Margin Target
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-['Montserrat'] tracking-tight flex items-center gap-2 text-white">
              <Building2 className="w-5 h-5 text-[#C8A96A]" />
              <span>B2B Wholesale Profit &amp; Loss Statement (Order-Wise)</span>
            </h2>
            <p className="text-xs text-white/80 max-w-4xl font-['Open_Sans'] leading-relaxed">
              Every B2B corporate purchase order is evaluated independently as a closed commercial contract: Contract Value vs. Factory PO Sourcing, Inland Freight/CFS, Debossing Dies, and LC Banking fees. Governed by ArielMC minimum 25%–30% net margin rule.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-center font-mono">
              <span className="text-[10px] text-gray-300 uppercase block">Blended Order Margin</span>
              <span className="text-lg font-bold text-emerald-400">{summary.blendedMarginPct.toFixed(2)}%</span>
              <span className="text-[9px] text-[#C8A96A] block">Target: ≥25.0%</span>
            </div>
          </div>
        </div>

        {/* Aggregate KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 border-t border-white/10 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block uppercase">Total Orders</span>
            <span className="text-base font-bold text-white">{summary.totalOrders}</span>
            <span className="text-[10px] text-gray-400 block">{summary.totalUnits.toLocaleString()} pcs</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block uppercase">Contract Revenue</span>
            <span className="text-base font-bold text-[#C8A96A]">${summary.totalRevenueUsd.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 block">৳ {(summary.totalRevenueBdt / 1000000).toFixed(2)}M BDT</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block uppercase">Factory PO COGS</span>
            <span className="text-base font-bold text-gray-200">${summary.totalFactoryCogsUsd.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 block">{((summary.totalFactoryCogsUsd / summary.totalRevenueUsd) * 100).toFixed(1)}% of sales</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block uppercase">Logistics &amp; Port</span>
            <span className="text-base font-bold text-blue-300">${summary.totalLogisticsUsd.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 block">Inland + CFS</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block uppercase">Tooling &amp; Banking</span>
            <span className="text-base font-bold text-purple-300">${(summary.totalToolingUsd + summary.totalBankingUsd).toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 block">Dies + L/C fees</span>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
            <span className="text-[10px] text-emerald-300 block uppercase font-bold">Net Profit</span>
            <span className="text-base font-bold text-emerald-400">${summary.totalNetProfitUsd.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-300 block">৳ {(summary.totalNetProfitBdt / 1000000).toFixed(2)}M BDT</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Filter Controls */}
      <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Sales Order (SO-2026-...), Buyer Company, Factory PO, Incoterm..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#1F3A2E] outline-none font-mono text-gray-900"
          />
        </div>

        {/* Market Filter */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg shrink-0">
          {(['ALL', 'UK', 'US', 'EU', 'AU'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMarketFilter(m)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                marketFilter === m
                  ? 'bg-[#1F3A2E] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {m === 'ALL' ? 'All Markets' : `${getMarketFlag(m)} ${m}`}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg shrink-0">
          {(['ALL', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'SETTLED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-[#1F3A2E] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {s === 'ALL' ? 'All Status' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Order-Wise Interactive Cards Ledger */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-500">
            No B2B orders matching the selected filter criteria.
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const isExpanded = expandedOrderId === ord.id;
            return (
              <div
                key={ord.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'bg-white border-[#1F3A2E] shadow-md ring-1 ring-[#1F3A2E]/20'
                    : 'bg-white border-[#DDE3DD] hover:border-gray-400 shadow-xs'
                }`}
              >
                {/* Order Summary Row */}
                <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Order & Buyer Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{getMarketFlag(ord.targetMarket)}</span>
                      <span className="font-bold font-mono text-sm text-[#1F3A2E]">
                        {ord.soNumber}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="font-bold text-gray-900 text-sm font-['Montserrat']">
                        {ord.buyerCompany}
                      </span>
                      {getStatusBadge(ord.status)}
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-100 text-gray-700 font-semibold">
                        {ord.incoterm}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 flex items-center gap-3 flex-wrap">
                      <span>Buyer Contact: <strong className="text-gray-700">{ord.buyerContact}</strong></span>
                      <span>Order Date: {ord.orderDate}</span>
                      <span>Target Delivery: {ord.targetDeliveryDate}</span>
                      <span>Qty: <strong className="text-gray-900 font-mono">{ord.totalQuantity.toLocaleString()} pcs</strong></span>
                    </div>
                  </div>

                  {/* Right: Key Financial Indicators */}
                  <div className="flex items-center gap-4 sm:gap-6 shrink-0 font-mono text-right">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block font-sans">Contract Value</span>
                      <span className="text-sm font-bold text-gray-900 block">
                        ${ord.contractRevenueUsd.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        {ord.currency} {ord.contractTotalBuyerCurrency.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block font-sans">Total Costs</span>
                      <span className="text-sm font-bold text-gray-700 block">
                        ${ord.totalOrderCostUsd.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        ${ord.costPerUnitUsd.toFixed(2)}/pc
                      </span>
                    </div>

                    <div className="pl-3 border-l border-gray-200">
                      <span className="text-[10px] text-emerald-800 uppercase block font-sans font-bold">Net Profit</span>
                      <span className="text-sm font-bold text-emerald-700 block">
                        +${ord.orderNetProfitUsd.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-emerald-600 block">
                        +${ord.profitPerUnitUsd.toFixed(2)}/pc
                      </span>
                    </div>

                    <div className="pl-3 border-l border-gray-200 min-w-[90px] text-center">
                      <span className="text-[10px] text-gray-500 uppercase block font-sans font-bold">Net Margin</span>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                          ord.isPolicyCompliant
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {ord.orderProfitMarginPct.toFixed(1)}%
                      </span>
                      <span className="text-[9px] text-gray-400 block mt-0.5">
                        {ord.isPolicyCompliant ? '✓ Policy Passed' : '⚠️ Near Target'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(ord.id)}
                      className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 cursor-pointer"
                      title="Inspect Order Cost Sheet & Itemized COGS"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Itemized Cost Sheet Drawer */}
                {isExpanded && (
                  <div className="p-4 bg-gray-50/80 border-t border-gray-200 space-y-3 font-mono text-xs animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#1F3A2E]" />
                        <span className="font-bold text-gray-800 uppercase text-[11px]">
                          Itemized Cost Sheet &amp; Commercial Breakdown [{ord.soNumber}]
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-600 font-sans">
                        <span>Linked Factory PO: <strong className="font-mono text-gray-900">{ord.linkedPoNumber}</strong> ({ord.factoryName})</span>
                        <span>Terms: <strong className="text-gray-900">{ord.paymentTerms}</strong></span>
                      </div>
                    </div>

                    {/* Cost Breakdown Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#1F3A2E] text-white text-[10px] uppercase font-semibold">
                          <tr>
                            <th className="py-2.5 px-3">Statutory Head &amp; Cost Category</th>
                            <th className="py-2.5 px-3">Amount (USD)</th>
                            <th className="py-2.5 px-3">Amount (BDT)</th>
                            <th className="py-2.5 px-3">% of Order Revenue</th>
                            <th className="py-2.5 px-3">Operational Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-gray-700">
                          {ord.costBreakdown.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="py-2.5 px-3 font-bold text-gray-900">{item.head}</td>
                              <td className="py-2.5 px-3 font-bold text-gray-900">${item.amountUsd.toLocaleString()}</td>
                              <td className="py-2.5 px-3 text-gray-600">৳ {item.amountBdt.toLocaleString()}</td>
                              <td className="py-2.5 px-3 text-gray-600">
                                {((item.amountUsd / ord.contractRevenueUsd) * 100).toFixed(1)}%
                              </td>
                              <td className="py-2.5 px-3 text-gray-600 font-sans text-[11px]">{item.description}</td>
                            </tr>
                          ))}
                          <tr className="bg-emerald-50/60 font-bold text-gray-900 border-t-2 border-emerald-500">
                            <td className="py-2.5 px-3 text-emerald-950 font-bold">TOTAL ORDER COSTS</td>
                            <td className="py-2.5 px-3 text-gray-900 font-bold">${ord.totalOrderCostUsd.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-gray-700">৳ {ord.totalOrderCostBdt.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-gray-800">
                              {((ord.totalOrderCostUsd / ord.contractRevenueUsd) * 100).toFixed(1)}%
                            </td>
                            <td className="py-2.5 px-3 text-emerald-900 font-sans text-[11px]">
                              Net Profit: ${ord.orderNetProfitUsd.toLocaleString()} ({ord.orderProfitMarginPct.toFixed(1)}% margin)
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Per-Unit Unit Economics & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                      <div className="p-2 rounded bg-white border border-gray-200">
                        <span className="text-gray-500 block uppercase text-[10px]">Contract Price / Unit</span>
                        <strong className="text-gray-900 text-xs">${ord.revenuePerUnitUsd.toFixed(2)} USD</strong>
                      </div>
                      <div className="p-2 rounded bg-white border border-gray-200">
                        <span className="text-gray-500 block uppercase text-[10px]">Total Cost / Unit</span>
                        <strong className="text-gray-900 text-xs">${ord.costPerUnitUsd.toFixed(2)} USD</strong>
                      </div>
                      <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                        <span className="text-emerald-800 block uppercase text-[10px]">Net Profit / Unit</span>
                        <strong className="text-emerald-900 text-xs">+${ord.profitPerUnitUsd.toFixed(2)} USD</strong>
                      </div>
                      <div className="p-2 rounded bg-white border border-gray-200 font-sans">
                        <span className="text-gray-500 block uppercase text-[10px] font-mono">Order Notes</span>
                        <span className="text-gray-600 line-clamp-1">{ord.notes}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
