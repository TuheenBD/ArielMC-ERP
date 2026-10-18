'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  BuyerSalesOrder,
  TimeAndActionMilestone,
  ProductSector,
  OrderStatus
} from '@/types/erp';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Filter,
  Search,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  Layers,
  ShieldCheck,
  Ship,
  Factory,
  Building2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  FileText,
  Check,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Info,
  CalendarDays,
  Kanban,
  Table,
  Zap
} from 'lucide-react';
import { ArielMC, renderBrandText } from '@/lib/brand';

interface TimeAndActionGanttCalendarProps {
  orders: BuyerSalesOrder[];
  onUpdateMilestoneStatus: (
    orderId: string,
    milestoneId: string,
    newStatus: 'COMPLETED' | 'ON_TRACK' | 'AT_RISK' | 'DELAYED'
  ) => void;
  selectedOrderId?: string | null;
  onSelectOrder?: (orderId: string | null) => void;
  onBackToOrders?: () => void;
}

type ViewMode = 'GANTT' | 'CALENDAR' | 'RISK_MATRIX' | 'TABLE';

const SECTOR_ICONS: Record<ProductSector, string> = {
  LEATHER: '💼', // Strictly Executive Briefcase
  JUTE: '🌿',
  CERAMICS: '🏺',
  TEXTILE: '🧵',
  POTTERY: '🪴'
};

const STATUS_BADGES: Record<
  TimeAndActionMilestone['status'],
  { label: string; bg: string; text: string; border: string; barBg: string }
> = {
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    text: 'text-emerald-700',
    border: 'border-emerald-500',
    barBg: 'bg-emerald-500'
  },
  ON_TRACK: {
    label: 'On Track',
    bg: 'bg-blue-50 text-blue-800 border-blue-200',
    text: 'text-blue-700',
    border: 'border-blue-500',
    barBg: 'bg-blue-500'
  },
  AT_RISK: {
    label: 'At Risk',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    text: 'text-amber-700',
    border: 'border-amber-500',
    barBg: 'bg-amber-500'
  },
  DELAYED: {
    label: 'Delayed',
    bg: 'bg-rose-50 text-rose-800 border-rose-200',
    text: 'text-rose-700',
    border: 'border-rose-500',
    barBg: 'bg-rose-500'
  },
  PENDING: {
    label: 'Pending',
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    text: 'text-slate-600',
    border: 'border-slate-400',
    barBg: 'bg-slate-400'
  }
};

export const TimeAndActionGanttCalendar: React.FC<TimeAndActionGanttCalendarProps> = ({
  orders,
  onUpdateMilestoneStatus,
  selectedOrderId = null,
  onSelectOrder,
  onBackToOrders
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('GANTT');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<ProductSector | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<TimeAndActionMilestone['status'] | 'ALL'>('ALL');
  const [activeOrderId, setActiveOrderId] = useState<string | 'ALL'>(selectedOrderId || 'ALL');
  const [selectedMilestone, setSelectedMilestone] = useState<{
    order: BuyerSalesOrder;
    milestone: TimeAndActionMilestone;
  } | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  // Sync active order if passed from outside
  React.useEffect(() => {
    if (selectedOrderId) {
      setActiveOrderId(selectedOrderId);
    }
  }, [selectedOrderId]);

  // Current ERP simulation date (October 18, 2026)
  const todayStr = '2026-10-18';
  const todayDate = useMemo(() => new Date(todayStr), [todayStr]);

  // Timeline Range calculation (spanning from mid-Sep 2026 to end-Jan 2027)
  const timelineStart = useMemo(() => new Date('2026-09-15'), []);
  const timelineEnd = useMemo(() => new Date('2027-01-20'), []);
  const totalTimelineDays = useMemo(
    () => Math.max(1, Math.round((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24))),
    [timelineStart, timelineEnd]
  );

  // Month markers for Gantt Header
  const months = useMemo(() => [
    { label: 'Sep 2026', start: new Date('2026-09-15'), end: new Date('2026-09-30'), days: 16 },
    { label: 'Oct 2026', start: new Date('2026-10-01'), end: new Date('2026-10-31'), days: 31 },
    { label: 'Nov 2026', start: new Date('2026-11-01'), end: new Date('2026-11-30'), days: 30 },
    { label: 'Dec 2026', start: new Date('2026-12-01'), end: new Date('2026-12-31'), days: 31 },
    { label: 'Jan 2027', start: new Date('2027-01-01'), end: new Date('2027-01-20'), days: 20 },
  ], []);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (activeOrderId !== 'ALL' && order.id !== activeOrderId) return false;
      const orderSector = order.items[0]?.sector;
      if (sectorFilter !== 'ALL' && orderSector !== sectorFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSo = order.soNumber.toLowerCase().includes(q);
        const matchBuyer = order.buyerCompany.toLowerCase().includes(q);
        const matchFactory = order.linkedPo.factoryName.toLowerCase().includes(q);
        const matchStyle = order.items.some(i => i.styleName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
        const matchMilestone = order.timeAndAction.some(m => m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q));
        if (!matchSo && !matchBuyer && !matchFactory && !matchStyle && !matchMilestone) return false;
      }

      if (statusFilter !== 'ALL') {
        const hasStatus = order.timeAndAction.some(m => m.status === statusFilter);
        if (!hasStatus) return false;
      }

      return true;
    });
  }, [orders, activeOrderId, sectorFilter, searchQuery, statusFilter]);

  // Overall Milestones Summary KPI
  const stats = useMemo(() => {
    let total = 0;
    let completed = 0;
    let onTrack = 0;
    let atRisk = 0;
    let delayed = 0;

    orders.forEach(o => {
      o.timeAndAction.forEach(m => {
        total++;
        if (m.status === 'COMPLETED') completed++;
        else if (m.status === 'ON_TRACK') onTrack++;
        else if (m.status === 'AT_RISK') atRisk++;
        else if (m.status === 'DELAYED') delayed++;
      });
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, onTrack, atRisk, delayed, completionRate };
  }, [orders]);

  // Helper to convert date to timeline percentage
  const getPercentFromDate = (dateStr?: string) => {
    if (!dateStr) return 0;
    const d = new Date(dateStr);
    const diff = (d.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    const pct = (diff / totalTimelineDays) * 100;
    return Math.min(100, Math.max(0, pct));
  };

  const todayPercent = getPercentFromDate(todayStr);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="printable-content space-y-6 animate-in fade-in duration-200">
      {/* Top Strategic Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1F3A2E] via-[#172D24] to-[#12231B] border-b-[3px] border-[#C8A96A] text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A] text-[#1F3A2E] font-mono text-[10px] font-bold uppercase tracking-wider">
              Production Execution &amp; Merchandising Calendar
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-mono text-[10px] font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C8A96A]" />
              Live Time &amp; Action (T&amp;A) Engine
            </span>
            <span className="text-[11px] text-gray-300 font-mono">
              Simulation Today: <strong className="text-white">{todayStr}</strong>
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <span>Time &amp; Action (T&amp;A) Production Gantt Calendar</span>
          </h1>

          <p className="text-xs text-gray-300 max-w-3xl leading-relaxed">
            Monitor and enforce the Critical Path for all <ArielMC /> export orders. Coordinate raw material staging, 
            lab dip testing, factory cutting/sewing, ISO 2859-1 AQL 1.5 final inspections, and ex-factory Chittagong Port cut-off dates.
          </p>
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0 no-print">
          {onBackToOrders && (
            <button
              onClick={onBackToOrders}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>Back to Orders List</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-[#C8A96A] font-bold text-xs border border-[#C8A96A]/60 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            title="Print T&A Master Schedule or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print T&amp;A Schedule</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-xs">
          <div className="text-[11px] font-semibold text-[#6B7269] uppercase">Total Milestones</div>
          <div className="text-xl font-bold font-mono text-[#1F3A2E] mt-0.5">{stats.total}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Across {orders.length} Active Orders</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Completed</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5">{stats.completed}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">{stats.completionRate}% of Roadmap</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-xs">
          <div className="text-[11px] font-semibold text-blue-700 uppercase">On Track</div>
          <div className="text-xl font-bold font-mono text-blue-700 mt-0.5">{stats.onTrack}</div>
          <div className="text-[10px] text-blue-600 mt-0.5">Within Target Windows</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-xs">
          <div className="text-[11px] font-semibold text-amber-700 uppercase flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>At Risk</span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-700 mt-0.5">{stats.atRisk}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Within 3d of Buffer</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-xs">
          <div className="text-[11px] font-semibold text-rose-700 uppercase flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Delayed</span>
          </div>
          <div className="text-xl font-bold font-mono text-rose-700 mt-0.5">{stats.delayed}</div>
          <div className="text-[10px] text-rose-600 font-semibold mt-0.5">Critical Path Breached</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-xs">
          <div className="text-[11px] font-semibold text-[#8A6D3B] uppercase">FOB Port Handover</div>
          <div className="text-xl font-bold font-mono text-[#1F3A2E] mt-0.5">100%</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Chittagong Vessel Safe</div>
        </div>
      </div>

      {/* Control Bar: View Switcher, Filter & Search */}
      <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-[#F4F6F4] p-1 rounded-xl border border-[#DDE3DD] w-full md:w-auto">
          <button
            onClick={() => setViewMode('GANTT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'GANTT'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Interactive Gantt</span>
          </button>

          <button
            onClick={() => setViewMode('CALENDAR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'CALENDAR'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Monthly Grid</span>
          </button>

          <button
            onClick={() => setViewMode('RISK_MATRIX')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'RISK_MATRIX'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Critical Path Risk</span>
          </button>

          <button
            onClick={() => setViewMode('TABLE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'TABLE'
                ? 'bg-[#1F3A2E] text-white shadow-xs'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Master Table</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-end">
          {/* Order Filter */}
          <select
            value={activeOrderId}
            onChange={(e) => {
              setActiveOrderId(e.target.value);
              if (onSelectOrder) {
                onSelectOrder(e.target.value === 'ALL' ? null : e.target.value);
              }
            }}
            className="h-9 text-xs border border-[#DDE3DD] rounded-lg px-2.5 bg-white text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1F3A2E] cursor-pointer"
          >
            <option value="ALL">All Active Orders ({orders.length})</option>
            {orders.map(o => (
              <option key={o.id} value={o.id}>
                {o.soNumber} — {o.buyerCompany} ({o.items[0]?.sector})
              </option>
            ))}
          </select>

          {/* Sector Filter */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value as any)}
            className="h-9 text-xs border border-[#DDE3DD] rounded-lg px-2.5 bg-white text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1F3A2E] cursor-pointer"
          >
            <option value="ALL">All Export Sectors</option>
            <option value="LEATHER">💼 Finished Leather Goods</option>
            <option value="JUTE">🌿 Diversified Jute</option>
            <option value="CERAMICS">🏺 Ceramics &amp; Tableware</option>
            <option value="TEXTILE">🧵 Handloom &amp; Home Textiles</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-9 text-xs border border-[#DDE3DD] rounded-lg px-2.5 bg-white text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1F3A2E] cursor-pointer"
          >
            <option value="ALL">All Milestone Statuses</option>
            <option value="COMPLETED">✓ Completed</option>
            <option value="ON_TRACK">🔵 On Track</option>
            <option value="AT_RISK">⚠️ At Risk</option>
            <option value="DELAYED">🚨 Delayed</option>
          </select>
        </div>
      </div>

      {/* Main Content Area Based on View Mode */}
      <div ref={printRef} className="space-y-6">
        {/* VIEW 1: INTERACTIVE GANTT TIMELINE */}
        {viewMode === 'GANTT' && (
          <div className="bg-white rounded-2xl border border-[#DDE3DD] shadow-sm p-5 space-y-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
              <div>
                <h2 className="text-sm md:text-base font-bold font-heading text-[#1F3A2E] flex items-center gap-2">
                  <Kanban className="w-4 h-4 text-[#C8A96A]" />
                  <span>Production Progress Gantt Chart</span>
                </h2>
                <p className="text-[11px] text-gray-500">
                  Real-time timeline tracking across raw material staging, fabrication, AQL inspections, and Chittagong Port loading.
                </p>
              </div>

              {/* Legend */}
              <div className="hidden lg:flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>On Track</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>At Risk</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Delayed</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 border-l-2 border-rose-600 border-dashed" />
                  <span className="text-rose-600 font-bold">Today ({todayStr})</span>
                </div>
              </div>
            </div>

            {/* Gantt Container (Horizontal Scroll for Responsive) */}
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[950px] space-y-6">
                {/* Gantt Timeline Header */}
                <div className="flex items-center border-b-2 border-[#1F3A2E] pb-2 text-xs font-mono font-bold text-[#1F3A2E]">
                  <div className="w-[280px] shrink-0 font-heading text-sm">
                    Order Details &amp; Milestone Phases
                  </div>
                  <div className="flex-1 relative flex">
                    {months.map(m => (
                      <div
                        key={m.label}
                        style={{ width: `${(m.days / totalTimelineDays) * 100}%` }}
                        className="text-center border-l border-gray-200 px-1 truncate"
                      >
                        {m.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Orders Gantt Rows */}
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 font-medium">
                    No orders match your filter criteria.
                  </div>
                ) : (
                  filteredOrders.map(order => {
                    const sector = order.items[0]?.sector || 'LEATHER';
                    const orderStartPct = getPercentFromDate(order.orderDate);
                    const orderEndPct = getPercentFromDate(order.targetDeliveryDate);
                    const orderWidthPct = Math.max(2, orderEndPct - orderStartPct);

                    return (
                      <div
                        key={order.id}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 transition-colors hover:border-[#C8A96A]"
                      >
                        {/* Order Master Summary Row */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{SECTOR_ICONS[sector] || '📦'}</span>
                            <div>
                              <div className="font-bold font-heading text-[#1F3A2E] flex items-center gap-1.5">
                                <span>{order.soNumber}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-slate-700">{order.buyerCompany}</span>
                                <span className="px-1.5 py-0.2 rounded bg-white border text-[10px] font-mono text-[#8A6D3B]">
                                  {order.items[0]?.styleName}
                                </span>
                              </div>
                              <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5">
                                <span>Factory: <strong className="text-slate-800">{order.linkedPo.factoryName}</strong></span>
                                <span>•</span>
                                <span>Qty: <strong>{order.totalQuantity.toLocaleString()} pcs</strong></span>
                                <span>•</span>
                                <span>Incoterm: <strong>{order.incoterm}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-right">
                            <div>
                              <span className="text-[10px] text-gray-500 block">Ex-Factory Cut-Off</span>
                              <span className="font-mono font-bold text-slate-900">{order.targetExFactoryDate}</span>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-[#1F3A2E] text-[#C8A96A] text-[10px] font-bold font-mono">
                              ${order.totalAmountUsd.toLocaleString()} USD
                            </span>
                          </div>
                        </div>

                        {/* Overall Order Progress Bar in Timeline */}
                        <div className="flex items-center text-xs">
                          <div className="w-[280px] shrink-0 text-[11px] text-gray-500 font-mono">
                            Order Lifecycle Timeline
                          </div>
                          <div className="flex-1 relative h-6 bg-slate-200 rounded-md overflow-hidden flex items-center">
                            {/* Today Vertical Line */}
                            <div
                              style={{ left: `${todayPercent}%` }}
                              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-20 pointer-events-none"
                              title={`Current Date: ${todayStr}`}
                            />

                            {/* Order Bar */}
                            <div
                              style={{
                                left: `${orderStartPct}%`,
                                width: `${orderWidthPct}%`
                              }}
                              className="absolute h-4 rounded bg-gradient-to-r from-[#1F3A2E] to-[#2C5240] text-white flex items-center justify-between px-2 text-[9px] font-mono shadow-xs truncate z-10"
                            >
                              <span>{order.orderDate}</span>
                              <span className="font-bold">Target Port: {order.targetPortCutOffDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Individual Milestones for this Order */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-200">
                          {order.timeAndAction.map((milestone, idx) => {
                            const dateStr = milestone.actualDate || milestone.plannedDate;
                            const milestonePct = getPercentFromDate(dateStr);
                            const badge = STATUS_BADGES[milestone.status] || STATUS_BADGES.PENDING;

                            return (
                              <div
                                key={milestone.id}
                                onClick={() => setSelectedMilestone({ order, milestone })}
                                className="flex items-center text-xs py-1 px-2 rounded-lg hover:bg-white hover:shadow-xs transition-all cursor-pointer group"
                              >
                                {/* Milestone Title & Responsible Party */}
                                <div className="w-[280px] shrink-0 pr-3 flex items-center justify-between">
                                  <div className="min-w-0 pr-2">
                                    <div className="font-semibold text-slate-800 text-[11px] truncate group-hover:text-[#1F3A2E]">
                                      {idx + 1}. {milestone.name}
                                    </div>
                                    <div className="text-[9.5px] text-gray-500 truncate">
                                      Resp: {milestone.responsibleParty}
                                    </div>
                                  </div>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 border ${badge.bg}`}
                                  >
                                    {badge.label}
                                  </span>
                                </div>

                                {/* Milestone Timeline Plot */}
                                <div className="flex-1 relative h-6 flex items-center">
                                  {/* Today Marker Line */}
                                  <div
                                    style={{ left: `${todayPercent}%` }}
                                    className="absolute top-0 bottom-0 w-0.5 bg-rose-500/30 z-0 pointer-events-none"
                                  />

                                  {/* Milestone Dot / Pill */}
                                  <div
                                    style={{ left: `${milestonePct}%` }}
                                    className={`absolute -translate-x-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-white text-[9px] font-mono font-bold shadow-sm z-10 transition-transform group-hover:scale-105 ${badge.barBg}`}
                                    title={`${milestone.name} (${dateStr}) — ${milestone.status}`}
                                  >
                                    <span>{milestone.code}</span>
                                    <span>•</span>
                                    <span>{dateStr.slice(5)}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: MONTHLY PRODUCTION GRID */}
        {viewMode === 'CALENDAR' && (
          <div className="bg-white rounded-2xl border border-[#DDE3DD] shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDE3DD]">
              <div>
                <h2 className="text-base font-bold font-heading text-[#1F3A2E] flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#C8A96A]" />
                  <span>Production Calendar: October – November 2026</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Critical milestone deadlines, inline inspections, and ex-factory dispatches categorized by target date.
                </p>
              </div>
            </div>

            {/* Calendar Event Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.flatMap(order =>
                order.timeAndAction.map(m => ({
                  order,
                  milestone: m,
                  dateStr: m.actualDate || m.plannedDate
                }))
              )
              .sort((a, b) => new Date(a.dateStr).getTime() - new Date(b.dateStr).getTime())
              .map(({ order, milestone, dateStr }) => {
                const badge = STATUS_BADGES[milestone.status] || STATUS_BADGES.PENDING;
                const isPast = new Date(dateStr) < todayDate;

                return (
                  <div
                    key={`${order.id}-${milestone.id}`}
                    onClick={() => setSelectedMilestone({ order, milestone })}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#C8A96A] hover:shadow-md transition-all cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-[#1F3A2E] text-white text-[10px] font-mono font-bold">
                        {dateStr}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-[#1F3A2E] font-heading line-clamp-1">
                        {milestone.name}
                      </h4>
                      <p className="text-xs text-slate-700 font-medium">
                        {order.buyerCompany} ({order.soNumber})
                      </p>
                    </div>

                    <div className="text-[11px] text-gray-600 space-y-1 pt-1 border-t border-slate-200">
                      <div>
                        Responsible: <span className="font-semibold text-slate-800">{milestone.responsibleParty}</span>
                      </div>
                      <div>
                        Factory: <span className="font-semibold text-slate-800">{order.linkedPo.factoryName}</span>
                      </div>
                      {milestone.notes && (
                        <div className="text-[10px] italic text-[#8A5A00]">
                          Note: {milestone.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: CRITICAL PATH RISK MATRIX */}
        {viewMode === 'RISK_MATRIX' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h3 className="font-bold text-sm text-amber-900">
                  Critical Path Early Warning System (CPEWS)
                </h3>
                <p className="leading-relaxed">
                  The Critical Path detects upstream delay dependencies that threaten the contractual <strong>FOB Chittagong Port Cut-Off</strong> or <strong>Incoterm Delivery Date</strong>. 
                  Any milestone delayed by &gt; 3 days triggers automated alerts to the ArielMC Lead Merchandiser and Factory Compliance Director.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map(order => {
                const delayedItems = order.timeAndAction.filter(m => m.status === 'DELAYED' || m.status === 'AT_RISK');
                const completedCount = order.timeAndAction.filter(m => m.status === 'COMPLETED').length;
                const progressPct = Math.round((completedCount / order.timeAndAction.length) * 100);

                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base">{SECTOR_ICONS[order.items[0]?.sector || 'LEATHER']}</span>
                          <span className="font-bold text-sm text-[#1F3A2E] font-heading">{order.soNumber}</span>
                          <span className="text-xs text-gray-500 font-medium">({order.buyerCompany})</span>
                        </div>
                        <span className="text-[10px] text-gray-500">
                          Factory: {order.linkedPo.factoryName}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-500 block">Progress</span>
                        <span className="font-bold text-sm font-mono text-[#1F3A2E]">
                          {progressPct}% Done
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        style={{ width: `${progressPct}%` }}
                        className={`h-full rounded-full transition-all ${
                          delayedItems.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>

                    {/* Delayed / At-Risk Milestones */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Critical Milestone Health:
                      </div>

                      {delayedItems.length === 0 ? (
                        <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>All production milestones are within contractual safe zones.</span>
                        </div>
                      ) : (
                        delayedItems.map(m => (
                          <div
                            key={m.id}
                            onClick={() => setSelectedMilestone({ order, milestone: m })}
                            className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs flex items-center justify-between cursor-pointer hover:bg-rose-100/70 transition-colors"
                          >
                            <div>
                              <div className="font-bold text-rose-900">{m.name}</div>
                              <div className="text-[10px] text-rose-700 font-mono">
                                Target Date: {m.plannedDate} • Resp: {m.responsibleParty}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] font-bold">
                              {m.status}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: MASTER T&A DATA TABLE */}
        {viewMode === 'TABLE' && (
          <div className="bg-white rounded-2xl border border-[#DDE3DD] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#DDE3DD] flex items-center justify-between">
              <h2 className="text-sm font-bold font-heading text-[#1F3A2E]">
                Master Production Milestone Ledger
              </h2>
              <span className="text-xs text-gray-500 font-mono">
                Showing {filteredOrders.flatMap(o => o.timeAndAction).length} Total Milestones
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1F3A2E] text-white uppercase text-[10px] font-semibold tracking-wider">
                  <tr>
                    <th className="p-3.5">SO Number</th>
                    <th className="p-3.5">Buyer &amp; Sector</th>
                    <th className="p-3.5">Milestone Name</th>
                    <th className="p-3.5">Code</th>
                    <th className="p-3.5">Target Date</th>
                    <th className="p-3.5">Actual Date</th>
                    <th className="p-3.5">Responsible Party</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3DD]">
                  {filteredOrders.flatMap(order =>
                    order.timeAndAction.map(m => {
                      const badge = STATUS_BADGES[m.status] || STATUS_BADGES.PENDING;
                      const sector = order.items[0]?.sector || 'LEATHER';

                      return (
                        <tr
                          key={`${order.id}-${m.id}`}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-3.5 font-bold font-mono text-[#1F3A2E]">
                            {order.soNumber}
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                              <span>{SECTOR_ICONS[sector]}</span>
                              <span>{order.buyerCompany}</span>
                            </div>
                            <div className="text-[10px] text-gray-500 truncate max-w-[140px]">
                              {order.items[0]?.styleName}
                            </div>
                          </td>
                          <td className="p-3.5 font-medium text-slate-900">
                            {m.name}
                          </td>
                          <td className="p-3.5 font-mono text-gray-500">
                            {m.code}
                          </td>
                          <td className="p-3.5 font-mono text-slate-800">
                            {m.plannedDate}
                          </td>
                          <td className="p-3.5 font-mono text-slate-800">
                            {m.actualDate || '—'}
                          </td>
                          <td className="p-3.5 text-gray-600">
                            {m.responsibleParty}
                          </td>
                          <td className="p-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold border ${badge.bg}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => {
                                const nextStatus =
                                  m.status === 'COMPLETED' ? 'ON_TRACK' : 'COMPLETED';
                                onUpdateMilestoneStatus(order.id, m.id, nextStatus as any);
                              }}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                                m.status === 'COMPLETED'
                                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {m.status === 'COMPLETED' ? 'Mark Active' : 'Mark Done'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Milestone Detail & Action Drawer Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
            {/* Modal Header */}
            <div className="p-4 bg-[#1F3A2E] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#C8A96A] uppercase font-bold tracking-wider">
                  Milestone Inspector
                </span>
                <h3 className="font-bold text-base font-heading">
                  {selectedMilestone.milestone.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Sales Order</span>
                  <span className="font-bold text-[#1F3A2E]">{selectedMilestone.order.soNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Buyer Company</span>
                  <span className="font-bold text-slate-900">{selectedMilestone.order.buyerCompany}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Milestone Code</span>
                  <span className="font-mono font-bold text-slate-800">{selectedMilestone.milestone.code}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Responsible Party</span>
                  <span className="font-semibold text-slate-800">{selectedMilestone.milestone.responsibleParty}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                    Planned Target Date:
                  </label>
                  <input
                    type="date"
                    defaultValue={selectedMilestone.milestone.plannedDate}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                    Actual Completion Date:
                  </label>
                  <input
                    type="date"
                    defaultValue={selectedMilestone.milestone.actualDate || todayStr}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 uppercase font-bold block">
                  Update Production Status:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['COMPLETED', 'ON_TRACK', 'AT_RISK', 'DELAYED'] as const).map(st => {
                    const badge = STATUS_BADGES[st];
                    const isCurrent = selectedMilestone.milestone.status === st;

                    return (
                      <button
                        key={st}
                        onClick={() => {
                          onUpdateMilestoneStatus(selectedMilestone.order.id, selectedMilestone.milestone.id, st);
                          setSelectedMilestone({
                            ...selectedMilestone,
                            milestone: { ...selectedMilestone.milestone, status: st }
                          });
                        }}
                        className={`p-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer text-center ${
                          isCurrent
                            ? `${badge.bg} ring-2 ring-[#1F3A2E]`
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {badge.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                  Merchandiser QA &amp; Status Notes:
                </label>
                <textarea
                  rows={2}
                  defaultValue={selectedMilestone.milestone.notes || ''}
                  placeholder="Enter remarks, delay reasons, or lab dip references..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedMilestone(null)}
                className="px-4 py-2 rounded-xl bg-[#1F3A2E] text-white font-bold text-xs hover:bg-[#2C5240] transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
