'use client';

import React, { useState } from 'react';
import {
  SampleDevelopmentOrder,
  SampleStage,
  SampleStatus,
  ProductSector,
  SupplierFactory,
  ProductItem,
  CrmLead,
  CourierProvider,
} from '@/types/erp';
import {
  FlaskConical,
  Search,
  Filter,
  Plus,
  Truck,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  FileText,
  DollarSign,
  Layers,
  ChevronRight,
  X,
  Send,
  Plane,
  Eye,
  Sparkles,
  ClipboardCheck,
  RefreshCw,
  Building2,
  Calendar,
  Tag,
  ShieldCheck,
  SlidersHorizontal,
  LayoutGrid,
  List,
} from 'lucide-react';

interface SampleManagementProps {
  samples: SampleDevelopmentOrder[];
  factories: SupplierFactory[];
  products: ProductItem[];
  crmLeads: CrmLead[];
  onAddSample: (newSample: SampleDevelopmentOrder) => void;
  onUpdateSampleStatus: (sdoId: string, newStatus: SampleStatus, feedbackComments?: string) => void;
  onAdvanceSampleStage: (sdoId: string, nextStage: SampleStage) => void;
}

const STAGE_CONFIG: Record<
  SampleStage,
  { label: string; desc: string; badgeColor: string; order: number }
> = {
  PROTO: {
    label: 'Proto (1st Fit)',
    desc: 'Pattern & initial mould feasibility test',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    order: 1,
  },
  FIT: {
    label: 'Fit & Styling',
    desc: 'Measurement, contour, and aesthetic adjustments',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    order: 2,
  },
  SIZE_SET: {
    label: 'Size Set / Range',
    desc: 'Full grading specs and multi-dimension fit check',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    order: 3,
  },
  PP: {
    label: 'Pre-Production (PP)',
    desc: 'Gatekeeper sample with final trims before bulk cutting/firing',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    order: 4,
  },
  TOP: {
    label: 'Top of Production (TOP)',
    desc: 'Pulled from initial 10% mass run for pre-shipment sign-off',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    order: 5,
  },
};

const STATUS_CONFIG: Record<
  SampleStatus,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  DRAFT: {
    label: 'Draft',
    bg: 'bg-slate-800/60',
    text: 'text-slate-400',
    border: 'border-slate-700/60',
    icon: Clock,
  },
  TECH_PACK_SENT: {
    label: 'Tech Pack Sent',
    bg: 'bg-blue-950/40',
    text: 'text-blue-400',
    border: 'border-blue-800/60',
    icon: Send,
  },
  IN_FABRICATION: {
    label: 'In Fabrication',
    bg: 'bg-amber-950/40',
    text: 'text-amber-400',
    border: 'border-amber-800/60',
    icon: FlaskConical,
  },
  INTERNAL_QA_PASSED: {
    label: 'QA Passed (Dhaka)',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-400',
    border: 'border-emerald-800/60',
    icon: ClipboardCheck,
  },
  DISPATCHED: {
    label: 'Dispatched (In Transit)',
    bg: 'bg-cyan-950/40',
    text: 'text-cyan-400',
    border: 'border-cyan-800/60',
    icon: Plane,
  },
  DELIVERED_TO_BUYER: {
    label: 'Delivered to Buyer',
    bg: 'bg-purple-950/40',
    text: 'text-purple-400',
    border: 'border-purple-800/60',
    icon: Truck,
  },
  APPROVED: {
    label: 'Buyer Approved',
    bg: 'bg-emerald-900/40',
    text: 'text-emerald-300',
    border: 'border-emerald-500/50',
    icon: CheckCircle2,
  },
  APPROVED_WITH_COMMENTS: {
    label: 'Approved w/ Notes',
    bg: 'bg-teal-950/40',
    text: 'text-teal-300',
    border: 'border-teal-700/60',
    icon: CheckCircle2,
  },
  REVISION_REQUIRED: {
    label: 'Revision Required',
    bg: 'bg-rose-950/40',
    text: 'text-rose-400',
    border: 'border-rose-800/60',
    icon: AlertCircle,
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-red-950/40',
    text: 'text-red-400',
    border: 'border-red-800/60',
    icon: X,
  },
};

export const SampleManagement: React.FC<SampleManagementProps> = ({
  samples,
  factories,
  products,
  crmLeads,
  onAddSample,
  onUpdateSampleStatus,
  onAdvanceSampleStage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<ProductSector | 'ALL'>('ALL');
  const [selectedStage, setSelectedStage] = useState<SampleStage | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<SampleStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('TABLE');
  const [selectedSample, setSelectedSample] = useState<SampleDevelopmentOrder | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'TECHPACK' | 'COURIER' | 'COSTING' | 'FEEDBACK'>('TECHPACK');

  // New feedback state
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackVerdict, setFeedbackVerdict] = useState<'APPROVED' | 'APPROVED_WITH_COMMENTS' | 'REVISE_SAMPLE' | 'REJECTED'>('APPROVED');

  // Filter calculations
  const filteredSamples = samples.filter((sample) => {
    const matchesSearch =
      sample.sdoNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.styleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.buyerCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.factoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sample.courier?.awbNumber && sample.courier.awbNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSector = selectedSector === 'ALL' || sample.sector === selectedSector;
    const matchesStage = selectedStage === 'ALL' || sample.stage === selectedStage;
    const matchesStatus = selectedStatus === 'ALL' || sample.status === selectedStatus;

    return matchesSearch && matchesSector && matchesStage && matchesStatus;
  });

  // KPI calculations
  const totalSamples = samples.length;
  const inFabrication = samples.filter((s) => s.status === 'IN_FABRICATION').length;
  const inTransit = samples.filter(
    (s) => s.status === 'DISPATCHED' || s.status === 'INTERNAL_QA_PASSED'
  ).length;
  const awaitingFeedback = samples.filter(
    (s) => s.status === 'DELIVERED_TO_BUYER'
  ).length;
  const approvedCount = samples.filter(
    (s) => s.status === 'APPROVED' || s.status === 'APPROVED_WITH_COMMENTS'
  ).length;
  const totalSpendUsd = samples.reduce((acc, curr) => acc + curr.costing.totalCostUsd, 0);

  // Grouping for Kanban
  const kanbanColumns = [
    {
      id: 'FABRICATION',
      title: 'Draft & Fabrication',
      statuses: ['DRAFT', 'TECH_PACK_SENT', 'IN_FABRICATION'] as SampleStatus[],
      color: 'border-amber-500/40 bg-amber-500/5',
    },
    {
      id: 'QA',
      title: 'Dhaka Lab QA Passed',
      statuses: ['INTERNAL_QA_PASSED'] as SampleStatus[],
      color: 'border-emerald-500/40 bg-emerald-500/5',
    },
    {
      id: 'TRANSIT',
      title: 'Courier In Transit',
      statuses: ['DISPATCHED', 'DELIVERED_TO_BUYER'] as SampleStatus[],
      color: 'border-cyan-500/40 bg-cyan-500/5',
    },
    {
      id: 'REVIEW',
      title: 'Buyer Review & Revision',
      statuses: ['REVISION_REQUIRED'] as SampleStatus[],
      color: 'border-purple-500/40 bg-purple-500/5',
    },
    {
      id: 'APPROVED',
      title: 'Buyer Approved',
      statuses: ['APPROVED', 'APPROVED_WITH_COMMENTS'] as SampleStatus[],
      color: 'border-emerald-500/40 bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-mono text-xs font-semibold border border-purple-500/30">
              PHASE 3: LIVE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Export R&D, Tech Packs & Sampling Protocol
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FlaskConical className="w-6 h-6 text-purple-400" />
            Sample Development Orders (SDO)
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Control the 5-stage sampling lifecycle from Proto pattern testing to Pre-Production (PP) gatekeeping and Top of Production (TOP) sign-off. Track international DHL/FedEx courier tracking and buyer feedback revisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create New SDO</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400">Total Active SDOs</div>
          <div className="text-xl font-bold font-mono text-white mt-0.5">{totalSamples}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across 4 Sectors</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>In Fabrication</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{inFabrication}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">At BD Factory Floors</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>In Transit (Air)</span>
            <Plane className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{inTransit}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">DHL & FedEx Express</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400">Awaiting Feedback</div>
          <div className="text-xl font-bold font-mono text-purple-300 mt-0.5">{awaitingFeedback}</div>
          <div className="text-[10px] text-purple-400 mt-0.5">With Global Buyers</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400">Buyer Approved</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{approvedCount}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Ready for Bulk PO</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400">R&D Expenditure</div>
          <div className="text-xl font-bold font-mono text-white mt-0.5">
            ${totalSpendUsd.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Samples + Airfreight</div>
        </div>
      </div>

      {/* 5-Stage Lifecycle Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> Stage Filter:
        </span>
        <button
          onClick={() => setSelectedStage('ALL')}
          className={`px-3 py-1.5 rounded-lg border font-mono transition-all ${
            selectedStage === 'ALL'
              ? 'bg-purple-600 text-white border-purple-500 font-semibold'
              : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          All Stages ({samples.length})
        </button>
        {(['PROTO', 'FIT', 'SIZE_SET', 'PP', 'TOP'] as SampleStage[]).map((stage) => {
          const cfg = STAGE_CONFIG[stage];
          const count = samples.filter((s) => s.stage === stage).length;
          const isSelected = selectedStage === stage;
          return (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                isSelected
                  ? `${cfg.badgeColor} border-current font-semibold shadow-md`
                  : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span>{cfg.label}</span>
              <span className="text-[10px] font-mono px-1 rounded bg-black/40">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SDO #, Style Code, Buyer, Factory, AWB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Sector Filter */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value as any)}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Sectors</option>
            <option value="LEATHER">Leather Goods</option>
            <option value="JUTE">Jute Crafts</option>
            <option value="TEXTILE">Home Textiles</option>
            <option value="CERAMICS">Ceramics & Pottery</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_FABRICATION">In Fabrication</option>
            <option value="INTERNAL_QA_PASSED">QA Passed (Dhaka)</option>
            <option value="DISPATCHED">Dispatched (Air)</option>
            <option value="DELIVERED_TO_BUYER">Delivered to Buyer</option>
            <option value="APPROVED">Buyer Approved</option>
            <option value="REVISION_REQUIRED">Revision Required</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('TABLE')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-all ${
              viewMode === 'TABLE'
                ? 'bg-purple-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode('KANBAN')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-all ${
              viewMode === 'KANBAN'
                ? 'bg-purple-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Pipeline</span>
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'TABLE' ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">SDO Number</th>
                  <th className="py-3 px-4">Style & Sector</th>
                  <th className="py-3 px-4">Partner Factory</th>
                  <th className="py-3 px-4">Buyer & Market</th>
                  <th className="py-3 px-4">Stage & Round</th>
                  <th className="py-3 px-4">Courier / AWB</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Cost (USD)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredSamples.map((sample) => {
                  const statusCfg = STATUS_CONFIG[sample.status];
                  const stageCfg = STAGE_CONFIG[sample.stage];
                  const StatusIcon = statusCfg.icon;

                  return (
                    <tr
                      key={sample.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => setSelectedSample(sample)}
                    >
                      <td className="py-3 px-4 font-mono font-medium text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{sample.sdoNumber}</span>
                          {sample.feedbacks.length > 0 && (
                            <span
                              title={`${sample.feedbacks.length} Feedback logged`}
                              className="w-2 h-2 rounded-full bg-purple-400"
                            />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block font-sans">
                          Req: {sample.requestDate}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                          {sample.styleName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                          <span>{sample.styleCode}</span>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            {sample.sector}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-200 text-xs font-medium">
                          {sample.factoryName.split('-')[0]}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Due: {sample.targetDeliveryDate}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-white flex items-center gap-1">
                          <span>{sample.buyerCompany}</span>
                          <span className="px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono text-[9px] border border-blue-500/30">
                            {sample.targetMarket}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                          {sample.buyerContact.split('(')[0]}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${stageCfg.badgeColor}`}
                        >
                          {sample.stage}
                          <span className="text-[9px] opacity-75">(R{sample.roundNumber})</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {sample.courier ? (
                          <div>
                            <div className="flex items-center gap-1 font-mono text-cyan-300 text-[11px]">
                              <span>{sample.courier.courier.split(' ')[0]}</span>
                              <span className="text-slate-400">•</span>
                              <span className="truncate max-w-[100px]">{sample.courier.awbNumber}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                              {sample.courier.transitStatus.replace('_', ' ')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No AWB yet</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusCfg.label}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <div className="text-white font-medium">
                          ${sample.costing.totalCostUsd}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {sample.costing.billingParty.split('_')[0]}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSample(sample);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 text-[11px] transition-colors border border-slate-700"
                        >
                          Inspect SDO
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Pipeline View */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {kanbanColumns.map((col) => {
            const colSamples = filteredSamples.filter((s) => col.statuses.includes(s.status));
            return (
              <div
                key={col.id}
                className={`p-3 rounded-xl border ${col.color} bg-slate-950/40 flex flex-col min-h-[500px]`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <span className="text-xs font-semibold text-slate-200">{col.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {colSamples.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colSamples.map((sample) => {
                    const stageCfg = STAGE_CONFIG[sample.stage];
                    return (
                      <div
                        key={sample.id}
                        onClick={() => setSelectedSample(sample)}
                        className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/60 transition-all cursor-pointer shadow hover:shadow-purple-500/10 space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-purple-400 font-semibold">
                            {sample.sdoNumber}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${stageCfg.badgeColor}`}
                          >
                            {sample.stage} R{sample.roundNumber}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                          {sample.styleName}
                        </div>

                        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                          <span className="truncate max-w-[110px]">{sample.buyerCompany}</span>
                          <span className="text-emerald-400 font-mono">${sample.costing.totalCostUsd}</span>
                        </div>

                        {sample.courier && (
                          <div className="text-[9px] font-mono text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-800/40 flex items-center justify-between">
                            <span>{sample.courier.courier.split(' ')[0]}</span>
                            <span className="truncate max-w-[80px]">{sample.courier.awbNumber}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {colSamples.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-[11px] text-slate-400 italic">
                      No samples in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SDO Detail Drawer */}
      {selectedSample && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#090d1a] border-l border-slate-800 h-full overflow-y-auto flex flex-col justify-between p-6 shadow-2xl">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-purple-400 font-bold">
                      {selectedSample.sdoNumber}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        STAGE_CONFIG[selectedSample.stage].badgeColor
                      }`}
                    >
                      {selectedSample.stage} Sample (Round {selectedSample.roundNumber})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                      {selectedSample.targetMarket}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    {selectedSample.styleName}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Style Code: <span className="font-mono text-slate-300">{selectedSample.styleCode}</span> | Factory:{' '}
                    <span className="text-slate-300">{selectedSample.factoryName}</span>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedSample(null)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status and Action Ribbon */}
              <div className="my-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Status:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      STATUS_CONFIG[selectedSample.status].bg
                    } ${STATUS_CONFIG[selectedSample.status].text} ${
                      STATUS_CONFIG[selectedSample.status].border
                    }`}
                  >
                    {STATUS_CONFIG[selectedSample.status].label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedSample.status === 'IN_FABRICATION' && (
                    <button
                      onClick={() => {
                        onUpdateSampleStatus(selectedSample.id, 'INTERNAL_QA_PASSED');
                        setSelectedSample({
                          ...selectedSample,
                          status: 'INTERNAL_QA_PASSED',
                        });
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition-all flex items-center gap-1"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>Pass Lab QA</span>
                    </button>
                  )}

                  {selectedSample.status === 'INTERNAL_QA_PASSED' && (
                    <button
                      onClick={() => {
                        onUpdateSampleStatus(selectedSample.id, 'DISPATCHED');
                        setSelectedSample({
                          ...selectedSample,
                          status: 'DISPATCHED',
                        });
                      }}
                      className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-[11px] transition-all flex items-center gap-1"
                    >
                      <Plane className="w-3.5 h-3.5" />
                      <span>Dispatch Air Courier</span>
                    </button>
                  )}

                  {selectedSample.status === 'DISPATCHED' && (
                    <button
                      onClick={() => {
                        onUpdateSampleStatus(selectedSample.id, 'DELIVERED_TO_BUYER');
                        setSelectedSample({
                          ...selectedSample,
                          status: 'DELIVERED_TO_BUYER',
                        });
                      }}
                      className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-[11px] transition-all flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Confirm Buyer Receipt</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Drawer Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 text-xs mb-4">
                <button
                  onClick={() => setActiveDrawerTab('TECHPACK')}
                  className={`pb-2 px-2 border-b-2 font-medium transition-all ${
                    activeDrawerTab === 'TECHPACK'
                      ? 'border-purple-500 text-purple-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Tech Pack Specs
                </button>
                <button
                  onClick={() => setActiveDrawerTab('COURIER')}
                  className={`pb-2 px-2 border-b-2 font-medium transition-all ${
                    activeDrawerTab === 'COURIER'
                      ? 'border-purple-500 text-purple-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Courier & Tracking ({selectedSample.courier ? 'Active' : '0'})
                </button>
                <button
                  onClick={() => setActiveDrawerTab('COSTING')}
                  className={`pb-2 px-2 border-b-2 font-medium transition-all ${
                    activeDrawerTab === 'COSTING'
                      ? 'border-purple-500 text-purple-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Costing & Invoice (${selectedSample.costing.totalCostUsd})
                </button>
                <button
                  onClick={() => setActiveDrawerTab('FEEDBACK')}
                  className={`pb-2 px-2 border-b-2 font-medium transition-all ${
                    activeDrawerTab === 'FEEDBACK'
                      ? 'border-purple-500 text-purple-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Buyer Feedback ({selectedSample.feedbacks.length})
                </button>
              </div>

              {/* Tab 1: Tech Pack Specifications */}
              {activeDrawerTab === 'TECHPACK' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">
                        Dimensions & Tolerances
                      </div>
                      <div className="font-semibold text-white mt-1">
                        {selectedSample.techPack.dimensions}
                      </div>
                      <div className="text-[10px] text-amber-400 mt-0.5">
                        {selectedSample.techPack.tolerances}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">
                        Colorway & Weight
                      </div>
                      <div className="font-semibold text-white mt-1">
                        {selectedSample.techPack.colorwayPantone}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Target: {selectedSample.techPack.weightTargetGrams} grams
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">
                      Raw Material & Composition Specs
                    </div>
                    <div className="font-medium text-slate-200">
                      {selectedSample.techPack.primaryMaterial}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {selectedSample.techPack.materialDetails}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">
                      Lining, Hardware, or Glaze
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-400">Lining/Finish:</span>{' '}
                      {selectedSample.techPack.liningOrFinish}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-400">Hardware/Glaze:</span>{' '}
                      {selectedSample.techPack.hardwareOrGlaze}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">
                      Packaging, Labelling & Care Standard
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-400">Trims/Packaging:</span>{' '}
                      {selectedSample.techPack.trimsAndPackaging}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-400">Care Instruction:</span>{' '}
                      {selectedSample.techPack.careInstructions}
                    </div>
                    {selectedSample.techPack.barcodeEan && (
                      <div className="text-slate-300 font-mono">
                        <span className="text-slate-400">EAN Barcode:</span>{' '}
                        {selectedSample.techPack.barcodeEan}
                      </div>
                    )}
                  </div>

                  {selectedSample.techPack.artworkOrDxfUrl && (
                    <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-800/40 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-purple-300 text-xs">
                          CAD / DXF Pattern File Attached
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {selectedSample.techPack.artworkOrDxfUrl}
                        </div>
                      </div>
                      <a
                        href={selectedSample.techPack.artworkOrDxfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-[11px] flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Download DXF</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Courier & Express Logistics */}
              {activeDrawerTab === 'COURIER' && (
                <div className="space-y-4 text-xs">
                  {selectedSample.courier ? (
                    <>
                      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-cyan-950/30 border border-cyan-800/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold font-mono">
                              {selectedSample.courier.courier}
                            </span>
                            <span className="font-mono text-white text-xs font-bold">
                              {selectedSample.courier.awbNumber}
                            </span>
                          </div>
                          <a
                            href={selectedSample.courier.trackingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-medium flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Live Tracker</span>
                          </a>
                        </div>

                        {/* Route Strip */}
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px]">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Origin:</span>
                            <span className="font-semibold text-white">
                              {selectedSample.courier.originAirport}
                            </span>
                          </div>
                          <Plane className="w-4 h-4 text-cyan-400 rotate-90" />
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Destination:</span>
                            <span className="font-semibold text-white">
                              {selectedSample.courier.destinationAirport}
                            </span>
                          </div>
                        </div>

                        {/* Status timeline */}
                        <div className="space-y-2 pt-2">
                          <div className="text-[11px] text-slate-300 font-medium">
                            Current Status:{' '}
                            <span className="text-cyan-400 font-mono">
                              {selectedSample.courier.currentLocation}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                            <div>Dispatched: {selectedSample.courier.dispatchDate}</div>
                            <div className="text-right">
                              Est. Delivery: {selectedSample.courier.estimatedDeliveryDate}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Flight / Courier Stepper */}
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="text-[10px] text-slate-400 uppercase font-mono mb-2">
                          Air Freight Chain Milestones
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Dhaka Lab Quality Seal & AWB Generation</span>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Pickup from ArielMC Gulshan Sourcing Hub</span>
                          </div>
                          <div className="flex items-center gap-2 text-cyan-400">
                            <Plane className="w-3.5 h-3.5" />
                            <span>Air Cargo Manifest DAC Departure</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Destination Customs Clearance & Handover</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
                      <Truck className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-slate-400">
                        No courier booking generated yet. Complete factory fabrication and pass internal lab QA to book DHL/FedEx shipment.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Costing & Commercial Terms */}
              {activeDrawerTab === 'COSTING' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Sample Development (Factory):</span>
                      <span className="font-mono text-white">
                        ৳{selectedSample.costing.developmentCostBdt.toLocaleString()} ($
                        {selectedSample.costing.developmentCostUsd})
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Air Express Freight:</span>
                      <span className="font-mono text-white">
                        ${selectedSample.costing.courierCostUsd}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-sm font-bold">
                      <span className="text-slate-200">Total SDO Investment:</span>
                      <span className="font-mono text-emerald-400">
                        ${selectedSample.costing.totalCostUsd}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">
                      Billing & Cost Allocation
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Billing Party:</span>
                      <span className="font-mono font-semibold text-white px-2 py-0.5 rounded bg-slate-800">
                        {selectedSample.costing.billingParty.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Payment Status:</span>
                      <span
                        className={`font-mono text-xs font-semibold ${
                          selectedSample.costing.paymentStatus === 'PAID'
                            ? 'text-emerald-400'
                            : selectedSample.costing.paymentStatus === 'WAIVED'
                            ? 'text-cyan-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {selectedSample.costing.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Buyer Feedback */}
              {activeDrawerTab === 'FEEDBACK' && (
                <div className="space-y-4 text-xs">
                  {selectedSample.feedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{fb.reviewedBy}</span>
                        <span className="text-[10px] font-mono text-slate-400">{fb.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            fb.verdict === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : fb.verdict === 'APPROVED_WITH_COMMENTS'
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {fb.verdict.replace(/_/g, ' ')}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          Aesthetic: <b className="text-white">{fb.aestheticScore}/10</b> | Workmanship:{' '}
                          <b className="text-white">{fb.workmanshipScore}/10</b> | Dimension:{' '}
                          <b className="text-white">{fb.dimensionalAccuracyScore}/10</b>
                        </div>
                      </div>

                      <p className="text-slate-300 text-xs italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        &quot;{fb.comments}&quot;
                      </p>

                      {fb.requiredChanges && fb.requiredChanges.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] uppercase font-mono text-amber-400">
                            Required Adjustments for Production:
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
                            {fb.requiredChanges.map((change, idx) => (
                              <li key={idx}>{change}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Log New Buyer Feedback Form */}
                  <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-3">
                    <div className="font-semibold text-purple-300 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Log Buyer Review Verdict</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={feedbackVerdict}
                        onChange={(e) => setFeedbackVerdict(e.target.value as any)}
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                      >
                        <option value="APPROVED">Approved (Advance to Bulk)</option>
                        <option value="APPROVED_WITH_COMMENTS">Approved w/ Minor Comments</option>
                        <option value="REVISE_SAMPLE">Revision Required (Next Round)</option>
                        <option value="REJECTED">Sample Rejected</option>
                      </select>

                      <button
                        onClick={() => {
                          if (!feedbackNotes.trim()) return;
                          onUpdateSampleStatus(
                            selectedSample.id,
                            feedbackVerdict === 'APPROVED' || feedbackVerdict === 'APPROVED_WITH_COMMENTS'
                              ? 'APPROVED'
                              : 'REVISION_REQUIRED',
                            feedbackNotes
                          );
                          setSelectedSample(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-all"
                      >
                        Submit Verdict & Update Status
                      </button>
                    </div>

                    <textarea
                      placeholder="Enter buyer feedback comments, stitch remarks, glaze evaluation..."
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Advance Stage Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Current: {selectedSample.stage} Sample</span>
              {selectedSample.stage !== 'TOP' && (
                <button
                  onClick={() => {
                    const nextStageMap: Record<SampleStage, SampleStage> = {
                      PROTO: 'FIT',
                      FIT: 'SIZE_SET',
                      SIZE_SET: 'PP',
                      PP: 'TOP',
                      TOP: 'TOP',
                    };
                    const next = nextStageMap[selectedSample.stage];
                    onAdvanceSampleStage(selectedSample.id, next);
                    setSelectedSample(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                >
                  <span>Advance Stage to {STAGE_CONFIG[selectedSample.stage].order + 1}/5</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New SDO Creation Modal */}
      {isAddModalOpen && (
        <CreateSdoModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddSample={(sdo) => {
            onAddSample(sdo);
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
// Create SDO Modal Component
// ----------------------------------------------------------------------------

interface CreateSdoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSample: (sample: SampleDevelopmentOrder) => void;
  factories: SupplierFactory[];
  products: ProductItem[];
  crmLeads: CrmLead[];
}

const CreateSdoModal: React.FC<CreateSdoModalProps> = ({
  isOpen,
  onClose,
  onAddSample,
  factories,
  products,
  crmLeads,
}) => {
  const [sector, setSector] = useState<ProductSector>('LEATHER');
  const [styleName, setStyleName] = useState('');
  const [styleCode, setStyleCode] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [targetMarket, setTargetMarket] = useState<'UK' | 'EU' | 'US' | 'AU'>('UK');
  const [factoryId, setFactoryId] = useState('');
  const [stage, setStage] = useState<SampleStage>('PROTO');
  const [dimensions, setDimensions] = useState('');
  const [primaryMaterial, setPrimaryMaterial] = useState('');
  const [colorway, setColorway] = useState('');
  const [targetDate, setTargetDate] = useState('2026-11-15');
  const [costUsd, setCostUsd] = useState(150);
  const [courierProvider, setCourierProvider] = useState<CourierProvider>('DHL Express');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedFactory = factories.find((f) => f.id === factoryId) || factories[0];
    const newId = `sdo-${Date.now()}`;
    const sdoNumber = `SDO-2026-${sector.substring(0, 3)}-${Math.floor(100 + Math.random() * 900)}`;

    const newSample: SampleDevelopmentOrder = {
      id: newId,
      sdoNumber,
      sector,
      styleName: styleName || 'Custom Client Design',
      styleCode: styleCode || `AM-${sector.substring(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      buyerCompany: buyerCompany || 'Global Sourcing Client',
      buyerContact: 'Buyer Sourcing Team',
      targetMarket,
      factoryId: selectedFactory.id,
      factoryName: selectedFactory.name,
      stage,
      roundNumber: 1,
      status: 'TECH_PACK_SENT',
      requestDate: new Date().toISOString().split('T')[0],
      targetDeliveryDate: targetDate,
      techPack: {
        dimensions: dimensions || 'Standard Commercial Dimensions',
        tolerances: '± 2mm standard',
        primaryMaterial: primaryMaterial || 'Premium Grade Bangladesh Raw Material',
        materialDetails: 'Sourced from compliant local supply chain',
        liningOrFinish: 'Specified per tech pack annex',
        hardwareOrGlaze: 'Standard export grade',
        trimsAndPackaging: 'FSC hangtag, polybag, master carton',
        careInstructions: 'Standard export care standards',
        colorwayPantone: colorway || 'Natural Tonal',
        weightTargetGrams: 850,
      },
      courier: {
        courier: courierProvider,
        awbNumber: `${courierProvider === 'DHL Express' ? 'DHL' : 'FDX'}-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        dispatchDate: targetDate,
        estimatedDeliveryDate: targetDate,
        originAirport: 'DAC (Dhaka, BD)',
        destinationAirport:
          targetMarket === 'UK'
            ? 'LHR (London, UK)'
            : targetMarket === 'US'
            ? 'JFK (New York, USA)'
            : targetMarket === 'EU'
            ? 'AMS (Amsterdam, EU)'
            : 'SYD (Sydney, AU)',
        currentLocation: 'Fabrication in Progress',
        transitStatus: 'LABEL_CREATED',
        costUsd: 120,
        trackingUrl: 'https://www.dhl.com',
      },
      costing: {
        developmentCostBdt: costUsd * 120,
        developmentCostUsd: costUsd,
        courierCostUsd: 120,
        totalCostUsd: costUsd + 120,
        billingParty: 'BUYER_INVOICED',
        paymentStatus: 'PENDING',
      },
      feedbacks: [],
      tags: ['New SDO', targetMarket, sector],
    };

    onAddSample(newSample);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">Create Sample Development Order (SDO)</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Product Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as any)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="LEATHER">Leather Goods</option>
                <option value="JUTE">Jute Crafts</option>
                <option value="TEXTILE">Home Textiles</option>
                <option value="CERAMICS">Ceramics & Pottery</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Sample Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="PROTO">Proto Sample (1st Fit & Pattern)</option>
                <option value="FIT">Fit & Styling Sample</option>
                <option value="SIZE_SET">Size Set / Range Sample</option>
                <option value="PP">Pre-Production (PP) Sample</option>
                <option value="TOP">Top of Production (TOP) Sample</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Style Name / Description</label>
              <input
                type="text"
                required
                placeholder="e.g. Full-Grain Duffle Bag"
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Style Code</label>
              <input
                type="text"
                placeholder="e.g. AM-LTH-009"
                value={styleCode}
                onChange={(e) => setStyleCode(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Buyer / Client Company</label>
              <input
                type="text"
                required
                placeholder="e.g. Harrods, Zara Home, Pottery Barn"
                value={buyerCompany}
                onChange={(e) => setBuyerCompany(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Target Market Zone</label>
              <select
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value as any)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="UK">United Kingdom (GBP)</option>
                <option value="US">United States (USD)</option>
                <option value="EU">European Union (EUR)</option>
                <option value="AU">Australia (AUD)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Partner Factory (Bangladesh)</label>
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

            <div>
              <label className="block text-slate-400 mb-1">Target Sample Delivery Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Tech Pack Specs Preview */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <div className="text-[10px] text-slate-400 uppercase font-mono">
              Core Tech Pack Specifications
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-400 text-[10px] mb-0.5">Dimensions</label>
                <input
                  type="text"
                  placeholder="e.g. 40x30x10 cm"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[10px] mb-0.5">Primary Material</label>
                <input
                  type="text"
                  placeholder="e.g. Full-Grain Cowhide"
                  value={primaryMaterial}
                  onChange={(e) => setPrimaryMaterial(e.target.value)}
                  className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[10px] mb-0.5">Pantone / Color</label>
                <input
                  type="text"
                  placeholder="e.g. Cognac Saddle"
                  value={colorway}
                  onChange={(e) => setColorway(e.target.value)}
                  className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Express Courier</label>
              <select
                value={courierProvider}
                onChange={(e) => setCourierProvider(e.target.value as any)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="DHL Express">DHL Express Priority</option>
                <option value="FedEx Priority">FedEx International Priority</option>
                <option value="Aramex">Aramex Global Express</option>
                <option value="UPS Worldwide">UPS Worldwide Express</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Development Cost ($USD)</label>
              <input
                type="number"
                value={costUsd}
                onChange={(e) => setCostUsd(Number(e.target.value))}
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
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all shadow-lg shadow-purple-600/30"
            >
              Issue SDO & Dispatch Tech Pack
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
