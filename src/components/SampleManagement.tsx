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
  Printer,
  Calculator,
  ShieldAlert,
  Award,
  Barcode,
  PackageCheck,
  Package,
  Share2,
} from 'lucide-react';
import { SAMPLE_PRICING_MATRIX } from '@/data/samplePricingMatrix';
import { ThemeProfile } from '@/components/Sidebar';
import { StandardFactoryTechPack } from '@/types/techPack';
import { StandardFactoryTechPackModal } from './StandardFactoryTechPackModal';
import { buildStandardFactoryTechPack } from '@/data/standardTechPacks';
import { ShareDocumentModal } from '@/components/ShareDocumentModal';
import { OfficialDocument } from '@/types/documentPortal';

interface SampleManagementProps {
  samples: SampleDevelopmentOrder[];
  factories: SupplierFactory[];
  products: ProductItem[];
  crmLeads: CrmLead[];
  onAddSample: (newSample: SampleDevelopmentOrder) => void;
  onUpdateSampleStatus: (sdoId: string, newStatus: SampleStatus, feedbackComments?: string) => void;
  onAdvanceSampleStage: (sdoId: string, nextStage: SampleStage) => void;
  theme?: ThemeProfile;
}

const STAGE_CONFIG: Record<
  SampleStage,
  { label: string; desc: string; badgeColor: string; order: number }
> = {
  PROTO: {
    label: 'Proto (1st Fit)',
    desc: 'Pattern & initial mould feasibility test',
    badgeColor: 'bg-[#E8F0EA] text-[#1F3A2E] border-[#BBE3C7]',
    order: 1,
  },
  FIT: {
    label: 'Fit & Styling',
    desc: 'Measurement, contour, and aesthetic adjustments',
    badgeColor: 'bg-[#E8F0EA] text-[#1F3A2E] border-[#BBE3C7]',
    order: 2,
  },
  SIZE_SET: {
    label: 'Size Set / Range',
    desc: 'Full grading specs and multi-dimension fit check',
    badgeColor: 'bg-[#E8F0FA] text-[#17456F] border-[#C5D7ED]',
    order: 3,
  },
  PP: {
    label: 'Pre-Production (PP)',
    desc: 'Gatekeeper sample with final trims before bulk cutting/firing',
    badgeColor: 'bg-[#FEF6E4] text-[#7A5508] border-[#FBE3B0]',
    order: 4,
  },
  TOP: {
    label: 'Top of Production (TOP)',
    desc: 'Pulled from initial 10% mass run for pre-shipment sign-off',
    badgeColor: 'bg-[#E4F3E9] text-[#14512C] border-[#BBE3C7]',
    order: 5,
  },
};

const STATUS_CONFIG: Record<
  SampleStatus,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  DRAFT: {
    label: 'Draft',
    bg: 'bg-[#F4F6F4]',
    text: 'text-[#6B7269]',
    border: 'border-[#DDE3DD]',
    icon: Clock,
  },
  TECH_PACK_SENT: {
    label: 'Tech Pack Sent',
    bg: 'bg-[#E8F0FA]',
    text: 'text-[#17456F]',
    border: 'border-[#C5D7ED]',
    icon: Send,
  },
  IN_FABRICATION: {
    label: 'In Fabrication',
    bg: 'bg-[#FEF6E4]',
    text: 'text-[#7A5508]',
    border: 'border-[#FBE3B0]',
    icon: FlaskConical,
  },
  INTERNAL_QA_PASSED: {
    label: 'QA Passed (Dhaka)',
    bg: 'bg-[#E4F3E9]',
    text: 'text-[#14512C]',
    border: 'border-[#BBE3C7]',
    icon: ClipboardCheck,
  },
  DISPATCHED: {
    label: 'Dispatched (In Transit)',
    bg: 'bg-[#E0F2FE]',
    text: 'text-[#0369A1]',
    border: 'border-[#BAE6FD]',
    icon: Plane,
  },
  DELIVERED_TO_BUYER: {
    label: 'Delivered to Buyer',
    bg: 'bg-[#E8F0EA]',
    text: 'text-[#1F3A2E]',
    border: 'border-[#BBE3C7]',
    icon: Truck,
  },
  APPROVED: {
    label: 'Buyer Approved',
    bg: 'bg-[#E4F3E9]',
    text: 'text-[#14512C]',
    border: 'border-[#BBE3C7]',
    icon: CheckCircle2,
  },
  APPROVED_WITH_COMMENTS: {
    label: 'Approved w/ Notes',
    bg: 'bg-[#E6FFFA]',
    text: 'text-[#0D9488]',
    border: 'border-[#99F6E4]',
    icon: CheckCircle2,
  },
  REVISION_REQUIRED: {
    label: 'Revision Required',
    bg: 'bg-[#FDEAEA]',
    text: 'text-[#8A1515]',
    border: 'border-[#F7C0C0]',
    icon: AlertCircle,
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-[#FDEAEA]',
    text: 'text-[#8A1515]',
    border: 'border-[#F7C0C0]',
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
  theme = 'crm-green',
}) => {
  const isRoyal = theme === 'royal-blue';
  const isHeritage = theme === 'heritage-tan';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<ProductSector | 'ALL'>('ALL');
  const [selectedStage, setSelectedStage] = useState<SampleStage | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<SampleStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('TABLE');
  const [selectedSample, setSelectedSample] = useState<SampleDevelopmentOrder | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'TECHPACK' | 'COURIER' | 'COSTING' | 'FEEDBACK'>('TECHPACK');
  const [viewingTechPack, setViewingTechPack] = useState<StandardFactoryTechPack | null>(null);
  const [activeModuleTab, setActiveSampleModuleTab] = useState<'TRACKER' | 'SOP_POLICY' | 'PRICING_MATRIX' | 'REIMBURSEMENT_CALC'>('TRACKER');
  const [showSopModal, setShowSopModal] = useState(false);
  const [calcPoQty, setCalcPoQty] = useState(1200);
  const [calcPoValue, setCalcPoValue] = useState(8400);
  const [calcSector, setCalcSector] = useState<'JUTE' | 'LEATHER'>('JUTE');
  const [calcDevFee, setCalcDevFee] = useState(154);

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
      color: 'border-amber-500/40 bg-amber-500/5',
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] shadow-md text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#C8A96A] font-mono text-xs font-semibold border border-white/20">
              PHASE 3: LIVE
            </span>
            <span className="text-xs text-white/80 font-mono">
              Export R&D, Tech Packs & Sampling Protocol
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 font-montserrat">
            <FlaskConical className="w-6 h-6 text-[#C8A96A]" />
            Sample Development Orders (SDO)
          </h1>
          <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
            Control the 5-stage sampling lifecycle from Proto pattern testing to Pre-Production (PP) gatekeeping and Top of Production (TOP) sign-off. Track international DHL/FedEx courier tracking and buyer feedback revisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSopModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F4E3B8] border border-[#C8A96A]/40 font-semibold text-xs transition-all shadow-sm font-montserrat"
          >
            <FileText className="w-4 h-4 text-[#C8A96A]" />
            <span>SOP-B2B-SMP-2026-V1 Agreement</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8A96A] hover:bg-[#8A6D3B] text-[#1F3A2E] font-bold text-xs transition-all shadow-md font-montserrat"
          >
            <Plus className="w-4 h-4" />
            <span>Create New SDO</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#DDE3DD] pb-2 overflow-x-auto text-xs font-montserrat">
        <button
          onClick={() => setActiveSampleModuleTab('TRACKER')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeModuleTab === 'TRACKER'
              ? 'bg-[#1F3A2E] text-white shadow-sm'
              : 'text-[#6B7269] hover:text-[#1A1A1A] hover:bg-white'
          }`}
        >
          <FlaskConical className="w-4 h-4 text-[#C8A96A]" />
          <span>Active SDO Pipeline ({samples.length})</span>
        </button>

        <button
          onClick={() => setActiveSampleModuleTab('SOP_POLICY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeModuleTab === 'SOP_POLICY'
              ? 'bg-[#1F3A2E] text-white shadow-sm'
              : 'text-[#6B7269] hover:text-[#1A1A1A] hover:bg-white'
          }`}
        >
          <FileText className="w-4 h-4 text-[#C8A96A]" />
          <span>5-Stage Sourcing & Tier Classification</span>
        </button>

        <button
          onClick={() => setActiveSampleModuleTab('PRICING_MATRIX')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeModuleTab === 'PRICING_MATRIX'
              ? 'bg-[#1F3A2E] text-white shadow-sm'
              : 'text-[#6B7269] hover:text-[#1A1A1A] hover:bg-white'
          }`}
        >
          <Tag className="w-4 h-4 text-[#C8A96A]" />
          <span>Sample Pricing Matrix (15 SKUs)</span>
        </button>

        <button
          onClick={() => setActiveSampleModuleTab('REIMBURSEMENT_CALC')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
            activeModuleTab === 'REIMBURSEMENT_CALC'
              ? 'bg-[#1F3A2E] text-white shadow-sm'
              : 'text-[#6B7269] hover:text-[#1A1A1A] hover:bg-white'
          }`}
        >
          <Calculator className="w-4 h-4 text-[#C8A96A]" />
          <span>100% Sample Fee Refund Calculator</span>
        </button>
      </div>

      {activeModuleTab === 'TRACKER' && (
        <>
          {/* KPI Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="text-[11px] text-[#6B7269] uppercase font-medium">Total Active SDOs</div>
          <div className="text-xl font-bold font-mono text-[#1F3A2E] mt-0.5">{totalSamples}</div>
          <div className="text-[10px] text-[#6B7269] mt-0.5">Across 4 Sectors</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="text-[11px] text-[#6B7269] uppercase font-medium flex items-center justify-between">
            <span>In Fabrication</span>
            <span className="w-2 h-2 rounded-full bg-[#7A5508] animate-pulse" />
          </div>
          <div className="text-xl font-bold font-mono text-[#7A5508] mt-0.5">{inFabrication}</div>
          <div className="text-[10px] text-[#6B7269] mt-0.5">At BD Factory Floors</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="text-[11px] text-[#6B7269] uppercase font-medium flex items-center justify-between">
            <span>In Transit (Air)</span>
            <Plane className="w-3.5 h-3.5 text-[#0369A1]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#0369A1] mt-0.5">{inTransit}</div>
          <div className="text-[10px] text-[#6B7269] mt-0.5">DHL & FedEx Express</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="text-[11px] text-[#6B7269] uppercase font-medium">Awaiting Feedback</div>
          <div className="text-xl font-bold font-mono text-[#4A2E7A] mt-0.5">{awaitingFeedback}</div>
          <div className="text-[10px] text-[#6B7269] mt-0.5">With Global Buyers</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="text-[11px] text-[#6B7269] uppercase font-medium">Buyer Approved</div>
          <div className="text-xl font-bold font-mono text-[#14512C] mt-0.5">{approvedCount}</div>
          <div className="text-[10px] text-[#14512C] mt-0.5 font-semibold">Ready for Bulk PO</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#DDE3DD] shadow-sm">
          <div className="text-[11px] text-[#6B7269] uppercase font-medium">R&D Expenditure</div>
          <div className="text-xl font-bold font-mono text-[#1F3A2E] mt-0.5">
            ${totalSpendUsd.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#6B7269] mt-0.5">Samples + Airfreight</div>
        </div>
      </div>

      {/* 5-Stage Lifecycle Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-semibold text-[#1F3A2E] mr-1 flex items-center gap-1 font-montserrat">
          <Layers className="w-3.5 h-3.5 text-[#C8A96A]" /> Stage Filter:
        </span>
        <button
          onClick={() => setSelectedStage('ALL')}
          className={`px-3 py-1.5 rounded-lg border font-mono transition-all font-semibold ${
            selectedStage === 'ALL'
              ? 'bg-[#1F3A2E] text-white border-[#1F3A2E]'
              : 'bg-white text-[#1A1A1A] border-[#DDE3DD] hover:bg-[#F8FAF8]'
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
                  ? `${cfg.badgeColor} border-current font-bold shadow-sm ring-2 ring-[#C8A96A]`
                  : 'bg-white text-[#1A1A1A] border-[#DDE3DD] hover:bg-[#F8FAF8]'
              }`}
            >
              <span>{cfg.label}</span>
              <span className="text-[10px] font-mono px-1 rounded bg-[#1F3A2E]/10 font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#6B7269] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SDO #, Style Code, Buyer, Factory, AWB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs text-[#1A1A1A] placeholder-[#6B7269] focus:outline-none focus:border-[#1F3A2E]"
            />
          </div>

          {/* Sector Filter */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value as any)}
            className="px-3 py-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
          >
            <option value="ALL">All Sectors (5 Divisions)</option>
            <option value="LEATHER">💼 Leather Goods</option>
            <option value="JUTE">🛍️ Jute Products</option>
            <option value="TEXTILE">🧵 Apparel & Home Textiles</option>
            <option value="CERAMICS">🍽️ Ceramics & Tableware</option>
            <option value="POTTERY">🏺 Pottery & Terracotta</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 bg-[#F8FAF8] border border-[#DDE3DD] rounded-lg text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1F3A2E]"
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
        <div className="flex items-center gap-1 p-1 bg-[#F4F6F4] rounded-lg border border-[#DDE3DD]">
          <button
            onClick={() => setViewMode('TABLE')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-all ${
              viewMode === 'TABLE'
                ? 'bg-[#1F3A2E] text-white font-bold shadow'
                : 'text-[#6B7269] hover:text-[#1A1A1A]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode('KANBAN')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-all ${
              viewMode === 'KANBAN'
                ? 'bg-[#1F3A2E] text-white font-bold shadow'
                : 'text-[#6B7269] hover:text-[#1A1A1A]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Pipeline</span>
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'TABLE' ? (
        <div className="rounded-xl border border-[#DDE3DD] bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#DDE3DD] bg-[#1F3A2E] text-[11px] font-semibold text-white uppercase tracking-wider font-montserrat">
                  <th className="py-3.5 px-4">SDO Number</th>
                  <th className="py-3.5 px-4">Style & Sector</th>
                  <th className="py-3.5 px-4">Partner Factory</th>
                  <th className="py-3.5 px-4">Buyer & Market</th>
                  <th className="py-3.5 px-4">Stage & Round</th>
                  <th className="py-3.5 px-4">Courier / AWB</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Cost (USD)</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3DD] text-[#1A1A1A]">
                {filteredSamples.map((sample) => {
                  const statusCfg = STATUS_CONFIG[sample.status];
                  const stageCfg = STAGE_CONFIG[sample.stage];
                  const StatusIcon = statusCfg.icon;

                  return (
                    <tr
                      key={sample.id}
                      className="hover:bg-[#F7FAF8] transition-colors cursor-pointer group"
                      onClick={() => setSelectedSample(sample)}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#1F3A2E]">
                        <div className="flex items-center gap-1.5">
                          <span>{sample.sdoNumber}</span>
                          {sample.feedbacks.length > 0 && (
                            <span
                              title={`${sample.feedbacks.length} Feedback logged`}
                              className="w-2 h-2 rounded-full bg-[#C8A96A]"
                            />
                          )}
                        </div>
                        <span className="text-[10px] text-[#6B7269] block font-sans font-normal">
                          Req: {sample.requestDate}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1A1A1A] group-hover:text-[#1F3A2E] transition-colors">
                          {sample.styleName}
                        </div>
                        <div className="text-[10px] text-[#6B7269] font-mono flex items-center gap-1.5">
                          <span>{sample.styleCode}</span>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#E8EDE8] text-[#1F3A2E] font-semibold">
                            {sample.sector}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-[#1A1A1A] text-xs font-semibold">
                          {sample.factoryName.split('-')[0]}
                        </div>
                        <div className="text-[10px] text-[#6B7269]">
                          Due: {sample.targetDeliveryDate}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#1A1A1A] flex items-center gap-1">
                          <span>{sample.buyerCompany}</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#E8F0FA] text-[#17456F] border border-[#C5D7ED] font-mono text-[9px] font-bold">
                            {sample.targetMarket}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#6B7269] truncate max-w-[160px]">
                          {sample.buyerContact.split('(')[0]}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${stageCfg.badgeColor}`}
                        >
                          {sample.stage}
                          <span className="text-[9px] opacity-75">(R{sample.roundNumber})</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {sample.courier ? (
                          <div>
                            <div className="flex items-center gap-1 font-mono text-[#0369A1] font-semibold text-[11px]">
                              <span>{sample.courier.courier.split(' ')[0]}</span>
                              <span className="text-[#6B7269]">•</span>
                              <span className="truncate max-w-[100px]">{sample.courier.awbNumber}</span>
                            </div>
                            <div className="text-[10px] text-[#6B7269] truncate max-w-[130px]">
                              {sample.courier.transitStatus.replace(/_/g, ' ')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#6B7269] italic">No AWB yet</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusCfg.label}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <div className="text-[#1F3A2E] font-bold">
                          ${sample.costing.totalCostUsd}
                        </div>
                        <div className="text-[10px] text-[#6B7269]">
                          {sample.costing.billingParty.split('_')[0]}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingTechPack(
                                sample.standardTechPack ||
                                  buildStandardFactoryTechPack({
                                    modelName: sample.styleName,
                                    styleCode: sample.styleCode,
                                    sector: sample.sector,
                                    originHub: 'Dhaka / Narayanganj / Savar Export Cluster',
                                    factoryName: sample.factoryName,
                                  })
                              );
                            }}
                            className="px-2 py-1 rounded bg-[#FAF5EC] hover:bg-[#F3EAD8] text-[#8A6D3B] border border-[#C8A96A] text-[11px] font-bold shadow-sm transition-all flex items-center gap-1"
                            title="Open Standard Factory Tech-Pack (PDF Format)"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Tech-Pack</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSample(sample);
                            }}
                            className="px-2.5 py-1 rounded bg-white hover:bg-[#1F3A2E] hover:text-white text-[#1A1A1A] text-[11px] transition-colors border border-[#DDE3DD] font-semibold shadow-sm"
                          >
                            Inspect SDO
                          </button>
                        </div>
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
                className="p-3.5 rounded-xl border border-[#DDE3DD] bg-[#E8EDE8] flex flex-col min-h-[500px]"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#DDE3DD] mb-3">
                  <span className="text-xs font-bold text-[#1F3A2E] font-montserrat">{col.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#1F3A2E] font-bold border border-[#DDE3DD]">
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
                        className="p-3.5 rounded-lg bg-white border border-[#DDE3DD] hover:border-[#C8A96A] transition-all cursor-pointer shadow-sm space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-[#1F3A2E] font-bold">
                            {sample.sdoNumber}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold ${stageCfg.badgeColor}`}
                          >
                            {sample.stage} R{sample.roundNumber}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#1F3A2E] transition-colors line-clamp-1 font-montserrat">
                          {sample.styleName}
                        </div>

                        <div className="text-[10px] text-[#6B7269] flex items-center justify-between pt-1 border-t border-[#DDE3DD]">
                          <span className="truncate max-w-[110px] font-medium text-[#1A1A1A]">{sample.buyerCompany}</span>
                          <span className="text-[#14512C] font-mono font-bold">${sample.costing.totalCostUsd}</span>
                        </div>

                        {sample.courier && (
                          <div className="text-[9px] font-mono text-[#0369A1] bg-[#E0F2FE] px-1.5 py-0.5 rounded border border-[#BAE6FD] flex items-center justify-between font-semibold">
                            <span>{sample.courier.courier.split(' ')[0]}</span>
                            <span className="truncate max-w-[80px]">{sample.courier.awbNumber}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {colSamples.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-[11px] text-[#6B7269] italic">
                      No samples in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}

      {/* TAB 2: SOP SOURCING FRAMEWORK & 3-TIER CLASSIFICATION */}
      {activeModuleTab === 'SOP_POLICY' && (
        <div className="space-y-6">
          {/* Sourcing Lifecycle Hero */}
          <div className="p-6 rounded-2xl bg-[#1F3A2E] border-b-[3px] border-[#C8A96A] text-white shadow-md space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] font-mono text-xs font-semibold border border-[#C8A96A]/30">
                    SOP-B2B-SMP-2026-V1
                  </span>
                  <span className="text-xs text-[#E8EFE8] font-mono">
                    Official Prototyping & Commercial Agreement Policy
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white font-['Montserrat']">
                  ArielMC 5-Step Sourcing Workflow & Prototyping Lifecycle
                </h2>
                <p className="text-xs text-[#E8EFE8] font-['Open_Sans'] max-w-3xl">
                  Defines commercial terms, technical intake gates, quality compliance standards, and 100% fee reimbursement mechanics across Dhaka, Narayanganj, and Savar manufacturing hubs.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowSopModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b59557] text-[#1F3A2E] font-bold text-xs shadow-md transition-all font-['Montserrat']"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Agreement</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSopModal(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all font-['Montserrat'] cursor-pointer"
                  title="Share Sourcing SOP & Sampling SLA for Verification & Acknowledgement"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share (Verify / Ack)</span>
                </button>
              </div>
            </div>

            {/* 5-Step Visual Progression */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#172D24] border border-[#2C5240] space-y-1">
                <div className="text-[10px] font-mono font-bold text-[#C8A96A] uppercase">
                  Step 1 (1–2 Days)
                </div>
                <div className="text-xs font-bold text-white font-['Montserrat']">Brief &amp; Feasibility</div>
                <p className="text-[11px] text-[#CFE0D5]">
                  Tech-pack review, BOM validation, target FOB costing, and factory slot allocation.
                </p>
                <div className="text-[10px] text-[#C8A96A] font-mono pt-1">Gate: CRM Stage 4 (35%)</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#172D24] border border-[#2C5240] space-y-1">
                <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  Step 2 (1–4 Weeks)
                </div>
                <div className="text-xs font-bold text-white font-['Montserrat']">Sampling &amp; Prototyping</div>
                <p className="text-[11px] text-[#CFE0D5]">
                  Raw material lab dips, pattern adjustments/CNC cutting, hardware sourcing, specimen creation.
                </p>
                <div className="text-[10px] text-emerald-300 font-mono pt-1">Proto &amp; PP Rounds</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#172D24] border border-[#2C5240] space-y-1">
                <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  Step 3 (2–4 Weeks)
                </div>
                <div className="text-xs font-bold text-white font-['Montserrat']">Ethical Production</div>
                <p className="text-[11px] text-[#CFE0D5]">
                  Bulk cutting and assembly across vetted, socially compliant manufacturing units in Savar &amp; Narayanganj.
                </p>
                <div className="text-[10px] text-amber-300 font-mono pt-1">50% Advance Deposit</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#172D24] border border-[#2C5240] space-y-1">
                <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  Step 4 (1–2 Weeks)
                </div>
                <div className="text-xs font-bold text-white font-['Montserrat']">In-Line &amp; AQL Inspection</div>
                <p className="text-[11px] text-[#CFE0D5]">
                  Strict inspection under AQL 1.5 Major / 2.5 Minor, dynamic 15kg load tests, carton markings.
                </p>
                <div className="text-[10px] text-emerald-300 font-mono pt-1">QA-DOC Dossier</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#172D24] border border-[#2C5240] space-y-1">
                <div className="text-[10px] font-mono font-bold text-[#C8A96A] uppercase">
                  Step 5 (3–5 Days)
                </div>
                <div className="text-xs font-bold text-white font-['Montserrat']">Logistics &amp; Customs</div>
                <p className="text-[11px] text-[#CFE0D5]">
                  Bill of Lading, REX / DCTS Origin Statement (0% duty), DAE Phytosanitary, forwarder handover.
                </p>
                <div className="text-[10px] text-[#C8A96A] font-mono pt-1">Final 50% Balance BL</div>
              </div>
            </div>
          </div>

          {/* 3 Sampling Request Classification Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat']">
                  Tier A: Ready Catalog Showroom Samples
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BDE3CA] font-semibold">
                  OFF-THE-SHELF
                </span>
              </div>
              <p className="text-xs text-[#6B7269]">
                Standard SKUs from current product roadmaps without structural modifications (e.g., JD-EDC-16 Market Tote, LD-EDC-1 Slim Bifold).
              </p>
              <div className="space-y-1.5 text-xs text-[#1A1A1A] pt-2 border-t border-[#DDE3DD]">
                <div className="flex justify-between">
                  <span className="text-[#6B7269]">Sample Fee:</span>
                  <span className="font-semibold text-[#1F3A2E]">Nominal wholesale price (Complimentary up to 2 units for enterprise)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7269]">Express Freight:</span>
                  <span className="text-[#1A1A1A]">Paid by buyer or corporate DHL/FedEx account</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7269]">Bulk Adjustment:</span>
                  <span className="text-emerald-700 font-semibold">100% credited against balance invoice</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat']">
                  Tier B: Custom OEM Prototypes
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF9EA] text-[#8A5A00] border border-[#F0D597] font-semibold">
                  TECH-PACK DRIVEN
                </span>
              </div>
              <p className="text-xs text-[#6B7269]">
                Custom designs, bespoke dimensions, buyer-specified GSM/tannage, custom Pantone lab dips, and personalized debossed/foil branding.
              </p>
              <div className="space-y-1.5 text-xs text-[#1A1A1A] pt-2 border-t border-[#DDE3DD]">
                <div className="flex justify-between">
                  <span className="text-[#6B7269]">Development Fee:</span>
                  <span className="font-semibold text-[#8A5A00]">$45.00 – $140.00 fixed fee</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7269]">Brass Deboss Die:</span>
                  <span className="text-[#1A1A1A]">$35.00 – $65.00 (At cost)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7269]">Screen Stencil:</span>
                  <span className="text-[#1A1A1A]">$25.00 / colorway</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7269]">Bulk Reimbursement:</span>
                  <span className="text-emerald-700 font-semibold">100% of dev fee credited on qualifying PO</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat']">
                  Tier C: Corporate Specimen Kits
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF] font-semibold">
                  STRATEGIC PROSPECTING
                </span>
              </div>
              <p className="text-xs text-[#6B7269]">
                Presentation specimen box for institutional procurement executives (London/NY) with debossed Jute Bag, leather swatch, and ESG Factsheet.
              </p>
              <div className="space-y-1.5 text-xs text-[#1A1A1A] pt-2 border-t border-[#DDE3DD]">
                <div className="flex justify-between">
                  <span className="text-[#6B7269]">Commercial Fee:</span>
                  <span className="font-semibold text-[#1F3A2E]">$50.00 flat (Inclusive of express air courier)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7269]">Complimentary Discretion:</span>
                  <span className="text-[#1A1A1A]">Reserved for Stage 4 feasibility calls</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7269]">Bulk PO Rebate:</span>
                  <span className="text-emerald-700 font-semibold">100% rebate on placement of baseline MOQ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Express Shipping & Labelling Standards */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#1F3A2E] font-['Montserrat'] flex items-center gap-2">
              <Plane className="w-4 h-4 text-[#C8A96A]" />
              International Express Courier Terms &amp; Mandatory Customs Labelling
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD]">
                <span className="text-[#6B7269] text-[10px] block font-medium">UK / Western Europe (0.5–1.0kg)</span>
                <span className="font-bold text-[#1F3A2E] font-mono mt-0.5 block text-sm">$38.00 – $48.00</span>
                <span className="text-[10px] text-[#6B7269]">DHL Express / FedEx Priority from Dhaka</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD]">
                <span className="text-[#6B7269] text-[10px] block font-medium">USA / Canada (0.5–1.0kg)</span>
                <span className="font-bold text-[#1F3A2E] font-mono mt-0.5 block text-sm">$42.00 – $55.00</span>
                <span className="text-[10px] text-[#6B7269]">Direct courier dispatch with live tracking</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F6F2] border border-[#DDE3DD]">
                <span className="text-[#6B7269] text-[10px] block font-medium">Australia / New Zealand (0.5–1.0kg)</span>
                <span className="font-bold text-[#1F3A2E] font-mono mt-0.5 block text-sm">$48.00 – $60.00</span>
                <span className="text-[10px] text-[#6B7269]">Door-to-door express transit (3–5 days)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFF9EA] border border-[#F0D597] text-xs space-y-1">
              <span className="font-semibold text-[#8A5A00] font-['Montserrat'] block">
                Mandated Customs Valuation &amp; Waybill Labelling (Section 6):
              </span>
              <p className="font-mono text-[#1A1A1A] text-[11px] bg-white p-2.5 rounded-lg border border-[#F0D597]">
                &quot;Commercial Mutilated Prototype Samples – No Commercial Value – Value for Customs Purposes Only: $10.00 USD&quot;
              </p>
              <p className="text-[10px] text-[#8A5A00]">
                Prevents destination port customs holds and eliminates excessive VAT/import tariff assessments for buyers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STANDARDIZED SAMPLE PRICING MATRIX */}
      {activeModuleTab === 'PRICING_MATRIX' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#12231B] border border-[#2C5240] space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#C8A96A]" />
              <h2 className="text-base font-bold text-white font-['Montserrat']">
                Section 5 Standardized Sample Pricing Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-300 font-['Open_Sans']">
              Pre-approved sample development fees, tooling/brass die costs, development lead times, and qualifying bulk MOQs across ArielMC's premier manufacturing divisions.
            </p>
          </div>

          {/* Division 1: The Leather Compendium */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-['Montserrat'] flex items-center gap-2">
                <span>💼</span>
                <span>Division 01: The Leather Compendium (Everyday Carry, Tech & Executive Bags)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">8 SKUs</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">SKU Description</th>
                    <th className="py-3 px-4">Dev Sample Fee</th>
                    <th className="py-3 px-4">Brass Deboss / Tooling</th>
                    <th className="py-3 px-4">Lead Time</th>
                    <th className="py-3 px-4 text-emerald-400">Qualifying MOQ (100% Credit)</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {SAMPLE_PRICING_MATRIX.filter((m) => m.division === 'The Leather Compendium').map((item) => (
                    <tr key={item.categoryCode} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#C8A96A]">
                        {item.categoryCode}
                      </td>
                      <td className="py-3 px-4">
                        <strong className="text-white block">{item.skuDescription}</strong>
                        {item.techPackRef && (
                          <span className="text-[10px] text-emerald-400 font-mono">Ref: {item.techPackRef}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ${item.developmentSampleFeeUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {item.toolingCostText}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {item.developmentLeadTime}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {item.qualifyingBulkMoq.toLocaleString()} pcs
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setIsAddModalOpen(true)}
                          className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                            isRoyal
                              ? 'bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30'
                              : isHeritage
                              ? 'bg-[#8A6D3B]/20 text-[#C8A96A] hover:bg-[#8A6D3B] hover:text-white border border-[#C8A96A]/40'
                              : 'bg-[#1F3A2E] text-[#C8A96A] hover:bg-[#2C5240] hover:text-white border border-[#C8A96A]/40 shadow-sm'
                          }`}
                        >
                          Request SDO
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Division 2: The Golden Fiber Edit */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-['Montserrat'] flex items-center gap-2">
                <span>🛍️</span>
                <span>Division 02: The Golden Fiber Edit (Jute, Jute-Cotton & Natural Fibers)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">7 SKUs</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">SKU Description</th>
                    <th className="py-3 px-4">Dev Sample Fee</th>
                    <th className="py-3 px-4">Die / Screen Stencil</th>
                    <th className="py-3 px-4">Lead Time</th>
                    <th className="py-3 px-4 text-emerald-400">Qualifying MOQ (100% Credit)</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {SAMPLE_PRICING_MATRIX.filter((m) => m.division === 'The Golden Fiber Edit').map((item) => (
                    <tr key={item.categoryCode} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#C9A86A]">
                        {item.categoryCode}
                      </td>
                      <td className="py-3 px-4">
                        <strong className="text-white block">{item.skuDescription}</strong>
                        {item.techPackRef && (
                          <span className="text-[10px] text-amber-400 font-mono">Ref: {item.techPackRef}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ${item.developmentSampleFeeUsd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {item.toolingCostText}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {item.developmentLeadTime}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {item.qualifyingBulkMoq.toLocaleString()} pcs
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setIsAddModalOpen(true)}
                          className="px-2.5 py-1 rounded bg-[#C9A86A]/20 text-[#C9A86A] hover:bg-[#C9A86A] hover:text-[#1F3A2E] border border-[#C9A86A]/30 text-xs font-semibold transition-all"
                        >
                          Request SDO
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 100% SAMPLE FEE REIMBURSEMENT CALCULATOR */}
      {activeModuleTab === 'REIMBURSEMENT_CALC' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white font-['Montserrat']">
                Section 4 Commercial Credit & Reimbursement Engine
              </h2>
            </div>
            <p className="text-xs text-slate-300 font-['Open_Sans']">
              100% of the Sample Development Fee is credited against the buyer's final 50% balance invoice settled against the Bill of Lading (BL) copy once a qualifying bulk Purchase Order is placed within 90 calendar days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calculator Controls */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white font-['Montserrat']">
                Simulate Bulk Purchase Order Credit
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Manufacturing Division</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCalcSector('JUTE')}
                      className={`p-2.5 rounded-lg border font-medium transition-all ${
                        calcSector === 'JUTE'
                          ? 'bg-[#C9A86A]/20 text-[#C9A86A] border-[#C9A86A]'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      🛍️ Jute & Golden Fiber (MOQ ≥ 1,000)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcSector('LEATHER')}
                      className={`p-2.5 rounded-lg border font-medium transition-all ${
                        calcSector === 'LEATHER'
                          ? 'bg-[#C8A96A]/20 text-[#C8A96A] border-[#C8A96A]'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      💼 Leather Compendium (MOQ ≥ 300)
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Planned Bulk Order Quantity:</span>
                    <strong className="text-white font-mono">{calcPoQty.toLocaleString()} units</strong>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={5000}
                    step={50}
                    value={calcPoQty}
                    onChange={(e) => setCalcPoQty(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Total PO Value (USD)</label>
                    <input
                      type="number"
                      value={calcPoValue}
                      onChange={(e) => setCalcPoValue(Number(e.target.value))}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Sample Fee Paid (USD)</label>
                    <input
                      type="number"
                      value={calcDevFee}
                      onChange={(e) => setCalcDevFee(Number(e.target.value))}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Live Rule Verification */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <div className="font-semibold text-slate-300">Criteria Check:</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Qualifying Volume:</span>
                  <span className={calcSector === 'JUTE' ? (calcPoQty >= 1000 ? 'text-emerald-400 font-semibold' : 'text-amber-400') : (calcPoQty >= 300 ? 'text-emerald-400 font-semibold' : 'text-amber-400')}>
                    {calcSector === 'JUTE' ? (calcPoQty >= 1000 ? '✓ Meets 1,000 pcs threshold' : '✗ Below 1,000 pcs') : (calcPoQty >= 300 ? '✓ Meets 300 pcs threshold' : '✗ Below 300 pcs')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Minimum Order Value:</span>
                  <span className={calcPoValue >= 3000 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                    {calcPoValue >= 3000 ? '✓ Meets $3,000 minimum' : '✗ Below $3,000 threshold'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Claim Validity:</span>
                  <span className="text-emerald-400 font-semibold">✓ Active within 90 Calendar Days</span>
                </div>
              </div>
            </div>

            {/* Credit Outcome Card */}
            {(() => {
              const targetMoq = calcSector === 'JUTE' ? 1000 : 300;
              const meetsVolume = calcPoQty >= targetMoq;
              const meetsValue = calcPoValue >= 3000;
              const isFullCredit = meetsVolume && meetsValue;
              const isProRata = !isFullCredit && calcPoQty >= targetMoq * 0.5 && calcPoValue >= 1500;
              const creditAmount = isFullCredit ? calcDevFee : isProRata ? calcDevFee * 0.5 : 0;

              return (
                <div className="p-6 rounded-2xl bg-white border border-[#DDE3DD] shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-mono font-semibold">
                        Commercial Credit Outcome
                      </span>
                      <span
                        className={`text-xs font-mono px-2.5 py-1 rounded font-bold ${
                          isFullCredit
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isProRata
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {isFullCredit ? '100% FULL REBATE' : isProRata ? '50% PRO-RATA REBATE' : 'NON-QUALIFYING'}
                      </span>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                      <div className="text-xs text-slate-400">Total Credit Amount Applied</div>
                      <div className="text-3xl font-bold font-mono text-emerald-400">
                        ${creditAmount.toFixed(2)} USD
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {isFullCredit ? '100% of sample development fee refunded' : isProRata ? '50% pro-rata credit for partial MOQ run' : 'Order does not meet qualifying volume'}
                      </div>
                    </div>

                    {/* Order Deduction Mechanism Breakdown */}
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="font-semibold text-white font-['Montserrat']">
                        Deduction Timing (Section 4.I):
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                        <span className="text-slate-400">1. Advance Production Deposit (50%):</span>
                        <strong className="text-slate-200 font-mono">$0.00 Credit</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 flex justify-between">
                        <span className="text-emerald-300">2. Final Balance against Bill of Lading (50%):</span>
                        <strong className="text-emerald-300 font-mono font-bold">-${creditAmount.toFixed(2)} Credited</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <p>• <strong>Courier & Metal Dies:</strong> Third-party air express ($38–$60) and custom brass deboss dies ($35–$65) are strictly non-creditable.</p>
                    <p>• <strong>Repeat Orders:</strong> Client dies remain exclusive property of the buyer and are maintained free of charge in Dhaka for repeat manufacturing runs.</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SDO Detail Drawer */}
      {selectedSample && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-2xl h-full overflow-y-auto flex flex-col justify-between p-6 shadow-2xl transition-colors ${
            isRoyal
              ? 'bg-[#0B132B] border-l border-slate-700 text-slate-100'
              : isHeritage
              ? 'bg-[#1C160C] border-l border-[#8A6D3B]/60 text-[#F5EEDC]'
              : 'bg-[#0E1A14] border-l border-[#2C5240] text-white'
          }`}>
            {/* Drawer Header */}
            <div>
              <div className={`flex items-center justify-between pb-4 border-b ${
                isRoyal ? 'border-slate-800' : isHeritage ? 'border-[#8A6D3B]/50' : 'border-[#2C5240]'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono font-bold ${
                      isRoyal ? 'text-blue-400' : isHeritage ? 'text-[#C8A96A]' : 'text-emerald-400'
                    }`}>
                      {selectedSample.sdoNumber}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        STAGE_CONFIG[selectedSample.stage].badgeColor
                      }`}
                    >
                      {selectedSample.stage} Sample (Round {selectedSample.roundNumber})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/30 font-mono">
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
                      className={`px-3 py-1 rounded-lg text-white font-medium text-[11px] transition-all flex items-center gap-1 ${
                        isRoyal
                          ? 'bg-blue-600 hover:bg-blue-500'
                          : isHeritage
                          ? 'bg-[#8A6D3B] hover:bg-[#9E7D43]'
                          : 'bg-emerald-600 hover:bg-emerald-500'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Confirm Buyer Receipt</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Drawer Tabs */}
              <div className={`flex items-center gap-2 border-b text-xs mb-4 ${
                isRoyal ? 'border-slate-800' : isHeritage ? 'border-[#8A6D3B]/40' : 'border-[#2C5240]'
              }`}>
                <button
                  onClick={() => setActiveDrawerTab('TECHPACK')}
                  className={`pb-2 px-2 border-b-2 font-medium transition-all ${
                    activeDrawerTab === 'TECHPACK'
                      ? isRoyal
                        ? 'border-blue-500 text-blue-400 font-semibold'
                        : isHeritage
                        ? 'border-[#C8A96A] text-[#C8A96A] font-semibold'
                        : 'border-emerald-500 text-emerald-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Tech Pack Specs
                </button>
                <button
                  onClick={() => setActiveDrawerTab('COURIER')}
                  className={`pb-2 px-2 border-b-2 font-medium transition-all ${
                    activeDrawerTab === 'COURIER'
                      ? isRoyal
                        ? 'border-blue-500 text-blue-400 font-semibold'
                        : isHeritage
                        ? 'border-[#C8A96A] text-[#C8A96A] font-semibold'
                        : 'border-emerald-500 text-emerald-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Courier & Tracking ({selectedSample.courier ? 'Active' : '0'})
                </button>
                <button
                  onClick={() => setActiveDrawerTab('COSTING')}
                  className={`pb-2 px-2 border-b-2 font-medium transition-all ${
                    activeDrawerTab === 'COSTING'
                      ? isRoyal
                        ? 'border-blue-500 text-blue-400 font-semibold'
                        : isHeritage
                        ? 'border-[#C8A96A] text-[#C8A96A] font-semibold'
                        : 'border-emerald-500 text-emerald-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Costing & Invoice (${selectedSample.costing.totalCostUsd})
                </button>
                <button
                  onClick={() => setActiveDrawerTab('FEEDBACK')}
                  className={`pb-2 px-2 border-b-2 font-medium transition-all ${
                    activeDrawerTab === 'FEEDBACK'
                      ? isRoyal
                        ? 'border-blue-500 text-blue-400 font-semibold'
                        : isHeritage
                        ? 'border-[#C8A96A] text-[#C8A96A] font-semibold'
                        : 'border-emerald-500 text-emerald-400 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Buyer Feedback ({selectedSample.feedbacks.length})
                </button>
              </div>

              {/* Tab 1: Tech Pack Specifications */}
              {activeDrawerTab === 'TECHPACK' && (
                <div className="space-y-4 text-xs">
                  {/* Standard Factory Tech-Pack Official Document Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#1F3A2E] to-[#12231B] border border-[#C8A96A]/60 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 text-[#C8A96A] border border-white/20 flex items-center justify-center font-bold shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#C8A96A]/25 text-[#F4E3B8] border border-[#C8A96A]/40 uppercase">
                            {selectedSample.standardTechPack?.documentRef || `TP-AMC-${selectedSample.styleCode}`}
                          </span>
                          <span className="text-[11px] text-[#C8A96A] font-semibold">Standard Factory Protocol</span>
                        </div>
                        <div className="text-xs font-bold text-white mt-1">
                          Official Sampling Tech-Pack with Picture & BOM Tables
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setViewingTechPack(
                          selectedSample.standardTechPack ||
                            buildStandardFactoryTechPack({
                              modelName: selectedSample.styleName,
                              styleCode: selectedSample.styleCode,
                              sector: selectedSample.sector,
                              originHub: 'Dhaka / Narayanganj / Savar Export Cluster',
                              factoryName: selectedSample.factoryName,
                            })
                        )
                      }
                      className="px-3.5 py-2 rounded-lg bg-[#C8A96A] hover:bg-[#D8BA7B] text-[#12231B] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Open Factory PDF</span>
                    </button>
                  </div>

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
                    <div className={`p-3 rounded-lg flex items-center justify-between ${
                      isRoyal
                        ? 'bg-blue-950/30 border border-blue-800/40'
                        : isHeritage
                        ? 'bg-[#261E10] border border-[#8A6D3B]/40'
                        : 'bg-emerald-950/30 border border-emerald-800/40'
                    }`}>
                      <div>
                        <div className={`font-semibold text-xs ${
                          isRoyal ? 'text-blue-300' : isHeritage ? 'text-[#C8A96A]' : 'text-emerald-300'
                        }`}>
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
                        className={`px-3 py-1.5 rounded-lg text-white font-medium text-[11px] flex items-center gap-1 ${
                          isRoyal
                            ? 'bg-blue-600 hover:bg-blue-500'
                            : isHeritage
                            ? 'bg-[#8A6D3B] hover:bg-[#9E7D43]'
                            : 'bg-emerald-600 hover:bg-emerald-500'
                        }`}
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
                  <div className={`p-4 rounded-xl space-y-3 ${
                    isRoyal
                      ? 'bg-blue-950/20 border border-blue-800/40'
                      : isHeritage
                      ? 'bg-[#261E10] border border-[#8A6D3B]/40'
                      : 'bg-emerald-950/20 border border-emerald-800/40'
                  }`}>
                    <div className={`font-semibold flex items-center gap-1.5 text-xs ${
                      isRoyal ? 'text-blue-300' : isHeritage ? 'text-[#C8A96A]' : 'text-emerald-300'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Log Buyer Review Verdict</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={feedbackVerdict}
                        onChange={(e) => setFeedbackVerdict(e.target.value as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs text-white ${
                          isRoyal
                            ? 'bg-slate-900 border border-slate-700'
                            : isHeritage
                            ? 'bg-[#1C160C] border border-[#8A6D3B]/60'
                            : 'bg-[#0A140F] border border-[#2C5240]'
                        }`}
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
                        className={`px-3 py-1.5 rounded-lg text-white font-medium text-xs transition-all ${
                          isRoyal
                            ? 'bg-blue-600 hover:bg-blue-500'
                            : isHeritage
                            ? 'bg-[#8A6D3B] hover:bg-[#9E7D43]'
                            : 'bg-emerald-600 hover:bg-emerald-500'
                        }`}
                      >
                        Submit Verdict & Update Status
                      </button>
                    </div>

                    <textarea
                      placeholder="Enter buyer feedback comments, stitch remarks, glaze evaluation..."
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      rows={2}
                      className={`w-full p-2.5 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none ${
                        isRoyal
                          ? 'bg-slate-900 border border-slate-700 focus:border-blue-500'
                          : isHeritage
                          ? 'bg-[#1C160C] border border-[#8A6D3B]/60 focus:border-[#C8A96A]'
                          : 'bg-[#0A140F] border border-[#2C5240] focus:border-emerald-500'
                      }`}
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

      {/* Official SOP Agreement Modal */}
      {showSopModal && (
        <SopAgreementModal
          isOpen={showSopModal}
          onClose={() => setShowSopModal(false)}
        />
      )}

      {/* New SDO Creation Modal */}
      {isAddModalOpen && (
        <CreateSdoModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddSample={(sdo) => {
            onAddSample(sdo);
            setIsAddModalOpen(false);
            if (sdo.standardTechPack) {
              setViewingTechPack(sdo.standardTechPack);
            }
          }}
          factories={factories}
          products={products}
          crmLeads={crmLeads}
          theme={theme}
        />
      )}

      {/* Standard Factory Tech-Pack Official Document Modal */}
      <StandardFactoryTechPackModal
        isOpen={!!viewingTechPack}
        onClose={() => setViewingTechPack(null)}
        techPack={viewingTechPack}
      />
    </div>
  );
};

// ----------------------------------------------------------------------------
// Official SOP & Buyer Portal Agreement Modal Component
// (SOP-B2B-SMP-2026-V1)
// ----------------------------------------------------------------------------

interface SopAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SopAgreementModal: React.FC<SopAgreementModalProps> = ({ isOpen, onClose }) => {
  const [buyerSigned, setBuyerSigned] = useState(false);
  const [signedName, setSignedName] = useState('Authorized Buyer Signatory');
  const [signedCompany, setSignedCompany] = useState('Global Sourcing Client Ltd');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!isOpen) return null;

  const sopDoc: OfficialDocument = {
    id: 'DOC-SOP-SMP-2026',
    docCode: 'SOP-B2B-SMP-2026-V1',
    documentNumber: 'SOP-B2B-SMP-2026-V1',
    title: 'Official Sourcing SOP & Buyer Sampling Portal Agreement',
    category: 'RND_SAMPLING',
    section: 'RND_SAMPLING',
    issuingAuthority: 'ArielMC Commercial Sourcing & Merchant Directorate',
    station: 'ARIEL_BD',
    countryCode: 'BD',
    entityCode: 'BD_HUB',
    issueDate: '2026-01-01',
    expiryDate: '2027-12-31',
    status: 'ACTIVE',
    verificationUrl: 'https://erp.arielmc.com/verify-doc?code=SOP-B2B-SMP-2026-V1&ack=true',
    qrCodeData: 'SOP-B2B-SMP-2026-V1|ARIELMC_SAMPLING_AGREEMENT',
    fileUrl: '/docs/ArielMC_Sampling_Agreement.pdf',
    fileType: 'PDF',
    fileSize: '1.4 MB',
    version: '2026.1',
    tags: ['SOP', 'Sampling Agreement', 'Specimen Kit', 'SLA', 'Verified'],
    notes: 'Official Service Level Agreement governing specimen kits, counter samples, BOM validations, and escrow protections.',
    isStatutoryRequirement: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-950 border border-[#C9A86A]/40 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Document Header Controls */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#C9A86A]/20 text-[#C9A86A] font-mono text-xs font-bold border border-[#C9A86A]/40">
              SOP-B2B-SMP-2026-V1
            </span>
            <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
              Official Sourcing SOP & Buyer Portal Agreement
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
              title="Print Agreement"
            >
              <Printer className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Share SOP Agreement for Verification & Acknowledgement"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share (Verify / Ack)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="printable-content flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-[#0a1120] text-slate-200 font-['Open_Sans'] text-xs leading-relaxed selection:bg-[#C9A86A]/30">
          {/* Official Letterhead */}
          <div className="border-b border-[#C9A86A]/40 pb-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1F3A2E] border border-[#C9A86A] flex items-center justify-center font-bold font-mono text-xs text-[#C9A86A]">
                AMC
              </div>
              <span className="text-sm font-black tracking-widest text-[#C9A86A] uppercase font-['Montserrat']">
                ARIEL MARKETING & COMMUNICATIONS LIMITED
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Montserrat'] uppercase">
              Standard Operating Procedure (SOP) & Buyer Portal Agreement
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
              <div>
                <strong className="text-slate-300">Code:</strong> SOP-B2B-SMP-2026-V1
              </div>
              <div>
                <strong className="text-slate-300">Markets:</strong> UK, EU, USA, AU
              </div>
              <div>
                <strong className="text-slate-300">Hubs:</strong> Dhaka, Narayanganj, Savar
              </div>
              <div>
                <strong className="text-slate-300">Portals:</strong> arielmc.com | arielmc.co.uk
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#C9A86A] uppercase tracking-wider font-['Montserrat'] flex items-center gap-2">
              <span>1. Purpose & Scope</span>
            </h2>
            <p className="text-slate-300">
              This Standard Operating Procedure (SOP) defines the commercial terms, technical intake requirements, quality standards, and reimbursement mechanics for physical specimen, catalog, and custom pre-production sample development across ArielMC’s premier B2B manufacturing divisions:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
              <li>
                <strong className="text-white">The Golden Fiber Edit:</strong> Jute, jute-cotton, and laminated eco-carriers.
              </li>
              <li>
                <strong className="text-white">The Leather Compendium:</strong> Everyday Carry (EDC), RFID Small Leather Goods (SLGs), and executive bags.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-[#C9A86A] uppercase tracking-wider font-['Montserrat']">
              2. Sourcing & Prototyping Lifecycle (5-Stage Framework)
            </h2>
            <p className="text-slate-300">
              Sample and prototype execution operates strictly under ArielMC's 5-Step Sourcing Workflow:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30">
                <div className="text-[10px] font-mono font-bold text-emerald-400">Step 1 (1–2 Days)</div>
                <div className="font-bold text-white text-xs mt-0.5">Brief & Feasibility</div>
                <p className="text-[11px] text-slate-400 mt-1">Tech pack review, BOM validation, target FOB costing, factory slot allocation.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-[#C8A96A]/30">
                <div className="text-[10px] font-mono font-bold text-[#C8A96A]">Step 2 (1–4 Weeks)</div>
                <div className="font-bold text-white text-xs mt-0.5">Sampling & Prototyping</div>
                <p className="text-[11px] text-slate-400 mt-1">Raw material lab dips, pattern adjustments/CNC cutting, hardware sourcing, specimen creation.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30">
                <div className="text-[10px] font-mono font-bold text-amber-400">Step 3 (2–4 Weeks)</div>
                <div className="font-bold text-white text-xs mt-0.5">Ethical Production</div>
                <p className="text-[11px] text-slate-400 mt-1">Bulk cutting and assembly across vetted, socially compliant manufacturing units in Narayanganj and Savar.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30">
                <div className="text-[10px] font-mono font-bold text-emerald-400">Step 4 (1–2 Weeks)</div>
                <div className="font-bold text-white text-xs mt-0.5">In-Line & AQL Inspection</div>
                <p className="text-[11px] text-slate-400 mt-1">Strict inspection under AQL 1.5 Major / 2.5 Minor, dynamic 15 kg load testing, carton labeling checks.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30">
                <div className="text-[10px] font-mono font-bold text-cyan-400">Step 5 (3–5 Days)</div>
                <div className="font-bold text-white text-xs mt-0.5">Logistics & Customs</div>
                <p className="text-[11px] text-slate-400 mt-1">Bill of Lading (BL), GSP Form A / Certificate of Origin, phytosanitary clearance, and forwarder handover.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-[#C9A86A] uppercase tracking-wider font-['Montserrat']">
              3. Sampling Request Classification & Fee Structure
            </h2>
            <p className="text-slate-300">
              ArielMC manages three distinct sampling tiers to protect R&D tooling resources while providing rapid evaluation for qualified enterprise accounts:
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-xs">Tier A: Ready Catalog Showroom Samples (Off-the-Shelf)</h3>
                  <span className="font-mono text-[10px] text-[#C8A96A] bg-[#C8A96A]/15 px-2 py-0.5 rounded border border-[#C8A96A]/30">CATALOG</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  <strong>Scope:</strong> Standard SKUs from current product roadmaps without structural modifications (e.g., JD-EDC-16 Market Tote, LD-EDC-1 Slim RFID Bifold).
                </p>
                <p className="text-slate-300 text-[11px]">
                  <strong>Sample Fee:</strong> Invoiced at nominal unit wholesale price (or complimentary up to 2 units for verified corporate accounts).
                </p>
                <p className="text-slate-300 text-[11px]">
                  <strong>Freight:</strong> Paid by buyer or charged to buyer’s corporate courier account (DHL / FedEx / UPS).
                </p>
                <p className="text-emerald-400 text-[11px]">
                  <strong>Bulk Adjustment:</strong> 100% of the sample fee is credited against the balance invoice of the subsequent bulk Purchase Order (PO). Freight charges remain non-refundable.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-[#C9A86A]/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#C9A86A] text-xs">Tier B: Custom OEM Prototypes & Pre-Production Samples (Tech-Pack Driven)</h3>
                  <span className="font-mono text-[10px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">CUSTOM OEM</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  <strong>Scope:</strong> Custom designs, bespoke dimensions, buyer-specified GSM/tannage, custom Pantone lab dips, and personalized debossed/foil/screen branding.
                </p>
                <p className="text-slate-300 text-[11px]">
                  <strong>Sample Development Fee:</strong> Fixed fee as outlined in Section 5 (covers pattern engineering, material matching, machine calibration, and QA signoff).
                </p>
                <div className="text-slate-300 text-[11px] space-y-0.5 pl-2 border-l border-slate-700">
                  <div>• Blind Debossing / Hot Foil Brass Die: $35.00 – $65.00 (depending on surface area).</div>
                  <div>• Screen Print Stencil / Screen Frame: $25.00 per colorway.</div>
                  <div>• Custom Hardware Die / Mold (Buckles, Pullers): Quoted per technical drawing.</div>
                </div>
                <div className="text-emerald-400 text-[11px] pt-1">
                  <strong>Bulk Adjustment & Reimbursement Terms:</strong> 100% of the Sample Development Fee is credited against the final bulk production invoice upon placement of a Purchase Order meeting the Qualifying Order Threshold (Section 4). Custom Branding Dies and Molds are NOT refunded; dies remain the exclusive intellectual and physical property of the buyer, maintained free of charge by ArielMC in Dhaka for repeat orders.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-xs">Tier C: Corporate Specimen Kits (Strategic Outbound Account Sampling)</h3>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">PROSPECTING</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  <strong>Standard Policy:</strong> Specimen presentation boxes are invoiced at a flat administrative fee of $50.00 USD (inclusive of specimen merchandise and door-to-door express courier dispatch), OR dispatched freight-collect using the Buyer's corporate DHL/FedEx account.
                </p>
                <p className="text-emerald-400 text-[11px]">
                  <strong>Bulk Order Rebate:</strong> 100% of this fee is credited directly against the Buyer's final bulk production invoice upon placement of a Purchase Order meeting baseline MOQ.
                </p>
                <p className="text-slate-400 text-[11px]">
                  <strong>Complimentary Discretion:</strong> Complimentary kits remain strictly reserved for pre-qualified enterprise accounts following completion of a formal Stage 4 commercial feasibility call.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-[#C9A86A] uppercase tracking-wider font-['Montserrat']">
              4. Commercial Credit & Reimbursement Rules
            </h2>
            <p className="text-slate-300">
              To maintain gross margins across our Narayanganj and Savar facilities, financial adjustments are governed by the following criteria:
            </p>

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                    <th className="py-2.5 px-4">Parameter</th>
                    <th className="py-2.5 px-4">Commercial Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-2 px-4 font-semibold text-white">Qualifying Volume (Jute Line)</td>
                    <td className="py-2 px-4 font-mono text-emerald-400">Purchase Order (PO) ≥ 1,000 units per style/colorway</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold text-white">Qualifying Volume (Leather)</td>
                    <td className="py-2 px-4 font-mono text-emerald-400">Purchase Order (PO) ≥ 300 units (Bags) / 500 pcs (SLGs)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold text-white">Minimum PO Value</td>
                    <td className="py-2 px-4 font-mono">≥ $3,000 USD (or £2,500 GBP / €2,800 EUR)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold text-white">Credit Allocation</td>
                    <td className="py-2 px-4 text-[#C9A86A] font-semibold">100% of Development Fee applied to Final Balance (BL)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold text-white">Tooling & Freight Policy</td>
                    <td className="py-2 px-4 text-amber-400">Express Courier & Metal Dies strictly non-creditable</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-semibold text-white">Claim Validity</td>
                    <td className="py-2 px-4 font-mono">90 Calendar Days from sample dispatch date</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 pt-1">
              <p>
                <strong>I. Order Deduction Mechanism:</strong> Approved sample credits are deducted from the final 50% balance invoice settled against the Bill of Lading (BL) copy. Credits are never deducted from the initial 50% advance production deposit.
              </p>
              <p>
                <strong>II. Split & Partial Orders:</strong> If an initial bulk order is between 50% and 99% of standard MOQ, a pro-rata credit of 50% of the sample development fee will apply.
              </p>
              <p>
                <strong>III. Expiration:</strong> Sample fees not converted into a confirmed commercial Purchase Order within 90 days are recognized as completed R&D services and are non-refundable.
              </p>
            </div>
          </section>

          {/* Section 5 Matrix Summary */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-[#C9A86A] uppercase tracking-wider font-['Montserrat']">
              5. Standardized Sample Pricing Matrix Summary
            </h2>
            <p className="text-slate-300">
              All prices in USD ($). Excludes destination import customs clearance and VAT/duties. Covers standard pattern engineering, raw material matching, machine calibration, and QA signoff:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-white text-xs block font-['Montserrat']">
                  5.1 The Golden Fiber Edit (Jute & Cotton)
                </span>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between"><span>JD-EDC-16 Market Tote:</span> <strong className="font-mono text-white">$45 (MOQ 1,000)</strong></div>
                  <div className="flex justify-between"><span>JD-EDC-17 Commuter Tote:</span> <strong className="font-mono text-white">$55 (MOQ 1,000)</strong></div>
                  <div className="flex justify-between"><span>JD-EDC-18 Beach Shopper:</span> <strong className="font-mono text-white">$50 (MOQ 1,000)</strong></div>
                  <div className="flex justify-between"><span>JD-EDC-19 Duffle Pouch:</span> <strong className="font-mono text-white">$50 (MOQ 1,000)</strong></div>
                  <div className="flex justify-between"><span>JD-PKG-29 Wine Carrier:</span> <strong className="font-mono text-white">$40 (MOQ 1,500)</strong></div>
                  <div className="flex justify-between"><span>JD-PKG-31 Swag Carrier:</span> <strong className="font-mono text-white">$35 (MOQ 2,000)</strong></div>
                  <div className="flex justify-between"><span>JD-MLD-20 Storage Basket:</span> <strong className="font-mono text-white">$60 (MOQ 500)</strong></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-white text-xs block font-['Montserrat']">
                  5.2 The Leather Compendium (Everyday Carry)
                </span>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between"><span>LD-EDC-1 RFID Bifold Wallet:</span> <strong className="font-mono text-white">$65 (MOQ 500)</strong></div>
                  <div className="flex justify-between"><span>LD-EDC-2 Front Cardholder:</span> <strong className="font-mono text-white">$50 (MOQ 500)</strong></div>
                  <div className="flex justify-between"><span>LD-TNW-7 Padded Folio:</span> <strong className="font-mono text-white">$95 (MOQ 300)</strong></div>
                  <div className="flex justify-between"><span>LD-TNW-9 Document Portfolio:</span> <strong className="font-mono text-white">$85 (MOQ 300)</strong></div>
                  <div className="flex justify-between"><span>LD-TNV-10 Passport Wallet:</span> <strong className="font-mono text-white">$55 (MOQ 500)</strong></div>
                  <div className="flex justify-between"><span>LD-SCB-5 Laptop Commuter Tote:</span> <strong className="font-mono text-white">$125 (MOQ 250)</strong></div>
                  <div className="flex justify-between"><span>LD-BLM-16 Bloom Satchel:</span> <strong className="font-mono text-white">$140 (MOQ 300)</strong></div>
                  <div className="flex justify-between"><span>LD-WAA-13 Bridle Formal Belt:</span> <strong className="font-mono text-white">$60 (MOQ 500)</strong></div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 & 7 */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-[#C9A86A] uppercase tracking-wider font-['Montserrat']">
              6. International Shipping & Customs Declaration
            </h2>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <p>
                <strong>Courier:</strong> All outbound sample parcels consigned via DHL Express or FedEx International Priority directly from Dhaka (DAC). Net pass-through freight: UK/EU $38–$48; USA/Canada $42–$55; Australia/NZ $48–$60.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-500/30 font-mono text-[11px] text-amber-300">
                Customs Waybill Labelling Mandate: "Commercial Mutilated Prototype Samples – No Commercial Value – Value for Customs Purposes Only: $10.00 USD"
              </div>
              <p className="text-[11px] text-slate-400">
                Prevents clearance delays and excessive import VAT/tariffs at UK and EU ports of entry.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-[#C9A86A] uppercase tracking-wider font-['Montserrat']">
              7. Regulatory & Quality Compliance Signoff
            </h2>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
              <p>Every sample dispatched is accompanied by a Pre-Shipment Quality Inspection Dossier (QA-DOC):</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-[11px]">
                <li><strong className="text-white">Chemical Safety & REACH:</strong> Non-detectable Chromium VI (&lt; 3 mg/kg), dimethyl fumarate (DMFu &lt; 0.1 mg/kg), and AZO-free dyestuffs under UK REACH Annex XVII and EU Regulation (EC) 1907/2006.</li>
                <li><strong className="text-white">Textile & Food Contact:</strong> Jute conforms to UK/EU fiber composition split disclosures (e.g. 60% Jute / 40% Cotton), utilizing hydrocarbon-free vegetable batching oil.</li>
                <li><strong className="text-white">Structural Tolerances:</strong> Dynamic 15 kg pull-and-drop test clearance; leather seam-fatigue and hardware salt-spray resistance.</li>
              </ul>
            </div>
          </section>

          {/* Section 8 & Signature Block */}
          <section className="space-y-4 pt-4 border-t border-[#C9A86A]/40">
            <h2 className="text-sm font-bold text-[#C9A86A] uppercase tracking-wider font-['Montserrat']">
              8. Buyer Acceptance & Agreement Execution
            </h2>
            <div className="space-y-2 text-xs text-slate-300">
              <p>By submitting a digital Sample Request through the ArielMC Buyer Portal (arielmc.com/portal/samples or arielmc.co.uk/portal), the Buyer confirms understanding and acceptance of these Terms:</p>
              <div className="space-y-1 pl-3 text-[11px] text-slate-400 font-mono">
                <div>I. Samples are fabricated solely for commercial evaluation, fit, and pre-production approval.</div>
                <div>II. Development costs are creditable only against qualifying bulk production orders and exclude express freight pass-through costs.</div>
                <div>III. ArielMC requires written approval (or digital portal sign-off) of the physical sample before issuing the 50% advance production invoice and initiating mass factory scheduling.</div>
              </div>
            </div>

            {/* Interactive Acceptance Simulation */}
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sop-accept"
                  checked={buyerSigned}
                  onChange={(e) => setBuyerSigned(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 border-slate-700 bg-slate-950"
                />
                <label htmlFor="sop-accept" className="text-xs font-semibold text-white cursor-pointer select-none">
                  Digital Buyer Acceptance: I have read, understood, and accept all terms of SOP-B2B-SMP-2026-V1.
                </label>
              </div>

              {buyerSigned && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-0.5">Buyer Signatory Name</label>
                    <input
                      type="text"
                      value={signedName}
                      onChange={(e) => setSignedName(e.target.value)}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-0.5">Procurement Organization</label>
                    <input
                      type="text"
                      value={signedCompany}
                      onChange={(e) => setSignedCompany(e.target.value)}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Official Execution Stamp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase">Authorized by ArielMC:</div>
                <div className="font-bold text-white">Trade Operations & Export Management Division</div>
                <div className="text-[#C9A86A]">Ariel Marketing & Communications Limited</div>
                <div className="text-[10px] text-slate-400">Dhaka Hub • London Liaison Office</div>
                <div className="text-[10px] text-emerald-400 pt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Digitally Verified & Validated for 2026/2027</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase">Buyer Portal Execution:</div>
                <div className="font-bold text-white">{signedName}</div>
                <div className="text-slate-300">{signedCompany}</div>
                <div className="text-[10px] text-slate-400">Status: {buyerSigned ? 'Digitally Signed & Confirmed' : 'Pending Client Acceptance'}</div>
                <div className="text-[10px] text-slate-400">Date: {new Date().toISOString().split('T')[0]}</div>
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            ArielMC ERP System • Secure B2B Export Governance
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#C9A86A] hover:bg-[#B08D4D] text-[#1F3A2E] font-bold text-xs font-['Montserrat'] transition-all shadow-md"
          >
            Close & Return to Dashboard
          </button>
        </div>
      </div>

      {/* Share Document Modal */}
      <ShareDocumentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        document={sopDoc}
      />
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
  theme?: ThemeProfile;
}

const CreateSdoModal: React.FC<CreateSdoModalProps> = ({
  isOpen,
  onClose,
  onAddSample,
  factories,
  products,
  crmLeads,
  theme = 'crm-green',
}) => {
  const isRoyal = theme === 'royal-blue';
  const isHeritage = theme === 'heritage-tan';

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
  const [referencePictureUrl, setReferencePictureUrl] = useState('/images/techpacks/blm-ref-photo.png');
  const [originHub, setOriginHub] = useState('Dhaka / Narayanganj / Savar');
  const [targetDeviceOrFit, setTargetDeviceOrFit] = useState('Up to 15.6" Laptop / 16" MacBook Pro');

  const handleSectorChange = (newSector: ProductSector) => {
    setSector(newSector);
    if (newSector === 'JUTE') {
      setReferencePictureUrl('/images/techpacks/jct-ref-photo.png');
      setOriginHub('Dhaka / Narayanganj Textile & Jute Cluster');
      setTargetDeviceOrFit('A4 Folios & 15" Laptops / Commuter Goods');
      setPrimaryMaterial('Heavyweight Jute-Cotton blend fabric (320-350 GSM)');
      setDimensions('16"W x 12"H x 6"D (40.6 x 30.5 x 15.2 cm)');
      setColorway('Natural Beige / Navy / Crimson');
    } else if (newSector === 'LEATHER') {
      setReferencePictureUrl('/images/techpacks/blm-ref-photo.png');
      setOriginHub('Dhaka / Narayanganj / Savar Tannery Cluster');
      setTargetDeviceOrFit('Up to 15.6" Laptop / 16" MacBook Pro');
      setPrimaryMaterial('12-14 oz Heavyweight Cotton Denim & 1.4-1.6 mm Full-Grain Cowhide');
      setDimensions('16"W x 12"H x 4.75"D (40.5 x 30.5 x 12.0 cm)');
      setColorway('Deep Indigo Navy / Classic Cognac Tan (#A85724)');
    } else if (newSector === 'TEXTILE') {
      setReferencePictureUrl('/images/techpacks/jct-ref-photo.png');
      setOriginHub('Narayanganj & Gazipur Knit/Weave Cluster');
      setTargetDeviceOrFit('Standard Queen / Double Bedding & Living');
      setPrimaryMaterial('300 TC 100% Organic Combed Cotton Sateen');
      setDimensions('230 cm x 220 cm (Duvet) + 50x75 cm (Pillow)');
      setColorway('Crisp Optical White / Slate Grey');
    } else if (newSector === 'CERAMICS') {
      setReferencePictureUrl('/images/techpacks/blm-ref-photo.png');
      setOriginHub('Mirpur / Gazipur Ceramic Ware Cluster');
      setTargetDeviceOrFit('Commercial Tableware / Vitrified Stoneware');
      setPrimaryMaterial('High-grade vitrified stoneware body (1280°C firing)');
      setDimensions('Dia: 27.0 cm x H: 2.6 cm (Coupe)');
      setColorway('Reactive Matte Mineral Glaze / Slate');
    } else {
      setReferencePictureUrl('/images/techpacks/blm-ref-photo.png');
      setOriginHub('Dhamrai / Savar Traditional Pottery Cluster');
      setTargetDeviceOrFit('Thermodynamic Evaporative Cooling / Earthen Accents');
      setPrimaryMaterial('100% Non-Toxic Indigenous Earthen Clay / Terracotta');
      setDimensions('Dia: 16.0 cm x H: 24.0 cm');
      setColorway('Natural Raw Terracotta / Smoked Charcoal');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedFactory = factories.find((f) => f.id === factoryId) || factories[0];
    const newId = `sdo-${Date.now()}`;
    const sdoNumber = `SDO-2026-${sector.substring(0, 3)}-${Math.floor(100 + Math.random() * 900)}`;

    const generatedTechPack = buildStandardFactoryTechPack({
      modelName: styleName || 'Custom Client Design',
      styleCode: styleCode || `AM-${sector.substring(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      sector,
      referencePictureUrl: referencePictureUrl || (sector === 'JUTE' ? '/images/techpacks/jct-ref-photo.png' : '/images/techpacks/blm-ref-photo.png'),
      targetDeviceOrFit,
      originHub: originHub || 'Dhaka / Narayanganj / Savar Export Cluster',
      factoryName: selectedFactory?.name,
      factoryLocation: selectedFactory ? `${selectedFactory.cluster}, Bangladesh` : undefined,
    });

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
      standardTechPack: generatedTechPack,
    };

    onAddSample(newSample);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="create-sdo-modal"
        className={`w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto transition-colors ${
          isRoyal
            ? 'bg-[#0B132B] border border-slate-700/80 text-slate-100'
            : isHeritage
            ? 'bg-[#1C160C] border border-[#8A6D3B]/60 text-[#F5EEDC]'
            : 'bg-[#12231B] border border-[#2C5240] text-white'
        }`}
      >
        <div className={`flex items-center justify-between pb-4 border-b ${
          isRoyal
            ? 'border-slate-800 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A]'
            : isHeritage
            ? 'border-[#8A6D3B]/60 bg-gradient-to-r from-[#261E10] via-[#332815] to-[#261E10]'
            : 'border-[#2C5240] bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#162B22]'
        } -mx-6 -mt-6 p-6 mb-2 rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isRoyal
                ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                : isHeritage
                ? 'bg-[#C8A96A]/20 border border-[#C8A96A]/40 text-[#C8A96A]'
                : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
            }`}>
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading tracking-wide">
                Create Sample Development Order (SDO)
              </h2>
              <p className={`text-[11px] ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4AF37]/70' : 'text-[#CFE0D5]'}`}>
                Phase 3 Prototyping & Technical Dossier
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block mb-1 font-semibold ${isRoyal ? 'text-slate-300' : isHeritage ? 'text-[#FAF6EE]' : 'text-[#CFE0D5]'}`}>
                Product Sector
              </label>
              <select
                value={sector}
                onChange={(e) => handleSectorChange(e.target.value as any)}
                className={`w-full p-2.5 rounded-lg text-white transition-colors focus:outline-none ${
                  isRoyal
                    ? 'bg-[#070D1F] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : isHeritage
                    ? 'bg-[#120E08] border border-[#8A6D3B]/60 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                    : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                }`}
              >
                <option value="LEATHER">💼 Leather Goods</option>
                <option value="JUTE">🛍️ Jute Products & Bags</option>
                <option value="TEXTILE">🧵 Apparel & Home Textiles</option>
                <option value="CERAMICS">🍽️ Ceramics & Tableware</option>
                <option value="POTTERY">🏺 Pottery & Terracotta</option>
              </select>
            </div>

            <div>
              <label className={`block mb-1 font-semibold ${isRoyal ? 'text-slate-300' : isHeritage ? 'text-[#FAF6EE]' : 'text-[#CFE0D5]'}`}>
                Sample Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className={`w-full p-2.5 rounded-lg text-white transition-colors focus:outline-none ${
                  isRoyal
                    ? 'bg-[#070D1F] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : isHeritage
                    ? 'bg-[#120E08] border border-[#8A6D3B]/60 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                    : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                }`}
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
              <label className={`block mb-1 font-semibold ${isRoyal ? 'text-slate-300' : isHeritage ? 'text-[#FAF6EE]' : 'text-[#CFE0D5]'}`}>
                Style Name / Description
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Full-Grain Duffle Bag"
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                className={`w-full p-2.5 rounded-lg text-white transition-colors focus:outline-none ${
                  isRoyal
                    ? 'bg-[#070D1F] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : isHeritage
                    ? 'bg-[#120E08] border border-[#8A6D3B]/60 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                    : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                }`}
              />
            </div>
            <div>
              <label className={`block mb-1 font-semibold ${isRoyal ? 'text-slate-300' : isHeritage ? 'text-[#FAF6EE]' : 'text-[#CFE0D5]'}`}>
                Style Code
              </label>
              <input
                type="text"
                placeholder="e.g. AM-LTH-009"
                value={styleCode}
                onChange={(e) => setStyleCode(e.target.value)}
                className={`w-full p-2.5 rounded-lg text-white transition-colors focus:outline-none ${
                  isRoyal
                    ? 'bg-[#070D1F] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : isHeritage
                    ? 'bg-[#120E08] border border-[#8A6D3B]/60 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                    : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block mb-1 font-semibold ${isRoyal ? 'text-slate-300' : isHeritage ? 'text-[#FAF6EE]' : 'text-[#CFE0D5]'}`}>
                Buyer / Client Company
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Harrods, Zara Home, Pottery Barn"
                value={buyerCompany}
                onChange={(e) => setBuyerCompany(e.target.value)}
                className={`w-full p-2.5 rounded-lg text-white transition-colors focus:outline-none ${
                  isRoyal
                    ? 'bg-[#070D1F] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : isHeritage
                    ? 'bg-[#120E08] border border-[#8A6D3B]/60 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                    : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                }`}
              />
            </div>

            <div>
              <label className={`block mb-1 font-semibold ${isRoyal ? 'text-slate-300' : isHeritage ? 'text-[#FAF6EE]' : 'text-[#CFE0D5]'}`}>
                Target Market Zone
              </label>
              <select
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value as any)}
                className={`w-full p-2.5 rounded-lg text-white transition-colors focus:outline-none ${
                  isRoyal
                    ? 'bg-[#070D1F] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : isHeritage
                    ? 'bg-[#120E08] border border-[#8A6D3B]/60 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                    : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                }`}
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
              <label className={`block mb-1 font-semibold ${isRoyal ? 'text-slate-300' : isHeritage ? 'text-[#FAF6EE]' : 'text-[#CFE0D5]'}`}>
                Partner Factory (Bangladesh)
              </label>
              <select
                value={factoryId}
                onChange={(e) => setFactoryId(e.target.value)}
                className={`w-full p-2.5 rounded-lg text-white transition-colors focus:outline-none ${
                  isRoyal
                    ? 'bg-[#070D1F] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : isHeritage
                    ? 'bg-[#120E08] border border-[#8A6D3B]/60 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                    : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                }`}
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
              <label className={`block mb-1 font-semibold ${isRoyal ? 'text-slate-300' : isHeritage ? 'text-[#FAF6EE]' : 'text-[#CFE0D5]'}`}>
                Target Sample Delivery Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className={`w-full p-2.5 rounded-lg text-white transition-colors focus:outline-none ${
                  isRoyal
                    ? 'bg-[#070D1F] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : isHeritage
                    ? 'bg-[#120E08] border border-[#8A6D3B]/60 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                    : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                }`}
              />
            </div>
          </div>

          {/* Standard Factory Tech Pack Configuration & Reference Picture */}
          <div className={`p-4 rounded-xl space-y-3 ${
            isRoyal
              ? 'bg-[#070D1F]/90 border border-slate-700'
              : isHeritage
              ? 'bg-[#140F09] border border-[#8A6D3B]/60'
              : 'bg-[#0E1A14] border border-[#2C5240]'
          }`}>
            <div className={`text-[11px] uppercase font-mono font-bold tracking-wider flex items-center justify-between ${
              isRoyal ? 'text-blue-400' : isHeritage ? 'text-[#C8A96A]' : 'text-[#C8A96A]'
            }`}>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Standard Factory Tech-Pack Dossier</span>
              </div>
              <span className="text-[10px] text-slate-400 font-normal">Auto-built with photo upon submit</span>
            </div>

            {/* Reference Picture Selection & Thumbnail */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-black/30 border border-white/5">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 border border-white/10 shrink-0 relative flex items-center justify-center">
                {referencePictureUrl ? (
                  <img
                    src={referencePictureUrl}
                    alt="Reference"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Package className="w-6 h-6 text-slate-500" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={`block text-[10px] font-semibold ${isRoyal ? 'text-slate-300' : isHeritage ? 'text-[#FAF6EE]' : 'text-[#CFE0D5]'}`}>
                    Tech-Pack Reference Picture URL
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setReferencePictureUrl('/images/techpacks/jct-ref-photo.png')}
                      className="px-2 py-0.5 rounded text-[10px] bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 transition-colors"
                    >
                      🛍️ JCT Tote
                    </button>
                    <button
                      type="button"
                      onClick={() => setReferencePictureUrl('/images/techpacks/blm-ref-photo.png')}
                      className="px-2 py-0.5 rounded text-[10px] bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 transition-colors"
                    >
                      💼 Bloom Tote
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={referencePictureUrl}
                  onChange={(e) => setReferencePictureUrl(e.target.value)}
                  placeholder="/images/techpacks/jct-ref-photo.png"
                  className={`w-full p-1.5 rounded text-xs text-white focus:outline-none font-mono text-[11px] ${
                    isRoyal
                      ? 'bg-[#0B132B] border border-slate-700 focus:border-blue-500'
                      : isHeritage
                      ? 'bg-[#1C160C] border border-[#8A6D3B]/60 focus:border-[#C8A96A]'
                      : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A]'
                  }`}
                />
              </div>
            </div>

            {/* Origin Hub & Target Fit */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={`block text-[10px] mb-0.5 ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4AF37]/80' : 'text-[#CFE0D5]'}`}>
                  Origin Production Hub
                </label>
                <input
                  type="text"
                  value={originHub}
                  onChange={(e) => setOriginHub(e.target.value)}
                  placeholder="e.g. Dhaka / Narayanganj Textile Cluster"
                  className={`w-full p-2 rounded text-xs text-white focus:outline-none ${
                    isRoyal
                      ? 'bg-[#0B132B] border border-slate-700 focus:border-blue-500'
                      : isHeritage
                      ? 'bg-[#1C160C] border border-[#8A6D3B]/60 focus:border-[#C8A96A]'
                      : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A]'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-[10px] mb-0.5 ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4AF37]/80' : 'text-[#CFE0D5]'}`}>
                  Target Device / Dimension Fit
                </label>
                <input
                  type="text"
                  value={targetDeviceOrFit}
                  onChange={(e) => setTargetDeviceOrFit(e.target.value)}
                  placeholder={'e.g. Up to 15.6" Laptop / A4 Folios'}
                  className={`w-full p-2 rounded text-xs text-white focus:outline-none ${
                    isRoyal
                      ? 'bg-[#0B132B] border border-slate-700 focus:border-blue-500'
                      : isHeritage
                      ? 'bg-[#1C160C] border border-[#8A6D3B]/60 focus:border-[#C8A96A]'
                      : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A]'
                  }`}
                />
              </div>
            </div>

            {/* Spec Fields */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className={`block text-[10px] mb-0.5 ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4AF37]/80' : 'text-[#CFE0D5]'}`}>
                  Dimensions
                </label>
                <input
                  type="text"
                  placeholder="e.g. 40x30x10 cm"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className={`w-full p-2 rounded text-xs text-white focus:outline-none ${
                    isRoyal
                      ? 'bg-[#0B132B] border border-slate-700 focus:border-blue-500'
                      : isHeritage
                      ? 'bg-[#1C160C] border border-[#8A6D3B]/60 focus:border-[#C8A96A]'
                      : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A]'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-[10px] mb-0.5 ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4AF37]/80' : 'text-[#CFE0D5]'}`}>
                  Primary Material
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full-Grain Cowhide"
                  value={primaryMaterial}
                  onChange={(e) => setPrimaryMaterial(e.target.value)}
                  className={`w-full p-2 rounded text-xs text-white focus:outline-none ${
                    isRoyal
                      ? 'bg-[#0B132B] border border-slate-700 focus:border-blue-500'
                      : isHeritage
                      ? 'bg-[#1C160C] border border-[#8A6D3B]/60 focus:border-[#C8A96A]'
                      : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A]'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-[10px] mb-0.5 ${isRoyal ? 'text-slate-400' : isHeritage ? 'text-[#D4AF37]/80' : 'text-[#CFE0D5]'}`}>
                  Pantone / Color
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cognac Saddle"
                  value={colorway}
                  onChange={(e) => setColorway(e.target.value)}
                  className={`w-full p-2 rounded text-xs text-white focus:outline-none ${
                    isRoyal
                      ? 'bg-[#0B132B] border border-slate-700 focus:border-blue-500'
                      : isHeritage
                      ? 'bg-[#1C160C] border border-[#8A6D3B]/60 focus:border-[#C8A96A]'
                      : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A]'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block mb-1 font-semibold ${isRoyal ? 'text-slate-300' : isHeritage ? 'text-[#FAF6EE]' : 'text-[#CFE0D5]'}`}>
                Express Courier
              </label>
              <select
                value={courierProvider}
                onChange={(e) => setCourierProvider(e.target.value as any)}
                className={`w-full p-2.5 rounded-lg text-white transition-colors focus:outline-none ${
                  isRoyal
                    ? 'bg-[#070D1F] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : isHeritage
                    ? 'bg-[#120E08] border border-[#8A6D3B]/60 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                    : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                }`}
              >
                <option value="DHL Express">DHL Express Priority</option>
                <option value="FedEx Priority">FedEx International Priority</option>
                <option value="Aramex">Aramex Global Express</option>
                <option value="UPS Worldwide">UPS Worldwide Express</option>
              </select>
            </div>
            <div>
              <label className={`block mb-1 font-semibold ${isRoyal ? 'text-slate-300' : isHeritage ? 'text-[#FAF6EE]' : 'text-[#CFE0D5]'}`}>
                Development Cost ($USD)
              </label>
              <input
                type="number"
                value={costUsd}
                onChange={(e) => setCostUsd(Number(e.target.value))}
                className={`w-full p-2.5 rounded-lg text-white transition-colors focus:outline-none ${
                  isRoyal
                    ? 'bg-[#070D1F] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : isHeritage
                    ? 'bg-[#120E08] border border-[#8A6D3B]/60 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                    : 'bg-[#0A140F] border border-[#2C5240] focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]'
                }`}
              />
            </div>
          </div>

          <div className={`pt-3 border-t flex items-center justify-end gap-3 ${
            isRoyal ? 'border-slate-800' : isHeritage ? 'border-[#8A6D3B]/50' : 'border-[#2C5240]'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isRoyal
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : isHeritage
                  ? 'bg-[#261E10] hover:bg-[#332815] text-[#F5EEDC] border border-[#8A6D3B]/50'
                  : 'bg-[#1F3A2E]/50 hover:bg-[#1F3A2E] text-slate-300 border border-[#2C5240]'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-lg text-white font-bold transition-all shadow-lg flex items-center gap-2 ${
                isRoyal
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                  : isHeritage
                  ? 'bg-[#8A6D3B] hover:bg-[#9E7D43] shadow-[#8A6D3B]/30'
                  : 'bg-gradient-to-r from-[#1E6B3A] to-[#14512C] hover:from-[#258247] hover:to-[#1a6637] shadow-emerald-950/50 border border-emerald-500/40'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-[#C8A96A]" />
              <span>Issue SDO & Dispatch Tech Pack</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
