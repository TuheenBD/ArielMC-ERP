'use client';

import React, { useState } from 'react';
import {
  BuyerSalesOrder,
  FactoryPurchaseOrder,
  OrderStatus,
  ProductSector,
  SupplierFactory,
  ProductItem,
  CrmLead,
  TimeAndActionMilestone,
  AqlInspectionReport,
} from '@/types/erp';
import {
  Repeat,
  Search,
  Filter,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ship,
  Factory,
  Building2,
  DollarSign,
  Calendar,
  Layers,
  FileCheck,
  ShieldCheck,
  ExternalLink,
  X,
  TrendingUp,
  Percent,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';

interface OrderManagementProps {
  orders: BuyerSalesOrder[];
  factories: SupplierFactory[];
  products: ProductItem[];
  crmLeads: CrmLead[];
  onAddOrder: (newOrder: BuyerSalesOrder) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateMilestoneStatus: (
    orderId: string,
    milestoneId: string,
    newStatus: 'COMPLETED' | 'ON_TRACK' | 'AT_RISK' | 'DELAYED'
  ) => void;
}

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  DRAFT: {
    label: 'Draft',
    bg: 'bg-[#F4F6F4]',
    text: 'text-[#6B7269]',
    border: 'border-[#DDE3DD]',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmed / L/C Opened',
    bg: 'bg-[#E8F0FA]',
    text: 'text-[#17456F]',
    border: 'border-[#C5D7ED]',
    icon: FileCheck,
  },
  IN_PRODUCTION: {
    label: 'In Factory Production',
    bg: 'bg-[#FEF6E4]',
    text: 'text-[#7A5508]',
    border: 'border-[#FBE3B0]',
    icon: Factory,
  },
  QUALITY_INSPECTION: {
    label: 'QA / AQL Inspection',
    bg: 'bg-[#EDE7F6]',
    text: 'text-[#4A2E7A]',
    border: 'border-[#D6C7EC]',
    icon: ShieldCheck,
  },
  READY_TO_SHIP: {
    label: 'Ready for Chittagong',
    bg: 'bg-[#E4F3E9]',
    text: 'text-[#14512C]',
    border: 'border-[#BBE3C7]',
    icon: CheckCircle2,
  },
  SHIPPED_CHITTAGONG: {
    label: 'Shipped (Ocean/Air Transit)',
    bg: 'bg-[#E0F2FE]',
    text: 'text-[#0369A1]',
    border: 'border-[#BAE6FD]',
    icon: Ship,
  },
  FULFILLED: {
    label: 'Delivered & Settled',
    bg: 'bg-[#E4F3E9]',
    text: 'text-[#14512C]',
    border: 'border-[#BBE3C7]',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-[#FDEAEA]',
    text: 'text-[#8A1515]',
    border: 'border-[#F7C0C0]',
    icon: AlertCircle,
  },
};

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  factories,
  products,
  crmLeads,
  onAddOrder,
  onUpdateOrderStatus,
  onUpdateMilestoneStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<'ALL' | 'UK' | 'EU' | 'US' | 'AU'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedSector, setSelectedSector] = useState<ProductSector | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<BuyerSalesOrder | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'OVERVIEW' | 'MARGIN' | 'TNA' | 'AQL'>('OVERVIEW');

  // Filter calculations
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.soNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyerCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.linkedPo.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.linkedPo.factoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.masterLcNumber && order.masterLcNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.items.some((i) => i.styleName.toLowerCase().includes(searchQuery.toLowerCase()) || i.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMarket = selectedMarket === 'ALL' || order.targetMarket === selectedMarket;
    const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus;
    const matchesSector = selectedSector === 'ALL' || order.items.some((i) => i.sector === selectedSector);

    return matchesSearch && matchesMarket && matchesStatus && matchesSector;
  });

  // KPI Calculations
  const totalOrderValueUsd = orders.reduce((acc, curr) => acc + curr.totalAmountUsd, 0);
  const totalFactorySpendUsd = orders.reduce((acc, curr) => acc + curr.linkedPo.totalCostUsd, 0);
  const totalNetMarginUsd = orders.reduce((acc, curr) => acc + curr.marginProtection.netMarginUsd, 0);
  const averageMarginPct = (
    orders.reduce((acc, curr) => acc + curr.marginProtection.marginPercentage, 0) / (orders.length || 1)
  ).toFixed(1);
  const totalProductionUnits = orders.reduce((acc, curr) => acc + curr.totalQuantity, 0);
  const activeInProduction = orders.filter((o) => o.status === 'IN_PRODUCTION').length;
  const inInspection = orders.filter((o) => o.status === 'QUALITY_INSPECTION').length;
  const inOceanTransit = orders.filter((o) => o.status === 'SHIPPED_CHITTAGONG').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] shadow-md text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#C8A96A] font-mono text-xs font-semibold border border-white/20">
              PHASE 5: LIVE
            </span>
            <span className="text-xs text-white/80 font-mono">
              Two-Way Back-to-Back Order Synchronization Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 font-montserrat">
            <Repeat className="w-6 h-6 text-[#C8A96A]" />
            Two-Way Order Management (OMS)
          </h1>
          <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
            Synchronize Buyer Sales Orders (SO in GBP, USD, EUR, AUD) back-to-back with Bangladesh Factory Purchase Orders (PO in BDT/USD). Lock in gross margins, enforce Time & Action (T&A) milestones, and manage digital AQL inspections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#8A6D3B] text-[#1F3A2E] font-bold text-xs transition-all shadow-md font-montserrat"
          >
            <Plus className="w-4 h-4" />
            <span>Create Back-to-Back Order</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="text-[11px] text-[#6B7269] uppercase font-medium">Total Pipeline Value</div>
          <div className="text-xl font-bold font-mono text-[#1F3A2E] mt-0.5">
            ${totalOrderValueUsd.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#6B7269] mt-0.5">{orders.length} Active Orders</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="text-[11px] text-[#6B7269] uppercase font-medium">Total Factory POs</div>
          <div className="text-xl font-bold font-mono text-[#8A5A00] mt-0.5">
            ${totalFactorySpendUsd.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#6B7269] mt-0.5">BDT / USD Allocation</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="text-[11px] text-[#6B7269] uppercase font-medium flex items-center justify-between">
            <span>Net Gross Margin</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#14512C]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#14512C] mt-0.5">
            ${totalNetMarginUsd.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#14512C] font-mono mt-0.5 font-semibold">
            Avg {averageMarginPct}% Protected
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="text-[11px] text-[#6B7269] uppercase font-medium flex items-center justify-between">
            <span>In Fabrication</span>
            <span className="w-2 h-2 rounded-full bg-[#7A5508] animate-pulse" />
          </div>
          <div className="text-xl font-bold font-mono text-[#7A5508] mt-0.5">
            {activeInProduction} Orders
          </div>
          <div className="text-[10px] text-[#6B7269] mt-0.5">Active Sewing & Kilns</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="text-[11px] text-[#6B7269] uppercase font-medium">AQL QA Stage</div>
          <div className="text-xl font-bold font-mono text-[#4A2E7A] mt-0.5">
            {inInspection} Orders
          </div>
          <div className="text-[10px] text-[#4A2E7A] mt-0.5">Pre-Shipment FRI</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="text-[11px] text-[#6B7269] uppercase font-medium flex items-center justify-between">
            <span>Ocean / Air Transit</span>
            <Ship className="w-3.5 h-3.5 text-[#0369A1]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#0369A1] mt-0.5">
            {inOceanTransit} Orders
          </div>
          <div className="text-[10px] text-[#0369A1] mt-0.5">Ex-Chittagong Port</div>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#6B7269] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SO #, PO #, Buyer, Factory, Master L/C, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs text-[#1A1A1A] placeholder-[#6B7269] focus:outline-none focus:border-[#1F3A2E]"
            />
          </div>

          {/* Market Zone */}
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value as any)}
            className="px-3 py-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
          >
            <option value="ALL">All Target Zones</option>
            <option value="UK">🇬🇧 United Kingdom (GBP)</option>
            <option value="EU">🇪🇺 European Union (EUR)</option>
            <option value="US">🇺🇸 United States (USD)</option>
            <option value="AU">🇦🇺 Australia (AUD)</option>
          </select>

          {/* Sector */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value as any)}
            className="px-3 py-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
          >
            <option value="ALL">All Sectors</option>
            <option value="LEATHER">Leather Goods</option>
            <option value="JUTE">Jute Crafts</option>
            <option value="TEXTILE">Home Textiles</option>
            <option value="CERAMICS">Ceramics & Pottery</option>
          </select>

          {/* Order Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed / L/C Opened</option>
            <option value="IN_PRODUCTION">In Factory Production</option>
            <option value="QUALITY_INSPECTION">QA / AQL Inspection</option>
            <option value="READY_TO_SHIP">Ready to Ship</option>
            <option value="SHIPPED_CHITTAGONG">Shipped from Chittagong</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-[#DDE3DD] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#DDE3DD] bg-[#1F3A2E] text-[11px] font-semibold text-white uppercase tracking-wider font-montserrat">
                <th className="py-3.5 px-4">Sales Order (SO)</th>
                <th className="py-3.5 px-4">Buyer & Market</th>
                <th className="py-3.5 px-4">Items & Quantity</th>
                <th className="py-3.5 px-4">Factory PO Mirror</th>
                <th className="py-3.5 px-4">Order Value (Buyer)</th>
                <th className="py-3.5 px-4">Factory Cost</th>
                <th className="py-3.5 px-4">Locked Margin</th>
                <th className="py-3.5 px-4">Status & T&A</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE3DD] text-[#1A1A1A]">
              {filteredOrders.map((order) => {
                const statusCfg = ORDER_STATUS_CONFIG[order.status];
                const StatusIcon = statusCfg.icon;
                const completedTna = order.timeAndAction.filter((t) => t.status === 'COMPLETED').length;
                const totalTna = order.timeAndAction.length;
                const tnaProgressPct = Math.round((completedTna / (totalTna || 1)) * 100);

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-[#F7FAF8] transition-colors cursor-pointer group"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#1F3A2E]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#1F3A2E]">{order.soNumber}</span>
                        {order.inspections.length > 0 && (
                          <span
                            title="AQL Quality Inspection Certificate on File"
                            className="p-0.5 rounded bg-[#E4F3E9] text-[#14512C]"
                          >
                            <ShieldCheck className="w-3 h-3 inline" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#6B7269] block font-sans font-normal">
                        Ordered: {order.orderDate}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                        <span>{order.buyerCompany}</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#E8F0FA] text-[#17456F] border border-[#C5D7ED] font-mono text-[9px] font-bold">
                          {order.targetMarket}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6B7269] truncate max-w-[150px]">
                        {order.incoterm}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#1A1A1A]">
                        {order.items[0]?.styleName}
                      </div>
                      <div className="text-[10px] text-[#6B7269] font-mono">
                        {order.totalQuantity.toLocaleString()} pcs • {order.items[0]?.sector}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-[#8A5A00] text-[11px] font-bold">
                        {order.linkedPo.poNumber}
                      </div>
                      <div className="text-[10px] text-[#6B7269] truncate max-w-[160px]">
                        {order.linkedPo.factoryName.split('-')[0]}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-[#1F3A2E]">
                      <div>
                        {order.currency === 'GBP'
                          ? `£${order.totalAmountBuyerCurrency.toLocaleString()}`
                          : order.currency === 'EUR'
                          ? `€${order.totalAmountBuyerCurrency.toLocaleString()}`
                          : order.currency === 'AUD'
                          ? `A$${order.totalAmountBuyerCurrency.toLocaleString()}`
                          : `$${order.totalAmountBuyerCurrency.toLocaleString()}`}
                      </div>
                      <div className="text-[10px] text-[#6B7269] font-sans font-normal">
                        ≈ ${order.totalAmountUsd.toLocaleString()} USD
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="text-[#1A1A1A] font-medium">
                        ৳{(order.linkedPo.totalCostBdt / 100000).toFixed(1)} Lakh
                      </div>
                      <div className="text-[10px] text-[#6B7269]">
                        ${order.linkedPo.totalCostUsd.toLocaleString()} USD
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="text-[#14512C] font-bold">
                        ${order.marginProtection.netMarginUsd.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#14512C] font-sans font-semibold flex items-center gap-1">
                        <span>{order.marginProtection.marginPercentage}% Locked</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusCfg.label}</span>
                      </span>

                      {/* T&A progress bar */}
                      <div className="mt-1.5 w-28 bg-[#E8EDE8] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#1F3A2E] h-full rounded-full transition-all"
                          style={{ width: `${tnaProgressPct}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-[#6B7269] mt-0.5">
                        T&A: {completedTna}/{totalTna} Milestones ({tnaProgressPct}%)
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-300 text-[11px] transition-colors border border-slate-700"
                      >
                        Inspect OMS
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Way Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-[#090d1a] border-l border-slate-800 h-full overflow-y-auto flex flex-col justify-between p-6 shadow-2xl">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-mono text-sky-400 font-bold">
                      {selectedOrder.soNumber}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-base font-mono text-amber-400 font-bold">
                      {selectedOrder.linkedPo.poNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                      {selectedOrder.targetMarket}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    {selectedOrder.items[0]?.styleName}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Buyer: <span className="text-white font-medium">{selectedOrder.buyerCompany}</span> | Factory:{' '}
                    <span className="text-amber-300 font-medium">
                      {selectedOrder.linkedPo.factoryName}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Ribbon with Quick Advancers */}
              <div className="my-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Order State:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      ORDER_STATUS_CONFIG[selectedOrder.status].bg
                    } ${ORDER_STATUS_CONFIG[selectedOrder.status].text} ${
                      ORDER_STATUS_CONFIG[selectedOrder.status].border
                    }`}
                  >
                    {ORDER_STATUS_CONFIG[selectedOrder.status].label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedOrder.status === 'CONFIRMED' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(selectedOrder.id, 'IN_PRODUCTION');
                        setSelectedOrder({ ...selectedOrder, status: 'IN_PRODUCTION' });
                      }}
                      className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-[11px] transition-all"
                    >
                      Start Factory Production
                    </button>
                  )}

                  {selectedOrder.status === 'IN_PRODUCTION' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(selectedOrder.id, 'QUALITY_INSPECTION');
                        setSelectedOrder({ ...selectedOrder, status: 'QUALITY_INSPECTION' });
                      }}
                      className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-[11px] transition-all"
                    >
                      Schedule AQL Inspection
                    </button>
                  )}

                  {selectedOrder.status === 'QUALITY_INSPECTION' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(selectedOrder.id, 'READY_TO_SHIP');
                        setSelectedOrder({ ...selectedOrder, status: 'READY_TO_SHIP' });
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition-all"
                    >
                      Issue Quality Release Seal
                    </button>
                  )}

                  {selectedOrder.status === 'READY_TO_SHIP' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(selectedOrder.id, 'SHIPPED_CHITTAGONG');
                        setSelectedOrder({ ...selectedOrder, status: 'SHIPPED_CHITTAGONG' });
                      }}
                      className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-[11px] transition-all flex items-center gap-1"
                    >
                      <Ship className="w-3.5 h-3.5" />
                      <span>Depart Chittagong Port</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Drawer Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 text-xs mb-4">
                <button
                  onClick={() => setActiveDrawerTab('OVERVIEW')}
                  className={`pb-2 px-2 border-b-2 font-medium transition-all ${
                    activeDrawerTab === 'OVERVIEW'
                      ? 'border-sky-500 text-sky-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Two-Way Order Overview
                </button>
                <button
                  onClick={() => setActiveDrawerTab('MARGIN')}
                  className={`pb-2 px-2 border-b-2 font-medium transition-all ${
                    activeDrawerTab === 'MARGIN'
                      ? 'border-sky-500 text-sky-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Margin Protection ({selectedOrder.marginProtection.marginPercentage}%)
                </button>
                <button
                  onClick={() => setActiveDrawerTab('TNA')}
                  className={`pb-2 px-2 border-b-2 font-medium transition-all ${
                    activeDrawerTab === 'TNA'
                      ? 'border-sky-500 text-sky-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  T&A Critical Path ({selectedOrder.timeAndAction.length})
                </button>
                <button
                  onClick={() => setActiveDrawerTab('AQL')}
                  className={`pb-2 px-2 border-b-2 font-medium transition-all ${
                    activeDrawerTab === 'AQL'
                      ? 'border-sky-500 text-sky-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Digital QA & AQL ({selectedOrder.inspections.length})
                </button>
              </div>

              {/* Tab 1: Overview */}
              {activeDrawerTab === 'OVERVIEW' && (
                <div className="space-y-4 text-xs">
                  {/* Two-Way Comparison Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Buyer SO Card */}
                    <div className="p-3.5 rounded-xl bg-slate-900/70 border border-sky-900/40 space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                        <span className="font-mono text-sky-400 font-bold">
                          Buyer Sales Order (SO)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {selectedOrder.operatingEntity}
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-300">
                        <div>
                          <span className="text-slate-400">Buyer:</span> {selectedOrder.buyerCompany}
                        </div>
                        <div>
                          <span className="text-slate-400">Contact:</span> {selectedOrder.buyerContact}
                        </div>
                        <div>
                          <span className="text-slate-400">Incoterm:</span>{' '}
                          <span className="font-semibold text-white">{selectedOrder.incoterm}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Payment:</span> {selectedOrder.paymentTerms}
                        </div>
                        {selectedOrder.masterLcNumber && (
                          <div className="font-mono text-emerald-400">
                            <span className="text-slate-400 font-sans">Master L/C:</span>{' '}
                            {selectedOrder.masterLcNumber}
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-slate-800 flex justify-between font-bold text-white text-sm">
                          <span>Revenue:</span>
                          <span className="text-sky-300 font-mono">
                            ${selectedOrder.totalAmountUsd.toLocaleString()} USD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Factory PO Card */}
                    <div className="p-3.5 rounded-xl bg-slate-900/70 border border-amber-900/40 space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                        <span className="font-mono text-amber-400 font-bold">
                          Factory Purchase Order (PO)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Status: {selectedOrder.linkedPo.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-300">
                        <div>
                          <span className="text-slate-400">Factory:</span>{' '}
                          {selectedOrder.linkedPo.factoryName}
                        </div>
                        <div>
                          <span className="text-slate-400">Issue Date:</span>{' '}
                          {selectedOrder.linkedPo.issueDate}
                        </div>
                        <div>
                          <span className="text-slate-400">Ex-Factory Date:</span>{' '}
                          <span className="font-semibold text-white">
                            {selectedOrder.linkedPo.targetExFactoryDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Payment:</span>{' '}
                          {selectedOrder.linkedPo.paymentTerms}
                        </div>
                        {selectedOrder.linkedPo.backToBackLcNumber && (
                          <div className="font-mono text-amber-400">
                            <span className="text-slate-400 font-sans">B2B L/C:</span>{' '}
                            {selectedOrder.linkedPo.backToBackLcNumber}
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-slate-800 flex justify-between font-bold text-white text-sm">
                          <span>Factory Cost:</span>
                          <span className="text-amber-400 font-mono">
                            ${selectedOrder.linkedPo.totalCostUsd.toLocaleString()} USD
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">
                      Order Line Items & Unit Costing
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800 text-[10px]">
                          <th className="py-1.5">SKU / Style</th>
                          <th className="py-1.5 text-center">Sector</th>
                          <th className="py-1.5 text-right">Units</th>
                          <th className="py-1.5 text-right">Buyer Price</th>
                          <th className="py-1.5 text-right">Factory Cost</th>
                          <th className="py-1.5 text-right">Margin / Unit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {selectedOrder.items.map((item) => {
                          const unitMargin = item.unitPrice - item.factoryUnitCost / 120;
                          return (
                            <tr key={item.id}>
                              <td className="py-2">
                                <div className="font-medium text-white">{item.styleName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{item.sku}</div>
                              </td>
                              <td className="py-2 text-center">
                                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                                  {item.sector}
                                </span>
                              </td>
                              <td className="py-2 text-right font-mono font-medium text-white">
                                {item.quantity.toLocaleString()}
                              </td>
                              <td className="py-2 text-right font-mono text-sky-300">
                                ${item.unitPrice}
                              </td>
                              <td className="py-2 text-right font-mono text-amber-300">
                                ৳{item.factoryUnitCost.toLocaleString()}
                              </td>
                              <td className="py-2 text-right font-mono text-emerald-400 font-bold">
                                +${unitMargin.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Margin Protection */}
              {activeDrawerTab === 'MARGIN' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Total Buyer Invoiced Revenue:</span>
                      <span className="font-mono text-lg font-bold text-sky-400">
                        ${selectedOrder.marginProtection.buyerRevenueUsd.toLocaleString()} USD
                      </span>
                    </div>

                    <div className="space-y-2 pt-1 text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Factory Production Cost:</span>
                        <span className="font-mono text-amber-400">
                          - ${selectedOrder.marginProtection.factoryCostUsd.toLocaleString()} USD
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Ocean/Air Freight Allowance:</span>
                        <span className="font-mono text-slate-300">
                          - ${selectedOrder.marginProtection.freightAllowanceUsd.toLocaleString()} USD
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Testing & Compliance Reserve:</span>
                        <span className="font-mono text-slate-300">
                          - ${selectedOrder.marginProtection.complianceBufferUsd.toLocaleString()} USD
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-base font-bold">
                      <span className="text-white">Net ArielMC Gross Profit:</span>
                      <span className="font-mono text-emerald-400 text-lg">
                        +${selectedOrder.marginProtection.netMarginUsd.toLocaleString()} USD (
                        {selectedOrder.marginProtection.marginPercentage}%)
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-emerald-300 text-xs">
                        Margin Protection Status: LOCKED & VERIFIED
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Gross margin is above corporate hurdle rate of 20%. Price fluctuation risk is covered by back-to-back fixed L/C covenants with Bangladesh factories.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Time & Action (T&A) Calendar */}
              {activeDrawerTab === 'TNA' && (
                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">
                      Critical Path Progress:{' '}
                      <b className="text-white">
                        {selectedOrder.timeAndAction.filter((t) => t.status === 'COMPLETED').length}/
                        {selectedOrder.timeAndAction.length} Milestones
                      </b>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Target Ex-Factory: {selectedOrder.targetExFactoryDate}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedOrder.timeAndAction.map((m, idx) => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                          m.status === 'COMPLETED'
                            ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                            : m.status === 'ON_TRACK'
                            ? 'bg-sky-950/20 border-sky-800/50 text-slate-200'
                            : 'bg-slate-900/40 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <button
                            onClick={() => {
                              const newStatus =
                                m.status === 'COMPLETED' ? 'ON_TRACK' : 'COMPLETED';
                              onUpdateMilestoneStatus(selectedOrder.id, m.id, newStatus);
                              const updatedTna = selectedOrder.timeAndAction.map((t) =>
                                t.id === m.id ? { ...t, status: newStatus as any } : t
                              );
                              setSelectedOrder({ ...selectedOrder, timeAndAction: updatedTna });
                            }}
                            className={`mt-0.5 p-1 rounded-md transition-colors ${
                              m.status === 'COMPLETED'
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <div>
                            <div className="font-semibold text-white text-xs flex items-center gap-2">
                              <span>
                                {idx + 1}. {m.name}
                              </span>
                              <span className="font-mono text-[9px] px-1 rounded bg-slate-800 text-slate-400">
                                {m.code}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Responsible: <span className="text-slate-300">{m.responsibleParty}</span>
                            </div>
                            {m.notes && (
                              <div className="text-[10px] text-amber-300 mt-1 italic">
                                Note: {m.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="font-mono text-[11px] text-slate-200">
                            {m.actualDate || m.plannedDate}
                          </div>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                              m.status === 'COMPLETED'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : m.status === 'ON_TRACK'
                                ? 'bg-sky-500/20 text-sky-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {m.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Digital Quality Assurance & AQL */}
              {activeDrawerTab === 'AQL' && (
                <div className="space-y-4 text-xs">
                  {selectedOrder.inspections.length > 0 ? (
                    selectedOrder.inspections.map((insp) => (
                      <div
                        key={insp.id}
                        className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                              {insp.inspectionType.replace('_', ' ')} INSPECTION
                            </span>
                            <h3 className="font-bold text-white text-sm mt-1">
                              ISO 2859-1 Level II AQL Passed
                            </h3>
                          </div>
                          {insp.certificateNumber && (
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block font-mono">
                                Cert #
                              </span>
                              <span className="font-mono text-emerald-400 font-bold">
                                {insp.certificateNumber}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-slate-300">
                          <div>
                            <span className="text-slate-400">Auditor:</span> {insp.inspectorName}
                          </div>
                          <div>
                            <span className="text-slate-400">Inspection Date:</span>{' '}
                            {insp.inspectionDate}
                          </div>
                          <div>
                            <span className="text-slate-400">Sample Size:</span>{' '}
                            <span className="font-mono font-bold text-white">
                              {insp.sampleSizeUnits} units
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Sampling Standard:</span>{' '}
                            {insp.inspectionLevel}
                          </div>
                        </div>

                        {/* Defect Summary Grid */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center font-mono">
                          <div className="p-2 rounded bg-slate-950">
                            <div className="text-[10px] text-slate-400">Critical Allowed / Found</div>
                            <div className="text-sm font-bold text-white">
                              {insp.aqlStandard.criticalMaxAllowed} /{' '}
                              <span className="text-emerald-400">{insp.defectsFound.critical}</span>
                            </div>
                          </div>
                          <div className="p-2 rounded bg-slate-950">
                            <div className="text-[10px] text-slate-400">Major Allowed / Found</div>
                            <div className="text-sm font-bold text-white">
                              {insp.aqlStandard.majorMaxAllowed} /{' '}
                              <span className="text-amber-400">{insp.defectsFound.major}</span>
                            </div>
                          </div>
                          <div className="p-2 rounded bg-slate-950">
                            <div className="text-[10px] text-slate-400">Minor Allowed / Found</div>
                            <div className="text-sm font-bold text-white">
                              {insp.aqlStandard.minorMaxAllowed} /{' '}
                              <span className="text-slate-300">{insp.defectsFound.minor}</span>
                            </div>
                          </div>
                        </div>

                        {/* Defect Log */}
                        {insp.defectLog.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <span className="text-[10px] uppercase font-mono text-slate-400">
                              Logged Minor/Major Non-Conformances:
                            </span>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                              {insp.defectLog.map((def, idx) => (
                                <li key={idx}>
                                  {def.description} (Category: <b className="text-amber-400">{def.category}</b>, Count: {def.count})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
                      <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-slate-400">
                        No official AQL report filed yet. Production must reach at least 80% completion before scheduling Final Random Inspection (FRI).
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Order Value: <b className="text-white">${selectedOrder.totalAmountUsd.toLocaleString()}</b>
              </span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Order Creation Modal */}
      {isAddModalOpen && (
        <CreateOrderModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddOrder={(order) => {
            onAddOrder(order);
            setIsAddModalOpen(false);
          }}
          factories={factories}
          products={products}
          crmLeads={crmLeads}
        />
      )}
    </div>
  );
};

// ----------------------------------------------------------------------------
// Create Back-to-Back Order Modal
// ----------------------------------------------------------------------------

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (order: BuyerSalesOrder) => void;
  factories: SupplierFactory[];
  products: ProductItem[];
  crmLeads: CrmLead[];
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onAddOrder,
  factories,
  products,
  crmLeads,
}) => {
  const [buyerCompany, setBuyerCompany] = useState('');
  const [targetMarket, setTargetMarket] = useState<'UK' | 'EU' | 'US' | 'AU'>('UK');
  const [currency, setCurrency] = useState<'GBP' | 'USD' | 'EUR' | 'AUD'>('GBP');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(2500);
  const [buyerUnitPrice, setBuyerUnitPrice] = useState(45);
  const [factoryId, setFactoryId] = useState('');
  const [factoryUnitCostBdt, setFactoryUnitCostBdt] = useState(4200);
  const [incoterm, setIncoterm] = useState('FOB Chittagong Port');
  const [targetExFactoryDate, setTargetExFactoryDate] = useState('2026-12-10');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId) || products[0];
    const factory = factories.find((f) => f.id === factoryId) || factories[0];

    const newId = `so-${Date.now()}`;
    const soNumber = `SO-2026-${targetMarket}-${Math.floor(100 + Math.random() * 900)}`;
    const poNumber = `PO-2026-FAC-${Math.floor(100 + Math.random() * 900)}`;

    const totalBuyerCurrency = quantity * buyerUnitPrice;
    const fxToUsd = currency === 'GBP' ? 1.3 : currency === 'EUR' ? 1.09 : currency === 'AUD' ? 0.65 : 1.0;
    const totalUsd = Math.round(totalBuyerCurrency * fxToUsd);
    const totalCostBdt = quantity * factoryUnitCostBdt;
    const totalCostUsd = Math.round(totalCostBdt / 120);

    const freightAllowance = Math.round(totalUsd * 0.06);
    const complianceBuffer = Math.round(totalUsd * 0.02);
    const netMarginUsd = totalUsd - totalCostUsd - freightAllowance - complianceBuffer;
    const marginPct = Number(((netMarginUsd / totalUsd) * 100).toFixed(1));

    const newOrder: BuyerSalesOrder = {
      id: newId,
      soNumber,
      buyerCompany: buyerCompany || 'Global Sourcing Client',
      buyerContact: 'Lead Commercial Buyer',
      targetMarket,
      operatingEntity:
        targetMarket === 'UK'
          ? 'ARIEL_UK'
          : targetMarket === 'US'
          ? 'ARIEL_US'
          : targetMarket === 'EU'
          ? 'ARIEL_EU'
          : 'ARIEL_AU',
      currency,
      incoterm,
      status: 'CONFIRMED',
      orderDate: new Date().toISOString().split('T')[0],
      targetExFactoryDate,
      targetPortCutOffDate: '2026-12-18',
      targetDeliveryDate: '2027-01-20',
      paymentTerms: 'Confirmed Irrevocable L/C at Sight',
      masterLcNumber: `LC-${targetMarket}-${Math.floor(100000 + Math.random() * 900000)}`,
      totalQuantity: quantity,
      totalAmountBuyerCurrency: totalBuyerCurrency,
      totalAmountUsd: totalUsd,
      items: [
        {
          id: `item-${Date.now()}`,
          productId: prod.id,
          sku: prod.sku,
          styleName: prod.name,
          sector: prod.sector,
          quantity,
          unitPrice: buyerUnitPrice,
          totalPrice: totalBuyerCurrency,
          factoryUnitCost: factoryUnitCostBdt,
          factoryTotalCost: totalCostBdt,
        },
      ],
      linkedPo: {
        id: `po-${Date.now()}`,
        poNumber,
        factoryId: factory.id,
        factoryName: factory.name,
        currency: 'BDT',
        status: 'ISSUED',
        issueDate: new Date().toISOString().split('T')[0],
        targetExFactoryDate,
        totalQuantity: quantity,
        totalCostBdt,
        totalCostUsd,
        paymentTerms: 'Back-to-Back Letter of Credit (90 Days)',
        backToBackLcNumber: `B2B-DHK-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [
          {
            id: `item-${Date.now()}`,
            productId: prod.id,
            sku: prod.sku,
            styleName: prod.name,
            sector: prod.sector,
            quantity,
            unitPrice: buyerUnitPrice,
            totalPrice: totalBuyerCurrency,
            factoryUnitCost: factoryUnitCostBdt,
            factoryTotalCost: totalCostBdt,
          },
        ],
      },
      marginProtection: {
        buyerRevenueUsd: totalUsd,
        factoryCostUsd: totalCostUsd,
        freightAllowanceUsd: freightAllowance,
        complianceBufferUsd: complianceBuffer,
        netMarginUsd,
        marginPercentage: marginPct,
        status: marginPct >= 20 ? 'LOCKED_HEALTHY' : 'MARGIN_WARNING',
      },
      timeAndAction: [
        {
          id: `tna-${Date.now()}-1`,
          name: 'Master L/C Verification',
          code: 'LC_VERIFY',
          plannedDate: new Date().toISOString().split('T')[0],
          status: 'COMPLETED',
          responsibleParty: 'ArielMC Finance Team',
        },
        {
          id: `tna-${Date.now()}-2`,
          name: 'Raw Materials & Trims In-House',
          code: 'RAW_MAT_INHOUSE',
          plannedDate: '2026-11-05',
          status: 'ON_TRACK',
          responsibleParty: factory.name,
        },
        {
          id: `tna-${Date.now()}-3`,
          name: 'Bulk Production & In-line Assembly',
          code: 'BULK_SEWING',
          plannedDate: '2026-11-25',
          status: 'PENDING',
          responsibleParty: factory.name,
        },
        {
          id: `tna-${Date.now()}-4`,
          name: 'Final Random Inspection (FRI) AQL 2.5',
          code: 'FINAL_FRI',
          plannedDate: targetExFactoryDate,
          status: 'PENDING',
          responsibleParty: 'ArielMC QA Sourcing Team',
        },
        {
          id: `tna-${Date.now()}-5`,
          name: 'Chittagong Port Container Loading',
          code: 'PORT_CUTOFF',
          plannedDate: '2026-12-18',
          status: 'PENDING',
          responsibleParty: 'Ocean Logistics Carrier',
        },
      ],
      inspections: [],
    };

    onAddOrder(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">Create Two-Way Back-to-Back Order</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Buyer / Client Company</label>
              <input
                type="text"
                required
                placeholder="e.g. Harrods London, Zara Home, West Elm"
                value={buyerCompany}
                onChange={(e) => setBuyerCompany(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Target Market Zone</label>
              <select
                value={targetMarket}
                onChange={(e) => {
                  const m = e.target.value as any;
                  setTargetMarket(m);
                  setCurrency(m === 'UK' ? 'GBP' : m === 'EU' ? 'EUR' : m === 'AU' ? 'AUD' : 'USD');
                }}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="UK">🇬🇧 United Kingdom (GBP)</option>
                <option value="US">🇺🇸 United States (USD)</option>
                <option value="EU">🇪🇺 European Union (EUR)</option>
                <option value="AU">🇦🇺 Australia (AUD)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Select Master Product SKU</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="">Select Catalog SKU...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sku} - {p.name} ({p.sector})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Bangladesh Partner Factory (PO Mirror)</label>
              <select
                value={factoryId}
                onChange={(e) => setFactoryId(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="">Select Partner Factory...</option>
                {factories.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.cluster})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Order Quantity (Units)</label>
              <input
                type="number"
                min={100}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Buyer Price ({currency})</label>
              <input
                type="number"
                value={buyerUnitPrice}
                onChange={(e) => setBuyerUnitPrice(Number(e.target.value))}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Factory Cost (BDT ৳)</label>
              <input
                type="number"
                value={factoryUnitCostBdt}
                onChange={(e) => setFactoryUnitCostBdt(Number(e.target.value))}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Incoterms</label>
              <select
                value={incoterm}
                onChange={(e) => setIncoterm(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="FOB Chittagong Port">FOB Chittagong Port</option>
                <option value="CIF London Gateway">CIF London Gateway (UK)</option>
                <option value="CIF Rotterdam">CIF Rotterdam (EU)</option>
                <option value="DDP Los Angeles Hub">DDP Los Angeles Port (USA)</option>
                <option value="CIF Melbourne">CIF Melbourne Port (Australia)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Target Ex-Factory Date</label>
              <input
                type="date"
                value={targetExFactoryDate}
                onChange={(e) => setTargetExFactoryDate(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all shadow-lg shadow-sky-600/30"
            >
              Issue Back-to-Back SO & PO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
